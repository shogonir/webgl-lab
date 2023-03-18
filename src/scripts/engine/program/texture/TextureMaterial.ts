import { GLAttribute } from "../../common/GLAttribute";
import { GLTexture } from "../../common/GLTexture";
import { Material } from "../../Material";

class TextureMaterial implements Material {
  readonly image: TexImageSource;

  private glTexture: GLTexture | undefined;
  
  constructor(image: TexImageSource) {
    this.image = image;
  }

  isDrawable(): boolean {
    return this.glTexture !== undefined;
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

    this.glTexture = glTexture;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.glTexture) {
      return;
    }

    this.glTexture.bind(gl);
  }
}

export {TextureMaterial};
