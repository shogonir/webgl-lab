import { Vector2 } from "../../../math/Vector2";
import { GLAttribute } from "../../common/GLAttribute";
import { GLBuffer } from "../../common/GLBuffer";
import { GLTexture } from "../../common/GLTexture";
import { GLUniformFloat2 } from "../../common/uniform/GLUniformFloat2";
import { Material } from "../../Material";

class TextureMaterial implements Material {
  readonly image: TexImageSource;
  readonly uv: number[];
  readonly offset: Vector2;

  private glTexture: GLTexture | undefined;
  private uvBuffer: GLBuffer | undefined;
  private offsetUniform: GLUniformFloat2 | undefined;
  
  constructor(image: TexImageSource, uv: number[], offset: Vector2) {
    this.image = image;
    this.uv = uv;
    this.offset = offset;
  }

  isDrawable(): boolean {
    return this.uvBuffer !== undefined &&
      this.glTexture !== undefined &&
      this.offsetUniform !== undefined;
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

    const o = this.offset;
    const offsetUniform = GLUniformFloat2.create(gl, program, 'offset', o.x, o.y);
    if (!offsetUniform) {
      console.error('[ERROR] TextureMaterial.prepare() could not create GLUniform');
      return;
    }

    this.glTexture = glTexture;
    this.uvBuffer = uvBuffer;
    this.offsetUniform = offsetUniform;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.glTexture || !this.uvBuffer || !this.offsetUniform) {
      return;
    }

    this.glTexture.bind(gl);

    this.uvBuffer.bind(gl);

    if (!this.offsetUniform.equalsVector2(this.offset)) {
      this.offsetUniform.setVector2(this.offset);
    }
    this.offsetUniform.uniform(gl);
  }
}

export {TextureMaterial};
