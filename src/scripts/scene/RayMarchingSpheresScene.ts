import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { RayMarchingSpheresMaterial } from "../engine/program/rayMarchingSpheres/RayMarchingSpheresMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class RayMarchingSpheresScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;
  
  private object3D: Object3D<RayMarchingSpheresMaterial>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 0.001 * MathUtil.deg2rad, 1);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);

    const transform = Transform.identity();
    const geometry = QuadGeometry.create(1.0, ['position', 'uv']);
    const material = new RayMarchingSpheresMaterial();
    this.object3D = new Object3D(transform, geometry, material);
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.rayMarchingSpheres;
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    const apsect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.aspect = apsect;
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    program.updateCamera(viewMatrix, projectionMatrix);

    this.object3D.transform.scale.setValues(2.0, 2.0, 1.0);

    program.draw(this.object3D);

    gl.flush();
  }

  teardown(): void {
    
  }
}

export {RayMarchingSpheresScene};
