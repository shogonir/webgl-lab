import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { CubeMappingMaterial } from "../engine/program/cubeMapping/CubeMappingMaterial";
import { WaterSurfaceMaterial } from "../engine/program/waterSurface/WaterSurfaceMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { getImageSource } from "./CubeMappingScene";
import { Scene } from "./Scene";

class WaterSurfaceScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  private waterSurface?: Object3D<WaterSurfaceMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 0.8);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);
    this.camera = camera;

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);

    let loadCount = 0;
    const imageMap: Map<string, TexImageSource> = new Map();
    for (const imageKey of ['top', 'bottom', 'front', 'back', 'left', 'right']) {
      const image = new Image();
      image.onload = () => {
        imageMap.set(imageKey, image);
        loadCount++;
        if (loadCount === 6) {
          const material = new WaterSurfaceMaterial(
            0.0,
            imageMap.get('top') as TexImageSource,
            imageMap.get('bottom') as TexImageSource,
            imageMap.get('front') as TexImageSource,
            imageMap.get('back') as TexImageSource,
            imageMap.get('left') as TexImageSource,
            imageMap.get('right') as TexImageSource,
            this.polar.toVector3()
          );

          const transform = Transform.identity();
          const geometry = PlaneGeometry.create(1.0, 256, ['position', 'uv']);
          this.waterSurface = new Object3D(transform, geometry, material);
        }
      };
      image.src = getImageSource(imageKey);
    }

    // const transform = Transform.identity();
    // const geometry = PlaneGeometry.create(1.0, 256, ['position', 'uv']);
    // const material = new WaterSurfaceMaterial(0.0);
    // this.waterSurface = new Object3D(transform, geometry, material);

    this.startTime = performance.now();
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.waterSurface;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);

    if (this.waterSurface) {
      const time = performance.now() - this.startTime;
      this.waterSurface.material.time = time;

      const eye = this.polar.toVector3();
      this.waterSurface.material.eyePosition.setValues(eye.x, eye.y, eye.z);

      program.draw(this.waterSurface);
    }

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {WaterSurfaceScene};
