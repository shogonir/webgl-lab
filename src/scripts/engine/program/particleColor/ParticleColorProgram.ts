import { mat4 } from "gl-matrix";
import { GLCamera } from "../../common/GLCamera";
import { GLProgram } from "../../common/GLProgram";
import { Program } from "../../Program";
import { Object3D } from "../../Object3D";
import { ParticleColorMaterial } from "./ParticleColorMaterial";

const vertexShaderSource = `#version 300 es
in vec3 position;
in vec4 color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec4 passColor;

void main() {
  vec4 position = projection * view * model * vec4(position, 1.0);
  float z = position.z / position.w;

  float minZ = 0.7;
  float maxZ = 0.9;
  float normalizedZ = (clamp(z, minZ, maxZ) - minZ) / (maxZ - minZ);
  float colorRatio = clamp(1.0 - normalizedZ, 0.0, 1.0);
  passColor = vec4(color.rgb * colorRatio, 1.0);

  gl_Position = position;

  gl_PointSize = (z + 1.0) / 0.5;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 passColor;

out vec4 fragmentColor;

void main() {
  fragmentColor = passColor;
}
`;

class ParticleColorProgram implements Program {
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

  static create(
    gl: WebGL2RenderingContext
  ): ParticleColorProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'ParticleColorProgram');
    if (!glProgram) {
      console.error('[ERROR] ParticleColorProgram.create() could not create GLProgram');
      return undefined;
    }

    const glCamera = GLCamera.create(gl, glProgram.program);
    if (!glCamera) {
      console.error('[ERROR] ParticleColorProgram.create() could not create GLCamera');
      return undefined;
    }

    return new ParticleColorProgram(gl, glProgram, glCamera);
  }

  updateCamera(viewMatrix: mat4, projectionMatrix: mat4): void {
    const gl = this.gl;
    const program = this.glProgram.program;
    gl.useProgram(program);

    this.glCamera.update(gl, viewMatrix, projectionMatrix);
  }

  draw(object3D: Object3D<ParticleColorMaterial>): void {
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

    const length = geometry.getVerticesLength() / 7;

    gl.enable(gl.DEPTH_TEST);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);

    gl.drawArrays(gl.POINTS, 0, length);
  }
}

export {ParticleColorProgram};

