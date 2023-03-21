import { PerlineWaveProgram } from "./perlinWave/PerlinWaveProgram";
import { MandelbrotSetProgram } from "./rayMarchingSpheres/MandelbrotSetProgram";
import { SingleColorProgram } from "./singleColor/SingleColorProgram";
import { TextureProgram } from "./texture/TextureProgram";

class ProgramMap {
  private static _singleColorProgram: SingleColorProgram;
  private static _textureProgram: TextureProgram;
  private static _perlinWaveProgram: PerlineWaveProgram;
  private static _mandelbrotSet: MandelbrotSetProgram;
  
  static get singleColorProgram(): SingleColorProgram {
    return ProgramMap._singleColorProgram;
  }

  static get textureProgram(): TextureProgram {
    return ProgramMap._textureProgram;
  }

  static get perlinWaveProgram(): PerlineWaveProgram {
    return ProgramMap._perlinWaveProgram;
  }

  static get rayMarchingSpheres(): MandelbrotSetProgram {
    return ProgramMap._mandelbrotSet;
  }

  static setup(gl: WebGL2RenderingContext): boolean {
    console.log('program map setup() start');
    const startTime = performance.now();

    const singleColorProgram = SingleColorProgram.create(gl);
    const textureProgram = TextureProgram.create(gl);
    const perlinWaveProgram = PerlineWaveProgram.create(gl);
    const rayMarchingSpheres = MandelbrotSetProgram.create(gl);

    if (
      !singleColorProgram ||
      !textureProgram ||
      !perlinWaveProgram ||
      !rayMarchingSpheres
    ) {
      console.error('[ERROR] ProgramMap.setup() could not create Program');
      return false;
    }

    ProgramMap._singleColorProgram = singleColorProgram;
    ProgramMap._textureProgram = textureProgram;
    ProgramMap._perlinWaveProgram = perlinWaveProgram;
    ProgramMap._mandelbrotSet = rayMarchingSpheres;

    const passTime = performance.now() - startTime;
    console.log(`shader compile tooks ${Math.round(passTime)} ms`);

    return true;
  }
}

export {ProgramMap};
