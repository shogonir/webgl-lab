import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { ParticleWarpMaterial } from "../engine/program/particleWarp/ParticleWarpMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

class ParticleWarpScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D?: Object3D<ParticleWarpMaterial>;

  private startTime: number;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 90 * MathUtil.deg2rad, 1.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4.0);
    this.camera = camera;

    const geometry = PlaneGeometry.create(1.0, 256, ['position', 'uv']);

    const image = new Image();
    image.onload = () => {
      const transform = Transform.identity();
      transform.position.addValues(0.0, 1.0, 0.0);
      transform.rotation.rotateX(-90 * MathUtil.deg2rad);
      const material = new ParticleWarpMaterial(image, 0.0);
      this.object3D = new Object3D(transform, geometry, material);
    }
    image.src = require("../../assets/img/shogonir.jpg");

    this.startTime = performance.now();

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.particleWarp;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);

    if (this.object3D) {
      this.object3D.material.time = performance.now() - this.startTime;
      program.draw(this.object3D);
    }

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {ParticleWarpScene};
