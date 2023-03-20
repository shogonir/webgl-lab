import { LabStatus } from "../model/LabStatus";
import { DemoListScene } from "../scene/DemoListScene";
import { MainMenuScene } from "../scene/MainMenuScene";
import { PerlinWaveScene } from "../scene/PerlinWaveScene";
import { RayMarchingSpheresScene } from "../scene/RayMarchingSpheresScene";
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
      new RayMarchingSpheresScene(labStatus),
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
        this.sceneIndex += index === length - 1 ? 0 : 1;
        return;
      }
      if (event.key === 'ArrowLeft') {
        this.sceneIndex -= index === 0 ? 0 : 1;
        return;
      }
    });
    
    updateFunction();
  }
}

export {ScenePlayer};
