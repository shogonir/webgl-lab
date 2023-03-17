import { mat4 } from "gl-matrix";
import { GLCamera } from "../../common/GLCamera";
import { GLProgram } from "../../common/GLProgram";
import { Object3D } from "../../Object3D";
import { Program } from "../../Program";
import { SingleColorMaterial } from "./SingleColorMaterial";

const vertexShaderSource = `#version 300 es

in vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform vec4 color;

void main() {
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec4 vColor;

uniform vec4 color;

out vec4 fragmentColor;

void main() {
  fragmentColor = color;
}
`;

class SingleColorProgram implements Program {
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
  ): SingleColorProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'SingleColorProgram');
    if (!glProgram) {
      console.error('[ERROR] SingleColorProgram.create() could not create GLProgram');
      return undefined;
    }

    const glCamera = GLCamera.create(gl, glProgram.program);
    if (!glCamera) {
      console.error('[ERROR] SingleColorProgram.create() could not create GLCamera');
      return undefined;
    }

    return new SingleColorProgram(gl, glProgram, glCamera);
  }

  setup(): void {
    const gl = this.gl;
    const program: WebGLProgram = this.glProgram.program;
    gl.useProgram(program);
  }

  updateCamera(viewMatrix: mat4, projectionMatrix: mat4): void {
    const gl = this.gl;
    const program = this.glProgram.program;
    gl.useProgram(program);

    this.glCamera.update(gl, viewMatrix, projectionMatrix);
  }

  draw(object3D: Object3D<SingleColorMaterial>): void {
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

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
  }
}

export {SingleColorProgram};
