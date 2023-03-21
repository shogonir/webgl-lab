import { LabStatus } from "../model/LabStatus";
import { DemoListScene } from "../scene/DemoListScene";
import { MainMenuScene } from "../scene/MainMenuScene";
import { MandelbrotSetScene } from "../scene/MandelbrotSetScene";
import { PerlinWaveScene } from "../scene/PerlinWaveScene";
import { Scene } from "../scene/Scene";
import { TextureMappingScene } from "../scene/TextureMappingScene";

class ScenePlayer {
  private labStatus: LabStatus;
  private sceneList: Scene[];
  private sceneIndex: number;

  constructor(labStatus: LabStatus) {
    this.labStatus = labStatus;
    this.sceneList = [
      new TextureMappingScene(labStatus),
      new MainMenuScene(labStatus),
      new DemoListScene(labStatus),
      new PerlinWaveScene(labStatus),
      new MandelbrotSetScene(labStatus),
    ];
    this.sceneIndex = 0;

    const updateFunction = () => {
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
