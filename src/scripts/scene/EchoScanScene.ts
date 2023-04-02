import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { EchoScanMaterial } from "../engine/program/echoScan/EchoScanMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class EchoScanScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<EchoScanMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-60 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 1.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);

    const transform = Transform.identity();
    const geometry = PlaneGeometry.create(1.0, 100, ['position']);
    const material = new EchoScanMaterial(0.0);
    this.object3D = new Object3D(transform, geometry, material);

    this.startTime = performance.now();
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.echoScan;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.object3D.material.time = performance.now() - this.startTime;
    
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
    
  }
}

export {EchoScanScene};
