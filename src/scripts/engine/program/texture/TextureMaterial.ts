import { GLAttribute } from "../../common/GLAttribute";
import { GLBuffer } from "../../common/GLBuffer";
import { GLTexture } from "../../common/GLTexture";
import { Material } from "../../Material";

class TextureMaterial implements Material {
  readonly image: TexImageSource;
  readonly uv: number[];

  private glTexture: GLTexture | undefined;
  private uvBuffer: GLBuffer | undefined;
  
  constructor(image: TexImageSource, uv: number[]) {
    this.image = image;
    this.uv = uv;
  }

  isDrawable(): boolean {
    return this.uvBuffer !== undefined && this.glTexture !== undefined;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    if (this.isDrawable()) {
      return;
    }

    const glTexture = GLTexture.create(gl, this.image);
    if (!glTexture) {
      console.error('[ERROR] TextureMaterial.prepare() could not create GLTexture');
      return;
    }

    const attribute = GLAttribute.create(gl, program, false, 0, 2, 'uv');
    if (!attribute) {
      console.error('[ERROR] TextureMaterial.prepare() could not create GLAttribute');
      return;
    }
    const uvBuffer = GLBuffer.create(gl, this.uv, 2, [attribute]);
    if (!uvBuffer) {
      console.error('[ERROR] TextureMaterial.prepare() could not create GLBuffer');
      return;
    }

    this.glTexture = glTexture;
    this.uvBuffer = uvBuffer;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.glTexture || !this.uvBuffer) {
      return;
    }

    this.glTexture.bind(gl);
    this.uvBuffer.bind(gl);
  }
}

export {TextureMaterial};
