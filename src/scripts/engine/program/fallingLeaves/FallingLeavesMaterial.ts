import { Quaternion } from "../../../math/Quaternion";
import { Material } from "../../Material";
import { GLTexture } from "../../common/GLTexture";
import { GLUniformMat4 } from "../../common/uniform/GLUniformMat4";

class FallingLeavesMaterial implements Material {
  readonly image: TexImageSource;
  readonly rotation: Quaternion;

  private glTexture: GLTexture | undefined;
  private glRotation: GLUniformMat4 | undefined;

  constructor(image: TexImageSource, rotation: Quaternion) {
    this.image = image;
    this.rotation = rotation;
  }

  isDrawable(): boolean {
    return this.glTexture !== undefined &&
      this.glRotation !== undefined;
  }

  prepare(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): void {
    if (this.isDrawable()) {
      return;
    }

    const glTexture = GLTexture.create(gl, this.image);
    if (!glTexture) {
      console.error('[ERROR] FallingLeavesMaterial.prepare() could not create GLTexture');
      return;
    }

    const glRotation = GLUniformMat4.create(gl, program, 'rotation', this.rotation.getAsMat4());
    if (!glRotation) {
      console.error('[ERROR] FallingLeavesMaterial.prepare() could not create GLUniform');
      return;
    }

    this.glTexture = glTexture;
    this.glRotation = glRotation;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.glTexture || !this.glRotation) {
      return;
    }

    this.glTexture.bind(gl);

    this.glRotation.setMat4(this.rotation.getAsMat4());
    this.glRotation.uniform(gl);
  }
}

export {FallingLeavesMaterial};
