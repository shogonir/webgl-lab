import { Vector3 } from "../../../math/Vector3";
import { Material } from "../../Material";
import { GLFramebuffer } from "../../common/GLFramebuffer";
import { GLUniformFloat3 } from "../../common/uniform/GLUniformFloat3";

class SeaSurfaceMaterial implements Material {
  readonly glFramebuffer: GLFramebuffer;
  readonly eyePosition: Vector3;

  private glEyePosition: GLUniformFloat3 | undefined;

  constructor(
    glFramebuffer: GLFramebuffer,
    eyePosition: Vector3
  ) {
    this.glFramebuffer = glFramebuffer;
    this.eyePosition = eyePosition;
  }

  isDrawable(): boolean {
    return this.glEyePosition !== undefined;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    if (this.isDrawable()) {
      return;
    }

    // const {x, y, z} = this.eyePosition;
    // const glEyePosition = GLUniformFloat3.create(gl, program, 'eyePosition', x, y, z);
    // if (!glEyePosition) {
    //   console.error('[ERROR] SeaSurfaceMaterial.prepare() could not create GLUniform');
    //   return;
    // }

    // this.glEyePosition = glEyePosition;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.glEyePosition) {
      return;
    }

    this.glFramebuffer.bind(gl);

    // this.glEyePosition.setVector3(this.eyePosition);
    // this.glEyePosition.uniform(gl);
  }
}

export {SeaSurfaceMaterial};
