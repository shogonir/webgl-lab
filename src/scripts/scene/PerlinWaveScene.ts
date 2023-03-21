import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { PlaneGeometry } from "../engine/geometry/PlaneGeometry";
import { Object3D } from "../engine/Object3D";
import { PerlinWaveMaterial } from "../engine/program/perlinWave/PerlinWaveMaterial";
import { WAVE_SIDE } from "../engine/program/perlinWave/PerlinWaveProgram";
import { ProgramMap } from "../engine/program/ProgramMap";
import { Transform } from "../engine/Transform";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class PerlinWaveScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private waveObject: Object3D<PerlinWaveMaterial>;

  private startTime: number;

  constructor(labStatus: LabStatus) {
    const deg2rad = Math.PI / 180.0;
    this.polar = new PolarCoordinate3(0, 45 * deg2rad, 1);
    const aspect = labStatus.clientSize.getWidth() / labStatus.clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * deg2rad, aspect, 0.1, 2);
    this.camera = camera;

    const side = WAVE_SIDE;
    const width = 1.0;
    
    const transform = Transform.identity();
    const geometry = PlaneGeometry.create(width, side, ['position']);
    const material = new PerlinWaveMaterial(0);
    this.waveObject = new Object3D(transform, geometry, material);

    this.startTime = performance.now();
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const perlinWaveProgram = ProgramMap.perlinWaveProgram;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.waveObject.transform.rotation.rotateZ(0.0001 * Math.PI);
    this.waveObject.material.time = performance.now() - this.startTime;
    
    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    perlinWaveProgram.updateCamera(viewMatrix, projectionMatrix);
  
    perlinWaveProgram.draw(this.waveObject);
    
    gl.flush();
  }

  teardown(): void {
    
  }
}

export {PerlinWaveScene};
