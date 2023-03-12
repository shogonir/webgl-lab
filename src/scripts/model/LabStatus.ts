import { Size } from "./Size";

class LabStatus {
  readonly baseElement: HTMLDivElement;
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  readonly clientSize: Size;

  constructor(
    baseElement: HTMLDivElement,
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    clientSize: Size
  ) {
    this.baseElement = baseElement;
    this.canvas = canvas;
    this.gl = gl;
    this.clientSize = clientSize;
  }
}

export {LabStatus};
