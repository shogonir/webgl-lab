import { GLAttribute } from "./GLAttribute";
import { GLBuffer } from "./GLBuffer";
import { GLIndexBuffer } from "./GLIndexBuffer";

class GLGeometry {
  readonly vertexBuffer: GLBuffer;
  readonly indexBuffer: GLIndexBuffer;

  private constructor(
    vertexBuffer: GLBuffer,
    indexBuffer: GLIndexBuffer
  ) {
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
  }

  static create(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    vertices: number[],
    indices: number[]
  ): GLGeometry | undefined {
    const positionAttribute = GLAttribute.create(gl, program, false, 0, 3, 'position');
    if (!positionAttribute) {
      console.error('[ERRPR] GLGeometry.create() could not create GLAttribute');
      return undefined;
    }

    const vertexBuffer = GLBuffer.create(gl, vertices, 3, [positionAttribute]);
    if (!vertexBuffer) {
      console.error('[ERROR] GLGeometry.create() could not create GLBuffer');
      return undefined;
    }

    const indexBuffer = GLIndexBuffer.create(gl, indices);
    if (!indexBuffer) {
      console.error('[ERROR] GLGeometry.create() could not create GLIndexBuffer');
      return undefined;
    }

    return new GLGeometry(vertexBuffer, indexBuffer);
  }

  bind(gl: WebGL2RenderingContext): void {
    this.vertexBuffer.bind(gl);
    this.indexBuffer.bind(gl);
  }
}

export {GLGeometry};
