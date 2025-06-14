import { Delaunay } from "d3-delaunay";
import { PerspectiveCamera } from "../engine/camera/PerspectiveCamera";
import { MathUtil } from "../math/MathUtil";
import { PolarCoordinate3 } from "../math/PolarCoordinate3";
import { LabStatus } from "../model/LabStatus";
import { Scene } from "./Scene";
import { Geometry } from "../engine/Geometry";
import { Object3D } from "../engine/Object3D";
import { DelaunayContourMaterial } from "../engine/program/delaunayContour/DelaunayContourMaterial";
import { Transform } from "../engine/Transform";
import { ProgramMap } from "../engine/program/ProgramMap";
import { MouseEventUtil } from "../model/MouseEventUtil";
import { PbrBaseMaterial } from "../engine/program/pbrBase/PbrBaseMaterial";
import { CubeGeometry } from "../engine/geometry/CubeGeometry";
import { Color } from "../model/Color";

type LatLng = {
  lat: number;
  lng: number;
}

type ClassicLatLng = {
  lat: {
    degree: number;
    minute: number;
  };
  lng: {
    degree: number;
    minute: number;
  };
};

type ObservationPoint = {
  name: string;
  pressure: number;
  position: ClassicLatLng;
};

const WEATHER_DATA: ObservationPoint[] = [
  {
    name: '札幌',
    pressure: 1009.7,
    position: {
      lat: {
        degree: 43,
        minute: 3.6,
      },
      lng: {
        degree: 141,
        minute: 19.7,
      },
    },
  },
  {
    name: '稚内',
    pressure: 1013.2,
    position: {
      lat: {
        degree: 45,
        minute: 24.9,
      },
      lng: {
        degree: 141,
        minute: 40.7,
      },
    },
  },
  {
    name: '北見枝幸',
    pressure: 1013.9,
    position: {
      lat: {
        degree: 44,
        minute: 56.4,
      },
      lng: {
        degree: 142,
        minute: 35.1,
      },
    },
  },
  {
    name: '旭川',
    pressure: 1012.2,
    position: {
      lat: {
        degree: 43,
        minute: 45.4,
      },
      lng: {
        degree: 142,
        minute: 22.3,
      },
    },
  },
  {
    name: '留萌',
    pressure: 1009.9,
    position: {
      lat: {
        degree: 43,
        minute: 56.7,
      },
      lng: {
        degree: 141,
        minute: 37.9,
      },
    },
  },
  {
    name: '羽幌',
    pressure: 1010.6,
    position: {
      lat: {
        degree: 44,
        minute: 21.8,
      },
      lng: {
        degree: 141,
        minute: 42.0,
      },
    },
  },
  {
    name: '小樽',
    pressure: 1009.4,
    position: {
      lat: {
        degree: 43,
        minute: 12.7,
      },
      lng: {
        degree: 141,
        minute: 47.1,
      },
    },
  },
  {
    name: '寿都',
    pressure: 1008.8,
    position: {
      lat: {
        degree: 42,
        minute: 47.7,
      },
      lng: {
        degree: 140,
        minute: 13.4,
      },
    },
  },
  {
    name: '倶知安',
    pressure: 1009.6,
    position: {
      lat: {
        degree: 42,
        minute: 54.0,
      },
      lng: {
        degree: 140,
        minute: 45.5,
      },
    },
  },
  {
    name: '網走',
    pressure: 1013.8,
    position: {
      lat: {
        degree: 44,
        minute: 1.0,
      },
      lng: {
        degree: 144,
        minute: 16.7,
      },
    },
  },
  {
    name: '紋別',
    pressure: 1013.7,
    position: {
      lat: {
        degree: 44,
        minute: 20.7,
      },
      lng: {
        degree: 143,
        minute: 21.3,
      },
    },
  },
  {
    name: '雄武',
    pressure: 1013.8,
    position: {
      lat: {
        degree: 44,
        minute: 24.8,
      },
      lng: {
        degree: 142,
        minute: 57.8,
      },
    },
  },
  {
    name: '根室',
    pressure: 1014.9,
    position: {
      lat: {
        degree: 43,
        minute: 19.8,
      },
      lng: {
        degree: 145,
        minute: 35.1,
      },
    },
  },
  {
    name: '釧路',
    pressure: 1014.6,
    position: {
      lat: {
        degree: 42,
        minute: 59.1,
      },
      lng: {
        degree: 144,
        minute: 22.6,
      },
    },
  },
  {
    name: '帯広',
    pressure: 1014.4,
    position: {
      lat: {
        degree: 42,
        minute: 55.3,
      },
      lng: {
        degree: 143,
        minute: 12.7,
      },
    },
  },
];

