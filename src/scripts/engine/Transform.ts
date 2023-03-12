import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";

class Transform {
  readonly position: Vector3;
  readonly rotation: Quaternion;
  readonly scale: Vector3;

  constructor(position: Vector3, rotation: Quaternion, scale: Vector3) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  static identity(): Transform {
    return new Transform(Vector3.zero(), Quaternion.identity(), Vector3.ones());
  }
}

export {Transform};
