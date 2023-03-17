import { Geometry } from "../Geometry";

class CubeGeometry {
  
  static create(side: number): Geometry {
    const halfSide = side / 2.0;
    return new Geometry([
      halfSide, halfSide, halfSide,
      -halfSide, halfSide, halfSide,
      halfSide, -halfSide, halfSide,
      -halfSide, -halfSide, halfSide,
      halfSide, halfSide, -halfSide,
      -halfSide, halfSide, -halfSide,
      halfSide, -halfSide, -halfSide,
      -halfSide, -halfSide, -halfSide,
    ], [
      0, 1, 2,
      2, 1, 3,
      0, 4, 1,
      1, 4, 5,
      0, 2, 4,
      2, 6, 4,
      1, 5, 3,
      3, 5, 7,
      2, 3, 6,
      3, 7, 6,
      4, 6, 5,
      5, 6, 7,
    ]);
  }
}

export {CubeGeometry};
