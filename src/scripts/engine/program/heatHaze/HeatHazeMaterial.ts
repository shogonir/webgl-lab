import { Material } from "../../Material";
import { GLTexture } from "../../common/GLTexture";
import { GLUniformFloat1 } from "../../common/uniform/GLUniformFloat1";

class HeatHazeMaterial implements Material {
  readonly image: TexImageSource;
  public time: number;

  private glImage: GLTexture | undefined;
  private glTime: GLUniformFloat1 | undefined;

  constructor(image: TexImageSource, time: number) {
    this.image = image;
    this.time = time;
  }

  isDrawable(): boolean {
    return this.glImage !== undefined &&
      this.glTime !== undefined;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    if (this.isDrawable()) {
      return;
    }

    const glImage = GLTexture.create(gl, program, 'image', 0, this.image);
    const glTime = GLUniformFloat1.create(gl, program, 'time', this.time);
    
    if (
      glImage === undefined ||
      glTime === undefined
    ) {
      console.error('[ERROR] HeatHazeMaterial.prepare() could not create GLUniform');
      return;
    }

    this.glImage = glImage;
    this.glTime = glTime;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (
      this.glImage === undefined ||
      this.glTime === undefined
    ) {
      return;
    }

    this.glTime.setValue(this.time);

    this.glImage.bind(gl);
    this.glTime.uniform(gl);
  }
}

export {HeatHazeMaterial};
