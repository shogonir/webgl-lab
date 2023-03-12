// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"dKxsn":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "dfc838fc75320e57";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets, assetsToDispose, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets); // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                } // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle, id) {
    // Execute the module.
    bundle(id); // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            }); // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"jyKRr":[function(require,module,exports) {
var _lab = require("./lab/Lab");
const zeroPadding = (value)=>{
    return ("00" + `${value}`).slice(-2);
};
const main = ()=>{
    const now = new Date();
    const hours = zeroPadding(now.getHours());
    const minutes = zeroPadding(now.getMinutes());
    const seconds = zeroPadding(now.getSeconds());
    console.log(`started at ${hours}:${minutes}:${seconds}`);
    const lab = (0, _lab.Lab).create("#lab");
};
main();

},{"./lab/Lab":"jwNHT"}],"jwNHT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Lab", ()=>Lab);
var _labStatus = require("../model/LabStatus");
var _size = require("../model/Size");
var _scenePlayer = require("../player/ScenePlayer");
class Lab {
    constructor(labStatus){
        this.labStatus = labStatus;
        this.scenePlayer = new (0, _scenePlayer.ScenePlayer)(labStatus);
    }
    static create(selector) {
        const baseElement = document.querySelector(selector);
        if (!baseElement) {
            console.warn("[webgl-lab] base element not found. contact to developer");
            return undefined;
        }
        const canvas = document.createElement("canvas");
        canvas.width = baseElement.clientWidth;
        canvas.height = baseElement.clientHeight;
        baseElement.appendChild(canvas);
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            console.warn("[webgl-lab] no webgl2 context. check your browser");
            return undefined;
        }
        const clientSize = new (0, _size.Size)(baseElement.clientWidth, baseElement.clientHeight);
        const labStatus = new (0, _labStatus.LabStatus)(baseElement, canvas, gl, clientSize);
        const lab = new Lab(labStatus);
        baseElement.onresize = lab.resize.bind(lab);
        window.onresize = lab.resize.bind(lab);
        return lab;
    }
    setClientSize(width, height) {
        this.labStatus.clientSize.setSize(width, height);
        this.labStatus.canvas.width = width;
        this.labStatus.canvas.height = height;
        this.labStatus.gl.viewport(0, 0, width, height);
    }
    resize() {
        const width = this.labStatus.baseElement.clientWidth;
        const height = this.labStatus.baseElement.clientHeight;
        this.setClientSize(width, height);
    }
}

},{"../model/LabStatus":"3w6ef","../model/Size":"3Vtya","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../player/ScenePlayer":"gexro"}],"3w6ef":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LabStatus", ()=>LabStatus);
class LabStatus {
    constructor(baseElement, canvas, gl, clientSize){
        this.baseElement = baseElement;
        this.canvas = canvas;
        this.gl = gl;
        this.clientSize = clientSize;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"3Vtya":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Size", ()=>Size);
class Size {
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
    getWidth() {
        return this.width;
    }
    setWidth(width) {
        this.width = width;
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gexro":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ScenePlayer", ()=>ScenePlayer);
var _demoListScene = require("../scene/DemoListScene");
class ScenePlayer {
    constructor(labStatus){
        this.labStatus = labStatus;
        this.scene = new (0, _demoListScene.DemoListScene)(labStatus);
        const updateFunction = ()=>{
            this.scene?.update(this.labStatus);
            requestAnimationFrame(updateFunction);
        };
        updateFunction();
    }
}

},{"../scene/DemoListScene":"kDJLc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kDJLc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DemoListScene", ()=>DemoListScene);
var _geometry = require("../engine/Geometry");
var _object3D = require("../engine/Object3D");
var _singleColorMaterial = require("../engine/program/singleColor/SingleColorMaterial");
var _singleColorProgram = require("../engine/program/singleColor/SingleColorProgram");
var _textureMaterial = require("../engine/program/texture/TextureMaterial");
var _textureProgram = require("../engine/program/texture/TextureProgram");
var _transform = require("../engine/Transform");
var _vector2 = require("../math/Vector2");
var _color = require("../model/Color");
class DemoListScene {
    constructor(labStatus){
        const gl = labStatus.gl;
        this.degree = 0;
        const program = (0, _singleColorProgram.SingleColorProgram).create(gl);
        if (!program) return;
        // program.setup();
        const texProgram = (0, _textureProgram.TextureProgram).create(gl);
        if (!texProgram) return;
        // texProgram.setup();
        this.program = program;
        this.texProgram = texProgram;
        const vertices = [
            -0.5,
            0.5,
            0.0,
            -0.5,
            -0.5,
            0.0,
            0.5,
            -0.5,
            0.0,
            0.5,
            0.5,
            0.0
        ];
        const indices = [
            0,
            1,
            2,
            2,
            3,
            0
        ];
        const canvas = document.createElement("canvas");
        const side = 16;
        canvas.width = side;
        canvas.height = side;
        const context = canvas.getContext("2d");
        if (context) {
            const halfSide = side / 2;
            context.fillStyle = "black";
            context.fillRect(0, 0, halfSide, halfSide);
            context.fillStyle = "red";
            context.fillRect(halfSide, 0, halfSide, halfSide);
            context.fillStyle = "green";
            context.fillRect(0, halfSide, halfSide, halfSide);
            context.fillStyle = "blue";
            context.fillRect(halfSide, halfSide, halfSide, halfSide);
        }
        const uv = [
            0.0,
            0.0,
            0.0,
            1.0,
            1.0,
            1.0,
            1.0,
            0.0
        ];
        const transform1 = (0, _transform.Transform).identity();
        const geometry1 = new (0, _geometry.Geometry)(vertices, indices);
        const material1 = new (0, _singleColorMaterial.SingleColorMaterial)((0, _color.Color).magenta(), (0, _vector2.Vector2).zero());
        this.object1 = new (0, _object3D.Object3D)(transform1, geometry1, material1);
        const transform2 = (0, _transform.Transform).identity();
        const geometry2 = new (0, _geometry.Geometry)(vertices, indices);
        const material2 = new (0, _singleColorMaterial.SingleColorMaterial)((0, _color.Color).yellow(), (0, _vector2.Vector2).zero());
        this.object2 = new (0, _object3D.Object3D)(transform2, geometry2, material2);
        const transform3 = (0, _transform.Transform).identity();
        const geometry3 = new (0, _geometry.Geometry)(vertices, indices);
        const material3 = new (0, _textureMaterial.TextureMaterial)(canvas, uv, (0, _vector2.Vector2).zero());
        this.object3 = new (0, _object3D.Object3D)(transform3, geometry3, material3);
        const transform4 = (0, _transform.Transform).identity();
        const geometry4 = new (0, _geometry.Geometry)(vertices, indices);
        const material4 = new (0, _textureMaterial.TextureMaterial)(canvas, uv, (0, _vector2.Vector2).zero());
        this.object4 = new (0, _object3D.Object3D)(transform4, geometry4, material4);
    }
    setup() {}
    update(labStatus) {
        this.degree++;
        const radian = this.degree * Math.PI / 180.0;
        const x1 = 0.5 * Math.cos(radian);
        const y1 = 0.5 * Math.sin(radian);
        this.object3.material.offset.x = x1;
        this.object3.material.offset.y = y1;
        this.texProgram.draw(this.object3);
        const x3 = 0.5 * Math.cos(radian + Math.PI * 1 / 2);
        const y3 = 0.5 * Math.sin(radian + Math.PI * 1 / 2);
        this.object1.material.offset.x = x3;
        this.object1.material.offset.y = y3;
        this.program.draw(this.object1);
        const x2 = 0.5 * Math.cos(radian + Math.PI);
        const y2 = 0.5 * Math.sin(radian + Math.PI);
        this.object4.material.offset.x = x2;
        this.object4.material.offset.y = y2;
        this.texProgram.draw(this.object4);
        const x4 = 0.5 * Math.cos(radian + Math.PI * 3 / 2);
        const y4 = 0.5 * Math.sin(radian + Math.PI * 3 / 2);
        this.object2.material.offset.x = x4;
        this.object2.material.offset.y = y4;
        this.program.draw(this.object2);
        labStatus.gl.flush();
    }
    teardown() {}
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../engine/program/singleColor/SingleColorProgram":"7dQZg","../model/Color":"lRkPB","../math/Vector2":"7HNjS","../engine/Geometry":"h7EYE","../engine/Object3D":"j3Gg8","../engine/program/singleColor/SingleColorMaterial":"3mtlc","../engine/Transform":"ePWMt","../engine/program/texture/TextureProgram":"clmZi","../engine/program/texture/TextureMaterial":"dmrMw"}],"7dQZg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SingleColorProgram", ()=>SingleColorProgram);
var _glprogram = require("../../common/GLProgram");
const vertexShaderSource = `#version 300 es

in vec3 position;

// uniform mat4 model;
// uniform mat4 view;
// uniform mat4 projection;

uniform vec4 color;
uniform vec2 offset;

void main() {
  gl_Position = vec4(position.xy + offset, position.z, 1.0);
  // gl_Position = projection * view * model * vec4(position, 1.0);
}
`;
const fragmentShaderSource = `#version 300 es
precision highp float;

in vec4 vColor;

uniform vec4 color;

out vec4 fragmentColor;

void main() {
  fragmentColor = color;
}
`;
class SingleColorProgram {
    constructor(gl, glProgram){
        this.gl = gl;
        this.glProgram = glProgram;
    }
    static create(gl) {
        const glProgram = (0, _glprogram.GLProgram).create(gl, vertexShaderSource, fragmentShaderSource, "SingleColorProgram");
        if (!glProgram) {
            console.error("[ERROR] SingleColorProgram.create() could not create GLProgram");
            return undefined;
        }
        return new SingleColorProgram(gl, glProgram);
    }
    setup() {
        const gl = this.gl;
        const program = this.glProgram.program;
        gl.useProgram(program);
    }
    draw(object3D) {
        const gl = this.gl;
        const program = this.glProgram.program;
        gl.useProgram(program);
        const geometry = object3D.geometry;
        if (!geometry.isDrawable()) geometry.prepare(gl, program);
        const material = object3D.material;
        if (!material.isDrawable()) material.prepare(gl, program);
        geometry.bind(gl);
        material.bind(gl);
        gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
    }
}

},{"../../common/GLProgram":"fQxng","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fQxng":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLProgram", ()=>GLProgram);
class GLProgram {
    constructor(vertexShader, fragmentShader, program){
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.program = program;
    }
    static create(gl, vertexShaderSource, fragmentShaderSource, name) {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (vertexShader === null) {
            console.error(`[ERROR] GLProgram.create() could not create vertex shader. name: ${name}`);
            return undefined;
        }
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        const vertexShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if (!vertexShaderCompileStatus) {
            const info = gl.getShaderInfoLog(vertexShader);
            console.warn(info);
            return undefined;
        }
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fragmentShader === null) {
            console.error(`[ERROR] GLProgram.create() could not create fragment shader. name: ${name}`);
            return undefined;
        }
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        const fragmentShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        if (!fragmentShaderCompileStatus) {
            const info = gl.getShaderInfoLog(fragmentShader);
            console.warn(info);
            return undefined;
        }
        const program = gl.createProgram();
        if (program === null) {
            console.error(`[ERROR] GLProgram.create() could not create program. name: ${name}`);
            return;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linkStatus) {
            const info = gl.getProgramInfoLog(program);
            console.warn(info);
            return undefined;
        }
        gl.useProgram(program);
        return new GLProgram(vertexShader, fragmentShader, program);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lRkPB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Color", ()=>Color);
var _vector4 = require("../math/Vector4");
class Color {
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get r() {
        return this._r;
    }
    set r(value) {
        this._r = value;
    }
    get g() {
        return this._g;
    }
    set g(value) {
        this._g = value;
    }
    get b() {
        return this._b;
    }
    set b(value) {
        this._b = value;
    }
    get a() {
        return this._a;
    }
    set a(value) {
        this._a = value;
    }
    static clear() {
        return new Color(0.0, 0.0, 0.0, 0.0);
    }
    static black() {
        return new Color(0.0, 0.0, 0.0, 1.0);
    }
    static red() {
        return new Color(1.0, 0.0, 0.0, 1.0);
    }
    static green() {
        return new Color(0.0, 1.0, 0.0, 1.0);
    }
    static blue() {
        return new Color(0.0, 0.0, 1.0, 1.0);
    }
    static yellow() {
        return new Color(1.0, 1.0, 0.0, 1.0);
    }
    static cyan() {
        return new Color(0.0, 1.0, 1.0, 1.0);
    }
    static magenta() {
        return new Color(1.0, 0.0, 1.0, 1.0);
    }
    static white() {
        return new Color(1.0, 1.0, 1.0, 1.0);
    }
    toVector4() {
        return new (0, _vector4.Vector4)(this.r, this.g, this.b, this.a);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../math/Vector4":"3ZEDI"}],"3ZEDI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vector4", ()=>Vector4);
class Vector4 {
    constructor(x, y, z, w){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get z() {
        return this._z;
    }
    set z(value) {
        this._z = value;
    }
    get w() {
        return this._w;
    }
    set w(value) {
        this._w = value;
    }
    static zero() {
        return new Vector4(0.0, 0.0, 0.0, 0.0);
    }
    static ones() {
        return new Vector4(1.0, 1.0, 1.0, 1.0);
    }
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
    isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 0;
    }
    divide(value) {
        this.x /= value;
        this.y /= value;
        this.z /= value;
        this.w /= value;
    }
    squaredMagnitude() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2;
    }
    magnitude() {
        return Math.sqrt(this.squaredMagnitude());
    }
    normalize() {
        const magnitude = this.magnitude();
        this.divide(magnitude);
    }
    normalizeClone() {
        const clone = this.clone();
        clone.normalize();
        return clone;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7HNjS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vector2", ()=>Vector2);
class Vector2 {
    constructor(x, y){
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    static zero() {
        return new Vector2(0.0, 0.0);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    isZero() {
        return this.x === 0 && this.y === 0;
    }
    divide(value) {
        this.x /= value;
        this.y /= value;
    }
    squaredMagnitude() {
        return this.x ** 2 + this.y ** 2;
    }
    magnitude() {
        return Math.sqrt(this.squaredMagnitude());
    }
    normalize() {
        const magnitude = this.magnitude();
        this.divide(magnitude);
    }
    normalizeClone() {
        const clone = this.clone();
        clone.normalize();
        return clone;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h7EYE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Geometry", ()=>Geometry);
var _glgeometry = require("./common/GLGeometry");
class Geometry {
    constructor(vertices, indices){
        this.vertices = vertices;
        this.indices = indices;
    }
    getIndicesLength() {
        return this.indices.length;
    }
    isDrawable() {
        return this.glGeometry ? true : false;
    }
    prepare(gl, program) {
        if (this.isDrawable()) return;
        const glGeometry = (0, _glgeometry.GLGeometry).create(gl, program, this.vertices, this.indices);
        if (!glGeometry) {
            console.error("[ERROR] Geometry.prepare() could not create GLGeometry");
            return;
        }
        this.glGeometry = glGeometry;
    }
    bind(gl) {
        this.glGeometry?.bind(gl);
    }
}

},{"./common/GLGeometry":"eEVl1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eEVl1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLGeometry", ()=>GLGeometry);
var _glattribute = require("./GLAttribute");
var _glbuffer = require("./GLBuffer");
var _glindexBuffer = require("./GLIndexBuffer");
class GLGeometry {
    constructor(vertexBuffer, indexBuffer){
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
    }
    static create(gl, program, vertices, indices) {
        const positionAttribute = (0, _glattribute.GLAttribute).create(gl, program, false, 0, 3, "position");
        if (!positionAttribute) {
            console.error("[ERRPR] GLGeometry.create() could not create GLAttribute");
            return undefined;
        }
        const vertexBuffer = (0, _glbuffer.GLBuffer).create(gl, vertices, 3, [
            positionAttribute
        ]);
        if (!vertexBuffer) {
            console.error("[ERROR] GLGeometry.create() could not create GLBuffer");
            return undefined;
        }
        const indexBuffer = (0, _glindexBuffer.GLIndexBuffer).create(gl, indices);
        if (!indexBuffer) {
            console.error("[ERROR] GLGeometry.create() could not create GLIndexBuffer");
            return undefined;
        }
        return new GLGeometry(vertexBuffer, indexBuffer);
    }
    bind(gl) {
        this.vertexBuffer.bind(gl);
        this.indexBuffer.bind(gl);
    }
}

},{"./GLAttribute":"hK3Kt","./GLBuffer":"caRQm","./GLIndexBuffer":"95AeV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hK3Kt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLAttribute", ()=>GLAttribute);
class GLAttribute {
    constructor(location, normalized, offset, size){
        this.location = location;
        this.normalized = normalized;
        this.offset = offset;
        this.size = size;
    }
    static create(gl, program, normalized, offset, size, name) {
        const location = gl.getAttribLocation(program, name);
        return new GLAttribute(location, normalized, offset, size);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"caRQm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLBuffer", ()=>GLBuffer);
class GLBuffer {
    constructor(buffer, typedArray, stride, attribudes){
        this.buffer = buffer;
        this.typedArray = typedArray;
        this.stride = stride;
        this.attributes = attribudes;
    }
    static create(gl, array, stride, attributes) {
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error("[ERROR] GLBuffer.create() could not create buffer");
            return undefined;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const typedArray = new Float32Array(array);
        gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
        const strideBytes = attributes.length === 1 ? 0 : stride * Float32Array.BYTES_PER_ELEMENT;
        for (const a of attributes){
            const offsetBytes = a.offset * Float32Array.BYTES_PER_ELEMENT;
            gl.enableVertexAttribArray(a.location);
            gl.vertexAttribPointer(a.location, a.size, gl.FLOAT, a.normalized, strideBytes, offsetBytes);
        }
        return new GLBuffer(buffer, typedArray, stride, attributes);
    }
    bind(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"95AeV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLIndexBuffer", ()=>GLIndexBuffer);
class GLIndexBuffer {
    constructor(buffer, typedArray){
        this.buffer = buffer;
        this.typedArray = typedArray;
    }
    static create(gl, array) {
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error("[ERROR] GLIndexBuffer.create() could not create buffer");
            return undefined;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        const typedArray = new Uint16Array(array);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
        return new GLIndexBuffer(buffer, typedArray);
    }
    bind(gl) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"j3Gg8":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Object3D", ()=>Object3D);
class Object3D {
    constructor(transform, geometry, material){
        this.transform = transform;
        this.geometry = geometry;
        this.material = material;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3mtlc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "SingleColorMaterial", ()=>SingleColorMaterial);
var _gluniformFloat2 = require("../../common/uniform/GLUniformFloat2");
var _gluniformFloat4 = require("../../common/uniform/GLUniformFloat4");
class SingleColorMaterial {
    constructor(color, offset){
        this.color = color;
        this.offset = offset;
    }
    isDrawable() {
        return this.colorUniform !== undefined && this.offsetUniform !== undefined;
    }
    prepare(gl, program) {
        if (this.isDrawable()) return;
        const c = this.color;
        const o = this.offset;
        const colorUniform = (0, _gluniformFloat4.GLUniformFloat4).create(gl, program, "color", c.r, c.g, c.b, c.a);
        const offsetUniform = (0, _gluniformFloat2.GLUniformFloat2).create(gl, program, "offset", o.x, o.y);
        if (!colorUniform || !offsetUniform) {
            console.error("[ERROR] SingleColorMaterial.prepare() could not create GLUniform");
            return;
        }
        this.colorUniform = colorUniform;
        this.offsetUniform = offsetUniform;
    }
    bind(gl) {
        if (!this.colorUniform || !this.offsetUniform) {
            console.log("could not bind");
            return;
        }
        if (!this.colorUniform.equalsColor(this.color)) this.colorUniform.setColor(this.color);
        this.colorUniform.uniform(gl);
        if (!this.offsetUniform.equalsVector2(this.offset)) this.offsetUniform.setVector2(this.offset);
        this.offsetUniform.uniform(gl);
    }
}

},{"../../common/uniform/GLUniformFloat2":"2gBCB","../../common/uniform/GLUniformFloat4":"3mGPt","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2gBCB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLUniformFloat2", ()=>GLUniformFloat2);
var _gluniform = require("../GLUniform");
class GLUniformFloat2 {
    constructor(glUniform, x, y){
        this.glUniform = glUniform;
        this.x = x;
        this.y = y;
    }
    static create(gl, program, name, x, y) {
        const glUniform = (0, _gluniform.GLUniform).create(gl, program, name);
        if (!glUniform) {
            console.error("[ERROR] could not create GLUniformFloat2");
            return undefined;
        }
        return new GLUniformFloat2(glUniform, x, y);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    equalsVector2(vector2) {
        return this.x === vector2.x && this.y === vector2.y;
    }
    setVector2(vector2) {
        this.x = vector2.x;
        this.y = vector2.y;
    }
    uniform(gl) {
        gl.uniform2f(this.glUniform.location, this.x, this.y);
    }
}

},{"../GLUniform":"kMmNp","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kMmNp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLUniform", ()=>GLUniform);
class GLUniform {
    constructor(location){
        this.location = location;
    }
    static create(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        if (location === null) {
            console.error("[ERROR] could not create GLUniform");
            return undefined;
        }
        return new GLUniform(location);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3mGPt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLUniformFloat4", ()=>GLUniformFloat4);
var _gluniform = require("../GLUniform");
class GLUniformFloat4 {
    constructor(glUniform, x, y, z, w){
        this.glUniform = glUniform;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static create(gl, program, name, x, y, z, w) {
        const glUniform = (0, _gluniform.GLUniform).create(gl, program, name);
        if (!glUniform) {
            console.error("[ERROR] could not create GLUniformFloat4");
            return undefined;
        }
        return new GLUniformFloat4(glUniform, x, y, z, w);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get z() {
        return this._z;
    }
    set z(value) {
        this._z = value;
    }
    get w() {
        return this._w;
    }
    set w(value) {
        this._w = value;
    }
    uniform(gl) {
        gl.uniform4f(this.glUniform.location, this.x, this.y, this.z, this.w);
    }
    equalsVector4(vector4) {
        return this.x === vector4.x && this.y === vector4.y && this.z === vector4.z && this.w === vector4.w;
    }
    setVector4(vector4) {
        this.x = vector4.x;
        this.y = vector4.y;
        this.z = vector4.z;
        this.w = vector4.w;
    }
    equalsColor(color) {
        return this.x === color.r && this.y === color.g && this.z === color.b && this.w === color.a;
    }
    setColor(color) {
        this.x = color.r;
        this.y = color.g;
        this.z = color.b;
        this.w = color.a;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","../GLUniform":"kMmNp"}],"ePWMt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Transform", ()=>Transform);
var _quaternion = require("../math/Quaternion");
var _vector3 = require("../math/Vector3");
class Transform {
    constructor(position, rotation, scale){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
    static identity() {
        return new Transform((0, _vector3.Vector3).zero(), (0, _quaternion.Quaternion).identity(), (0, _vector3.Vector3).ones());
    }
}

},{"../math/Quaternion":"jdQLA","../math/Vector3":"jAtgt","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jdQLA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Quaternion", ()=>Quaternion);
class Quaternion {
    constructor(a, b, c, d){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    static identity() {
        return new Quaternion(1, 0, 0, 0);
    }
    static fromRadianAndAxis(radian, vector) {
        if (vector.isZero()) return Quaternion.identity();
        const normalized = vector.normalizeClone();
        const halfRadian = radian / 2;
        const sinHalfRadian = Math.sin(halfRadian);
        return new Quaternion(Math.cos(halfRadian), normalized.x * sinHalfRadian, normalized.y * sinHalfRadian, normalized.z * sinHalfRadian);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jAtgt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vector3", ()=>Vector3);
class Vector3 {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get z() {
        return this._z;
    }
    set z(value) {
        this._z = value;
    }
    static zero() {
        return new Vector3(0.0, 0.0, 0.0);
    }
    static ones() {
        return new Vector3(1.0, 1.0, 1.0);
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }
    divide(value) {
        this.x /= value;
        this.y /= value;
        this.z /= value;
    }
    squaredMagnitude() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    magnitude() {
        return Math.sqrt(this.squaredMagnitude());
    }
    normalize() {
        const magnitude = this.magnitude();
        this.divide(magnitude);
    }
    normalizeClone() {
        const clone = this.clone();
        clone.normalize();
        return clone;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"clmZi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TextureProgram", ()=>TextureProgram);
var _glprogram = require("../../common/GLProgram");
const vertexShaderSource = `#version 300 es
in vec3 position;
in vec2 uv;

// uniform mat4 model;
// uniform mat4 view;
// uniform mat4 projection;
uniform vec2 offset;

out vec2 passUv;

void main() {
  passUv = uv;
  gl_Position = vec4(position.xy + offset, position.z, 1.0);
  // gl_Position = projection * view * model * vec4(vertexPosition, 1.0);
}`;
const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 passUv;

uniform sampler2D tex;

out vec4 fragmentColor;

void main() {
  fragmentColor = texture(tex, passUv);
}`;
class TextureProgram {
    constructor(gl, glProgram){
        this.gl = gl;
        this.glProgram = glProgram;
    }
    static create(gl) {
        const glProgram = (0, _glprogram.GLProgram).create(gl, vertexShaderSource, fragmentShaderSource, "TextureProgram");
        if (!glProgram) {
            console.error("[ERROR] TextureProgram.create() could not create GLProgram");
            return undefined;
        }
        return new TextureProgram(gl, glProgram);
    }
    draw(object3D) {
        const gl = this.gl;
        const program = this.glProgram.program;
        gl.useProgram(program);
        const geometry = object3D.geometry;
        if (!geometry.isDrawable()) geometry.prepare(gl, program);
        const material = object3D.material;
        if (!material.isDrawable()) material.prepare(gl, program);
        geometry.bind(gl);
        material.bind(gl);
        gl.drawElements(gl.TRIANGLES, geometry.getIndicesLength(), gl.UNSIGNED_SHORT, 0);
    }
}

},{"../../common/GLProgram":"fQxng","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dmrMw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TextureMaterial", ()=>TextureMaterial);
var _glattribute = require("../../common/GLAttribute");
var _glbuffer = require("../../common/GLBuffer");
var _gltexture = require("../../common/GLTexture");
var _gluniformFloat2 = require("../../common/uniform/GLUniformFloat2");
class TextureMaterial {
    constructor(image, uv, offset){
        this.image = image;
        this.uv = uv;
        this.offset = offset;
    }
    isDrawable() {
        return this.uvBuffer !== undefined && this.glTexture !== undefined && this.offsetUniform !== undefined;
    }
    prepare(gl, program) {
        if (this.isDrawable()) return;
        const glTexture = (0, _gltexture.GLTexture).create(gl, this.image);
        if (!glTexture) {
            console.error("[ERROR] TextureMaterial.prepare() could not create GLTexture");
            return;
        }
        const attribute = (0, _glattribute.GLAttribute).create(gl, program, false, 0, 2, "uv");
        if (!attribute) {
            console.error("[ERROR] TextureMaterial.prepare() could not create GLAttribute");
            return;
        }
        const uvBuffer = (0, _glbuffer.GLBuffer).create(gl, this.uv, 2, [
            attribute
        ]);
        if (!uvBuffer) {
            console.error("[ERROR] TextureMaterial.prepare() could not create GLBuffer");
            return;
        }
        const o = this.offset;
        const offsetUniform = (0, _gluniformFloat2.GLUniformFloat2).create(gl, program, "offset", o.x, o.y);
        if (!offsetUniform) {
            console.error("[ERROR] TextureMaterial.prepare() could not create GLUniform");
            return;
        }
        this.glTexture = glTexture;
        this.uvBuffer = uvBuffer;
        this.offsetUniform = offsetUniform;
    }
    bind(gl) {
        if (!this.glTexture || !this.uvBuffer || !this.offsetUniform) return;
        this.glTexture.bind(gl);
        this.uvBuffer.bind(gl);
        if (!this.offsetUniform.equalsVector2(this.offset)) this.offsetUniform.setVector2(this.offset);
        this.offsetUniform.uniform(gl);
    }
}

},{"../../common/GLAttribute":"hK3Kt","../../common/GLBuffer":"caRQm","../../common/GLTexture":"1Sv5k","../../common/uniform/GLUniformFloat2":"2gBCB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1Sv5k":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GLTexture", ()=>GLTexture);
const DEFAULT_TEXTURE_PARAMETER_MAP = new Map([
    [
        WebGL2RenderingContext.TEXTURE_MAG_FILTER,
        WebGL2RenderingContext.LINEAR
    ],
    [
        WebGL2RenderingContext.TEXTURE_MIN_FILTER,
        WebGL2RenderingContext.LINEAR
    ],
    [
        WebGL2RenderingContext.TEXTURE_WRAP_S,
        WebGL2RenderingContext.CLAMP_TO_EDGE
    ],
    [
        WebGL2RenderingContext.TEXTURE_WRAP_T,
        WebGL2RenderingContext.CLAMP_TO_EDGE
    ]
]);
class GLTexture {
    constructor(texture, source, textureParameterMap){
        this.texture = texture;
        this.source = source;
        this.textureParameterMap = textureParameterMap;
    }
    static create(gl, source, textureParameterMap = DEFAULT_TEXTURE_PARAMETER_MAP) {
        const texture = gl.createTexture();
        if (!texture) {
            console.error("[ERROR] GLTexture.create() could not create WebGLTexture");
            return undefined;
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        for (const [key, value] of textureParameterMap.entries())gl.texParameteri(gl.TEXTURE_2D, key, value);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        return new GLTexture(texture, source, textureParameterMap);
    }
    bind(gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["dKxsn","jyKRr"], "jyKRr", "parcelRequire95b8")

//# sourceMappingURL=index.75320e57.js.map
