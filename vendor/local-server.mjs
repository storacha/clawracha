var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod2) => function __require2() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all3) => {
  for (var name8 in all3)
    __defProp(target, name8, { get: all3[name8], enumerable: true });
};
var __copyProps = (to, from11, except, desc) => {
  if (from11 && typeof from11 === "object" || typeof from11 === "function") {
    for (let key of __getOwnPropNames(from11))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from11[key], enumerable: !(desc = __getOwnPropDesc(from11, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/.pnpm/@1password+sdk-core@0.4.0/node_modules/@1password/sdk-core/nodejs/core.js
var require_core = __commonJS({
  "node_modules/.pnpm/@1password+sdk-core@0.4.0/node_modules/@1password/sdk-core/nodejs/core.js"(exports, module) {
    var imports = {};
    imports["__wbindgen_placeholder__"] = module.exports;
    var wasm;
    var { TextDecoder: TextDecoder2, TextEncoder: TextEncoder2 } = __require("util");
    var cachedTextDecoder = new TextDecoder2("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    var cachedUint8ArrayMemory0 = null;
    function getUint8ArrayMemory0() {
      if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8ArrayMemory0;
    }
    function getStringFromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
    }
    function addToExternrefTable0(obj) {
      const idx = wasm.__externref_table_alloc();
      wasm.__wbindgen_export_2.set(idx, obj);
      return idx;
    }
    function handleError(f, args) {
      try {
        return f.apply(this, args);
      } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
      }
    }
    function isLikeNone(x) {
      return x === void 0 || x === null;
    }
    var WASM_VECTOR_LEN = 0;
    var cachedTextEncoder = new TextEncoder2("utf-8");
    var encodeString2 = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view6) {
      return cachedTextEncoder.encodeInto(arg, view6);
    } : function(arg, view6) {
      const buf2 = cachedTextEncoder.encode(arg);
      view6.set(buf2);
      return {
        read: arg.length,
        written: buf2.length
      };
    };
    function passStringToWasm0(arg, malloc, realloc) {
      if (realloc === void 0) {
        const buf2 = cachedTextEncoder.encode(arg);
        const ptr2 = malloc(buf2.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf2.length).set(buf2);
        WASM_VECTOR_LEN = buf2.length;
        return ptr2;
      }
      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;
      const mem = getUint8ArrayMemory0();
      let offset = 0;
      for (; offset < len; offset++) {
        const code11 = arg.charCodeAt(offset);
        if (code11 > 127) break;
        mem[ptr + offset] = code11;
      }
      if (offset !== len) {
        if (offset !== 0) {
          arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view6 = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString2(arg, view6);
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
      }
      WASM_VECTOR_LEN = offset;
      return ptr;
    }
    var cachedDataViewMemory0 = null;
    function getDataViewMemory0() {
      if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
      }
      return cachedDataViewMemory0;
    }
    var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
    }, unregister: () => {
    } } : new FinalizationRegistry((state) => {
      wasm.__wbindgen_export_5.get(state.dtor)(state.a, state.b);
    });
    function makeMutClosure(arg0, arg1, dtor, f) {
      const state = { a: arg0, b: arg1, cnt: 1, dtor };
      const real = (...args) => {
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
          return f(a, state.b, ...args);
        } finally {
          if (--state.cnt === 0) {
            wasm.__wbindgen_export_5.get(state.dtor)(a, state.b);
            CLOSURE_DTORS.unregister(state);
          } else {
            state.a = a;
          }
        }
      };
      real.original = state;
      CLOSURE_DTORS.register(real, state, state);
      return real;
    }
    function debugString(val) {
      const type = typeof val;
      if (type == "number" || type == "boolean" || val == null) {
        return `${val}`;
      }
      if (type == "string") {
        return `"${val}"`;
      }
      if (type == "symbol") {
        const description = val.description;
        if (description == null) {
          return "Symbol";
        } else {
          return `Symbol(${description})`;
        }
      }
      if (type == "function") {
        const name8 = val.name;
        if (typeof name8 == "string" && name8.length > 0) {
          return `Function(${name8})`;
        } else {
          return "Function";
        }
      }
      if (Array.isArray(val)) {
        const length2 = val.length;
        let debug = "[";
        if (length2 > 0) {
          debug += debugString(val[0]);
        }
        for (let i = 1; i < length2; i++) {
          debug += ", " + debugString(val[i]);
        }
        debug += "]";
        return debug;
      }
      const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
      let className;
      if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
      } else {
        return toString.call(val);
      }
      if (className == "Object") {
        try {
          return "Object(" + JSON.stringify(val) + ")";
        } catch (_) {
          return "Object";
        }
      }
      if (val instanceof Error) {
        return `${val.name}: ${val.message}
${val.stack}`;
      }
      return className;
    }
    module.exports.init_client = function(config) {
      const ptr0 = passStringToWasm0(config, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.init_client(ptr0, len0);
      return ret;
    };
    module.exports.invoke = function(parameters) {
      const ptr0 = passStringToWasm0(parameters, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.invoke(ptr0, len0);
      return ret;
    };
    function takeFromExternrefTable0(idx) {
      const value = wasm.__wbindgen_export_2.get(idx);
      wasm.__externref_table_dealloc(idx);
      return value;
    }
    module.exports.invoke_sync = function(parameters) {
      let deferred3_0;
      let deferred3_1;
      try {
        const ptr0 = passStringToWasm0(parameters, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.invoke_sync(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
          ptr2 = 0;
          len2 = 0;
          throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
      } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
      }
    };
    module.exports.release_client = function(client_id) {
      const ptr0 = passStringToWasm0(client_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.release_client(ptr0, len0);
      if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
      }
    };
    function __wbg_adapter_30(arg0, arg1) {
      wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4fa304e9a7297dba(arg0, arg1);
    }
    function __wbg_adapter_33(arg0, arg1, arg2) {
      wasm.closure2484_externref_shim(arg0, arg1, arg2);
    }
    function __wbg_adapter_156(arg0, arg1, arg2, arg3) {
      wasm.closure2632_externref_shim(arg0, arg1, arg2, arg3);
    }
    var __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];
    var __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];
    var __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];
    module.exports.__wbg_abort_410ec47a64ac6117 = function(arg0, arg1) {
      arg0.abort(arg1);
    };
    module.exports.__wbg_abort_775ef1d17fc65868 = function(arg0) {
      arg0.abort();
    };
    module.exports.__wbg_append_8c7dd8d641a5f01b = function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
      }, arguments);
    };
    module.exports.__wbg_arrayBuffer_d1b44c4390db422f = function() {
      return handleError(function(arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
      }, arguments);
    };
    module.exports.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
      const ret = arg0.buffer;
      return ret;
    };
    module.exports.__wbg_call_672a4d21634d4a24 = function() {
      return handleError(function(arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_call_7cccdd69e0791ae2 = function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_clearTimeout_42d9ccd50822fd3a = function(arg0) {
      const ret = clearTimeout(arg0);
      return ret;
    };
    module.exports.__wbg_crypto_86f2631e91b51511 = function(arg0) {
      const ret = arg0.crypto;
      return ret;
    };
    module.exports.__wbg_done_769e5ede4b31c67b = function(arg0) {
      const ret = arg0.done;
      return ret;
    };
    module.exports.__wbg_fetch_509096533071c657 = function(arg0, arg1) {
      const ret = arg0.fetch(arg1);
      return ret;
    };
    module.exports.__wbg_fetch_6bbc32f991730587 = function(arg0) {
      const ret = fetch(arg0);
      return ret;
    };
    module.exports.__wbg_getFullYear_17d3c9e4db748eb7 = function(arg0) {
      const ret = arg0.getFullYear();
      return ret;
    };
    module.exports.__wbg_getRandomValues_b3f15fcbfabb0f8b = function() {
      return handleError(function(arg0, arg1) {
        arg0.getRandomValues(arg1);
      }, arguments);
    };
    module.exports.__wbg_getTimezoneOffset_6b5752021c499c47 = function(arg0) {
      const ret = arg0.getTimezoneOffset();
      return ret;
    };
    module.exports.__wbg_get_67b2ba62fc30de12 = function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_has_a5ea9117f258a0ec = function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_headers_9cb51cfd2ac780a4 = function(arg0) {
      const ret = arg0.headers;
      return ret;
    };
    module.exports.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
      let result;
      try {
        result = arg0 instanceof Response;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    };
    module.exports.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
      let result;
      try {
        result = arg0 instanceof Window;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    };
    module.exports.__wbg_instanceof_WorkerGlobalScope_dbdbdea7e3b56493 = function(arg0) {
      let result;
      try {
        result = arg0 instanceof WorkerGlobalScope;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    };
    module.exports.__wbg_iterator_9a24c88df860dc65 = function() {
      const ret = Symbol.iterator;
      return ret;
    };
    module.exports.__wbg_languages_2420955220685766 = function(arg0) {
      const ret = arg0.languages;
      return ret;
    };
    module.exports.__wbg_languages_d8dad509faf757df = function(arg0) {
      const ret = arg0.languages;
      return ret;
    };
    module.exports.__wbg_length_a446193dc22c12f8 = function(arg0) {
      const ret = arg0.length;
      return ret;
    };
    module.exports.__wbg_msCrypto_d562bbe83e0d4b91 = function(arg0) {
      const ret = arg0.msCrypto;
      return ret;
    };
    module.exports.__wbg_navigator_0a9bf1120e24fec2 = function(arg0) {
      const ret = arg0.navigator;
      return ret;
    };
    module.exports.__wbg_navigator_1577371c070c8947 = function(arg0) {
      const ret = arg0.navigator;
      return ret;
    };
    module.exports.__wbg_new0_f788a2397c7ca929 = function() {
      const ret = /* @__PURE__ */ new Date();
      return ret;
    };
    module.exports.__wbg_new_018dcc2d6c8c2f6a = function() {
      return handleError(function() {
        const ret = new Headers();
        return ret;
      }, arguments);
    };
    module.exports.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg02, arg12) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wbg_adapter_156(a, state0.b, arg02, arg12);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return ret;
      } finally {
        state0.a = state0.b = 0;
      }
    };
    module.exports.__wbg_new_31a97dac4f10fab7 = function(arg0) {
      const ret = new Date(arg0);
      return ret;
    };
    module.exports.__wbg_new_405e22f390576ce2 = function() {
      const ret = new Object();
      return ret;
    };
    module.exports.__wbg_new_a12002a7f91c75be = function(arg0) {
      const ret = new Uint8Array(arg0);
      return ret;
    };
    module.exports.__wbg_new_e25e5aab09ff45db = function() {
      return handleError(function() {
        const ret = new AbortController();
        return ret;
      }, arguments);
    };
    module.exports.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return ret;
    };
    module.exports.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
      const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
      return ret;
    };
    module.exports.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return ret;
    };
    module.exports.__wbg_newwithstrandinit_06c535e0a867c635 = function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_next_25feadfc0913fea9 = function(arg0) {
      const ret = arg0.next;
      return ret;
    };
    module.exports.__wbg_next_6574e1a8a62d1055 = function() {
      return handleError(function(arg0) {
        const ret = arg0.next();
        return ret;
      }, arguments);
    };
    module.exports.__wbg_node_e1f24f89a7336c2e = function(arg0) {
      const ret = arg0.node;
      return ret;
    };
    module.exports.__wbg_now_807e54c39636c349 = function() {
      const ret = Date.now();
      return ret;
    };
    module.exports.__wbg_now_d18023d54d4e5500 = function(arg0) {
      const ret = arg0.now();
      return ret;
    };
    module.exports.__wbg_parse_def2e24ef1252aff = function() {
      return handleError(function(arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return ret;
      }, arguments);
    };
    module.exports.__wbg_process_3975fd6c72f520aa = function(arg0) {
      const ret = arg0.process;
      return ret;
    };
    module.exports.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
      queueMicrotask(arg0);
    };
    module.exports.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
      const ret = arg0.queueMicrotask;
      return ret;
    };
    module.exports.__wbg_randomFillSync_f8c153b79f285817 = function() {
      return handleError(function(arg0, arg1) {
        arg0.randomFillSync(arg1);
      }, arguments);
    };
    module.exports.__wbg_require_b74f47fc2d022fd6 = function() {
      return handleError(function() {
        const ret = module.require;
        return ret;
      }, arguments);
    };
    module.exports.__wbg_resolve_4851785c9c5f573d = function(arg0) {
      const ret = Promise.resolve(arg0);
      return ret;
    };
    module.exports.__wbg_self_b29ea9f89ecb0567 = function() {
      return handleError(function() {
        const ret = self.self;
        return ret;
      }, arguments);
    };
    module.exports.__wbg_setTimeout_4ec014681668a581 = function(arg0, arg1) {
      const ret = setTimeout(arg0, arg1);
      return ret;
    };
    module.exports.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
      arg0.set(arg1, arg2 >>> 0);
    };
    module.exports.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
      arg0.body = arg1;
    };
    module.exports.__wbg_setcache_12f17c3a980650e4 = function(arg0, arg1) {
      arg0.cache = __wbindgen_enum_RequestCache[arg1];
    };
    module.exports.__wbg_setcredentials_c3a22f1cd105a2c6 = function(arg0, arg1) {
      arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
    };
    module.exports.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
      arg0.headers = arg1;
    };
    module.exports.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
      arg0.method = getStringFromWasm0(arg1, arg2);
    };
    module.exports.__wbg_setmode_5dc300b865044b65 = function(arg0, arg1) {
      arg0.mode = __wbindgen_enum_RequestMode[arg1];
    };
    module.exports.__wbg_setsignal_75b21ef3a81de905 = function(arg0, arg1) {
      arg0.signal = arg1;
    };
    module.exports.__wbg_signal_aaf9ad74119f20a4 = function(arg0) {
      const ret = arg0.signal;
      return ret;
    };
    module.exports.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
      const ret = typeof global === "undefined" ? null : global;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    module.exports.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
      const ret = typeof globalThis === "undefined" ? null : globalThis;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    module.exports.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
      const ret = typeof self === "undefined" ? null : self;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    module.exports.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
      const ret = typeof window === "undefined" ? null : window;
      return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    module.exports.__wbg_static_accessor_performance_da77b3a901a72934 = function() {
      const ret = performance;
      return ret;
    };
    module.exports.__wbg_status_f6360336ca686bf0 = function(arg0) {
      const ret = arg0.status;
      return ret;
    };
    module.exports.__wbg_stringify_f7ed6987935b4a24 = function() {
      return handleError(function(arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
      }, arguments);
    };
    module.exports.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
      const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
      return ret;
    };
    module.exports.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
      const ret = arg0.then(arg1);
      return ret;
    };
    module.exports.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
      const ret = arg0.then(arg1, arg2);
      return ret;
    };
    module.exports.__wbg_toLocaleDateString_e5424994746e8415 = function(arg0, arg1, arg2, arg3) {
      const ret = arg0.toLocaleDateString(getStringFromWasm0(arg1, arg2), arg3);
      return ret;
    };
    module.exports.__wbg_url_ae10c34ca209681d = function(arg0, arg1) {
      const ret = arg1.url;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    module.exports.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
      const ret = arg0.value;
      return ret;
    };
    module.exports.__wbg_values_99f7a68c7f313d66 = function(arg0) {
      const ret = arg0.values();
      return ret;
    };
    module.exports.__wbg_versions_4e31226f5e8dc909 = function(arg0) {
      const ret = arg0.versions;
      return ret;
    };
    module.exports.__wbg_window_aa5515e600e96252 = function() {
      return handleError(function() {
        const ret = window.window;
        return ret;
      }, arguments);
    };
    module.exports.__wbindgen_cb_drop = function(arg0) {
      const obj = arg0.original;
      if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
      }
      const ret = false;
      return ret;
    };
    module.exports.__wbindgen_closure_wrapper9169 = function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 2463, __wbg_adapter_30);
      return ret;
    };
    module.exports.__wbindgen_closure_wrapper9209 = function(arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 2485, __wbg_adapter_33);
      return ret;
    };
    module.exports.__wbindgen_debug_string = function(arg0, arg1) {
      const ret = debugString(arg1);
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    module.exports.__wbindgen_init_externref_table = function() {
      const table = wasm.__wbindgen_export_2;
      const offset = table.grow(4);
      table.set(0, void 0);
      table.set(offset + 0, void 0);
      table.set(offset + 1, null);
      table.set(offset + 2, true);
      table.set(offset + 3, false);
      ;
    };
    module.exports.__wbindgen_is_function = function(arg0) {
      const ret = typeof arg0 === "function";
      return ret;
    };
    module.exports.__wbindgen_is_object = function(arg0) {
      const val = arg0;
      const ret = typeof val === "object" && val !== null;
      return ret;
    };
    module.exports.__wbindgen_is_string = function(arg0) {
      const ret = typeof arg0 === "string";
      return ret;
    };
    module.exports.__wbindgen_is_undefined = function(arg0) {
      const ret = arg0 === void 0;
      return ret;
    };
    module.exports.__wbindgen_memory = function() {
      const ret = wasm.memory;
      return ret;
    };
    module.exports.__wbindgen_number_new = function(arg0) {
      const ret = arg0;
      return ret;
    };
    module.exports.__wbindgen_string_get = function(arg0, arg1) {
      const obj = arg1;
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    module.exports.__wbindgen_string_new = function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return ret;
    };
    module.exports.__wbindgen_throw = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
    var path2 = __require("path").join(__dirname, "core_bg.wasm");
    var bytes2 = __require("fs").readFileSync(path2);
    var wasmModule = new WebAssembly.Module(bytes2);
    var wasmInstance = new WebAssembly.Instance(wasmModule, imports);
    wasm = wasmInstance.exports;
    module.exports.__wasm = wasm;
    wasm.__wbindgen_start();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReplacerFunc = exports.ReviverFunc = exports.UPDATE_ITEM_HISTORY = exports.UPDATE_ITEMS = exports.SEND_ITEMS = exports.REVEAL_ITEM_PASSWORD = exports.RECOVER_VAULT = exports.READ_ITEMS = exports.PRINT_ITEMS = exports.NO_ACCESS = exports.MANAGE_VAULT = exports.IMPORT_ITEMS = exports.EXPORT_ITEMS = exports.DELETE_ITEMS = exports.CREATE_ITEMS = exports.ARCHIVE_ITEMS = exports.WordListType = exports.SeparatorType = exports.VaultType = exports.AllowedRecipientType = exports.AllowedType = exports.ItemShareDuration = exports.ItemState = exports.AutofillBehavior = exports.ItemFieldType = exports.ItemCategory = exports.VaultAccessorType = exports.GroupState = exports.GroupType = void 0;
    var GroupType;
    (function(GroupType2) {
      GroupType2["Owners"] = "owners";
      GroupType2["Administrators"] = "administrators";
      GroupType2["Recovery"] = "recovery";
      GroupType2["ExternalAccountManagers"] = "externalAccountManagers";
      GroupType2["TeamMembers"] = "teamMembers";
      GroupType2["UserDefined"] = "userDefined";
      GroupType2["Unsupported"] = "unsupported";
    })(GroupType || (exports.GroupType = GroupType = {}));
    var GroupState;
    (function(GroupState2) {
      GroupState2["Active"] = "active";
      GroupState2["Deleted"] = "deleted";
      GroupState2["Unsupported"] = "unsupported";
    })(GroupState || (exports.GroupState = GroupState = {}));
    var VaultAccessorType;
    (function(VaultAccessorType2) {
      VaultAccessorType2["User"] = "user";
      VaultAccessorType2["Group"] = "group";
    })(VaultAccessorType || (exports.VaultAccessorType = VaultAccessorType = {}));
    var ItemCategory;
    (function(ItemCategory2) {
      ItemCategory2["Login"] = "Login";
      ItemCategory2["SecureNote"] = "SecureNote";
      ItemCategory2["CreditCard"] = "CreditCard";
      ItemCategory2["CryptoWallet"] = "CryptoWallet";
      ItemCategory2["Identity"] = "Identity";
      ItemCategory2["Password"] = "Password";
      ItemCategory2["Document"] = "Document";
      ItemCategory2["ApiCredentials"] = "ApiCredentials";
      ItemCategory2["BankAccount"] = "BankAccount";
      ItemCategory2["Database"] = "Database";
      ItemCategory2["DriverLicense"] = "DriverLicense";
      ItemCategory2["Email"] = "Email";
      ItemCategory2["MedicalRecord"] = "MedicalRecord";
      ItemCategory2["Membership"] = "Membership";
      ItemCategory2["OutdoorLicense"] = "OutdoorLicense";
      ItemCategory2["Passport"] = "Passport";
      ItemCategory2["Rewards"] = "Rewards";
      ItemCategory2["Router"] = "Router";
      ItemCategory2["Server"] = "Server";
      ItemCategory2["SshKey"] = "SshKey";
      ItemCategory2["SocialSecurityNumber"] = "SocialSecurityNumber";
      ItemCategory2["SoftwareLicense"] = "SoftwareLicense";
      ItemCategory2["Person"] = "Person";
      ItemCategory2["Unsupported"] = "Unsupported";
    })(ItemCategory || (exports.ItemCategory = ItemCategory = {}));
    var ItemFieldType;
    (function(ItemFieldType2) {
      ItemFieldType2["Text"] = "Text";
      ItemFieldType2["Concealed"] = "Concealed";
      ItemFieldType2["CreditCardType"] = "CreditCardType";
      ItemFieldType2["CreditCardNumber"] = "CreditCardNumber";
      ItemFieldType2["Phone"] = "Phone";
      ItemFieldType2["Url"] = "Url";
      ItemFieldType2["Totp"] = "Totp";
      ItemFieldType2["Email"] = "Email";
      ItemFieldType2["Reference"] = "Reference";
      ItemFieldType2["SshKey"] = "SshKey";
      ItemFieldType2["Menu"] = "Menu";
      ItemFieldType2["MonthYear"] = "MonthYear";
      ItemFieldType2["Address"] = "Address";
      ItemFieldType2["Date"] = "Date";
      ItemFieldType2["Unsupported"] = "Unsupported";
    })(ItemFieldType || (exports.ItemFieldType = ItemFieldType = {}));
    var AutofillBehavior;
    (function(AutofillBehavior2) {
      AutofillBehavior2["AnywhereOnWebsite"] = "AnywhereOnWebsite";
      AutofillBehavior2["ExactDomain"] = "ExactDomain";
      AutofillBehavior2["Never"] = "Never";
    })(AutofillBehavior || (exports.AutofillBehavior = AutofillBehavior = {}));
    var ItemState;
    (function(ItemState2) {
      ItemState2["Active"] = "active";
      ItemState2["Archived"] = "archived";
    })(ItemState || (exports.ItemState = ItemState = {}));
    var ItemShareDuration;
    (function(ItemShareDuration2) {
      ItemShareDuration2["OneHour"] = "OneHour";
      ItemShareDuration2["OneDay"] = "OneDay";
      ItemShareDuration2["SevenDays"] = "SevenDays";
      ItemShareDuration2["FourteenDays"] = "FourteenDays";
      ItemShareDuration2["ThirtyDays"] = "ThirtyDays";
    })(ItemShareDuration || (exports.ItemShareDuration = ItemShareDuration = {}));
    var AllowedType;
    (function(AllowedType2) {
      AllowedType2["Authenticated"] = "Authenticated";
      AllowedType2["Public"] = "Public";
    })(AllowedType || (exports.AllowedType = AllowedType = {}));
    var AllowedRecipientType;
    (function(AllowedRecipientType2) {
      AllowedRecipientType2["Email"] = "Email";
      AllowedRecipientType2["Domain"] = "Domain";
    })(AllowedRecipientType || (exports.AllowedRecipientType = AllowedRecipientType = {}));
    var VaultType;
    (function(VaultType2) {
      VaultType2["Personal"] = "personal";
      VaultType2["Everyone"] = "everyone";
      VaultType2["Transfer"] = "transfer";
      VaultType2["UserCreated"] = "userCreated";
      VaultType2["Unsupported"] = "unsupported";
    })(VaultType || (exports.VaultType = VaultType = {}));
    var SeparatorType;
    (function(SeparatorType2) {
      SeparatorType2["Digits"] = "digits";
      SeparatorType2["DigitsAndSymbols"] = "digitsAndSymbols";
      SeparatorType2["Spaces"] = "spaces";
      SeparatorType2["Hyphens"] = "hyphens";
      SeparatorType2["Underscores"] = "underscores";
      SeparatorType2["Periods"] = "periods";
      SeparatorType2["Commas"] = "commas";
    })(SeparatorType || (exports.SeparatorType = SeparatorType = {}));
    var WordListType;
    (function(WordListType2) {
      WordListType2["FullWords"] = "fullWords";
      WordListType2["Syllables"] = "syllables";
      WordListType2["ThreeLetters"] = "threeLetters";
    })(WordListType || (exports.WordListType = WordListType = {}));
    exports.ARCHIVE_ITEMS = 256;
    exports.CREATE_ITEMS = 128;
    exports.DELETE_ITEMS = 512;
    exports.EXPORT_ITEMS = 4194304;
    exports.IMPORT_ITEMS = 2097152;
    exports.MANAGE_VAULT = 2;
    exports.NO_ACCESS = 0;
    exports.PRINT_ITEMS = 8388608;
    exports.READ_ITEMS = 32;
    exports.RECOVER_VAULT = 1;
    exports.REVEAL_ITEM_PASSWORD = 16;
    exports.SEND_ITEMS = 1048576;
    exports.UPDATE_ITEMS = 64;
    exports.UPDATE_ITEM_HISTORY = 1024;
    var ReviverFunc = (key, value) => {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value) && (key === "createdAt" || key === "updatedAt")) {
        return new Date(value);
      }
      if (Array.isArray(value) && value.every((v) => Number.isInteger(v) && v >= 0 && v <= 255) && value.length > 0) {
        return new Uint8Array(value);
      }
      return value;
    };
    exports.ReviverFunc = ReviverFunc;
    var ReplacerFunc = (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value instanceof Uint8Array) {
        return Array.from(value);
      }
      return value;
    };
    exports.ReplacerFunc = ReplacerFunc;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.throwError = exports.RateLimitExceededError = exports.DesktopSessionExpiredError = void 0;
    var DesktopSessionExpiredError = class extends Error {
      constructor(message) {
        super();
        this.message = message;
      }
    };
    exports.DesktopSessionExpiredError = DesktopSessionExpiredError;
    var RateLimitExceededError = class extends Error {
      constructor(message) {
        super();
        this.message = message;
      }
    };
    exports.RateLimitExceededError = RateLimitExceededError;
    var throwError = (errString) => {
      let err;
      try {
        err = JSON.parse(errString);
      } catch (e) {
        throw new Error(errString);
      }
      switch (err.name) {
        case "DesktopSessionExpired":
          throw new DesktopSessionExpiredError(err.message);
        case "RateLimitExceeded":
          throw new RateLimitExceededError(err.message);
        default:
          throw new Error(err.message);
      }
    };
    exports.throwError = throwError;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/core.js
var require_core2 = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/core.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InnerClient = exports.SharedCore = exports.WasmCore = void 0;
    var sdk_core_1 = require_core();
    var types_1 = require_types();
    var errors_1 = require_errors();
    var messageLimit = 50 * 1024 * 1024;
    var WasmCore = class {
      initClient(config) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            return yield (0, sdk_core_1.init_client)(config);
          } catch (e) {
            (0, errors_1.throwError)(e);
          }
        });
      }
      invoke(config) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            return yield (0, sdk_core_1.invoke)(config);
          } catch (e) {
            (0, errors_1.throwError)(e);
          }
        });
      }
      releaseClient(clientId) {
        try {
          (0, sdk_core_1.release_client)(clientId);
        } catch (e) {
          console.warn("failed to release client:", e);
        }
      }
    };
    exports.WasmCore = WasmCore;
    var SharedCore = class {
      constructor() {
        this.inner = new WasmCore();
      }
      setInner(core) {
        this.inner = core;
      }
      initClient(config) {
        return __awaiter(this, void 0, void 0, function* () {
          const serializedConfig = JSON.stringify(config);
          return this.inner.initClient(serializedConfig);
        });
      }
      invoke(config) {
        return __awaiter(this, void 0, void 0, function* () {
          const serializedConfig = JSON.stringify(config, types_1.ReplacerFunc);
          if (new TextEncoder().encode(serializedConfig).length > messageLimit) {
            (0, errors_1.throwError)(`message size exceeds the limit of ${messageLimit} bytes, please contact 1Password at support@1password.com or https://developer.1password.com/joinslack if you need help."`);
          }
          return this.inner.invoke(serializedConfig);
        });
      }
      invoke_sync(config) {
        const serializedConfig = JSON.stringify(config, types_1.ReplacerFunc);
        if (new TextEncoder().encode(serializedConfig).length > messageLimit) {
          (0, errors_1.throwError)(`message size exceeds the limit of ${messageLimit} bytes, please contact 1Password at support@1password.com or https://developer.1password.com/joinslack if you need help.`);
        }
        return (0, sdk_core_1.invoke_sync)(serializedConfig);
      }
      releaseClient(clientId) {
        const serializedId = JSON.stringify(clientId);
        this.inner.releaseClient(serializedId);
      }
    };
    exports.SharedCore = SharedCore;
    var InnerClient = class {
      constructor(id, core, config) {
        this.id = id;
        this.core = core;
        this.config = config;
      }
      invoke(config) {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            return yield this.core.invoke(config);
          } catch (err) {
            if (err instanceof errors_1.DesktopSessionExpiredError) {
              const newId = yield this.core.initClient(this.config);
              this.id = parseInt(newId, 10);
              config.invocation.clientId = this.id;
              return yield this.core.invoke(config);
            }
            throw err;
          }
        });
      }
    };
    exports.InnerClient = InnerClient;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SDK_BUILD_NUMBER = exports.SDK_VERSION = void 0;
    exports.SDK_VERSION = "0.4.0";
    exports.SDK_BUILD_NUMBER = "0040003";
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/configuration.js
var require_configuration = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/configuration.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOsName = exports.clientAuthConfig = exports.DesktopAuth = exports.VERSION = exports.LANGUAGE = void 0;
    var os_1 = __importDefault(__require("os"));
    var version_js_1 = require_version();
    exports.LANGUAGE = "JS";
    exports.VERSION = version_js_1.SDK_BUILD_NUMBER;
    var DesktopAuth2 = class {
      constructor(accountName) {
        this.accountName = accountName;
      }
    };
    exports.DesktopAuth = DesktopAuth2;
    var clientAuthConfig = (userConfig) => {
      const defaultOsVersion = "0.0.0";
      let serviceAccountToken;
      let accountName;
      if (typeof userConfig.auth === "string") {
        serviceAccountToken = userConfig.auth;
      } else if (userConfig.auth instanceof DesktopAuth2) {
        accountName = userConfig.auth.accountName;
      }
      return {
        serviceAccountToken: serviceAccountToken !== null && serviceAccountToken !== void 0 ? serviceAccountToken : "",
        accountName,
        programmingLanguage: exports.LANGUAGE,
        sdkVersion: exports.VERSION,
        integrationName: userConfig.integrationName,
        integrationVersion: userConfig.integrationVersion,
        requestLibraryName: "Fetch API",
        requestLibraryVersion: "Fetch API",
        os: (0, exports.getOsName)(),
        osVersion: defaultOsVersion,
        architecture: os_1.default.arch()
      };
    };
    exports.clientAuthConfig = clientAuthConfig;
    var getOsName = () => {
      const os_name = os_1.default.type().toLowerCase();
      if (os_name === "windows_nt") {
        return "windows";
      }
      return os_name;
    };
    exports.getOsName = getOsName;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/secrets.js
var require_secrets = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/secrets.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Secrets_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Secrets = void 0;
    var core_js_1 = require_core2();
    var types_js_1 = require_types();
    var Secrets = class {
      constructor(inner) {
        _Secrets_inner.set(this, void 0);
        __classPrivateFieldSet(this, _Secrets_inner, inner, "f");
      }
      /**
       * Resolve returns the secret the provided secret reference points to.
       */
      resolve(secretReference) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Secrets_inner, "f").id,
              parameters: {
                name: "SecretsResolve",
                parameters: {
                  secret_reference: secretReference
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Secrets_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Resolve takes in a list of secret references and returns the secrets they point to or errors if any.
       */
      resolveAll(secretReferences) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Secrets_inner, "f").id,
              parameters: {
                name: "SecretsResolveAll",
                parameters: {
                  secret_references: secretReferences
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Secrets_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Validate the secret reference to ensure there are no syntax errors.
       */
      static validateSecretReference(secretReference) {
        const sharedCore = new core_js_1.SharedCore();
        const invocationConfig = {
          invocation: {
            parameters: {
              name: "ValidateSecretReference",
              parameters: {
                secret_reference: secretReference
              }
            }
          }
        };
        sharedCore.invoke_sync(invocationConfig);
      }
      /**
       * Generate a password using the provided recipe.
       */
      static generatePassword(recipe) {
        const sharedCore = new core_js_1.SharedCore();
        const invocationConfig = {
          invocation: {
            parameters: {
              name: "GeneratePassword",
              parameters: {
                recipe
              }
            }
          }
        };
        return JSON.parse(sharedCore.invoke_sync(invocationConfig), types_js_1.ReviverFunc);
      }
    };
    exports.Secrets = Secrets;
    _Secrets_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items_shares.js
var require_items_shares = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items_shares.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _ItemsShares_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemsShares = void 0;
    var types_js_1 = require_types();
    var ItemsShares = class {
      constructor(inner) {
        _ItemsShares_inner.set(this, void 0);
        __classPrivateFieldSet(this, _ItemsShares_inner, inner, "f");
      }
      /**
       * Get the item sharing policy of your account.
       */
      getAccountPolicy(vaultId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsShares_inner, "f").id,
              parameters: {
                name: "ItemsSharesGetAccountPolicy",
                parameters: {
                  vault_id: vaultId,
                  item_id: itemId
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsShares_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Validate the recipients of an item sharing link.
       */
      validateRecipients(policy, recipients) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsShares_inner, "f").id,
              parameters: {
                name: "ItemsSharesValidateRecipients",
                parameters: {
                  policy,
                  recipients
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsShares_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Create a new item sharing link.
       */
      create(item, policy, params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsShares_inner, "f").id,
              parameters: {
                name: "ItemsSharesCreate",
                parameters: {
                  item,
                  policy,
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsShares_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
    };
    exports.ItemsShares = ItemsShares;
    _ItemsShares_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items_files.js
var require_items_files = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items_files.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _ItemsFiles_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemsFiles = void 0;
    var types_js_1 = require_types();
    var ItemsFiles = class {
      constructor(inner) {
        _ItemsFiles_inner.set(this, void 0);
        __classPrivateFieldSet(this, _ItemsFiles_inner, inner, "f");
      }
      /**
       * Attach files to Items.
       */
      attach(item, fileParams) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsFiles_inner, "f").id,
              parameters: {
                name: "ItemsFilesAttach",
                parameters: {
                  item,
                  file_params: fileParams
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsFiles_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Read file content from the Item.
       */
      read(vaultId, itemId, attr) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsFiles_inner, "f").id,
              parameters: {
                name: "ItemsFilesRead",
                parameters: {
                  vault_id: vaultId,
                  item_id: itemId,
                  attr
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsFiles_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Delete a field file from Item using the section and field IDs.
       */
      delete(item, sectionId, fieldId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsFiles_inner, "f").id,
              parameters: {
                name: "ItemsFilesDelete",
                parameters: {
                  item,
                  section_id: sectionId,
                  field_id: fieldId
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsFiles_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Replace the document file within a document item.
       */
      replaceDocument(item, docParams) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _ItemsFiles_inner, "f").id,
              parameters: {
                name: "ItemsFilesReplaceDocument",
                parameters: {
                  item,
                  doc_params: docParams
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _ItemsFiles_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
    };
    exports.ItemsFiles = ItemsFiles;
    _ItemsFiles_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items.js
var require_items = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/items.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Items_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Items = void 0;
    var types_js_1 = require_types();
    var items_shares_js_1 = require_items_shares();
    var items_files_js_1 = require_items_files();
    var Items = class {
      constructor(inner) {
        _Items_inner.set(this, void 0);
        __classPrivateFieldSet(this, _Items_inner, inner, "f");
        this.shares = new items_shares_js_1.ItemsShares(inner);
        this.files = new items_files_js_1.ItemsFiles(inner);
      }
      /**
       * Create a new item.
       */
      create(params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsCreate",
                parameters: {
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Create items in batch, within a single vault.
       */
      createAll(vaultId, params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsCreateAll",
                parameters: {
                  vault_id: vaultId,
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Get an item by vault and item ID.
       */
      get(vaultId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsGet",
                parameters: {
                  vault_id: vaultId,
                  item_id: itemId
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Get items by vault and their item IDs.
       */
      getAll(vaultId, itemIds) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsGetAll",
                parameters: {
                  vault_id: vaultId,
                  item_ids: itemIds
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Update an existing item.
       */
      put(item) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsPut",
                parameters: {
                  item
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Delete an item.
       */
      delete(vaultId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsDelete",
                parameters: {
                  vault_id: vaultId,
                  item_id: itemId
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig);
        });
      }
      /**
       * Delete items in batch, within a single vault.
       */
      deleteAll(vaultId, itemIds) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsDeleteAll",
                parameters: {
                  vault_id: vaultId,
                  item_ids: itemIds
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Archive an item.
       */
      archive(vaultId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsArchive",
                parameters: {
                  vault_id: vaultId,
                  item_id: itemId
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig);
        });
      }
      /**
       * List items based on filters.
       */
      list(vaultId, ...filters) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Items_inner, "f").id,
              parameters: {
                name: "ItemsList",
                parameters: {
                  vault_id: vaultId,
                  filters
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Items_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
    };
    exports.Items = Items;
    _Items_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/vaults.js
var require_vaults = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/vaults.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Vaults_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vaults = void 0;
    var types_js_1 = require_types();
    var Vaults = class {
      constructor(inner) {
        _Vaults_inner.set(this, void 0);
        __classPrivateFieldSet(this, _Vaults_inner, inner, "f");
      }
      /**
       * Create a new user vault.
       */
      create(params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsCreate",
                parameters: {
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * List information about vaults that's configurable based on some input parameters.
       */
      list(params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsList",
                parameters: {
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Get an overview of a vault by its ID.
       */
      getOverview(vaultId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsGetOverview",
                parameters: {
                  vault_id: vaultId
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Get detailed vault information by vault ID and parameters.
       */
      get(vaultId, vaultParams) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsGet",
                parameters: {
                  vault_id: vaultId,
                  vault_params: vaultParams
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Update a vault
       */
      update(vaultId, params) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsUpdate",
                parameters: {
                  vault_id: vaultId,
                  params
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
      /**
       * Delete a vault by its ID.
       */
      delete(vaultId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsDelete",
                parameters: {
                  vault_id: vaultId
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig);
        });
      }
      /**
       * Grant group permissions to a vault.
       */
      grantGroupPermissions(vaultId, groupPermissionsList) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsGrantGroupPermissions",
                parameters: {
                  vault_id: vaultId,
                  group_permissions_list: groupPermissionsList
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig);
        });
      }
      /**
       * Update group permissions for vaults.
       */
      updateGroupPermissions(groupPermissionsList) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsUpdateGroupPermissions",
                parameters: {
                  group_permissions_list: groupPermissionsList
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig);
        });
      }
      /**
       * Revoke group permissions from a vault.
       */
      revokeGroupPermissions(vaultId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Vaults_inner, "f").id,
              parameters: {
                name: "VaultsRevokeGroupPermissions",
                parameters: {
                  vault_id: vaultId,
                  group_id: groupId
                }
              }
            }
          };
          yield __classPrivateFieldGet(this, _Vaults_inner, "f").invoke(invocationConfig);
        });
      }
    };
    exports.Vaults = Vaults;
    _Vaults_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/groups.js
var require_groups = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/groups.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var _Groups_inner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Groups = void 0;
    var types_js_1 = require_types();
    var Groups = class {
      constructor(inner) {
        _Groups_inner.set(this, void 0);
        __classPrivateFieldSet(this, _Groups_inner, inner, "f");
      }
      /**
       * Get a group by its ID and parameters.
       */
      get(groupId, groupParams) {
        return __awaiter(this, void 0, void 0, function* () {
          const invocationConfig = {
            invocation: {
              clientId: __classPrivateFieldGet(this, _Groups_inner, "f").id,
              parameters: {
                name: "GroupsGet",
                parameters: {
                  group_id: groupId,
                  group_params: groupParams
                }
              }
            }
          };
          return JSON.parse(yield __classPrivateFieldGet(this, _Groups_inner, "f").invoke(invocationConfig), types_js_1.ReviverFunc);
        });
      }
    };
    exports.Groups = Groups;
    _Groups_inner = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/client.js
var require_client = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Client = void 0;
    var secrets_js_1 = require_secrets();
    var items_js_1 = require_items();
    var vaults_js_1 = require_vaults();
    var groups_js_1 = require_groups();
    var Client = class {
      constructor(innerClient) {
        this.secrets = new secrets_js_1.Secrets(innerClient);
        this.items = new items_js_1.Items(innerClient);
        this.vaults = new vaults_js_1.Vaults(innerClient);
        this.groups = new groups_js_1.Groups(innerClient);
      }
    };
    exports.Client = Client;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/shared_lib_core.js
var require_shared_lib_core = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/shared_lib_core.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod2) {
        if (mod2 && mod2.__esModule) return mod2;
        var result = {};
        if (mod2 != null) {
          for (var k = ownKeys(mod2), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod2, k[i]);
        }
        __setModuleDefault(result, mod2);
        return result;
      };
    }();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SharedLibCore = void 0;
    var fs4 = __importStar(__require("fs"));
    var os = __importStar(__require("os"));
    var path2 = __importStar(__require("path"));
    var errors_1 = require_errors();
    var find1PasswordLibPath = () => {
      const platform = os.platform();
      const appRoot = path2.dirname(process.execPath);
      let searchPaths = [];
      switch (platform) {
        case "darwin":
          searchPaths = [
            "/Applications/1Password.app/Contents/Frameworks/libop_sdk_ipc_client.dylib",
            path2.join(os.homedir(), "/Applications/1Password.app/Contents/Frameworks/libop_sdk_ipc_client.dylib")
          ];
          break;
        case "linux":
          searchPaths = [
            "/usr/bin/1password/libop_sdk_ipc_client.so",
            "/opt/1Password/libop_sdk_ipc_client.so",
            "/snap/bin/1password/libop_sdk_ipc_client.so"
          ];
          break;
        case "win32":
          searchPaths = [
            path2.join(os.homedir(), "/AppData/Local/1Password/op_sdk_ipc_client.dll"),
            "C:/Program Files/1Password/app/8/op_sdk_ipc_client.dll",
            "C:/Program Files (x86)/1Password/app/8/op_sdk_ipc_client.dll",
            path2.join(os.homedir(), "/AppData/Local/1Password/app/8/op_sdk_ipc_client.dll")
          ];
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      for (const addonPath of searchPaths) {
        if (fs4.existsSync(addonPath)) {
          return addonPath;
        }
      }
      throw new Error("1Password desktop application not found");
    };
    var SharedLibCore = class {
      constructor(accountName) {
        this.lib = null;
        try {
          const libPath = find1PasswordLibPath();
          const moduleStub = { exports: {} };
          process.dlopen(moduleStub, libPath);
          if (typeof moduleStub === "object" && moduleStub !== null && typeof moduleStub.exports === "object" && moduleStub.exports !== null && "sendMessage" in moduleStub.exports && typeof moduleStub.exports.sendMessage === "function") {
            this.lib = moduleStub.exports;
          } else {
            throw new Error("Failed to initialize native library: sendMessage function not found on module.");
          }
        } catch (e) {
          console.error("A critical error occurred while loading the native addon:", e);
          this.lib = null;
        }
        this.acccountName = accountName;
      }
      /**
       * callSharedLibrary - send string to native function, receive string back.
       */
      callSharedLibrary(input, operation_type) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!this.lib) {
            throw new Error("Native library is not available.");
          }
          if (!input || input.length === 0) {
            throw new Error("internal: empty input");
          }
          const inputEncoded = Buffer.from(input, "utf8").toString("base64");
          const req = {
            account_name: this.acccountName,
            kind: operation_type,
            payload: inputEncoded
          };
          const inputBuf = Buffer.from(JSON.stringify(req), "utf8");
          const nativeResponse = yield this.lib.sendMessage(inputBuf);
          if (!(nativeResponse instanceof Uint8Array)) {
            throw new Error(`Native function returned an unexpected type. Expected Uint8Array, got ${typeof nativeResponse}`);
          }
          const respString = new TextDecoder().decode(nativeResponse);
          const response = JSON.parse(respString);
          if (response.success) {
            const decodedPayload = Buffer.from(response.payload).toString("utf8");
            return decodedPayload;
          } else {
            const errorMessage = Array.isArray(response.payload) ? String.fromCharCode(...response.payload) : JSON.stringify(response.payload);
            (0, errors_1.throwError)(errorMessage);
          }
        });
      }
      // Core interface implementation
      initClient(config) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.callSharedLibrary(config, "init_client");
        });
      }
      invoke(invokeConfigBytes) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.callSharedLibrary(invokeConfigBytes, "invoke");
        });
      }
      releaseClient(clientId) {
        this.callSharedLibrary(clientId, "release_client").catch((err) => {
          console.warn("failed to release client:", err);
        });
      }
    };
    exports.SharedLibCore = SharedLibCore;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/client_builder.js
var require_client_builder = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/client_builder.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClientWithCore = void 0;
    var core_js_1 = require_core2();
    var configuration_js_1 = require_configuration();
    var client_js_1 = require_client();
    var shared_lib_core_js_1 = require_shared_lib_core();
    var finalizationRegistry = new FinalizationRegistry((heldClient) => {
      heldClient.core.releaseClient(heldClient.id);
    });
    var createClientWithCore = (config, core) => __awaiter(void 0, void 0, void 0, function* () {
      const authConfig = (0, configuration_js_1.clientAuthConfig)(config);
      if (authConfig.accountName) {
        core.setInner(new shared_lib_core_js_1.SharedLibCore(authConfig.accountName));
      }
      const clientId = yield core.initClient(authConfig);
      const inner = new core_js_1.InnerClient(parseInt(clientId, 10), core, authConfig);
      const client = new client_js_1.Client(inner);
      finalizationRegistry.register(client, inner);
      return client;
    });
    exports.createClientWithCore = createClientWithCore;
  }
});

// node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/sdk.js
var require_sdk = __commonJS({
  "node_modules/.pnpm/@1password+sdk@0.4.0/node_modules/@1password/sdk/dist/sdk.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClient = exports.DesktopAuth = exports.Secrets = exports.DEFAULT_INTEGRATION_VERSION = exports.DEFAULT_INTEGRATION_NAME = void 0;
    var core_js_1 = require_core2();
    var client_builder_js_1 = require_client_builder();
    exports.DEFAULT_INTEGRATION_NAME = "Unknown";
    exports.DEFAULT_INTEGRATION_VERSION = "Unknown";
    var secrets_js_1 = require_secrets();
    Object.defineProperty(exports, "Secrets", { enumerable: true, get: function() {
      return secrets_js_1.Secrets;
    } });
    var configuration_js_1 = require_configuration();
    Object.defineProperty(exports, "DesktopAuth", { enumerable: true, get: function() {
      return configuration_js_1.DesktopAuth;
    } });
    __exportStar(require_client(), exports);
    __exportStar(require_errors(), exports);
    __exportStar(require_types(), exports);
    var createClient2 = (config) => __awaiter(void 0, void 0, void 0, function* () {
      return (0, client_builder_js_1.createClientWithCore)(config, new core_js_1.SharedCore());
    });
    exports.createClient = createClient2;
  }
});

// node_modules/.pnpm/varint@6.0.0/node_modules/varint/encode.js
var require_encode = __commonJS({
  "node_modules/.pnpm/varint@6.0.0/node_modules/varint/encode.js"(exports, module) {
    module.exports = encode23;
    var MSB2 = 128;
    var REST2 = 127;
    var MSBALL2 = ~REST2;
    var INT2 = Math.pow(2, 31);
    function encode23(num, out, offset) {
      if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
        encode23.bytes = 0;
        throw new RangeError("Could not encode varint");
      }
      out = out || [];
      offset = offset || 0;
      var oldOffset = offset;
      while (num >= INT2) {
        out[offset++] = num & 255 | MSB2;
        num /= 128;
      }
      while (num & MSBALL2) {
        out[offset++] = num & 255 | MSB2;
        num >>>= 7;
      }
      out[offset] = num | 0;
      encode23.bytes = offset - oldOffset + 1;
      return out;
    }
  }
});

// node_modules/.pnpm/varint@6.0.0/node_modules/varint/decode.js
var require_decode = __commonJS({
  "node_modules/.pnpm/varint@6.0.0/node_modules/varint/decode.js"(exports, module) {
    module.exports = read7;
    var MSB2 = 128;
    var REST2 = 127;
    function read7(buf2, offset) {
      var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
      do {
        if (counter >= l || shift > 49) {
          read7.bytes = 0;
          throw new RangeError("Could not decode varint");
        }
        b = buf2[counter++];
        res += shift < 28 ? (b & REST2) << shift : (b & REST2) * Math.pow(2, shift);
        shift += 7;
      } while (b >= MSB2);
      read7.bytes = counter - offset;
      return res;
    }
  }
});

// node_modules/.pnpm/varint@6.0.0/node_modules/varint/length.js
var require_length = __commonJS({
  "node_modules/.pnpm/varint@6.0.0/node_modules/varint/length.js"(exports, module) {
    var N12 = Math.pow(2, 7);
    var N22 = Math.pow(2, 14);
    var N32 = Math.pow(2, 21);
    var N42 = Math.pow(2, 28);
    var N52 = Math.pow(2, 35);
    var N62 = Math.pow(2, 42);
    var N72 = Math.pow(2, 49);
    var N82 = Math.pow(2, 56);
    var N92 = Math.pow(2, 63);
    module.exports = function(value) {
      return value < N12 ? 1 : value < N22 ? 2 : value < N32 ? 3 : value < N42 ? 4 : value < N52 ? 5 : value < N62 ? 6 : value < N72 ? 7 : value < N82 ? 8 : value < N92 ? 9 : 10;
    };
  }
});

// node_modules/.pnpm/varint@6.0.0/node_modules/varint/index.js
var require_varint = __commonJS({
  "node_modules/.pnpm/varint@6.0.0/node_modules/varint/index.js"(exports, module) {
    module.exports = {
      encode: require_encode(),
      decode: require_decode(),
      encodingLength: require_length()
    };
  }
});

// node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name8;
      if (this._eventsCount === 0) return names;
      for (name8 in events = this._events) {
        if (has.call(events, name8)) names.push(prefix ? name8.slice(1) : name8);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length2 = listeners.length, j;
        for (i = 0; i < length2; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length2 = listeners.length; i < length2; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// src/start-local.js
var import_sdk = __toESM(require_sdk(), 1);
import { homedir } from "node:os";
import { join as join2 } from "node:path";
import { createServer as createHttpServer } from "node:http";

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/ed25519.js
var ed25519_exports = {};
__export(ed25519_exports, {
  PUB_KEY_OFFSET: () => PUB_KEY_OFFSET,
  Signer: () => signer_exports,
  Verifier: () => verifier_exports,
  code: () => code2,
  decode: () => decode9,
  derive: () => derive,
  encode: () => encode7,
  format: () => format4,
  from: () => from4,
  generate: () => generate,
  name: () => name2,
  or: () => or5,
  parse: () => parse3,
  signatureAlgorithm: () => signatureAlgorithm2,
  signatureCode: () => signatureCode2
});

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/ed25519/signer.js
var signer_exports = {};
__export(signer_exports, {
  PUB_KEY_OFFSET: () => PUB_KEY_OFFSET,
  code: () => code2,
  decode: () => decode9,
  derive: () => derive,
  encode: () => encode7,
  format: () => format4,
  from: () => from4,
  generate: () => generate,
  name: () => name2,
  or: () => or5,
  parse: () => parse3,
  signatureAlgorithm: () => signatureAlgorithm2,
  signatureCode: () => signatureCode2
});

// node_modules/.pnpm/@noble+ed25519@1.7.5/node_modules/@noble/ed25519/lib/esm/index.js
import * as nodeCrypto from "crypto";
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _8n = BigInt(8);
var CU_O = BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989");
var CURVE = Object.freeze({
  a: BigInt(-1),
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  P: BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"),
  l: CU_O,
  n: CU_O,
  h: BigInt(8),
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
});
var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
var SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var SQRT_D = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var ExtendedPoint = class _ExtendedPoint {
  constructor(x, y, z, t) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
  }
  static fromAffine(p) {
    if (!(p instanceof Point)) {
      throw new TypeError("ExtendedPoint#fromAffine: expected Point");
    }
    if (p.equals(Point.ZERO))
      return _ExtendedPoint.ZERO;
    return new _ExtendedPoint(p.x, p.y, _1n, mod(p.x * p.y));
  }
  static toAffineBatch(points) {
    const toInv = invertBatch(points.map((p) => p.z));
    return points.map((p, i) => p.toAffine(toInv[i]));
  }
  static normalizeZ(points) {
    return this.toAffineBatch(points).map(this.fromAffine);
  }
  equals(other) {
    assertExtPoint(other);
    const { x: X1, y: Y1, z: Z1 } = this;
    const { x: X2, y: Y2, z: Z2 } = other;
    const X1Z2 = mod(X1 * Z2);
    const X2Z1 = mod(X2 * Z1);
    const Y1Z2 = mod(Y1 * Z2);
    const Y2Z1 = mod(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  negate() {
    return new _ExtendedPoint(mod(-this.x), this.y, this.z, mod(-this.t));
  }
  double() {
    const { x: X1, y: Y1, z: Z1 } = this;
    const { a } = CURVE;
    const M = mod;
    const A = M(X1 * X1);
    const B = M(Y1 * Y1);
    const C = M(_2n * M(Z1 * Z1));
    const D = M(a * A);
    const x1y1 = X1 + Y1;
    const E = M(M(x1y1 * x1y1) - A - B);
    const G = D + B;
    const F = G - C;
    const H = D - B;
    const X3 = M(E * F);
    const Y3 = M(G * H);
    const T3 = M(E * H);
    const Z3 = M(F * G);
    return new _ExtendedPoint(X3, Y3, Z3, T3);
  }
  add(other) {
    const { x: X1, y: Y1, z: Z1, t: T1 } = this;
    assertExtPoint(other);
    const { x: X2, y: Y2, z: Z2, t: T2 } = other;
    const { a, d } = CURVE;
    const M = mod;
    const A = M(X1 * X2);
    const B = M(Y1 * Y2);
    const C = M(T1 * d * T2);
    const D = M(Z1 * Z2);
    const E = M((X1 + Y1) * (X2 + Y2) - A - B);
    const F = M(D - C);
    const G = M(D + C);
    const H = M(B - a * A);
    const X3 = M(E * F);
    const Y3 = M(G * H);
    const T3 = M(E * H);
    const Z3 = M(F * G);
    return new _ExtendedPoint(X3, Y3, Z3, T3);
  }
  subtract(other) {
    return this.add(other.negate());
  }
  precomputeWindow(W) {
    const windows = 1 + 256 / W;
    const points = [];
    let p = this;
    let base2 = p;
    for (let window2 = 0; window2 < windows; window2++) {
      base2 = p;
      points.push(base2);
      for (let i = 1; i < 2 ** (W - 1); i++) {
        base2 = base2.add(p);
        points.push(base2);
      }
      p = base2.double();
    }
    return points;
  }
  wNAF(n, affinePoint) {
    if (!affinePoint && this.equals(_ExtendedPoint.BASE))
      affinePoint = Point.BASE;
    const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
    if (256 % W) {
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    }
    let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
    if (!precomputes) {
      precomputes = this.precomputeWindow(W);
      if (affinePoint && W !== 1) {
        precomputes = _ExtendedPoint.normalizeZ(precomputes);
        pointPrecomputes.set(affinePoint, precomputes);
      }
    }
    let p = _ExtendedPoint.ZERO;
    let f = _ExtendedPoint.BASE;
    const windows = 1 + 256 / W;
    const windowSize = 2 ** (W - 1);
    const mask = BigInt(2 ** W - 1);
    const maxNumber = 2 ** W;
    const shiftBy = BigInt(W);
    for (let window2 = 0; window2 < windows; window2++) {
      const offset = window2 * windowSize;
      let wbits = Number(n & mask);
      n >>= shiftBy;
      if (wbits > windowSize) {
        wbits -= maxNumber;
        n += _1n;
      }
      const offset1 = offset;
      const offset2 = offset + Math.abs(wbits) - 1;
      const cond1 = window2 % 2 !== 0;
      const cond2 = wbits < 0;
      if (wbits === 0) {
        f = f.add(constTimeNegate(cond1, precomputes[offset1]));
      } else {
        p = p.add(constTimeNegate(cond2, precomputes[offset2]));
      }
    }
    return _ExtendedPoint.normalizeZ([p, f])[0];
  }
  multiply(scalar, affinePoint) {
    return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
  }
  multiplyUnsafe(scalar) {
    let n = normalizeScalar(scalar, CURVE.l, false);
    const G = _ExtendedPoint.BASE;
    const P0 = _ExtendedPoint.ZERO;
    if (n === _0n)
      return P0;
    if (this.equals(P0) || n === _1n)
      return this;
    if (this.equals(G))
      return this.wNAF(n);
    let p = P0;
    let d = this;
    while (n > _0n) {
      if (n & _1n)
        p = p.add(d);
      d = d.double();
      n >>= _1n;
    }
    return p;
  }
  isSmallOrder() {
    return this.multiplyUnsafe(CURVE.h).equals(_ExtendedPoint.ZERO);
  }
  isTorsionFree() {
    let p = this.multiplyUnsafe(CURVE.l / _2n).double();
    if (CURVE.l % _2n)
      p = p.add(this);
    return p.equals(_ExtendedPoint.ZERO);
  }
  toAffine(invZ) {
    const { x, y, z } = this;
    const is0 = this.equals(_ExtendedPoint.ZERO);
    if (invZ == null)
      invZ = is0 ? _8n : invert(z);
    const ax = mod(x * invZ);
    const ay = mod(y * invZ);
    const zz = mod(z * invZ);
    if (is0)
      return Point.ZERO;
    if (zz !== _1n)
      throw new Error("invZ was invalid");
    return new Point(ax, ay);
  }
  fromRistrettoBytes() {
    legacyRist();
  }
  toRistrettoBytes() {
    legacyRist();
  }
  fromRistrettoHash() {
    legacyRist();
  }
};
ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod(CURVE.Gx * CURVE.Gy));
ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function assertExtPoint(other) {
  if (!(other instanceof ExtendedPoint))
    throw new TypeError("ExtendedPoint expected");
}
function assertRstPoint(other) {
  if (!(other instanceof RistrettoPoint))
    throw new TypeError("RistrettoPoint expected");
}
function legacyRist() {
  throw new Error("Legacy method: switch to RistrettoPoint");
}
var RistrettoPoint = class _RistrettoPoint {
  constructor(ep) {
    this.ep = ep;
  }
  static calcElligatorRistrettoMap(r0) {
    const { d } = CURVE;
    const r = mod(SQRT_M1 * r0 * r0);
    const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
    let c = BigInt(-1);
    const D = mod((c - d * r) * mod(r + d));
    let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
    let s_ = mod(s * r0);
    if (!edIsNegative(s_))
      s_ = mod(-s_);
    if (!Ns_D_is_sq)
      s = s_;
    if (!Ns_D_is_sq)
      c = r;
    const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
    const s2 = s * s;
    const W0 = mod((s + s) * D);
    const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
    const W2 = mod(_1n - s2);
    const W3 = mod(_1n + s2);
    return new ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
  }
  static hashToCurve(hex) {
    hex = ensureBytes(hex, 64);
    const r1 = bytes255ToNumberLE(hex.slice(0, 32));
    const R1 = this.calcElligatorRistrettoMap(r1);
    const r2 = bytes255ToNumberLE(hex.slice(32, 64));
    const R2 = this.calcElligatorRistrettoMap(r2);
    return new _RistrettoPoint(R1.add(R2));
  }
  static fromHex(hex) {
    hex = ensureBytes(hex, 32);
    const { a, d } = CURVE;
    const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
    const s = bytes255ToNumberLE(hex);
    if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s))
      throw new Error(emsg);
    const s2 = mod(s * s);
    const u1 = mod(_1n + a * s2);
    const u2 = mod(_1n - a * s2);
    const u1_2 = mod(u1 * u1);
    const u2_2 = mod(u2 * u2);
    const v = mod(a * d * u1_2 - u2_2);
    const { isValid, value: I } = invertSqrt(mod(v * u2_2));
    const Dx = mod(I * u2);
    const Dy = mod(I * Dx * v);
    let x = mod((s + s) * Dx);
    if (edIsNegative(x))
      x = mod(-x);
    const y = mod(u1 * Dy);
    const t = mod(x * y);
    if (!isValid || edIsNegative(t) || y === _0n)
      throw new Error(emsg);
    return new _RistrettoPoint(new ExtendedPoint(x, y, _1n, t));
  }
  toRawBytes() {
    let { x, y, z, t } = this.ep;
    const u1 = mod(mod(z + y) * mod(z - y));
    const u2 = mod(x * y);
    const u2sq = mod(u2 * u2);
    const { value: invsqrt } = invertSqrt(mod(u1 * u2sq));
    const D1 = mod(invsqrt * u1);
    const D2 = mod(invsqrt * u2);
    const zInv = mod(D1 * D2 * t);
    let D;
    if (edIsNegative(t * zInv)) {
      let _x = mod(y * SQRT_M1);
      let _y = mod(x * SQRT_M1);
      x = _x;
      y = _y;
      D = mod(D1 * INVSQRT_A_MINUS_D);
    } else {
      D = D2;
    }
    if (edIsNegative(x * zInv))
      y = mod(-y);
    let s = mod((z - y) * D);
    if (edIsNegative(s))
      s = mod(-s);
    return numberTo32BytesLE(s);
  }
  toHex() {
    return bytesToHex(this.toRawBytes());
  }
  toString() {
    return this.toHex();
  }
  equals(other) {
    assertRstPoint(other);
    const a = this.ep;
    const b = other.ep;
    const one = mod(a.x * b.y) === mod(a.y * b.x);
    const two = mod(a.y * b.y) === mod(a.x * b.x);
    return one || two;
  }
  add(other) {
    assertRstPoint(other);
    return new _RistrettoPoint(this.ep.add(other.ep));
  }
  subtract(other) {
    assertRstPoint(other);
    return new _RistrettoPoint(this.ep.subtract(other.ep));
  }
  multiply(scalar) {
    return new _RistrettoPoint(this.ep.multiply(scalar));
  }
  multiplyUnsafe(scalar) {
    return new _RistrettoPoint(this.ep.multiplyUnsafe(scalar));
  }
};
RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var Point = class _Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  _setWindowSize(windowSize) {
    this._WINDOW_SIZE = windowSize;
    pointPrecomputes.delete(this);
  }
  static fromHex(hex, strict = true) {
    const { d, P } = CURVE;
    hex = ensureBytes(hex, 32);
    const normed = hex.slice();
    normed[31] = hex[31] & ~128;
    const y = bytesToNumberLE(normed);
    if (strict && y >= P)
      throw new Error("Expected 0 < hex < P");
    if (!strict && y >= POW_2_256)
      throw new Error("Expected 0 < hex < 2**256");
    const y2 = mod(y * y);
    const u = mod(y2 - _1n);
    const v = mod(d * y2 + _1n);
    let { isValid, value: x } = uvRatio(u, v);
    if (!isValid)
      throw new Error("Point.fromHex: invalid y coordinate");
    const isXOdd = (x & _1n) === _1n;
    const isLastByteOdd = (hex[31] & 128) !== 0;
    if (isLastByteOdd !== isXOdd) {
      x = mod(-x);
    }
    return new _Point(x, y);
  }
  static async fromPrivateKey(privateKey) {
    return (await getExtendedPublicKey(privateKey)).point;
  }
  toRawBytes() {
    const bytes2 = numberTo32BytesLE(this.y);
    bytes2[31] |= this.x & _1n ? 128 : 0;
    return bytes2;
  }
  toHex() {
    return bytesToHex(this.toRawBytes());
  }
  toX25519() {
    const { y } = this;
    const u = mod((_1n + y) * invert(_1n - y));
    return numberTo32BytesLE(u);
  }
  isTorsionFree() {
    return ExtendedPoint.fromAffine(this).isTorsionFree();
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  negate() {
    return new _Point(mod(-this.x), this.y);
  }
  add(other) {
    return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
  }
  subtract(other) {
    return this.add(other.negate());
  }
  multiply(scalar) {
    return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
  }
};
Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
Point.ZERO = new Point(_0n, _1n);
var Signature = class _Signature {
  constructor(r, s) {
    this.r = r;
    this.s = s;
    this.assertValidity();
  }
  static fromHex(hex) {
    const bytes2 = ensureBytes(hex, 64);
    const r = Point.fromHex(bytes2.slice(0, 32), false);
    const s = bytesToNumberLE(bytes2.slice(32, 64));
    return new _Signature(r, s);
  }
  assertValidity() {
    const { r, s } = this;
    if (!(r instanceof Point))
      throw new Error("Expected Point instance");
    normalizeScalar(s, CURVE.l, false);
    return this;
  }
  toRawBytes() {
    const u8 = new Uint8Array(64);
    u8.set(this.r.toRawBytes());
    u8.set(numberTo32BytesLE(this.s), 32);
    return u8;
  }
  toHex() {
    return bytesToHex(this.toRawBytes());
  }
};
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes(item) {
  if (!isBytes(item))
    throw new Error("Uint8Array expected");
}
function concatBytes(...arrays) {
  arrays.every(abytes);
  if (arrays.length === 1)
    return arrays[0];
  const length2 = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length2);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}
var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes2) {
  abytes(bytes2);
  let hex = "";
  for (let i = 0; i < bytes2.length; i++) {
    hex += hexes[bytes2[i]];
  }
  return hex;
}
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array2 = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array2[ai] = n1 * 16 + n2;
  }
  return array2;
}
function numberTo32BytesBE(num) {
  const length2 = 32;
  const hex = num.toString(16).padStart(length2 * 2, "0");
  return hexToBytes(hex);
}
function numberTo32BytesLE(num) {
  return numberTo32BytesBE(num).reverse();
}
function edIsNegative(num) {
  return (mod(num) & _1n) === _1n;
}
function bytesToNumberLE(uint8a) {
  abytes(uint8a);
  return BigInt("0x" + bytesToHex(Uint8Array.from(uint8a).reverse()));
}
var MAX_255B = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function bytes255ToNumberLE(bytes2) {
  return mod(bytesToNumberLE(bytes2) & MAX_255B);
}
function mod(a, b = CURVE.P) {
  const res = a % b;
  return res >= _0n ? res : b + res;
}
function invert(number2, modulo = CURVE.P) {
  if (number2 === _0n || modulo <= _0n) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n, y = _1n, u = _1n, v = _0n;
  while (a !== _0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (num === _0n)
      return acc;
    tmp[i] = acc;
    return mod(acc * num, p);
  }, _1n);
  const inverted = invert(lastMultiplied, p);
  nums.reduceRight((acc, num, i) => {
    if (num === _0n)
      return acc;
    tmp[i] = mod(acc * tmp[i], p);
    return mod(acc * num, p);
  }, inverted);
  return tmp;
}
function pow2(x, power) {
  const { P } = CURVE;
  let res = x;
  while (power-- > _0n) {
    res *= res;
    res %= P;
  }
  return res;
}
function pow_2_252_3(x) {
  const { P } = CURVE;
  const _5n = BigInt(5);
  const _10n = BigInt(10);
  const _20n = BigInt(20);
  const _40n = BigInt(40);
  const _80n = BigInt(80);
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n) * b2 % P;
  const b5 = pow2(b4, _1n) * x % P;
  const b10 = pow2(b5, _5n) * b5 % P;
  const b20 = pow2(b10, _10n) * b10 % P;
  const b40 = pow2(b20, _20n) * b20 % P;
  const b80 = pow2(b40, _40n) * b40 % P;
  const b160 = pow2(b80, _80n) * b80 % P;
  const b240 = pow2(b160, _80n) * b80 % P;
  const b250 = pow2(b240, _10n) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n) * x % P;
  return { pow_p_5_8, b2 };
}
function uvRatio(u, v) {
  const v3 = mod(v * v * v);
  const v7 = mod(v3 * v3 * v);
  const pow = pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow);
  const vx2 = mod(v * x * x);
  const root1 = x;
  const root2 = mod(x * SQRT_M1);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u);
  const noRoot = vx2 === mod(-u * SQRT_M1);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (edIsNegative(x))
    x = mod(-x);
  return { isValid: useRoot1 || useRoot2, value: x };
}
function invertSqrt(number2) {
  return uvRatio(_1n, number2);
}
function modlLE(hash) {
  return mod(bytesToNumberLE(hash), CURVE.l);
}
function equalBytes(b1, b2) {
  if (b1.length !== b2.length) {
    return false;
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}
function ensureBytes(hex, expectedLength) {
  const bytes2 = isBytes(hex) ? Uint8Array.from(hex) : hexToBytes(hex);
  if (typeof expectedLength === "number" && bytes2.length !== expectedLength)
    throw new Error(`Expected ${expectedLength} bytes`);
  return bytes2;
}
function normalizeScalar(num, max, strict = true) {
  if (!max)
    throw new TypeError("Specify max value");
  if (typeof num === "number" && Number.isSafeInteger(num))
    num = BigInt(num);
  if (typeof num === "bigint" && num < max) {
    if (strict) {
      if (_0n < num)
        return num;
    } else {
      if (_0n <= num)
        return num;
    }
  }
  throw new TypeError("Expected valid scalar: 0 < scalar < max");
}
function adjustBytes25519(bytes2) {
  bytes2[0] &= 248;
  bytes2[31] &= 127;
  bytes2[31] |= 64;
  return bytes2;
}
function checkPrivateKey(key) {
  key = typeof key === "bigint" || typeof key === "number" ? numberTo32BytesBE(normalizeScalar(key, POW_2_256)) : ensureBytes(key);
  if (key.length !== 32)
    throw new Error(`Expected 32 bytes`);
  return key;
}
function getKeyFromHash(hashed) {
  const head = adjustBytes25519(hashed.slice(0, 32));
  const prefix = hashed.slice(32, 64);
  const scalar = modlLE(head);
  const point = Point.BASE.multiply(scalar);
  const pointBytes = point.toRawBytes();
  return { head, prefix, scalar, point, pointBytes };
}
var _sha512Sync;
async function getExtendedPublicKey(key) {
  return getKeyFromHash(await utils.sha512(checkPrivateKey(key)));
}
async function getPublicKey(privateKey) {
  return (await getExtendedPublicKey(privateKey)).pointBytes;
}
async function sign(message, privateKey) {
  message = ensureBytes(message);
  const { prefix, scalar, pointBytes } = await getExtendedPublicKey(privateKey);
  const r = modlLE(await utils.sha512(prefix, message));
  const R = Point.BASE.multiply(r);
  const k = modlLE(await utils.sha512(R.toRawBytes(), pointBytes, message));
  const s = mod(r + k * scalar, CURVE.l);
  return new Signature(R, s).toRawBytes();
}
function prepareVerification(sig, message, publicKey) {
  message = ensureBytes(message);
  if (!(publicKey instanceof Point))
    publicKey = Point.fromHex(publicKey, false);
  const { r, s } = sig instanceof Signature ? sig.assertValidity() : Signature.fromHex(sig);
  const SB = ExtendedPoint.BASE.multiplyUnsafe(s);
  return { r, s, SB, pub: publicKey, msg: message };
}
function finishVerification(publicKey, r, SB, hashed) {
  const k = modlLE(hashed);
  const kA = ExtendedPoint.fromAffine(publicKey).multiplyUnsafe(k);
  const RkA = ExtendedPoint.fromAffine(r).add(kA);
  return RkA.subtract(SB).multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
}
async function verify(sig, message, publicKey) {
  const { r, SB, msg, pub } = prepareVerification(sig, message, publicKey);
  const hashed = await utils.sha512(r.toRawBytes(), pub.toRawBytes(), msg);
  return finishVerification(pub, r, SB, hashed);
}
Point.BASE._setWindowSize(8);
var crypto = {
  node: nodeCrypto,
  web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
};
var utils = {
  bytesToHex,
  hexToBytes,
  concatBytes,
  getExtendedPublicKey,
  mod,
  invert,
  TORSION_SUBGROUP: [
    "0100000000000000000000000000000000000000000000000000000000000000",
    "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
    "0000000000000000000000000000000000000000000000000000000000000080",
    "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
    "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
    "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
    "0000000000000000000000000000000000000000000000000000000000000000",
    "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
  ],
  hashToPrivateScalar: (hash) => {
    hash = ensureBytes(hash);
    if (hash.length < 40 || hash.length > 1024)
      throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
    return mod(bytesToNumberLE(hash), CURVE.l - _1n) + _1n;
  },
  randomBytes: (bytesLength = 32) => {
    if (crypto.web) {
      return crypto.web.getRandomValues(new Uint8Array(bytesLength));
    } else if (crypto.node) {
      const { randomBytes } = crypto.node;
      return new Uint8Array(randomBytes(bytesLength).buffer);
    } else {
      throw new Error("The environment doesn't have randomBytes function");
    }
  },
  randomPrivateKey: () => {
    return utils.randomBytes(32);
  },
  sha512: async (...messages) => {
    const message = concatBytes(...messages);
    if (crypto.web) {
      const buffer2 = await crypto.web.subtle.digest("SHA-512", message.buffer);
      return new Uint8Array(buffer2);
    } else if (crypto.node) {
      return Uint8Array.from(crypto.node.createHash("sha512").update(message).digest());
    } else {
      throw new Error("The environment doesn't have sha512 function");
    }
  },
  precompute(windowSize = 8, point = Point.BASE) {
    const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
    cached._setWindowSize(windowSize);
    cached.multiply(_2n);
    return cached;
  },
  sha512Sync: void 0
};
Object.defineProperties(utils, {
  sha512Sync: {
    configurable: false,
    get() {
      return _sha512Sync;
    },
    set(val) {
      if (!_sha512Sync)
        _sha512Sync = val;
    }
  }
});

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb) {
    return true;
  }
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") {
    return o;
  }
  if (o instanceof ArrayBuffer) {
    return new Uint8Array(o);
  }
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/vendor/base-x.js
function base(ALPHABET, name8) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode23(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size2 = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size2);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size2 - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size2 - length2;
    while (it2 !== size2 && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size2; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size2 = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size2);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size2 - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size2 - length2;
    while (it4 !== size2 && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size2 - it4));
    var j2 = zeroes;
    while (it4 !== size2) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode27(string2) {
    var buffer2 = decodeUnsafe(string2);
    if (buffer2) {
      return buffer2;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode23,
    decodeUnsafe,
    decode: decode27
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bases/base.js
var Encoder = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes2) {
    if (bytes2 instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes2)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    const prefixCodePoint = prefix.codePointAt(0);
    if (prefixCodePoint === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefixCodePoint;
    this.baseDecode = baseDecode;
  }
  decode(text2) {
    if (typeof text2 === "string") {
      if (text2.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text2)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text2.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder2) {
    return or(this, decoder2);
  }
};
var ComposedDecoder = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder2) {
    return or(this, decoder2);
  }
  decode(input) {
    const prefix = input[0];
    const decoder2 = this.decoders[prefix];
    if (decoder2 != null) {
      return decoder2.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
function or(left, right) {
  return new ComposedDecoder({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name8, prefix, baseEncode);
    this.decoder = new Decoder(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name8, prefix, encode: encode23, decode: decode27 }) {
  return new Codec(name8, prefix, encode23, decode27);
}
function baseX({ name: name8, prefix, alphabet }) {
  const { encode: encode23, decode: decode27 } = base_x_default(alphabet, name8);
  return from({
    prefix,
    name: name8,
    encode: encode23,
    decode: (text2) => coerce(decode27(text2))
  });
}
function decode(string2, alphabetIdx, bitsPerChar, name8) {
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer2 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = alphabetIdx[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer2 = buffer2 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer2 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer2 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode(data, alphabet, bitsPerChar) {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer2 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer2 = buffer2 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer2 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet[mask & buffer2 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function createAlphabetIdx(alphabet) {
  const alphabetIdx = {};
  for (let i = 0; i < alphabet.length; ++i) {
    alphabetIdx[alphabet[i]] = i;
  }
  return alphabetIdx;
}
function rfc4648({ name: name8, prefix, bitsPerChar, alphabet }) {
  const alphabetIdx = createAlphabetIdx(alphabet);
  return from({
    prefix,
    name: name8,
    encode(input) {
      return encode(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabetIdx, bitsPerChar, name8);
    }
  });
}

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bases/base32.js
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bases/base36.js
var base36 = baseX({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bases/base58.js
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/varint.js
var varint_exports = {};
__export(varint_exports, {
  decode: () => decode3,
  encodeTo: () => encodeTo,
  encodingLength: () => encodingLength
});

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode2;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf2, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf2.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf2[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/varint.js
function decode3(data, offset = 0) {
  const code11 = varint_default.decode(data, offset);
  return [code11, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/hashes/digest.js
function create(code11, digest2) {
  const size2 = digest2.byteLength;
  const sizeOffset = encodingLength(code11);
  const digestOffset = sizeOffset + encodingLength(size2);
  const bytes2 = new Uint8Array(digestOffset + size2);
  encodeTo(code11, bytes2, 0);
  encodeTo(size2, bytes2, sizeOffset);
  bytes2.set(digest2, digestOffset);
  return new Digest(code11, size2, digest2, bytes2);
}
function decode4(multihash) {
  const bytes2 = coerce(multihash);
  const [code11, sizeOffset] = decode3(bytes2);
  const [size2, digestOffset] = decode3(bytes2.subarray(sizeOffset));
  const digest2 = bytes2.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size2) {
    throw new Error("Incorrect length");
  }
  return new Digest(code11, size2, digest2, bytes2);
}
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
var Digest = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code11, size2, digest2, bytes2) {
    this.code = code11;
    this.size = size2;
    this.digest = digest2;
    this.bytes = bytes2;
  }
};

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/cid.js
function format(link5, base2) {
  const { bytes: bytes2, version } = link5;
  switch (version) {
    case 0:
      return toStringV0(bytes2, baseCache(link5), base2 ?? base58btc.encoder);
    default:
      return toStringV1(bytes2, baseCache(link5), base2 ?? base32.encoder);
  }
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
}
var CID = class _CID {
  code;
  version;
  multihash;
  bytes;
  "/";
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(version, code11, multihash, bytes2) {
    this.code = code11;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes2;
    this["/"] = bytes2;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      case 1: {
        const { code: code11, multihash } = this;
        if (code11 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code11, digest: digest2 } = this.multihash;
        const multihash = create(code11, digest2);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return _CID.equals(this, other);
  }
  static equals(self2, other) {
    const unknown2 = other;
    return unknown2 != null && self2.code === unknown2.code && self2.version === unknown2.version && equals2(self2.multihash, unknown2.multihash);
  }
  toString(base2) {
    return format(this, base2);
  }
  toJSON() {
    return { "/": format(this) };
  }
  link() {
    return this;
  }
  [Symbol.toStringTag] = "CID";
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code11, multihash, bytes: bytes2 } = value;
      return new _CID(version, code11, multihash, bytes2 ?? encodeCID(version, code11, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code11 } = value;
      const digest2 = decode4(multihash);
      return _CID.create(version, code11, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code11, digest2) {
    if (typeof code11 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code11 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code11, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes2 = encodeCID(version, code11, digest2.bytes);
        return new _CID(version, code11, digest2, bytes2);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE, digest2);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code11, digest2) {
    return _CID.create(1, code11, digest2);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(bytes2) {
    const [cid, remainder] = _CID.decodeFirst(bytes2);
    if (remainder.length !== 0) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   */
  static decodeFirst(bytes2) {
    const specs = _CID.inspectBytes(bytes2);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes2.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
    return [cid, bytes2.subarray(specs.size)];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length2] = decode3(initialBytes.subarray(offset));
      offset += length2;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE;
    if (version === 18) {
      version = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size2 = offset + digestSize;
    const multihashSize = size2 - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size: size2 };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(source, base2) {
    const [prefix, bytes2] = parseCIDtoBytes(source, base2);
    const cid = _CID.decode(bytes2);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base2) {
  switch (source[0]) {
    // CIDv0 is parsed differently
    case "Q": {
      const decoder2 = base2 ?? base58btc;
      return [
        base58btc.prefix,
        decoder2.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder2 = base2 ?? base58btc;
      return [base58btc.prefix, decoder2.decode(source)];
    }
    case base32.prefix: {
      const decoder2 = base2 ?? base32;
      return [base32.prefix, decoder2.decode(source)];
    }
    case base36.prefix: {
      const decoder2 = base2 ?? base36;
      return [base36.prefix, decoder2.decode(source)];
    }
    default: {
      if (base2 == null) {
        throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base2.decode(source)];
    }
  }
}
function toStringV0(bytes2, cache2, base2) {
  const { prefix } = base2;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base2.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes2).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes2, cache2, base2) {
  const { prefix } = base2;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes2);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code11, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code11);
  const bytes2 = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes2, 0);
  encodeTo(code11, bytes2, codeOffset);
  bytes2.set(multihash, hashOffset);
  return bytes2;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/hashes/hasher.js
function from2({ name: name8, code: code11, encode: encode23 }) {
  return new Hasher(name8, code11, encode23);
}
var Hasher = class {
  name;
  code;
  encode;
  constructor(name8, code11, encode23) {
    this.name = name8;
    this.code = code11;
    this.encode = encode23;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/ed25519/verifier.js
var verifier_exports = {};
__export(verifier_exports, {
  code: () => code,
  decode: () => decode8,
  encode: () => encode6,
  format: () => format3,
  name: () => name,
  or: () => or3,
  parse: () => parse2,
  signatureAlgorithm: () => signatureAlgorithm,
  signatureCode: () => signatureCode
});

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/utf8.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var encode3 = (text2) => encoder.encode(text2);
var decode5 = (bytes2) => decoder.decode(bytes2);

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/did.js
var DID_PREFIX = "did:";
var DID_PREFIX_SIZE = DID_PREFIX.length;
var DID_KEY_PREFIX = `did:key:`;
var DID_KEY_PREFIX_SIZE = DID_KEY_PREFIX.length;
var ED25519 = 237;
var RSA = 4613;
var P256 = 4608;
var P384 = 4609;
var P521 = 4610;
var SECP256K1 = 231;
var BLS12381G1 = 234;
var BLS12381G2 = 235;
var DID_CORE = 3357;
var METHOD_OFFSET = varint_exports.encodingLength(DID_CORE);
var parse = (did2) => {
  if (!did2.startsWith(DID_PREFIX)) {
    throw new RangeError(`Invalid DID "${did2}", must start with 'did:'`);
  } else if (did2.startsWith(DID_KEY_PREFIX)) {
    const key = base58btc.decode(did2.slice(DID_KEY_PREFIX_SIZE));
    return decode6(key);
  } else {
    const suffix = encode3(did2.slice(DID_PREFIX_SIZE));
    const bytes2 = new Uint8Array(suffix.byteLength + METHOD_OFFSET);
    varint_exports.encodeTo(DID_CORE, bytes2);
    bytes2.set(suffix, METHOD_OFFSET);
    return new DID(bytes2);
  }
};
var format2 = (id) => id.did();
var from3 = (principal2) => {
  if (principal2 instanceof DID) {
    return principal2;
  } else if (principal2 instanceof Uint8Array) {
    return decode6(principal2);
  } else if (typeof principal2 === "string") {
    return parse(principal2);
  } else {
    return parse(principal2.did());
  }
};
var decode6 = (bytes2) => {
  const [code11] = varint_exports.decode(bytes2);
  const { buffer: buffer2, byteOffset, byteLength } = bytes2;
  switch (code11) {
    case P256:
      if (bytes2.length > 35) {
        throw new RangeError(`Only p256-pub compressed is supported.`);
      }
    case ED25519:
    case RSA:
    case P384:
    case P521:
    case BLS12381G1:
    case BLS12381G2:
    case SECP256K1:
      return (
        /** @type {UCAN.PrincipalView<any>} */
        new DIDKey(buffer2, byteOffset, byteLength)
      );
    case DID_CORE:
      return new DID(buffer2, byteOffset, byteLength);
    default:
      throw new RangeError(
        `Unsupported DID encoding, unknown multicode 0x${code11.toString(16)}.`
      );
  }
};
var encode4 = (principal2) => parse(principal2.did());
var DID = class extends Uint8Array {
  /**
   * @returns {ID}
   */
  did() {
    const bytes2 = new Uint8Array(this.buffer, this.byteOffset + METHOD_OFFSET);
    return (
      /** @type {ID} */
      `did:${decode5(bytes2)}`
    );
  }
  toJSON() {
    return this.did();
  }
};
var DIDKey = class extends DID {
  /**
   * @return {`did:key:${string}`}
   */
  did() {
    return `did:key:${base58btc.encode(this)}`;
  }
};

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/bases/base64.js
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/signature.js
var NON_STANDARD = 53248;
var ES256K = 53479;
var BLS12381G12 = 53482;
var BLS12381G22 = 53483;
var EdDSA = 53485;
var ES256 = 13636096;
var ES384 = 13636097;
var ES512 = 13636098;
var RS256 = 13636101;
var EIP191 = 53649;
var codeName = (code11) => {
  switch (code11) {
    case ES256K:
      return "ES256K";
    case BLS12381G12:
      return "BLS12381G1";
    case BLS12381G22:
      return "BLS12381G2";
    case EdDSA:
      return "EdDSA";
    case ES256:
      return "ES256";
    case ES384:
      return "ES384";
    case ES512:
      return "ES512";
    case RS256:
      return "RS256";
    case EIP191:
      return "EIP191";
    default:
      throw new RangeError(
        `Unknown signature algorithm code 0x${code11.toString(16)}`
      );
  }
};
var nameCode = (name8) => {
  switch (name8) {
    case "ES256K":
      return ES256K;
    case "BLS12381G1":
      return BLS12381G12;
    case "BLS12381G2":
      return BLS12381G22;
    case "EdDSA":
      return EdDSA;
    case "ES256":
      return ES256;
    case "ES384":
      return ES384;
    case "ES512":
      return ES512;
    case "RS256":
      return RS256;
    case "EIP191":
      return EIP191;
    default:
      return NON_STANDARD;
  }
};
var Signature2 = class extends Uint8Array {
  get code() {
    const [code11] = varint_exports.decode(this);
    Object.defineProperties(this, { code: { value: code11 } });
    return (
      /** @type {A} */
      code11
    );
  }
  get size() {
    const value = size(this);
    Object.defineProperties(this, { size: { value } });
    return value;
  }
  get algorithm() {
    const value = algorithm(this);
    Object.defineProperties(this, { algorithm: { value } });
    return value;
  }
  get raw() {
    const { buffer: buffer2, byteOffset, size: size2, code: code11 } = this;
    const codeSize = varint_exports.encodingLength(code11);
    const rawSize = varint_exports.encodingLength(size2);
    const value = new Uint8Array(buffer2, byteOffset + codeSize + rawSize, size2);
    Object.defineProperties(this, { raw: { value } });
    return value;
  }
  /**
   * Verify that this signature was created by the given key.
   *
   * @param {UCAN.Crypto.Verifier<A>} signer
   * @param {UCAN.ByteView<T>} payload
   */
  async verify(signer, payload) {
    try {
      if (await signer.verify(payload, this) === true) {
        return { ok: {} };
      } else {
        throw new Error("Invalid signature");
      }
    } catch (cause) {
      return { error: (
        /** @type {Error} */
        cause
      ) };
    }
  }
  toJSON() {
    return toJSON(this);
  }
};
var algorithm = (signature) => {
  const { code: code11, raw, buffer: buffer2, byteOffset } = signature;
  if (code11 === NON_STANDARD) {
    const offset = raw.byteLength + varint_exports.encodingLength(code11) + varint_exports.encodingLength(raw.byteLength);
    const bytes2 = new Uint8Array(buffer2, byteOffset + offset);
    return decode5(bytes2);
  } else {
    return codeName(code11);
  }
};
var size = (signature) => {
  const offset = varint_exports.encodingLength(signature.code);
  const [size2] = varint_exports.decode(
    new Uint8Array(signature.buffer, signature.byteOffset + offset)
  );
  return size2;
};
var create2 = (code11, raw) => {
  const _ = codeName(code11);
  const codeSize = varint_exports.encodingLength(code11);
  const rawSize = varint_exports.encodingLength(raw.byteLength);
  const signature = new Signature2(codeSize + rawSize + raw.byteLength);
  varint_exports.encodeTo(code11, signature);
  varint_exports.encodeTo(raw.byteLength, signature, codeSize);
  signature.set(raw, codeSize + rawSize);
  Object.defineProperties(signature, {
    code: { value: code11 },
    size: { value: raw.byteLength }
  });
  return signature;
};
var createNamed = (name8, raw) => {
  const code11 = nameCode(name8);
  return code11 === NON_STANDARD ? createNonStandard(name8, raw) : create2(code11, raw);
};
var createNonStandard = (name8, raw) => {
  const code11 = NON_STANDARD;
  const codeSize = varint_exports.encodingLength(code11);
  const rawSize = varint_exports.encodingLength(raw.byteLength);
  const nameBytes = encode3(name8);
  const signature = new Signature2(
    codeSize + rawSize + raw.byteLength + nameBytes.byteLength
  );
  varint_exports.encodeTo(code11, signature);
  varint_exports.encodeTo(raw.byteLength, signature, codeSize);
  signature.set(raw, codeSize + rawSize);
  signature.set(nameBytes, codeSize + rawSize + raw.byteLength);
  return signature;
};
var view = (bytes2) => new Signature2(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
var decode7 = (bytes2) => {
  if (!(bytes2 instanceof Uint8Array)) {
    throw new TypeError(
      `Can only decode Uint8Array into a Signature, instead got ${JSON.stringify(
        bytes2
      )}`
    );
  }
  const signature = view(bytes2);
  const { code: code11, algorithm: algorithm2, raw } = signature;
  return signature;
};
var encode5 = (signature) => decode7(signature);
var toJSON = (signature) => ({
  "/": { bytes: base64.baseEncode(signature) }
});

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/verifier.js
var parseWith = (did2, parsers) => {
  if (did2.startsWith("did:")) {
    for (const parser of parsers) {
      try {
        return parser.parse(did2);
      } catch (_) {
      }
    }
    throw new Error(`Unsupported did ${did2}`);
  } else {
    throw new Error(`Expected did instead got ${did2}`);
  }
};
var or2 = (left, right) => new Parser([left, right]);
var Parser = class _Parser {
  /**
   * @param {API.PrincipalParser[]} variants
   */
  constructor(variants) {
    this.variants = variants;
  }
  /**
   * @param {API.DID} did
   */
  parse(did2) {
    return parseWith(did2, this.variants);
  }
  /**
   * @param {API.PrincipalParser} parser
   */
  or(parser) {
    return new _Parser([...this.variants, parser]);
  }
};
var withDID = (key, id) => new VerifierWithDID(id, key);
var VerifierWithDID = class {
  /**
   * @param {ID} id
   * @param {API.VerifierKey<SigAlg>} key
   */
  constructor(id, key) {
    this.id = id;
    this.key = key;
  }
  did() {
    return this.id;
  }
  toDIDKey() {
    return this.key.toDIDKey();
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, SigAlg>} signature
   * @returns {API.Await<boolean>}
   */
  verify(payload, signature) {
    return this.key.verify(payload, signature);
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   */
  withDID(id) {
    return withDID(this.key, id);
  }
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/ed25519/verifier.js
var code = 237;
var name = "Ed25519";
var signatureCode = EdDSA;
var signatureAlgorithm = "EdDSA";
var PUBLIC_TAG_SIZE = varint_exports.encodingLength(code);
var SIZE = 32 + PUBLIC_TAG_SIZE;
var parse2 = (did2) => decode8(parse(did2));
var decode8 = (bytes2) => {
  const [algorithm2] = varint_exports.decode(bytes2);
  if (algorithm2 !== code) {
    throw new RangeError(
      `Unsupported key algorithm with multicode 0x${code.toString(16)}`
    );
  } else if (bytes2.byteLength !== SIZE) {
    throw new RangeError(
      `Expected Uint8Array with byteLength ${SIZE}, instead got Uint8Array with byteLength ${bytes2.byteLength}`
    );
  } else {
    return new Ed25519Verifier(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
  }
};
var format3 = (principal2) => format2(principal2);
var encode6 = (principal2) => encode4(principal2);
var Ed25519Verifier = class extends Uint8Array {
  /** @type {typeof code} */
  get code() {
    return code;
  }
  /** @type {typeof signatureCode} */
  get signatureCode() {
    return signatureCode;
  }
  /** @type {typeof signatureAlgorithm} */
  get signatureAlgorithm() {
    return signatureAlgorithm;
  }
  /**
   * Raw public key without a multiformat code.
   *
   * @readonly
   */
  get publicKey() {
    const key = new Uint8Array(this.buffer, this.byteOffset + PUBLIC_TAG_SIZE);
    Object.defineProperties(this, {
      publicKey: {
        value: key
      }
    });
    return key;
  }
  /**
   * DID of the Principal in `did:key` format.
   * @returns {API.DID<"key">}
   */
  did() {
    return `did:key:${base58btc.encode(this)}`;
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, Signature.EdDSA>} signature
   * @returns {API.Await<boolean>}
   */
  verify(payload, signature) {
    return signature.code === signatureCode && verify(signature.raw, payload, this.publicKey);
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   * @returns {API.Verifier<ID, typeof signatureCode>}
   */
  withDID(id) {
    return withDID(this, id);
  }
  toDIDKey() {
    return this.did();
  }
};
var or3 = (other) => or2({ parse: parse2 }, other);

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/signer.js
var or4 = (left, right) => new Importer([left, right]);
var Importer = class _Importer {
  /**
   * @param {Importers} variants
   */
  constructor(variants) {
    this.variants = variants;
    this.from = create3(variants);
  }
  /**
   * @template {API.SignerImporter} Other
   * @param {Other} other
   * @returns {API.CompositeImporter<[Other, ...Importers]>}
   */
  or(other) {
    return new _Importer([other, ...this.variants]);
  }
};
var create3 = (importers) => {
  const from11 = (archive2) => {
    if (archive2.id.startsWith("did:key:")) {
      return (
        /** @type {API.Signer<ID, Alg>} */
        importWith(archive2, importers)
      );
    } else {
      for (const [name8, key] of Object.entries(archive2.keys)) {
        const id = (
          /** @type {API.DIDKey} */
          name8
        );
        const signer = (
          /** @type {API.Signer<API.DIDKey, Alg>} */
          importWith(
            {
              id,
              keys: { [id]: key }
            },
            importers
          )
        );
        return signer.withDID(archive2.id);
      }
      throw new Error(`Archive ${archive2.id} contains no keys`);
    }
  };
  return (
    /** @type {API.Intersection<Importers[number]['from']>} */
    from11
  );
};
var importWith = (archive2, importers) => {
  for (const importer of importers) {
    try {
      return importer.from(archive2);
    } catch (_) {
    }
  }
  throw new Error(`Unsupported signer`);
};
var withDID2 = ({ signer, verifier }, id) => new SignerWithDID(signer, verifier.withDID(id));
var SignerWithDID = class {
  /**
   * @param {API.Signer<API.DID<'key'>, Code>} key
   * @param {API.Verifier<ID, Code>} verifier
   */
  constructor(key, verifier) {
    this.key = key;
    this.verifier = verifier;
  }
  /** @type {API.Signer<ID, Code>} */
  get signer() {
    return this;
  }
  get signatureAlgorithm() {
    return this.key.signatureAlgorithm;
  }
  get signatureCode() {
    return this.key.signatureCode;
  }
  /**
   * @returns {ID}
   */
  did() {
    return this.verifier.did();
  }
  toDIDKey() {
    return this.verifier.toDIDKey();
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   */
  withDID(id) {
    return withDID2(this.key, id);
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   */
  sign(payload) {
    return this.key.sign(payload);
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, Code>} signature
   */
  verify(payload, signature) {
    return this.verifier.verify(payload, signature);
  }
  toArchive() {
    const { keys } = this.key.toArchive();
    return {
      id: this.did(),
      keys
    };
  }
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/ed25519/signer.js
var code2 = 4864;
var name2 = name;
var signatureAlgorithm2 = signatureAlgorithm;
var signatureCode2 = signatureCode;
var PRIVATE_TAG_SIZE = varint_exports.encodingLength(code2);
var PUBLIC_TAG_SIZE2 = varint_exports.encodingLength(code);
var KEY_SIZE = 32;
var SIZE2 = PRIVATE_TAG_SIZE + KEY_SIZE + PUBLIC_TAG_SIZE2 + KEY_SIZE;
var PUB_KEY_OFFSET = PRIVATE_TAG_SIZE + KEY_SIZE;
var generate = () => derive(utils.randomPrivateKey());
var derive = async (secret) => {
  if (secret.byteLength !== KEY_SIZE) {
    throw new Error(
      `Expected Uint8Array with byteLength of ${KEY_SIZE} instead not ${secret.byteLength}`
    );
  }
  const publicKey = await getPublicKey(secret);
  const signer = new Ed25519Signer(SIZE2);
  varint_exports.encodeTo(code2, signer, 0);
  signer.set(secret, PRIVATE_TAG_SIZE);
  varint_exports.encodeTo(code, signer, PRIVATE_TAG_SIZE + KEY_SIZE);
  signer.set(publicKey, PRIVATE_TAG_SIZE + KEY_SIZE + PUBLIC_TAG_SIZE2);
  return signer;
};
var from4 = ({ id, keys }) => {
  if (id.startsWith("did:key:")) {
    const key = keys[
      /** @type {API.DIDKey} */
      id
    ];
    if (key instanceof Uint8Array) {
      return decode9(key);
    }
  }
  throw new TypeError(`Unsupported archive format`);
};
var or5 = (other) => or4({ from: from4 }, other);
var decode9 = (bytes2) => {
  if (bytes2.byteLength !== SIZE2) {
    throw new Error(
      `Expected Uint8Array with byteLength of ${SIZE2} instead not ${bytes2.byteLength}`
    );
  }
  {
    const [keyCode] = varint_exports.decode(bytes2);
    if (keyCode !== code2) {
      throw new Error(`Given bytes must be a multiformat with ${code2} tag`);
    }
  }
  {
    const [code11] = varint_exports.decode(bytes2.subarray(PUB_KEY_OFFSET));
    if (code11 !== code) {
      throw new Error(
        `Given bytes must contain public key in multiformats with ${code} tag`
      );
    }
  }
  return new Ed25519Signer(bytes2);
};
var encode7 = (signer) => signer.encode();
var format4 = (signer, encoder2) => (encoder2 || base64pad).encode(encode7(signer));
var parse3 = (principal2, decoder2) => decode9((decoder2 || base64pad).decode(principal2));
var Ed25519Signer = class extends Uint8Array {
  /** @type {typeof code} */
  get code() {
    return code2;
  }
  get signer() {
    return this;
  }
  /** @type {API.EdVerifier} */
  get verifier() {
    const bytes2 = new Uint8Array(this.buffer, PRIVATE_TAG_SIZE + KEY_SIZE);
    const verifier = decode8(bytes2);
    Object.defineProperties(this, {
      verifier: {
        value: verifier
      }
    });
    return verifier;
  }
  /**
   * Raw public key without multiformat code.
   */
  get secret() {
    const secret = new Uint8Array(this.buffer, PRIVATE_TAG_SIZE, KEY_SIZE);
    Object.defineProperties(this, {
      secret: {
        value: secret
      }
    });
    return secret;
  }
  /**
   * DID of this principal in `did:key` format.
   */
  did() {
    return this.verifier.did();
  }
  toDIDKey() {
    return this.verifier.toDIDKey();
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   * @returns {API.Signer<ID, typeof Signature.EdDSA>}
   */
  withDID(id) {
    return withDID2(this, id);
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @returns {Promise<API.SignatureView<T, typeof Signature.EdDSA>>}
   */
  async sign(payload) {
    const raw = await sign(payload, this.secret);
    return create2(this.signatureCode, raw);
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, typeof this.signatureCode>} signature
   */
  verify(payload, signature) {
    return this.verifier.verify(payload, signature);
  }
  get signatureAlgorithm() {
    return signatureAlgorithm2;
  }
  get signatureCode() {
    return EdDSA;
  }
  encode() {
    return this;
  }
  toArchive() {
    const id = this.did();
    return {
      id,
      keys: { [id]: this.encode() }
    };
  }
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa.js
var rsa_exports = {};
__export(rsa_exports, {
  Verifier: () => RSAVerifier,
  code: () => code3,
  decode: () => decode14,
  from: () => from5,
  generate: () => generate2,
  name: () => name3,
  or: () => or6,
  signatureAlgorithm: () => signatureAlgorithm3,
  signatureCode: () => signatureCode3
});

// node_modules/.pnpm/one-webcrypto@1.0.3/node_modules/one-webcrypto/node.mjs
import crypto2 from "crypto";
var webcrypto = crypto2.webcrypto;

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/multiformat.js
var tagWith = (code11, bytes2) => {
  const offset = varint_exports.encodingLength(code11);
  const multiformat = new Uint8Array(bytes2.byteLength + offset);
  varint_exports.encodeTo(code11, multiformat, 0);
  multiformat.set(bytes2, offset);
  return multiformat;
};
var untagWith = (code11, source, byteOffset = 0) => {
  const bytes2 = byteOffset !== 0 ? source.subarray(byteOffset) : source;
  const [tag, size2] = varint_exports.decode(bytes2);
  if (tag !== code11) {
    throw new Error(
      `Expected multiformat with 0x${code11.toString(
        16
      )} tag instead got 0x${tag.toString(16)}`
    );
  } else {
    return new Uint8Array(bytes2.buffer, bytes2.byteOffset + size2);
  }
};
var encodingLength2 = varint_exports.encodingLength;
var encodeTo2 = varint_exports.encodeTo;
var decode10 = varint_exports.decode;

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa/asn1.js
var TAG_SIZE = 1;
var INT_TAG = 2;
var BITSTRING_TAG = 3;
var OCTET_STRING_TAG = 4;
var SEQUENCE_TAG = 48;
var UNUSED_BIT_PAD = 0;
var encodeDERLength = (length2) => {
  if (length2 <= 127) {
    return new Uint8Array([length2]);
  }
  const octets = [];
  while (length2 !== 0) {
    octets.push(length2 & 255);
    length2 = length2 >>> 8;
  }
  octets.reverse();
  return new Uint8Array([128 | octets.length & 255, ...octets]);
};
var readDERLength = (bytes2, offset = 0) => {
  if ((bytes2[offset] & 128) === 0) {
    return { number: bytes2[offset], consumed: 1 };
  }
  const numberBytes = bytes2[offset] & 127;
  if (bytes2.length < numberBytes + 1) {
    throw new Error(
      `ASN parsing error: Too few bytes. Expected encoded length's length to be at least ${numberBytes}`
    );
  }
  let length2 = 0;
  for (let i = 0; i < numberBytes; i++) {
    length2 = length2 << 8;
    length2 = length2 | bytes2[offset + i + 1];
  }
  return { number: length2, consumed: numberBytes + 1 };
};
var skip = (input, expectedTag, position) => {
  const parsed = into(input, expectedTag, position);
  return parsed.position + parsed.length;
};
var into = (input, expectedTag, offset) => {
  const actualTag = input[offset];
  if (actualTag !== expectedTag) {
    throw new Error(
      `ASN parsing error: Expected tag 0x${expectedTag.toString(
        16
      )} at position ${offset}, but got 0x${actualTag.toString(16)}.`
    );
  }
  const length2 = readDERLength(input, offset + TAG_SIZE);
  const position = offset + TAG_SIZE + length2.consumed;
  return { position, length: length2.number };
};
var encodeBitString = (input) => {
  const length2 = encodeDERLength(input.byteLength + 1);
  const bytes2 = new Uint8Array(
    TAG_SIZE + // ASN_BITSTRING_TAG
    length2.byteLength + 1 + // amount of unused bits at the end of our bitstring
    input.byteLength
  );
  let byteOffset = 0;
  bytes2[byteOffset] = BITSTRING_TAG;
  byteOffset += TAG_SIZE;
  bytes2.set(length2, byteOffset);
  byteOffset += length2.byteLength;
  bytes2[byteOffset] = UNUSED_BIT_PAD;
  byteOffset += 1;
  bytes2.set(input, byteOffset);
  return bytes2;
};
var encodeOctetString = (input) => {
  const length2 = encodeDERLength(input.byteLength);
  const bytes2 = new Uint8Array(TAG_SIZE + length2.byteLength + input.byteLength);
  let byteOffset = 0;
  bytes2[byteOffset] = OCTET_STRING_TAG;
  byteOffset += TAG_SIZE;
  bytes2.set(length2, byteOffset);
  byteOffset += length2.byteLength;
  bytes2.set(input, byteOffset);
  return bytes2;
};
var encodeSequence = (sequence) => {
  let byteLength = 0;
  for (const item of sequence) {
    byteLength += item.byteLength;
  }
  const length2 = encodeDERLength(byteLength);
  const bytes2 = new Uint8Array(TAG_SIZE + length2.byteLength + byteLength);
  let byteOffset = 0;
  bytes2[byteOffset] = SEQUENCE_TAG;
  byteOffset += TAG_SIZE;
  bytes2.set(length2, byteOffset);
  byteOffset += length2.byteLength;
  for (const item of sequence) {
    bytes2.set(item, byteOffset);
    byteOffset += item.byteLength;
  }
  return bytes2;
};
var readSequence = (bytes2, offset = 0) => {
  const { position, length: length2 } = into(bytes2, SEQUENCE_TAG, offset);
  return new Uint8Array(bytes2.buffer, bytes2.byteOffset + position, length2);
};
var encodeInt = (input) => {
  const extra = input.byteLength === 0 || input[0] & 128 ? 1 : 0;
  const length2 = encodeDERLength(input.byteLength + extra);
  const bytes2 = new Uint8Array(
    TAG_SIZE + // INT_TAG
    length2.byteLength + input.byteLength + extra
  );
  let byteOffset = 0;
  bytes2[byteOffset] = INT_TAG;
  byteOffset += TAG_SIZE;
  bytes2.set(length2, byteOffset);
  byteOffset += length2.byteLength;
  if (extra > 0) {
    bytes2[byteOffset] = UNUSED_BIT_PAD;
    byteOffset += extra;
  }
  bytes2.set(input, byteOffset);
  return bytes2;
};
var enterSequence = (bytes2, offset = 0) => into(bytes2, SEQUENCE_TAG, offset).position;
var skipSequence = (bytes2, offset = 0) => skip(bytes2, SEQUENCE_TAG, offset);
var skipInt = (bytes2, offset = 0) => skip(bytes2, INT_TAG, offset);
var readBitString = (bytes2, offset = 0) => {
  const { position, length: length2 } = into(bytes2, BITSTRING_TAG, offset);
  const tag = bytes2[position];
  if (tag !== UNUSED_BIT_PAD) {
    throw new Error(
      `Can not read bitstring, expected length to be multiple of 8, but got ${tag} unused bits in last byte.`
    );
  }
  return new Uint8Array(
    bytes2.buffer,
    bytes2.byteOffset + position + 1,
    length2 - 1
  );
};
var readInt = (bytes2, byteOffset = 0) => {
  const { position, length: length2 } = into(bytes2, INT_TAG, byteOffset);
  let delta = 0;
  while (bytes2[position + delta] === 0) {
    delta++;
  }
  return new Uint8Array(
    bytes2.buffer,
    bytes2.byteOffset + position + delta,
    length2 - delta
  );
};
var readOctetString = (bytes2, offset = 0) => {
  const { position, length: length2 } = into(bytes2, OCTET_STRING_TAG, offset);
  return new Uint8Array(bytes2.buffer, bytes2.byteOffset + position, length2);
};
var readSequenceWith = (readers, source, byteOffset = 0) => {
  const results = [];
  const sequence = readSequence(source, byteOffset);
  let offset = 0;
  for (const read7 of readers) {
    const chunk = read7(sequence, offset);
    results.push(chunk);
    offset = chunk.byteOffset + chunk.byteLength - sequence.byteOffset;
  }
  return results;
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa/spki.js
var SPKI_PARAMS_ENCODED = new Uint8Array([
  48,
  13,
  6,
  9,
  42,
  134,
  72,
  134,
  247,
  13,
  1,
  1,
  1,
  5,
  0
]);
var encode8 = (key) => encodeSequence([SPKI_PARAMS_ENCODED, encodeBitString(key)]);
var decode11 = (info2) => {
  const offset = enterSequence(info2, 0);
  const keyOffset = skipSequence(info2, offset);
  return readBitString(info2, keyOffset);
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa/pkcs8.js
var PKSC8_HEADER = new Uint8Array([
  // version
  2,
  1,
  0,
  // privateKeyAlgorithm
  48,
  13,
  6,
  9,
  42,
  134,
  72,
  134,
  247,
  13,
  1,
  1,
  1,
  5,
  0
]);
var decode12 = (info2) => {
  let offset = 0;
  offset = enterSequence(info2, offset);
  offset = skipInt(info2, offset);
  offset = skipSequence(info2, offset);
  return readOctetString(info2, offset);
};
var encode9 = (key) => encodeSequence([PKSC8_HEADER, encodeOctetString(key)]);

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa/public-key.js
var encode10 = ({ n, e }) => encodeSequence([encodeInt(n), encodeInt(e)]);

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa/private-key.js
var VERSION = new Uint8Array();
var decode13 = (source, byteOffset = 0) => {
  const [v, n, e, d, p, q, dp, dq, qi] = readSequenceWith(
    [
      readInt,
      readInt,
      readInt,
      readInt,
      readInt,
      readInt,
      readInt,
      readInt,
      readInt
    ],
    source,
    byteOffset
  );
  return { v, n, e, d, p, q, dp, dq, qi };
};

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/rsa.js
var name3 = "RSA";
var code3 = 4869;
var verifierCode = 4613;
var signatureCode3 = RS256;
var signatureAlgorithm3 = "RS256";
var ALG = "RSASSA-PKCS1-v1_5";
var HASH_ALG = "SHA-256";
var KEY_SIZE2 = 2048;
var SALT_LENGTH = 128;
var IMPORT_PARAMS = {
  name: ALG,
  hash: { name: HASH_ALG }
};
var generate2 = async ({
  size: size2 = KEY_SIZE2,
  extractable = false
} = {}) => {
  const { publicKey, privateKey } = await webcrypto.subtle.generateKey(
    {
      name: ALG,
      modulusLength: size2,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: HASH_ALG }
    },
    extractable,
    ["sign", "verify"]
  );
  const spki = await webcrypto.subtle.exportKey("spki", publicKey);
  const publicBytes = tagWith(verifierCode, decode11(new Uint8Array(spki)));
  const verifier = new RSAVerifier({ bytes: publicBytes, publicKey });
  if (!extractable) {
    return new UnextractableRSASigner({
      privateKey,
      verifier
    });
  } else {
    const pkcs8 = await webcrypto.subtle.exportKey("pkcs8", privateKey);
    const bytes2 = tagWith(code3, decode12(new Uint8Array(pkcs8)));
    return new ExtractableRSASigner({
      privateKey,
      bytes: bytes2,
      verifier
    });
  }
};
var from5 = ({ id, keys }) => {
  if (id.startsWith("did:key:")) {
    const did2 = (
      /** @type {API.DIDKey} */
      id
    );
    const key = keys[did2];
    if (key instanceof Uint8Array) {
      return decode14(key);
    } else {
      return new UnextractableRSASigner({
        privateKey: key,
        verifier: RSAVerifier.parse(did2)
      });
    }
  } else {
    throw new TypeError(
      `RSA can not import from ${id} archive, try generic Signer instead`
    );
  }
};
var or6 = (other) => or4({ from: from5 }, other);
var decode14 = (bytes2) => {
  const rsa = decode13(untagWith(code3, bytes2));
  const publicBytes = tagWith(verifierCode, encode10(rsa));
  return new ExtractableRSASigner({
    bytes: bytes2,
    privateKey: webcrypto.subtle.importKey(
      "pkcs8",
      encode9(untagWith(code3, bytes2)),
      IMPORT_PARAMS,
      true,
      ["sign"]
    ),
    verifier: RSAVerifier.decode(publicBytes)
  });
};
var RSAVerifier = class _RSAVerifier {
  /**
   * @param {object} options
   * @param {API.Await<CryptoKey>} options.publicKey
   * @param {API.ByteView<API.RSAVerifier>} options.bytes
   */
  constructor({ publicKey, bytes: bytes2 }) {
    this.publicKey = publicKey;
    this.bytes = bytes2;
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   * @returns {API.Verifier<ID, typeof signatureCode>}
   */
  withDID(id) {
    return withDID(this, id);
  }
  toDIDKey() {
    return this.did();
  }
  /**
   * @param {API.ByteView<API.RSAVerifier>} bytes
   * @returns {API.RSAVerifier}
   */
  static decode(bytes2) {
    return new this({
      bytes: bytes2,
      publicKey: webcrypto.subtle.importKey(
        "spki",
        encode8(untagWith(verifierCode, bytes2)),
        IMPORT_PARAMS,
        true,
        ["verify"]
      )
    });
  }
  /**
   * @param {API.DIDKey} did
   * @returns {API.RSAVerifier}
   */
  static parse(did2) {
    return _RSAVerifier.decode(
      /** @type {Uint8Array} */
      parse(did2)
    );
  }
  /**
   * @param {API.PrincipalParser} other
   */
  static or(other) {
    return or2(this, other);
  }
  /** @type {typeof verifierCode} */
  get code() {
    return verifierCode;
  }
  /**
   * @type {typeof signatureCode}
   */
  get signatureCode() {
    return signatureCode3;
  }
  /**
   * @type {typeof signatureAlgorithm}
   */
  get signatureAlgorithm() {
    return signatureAlgorithm3;
  }
  /**
   * DID of the Principal in `did:key` format.
   * @returns {API.DID<"key">}
   */
  did() {
    return `did:key:${base58btc.encode(this.bytes)}`;
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, typeof this.signatureCode>} signature
   * @returns {Promise<boolean>}
   */
  async verify(payload, signature) {
    if (signature.code !== signatureCode3) {
      return false;
    }
    return webcrypto.subtle.verify(
      { name: ALG, hash: { name: HASH_ALG } },
      await this.publicKey,
      signature.raw,
      payload
    );
  }
};
var RSASigner = class {
  /**
   * @param {object} options
   * @param {API.Await<CryptoKey>} options.privateKey
   * @param {API.RSAVerifier} options.verifier
   */
  constructor({ privateKey, verifier }) {
    this.verifier = verifier;
    this.privateKey = privateKey;
  }
  get signer() {
    return this;
  }
  /**
   * @type {typeof code}
   */
  get code() {
    return code3;
  }
  /**
   * @type {typeof signatureCode}
   */
  get signatureCode() {
    return signatureCode3;
  }
  /**
   * @type {typeof signatureAlgorithm}
   */
  get signatureAlgorithm() {
    return signatureAlgorithm3;
  }
  did() {
    return this.verifier.did();
  }
  toDIDKey() {
    return this.verifier.toDIDKey();
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @param {API.Signature<T, typeof this.signatureCode>} signature
   */
  verify(payload, signature) {
    return this.verifier.verify(payload, signature);
  }
  /**
   * @template T
   * @param {API.ByteView<T>} payload
   * @returns {Promise<API.SignatureView<T, typeof signatureCode>>}
   */
  async sign(payload) {
    const buffer2 = await webcrypto.subtle.sign(
      { name: ALG, saltLength: SALT_LENGTH },
      await this.privateKey,
      payload
    );
    return create2(signatureCode3, new Uint8Array(buffer2));
  }
};
var ExtractableRSASigner = class extends RSASigner {
  /**
   * @param {object} options
   * @param {API.Await<CryptoKey>} options.privateKey
   * @param {EncodedSigner} options.bytes
   * @param {API.RSAVerifier} options.verifier
   */
  constructor(options) {
    super(options);
    this.bytes = options.bytes;
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   * @returns {API.Signer<ID, typeof signatureCode>}
   */
  withDID(id) {
    return withDID2(this, id);
  }
  toArchive() {
    const id = this.did();
    return {
      id,
      keys: { [id]: this.bytes }
    };
  }
};
var UnextractableRSASigner = class extends RSASigner {
  /**
   * @param {object} options
   * @param {CryptoKey} options.privateKey
   * @param {API.RSAVerifier} options.verifier
   */
  constructor(options) {
    super(options);
    this.privateKey = options.privateKey;
  }
  /**
   * @template {API.DID} ID
   * @param {ID} id
   * @returns {API.Signer<ID, typeof signatureCode>}
   */
  withDID(id) {
    return withDID2(this, id);
  }
  toArchive() {
    const id = this.did();
    return {
      id,
      keys: { [id]: this.privateKey }
    };
  }
};

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/lib.js
var lib_exports = {};
__export(lib_exports, {
  VERSION: () => VERSION2,
  code: () => code8,
  decode: () => decode21,
  encode: () => encode18,
  format: () => format7,
  isExpired: () => isExpired,
  isTooEarly: () => isTooEarly,
  issue: () => issue,
  link: () => link,
  name: () => name6,
  now: () => now,
  parse: () => parse6,
  verifySignature: () => verifySignature,
  write: () => write
});

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/is.js
var typeofs = [
  "string",
  "number",
  "bigint",
  "symbol"
];
var objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "HTMLElement",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function is(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer(value)) {
    return "Buffer";
  }
  const objectType = getObjectType(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/token.js
var Type = class {
  /**
   * @param {number} major
   * @param {string} name
   * @param {boolean} terminal
   */
  constructor(major, name8, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name8;
    this.terminal = terminal;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
  }
};
Type.uint = new Type(0, "uint", true);
Type.negint = new Type(1, "negint", true);
Type.bytes = new Type(2, "bytes", true);
Type.string = new Type(3, "string", true);
Type.array = new Type(4, "array", false);
Type.map = new Type(5, "map", false);
Type.tag = new Type(6, "tag", false);
Type.float = new Type(7, "float", true);
Type.false = new Type(7, "false", true);
Type.true = new Type(7, "true", true);
Type.null = new Type(7, "null", true);
Type.undefined = new Type(7, "undefined", true);
Type.break = new Type(7, "break", true);
var Token = class {
  /**
   * @param {Type} type
   * @param {any} [value]
   * @param {number} [encodedLength]
   */
  constructor(type, value, encodedLength) {
    this.type = type;
    this.value = value;
    this.encodedLength = encodedLength;
    this.encodedBytes = void 0;
    this.byteValue = void 0;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/byte-utils.js
var useBuffer = globalThis.process && // @ts-ignore
!globalThis.process.browser && // @ts-ignore
globalThis.Buffer && // @ts-ignore
typeof globalThis.Buffer.isBuffer === "function";
var textDecoder = new TextDecoder();
var textEncoder = new TextEncoder();
function isBuffer2(buf2) {
  return useBuffer && globalThis.Buffer.isBuffer(buf2);
}
function asU8A(buf2) {
  if (!(buf2 instanceof Uint8Array)) {
    return Uint8Array.from(buf2);
  }
  return isBuffer2(buf2) ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength) : buf2;
}
var toString2 = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes2, start, end) => {
    return end - start > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(bytes2.subarray(start, end)).toString("utf8")
    ) : utf8Slice(bytes2, start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes2, start, end) => {
    return end - start > 64 ? textDecoder.decode(bytes2.subarray(start, end)) : utf8Slice(bytes2, start, end);
  }
);
var fromString = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string2) => {
    return string2.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string2)
    ) : utf8ToBytes(string2);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string2) => {
    return string2.length > 64 ? textEncoder.encode(string2) : utf8ToBytes(string2);
  }
);
var fromArray = (arr) => {
  return Uint8Array.from(arr);
};
var slice = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes2, start, end) => {
    if (isBuffer2(bytes2)) {
      return new Uint8Array(bytes2.subarray(start, end));
    }
    return bytes2.slice(start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes2, start, end) => {
    return bytes2.slice(start, end);
  }
);
var concat = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length2) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A(globalThis.Buffer.concat(chunks, length2));
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length2) => {
    const out = new Uint8Array(length2);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  }
);
var alloc = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size2) => {
    return globalThis.Buffer.allocUnsafe(size2);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size2) => {
    return new Uint8Array(size2);
  }
);
function compare(b1, b2) {
  if (isBuffer2(b1) && isBuffer2(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}
function utf8Slice(buf2, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf2[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf2[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf2[offset + 1];
          thirdByte = buf2[offset + 2];
          fourthByte = buf2[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/bl.js
var defaultChunkSize = 256;
var Bl = class {
  /**
   * @param {number} [chunkSize]
   */
  constructor(chunkSize = defaultChunkSize) {
    this.chunkSize = chunkSize;
    this.cursor = 0;
    this.maxCursor = -1;
    this.chunks = [];
    this._initReuseChunk = null;
  }
  reset() {
    this.cursor = 0;
    this.maxCursor = -1;
    if (this.chunks.length) {
      this.chunks = [];
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk);
      this.maxCursor = this._initReuseChunk.length - 1;
    }
  }
  /**
   * @param {Uint8Array|number[]} bytes
   */
  push(bytes2) {
    let topChunk = this.chunks[this.chunks.length - 1];
    const newMax = this.cursor + bytes2.length;
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
      topChunk.set(bytes2, chunkPos);
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
          this.maxCursor = this.cursor - 1;
        }
      }
      if (bytes2.length < 64 && bytes2.length < this.chunkSize) {
        topChunk = alloc(this.chunkSize);
        this.chunks.push(topChunk);
        this.maxCursor += topChunk.length;
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk;
        }
        topChunk.set(bytes2, 0);
      } else {
        this.chunks.push(bytes2);
        this.maxCursor += bytes2.length;
      }
    }
    this.cursor += bytes2.length;
  }
  /**
   * @param {boolean} [reset]
   * @returns {Uint8Array}
   */
  toBytes(reset = false) {
    let byts;
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0];
      if (reset && this.cursor > chunk.length / 2) {
        byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
        this._initReuseChunk = null;
        this.chunks = [];
      } else {
        byts = slice(chunk, 0, this.cursor);
      }
    } else {
      byts = concat(this.chunks, this.cursor);
    }
    if (reset) {
      this.reset();
    }
    return byts;
  }
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/common.js
var decodeErrPrefix = "CBOR decode error:";
var encodeErrPrefix = "CBOR encode error:";
var uintMinorPrefixBytes = [];
uintMinorPrefixBytes[23] = 1;
uintMinorPrefixBytes[24] = 2;
uintMinorPrefixBytes[25] = 3;
uintMinorPrefixBytes[26] = 5;
uintMinorPrefixBytes[27] = 9;
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`);
  }
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/0uint.js
var uintBoundaries = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
function encodeUint(buf2, token) {
  return encodeUintValue(buf2, 0, token.value);
}
function encodeUintValue(buf2, major, uint) {
  if (uint < uintBoundaries[0]) {
    const nuint = Number(uint);
    buf2.push([major | nuint]);
  } else if (uint < uintBoundaries[1]) {
    const nuint = Number(uint);
    buf2.push([major | 24, nuint]);
  } else if (uint < uintBoundaries[2]) {
    const nuint = Number(uint);
    buf2.push([major | 25, nuint >>> 8, nuint & 255]);
  } else if (uint < uintBoundaries[3]) {
    const nuint = Number(uint);
    buf2.push([major | 26, nuint >>> 24 & 255, nuint >>> 16 & 255, nuint >>> 8 & 255, nuint & 255]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries[4]) {
      const set = [major | 27, 0, 0, 0, 0, 0, 0, 0];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set[8] = lo & 255;
      lo = lo >> 8;
      set[7] = lo & 255;
      lo = lo >> 8;
      set[6] = lo & 255;
      lo = lo >> 8;
      set[5] = lo & 255;
      set[4] = hi & 255;
      hi = hi >> 8;
      set[3] = hi & 255;
      hi = hi >> 8;
      set[2] = hi & 255;
      hi = hi >> 8;
      set[1] = hi & 255;
      buf2.push(set);
    } else {
      throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
    }
  }
}
encodeUint.encodedSize = function encodedSize(token) {
  return encodeUintValue.encodedSize(token.value);
};
encodeUintValue.encodedSize = function encodedSize2(uint) {
  if (uint < uintBoundaries[0]) {
    return 1;
  }
  if (uint < uintBoundaries[1]) {
    return 2;
  }
  if (uint < uintBoundaries[2]) {
    return 3;
  }
  if (uint < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/1negint.js
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
var neg1b = BigInt(-1);
var pos1b = BigInt(1);
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9);
}
function encodeNegint(buf2, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  encodeUintValue(buf2, token.type.majorEncoded, unsigned);
}
encodeNegint.encodedSize = function encodedSize3(token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  if (unsigned < uintBoundaries[0]) {
    return 1;
  }
  if (unsigned < uintBoundaries[1]) {
    return 2;
  }
  if (unsigned < uintBoundaries[2]) {
    return 3;
  }
  if (unsigned < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/2bytes.js
function toToken(data, pos, prefix, length2) {
  assertEnoughData(data, pos, prefix + length2);
  const buf2 = slice(data, pos + prefix, pos + prefix + length2);
  return new Token(Type.bytes, buf2, prefix + length2);
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor);
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeBytes64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
  }
  return toToken(data, pos, 9, l);
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type.string ? fromString(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes(buf2, token) {
  const bytes2 = tokenBytes(token);
  encodeUintValue(buf2, token.type.majorEncoded, bytes2.length);
  buf2.push(bytes2);
}
encodeBytes.encodedSize = function encodedSize4(token) {
  const bytes2 = tokenBytes(token);
  return encodeUintValue.encodedSize(bytes2.length) + bytes2.length;
};
encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
  return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
};
function compareBytes(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/3string.js
function toToken2(data, pos, prefix, length2, options) {
  const totLength = prefix + length2;
  assertEnoughData(data, pos, totLength);
  const tok = new Token(Type.string, toString2(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken2(data, pos, 1, minor, options);
}
function decodeString8(data, pos, _minor, options) {
  return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
function decodeString16(data, pos, _minor, options) {
  return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
function decodeString32(data, pos, _minor, options) {
  return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
function decodeString64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
  }
  return toToken2(data, pos, 9, l, options);
}
var encodeString = encodeBytes;

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/4array.js
function toToken3(_data, _pos, prefix, length2) {
  return new Token(Type.array, length2, prefix);
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken3(data, pos, 1, minor);
}
function decodeArray8(data, pos, _minor, options) {
  return toToken3(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeArray16(data, pos, _minor, options) {
  return toToken3(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeArray32(data, pos, _minor, options) {
  return toToken3(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeArray64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
  }
  return toToken3(data, pos, 9, l);
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken3(data, pos, 1, Infinity);
}
function encodeArray(buf2, token) {
  encodeUintValue(buf2, Type.array.majorEncoded, token.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
encodeArray.encodedSize = function encodedSize5(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/5map.js
function toToken4(_data, _pos, prefix, length2) {
  return new Token(Type.map, length2, prefix);
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken4(data, pos, 1, minor);
}
function decodeMap8(data, pos, _minor, options) {
  return toToken4(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeMap16(data, pos, _minor, options) {
  return toToken4(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeMap32(data, pos, _minor, options) {
  return toToken4(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeMap64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
  }
  return toToken4(data, pos, 9, l);
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken4(data, pos, 1, Infinity);
}
function encodeMap(buf2, token) {
  encodeUintValue(buf2, Type.map.majorEncoded, token.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
encodeMap.encodedSize = function encodedSize6(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/6tag.js
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1);
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
function encodeTag(buf2, token) {
  encodeUintValue(buf2, Type.tag.majorEncoded, token.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
encodeTag.encodedSize = function encodedSize7(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/7float.js
var MINOR_FALSE = 20;
var MINOR_TRUE = 21;
var MINOR_NULL = 22;
var MINOR_UNDEFINED = 23;
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1);
  }
  return new Token(Type.undefined, void 0, 1);
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return new Token(Type.break, void 0, 1);
}
function createToken(value, bytes2, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
    }
  }
  return new Token(Type.float, value, bytes2);
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options);
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options);
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options);
}
function encodeFloat(buf2, token, options) {
  const float2 = token.value;
  if (float2 === false) {
    buf2.push([Type.float.majorEncoded | MINOR_FALSE]);
  } else if (float2 === true) {
    buf2.push([Type.float.majorEncoded | MINOR_TRUE]);
  } else if (float2 === null) {
    buf2.push([Type.float.majorEncoded | MINOR_NULL]);
  } else if (float2 === void 0) {
    buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat16(float2);
      decoded = readFloat16(ui8a, 1);
      if (float2 === decoded || Number.isNaN(float2)) {
        ui8a[0] = 249;
        buf2.push(ui8a.slice(0, 3));
        success = true;
      } else {
        encodeFloat32(float2);
        decoded = readFloat32(ui8a, 1);
        if (float2 === decoded) {
          ui8a[0] = 250;
          buf2.push(ui8a.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat64(float2);
      decoded = readFloat64(ui8a, 1);
      ui8a[0] = 251;
      buf2.push(ui8a.slice(0, 9));
    }
  }
}
encodeFloat.encodedSize = function encodedSize8(token, options) {
  const float2 = token.value;
  if (float2 === false || float2 === true || float2 === null || float2 === void 0) {
    return 1;
  }
  if (!options || options.float64 !== true) {
    encodeFloat16(float2);
    let decoded = readFloat16(ui8a, 1);
    if (float2 === decoded || Number.isNaN(float2)) {
      return 3;
    }
    encodeFloat32(float2);
    decoded = readFloat32(ui8a, 1);
    if (float2 === decoded) {
      return 5;
    }
  }
  return 9;
};
var buffer = new ArrayBuffer(9);
var dataView = new DataView(buffer, 1);
var ui8a = new Uint8Array(buffer, 0);
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false);
  } else {
    dataView.setFloat32(0, inp);
    const valu32 = dataView.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | /* sign bit */
        1 << 24 + logicalExponent, false);
      } else {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat16(ui8a2, pos) {
  if (ui8a2.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  }
  const half = (ui8a2[pos] << 8) + ui8a2[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false);
}
function readFloat32(ui8a2, pos) {
  if (ui8a2.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false);
}
function readFloat64(ui8a2, pos) {
  if (ui8a2.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  }
  const offset = (ui8a2.byteOffset || 0) + pos;
  return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false);
}
encodeFloat.compareTokens = encodeUint.compareTokens;

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/jump.js
function invalidMinor(data, pos, minor) {
  throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`);
  };
}
var jump = [];
for (let i = 0; i <= 23; i++) {
  jump[i] = invalidMinor;
}
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let i = 32; i <= 55; i++) {
  jump[i] = invalidMinor;
}
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let i = 64; i <= 87; i++) {
  jump[i] = decodeBytesCompact;
}
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) {
  jump[i] = decodeStringCompact;
}
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) {
  jump[i] = decodeArrayCompact;
}
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let i = 160; i <= 183; i++) {
  jump[i] = decodeMapCompact;
}
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let i = 192; i <= 215; i++) {
  jump[i] = decodeTagCompact;
}
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let i = 224; i <= 243; i++) {
  jump[i] = errorer("simple values are not supported");
}
jump[244] = invalidMinor;
jump[245] = invalidMinor;
jump[246] = invalidMinor;
jump[247] = decodeUndefined;
jump[248] = errorer("simple values are not supported");
jump[249] = decodeFloat16;
jump[250] = decodeFloat32;
jump[251] = decodeFloat64;
jump[252] = invalidMinor;
jump[253] = invalidMinor;
jump[254] = invalidMinor;
jump[255] = decodeBreak;
var quick = [];
for (let i = 0; i < 24; i++) {
  quick[i] = new Token(Type.uint, i, 1);
}
for (let i = -1; i >= -24; i--) {
  quick[31 - i] = new Token(Type.negint, i, 1);
}
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
quick[96] = new Token(Type.string, "", 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, false, 1);
quick[245] = new Token(Type.true, true, 1);
quick[246] = new Token(Type.null, null, 1);
function quickEncodeToken(token) {
  switch (token.type) {
    case Type.false:
      return fromArray([244]);
    case Type.true:
      return fromArray([245]);
    case Type.null:
      return fromArray([246]);
    case Type.bytes:
      if (!token.value.length) {
        return fromArray([64]);
      }
      return;
    case Type.string:
      if (token.value === "") {
        return fromArray([96]);
      }
      return;
    case Type.array:
      if (token.value === 0) {
        return fromArray([128]);
      }
      return;
    case Type.map:
      if (token.value === 0) {
        return fromArray([160]);
      }
      return;
    case Type.uint:
      if (token.value < 24) {
        return fromArray([Number(token.value)]);
      }
      return;
    case Type.negint:
      if (token.value >= -24) {
        return fromArray([31 - Number(token.value)]);
      }
  }
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/encode.js
var defaultEncodeOptions = {
  float64: false,
  mapSorter,
  quickEncodeToken
};
function makeCborEncoders() {
  const encoders = [];
  encoders[Type.uint.major] = encodeUint;
  encoders[Type.negint.major] = encodeNegint;
  encoders[Type.bytes.major] = encodeBytes;
  encoders[Type.string.major] = encodeString;
  encoders[Type.array.major] = encodeArray;
  encoders[Type.map.major] = encodeMap;
  encoders[Type.tag.major] = encodeTag;
  encoders[Type.float.major] = encodeFloat;
  return encoders;
}
var cborEncoders = makeCborEncoders();
var buf = new Bl();
var Ref = class _Ref {
  /**
   * @param {object|any[]} obj
   * @param {Reference|undefined} parent
   */
  constructor(obj, parent) {
    this.obj = obj;
    this.parent = parent;
  }
  /**
   * @param {object|any[]} obj
   * @returns {boolean}
   */
  includes(obj) {
    let p = this;
    do {
      if (p.obj === obj) {
        return true;
      }
    } while (p = p.parent);
    return false;
  }
  /**
   * @param {Reference|undefined} stack
   * @param {object|any[]} obj
   * @returns {Reference}
   */
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix} object contains circular references`);
    }
    return new _Ref(obj, stack);
  }
};
var simpleTokens = {
  null: new Token(Type.null, null),
  undefined: new Token(Type.undefined, void 0),
  true: new Token(Type.true, true),
  false: new Token(Type.false, false),
  emptyArray: new Token(Type.array, 0),
  emptyMap: new Token(Type.map, 0)
};
var typeEncoders = {
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token(Type.float, obj);
    } else if (obj >= 0) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  string(obj, _typ, _options, _refStack) {
    return new Token(Type.string, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens.true : simpleTokens.false;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens.null;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens.undefined;
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  DataView(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyArray, new Token(Type.break)];
      }
      return simpleTokens.emptyArray;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries2 = [];
    let i = 0;
    for (const e of obj) {
      entries2[i++] = objectToTokens(e, options, refStack);
    }
    if (options.addBreakTokens) {
      return [new Token(Type.array, obj.length), entries2, new Token(Type.break)];
    }
    return [new Token(Type.array, obj.length), entries2];
  },
  /**
   * @param {any} obj
   * @param {string} typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Object(obj, typ, options, refStack) {
    const isMap = typ !== "Object";
    const keys = isMap ? obj.keys() : Object.keys(obj);
    const length2 = isMap ? obj.size : keys.length;
    if (!length2) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyMap, new Token(Type.break)];
      }
      return simpleTokens.emptyMap;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries2 = [];
    let i = 0;
    for (const key of keys) {
      entries2[i++] = [
        objectToTokens(key, options, refStack),
        objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
      ];
    }
    sortMapEntries(entries2, options);
    if (options.addBreakTokens) {
      return [new Token(Type.map, length2), entries2, new Token(Type.break)];
    }
    return [new Token(Type.map, length2), entries2];
  }
};
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
  typeEncoders[`${typ}Array`] = typeEncoders.DataView;
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj);
  const customTypeEncoder = options && options.typeEncoders && /** @type {OptionalTypeEncoder} */
  options.typeEncoders[typ] || typeEncoders[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries(entries2, options) {
  if (options.mapSorter) {
    entries2.sort(options.mapSorter);
  }
}
function mapSorter(e1, e2) {
  const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0];
  const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0];
  if (keyToken1.type !== keyToken2.type) {
    return keyToken1.type.compare(keyToken2.type);
  }
  const major = keyToken1.type.major;
  const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2);
  if (tcmp === 0) {
    console.warn("WARNING: complex key types used, CBOR key sorting guarantees are gone");
  }
  return tcmp;
}
function tokensToEncoded(buf2, tokens, encoders, options) {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      tokensToEncoded(buf2, token, encoders, options);
    }
  } else {
    encoders[tokens.type.major](buf2, tokens, options);
  }
}
function encodeCustom(data, encoders, options) {
  const tokens = objectToTokens(data, options);
  if (!Array.isArray(tokens) && options.quickEncodeToken) {
    const quickBytes = options.quickEncodeToken(tokens);
    if (quickBytes) {
      return quickBytes;
    }
    const encoder2 = encoders[tokens.type.major];
    if (encoder2.encodedSize) {
      const size2 = encoder2.encodedSize(tokens, options);
      const buf2 = new Bl(size2);
      encoder2(buf2, tokens, options);
      if (buf2.chunks.length !== 1) {
        throw new Error(`Unexpected error: pre-calculated length for ${tokens} was wrong`);
      }
      return asU8A(buf2.chunks[0]);
    }
  }
  buf.reset();
  tokensToEncoded(buf, tokens, encoders, options);
  return buf.toBytes(true);
}
function encode11(data, options) {
  options = Object.assign({}, defaultEncodeOptions, options);
  return encodeCustom(data, cborEncoders, options);
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/decode.js
var defaultDecodeOptions = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true
};
var Tokeniser = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const byt = this.data[this._pos];
    let token = quick[byt];
    if (token === void 0) {
      const decoder2 = jump[byt];
      if (!decoder2) {
        throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
      }
      const minor = byt & 31;
      token = decoder2(this.data, this._pos, minor, this.options);
    }
    this._pos += token.encodedLength;
    return token;
  }
};
var DONE = Symbol.for("DONE");
var BREAK = Symbol.for("BREAK");
function tokenToArray(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options);
    if (value === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
    }
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options);
    if (key === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
    }
    if (key === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject(tokeniser, options);
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE;
  }
  const token = tokeniser.next();
  if (token.type === Type.break) {
    return BREAK;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options);
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options);
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decodeFirst(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions, options);
  const tokeniser = options.tokenizer || new Tokeniser(data, options);
  const decoded = tokensToObject(tokeniser, options);
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`);
  }
  return [decoded, data.subarray(tokeniser.pos())];
}
function decode15(data, options) {
  const [decoded, remainder] = decodeFirst(data, options);
  if (remainder.length > 0) {
    throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
  }
  return decoded;
}

// node_modules/.pnpm/@ipld+dag-cbor@9.2.4/node_modules/@ipld/dag-cbor/src/index.js
var CID_CBOR_TAG = 42;
function toByteView(buf2) {
  if (buf2 instanceof ArrayBuffer) {
    return new Uint8Array(buf2, 0, buf2.byteLength);
  }
  return buf2;
}
function cidEncoder(obj) {
  if (obj.asCID !== obj && obj["/"] !== obj.bytes) {
    return null;
  }
  const cid = CID.asCID(obj);
  if (!cid) {
    return null;
  }
  const bytes2 = new Uint8Array(cid.bytes.byteLength + 1);
  bytes2.set(cid.bytes, 1);
  return [
    new Token(Type.tag, CID_CBOR_TAG),
    new Token(Type.bytes, bytes2)
  ];
}
function undefinedEncoder() {
  throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function numberEncoder(num) {
  if (Number.isNaN(num)) {
    throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
  }
  return null;
}
var _encodeOptions = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder,
    undefined: undefinedEncoder,
    number: numberEncoder
  }
};
var encodeOptions = {
  ..._encodeOptions,
  typeEncoders: {
    ..._encodeOptions.typeEncoders
  }
};
function cidDecoder(bytes2) {
  if (bytes2[0] !== 0) {
    throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
  }
  return CID.decode(bytes2.subarray(1));
}
var _decodeOptions = {
  allowIndefinite: false,
  coerceUndefinedToNull: true,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  // this will lead to BigInt for ints outside of
  // safe-integer range, which may surprise users
  strict: true,
  useMaps: false,
  rejectDuplicateMapKeys: true,
  /** @type {import('cborg').TagDecoder[]} */
  tags: []
};
_decodeOptions.tags[CID_CBOR_TAG] = cidDecoder;
var decodeOptions = {
  ..._decodeOptions,
  tags: _decodeOptions.tags.slice()
};
var name4 = "dag-cbor";
var code4 = 113;
var encode12 = (node) => encode11(node, _encodeOptions);
var decode16 = (data) => decode15(toByteView(data), _decodeOptions);

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/link.js
var DAG_PB_CODE2 = 112;
function createLegacy(digest2) {
  return CID.create(0, DAG_PB_CODE2, digest2);
}
function create4(code11, digest2) {
  return CID.create(1, code11, digest2);
}
function isLink(value) {
  if (value == null) {
    return false;
  }
  const withSlash = value;
  if (withSlash["/"] != null && withSlash["/"] === withSlash.bytes) {
    return true;
  }
  const withAsCID = value;
  if (withAsCID.asCID === value) {
    return true;
  }
  return false;
}
function parse4(source, base2) {
  return CID.parse(source, base2);
}

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/hashes/identity.js
var code5 = 0;
var name5 = "identity";
var encode13 = coerce;
function digest(input) {
  return create(code5, encode13(input));
}
var identity = { code: code5, name: name5, encode: encode13, digest };

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/codecs/raw.js
var code6 = 85;

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/schema.js
var readPayload = (data) => readPayloadWith(data, {
  readPrincipal,
  readProof
});
var readJWTPayload = (data) => readPayloadWith(data, {
  readPrincipal: readStringPrincipal,
  readProof: readStringProof
});
var readPayloadWith = (data, { readPrincipal: readPrincipal2, readProof: readProof2 }) => ({
  iss: readPrincipal2(data.iss, "iss"),
  aud: readPrincipal2(data.aud, "aud"),
  att: readCapabilities(data.att, "att"),
  prf: readOptionalArray(data.prf, readProof2, "prf") || [],
  exp: readNullable(data.exp === Infinity ? null : data.exp, readInt2, "exp"),
  nbf: readOptional(data.nbf, readInt2, "nbf"),
  fct: readOptionalArray(data.fct, readFact, "fct") || [],
  nnc: readOptional(data.nnc, readString, "nnc")
});
var readSignature = (source) => {
  if (source instanceof Uint8Array) {
    return decode7(source);
  } else {
    throw new TypeError(
      `Can only decode Uint8Array into a Signature, instead got ${JSON.stringify(
        source
      )}`
    );
  }
};
var readInt2 = (input, name8) => Number.isInteger(input) ? (
  /** @type {number} */
  input
) : ParseError.throw(
  `Expected ${name8} to be integer, instead got ${JSON.stringify(input)}`
);
var readCapability = (input, context) => readStruct(input, asCapability, context);
var readCapabilities = (input, context) => (
  /** @type {C} */
  readArray(input, readCapability, context)
);
var asCapability = (input) => (
  /** @type {C} */
  {
    ...input,
    can: readAbility(input.can),
    with: readResource(input.with)
  }
);
var readAbility = (input) => typeof input !== "string" ? ParseError.throw(
  `Capability has invalid 'can: ${JSON.stringify(
    input
  )}', value must be a string`
) : input.slice(1, -1).includes("/") ? (
  /** @type {UCAN.Ability} */
  input.toLocaleLowerCase()
) : input === "*" ? input : ParseError.throw(
  `Capability has invalid 'can: "${input}"', value must have at least one path segment`
);
var readResource = (input) => typeof input !== "string" ? ParseError.throw(
  `Capability has invalid 'with: ${JSON.stringify(
    input
  )}', value must be a string`
) : parseURL(input) || ParseError.throw(
  `Capability has invalid 'with: "${input}"', value must be a valid URI string`
);
var parseURL = (input) => {
  try {
    new URL(input);
    return input;
  } catch (_) {
    return null;
  }
};
var readArray = (input, read7, context) => Array.isArray(input) ? input.map((element, n) => read7(element, `${context}[${n}]`)) : ParseError.throw(`${context} must be an array`);
var readOptionalArray = (input, reader, context) => input === void 0 ? input : readArray(input, reader, context);
var readStruct = (input, reader, context) => input != null && typeof input === "object" ? reader(input) : ParseError.throw(
  `${context} must be of type object, instead got ${input}`
);
var readFact = (input, context) => readStruct(input, Object, context);
var readProof = (source, context) => isLink(source) ? (
  /** @type {UCAN.Link} */
  source
) : fail(
  `Expected ${context} to be IPLD link, instead got ${JSON.stringify(
    source
  )}`
);
var readStringProof = (source, context) => parseProof(readString(source, context));
var parseProof = (source) => {
  try {
    return parse4(source);
  } catch (error4) {
    return create4(code6, identity.digest(encode3(source)));
  }
};
var readPrincipal = (input, context) => decode6(readBytes(input, context));
var readStringPrincipal = (source, context) => parse(readString(source, context));
var readOptional = (source, read7, context = "Field") => source !== void 0 ? read7(source, context) : void 0;
var readNullable = (source, read7, context) => source === null ? null : read7(source, context);
var readString = (source, context = "Field") => typeof source === "string" ? source : fail(`${context} has invalid value ${source}`);
var readBytes = (source, context) => source instanceof Uint8Array ? source : fail(
  `Expected ${context} to be Uint8Array, instead got ${JSON.stringify(
    source
  )}`
);
var readVersion = (input, context) => /\d+\.\d+\.\d+/.test(
  /** @type {string} */
  input
) ? (
  /** @type {UCAN.Version} */
  input
) : ParseError.throw(`Invalid version '${context}: ${JSON.stringify(input)}'`);
var readLiteral = (input, literal2, context) => input === literal2 ? literal2 : ParseError.throw(
  `Expected ${context} to be a ${JSON.stringify(
    literal2
  )} instead got ${JSON.stringify(input)}`
);
var ParseError = class extends TypeError {
  get name() {
    return "ParseError";
  }
  /**
   * @param {string} message
   * @returns {never}
   */
  static throw(message) {
    throw new this(message);
  }
};
var fail = (reason) => ParseError.throw(reason);

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/json/encode.js
var JSONEncoder = class extends Array {
  constructor() {
    super();
    this.inRecursive = [];
  }
  /**
   * @param {Bl} buf
   */
  prefix(buf2) {
    const recurs = this.inRecursive[this.inRecursive.length - 1];
    if (recurs) {
      if (recurs.type === Type.array) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          buf2.push([44]);
        }
      }
      if (recurs.type === Type.map) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          if (recurs.elements % 2 === 1) {
            buf2.push([44]);
          } else {
            buf2.push([58]);
          }
        }
      }
    }
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.uint.major](buf2, token) {
    this.prefix(buf2);
    const is2 = String(token.value);
    const isa = [];
    for (let i = 0; i < is2.length; i++) {
      isa[i] = is2.charCodeAt(i);
    }
    buf2.push(isa);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.negint.major](buf2, token) {
    this[Type.uint.major](buf2, token);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type.bytes.major](_buf, _token) {
    throw new Error(`${encodeErrPrefix} unsupported type: Uint8Array`);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.string.major](buf2, token) {
    this.prefix(buf2);
    const byts = fromString(JSON.stringify(token.value));
    buf2.push(byts.length > 32 ? asU8A(byts) : byts);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type.array.major](buf2, _token) {
    this.prefix(buf2);
    this.inRecursive.push({ type: Type.array, elements: 0 });
    buf2.push([91]);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type.map.major](buf2, _token) {
    this.prefix(buf2);
    this.inRecursive.push({ type: Type.map, elements: 0 });
    buf2.push([123]);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type.tag.major](_buf, _token) {
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type.float.major](buf2, token) {
    if (token.type.name === "break") {
      const recurs = this.inRecursive.pop();
      if (recurs) {
        if (recurs.type === Type.array) {
          buf2.push([93]);
        } else if (recurs.type === Type.map) {
          buf2.push([125]);
        } else {
          throw new Error("Unexpected recursive type; this should not happen!");
        }
        return;
      }
      throw new Error("Unexpected break; this should not happen!");
    }
    if (token.value === void 0) {
      throw new Error(`${encodeErrPrefix} unsupported type: undefined`);
    }
    this.prefix(buf2);
    if (token.type.name === "true") {
      buf2.push([116, 114, 117, 101]);
      return;
    } else if (token.type.name === "false") {
      buf2.push([102, 97, 108, 115, 101]);
      return;
    } else if (token.type.name === "null") {
      buf2.push([110, 117, 108, 108]);
      return;
    }
    const is2 = String(token.value);
    const isa = [];
    let dp = false;
    for (let i = 0; i < is2.length; i++) {
      isa[i] = is2.charCodeAt(i);
      if (!dp && (isa[i] === 46 || isa[i] === 101 || isa[i] === 69)) {
        dp = true;
      }
    }
    if (!dp) {
      isa.push(46);
      isa.push(48);
    }
    buf2.push(isa);
  }
};
function mapSorter2(e1, e2) {
  if (Array.isArray(e1[0]) || Array.isArray(e2[0])) {
    throw new Error(`${encodeErrPrefix} complex map keys are not supported`);
  }
  const keyToken1 = e1[0];
  const keyToken2 = e2[0];
  if (keyToken1.type !== Type.string || keyToken2.type !== Type.string) {
    throw new Error(`${encodeErrPrefix} non-string map keys are not supported`);
  }
  if (keyToken1 < keyToken2) {
    return -1;
  }
  if (keyToken1 > keyToken2) {
    return 1;
  }
  throw new Error(`${encodeErrPrefix} unexpected duplicate map keys, this is not supported`);
}
var defaultEncodeOptions2 = { addBreakTokens: true, mapSorter: mapSorter2 };
function encode14(data, options) {
  options = Object.assign({}, defaultEncodeOptions2, options);
  return encodeCustom(data, new JSONEncoder(), options);
}

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/json/decode.js
var Tokenizer = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
    this.modeStack = ["value"];
    this.lastToken = "";
  }
  pos() {
    return this._pos;
  }
  /**
   * @returns {boolean}
   */
  done() {
    return this._pos >= this.data.length;
  }
  /**
   * @returns {number}
   */
  ch() {
    return this.data[this._pos];
  }
  /**
   * @returns {string}
   */
  currentMode() {
    return this.modeStack[this.modeStack.length - 1];
  }
  skipWhitespace() {
    let c = this.ch();
    while (c === 32 || c === 9 || c === 13 || c === 10) {
      c = this.data[++this._pos];
    }
  }
  /**
   * @param {number[]} str
   */
  expect(str) {
    if (this.data.length - this._pos < str.length) {
      throw new Error(`${decodeErrPrefix} unexpected end of input at position ${this._pos}`);
    }
    for (let i = 0; i < str.length; i++) {
      if (this.data[this._pos++] !== str[i]) {
        throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...str)}'`);
      }
    }
  }
  parseNumber() {
    const startPos = this._pos;
    let negative = false;
    let float2 = false;
    const swallow = (chars) => {
      while (!this.done()) {
        const ch = this.ch();
        if (chars.includes(ch)) {
          this._pos++;
        } else {
          break;
        }
      }
    };
    if (this.ch() === 45) {
      negative = true;
      this._pos++;
    }
    if (this.ch() === 48) {
      this._pos++;
      if (this.ch() === 46) {
        this._pos++;
        float2 = true;
      } else {
        return new Token(Type.uint, 0, this._pos - startPos);
      }
    }
    swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    if (negative && this._pos === startPos + 1) {
      throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
    }
    if (!this.done() && this.ch() === 46) {
      if (float2) {
        throw new Error(`${decodeErrPrefix} unexpected token at position ${this._pos}`);
      }
      float2 = true;
      this._pos++;
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    if (!this.done() && (this.ch() === 101 || this.ch() === 69)) {
      float2 = true;
      this._pos++;
      if (!this.done() && (this.ch() === 43 || this.ch() === 45)) {
        this._pos++;
      }
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    const numStr = String.fromCharCode.apply(null, this.data.subarray(startPos, this._pos));
    const num = parseFloat(numStr);
    if (float2) {
      return new Token(Type.float, num, this._pos - startPos);
    }
    if (this.options.allowBigInt !== true || Number.isSafeInteger(num)) {
      return new Token(num >= 0 ? Type.uint : Type.negint, num, this._pos - startPos);
    }
    return new Token(num >= 0 ? Type.uint : Type.negint, BigInt(numStr), this._pos - startPos);
  }
  /**
   * @returns {Token}
   */
  parseString() {
    if (this.ch() !== 34) {
      throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}; this shouldn't happen`);
    }
    this._pos++;
    for (let i = this._pos, l = 0; i < this.data.length && l < 65536; i++, l++) {
      const ch = this.data[i];
      if (ch === 92 || ch < 32 || ch >= 128) {
        break;
      }
      if (ch === 34) {
        const str = String.fromCharCode.apply(null, this.data.subarray(this._pos, i));
        this._pos = i + 1;
        return new Token(Type.string, str, l);
      }
    }
    const startPos = this._pos;
    const chars = [];
    const readu4 = () => {
      if (this._pos + 4 >= this.data.length) {
        throw new Error(`${decodeErrPrefix} unexpected end of unicode escape sequence at position ${this._pos}`);
      }
      let u4 = 0;
      for (let i = 0; i < 4; i++) {
        let ch = this.ch();
        if (ch >= 48 && ch <= 57) {
          ch -= 48;
        } else if (ch >= 97 && ch <= 102) {
          ch = ch - 97 + 10;
        } else if (ch >= 65 && ch <= 70) {
          ch = ch - 65 + 10;
        } else {
          throw new Error(`${decodeErrPrefix} unexpected unicode escape character at position ${this._pos}`);
        }
        u4 = u4 * 16 + ch;
        this._pos++;
      }
      return u4;
    };
    const readUtf8Char = () => {
      const firstByte = this.ch();
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (this._pos + bytesPerSequence > this.data.length) {
        throw new Error(`${decodeErrPrefix} unexpected unicode sequence at position ${this._pos}`);
      }
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        /* c8 ignore next 6 */
        // this case is dealt with by the caller function
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = this.data[this._pos + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          fourthByte = this.data[this._pos + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        chars.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      chars.push(codePoint);
      this._pos += bytesPerSequence;
    };
    while (!this.done()) {
      const ch = this.ch();
      let ch1;
      switch (ch) {
        case 92:
          this._pos++;
          if (this.done()) {
            throw new Error(`${decodeErrPrefix} unexpected string termination at position ${this._pos}`);
          }
          ch1 = this.ch();
          this._pos++;
          switch (ch1) {
            case 34:
            // '"'
            case 39:
            // '\''
            case 92:
            // '\'
            case 47:
              chars.push(ch1);
              break;
            case 98:
              chars.push(8);
              break;
            case 116:
              chars.push(9);
              break;
            case 110:
              chars.push(10);
              break;
            case 102:
              chars.push(12);
              break;
            case 114:
              chars.push(13);
              break;
            case 117:
              chars.push(readu4());
              break;
            default:
              throw new Error(`${decodeErrPrefix} unexpected string escape character at position ${this._pos}`);
          }
          break;
        case 34:
          this._pos++;
          return new Token(Type.string, decodeCodePointsArray(chars), this._pos - startPos);
        default:
          if (ch < 32) {
            throw new Error(`${decodeErrPrefix} invalid control character at position ${this._pos}`);
          } else if (ch < 128) {
            chars.push(ch);
            this._pos++;
          } else {
            readUtf8Char();
          }
      }
    }
    throw new Error(`${decodeErrPrefix} unexpected end of string at position ${this._pos}`);
  }
  /**
   * @returns {Token}
   */
  parseValue() {
    switch (this.ch()) {
      case 123:
        this.modeStack.push("obj-start");
        this._pos++;
        return new Token(Type.map, Infinity, 1);
      case 91:
        this.modeStack.push("array-start");
        this._pos++;
        return new Token(Type.array, Infinity, 1);
      case 34: {
        return this.parseString();
      }
      case 110:
        this.expect([110, 117, 108, 108]);
        return new Token(Type.null, null, 4);
      case 102:
        this.expect([102, 97, 108, 115, 101]);
        return new Token(Type.false, false, 5);
      case 116:
        this.expect([116, 114, 117, 101]);
        return new Token(Type.true, true, 4);
      case 45:
      // '-'
      case 48:
      // '0'
      case 49:
      // '1'
      case 50:
      // '2'
      case 51:
      // '3'
      case 52:
      // '4'
      case 53:
      // '5'
      case 54:
      // '6'
      case 55:
      // '7'
      case 56:
      // '8'
      case 57:
        return this.parseNumber();
      default:
        throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}`);
    }
  }
  /**
   * @returns {Token}
   */
  next() {
    this.skipWhitespace();
    switch (this.currentMode()) {
      case "value":
        this.modeStack.pop();
        return this.parseValue();
      case "array-value": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      case "array-start": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      // @ts-ignore
      case "obj-key":
        if (this.ch() === 125) {
          this.modeStack.pop();
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.skipWhitespace();
      case "obj-start": {
        this.modeStack.pop();
        if (this.ch() === 125) {
          this._pos++;
          this.skipWhitespace();
          return new Token(Type.break, void 0, 1);
        }
        const token = this.parseString();
        this.skipWhitespace();
        if (this.ch() !== 58) {
          throw new Error(`${decodeErrPrefix} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("obj-value");
        return token;
      }
      case "obj-value": {
        this.modeStack.pop();
        this.modeStack.push("obj-key");
        this.skipWhitespace();
        return this.parseValue();
      }
      /* c8 ignore next 2 */
      default:
        throw new Error(`${decodeErrPrefix} unexpected parse state at position ${this._pos}; this shouldn't happen`);
    }
  }
};
function decode17(data, options) {
  options = Object.assign({ tokenizer: new Tokenizer(data, options) }, options);
  return decode15(data, options);
}

// node_modules/.pnpm/@ipld+dag-json@10.2.5/node_modules/@ipld/dag-json/src/index.js
function toByteView2(buf2) {
  if (buf2 instanceof ArrayBuffer) {
    return new Uint8Array(buf2, 0, buf2.byteLength);
  }
  return buf2;
}
function cidEncoder2(obj) {
  if (obj.asCID !== obj && obj["/"] !== obj.bytes) {
    return null;
  }
  const cid = CID.asCID(obj);
  if (!cid) {
    return null;
  }
  const cidString = cid.toString();
  return [
    new Token(Type.map, Infinity, 1),
    new Token(Type.string, "/", 1),
    // key
    new Token(Type.string, cidString, cidString.length),
    // value
    new Token(Type.break, void 0, 1)
  ];
}
function bytesEncoder(bytes2) {
  const bytesString = base64.encode(bytes2).slice(1);
  return [
    new Token(Type.map, Infinity, 1),
    new Token(Type.string, "/", 1),
    // key
    new Token(Type.map, Infinity, 1),
    // value
    new Token(Type.string, "bytes", 5),
    // inner key
    new Token(Type.string, bytesString, bytesString.length),
    // inner value
    new Token(Type.break, void 0, 1),
    new Token(Type.break, void 0, 1)
  ];
}
function taBytesEncoder(obj) {
  return bytesEncoder(new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
}
function abBytesEncoder(ab) {
  return bytesEncoder(new Uint8Array(ab));
}
function undefinedEncoder2() {
  throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function numberEncoder2(num) {
  if (Number.isNaN(num)) {
    throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
  }
  return null;
}
var encodeOptions2 = {
  typeEncoders: {
    Object: cidEncoder2,
    Buffer: bytesEncoder,
    Uint8Array: bytesEncoder,
    Int8Array: taBytesEncoder,
    Uint16Array: taBytesEncoder,
    Int16Array: taBytesEncoder,
    Uint32Array: taBytesEncoder,
    Int32Array: taBytesEncoder,
    Float32Array: taBytesEncoder,
    Float64Array: taBytesEncoder,
    Uint8ClampedArray: taBytesEncoder,
    BigInt64Array: taBytesEncoder,
    BigUint64Array: taBytesEncoder,
    DataView: taBytesEncoder,
    ArrayBuffer: abBytesEncoder,
    undefined: undefinedEncoder2,
    number: numberEncoder2
  }
};
var DagJsonTokenizer = class extends Tokenizer {
  /**
   * @param {Uint8Array} data
   * @param {object} [options]
   */
  constructor(data, options) {
    super(data, options);
    this.tokenBuffer = [];
  }
  /**
   * @returns {boolean}
   */
  done() {
    return this.tokenBuffer.length === 0 && super.done();
  }
  /**
   * @returns {Token}
   */
  _next() {
    if (this.tokenBuffer.length > 0) {
      return this.tokenBuffer.pop();
    }
    return super.next();
  }
  /**
   * Implements rules outlined in https://github.com/ipld/specs/pull/356
   *
   * @returns {Token}
   */
  next() {
    const token = this._next();
    if (token.type === Type.map) {
      const keyToken = this._next();
      if (keyToken.type === Type.string && keyToken.value === "/") {
        const valueToken = this._next();
        if (valueToken.type === Type.string) {
          const breakToken = this._next();
          if (breakToken.type !== Type.break) {
            throw new Error("Invalid encoded CID form");
          }
          this.tokenBuffer.push(valueToken);
          return new Token(Type.tag, 42, 0);
        }
        if (valueToken.type === Type.map) {
          const innerKeyToken = this._next();
          if (innerKeyToken.type === Type.string && innerKeyToken.value === "bytes") {
            const innerValueToken = this._next();
            if (innerValueToken.type === Type.string) {
              for (let i = 0; i < 2; i++) {
                const breakToken = this._next();
                if (breakToken.type !== Type.break) {
                  throw new Error("Invalid encoded Bytes form");
                }
              }
              const bytes2 = base64.decode(`m${innerValueToken.value}`);
              return new Token(Type.bytes, bytes2, innerValueToken.value.length);
            }
            this.tokenBuffer.push(innerValueToken);
          }
          this.tokenBuffer.push(innerKeyToken);
        }
        this.tokenBuffer.push(valueToken);
      }
      this.tokenBuffer.push(keyToken);
    }
    return token;
  }
};
var decodeOptions2 = {
  allowIndefinite: false,
  allowUndefined: false,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  // this will lead to BigInt for ints outside of
  // safe-integer range, which may surprise users
  strict: true,
  useMaps: false,
  rejectDuplicateMapKeys: true,
  /** @type {import('cborg').TagDecoder[]} */
  tags: []
};
decodeOptions2.tags[42] = CID.parse;
var encode15 = (node) => encode14(node, encodeOptions2);
var decode18 = (data) => {
  const buf2 = toByteView2(data);
  const options = Object.assign(decodeOptions2, { tokenizer: new DagJsonTokenizer(buf2, decodeOptions2) });
  return decode17(buf2, options);
};
var utf8Decoder = new TextDecoder();
var utf8Encoder = new TextEncoder();

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/formatter.js
var format5 = (model) => {
  const header = formatHeader(model.v, model.s.algorithm);
  const payload = formatPayload(model);
  const signature = formatSignature(model.s);
  return (
    /** @type {UCAN.JWT<C>} */
    `${header}.${payload}.${signature}`
  );
};
var formatSignPayload = (payload, version, alg) => `${formatHeader(version, alg)}.${formatPayload(payload)}`;
var formatHeader = (version, alg) => base64url.baseEncode(encodeHeader(version, alg));
var formatPayload = (data) => base64url.baseEncode(encodePayload(data));
var formatSignature = (signature) => base64url.baseEncode(signature.raw);
var encodeHeader = (v, alg) => encode15({
  alg,
  ucv: v,
  typ: "JWT"
});
var encodePayload = (data) => encode15({
  iss: format2(data.iss),
  aud: format2(data.aud),
  att: data.att,
  exp: data.exp,
  prf: data.prf.map(encodeProof),
  // leave out optionals and empty fields
  ...data.fct.length > 0 && { fct: data.fct },
  ...data.nnc && { nnc: data.nnc },
  ...data.nbf && { nbf: data.nbf }
});
var encodeProof = (proof) => (
  /** @type {UCAN.ToString<UCAN.Link>} */
  proof.toString()
);

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/view.js
var toJSON3 = (data) => JSON.parse(decode5(encode15(data)));
var View = class {
  /**
   * @param {UCAN.UCAN<C>} model
   */
  constructor(model) {
    this.model = model;
  }
  get version() {
    return this.model.v;
  }
  get issuer() {
    return from3(this.model.iss);
  }
  get audience() {
    return from3(this.model.aud);
  }
  /**
   * @returns {C}
   */
  get capabilities() {
    return this.model.att;
  }
  /**
   * @returns {number}
   */
  get expiration() {
    const { exp } = this.model;
    return exp === null ? Infinity : exp;
  }
  /**
   * @returns {undefined|number}
   */
  get notBefore() {
    return this.model.nbf;
  }
  /**
   * @returns {undefined|string}
   */
  get nonce() {
    return this.model.nnc;
  }
  /**
   * @returns {UCAN.Fact[]}
   */
  get facts() {
    return this.model.fct;
  }
  /**
   * @returns {UCAN.Link[]}
   */
  get proofs() {
    return this.model.prf;
  }
  get signature() {
    return this.model.s;
  }
  // compatibility with UCAN.UCAN
  get jwt() {
    return this.model.jwt;
  }
  get s() {
    return this.model.s;
  }
  get v() {
    return this.model.v;
  }
  get iss() {
    return this.model.iss;
  }
  get aud() {
    return this.model.aud;
  }
  get att() {
    return this.model.att;
  }
  get exp() {
    return this.model.exp;
  }
  get nbf() {
    return this.model.nbf;
  }
  get nnc() {
    return this.model.nnc;
  }
  get fct() {
    return this.model.fct;
  }
  get prf() {
    return this.model.prf;
  }
  /**
   * @returns {UCAN.ToJSON<UCAN.UCAN<C>, UCAN.UCANJSON<this>>}
   */
  toJSON() {
    const { v, iss, aud, s, att, prf, exp, fct, nnc, nbf } = this.model;
    return {
      iss,
      aud,
      v,
      s,
      exp,
      ...toJSON3({
        att,
        prf,
        ...fct.length > 0 && { fct }
      }),
      ...nnc != null && { nnc },
      ...nbf && { nbf }
    };
  }
};

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/codec/cbor.js
var code7 = code4;
var from6 = (model) => new CBORView(model);
var encode16 = (model) => {
  const { fct, nnc, nbf, ...payload } = readPayload(model);
  return (
    /** @type {Uint8Array} */
    encode12({
      // leave out optionals unless they are set
      ...fct.length > 0 && { fct },
      ...nnc != null && { nnc },
      ...nbf && { nbf },
      ...payload,
      // add version and signature
      v: readVersion(model.v, "v"),
      s: encodeSignature(model.s, "s")
    })
  );
};
var encodeSignature = (signature, context) => {
  try {
    return encode5(signature);
  } catch (cause) {
    throw new Error(
      `Expected signature ${context}, instead got ${JSON.stringify(signature)}`,
      // @ts-expect-error - types don't know about second arg
      { cause }
    );
  }
};
var decode19 = (bytes2) => {
  const model = decode16(bytes2);
  return new CBORView({
    ...readPayload(model),
    v: readVersion(model.v, "v"),
    s: readSignature(model.s)
  });
};
var CBORView = class extends View {
  /** @type {UCAN.MulticodecCode<typeof code, "CBOR">} */
  get code() {
    return code7;
  }
  format() {
    return format5(this.model);
  }
  encode() {
    return encode16(this.model);
  }
};

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/parser.js
var parse5 = (jwt) => {
  const segments = jwt.split(".");
  const [header, payload, signature] = segments.length === 3 ? segments : fail(
    `Can't parse UCAN: ${jwt}: Expected JWT format: 3 dot-separated base64url-encoded values.`
  );
  const { ucv, alg } = parseHeader(header);
  return {
    ...parsePayload(payload),
    v: ucv,
    s: createNamed(alg, base64url.baseDecode(signature))
  };
};
var parseHeader = (header) => {
  const { ucv, alg, typ } = decode18(base64url.baseDecode(header));
  return {
    typ: readLiteral(typ, "JWT", "typ"),
    ucv: readVersion(ucv, "ucv"),
    alg: readString(alg, "alg")
  };
};
var parsePayload = (source) => {
  const payload = decode18(base64url.baseDecode(source));
  return readJWTPayload(payload);
};

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/codec/jwt.js
var from7 = (model) => new JWTView(model);
var decode20 = (bytes2) => {
  const jwt = (
    /** @type {UCAN.JWT<C>} */
    decode5(bytes2)
  );
  return new JWTView({ ...parse5(jwt), jwt });
};
var encode17 = ({ jwt }) => encode3(jwt);
var format6 = ({ jwt }) => jwt;
var JWTView = class extends View {
  /**
   * @param {UCAN.FromJWT<C>} model
   */
  constructor(model) {
    super(model);
    this.model = model;
  }
  /** @type {UCAN.MulticodecCode<typeof code, "Raw">} */
  get code() {
    return code6;
  }
  format() {
    return format6(this.model);
  }
  encode() {
    return encode17(this.model);
  }
};

// node_modules/.pnpm/multiformats@13.3.7/node_modules/multiformats/dist/src/hashes/sha2.js
import crypto3 from "crypto";
var sha256 = from2({
  name: "sha2-256",
  code: 18,
  encode: (input) => coerce(crypto3.createHash("sha256").update(input).digest())
});
var sha512 = from2({
  name: "sha2-512",
  code: 19,
  encode: (input) => coerce(crypto3.createHash("sha512").update(input).digest())
});

// node_modules/.pnpm/@ipld+dag-ucan@3.4.5/node_modules/@ipld/dag-ucan/src/lib.js
var VERSION2 = "0.9.1";
var name6 = "dag-ucan";
var code8 = code7;
var defaultHasher = sha256;
var encode18 = (ucan) => ucan.jwt ? encode17(ucan) : encode16(ucan);
var decode21 = (bytes2) => {
  try {
    return decode19(bytes2);
  } catch (_) {
    return decode20(
      /** @type {UCAN.ByteView<UCAN.FromJWT<C>>} */
      bytes2
    );
  }
};
var link = async (ucan, options) => {
  const { cid } = await write(ucan, options);
  return cid;
};
var write = async (ucan, { hasher = defaultHasher } = {}) => {
  const [code11, bytes2] = ucan.jwt ? [code6, encode17(ucan)] : [code7, encode16(ucan)];
  const digest2 = await hasher.digest(bytes2);
  return {
    bytes: bytes2,
    cid: create4(code11, digest2),
    data: ucan
  };
};
var parse6 = (jwt) => {
  const model = parse5(jwt);
  return format5(model) === jwt ? from6(model) : from7({ ...model, jwt: (
    /** @type {UCAN.JWT<C>} */
    jwt
  ) });
};
var format7 = (ucan) => ucan.jwt ? format6(ucan) : format5(ucan);
var issue = async ({
  issuer,
  audience,
  capabilities,
  lifetimeInSeconds = 30,
  expiration = now() + lifetimeInSeconds,
  notBefore,
  facts = [],
  proofs: proofs2 = [],
  nonce
}) => {
  const v = VERSION2;
  const data = readPayload({
    iss: parse(issuer.did()),
    aud: parse(audience.did()),
    att: capabilities,
    fct: facts,
    exp: expiration,
    nbf: notBefore,
    prf: proofs2,
    nnc: nonce
  });
  const payload = encodeSignaturePayload(data, v, issuer.signatureAlgorithm);
  return from6({
    ...data,
    v,
    s: await issuer.sign(payload)
  });
};
var encodeSignaturePayload = (payload, version, algorithm2) => encode3(formatSignPayload(payload, version, algorithm2));
var verifySignature = (ucan, verifier) => format2(ucan.issuer) === verifier.did() && verifier.verify(
  encodeSignaturePayload(ucan.model, ucan.model.v, ucan.signature.algorithm),
  ucan.signature
);
var isExpired = (ucan) => ucan.expiration <= now();
var isTooEarly = (ucan) => ucan.notBefore != null && now() <= ucan.notBefore;
var now = () => Math.floor(Date.now() / 1e3);

// node_modules/.pnpm/@ucanto+principal@9.0.2/node_modules/@ucanto/principal/src/lib.js
var Verifier = verifier_exports.or(RSAVerifier);
var Signer = or5(rsa_exports);

// src/services/onePasswordKms.js
import * as crypto4 from "node:crypto";

// src/services/auditLog.js
var SecurityEventType = {
  // KMS Events
  KMS_KEY_SETUP_SUCCESS: "kms_key_setup_success",
  KMS_KEY_SETUP_FAILURE: "kms_key_setup_failure",
  KMS_DECRYPT_SUCCESS: "kms_decrypt_success",
  KMS_DECRYPT_FAILURE: "kms_decrypt_failure",
  KMS_PUBLIC_KEY_RETRIEVAL_SUCCESS: "kms_public_key_retrieval_success",
  KMS_PUBLIC_KEY_RETRIEVAL_FAILURE: "kms_public_key_retrieval_failure",
  KMS_PRIMARY_VERSION_SUCCESS: "kms_primary_version_success",
  KMS_PRIMARY_VERSION_FAILURE: "kms_primary_version_failure",
  // UCAN Validation Events
  UCAN_ENCRYPTION_VALIDATION_SUCCESS: "ucan_encryption_validation_success",
  UCAN_ENCRYPTION_VALIDATION_FAILURE: "ucan_encryption_validation_failure",
  UCAN_DECRYPTION_VALIDATION_SUCCESS: "ucan_decryption_validation_success",
  UCAN_DECRYPTION_VALIDATION_FAILURE: "ucan_decryption_validation_failure",
  // Revocation Events
  REVOCATION_CHECK_SUCCESS: "revocation_check_success",
  REVOCATION_CHECK_FAILURE: "revocation_check_failure",
  REVOCATION_SERVICE_UNAVAILABLE: "revocation_service_unavailable",
  // Configuration Events
  SERVICE_INITIALIZATION_SUCCESS: "service_initialization_success",
  SERVICE_INITIALIZATION_FAILURE: "service_initialization_failure",
  CONFIGURATION_VALIDATION_FAILURE: "configuration_validation_failure",
  // Authentication/Authorization Events
  INVOCATION_SUCCESS: "invocation_success",
  INVOCATION_FAILURE: "invocation_failure",
  AUTHORIZATION_FAILURE: "authorization_failure",
  // General Security Events
  SECURITY_VIOLATION_DETECTED: "security_violation_detected",
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded"
};
var AuditLogService = class {
  /**
   * Creates a new audit log service
   * @param {Object} options - Configuration options
   * @param {string} [options.serviceName] - Name of the service logging events
   * @param {string} [options.environment] - Environment (dev, staging, prod)
   * @param {string} [options.requestId] - Request ID for correlating events within a request
   */
  constructor(options = {}) {
    this.serviceName = options.serviceName || "ucan-kms";
    this.environment = options.environment || "unknown";
    this.requestId = options.requestId;
  }
  /**
   * Generate a unique event ID
   * @returns {string} Unique event identifier
   */
  generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Create base audit log entry with common fields
   * @param {string} eventType - Type of security event
   * @param {Object} [context] - Additional context for the event
   * @returns {any} Base audit log entry
   */
  createBaseEntry(eventType, context = {}) {
    const entry = {
      eventId: this.generateEventId(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: this.serviceName,
      environment: this.environment,
      eventType,
      version: "1.0.0",
      ...context
    };
    if (this.requestId) {
      entry.requestId = this.requestId;
    }
    return entry;
  }
  /**
   * Log a security event with structured format
   * @param {string} eventType - Type of security event from SecurityEventType
   * @param {Object} details - Event-specific details
   * @param {SpaceDID} [details.space] - Space DID
   * @param {string} [details.operation] - Operation being performed
   * @param {string} [details.status] - HTTP status code or operation status
   * @param {string} [details.error] - Error message (should be generic for security)
   * @param {Object} [details.metadata] - Additional metadata
   * @param {string} [details.invocationCid] - UCAN invocation CID
   * @param {string} [details.keyVersion] - KMS key version used
   * @param {string} [details.algorithm] - Cryptographic algorithm used
   * @param {number} [details.duration] - Operation duration in milliseconds
   */
  logSecurityEvent(eventType, details = {}) {
    const entry = this.createBaseEntry(eventType);
    if (details.space) {
      entry.spaceId = details.space;
    }
    if (details.operation) entry.operation = details.operation;
    if (details.status) entry.status = details.status;
    if (details.error) entry.error = details.error;
    if (details.invocationCid) entry.invocationCid = details.invocationCid;
    if (details.keyVersion) entry.keyVersion = details.keyVersion;
    if (details.algorithm) entry.algorithm = details.algorithm;
    if (details.duration !== void 0) entry.duration = details.duration;
    if (details.metadata) {
      entry.metadata = details.metadata;
    }
    console.log(JSON.stringify(entry));
  }
  /**
   * Log KMS key setup success
   * @param {SpaceDID} space - Space DID
   * @param {string} algorithm - Algorithm used
   * @param {string} keyVersion - Key version
   * @param {number} [duration] - Operation duration
   */
  logKMSKeySetupSuccess(space2, algorithm2, keyVersion, duration) {
    this.logSecurityEvent(SecurityEventType.KMS_KEY_SETUP_SUCCESS, {
      space: space2,
      operation: "kms_key_setup",
      algorithm: algorithm2,
      keyVersion,
      duration,
      status: "success"
    });
  }
  /**
   * Log KMS key setup failure
   * @param {SpaceDID} space - Space DID
   * @param {string} error - Generic error message
   * @param {number} [status] - HTTP status code
   * @param {number} [duration] - Operation duration
   */
  logKMSKeySetupFailure(space2, error4, status, duration) {
    this.logSecurityEvent(SecurityEventType.KMS_KEY_SETUP_FAILURE, {
      space: space2,
      operation: "kms_key_setup",
      error: error4,
      status: status ? status.toString() : void 0,
      duration
    });
  }
  /**
   * Log KMS decryption success
   * @param {SpaceDID} space - Space DID
   * @param {string} keyVersion - Key version used
   * @param {number} [duration] - Operation duration
   */
  logKMSDecryptSuccess(space2, keyVersion, duration) {
    this.logSecurityEvent(SecurityEventType.KMS_DECRYPT_SUCCESS, {
      space: space2,
      operation: "kms_decrypt",
      keyVersion,
      duration,
      status: "success"
    });
  }
  /**
   * Log KMS decryption failure
   * @param {SpaceDID} space - Space DID
   * @param {string} error - Generic error message
   * @param {number} [status] - HTTP status code
   * @param {number} [duration] - Operation duration
   */
  logKMSDecryptFailure(space2, error4, status, duration) {
    this.logSecurityEvent(SecurityEventType.KMS_DECRYPT_FAILURE, {
      space: space2,
      operation: "kms_decrypt",
      error: error4,
      status: status ? status.toString() : void 0,
      duration
    });
  }
  /**
   * Log UCAN validation success
   * @param {SpaceDID} space - Space DID
   * @param {string} operation - Validation operation (encryption/decryption)
   * @param {string} [invocationCid] - UCAN invocation CID
   */
  logUCANValidationSuccess(space2, operation, invocationCid) {
    const eventType = operation === "encryption" ? SecurityEventType.UCAN_ENCRYPTION_VALIDATION_SUCCESS : SecurityEventType.UCAN_DECRYPTION_VALIDATION_SUCCESS;
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: `ucan_${operation}_validation`,
      invocationCid,
      status: "success"
    });
  }
  /**
   * Log UCAN validation failure
   * @param {SpaceDID} space - Space DID
   * @param {string} operation - Validation operation (encryption/decryption)
   * @param {string} error - Generic error message
   * @param {string} [invocationCid] - UCAN invocation CID
   */
  logUCANValidationFailure(space2, operation, error4, invocationCid) {
    const eventType = operation === "encryption" ? SecurityEventType.UCAN_ENCRYPTION_VALIDATION_FAILURE : SecurityEventType.UCAN_DECRYPTION_VALIDATION_FAILURE;
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: `ucan_${operation}_validation`,
      error: error4,
      invocationCid,
      status: "failure"
    });
  }
  /**
   * Log revocation check result
   * @param {SpaceDID} space - Space DID
   * @param {boolean} success - Whether check was successful
   * @param {string} [error] - Error message if failed
   * @param {number} [proofsCount] - Number of proofs checked
   */
  logRevocationCheck(space2, success, error4, proofsCount) {
    const eventType = success ? SecurityEventType.REVOCATION_CHECK_SUCCESS : SecurityEventType.REVOCATION_CHECK_FAILURE;
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: "revocation_check",
      error: error4,
      status: success ? "success" : "failure",
      metadata: { proofsCount }
    });
  }
  /**
   * Log service initialization
   * @param {string} serviceName - Name of the service
   * @param {boolean} success - Whether initialization was successful
   * @param {string} [error] - Error message if failed
   */
  logServiceInitialization(serviceName, success, error4) {
    const eventType = success ? SecurityEventType.SERVICE_INITIALIZATION_SUCCESS : SecurityEventType.SERVICE_INITIALIZATION_FAILURE;
    this.logSecurityEvent(eventType, {
      operation: "service_initialization",
      status: success ? "success" : "failure",
      error: error4,
      metadata: { serviceName }
    });
  }
  /**
   * Log configuration validation failure
   * @param {string} component - Component with invalid configuration
   * @param {string} error - Validation error message
   */
  logConfigurationValidationFailure(component, error4) {
    this.logSecurityEvent(SecurityEventType.CONFIGURATION_VALIDATION_FAILURE, {
      operation: "configuration_validation",
      error: error4,
      status: "failure",
      metadata: { component }
    });
  }
  /**
   * Log invocation attempt
   * @param {SpaceDID} space - Space DID
   * @param {string} capability - Capability being invoked
   * @param {boolean} success - Whether invocation was successful
   * @param {string} [error] - Error message if failed
   * @param {string} [invocationCid] - UCAN invocation CID
   * @param {number} [duration] - Total operation duration
   */
  logInvocation(space2, capability2, success, error4 = void 0, invocationCid = void 0, duration = void 0) {
    const eventType = success ? SecurityEventType.INVOCATION_SUCCESS : SecurityEventType.INVOCATION_FAILURE;
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: "invocation",
      status: success ? "success" : "failure",
      error: error4,
      invocationCid,
      duration,
      metadata: { capability: capability2 }
    });
  }
  /**
   * Log security violation detection
   * @param {string} violationType - Type of security violation
   * @param {string} description - Description of the violation
   * @param {SpaceDID} [space] - Space DID if relevant
   * @param {Object} [metadata] - Additional violation context
   */
  logSecurityViolation(violationType, description, space2, metadata = {}) {
    this.logSecurityEvent(SecurityEventType.SECURITY_VIOLATION_DETECTED, {
      space: space2,
      operation: "security_violation",
      error: description,
      status: "violation",
      metadata: { violationType, ...metadata }
    });
  }
  /**
   * Log rate limit exceeded event
   * @param {string} identifier - Rate limit identifier (IP, space, etc.)
   * @param {string} limitType - Type of rate limit
   * @param {Object} [metadata] - Additional rate limit context
   */
  logRateLimitExceeded(identifier, limitType, metadata = {}) {
    this.logSecurityEvent(SecurityEventType.RATE_LIMIT_EXCEEDED, {
      operation: "rate_limit_check",
      status: "exceeded",
      metadata: { identifier, limitType, ...metadata }
    });
  }
  /**
   * Log subscription service events
   * @param {string} eventType - Type of subscription event
   * @param {SpaceDID} [space] - Space DID
   * @param {string} [status] - Operation status
   * @param {string} [error] - Error message if failed
   * @param {Object} [metadata] - Additional context
   */
  logSubscriptionEvent(eventType, space2, status, error4, metadata = {}) {
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: "subscription_check",
      status,
      error: error4,
      metadata
    });
  }
  /**
   * Log revocation service events
   * @param {string} eventType - Type of revocation event
   * @param {SpaceDID} [space] - Space DID
   * @param {string} [status] - Operation status
   * @param {string} [error] - Error message if failed
   * @param {Object} [metadata] - Additional context
   */
  logRevocationEvent(eventType, space2, status, error4, metadata = {}) {
    this.logSecurityEvent(eventType, {
      space: space2,
      operation: "revocation_check",
      status,
      error: error4,
      metadata
    });
  }
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/cbor.js
var cbor_exports2 = {};
__export(cbor_exports2, {
  code: () => code4,
  contentType: () => contentType,
  decode: () => decode16,
  encode: () => encode19,
  link: () => link2,
  name: () => name4,
  write: () => write2
});
var contentType = "application/vnd.ipld.dag-cbor";
var prepare = (data, seen) => {
  if (seen.has(data)) {
    throw new TypeError("Can not encode circular structure");
  }
  if (data === void 0 && seen.size === 0) {
    return null;
  }
  if (data === null) {
    return null;
  }
  if (typeof data === "symbol" && seen.size === 0) {
    return null;
  }
  if (isLink(data)) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    return data;
  }
  if (Array.isArray(data)) {
    seen.add(data);
    const items = [];
    for (const item of data) {
      items.push(
        item === void 0 || typeof item === "symbol" ? null : prepare(item, seen)
      );
    }
    return items;
  }
  if (typeof /** @type {{toJSON?:unknown}} */
  data.toJSON === "function") {
    seen.add(data);
    const json = (
      /** @type {{toJSON():unknown}} */
      data.toJSON()
    );
    return prepare(json, seen);
  }
  if (typeof data === "object") {
    seen.add(data);
    const object = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== void 0 && typeof value !== "symbol") {
        object[key] = prepare(value, new Set(seen));
      }
    }
    return object;
  }
  return data;
};
var encode19 = (data) => (
  /** @type {CBOR.ByteView<T>} */
  encode12(prepare(data, /* @__PURE__ */ new Set()))
);
var link2 = async (bytes2, { hasher = sha256 } = {}) => {
  return (
    /** @type {API.Link<T, typeof CBOR.code>} */
    create4(code4, await hasher.digest(bytes2))
  );
};
var write2 = async (data, options) => {
  const bytes2 = encode19(data);
  const cid = await link2(bytes2, options);
  return { cid, bytes: bytes2 };
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/dag.js
var iterate = function* (value) {
  if (value && typeof value === "object" && "iterateIPLDBlocks" in value && typeof value.iterateIPLDBlocks === "function") {
    yield* value.iterateIPLDBlocks();
  }
};
var createStore = (blocks = []) => {
  const store2 = /* @__PURE__ */ new Map();
  addEveryInto(blocks, store2);
  return store2;
};
var EMBED_CODE = identity.code;
var get = (cid, store2, fallback) => {
  if (cid.multihash.code === EMBED_CODE) {
    return { cid, bytes: cid.multihash.digest };
  }
  const block = (
    /** @type {API.Block<U, Format, Alg, V>|undefined} */
    store2.get(`${cid}`)
  );
  return block ? block : fallback === void 0 ? notFound(cid) : fallback;
};
var notFound = (link5) => {
  throw new Error(`Block for the ${link5} is not found`);
};
var writeInto = async (source, store2, options = {}) => {
  const codec = (
    /** @type {MF.BlockEncoder<C, U>} */
    options.codec || cbor_exports2
  );
  const hasher = (
    /** @type {MF.MultihashHasher<A>} */
    options.hasher || sha256
  );
  const bytes2 = codec.encode(source);
  const digest2 = await hasher.digest(bytes2);
  const link5 = create4(codec.code, digest2);
  store2.set(
    /** @type {API.ToString<typeof link>} */
    link5.toString(),
    {
      bytes: bytes2,
      cid: link5
    }
  );
  return { bytes: bytes2, cid: link5, data: source };
};
var addInto = ({ cid, bytes: bytes2 }, store2) => {
  store2.set(
    /** @type {API.ToString<typeof cid>} */
    cid.toString(),
    {
      bytes: bytes2,
      cid
    }
  );
  return { bytes: bytes2, cid };
};
var addEveryInto = (source, store2) => {
  for (const block of source) {
    addInto(block, store2);
  }
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/car.js
var car_exports = {};
__export(car_exports, {
  code: () => code9,
  contentType: () => contentType2,
  createWriter: () => createWriter2,
  decode: () => decode22,
  encode: () => encode20,
  link: () => link3,
  name: () => name7,
  write: () => write3
});

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/buffer-reader.js
import fs from "fs";

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/decoder-common.js
var import_varint2 = __toESM(require_varint(), 1);
var CIDV0_BYTES = {
  SHA2_256: 18,
  LENGTH: 32,
  DAG_PB: 112
};
var V2_HEADER_LENGTH = (
  /* characteristics */
  16 + 8 + 8 + 8
);
function decodeVarint(bytes2, seeker) {
  if (!bytes2.length) {
    throw new Error("Unexpected end of data");
  }
  const i = import_varint2.default.decode(bytes2);
  seeker.seek(
    /** @type {number} */
    import_varint2.default.decode.bytes
  );
  return i;
}
function decodeV2Header(bytes2) {
  const dv = new DataView(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
  let offset = 0;
  const header = {
    version: 2,
    /** @type {[bigint, bigint]} */
    characteristics: [
      dv.getBigUint64(offset, true),
      dv.getBigUint64(offset += 8, true)
    ],
    dataOffset: Number(dv.getBigUint64(offset += 8, true)),
    dataSize: Number(dv.getBigUint64(offset += 8, true)),
    indexOffset: Number(dv.getBigUint64(offset += 8, true))
  };
  return header;
}
function getMultihashLength(bytes2) {
  import_varint2.default.decode(bytes2);
  const codeLength = (
    /** @type {number} */
    import_varint2.default.decode.bytes
  );
  const length2 = import_varint2.default.decode(bytes2.subarray(import_varint2.default.decode.bytes));
  const lengthLength = (
    /** @type {number} */
    import_varint2.default.decode.bytes
  );
  const mhLength = codeLength + lengthLength + length2;
  return mhLength;
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/header-validator.js
var Kinds = {
  Null: (
    /**
     * @param obj
     * @returns {undefined|null}
     */
    (obj) => obj === null ? obj : void 0
  ),
  Int: (
    /**
     * @param obj
     * @returns {undefined|number}
     */
    (obj) => Number.isInteger(obj) ? obj : void 0
  ),
  Float: (
    /**
     * @param obj
     * @returns {undefined|number}
     */
    (obj) => typeof obj === "number" && Number.isFinite(obj) ? obj : void 0
  ),
  String: (
    /**
     * @param obj
     * @returns {undefined|string}
     */
    (obj) => typeof obj === "string" ? obj : void 0
  ),
  Bool: (
    /**
     * @param obj
     * @returns {undefined|boolean}
     */
    (obj) => typeof obj === "boolean" ? obj : void 0
  ),
  Bytes: (
    /**
     * @param obj
     * @returns {undefined|Uint8Array}
     */
    (obj) => obj instanceof Uint8Array ? obj : void 0
  ),
  Link: (
    /**
     * @param obj
     * @returns {undefined|object}
     */
    (obj) => obj !== null && typeof obj === "object" && obj.asCID === obj ? obj : void 0
  ),
  List: (
    /**
     * @param obj
     * @returns {undefined|Array<any>}
     */
    (obj) => Array.isArray(obj) ? obj : void 0
  ),
  Map: (
    /**
     * @param obj
     * @returns {undefined|object}
     */
    (obj) => obj !== null && typeof obj === "object" && obj.asCID !== obj && !Array.isArray(obj) && !(obj instanceof Uint8Array) ? obj : void 0
  )
};
var Types = {
  "CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
  "CarV1HeaderOrV2Pragma > roots (anon)": (
    /**
     * @param obj
     * @returns {undefined|any}
     */
    (obj) => {
      if (Kinds.List(obj) === void 0) {
        return void 0;
      }
      for (let i = 0; i < obj.length; i++) {
        let v = obj[i];
        v = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
        if (v === void 0) {
          return void 0;
        }
        if (v !== obj[i]) {
          const ret = obj.slice(0, i);
          for (let j = i; j < obj.length; j++) {
            let v2 = obj[j];
            v2 = Types["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v2);
            if (v2 === void 0) {
              return void 0;
            }
            ret.push(v2);
          }
          return ret;
        }
      }
      return obj;
    }
  ),
  Int: Kinds.Int,
  CarV1HeaderOrV2Pragma: (
    /**
     * @param obj
     * @returns {undefined|any}
     */
    (obj) => {
      if (Kinds.Map(obj) === void 0) {
        return void 0;
      }
      const entries2 = Object.entries(obj);
      let ret = obj;
      let requiredCount = 1;
      for (let i = 0; i < entries2.length; i++) {
        const [key, value] = entries2[i];
        switch (key) {
          case "roots":
            {
              const v = Types["CarV1HeaderOrV2Pragma > roots (anon)"](obj[key]);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries2[j][0]] = entries2[j][1];
                  }
                }
                ret.roots = v;
              }
            }
            break;
          case "version":
            {
              requiredCount--;
              const v = Types.Int(obj[key]);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries2[j][0]] = entries2[j][1];
                  }
                }
                ret.version = v;
              }
            }
            break;
          default:
            return void 0;
        }
      }
      if (requiredCount > 0) {
        return void 0;
      }
      return ret;
    }
  )
};
var Reprs = {
  "CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kinds.Link,
  "CarV1HeaderOrV2Pragma > roots (anon)": (
    /**
     * @param obj
     * @returns {undefined|any}
     */
    (obj) => {
      if (Kinds.List(obj) === void 0) {
        return void 0;
      }
      for (let i = 0; i < obj.length; i++) {
        let v = obj[i];
        v = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v);
        if (v === void 0) {
          return void 0;
        }
        if (v !== obj[i]) {
          const ret = obj.slice(0, i);
          for (let j = i; j < obj.length; j++) {
            let v2 = obj[j];
            v2 = Reprs["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](v2);
            if (v2 === void 0) {
              return void 0;
            }
            ret.push(v2);
          }
          return ret;
        }
      }
      return obj;
    }
  ),
  Int: Kinds.Int,
  CarV1HeaderOrV2Pragma: (
    /**
     * @param obj
     * @returns {undefined|any}
     */
    (obj) => {
      if (Kinds.Map(obj) === void 0) {
        return void 0;
      }
      const entries2 = Object.entries(obj);
      let ret = obj;
      let requiredCount = 1;
      for (let i = 0; i < entries2.length; i++) {
        const [key, value] = entries2[i];
        switch (key) {
          case "roots":
            {
              const v = Reprs["CarV1HeaderOrV2Pragma > roots (anon)"](value);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries2[j][0]] = entries2[j][1];
                  }
                }
                ret.roots = v;
              }
            }
            break;
          case "version":
            {
              requiredCount--;
              const v = Reprs.Int(value);
              if (v === void 0) {
                return void 0;
              }
              if (v !== value || ret !== obj) {
                if (ret === obj) {
                  ret = {};
                  for (let j = 0; j < i; j++) {
                    ret[entries2[j][0]] = entries2[j][1];
                  }
                }
                ret.version = v;
              }
            }
            break;
          default:
            return void 0;
        }
      }
      if (requiredCount > 0) {
        return void 0;
      }
      return ret;
    }
  )
};
var CarV1HeaderOrV2Pragma = {
  toTyped: Types.CarV1HeaderOrV2Pragma,
  toRepresentation: Reprs.CarV1HeaderOrV2Pragma
};

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/buffer-decoder.js
function readHeader(reader, strictVersion) {
  const length2 = decodeVarint(reader.upTo(8), reader);
  if (length2 === 0) {
    throw new Error("Invalid CAR header (zero length)");
  }
  const header = reader.exactly(length2, true);
  const block = decode16(header);
  if (CarV1HeaderOrV2Pragma.toTyped(block) === void 0) {
    throw new Error("Invalid CAR header format");
  }
  if (block.version !== 1 && block.version !== 2 || strictVersion !== void 0 && block.version !== strictVersion) {
    throw new Error(`Invalid CAR version: ${block.version}${strictVersion !== void 0 ? ` (expected ${strictVersion})` : ""}`);
  }
  if (block.version === 1) {
    if (!Array.isArray(block.roots)) {
      throw new Error("Invalid CAR header format");
    }
    return block;
  }
  if (block.roots !== void 0) {
    throw new Error("Invalid CAR header format");
  }
  const v2Header = decodeV2Header(reader.exactly(V2_HEADER_LENGTH, true));
  reader.seek(v2Header.dataOffset - reader.pos);
  const v1Header = readHeader(reader, 1);
  return Object.assign(v1Header, v2Header);
}
function readCid(reader) {
  const first = reader.exactly(2, false);
  if (first[0] === CIDV0_BYTES.SHA2_256 && first[1] === CIDV0_BYTES.LENGTH) {
    const bytes3 = reader.exactly(34, true);
    const multihash2 = decode4(bytes3);
    return CID.create(0, CIDV0_BYTES.DAG_PB, multihash2);
  }
  const version = decodeVarint(reader.upTo(8), reader);
  if (version !== 1) {
    throw new Error(`Unexpected CID version (${version})`);
  }
  const codec = decodeVarint(reader.upTo(8), reader);
  const bytes2 = reader.exactly(getMultihashLength(reader.upTo(8)), true);
  const multihash = decode4(bytes2);
  return CID.create(version, codec, multihash);
}
function readBlockHead(reader) {
  const start = reader.pos;
  let length2 = decodeVarint(reader.upTo(8), reader);
  if (length2 === 0) {
    throw new Error("Invalid CAR section (zero length)");
  }
  length2 += reader.pos - start;
  const cid = readCid(reader);
  const blockLength2 = length2 - Number(reader.pos - start);
  return { cid, length: length2, blockLength: blockLength2 };
}
function fromBytes(bytes2) {
  let reader = bytesReader(bytes2);
  const header = readHeader(reader);
  if (header.version === 2) {
    const v1length = reader.pos - header.dataOffset;
    reader = limitReader(reader, header.dataSize - v1length);
  }
  const blocks = [];
  while (reader.upTo(8).length > 0) {
    const { cid, blockLength: blockLength2 } = readBlockHead(reader);
    blocks.push({ cid, bytes: reader.exactly(blockLength2, true) });
  }
  return {
    header,
    blocks
  };
}
function bytesReader(bytes2) {
  let pos = 0;
  return {
    upTo(length2) {
      return bytes2.subarray(pos, pos + Math.min(length2, bytes2.length - pos));
    },
    exactly(length2, seek = false) {
      if (length2 > bytes2.length - pos) {
        throw new Error("Unexpected end of data");
      }
      const out = bytes2.subarray(pos, pos + length2);
      if (seek) {
        pos += length2;
      }
      return out;
    },
    seek(length2) {
      pos += length2;
    },
    get pos() {
      return pos;
    }
  };
}
function limitReader(reader, byteLimit) {
  let bytesRead = 0;
  return {
    upTo(length2) {
      let bytes2 = reader.upTo(length2);
      if (bytes2.length + bytesRead > byteLimit) {
        bytes2 = bytes2.subarray(0, byteLimit - bytesRead);
      }
      return bytes2;
    },
    exactly(length2, seek = false) {
      const bytes2 = reader.exactly(length2, seek);
      if (bytes2.length + bytesRead > byteLimit) {
        throw new Error("Unexpected end of data");
      }
      if (seek) {
        bytesRead += length2;
      }
      return bytes2;
    },
    seek(length2) {
      bytesRead += length2;
      reader.seek(length2);
    },
    get pos() {
      return reader.pos;
    }
  };
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/buffer-reader-browser.js
var CarBufferReader = class _CarBufferReader {
  /**
   * @constructs CarBufferReader
   * @param {CarHeader|CarV2Header} header
   * @param {Block[]} blocks
   */
  constructor(header, blocks) {
    this._header = header;
    this._blocks = blocks;
    this._cids = void 0;
  }
  /**
   * @property {number} version of the CAR
   * @memberof CarBufferReader
   * @instance
   */
  get version() {
    return this._header.version;
  }
  /**
   * Get the list of roots defined by the CAR referenced by this reader. May be
   * zero or more `CID`s.
   *
   * @function
   * @memberof CarBufferReader
   * @instance
   * @returns {CID[]}
   */
  getRoots() {
    return this._header.roots;
  }
  /**
   * Check whether a given `CID` exists within the CAR referenced by this
   * reader.
   *
   * @function
   * @memberof CarBufferReader
   * @instance
   * @param {CID} key
   * @returns {boolean}
   */
  has(key) {
    return this._blocks.some((b) => b.cid.equals(key));
  }
  /**
   * Fetch a `Block` (a `{ cid:CID, bytes:Uint8Array }` pair) from the CAR
   * referenced by this reader matching the provided `CID`. In the case where
   * the provided `CID` doesn't exist within the CAR, `undefined` will be
   * returned.
   *
   * @function
   * @memberof CarBufferReader
   * @instance
   * @param {CID} key
   * @returns {Block | undefined}
   */
  get(key) {
    return this._blocks.find((b) => b.cid.equals(key));
  }
  /**
   * Returns a `Block[]` of the `Block`s (`{ cid:CID, bytes:Uint8Array }` pairs) contained within
   * the CAR referenced by this reader.
   *
   * @function
   * @memberof CarBufferReader
   * @instance
   * @returns {Block[]}
   */
  blocks() {
    return this._blocks;
  }
  /**
   * Returns a `CID[]` of the `CID`s contained within the CAR referenced by this reader.
   *
   * @function
   * @memberof CarBufferReader
   * @instance
   * @returns {CID[]}
   */
  cids() {
    if (!this._cids) {
      this._cids = this._blocks.map((b) => b.cid);
    }
    return this._cids;
  }
  /**
   * Instantiate a {@link CarBufferReader} from a `Uint8Array` blob. This performs a
   * decode fully in memory and maintains the decoded state in memory for full
   * access to the data via the `CarReader` API.
   *
   * @static
   * @memberof CarBufferReader
   * @param {Uint8Array} bytes
   * @returns {CarBufferReader}
   */
  static fromBytes(bytes2) {
    if (!(bytes2 instanceof Uint8Array)) {
      throw new TypeError("fromBytes() requires a Uint8Array");
    }
    const { header, blocks } = fromBytes(bytes2);
    return new _CarBufferReader(header, blocks);
  }
};

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/buffer-reader.js
var fsread = fs.readSync;
var CarBufferReader2 = class extends CarBufferReader {
  /**
   * Reads a block directly from a file descriptor for an open CAR file. This
   * function is **only available in Node.js** and not a browser environment.
   *
   * This function can be used in connection with {@link CarIndexer} which emits
   * the `BlockIndex` objects that are required by this function.
   *
   * The user is responsible for opening and closing the file used in this call.
   *
   * @static
   * @memberof CarBufferReader
   * @param {number} fd - A file descriptor from the
   * Node.js `fs` module. An integer, from `fs.open()`.
   * @param {BlockIndex} blockIndex - An index pointing to the location of the
   * Block required. This `BlockIndex` should take the form:
   * `{cid:CID, blockLength:number, blockOffset:number}`.
   * @returns {Block} A `{ cid:CID, bytes:Uint8Array }` pair.
   */
  static readRaw(fd, blockIndex) {
    const { cid, blockLength: blockLength2, blockOffset } = blockIndex;
    const bytes2 = new Uint8Array(blockLength2);
    let read7;
    if (typeof fd === "number") {
      read7 = fsread(fd, bytes2, 0, blockLength2, blockOffset);
    } else {
      throw new TypeError("Bad fd");
    }
    if (read7 !== blockLength2) {
      throw new Error(`Failed to read entire block (${read7} instead of ${blockLength2})`);
    }
    return { cid, bytes: bytes2 };
  }
};

// node_modules/.pnpm/cborg@4.2.12/node_modules/cborg/lib/length.js
var cborEncoders2 = makeCborEncoders();
var defaultEncodeOptions3 = {
  float64: false,
  quickEncodeToken
};
function tokensToLength(tokens, encoders = cborEncoders2, options = defaultEncodeOptions3) {
  if (Array.isArray(tokens)) {
    let len = 0;
    for (const token of tokens) {
      len += tokensToLength(token, encoders, options);
    }
    return len;
  } else {
    const encoder2 = encoders[tokens.type.major];
    if (encoder2.encodedSize === void 0 || typeof encoder2.encodedSize !== "function") {
      throw new Error(`Encoder for ${tokens.type.name} does not have an encodedSize()`);
    }
    return encoder2.encodedSize(tokens, options);
  }
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/buffer-writer.js
var import_varint3 = __toESM(require_varint(), 1);
var CarBufferWriter = class {
  /**
   * @param {Uint8Array} bytes
   * @param {number} headerSize
   */
  constructor(bytes2, headerSize) {
    this.bytes = bytes2;
    this.byteOffset = headerSize;
    this.roots = [];
    this.headerSize = headerSize;
  }
  /**
   * Add a root to this writer, to be used to create a header when the CAR is
   * finalized with {@link CarBufferWriter.close `close()`}
   *
   * @param {CID} root
   * @param {{resize?:boolean}} [options]
   * @returns {CarBufferWriter}
   */
  addRoot(root, options) {
    addRoot(this, root, options);
    return this;
  }
  /**
   * Write a `Block` (a `{ cid:CID, bytes:Uint8Array }` pair) to the archive.
   * Throws if there is not enough capacity.
   *
   * @param {Block} block - A `{ cid:CID, bytes:Uint8Array }` pair.
   * @returns {CarBufferWriter}
   */
  write(block) {
    addBlock(this, block);
    return this;
  }
  /**
   * Finalize the CAR and return it as a `Uint8Array`.
   *
   * @param {object} [options]
   * @param {boolean} [options.resize]
   * @returns {Uint8Array}
   */
  close(options) {
    return close(this, options);
  }
};
var addRoot = (writer, root, options = {}) => {
  const { resize = false } = options;
  const { bytes: bytes2, headerSize, byteOffset, roots } = writer;
  writer.roots.push(root);
  const size2 = headerLength(writer);
  if (size2 > headerSize) {
    if (size2 - headerSize + byteOffset < bytes2.byteLength) {
      if (resize) {
        resizeHeader(writer, size2);
      } else {
        roots.pop();
        throw new RangeError(`Header of size ${headerSize} has no capacity for new root ${root}.
  However there is a space in the buffer and you could call addRoot(root, { resize: root }) to resize header to make a space for this root.`);
      }
    } else {
      roots.pop();
      throw new RangeError(`Buffer has no capacity for a new root ${root}`);
    }
  }
};
var blockLength = ({ cid, bytes: bytes2 }) => {
  const size2 = cid.bytes.byteLength + bytes2.byteLength;
  return import_varint3.default.encodingLength(size2) + size2;
};
var addBlock = (writer, { cid, bytes: bytes2 }) => {
  const byteLength = cid.bytes.byteLength + bytes2.byteLength;
  const size2 = import_varint3.default.encode(byteLength);
  if (writer.byteOffset + size2.length + byteLength > writer.bytes.byteLength) {
    throw new RangeError("Buffer has no capacity for this block");
  } else {
    writeBytes(writer, size2);
    writeBytes(writer, cid.bytes);
    writeBytes(writer, bytes2);
  }
};
var close = (writer, options = {}) => {
  const { resize = false } = options;
  const { roots, bytes: bytes2, byteOffset, headerSize } = writer;
  const headerBytes = encode12({ version: 1, roots });
  const varintBytes = import_varint3.default.encode(headerBytes.length);
  const size2 = varintBytes.length + headerBytes.byteLength;
  const offset = headerSize - size2;
  if (offset === 0) {
    writeHeader(writer, varintBytes, headerBytes);
    return bytes2.subarray(0, byteOffset);
  } else if (resize) {
    resizeHeader(writer, size2);
    writeHeader(writer, varintBytes, headerBytes);
    return bytes2.subarray(0, writer.byteOffset);
  } else {
    throw new RangeError(`Header size was overestimated.
You can use close({ resize: true }) to resize header`);
  }
};
var resizeHeader = (writer, byteLength) => {
  const { bytes: bytes2, headerSize } = writer;
  bytes2.set(bytes2.subarray(headerSize, writer.byteOffset), byteLength);
  writer.byteOffset += byteLength - headerSize;
  writer.headerSize = byteLength;
};
var writeBytes = (writer, bytes2) => {
  writer.bytes.set(bytes2, writer.byteOffset);
  writer.byteOffset += bytes2.length;
};
var writeHeader = ({ bytes: bytes2 }, varint5, header) => {
  bytes2.set(varint5);
  bytes2.set(header, varint5.length);
};
var headerPreludeTokens = [
  new Token(Type.map, 2),
  new Token(Type.string, "version"),
  new Token(Type.uint, 1),
  new Token(Type.string, "roots")
];
var CID_TAG = new Token(Type.tag, 42);
var calculateHeaderLength = (rootLengths) => {
  const tokens = [...headerPreludeTokens];
  tokens.push(new Token(Type.array, rootLengths.length));
  for (const rootLength of rootLengths) {
    tokens.push(CID_TAG);
    tokens.push(new Token(Type.bytes, { length: rootLength + 1 }));
  }
  const length2 = tokensToLength(tokens);
  return import_varint3.default.encodingLength(length2) + length2;
};
var headerLength = ({ roots }) => calculateHeaderLength(roots.map((cid) => cid.bytes.byteLength));
var createWriter = (buffer2, options = {}) => {
  const {
    roots = [],
    byteOffset = 0,
    byteLength = buffer2.byteLength,
    headerSize = headerLength({ roots })
  } = options;
  const bytes2 = new Uint8Array(buffer2, byteOffset, byteLength);
  const writer = new CarBufferWriter(bytes2, headerSize);
  for (const root of roots) {
    writer.addRoot(root);
  }
  return writer;
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/car.js
var contentType2 = "application/vnd.ipld.car";
var name7 = "CAR";
var code9 = 514;
var Writer = class {
  /**
   * @param {API.IPLDBlock[]} blocks
   * @param {number} byteLength
   */
  constructor(blocks = [], byteLength = 0) {
    this.written = /* @__PURE__ */ new Set();
    this.blocks = blocks;
    this.byteLength = byteLength;
  }
  /**
   * @param {API.IPLDBlock[]} blocks
   */
  write(...blocks) {
    for (const block of blocks) {
      const id = block.cid.toString(base32);
      if (!this.written.has(id)) {
        this.blocks.push(block);
        this.byteLength += blockLength(
          /** @type {any} */
          block
        );
        this.written.add(id);
      }
    }
    return this;
  }
  /**
   * @param {API.IPLDBlock[]} rootBlocks
   */
  flush(...rootBlocks) {
    const roots = [];
    for (const block of rootBlocks.reverse()) {
      const id = block.cid.toString(base32);
      if (!this.written.has(id)) {
        this.blocks.unshift(block);
        this.byteLength += blockLength({
          cid: (
            /** @type {CarBufferWriter.CID} */
            block.cid
          ),
          bytes: block.bytes
        });
        this.written.add(id);
      }
      roots.unshift(
        /** @type {CarBufferWriter.CID} */
        block.cid
      );
    }
    this.byteLength += headerLength({ roots });
    const buffer2 = new ArrayBuffer(this.byteLength);
    const writer = createWriter(buffer2, { roots });
    for (
      const block of
      /** @type {CarBufferWriter.Block[]} */
      this.blocks
    ) {
      writer.write(block);
    }
    return writer.close();
  }
};
var createWriter2 = () => new Writer();
var encode20 = ({ roots = [], blocks }) => {
  const writer = new Writer();
  if (blocks) {
    writer.write(...blocks.values());
  }
  return writer.flush(...roots);
};
var decode22 = (bytes2) => {
  const reader = CarBufferReader2.fromBytes(bytes2);
  const roots = [];
  const blocks = /* @__PURE__ */ new Map();
  for (const root of reader.getRoots()) {
    const block = (
      /** @type {API.IPLDBlock} */
      reader.get(root)
    );
    if (block) {
      roots.push(block);
    }
  }
  for (const block of reader.blocks()) {
    blocks.set(block.cid.toString(), block);
  }
  return { roots, blocks };
};
var link3 = async (bytes2, { hasher = sha256 } = {}) => {
  return (
    /** @type {API.Link<T, typeof code, typeof hasher.code>} */
    create4(code9, await hasher.digest(bytes2))
  );
};
var write3 = async (data, options) => {
  const bytes2 = encode20(data);
  const cid = await link3(bytes2, options);
  return { bytes: bytes2, cid };
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema.js
var schema_exports3 = {};
__export(schema_exports3, {
  API: () => API,
  Bytes: () => Bytes,
  DID: () => did_exports2,
  Link: () => link_exports2,
  Principal: () => principal_exports,
  Text: () => text_exports,
  URI: () => uri_exports,
  and: () => and,
  array: () => array,
  boolean: () => boolean,
  bytes: () => bytes,
  dictionary: () => dictionary,
  did: () => match4,
  didBytes: () => matchBytes,
  endsWith: () => endsWith,
  enum: () => createEnum,
  error: () => error2,
  float: () => float,
  greaterThan: () => greaterThan,
  integer: () => integer,
  intersection: () => intersection,
  lessThan: () => lessThan,
  link: () => match2,
  literal: () => literal,
  memberError: () => memberError,
  never: () => never,
  nullable: () => nullable,
  number: () => number,
  ok: () => ok,
  optional: () => optional,
  or: () => or7,
  principal: () => match3,
  refine: () => refine,
  startsWith: () => startsWith,
  string: () => string,
  struct: () => struct,
  text: () => match5,
  toString: () => toString3,
  tuple: () => tuple,
  typeError: () => typeError,
  uint64: () => uint64,
  union: () => union,
  unknown: () => unknown,
  uri: () => match,
  variant: () => variant
});

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/uri.js
var uri_exports = {};
__export(uri_exports, {
  from: () => from8,
  match: () => match,
  read: () => read2,
  uri: () => uri
});

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/result.js
var ok = (value) => {
  if (value == null) {
    throw new TypeError(`ok(${value}) is not allowed, consider ok({}) instead`);
  } else {
    return { ok: value };
  }
};
var error = (cause) => {
  if (cause == null) {
    throw new TypeError(
      `error(${cause}) is not allowed, consider passing an error instead`
    );
  } else {
    return { error: cause };
  }
};
var panic = (message) => {
  throw new Failure(message);
};
var fail2 = (message) => ({ error: new Failure(message) });
var Failure = class extends Error {
  describe() {
    return this.toString();
  }
  get message() {
    return this.describe();
  }
  toJSON() {
    const { name: name8, message, stack } = this;
    return { name: name8, message, stack };
  }
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/schema.js
var API = class {
  /**
   * @param {Settings} settings
   */
  constructor(settings) {
    this.settings = settings;
  }
  toString() {
    return `new ${this.constructor.name}()`;
  }
  /**
   * @abstract
   * @param {I} input
   * @param {Settings} settings
   * @returns {Schema.ReadResult<T>}
   */
  /* c8 ignore next 3 */
  readWith(input, settings) {
    throw new Error(`Abstract method readWith must be implemented by subclass`);
  }
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<T>}
   */
  read(input) {
    return this.readWith(input, this.settings);
  }
  /**
   * @param {unknown} value
   * @returns {value is T}
   */
  is(value) {
    return !this.read(
      /** @type {I} */
      value
    )?.error;
  }
  /**
   * @param {unknown} value
   * @return {T}
   */
  from(value) {
    const result = this.read(
      /** @type {I} */
      value
    );
    if (result.error) {
      throw result.error;
    } else {
      return result.ok;
    }
  }
  /**
   * @returns {Schema.Schema<T|undefined, I>}
   */
  optional() {
    return optional(this);
  }
  /**
   * @returns {Schema.Schema<T|null, I>}
   */
  nullable() {
    return nullable(this);
  }
  /**
   * @returns {Schema.Schema<T[], I>}
   */
  array() {
    return array(this);
  }
  /**
   * @template U
   * @param {Schema.Reader<U, I>} schema
   * @returns {Schema.Schema<T | U, I>}
   */
  or(schema6) {
    return or7(this, schema6);
  }
  /**
   * @template U
   * @param {Schema.Reader<U, I>} schema
   * @returns {Schema.Schema<T & U, I>}
   */
  and(schema6) {
    return and(this, schema6);
  }
  /**
   * @template {T} U
   * @param {Schema.Reader<U, T>} schema
   * @returns {Schema.Schema<U, I>}
   */
  refine(schema6) {
    return refine(this, schema6);
  }
  /**
   * @template {string} Kind
   * @param {Kind} [kind]
   * @returns {Schema.Schema<Schema.Branded<T, Kind>, I>}
   */
  brand(kind) {
    return (
      /** @type {Schema.Schema<Schema.Branded<T, Kind>, I>} */
      this
    );
  }
  /**
   * @param {Schema.NotUndefined<T>} value
   * @returns {Schema.DefaultSchema<Schema.NotUndefined<T>, I>}
   */
  default(value) {
    const fallback = this.from(value);
    if (fallback === void 0) {
      throw new Error(`Value of type undefined is not a valid default`);
    }
    const schema6 = new Default({
      reader: (
        /** @type {Schema.Reader<T, I>} */
        this
      ),
      value: (
        /** @type {Schema.NotUndefined<T>} */
        fallback
      )
    });
    return (
      /** @type {Schema.DefaultSchema<Schema.NotUndefined<T>, I>} */
      schema6
    );
  }
};
var Never = class extends API {
  toString() {
    return "never()";
  }
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<never>}
   */
  read(input) {
    return typeError({ expect: "never", actual: input });
  }
};
var never = () => new Never();
var Unknown = class extends API {
  /**
   * @param {I} input
   */
  read(input) {
    return (
      /** @type {Schema.ReadResult<unknown>}*/
      { ok: input }
    );
  }
  toString() {
    return "unknown()";
  }
};
var unknown = () => new Unknown();
var Nullable = class extends API {
  /**
   * @param {I} input
   * @param {Schema.Reader<O, I>} reader
   */
  readWith(input, reader) {
    const result = reader.read(input);
    if (result.error) {
      return input === null ? { ok: null } : {
        error: new UnionError({
          causes: [
            result.error,
            typeError({ expect: "null", actual: input }).error
          ]
        })
      };
    } else {
      return result;
    }
  }
  toString() {
    return `${this.settings}.nullable()`;
  }
};
var nullable = (schema6) => new Nullable(schema6);
var Optional = class extends API {
  optional() {
    return this;
  }
  /**
   * @param {I} input
   * @param {Schema.Reader<O, I>} reader
   * @returns {Schema.ReadResult<O|undefined>}
   */
  readWith(input, reader) {
    const result = reader.read(input);
    return result.error && input === void 0 ? { ok: void 0 } : result;
  }
  toString() {
    return `${this.settings}.optional()`;
  }
};
var Default = class extends API {
  /**
   * @returns {Schema.DefaultSchema<O & Schema.NotUndefined<O>, I>}
   */
  optional() {
    return (
      /** @type {Schema.DefaultSchema<O & Schema.NotUndefined<O>, I>} */
      this
    );
  }
  /**
   * @param {I} input
   * @param {object} options
   * @param {Schema.Reader<O|undefined, I>} options.reader
   * @param {O} options.value
   * @returns {Schema.ReadResult<O>}
   */
  readWith(input, { reader, value }) {
    if (input === void 0) {
      return (
        /** @type {Schema.ReadResult<O>} */
        { ok: value }
      );
    } else {
      const result = reader.read(input);
      return result.error ? result : result.ok !== void 0 ? (
        // We just checked that result.ok is not undefined but still needs
        // reassurance
        /** @type {Schema.ReadResult<O>} */
        result
      ) : { ok: value };
    }
  }
  toString() {
    return `${this.settings.reader}.default(${JSON.stringify(
      this.settings.value
    )})`;
  }
  get value() {
    return this.settings.value;
  }
};
var optional = (schema6) => new Optional(schema6);
var ArrayOf = class extends API {
  /**
   * @param {I} input
   * @param {Schema.Reader<O, I>} schema
   */
  readWith(input, schema6) {
    if (!Array.isArray(input)) {
      return typeError({ expect: "array", actual: input });
    }
    const results = [];
    for (const [index, value] of input.entries()) {
      const result = schema6.read(value);
      if (result.error) {
        return memberError({ at: index, cause: result.error });
      } else {
        results.push(result.ok);
      }
    }
    return { ok: results };
  }
  get element() {
    return this.settings;
  }
  toString() {
    return `array(${this.element})`;
  }
};
var array = (schema6) => new ArrayOf(schema6);
var Tuple = class extends API {
  /**
   * @param {I} input
   * @param {U} shape
   * @returns {Schema.ReadResult<Schema.InferTuple<U>>}
   */
  readWith(input, shape) {
    if (!Array.isArray(input)) {
      return typeError({ expect: "array", actual: input });
    }
    if (input.length !== this.shape.length) {
      return error2(`Array must contain exactly ${this.shape.length} elements`);
    }
    const results = [];
    for (const [index, reader] of shape.entries()) {
      const result = reader.read(input[index]);
      if (result.error) {
        return memberError({ at: index, cause: result.error });
      } else {
        results[index] = result.ok;
      }
    }
    return { ok: (
      /** @type {Schema.InferTuple<U>} */
      results
    ) };
  }
  /** @type {U} */
  get shape() {
    return this.settings;
  }
  toString() {
    return `tuple([${this.shape.map((reader) => reader.toString()).join(", ")}])`;
  }
};
var tuple = (shape) => new Tuple(shape);
var Dictionary = class _Dictionary extends API {
  /**
   * @param {I} input
   * @param {object} schema
   * @param {Schema.Reader<K, string>} schema.key
   * @param {Schema.Reader<V, I>} schema.value
   */
  readWith(input, { key, value }) {
    if (typeof input != "object" || input === null || Array.isArray(input)) {
      return typeError({
        expect: "dictionary",
        actual: input
      });
    }
    const dict = (
      /** @type {Schema.Dictionary<K, V>} */
      {}
    );
    for (const [k, v] of Object.entries(input)) {
      const keyResult = key.read(k);
      if (keyResult.error) {
        return memberError({ at: k, cause: keyResult.error });
      }
      const valueResult = value.read(v);
      if (valueResult.error) {
        return memberError({ at: k, cause: valueResult.error });
      }
      if (valueResult.ok !== void 0) {
        dict[keyResult.ok] = valueResult.ok;
      }
    }
    return { ok: dict };
  }
  get key() {
    return this.settings.key;
  }
  get value() {
    return this.settings.value;
  }
  partial() {
    const { key, value } = this.settings;
    return new _Dictionary({
      key,
      value: optional(value)
    });
  }
  toString() {
    return `dictionary(${this.settings})`;
  }
};
var dictionary = ({ value, key }) => new Dictionary({
  value,
  key: key || /** @type {Schema.Reader<K, string>} */
  string()
});
var Enum = class extends API {
  /**
   * @param {I} input
   * @param {{type:string, variants:Set<T[number]>}} settings
   * @returns {Schema.ReadResult<T[number]>}
   */
  readWith(input, { variants, type }) {
    if (variants.has(input)) {
      return (
        /** @type {Schema.ReadResult<T[number]>} */
        { ok: input }
      );
    } else {
      return typeError({ expect: type, actual: input });
    }
  }
  toString() {
    return this.settings.type;
  }
};
var createEnum = (variants) => new Enum({
  type: variants.join("|"),
  variants: new Set(variants)
});
var Union = class extends API {
  /**
   * @param {I} input
   * @param {U} variants
   */
  readWith(input, variants) {
    const causes = [];
    for (const reader of variants) {
      const result = reader.read(input);
      if (result.error) {
        causes.push(result.error);
      } else {
        return (
          /** @type {Schema.ReadResult<Schema.InferUnion<U>>} */
          result
        );
      }
    }
    return { error: new UnionError({ causes }) };
  }
  get variants() {
    return this.settings;
  }
  toString() {
    return `union([${this.variants.map((type) => type.toString()).join(", ")}])`;
  }
};
var union = (variants) => new Union(variants);
var or7 = (left, right) => union([left, right]);
var Intersection = class extends API {
  /**
   * @param {I} input
   * @param {U} schemas
   * @returns {Schema.ReadResult<Schema.InferIntersection<U>>}
   */
  readWith(input, schemas) {
    const causes = [];
    for (const schema6 of schemas) {
      const result = schema6.read(input);
      if (result.error) {
        causes.push(result.error);
      }
    }
    return causes.length > 0 ? { error: new IntersectionError({ causes }) } : (
      /** @type {Schema.ReadResult<Schema.InferIntersection<U>>} */
      {
        ok: input
      }
    );
  }
  toString() {
    return `intersection([${this.settings.map((type) => type.toString()).join(",")}])`;
  }
};
var intersection = (variants) => new Intersection(variants);
var and = (left, right) => intersection([left, right]);
var Boolean2 = class extends API {
  /**
   * @param {I} input
   */
  readWith(input) {
    switch (input) {
      case true:
      case false:
        return { ok: (
          /** @type {boolean} */
          input
        ) };
      default:
        return typeError({
          expect: "boolean",
          actual: input
        });
    }
  }
  toString() {
    return `boolean()`;
  }
};
var anyBoolean = new Boolean2();
var boolean = () => anyBoolean;
var UnknownNumber = class extends API {
  /**
   * @param {number} n
   */
  greaterThan(n) {
    return this.refine(greaterThan(n));
  }
  /**
   * @param {number} n
   */
  lessThan(n) {
    return this.refine(lessThan(n));
  }
  /**
   * @template {O} U
   * @param {Schema.Reader<U, O>} schema
   * @returns {Schema.NumberSchema<U, I>}
   */
  refine(schema6) {
    return new RefinedNumber({ base: this, schema: schema6 });
  }
};
var AnyNumber = class extends UnknownNumber {
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<number>}
   */
  readWith(input) {
    return typeof input === "number" ? { ok: input } : typeError({ expect: "number", actual: input });
  }
  toString() {
    return `number()`;
  }
};
var anyNumber = new AnyNumber();
var number = () => anyNumber;
var RefinedNumber = class extends UnknownNumber {
  /**
   * @param {I} input
   * @param {{base:Schema.Reader<T, I>, schema:Schema.Reader<O, T>}} settings
   * @returns {Schema.ReadResult<O>}
   */
  readWith(input, { base: base2, schema: schema6 }) {
    const result = base2.read(input);
    return result.error ? result : schema6.read(result.ok);
  }
  toString() {
    return `${this.settings.base}.refine(${this.settings.schema})`;
  }
};
var LessThan = class extends API {
  /**
   * @param {T} input
   * @param {number} number
   * @returns {Schema.ReadResult<T>}
   */
  readWith(input, number2) {
    if (input < number2) {
      return { ok: input };
    } else {
      return error2(`Expected ${input} < ${number2}`);
    }
  }
  toString() {
    return `lessThan(${this.settings})`;
  }
};
var lessThan = (n) => new LessThan(n);
var GreaterThan = class extends API {
  /**
   * @param {T} input
   * @param {number} number
   * @returns {Schema.ReadResult<T>}
   */
  readWith(input, number2) {
    if (input > number2) {
      return { ok: input };
    } else {
      return error2(`Expected ${input} > ${number2}`);
    }
  }
  toString() {
    return `greaterThan(${this.settings})`;
  }
};
var greaterThan = (n) => new GreaterThan(n);
var Integer = {
  /**
   * @param {number} input
   * @returns {Schema.ReadResult<Schema.Integer>}
   */
  read(input) {
    return Number.isInteger(input) ? { ok: (
      /** @type {Schema.Integer} */
      input
    ) } : typeError({
      expect: "integer",
      actual: input
    });
  },
  toString() {
    return `Integer`;
  }
};
var anyInteger = anyNumber.refine(Integer);
var integer = () => anyInteger;
var MAX_UINT64 = 2n ** 64n - 1n;
var Uint64Schema = class extends API {
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<O>}
   */
  read(input) {
    switch (typeof input) {
      case "bigint":
        return input > MAX_UINT64 ? error2(`Integer is too big for uint64, ${input} > ${MAX_UINT64}`) : input < 0 ? error2(
          `Negative integer can not be represented as uint64, ${input} < ${0}`
        ) : { ok: (
          /** @type {I & O} */
          input
        ) };
      case "number":
        return !Number.isInteger(input) ? typeError({
          expect: "uint64",
          actual: input
        }) : input < 0 ? error2(
          `Negative integer can not be represented as uint64, ${input} < ${0}`
        ) : { ok: (
          /** @type {O} */
          BigInt(input)
        ) };
      default:
        return typeError({
          expect: "uint64",
          actual: input
        });
    }
  }
  toString() {
    return `uint64`;
  }
};
var Uint64 = new Uint64Schema();
var uint64 = () => Uint64;
var Float = {
  /**
   * @param {number} number
   * @returns {Schema.ReadResult<Schema.Float>}
   */
  read(number2) {
    return Number.isFinite(number2) ? { ok: (
      /** @type {Schema.Float} */
      number2
    ) } : typeError({
      expect: "Float",
      actual: number2
    });
  },
  toString() {
    return "Float";
  }
};
var anyFloat = anyNumber.refine(Float);
var float = () => anyFloat;
var UnknownString = class extends API {
  /**
   * @template {O|unknown} U
   * @param {Schema.Reader<U, O>} schema
   * @returns {Schema.StringSchema<O & U, I>}
   */
  refine(schema6) {
    const other = (
      /** @type {Schema.Reader<U, O>} */
      schema6
    );
    const rest = new RefinedString({
      base: this,
      schema: other
    });
    return (
      /** @type {Schema.StringSchema<O & U, I>} */
      rest
    );
  }
  /**
   * @template {string} Prefix
   * @param {Prefix} prefix
   */
  startsWith(prefix) {
    return this.refine(startsWith(prefix));
  }
  /**
   * @template {string} Suffix
   * @param {Suffix} suffix
   */
  endsWith(suffix) {
    return this.refine(endsWith(suffix));
  }
  toString() {
    return `string()`;
  }
};
var RefinedString = class extends UnknownString {
  /**
   * @param {I} input
   * @param {{base:Schema.Reader<T, I>, schema:Schema.Reader<O, T>}} settings
   * @returns {Schema.ReadResult<T & O>}
   */
  readWith(input, { base: base2, schema: schema6 }) {
    const result = base2.read(input);
    return result.error ? result : (
      /** @type {Schema.ReadResult<T & O>} */
      schema6.read(result.ok)
    );
  }
  toString() {
    return `${this.settings.base}.refine(${this.settings.schema})`;
  }
};
var AnyString = class extends UnknownString {
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<string>}
   */
  readWith(input) {
    return typeof input === "string" ? { ok: input } : typeError({ expect: "string", actual: input });
  }
};
var anyString = new AnyString();
var string = () => anyString;
var BytesSchema = class extends API {
  /**
   * @param {I} input
   * @returns {Schema.ReadResult<Uint8Array>}
   */
  readWith(input) {
    if (input instanceof Uint8Array) {
      return { ok: input };
    } else {
      return typeError({ expect: "Uint8Array", actual: input });
    }
  }
};
var Bytes = new BytesSchema();
var bytes = () => Bytes;
var StartsWith = class extends API {
  /**
   * @param {Body} input
   * @param {Prefix} prefix
   */
  readWith(input, prefix) {
    const result = input.startsWith(prefix) ? (
      /** @type {Schema.ReadResult<Body & `${Prefix}${Body}`>} */
      {
        ok: input
      }
    ) : error2(`Expect string to start with "${prefix}" instead got "${input}"`);
    return result;
  }
  get prefix() {
    return this.settings;
  }
  toString() {
    return `startsWith("${this.prefix}")`;
  }
};
var startsWith = (prefix) => new StartsWith(prefix);
var EndsWith = class extends API {
  /**
   * @param {Body} input
   * @param {Suffix} suffix
   */
  readWith(input, suffix) {
    return input.endsWith(suffix) ? (
      /** @type {Schema.ReadResult<Body & `${Body}${Suffix}`>} */
      {
        ok: input
      }
    ) : error2(`Expect string to end with "${suffix}" instead got "${input}"`);
  }
  get suffix() {
    return this.settings;
  }
  toString() {
    return `endsWith("${this.suffix}")`;
  }
};
var endsWith = (suffix) => new EndsWith(suffix);
var Refine = class extends API {
  /**
   * @param {I} input
   * @param {{ base: Schema.Reader<T, I>, schema: Schema.Reader<U, T> }} settings
   */
  readWith(input, { base: base2, schema: schema6 }) {
    const result = base2.read(input);
    return result.error ? result : schema6.read(result.ok);
  }
  toString() {
    return `${this.settings.base}.refine(${this.settings.schema})`;
  }
};
var refine = (base2, schema6) => new Refine({ base: base2, schema: schema6 });
var Literal = class extends API {
  /**
   * @param {I} input
   * @param {T} expect
   * @returns {Schema.ReadResult<T>}
   */
  readWith(input, expect) {
    return input !== /** @type {unknown} */
    expect ? { error: new LiteralError({ expect, actual: input }) } : { ok: expect };
  }
  get value() {
    return (
      /** @type {Exclude<T, undefined>} */
      this.settings
    );
  }
  /**
   * @template {Schema.NotUndefined<T>} U
   * @param {U} value
   */
  default(value = (
    /** @type {U} */
    this.value
  )) {
    return super.default(value);
  }
  toString() {
    return `literal(${toString3(this.value)})`;
  }
};
var literal = (value) => new Literal(value);
var Struct = class _Struct extends API {
  /**
   * @param {I} input
   * @param {U} shape
   * @returns {Schema.ReadResult<Schema.InferStruct<U>>}
   */
  readWith(input, shape) {
    if (typeof input != "object" || input === null || Array.isArray(input)) {
      return typeError({
        expect: "object",
        actual: input
      });
    }
    const source = (
      /** @type {{[K in keyof U]: unknown}} */
      input
    );
    const struct2 = (
      /** @type {{[K in keyof U]: Schema.Infer<U[K]>}} */
      {}
    );
    const entries2 = (
      /** @type {{[K in keyof U]: [K & string, U[K]]}[keyof U][]} */
      Object.entries(shape)
    );
    for (const [at, reader] of entries2) {
      const result = reader.read(source[at]);
      if (result.error) {
        return memberError({ at, cause: result.error });
      } else if (result.ok !== void 0) {
        struct2[at] = /** @type {Schema.Infer<U[typeof at]>} */
        result.ok;
      }
    }
    return { ok: struct2 };
  }
  /**
   * @returns {Schema.MapRepresentation<Partial<Schema.InferStruct<U>>> & Schema.StructSchema}
   */
  partial() {
    return new _Struct(
      Object.fromEntries(
        Object.entries(this.shape).map(([key, value]) => [key, optional(value)])
      )
    );
  }
  /** @type {U} */
  get shape() {
    return this.settings;
  }
  toString() {
    return [
      `struct({ `,
      ...Object.entries(this.shape).map(([key, schema6]) => `${key}: ${schema6}`).join(", "),
      ` })`
    ].join("");
  }
  /**
   * @param {Schema.InferStructSource<U>} data
   */
  create(data) {
    return this.from(data || {});
  }
  /**
   * @template {{[key:string]: Schema.Reader}} E
   * @param {E} extension
   * @returns {Schema.StructSchema<U & E, I>}
   */
  extend(extension) {
    return new _Struct({ ...this.shape, ...extension });
  }
};
var struct = (fields) => {
  const shape = (
    /** @type {{[K in keyof U]: Schema.Reader<unknown, unknown>}} */
    {}
  );
  const entries2 = Object.entries(fields);
  for (const [key, field] of entries2) {
    switch (typeof field) {
      case "number":
      case "string":
      case "boolean":
        shape[key] = literal(field);
        break;
      case "object":
        shape[key] = field === null ? literal(null) : field;
        break;
      default:
        throw new Error(
          `Invalid struct field "${key}", expected schema or literal, instead got ${typeof field}`
        );
    }
  }
  return new Struct(
    /** @type {V} */
    shape
  );
};
var Variant = class extends API {
  /**
   * @param {I} input
   * @param {U} variants
   * @returns {Schema.ReadResult<Schema.InferVariant<U>>}
   */
  readWith(input, variants) {
    if (typeof input != "object" || input === null || Array.isArray(input)) {
      return typeError({
        expect: "object",
        actual: input
      });
    }
    const keys = (
      /** @type {Array<keyof input & keyof variants & string>} */
      Object.keys(input)
    );
    const [key] = keys.length === 1 ? keys : [];
    const reader = key ? variants[key] : void 0;
    if (reader) {
      const result = reader.read(input[key]);
      return result.error ? memberError({ at: key, cause: result.error }) : { ok: (
        /** @type {Schema.InferVariant<U>} */
        { [key]: result.ok }
      ) };
    } else if (variants._) {
      const result = variants._.read(input);
      return result.error ? result : { ok: (
        /** @type {Schema.InferVariant<U>} */
        { _: result.ok }
      ) };
    } else if (key) {
      return error2(
        `Expected an object with one of the these keys: ${Object.keys(variants).sort().join(", ")} instead got object with key ${key}`
      );
    } else {
      return error2(
        "Expected an object with a single key instead got object with keys " + keys.sort().join(", ")
      );
    }
  }
  /**
   * @template [E=never]
   * @param {I} input
   * @param {E} [fallback]
   */
  match(input, fallback) {
    const result = this.read(input);
    if (result.error) {
      if (fallback !== void 0) {
        return [null, fallback];
      } else {
        throw result.error;
      }
    } else {
      const [key] = Object.keys(result.ok);
      const value = result.ok[key];
      return (
        /** @type {any} */
        [key, value]
      );
    }
  }
  /**
   * @template {Schema.InferVariant<U>} O
   * @param {O} source
   * @returns {O}
   */
  create(source) {
    return (
      /** @type {O} */
      this.from(source)
    );
  }
};
var variant = (variants) => new Variant(variants);
var error2 = (message) => ({ error: new SchemaError(message) });
var SchemaError = class extends Failure {
  get name() {
    return "SchemaError";
  }
  /* c8 ignore next 3 */
  describe() {
    return this.name;
  }
};
var TypeError2 = class extends SchemaError {
  /**
   * @param {{expect:string, actual:unknown}} data
   */
  constructor({ expect, actual }) {
    super();
    this.expect = expect;
    this.actual = actual;
  }
  get name() {
    return "TypeError";
  }
  describe() {
    return `Expected value of type ${this.expect} instead got ${toString3(
      this.actual
    )}`;
  }
};
var typeError = (data) => ({ error: new TypeError2(data) });
var toString3 = (value) => {
  const type = typeof value;
  switch (type) {
    case "boolean":
    case "string":
      return JSON.stringify(value);
    // if these types we do not want JSON.stringify as it may mess things up
    // eg turn NaN and Infinity to null
    case "bigint":
      return `${value}n`;
    case "number":
    case "symbol":
    case "undefined":
      return String(value);
    case "object":
      return value === null ? "null" : Array.isArray(value) ? "array" : Symbol.toStringTag in /** @type {object} */
      value ? value[Symbol.toStringTag] : "object";
    default:
      return type;
  }
};
var LiteralError = class extends SchemaError {
  /**
   * @param {{
   * expect:string|number|boolean|null
   * actual:unknown
   * }} data
   */
  constructor({ expect, actual }) {
    super();
    this.expect = expect;
    this.actual = actual;
  }
  get name() {
    return "LiteralError";
  }
  describe() {
    return `Expected literal ${toString3(this.expect)} instead got ${toString3(
      this.actual
    )}`;
  }
};
var ElementError = class extends SchemaError {
  /**
   * @param {{at:number, cause:Schema.Error}} data
   */
  constructor({ at, cause }) {
    super();
    this.at = at;
    this.cause = cause;
  }
  get name() {
    return "ElementError";
  }
  describe() {
    return [
      `Array contains invalid element at ${this.at}:`,
      li(this.cause.message)
    ].join("\n");
  }
};
var FieldError = class extends SchemaError {
  /**
   * @param {{at:string, cause:Schema.Error}} data
   */
  constructor({ at, cause }) {
    super();
    this.at = at;
    this.cause = cause;
  }
  get name() {
    return "FieldError";
  }
  describe() {
    return [
      `Object contains invalid field "${this.at}":`,
      li(this.cause.message)
    ].join("\n");
  }
};
var memberError = ({ at, cause }) => typeof at === "string" ? { error: new FieldError({ at, cause }) } : { error: new ElementError({ at, cause }) };
var UnionError = class extends SchemaError {
  /**
   * @param {{causes: Schema.Error[]}} data
   */
  constructor({ causes }) {
    super();
    this.causes = causes;
  }
  get name() {
    return "UnionError";
  }
  describe() {
    const { causes } = this;
    return [
      `Value does not match any type of the union:`,
      ...causes.map((cause) => li(cause.message))
    ].join("\n");
  }
};
var IntersectionError = class extends SchemaError {
  /**
   * @param {{causes: Schema.Error[]}} data
   */
  constructor({ causes }) {
    super();
    this.causes = causes;
  }
  get name() {
    return "IntersectionError";
  }
  describe() {
    const { causes } = this;
    return [
      `Value does not match following types of the intersection:`,
      ...causes.map((cause) => li(cause.message))
    ].join("\n");
  }
};
var indent = (message, indent3 = "  ") => `${indent3}${message.split("\n").join(`
${indent3}`)}`;
var li = (message) => indent(`- ${message}`);

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/uri.js
var URISchema = class extends API {
  /**
   * @param {unknown} input
   * @param {Partial<O>} options
   * @returns {Schema.ReadResult<API.URI<O['protocol']>>}
   */
  readWith(input, { protocol } = {}) {
    if (typeof input !== "string" && !(input instanceof URL)) {
      return error2(
        `Expected URI but got ${input === null ? "null" : typeof input}`
      );
    }
    try {
      const url = new URL(String(input));
      if (protocol != null && url.protocol !== protocol) {
        return error2(`Expected ${protocol} URI instead got ${url.href}`);
      } else {
        return { ok: (
          /** @type {API.URI<O['protocol']>} */
          url.href
        ) };
      }
    } catch (_) {
      return error2(`Invalid URI`);
    }
  }
};
var schema = new URISchema({});
var uri = () => schema;
var read2 = (input) => schema.read(input);
var match = (options) => new URISchema(options);
var from8 = (input) => (
  /** @type {API.URI<`${Scheme}:`>} */
  schema.from(input)
);

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/link.js
var link_exports2 = {};
__export(link_exports2, {
  create: () => create4,
  createLegacy: () => createLegacy,
  isLink: () => isLink,
  link: () => link4,
  match: () => match2,
  optional: () => optional2,
  parse: () => parse4,
  read: () => read3,
  schema: () => schema2
});
var LinkSchema = class extends API {
  /**
   *
   * @param {unknown} cid
   * @param {Settings<Code, Alg, Version>} settings
   * @returns {Schema.ReadResult<API.Link<unknown, Code, Alg, Version>>}
   */
  readWith(cid, { code: code11, multihash = {}, version }) {
    if (cid == null) {
      return error2(`Expected link but got ${cid} instead`);
    } else {
      if (!isLink(cid)) {
        return error2(`Expected link to be a CID instead of ${cid}`);
      } else {
        if (code11 != null && cid.code !== code11) {
          return error2(
            `Expected link to be CID with 0x${code11.toString(16)} codec`
          );
        }
        if (multihash.code != null && cid.multihash.code !== multihash.code)
          return error2(
            `Expected link to be CID with 0x${multihash.code.toString(
              16
            )} hashing algorithm`
          );
        if (version != null && cid.version !== version) {
          return error2(
            `Expected link to be CID version ${version} instead of ${cid.version}`
          );
        }
        const [expectDigest, actualDigest] = multihash.digest != null ? [
          base32.baseEncode(multihash.digest),
          base32.baseEncode(cid.multihash.digest)
        ] : ["", ""];
        if (expectDigest !== actualDigest) {
          return error2(
            `Expected link with "${expectDigest}" hash digest instead of "${actualDigest}"`
          );
        }
        return {
          ok: (
            /** @type {API.Link<unknown, any, any, any>} */
            cid
          )
        };
      }
    }
  }
};
var schema2 = new LinkSchema({});
var link4 = () => schema2;
var match2 = (options = {}) => new LinkSchema(options);
var read3 = (input) => schema2.read(input);
var optional2 = () => schema2.optional();

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/principal.js
var principal_exports = {};
__export(principal_exports, {
  from: () => from9,
  match: () => match3,
  principal: () => principal,
  read: () => read4
});
var PrincipalSchema = class extends API {
  /**
   * @param {unknown} source
   * @param {void|Method} method
   */
  readWith(source, method) {
    if (!(source instanceof Uint8Array)) {
      return typeError({ expect: "Uint8Array", actual: source });
    }
    let principal2;
    try {
      principal2 = decode6(source);
    } catch (err) {
      return error2(`Unable to decode bytes as DID: ${err}`);
    }
    const prefix = method ? `did:${method}:` : `did:`;
    if (!principal2.did().startsWith(prefix)) {
      return error2(
        `Expected a ${prefix} but got "${principal2.did()}" instead`
      );
    }
    return { ok: (
      /** @type {API.PrincipalView<API.DID<Method>>} */
      principal2
    ) };
  }
};
var schema3 = new PrincipalSchema();
var principal = () => schema3;
var read4 = (input) => schema3.read(input);
var match3 = (options = {}) => (
  /** @type {Schema.Schema<API.PrincipalView<API.DID<Method> & API.URI<"did:">>>} */
  new PrincipalSchema(options.method)
);
var from9 = (input) => match3({}).from(input);

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/did.js
var did_exports2 = {};
__export(did_exports2, {
  did: () => did,
  didBytes: () => didBytes,
  from: () => from10,
  fromBytes: () => fromBytes2,
  match: () => match4,
  matchBytes: () => matchBytes,
  read: () => read5,
  readBytes: () => readBytes2
});
var DIDSchema = class extends API {
  /**
   * @param {string} source
   * @param {void|Method} method
   */
  readWith(source, method) {
    const prefix = method ? `did:${method}:` : `did:`;
    if (!source.startsWith(prefix)) {
      return error2(`Expected a ${prefix} but got "${source}" instead`);
    } else {
      return { ok: (
        /** @type {API.DID<Method>} */
        source
      ) };
    }
  }
};
var schema4 = string().refine(new DIDSchema());
var did = () => schema4;
var read5 = (input) => schema4.read(input);
var match4 = (options = {}) => (
  /** @type {Schema.Schema<API.DID<Method> & API.URI<"did:">>} */
  string().refine(new DIDSchema(options.method))
);
var from10 = (input) => match4({}).from(input);
var DIDBytesSchema = class extends API {
  /**
   * @param {unknown} source
   * @param {void|Method} method
   */
  readWith(source, method) {
    if (!(source instanceof Uint8Array)) {
      return typeError({ expect: "Uint8Array", actual: source });
    }
    let did2;
    try {
      did2 = decode6(source).did();
    } catch (err) {
      return error2(`Unable to parse bytes as did: ${err}`);
    }
    const prefix = method ? `did:${method}:` : `did:`;
    if (!did2.startsWith(prefix)) {
      return error2(`Expected a ${prefix} but got "${did2}" instead`);
    } else {
      return { ok: (
        /** @type {API.DID<Method>} */
        did2
      ) };
    }
  }
};
var schemaBytes = new DIDBytesSchema();
var didBytes = () => schemaBytes;
var readBytes2 = (input) => schemaBytes.read(input);
var matchBytes = (options = {}) => (
  /** @type {Schema.Schema<API.DID<Method> & API.URI<"did:">>} */
  new DIDBytesSchema(options.method)
);
var fromBytes2 = (input) => matchBytes({}).from(input);

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/schema/text.js
var text_exports = {};
__export(text_exports, {
  match: () => match5,
  read: () => read6,
  text: () => text
});
var schema5 = string();
var match5 = (options) => options ? schema5.refine(new Match(options.pattern)) : schema5;
var text = match5;
var read6 = (input) => schema5.read(input);
var Match = class extends API {
  /**
   * @param {string} source
   * @param {RegExp} pattern
   */
  readWith(source, pattern) {
    if (!pattern.test(source)) {
      return error2(
        `Expected to match ${pattern} but got "${source}" instead`
      );
    } else {
      return { ok: source };
    }
  }
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/delegation.js
var isDelegation = (proof) => !isLink(proof);
var Delegation = class {
  /**
   * @param {API.UCANBlock<C>} root
   * @param {DAG.BlockStore} [blocks]
   */
  constructor(root, blocks = /* @__PURE__ */ new Map()) {
    this.root = root;
    this.blocks = blocks;
    Object.defineProperties(this, {
      blocks: {
        enumerable: false
      }
    });
  }
  /**
   * @returns {API.AttachedLinkSet}
   */
  get attachedLinks() {
    const _attachedLinks = /* @__PURE__ */ new Set();
    const ucanView = this.data;
    for (const capability2 of ucanView.capabilities) {
      const links = getLinksFromObject(capability2);
      for (const link5 of links) {
        _attachedLinks.add(`${link5}`);
      }
    }
    for (const fact of ucanView.facts) {
      if (isLink(fact)) {
        _attachedLinks.add(`${fact}`);
      } else {
        const links = Object.values(fact).filter((e) => isLink(e));
        for (const link5 of links) {
          _attachedLinks.add(`${link5}`);
        }
      }
    }
    return _attachedLinks;
  }
  get version() {
    return this.data.version;
  }
  get signature() {
    return this.data.signature;
  }
  get cid() {
    return this.root.cid;
  }
  link() {
    return this.root.cid;
  }
  get asCID() {
    return this.cid;
  }
  get bytes() {
    return this.root.bytes;
  }
  get data() {
    const data = decode23(this.root);
    Object.defineProperties(this, { data: { value: data, enumerable: false } });
    return data;
  }
  /**
   * Attach a block to the delegation DAG so it would be included in the
   * block iterator.
   * ⚠️ You can only attach blocks that are referenced from the `capabilities`
   * or `facts`.
   *
   * @param {API.Block} block
   */
  attach(block) {
    if (!this.attachedLinks.has(`${block.cid.link()}`)) {
      throw new Error(`given block with ${block.cid} is not an attached link`);
    }
    this.blocks.set(`${block.cid}`, block);
  }
  export() {
    return exportDAG(this.root, this.blocks, this.attachedLinks);
  }
  /**
   * @returns {API.Await<API.Result<Uint8Array, Error>>}
   */
  archive() {
    return archive(this);
  }
  iterateIPLDBlocks() {
    return exportDAG(this.root, this.blocks, this.attachedLinks);
  }
  /**
   * @type {API.Proof[]}
   */
  get proofs() {
    return proofs(this);
  }
  /**
   * @type {API.Principal}
   */
  get issuer() {
    return this.data.issuer;
  }
  /**
   * @type {API.Principal}
   */
  get audience() {
    return this.data.audience;
  }
  /**
   * @returns {C}
   */
  get capabilities() {
    return (
      /** @type {C} */
      this.data.capabilities
    );
  }
  /**
   * @returns {number}
   */
  get expiration() {
    return this.data.expiration;
  }
  /**
   * @returns {undefined|number}
   */
  get notBefore() {
    return this.data.notBefore;
  }
  /**
   * @returns {undefined|string}
   */
  get nonce() {
    return this.data.nonce;
  }
  /**
   * @returns {API.Fact[]}
   */
  get facts() {
    return this.data.facts;
  }
  /**
   * Iterate over the proofs
   *
   * @returns {IterableIterator<API.Delegation>}
   */
  iterate() {
    return it(this);
  }
  delegate() {
    return this;
  }
  buildIPLDView() {
    return this;
  }
  /**
   * @returns {API.DelegationJSON<this>}
   */
  toJSON() {
    return (
      /** @type {any} */
      {
        ...this.data.toJSON(),
        "/": this.cid.toString(),
        prf: this.proofs.map(
          (proof) => isDelegation(proof) ? proof : { "/": proof.toString() }
        )
      }
    );
  }
};
var archive = async (delegation) => {
  try {
    const store2 = /* @__PURE__ */ new Map();
    for (const block of delegation.iterateIPLDBlocks()) {
      store2.set(`${block.cid}`, block);
    }
    const variant2 = await write2({
      [`ucan@${delegation.version}`]: delegation.root.cid
    });
    store2.set(`${variant2.cid}`, variant2);
    const bytes2 = encode20({
      roots: [variant2],
      blocks: store2
    });
    return ok(bytes2);
  } catch (cause) {
    return error(
      /** @type {Error} */
      cause
    );
  }
};
var ArchiveSchema = variant({
  "ucan@0.9.1": (
    /** @type {Schema.Schema<API.UCANLink>} */
    match2({ version: 1 })
  )
});
var extract = async (archive2) => {
  try {
    const { roots, blocks } = decode22(archive2);
    const [root] = roots;
    if (root == null) {
      return error2("CAR archive does not contain a root block");
    }
    const { bytes: bytes2 } = root;
    const variant2 = decode16(bytes2);
    const [, link5] = ArchiveSchema.match(variant2);
    return ok(view2({ root: link5, blocks }));
  } catch (cause) {
    return error(
      /** @type {Error} */
      cause
    );
  }
};
var it = function* (delegation) {
  for (const proof of delegation.proofs) {
    if (isDelegation(proof)) {
      yield* it(proof);
      yield proof;
    }
  }
};
var decodeCache = /* @__PURE__ */ new WeakMap();
var decode23 = ({ bytes: bytes2 }) => {
  const data = decodeCache.get(bytes2);
  if (!data) {
    const data2 = decode21(bytes2);
    decodeCache.set(bytes2, data2);
    return data2;
  }
  return data;
};
var delegate = async ({ issuer, audience, proofs: proofs2 = [], attachedBlocks = /* @__PURE__ */ new Map(), ...input }, options) => {
  const links = [];
  const blocks = /* @__PURE__ */ new Map();
  for (const proof of proofs2) {
    if (!isDelegation(proof)) {
      links.push(proof);
    } else {
      links.push(proof.cid);
      for (const block of proof.export()) {
        blocks.set(block.cid.toString(), block);
      }
    }
  }
  const data = await issue({
    ...input,
    issuer,
    audience,
    proofs: links
  });
  const { cid, bytes: bytes2 } = await write(data, options);
  decodeCache.set(cid, data);
  const delegation = new Delegation({ cid, bytes: bytes2 }, blocks);
  Object.defineProperties(delegation, { proofs: { value: proofs2 } });
  for (const block of attachedBlocks.values()) {
    delegation.attach(block);
  }
  return delegation;
};
var exportDAG = function* (root, blocks, attachedLinks) {
  for (const link5 of decode23(root).proofs) {
    const root2 = (
      /** @type {UCAN.Block} */
      blocks.get(`${link5}`)
    );
    if (root2) {
      yield* exportSubDAG(root2, blocks);
    }
  }
  for (const link5 of attachedLinks.values()) {
    const block = blocks.get(link5);
    if (block) {
      yield block;
    }
  }
  yield root;
};
var exportSubDAG = function* (root, blocks) {
  for (const link5 of decode23(root).proofs) {
    const root2 = (
      /** @type {UCAN.Block} */
      blocks.get(`${link5}`)
    );
    if (root2) {
      yield* exportSubDAG(root2, blocks);
    }
  }
  yield root;
};
var importDAG = (dag) => {
  let entries2 = [];
  for (const block of dag) {
    entries2.push([block.cid.toString(), block]);
  }
  const last = entries2.pop();
  if (!last) {
    throw new RangeError("Empty DAG can not be turned into a delegation");
  } else {
    const [, root] = last;
    return new Delegation(
      /** @type {API.UCANBlock<C>} */
      root,
      new Map(entries2)
    );
  }
};
var create5 = ({ root, blocks }) => new Delegation(root, blocks);
var view2 = ({ root, blocks }, fallback) => {
  const block = get(root, blocks, null);
  if (block == null) {
    return fallback !== void 0 ? fallback : notFound(root);
  }
  return create5({ root: block, blocks });
};
var proofs = (delegation) => {
  const proofs2 = [];
  const { root, blocks } = delegation;
  for (const link5 of decode23(root).proofs) {
    const root2 = (
      /** @type {UCAN.Block} */
      blocks.get(link5.toString())
    );
    proofs2.push(root2 ? create5({ root: root2, blocks }) : link5);
  }
  Object.defineProperty(delegation, "proofs", { value: proofs2 });
  return proofs2;
};
function getLinksFromObject(obj) {
  const links = [];
  function recurse(obj2) {
    for (const key in obj2) {
      const value = obj2[key];
      if (isLink(value)) {
        links.push(value);
      } else if (value && typeof value === "object") {
        recurse(value);
      }
    }
  }
  recurse(obj);
  return links;
}

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/invocation.js
var invocation_exports = {};
__export(invocation_exports, {
  Invocation: () => Invocation,
  create: () => create6,
  invoke: () => invoke,
  isInvocation: () => isInvocation,
  view: () => view3
});
var isInvocation = (value) => isDelegation(value);
var invoke = (options) => new IssuedInvocation(options);
var create6 = ({ root, blocks }) => new Invocation(root, blocks);
var view3 = ({ root, blocks }, fallback) => {
  const block = get(root, blocks, null);
  if (block == null) {
    return fallback !== void 0 ? fallback : notFound(root);
  }
  return (
    /** @type {API.Invocation<C>} */
    create6({ root: block, blocks })
  );
};
var IssuedInvocation = class {
  /**
   * @param {API.InvocationOptions<Capability>} data
   */
  constructor({
    issuer,
    audience,
    capability: capability2,
    proofs: proofs2 = [],
    expiration,
    lifetimeInSeconds,
    notBefore,
    nonce,
    facts = []
  }) {
    this.issuer = issuer;
    this.audience = audience;
    this.proofs = proofs2;
    this.capabilities = [capability2];
    this.expiration = expiration;
    this.lifetimeInSeconds = lifetimeInSeconds;
    this.notBefore = notBefore;
    this.nonce = nonce;
    this.facts = facts;
    this.attachedBlocks = /* @__PURE__ */ new Map();
  }
  /**
   * @param {API.Block} block
   */
  attach(block) {
    this.attachedBlocks.set(`${block.cid}`, block);
  }
  delegate() {
    return delegate(this);
  }
  buildIPLDView() {
    return delegate(this);
  }
  /**
   * @template {API.InvocationService<Capability>} Service
   * @param {API.ConnectionView<Service>} connection
   * @returns {Promise<API.InferReceipt<Capability, Service>>}
   */
  async execute(connection) {
    const invocation = this;
    const [result] = await connection.execute(invocation);
    return result;
  }
};
var Invocation = class extends Delegation {
};

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/message.js
var message_exports = {};
__export(message_exports, {
  MessageSchema: () => MessageSchema,
  build: () => build,
  view: () => view5
});

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/receipt.js
var receipt_exports = {};
__export(receipt_exports, {
  issue: () => issue2,
  view: () => view4
});
var view4 = ({ root, blocks }, fallback) => {
  const block = get(root, blocks, null);
  if (block == null) {
    return fallback !== void 0 ? fallback : notFound(root);
  }
  const data = decode16(block.bytes);
  return new Receipt({ root: { ...block, data }, store: blocks });
};
var Receipt = class {
  /**
   * @param {object} input
   * @param {Required<API.Block<API.ReceiptModel<Ok, Error, Ran>>>} input.root
   * @param {DAG.BlockStore} input.store
   * @param {API.Meta} [input.meta]
   * @param {Ran|ReturnType<Ran['link']>} [input.ran]
   * @param {API.EffectsModel} [input.fx]
   * @param {API.SignatureView<API.OutcomeModel<Ok, Error, Ran>, SigAlg>} [input.signature]
   * @param {API.UCAN.Principal} [input.issuer]
   * @param {API.Proof[]} [input.proofs]
   */
  constructor({ root, store: store2, ran, issuer, signature, proofs: proofs2 }) {
    this.store = store2;
    this.root = root;
    this._ran = ran;
    this._fx = void 0;
    this._signature = signature;
    this._proofs = proofs2;
    this._issuer = issuer;
  }
  /**
   * @returns {Ran|ReturnType<Ran['link']>}
   */
  get ran() {
    const ran = this._ran;
    if (!ran) {
      const ran2 = (
        /** @type {Ran} */
        view3(
          {
            root: this.root.data.ocm.ran,
            blocks: this.store
          },
          this.root.data.ocm.ran
        )
      );
      this._ran = ran2;
      return ran2;
    } else {
      return ran;
    }
  }
  get proofs() {
    const proofs2 = this._proofs;
    if (proofs2) {
      return proofs2;
    } else {
      const { store: store2, root } = this;
      const { prf } = root.data.ocm;
      const proofs3 = [];
      if (prf) {
        for (const link5 of prf) {
          const proof = view2({ root: link5, blocks: store2 }, link5);
          proofs3.push(proof);
        }
      }
      this._proofs = proofs3;
      return proofs3;
    }
  }
  link() {
    return this.root.cid;
  }
  get meta() {
    return this.root.data.ocm.meta;
  }
  get issuer() {
    const issuer = this._issuer;
    if (issuer) {
      return issuer;
    } else {
      const { iss } = this.root.data.ocm;
      if (iss) {
        const issuer2 = parse(iss);
        this._issuer = issuer2;
        return issuer2;
      }
    }
  }
  get out() {
    return this.root.data.ocm.out;
  }
  get fx() {
    let fx = this._fx;
    if (!fx) {
      const { store: blocks } = this;
      const { fork, join: join3 } = this.root.data.ocm.fx;
      fx = {
        fork: fork.map((root) => view3({ root, blocks }, root))
      };
      if (join3) {
        fx.join = view3({ root: join3, blocks }, join3);
      }
      this._fx = fx;
    }
    return fx;
  }
  get signature() {
    const signature = this._signature;
    if (signature) {
      return signature;
    } else {
      const signature2 = (
        /** @type {API.SignatureView<API.OutcomeModel<Ok, Error, Ran>, SigAlg>} */
        view(this.root.data.sig)
      );
      this._signature = signature2;
      return signature2;
    }
  }
  /**
   * @param {API.Crypto.Verifier} signingPrincipal
   */
  verifySignature(signingPrincipal) {
    return this.signature.verify(
      signingPrincipal,
      encode19(this.root.data.ocm)
    );
  }
  buildIPLDView() {
    return this;
  }
  *iterateIPLDBlocks() {
    const { ran, fx, proofs: proofs2, root } = this;
    yield* iterate(ran);
    for (const fork of fx.fork) {
      yield* iterate(fork);
    }
    if (fx.join) {
      yield* iterate(fx.join);
    }
    for (const proof of proofs2) {
      yield* iterate(proof);
    }
    yield root;
  }
};
var ReceptBuilder = class {
  /**
   * @param {object} options
   * @param {API.Signer<API.DID, SigAlg>} options.issuer
   * @param {Ran|ReturnType<Ran['link']>} options.ran
   * @param {API.Result<Ok, Error>} options.result
   * @param {API.Effects} [options.fx]
   * @param {API.Proof[]} [options.proofs]
   * @param {Record<string, unknown>} [options.meta]
   */
  constructor({ issuer, result, ran, fx = NOFX, proofs: proofs2 = [], meta = {} }) {
    this.issuer = issuer;
    this.result = result;
    this.ran = ran;
    this.fx = fx;
    this.proofs = proofs2;
    this.meta = meta;
  }
  async buildIPLDView({ hasher = sha256, codec = cbor_exports2 } = {}) {
    const store2 = createStore();
    addEveryInto(iterate(this.ran), store2);
    const prf = [];
    for (const proof of this.proofs) {
      addEveryInto(iterate(proof), store2);
      prf.push(proof.link());
    }
    const fx = { fork: [] };
    for (const fork of this.fx.fork) {
      addEveryInto(iterate(fork), store2);
      fx.fork.push(fork.link());
    }
    if (this.fx.join) {
      addEveryInto(iterate(this.fx.join), store2);
      fx.join = this.fx.join.link();
    }
    const outcome = {
      ran: (
        /** @type {ReturnType<Ran['link']>} */
        this.ran.link()
      ),
      out: this.result,
      fx,
      meta: this.meta,
      iss: this.issuer.did(),
      prf
    };
    const signature = await this.issuer.sign(encode19(outcome));
    const model = {
      ocm: outcome,
      sig: signature
    };
    const root = await writeInto(model, store2, {
      hasher,
      codec
    });
    return new Receipt({
      root,
      store: store2,
      signature,
      proofs: this.proofs,
      ran: this.ran
    });
  }
};
var NOFX = Object.freeze({ fork: Object.freeze([]) });
var issue2 = (options) => new ReceptBuilder(options).buildIPLDView();

// node_modules/.pnpm/@ucanto+core@10.4.0/node_modules/@ucanto/core/src/message.js
var MessageSchema = variant({
  "ucanto/message@7.0.0": struct({
    execute: match2().array().optional(),
    delegate: dictionary({
      key: string(),
      value: (
        /** @type {API.Reader<API.Link<API.ReceiptModel>>} */
        match2()
      )
    }).array().optional()
  })
});
var build = ({ invocations, receipts }) => new MessageBuilder({ invocations, receipts }).buildIPLDView();
var view5 = ({ root, store: store2 }, fallback) => {
  const block = get(root, store2, null);
  if (block === null) {
    return fallback !== void 0 ? fallback : notFound(root);
  }
  const data = cbor_exports2.decode(block.bytes);
  const [branch, value] = MessageSchema.match(data, fallback);
  switch (branch) {
    case "ucanto/message@7.0.0":
      return new Message({ root: { ...block, data }, store: store2 });
    default:
      return value;
  }
};
var MessageBuilder = class {
  /**
   * @param {object} source
   * @param {I} [source.invocations]
   * @param {R} [source.receipts]
   */
  constructor({ invocations, receipts }) {
    this.invocations = invocations;
    this.receipts = receipts;
  }
  /**
   *
   * @param {API.BuildOptions} [options]
   * @returns {Promise<Message<{ In: API.InferInvocations<I>, Out: R }>>}
   */
  async buildIPLDView(options) {
    const store2 = /* @__PURE__ */ new Map();
    const { invocations, ...executeField } = await writeInvocations(
      this.invocations || [],
      store2
    );
    const { receipts, ...receiptsField } = await writeReceipts(
      this.receipts || [],
      store2
    );
    const root = await writeInto(
      /** @type {API.AgentMessageModel<{ In: API.InferInvocations<I>, Out: R }>} */
      {
        "ucanto/message@7.0.0": {
          ...executeField,
          ...receiptsField
        }
      },
      store2,
      options
    );
    return new Message({ root, store: store2 }, { receipts, invocations });
  }
};
var writeInvocations = async (run2, store2) => {
  const invocations = [];
  const execute2 = [];
  for (const invocation of run2) {
    const view6 = await invocation.buildIPLDView();
    execute2.push(view6.link());
    invocations.push(view6);
    for (const block of view6.iterateIPLDBlocks()) {
      store2.set(`${block.cid}`, block);
    }
  }
  return { invocations, ...execute2.length > 0 ? { execute: execute2 } : {} };
};
var writeReceipts = async (source, store2) => {
  if (source.length === 0) {
    return {};
  }
  const receipts = /* @__PURE__ */ new Map();
  const report = {};
  for (const [n, receipt] of source.entries()) {
    const view6 = await receipt.buildIPLDView();
    for (const block of view6.iterateIPLDBlocks()) {
      store2.set(`${block.cid}`, block);
    }
    const key = `${view6.ran.link()}`;
    if (!(key in report)) {
      report[key] = view6.root.cid;
      receipts.set(key, view6);
    } else {
      receipts.set(`${key}@${n}`, view6);
    }
  }
  return { receipts, report };
};
var Message = class {
  /**
   * @param {object} source
   * @param {Required<API.Block<API.AgentMessageModel<T>>>} source.root
   * @param {DAG.BlockStore} source.store
   * @param {object} build
   * @param {API.Invocation[]} [build.invocations]
   * @param {Map<string, API.Receipt>} [build.receipts]
   */
  constructor({ root, store: store2 }, { invocations, receipts } = {}) {
    this.root = root;
    this.store = store2;
    this._invocations = invocations;
    this._receipts = receipts;
  }
  *iterateIPLDBlocks() {
    for (const invocation of this.invocations) {
      yield* invocation.iterateIPLDBlocks();
    }
    for (const receipt of this.receipts.values()) {
      yield* receipt.iterateIPLDBlocks();
    }
    yield this.root;
  }
  /**
   * @template [E=never]
   * @param {API.Link} link
   * @param {E} [fallback]
   * @returns {API.Receipt|E}
   */
  get(link5, fallback) {
    const receipts = this.root.data["ucanto/message@7.0.0"].report || {};
    const receipt = receipts[`${link5}`];
    if (receipt) {
      return view4({ root: receipt, blocks: this.store });
    } else {
      return fallback !== void 0 ? fallback : panic(`Message does not include receipt for ${link5}`);
    }
  }
  get invocationLinks() {
    return this.root.data["ucanto/message@7.0.0"].execute || [];
  }
  get invocations() {
    let invocations = this._invocations;
    if (!invocations) {
      invocations = this.invocationLinks.map((link5) => {
        return invocation_exports.view({ root: link5, blocks: this.store });
      });
    }
    return invocations;
  }
  get receipts() {
    let receipts = this._receipts;
    if (!receipts) {
      receipts = /* @__PURE__ */ new Map();
      const report = this.root.data["ucanto/message@7.0.0"].report || {};
      for (const [key, link5] of Object.entries(report)) {
        const receipt = view4({ root: link5, blocks: this.store });
        receipts.set(`${receipt.ran.link()}`, receipt);
      }
    }
    return receipts;
  }
};

// node_modules/.pnpm/@ucanto+validator@9.1.0/node_modules/@ucanto/validator/src/util.js
var the = (value) => value;
var entries = (object) => (
  /** @type {any} */
  Object.entries(object)
);
var combine = ([first, ...rest]) => {
  const results = first.map((value) => [value]);
  for (const values of rest) {
    const tuples = results.splice(0);
    for (const value of values) {
      for (const tuple2 of tuples) {
        results.push([...tuple2, value]);
      }
    }
  }
  return results;
};
var intersection2 = (left, right) => {
  const [result, other] = left.length < right.length ? [new Set(left), new Set(right)] : [new Set(right), new Set(left)];
  for (const item of result) {
    if (!other.has(item)) {
      result.delete(item);
    }
  }
  return [...result];
};

// node_modules/.pnpm/@ucanto+validator@9.1.0/node_modules/@ucanto/validator/src/error.js
var EscalatedCapability = class extends Failure {
  /**
   * @param {API.ParsedCapability} claimed
   * @param {object} delegated
   * @param {API.Failure} cause
   */
  constructor(claimed, delegated, cause) {
    super();
    this.claimed = claimed;
    this.delegated = delegated;
    this.cause = cause;
    this.name = the("EscalatedCapability");
  }
  describe() {
    return `Constraint violation: ${this.cause.message}`;
  }
};
var DelegationError = class extends Failure {
  /**
   * @param {(API.InvalidCapability | API.EscalatedDelegation | API.DelegationError)[]} causes
   * @param {object} context
   */
  constructor(causes, context) {
    super();
    this.name = the("InvalidClaim");
    this.causes = causes;
    this.context = context;
  }
  describe() {
    return [
      `Can not derive ${this.context} from delegated capabilities:`,
      ...this.causes.map((cause) => li2(cause.message))
    ].join("\n");
  }
  /**
   * @type {API.InvalidCapability | API.EscalatedDelegation | API.DelegationError}
   */
  get cause() {
    if (this.causes.length !== 1) {
      return this;
    } else {
      const [cause] = this.causes;
      const value = cause.name === "InvalidClaim" ? cause.cause : cause;
      Object.defineProperties(this, { cause: { value } });
      return value;
    }
  }
};
var SessionEscalation = class extends Failure {
  /**
   * @param {object} source
   * @param {API.Delegation} source.delegation
   * @param {API.Failure} source.cause
   */
  constructor({ delegation, cause }) {
    super();
    this.name = the("SessionEscalation");
    this.delegation = delegation;
    this.cause = cause;
  }
  describe() {
    const issuer = this.delegation.issuer.did();
    return [
      `Delegation ${this.delegation.cid} issued by ${issuer} has an invalid session`,
      li2(this.cause.message)
    ].join("\n");
  }
};
var InvalidSignature = class extends Failure {
  /**
   * @param {API.Delegation} delegation
   * @param {API.Verifier} verifier
   */
  constructor(delegation, verifier) {
    super();
    this.name = the("InvalidSignature");
    this.delegation = delegation;
    this.verifier = verifier;
  }
  get issuer() {
    return this.delegation.issuer;
  }
  get audience() {
    return this.delegation.audience;
  }
  get key() {
    return this.verifier.toDIDKey();
  }
  describe() {
    const issuer = this.issuer.did();
    const key = this.key;
    return (issuer.startsWith("did:key") ? [
      `Proof ${this.delegation.cid} does not has a valid signature from ${key}`
    ] : [
      `Proof ${this.delegation.cid} issued by ${issuer} does not has a valid signature from ${key}`,
      `  \u2139\uFE0F Probably issuer signed with a different key, which got rotated, invalidating delegations that were issued with prior keys`
    ]).join("\n");
  }
};
var UnavailableProof = class extends Failure {
  /**
   * @param {API.UCAN.Link} link
   * @param {Error} [cause]
   */
  constructor(link5, cause) {
    super();
    this.name = the("UnavailableProof");
    this.link = link5;
    this.cause = cause;
  }
  describe() {
    return [
      `Linked proof '${this.link}' is not included and could not be resolved`,
      ...this.cause ? [li2(`Proof resolution failed with: ${this.cause.message}`)] : []
    ].join("\n");
  }
};
var DIDKeyResolutionError = class extends Failure {
  /**
   * @param {API.UCAN.DID} did
   * @param {API.Failure} [cause]
   */
  constructor(did2, cause) {
    super();
    this.name = the("DIDKeyResolutionError");
    this.did = did2;
    this.cause = cause;
  }
  describe() {
    return `Unable to resolve '${this.did}' key`;
  }
};
var PrincipalAlignmentError = class extends Failure {
  /**
   * @param {API.UCAN.Principal} audience
   * @param {API.Delegation} delegation
   */
  constructor(audience, delegation) {
    super();
    this.name = the("InvalidAudience");
    this.audience = audience;
    this.delegation = delegation;
  }
  describe() {
    return `Delegation audience is '${this.delegation.audience.did()}' instead of '${this.audience.did()}'`;
  }
  toJSON() {
    const { name: name8, audience, message, stack } = this;
    return {
      name: name8,
      audience: audience.did(),
      delegation: { audience: this.delegation.audience.did() },
      message,
      stack
    };
  }
};
var MalformedCapability = class extends Failure {
  /**
   * @param {API.Capability} capability
   * @param {API.Failure} cause
   */
  constructor(capability2, cause) {
    super();
    this.name = the("MalformedCapability");
    this.capability = capability2;
    this.cause = cause;
  }
  describe() {
    return [
      `Encountered malformed '${this.capability.can}' capability: ${format8(
        this.capability
      )}`,
      li2(this.cause.message)
    ].join("\n");
  }
};
var UnknownCapability = class extends Failure {
  /**
   * @param {API.Capability} capability
   */
  constructor(capability2) {
    super();
    this.name = the("UnknownCapability");
    this.capability = capability2;
  }
  /* c8 ignore next 3 */
  describe() {
    return `Encountered unknown capability: ${format8(this.capability)}`;
  }
};
var Expired = class extends Failure {
  /**
   * @param {API.Delegation & { expiration: number }} delegation
   */
  constructor(delegation) {
    super();
    this.name = the("Expired");
    this.delegation = delegation;
  }
  describe() {
    return `Proof ${this.delegation.cid} has expired on ${new Date(
      this.delegation.expiration * 1e3
    )}`;
  }
  get expiredAt() {
    return this.delegation.expiration;
  }
  toJSON() {
    const { name: name8, expiredAt, message, stack } = this;
    return {
      name: name8,
      message,
      expiredAt,
      stack
    };
  }
};
var NotValidBefore = class extends Failure {
  /**
   * @param {API.Delegation & { notBefore: number }} delegation
   */
  constructor(delegation) {
    super();
    this.name = the("NotValidBefore");
    this.delegation = delegation;
  }
  describe() {
    return `Proof ${this.delegation.cid} is not valid before ${new Date(
      this.delegation.notBefore * 1e3
    )}`;
  }
  get validAt() {
    return this.delegation.notBefore;
  }
  toJSON() {
    const { name: name8, validAt, message, stack } = this;
    return {
      name: name8,
      message,
      validAt,
      stack
    };
  }
};
var Unauthorized = class extends Failure {
  /**
   * @param {{
   * capability: API.CapabilityParser
   * delegationErrors: API.DelegationError[]
   * unknownCapabilities: API.Capability[]
   * invalidProofs: API.InvalidProof[]
   * failedProofs: API.InvalidClaim[]
   * }} cause
   */
  constructor({
    capability: capability2,
    delegationErrors,
    unknownCapabilities,
    invalidProofs,
    failedProofs
  }) {
    super();
    this.name = /** @type {const} */
    "Unauthorized";
    this.capability = capability2;
    this.delegationErrors = delegationErrors;
    this.unknownCapabilities = unknownCapabilities;
    this.invalidProofs = invalidProofs;
    this.failedProofs = failedProofs;
  }
  describe() {
    const errors = [
      ...this.failedProofs.map((error4) => li2(error4.message)),
      ...this.delegationErrors.map((error4) => li2(error4.message)),
      ...this.invalidProofs.map((error4) => li2(error4.message))
    ];
    const unknown2 = this.unknownCapabilities.map((c) => li2(JSON.stringify(c)));
    return [
      `Claim ${this.capability} is not authorized`,
      ...errors.length > 0 ? errors : [li2(`No matching delegated capability found`)],
      ...unknown2.length > 0 ? [li2(`Encountered unknown capabilities
${unknown2.join("\n")}`)] : []
    ].join("\n");
  }
};
var format8 = (capability2, space2) => JSON.stringify(
  capability2,
  (_key, value) => {
    if (isLink(value)) {
      return value.toString();
    } else {
      return value;
    }
  },
  space2
);
var indent2 = (message, indent3 = "  ") => `${indent3}${message.split("\n").join(`
${indent3}`)}`;
var li2 = (message) => indent2(`- ${message}`);

// node_modules/.pnpm/@ucanto+validator@9.1.0/node_modules/@ucanto/validator/src/capability.js
var capability = ({
  derives = defaultDerives,
  nb = defaultNBSchema,
  ...etc
}) => new Capability({ derives, nb, ...etc });
var defaultNBSchema = (
  /** @type {Schema.MapRepresentation<any>} */
  schema_exports3.struct({})
);
var or8 = (left, right) => new Or(left, right);
var and2 = (...selectors) => new And(selectors);
var derive2 = ({ from: from11, to, derives }) => new Derive(from11, to, derives);
var View2 = class {
  /**
   * @param {API.Source} source
   * @returns {API.MatchResult<M>}
   */
  /* c8 ignore next 3 */
  match(source) {
    return { error: new UnknownCapability(source.capability) };
  }
  /**
   * @param {API.Source[]} capabilities
   * @returns {API.Select<M>}
   */
  select(capabilities) {
    return select(this, capabilities);
  }
  /**
   * @template {API.ParsedCapability} U
   * @param {object} source
   * @param {API.TheCapabilityParser<API.DirectMatch<U>>} source.to
   * @param {API.Derives<U, API.InferDeriveProof<M['value']>>} source.derives
   * @returns {API.TheCapabilityParser<API.DerivedMatch<U, M>>}
   */
  derive({ derives, to }) {
    return derive2({ derives, to, from: this });
  }
};
var Unit = class extends View2 {
  /**
   * @template {API.Match} W
   * @param {API.MatchSelector<W>} other
   * @returns {API.CapabilityParser<M | W>}
   */
  or(other) {
    return or8(this, other);
  }
  /**
   * @template {API.Match} W
   * @param {API.CapabilityParser<W>} other
   * @returns {API.CapabilitiesParser<[M, W]>}
   */
  and(other) {
    return and2(
      /** @type {API.CapabilityParser<M>} */
      this,
      other
    );
  }
};
var Capability = class extends Unit {
  /**
   * @param {Required<Descriptor<A, R, C>>} descriptor
   */
  constructor(descriptor) {
    super();
    this.descriptor = descriptor;
    this.schema = schema_exports3.struct({
      can: schema_exports3.literal(descriptor.can),
      with: descriptor.with,
      nb: descriptor.nb
    });
  }
  /**
   * @param {API.InferCreateOptions<R, C>} options
   */
  create(options) {
    const { descriptor, can } = this;
    const decoders = descriptor.nb;
    const data = (
      /** @type {C} */
      options.nb || {}
    );
    const resource = descriptor.with.read(options.with);
    if (resource.error) {
      throw Object.assign(
        new Error(`Invalid 'with' - ${resource.error.message}`),
        {
          cause: resource
        }
      );
    }
    const nb = descriptor.nb.read(data);
    if (nb.error) {
      throw Object.assign(new Error(`Invalid 'nb' - ${nb.error.message}`), {
        cause: nb
      });
    }
    return createCapability({ can, with: resource.ok, nb: nb.ok });
  }
  /**
   * @param {API.InferInvokeOptions<R, C>} options
   */
  invoke({ with: with_, nb, ...options }) {
    return invoke({
      ...options,
      capability: this.create(
        /** @type {API.InferCreateOptions<R, C>} */
        { with: with_, nb }
      )
    });
  }
  /**
   * @param {API.InferDelegationOptions<R, C>} options
   * @returns {Promise<API.Delegation<[API.InferDelegatedCapability<API.ParsedCapability<A, R, C>>]>>}
   */
  async delegate({ nb: input = {}, with: with_, ...options }) {
    const { descriptor, can } = this;
    const readers = descriptor.nb;
    const resource = descriptor.with.read(with_);
    if (resource.error) {
      throw Object.assign(
        new Error(`Invalid 'with' - ${resource.error.message}`),
        {
          cause: resource
        }
      );
    }
    const nb = descriptor.nb.partial().read(input);
    if (nb.error) {
      throw Object.assign(new Error(`Invalid 'nb' - ${nb.error.message}`), {
        cause: nb
      });
    }
    return delegate({
      capabilities: [createCapability({ can, with: resource.ok, nb: nb.ok })],
      ...options
    });
  }
  get can() {
    return this.descriptor.can;
  }
  /**
   * @param {API.Source} source
   * @returns {API.MatchResult<API.DirectMatch<API.ParsedCapability<A, R, C>>>}
   */
  match(source) {
    const result = parseCapability(this.descriptor, source);
    return result.error ? result : { ok: new Match2(source, result.ok, this.descriptor) };
  }
  toString() {
    return JSON.stringify({ can: this.descriptor.can });
  }
};
var createCapability = ({ can, with: with_, nb }) => (
  /** @type {API.InferCapability<T>} */
  {
    can,
    with: with_,
    ...isEmpty(nb) ? {} : { nb }
  }
);
var isEmpty = (object) => {
  for (const _ in object) {
    return false;
  }
  return true;
};
var Or = class extends Unit {
  /**
   * @param {API.Matcher<M>} left
   * @param {API.Matcher<W>} right
   */
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  /**
   * @param {API.Source} capability
   * @return {API.MatchResult<M|W>}
   */
  match(capability2) {
    const left = this.left.match(capability2);
    if (left.error) {
      const right = this.right.match(capability2);
      if (right.error) {
        return right.error.name === "MalformedCapability" ? (
          //
          right
        ) : (
          //
          left
        );
      } else {
        return right;
      }
    } else {
      return left;
    }
  }
  toString() {
    return `${this.left.toString()}|${this.right.toString()}`;
  }
};
var And = class _And extends View2 {
  /**
   * @param {Selectors} selectors
   */
  constructor(selectors) {
    super();
    this.selectors = selectors;
  }
  /**
   * @param {API.Source} capability
   * @returns {API.MatchResult<API.Amplify<API.InferMembers<Selectors>>>}
   */
  match(capability2) {
    const group = [];
    for (const selector of this.selectors) {
      const result = selector.match(capability2);
      if (result.error) {
        return result;
      } else {
        group.push(result.ok);
      }
    }
    return {
      ok: new AndMatch(
        /** @type {API.InferMembers<Selectors>} */
        group
      )
    };
  }
  /**
   * @param {API.Source[]} capabilities
   */
  select(capabilities) {
    return selectGroup(this, capabilities);
  }
  /**
   * @template E
   * @template {API.Match} X
   * @param {API.MatchSelector<API.Match<E, X>>} other
   * @returns {API.CapabilitiesParser<[...API.InferMembers<Selectors>, API.Match<E, X>]>}
   */
  and(other) {
    return new _And([...this.selectors, other]);
  }
  toString() {
    return `[${this.selectors.map(String).join(", ")}]`;
  }
};
var Derive = class extends Unit {
  /**
   * @param {API.MatchSelector<M>} from
   * @param {API.TheCapabilityParser<API.DirectMatch<T>>} to
   * @param {API.Derives<T, API.InferDeriveProof<M['value']>>} derives
   */
  constructor(from11, to, derives) {
    super();
    this.from = from11;
    this.to = to;
    this.derives = derives;
  }
  /**
   * @type {typeof this.to['create']}
   */
  create(options) {
    return this.to.create(options);
  }
  /**
   * @type {typeof this.to['invoke']}
   */
  invoke(options) {
    return this.to.invoke(options);
  }
  /**
   * @type {typeof this.to['delegate']}
   */
  delegate(options) {
    return this.to.delegate(options);
  }
  get can() {
    return this.to.can;
  }
  /**
   * @param {API.Source} capability
   * @returns {API.MatchResult<API.DerivedMatch<T, M>>}
   */
  match(capability2) {
    const match6 = this.to.match(capability2);
    if (match6.error) {
      return match6;
    } else {
      return { ok: new DerivedMatch(match6.ok, this.from, this.derives) };
    }
  }
  toString() {
    return this.to.toString();
  }
};
var Match2 = class _Match {
  /**
   * @param {API.Source} source
   * @param {API.ParsedCapability<A, R, C>} value
   * @param {Required<Descriptor<A, R, C>>} descriptor
   */
  constructor(source, value, descriptor) {
    this.source = [source];
    this.value = value;
    this.descriptor = descriptor;
  }
  get can() {
    return this.value.can;
  }
  get proofs() {
    const proofs2 = [this.source[0].delegation];
    Object.defineProperties(this, {
      proofs: { value: proofs2 }
    });
    return proofs2;
  }
  /**
   * @param {API.CanIssue} context
   * @returns {API.DirectMatch<API.ParsedCapability<A, R, C>>|null}
   */
  prune(context) {
    if (context.canIssue(this.value, this.source[0].delegation.issuer.did())) {
      return null;
    } else {
      return this;
    }
  }
  /**
   * @param {API.Source[]} capabilities
   * @returns {API.Select<API.DirectMatch<API.ParsedCapability<A, R, C>>>}
   */
  select(capabilities) {
    const unknown2 = [];
    const errors = [];
    const matches = [];
    for (const capability2 of capabilities) {
      const result = resolveCapability(this.descriptor, this.value, capability2);
      if (result.ok) {
        const claim2 = this.descriptor.derives(this.value, result.ok);
        if (claim2.error) {
          errors.push(
            new DelegationError(
              [new EscalatedCapability(this.value, result.ok, claim2.error)],
              this
            )
          );
        } else {
          matches.push(new _Match(capability2, result.ok, this.descriptor));
        }
      } else {
        switch (result.error.name) {
          case "UnknownCapability":
            unknown2.push(result.error.capability);
            break;
          case "MalformedCapability":
          default:
            errors.push(new DelegationError([result.error], this));
        }
      }
    }
    return { matches, unknown: unknown2, errors };
  }
  toString() {
    const { nb } = this.value;
    return JSON.stringify({
      can: this.descriptor.can,
      with: this.value.with,
      nb: nb && Object.keys(nb).length > 0 ? nb : void 0
    });
  }
};
var DerivedMatch = class _DerivedMatch {
  /**
   * @param {API.DirectMatch<T>} selected
   * @param {API.MatchSelector<M>} from
   * @param {API.Derives<T, API.InferDeriveProof<M['value']>>} derives
   */
  constructor(selected, from11, derives) {
    this.selected = selected;
    this.from = from11;
    this.derives = derives;
  }
  get can() {
    return this.value.can;
  }
  get source() {
    return this.selected.source;
  }
  get proofs() {
    const proofs2 = [];
    for (const { delegation } of this.selected.source) {
      proofs2.push(delegation);
    }
    Object.defineProperties(this, { proofs: { value: proofs2 } });
    return proofs2;
  }
  get value() {
    return this.selected.value;
  }
  /**
   * @param {API.CanIssue} context
   */
  prune(context) {
    const selected = (
      /** @type {API.DirectMatch<T>|null} */
      this.selected.prune(context)
    );
    return selected ? new _DerivedMatch(selected, this.from, this.derives) : null;
  }
  /**
   * @param {API.Source[]} capabilities
   */
  select(capabilities) {
    const { derives, selected, from: from11 } = this;
    const { value } = selected;
    const direct = selected.select(capabilities);
    const derived = from11.select(capabilities);
    const matches = [];
    const errors = [];
    for (const match6 of derived.matches) {
      const result = derives(value, match6.value);
      if (result.error) {
        errors.push(
          new DelegationError(
            [new EscalatedCapability(value, match6.value, result.error)],
            this
          )
        );
      } else {
        matches.push(match6);
      }
    }
    return {
      unknown: intersection2(direct.unknown, derived.unknown),
      errors: [
        ...errors,
        ...direct.errors,
        ...derived.errors.map((error4) => new DelegationError([error4], this))
      ],
      matches: [
        ...direct.matches.map((match6) => new _DerivedMatch(match6, from11, derives)),
        ...matches
      ]
    };
  }
  toString() {
    return this.selected.toString();
  }
};
var AndMatch = class _AndMatch {
  /**
   * @param {API.Match[]} matches
   */
  constructor(matches) {
    this.matches = matches;
  }
  get selectors() {
    return this.matches;
  }
  /**
   * @returns {API.Source[]}
   */
  get source() {
    const source = [];
    for (const match6 of this.matches) {
      source.push(...match6.source);
    }
    Object.defineProperties(this, { source: { value: source } });
    return source;
  }
  /**
   * @param {API.CanIssue} context
   */
  prune(context) {
    const matches = [];
    for (const match6 of this.matches) {
      const pruned = match6.prune(context);
      if (pruned) {
        matches.push(pruned);
      }
    }
    return matches.length === 0 ? null : new _AndMatch(matches);
  }
  get proofs() {
    const proofs2 = [];
    for (const { delegation } of this.source) {
      proofs2.push(delegation);
    }
    Object.defineProperties(this, { proofs: { value: proofs2 } });
    return proofs2;
  }
  /**
   * @type {API.InferValue<API.InferMembers<Selectors>>}
   */
  get value() {
    const value = [];
    for (const match6 of this.matches) {
      value.push(match6.value);
    }
    Object.defineProperties(this, { value: { value } });
    return (
      /** @type {any} */
      value
    );
  }
  /**
   * @param {API.Source[]} capabilities
   */
  select(capabilities) {
    return selectGroup(this, capabilities);
  }
  toString() {
    return `[${this.matches.map((match6) => match6.toString()).join(", ")}]`;
  }
};
var resolveAbility = (pattern, can, fallback) => {
  switch (pattern) {
    case can:
    case "*":
      return can;
    default:
      return pattern.endsWith("/*") && can.startsWith(pattern.slice(0, -1)) ? can : fallback;
  }
};
var resolveResource = (source, uri2, fallback) => {
  switch (source) {
    case uri2:
    case "ucan:*":
      return uri2;
    default:
      return fallback;
  }
};
var parseCapability = (descriptor, source) => {
  const { delegation } = source;
  const capability2 = (
    /** @type {API.Capability<A, R, C>} */
    source.capability
  );
  if (descriptor.can !== capability2.can) {
    return { error: new UnknownCapability(capability2) };
  }
  const uri2 = descriptor.with.read(capability2.with);
  if (uri2.error) {
    return { error: new MalformedCapability(capability2, uri2.error) };
  }
  const nb = descriptor.nb.read(capability2.nb || {});
  if (nb.error) {
    return { error: new MalformedCapability(capability2, nb.error) };
  }
  return { ok: new CapabilityView(descriptor.can, uri2.ok, nb.ok, delegation) };
};
var resolveCapability = (descriptor, claimed, { capability: capability2, delegation }) => {
  const can = resolveAbility(capability2.can, claimed.can, null);
  if (can == null) {
    return { error: new UnknownCapability(capability2) };
  }
  const resource = resolveResource(
    capability2.with,
    claimed.with,
    capability2.with
  );
  const uri2 = descriptor.with.read(resource);
  if (uri2.error) {
    return { error: new MalformedCapability(capability2, uri2.error) };
  }
  const nb = descriptor.nb.read({
    ...claimed.nb,
    ...capability2.nb
  });
  if (nb.error) {
    return { error: new MalformedCapability(capability2, nb.error) };
  }
  return { ok: new CapabilityView(can, uri2.ok, nb.ok, delegation) };
};
var CapabilityView = class {
  /**
   * @param {A} can
   * @param {R} with_
   * @param {C} nb
   * @param {API.Delegation} delegation
   */
  constructor(can, with_, nb, delegation) {
    this.can = can;
    this.with = with_;
    this.delegation = delegation;
    this.nb = nb;
  }
};
var select = (matcher, capabilities) => {
  const unknown2 = [];
  const matches = [];
  const errors = [];
  for (const capability2 of capabilities) {
    const result = matcher.match(capability2);
    if (result.error) {
      switch (result.error.name) {
        case "UnknownCapability":
          unknown2.push(result.error.capability);
          break;
        case "MalformedCapability":
        default:
          errors.push(new DelegationError([result.error], result.error.capability));
      }
    } else {
      matches.push(result.ok);
    }
  }
  return { matches, errors, unknown: unknown2 };
};
var selectGroup = (self2, capabilities) => {
  let unknown2;
  const data = [];
  const errors = [];
  for (const selector of self2.selectors) {
    const selected = selector.select(capabilities);
    unknown2 = unknown2 ? intersection2(unknown2, selected.unknown) : selected.unknown;
    for (const error4 of selected.errors) {
      errors.push(new DelegationError([error4], self2));
    }
    data.push(selected.matches);
  }
  const matches = combine(data).map((group) => new AndMatch(group));
  return {
    unknown: (
      /* c8 ignore next */
      unknown2 || []
    ),
    errors,
    matches
  };
};
var defaultDerives = (claimed, delegated) => {
  if (delegated.with.endsWith("*")) {
    if (!claimed.with.startsWith(delegated.with.slice(0, -1))) {
      return schema_exports3.error(
        `Resource ${claimed.with} does not match delegated ${delegated.with} `
      );
    }
  } else if (delegated.with !== claimed.with) {
    return schema_exports3.error(
      `Resource ${claimed.with} is not contained by ${delegated.with}`
    );
  }
  const caveats = delegated.nb || {};
  const nb = claimed.nb || {};
  const kv = entries(caveats);
  for (const [name8, value] of kv) {
    if (nb[name8] != value) {
      return schema_exports3.error(`${String(name8)}: ${nb[name8]} violates ${value}`);
    }
  }
  return { ok: true };
};

// node_modules/.pnpm/@ucanto+validator@9.1.0/node_modules/@ucanto/validator/src/authorization.js
var Authorization = class {
  /**
   * @param {API.Match<C>} match
   * @param {API.Authorization<API.ParsedCapability>[]} proofs
   */
  constructor(match6, proofs2) {
    this.match = match6;
    this.proofs = proofs2;
  }
  get capability() {
    return this.match.value;
  }
  get delegation() {
    return this.match.source[0].delegation;
  }
  get issuer() {
    return this.delegation.issuer;
  }
  get audience() {
    return this.delegation.audience;
  }
};
var create7 = (match6, proofs2 = []) => new Authorization(match6, proofs2);

// node_modules/.pnpm/@ucanto+validator@9.1.0/node_modules/@ucanto/validator/src/lib.js
var unavailable = (proof) => ({ error: new UnavailableProof(proof) });
var failDIDKeyResolution = (did2) => ({ error: new DIDKeyResolutionError(did2) });
var resolveMatch = async (match6, config) => {
  const promises = [];
  const includes = /* @__PURE__ */ new Set();
  for (const source of match6.source) {
    const id = source.delegation.cid.toString();
    if (!includes.has(id)) {
      promises.push(await resolveSources(source, config));
    }
  }
  const groups = await Promise.all(promises);
  const sources = [];
  const errors = [];
  for (const group of groups) {
    sources.push(...group.sources);
    errors.push(...group.errors);
  }
  return { sources, errors };
};
var resolveProofs = async (proofs2, config) => {
  const delegations = [];
  const errors = [];
  const promises = [];
  for (const proof of proofs2) {
    if (isDelegation(proof)) {
      delegations.push(proof);
    } else {
      promises.push(
        new Promise(async (resolve2) => {
          try {
            const result = await config.resolve(proof);
            if (result.error) {
              errors.push(result.error);
            } else {
              delegations.push(result.ok);
            }
          } catch (error4) {
            errors.push(
              new UnavailableProof(
                proof,
                /** @type {Error} */
                error4
              )
            );
          }
          resolve2(null);
        })
      );
    }
  }
  await Promise.all(promises);
  return { delegations, errors };
};
var resolveSources = async ({ delegation }, config) => {
  const errors = [];
  const sources = [];
  const proofs2 = [];
  const { delegations, errors: failedProofs } = await resolveProofs(
    delegation.proofs,
    config
  );
  for (const error4 of failedProofs) {
    errors.push(new ProofError(error4.link, error4));
  }
  for (const proof of delegations) {
    if (delegation.issuer.did() !== proof.audience.did()) {
      errors.push(
        new ProofError(
          proof.cid,
          new PrincipalAlignmentError(delegation.issuer, proof)
        )
      );
    } else {
      proofs2.push(proof);
    }
  }
  for (const proof of proofs2) {
    const validation = await validate(proof, proofs2, config);
    if (validation.error) {
      errors.push(new ProofError(proof.cid, validation.error));
    } else {
      for (const capability2 of proof.capabilities) {
        sources.push(
          /** @type {API.Source} */
          {
            capability: capability2,
            delegation: proof
          }
        );
      }
    }
  }
  return { sources, errors };
};
var isSelfIssued = (capability2, issuer) => capability2.with === issuer;
var access = async (invocation, { capability: capability2, ...config }) => claim(capability2, [invocation], config);
var claim = async (capability2, proofs2, {
  authority,
  principal: principal2,
  validateAuthorization,
  resolveDIDKey: resolveDIDKey2 = failDIDKeyResolution,
  canIssue = isSelfIssued,
  resolve: resolve2 = unavailable,
  proofs: localProofs = []
}) => {
  const config = {
    canIssue,
    resolve: resolve2,
    principal: principal2,
    capability: capability2,
    authority,
    validateAuthorization,
    resolveDIDKey: resolveDIDKey2,
    proofs: localProofs
  };
  const invalidProofs = [];
  const sources = [];
  const { delegations, errors } = await resolveProofs(proofs2, config);
  invalidProofs.push(...errors);
  for (const proof of delegations) {
    const validation = await validate(proof, delegations, config);
    if (validation.ok) {
      for (const capability3 of validation.ok.capabilities.values()) {
        sources.push(
          /** @type {API.Source} */
          {
            capability: capability3,
            delegation: validation.ok
          }
        );
      }
    } else {
      invalidProofs.push(validation.error);
    }
  }
  const selection = capability2.select(sources);
  const { errors: delegationErrors, unknown: unknownCapabilities } = selection;
  const failedProofs = [];
  for (const matched of selection.matches) {
    const selector = matched.prune(config);
    if (selector == null) {
      const authorization = create7(matched, []);
      const result = await validateAuthorization(authorization);
      if (result.error) {
        invalidProofs.push(result.error);
      } else {
        return { ok: authorization };
      }
    } else {
      const result = await authorize(selector, config);
      if (result.error) {
        failedProofs.push(result.error);
      } else {
        const authorization = create7(matched, [result.ok]);
        const approval = await validateAuthorization(authorization);
        if (approval.error) {
          invalidProofs.push(approval.error);
        } else {
          return { ok: authorization };
        }
      }
    }
  }
  return {
    error: new Unauthorized({
      capability: capability2,
      delegationErrors,
      unknownCapabilities,
      invalidProofs,
      failedProofs
    })
  };
};
var authorize = async (match6, config) => {
  const { sources, errors: invalidProofs } = await resolveMatch(match6, config);
  const selection = match6.select(sources);
  const { errors: delegationErrors, unknown: unknownCapabilities } = selection;
  const failedProofs = [];
  for (const matched of selection.matches) {
    const selector = matched.prune(config);
    if (selector == null) {
      return {
        ok: create7(
          // @ts-expect-error - it may not be a parsed capability but rather a
          // group of capabilities but we can deal with that in the future.
          matched,
          []
        )
      };
    } else {
      const result = await authorize(selector, config);
      if (result.error) {
        failedProofs.push(result.error);
      } else {
        return {
          ok: create7(
            // @ts-expect-error - it may not be a parsed capability but rather a
            // group of capabilities but we can deal with that in the future.
            matched,
            [result.ok]
          )
        };
      }
    }
  }
  return {
    error: new InvalidClaim({
      match: match6,
      delegationErrors,
      unknownCapabilities,
      invalidProofs,
      failedProofs
    })
  };
};
var ProofError = class extends Failure {
  /**
   * @param {API.UCANLink} proof
   * @param {API.Failure} cause
   */
  constructor(proof, cause) {
    super();
    this.name = "ProofError";
    this.proof = proof;
    this.cause = cause;
  }
  describe() {
    return [
      `Capability can not be derived from prf:${this.proof} because:`,
      li2(this.cause.message)
    ].join(`
`);
  }
};
var InvalidClaim = class extends Failure {
  /**
   * @param {{
   * match: API.Match
   * delegationErrors: API.DelegationError[]
   * unknownCapabilities: API.Capability[]
   * invalidProofs: ProofError[]
   * failedProofs: API.InvalidClaim[]
   * }} info
   */
  constructor(info2) {
    super();
    this.info = info2;
    this.name = /** @type {const} */
    "InvalidClaim";
  }
  get issuer() {
    return this.delegation.issuer;
  }
  get delegation() {
    return this.info.match.source[0].delegation;
  }
  describe() {
    const errors = [
      ...this.info.failedProofs.map((error4) => li2(error4.message)),
      ...this.info.delegationErrors.map((error4) => li2(error4.message)),
      ...this.info.invalidProofs.map((error4) => li2(error4.message))
    ];
    const unknown2 = this.info.unknownCapabilities.map(
      (c) => li2(JSON.stringify(c))
    );
    return [
      `Capability ${this.info.match} is not authorized because:`,
      li2(`Capability can not be (self) issued by '${this.issuer.did()}'`),
      ...errors.length > 0 ? errors : [li2(`Delegated capability not found`)],
      ...unknown2.length > 0 ? [li2(`Encountered unknown capabilities
${unknown2.join("\n")}`)] : []
    ].join("\n");
  }
};
var validate = async (delegation, proofs2, config) => {
  if (lib_exports.isExpired(delegation.data)) {
    return {
      error: new Expired(
        /** @type {API.Delegation & {expiration: number}} */
        delegation
      )
    };
  }
  if (lib_exports.isTooEarly(delegation.data)) {
    return {
      error: new NotValidBefore(
        /** @type {API.Delegation & {notBefore: number}} */
        delegation
      )
    };
  }
  return await verifyAuthorization(delegation, proofs2, config);
};
var verifyAuthorization = async (delegation, proofs2, config) => {
  const issuer = delegation.issuer.did();
  if (issuer.startsWith("did:key:")) {
    return verifySignature2(delegation, config.principal.parse(issuer));
  } else if (issuer === config.authority.did()) {
    return verifySignature2(delegation, config.authority);
  } else {
    const session = await verifySession(delegation, proofs2, config);
    if (session.ok) {
      return { ok: delegation };
    } else if (session.error.failedProofs.length > 0) {
      return {
        error: new SessionEscalation({ delegation, cause: session.error })
      };
    } else {
      const verifier = await config.resolveDIDKey(issuer);
      if (verifier.error) {
        return verifier;
      } else {
        return verifySignature2(
          delegation,
          config.principal.parse(verifier.ok).withDID(issuer)
        );
      }
    }
  }
};
var verifySignature2 = async (delegation, verifier) => {
  const valid = await lib_exports.verifySignature(delegation.data, verifier);
  return valid ? { ok: delegation } : { error: new InvalidSignature(delegation, verifier) };
};
var verifySession = async (delegation, proofs2, config) => {
  const withSchemas = config.proofs.filter((p) => p.capabilities[0].can === "ucan/attest" && p.capabilities[0].with === config.authority.did()).map((p) => literal(p.audience.did()));
  const withSchema = withSchemas.length ? union([literal(config.authority.did()), ...withSchemas]) : literal(config.authority.did());
  const attestation = capability({
    with: withSchema,
    can: "ucan/attest",
    nb: struct({
      proof: match2(delegation.cid)
    })
  });
  return await claim(
    attestation,
    proofs2.filter(isAttestation).filter((p) => p.cid.toString() !== delegation.cid.toString()),
    config
  );
};
var isAttestation = (proof) => proof.capabilities[0]?.can === "ucan/attest";

// node_modules/.pnpm/@ucanto+server@10.2.0/node_modules/@ucanto/server/src/error.js
var HandlerNotFound = class extends RangeError {
  /**
   * @param {API.Capability} capability
   */
  constructor(capability2) {
    super();
    this.error = true;
    this.capability = capability2;
  }
  /** @type {'HandlerNotFound'} */
  get name() {
    return "HandlerNotFound";
  }
  get message() {
    return `service does not implement {can: "${this.capability.can}"} handler`;
  }
  toJSON() {
    return {
      name: this.name,
      error: this.error,
      capability: {
        can: this.capability.can,
        with: this.capability.with
      },
      message: this.message,
      stack: this.stack
    };
  }
};
var HandlerExecutionError = class extends Failure {
  /**
   * @param {API.Capability} capability
   * @param {Error} cause
   */
  constructor(capability2, cause) {
    super();
    this.capability = capability2;
    this.cause = cause;
    this.error = true;
  }
  /** @type {'HandlerExecutionError'} */
  get name() {
    return "HandlerExecutionError";
  }
  get message() {
    return `service handler {can: "${this.capability.can}"} error: ${this.cause.message}`;
  }
  toJSON() {
    return {
      name: this.name,
      error: this.error,
      capability: {
        can: this.capability.can,
        with: this.capability.with
      },
      cause: {
        ...this.cause,
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack
      },
      message: this.message,
      stack: this.stack
    };
  }
};
var InvocationCapabilityError = class extends Error {
  /**
   * @param {any} caps
   */
  constructor(caps) {
    super();
    this.error = true;
    this.caps = caps;
  }
  get name() {
    return "InvocationCapabilityError";
  }
  get message() {
    return `Invocation is required to have a single capability.`;
  }
  toJSON() {
    return {
      name: this.name,
      error: this.error,
      message: this.message,
      capabilities: this.caps
    };
  }
};

// node_modules/.pnpm/@ucanto+server@10.2.0/node_modules/@ucanto/server/src/handler.js
var provideAdvanced = ({ capability: capability2, handler, audience }) => (
  /**
   * @param {API.Invocation<API.Capability<A, R, C>>} invocation
   * @param {API.InvocationContext} options
   */
  async (invocation, options) => {
    const audienceSchema = audience || options.audience || schema_exports3.literal(options.id.did());
    const result = audienceSchema.read(invocation.audience.did());
    if (result.error) {
      return { error: new InvalidAudience({ cause: result.error }) };
    }
    const authorization = await access(invocation, {
      ...options,
      authority: options.id,
      capability: capability2
    });
    if (authorization.error) {
      return authorization;
    } else {
      return handler({
        capability: authorization.ok.capability,
        invocation,
        context: options
      });
    }
  }
);
var InvalidAudience = class extends Failure {
  /**
   * @param {object} source
   * @param {API.Failure} source.cause
   */
  constructor({ cause }) {
    super();
    this.name = /** @type {const} */
    "InvalidAudience";
    this.cause = cause;
  }
  describe() {
    return this.cause.message;
  }
};
var Ok = class {
  /**
   * @param {T} ok
   */
  constructor(ok3) {
    this.ok = ok3;
  }
  get result() {
    return { ok: this.ok };
  }
  get effects() {
    return { fork: [] };
  }
  /**
   * @param {API.Run} run
   * @returns {API.ForkBuilder<T, X>}
   */
  fork(run2) {
    return new Fork({
      out: this.result,
      fx: {
        fork: [run2]
      }
    });
  }
  /**
   * @param {API.Run} run
   * @returns {API.JoinBuilder<T, X>}
   */
  join(run2) {
    return new Join({
      out: this.result,
      fx: {
        fork: [],
        join: run2
      }
    });
  }
};
var Error2 = class {
  /**
   * @param {X} error
   */
  constructor(error4) {
    this.error = error4;
  }
  get result() {
    return { error: this.error };
  }
  get effects() {
    return { fork: [] };
  }
  /**
   * @param {API.Run} run
   * @returns {API.ForkBuilder<T, X>}
   */
  fork(run2) {
    return new Fork({
      out: this.result,
      fx: {
        fork: [run2]
      }
    });
  }
  /**
   * @param {API.Run} run
   * @returns {API.JoinBuilder<T, X>}
   */
  join(run2) {
    return new Join({
      out: this.result,
      fx: {
        fork: [],
        join: run2
      }
    });
  }
};
var Join = class _Join {
  /**
   * @param {API.Do<T, X>} model
   */
  constructor(model) {
    this.do = model;
  }
  get result() {
    return this.do.out;
  }
  get effects() {
    return this.do.fx;
  }
  /**
   * @param {API.Run} run
   * @returns {API.JoinBuilder<T, X>}
   */
  fork(run2) {
    const { out, fx } = this.do;
    return new _Join({
      out,
      fx: {
        ...fx,
        fork: [...fx.fork, run2]
      }
    });
  }
};
var Fork = class _Fork extends Join {
  /**
   * @param {API.Run} run
   * @returns {API.JoinBuilder<T, X>}
   */
  join(run2) {
    const { out, fx } = this.do;
    return new Join({
      out,
      fx: { ...fx, join: run2 }
    });
  }
  /**
   * @param {API.Run} run
   * @returns {API.ForkBuilder<T, X>}
   */
  fork(run2) {
    const { out, fx } = this.do;
    return new _Fork({
      out,
      fx: { ...fx, fork: [...fx.fork, run2] }
    });
  }
};
var ok2 = (value) => new Ok(value);
var error3 = (error4) => new Error2(error4);

// node_modules/.pnpm/@ucanto+server@10.2.0/node_modules/@ucanto/server/src/server.js
var create8 = (options) => new Server(options);
var Server = class {
  /**
   * @param {API.ServerOptions<S>} options
   */
  constructor({ id, service, codec, principal: principal2 = Verifier, ...rest }) {
    const { catch: fail3, ...context } = rest;
    this.context = { id, principal: principal2, ...context };
    this.service = service;
    this.codec = codec;
    this.catch = fail3 || (() => {
    });
    this.validateAuthorization = this.context.validateAuthorization.bind(
      this.context
    );
  }
  get id() {
    return this.context.id;
  }
  /**
   * @template {API.Tuple<API.ServiceInvocation<API.Capability, S>>} I
   * @param {API.HTTPRequest<API.AgentMessage<{ In: API.InferInvocations<I>, Out: API.Tuple<API.Receipt> }>>} request
   * @returns {Promise<API.HTTPResponse<API.AgentMessage<{ Out: API.InferReceipts<I, S>, In: API.Tuple<API.Invocation> }>>>}
   */
  request(request) {
    return handle(this, request);
  }
  /**
   * @template {API.Capability} C
   * @param {API.ServiceInvocation<C, S>} invocation
   * @returns {Promise<API.InferReceipt<C, S>>}
   */
  async run(invocation) {
    const receipt = (
      /** @type {API.InferReceipt<C, S>} */
      await invoke2(await invocation.buildIPLDView(), this)
    );
    return receipt;
  }
};
var handle = async (server, request) => {
  const selection = server.codec.accept(request);
  if (selection.error) {
    const { status, headers = {}, message } = selection.error;
    return {
      status,
      headers,
      body: new TextEncoder().encode(message)
    };
  } else {
    const { encoder: encoder2, decoder: decoder2 } = selection.ok;
    const message = await decoder2.decode(request);
    const result = await execute(message, server);
    const response = await encoder2.encode(result);
    return response;
  }
};
var execute = async (input, server) => {
  const promises = input.invocations.map(($) => run($, server));
  const receipts = (
    /** @type {API.InferReceipts<I, S>} */
    await Promise.all(promises)
  );
  return message_exports.build({ receipts });
};
var run = async (invocation, server) => {
  if (invocation.capabilities.length !== 1) {
    return await receipt_exports.issue({
      issuer: server.id,
      ran: invocation,
      result: {
        error: new InvocationCapabilityError(invocation.capabilities)
      }
    });
  }
  const [capability2] = invocation.capabilities;
  const path2 = capability2.can.split("/");
  const method = (
    /** @type {string} */
    path2.pop()
  );
  const handler = resolve(server.service, path2);
  if (handler == null || typeof handler[method] !== "function") {
    return await receipt_exports.issue({
      issuer: server.id,
      ran: invocation,
      result: {
        /** @type {API.HandlerNotFound} */
        error: new HandlerNotFound(capability2)
      }
    });
  } else {
    try {
      const outcome = await handler[method](invocation, server.context);
      const result = outcome.do ? outcome.do.out : outcome;
      const fx = outcome.do ? outcome.do.fx : void 0;
      return await receipt_exports.issue({
        issuer: server.id,
        ran: invocation,
        result,
        fx
      });
    } catch (cause) {
      const error4 = new HandlerExecutionError(
        capability2,
        /** @type {Error} */
        cause
      );
      server.catch(error4);
      return await receipt_exports.issue({
        issuer: server.id,
        ran: invocation,
        result: { error: error4 }
      });
    }
  }
};
var invoke2 = run;
var resolve = (service, path2) => {
  let target = service;
  for (const key of path2) {
    target = target[key];
    if (!target) {
      return null;
    }
  }
  return target;
};

// src/services/onePasswordKms.js
var RSA_KEY_SIZE = 3072;
var RSA_ALGORITHM = "RSA_DECRYPT_OAEP_3072_SHA256";
var PROVIDER = "1password";
var DEFAULT_VAULT_NAME = "Storacha Space Keys";
var OnePasswordKMSService = class {
  /**
   * @param {object} options
   * @param {CreateOPClient} options.createClient - Factory to create a 1Password SDK client for an account
   * @param {SpaceKeyMappingStore} options.mappings - Persistent space → key location store
   * @param {AuditLogService} [options.auditLog]
   */
  constructor({ createClient: createClient2, mappings, auditLog }) {
    this.createClient = createClient2;
    this.mappings = mappings;
    this.auditLog = auditLog || new AuditLogService({
      serviceName: "1password-kms-service",
      environment: "local"
    });
    this._clients = /* @__PURE__ */ new Map();
  }
  /**
   * Get or create a 1Password SDK client for an account.
   * @param {string} accountName
   * @returns {Promise<OPClient>}
   */
  async _getClient(accountName) {
    let client = this._clients.get(accountName);
    if (!client) {
      client = await this.createClient(accountName);
      this._clients.set(accountName, client);
    }
    return client;
  }
  /**
   * Find or create a vault by name within an account.
   * @param {OPClient} client
   * @param {string} vaultName
   * @returns {Promise<string>} vault ID
   */
  async _resolveVault(client, vaultName) {
    const vaults = await client.vaults.list();
    const existing = vaults.find((v) => v.title === vaultName);
    if (existing) return existing.id;
    const created = await client.vaults.create({ title: vaultName });
    return created.id;
  }
  /**
   * Creates or retrieves an RSA key pair stored in 1Password for the space.
   *
   * @param {EncryptionSetupRequest} request
   * @param {import('../types/env.d.ts').Env} _env
   * @returns {Promise<import('@ucanto/server').Result<EncryptionSetupResult, import('@ucanto/server').Failure>>}
   */
  async setupKeyForSpace(request, _env) {
    const startTime = Date.now();
    try {
      const existingMapping = await this.mappings.get(request.space);
      if (existingMapping) {
        const client2 = await this._getClient(existingMapping.location);
        const existing = await this._findItemForSpace(
          client2,
          request.space,
          existingMapping.vaultId
        );
        if (existing) {
          const publicKey2 = this._extractPublicKey(existing);
          if (!publicKey2) {
            throw new Error("Public key not found in 1Password SshKey item");
          }
          this.auditLog.logKMSKeySetupSuccess(
            request.space,
            RSA_ALGORITHM,
            "existing",
            Date.now() - startTime
          );
          return ok2({
            publicKey: publicKey2,
            algorithm: RSA_ALGORITHM,
            provider: PROVIDER
          });
        }
      }
      const location = request.location;
      if (!location) {
        return error3(
          new Failure(
            "location (1Password account name) is required for encryption setup"
          )
        );
      }
      const vaultName = request.keyring || DEFAULT_VAULT_NAME;
      const client = await this._getClient(location);
      const vaultId = await this._resolveVault(client, vaultName);
      const existingItem = await this._findItemForSpace(
        client,
        request.space,
        vaultId
      );
      if (existingItem) {
        const publicKey2 = this._extractPublicKey(existingItem);
        if (!publicKey2) {
          throw new Error("Public key not found in 1Password SshKey item");
        }
        await this.mappings.set(request.space, { vaultId, location });
        this.auditLog.logKMSKeySetupSuccess(
          request.space,
          RSA_ALGORITHM,
          "existing",
          Date.now() - startTime
        );
        return ok2({ publicKey: publicKey2, algorithm: RSA_ALGORITHM, provider: PROVIDER });
      }
      const { privateKey } = crypto4.generateKeyPairSync("rsa", {
        modulusLength: RSA_KEY_SIZE,
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
        publicKeyEncoding: { type: "spki", format: "pem" }
      });
      const item = await client.items.create({
        title: `storacha-kms:${request.space}`,
        category: (
          /** @type {import('@1password/sdk').ItemCategory} */
          "SshKey"
        ),
        vaultId,
        fields: [
          {
            id: "private_key",
            title: "private key",
            fieldType: (
              /** @type {import('@1password/sdk').ItemFieldType} */
              "SshKey"
            ),
            value: privateKey,
            sectionId: "keys"
          }
        ],
        sections: [{ id: "keys", title: "Keys" }]
      });
      const publicKey = this._extractPublicKey(item);
      if (!publicKey) {
        throw new Error("Public key not found in 1Password SshKey item");
      }
      await this.mappings.set(request.space, { vaultId, location });
      this.auditLog.logKMSKeySetupSuccess(
        request.space,
        RSA_ALGORITHM,
        "1",
        Date.now() - startTime
      );
      return ok2({ publicKey, algorithm: RSA_ALGORITHM, provider: PROVIDER });
    } catch (err) {
      console.error("[OnePasswordKMS.setupKeyForSpace] Error:", err);
      this.auditLog.logKMSKeySetupFailure(
        request.space,
        `1Password key setup failed: ${err instanceof Error ? err.message : String(err)}`,
        void 0,
        Date.now() - startTime
      );
      return error3(new Failure("Encryption setup failed"));
    }
  }
  /**
   * Decrypts a symmetric key using the space's RSA private key from 1Password.
   *
   * @param {DecryptionKeyRequest} request
   * @param {import('../types/env.d.ts').Env} _env
   * @returns {Promise<import('@ucanto/server').Result<{ decryptedKey: string }, import('@ucanto/server').Failure>>}
   */
  async decryptSymmetricKey(request, _env) {
    const startTime = Date.now();
    try {
      const mapping = await this.mappings.get(request.space);
      if (!mapping) {
        return error3(
          new Failure(
            "No encryption key mapping found for space \u2014 run space/encryption/setup first"
          )
        );
      }
      const client = await this._getClient(mapping.location);
      const item = await this._findItemForSpace(
        client,
        request.space,
        mapping.vaultId
      );
      if (!item) {
        return error3(new Failure("No encryption key found for space"));
      }
      const privateKeyField = item.fields.find((f) => f.id === "private_key");
      if (!privateKeyField?.value) {
        return error3(new Failure("Private key not found in 1Password item"));
      }
      const privateKey = crypto4.createPrivateKey(privateKeyField.value);
      const decrypted = crypto4.privateDecrypt(
        {
          key: privateKey,
          padding: crypto4.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256"
        },
        request.encryptedSymmetricKey
      );
      const decryptedKey = base64.encode(decrypted);
      this.auditLog.logKMSDecryptSuccess(
        request.space,
        "local",
        Date.now() - startTime
      );
      return ok2({ decryptedKey });
    } catch (err) {
      console.error("[OnePasswordKMS.decryptSymmetricKey] Error:", err);
      this.auditLog.logKMSDecryptFailure(
        request.space,
        `1Password decryption failed: ${err instanceof Error ? err.message : String(err)}`,
        void 0,
        Date.now() - startTime
      );
      return error3(new Failure("KMS decryption failed"));
    }
  }
  /**
   * Extract public key from a 1Password SshKey item.
   * @param {import('@1password/sdk').Item} item
   * @returns {string | undefined}
   */
  _extractPublicKey(item) {
    const keyField = item.fields.find((f) => f.id === "private_key");
    if (keyField?.details?.type === "SshKey" && keyField?.details?.content?.publicKey) {
      return keyField.details.content.publicKey;
    }
    return void 0;
  }
  /**
   * Find the 1Password item for a space by title convention.
   *
   * @private
   * @param {OPClient} client
   * @param {SpaceDID} space
   * @param {string} vaultId
   * @returns {Promise<import('@1password/sdk').Item | undefined>}
   */
  async _findItemForSpace(client, space2, vaultId) {
    const items = await client.items.list(vaultId);
    const match6 = items.find((i) => i.title === `storacha-kms:${space2}`);
    if (!match6) return void 0;
    return client.items.get(vaultId, match6.id);
  }
};

// src/services/spaceKeyMappingStore.js
import * as fs2 from "node:fs/promises";
import * as path from "node:path";
var FileSpaceKeyMappingStore = class {
  /**
   * @param {string} dataDir - Directory to store the mappings JSON file
   */
  constructor(dataDir) {
    this.filePath = path.join(dataDir, "space-key-mappings.json");
    this._mappings = void 0;
  }
  /**
   * @param {SpaceDID} space
   * @returns {Promise<SpaceKeyMapping | undefined>}
   */
  async get(space2) {
    const mappings = await this._load();
    return mappings[space2];
  }
  /**
   * @param {SpaceDID} space
   * @param {SpaceKeyMapping} mapping
   */
  async set(space2, mapping) {
    const mappings = await this._load();
    mappings[space2] = mapping;
    await this._save(mappings);
  }
  /**
   * @returns {Promise<Record<string, SpaceKeyMapping>>}
   */
  async _load() {
    if (this._mappings !== void 0) return this._mappings;
    let result;
    try {
      const data = await fs2.readFile(this.filePath, "utf-8");
      result = JSON.parse(data);
    } catch (err) {
      if (
        /** @type {any} */
        err.code === "ENOENT"
      ) {
        result = {};
      } else {
        throw err;
      }
    }
    this._mappings = result;
    return result;
  }
  /**
   * @param {Record<string, SpaceKeyMapping>} mappings
   */
  async _save(mappings) {
    await fs2.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs2.writeFile(this.filePath, JSON.stringify(mappings, null, 2));
  }
};

// node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/.pnpm/p-timeout@6.1.4/node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  constructor(message) {
    super();
    this.name = "AbortError";
    this.message = message;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message,
    customTimers = { setTimeout, clearTimeout }
  } = options;
  let timer;
  let abortHandler;
  const wrappedPromise = new Promise((resolve2, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      abortHandler = () => {
        reject(getAbortedReason(signal));
      };
      signal.addEventListener("abort", abortHandler, { once: true });
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      promise.then(resolve2, reject);
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve2(fallback());
        } catch (error4) {
          reject(error4);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message === false) {
        resolve2();
      } else if (message instanceof Error) {
        reject(message);
      } else {
        timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
        reject(timeoutError);
      }
    }, milliseconds);
    (async () => {
      try {
        resolve2(await promise);
      } catch (error4) {
        reject(error4);
      }
    })();
  });
  const cancelablePromise = wrappedPromise.finally(() => {
    cancelablePromise.clear();
    if (abortHandler && options.signal) {
      options.signal.removeEventListener("abort", abortHandler);
    }
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}

// node_modules/.pnpm/p-queue@8.1.1/node_modules/p-queue/dist/lower-bound.js
function lowerBound(array2, value, comparator) {
  let first = 0;
  let count = array2.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it2 = first + step;
    if (comparator(array2[it2], value) <= 0) {
      first = ++it2;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}

// node_modules/.pnpm/p-queue@8.1.1/node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
  #queue = [];
  enqueue(run2, options) {
    options = {
      priority: 0,
      ...options
    };
    const element = {
      priority: options.priority,
      id: options.id,
      run: run2
    };
    if (this.size === 0 || this.#queue[this.size - 1].priority >= options.priority) {
      this.#queue.push(element);
      return;
    }
    const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
    this.#queue.splice(index, 0, element);
  }
  setPriority(id, priority) {
    const index = this.#queue.findIndex((element) => element.id === id);
    if (index === -1) {
      throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
    }
    const [item] = this.#queue.splice(index, 1);
    this.enqueue(item.run, { priority, id });
  }
  dequeue() {
    const item = this.#queue.shift();
    return item?.run;
  }
  filter(options) {
    return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
  }
  get size() {
    return this.#queue.length;
  }
};

// node_modules/.pnpm/p-queue@8.1.1/node_modules/p-queue/dist/index.js
var PQueue = class extends import_index.default {
  #carryoverConcurrencyCount;
  #isIntervalIgnored;
  #intervalCount = 0;
  #intervalCap;
  #interval;
  #intervalEnd = 0;
  #intervalId;
  #timeoutId;
  #queue;
  #queueClass;
  #pending = 0;
  // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
  #concurrency;
  #isPaused;
  #throwOnTimeout;
  // Use to assign a unique identifier to a promise function, if not explicitly specified
  #idAssigner = 1n;
  /**
      Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
  
      Applies to each future operation.
      */
  timeout;
  // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
  constructor(options) {
    super();
    options = {
      carryoverConcurrencyCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: PriorityQueue,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
    }
    this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
    this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
    this.#intervalCap = options.intervalCap;
    this.#interval = options.interval;
    this.#queue = new options.queueClass();
    this.#queueClass = options.queueClass;
    this.concurrency = options.concurrency;
    this.timeout = options.timeout;
    this.#throwOnTimeout = options.throwOnTimeout === true;
    this.#isPaused = options.autoStart === false;
  }
  get #doesIntervalAllowAnother() {
    return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
  }
  get #doesConcurrentAllowAnother() {
    return this.#pending < this.#concurrency;
  }
  #next() {
    this.#pending--;
    this.#tryToStartAnother();
    this.emit("next");
  }
  #onResumeInterval() {
    this.#onInterval();
    this.#initializeIntervalIfNeeded();
    this.#timeoutId = void 0;
  }
  get #isIntervalPaused() {
    const now2 = Date.now();
    if (this.#intervalId === void 0) {
      const delay = this.#intervalEnd - now2;
      if (delay < 0) {
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
      } else {
        if (this.#timeoutId === void 0) {
          this.#timeoutId = setTimeout(() => {
            this.#onResumeInterval();
          }, delay);
        }
        return true;
      }
    }
    return false;
  }
  #tryToStartAnother() {
    if (this.#queue.size === 0) {
      if (this.#intervalId) {
        clearInterval(this.#intervalId);
      }
      this.#intervalId = void 0;
      this.emit("empty");
      if (this.#pending === 0) {
        this.emit("idle");
      }
      return false;
    }
    if (!this.#isPaused) {
      const canInitializeInterval = !this.#isIntervalPaused;
      if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
        const job = this.#queue.dequeue();
        if (!job) {
          return false;
        }
        this.emit("active");
        job();
        if (canInitializeInterval) {
          this.#initializeIntervalIfNeeded();
        }
        return true;
      }
    }
    return false;
  }
  #initializeIntervalIfNeeded() {
    if (this.#isIntervalIgnored || this.#intervalId !== void 0) {
      return;
    }
    this.#intervalId = setInterval(() => {
      this.#onInterval();
    }, this.#interval);
    this.#intervalEnd = Date.now() + this.#interval;
  }
  #onInterval() {
    if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = void 0;
    }
    this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
    this.#processQueue();
  }
  /**
  Executes all queued functions until it reaches the limit.
  */
  #processQueue() {
    while (this.#tryToStartAnother()) {
    }
  }
  get concurrency() {
    return this.#concurrency;
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    this.#concurrency = newConcurrency;
    this.#processQueue();
  }
  async #throwOnAbort(signal) {
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal.reason);
      }, { once: true });
    });
  }
  /**
      Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.
  
      For example, this can be used to prioritize a promise function to run earlier.
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 0, id: '🦀'});
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦄', {priority: 1});
  
      queue.setPriority('🦀', 2);
      ```
  
      In this case, the promise function with `id: '🦀'` runs second.
  
      You can also deprioritize a promise function to delay its execution:
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 1, id: '🦀'});
      queue.add(async () => '🦄');
      queue.add(async () => '🦄', {priority: 0});
  
      queue.setPriority('🦀', -1);
      ```
      Here, the promise function with `id: '🦀'` executes last.
      */
  setPriority(id, priority) {
    this.#queue.setPriority(id, priority);
  }
  async add(function_, options = {}) {
    options.id ??= (this.#idAssigner++).toString();
    options = {
      timeout: this.timeout,
      throwOnTimeout: this.#throwOnTimeout,
      ...options
    };
    return new Promise((resolve2, reject) => {
      this.#queue.enqueue(async () => {
        this.#pending++;
        try {
          options.signal?.throwIfAborted();
          this.#intervalCount++;
          let operation = function_({ signal: options.signal });
          if (options.timeout) {
            operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
          }
          if (options.signal) {
            operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
          }
          const result = await operation;
          resolve2(result);
          this.emit("completed", result);
        } catch (error4) {
          if (error4 instanceof TimeoutError && !options.throwOnTimeout) {
            resolve2();
            return;
          }
          reject(error4);
          this.emit("error", error4);
        } finally {
          this.#next();
        }
      }, options);
      this.emit("add");
      this.#tryToStartAnother();
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!this.#isPaused) {
      return this;
    }
    this.#isPaused = false;
    this.#processQueue();
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    this.#isPaused = true;
  }
  /**
  Clear the queue.
  */
  clear() {
    this.#queue = new this.#queueClass();
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (this.#queue.size < limit) {
      return;
    }
    await this.#onEvent("next", () => this.#queue.size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (this.#pending === 0 && this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("idle");
  }
  async #onEvent(event, filter) {
    return new Promise((resolve2) => {
      const listener = () => {
        if (filter && !filter()) {
          return;
        }
        this.off(event, listener);
        resolve2();
      };
      this.on(event, listener);
    });
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return this.#queue.size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return this.#queue.filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return this.#pending;
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return this.#isPaused;
  }
};

// src/clients/revocation.js
var RevocationStatusClientImpl = class {
  /**
   * Creates a new revocation status client
   * @param {Object} [options] - Client options
   * @param {AuditLogService} [options.auditLog] - Audit log service instance
   * @param {string} [options.environment] - Environment name for audit logging
   */
  constructor(options = {}) {
    this.auditLog = options.auditLog || new AuditLogService({
      serviceName: "revocation-status-service",
      environment: options.environment || "unknown"
    });
    if (process.env.NODE_ENV === "development") {
      this.auditLog.logServiceInitialization("RevocationStatusClient", true);
    }
  }
  /**
   * Checks revocation status of UCAN delegations and invocation via Storage UCAN Service
   *
   * @param {Ucanto.Proof[]} proofs - Array of UCAN proofs to check
   * @param {string} spaceDID - Space DID to validate delegation context
   * @param {import('../types/env.js').Env} env - Environment configuration
   * @returns {Promise<import('@ucanto/server').Result<boolean, import('@ucanto/server').Failure>>}
   */
  async checkStatus(proofs2, spaceDID, env) {
    try {
      const result = await verifyDelegationChain(proofs2, spaceDID, env.UPLOAD_SERVICE_URL);
      if (result.isValid) {
        this.auditLog.logSecurityEvent("revocation_check_success", {
          operation: "revocation_check",
          status: "success",
          metadata: {
            proofsCount: (proofs2 || []).length,
            spaceDID,
            result: "no_revocations_found"
          }
        });
        return ok2(true);
      }
      const errorMsg = result.reason || "Unable to check revocation status";
      this.auditLog.logSecurityEvent("revocation_check_failure", {
        operation: "revocation_check",
        status: "failure",
        error: errorMsg,
        metadata: {
          proofsCount: (proofs2 || []).length,
          revokedDelegation: result,
          spaceDID
        }
      });
      return error3(new Failure(errorMsg));
    } catch (err) {
      console.error("[checkStatus] something went wrong:", err);
      this.auditLog.logSecurityEvent("revocation_check_failure", {
        operation: "revocation_check",
        status: "failure",
        error: err instanceof Error ? err.message : String(err),
        metadata: {
          proofsCount: (proofs2 || []).length,
          spaceDID
        }
      });
      return error3(new Failure("Revocation status check failed"));
    }
  }
};
async function verifyDelegationChain(proofs2, spaceDID, uploadServiceUrl) {
  const validDelegations = (proofs2 || []).filter(isDelegation);
  const decryptDelegations = validDelegations.filter((d) => {
    return d.capabilities && d.capabilities.some((cap) => {
      return cap.can === "space/content/decrypt" && cap.with === spaceDID;
    });
  });
  if (decryptDelegations.length === 0) {
    return {
      isValid: false,
      reason: `No valid delegations found for space ${spaceDID}`
    };
  }
  if (!uploadServiceUrl) {
    return {
      isValid: false,
      reason: "No revocation service URL configured - cannot validate delegation status"
    };
  }
  const visited = /* @__PURE__ */ new Set();
  const chainDelegations = [];
  const queue = [...decryptDelegations];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const cidStr = current.cid.toString();
    if (visited.has(cidStr)) continue;
    visited.add(cidStr);
    const isRelevantToSpace = current.capabilities && current.capabilities.some((cap) => {
      if (cap.with && cap.with.startsWith("did:key:")) {
        return cap.with === spaceDID;
      }
      return true;
    });
    if (isRelevantToSpace) {
      chainDelegations.push(current);
    }
    if (current.proofs) {
      const nextProofs = current.proofs.filter(isDelegation);
      queue.push(...nextProofs);
    }
  }
  const abortController = new AbortController();
  const revocationQueue = new PQueue({ concurrency: 5 });
  const checkCID = async (cid) => {
    try {
      const response = await fetch(`${uploadServiceUrl}/revocations/${cid}`, {
        signal: abortController.signal
      });
      if (response.status === 200) {
        response.body?.cancel();
        abortController.abort();
        return {
          isValid: false,
          revokedDelegation: cid,
          reason: "Delegation explicitly revoked"
        };
      }
      if (response.status === 404) {
        response.body?.cancel();
        return null;
      }
      response.body?.cancel();
      console.warn(`[checkCID] Unexpected response status ${response.status} for CID ${cid}`);
      return null;
    } catch (error4) {
      if (
        /** @type {any} */
        error4.name === "AbortError"
      ) {
        return null;
      }
      console.error(`[checkCID] Error checking revocation for CID ${cid}:`, error4);
      return null;
    }
  };
  try {
    const racePromise = new Promise((resolve2) => {
      let completed = 0;
      const total = chainDelegations.length;
      chainDelegations.forEach((delegation) => {
        revocationQueue.add(async () => {
          const result = await checkCID(delegation.cid.toString());
          if (result && !result.isValid) {
            resolve2(result);
          } else {
            completed++;
            if (completed === total) {
              resolve2({ isValid: true });
            }
          }
        });
      });
    });
    return await racePromise;
  } catch (error4) {
    console.error("[verifyDelegationChain] Error during revocation check:", error4);
    return {
      isValid: false,
      reason: "Revocation check failed"
    };
  } finally {
    revocationQueue.clear();
  }
}

// node_modules/.pnpm/@storacha+capabilities@1.8.0/node_modules/@storacha/capabilities/dist/utils.js
var ProviderDID = did_exports2.match({ method: "web" });
var SpaceDID = did_exports2.match({ method: "key" });
var AccountDID = did_exports2.match({ method: "mailto" });
var Await = schema_exports3.struct({
  "ucan/await": schema_exports3.tuple([schema_exports3.string(), schema_exports3.link()])
});
function equalWith(child, parent) {
  return child.with === parent.with ? ok({}) : fail2(`Can not derive ${child.can} with ${child.with} from ${parent.with}`);
}
function equal(child, parent, constraint) {
  if (parent === void 0 || parent === "*") {
    return ok({});
  } else if (String(child) === String(parent)) {
    return ok({});
  } else {
    return fail2(`Constraint violation: ${child} violates imposed ${constraint} constraint ${parent}`);
  }
}
var equalLink = (claimed, delegated) => {
  if (claimed.with !== delegated.with) {
    return fail2(`Expected 'with: "${delegated.with}"' instead got '${claimed.with}'`);
  } else if (delegated.nb.link && `${delegated.nb.link}` !== `${claimed.nb.link}`) {
    return fail2(`Link ${claimed.nb.link ? `${claimed.nb.link}` : ""} violates imposed ${delegated.nb.link} constraint.`);
  } else {
    return ok({});
  }
};
var and3 = (result) => result.error ? result : void 0;

// node_modules/.pnpm/@storacha+capabilities@1.8.0/node_modules/@storacha/capabilities/dist/store.js
var code10 = 514;
var CARLink = schema_exports3.link({ code: code10, version: 1 });
var store = capability({
  can: "store/*",
  /**
   * DID of the (memory) space where CAR is intended to
   * be stored.
   */
  with: SpaceDID,
  derives: equalWith
});
var add = capability({
  can: "store/add",
  /**
   * DID of the (memory) space where CAR is intended to
   * be stored.
   */
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * CID of the CAR file to be stored. Service will provision write target
     * for this exact CAR file for agent to PUT or POST it. Attempt to write
     * any other content will fail.
     */
    link: CARLink,
    /**
     * Size of the CAR file to be stored. Service will provision write target
     * for this exact size. Attempt to write a larger CAR file will fail.
     */
    size: schema_exports3.integer(),
    /**
     * Agent may optionally provide a link to a related CAR file using `origin`
     * field. This is useful when storing large DAGs, agent could shard it
     * across multiple CAR files and then link each shard with a previous one.
     *
     * Providing this relation tells service that given CAR is shard of the
     * larger DAG as opposed to it being intentionally partial DAG. When DAG is
     * not sharded, there will be only one `store/add` with `origin` left out.
     */
    origin: link_exports2.optional()
  }),
  derives: (claim2, from11) => {
    const result = equalLink(claim2, from11);
    if (result.error) {
      return result;
    } else if (claim2.nb.size !== void 0 && from11.nb.size !== void 0) {
      return claim2.nb.size > from11.nb.size ? fail2(`Size constraint violation: ${claim2.nb.size} > ${from11.nb.size}`) : ok({});
    } else {
      return ok({});
    }
  }
});
var get2 = capability({
  can: "store/get",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * shard CID to fetch info about.
     */
    link: CARLink.optional()
  }),
  derives: equalLink
});
var remove = capability({
  can: "store/remove",
  /**
   * DID of the (memory) space where CAR is intended to
   * be stored.
   */
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * CID of the CAR file to be removed from the store.
     */
    link: CARLink
  }),
  derives: equalLink
});
var list = capability({
  can: "store/list",
  /**
   * DID of the (memory) space where CAR is intended to
   * be stored.
   */
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * A pointer that can be moved back and forth on the list.
     * It can be used to paginate a list for instance.
     */
    cursor: schema_exports3.string().optional(),
    /**
     * Maximum number of items per page.
     */
    size: schema_exports3.integer().optional(),
    /**
     * If true, return page of results preceding cursor. Defaults to false.
     */
    pre: schema_exports3.boolean().optional()
  }),
  derives: (claimed, delegated) => {
    if (claimed.with !== delegated.with) {
      return fail2(`Expected 'with: "${delegated.with}"' instead got '${claimed.with}'`);
    }
    return ok({});
  }
});
var all = add.or(remove).or(list);

// node_modules/.pnpm/@ucanto+transport@9.2.0/node_modules/@ucanto/transport/src/car/request.js
var request_exports = {};
__export(request_exports, {
  codec: () => car_exports,
  contentType: () => contentType3,
  decode: () => decode25,
  encode: () => encode21
});
var contentType3 = car_exports.contentType;
var HEADERS = Object.freeze({
  "content-type": contentType3,
  // We will signal that we want to receive a CAR file in the response
  accept: contentType3
});
var encode21 = (message, options) => {
  const blocks = /* @__PURE__ */ new Map();
  for (const block of message.iterateIPLDBlocks()) {
    blocks.set(`${block.cid}`, block);
  }
  const body = car_exports.encode({
    roots: [message.root],
    blocks
  });
  return {
    headers: options?.headers || { ...HEADERS },
    body
  };
};
var decode25 = async ({ headers, body }) => {
  const { roots, blocks } = car_exports.decode(
    /** @type {Uint8Array} */
    body
  );
  const message = message_exports.view({ root: roots[0].cid, store: blocks });
  return (
    /** @type {Message} */
    message
  );
};

// node_modules/.pnpm/@ucanto+transport@9.2.0/node_modules/@ucanto/transport/src/car/response.js
var response_exports = {};
__export(response_exports, {
  codec: () => car_exports,
  contentType: () => contentType4,
  decode: () => decode26,
  encode: () => encode22
});
var contentType4 = car_exports.contentType;
var HEADERS2 = Object.freeze({
  "content-type": contentType4
});
var encode22 = (message, options) => {
  const blocks = /* @__PURE__ */ new Map();
  for (const block of message.iterateIPLDBlocks()) {
    blocks.set(`${block.cid}`, block);
  }
  const body = car_exports.encode({
    roots: [message.root],
    blocks
  });
  return {
    headers: { ...HEADERS2 },
    body
  };
};
var decode26 = async ({ headers, body }) => {
  const { roots, blocks } = car_exports.decode(
    /** @type {Uint8Array} */
    body
  );
  const message = message_exports.view({ root: roots[0].cid, store: blocks });
  return (
    /** @type {Message} */
    message
  );
};

// node_modules/.pnpm/@ucanto+transport@9.2.0/node_modules/@ucanto/transport/src/codec.js
var inbound = (source) => new Inbound(source);
var Inbound = class {
  /**
   * @param {API.HTTPRequest} request
   * @returns {API.Result<API.InboundAcceptCodec, API.HTTPError>} transport
   */
  accept({ headers }) {
    const contentType6 = headers["content-type"] || headers["Content-Type"];
    const decoder2 = this.decoders[contentType6];
    if (!decoder2) {
      return {
        error: {
          status: 415,
          message: `The server cannot process the request because the payload format is not supported. Please check the content-type header and try again with a supported media type.`,
          headers: {
            accept: Object.keys(this.decoders).join(", ")
          }
        }
      };
    }
    const accept = parseAcceptHeader(headers.accept || headers.Accept || "*/*");
    for (const { category, type } of accept) {
      for (const encoder2 of this.encoders) {
        const select2 = (category === "*" || category === encoder2.category) && (type === "*" || type === encoder2.type);
        if (select2) {
          return { ok: { ...encoder2, decoder: decoder2 } };
        }
      }
    }
    return {
      error: {
        status: 406,
        message: `The requested resource cannot be served in the requested content type. Please specify a supported content type using the Accept header.`,
        headers: {
          accept: formatAcceptHeader(Object.values(this.encoders))
        }
      }
    };
  }
  /**
   * @param {object} source
   * @param {Record<string, API.Transport.RequestDecoder>} source.decoders
   * @param {Record<string, API.Transport.ResponseEncoder>} source.encoders
   */
  constructor({ decoders = {}, encoders = {} }) {
    this.decoders = decoders;
    if (Object.keys(decoders).length === 0) {
      throw new Error("At least one decoder MUST be provided");
    }
    this.encoders = Object.entries(encoders).map(([mediaType, encoder2]) => {
      return { ...parseMediaType(mediaType), encoder: encoder2 };
    }).sort((a, b) => b.preference - a.preference);
    if (this.encoders.length === 0) {
      throw new Error("At least one encoder MUST be provided");
    }
  }
};
var outbound = (source) => new Outbound(source);
var Outbound = class {
  /**
   * @param {object} source
   * @param {Record<string, API.Transport.RequestEncoder>} source.encoders
   * @param {Record<string, API.Transport.ResponseDecoder>} source.decoders
   */
  constructor({ decoders = {}, encoders = {} }) {
    this.decoders = decoders;
    if (Object.keys(decoders).length === 0) {
      throw new Error("At least one decoder MUST be provided");
    }
    this.encoders = Object.entries(encoders).map(([mediaType, encoder2]) => {
      return { ...parseMediaType(mediaType), encoder: encoder2 };
    }).sort((a, b) => b.preference - a.preference);
    this.acceptType = formatAcceptHeader(this.encoders);
    if (this.encoders.length === 0) {
      throw new Error("At least one encoder MUST be provided");
    }
    this.encoder = this.encoders[0].encoder;
  }
  /**
   * @template {API.AgentMessage} Message
   * @param {Message} message
   */
  encode(message) {
    return this.encoder.encode(message, {
      accept: this.acceptType
    });
  }
  /**
   * @template {API.AgentMessage} Message
   * @param {API.HTTPResponse<Message>} response
   * @returns {API.Await<Message>}
   */
  decode(response) {
    const { headers } = response;
    const contentType6 = headers["content-type"] || headers["Content-Type"];
    const decoder2 = this.decoders[contentType6] || this.decoders["*/*"];
    switch (response.status) {
      case 415:
      case 406:
        throw Object.assign(
          new RangeError(new TextDecoder().decode(response.body)),
          {
            status: response.status,
            headers: response.headers
          }
        );
    }
    if (!decoder2) {
      throw Object.assign(
        TypeError(
          `Can not decode response with content-type '${contentType6}' because no matching transport decoder is configured.`
        ),
        {
          error: true
        }
      );
    }
    return decoder2.decode(response);
  }
};
var parseMediaType = (source) => {
  const [mediaType = "*/*", mediaRange = ""] = source.trim().split(";");
  const [category = "*", type = "*"] = mediaType.split("/");
  const params = new URLSearchParams(mediaRange);
  const preference = parseFloat(params.get("q") || "0");
  return {
    category,
    type,
    /* c8 ignore next */
    preference: isNaN(preference) ? 0 : preference
  };
};
var formatMediaType = ({ category, type, preference }) => (
  /** @type {MediaType}  */
  `${category}/${type}${preference ? `;q=${preference}` : ""}`
);
var parseAcceptHeader = (source) => source.split(",").map(parseMediaType).sort((a, b) => b.preference - a.preference);
var formatAcceptHeader = (source) => source.map(formatMediaType).join(", ");

// node_modules/.pnpm/@ucanto+transport@9.2.0/node_modules/@ucanto/transport/src/car.js
var contentType5 = car_exports.contentType;
var inbound2 = inbound({
  decoders: {
    [contentType3]: request_exports
  },
  encoders: {
    [contentType4]: response_exports
  }
});
var outbound2 = outbound({
  encoders: {
    [contentType3]: request_exports
  },
  decoders: {
    [contentType4]: response_exports
  }
});

// node_modules/.pnpm/@storacha+capabilities@1.8.0/node_modules/@storacha/capabilities/dist/upload.js
var upload = capability({
  can: "upload/*",
  /**
   * DID of the (memory) space where upload is add to the
   * upload list.
   */
  with: SpaceDID,
  derives: equalWith
});
var CARLink2 = link_exports2.match({ code: car_exports.code, version: 1 });
var add2 = capability({
  can: "upload/add",
  /**
   * DID of the (memory) space where uploaded is added.
   */
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * Root CID of the DAG to be added to the upload list.
     */
    root: link_exports2,
    /**
     * CIDs to the CAR files that contain blocks of the DAG.
     */
    shards: CARLink2.array().optional()
  }),
  derives: (self2, from11) => {
    return and3(equalWith(self2, from11)) || and3(equal(self2.nb.root, from11.nb.root, "root")) || and3(equal(self2.nb.shards, from11.nb.shards, "shards")) || ok({});
  }
});
var get3 = capability({
  can: "upload/get",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * Root CID of the DAG to fetch upload info about.
     */
    root: link_exports2.optional()
  }),
  derives: (self2, from11) => {
    const res = equalWith(self2, from11);
    if (res.error) {
      return res;
    }
    if (!from11.nb.root) {
      return res;
    }
    return equal(self2.nb.root, from11.nb.root, "root");
  }
});
var remove2 = capability({
  can: "upload/remove",
  /**
   * DID of the (memory) space where uploaded is removed from.
   */
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * Root CID of the DAG to be removed from the upload list.
     */
    root: link_exports2
  }),
  derives: (self2, from11) => {
    return and3(equalWith(self2, from11)) || and3(equal(self2.nb.root, from11.nb.root, "root")) || ok({});
  }
});
var list2 = capability({
  can: "upload/list",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * A pointer that can be moved back and forth on the list.
     * It can be used to paginate a list for instance.
     */
    cursor: schema_exports3.string().optional(),
    /**
     * Maximum number of items per page.
     */
    size: schema_exports3.integer().optional(),
    /**
     * If true, return page of results preceding cursor. Defaults to false.
     */
    pre: schema_exports3.boolean().optional()
  })
});
var all2 = add2.or(remove2).or(list2);

// node_modules/.pnpm/@storacha+capabilities@1.8.0/node_modules/@storacha/capabilities/dist/top.js
var top = capability({
  can: "*",
  with: schema_exports3.or(schema_exports3.did(), schema_exports3.literal("ucan:*")),
  derives: equalWith
});

// node_modules/.pnpm/@storacha+capabilities@1.8.0/node_modules/@storacha/capabilities/dist/space.js
var space = capability({
  can: "space/*",
  with: SpaceDID,
  derives: equalWith
});
var info = add.or(list).or(remove).or(add2).or(list2).or(remove2).derive({
  to: capability({
    can: "space/info",
    with: SpaceDID
  }),
  derives: equalWith
});
var allocate = capability({
  can: "space/allocate",
  with: SpaceDID,
  nb: schema_exports3.struct({
    size: schema_exports3.integer()
  }),
  derives: (child, parent) => {
    const result = equalWith(child, parent);
    if (result.ok) {
      return child.nb.size <= parent.nb.size ? ok({}) : fail2(`Claimed size ${child.nb.size} escalates delegated size ${parent.nb.size}`);
    } else {
      return result;
    }
  }
});
var contentServe = capability({
  can: "space/content/serve/*",
  with: SpaceDID,
  derives: equalWith
});
var egressRecord = capability({
  can: "space/content/serve/egress/record",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /** CID of the resource that was served. */
    resource: schema_exports3.link(),
    /** Amount of bytes served. */
    bytes: schema_exports3.integer().greaterThan(0),
    /** Timestamp of the event in milliseconds after Unix epoch. */
    servedAt: schema_exports3.integer().greaterThan(-1)
  }),
  derives: equalWith
});
var decrypt = capability({
  can: "space/content/decrypt",
  with: SpaceDID,
  nb: schema_exports3.struct({
    resource: schema_exports3.link()
  }),
  derives: (child, parent) => {
    if (child.with !== parent.with) {
      return fail2(`Can not derive ${child.can} with ${child.with} from ${parent.with}`);
    }
    if (child.nb.resource.toString() !== parent.nb.resource.toString()) {
      return fail2(`Can not derive ${child.can} resource ${child.nb.resource} from ${parent.nb.resource}`);
    }
    return ok({});
  }
});
var EncryptionSetup = capability({
  can: "space/encryption/setup",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * The location of the KMS key to use for encryption. If not provided, the Storacha Key Manager will use the default location.
     */
    location: schema_exports3.string().optional(),
    /**
     * The keyring of the KMS key to use for encryption. If not provided, the Storacha Key Manager will use the default keyring.
     */
    keyring: schema_exports3.string().optional()
  }),
  derives: (child, parent) => {
    if (child.with !== parent.with) {
      return fail2(`Can not derive ${child.can} with ${child.with} from ${parent.with}`);
    }
    if (child.nb.location !== parent.nb.location) {
      return fail2(`Can not derive ${child.can} location ${child.nb.location} from ${parent.nb.location}`);
    }
    if (child.nb.keyring !== parent.nb.keyring) {
      return fail2(`Can not derive ${child.can} keyring ${child.nb.keyring} from ${parent.nb.keyring}`);
    }
    return ok({});
  }
});
var EncryptionKeyDecrypt = capability({
  can: "space/encryption/key/decrypt",
  with: SpaceDID,
  nb: schema_exports3.struct({
    /**
     * The encrypted symmetric key to be decrypted
     */
    key: schema_exports3.bytes()
  }),
  derives: (child, parent) => {
    if (child.with !== parent.with) {
      return fail2(`Can not derive ${child.can} with ${child.with} from ${parent.with}`);
    }
    if (child.nb.key !== parent.nb.key) {
      return fail2(`Can not derive ${child.can} key ${child.nb.key} from ${parent.nb.key}`);
    }
    return ok({});
  }
});

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/decoder.js
async function readHeader2(reader, strictVersion) {
  const length2 = decodeVarint(await reader.upTo(8), reader);
  if (length2 === 0) {
    throw new Error("Invalid CAR header (zero length)");
  }
  const header = await reader.exactly(length2, true);
  const block = decode16(header);
  if (CarV1HeaderOrV2Pragma.toTyped(block) === void 0) {
    throw new Error("Invalid CAR header format");
  }
  if (block.version !== 1 && block.version !== 2 || strictVersion !== void 0 && block.version !== strictVersion) {
    throw new Error(`Invalid CAR version: ${block.version}${strictVersion !== void 0 ? ` (expected ${strictVersion})` : ""}`);
  }
  if (block.version === 1) {
    if (!Array.isArray(block.roots)) {
      throw new Error("Invalid CAR header format");
    }
    return block;
  }
  if (block.roots !== void 0) {
    throw new Error("Invalid CAR header format");
  }
  const v2Header = decodeV2Header(await reader.exactly(V2_HEADER_LENGTH, true));
  reader.seek(v2Header.dataOffset - reader.pos);
  const v1Header = await readHeader2(reader, 1);
  return Object.assign(v1Header, v2Header);
}
async function readCid2(reader) {
  const first = await reader.exactly(2, false);
  if (first[0] === CIDV0_BYTES.SHA2_256 && first[1] === CIDV0_BYTES.LENGTH) {
    const bytes3 = await reader.exactly(34, true);
    const multihash2 = decode4(bytes3);
    return CID.create(0, CIDV0_BYTES.DAG_PB, multihash2);
  }
  const version = decodeVarint(await reader.upTo(8), reader);
  if (version !== 1) {
    throw new Error(`Unexpected CID version (${version})`);
  }
  const codec = decodeVarint(await reader.upTo(8), reader);
  const bytes2 = await reader.exactly(getMultihashLength(await reader.upTo(8)), true);
  const multihash = decode4(bytes2);
  return CID.create(version, codec, multihash);
}
async function readBlockHead2(reader) {
  const start = reader.pos;
  let length2 = decodeVarint(await reader.upTo(8), reader);
  if (length2 === 0) {
    throw new Error("Invalid CAR section (zero length)");
  }
  length2 += reader.pos - start;
  const cid = await readCid2(reader);
  const blockLength2 = length2 - Number(reader.pos - start);
  return { cid, length: length2, blockLength: blockLength2 };
}
async function readBlock(reader) {
  const { cid, blockLength: blockLength2 } = await readBlockHead2(reader);
  const bytes2 = await reader.exactly(blockLength2, true);
  return { bytes: bytes2, cid };
}
async function readBlockIndex(reader) {
  const offset = reader.pos;
  const { cid, length: length2, blockLength: blockLength2 } = await readBlockHead2(reader);
  const index = { cid, length: length2, blockLength: blockLength2, offset, blockOffset: reader.pos };
  reader.seek(index.blockLength);
  return index;
}
function createDecoder(reader) {
  const headerPromise = (async () => {
    const header = await readHeader2(reader);
    if (header.version === 2) {
      const v1length = reader.pos - header.dataOffset;
      reader = limitReader2(reader, header.dataSize - v1length);
    }
    return header;
  })();
  return {
    header: () => headerPromise,
    async *blocks() {
      await headerPromise;
      while ((await reader.upTo(8)).length > 0) {
        yield await readBlock(reader);
      }
    },
    async *blocksIndex() {
      await headerPromise;
      while ((await reader.upTo(8)).length > 0) {
        yield await readBlockIndex(reader);
      }
    }
  };
}
function bytesReader2(bytes2) {
  let pos = 0;
  return {
    async upTo(length2) {
      const out = bytes2.subarray(pos, pos + Math.min(length2, bytes2.length - pos));
      return out;
    },
    async exactly(length2, seek = false) {
      if (length2 > bytes2.length - pos) {
        throw new Error("Unexpected end of data");
      }
      const out = bytes2.subarray(pos, pos + length2);
      if (seek) {
        pos += length2;
      }
      return out;
    },
    seek(length2) {
      pos += length2;
    },
    get pos() {
      return pos;
    }
  };
}
function chunkReader(readChunk) {
  let pos = 0;
  let have = 0;
  let offset = 0;
  let currentChunk = new Uint8Array(0);
  const read7 = async (length2) => {
    have = currentChunk.length - offset;
    const bufa = (
      /** @type {Uint8Array<ArrayBufferLike>[]} */
      [currentChunk.subarray(offset)]
    );
    while (have < length2) {
      const chunk = await readChunk();
      if (chunk == null) {
        break;
      }
      if (have < 0) {
        if (chunk.length > have) {
          bufa.push(chunk.subarray(-have));
        }
      } else {
        bufa.push(chunk);
      }
      have += chunk.length;
    }
    currentChunk = new Uint8Array(bufa.reduce((p, c) => p + c.length, 0));
    let off = 0;
    for (const b of bufa) {
      currentChunk.set(b, off);
      off += b.length;
    }
    offset = 0;
  };
  return {
    async upTo(length2) {
      if (currentChunk.length - offset < length2) {
        await read7(length2);
      }
      return currentChunk.subarray(offset, offset + Math.min(currentChunk.length - offset, length2));
    },
    async exactly(length2, seek = false) {
      if (currentChunk.length - offset < length2) {
        await read7(length2);
      }
      if (currentChunk.length - offset < length2) {
        throw new Error("Unexpected end of data");
      }
      const out = currentChunk.subarray(offset, offset + length2);
      if (seek) {
        pos += length2;
        offset += length2;
      }
      return out;
    },
    seek(length2) {
      pos += length2;
      offset += length2;
    },
    get pos() {
      return pos;
    }
  };
}
function asyncIterableReader(asyncIterable) {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  async function readChunk() {
    const next = await iterator.next();
    if (next.done) {
      return null;
    }
    return next.value;
  }
  return chunkReader(readChunk);
}
function limitReader2(reader, byteLimit) {
  let bytesRead = 0;
  return {
    async upTo(length2) {
      let bytes2 = await reader.upTo(length2);
      if (bytes2.length + bytesRead > byteLimit) {
        bytes2 = bytes2.subarray(0, byteLimit - bytesRead);
      }
      return bytes2;
    },
    async exactly(length2, seek = false) {
      const bytes2 = await reader.exactly(length2, seek);
      if (bytes2.length + bytesRead > byteLimit) {
        throw new Error("Unexpected end of data");
      }
      if (seek) {
        bytesRead += length2;
      }
      return bytes2;
    },
    seek(length2) {
      bytesRead += length2;
      reader.seek(length2);
    },
    get pos() {
      return reader.pos;
    }
  };
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/promise-fs-opts.js
import fs3 from "fs";
import { promisify } from "util";
var hasFS = Boolean(fs3);
var _fsReadFn;
function fsread2(fd, buffer2, offset, length2, position) {
  if (!_fsReadFn) {
    _fsReadFn = promisify(fs3.read);
  }
  return _fsReadFn(fd, buffer2, offset, length2, position);
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/reader-browser.js
var CarReader = class {
  /**
   * @constructs CarReader
   * @param {CarHeader|CarV2Header} header
   * @param {Block[]} blocks
   */
  constructor(header, blocks) {
    this._header = header;
    this._blocks = blocks;
    this._keys = blocks.map((b) => b.cid.toString());
  }
  /**
   * @property
   * @memberof CarReader
   * @instance
   */
  get version() {
    return this._header.version;
  }
  /**
   * Get the list of roots defined by the CAR referenced by this reader. May be
   * zero or more `CID`s.
   *
   * @function
   * @memberof CarReader
   * @instance
   * @async
   * @returns {Promise<CID[]>}
   */
  async getRoots() {
    return this._header.roots;
  }
  /**
   * Check whether a given `CID` exists within the CAR referenced by this
   * reader.
   *
   * @function
   * @memberof CarReader
   * @instance
   * @async
   * @param {CID} key
   * @returns {Promise<boolean>}
   */
  async has(key) {
    return this._keys.indexOf(key.toString()) > -1;
  }
  /**
   * Fetch a `Block` (a `{ cid:CID, bytes:Uint8Array }` pair) from the CAR
   * referenced by this reader matching the provided `CID`. In the case where
   * the provided `CID` doesn't exist within the CAR, `undefined` will be
   * returned.
   *
   * @function
   * @memberof CarReader
   * @instance
   * @async
   * @param {CID} key
   * @returns {Promise<Block | undefined>}
   */
  async get(key) {
    const index = this._keys.indexOf(key.toString());
    return index > -1 ? this._blocks[index] : void 0;
  }
  /**
   * Returns a `BlockIterator` (`AsyncIterable<Block>`) that iterates over all
   * of the `Block`s (`{ cid:CID, bytes:Uint8Array }` pairs) contained within
   * the CAR referenced by this reader.
   *
   * @function
   * @memberof CarReader
   * @instance
   * @async
   * @generator
   * @returns {AsyncGenerator<Block>}
   */
  async *blocks() {
    for (const block of this._blocks) {
      yield block;
    }
  }
  /**
   * Returns a `CIDIterator` (`AsyncIterable<CID>`) that iterates over all of
   * the `CID`s contained within the CAR referenced by this reader.
   *
   * @function
   * @memberof CarReader
   * @instance
   * @async
   * @generator
   * @returns {AsyncGenerator<CID>}
   */
  async *cids() {
    for (const block of this._blocks) {
      yield block.cid;
    }
  }
  /**
   * Instantiate a {@link CarReader} from a `Uint8Array` blob. This performs a
   * decode fully in memory and maintains the decoded state in memory for full
   * access to the data via the `CarReader` API.
   *
   * @async
   * @static
   * @memberof CarReader
   * @param {Uint8Array} bytes
   * @returns {Promise<CarReader>}
   */
  static async fromBytes(bytes2) {
    if (!(bytes2 instanceof Uint8Array)) {
      throw new TypeError("fromBytes() requires a Uint8Array");
    }
    return decodeReaderComplete(bytesReader2(bytes2));
  }
  /**
   * Instantiate a {@link CarReader} from a `AsyncIterable<Uint8Array>`, such as
   * a [modern Node.js stream](https://nodejs.org/api/stream.html#stream_streams_compatibility_with_async_generators_and_async_iterators).
   * This performs a decode fully in memory and maintains the decoded state in
   * memory for full access to the data via the `CarReader` API.
   *
   * Care should be taken for large archives; this API may not be appropriate
   * where memory is a concern or the archive is potentially larger than the
   * amount of memory that the runtime can handle.
   *
   * @async
   * @static
   * @memberof CarReader
   * @param {AsyncIterable<Uint8Array>} asyncIterable
   * @returns {Promise<CarReader>}
   */
  static async fromIterable(asyncIterable) {
    if (!asyncIterable || !(typeof asyncIterable[Symbol.asyncIterator] === "function")) {
      throw new TypeError("fromIterable() requires an async iterable");
    }
    return decodeReaderComplete(asyncIterableReader(asyncIterable));
  }
};
async function decodeReaderComplete(reader) {
  const decoder2 = createDecoder(reader);
  const header = await decoder2.header();
  const blocks = [];
  for await (const block of decoder2.blocks()) {
    blocks.push(block);
  }
  return new CarReader(header, blocks);
}

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/reader.js
var CarReader2 = class extends CarReader {
  /**
   * Reads a block directly from a file descriptor for an open CAR file. This
   * function is **only available in Node.js** and not a browser environment.
   *
   * This function can be used in connection with {@link CarIndexer} which emits
   * the `BlockIndex` objects that are required by this function.
   *
   * The user is responsible for opening and closing the file used in this call.
   *
   * @async
   * @static
   * @memberof CarReader
   * @param {FileHandle | number} fd - A file descriptor from the
   * Node.js `fs` module. Either an integer, from `fs.open()` or a `FileHandle`
   * from `fs.promises.open()`.
   * @param {BlockIndex} blockIndex - An index pointing to the location of the
   * Block required. This `BlockIndex` should take the form:
   * `{cid:CID, blockLength:number, blockOffset:number}`.
   * @returns {Promise<Block>} A `{ cid:CID, bytes:Uint8Array }` pair.
   */
  static async readRaw(fd, blockIndex) {
    const { cid, blockLength: blockLength2, blockOffset } = blockIndex;
    const bytes2 = new Uint8Array(blockLength2);
    let read7;
    if (typeof fd === "number") {
      read7 = (await fsread2(fd, bytes2, 0, blockLength2, blockOffset)).bytesRead;
    } else if (typeof fd === "object" && typeof fd.read === "function") {
      read7 = (await fd.read(bytes2, 0, blockLength2, blockOffset)).bytesRead;
    } else {
      throw new TypeError("Bad fd");
    }
    if (read7 !== blockLength2) {
      throw new Error(`Failed to read entire block (${read7} instead of ${blockLength2})`);
    }
    return { cid, bytes: bytes2 };
  }
};

// node_modules/.pnpm/@ipld+car@5.4.2/node_modules/@ipld/car/src/encoder.js
var import_varint4 = __toESM(require_varint(), 1);

// node_modules/.pnpm/@storacha+client@1.7.9_encoding@0.1.13/node_modules/@storacha/client/dist/proof.js
var parse7 = async (str) => {
  try {
    const cid = parse4(str, base64);
    if (cid.code !== car_exports.code) {
      throw new Error(`non CAR codec found: 0x${cid.code.toString(16)}`);
    }
    if (cid.multihash.code !== identity.code) {
      throw new Error(`non identity multihash: 0x${cid.multihash.code.toString(16)}`);
    }
    try {
      const { ok: ok3, error: error4 } = await extract(cid.multihash.digest);
      if (error4)
        throw new Error("failed to extract delegation", { cause: error4 });
      return ok3;
    } catch {
      return legacyExtract(cid.multihash.digest);
    }
  } catch {
    return legacyExtract(base64.baseDecode(str));
  }
};
var legacyExtract = async (bytes2) => {
  const blocks = [];
  const reader = await CarReader2.fromBytes(bytes2);
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks);
};

// src/server.js
var knownWebDIDs = {
  // Production
  "did:web:up.storacha.network": "did:key:z6MkqdncRZ1wj8zxCTDUQ8CRT8NQWd63T7mZRvZUX8B7XDFi",
  "did:web:web3.storage": "did:key:z6MkqdncRZ1wj8zxCTDUQ8CRT8NQWd63T7mZRvZUX8B7XDFi",
  // legacy
  "did:web:w3s.link": "did:key:z6Mkha3NLZ38QiZXsUHKRHecoumtha3LnbYEL21kXYBFXvo5",
  "did:web:kms.storacha.network": "did:key:z6MksQJobJmBfPhjHWgFXVppqM6Fcjc1k7xu4z6xvusVrtKv",
  // Staging
  "did:web:staging.up.storacha.network": "did:key:z6MkhcbEpJpEvNVDd3n5RurquVdqs5dPU16JDU5VZTDtFgnn",
  "did:web:staging.web3.storage": "did:key:z6MkhcbEpJpEvNVDd3n5RurquVdqs5dPU16JDU5VZTDtFgnn",
  // legacy
  "did:web:staging.w3s.link": "did:key:z6MkqK1d4thaCEXSGZ6EchJw3tDPhQriwynWDuR55ayATMNf",
  "did:web:staging.kms.storacha.network": "did:key:z6MkmRf149D6oc9wq9ioXCsT5fgTn6esd7JjB9S5JnM4Y9qj"
};
async function createServer(ctx, service, env) {
  console.log("Creating server...");
  const validatorProofs = await getValidatorProofs(env);
  console.log("Validator proofs loaded: " + validatorProofs.length);
  const server = create8({
    id: ctx.ucanKmsSigner.withDID(ctx.ucanKmsIdentity.did()),
    codec: inbound2,
    service,
    validateAuthorization: () => ({ ok: {} }),
    resolveDIDKey,
    proofs: validatorProofs
  });
  console.log("Server created");
  return server;
}
var resolveDIDKey = async (did2) => {
  if (knownWebDIDs[did2]) {
    const didKey = (
      /** @type {`did:key:${string}`} */
      knownWebDIDs[did2]
    );
    return ok2(didKey);
  }
  return error3(new DIDKeyResolutionError(did2));
};
var cachedValidatorProofs;
var getValidatorProofs = async (env) => {
  if (cachedValidatorProofs) {
    return cachedValidatorProofs;
  }
  cachedValidatorProofs = [];
  if (env.UCAN_VALIDATOR_PROOF) {
    const proof = await parse7(env.UCAN_VALIDATOR_PROOF);
    const delegation = (
      /** @type {import('@ucanto/interface').Delegation} */
      proof
    );
    console.log(`Validator proof loaded: [issuer: ${delegation.issuer.did()}, audience: ${delegation.audience.did()}, capabilities: ${delegation.capabilities.map((c) => `{${c.can} @ ${c.with}}`).join(", ")}]`);
    cachedValidatorProofs = [delegation];
  }
  return cachedValidatorProofs;
};

// src/services/ucanValidation.js
var UcanPrivacyValidationServiceImpl = class {
  /**
   * Creates a new UCAN validation service
   * @param {Object} [options] - Service options
   * @param {AuditLogService} [options.auditLog] - Audit log service instance
   * @param {string} [options.environment] - Environment name for audit logging
   */
  constructor(options = {}) {
    this.auditLog = options.auditLog || new AuditLogService({
      serviceName: "ucan-validation-service",
      environment: options.environment || "unknown"
    });
    if (process.env.NODE_ENV === "development") {
      this.auditLog.logServiceInitialization("UcanPrivacyValidationService", true);
    }
  }
  /**
   * Validates an encryption setup invocation
   *
   * @param {import('@ucanto/interface').Invocation} invocation
   * @param {import('@storacha/capabilities/types').SpaceDID} spaceDID
   * @returns {Promise<import('@ucanto/server').Result<boolean, import('@ucanto/server').Failure>>}
   */
  async validateEncryption(invocation, spaceDID) {
    try {
      const setupCapability = invocation.capabilities.find(
        /** @param {{can: string}} cap */
        (cap) => cap.can === EncryptionSetup.can
      );
      if (!setupCapability) {
        const errorMsg = `Invocation does not contain ${EncryptionSetup.can} capability`;
        this.auditLog.logUCANValidationFailure(spaceDID, "encryption", errorMsg);
        throw new Error(errorMsg);
      }
      if (setupCapability.with !== spaceDID) {
        const errorMsg = `Invalid "with" in the invocation. Setup is allowed only for spaceDID: ${spaceDID}`;
        this.auditLog.logUCANValidationFailure(spaceDID, "encryption", errorMsg);
        throw new Error(errorMsg);
      }
      if (process.env.NODE_ENV === "development") {
        this.auditLog.logUCANValidationSuccess(spaceDID, "encryption");
      }
      return ok2(true);
    } catch (err) {
      console.error("[validateEncryption] something went wrong:", err);
      this.auditLog.logUCANValidationFailure(spaceDID, "validate_encryption", err instanceof Error ? err.message : String(err));
      return error3(new Failure("Encryption validation failed"));
    }
  }
  /**
   * Validates a decrypt delegation.
   * The invocation should have space/encryption/key/decrypt capability.
   * The delegation proof should contain space/content/decrypt capability.
   * The issuer of the invocation must be in the audience of the delegation.
   * The provided space must be the same as the space in the delegation.
   *
   * @param {import('@ucanto/interface').Invocation} invocation
   * @param {import('@storacha/capabilities/types').SpaceDID} spaceDID
   * @param {import('../api.types.js').Context} ctx
   * @param {import('../types/env.d.ts').Env} env
   * @returns {Promise<import('@ucanto/server').Result<boolean, import('@ucanto/server').Failure>>}
   */
  async validateDecryption(invocation, spaceDID, ctx, env) {
    try {
      const contentDecryptProofs = invocation.proofs.filter((proof) => {
        const delegation = (
          /** @type {import('@ucanto/interface').Delegation} */
          proof
        );
        const now2 = Math.floor(Date.now() / 1e3);
        return delegation.expiration > now2 && delegation.capabilities.some(
          (capability2) => capability2.can === decrypt.can && capability2.with === spaceDID
        );
      });
      if (contentDecryptProofs.length === 0) {
        const errorMsg = `No valid ${decrypt.can} delegation found in proofs!`;
        this.auditLog.logUCANValidationFailure(spaceDID, "decryption_proof", errorMsg);
        return error3(new Failure(errorMsg));
      }
      const decryptDelegation = (
        /** @type {import('@ucanto/interface').Delegation} */
        contentDecryptProofs[0]
      );
      if (invocation.issuer.did() !== decryptDelegation.audience.did()) {
        const errorMsg = "The invoker must be equal to the delegated audience!";
        this.auditLog.logUCANValidationFailure(spaceDID, "decryption_audience", errorMsg);
        return error3(new Failure(errorMsg));
      }
      const authorization = await access(
        /** @type {any} */
        decryptDelegation,
        {
          authority: ctx.ucanKmsIdentity,
          principal: Verifier,
          capability: decrypt,
          proofs: await getValidatorProofs(env),
          resolveDIDKey,
          validateAuthorization: () => ok2({})
        }
      );
      if (authorization.error) {
        console.error("@validateDecryption decryption delegation authorization failed:", authorization.error);
        const errorMsg = authorization.error.toString();
        this.auditLog.logUCANValidationFailure(spaceDID, "decryption_authorization", errorMsg);
        return error3(new Failure(errorMsg));
      }
      this.auditLog.logUCANValidationSuccess(spaceDID, "decryption");
      return ok2(true);
    } catch (err) {
      console.error("[validateDecryption] something went wrong:", err);
      this.auditLog.logUCANValidationFailure(spaceDID, "decryption", err instanceof Error ? err.message : String(err));
      return error3(new Failure("Decryption validation failed"));
    }
  }
};

// src/shared/identity.js
function createIdentity(principalKey, serviceDID) {
  const signer = ed25519_exports.Signer.parse(principalKey);
  const identity2 = signer.withDID(schema_exports3.DID.from(serviceDID));
  return { signer, identity: identity2 };
}

// src/handlers/encryptionSetup.js
async function handleEncryptionSetup(request, invocation, ctx, env) {
  const auditLog = new AuditLogService({
    serviceName: "encryption-setup-handler",
    environment: env.ENVIRONMENT || "unknown"
  });
  const startTime = Date.now();
  const invocationCid = invocation.cid?.toString();
  const proofs2 = invocation.proofs;
  try {
    if (!ctx.ucanKmsIdentity) {
      const errorMsg = "Encryption setup not available - ucanKms identity not configured";
      auditLog.logInvocation(request.space, EncryptionSetup.can, false, errorMsg, invocationCid, Date.now() - startTime);
      return error3(new Failure(errorMsg));
    }
    const ucanValidationResult = await ctx.ucanPrivacyValidationService.validateEncryption(invocation, request.space);
    if (ucanValidationResult?.error) {
      auditLog.logInvocation(request.space, EncryptionSetup.can, false, ucanValidationResult.error.message, invocationCid, Date.now() - startTime);
      return error3(ucanValidationResult.error);
    }
    const planResult = await ctx.subscriptionStatusService.isProvisioned(request.space, proofs2, ctx);
    if (planResult?.error) {
      const errorMsg = planResult.error.message || "Subscription validation failed";
      auditLog.logInvocation(request.space, EncryptionSetup.can, false, "Subscription validation failed: " + errorMsg, invocationCid, Date.now() - startTime);
      return error3(planResult.error);
    }
    const kmsResult = await ctx.kms.setupKeyForSpace(request, env);
    if (kmsResult.error) {
      console.error("[EncryptionSetup] KMS setup failed:", kmsResult.error.message);
      auditLog.logInvocation(request.space, EncryptionSetup.can, false, "KMS setup failed", invocationCid, Date.now() - startTime);
      return error3(kmsResult.error);
    }
    const { publicKey, algorithm: algorithm2, provider } = kmsResult.ok;
    if (!publicKey || !algorithm2 || !provider) {
      const errorMsg = "Missing public key, algorithm, or provider in encryption setup";
      auditLog.logInvocation(request.space, EncryptionSetup.can, false, errorMsg, invocationCid, Date.now() - startTime);
      return error3(new Failure(errorMsg));
    }
    const duration = Date.now() - startTime;
    auditLog.logInvocation(request.space, EncryptionSetup.can, true, void 0, invocationCid, duration);
    return ok2(kmsResult.ok);
  } catch (err) {
    console.error("[EncryptionSetup] Error during encryption setup:", err);
    auditLog.logInvocation(request.space, EncryptionSetup.can, false, err.message, invocationCid, Date.now() - startTime);
    return error3(new Failure("Encryption setup failed"));
  }
}

// src/handlers/keyDecryption.js
async function handleKeyDecryption(request, invocation, ctx, env) {
  const auditLog = new AuditLogService({
    serviceName: "key-decryption-handler",
    environment: env.ENVIRONMENT || "unknown"
  });
  const startTime = Date.now();
  const invocationCid = invocation.cid?.toString();
  const proofs2 = invocation.proofs;
  try {
    if (!ctx.ucanKmsIdentity) {
      const errorMsg = "Encryption not available - ucanKms identity not configured";
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, errorMsg, invocationCid, Date.now() - startTime);
      return error3(new Failure(errorMsg));
    }
    if (!request.encryptedSymmetricKey) {
      const errorMsg = "Missing encryptedSymmetricKey in invocation";
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, errorMsg, invocationCid, Date.now() - startTime);
      return error3(new Failure(errorMsg));
    }
    const validationResult = await ctx.ucanPrivacyValidationService?.validateDecryption(invocation, request.space, ctx, env);
    if (validationResult?.error) {
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, "UCAN validation failed", invocationCid, Date.now() - startTime);
      return error3(validationResult.error);
    }
    const planResult = await ctx.subscriptionStatusService.isProvisioned(request.space, proofs2, ctx);
    if (planResult?.error) {
      const errorMsg = planResult.error.message || "Subscription validation failed";
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, "Subscription validation failed: " + errorMsg, invocationCid, Date.now() - startTime);
      return error3(planResult.error);
    }
    const revocationResult = await ctx.revocationStatusClient.checkStatus(proofs2, request.space, env);
    if (revocationResult.error) {
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, "Revocation check failed", invocationCid, Date.now() - startTime);
      return error3(revocationResult.error);
    }
    const kmsResult = await ctx.kms.decryptSymmetricKey(request, env);
    if (kmsResult.error) {
      auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, "KMS decryption failed", invocationCid, Date.now() - startTime);
      return error3(kmsResult.error);
    }
    auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, true, void 0, invocationCid, Date.now() - startTime);
    return ok2({ decryptedSymmetricKey: kmsResult.ok.decryptedKey });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    auditLog.logInvocation(request.space, EncryptionKeyDecrypt.can, false, errorMessage, invocationCid, Date.now() - startTime);
    return error3(new Failure(errorMessage));
  }
}

// src/service.js
function createService(ctx, env) {
  const AudienceSchema = schema_exports3.literal(ctx.ucanKmsIdentity.did()).or(schema_exports3.literal(ctx.ucanKmsSigner.did()));
  return {
    space: {
      encryption: {
        setup: provideAdvanced({
          capability: EncryptionSetup,
          audience: AudienceSchema,
          handler: async ({ capability: capability2, invocation }) => {
            if (ctx.kmsRateLimiter) {
              const rateLimitViolation = await ctx.kmsRateLimiter.checkRateLimit(invocation, EncryptionSetup.can, capability2.with);
              if (rateLimitViolation) {
                return error3(new Failure(rateLimitViolation));
              }
            }
            const space2 = (
              /** @type {import('@storacha/capabilities/types').SpaceDID} */
              capability2.with
            );
            const request = {
              space: space2,
              location: capability2.nb?.location,
              keyring: capability2.nb?.keyring
            };
            const result = await handleEncryptionSetup(request, invocation, ctx, env);
            if (result.ok && ctx.kmsRateLimiter) {
              ctx.waitUntil(ctx.kmsRateLimiter.recordOperation(invocation, EncryptionSetup.can, capability2.with));
            }
            return result;
          }
        }),
        key: {
          decrypt: provideAdvanced({
            capability: EncryptionKeyDecrypt,
            audience: AudienceSchema,
            handler: async ({ capability: capability2, invocation }) => {
              if (ctx.kmsRateLimiter) {
                const rateLimitViolation = await ctx.kmsRateLimiter.checkRateLimit(invocation, EncryptionKeyDecrypt.can, capability2.with);
                if (rateLimitViolation) {
                  return error3(new Failure(rateLimitViolation));
                }
              }
              const space2 = (
                /** @type {import('@storacha/capabilities/types').SpaceDID} */
                capability2.with
              );
              const encryptedSymmetricKey = capability2.nb?.key;
              const request = {
                space: space2,
                encryptedSymmetricKey
              };
              const result = await handleKeyDecryption(request, invocation, ctx, env);
              if (result.ok && ctx.kmsRateLimiter) {
                ctx.waitUntil(ctx.kmsRateLimiter.recordOperation(invocation, EncryptionKeyDecrypt.can, capability2.with));
              }
              return result;
            }
          })
        }
      }
    }
  };
}

// src/shared/handler.js
async function handleUcanRequest(body, headers, ctx, env) {
  const service = ctx.service ?? createService(ctx, env);
  const server = ctx.server ?? await createServer(ctx, service, env);
  const response = await server.request({
    body: new Uint8Array(body),
    headers
  });
  const responseBody = response.body instanceof Uint8Array ? response.body : new Uint8Array(response.body);
  return { body: responseBody, headers: response.headers };
}

// src/start-local.js
var localSubscriptionService = {
  async isProvisioned() {
    return { ok: { isProvisioned: true } };
  }
};
var DEFAULT_PORT = 8787;
var DEFAULT_DATA_DIR = join2(homedir(), ".ucan-kms");
async function startLocalServer(config) {
  const port = config.port || DEFAULT_PORT;
  const dataDir = config.dataDir || DEFAULT_DATA_DIR;
  let signer, identity2;
  if (config.principalKey) {
    ({ signer, identity: identity2 } = createIdentity(
      config.principalKey,
      config.serviceDID || ""
    ));
  } else {
    signer = await ed25519_exports.generate();
    identity2 = signer;
  }
  const auditLog = new AuditLogService({
    serviceName: "ucan-kms-local",
    environment: "local"
  });
  const mappings = new FileSpaceKeyMappingStore(dataDir);
  const kms = new OnePasswordKMSService({
    createClient: async (accountName) => (0, import_sdk.createClient)({
      auth: new import_sdk.DesktopAuth(accountName),
      integrationName: "storacha-ucan-kms",
      integrationVersion: "1.0.0"
    }),
    mappings,
    auditLog
  });
  const ctx = {
    ucanKmsSigner: signer,
    ucanKmsIdentity: identity2,
    kms,
    kmsRateLimiter: {
      checkRateLimit: async () => null,
      recordOperation: async () => {
      },
      getRateLimitStatus: async () => {
        return {
          spaceCount: 0,
          userCount: 0,
          globalCount: 0,
          limits: null
        };
      }
    },
    revocationStatusClient: new RevocationStatusClientImpl({ auditLog }),
    subscriptionStatusService: localSubscriptionService,
    ucanPrivacyValidationService: new UcanPrivacyValidationServiceImpl({
      auditLog
    }),
    waitUntil: (p) => p.catch((err) => console.error("Background task error:", err))
  };
  const env = (
    /** @type {any} */
    {
      ENVIRONMENT: "local",
      UCAN_KMS_SERVICE_DID: identity2.did()
    }
  );
  const server = createHttpServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200);
        res.end(
          `\u{1F525} ucan-kms (local/1password)
${identity2.did()}
${signer.did()}`
        );
        return;
      }
      if (req.method !== "POST" || req.url !== "/") {
        res.writeHead(405);
        res.end();
        return;
      }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      const headers = (
        /** @type {Record<string, string>} */
        {}
      );
      for (const [k, v] of Object.entries(req.headers)) {
        if (typeof v === "string") headers[k] = v;
      }
      const result = await handleUcanRequest(
        body.buffer,
        headers,
        ctx,
        /** @type {any} */
        env
      );
      res.writeHead(200, result.headers);
      res.end(Buffer.from(result.body));
    } catch (err) {
      console.error("Error processing request:", err);
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`\u{1F525} ucan-kms local server running at http://127.0.0.1:${port}`);
    console.log("   Provider: 1Password");
    console.log(`   Data dir: ${dataDir}`);
    console.log(`   Identity: ${identity2.did()}`);
  });
  return server;
}

// src/local-server.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = parseInt(process.env.PORT || String(DEFAULT_PORT), 10);
  const dataDir = process.env.UCAN_KMS_DATA_DIR || DEFAULT_DATA_DIR;
  startLocalServer({
    dataDir,
    port,
    principalKey: process.env.UCAN_KMS_PRINCIPAL_KEY,
    serviceDID: process.env.UCAN_KMS_SERVICE_DID
  }).catch((err) => {
    console.error("Failed to start local server:", err);
    process.exit(1);
  });
}
/*! Bundled license information:

@noble/ed25519/lib/esm/index.js:
  (*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
