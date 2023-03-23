import { mat4 } from "gl-matrix";
import { Program } from "../../Program";
import { GLCamera } from "../../common/GLCamera";
import { GLProgram } from "../../common/GLProgram";
import { Object3D } from "../../Object3D";
import { FallingLeavesMaterial } from "./FallingLeavesMaterial";

const vertexShaderSource = `#version 300 es
in vec3 position;
in vec2 uv;
in float vertexIndex;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform mat4 rotation;

out vec2 passUv;

void main() {
  passUv = uv;

  int localIndex = int(round(vertexIndex)) % 4;
  float x = localIndex % 2 == 0 ? 0.0 : 1.0;
  float y = localIndex <= 1 ? 0.0 : 1.0;
  
  vec3 offset = (rotation * vec4(0.1 * uv, 0.0, 0.0)).xyz;
  gl_Position = projection * view * (model * vec4(position, 1.0) + vec4(offset, 0.0));
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec2 passUv;

uniform sampler2D tex;

out vec4 fragmentColor;

void main() {
  vec4 color = vec4(0.0, 0.5, 0.0, 1.0);
  fragmentColor = texture(tex, passUv) * color;
}
`;

class FallingLeavesProgram implements Program {
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
  ): FallingLeavesProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'FallingLeavesProgram');
    if (!glProgram) {
      console.error('[ERROR] FallingLeavesProgram.create() could not create GLProgram');
      return undefined;
    }

    const glCamera = GLCamera.create(gl, glProgram.program);
    if (!glCamera) {
      console.error('[ERROR] FallingLeavesProgram.create() could not create GLCamera');
      return undefined;
    }

    return new FallingLeavesProgram(gl, glProgram, glCamera);
  }

  updateCamera(viewMatrix: mat4, projectionMatrix: mat4): void {
    const gl = this.gl;
    const program = this.glProgram.program;
    gl.useProgram(program);

    this.glCamera.update(gl, viewMatrix, projectionMatrix);
  }

  draw(object3D: Object3D<FallingLeavesMaterial>): void {
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
    gl.disable(gl.CULL_FACE);

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
  }
}

export {FallingLeavesProgram};
