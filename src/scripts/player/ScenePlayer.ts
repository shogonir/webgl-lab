import { LabStatus } from "../model/LabStatus";
import { DemoListScene } from "../scene/DemoListScene";
import { Scene } from "../scene/Scene";

class ScenePlayer {
  private labStatus: LabStatus;
  private scene?: Scene;

  constructor(labStatus: LabStatus) {
    this.labStatus = labStatus;
    this.scene = new DemoListScene(labStatus);

    const updateFunction = () => {
      this.scene?.update(this.labStatus);
      requestAnimationFrame(updateFunction);
    }
    
    updateFunction();
  }
}

export {ScenePlayer};
