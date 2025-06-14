import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { Geometry } from "../engine/Geometry";
import { Object3D } from "../engine/Object3D";
import { ParticleColorMaterial } from "../engine/program/particleColor/ParticleColorMaterial";
import { ProgramMap } from "../engine/program/ProgramMap";
import { Transform } from "../engine/Transform";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { Scene } from "./Scene";

type MandelbulbData = {
  side: number;
  body: {[opacity: string]: [number, number, number][]};
};

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type ColorRecord = {
  threshold: number;
  color: Color;
};

class ColorMixer {
  private minRecord: ColorRecord;
  private maxRecord: ColorRecord;

  private table: ColorRecord[];

  constructor(min: Color, max: Color) {
    this.minRecord = {threshold: 0, color: min};
    this.maxRecord = {threshold: 1, color: max};
    this.table = [];
  }

  addRecord(threshold: number, color: Color): void {
    if (threshold <= 0 || threshold >= 1) {
      return;
    }
    for (let i = 0; i < this.table.length; i++) {
      const min = this.table[i];
      const max = this.table[i];
      if (!max) {
        break;
      }
      if (threshold > max.threshold) {
        continue;
      }
      this.table.splice(i + 1, 0, {threshold, color});
      return;
    }
    this.table.push({threshold, color});
  }

  private copyColor(to: Color, from: Color): Color {
    to.r = from.r;
    to.g = from.g;
    to.b = from.b;
    to.a = from.a;
    return to;
  }

  private mixColor(ratio: number, min: ColorRecord, max: ColorRecord, output: Color): Color {
    if (ratio <= min.threshold) {
      return this.copyColor(output, min.color);
    }
    if (ratio >= max.threshold) {
      return this.copyColor(output, max.color);
    }
    const minRatio = (ratio - min.threshold) / (max.threshold - min.threshold);
    const maxRatio = (max.threshold - ratio) / (max.threshold - min.threshold);
    output.r = min.color.r * minRatio + max.color.r * maxRatio;
    output.g = min.color.g * minRatio + max.color.g * maxRatio;
    output.b = min.color.b * minRatio + max.color.b * maxRatio;
    output.a = min.color.a * minRatio + max.color.a * maxRatio;
    return output;
  }

  blend(ratio: number, output: Color): Color {
    if (ratio <= 0.0) {
      return this.copyColor(output, this.minRecord.color);
    }
    if (ratio >= 1.0) {
      return this.copyColor(output, this.maxRecord.color);
    }
    for (let i = 0; i < this.table.length; i++) {
      const min = this.table[i];
      const max = this.table[i + 1];
      if (!max && ratio <= min.threshold) {
        return this.mixColor(ratio, this.minRecord, min, output);
      }
      if (!max) {
        return this.mixColor(ratio, min, this.maxRecord, output);
      }
      if (ratio <= min.threshold) {
        return this.mixColor(ratio, this.minRecord, min, output);
      }
      if (ratio <= max.threshold) {
        return this.mixColor(ratio, min, max, output);
      }
    }
    return this.mixColor(ratio, this.minRecord, this.maxRecord, output);
  }
}

const VERTEX_SIZE = 7;

class MandelbulbMistScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private objectList: Object3D<ParticleColorMaterial>[];

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 1.0);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4.0);
    this.camera = camera;

    this.objectList = this.createObjectList();

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  private createObjectList(): Object3D<ParticleColorMaterial>[] {
    const data = require('../../assets/json/mandelbulb.json') as MandelbulbData;
    const side: number = data.side;

    const objectList: Object3D<ParticleColorMaterial>[] = [];
    let vertices: number[] = [];

    const purple: Color = {r: 214/255, g: 51/255, b: 255/255, a: 1};
    const cyan: Color = {r: 0, g: 1, b: 1, a: 1};
    const colorMixer = new ColorMixer(purple, cyan);
    const blue: Color = {r: 0, g: 0, b: 1, a: 1};
    colorMixer.addRecord(0.67, blue);

    let vertexCount = 0;
    let objectCount = 0;

    const nextObject = () => {
      const transform = Transform.identity();
      transform.rotation.rotateX(Math.PI / 2);
      const geometry = new Geometry(vertices, [], ['position', 'color']);
      const material = new ParticleColorMaterial();
      const object3D = new Object3D(transform, geometry, material);
      objectList.push(object3D);

      vertexCount += vertices.length / VERTEX_SIZE;
      objectCount += 1;

      vertices = [];
    };

    const color: Color = {r: 0, g: 0, b: 0, a: 1};
    for (const [opacityString, positions] of Object.entries(data.body)) {
      const opacityNumber = parseInt(opacityString, 10);
      if (Number.isNaN(opacityNumber)) {
        continue;
      }
      const opacity = opacityNumber / 100;
      if (opacity < 0.15) {
        continue;
      }
      for (const position of positions) {
        const x = position[0] / side - 0.5;
        const y = position[1] / side - 0.5;
        const z = position[2] / side - 0.5;

        const raise = 0.3;
        const alpha = (opacity + raise) / (1.0 + raise);

        colorMixer.blend(opacity, color);
        vertices.push(x, y, z, color.r, color.g, color.b, color.a);

        if (vertices.length / VERTEX_SIZE >= 65536) {
          nextObject();
        }
      }
    }

    if (vertices.length > 0) {
      nextObject();
    }

    console.log(`mandelbulb vertex:${vertexCount.toLocaleString()}, object:${objectCount}`);

    return objectList;
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.particelColor;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.polar.phi += 0.01;
    this.camera.setPolar(this.polar);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();

    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    program.updateCamera(viewMatrix, projectionMatrix);

    for (const object3D of this.objectList) {
      program.draw(object3D);
    }

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export { MandelbulbMistScene };
