import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { CubeGeometry } from "../engine/geometry/CubeGeometry";
import { RadialNormalCubeGeometry } from "../engine/geometry/RadialNormalCubeGeometry";
import { SphereGeometry } from "../engine/geometry/SphereGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { CubeMappingMaterial } from "../engine/program/cubeMapping/CubeMappingMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Vector3 } from "../math/Vector3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

const getImageSource = (imageKey: string) => {
  switch (imageKey) {
    case 'top':
      return require("../../assets/img/cubeMapping/top.jpg");
    case 'bottom':
      return require("../../assets/img/cubeMapping/bottom.jpg");
    case 'front':
      return require("../../assets/img/cubeMapping/front.jpg");
    case 'back':
      return require("../../assets/img/cubeMapping/back.jpg");
    case 'left':
      return require("../../assets/img/cubeMapping/left.jpg");
    default:
      return require("../../assets/img/cubeMapping/right.jpg");
  }
}

class CubeMappingScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  private cube?: Object3D<CubeMappingMaterial>;
  private sphere?: Object3D<CubeMappingMaterial>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 4.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 100.0);
    this.camera = camera;

    let loadCount = 0;
    const imageMap: Map<string, TexImageSource> = new Map();
    for (const imageKey of ['top', 'bottom', 'front', 'back', 'left', 'right']) {
      const image = new Image();
      image.onload = () => {
        imageMap.set(imageKey, image);
        loadCount++;
        if (loadCount === 6) {
          const material = new CubeMappingMaterial(
            imageMap.get('top') as TexImageSource,
            imageMap.get('bottom') as TexImageSource,
            imageMap.get('front') as TexImageSource,
            imageMap.get('back') as TexImageSource,
            imageMap.get('left') as TexImageSource,
            imageMap.get('right') as TexImageSource,
            new Vector3(0.0, -10.0, 5.0),
            true
          );

          const cubeTransform = Transform.identity();
          const scale = 50.0;
          cubeTransform.scale.setValues(scale, scale, scale);
          const cubeGeometry = RadialNormalCubeGeometry.create(1.0, ['position', 'normal']);
          this.cube = new Object3D(cubeTransform, cubeGeometry, material);

          const sphereTransform = Transform.identity();
          // sphereTransform.position.addValues(1.0, 0.0, 0.0);
          const sphereGeometry = SphereGeometry.create(1.0, 32, ['position', 'normal']);
          this.sphere = new Object3D(sphereTransform, sphereGeometry, material);
        }
      };
      image.src = getImageSource(imageKey);
    }

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.cubeMapping;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);

    if (this.cube && this.sphere) {
      const eye = this.polar.toVector3();

      this.cube.material.eyePosition.setValues(eye.x, eye.y, eye.z);
      this.cube.material.isReflection = false;
      program.draw(this.cube);

      this.sphere.material.eyePosition.setValues(eye.x, eye.y, eye.z);
      this.sphere.material.isReflection = true;

      program.draw(this.sphere);
    }

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {CubeMappingScene};
