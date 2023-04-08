import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { TextureMaterial } from "../engine/program/texture/TextureMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Vector3 } from "../math/Vector3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class TextureMappingScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<TextureMaterial>;
  private logo?: Object3D<TextureMaterial>;

  private objectMove: Vector3;
  private logoMove: Vector3;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 1 * MathUtil.deg2rad, 2);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4);
    this.camera = camera;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#dddddd';
      context.fillRect(0, 0, 300, 150);

      context.fillStyle = '#000000';
      context.fillRect(0, 100, 300, 2);
      
      context.font = '50px consolas';
      context.fillText('webgl-lab', 24, 70);

      context.font = '27px consolas';
      context.fillText('created by shogonir', 8, 132);
    }

    const transform = Transform.identity();
    transform.position.x = -0.8;
    transform.rotation.rotateY(-30 * MathUtil.deg2rad);
    transform.scale.x = 2.0;
    const geometry = QuadGeometry.create(1.0, ['position', 'uv']);
    const material = new TextureMaterial(canvas);
    this.object3D = new Object3D(transform, geometry, material);

    const image = new Image();
    image.onload = () => {
      const transform = Transform.identity();
      transform.position.x = 0.8;
      transform.rotation.rotateY(30 * MathUtil.deg2rad);
      const material = new TextureMaterial(image);
      this.logo = new Object3D(transform, geometry, material);
    };
    image.src = require("../../assets/img/shogonir.jpg");

    this.objectMove = Vector3.zero();
    this.logoMove = Vector3.zero();
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const textureProgram = ProgramMap.textureProgram;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    textureProgram.updateCamera(viewMatrix, projectionMatrix);

    const ratio = 0.00005;
    const min = -0.05;
    const max = 0.05;
    this.objectMove.addValues(
      ratio * (Math.random() - 0.5),
      ratio * (Math.random() - 0.5),
      ratio * (Math.random() - 0.5)
    );
    this.logoMove.setValues(
      ratio * (Math.random() - 0.5),
      ratio * (Math.random() - 0.5),
      ratio * (Math.random() - 0.5)
    );

    this.object3D.transform.position.setValues(
      MathUtil.clamp(this.object3D.transform.position.x + this.objectMove.x, -0.8 + min, -0.8 + max),
      MathUtil.clamp(this.object3D.transform.position.y + this.objectMove.y, min, max),
      MathUtil.clamp(this.object3D.transform.position.z + this.objectMove.z, min, max)
    );
    textureProgram.draw(this.object3D);

    if (this.logo) {
      this.logo.transform.position.setValues(
        MathUtil.clamp(this.logo.transform.position.x + this.logoMove.x, 0.8 + min, 0.8 + max),
        MathUtil.clamp(this.logo.transform.position.y + this.logoMove.y, min, max),
        MathUtil.clamp(this.logo.transform.position.z + this.logoMove.z, min, max)
      );
      textureProgram.draw(this.logo);
    }

    gl.flush();
  }

  teardown(): void {
    
  }
}

export {TextureMappingScene};
