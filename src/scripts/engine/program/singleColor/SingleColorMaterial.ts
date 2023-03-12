import { Vector2 } from "../../../math/Vector2";
import { Color } from "../../../model/Color";
import { GLUniformFloat2 } from "../../common/uniform/GLUniformFloat2";
import { GLUniformFloat4 } from "../../common/uniform/GLUniformFloat4";
import { Material } from "../../Material";

class SingleColorMaterial implements Material {
  readonly color: Color;
  readonly offset: Vector2;

  private colorUniform: GLUniformFloat4 | undefined;
  private offsetUniform: GLUniformFloat2 | undefined;

  constructor(color: Color, offset: Vector2) {
    this.color = color;
    this.offset = offset;
  }

  isDrawable(): boolean {
    return this.colorUniform !== undefined && this.offsetUniform !== undefined;
  }

  prepare(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
  ): void {
    if (this.isDrawable()) {
      return;
    }

    const c = this.color;
    const o = this.offset;
    const colorUniform = GLUniformFloat4.create(gl, program, 'color', c.r, c.g, c.b, c.a);
    const offsetUniform = GLUniformFloat2.create(gl, program, 'offset', o.x, o.y);
    if (!colorUniform || !offsetUniform) {
      console.error('[ERROR] SingleColorMaterial.prepare() could not create GLUniform');
      return;
    }

    this.colorUniform = colorUniform;
    this.offsetUniform = offsetUniform;
  }

  bind(gl: WebGL2RenderingContext): void {
    if (!this.colorUniform || !this.offsetUniform) {
      console.log('could not bind');
      return;
    }

    if (!this.colorUniform.equalsColor(this.color)) {
      this.colorUniform.setColor(this.color);
    }
    this.colorUniform.uniform(gl);

    if (!this.offsetUniform.equalsVector2(this.offset)) {
      this.offsetUniform.setVector2(this.offset);
    }
    this.offsetUniform.uniform(gl);
  }
}

export {SingleColorMaterial};
