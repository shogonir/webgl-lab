import { Vector3 } from "./Vector3";

class Quaternion {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  private constructor(a: number, b: number, c: number, d: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  static identity(): Quaternion {
    return new Quaternion(1, 0, 0, 0);
  }

  static fromRadianAndAxis(radian: number, vector: Vector3): Quaternion {
    if (vector.isZero()) {
      return Quaternion.identity();
    }

    const normalized = vector.normalizeClone();
    const halfRadian = radian / 2;
    const sinHalfRadian = Math.sin(halfRadian);
    return new Quaternion(
      Math.cos(halfRadian),
      normalized.x * sinHalfRadian,
      normalized.y * sinHalfRadian,
      normalized.z * sinHalfRadian
    );
  }
}

export {Quaternion};
