import { EchoScanProgram } from "./echoScan/EchoScanProgram";
import { FallingLeavesProgram } from "./fallingLeaves/FallingLeavesProgram";
import { ParticleWarpProgram } from "./particleWarp/ParticleWarpProgram";
import { PerlineWaveProgram } from "./perlinWave/PerlinWaveProgram";
import { MandelbrotSetProgram } from "./rayMarchingSpheres/MandelbrotSetProgram";
import { SingleColorProgram } from "./singleColor/SingleColorProgram";
import { TextureProgram } from "./texture/TextureProgram";

class ProgramMap {
  private static _singleColorProgram: SingleColorProgram;
  private static _textureProgram: TextureProgram;
  private static _perlinWaveProgram: PerlineWaveProgram;
  private static _mandelbrotSet: MandelbrotSetProgram;
  private static _fallingLeaves: FallingLeavesProgram;
  private static _particleWarp: ParticleWarpProgram;
  private static _echoScan: EchoScanProgram;
  
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

  static get fallingLeaves(): FallingLeavesProgram {
    return ProgramMap._fallingLeaves;
  }

  static get particleWarp(): ParticleWarpProgram {
    return ProgramMap._particleWarp;
  }

  static get echoScan(): EchoScanProgram {
    return ProgramMap._echoScan;
  }

  static setup(gl: WebGL2RenderingContext): boolean {
    console.log('program map setup() start');
    const startTime = performance.now();

    const singleColorProgram = SingleColorProgram.create(gl);
    const textureProgram = TextureProgram.create(gl);
    const perlinWaveProgram = PerlineWaveProgram.create(gl);
    const rayMarchingSpheres = MandelbrotSetProgram.create(gl);
    const fallingLeaves = FallingLeavesProgram.create(gl);
    const particleWarp = ParticleWarpProgram.create(gl);
    const echoScan = EchoScanProgram.create(gl);

    if (
      !singleColorProgram ||
      !textureProgram ||
      !perlinWaveProgram ||
      !rayMarchingSpheres ||
      !fallingLeaves ||
      !particleWarp ||
      !echoScan
    ) {
      console.error('[ERROR] ProgramMap.setup() could not create Program');
      return false;
    }

    ProgramMap._singleColorProgram = singleColorProgram;
    ProgramMap._textureProgram = textureProgram;
    ProgramMap._perlinWaveProgram = perlinWaveProgram;
    ProgramMap._mandelbrotSet = rayMarchingSpheres;
    ProgramMap._fallingLeaves = fallingLeaves;
    ProgramMap._particleWarp = particleWarp;
    ProgramMap._echoScan = echoScan;

    const passTime = performance.now() - startTime;
    console.log(`shader compile tooks ${Math.round(passTime)} ms`);

    return true;
  }
}

export {ProgramMap};
