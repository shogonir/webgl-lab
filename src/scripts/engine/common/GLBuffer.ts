import { GLAttribute } from "./GLAttribute";

class GLBuffer {
  readonly buffer: WebGLBuffer;
  readonly typedArray: Float32Array;
  readonly stride: number;
  readonly attributes: GLAttribute[];

  private constructor(
    buffer: WebGLBuffer,
    typedArray: Float32Array,
    stride: number,
    attribudes: GLAttribute[]
  ) {
    this.buffer = buffer;
    this.typedArray = typedArray;
    this.stride = stride;
    this.attributes = attribudes;
  }
  
  static create(
    gl: WebGL2RenderingContext,
    array: number[],
    stride: number,
    attributes: GLAttribute[]
  ): GLBuffer | undefined {
    const buffer = gl.createBuffer();
    if (!buffer) {
      console.error('[ERROR] GLBuffer.create() could not create buffer');
      return undefined;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const typedArray = new Float32Array(array);
    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);

    const strideBytes = attributes.length === 1 ? 0 : stride * Float32Array.BYTES_PER_ELEMENT;
    for (const a of attributes) {
      const offsetBytes = a.offset * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(a.location);
      gl.vertexAttribPointer(a.location, a.size, gl.FLOAT, a.normalized, strideBytes, offsetBytes);
    }

    return new GLBuffer(buffer, typedArray, stride, attributes);
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  }
}

export {GLBuffer};
