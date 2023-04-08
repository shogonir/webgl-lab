const DEFAULT_TEXTURE_PARAMETER_MAP = new Map([
  [WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR],
  [WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR],
  [WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE],
  [WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE]
]);

class GLTextureCubeMap {
  readonly top: TexImageSource;
  readonly bottom: TexImageSource;
  readonly front: TexImageSource;
  readonly back: TexImageSource;
  readonly left: TexImageSource;
  readonly right: TexImageSource;

  readonly texture: WebGLTexture;
  readonly textureParameterMap: Map<number, number>;

  private constructor(
    top: TexImageSource,
    bottom: TexImageSource,
    front: TexImageSource,
    back: TexImageSource,
    left: TexImageSource,
    right: TexImageSource,
    texture: WebGLTexture,
    textureParameterMap: Map<number, number>
  ) {
    this.top = top;
    this.bottom = bottom;
    this.front = front;
    this.back = back;
    this.left = left;
    this.right = right;
    this.texture = texture;
    this.textureParameterMap = textureParameterMap;
  }

  static create(
    gl: WebGL2RenderingContext,
    top: TexImageSource,
    bottom: TexImageSource,
    front: TexImageSource,
    back: TexImageSource,
    left: TexImageSource,
    right: TexImageSource,
    textureParameterMap = DEFAULT_TEXTURE_PARAMETER_MAP
  ): GLTextureCubeMap | undefined {
    const texture = gl.createTexture();
    if (!texture) {
      console.error('[ERROR] GLTextureCubeMap.create() could not create WebGLTexture');
      return undefined;
    }

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, top);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bottom);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, front);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, back);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, right);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, left);

    for (const [key, value] of textureParameterMap.entries()) {
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, key, value);
    }

    return new GLTextureCubeMap(top, bottom, front, back, left, right, texture, textureParameterMap);
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
  }
}

export {GLTextureCubeMap};
