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

const SNSS = 'data:image/png;base64,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Af3+/wMB/wH+AAAAAAEBAAAA/wEA/v7+F1M3AggG76rJ/dDf7urxBPz9CgQCAgD8/gEBAAAA/wAAAf0B/wAAAAAA/v0A//0AAAQABAAAAAAC////AQAAAAAAAAEAAAEAAP8AAP///wD+AQAAAAD//wAA/gH//v7/AQEB/hRKMAMJBeylxfnl7uwFAxMPCAb///7+/gEBAf////8A/f/+/gAAAAEC/wL/AgAAAAQBAQH+/v8CAAAAAAAA////AQEAAAABAAD+/v4DAP78/gADAP7//////v4AAAIBAf/+/gEOPib+AwHtpsb24OsC8/oS/f///v7/AAD//v4AAQEAAQH/AP0A/QH/Af0BAAIC////////////AAAA/QD///7+Av7/////BAAB////AgICAAAA//8B/////wH+//7+////////Djkl/FA03BAN9vr89vn8/wH+AP///wAA////////AP0A//////4BAAAAAgEBAQAAAAAC/wAAAAH/AP8AAPsB/wAAAPwA/wACAf8MBQAMCgEB///////9APz/AP3//P///wAA/gcuHcAkHM4MCfn7/AD/Av8AAAAAAAD//wAB/v8B/v8AAAAAAAAAAAQAAAAAAAD///8AAP8BAAAAAQEA/v//Av8AAAD9HRL/Y0AAAAD/GRAC//8AAP0A/wAAAAD///8BAQEEAgHiCwXmFxMYDgs0//3/AP///wH+//8AAAIA/wABAP0AAgAAAf4E/f/+AP7/AAMAAQEB/wAAAP//AQEBAAAA/////gIB/xoQAQICAAAA/v7+AAAAAQEBAAAA////AP//Af/9////5AgG5Q0KMv8B//8A////AP///wAAAQL//fsA///9AgQDAgEA/v7+AP//AP7//P/+/v7+/v////79/f////////7//////+zx9wAAAAAAAP78//7+/v/+/gD+Aezz+/b5/AEBAQQFAv///wD//////wABAQH9/P78//8B/f79Av8AAAL/////Af7//////QD///8AAf7/////AAD+/v7//v7///+0yuGZu9jd5/L9/f3+AP3////+///y+PbC0+Xz9vsMCQQbEgn////////////+/v79AgD/Af7+/AAAA/3+AP0E////AAAA////AP/9AAICAP4DAAH/AP//AQH/AAEE4uvytcvj3uny8fT5QCsYKB0TAQD+6O/3xNfowNLmAQEBRzAdKBwO/v7+AAH+//8B/////wD////+AAL/AP7/AQAAAdva2P3//AICAQH/AQACAQICAgH/AgEBAQEBAQEBAQECAr/S5bTM5drm8gIDAA8HBQEBAPX4/fj8/RQNB0czG0szHgwJAf/+AQD///8AAAD///4A/QAAAP7+/v///wMBBAHb29v8/fgCAgIAAQMCAf8BAQH///8DAQQBAgIAAAAA//8BAwDn7vbR3/HZ5vHr7/YAAAIMCQQjGQwwIBMlGg4AAAD/AAD+/v4AAgEA//3////+/v7///////8AAAACAAMB29rY/Pz6AQEBAQMCAQEBAQEBAQEBAQEBAf4EAAP9Af8CAAL/AAAAAf8C/f7++/wA/gEABQH+BQUF/////v7+AQEBAP/9/wEA/////v7+Af8C/gD9////////AP7/AwQGBP7///8BAAD//wD//wD+//8AAgIEAP///wEB+wH/Af8A/f/+AgL/AP8C/QIBAgcFAAAC////AP7//P/+AQAB/v8AAP4A/wH/AP///wAAAP8B/gD9/wABAAL9//0A/wAB/gQJCgf7+wIB/wABAwIB/wIAAQEAAAABAAAAAAABAQEAAP4AAQMBAQEC/v/+AQAAAAABAwD//QD/AAABAwD/AAAAAAD///8A////AAABAQH/AP0A/QMAA/3+/v4F/v8CAwXJyJORl3ka0AAAAABJRU5ErkJggg==';

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
    image.src = SNSS;

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