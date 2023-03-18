import { Geometry } from "../Geometry";

type AcceptableAttributeKeys = 'position' | 'normal';

class SphereGeometry {

  static create(
    radius: number,
    equatorSplit: number,
    attributeKeys: AcceptableAttributeKeys[] = ['position']
  ): Geometry {
    const vertices: number[] = [];
    const indices: number[] = [];

    for (const key of attributeKeys) {
      if (key === 'position') {
        vertices.push(0, 0, radius);
      } else if (key === 'normal') {
        vertices.push(0, 0, 1);
      }
    }
    
    const top = 0;
    for (let yIndex = 1; yIndex < equatorSplit / 2; yIndex++) {
      const theta = Math.PI * yIndex / (equatorSplit / 2);
      for (let xIndex = 0; xIndex < equatorSplit; xIndex++) {
        const phi = 2.0 * Math.PI * xIndex / equatorSplit;
        const sinTheta = Math.sin(theta);
        for (const key of attributeKeys) {
          if (key === 'position') {
            vertices.push(...SphereGeometry.calculatePosition(radius, phi, theta, sinTheta));
          } else if (key === 'normal') {
            vertices.push(...SphereGeometry.calculateNormal(phi, theta, sinTheta));
          }
        }

        const current = equatorSplit * (yIndex - 1) + xIndex + 1;
        const before = current - 1;
        const up = current - equatorSplit;
        const upBefore = up - 1;
        if (xIndex === 0) {
          if (yIndex === 1) {
            indices.push(equatorSplit, 1, top);
          } else {
            indices.push(before, current, up);
            indices.push(before, before + equatorSplit, current);
          }
        } else {
          if (yIndex === 1) {
            indices.push(before, current, top);
          } else {
            indices.push(before, current, up);
            indices.push(up, upBefore, before);
          }
        }
      }
    }

    for (const key of attributeKeys) {
      if (key === 'position') {
        vertices.push(0, 0, -radius);
      } else if (key === 'normal') {
        vertices.push(0, 0, -1);
      }
    }
    const bottom = equatorSplit * (equatorSplit / 2 - 1) + 1;
    
    for (let xIndex = 0; xIndex < equatorSplit; xIndex++) {
      const current = bottom - equatorSplit + xIndex;
      const before = current - 1;
      if (xIndex === 0) {
        indices.push(bottom - 1, bottom, current);
      } else {
        indices.push(before, bottom, current);
      }
    }
    return new Geometry(vertices, indices, attributeKeys);
  }

  private static calculatePosition(
    radius: number,
    phi: number,
    theta: number,
    sinTheta: number,
  ): [number, number, number] {
    const x = radius * sinTheta * Math.cos(phi);
    const y = radius * sinTheta * Math.sin(phi);
    const z = radius * Math.cos(theta);
    return [x, y, z];
  }

  private static calculateNormal(
    phi: number,
    theta: number,
    sinTheta: number,
  ): [number, number, number] {
    const x = sinTheta * Math.cos(phi);
    const y = sinTheta * Math.sin(phi);
    const z = Math.cos(theta);
    return [x, y, z];
  }
}

export {SphereGeometry};
