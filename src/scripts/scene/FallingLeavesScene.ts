import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { SplitQuadsGeometry } from "../engine/geometry/SplitQuadsGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { FallingLeavesMaterial } from "../engine/program/fallingLeaves/FallingLeavesMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

const QUAD_NUMBER = 900;

class FallingLeavesScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<FallingLeavesMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 7);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 20);

    const canvas = document.createElement('canvas');
    const side = 64;
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (context) {
      const halfSide = side / 2;
      context.fillStyle = 'black';
      context.fillRect(0, 0, side, side);
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
    const material = new FallingLeavesMaterial(canvas, 0.0);
    this.object3D = new Object3D(transform, geometry, material);

    this.startTime = performance.now();
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.fallingLeaves;
    gl.useProgram(program.glProgram.program);
    
    gl.clearColor(0.6274, 0.8471, 0.9373, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    const apsect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.aspect = apsect;
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    program.updateCamera(viewMatrix, projectionMatrix);

    this.object3D.material.rotation1.rotateX(0.001 * Math.PI);
    this.object3D.material.rotation1.rotateY(0.002 * Math.PI);
    this.object3D.material.rotation1.rotateZ(0.003 * Math.PI);

    this.object3D.material.rotation2.rotateX(-0.001 * Math.PI);
    this.object3D.material.rotation2.rotateY(-0.002 * Math.PI);
    this.object3D.material.rotation2.rotateZ(-0.003 * Math.PI);

    this.object3D.material.rotation3.rotateX(-0.002 * Math.PI);
    this.object3D.material.rotation3.rotateY(-0.001 * Math.PI);
    this.object3D.material.rotation3.rotateZ(-0.003 * Math.PI);

    this.object3D.material.rotation4.rotateX(0.003 * Math.PI);
    this.object3D.material.rotation4.rotateY(0.002 * Math.PI);
    this.object3D.material.rotation4.rotateZ(0.001 * Math.PI);

    this.object3D.material.time = (performance.now() - this.startTime) / 1000.0;

    program.draw(this.object3D);

    gl.flush();
  }

  teardown(): void {
    
  }
}

export {FallingLeavesScene};
