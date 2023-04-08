import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { CubeGeometry } from "../engine/geometry/CubeGeometry";
import { SphereGeometry } from "../engine/geometry/SphereGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { SingleColorMaterial } from "../engine/program/singleColor/SingleColorMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Color } from "../model/Color";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class MainMenuScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private radian: number;
  private radius: number;

  private buildingObject: Object3D<SingleColorMaterial>;
  private cubeObjectList: Object3D<SingleColorMaterial>[];
  private sphereObject: Object3D<SingleColorMaterial>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 10);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 40);

    this.radian = 0;
    this.radius = 5;

    const material = new SingleColorMaterial(Color.red());
    const cubeGeometry = CubeGeometry.create(1.0, ['position', 'normal']);
    const cubeNumber = 10;
    this.cubeObjectList = [];
    for (let index = 0; index < cubeNumber; index++) {
      const radian = 2.0 * Math.PI * index / cubeNumber;
      const x = this.radius * Math.cos(radian);
      const y = this.radius * Math.sin(radian);
      const position = new Vector3(x, y, 0.0);
      const transform = new Transform(position, Quaternion.identity(), Vector3.ones());
      const object3D = new Object3D(transform, cubeGeometry, material);
      this.cubeObjectList.push(object3D);
    }

    const sphereGeometry = SphereGeometry.create(1.0, 64, ['position', 'normal']);
    const transform = Transform.identity();
    transform.scale.multiply(3.0);
    this.sphereObject = new Object3D(transform, sphereGeometry, material);
  }

  setup(): void {
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const singleColorProgram = ProgramMap.singleColorProgram;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    singleColorProgram.updateCamera(viewMatrix, projectionMatrix);

    this.updateTransform(labStatus);

    for (const object3D of this.cubeObjectList) {
      singleColorProgram.draw(object3D);
    }
    singleColorProgram.draw(this.sphereObject);
  }

  updateTransform(labStatus: LabStatus): void {
    this.radian += 0.1 * MathUtil.deg2rad;

    const cubeNumber = this.cubeObjectList.length;
    for (let index = 0; index < cubeNumber; index++) {
      const radian = this.radian + 2.0 * Math.PI * index / cubeNumber;
      const x = this.radius * Math.cos(radian);
      const y = this.radius * Math.sin(radian);
      const z = 0.5 * Math.sin(radian * 2);
      const object3D = this.cubeObjectList[index];
      object3D.transform.position.setValues(x, y, z);
      object3D.transform.rotation.rotateX(0.001);
      object3D.transform.rotation.rotateY(0.002);
      object3D.transform.rotation.rotateZ(0.003);
    }

    this.sphereObject.transform.rotation.rotateX(0.001);
    this.sphereObject.transform.rotation.rotateY(0.001);
    this.sphereObject.transform.rotation.rotateZ(0.001);
  }

  teardown(): void {
  }
}

export {MainMenuScene};
