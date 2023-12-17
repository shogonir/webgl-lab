import { mat4 } from "gl-matrix";
import { Program } from "../../Program";
import { GLCamera } from "../../common/GLCamera";
import { GLProgram } from "../../common/GLProgram";
import { Object3D } from "../../Object3D";
import { HeatHazeMaterial } from "./HeatHazeMaterial";

const vertexShaderSource = `#version 300 es
in vec3 position;
in vec2 uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 passUv;

void main() {
  passUv = uv;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
#define M_PI 3.14159265358979323846
precision mediump float;

in vec2 passUv;

uniform sampler2D image;
uniform float time;

out vec4 fragmentColor;

vec4 _permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 _taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 _fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
vec3 _fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
vec4 gln_rand4(vec4 p) { return mod(((p * 34.0) + 1.0) * p, 289.0); }

float gln_perlin(vec3 P) {
  vec3 Pi0 = floor(P);        // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);        // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = _permute(_permute(ix) + iy);
  vec4 ixy0 = _permute(ixy + iz0);
  vec4 ixy1 = _permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = _taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = _taylorInvSqrt(
      vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = _fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

void main() {
  float uvScale = 5.0;
  float timeScale = 5.0;

  vec3 pointX = vec3(
    passUv.x * uvScale + timeScale * time / 1000.0,
    passUv.y * uvScale + timeScale * time / 2000.0,
    time / 4000.0
  );
  float noiseX = gln_perlin(pointX) / 10.0;

  vec3 pointY = vec3(
    passUv.x * uvScale + timeScale * time / 2000.0,
    passUv.y * uvScale + timeScale * time / 1000.0,
    time / 4000.0
  );
  float noiseY = gln_perlin(pointY) / 10.0;

  fragmentColor = texture(image, passUv + vec2(noiseX, noiseY));
}
`;

class HeatHazeProgram implements Program {
  readonly gl: WebGL2RenderingContext;
  readonly glProgram: GLProgram;
  readonly glCamera: GLCamera;

  private constructor(
    gl: WebGL2RenderingContext,
    glProgram: GLProgram,
    glCamera: GLCamera
  ) {
    this.gl = gl;
    this.glProgram = glProgram;
    this.glCamera = glCamera;
  }

  static create (
    gl: WebGL2RenderingContext
  ): HeatHazeProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'HeatHazeProgram');
    if (!glProgram) {
      console.error('[ERROR] HeatHazeProgram.create() could not create GLProgram');
      return undefined;
    }

    const glCamera = GLCamera.create(gl, glProgram.program);
    if (!glCamera) {
      console.error('[ERROR] HeatHazeProgram.create() could not create GLCamera');
      return undefined;
    }

    return new HeatHazeProgram(gl, glProgram, glCamera);
  }

  updateCamera(viewMatrix: mat4, projectionMatrix: mat4): void {
    const gl = this.gl;
    const program = this.glProgram.program;
    gl.useProgram(program);

    this.glCamera.update(gl, viewMatrix, projectionMatrix);
  }

  draw(object3D: Object3D<HeatHazeMaterial>): void {
    const gl = this.gl;
    const program = this.glProgram.program;

    gl.useProgram(program);

    const geometry = object3D.geometry;
    if (!geometry.isDrawable()) {
      geometry.prepare(gl, program);
    }
    geometry.bind(gl);

    const transform = object3D.transform;
    if (!transform.isDrawable()) {
      transform.prepare(gl, program);
    }
    transform.update();
    transform.bind(gl);

    gl.useProgram(program);
    const material = object3D.material;
    if (!material.isDrawable()) {
      material.prepare(gl, program);
    }
    material.bind(gl);

    gl.enable(gl.DEPTH_TEST);

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
  }
}

export {HeatHazeProgram};
