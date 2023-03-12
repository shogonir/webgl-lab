import { Geometry } from "../engine/Geometry";
import { Object3D } from "../engine/Object3D";
import { SingleColorMaterial } from "../engine/program/singleColor/SingleColorMaterial";
import { SingleColorProgram } from "../engine/program/singleColor/SingleColorProgram";
import { TextureMaterial } from "../engine/program/texture/TextureMaterial";
import { TextureProgram } from "../engine/program/texture/TextureProgram";
import { Transform } from "../engine/Transform";
import { Vector2 } from "../math/Vector2";
import { Color } from "../model/Color";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";

class DemoListScene implements Scene {
  private program: SingleColorProgram;
  private texProgram: TextureProgram;

  private degree: number;

  private object1: Object3D<SingleColorMaterial>;
  private object2: Object3D<SingleColorMaterial>;

  private object3: Object3D<TextureMaterial>;
  private object4: Object3D<TextureMaterial>;

  constructor(labStatus: LabStatus) {
    const gl = labStatus.gl;
    this.degree = 0;
    
    const program = SingleColorProgram.create(gl);
    if (!program) {
      return;
    }
    // program.setup();

    const texProgram = TextureProgram.create(gl);
    if (!texProgram) {
      return;
    }
    // texProgram.setup();

    this.program = program;
    this.texProgram = texProgram;

    const vertices = [
      -0.5,  0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5,  0.5, 0.0,
    ];
    const indices = [
      0, 1, 2,
      2, 3, 0,
    ];

    const canvas = document.createElement('canvas');
    const side = 16;
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (context) {
      const halfSide = side / 2;
      context.fillStyle = 'black';
      context.fillRect(0, 0, halfSide, halfSide);
      context.fillStyle = 'red';
      context.fillRect(halfSide, 0, halfSide, halfSide);
      context.fillStyle = 'green';
      context.fillRect(0, halfSide, halfSide, halfSide);
      context.fillStyle = 'blue';
      context.fillRect(halfSide, halfSide, halfSide, halfSide);
    }
    const uv: number[] = [
      0.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
    ];
    
    const transform1 = Transform.identity();
    const geometry1 = new Geometry(vertices, indices);
    const material1 = new SingleColorMaterial(Color.magenta(), Vector2.zero());
    this.object1 = new Object3D(transform1, geometry1, material1);

    const transform2 = Transform.identity();
    const geometry2 = new Geometry(vertices, indices);
    const material2 = new SingleColorMaterial(Color.yellow(), Vector2.zero());
    this.object2 = new Object3D(transform2, geometry2, material2);

    const transform3 = Transform.identity();
    const geometry3 = new Geometry(vertices, indices);
    const material3 = new TextureMaterial(canvas, uv, Vector2.zero());
    this.object3 = new Object3D(transform3, geometry3, material3);

    const transform4 = Transform.identity();
    const geometry4 = new Geometry(vertices, indices);
    const material4 = new TextureMaterial(canvas, uv, Vector2.zero());
    this.object4 = new Object3D(transform4, geometry4, material4);
  }

  setup(): void {
  }

  update(labStatus: LabStatus): void {
    this.degree++;
    const radian = this.degree * Math.PI / 180.0;

    const x1 = 0.5 * Math.cos(radian);
    const y1 = 0.5 * Math.sin(radian);
    this.object3.material.offset.x = x1;
    this.object3.material.offset.y = y1;
    this.texProgram.draw(this.object3);

    const x3 = 0.5 * Math.cos(radian + (Math.PI * 1 / 2));
    const y3 = 0.5 * Math.sin(radian + (Math.PI * 1 / 2));
    this.object1.material.offset.x = x3;
    this.object1.material.offset.y = y3;
    this.program.draw(this.object1);

    const x2 = 0.5 * Math.cos(radian + Math.PI);
    const y2 = 0.5 * Math.sin(radian + Math.PI);
    this.object4.material.offset.x = x2;
    this.object4.material.offset.y = y2;
    this.texProgram.draw(this.object4);

    const x4 = 0.5 * Math.cos(radian + (Math.PI * 3 / 2));
    const y4 = 0.5 * Math.sin(radian + (Math.PI * 3 / 2));
    this.object2.material.offset.x = x4;
    this.object2.material.offset.y = y4;
    this.program.draw(this.object2);

    labStatus.gl.flush();
  }

  teardown(): void {
  }
}

export {DemoListScene};
