import { Material } from "../../Material";

class ParticleColorMaterial implements Material {
  
  constructor() {

  }

  isDrawable(): boolean {
    return true;
  }

  prepare(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    
  }

  bind(gl: WebGL2RenderingContext): void {
    
  }
}

export {ParticleColorMaterial};
