import { GLBuffer } from "./common/GLBuffer";
import { GLGeometry } from "./common/GLGeometry";
import { GLIndexBuffer } from "./common/GLIndexBuffer";

class Geometry {
  private vertices: number[];
  private indices: number[];

  private glGeometry?: GLGeometry;

  constructor(vertices: number[], indices: number[]) {
    this.vertices = vertices;
    this.indices = indices;
  }

  getIndicesLength(): number {
    return this.indices.length;
  }

  isDrawable(): boolean {
    return this.glGeometry ? true : false;
  }

  prepare(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): void {
    if (this.isDrawable()) {
      return;
    }

    const glGeometry= GLGeometry.create(gl, program, this.vertices, this.indices);
    if (!glGeometry) {
      console.error('[ERROR] Geometry.prepare() could not create GLGeometry');
      return;
    }

    this.glGeometry = glGeometry;
  }

  bind(gl: WebGL2RenderingContext): void {
    this.glGeometry?.bind(gl);
  }
}

export {Geometry};
