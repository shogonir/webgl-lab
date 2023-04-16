import { EchoScanProgram } from "./echoScan/EchoScanProgram";
import { FallingLeavesProgram } from "./fallingLeaves/FallingLeavesProgram";
import { ParticleWarpProgram } from "./particleWarp/ParticleWarpProgram";
import { PerlineWaveProgram } from "./perlinWave/PerlinWaveProgram";
import { MandelbrotSetProgram } from "./mandelbrotSet/MandelbrotSetProgram";
import { SingleColorProgram } from "./singleColor/SingleColorProgram";
import { TextureProgram } from "./texture/TextureProgram";
import { FramebufferProgram } from "./framebuffer/FramebufferProgram";
import { CubeMappingProgram } from "./cubeMapping/CubeMappingProgram";

class ProgramMap {
  private static _singleColorProgram: SingleColorProgram;
  private static _textureProgram: TextureProgram;
  private static _perlinWaveProgram: PerlineWaveProgram;
  private static _mandelbrotSet: MandelbrotSetProgram;
  private static _fallingLeaves: FallingLeavesProgram;
  private static _particleWarp: ParticleWarpProgram;
  private static _echoScan: EchoScanProgram;
  private static _framebuffer: FramebufferProgram;
  private static _cubeMapping: CubeMappingProgram;
  private static _multiTexture: MultiTextureProgram;
  
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

  static get framebuffer(): FramebufferProgram {
    return ProgramMap._framebuffer;
  }

  static get cubeMapping(): CubeMappingProgram {
    return ProgramMap._cubeMapping;
  }

  static get multiTexture(): MultiTextureProgram {
    return ProgramMap._multiTexture;
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
    const framebuffer = FramebufferProgram.create(gl);
    const cubeMapping = CubeMappingProgram.create(gl);
    const multiTexture = MultiTextureProgram.create(gl);

    if (
      !singleColorProgram ||
      !textureProgram ||
      !perlinWaveProgram ||
      !rayMarchingSpheres ||
      !fallingLeaves ||
      !particleWarp ||
      !echoScan ||
      !framebuffer ||
      !cubeMapping ||
      !multiTexture ||
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
    ProgramMap._framebuffer = framebuffer;
    ProgramMap._cubeMapping = cubeMapping;
    ProgramMap._multiTexture = multiTexture;

    const passTime = performance.now() - startTime;
    console.log(`shader compile tooks ${Math.round(passTime)} ms`);

    return true;
  }
}

export {ProgramMap};
