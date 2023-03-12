const DEFAULT_TEXTURE_PARAMETER_MAP = new Map([
  [WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR],
  [WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR],
  [WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE],
  [WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE]
]);

class GLTexture {
  readonly texture: WebGLTexture;
  readonly source: TexImageSource;
  readonly textureParameterMap: Map<number, number>;

  private constructor(
    texture: WebGLTexture,
    source: TexImageSource,
    textureParameterMap: Map<number, number>
  ) {
    this.texture = texture;
    this.source = source;
    this.textureParameterMap = textureParameterMap;
  }

  static create(
    gl: WebGL2RenderingContext,
    source: TexImageSource,
    textureParameterMap = DEFAULT_TEXTURE_PARAMETER_MAP
  ): GLTexture | undefined {
    const texture = gl.createTexture();
    if (!texture) {
      console.error('[ERROR] GLTexture.create() could not create WebGLTexture');
      return undefined;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    for (const [key, value] of textureParameterMap.entries()) {
      gl.texParameteri(gl.TEXTURE_2D, key, value);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

    return new GLTexture(texture, source, textureParameterMap);
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }
}

export {GLTexture};
