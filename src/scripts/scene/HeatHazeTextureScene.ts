import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { HeatHazeMaterial } from "../engine/program/heatHaze/HeatHazeMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

class HeatHazeTextureScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private heatHaze?: Object3D<HeatHazeMaterial>;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 0.0001 * MathUtil.deg2rad, 1);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4);
    this.camera = camera;

    const image = new Image();
    image.onload = () => {
      const transform = Transform.identity();
      const scaleValue = 1.09;
      transform.scale.setValues(scaleValue, scaleValue, scaleValue);
      const geometry = QuadGeometry.create(1.0, ['position', 'uv']);
      const material = new HeatHazeMaterial(image, performance.now());
      this.heatHaze = new Object3D(transform, geometry, material);
    };
    image.src = require("../../assets/img/shogonir.jpg");

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.heatHaze;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);

    if (this.heatHaze) {
      this.heatHaze.material.time = performance.now();
      program.draw(this.heatHaze);
    }

    gl.flush();
  }
}

export {HeatHazeTextureScene};