const calculateLatLng = (classic: ClassicLatLng): LatLng => {
  const lat = classic.lat.degree + classic.lat.minute / 60.0;
  const lng = classic.lng.degree + classic.lng.minute / 60.0;
  return {lat, lng};
}

class DelaunayContourScene implements Scene {
  private polar: PolarCoordinate3;
  private camera: PerspectiveCamera;

  private cube: Object3D<PbrBaseMaterial>;
  private delaunayContour: Object3D<DelaunayContourMaterial>;

  private mouseEventMap: Map<keyof DocumentEventMap, EventListener>;

  constructor(labStatus: LabStatus) {
    this.polar = new PolarCoordinate3(-90 * MathUtil.deg2rad, 30 * MathUtil.deg2rad, 3);
    const clientSize = labStatus.clientSize;
    const aspect = clientSize.getWidth() / clientSize.getHeight();
    const camera = PerspectiveCamera.createWithPolar(this.polar, 90 * MathUtil.deg2rad, aspect, 0.1, 6.0);
    this.camera = camera;

    const points: [number, number][] = WEATHER_DATA.map((point) => {
      const latLng = calculateLatLng(point.position);
      return [latLng.lng, latLng.lat];
    });

    const delaunay = Delaunay.from(points);

    const transform = Transform.identity();
    transform.position.setValues(-142.0, -44.0, 0.0);
    const scale = 1.0;
    transform.scale.setValues(scale, scale, scale);
    let minPressure = 2000.0;
    let maxPressure = 0.0;
    const vertices: number[] = WEATHER_DATA.flatMap((point) => {
      const latLng = calculateLatLng(point.position);
      if (point.pressure < minPressure) {
        minPressure = point.pressure;
      }
      if (point.pressure > maxPressure) {
        maxPressure = point.pressure;
      }
      return [latLng.lng, latLng.lat, 0.0, point.pressure];
    });
    const indices: number[] = Array.from(delaunay.triangles);
    const geometry = new Geometry(vertices, indices, ['position', 'scalar_00']);
    const material = new DelaunayContourMaterial();
    this.delaunayContour = new Object3D(transform, geometry, material);

    const transform2 = Transform.identity();
    const geometry2 = CubeGeometry.create(1.0, ['position', 'normal']);
    const material2 = new PbrBaseMaterial(0.0, 0.0, Color.red());
    this.cube = new Object3D(transform2, geometry2, material2);

    this.mouseEventMap = MouseEventUtil.moveCameraOnPolar(this.camera, this.polar);
  }

  setup(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.addEventListener(key, value);
    }
  }

  update(labStatus: LabStatus): void {
    const gl = labStatus.gl;
    const program = ProgramMap.delaunayContour;
    const program2 = ProgramMap.pbrBase;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const clientSize = labStatus.clientSize;
    this.camera.aspect = clientSize.getWidth() / clientSize.getHeight();
    this.camera.updateMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();

    program.updateCamera(viewMatrix, projectionMatrix);
    program2.updateCamera(viewMatrix, projectionMatrix);

    program.draw(this.delaunayContour);
    // program2.draw(this.cube);

    gl.flush();
  }

  teardown(): void {
    for (const [key, value] of this.mouseEventMap) {
      document.removeEventListener(key, value);
    }
  }
}

export {DelaunayContourScene};
