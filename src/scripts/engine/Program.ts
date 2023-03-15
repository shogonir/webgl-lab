import { Material } from "./Material";
import { Object3D } from "./Object3D";

interface Program {
  draw(object3D: Object3D<Material>): void;
}

export {Program};
