import { LabStatus } from "../model/LabStatus";
import { DefaultRenderTarget } from "../model/RenderTarget";
import { CubeMappingScene } from "../scene/CubeMappingScene";
import { DemoListScene } from "../scene/DemoListScene";
import { EchoScanScene } from "../scene/EchoScanScene";
import { FallingLeavesScene } from "../scene/FallingLeavesScene";
import { MainMenuScene } from "../scene/MainMenuScene";
import { MandelbrotSetScene } from "../scene/MandelbrotSetScene";
import { MultiTextureScene } from "../scene/MultiTextureScene";
import { ParticleWarpScene } from "../scene/ParticleWarpScene";
import { PerlinWaveScene } from "../scene/PerlinWaveScene";
import { ProjectorScreenScene } from "../scene/ProjectorScreenScene";
import { Scene } from "../scene/Scene";
import { TextureMappingScene } from "../scene/TextureMappingScene";

class ScenePlayer {
  static defaultRenderTarget: DefaultRenderTarget;

  private labStatus: LabStatus;
  private sceneList: Scene[];
  private sceneIndex: number;

  constructor(labStatus: LabStatus) {
    ScenePlayer.defaultRenderTarget = {
      type: 'default',
      clientSize: {
        width: labStatus.clientSize.getWidth(),
        height: labStatus.clientSize.getHeight(),
      },
    };

    this.labStatus = labStatus;
    this.sceneList = [
      new TextureMappingScene(labStatus),
      new MainMenuScene(labStatus),
      new DemoListScene(labStatus),
      new PerlinWaveScene(labStatus),
      new MandelbrotSetScene(labStatus),
      new FallingLeavesScene(labStatus),
      new ParticleWarpScene(labStatus),
      new EchoScanScene(labStatus),
      new ProjectorScreenScene(labStatus),
      new CubeMappingScene(labStatus),
      new MultiTextureScene(labStatus),
    ];
    this.sceneIndex = 0;
    this.sceneList[this.sceneIndex].setup();

    const updateFunction = () => {
      const width = this.labStatus.clientSize.getWidth();
      const height = this.labStatus.clientSize.getHeight();
      ScenePlayer.defaultRenderTarget.clientSize.width = width;
      ScenePlayer.defaultRenderTarget.clientSize.height = height;

      const scene = this.sceneList[this.sceneIndex];
      scene.update(this.labStatus);
      requestAnimationFrame(updateFunction);
    }

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const index = this.sceneIndex;
      const length = this.sceneList.length;
      if (event.key === 'ArrowRight') {
        if (index === length - 1) {
          return;
        }
        this.sceneList[this.sceneIndex].teardown();
        this.sceneIndex += 1;
        this.sceneList[this.sceneIndex].setup();
        return;
      }
      if (event.key === 'ArrowLeft') {
        if (index === 0) {
          return;
        }
        this.sceneList[this.sceneIndex].teardown();
        this.sceneIndex -= 1;
        this.sceneList[this.sceneIndex].setup();
        return;
      }
    });
    
    updateFunction();
  }
}

export {ScenePlayer};
