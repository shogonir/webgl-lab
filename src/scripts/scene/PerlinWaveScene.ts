import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { Geometry } from "../engine/Geometry";
import { Object3D } from "../engine/Object3D";
import { PerlinWaveMaterial } from "../engine/program/perlinWave/PerlinWaveMaterial";
import { PerlineWaveProgram, WAVE_SIDE } from "../engine/program/perlinWave/PerlinWaveProgram";
import { Transform } from "../engine/Transform";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class PerlinWaveScene implements Scene {
  private program: PerlineWaveProgram;

  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private waveObject: Object3D<PerlinWaveMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    const gl = labStatus.gl;

    const glProgram = PerlineWaveProgram.create(gl);
    if (!glProgram) {
      return;
    }

    this.program = glProgram;

    const deg2rad = Math.PI / 180.0;
    this.polar = new PolarCoordinate3(0, 45 * deg2rad, 1);
    const aspect = labStatus.clientSize.getWidth() / labStatus.clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * deg2rad, aspect, 0.1, 2);
    this.camera = camera;

    const side = WAVE_SIDE;
    const width = 1.0;
    const halfWidth = width / 2.0;
    const vertices: number[] = new Array(side * side * 3);
    const indices: number[] = new Array((side - 1) * (side - 1) * 6);
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        vertices[(y * side + x) * 3 + 0] = width * x / (side - 1) - halfWidth;
        vertices[(y * side + x) * 3 + 1] = width * y / (side - 1) - halfWidth;
        vertices[(y * side + x) * 3 + 2] = 0.0;

        if (x === 0 || y === 0) {
          continue;
        }

        const current = y * side + x;
        const left = current - 1;
        const up = current - side;
        const upLeft = current - side - 1;
        const index = ((y - 1) * side + (x - 1)) * 6;
        indices[index + 0] = upLeft;
        indices[index + 1] = left;
        indices[index + 2] = current;
        indices[index + 3] = current;
        indices[index + 4] = up;
        indices[index + 5] = upLeft;
      }
    }
    
    const transform = Transform.identity();
    const geometry = new Geometry(vertices, indices);
    const material = new PerlinWaveMaterial(0);
    this.waveObject = new Object3D(transform, geometry, material);

    this.startTime = performance.now();
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;

    this.waveObject.transform.rotation.rotateZ(0.0001 * Math.PI);
    this.waveObject.material.time = performance.now() - this.startTime;
    
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    this.program.updateCamera(viewMatrix, projectionMatrix);
    
    this.program.draw(this.waveObject);
    gl.flush();
  }

  teardown(): void {
    
  }
}

export {PerlinWaveScene};
