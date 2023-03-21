import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { MandelbrotSetMaterial } from "../engine/program/rayMarchingSpheres/MandelbrotSetMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Vector2 } from "../math/Vector2";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

type WheelListener = (event: WheelEvent) => void;
type MouseListener = (event: MouseEvent) => void;

class MandelbrotSetScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;
  
  private object3D: Object3D<MandelbrotSetMaterial>;

  private isMouseDown: boolean;
  private onWheel: WheelListener;
  private onMouseDown: MouseListener;
  private onMouseUp: MouseListener;
  private onMouseMove: MouseListener;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 0.001 * MathUtil.deg2rad, 1);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);

    const transform = Transform.identity();
    const geometry = QuadGeometry.create(1.0, ['position', 'uv']);
    const material = new MandelbrotSetMaterial(1.0, Vector2.zero());
    this.object3D = new Object3D(transform, geometry, material);

    this.isMouseDown = false;
    this.onWheel = (event: WheelEvent) => {
      this.object3D.material.zoomRate -= 0.003 * event.deltaY;
    };
    this.onMouseDown = (event: MouseEvent) => {
      this.isMouseDown = true;
    }
    this.onMouseUp = (event: MouseEvent) => {
      this.isMouseDown = false;
    }
    this.onMouseMove = (event: MouseEvent) => {
      if (this.isMouseDown) {
        this.object3D.material.center.x -= 0.001 * event.movementX;
        this.object3D.material.center.y += 0.001 * event.movementY;
      }
    }
  }

  setup(): void {
    document.addEventListener('wheel', this.onWheel);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.rayMarchingSpheres;
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

    this.object3D.transform.scale.setValues(2.0, 2.0, 1.0);

    program.draw(this.object3D);

    gl.flush();
  }

  teardown(): void {
    document.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

export {MandelbrotSetScene};
