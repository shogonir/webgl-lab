import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { SphereGeometry } from "../engine/geometry/SphereGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { PbrBaseMaterial } from "../engine/program/pbrBase/PbrBaseMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Color } from "../model/Color";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

class PbrBaseSpheresScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  private spheres: Object3D<PbrBaseMaterial>[];

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 1.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);

    this.spheres = [];
    for (const metallic of [0.1, 0.5, 0.9]) {
      for (const roughness of [0.1, 0.3, 0.5, 0.7, 0.9]) {
        const transform = Transform.identity();
        const coef = 0.75;
        transform.position.setValues(coef * (roughness - 0.5), coef * (metallic - 0.5), 0.0);
        const scale = 0.05;
        transform.scale.setValues(scale, scale, scale);
        const geometry = SphereGeometry.create(1.0, 64, ['position', 'normal']);
        const material = new PbrBaseMaterial(metallic, roughness, Color.white());
        const sphere = new Object3D(transform, geometry, material);
        this.spheres.push(sphere);
      }
    }
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.pbrBase;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    program.updateCamera(viewMatrix, projectionMatrix);
  
    for (const sphere of this.spheres) {
      // program.updateCamera(viewMatrix, projectionMatrix);
      program.draw(sphere);
    }
    
    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {PbrBaseSpheresScene};
