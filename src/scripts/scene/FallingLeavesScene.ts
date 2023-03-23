import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { SplitQuadsGeometry } from "../engine/geometry/SplitQuadsGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { FallingLeavesMaterial } from "../engine/program/fallingLeaves/FallingLeavesMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Quaternion } from "../math/Quaternion";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

const QUAD_NUMBER = 4;

class FallingLeavesScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<FallingLeavesMaterial>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 0.001 * MathUtil.deg2rad, 1);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);

    const canvas = document.createElement('canvas');
    const side = 64;
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (context) {
      const halfSide = side / 2;
      context.fillStyle = 'white';
      context.moveTo(0, 0);
      context.lineTo(halfSide, 0);
      context.arc(halfSide, halfSide, halfSide, -MathUtil.halfPi, 0.0);
      context.lineTo(side, halfSide * 3 / 2);
      context.lineTo(halfSide * 3 / 2, halfSide * 3 / 2);
      context.lineTo(side, side);
      context.lineTo(halfSide, side);
      context.arc(halfSide, halfSide, halfSide, MathUtil.halfPi, Math.PI);
      context.lineTo(0, 0);
      context.fill();
    }
    document.body.appendChild(canvas);

    const transform = Transform.identity();
    const geometry = SplitQuadsGeometry.create(QUAD_NUMBER, ['position', 'uv', 'vertexIndex']);
    const material = new FallingLeavesMaterial(canvas, Quaternion.identity());
    this.object3D = new Object3D(transform, geometry, material);
  }

  setup(): void {
    
  }

  private updateVertices(): void {
    const geometry = this.object3D.geometry;
    const ratio = 1.0;
    for (let index = 0; index < QUAD_NUMBER; index++) {
      const x = ratio * (Math.random() - 0.5);
      const y = ratio * (Math.random() - 0.5);
      const z = ratio * (Math.random() - 0.5);
      for (let vertexIndex = 0; vertexIndex < 4; vertexIndex++) {
        const i = index * 20 + vertexIndex * 5;
        geometry.setVerticesValue(x, i + 0);
        geometry.setVerticesValue(y, i + 1);
        geometry.setVerticesValue(z, i + 2);
      }
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.fallingLeaves;
    gl.useProgram(program.glProgram.program);
    
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

    // this.updateVertices();
    this.object3D.material.rotation.rotateX(0.001 * Math.PI);
    this.object3D.material.rotation.rotateY(0.002 * Math.PI);
    this.object3D.material.rotation.rotateZ(0.003 * Math.PI);

    program.draw(this.object3D);

    gl.flush();
  }

  teardown(): void {
    
  }
}

export {FallingLeavesScene};
