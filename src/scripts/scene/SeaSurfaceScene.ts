import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { GLFramebuffer } from "../engine/common/GLFramebuffer";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { SplitQuadsGeometry } from "../engine/geometry/SplitQuadsGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { FramebufferMaterial } from "../engine/program/framebuffer/FramebufferMaterial";
import { SeaSurfaceMaterial } from "../engine/program/seaSurface/SeaSurfaceMaterial";
import { SeaWaveMaterial } from "../engine/program/seaSurface/SeaWaveMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { FramebufferRenderTarget } from "../model/RenderTarget";
import { getImageSource } from "./CubeMappingScene";
import {Scene} from "./Scene";

class SeaSurfaceScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  private waveBuffer?: GLFramebuffer;
  private waveBufferTarget?: FramebufferRenderTarget;

  private seaMotion: Object3D<SeaWaveMaterial>;
  private seaSurface?: Object3D<SeaSurfaceMaterial>;
  private seaWave?: Object3D<FramebufferMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    const gl = labStatus.gl;
    const program = ProgramMap.framebuffer;
    const prg = program.glProgram.program;

    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 1.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 2.0);
    this.camera = camera;

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);

    const transform = Transform.identity();
    const geometry = SplitQuadsGeometry.create(4, ['position', 'uv', 'vertexIndex']);
    const material = new SeaWaveMaterial(0.0);
    this.seaMotion = new Object3D(transform, geometry, material);

    const waveBuffer = GLFramebuffer.create(gl, prg, 'tex', 0, 512, 512);

    if (waveBuffer) {
      this.waveBuffer = waveBuffer;

      this.waveBufferTarget = {
        type: 'framebuffer',
        clientSize: {
          width: waveBuffer.width,
          height: waveBuffer.height,
        },
        target: waveBuffer,
      };

      let loadCount = 0;
      const imageMap: Map<string, TexImageSource> = new Map();
      for (const imageKey of ['top', 'bottom', 'front', 'back', 'left', 'right']) {
        const image = new Image();
        image.onload = () => {
          imageMap.set(imageKey, image);
          loadCount++;
          if (loadCount === 6) {
            {
              const transform = Transform.identity();
              transform.position.z = -0.2;
              const geometry = QuadGeometry.create(1.0, ['position', 'uv']);
              const material = new FramebufferMaterial(waveBuffer);
              this.seaWave = new Object3D(transform, geometry, material);
            }

            {
              const transform = Transform.identity();
              const geometry = PlaneGeometry.create(1.0, 100, ['position', 'uv']);
              const material = new SeaSurfaceMaterial(waveBuffer, this.polar.toVector3());
              this.seaSurface = new Object3D(transform, geometry, material);
            }
          }
        };
        image.src = getImageSource(imageKey);
      }
    }

    this.startTime = performance.now();
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const framebufferProgram = ProgramMap.framebuffer;
    const seaWaveProgram = ProgramMap.seaWave;
    const seaSurfaceProgram = ProgramMap.seaSurface;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    framebufferProgram.updateCamera(viewMatrix, projectionMatrix);
    seaSurfaceProgram.updateCamera(viewMatrix, projectionMatrix);

    if (this.waveBuffer && this.waveBufferTarget && this.seaWave && this.seaSurface) {
      this.seaMotion.material.time = performance.now() - this.startTime;
      seaWaveProgram.draw(this.seaMotion, this.waveBufferTarget);
      framebufferProgram.draw(this.seaWave);
      
      const {x, y, z} = this.polar.toVector3();
      this.seaSurface.material.eyePosition.setValues(x, y, z);
      seaSurfaceProgram.draw(this.seaSurface);
    }

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {SeaSurfaceScene};
