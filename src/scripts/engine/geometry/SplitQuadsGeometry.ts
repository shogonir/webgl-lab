import { Geometry } from "../Geometry";

type AcceptableAttributeKeys = 'position' | 'uv';

class SplitQuadsGeometry {

  static create(
    quadNumber: number,
    attributeKeys: AcceptableAttributeKeys[] = ['position']
  ): Geometry {
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let index = 0; index < quadNumber; index++) {
      for (const key of attributeKeys) {
        if (key === 'position') {
          vertices.push(
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
          );
        } else if (key === 'uv') {
          vertices.push(
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
          );
        }
      }

      indices.push(
        index * 4 + 0, index * 4 + 3, index * 4 + 1,
        index * 4 + 0, index * 4 + 2, index * 4 + 3,
      );
    }

    return new Geometry(vertices, indices, attributeKeys);
  }
}

export {SplitQuadsGeometry};
