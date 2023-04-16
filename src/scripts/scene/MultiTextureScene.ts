import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { SplitQuadsGeometry } from "../engine/geometry/SplitQuadsGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { MultiTextureMaterial } from "../engine/program/multiTexture/MultiTextureMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

class MultiTextureScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<MultiTextureMaterial>;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 2);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4);
    this.camera = camera;

    const side = 64;
    const halfSide = side / 2;
    const quaterSide = side / 4;
    
    const canvas1 = document.createElement('canvas');
    canvas1.width = side;
    canvas1.height = side;
    const c1 = canvas1.getContext('2d');
    if (c1) {
      c1.fillStyle = 'black';
      c1.fillRect(0, 0, side, side);
      c1.fillStyle = 'red';
      c1.fillRect(quaterSide, quaterSide, halfSide, halfSide);
    }

    const canvas2 = document.createElement('canvas');
    canvas2.width = side;
    canvas2.height = side;
    const c2 = canvas2.getContext('2d');
    if (c2) {
      c2.fillStyle = 'black';
      c2.fillRect(0, 0, side, side);
      c2.fillStyle = 'blue';
      c2.fillRect(quaterSide, quaterSide, halfSide, halfSide);
    }

    const transform = Transform.identity();
    const geometry = SplitQuadsGeometry.create(2, ['position', 'uv', 'vertexIndex']);
    const material = new MultiTextureMaterial(canvas1, canvas2);
    this.object3D = new Object3D(transform, geometry, material);

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.multiTexture;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);

    program.draw(this.object3D);

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {MultiTextureScene};
