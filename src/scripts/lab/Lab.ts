import { ProgramMap } from "../engine/program/ProgramMap";
import { LabStatus } from "../model/LabStatus";
import { Size } from "../model/Size";
import { ScenePlayer } from "../player/ScenePlayer";

class Lab {
  readonly labStatus: LabStatus;
  readonly scenePlayer: ScenePlayer;

  private constructor(labStatus: LabStatus) {
    this.labStatus = labStatus;
    this.scenePlayer = new ScenePlayer(labStatus);
  }

  static create(selector: string): Lab | undefined {
    const baseElement = document.querySelector(selector) as HTMLDivElement;
    if (!baseElement) {
      console.warn('[webgl-lab] base element not found. contact to developer');
      return undefined;
    }

    const canvas = document.createElement('canvas');
    canvas.width = baseElement.clientWidth;
    canvas.height = baseElement.clientHeight;
    baseElement.appendChild(canvas);

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.warn('[webgl-lab] no webgl2 context. check your browser');
      return undefined;
    }

    const setup = ProgramMap.setup(gl);
    if (!setup) {
      console.error('[ERROR] ProgramMap.setup() failed');
      return undefined;
    }

    const clientSize = new Size(baseElement.clientWidth, baseElement.clientHeight);
    const labStatus = new LabStatus(baseElement, canvas, gl, clientSize);
    const lab = new Lab(labStatus);

    baseElement.onresize = lab.resize.bind(lab);
    window.onresize = lab.resize.bind(lab);

    return lab;
  }

  setClientSize(width: number, height: number): void {
    this.labStatus.clientSize.setSize(width, height);
    this.labStatus.canvas.width = width;
    this.labStatus.canvas.height = height;
    this.labStatus.gl.viewport(0, 0, width, height);
  }

  resize(): void {
    const width = this.labStatus.baseElement.clientWidth;
    const height = this.labStatus.baseElement.clientHeight;
    this.setClientSize(width, height);
  }
}

export {Lab};
