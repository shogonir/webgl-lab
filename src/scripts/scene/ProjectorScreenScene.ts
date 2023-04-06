import { Object3D } from "../engine/Object3D";
import { Transform } from "../engine/Transform";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { GLFramebuffer } from "../engine/common/GLFramebuffer";
import { CubeGeometry } from "../engine/geometry/CubeGeometry";
import { QuadGeometry } from "../engine/geometry/QuadGeometry";
import { ProgramMap } from "../engine/program/ProgramMap";
import { FramebufferMaterial } from "../engine/program/framebuffer/FramebufferMaterial";
import { SingleColorMaterial } from "../engine/program/singleColor/SingleColorMaterial";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { Color } from "../model/Color";
import { LabStatus } from "../model/LabStatus";
import { FramebufferRenderTarget } from "../model/RenderTarget";
import { Scene } from "./Scene";

class ProjectorScreenScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private object3D: Object3D<SingleColorMaterial>;
  private screen?: Object3D<FramebufferMaterial>;

  private glFramebuffer?: GLFramebuffer;
  private framebufferRenderTarget?: FramebufferRenderTarget;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 60 * MathUtil.deg2rad, 2);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 4);
    this.camera = camera;

    const transform = Transform.identity();
    const geometry = CubeGeometry.create(1.0, ['position', 'normal']);
    const material = new SingleColorMaterial(Color.blue());
    this.object3D = new Object3D(transform, geometry, material);

    this.glFramebuffer = GLFramebuffer.create(labStatus.gl, 512, 512);

    if (this.glFramebuffer) {
      this.framebufferRenderTarget = {
        type: 'framebuffer',
        clientSize: {
          width: this.glFramebuffer.width,
          height: this.glFramebuffer.height,
        },
        target: this.glFramebuffer,
      };

      const tr = Transform.identity();
      tr.position.setValues(1.3, 0.0, 0.0);
      tr.rotation.rotateX(-90 * MathUtil.deg2rad);
      tr.rotation.rotateY(180 * MathUtil.deg2rad);
      tr.rotation.rotateZ(30 * MathUtil.deg2rad);
      const geo = QuadGeometry.create(1.0, ['position', 'uv']);
      const mat = new FramebufferMaterial(this.glFramebuffer);
      this.screen = new Object3D(tr, geo, mat);
    }
  }

  setup(): void {
    
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.singleColorProgram;
    const framebufferProgram = ProgramMap.framebuffer;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.glFramebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer.framebuffer);
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    this.object3D.transform.rotation.rotateZ(1 * MathUtil.deg2rad);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);
    program.draw(this.object3D);
    program.draw(this.object3D, this.framebufferRenderTarget);

    if (this.glFramebuffer && this.screen && this.framebufferRenderTarget) {
      framebufferProgram.updateCamera(viewMatrix, projectionMatrix);
      framebufferProgram.draw(this.screen);
    }
    
    gl.flush();
  }

  teardown(): void {
    
  }
}

export {ProjectorScreenScene};
