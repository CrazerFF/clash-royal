(() => {
var he = Object.defineProperty;
var ce = (e, r, t) => r in e ? he(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var o = (e, r, t) => (ce(e, typeof r != "symbol" ? r + "" : r, t), t);
var g = /* @__PURE__ */ ((e) => (e.active = "pixi-active", e.inactive = "pixi-inactive", e.stateUpdate = "pixi-state-update", e.pulse = "pixi-pulse", e.panelShown = "devtool:panelShown", e.panelHidden = "devtool:panelHidden", e.pageReload = "devtool:pageReload", e.overlayStateUpdate = "pixi-overlay-state-update", e))(g || {});
class v {
  constructor(r) {
    o(this, "_devtool");
    this._devtool = r;
  }
  init() {
  }
  reset() {
  }
  preupdate() {
  }
  update() {
  }
  throttledUpdate() {
  }
  loop(r) {
  }
  postupdate() {
  }
}
const $ = {
  r8unorm: 1,
  r8snorm: 1,
  r8uint: 1,
  r8sint: 1,
  r16uint: 2,
  r16sint: 2,
  r16float: 2,
  rg8unorm: 2,
  rg8snorm: 2,
  rg8uint: 2,
  rg8sint: 2,
  r32float: 4,
  r32uint: 4,
  r32sint: 4,
  rg16uint: 4,
  rg16sint: 4,
  rg16float: 4,
  rgba8unorm: 4,
  "rgba8unorm-srgb": 4,
  rgba8snorm: 4,
  rgba8uint: 4,
  rgba8sint: 4,
  bgra8unorm: 4,
  "bgra8unorm-srgb": 4,
  rgb10a2unorm: 4,
  rg11b10ufloat: 4,
  rgb9e5ufloat: 4,
  rg32float: 8,
  rg32uint: 8,
  rg32sint: 8,
  rgba16uint: 8,
  rgba16sint: 8,
  rgba16float: 8,
  rgba32float: 16,
  rgba32uint: 16,
  rgba32sint: 16,
  depth16unorm: 2,
  depth24plus: 3,
  "depth24plus-stencil8": 4,
  depth32float: 4,
  stencil8: 1,
  "depth32float-stencil8": 5
}, X = {
  6408: 4,
  6407: 3,
  33319: 2,
  6403: 1,
  36249: 4,
  36248: 3,
  33320: 2,
  36244: 1,
  6406: 1,
  6409: 1,
  6410: 2,
  6402: 1,
  34041: 2
};
class ue extends v {
  constructor() {
    super(...arguments);
    o(this, "_textures", /* @__PURE__ */ new Map());
    o(this, "_gpuTextureSize", /* @__PURE__ */ new Map());
    o(this, "_canvas", document.createElement("canvas"));
    o(this, "_previousData", []);
  }
  init() {
    this._textures.clear(), this._gpuTextureSize.clear();
  }
  reset() {
    this._textures.clear(), this._gpuTextureSize.clear(), this._previousData = [];
  }
  update() {
  }
  get() {
    const t = this._devtool.renderer.texture.managedTextures, s = this.getWebTextures(), i = [];
    if (t.forEach((n) => {
      if (n && n.resource) {
        if (!this._textures.get(n.uid)) {
          const a = this.getTextureSource(n);
          a && this._textures.set(n.uid, a);
        }
        if (!this._gpuTextureSize.has(n.uid)) {
          const a = this.getMemorySize(n, s[n.uid]);
          a && this._gpuTextureSize.set(n.uid, a);
        }
        i.push({
          uid: n.uid,
          name: n.label,
          gpuSize: this._gpuTextureSize.get(n.uid) || 0,
          pixelWidth: n.pixelWidth,
          pixelHeight: n.pixelHeight,
          width: n.width,
          height: n.height,
          mipLevelCount: n.mipLevelCount,
          autoGenerateMipmaps: n.autoGenerateMipmaps,
          format: n.format,
          dimension: n.dimension,
          alphaMode: n.alphaMode,
          antialias: n.antialias,
          destroyed: n.destroyed,
          isPowerOfTwo: n.isPowerOfTwo,
          autoGarbageCollect: n.autoGarbageCollect,
          blob: this._textures.get(n.uid) || null,
          isLoaded: !!s[n.uid]
        });
      }
    }), !("_glTextures" in this._devtool.renderer.texture)) {
      const n = new Set(i.map((a) => a.uid));
      this._previousData.forEach((a) => {
        n.has(a.uid) || i.push({ ...a, isLoaded: !1 });
      }), this._previousData = i.slice();
    }
    return i;
  }
  getWebTextures() {
    const t = this._devtool.renderer;
    let s = {};
    const i = t.texture;
    return "_glTextures" in i || "_gpuSources" in i ? s = "_glTextures" in i ? i._glTextures : i._gpuSources : s = i.managedTextures.reduce(
      (a, l) => {
        if (!l)
          return a;
        const d = l._gpuData[this._devtool.renderer.uid];
        return d && (a[l.uid] = "gpuTexture" in d ? d.gpuTexture : d), a;
      },
      {}
    ), s;
  }
  getTextureSource(t) {
    return t.resource instanceof ImageBitmap || t.resource instanceof HTMLImageElement || t.resource instanceof HTMLVideoElement ? this._imageBitmapToString(t.resource) : t.resource instanceof HTMLCanvasElement ? this._canvasToString(t.resource) : t.uploadMethodId === "image" || t.uploadMethodId === "video" ? t.resizeCanvas ? this._canvasToString(t.resource) : this._imageBitmapToString(t.resource) : null;
  }
  _imageBitmapToString(t) {
    return this._canvas.width = t.width, this._canvas.height = t.height, this._canvas.getContext("2d").drawImage(t, 0, 0), this._canvasToString(this._canvas);
  }
  _canvasToString(t) {
    return t.toDataURL("image/png");
  }
  getMemorySize(t, s) {
    return s ? Array.isArray(t.resource) && t.resource[0] instanceof Uint8Array ? t.resource.reduce((i, n) => i + n.byteLength, 0) : typeof s.format == "string" && $[s.format] ? s.width * s.height * $[s.format] : typeof s.format == "number" && X[s.format] ? s.width * s.height * X[s.format] : null : null;
  }
}
const z = (e) => {
  if (typeof e == "function" || typeof e == "object" && e.extension) {
    if (!e.extension)
      throw new Error("Extension class must have an extension object");
    e = { ...typeof e.extension != "object" ? { type: e.extension } : e.extension, ref: e };
  }
  if (typeof e == "object")
    e = { ...e };
  else
    throw new Error("Invalid extension type");
  return typeof e.type == "string" && (e.type = [e.type]), e;
}, E = (e, r) => z(e).priority ?? r, _ = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...e) {
    return e.map(z).forEach((r) => {
      r.type.forEach((t) => this._removeHandlers[t]?.(r));
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...e) {
    return e.map(z).forEach((r) => {
      r.type.forEach((t) => {
        const s = this._addHandlers, i = this._queue;
        s[t] ? s[t]?.(r) : (i[t] = i[t] || [], i[t]?.push(r));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(e, r, t) {
    const s = this._addHandlers, i = this._removeHandlers;
    if (s[e] || i[e])
      throw new Error(`Extension type ${e} already has a handler`);
    s[e] = r, i[e] = t;
    const n = this._queue;
    return n[e] && (n[e]?.forEach((a) => r(a)), delete n[e]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(e, r) {
    return this.handle(
      e,
      (t) => {
        t.name && (r[t.name] = t.ref);
      },
      (t) => {
        t.name && delete r[t.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(e, r, t = 0) {
    return this.handle(
      e,
      (s) => {
        r.findIndex((n) => n.name === s.name) >= 0 || (r.push({ name: s.name, value: s.ref }), r.sort(
          (n, a) => E(a.value, t) - E(n.value, t)
        ));
      },
      (s) => {
        const i = r.findIndex((n) => n.name === s.name);
        i !== -1 && r.splice(i, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(e, r, t = 0) {
    return this.handle(
      e,
      (s) => {
        r.includes(s.ref) || (r.push(s.ref), r.sort(
          (i, n) => E(n, t) - E(i, t)
        ));
      },
      (s) => {
        const i = r.indexOf(s.ref);
        i !== -1 && r.splice(i, 1);
      }
    );
  }
};
function ge(e, r) {
  return r ? r.BitmapText && e instanceof r.BitmapText : "renderPipeId" in e && e.renderPipeId === "BitmapText" || "_activePagesMeshData" in e;
}
function fe(e, r) {
  return r ? r.HTMLText && e instanceof r.HTMLText : "renderPipeId" in e && e.renderPipeId === "htmlText" || "_foreignObject" in e && "_svgRoot" in e;
}
function te(e, r) {
  return r ? r.Text && e instanceof r.Text : "renderPipeId" in e && e.renderPipeId === "text" || "updateText" in e && "drawLetterSpacing" in e && "_render" in e;
}
function _e(e, r) {
  return r ? r.Mesh && e instanceof r.Mesh : "renderPipeId" in e && e.renderPipeId === "mesh" || "_geometry" in e && "drawMode" in e && "vertexData" in e && "batchUvs" in e;
}
function ye(e, r) {
  return r ? r.Graphics && e instanceof r.Graphics : "renderPipeId" in e && e.renderPipeId === "graphics" || "drawRect" in e && "drawPolygon" in e;
}
function re(e, r) {
  return r ? r.AnimatedSprite && e instanceof r.AnimatedSprite : "gotoAndPlay" in e && "stop" in e && "play" in e && "_isConnectedToTicker" in e;
}
function se(e, r) {
  return r ? r.NineSliceSprite && e instanceof r.NineSliceSprite : "renderPipeId" in e && e.renderPipeId === "nineSliceSprite" || "_leftWidth" in e && "_rightWidth" in e && "_topHeight" in e && "_bottomHeight" in e && "_getMinScale" in e;
}
function ie(e, r) {
  return r ? r.TilingSprite && e instanceof r.TilingSprite : "renderPipeId" in e && e.renderPipeId === "tilingSprite" || "tileTransform" in e && "uvRespectAnchor" in e && "uvMatrix" in e;
}
function me(e, r) {
  return r ? r.Sprite && e instanceof r.Sprite : "renderPipeId" in e && e.renderPipeId === "sprite" || "vertexTrimmedData" in e && "indices" in e;
}
function xe(e, r) {
  return r ? r.Container && e instanceof r.Container : "includeInBuild" in e && "measurable" in e && "_didLocalTransformChangeId" in e || "_maskRefCount" in e && "_render" in e && "_tempDisplayObjectParent" in e;
}
function W(e, r) {
  return r ? r.ParticleContainer && e instanceof r.ParticleContainer : "renderPipeId" in e && e.renderPipeId === "particle" || "particleChildren" in e;
}
function G(e) {
  const r = c.pixi;
  return ge(e, r) ? "BitmapText" : fe(e, r) ? "HTMLText" : te(e, r) ? "Text" : _e(e, r) ? "Mesh" : ye(e, r) ? "Graphics" : re(e, r) ? "AnimatedSprite" : se(e, r) ? "NineSliceSprite" : ie(e, r) ? "TilingSprite" : me(e, r) ? "Sprite" : W(e, r) ? "ParticleContainer" : xe(e, r) ? "Container" : "Unknown";
}
function S(e) {
  const { container: r, ...t } = e;
  ne(r, t);
}
function ne(e, r) {
  const { loop: t, test: s } = r;
  if (!e)
    return;
  const i = s?.(e, e.parent) ?? !0;
  if (i !== !1 && (t(e, e.parent), !(e.children.length === 0 || i === "children")))
    for (let n = 0; n < e.children.length; n++)
      ne(e.children[n], r);
}
function P(e, r) {
  const t = c;
  if (!r.has(e)) {
    const s = t.textures.getTextureSource(e), i = t.textures.getWebTextures(), n = t.textures.getMemorySize(e, i[e.uid]);
    s && r.set(e, {
      blob: s,
      name: e.label,
      gpuSize: n || 0,
      pixelWidth: e.pixelWidth,
      pixelHeight: e.pixelHeight
    });
  }
  return r.get(e);
}
function oe(e) {
  return {
    blend: e.blend,
    blendMode: e.blendMode,
    clockwiseFrontFace: e.clockwiseFrontFace,
    cullMode: e.cullMode,
    culling: e.culling,
    depthMask: e.depthMask,
    depthTest: e.depthTest,
    offsets: e.offsets,
    polygonOffset: e.polygonOffset
  };
}
function b(e) {
  return {
    class: e.constructor.name,
    type: G(e),
    label: e.label,
    position: {
      x: e.position.x,
      y: e.position.y
    },
    width: e.width,
    height: e.height,
    scale: {
      x: e.scale.x,
      y: e.scale.y
    },
    anchor: e.anchor ? {
      x: e.anchor.x,
      y: e.anchor.y
    } : null,
    rotation: e.rotation,
    angle: e.angle,
    pivot: {
      x: e.pivot.x,
      y: e.pivot.y
    },
    skew: {
      x: e.skew.x,
      y: e.skew.y
    },
    visible: e.visible,
    renderable: e.renderable,
    alpha: e.alpha,
    tint: e.tint,
    blendMode: e.blendMode,
    roundPixels: e.roundPixels ?? !1,
    filterArea: e.filterArea ? {
      x: e.filterArea.x,
      y: e.filterArea.y,
      width: e.filterArea.width,
      height: e.filterArea.height
    } : null,
    isRenderGroup: e.isRenderGroup,
    sortableChildren: e.sortableChildren,
    zIndex: e.zIndex,
    boundsArea: e.boundsArea ? {
      x: e.boundsArea.x,
      y: e.boundsArea.y,
      width: e.boundsArea.width,
      height: e.boundsArea.height
    } : null,
    cullable: e.cullable ?? !1,
    cullArea: e.cullArea ? {
      x: e.cullArea.x,
      y: e.cullArea.y,
      width: e.cullArea.width,
      height: e.cullArea.height
    } : null,
    cullableChildren: e.cullableChildren ?? !1
  };
}
function I(e, r, t) {
  const n = e[t === "webgl" ? "glProgram" : "gpuProgram"][r];
  return n ? typeof n == "string" ? n : n.source : "";
}
function ve(e, r) {
  const t = [];
  return e.textures.textures.forEach((s) => {
    if (s == null)
      return;
    const i = P(s, r);
    i && t.push(i);
  }), {
    type: "batch",
    action: e.action,
    blendMode: e.blendMode,
    size: e.size,
    start: e.start,
    drawCalls: 0,
    drawTextures: [],
    textures: t
  };
}
function be(e, r) {
  return {
    type: "customRender",
    action: "custom",
    renderable: {
      ...b(e)
    },
    drawCalls: 0,
    drawTextures: []
  };
}
function we(e, r) {
  return {
    type: "graphics",
    action: "draw",
    renderable: {
      ...b(e)
    },
    drawCalls: 0,
    drawTextures: []
  };
}
function Se(e, r) {
  return {
    type: "nineSlice",
    action: "draw",
    renderable: {
      topHeight: e.topHeight,
      bottomHeight: e.bottomHeight,
      leftWidth: e.leftWidth,
      rightWidth: e.rightWidth,
      texture: e.texture ? P(e.texture._source, r) : null,
      originalWidth: e.originalWidth,
      originalHeight: e.originalHeight,
      ...b(e)
    },
    drawCalls: 0,
    drawTextures: []
  };
}
function Pe(e, r) {
  const t = e.mask?.mask;
  return {
    type: e.renderPipeId,
    action: e.action,
    mask: t ? {
      ...b(t)
    } : null,
    drawCalls: 0,
    drawTextures: []
  };
}
function Te(e, r) {
  const t = c.renderer.name === "webgl" ? "webgl" : "webgpu", s = (i, n) => {
    const a = t === "webgl" ? "glProgram" : "gpuProgram";
    let l;
    if (i.blurXFilter ? l = i.blurXFilter[a] : l = i[a], !l)
      return "";
    const d = l[n];
    return d ? typeof d == "string" ? d : d.source : "";
  };
  return {
    type: "filter",
    action: e.action,
    filter: e.filterEffect?.filters?.map((i) => ({
      type: i.constructor.name,
      padding: i.padding,
      resolution: typeof i.resolution == "number" ? i.resolution : 1,
      antialias: i.antialias,
      blendMode: i.blendMode,
      program: {
        fragment: s(i, "fragment"),
        vertex: s(i, "vertex")
      },
      state: oe(i._state)
    })),
    renderables: e.renderables?.map((i) => ({
      texture: i.texture ? P(i.texture.source, r) : null,
      ...b(i)
    })) || [],
    drawCalls: 0,
    drawTextures: []
  };
}
function Ee(e, r) {
  const t = e?.mesh || e, s = c.renderer.name === "webgl" ? "webgl" : "webgpu";
  let i = t.shader;
  const n = {
    fragment: null,
    vertex: null
  };
  return i ? (n.fragment = I(i, "fragment", s), n.vertex = I(i, "vertex", s)) : (i = c.renderer.renderPipes.mesh._adaptor._shader, n.fragment = I(i, "fragment", s), n.vertex = I(i, "vertex", s)), {
    type: "mesh",
    action: "draw",
    renderable: {
      texture: t.texture ? P(t.texture.source, r) : null,
      program: n,
      state: oe(t.state),
      geometry: {
        indices: Array.from(t.geometry.indices),
        positions: Array.from(t.geometry.positions),
        uvs: Array.from(t.geometry.uvs)
      },
      ...b(t)
    },
    drawCalls: 0,
    drawTextures: []
  };
}
function Ie(e, r) {
  return {
    type: "tilingSprite",
    action: "draw",
    renderable: {
      ...b(e),
      texture: e.texture ? P(e.texture.source, r) : null,
      tilePosition: {
        x: e.tilePosition.x,
        y: e.tilePosition.y
      },
      tileScale: {
        x: e.tileScale.x,
        y: e.tileScale.y
      },
      tileRotation: e.tileRotation,
      clampMargin: e.clampMargin
    },
    drawCalls: 0,
    drawTextures: []
  };
}
function Ce(e, r, t, s, i) {
  const n = new Uint8Array(s * i * 4), a = r.renderTarget.getRenderTarget(r.renderTarget.renderTarget), l = r.renderTarget.getGpuRenderTarget(a);
  e.bindFramebuffer(e.FRAMEBUFFER, l.resolveTargetFramebuffer), e.readPixels(
    0,
    0,
    // Start reading from the bottom left of the framebuffer
    s,
    i,
    // The dimensions of the area you want to read
    e.RGBA,
    // Format of the pixel data
    e.UNSIGNED_BYTE,
    // Type of the pixel data
    n
    // The buffer to read the pixels into
  );
  const d = document.createElement("canvas");
  d.width = s, d.height = i;
  const p = d.getContext("2d"), h = new ImageData(new Uint8ClampedArray(n), s, i);
  p.putImageData(h, 0, 0);
  const y = d.toDataURL("image/webp", 0.5);
  t.push(y);
}
let Me = class {
  constructor() {
    o(this, "frames", 0);
    o(this, "prevTime", 0);
    o(this, "fps", 0);
    o(this, "memory", 0);
    o(this, "maxMemory", 0);
    o(this, "drawCalls", 0);
  }
  update() {
    this.frames++;
    const r = (performance || Date).now();
    if (r >= this.prevTime + 1e3) {
      this.fps = this.frames * 1e3 / (r - this.prevTime), this.prevTime = r, this.frames = 0;
      const t = performance.memory;
      this.memory = t.usedJSHeapSize / 1048576, this.maxMemory = t.jsHeapSizeLimit / 1048576;
    }
  }
  reset() {
    this.frames = 0, this.prevTime = 0, this.fps = 0, this.memory = 0, this.maxMemory = 0, this.drawCalls = 0;
  }
};
class Ae extends v {
  constructor() {
    super(...arguments);
    o(this, "_textureCache", /* @__PURE__ */ new Map());
    o(this, "_glDrawFn");
    o(this, "_batcherBuildStartFn");
    o(this, "_originalBeginRenderPass");
    o(this, "_originalRestoreRenderPass");
    o(this, "_drawOrder", []);
    o(this, "_pipeExecuteFn", /* @__PURE__ */ new Map());
    o(this, "_capturing", !1);
    o(this, "_currentPipe", null);
    o(this, "_withScreenshot", !1);
    o(this, "_canvasTextures", []);
    o(this, "_rebuilt", !1);
    o(this, "stats", new Me());
  }
  reset() {
    if (this._devtool.majorVersion !== "8")
      return;
    const t = this._devtool.renderer;
    if (this._batcherBuildStartFn)
      if (t.renderPipes.batch.buildStart = this._batcherBuildStartFn, t.type === 2) {
        const i = t.encoder;
        i.beginRenderPass = this._originalBeginRenderPass, i.restoreRenderPass = this._originalRestoreRenderPass;
      } else {
        const s = t;
        s.geometry.draw = this._glDrawFn;
      }
  }
  init() {
    if (this._devtool.majorVersion !== "8")
      return;
    this._textureCache.clear(), this.stats.reset(), this._capturing = !1, this._currentPipe = null, this._canvasTextures = [];
    const t = this._devtool.renderer;
    if (this._batcherBuildStartFn = t.renderPipes.batch.buildStart, t.renderPipes.batch.buildStart = (...n) => {
      const a = this._batcherBuildStartFn.apply(t.renderPipes.batch, n);
      return this._rebuilt = !0, a;
    }, t.type === 2) {
      const n = t, a = (d) => {
        const p = l.renderPassEncoder[d];
        l.renderPassEncoder[d] = (...h) => {
          if (this._capturing && this._currentPipe) {
            const T = this._drawOrder.at(-1);
            T && T.drawCalls++;
          }
          const y = p.apply(l.renderPassEncoder, h);
          return this.stats.drawCalls++, !this._capturing || !this._withScreenshot, y;
        };
      }, l = n.encoder;
      this._originalBeginRenderPass = l.beginRenderPass, l.beginRenderPass = (...d) => {
        const p = this._originalBeginRenderPass.apply(l, d);
        return a("draw"), a("drawIndexed"), p;
      }, this._originalRestoreRenderPass = l.restoreRenderPass, l.restoreRenderPass = (...d) => {
        const p = this._originalRestoreRenderPass.apply(l, d);
        return a("draw"), a("drawIndexed"), p;
      };
      return;
    }
    const s = t;
    this._glDrawFn = s.geometry.draw;
    const i = s.gl;
    s.geometry.draw = (...n) => {
      if (this._capturing && this._currentPipe) {
        const p = this._drawOrder.at(-1);
        p && p.drawCalls++;
      }
      const a = this._glDrawFn.apply(s.geometry, n);
      if (this.stats.drawCalls++, !this._capturing || !this._withScreenshot)
        return a;
      const l = i.drawingBufferWidth, d = i.drawingBufferHeight;
      return Ce(i, s, this._canvasTextures, l, d), a;
    };
  }
  update() {
    this._devtool.majorVersion === "8" && (this.stats.drawCalls = 0, this.stats.update());
  }
  captureCanvasData() {
    const t = this._devtool.renderer, s = t, i = t.view.canvas;
    let n = "default", a, l = "", d = "";
    if (t.type !== 2) {
      const h = s.gl.getContextAttributes();
      n = h.powerPreference, a = h.failIfMajorPerformanceCaveat?.toString(), l = h.preserveDrawingBuffer?.toString() ?? "", d = h.premultipliedAlpha?.toString() ?? "";
    }
    const p = {
      type: this._devtool.rendererType,
      width: i.width,
      height: i.height,
      clientWidth: i.clientWidth,
      clientHeight: i.clientHeight,
      browserAgent: navigator.userAgent,
      background: t.background.color.toHex(),
      backgroundAlpha: t.background.alpha.toString(),
      antialias: t.view.antialias.toString(),
      autoDensity: t.view.texture.source.autoDensity.toString(),
      clearBeforeRender: t.background.clearBeforeRender.toString(),
      depth: t.view.renderTarget.depth.toString(),
      powerPreference: n,
      preserveDrawingBuffer: l,
      premultipliedAlpha: d,
      resolution: t.resolution.toString(),
      roundPixels: t.roundPixels.toString(),
      failIfMajorPerformanceCaveat: a
    };
    return "_glTextures" in t.texture || "_gpuSources" in t.texture ? {
      ...p,
      renderableGCActive: t.renderableGC?.enabled.toString(),
      // @ts-expect-error - private properties
      renderableGCFrequency: t.renderableGC?._frequency.toString(),
      renderableGCMaxUnusedTime: t.renderableGC?.maxUnusedTime.toString(),
      textureGCAMaxIdle: t.textureGC.maxIdle.toString(),
      textureGCActive: t.textureGC.active.toString(),
      textureGCCheckCountMax: t.textureGC.checkCountMax.toString()
    } : {
      ...p,
      // @ts-expect-error - newer pixi version
      gcActive: t.gc.enabled.toString(),
      // @ts-expect-error - newer pixi version
      gcMaxUnusedTime: t.gc.maxUnusedTime.toString(),
      // @ts-expect-error - newer pixi version
      gcFrequency: t.gc._frequency.toString()
    };
  }
  captureRenderingData() {
    const t = this._rebuilt ? 1 : 0;
    return this._rebuilt = !1, {
      drawCalls: this.stats.drawCalls,
      fps: Number(this.stats.fps.toFixed(0)),
      rebuildFrequency: t
    };
  }
  capture(t) {
    this._textureCache.clear();
    const s = this._devtool.renderer, i = s.lastObjectRendered, n = i.renderGroup.instructionSet, a = {
      instructions: [],
      drawCalls: 0,
      totals: {
        containers: 0,
        graphics: 0,
        meshes: 0,
        sprites: 0,
        texts: 0,
        tilingSprites: 0,
        nineSliceSprites: 0,
        filters: 0,
        masks: 0
      },
      renderTime: this._getRenderTime(s)
    }, l = this._capture(s, t), d = this._getSceneData(i), p = this._getInstructionsData(n, l, this._drawOrder);
    return a.drawCalls = l.length, a.instructions = p, a.totals = d, a;
  }
  _capture(t, s) {
    this._drawOrder = [], this._pipeExecuteFn.clear(), this._capturing = !0, this._withScreenshot = s, this._currentPipe = null, this._canvasTextures = [];
    const n = t.lastObjectRendered.renderGroup.instructionSet.renderPipes;
    return Object.keys(n).forEach((a) => {
      const l = n[a];
      l.execute && (this._pipeExecuteFn.set(a, l.execute), l.execute = (...d) => (this._currentPipe = a, this._drawOrder.push({ pipe: a, drawCalls: 0 }), this._pipeExecuteFn.get(a).apply(l, d)));
    }), t.render(t.lastObjectRendered), this._postCapture(t), this._canvasTextures;
  }
  _postCapture(t) {
    const s = t.lastObjectRendered.renderGroup.instructionSet.renderPipes;
    Object.keys(s).forEach((i) => {
      const n = s[i];
      n.execute && (n.execute = this._pipeExecuteFn.get(i));
    }), this._capturing = !1;
  }
  _getRenderTime(t) {
    const s = performance.now();
    return t.render(t.lastObjectRendered), performance.now() - s;
  }
  _getSceneData(t) {
    const s = {
      containers: 0,
      graphics: 0,
      meshes: 0,
      sprites: 0,
      texts: 0,
      tilingSprites: 0,
      nineSliceSprites: 0,
      filters: 0,
      masks: 0
    };
    return S({
      container: t,
      loop(i) {
        switch (G(i)) {
          case "Container":
            s.containers++;
            break;
          case "Graphics":
            s.graphics++;
            break;
          case "Mesh":
            s.meshes++;
            break;
          case "Sprite":
          case "AnimatedSprite":
            s.sprites++;
            break;
          case "Text":
          case "BitmapText":
          case "HTMLText":
            s.texts++;
            break;
          case "TilingSprite":
            s.tilingSprites++;
            break;
          case "NineSliceSprite":
            s.nineSliceSprites++;
            break;
        }
        i.effects && (s.filters += Array.isArray(i.effects) ? i.effects.length : 1), i.mask && s.masks++;
      }
    }), s;
  }
  _getInstructionsData(t, s, i, n = 0, a = 0) {
    const l = [];
    l.push({
      type: "Render Group",
      action: "start",
      drawCalls: 0,
      drawTextures: []
    });
    for (let d = 0; d < t.instructionSize; d++) {
      const p = t.instructions[d];
      let h = null;
      switch (p.renderPipeId) {
        case "batch":
          h = ve(p, this._textureCache);
          break;
        case "filter":
          h = Te(p, this._textureCache);
          break;
        case "stencilMask":
        case "alphaMask":
        case "colorMask":
          h = Pe(p, this._textureCache);
          break;
        case "tilingSprite":
          h = Ie(p, this._textureCache);
          break;
        case "mesh":
          h = Ee(p, this._textureCache);
          break;
        case "graphics":
          h = we(p, this._textureCache);
          break;
        case "nineSliceSprite":
          h = Se(p, this._textureCache);
          break;
        case "customRender":
          h = be(p, this._textureCache);
          break;
        case "renderGroup":
          {
            const T = this._getInstructionsData(
              p.instructionSet,
              s,
              i,
              n,
              a + 1
            );
            l.push(...T);
          }
          break;
        default:
          h = {
            type: p.renderPipeId,
            action: p.action ?? "unknown"
          };
          break;
      }
      if (!h)
        continue;
      const y = i[a];
      h.drawCalls = y.drawCalls, n += h.drawCalls, h.drawTextures = s.slice(n - h.drawCalls, n), a++, l.push(h);
    }
    return l.push({
      type: "Render Group",
      action: "end",
      drawCalls: 0,
      drawTextures: []
    }), l;
  }
}
const Re = {
  extension: {
    type: "overlay",
    priority: -1,
    name: "default-overlay"
  },
  getSelectedStyle() {
    return {
      backgroundColor: "hsla(340 70% 44% / 35%)",
      border: "1px solid hsla(0, 0%, 100%, 0.5)"
    };
  },
  getHoverStyle() {
    return {
      backgroundColor: "hsla(192 84% 40% / 40%)",
      border: "1px solid hsla(0, 0%, 100%, 0.5)"
    };
  },
  getGlobalBounds(e) {
    return W(e) ? e.boundsArea ? e.boundsArea : { x: 0, y: 0, width: 0, height: 0 } : e.getBounds();
  }
};
function Ne(e, r = !0) {
  if (!e && r)
    throw new Error("[PixiDevtools] Extension not found.");
  return e;
}
function f(e, r) {
  return e.filter((t) => t[r] !== void 0);
}
function L(e, r, t = !0) {
  return Ne(
    e.find((s) => s[r] !== void 0),
    t
  );
}
const D = class D extends v {
  constructor() {
    super(...arguments);
    o(this, "_extensions", []);
    o(this, "stats", {});
  }
  init() {
    this._extensions = f(D.extensions, "track");
    const t = [];
    for (const i of this._extensions)
      t.push(...i.getKeys());
    const s = t.filter((i, n) => t.indexOf(i) !== n);
    s.length > 0 && console.warn(`[PixiJS Devtools] Stats: Duplicate keys found: ${s.join(", ")}`);
  }
  reset() {
    this.stats = {};
  }
  throttledUpdate() {
    this.stats = {};
  }
  loop(t) {
    for (const s of this._extensions)
      s.track(t, this.stats);
  }
  postupdate() {
    for (const t in this.stats) {
      const s = this.formatCamelCase(t);
      this.stats[s] = this.stats[t], delete this.stats[t];
    }
  }
  formatCamelCase(t) {
    let s = t.replace(/([A-Z])/g, " $1");
    return s = s.charAt(0).toUpperCase() + s.slice(1), s;
  }
};
o(D, "extensions", []);
let R = D;
_.handleByList("stats", R.extensions);
const w = class w extends v {
  constructor(t) {
    super(t);
    o(this, "_canvas");
    o(this, "_overlay");
    o(this, "_selectedHighlight");
    o(this, "_hoverHighlight");
    o(this, "_pickerEnabled", !1);
    o(this, "_highlightEnabled", !1);
    o(this, "_hoveredNode", null);
    // cache the extension for bounds as this happens on every frame
    o(this, "_boundsExt");
    o(this, "_selectedStylesExt");
    o(this, "_hoverStylesExt");
    o(this, "_keydown", !1);
    const s = (n) => {
      n.altKey && window.postMessage({ method: g.overlayStateUpdate, data: { overlayPickerEnabled: !0 } }, "*");
    }, i = (n) => {
      n.altKey || window.postMessage({ method: g.overlayStateUpdate, data: { overlayPickerEnabled: !1 } }, "*");
    };
    window.addEventListener("keydown", s), window.addEventListener("keyup", i);
  }
  init() {
    this._boundsExt = L(w.extensions, "getGlobalBounds");
    const t = this._devtool.canvas;
    this._highlightEnabled = !1, this._pickerEnabled = !1, t !== this._canvas && (this._canvas = t, this._buildOverlay(), this._selectedStylesExt = L(w.extensions, "getSelectedStyle"), this._hoverStylesExt = L(w.extensions, "getHoverStyle"), this._buildHighlight("_selectedHighlight", {}), this._buildHighlight("_hoverHighlight", {}));
  }
  update() {
    this._updateOverlay(), this.enableHighlight(this._highlightEnabled);
  }
  enablePicker(t) {
    this._pickerEnabled = this._keydown ? !0 : t, this._pickerEnabled ? this.activatePick() : this.disablePick();
  }
  activatePick() {
    this._overlay && (this._overlay.style.pointerEvents = "auto");
  }
  disablePick() {
    this._overlay && (this._overlay.style.pointerEvents = "none");
  }
  enableHighlight(t) {
    this._highlightEnabled = t;
    const s = this._devtool.scene.tree.selectedNode;
    !s || !this._highlightEnabled ? this.disableHighlight("_selectedHighlight") : (this.activateHighlight("_selectedHighlight", s), this._updateHighlight(
      "_selectedHighlight",
      this._selectedStylesExt.getSelectedStyle(this._devtool.scene.tree.selectedNode)
    )), !this._hoveredNode || !this._highlightEnabled || this._hoveredNode === s ? this.disableHighlight("_hoverHighlight") : (this.activateHighlight("_hoverHighlight", this._hoveredNode), this._updateHighlight("_hoverHighlight", this._hoverStylesExt.getHoverStyle(this._hoveredNode)));
  }
  activateHighlight(t, s) {
    const i = this._boundsExt.getGlobalBounds(s);
    Object.assign(this[t].style, {
      transform: `translate(${i.x}px, ${i.y}px)`,
      width: `${i.width}px`,
      height: `${i.height}px`
    });
  }
  disableHighlight(t) {
    this[t] && (this[t].style.transform = "scale(0)");
  }
  highlight(t) {
    const s = this._devtool.scene.tree._idMap.get(t);
    if (s === this._devtool.scene.tree.selectedNode) {
      this._hoveredNode = null, this.disableHighlight("_hoverHighlight");
      return;
    }
    if (this._hoveredNode = s || null, !s) {
      this.disableHighlight("_hoverHighlight");
      return;
    }
    this._highlightEnabled && this.activateHighlight("_hoverHighlight", s);
  }
  _buildOverlay() {
    this._overlay = document.createElement("div"), Object.assign(this._overlay.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "0",
      height: "0",
      pointerEvents: "none",
      transformOrigin: "top left"
    });
    let t = this._canvas;
    for (; t; )
      if (t = t?.parentElement, t?.tagName === "BODY") {
        t.appendChild(this._overlay);
        break;
      }
    this._overlay.addEventListener("click", (s) => {
      this._hitTest(s);
    });
  }
  _buildHighlight(t, s) {
    const i = document.createElement("div");
    Object.assign(i.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "0",
      height: "0",
      pointerEvents: "none",
      transformOrigin: "top left",
      ...s
    }), this._overlay.appendChild(i), this[t] = i;
  }
  _updateHighlight(t, s) {
    Object.assign(this[t].style, s);
  }
  _updateOverlay() {
    const t = this._devtool.canvas, s = this._devtool.renderer, n = this._devtool.majorVersion === "8" ? 1 : s.resolution;
    Object.assign(this._overlay.style, {
      width: `${s.width / n}px`,
      height: `${s.height / n}px`
    });
    const a = t.getBoundingClientRect();
    this._overlay.style.transform = "";
    const l = this._overlay.getBoundingClientRect();
    Object.assign(this._overlay.style, {
      transform: `translate(${a.x - l.x}px, ${a.y - l.y}px) scale(${a.width / l.width}, ${a.height / l.height})`
    });
  }
  _hitTest(t) {
    if (!this._pickerEnabled)
      return;
    const s = this._devtool.renderer, i = /* @__PURE__ */ new Map();
    S({
      container: this._devtool.stage,
      loop: (l) => {
        i.set(l, l.eventMode === void 0 ? l.interactive : l.eventMode), l.interactive = !l.__devtoolLocked;
      }
    });
    const n = { x: 0, y: 0 };
    s.events.mapPositionToPoint(n, t.clientX, t.clientY);
    const a = s.events.rootBoundary.hitTest(n.x, n.y);
    S({
      container: this._devtool.stage,
      loop: (l) => {
        l.eventMode === void 0 ? l.interactive = i.get(l) : l.eventMode = i.get(l);
      }
    }), a && (this._devtool.scene.tree.setSelectedFromNode(a), this.enablePicker(!1));
  }
};
o(w, "extensions", []);
let N = w;
_.handleByList("overlay", N.extensions);
let F = /* @__PURE__ */ new WeakMap(), q = 0;
const u = class u extends v {
  constructor() {
    super(...arguments);
    o(this, "_sceneGraph", /* @__PURE__ */ new Map());
    o(this, "_stageNode", null);
    o(this, "_idMap", /* @__PURE__ */ new Map());
    o(this, "selectedNode", null);
    o(this, "_metadataExtensions", []);
    o(this, "_onButtonPressExtensions", []);
    o(this, "_onContextMenuExtensions", []);
    o(this, "_onRenameExtensions", []);
    o(this, "_onDeletedExtensions", []);
    o(this, "_onSwapExtensions", []);
    o(this, "_onSelectedExtensions", []);
    o(this, "_treePanelButtons", []);
  }
  init() {
    F = /* @__PURE__ */ new WeakMap(), q = 0, this._metadataExtensions = f(u.extensions, "updateNodeMetadata"), this._onButtonPressExtensions = f(u.extensions, "onButtonPress"), this._onContextMenuExtensions = f(u.extensions, "onContextButtonPress"), this._onRenameExtensions = f(u.extensions, "onRename"), this._onDeletedExtensions = f(u.extensions, "onDeleted"), this._onSwapExtensions = f(u.extensions, "onSwap"), this._onSelectedExtensions = f(u.extensions, "onSelected"), this._treePanelButtons = f(u.extensions, "panelButtons"), this.selectedNode = null, this._idMap.clear(), this._sceneGraph.clear(), this._stageNode = null;
  }
  getSceneGraph() {
    return !this._devtool.stage || this._devtool.renderer.lastObjectRendered !== this._devtool.stage ? null : (this.clear(), S({
      container: this._devtool.stage,
      loop: (t) => {
        this.updateLoop(t);
      },
      test: (t) => t.__devtoolIgnore ? !1 : t.__devtoolIgnoreChildren ? "children" : !0
    }), this.selectedNode && !this._sceneGraph.has(this.selectedNode) && (this.selectedNode = null, window.$pixi = null), {
      sceneGraph: this._stageNode,
      selectedNode: this.selectedNode ? this._sceneGraph.get(this.selectedNode).id : null,
      sceneTreeData: { buttons: this._treePanelButtons.map((t) => t.panelButtons).flat() }
    });
  }
  getSelectedNode() {
    return this.selectedNode ? this._sceneGraph.get(this.selectedNode).id : null;
  }
  clear() {
    this._sceneGraph.clear(), this._idMap.clear(), this._stageNode = null;
  }
  updateLoop(t, s = !0) {
    const i = this._devtool.stage, n = G(t), { suffix: a, name: l } = this._getName(t), d = {
      id: this._getId(t),
      name: l,
      children: [],
      metadata: {
        type: n,
        locked: t.__devtoolLocked,
        uid: this._getId(t),
        suffix: a,
        buttons: [],
        contextMenu: []
      }
    };
    if (this._metadataExtensions.forEach((p) => {
      p.updateNodeMetadata(t, d.metadata);
    }), this._idMap.set(d.id, t), t === i) {
      this._stageNode = d, this._sceneGraph.set(t, d);
      return;
    }
    s && (this._sceneGraph.get(t.parent)?.children.push(d), this._sceneGraph.set(t, d));
  }
  nodeButtonPress(t, s, i) {
    const n = this._idMap.get(t);
    n && (s === "locked" && (n.__devtoolLocked = i), this._onButtonPressExtensions.forEach((a) => {
      a.onButtonPress(n, s, i);
    }));
  }
  treePanelButtonPress(t) {
    this._onButtonPressExtensions.forEach((s) => {
      s.onButtonPress(this._devtool.stage, t);
    });
  }
  nodeContextMenu(t, s) {
    const i = this._idMap.get(t);
    i && this._onContextMenuExtensions.forEach((n) => {
      n.onContextButtonPress(i, s);
    });
  }
  setSelected(t) {
    if (t == null) {
      this.selectedNode = null;
      return;
    }
    this.selectedNode = this._idMap.get(t) ?? null, window.$pixi = this.selectedNode, this._onSelectedExtensions.forEach((s) => {
      s.onSelected(this.selectedNode);
    });
  }
  setSelectedFromNode(t) {
    this.selectedNode = t, window.$pixi = t, this._onSelectedExtensions.forEach((s) => {
      s.onSelected(t);
    });
  }
  moveNode(t, s, i) {
    const n = this._idMap.get(t), a = this._idMap.get(s);
    !n || !a || n.__devtoolLocked || (n.parent?.removeChild(n), a.addChildAt(n, i), this._onSwapExtensions.forEach((l) => {
      l.onSwap(n, i);
    }));
  }
  renameNode(t, s) {
    const i = this._idMap.get(t);
    i && (i.__devtoolLocked || (this._devtool.majorVersion === "8" ? i.label = s : i.name = s, this._onRenameExtensions.forEach((n) => {
      n.onRename(i, s);
    })));
  }
  deleteNode(t) {
    const s = this._idMap.get(t);
    s && (s.__devtoolLocked || (s.parent?.removeChild(s), this._onDeletedExtensions.forEach((i) => {
      i.onDeleted(s);
    })));
  }
  logSelected() {
    window.$pixi && console.log(window.$pixi);
  }
  _getName(t) {
    let s = t.constructor.name;
    s.startsWith("_") && (s = s.slice(1));
    const i = this._devtool.stage, n = this._devtool.majorVersion === "8" ? t.label : t.name, l = n === s || !n ? s : n;
    return { suffix: n ? ` (${i === t ? "Stage" : s})` : i === t ? " (Stage)" : "", name: l };
  }
  _getId(t) {
    const s = F.get(t);
    if (s)
      return s;
    const i = `${q++}_${(Math.random() + 1).toString(36).substring(2)}`;
    return F.set(t, i), i;
  }
};
o(u, "extensions", []);
let k = u;
_.handleByList("sceneTree", k.extensions);
const O = class O extends v {
  constructor() {
    super(...arguments);
    o(this, "_extensions");
  }
  init() {
    this._extensions = O.extensions;
  }
  setValue(t, s) {
    const i = this._devtool.scene.tree.selectedNode;
    i && this._extensions.forEach((n) => {
      n.testNode(i) && n.testProp(t) && n.setProperty(i, t, s);
    });
  }
  getActiveProps() {
    const t = this._devtool.scene.tree.selectedNode;
    return !t || t.__devtoolLocked ? void 0 : this._extensions.reduce(
      (i, n) => (n.testNode(t) && i.push(...n.getProperties(t)), i),
      []
    ) || [];
  }
};
o(O, "extensions", []);
let H = O;
_.handleByList("sceneProperties", H.extensions);
class ke extends v {
  // scene state
  // public get stats(){
  //   return this.stats.stats;
  // }
  constructor(t) {
    super(t);
    o(this, "stats");
    o(this, "overlay");
    o(this, "tree");
    o(this, "properties");
    this.stats = new R(t), this.overlay = new N(t), this.tree = new k(t), this.properties = new H(t);
  }
  init() {
    this.stats.init(), this.overlay.init(), this.tree.init(), this.properties.init();
  }
  reset() {
    this.stats.reset(), this.overlay.reset(), this.tree.reset(), this.properties.reset();
  }
  preupdate() {
    this.stats.preupdate(), this.overlay.preupdate(), this.tree.preupdate(), this.properties.preupdate();
  }
  loop(t) {
    this.stats.loop(t), this.tree.loop(t);
  }
  postupdate() {
    this.stats.postupdate(), this.overlay.postupdate(), this.tree.postupdate(), this.properties.postupdate();
  }
  throttledUpdate() {
    this.stats.throttledUpdate(), this.overlay.throttledUpdate(), this.tree.throttledUpdate(), this.properties.throttledUpdate();
  }
  update() {
    this.stats.update(), this.overlay.update(), this.tree.update(), this.properties.update();
  }
  getStats() {
    return this.stats.stats;
  }
}
const He = {
  extension: {
    type: "stats",
    name: "default-stats-total"
  },
  track: (e, r) => {
    r.total = (r.total || 0) + 1;
  },
  getKeys: () => ["total"]
}, K = {
  Container: "container",
  Sprite: "sprite",
  Graphics: "graphics",
  Mesh: "mesh",
  Text: "text",
  BitmapText: "bitmapText",
  HTMLText: "htmlText",
  AnimatedSprite: "animatedSprite",
  NineSliceSprite: "nineSliceSprite",
  TilingSprite: "tilingSprite",
  ParticleContainer: "particleContainer"
}, Be = {
  extension: {
    type: "stats",
    name: "default-stats-pixi"
  },
  track(e, r) {
    const t = G(e), s = K[t];
    s && (r[s] = (r[s] || 0) + 1);
  },
  getKeys: () => Object.values(K)
}, De = [
  { prop: "animationSpeed", entry: { section: "Animated Sprite", type: "number" } },
  { prop: "loop", entry: { section: "Animated Sprite", type: "boolean" } },
  { prop: "updateAnchor", entry: { section: "Animated Sprite", type: "boolean" } },
  {
    prop: "totalFrames",
    entry: { section: "Animated Sprite", type: "number", options: { disabled: !0 } }
  },
  { prop: "currentFrame", entry: { section: "Animated Sprite", type: "number" } },
  { prop: "autoUpdate", entry: { section: "Animated Sprite", type: "boolean" } },
  { prop: "playing", entry: { section: "Animated Sprite", type: "boolean" } },
  {
    prop: "gotoAndPlay",
    entry: { section: "Animated Sprite", type: "button", label: "start" }
  },
  { prop: "stop", entry: { section: "Animated Sprite", type: "button", label: "stop" } },
  { prop: "play", entry: { section: "Animated Sprite", type: "button", label: "play" } }
], Oe = {
  extension: {
    type: "sceneProperties",
    name: "default-animated-sprite-properties",
    priority: 0
  },
  properties() {
    return De;
  },
  testNode(e) {
    return re(e, c.pixi);
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop;
      let n = e[i];
      return n != null && (i === "gotoAndPlay" || i === "stop" || i === "play") && (n = !0), n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    r === "gotoAndPlay" ? e.gotoAndPlay(0) : r === "stop" ? e.stop() : r === "play" ? e.play() : e[r] = t;
  }
}, m = (e) => [e.x, e.y], C = (e) => [e.x, e.y, e.width, e.height], Ge = (e) => [e.a, e.b, e.c, e.d, e.tx, e.ty], x = (e, r, t) => e[r].set(t[0], t[1]), M = (e, r, t) => {
  e[r].x = t[0], e[r].y = t[1], e[r].width = t[2], e[r].height = t[3];
}, Le = (e, r, t) => e[r].fromArray(t), ae = [
  { prop: "type", entry: { section: "Info", options: { disabled: !0 }, type: "text" } },
  // not editable
  {
    prop: "position",
    entry: { section: "Transform", options: { x: { label: "x" }, y: { label: "y" } }, type: "vector2" }
  },
  { prop: "width", entry: { section: "Transform", type: "number" } },
  { prop: "height", entry: { section: "Transform", type: "number" } },
  {
    prop: "scale",
    entry: { section: "Transform", options: { x: { label: "x" }, y: { label: "y" } }, type: "vector2" }
  },
  { prop: "rotation", entry: { section: "Transform", type: "number" } },
  { prop: "angle", entry: { section: "Transform", type: "number" } },
  {
    prop: "pivot",
    entry: { section: "Transform", options: { x: { label: "x" }, y: { label: "y" } }, type: "vector2" }
  },
  {
    prop: "skew",
    entry: { section: "Transform", options: { x: { label: "x" }, y: { label: "y" } }, type: "vector2" }
  },
  // {
  //   prop: 'worldTransform',
  //   entry: {
  //     section: 'Transform',
  //     options: {
  //       inputs: [
  //         { label: 'a', disabled: true },
  //         { label: 'b', disabled: true },
  //         { label: 'c', disabled: true },
  //         { label: 'd', disabled: true },
  //         { label: 'tx', disabled: true },
  //         { label: 'ty', disabled: true },
  //       ],
  //     },
  //     type: 'vectorX',
  //   },
  // },
  { prop: "visible", entry: { section: "Appearance", type: "boolean" } },
  { prop: "renderable", entry: { section: "Appearance", type: "boolean" } },
  {
    prop: "alpha",
    entry: { section: "Appearance", options: { min: 0, max: 1, step: 0.05 }, type: "range" }
  },
  { prop: "tint", entry: { section: "Appearance", type: "color" } },
  {
    prop: "filterArea",
    entry: {
      section: "Rendering",
      options: { inputs: [{ label: "x" }, { label: "y" }, { label: "width" }, { label: "height" }] },
      type: "vectorX"
    }
  },
  { prop: "sortableChildren", entry: { section: "Sorting", type: "boolean" } },
  { prop: "zIndex", entry: { section: "Sorting", type: "number" } },
  { prop: "interactive", entry: { section: "Interaction", type: "boolean" } },
  { prop: "interactiveChildren", entry: { section: "Interaction", type: "boolean" } },
  {
    prop: "hitArea",
    entry: {
      section: "Interaction",
      options: {
        inputs: [{ label: "x" }, { label: "y" }, { label: "width" }, { label: "height" }]
      },
      type: "vectorX"
    }
  },
  {
    prop: "eventMode",
    entry: {
      section: "Interaction",
      options: {
        options: ["none", "passive", "auto", "static", "dynamic"]
      },
      type: "select"
    }
  },
  {
    prop: "cursor",
    entry: {
      section: "Interaction",
      options: {
        options: [
          "auto",
          "default",
          "none",
          "context-menu",
          "help",
          "pointer",
          "progress",
          "wait",
          "cell",
          "crosshair",
          "text",
          "vertical-text",
          "alias",
          "copy",
          "move",
          "no-drop",
          "not-allowed",
          "e-resize",
          "n-resize",
          "ne-resize",
          "nw-resize",
          "s-resize",
          "se-resize",
          "sw-resize",
          "w-resize",
          "ns-resize",
          "ew-resize",
          "nesw-resize",
          "col-resize",
          "nwse-resize",
          "row-resize",
          "all-scroll",
          "zoom-in",
          "zoom-out",
          "grab",
          "grabbing"
        ]
      },
      type: "select"
    }
  }
], j = {
  normal: 0,
  add: 1,
  multiply: 2,
  screen: 3,
  overlay: 4,
  darken: 5,
  lighten: 6,
  colorDodge: 7,
  colorBurn: 8,
  hardLight: 9,
  softLight: 10,
  difference: 11,
  exclusion: 12,
  hue: 13,
  saturation: 14,
  color: 15,
  luminosity: 16,
  none: 20
}, Fe = [
  ...ae,
  { prop: "name", entry: { section: "Info", type: "text" } },
  {
    prop: "blendMode",
    entry: {
      section: "Appearance",
      options: {
        options: [
          "normal",
          "add",
          "multiply",
          "screen",
          "overlay",
          "darken",
          "lighten",
          "color-dodge",
          "color-burn",
          "hard-light",
          "soft-light",
          "difference",
          "exclusion",
          "hue",
          "saturation",
          "color",
          "luminosity",
          "none"
        ]
      },
      type: "select"
    }
  }
], je = [
  ...ae,
  { prop: "label", entry: { section: "Info", type: "text" } },
  {
    prop: "blendMode",
    entry: {
      section: "Appearance",
      tooltip: `To use certain modes, enable them as follows:
{{import 'pixi.js/advanced-blend-modes';}}`,
      options: {
        options: [
          "inherit",
          "normal",
          "add",
          "multiply",
          "screen",
          "overlay",
          "darken",
          "lighten",
          "color-dodge",
          "color-burn",
          "hard-light",
          "soft-light",
          "difference",
          "exclusion",
          "hue",
          "saturation",
          "color",
          "luminosity",
          "none",
          "erase",
          "subtract",
          "linear-burn",
          "linear-dodge",
          "linear-light",
          "pin-light",
          "divide",
          "vivid-light",
          "hard-mix",
          "negation"
        ]
      },
      type: "select"
    }
  },
  {
    prop: "boundsArea",
    entry: {
      section: "Rendering",
      options: {
        inputs: [{ label: "x" }, { label: "y" }, { label: "width" }, { label: "height" }]
      },
      type: "vectorX"
    }
  },
  { prop: "isRenderGroup", entry: { section: "Rendering", type: "boolean" } },
  { prop: "cullable", entry: { section: "Culling", type: "boolean" } },
  {
    prop: "cullArea",
    entry: {
      section: "Culling",
      options: {
        inputs: [{ label: "x" }, { label: "y" }, { label: "width" }, { label: "height" }]
      },
      type: "vectorX"
    }
  },
  { prop: "cullableChildren", entry: { section: "Culling", type: "boolean" } }
];
function V(e, r) {
  return c.majorVersion === "7" ? e : r;
}
const J = {
  position: m,
  scale: m,
  pivot: m,
  skew: m,
  filterArea: C,
  boundsArea: C,
  cullArea: C,
  hitArea: C,
  worldTransform: Ge
}, Y = {
  position: x,
  scale: x,
  pivot: x,
  skew: x,
  filterArea: M,
  boundsArea: M,
  cullArea: M,
  hitArea: M,
  worldTransform: Le
}, ze = {
  extension: {
    type: "sceneProperties",
    name: "default-container-properties",
    priority: 0
  },
  properties() {
    return V(Fe, je);
  },
  testNode() {
    return !0;
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop;
      let n = e[i];
      return i === "type" ? n = e.constructor.name : i === "blendMode" && c.majorVersion === "7" ? n = Object.keys(j).find((a) => j[a] === n) : n != null && J[i] && (n = J[i](n)), n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    Y[r] ? Y[r](e, r, t) : r === "blendMode" && c.majorVersion === "7" ? e[r] = j[t] : e[r] = t;
  }
}, le = [
  {
    prop: "anchor",
    entry: { section: "Transform", options: { x: { label: "x" }, y: { label: "y" } }, type: "vector2" }
  },
  { prop: "roundPixels", entry: { section: "Transform", type: "boolean" } },
  {
    prop: "batched",
    entry: {
      section: "Rendering",
      options: { label: "Batched", disabled: !0 },
      type: "boolean"
    }
  }
], Ue = [...le], We = [
  { prop: "leftWidth", entry: { section: "NineSlice Sprite", type: "number" } },
  { prop: "rightWidth", entry: { section: "NineSlice Sprite", type: "number" } },
  { prop: "topHeight", entry: { section: "NineSlice Sprite", type: "number" } },
  {
    prop: "bottomHeight",
    entry: {
      section: "NineSlice Sprite",
      type: "number"
    }
  }
], Ve = [
  ...We,
  {
    prop: "originalWidth",
    entry: {
      section: "NineSlice Sprite",
      type: "number"
    }
  },
  {
    prop: "originalHeight",
    entry: {
      section: "NineSlice Sprite",
      type: "number"
    }
  }
], $e = {
  extension: {
    type: "sceneProperties",
    name: "default-nineslice-properties",
    priority: 0
  },
  properties() {
    return V(Ue, Ve);
  },
  testNode(e) {
    return se(e, c.pixi);
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop, n = e[i];
      return n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    e[r] = t;
  }
}, Xe = [
  { prop: "text", entry: { section: "Text", type: "text" } },
  // { section: 'Text', property: 'style', propertyProps: { label: 'Style' }, type: 'text' },
  { prop: "resolution", entry: { section: "Text", type: "number" } }
], qe = {
  extension: {
    type: "sceneProperties",
    name: "default-text-properties",
    priority: 0
  },
  properties() {
    return Xe;
  },
  testNode(e) {
    return te(e, c.pixi);
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop, n = e[i];
      return n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    e[r] = t;
  }
}, de = [
  {
    prop: "tilePosition",
    entry: {
      section: "Tiling Sprite",
      options: { x: { label: "x" }, y: { label: "y" } },
      type: "vector2"
    }
  },
  {
    prop: "tileScale",
    entry: {
      section: "Tiling Sprite",
      options: { x: { label: "x" }, y: { label: "y" } },
      type: "vector2"
    }
  },
  { prop: "tileRotation", entry: { section: "Tiling Sprite", type: "number" } },
  { prop: "clampMargin", entry: { section: "Tiling Sprite", type: "number" } }
], Ke = [
  ...de,
  { value: null, prop: "uvRespectAnchor", entry: { section: "Transform", type: "boolean" } }
], Je = [...de], Z = {
  tilePosition: m,
  tileScale: m
}, Q = {
  tilePosition: x,
  tileScale: x
}, Ye = {
  extension: {
    type: "sceneProperties",
    name: "default-tiling-sprite-properties",
    priority: 0
  },
  properties() {
    return V(Ke, Je);
  },
  testNode(e) {
    return ie(e, c.pixi);
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop;
      let n = e[i];
      return n != null && Z[i] && (n = Z[i](n)), n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    Q[r] ? Q[r](e, r, t) : e[r] = t;
  }
}, Ze = {
  extension: {
    type: "sceneProperties",
    name: "default-view-properties",
    priority: 0
  },
  properties() {
    return le;
  },
  testNode() {
    return !0;
  },
  testProp(e) {
    return this.properties().some((r) => e.startsWith(r.prop));
  },
  getProperties(e) {
    return this.properties().reduce((t, s) => {
      const i = s.prop;
      let n = e[i];
      return n != null && i === "anchor" && (n = m(n)), n == null && s.allowUndefined !== !0 || t.push({
        ...s,
        value: n
      }), t;
    }, []);
  },
  setProperty(e, r, t) {
    r === "anchor" ? x(e, r, t) : e[r] = t;
  }
};
class Qe {
  constructor() {
    o(this, "lastUpdateTime");
    this.lastUpdateTime = 0;
  }
  shouldExecute(r) {
    const t = Date.now();
    return t - this.lastUpdateTime >= r ? (this.lastUpdateTime = t, !0) : !1;
  }
}
class et {
  constructor() {
    o(this, "settings", {
      throttle: 100
    });
    o(this, "state", {
      version: null,
      setVersion: function(r) {
        this.version = r;
      }
    });
    o(this, "textures", new ue(this));
    o(this, "rendering", new Ae(this));
    o(this, "scene", new ke(this));
    // Private properties
    o(this, "_devtools");
    o(this, "_app");
    o(this, "_stage");
    o(this, "_renderer");
    o(this, "_canvas");
    o(this, "_pixi");
    o(this, "_version");
    o(this, "_updateThrottle", new Qe());
    o(this, "_initialized", !1);
    o(this, "_originalRenderFn");
  }
  /**
   * Searches for a property in the window and its frames.
   * @param props - The properties to search for.
   * @returns The found property or undefined if not found.
   */
  searchIFrames(r) {
    for (const t of r) {
      if (window[t])
        return window[t];
      if (window.frames)
        for (let s = 0; s < window.frames.length; s += 1)
          try {
            if (window.frames[s][t])
              return window.frames[s][t];
          } catch {
          }
    }
  }
  get devtools() {
    if (this._devtools)
      return this._devtools;
    if (this._devtools = this.searchIFrames(["__PIXI_DEVTOOLS__"]), !this._devtools)
      return;
    const r = this._devtools.extensions || [];
    return this._devtools.extensions = r, this._devtools.extensions.forEach((t) => {
      _.add(t);
    }), this._devtools;
  }
  /**
   * Gets the PixiJS Application.
   */
  get app() {
    return this._app ? this._app : (this._app = this.devtools?.app, this._app ? this._app : (this._app = this.searchIFrames(["__PIXI_APP__"]), this._app));
  }
  /**
   * Gets the PixiJS Stage.
   */
  get stage() {
    return this._stage ? this._stage : (this._stage = this.devtools?.stage, this._stage ? this._stage : (this._stage = this.searchIFrames(["__PIXI_STAGE__"]), this._stage ? this._stage : (this._stage = this.app?.stage, this._stage ? this._stage : (this._stage = this.renderer?.lastObjectRendered, this._stage))));
  }
  /**
   * Gets the PixiJS Renderer.
   */
  get renderer() {
    return this._renderer ? this._renderer : (this._renderer = this.devtools?.renderer, this._renderer ? this._renderer : (this._renderer = this.searchIFrames(["__PIXI_RENDERER__"]), this._renderer ? this._renderer : (this._renderer = this.app?.renderer, this._renderer)));
  }
  /**
   * Gets the PixiJS Canvas.
   */
  get canvas() {
    if (this._canvas)
      return this._canvas;
    const r = this.renderer, s = ["canvas", "view"].find((i) => r && i in r);
    return this._canvas = s ? r[s] : void 0, this._canvas;
  }
  /**
   * Gets the PixiJS library.
   */
  get pixi() {
    return this._pixi ? this._pixi : (this._pixi = this.devtools?.pixi, this._pixi ? this._pixi : (this._pixi = this.searchIFrames(["PIXI", "__PIXI__"]), this._pixi));
  }
  /**
   * Gets the PixiJS version.
   */
  get version() {
    return this._version ? this._version : (this._version = this._devtools?.version ?? this.pixi?.VERSION ?? "", this._version);
  }
  /**
   * Gets the major version of PixiJS.
   */
  get majorVersion() {
    if (this.version === "") {
      if (!this.stage)
        return null;
      const r = this.stage;
      return r.effects != null && Array.isArray(r.effects) && "_updateFlags" in r ? "8" : "7";
    }
    return this.version.split(".")[0];
  }
  /**
   * Checks if PixiJS is active.
   * @returns A message indicating if PixiJS is active or not.
   */
  get isPixiActive() {
    return this.app || this.stage && this.renderer ? g.active : g.inactive;
  }
  /**
   * Gets the type of renderer being used.
   */
  get rendererType() {
    return this.renderer ? this.renderer.type === 2 ? "webgpu" : this.renderer.context.webGLVersion === 1 ? "webgl" : "webgl2" : null;
  }
  /**
   * Inject into the renderers render method.
   */
  inject() {
    const r = this;
    this.renderer && !this.renderer.__devtoolInjected && (this.renderer.__devtoolInjected = !0, this._originalRenderFn = this.renderer.render, this.renderer.render = new Proxy(this.renderer.render, {
      apply(t, s, ...i) {
        return r.update(), t.apply(s, ...i);
      }
    }), window.postMessage({ method: g.active, data: {} }, "*"));
  }
  reset() {
    this.renderer && this._originalRenderFn && (this.renderer.render = this._originalRenderFn), this.renderer && (this.renderer.__devtoolInjected = !1), this.rendering.reset(), this.scene.reset(), this.textures.reset(), this._resetState(), this._devtools = void 0, this._app = void 0, this._stage = void 0, this._renderer = void 0, this._canvas = void 0, this._pixi = void 0, this._version = void 0, this._initialized = !1, window.postMessage({ method: g.pulse, data: {} }, "*");
  }
  update() {
    this._initialized || this.init(), this.preupdate(), this._update(), this._updateThrottle.shouldExecute(this.settings.throttle) && (this.updatedThrottled(), this.renderer.lastObjectRendered === this.stage && S({
      container: this.stage,
      loop: (r) => {
        this.updateLoop(r);
      },
      test: (r) => r.__devtoolIgnore ? !1 : r.__devtoolIgnoreChildren || W(r) ? "children" : !0
    }), this.postupdate());
  }
  init() {
    this.scene.init(), this.textures.init(), this.rendering.init(), this._initialized = !0;
  }
  _resetState() {
    this.state.setVersion(this.version === "" ? `>${this.majorVersion}.0.0` : this.version);
  }
  preupdate() {
    this._resetState(), this.scene.preupdate(), this.textures.preupdate(), this.rendering.preupdate();
  }
  _update() {
    this.scene.update(), this.textures.update(), this.rendering.update();
  }
  updatedThrottled() {
    this.scene.throttledUpdate(), this.textures.throttledUpdate(), this.rendering.throttledUpdate();
  }
  updateLoop(r) {
    this.scene.loop(r), this.textures.loop(r), this.rendering.loop(r);
  }
  postupdate() {
    this.scene.postupdate(), this.textures.postupdate(), this.rendering.postupdate();
    try {
      window.postMessage({ method: g.stateUpdate, data: JSON.stringify(this.state) }, "*");
    } catch (r) {
      throw new Error(`[PixiJS Devtools] Error posting state update: ${r.message}`);
    }
  }
}
_.add(Re);
_.add(He, Be);
_.add(
  ze,
  Ze,
  qe,
  $e,
  Ye,
  Oe
);
const c = new et();
window.__PIXI_DEVTOOLS_WRAPPER__ = c;
const tt = 10, rt = 1e3;
let B, ee = 0;
function st(e, r, t) {
  return B = window.setInterval(() => {
    if (ee > tt) {
      U(), t && t();
      return;
    }
    r && r(), it(e), ee += 1;
  }, rt), B;
}
function U() {
  B && clearInterval(B);
}
function it(e) {
  try {
    const r = c.isPixiActive;
    r === g.active ? (U(), e()) : window.postMessage({ method: r, data: JSON.stringify({}) }, "*");
  } catch {
    U();
  }
}
function nt(e, r) {
  return { method: e, data: JSON.stringify(r) };
}
function ot() {
  window.postMessage(nt(g.active, {}), "*");
}
function at() {
  if (window.frames)
    for (let e = 0; e < window.frames.length; e += 1)
      try {
        const r = window.frames[e];
        r.__PIXI_APP_INIT__ = A, r.__PIXI_RENDERER_INIT__ = A;
      } catch {
      }
  return window.__PIXI_APP_INIT__ = A, window.__PIXI_RENDERER_INIT__ = A, null;
}
function A(e, r) {
  const t = e.stage, s = t ? e.renderer : e;
  window.__PIXI_DEVTOOLS__ = {
    ...window.__PIXI_DEVTOOLS__,
    renderer: s,
    stage: t,
    version: r
  }, window.__PIXI_DEVTOOLS_WRAPPER__?.reset();
}
const pe = () => {
  at(), requestAnimationFrame(pe);
};
pe();
st(ot);
})()