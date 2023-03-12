class GLAttribute {
  readonly location: number;
  readonly normalized: boolean;
  readonly offset: number;
  readonly size: number;

  private constructor(
    location: number,
    normalized: boolean,
    offset: number,
    size: number
  ) {
    this.location = location;
    this.normalized = normalized;
    this.offset = offset;
    this.size = size;
  }

  static create(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    normalized: boolean,
    offset: number,
    size: number,
    name: string
  ): GLAttribute | undefined {
    const location = gl.getAttribLocation(program, name);
    return new GLAttribute(location, normalized, offset, size);
  }
}

export {GLAttribute};
