import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { Geometry } from "../engine/Geometry";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { Object3D } from "../engine/Object3D";
import { ProgramMap } from "../engine/program/ProgramMap";
import { SingleColorMaterial } from "../engine/program/singleColor/SingleColorMaterial";
import { TextureMaterial } from "../engine/program/texture/TextureMaterial";
import { Transform } from "../engine/Transform";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Color } from "../model/Color";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class DemoListScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private degree: number;

  private object1: Object3D<SingleColorMaterial>;
  private object2: Object3D<SingleColorMaterial>;

  private object3: Object3D<TextureMaterial>;
  private object4: Object3D<TextureMaterial>;

  constructor(labStatus: LabStatus) {
    this.degree = 0;
    
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 30 * MathUtil.deg2rad, 1);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);
    this.camera = camera;

    const canvas = document.createElement('canvas');
    const side = 16;
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (context) {
      const halfSide = side / 2;
      context.fillStyle = 'black';
      context.fillRect(0, 0, halfSide, halfSide);
      context.fillStyle = 'red';
      context.fillRect(halfSide, 0, halfSide, halfSide);
      context.fillStyle = 'green';
      context.fillRect(0, halfSide, halfSide, halfSide);
      context.fillStyle = 'blue';
      context.fillRect(halfSide, halfSide, halfSide, halfSide);
    }

    const quadGeometry = QuadGeometry.create(1.0, ['position', 'normal']);
    const uvGeometry = QuadGeometry.create(1.0, ['position', 'uv']);
    
    const transform1 = Transform.identity();
    const material1 = new SingleColorMaterial(Color.magenta());
    this.object1 = new Object3D(transform1, quadGeometry, material1);

    const transform2 = Transform.identity();
    const material2 = new SingleColorMaterial(Color.yellow());
    this.object2 = new Object3D(transform2, quadGeometry, material2);

    const transform3 = Transform.identity();
    const material3 = new TextureMaterial(canvas);
    this.object3 = new Object3D(transform3, uvGeometry, material3);

    const transform4 = Transform.identity();
    const material4 = new TextureMaterial(canvas);
    this.object4 = new Object3D(transform4, uvGeometry, material4);
  }

  setup(): void {
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const singleColorProgram = ProgramMap.singleColorProgram;
    const textureProgram = ProgramMap.textureProgram;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.degree++;
    const radian = this.degree * Math.PI / 180.0;

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    singleColorProgram.updateCamera(viewMatrix, projectionMatrix);
    textureProgram.updateCamera(viewMatrix, projectionMatrix);

    const x1 = 0.5 * Math.cos(radian);
    const y1 = 0.5 * Math.sin(radian);
    this.object3.transform.position.setValues(x1, y1, 0.0);
    textureProgram.draw(this.object3);

    const x3 = 0.5 * Math.cos(radian + (Math.PI * 1 / 2));
    const y3 = 0.5 * Math.sin(radian + (Math.PI * 1 / 2));
    this.object1.transform.position.setValues(x3, y3, 0.1);
    singleColorProgram.draw(this.object1);

    const x2 = 0.5 * Math.cos(radian + Math.PI);
    const y2 = 0.5 * Math.sin(radian + Math.PI);
    this.object4.transform.position.setValues(x2, y2, 0.2);
    textureProgram.draw(this.object4);

    const x4 = 0.5 * Math.cos(radian + (Math.PI * 3 / 2));
    const y4 = 0.5 * Math.sin(radian + (Math.PI * 3 / 2));
    this.object2.transform.position.setValues(x4, y4, 0.3);
    singleColorProgram.draw(this.object2);

    gl.flush();
  }

  teardown(): void {
  }
}

export {DemoListScene};
