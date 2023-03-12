import { GLProgram } from "../../common/GLProgram";
import { Object3D } from "../../Object3D";
import { SingleColorMaterial } from "./SingleColorMaterial";

const vertexShaderSource = `#version 300 es

in vec3 position;

// uniform mat4 model;
// uniform mat4 view;
// uniform mat4 projection;

uniform vec4 color;
uniform vec2 offset;

void main() {
  gl_Position = vec4(position.xy + offset, position.z, 1.0);
  // gl_Position = projection * view * model * vec4(position, 1.0);
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

class SingleColorProgram {
  readonly gl: WebGL2RenderingContext;
  readonly glProgram: GLProgram;

  private constructor(
    gl: WebGL2RenderingContext,
    glProgram: GLProgram
  ) {
    this.gl = gl;
    this.glProgram = glProgram;
  }

  static create(
    gl: WebGL2RenderingContext,
  ): SingleColorProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'SingleColorProgram');
    if (!glProgram) {
      console.error('[ERROR] SingleColorProgram.create() could not create GLProgram');
      return undefined;
    }

    return new SingleColorProgram(gl, glProgram);
  }

  setup(): void {
    const gl = this.gl;
    const program: WebGLProgram = this.glProgram.program;
    gl.useProgram(program);
  }

  draw(object3D: Object3D<SingleColorMaterial>): void {
    const gl = this.gl;
    const program = this.glProgram.program;

    gl.useProgram(program);

    const geometry = object3D.geometry;
    if (!geometry.isDrawable()) {
      geometry.prepare(gl, program);
    }

    const material = object3D.material;
    if (!material.isDrawable()) {
      material.prepare(gl, program);
    }

    geometry.bind(gl);
    material.bind(gl);
    gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
  }
}

export {SingleColorProgram};
