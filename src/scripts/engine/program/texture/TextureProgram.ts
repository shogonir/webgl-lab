import { GLProgram } from "../../common/GLProgram";
import { Object3D } from "../../Object3D";
import { TextureMaterial } from "./TextureMaterial";

const vertexShaderSource = `#version 300 es
in vec3 position;
in vec2 uv;

// uniform mat4 model;
// uniform mat4 view;
// uniform mat4 projection;
uniform vec2 offset;

out vec2 passUv;

void main() {
  passUv = uv;
  gl_Position = vec4(position.xy + offset, position.z, 1.0);
  // gl_Position = projection * view * model * vec4(vertexPosition, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 passUv;

uniform sampler2D tex;

out vec4 fragmentColor;

void main() {
  fragmentColor = texture(tex, passUv);
}`;

class TextureProgram {
  readonly gl: WebGL2RenderingContext;
  readonly glProgram: GLProgram;

  private constructor(
    gl: WebGL2RenderingContext,
    glProgram: GLProgram,
  ) {
    this.gl = gl;
    this.glProgram = glProgram;
  }

  static create (
    gl: WebGL2RenderingContext
  ): TextureProgram | undefined {
    const glProgram = GLProgram.create(gl, vertexShaderSource, fragmentShaderSource, 'TextureProgram');
    if (!glProgram) {
      console.error('[ERROR] TextureProgram.create() could not create GLProgram');
      return undefined;
    }

    return new TextureProgram(gl, glProgram);
  }

  draw(object3D: Object3D<TextureMaterial>): void {
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

export {TextureProgram};