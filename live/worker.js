import {createPePawRoute} from './pepaw/private-route.mjs';
import {bindCurrentWorker} from './duckville-private/current-worker-adapter.mjs';
import {readDuckvillePrivateFile} from './duckville-private/storage.mjs';
import {chimeStaticResponse} from "./wind-chimes-static.js";
import { handleAnnouncementMedia } from "./ohana-announcement-media.js";
import { env as OHANA_PUSH_ENV } from "cloudflare:workers";
import { shuffleMode, shuffleInit, shuffleMove, shuffleView, chooseShuffleBotMove } from "./shuffle-engine.js";
import { handleMusicUpload, handleMusicAudio, createMusicPlaybackTicket } from "./ohana-music-upload.js";
import OHANA_COLOR_ENTRANCE from "./ohana-color-entrance-v1.webp";
import OHANA_MENU_HIDE_NOTICE from "./ohana-announcement-menu-hide-v1.jpg";
import OHANA_SHUFFLE_ENTRANCE from "./ohana-shuffle-entrance-v1.webp";
import OHANA_TILE_ENTRANCE from "./ohana-tile-entrance-v1.webp";
import OHANA_ROOM_GUIDE_JOURNEY from "./ohana-guide-journey-v1.webp";
import OHANA_ROOM_GUIDE_BLESSINGS from "./ohana-guide-blessings-v1.webp";
import OHANA_ROOM_GUIDE_UNITED from "./ohana-guide-united-v1.webp";
import OHANA_ROOM_GUIDE_BRIDGE from "./ohana-guide-bridge-v1.webp";
import OHANA_ROOM_GUIDE_MEMORIES from "./ohana-guide-memories-v1.webp";
import OHANA_BRIDGE_COMMAND_ICONS from "./ohana-bridge-command-icons-v1.webp";
import OHANA_BRIDGE_RECORD from "./ohana-hub-record-player-v1.webp";
import OHANA_BRIDGE_PORTRAIT from "./ohana-bridge-setting-portrait-v1.webp";
import OHANA_BRIDGE_LANDSCAPE from "./ohana-bridge-setting-v1.webp";
import OHANA_FAMILY_BIBLE_TABLE from "./ohana-family-bible-table-v1.webp";
import JOURNEY_COLORING_CHARACTER from "./journey-coloring-character-v1.webp";
import JOURNEY_COLORING_ENTRANCE from "./ohana-journey-entrance-v1.webp";
import OHANA_BLESSINGS_SIGN from "./ohana-blessings-prayer-sign-v1.webp";
import OHANA_UNITED_SIGN from "./ohana-united-puzzle-sign-v1.webp";
import ACTION_BOWLS from "./ohana-action-bowls-v1.webp";
import CARDINAL_CONTROL from "./ohana-cardinal-control-v1.webp";
import CARDINAL_DADDY_CAP from "./ohana-cardinal-daddy-cap-v1.png";
import CARDINAL_DADDY_CAP_REVERSE from "./ohana-cardinal-daddy-cap-reverse-v1.png";
import { seniorRoute } from "./senior-access.js";
import SENIOR_SETUP_HTML from "./senior-setup.html";
import OHANA_GRANNY_FINAL_0 from "./ohana-granny-crossword-cherish-20261013.webp";
import OHANA_GRANNY_FINAL_1 from "./ohana-granny-wordfind-cherish-20261013.webp";
import OHANA_GRANNY_FINAL_2 from "./ohana-granny-wordmix-cherish-20261013.webp";
import OHANA_GRANNY_FINAL_3 from "./ohana-granny-rocking-chair-cherish-20261013.webp";
import OHANA_TEN_ROOM_V103 from "./ohana-ten-room-v103.webp";
import OHANA_WORKSTATION_V103 from "./ohana-workstation-v103.webp";
import OHANA_TEAL_MAT_V103 from "./ohana-teal-mat-v103.webp";
import WARDROBE_V92_0 from "./wardrobe-eddie-explorer-v92.webp";
import WARDROBE_V92_1 from "./wardrobe-eddie-sunday-best-v92.webp";
import WARDROBE_V92_2 from "./wardrobe-honu-chef-v92.webp";
import WARDROBE_V92_3 from "./wardrobe-honu-explorer-v92.webp";
import WARDROBE_V92_4 from "./wardrobe-honu-gardener-v92.webp";
import WARDROBE_V92_5 from "./wardrobe-honu-sunday-best-v92.webp";
import WARDROBE_V92_6 from "./wardrobe-splash-chef-v92.webp";
import WARDROBE_V92_7 from "./wardrobe-splash-pilot-v92.webp";
import WARDROBE_V92_8 from "./wardrobe-splash-doctor-v92.webp";
import WARDROBE_V92_9 from "./wardrobe-splash-explorer-v92.webp";
import WARDROBE_V92_10 from "./wardrobe-splash-gardener-v92.webp";
import WARDROBE_V92_11 from "./wardrobe-splash-sunday-best-v92.webp";
import WARDROBE_V92_12 from "./wardrobe-kiko-chef-v92.webp";
import WARDROBE_V92_13 from "./wardrobe-kiko-police-v92.webp";
import WARDROBE_V92_14 from "./wardrobe-kiko-firefighter-v92.webp";
import WARDROBE_V92_15 from "./wardrobe-kiko-doctor-v92.webp";
import WARDROBE_V92_16 from "./wardrobe-kiko-gardener-v92.webp";
import WARDROBE_V92_17 from "./wardrobe-kiko-sunday-best-v92.webp";
import WARDROBE_V92_18 from "./wardrobe-pebble-chef-v92.webp";
import WARDROBE_V92_19 from "./wardrobe-pebble-police-v92.webp";
import WARDROBE_V92_20 from "./wardrobe-pebble-firefighter-v92.webp";
import WARDROBE_V92_21 from "./wardrobe-pebble-doctor-v92.webp";
import WARDROBE_V92_22 from "./wardrobe-pebble-explorer-v92.webp";
import WARDROBE_V92_23 from "./wardrobe-pebble-gardener-v92.webp";
import WARDROBE_V92_24 from "./wardrobe-pebble-sunday-best-v92.webp";
import WARDROBE_V92_25 from "./wardrobe-mango-chef-v92.webp";
import WARDROBE_V92_26 from "./wardrobe-mango-police-v92.webp";
import WARDROBE_V92_27 from "./wardrobe-mango-firefighter-v92.webp";
import WARDROBE_V92_28 from "./wardrobe-mango-doctor-v92.webp";
import WARDROBE_V92_29 from "./wardrobe-mango-explorer-v92.webp";
import WARDROBE_V92_30 from "./wardrobe-mango-gardener-v92.webp";
import WARDROBE_V92_31 from "./wardrobe-mango-sunday-best-v92.webp";
import WARDROBE_V92_32 from "./wardrobe-sunny-police-v92.webp";
import WARDROBE_V92_33 from "./wardrobe-sunny-firefighter-v92.webp";
import WARDROBE_V92_34 from "./wardrobe-sunny-doctor-v92.webp";
import WARDROBE_V92_35 from "./wardrobe-sunny-explorer-v92.webp";
import WARDROBE_V92_36 from "./wardrobe-sunny-gardener-v92.webp";
import WARDROBE_V92_37 from "./wardrobe-sunny-sunday-best-v92.webp";
import WARDROBE_V92_38 from "./wardrobe-otto-chef-v92.webp";
import WARDROBE_V92_39 from "./wardrobe-otto-police-v92.webp";
import WARDROBE_V92_40 from "./wardrobe-otto-firefighter-v92.webp";
import WARDROBE_V92_41 from "./wardrobe-otto-doctor-v92.webp";
import WARDROBE_V92_42 from "./wardrobe-otto-explorer-v92.webp";
import WARDROBE_V92_43 from "./wardrobe-otto-sunday-best-v92.webp";
import WARDROBE_V92_44 from "./wardrobe-pippa-chef-v92.webp";
import WARDROBE_V92_45 from "./wardrobe-pippa-police-v92.webp";
import WARDROBE_V92_46 from "./wardrobe-pippa-firefighter-v92.webp";
import WARDROBE_V92_47 from "./wardrobe-pippa-doctor-v92.webp";
import WARDROBE_V92_48 from "./wardrobe-pippa-explorer-v92.webp";
import WARDROBE_V92_49 from "./wardrobe-pippa-sunday-best-v92.webp";
import WARDROBE_V92_50 from "./wardrobe-lulu-chef-v92.webp";
import WARDROBE_V92_51 from "./wardrobe-lulu-police-v92.webp";
import WARDROBE_V92_52 from "./wardrobe-lulu-firefighter-v92.webp";
import WARDROBE_V92_53 from "./wardrobe-lulu-doctor-v92.webp";
import WARDROBE_V92_54 from "./wardrobe-lulu-explorer-v92.webp";
import WARDROBE_V92_55 from "./wardrobe-lulu-gardener-v92.webp";
import WARDROBE_V92_56 from "./wardrobe-lulu-sunday-best-v92.webp";
import OHANA_GRANNY_ROOM_V89 from "./ohana-granny-room-v89.webp";
import OHANA_MEMORIES_ROOM_V89 from "./ohana-memories-room-v89.webp";
import OHANA_GRANNY_NOOK_V86 from "./ohana-granny-nook-v86.webp";
import MEMORIES_HTML from "./ohana-memories.html";
import SPADES_BID_CHECK_HTML from "./ohana-spades-bid-check.html";
import MEMORIES_LAYOUT_CHECK_HTML from "./ohana-memories-layout-check.html";
import O10_TOUCH_CHECK_HTML from "./ohana-o10-touch-check.html";
import WORDS_DRAFT_CHECK_HTML from "./ohana-words-draft-check.html";
import PUZZLE_DEPLOY_CHECK_HTML from "./ohana-puzzle-deploy-check.html";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process6 extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process6.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// worker.js
import OHANA_EXPANSION_0 from "./387f326976919b0cd600e867ce7e22039c453449-ohana-a00-v1.webp";
import OHANA_EXPANSION_1 from "./a9dca8a704f1189f5410a8ac9264d89a1c5a267f-ohana-a01-v1.webp";
import OHANA_EXPANSION_2 from "./0888a80e8c56e241c4f18811c5ce8a61e7ccfd77-ohana-a02-v1.webp";
import OHANA_EXPANSION_3 from "./5d5bc483f61151e021f264b4c0e414d1155a97fc-ohana-a03-v1.webp";
import OHANA_EXPANSION_4 from "./7c8b435e1f47341f71875725a1c0bc7c2f039bf9-ohana-a04-v1.webp";
import OHANA_EXPANSION_5 from "./9ac579441d9cadc4d16ec2686200ca203c7526b9-ohana-a05-v1.webp";
import OHANA_EXPANSION_6 from "./7068fe3f61ea901427c7e87bb86f5166f1c71b30-ohana-a06-v1.webp";
import OHANA_EXPANSION_7 from "./002d7463675da88d7b9886710de1ec488287be71-ohana-a07-v1.webp";
import OHANA_EXPANSION_8 from "./4e25fa8fbd9eef810e856f11eba4dc13bf49ff05-ohana-a08-v1.webp";
import OHANA_EXPANSION_9 from "./b816e8976491d0d8fd86daea95b5186966c631da-ohana-a09-v1.webp";
import OHANA_EXPANSION_10 from "./8735c714c0411d4d96035fb3b7cd06088c3d62a9-ohana-a13-v1.webp";
import OHANA_EXPANSION_11 from "./600bf17149fe114a017aad46adeb2bc8310ef34c-ohana-a14-v1.webp";
import OHANA_EXPANSION_12 from "./fb8c5701005316418b55fc22472bac52ec539f9a-ohana-a15-v1.webp";
import OHANA_EXPANSION_13 from "./ccfd50902c1c78dc9bb50c92c1e3a4524d97886e-ohana-a16-v1.webp";
import OHANA_EXPANSION_14 from "./a7b61bc10fe6c264394e17238f5dd276ed31d71c-ohana-a17-v1.webp";
import OHANA_EXPANSION_15 from "./714f95ae66dd145a47dcabe3c3816b8056cfdaba-ohana-a18-v1.webp";
import OHANA_EXPANSION_16 from "./5b1d44382af249cc2eae1d7019d89420d8b911e8-ohana-a19-v1.webp";
import OHANA_EXPANSION_17 from "./d910bed95b5a55c2c51e8fd94b2762166fe5bd9b-ohana-a20-v1.webp";
import OHANA_EXPANSION_18 from "./c55ff2f1386441982ba4951e8322e5fb22027ce1-ohana-a22-v1.webp";
import OHANA_EXPANSION_19 from "./d192e1a607fd19550b7338ca997ea3f2b8c3ffdd-ohana-a23-v1.webp";
import OHANA_EXPANSION_20 from "./8262ea84e52d79dbdc5739d840707389d11676aa-ohana-a25-v1.webp";
import OHANA_EXPANSION_21 from "./fafdba7eef04825aeeab616bf534d87bfbc6a87b-ohana-a26-v1.webp";
import OHANA_EXPANSION_22 from "./7350d6068f2a6dd48e6251abc2768bb74f31be08-ohana-a27-v1.webp";
import OHANA_EXPANSION_23 from "./b7f3c5ed98b4ab2c12f10919724d43e43d87030c-ohana-a28-v1.webp";
import OHANA_EXPANSION_24 from "./7da6d80e58b4ffee88e57a236cfcd21661dcbfbb-ohana-a29-v1.webp";
import OHANA_EXPANSION_25 from "./699300d3f816f35501b84c6defe4e437082cb266-ohana-a30-v1.webp";
import OHANA_EXPANSION_26 from "./d1c04bac30808500d526096772bc4cf3809f6ab0-ohana-a31-v1.webp";
import OHANA_EXPANSION_27 from "./486f33a6259293155eaa84eb53a3c42c4073795a-ohana-a32-v1.webp";
import OHANA_EXPANSION_28 from "./46bc001496376ce46e8c780b8e9cd4dce4e1f58a-ohana-a33-v1.webp";
import OHANA_EXPANSION_29 from "./8db49ed325a3165d3560a9a5f67b5cfac9751468-ohana-a34-v1.webp";
import OHANA_EXPANSION_30 from "./558713f30db908a442f14eb3f70a629ae663a2ef-ohana-a35-v1.webp";
import OHANA_EXPANSION_31 from "./2134243dafe739ad7eb6ee4b33f4f30d05f16021-ohana-a36-v1.webp";
import OHANA_EXPANSION_32 from "./2f862e07b9087359560074518c251bdd43496f55-ohana-a37-v1.webp";
import OHANA_EXPANSION_33 from "./573caa752341f026cb7d35eedb4394713cc8c790-ohana-a38-v1.webp";
import OHANA_EXPANSION_34 from "./bb6155397548cbca171b8af8a1ea867774a72301-ohana-a39-v1.webp";
import OHANA_EXPANSION_35 from "./73052462eed32a8cdccf192311e01a3fd6e91a3d-ohana-a40-v1.webp";
import OHANA_EXPANSION_36 from "./515aa53b8c04a68319c09140df018bd29362dc6e-ohana-a41-v1.webp";
import OHANA_EXPANSION_37 from "./a04f3554ca30e251aeae733e5227c077eb009068-ohana-a43-v1.webp";
import OHANA_EXPANSION_38 from "./7dc382dd728c67c0585681895d45f4d8a981bd58-ohana-a44-v1.webp";
import OHANA_EXPANSION_39 from "./65182b054339d158dbed69c777654aba12048829-ohana-a45-v1.webp";
import OHANA_EXPANSION_40 from "./37705b46b57754e5bdc3f4a88bb38f5111e5e5e5-ohana-a46-v1.webp";
import OHANA_EXPANSION_41 from "./9ece26f6f553f89b7d58e041ec7fcd83e048fbc8-ohana-a47-v1.webp";
import OHANA_EXPANSION_42 from "./12d41db245f626760cb5e3073fba9e56fc2b603a-ohana-a48-v1.webp";
import OHANA_EXPANSION_43 from "./3d4aa58cb27d73f1e2b22a60d0a527d98c85b40c-ohana-a49-v1.webp";
import OHANA_EXPANSION_44 from "./3c2576db5a25dade0cc386396b0382fc222c2631-ohana-a50-v1.webp";
import OHANA_EXPANSION_45 from "./e045877b3124452e2d57ec14471be13c5e67fc70-ohana-a51-v1.webp";
import OHANA_EXPANSION_46 from "./06fe53f7770f1c1dd385ab381140281fdbf67815-ohana-a52-v1.webp";
import OHANA_EXPANSION_47 from "./79e3d6d219aff0339a6c857c22c1fcca8736e323-ohana-a53-v1.webp";
import OHANA_EXPANSION_48 from "./c07660a4c1103f6034e527114aa0d5eac705955b-ohana-a54-v1.webp";
import OHANA_EXPANSION_49 from "./cddad90701f6cf4733ad375df8f4750ed7e03b5a-ohana-a55-v1.webp";
import OHANA_EXPANSION_50 from "./ad3fce8081eb12a2e258f50972f71055618db34e-ohana-a56-v1.webp";
import OHANA_EXPANSION_51 from "./714851f820d230fdf31d7ca6c3360092438969b2-ohana-a57-v1.webp";
import OHANA_EXPANSION_52 from "./b8449ac26701e546cda4cb8e025b6ef47eb55446-ohana-a58-v1.webp";
import OHANA_EXPANSION_53 from "./672caad052fad94203c41e525ada1582d5d70d61-ohana-a59-v1.webp";
import OHANA_EXPANSION_54 from "./d36afe34f04172cb7573a43721eaddff600270ba-ohana-a60-v1.webp";
import OHANA_EXPANSION_55 from "./07b753b2057b27b97d3075c4f579028c36c2ca42-ohana-a61-v1.webp";
import OHANA_EXPANSION_56 from "./de9d9d02ed51accf016ef2e3a52227e60adb0e6c-ohana-a62-v1.webp";
import OHANA_EXPANSION_57 from "./373aa2af78dfe63e35f9cfef3833df7e7b0c56e1-ohana-a63-v1.webp";
import OHANA_EXPANSION_58 from "./0e39e7863e02e412efe2116e8ae1121de996b553-ohana-a64-v1.webp";
import OHANA_EXPANSION_59 from "./f51e0c8ff2e28ea4aa63aac8c878d0e6ccbac700-ohana-a65-v1.webp";
import OHANA_EXPANSION_60 from "./a99ef9ee3f2d530f7132b6be6afae4375f60dd9d-ohana-a66-v1.webp";
import OHANA_EXPANSION_61 from "./bb44ec070b3f52b26a972040220c3921b5595153-ohana-a67-v1.webp";
import OHANA_EXPANSION_62 from "./4490b95bb6fc393021cb0fc5db3f85700db6c13d-ohana-a68-v1.webp";
import OHANA_EXPANSION_63 from "./9c87b3d4507a9a0d3beadf62066dabf4ac131a64-ohana-a69-v1.webp";
import OHANA_EXPANSION_64 from "./90a40fdb4fcb7a5ec7ff42fd1b15dceca725ada4-ohana-a70-v1.webp";
import OHANA_EXPANSION_65 from "./93c1408cf0dc1439a7fb09034c8ba8c6a90aaf86-ohana-a71-v1.webp";
import OHANA_EXPANSION_66 from "./b1bbda96ef6bbce7dfef6e7deef667d5ad5e7f75-ohana-a72-v1.webp";
import OHANA_EXPANSION_67 from "./b09779a0168038a307039957f7f5f615fd695ee3-ohana-a73-v1.webp";
import OHANA_EXPANSION_68 from "./f62e701b11d48d628898d0aee06f81e09e9746bb-ohana-a74-v1.webp";
import OHANA_EXPANSION_69 from "./172edb336518a6bcc6998133a48b068561d5af47-ohana-a75-v1.webp";
import OHANA_EXPANSION_70 from "./e2830952fdd29cef39878e17eaaf7cbfaccefc95-ohana-a76-v1.webp";
import OHANA_EXPANSION_71 from "./a52829d5fc47df0c02f662c824fae57a68da9a14-ohana-a77-v1.webp";
import OHANA_EXPANSION_72 from "./5ed3730b2de6b6dbff4c88c8294a2d255e32e9ff-ohana-a78-v1.webp";
import OHANA_EXPANSION_73 from "./5aef6c259c54e61cbcbdbd53f170584ecf1faa5f-ohana-a79-v1.webp";
import OHANA_EXPANSION_74 from "./8a715de144c6af3c47fbd40bfdd61fe85600c7f9-ohana-a80-v1.webp";
import OHANA_EXPANSION_75 from "./d2f7ff10e46e3a07726e669ee8d63f637720880d-ohana-a82-v1.webp";
import OHANA_EXPANSION_76 from "./dc845c2b4714e56ee5ab173681fed2d07470635a-ohana-a83-v1.webp";
import OHANA_EXPANSION_77 from "./5c2e12d2b5ddee3e50bc3123a4591b61b6d11800-ohana-a84-v1.webp";
import OHANA_EXPANSION_78 from "./a8b2b4f4011c071efd3bef1a8e897762baccacb1-ohana-a85-v1.webp";
import OHANA_EXPANSION_79 from "./24c987dbd2318aa82a49ed69fbda4ad02a0749cd-ohana-a86-v1.webp";
import OHANA_EXPANSION_80 from "./076c39f90d6583e3f51aa873eb9e3416c542257a-ohana-a87-v1.webp";
import OHANA_EXPANSION_81 from "./1a1ba199114d79809cae3ce74e370882349c892b-ohana-a89-v1.webp";
import OHANA_EXPANSION_82 from "./a99e18fd25fbcf27e8cb84b5b6199f7247a709df-ohana-a90-v1.webp";
import OHANA_EXPANSION_83 from "./2f07da6c2f4cd58146f3d66388c25c9f425e5f05-ohana-a91-v1.webp";
import OHANA_EXPANSION_84 from "./8073bd15e68b85e4f2810bcb8cd00b8ec6668134-ohana-a92-v1.webp";
import OHANA_EXPANSION_85 from "./fa60cd706c2238f2a6a7bd8b738d746afdd0fb79-ohana-a93-v1.webp";
import OHANA_EXPANSION_86 from "./a1de73ae55bb25d85e5f831a7aca21c608a53e37-ohana-a94-v1.webp";
import OHANA_EXPANSION_87 from "./cd72d5e583b0d151f5136a564dbbd5aeeed9507b-ohana-a95-v1.webp";
import OHANA_EXPANSION_88 from "./c6402122c7c726b24c49ab4dcf8faf600a68a268-ohana-a97-v1.webp";
import OHANA_EXPANSION_89 from "./9853d3cdda1b4273c3e0724dcb69ab16756d3c8b-ohana-a98-v1.webp";
import OHANA_EXPANSION_90 from "./a75ba5e0ac5800ef67ab90149efaf23dcc21b63c-ohana-a99-v1.webp";
import OHANA_EXPANSION_91 from "./b0a395638959d61762af8e818efb217a6a790c75-ohana-c00-v1.webp";
import OHANA_EXPANSION_92 from "./5a7fdd18b557766957b9db318e88ccd5f9c892fc-ohana-c01-v1.webp";
import OHANA_EXPANSION_93 from "./f12ab9c769515fa8222743bb26857f14017a28da-ohana-c02-v1.webp";
import OHANA_EXPANSION_94 from "./96cfbbcea64240dc9356593b3d11b6e85ad1b487-ohana-c03-v1.webp";
import OHANA_EXPANSION_95 from "./0bae4b32831a14ce7064c288f703d4499cf0f916-ohana-c04-v1.webp";
import OHANA_EXPANSION_96 from "./4a07b35394913c12ef7e8db2a391f6ff80836710-ohana-c05-v1.webp";
import OHANA_EXPANSION_97 from "./db0e98395d11d4eae7668977a26056dd4a0e9125-ohana-c06-v1.webp";
import OHANA_EXPANSION_98 from "./8b39910a305ec6244ace652ad0b76cc678cfcc02-ohana-c07-v1.webp";
import OHANA_EXPANSION_99 from "./0b71ba12b7733a7244b52316b079a5bb9b55e244-ohana-c08-v1.webp";
import OHANA_EXPANSION_100 from "./b0320e9d8eb6bcff69ebc918bdbb5f344e3d76d5-ohana-c09-v1.webp";
import OHANA_EXPANSION_101 from "./4999ab02c79a1167d410f4062608a6f4fcfb8402-ohana-c10-v1.webp";
import OHANA_EXPANSION_102 from "./5d991a0bb63497a5ca97e5a735e39ce3a73e8008-ohana-c11-v1.webp";
import OHANA_EXPANSION_103 from "./7bb857504e4a6288c1f5ce63f3209217b4e1f767-ohana-c12-v1.webp";
import OHANA_EXPANSION_104 from "./df77bce16be84b0b9bc9b9a450026cfcaf2a5fd7-ohana-c13-v1.webp";
import OHANA_EXPANSION_105 from "./1cd4a81bec0d10e7f6b66ede2c9bf3c2ec94bd12-ohana-c14-v1.webp";
import OHANA_EXPANSION_106 from "./0e68efd809308f9edcfb8acdbba35167fa74b004-ohana-c15-v1.webp";
import OHANA_EXPANSION_107 from "./d3c76d7e6605b273a3c86912b6b2ac0650698d2a-ohana-c16-v1.webp";
import OHANA_EXPANSION_108 from "./bcc058a8179e529071a179403fa131abeb1021c1-ohana-c17-v1.webp";
import OHANA_EXPANSION_109 from "./6aed81145ce15adfdc5817e1e5d1b366f65d4685-ohana-c18-v1.webp";
import OHANA_EXPANSION_110 from "./9a5299048d9ed9c98140e945a4291db0845b5dbe-ohana-c19-v1.webp";
import OHANA_EXPANSION_111 from "./54cd29bd66c10f4310bc302e98d5b6a8dcdbb7ec-ohana-c20-v1.webp";
import OHANA_EXPANSION_112 from "./95a88f1057248022f13a4eb47073249f09cb814a-ohana-c21-v1.webp";
import OHANA_EXPANSION_113 from "./71fb5bd622ad6598ff07ff156b61ad848eb106c1-ohana-c22-v1.webp";
import OHANA_EXPANSION_114 from "./e842aecbb0370c4a5bfcaa1ba7527efb4814cc17-ohana-c23-v1.webp";
import OHANA_EXPANSION_115 from "./1bc3e80491a337961e5f93479a818baaea6ab123-ohana-c24-v1.webp";
import OHANA_EXPANSION_116 from "./a11cb073b23721d9c1f38b083e1e0563e8e7516e-ohana-c25-v1.webp";
import OHANA_EXPANSION_117 from "./469d85b982b9284514aea503c6674b4e1f5a451e-ohana-c26-v1.webp";
import OHANA_EXPANSION_118 from "./82e2ab33b9f88a9414fe3985c2f8deb1aba851de-ohana-c28-v1.webp";
import OHANA_EXPANSION_119 from "./b3b4c9948a2763c246782aee9819a854ca9fbd55-ohana-c29-v1.webp";
import OHANA_EXPANSION_120 from "./721679c9357661d7eb97cfba7dbe5405d76e807e-ohana-c30-v1.webp";
import OHANA_EXPANSION_121 from "./10ef840be16771438084dde529fd270d8c796f4f-ohana-c31-v1.webp";
import OHANA_EXPANSION_122 from "./b89fa3fae3a7deae391e05d0f54187e45afaf158-ohana-c32-v1.webp";
import OHANA_EXPANSION_123 from "./ac9c07018c49846d4124a2f9e96d1075c995d1cd-ohana-c33-v1.webp";
import OHANA_EXPANSION_124 from "./88e8a84fd5bdd0535db885be07e21b346971930e-ohana-c34-v1.webp";
import OHANA_EXPANSION_125 from "./c99922db806f81e3b16880f58e2e9d2e466b399e-ohana-c35-v1.webp";
import OHANA_EXPANSION_126 from "./ee99ded7ac604c42aca3dd65d8cc74a8f11958d0-ohana-c36-v1.webp";
import OHANA_EXPANSION_127 from "./41b28d3c706cb1a691b606cdce79b9321e6ab363-ohana-c37-v1.webp";
import OHANA_EXPANSION_128 from "./22c4e17820572b1cb8748b82f8adfc8aa87fef96-ohana-c38-v1.webp";
import OHANA_EXPANSION_129 from "./0ce6f19d77799e2d4acdb5f95232e53504768e23-ohana-c39-v1.webp";
import OHANA_EXPANSION_130 from "./a4f80761e53918bc776d9896f12678a482e95342-ohana-l00-v1.webp";
import OHANA_EXPANSION_131 from "./a3932c86afc35840e9aa7ce272e83aa0d1f6317a-ohana-l01-v1.webp";
import OHANA_EXPANSION_132 from "./7bc2ac6011eecdc6b31a03bfa8d50504f223802e-ohana-l02-v1.webp";
import OHANA_EXPANSION_133 from "./fdef3879a69b779b1030399f664b49fcd84056a4-ohana-l03-v1.webp";
import OHANA_EXPANSION_134 from "./4de8968f9b62604003d6c8e24d0eb0f3ae444047-ohana-l04-v1.webp";
import OHANA_EXPANSION_135 from "./08ca5892a76449db8d19d0ea4273f0df6c4eaec3-ohana-l05-v1.webp";
import OHANA_EXPANSION_136 from "./f83fa958604406481bca10dd2dafed71b7b23e0a-ohana-l06-v1.webp";
import OHANA_EXPANSION_137 from "./e259425fb55fb345d7b3af61863203ba63a550e4-ohana-l07-v1.webp";
import OHANA_EXPANSION_138 from "./6ea12e168453f3511738dd4120e9b5057710c10c-ohana-l08-v1.webp";
import OHANA_EXPANSION_139 from "./abac955ff6adec1c909489483fa3163acb5091c7-ohana-l09-v1.webp";
import OHANA_EXPANSION_140 from "./52deaab5594f17b7d455212ba0234ac2ce3ad9ba-ohana-l10-v1.webp";
import OHANA_EXPANSION_141 from "./873dbe46916864d4582d69c86b25df35b3ca91c3-ohana-l11-v1.webp";
import OHANA_EXPANSION_142 from "./88ae733701a09bb63858e2f222d48222c6f2e838-ohana-o00-v1.webp";
import OHANA_EXPANSION_143 from "./1697129e6f74e4e5cad0714318a0957922581fad-ohana-o01-v1.webp";
import OHANA_EXPANSION_144 from "./3651495c03790404c9682867fec12fd1bbe5ce38-ohana-o02-v1.webp";
import OHANA_EXPANSION_145 from "./b7fa8b813759fd47990843c6d51d519851e2e7c5-ohana-o03-v1.webp";
import OHANA_EXPANSION_146 from "./ec74861fad2c5289e81fd0512c67d035dca4c0bd-ohana-o04-v1.webp";
import OHANA_EXPANSION_147 from "./2a84c104c422c3a0a7c0180c7aeb6a6cb64022d1-ohana-o05-v1.webp";
import OHANA_EXPANSION_148 from "./d67d0eda850ebea75b76090b9274648c2293d1d4-ohana-o06-v1.webp";
import OHANA_EXPANSION_149 from "./4da7d23c5c86a8fdd035674136760b156b4c10d8-ohana-o07-v1.webp";
import OHANA_EXPANSION_150 from "./90e0986f2c03debd4bddb36c7f339ed5cc1509dc-ohana-o08-v1.webp";
import OHANA_EXPANSION_151 from "./b5ac1efecac278d47625cb47bc5311923074f2ad-ohana-o09-v1.webp";
import OHANA_EXPANSION_152 from "./b47b2fe9a8afc74cadcaa2db10fe099cdf6646b5-ohana-o10-v1.webp";
import OHANA_EXPANSION_153 from "./849a419b1e42b954f48c129e44e5341aa539977f-ohana-o11-v1.webp";
import OHANA_EXPANSION_154 from "./b608a51d861e38b5fdc628ccf36ddf4656f6ba27-ohana-o12-v1.webp";
import OHANA_EXPANSION_155 from "./258c5a9dce54cefb8b8c7280b5c387c693483f2c-ohana-o13-v1.webp";
import OHANA_EXPANSION_156 from "./2a74bb74345423b5da38a238247c04e6b04a7b91-ohana-o14-v1.webp";
import OHANA_EXPANSION_157 from "./000b061eeefa3316881366e2d2578a94c396527b-ohana-o15-v1.webp";
import OHANA_EXPANSION_158 from "./0cfb5da5c9583e0dbdee11de38a6b1dad9618589-ohana-o16-v1.webp";
import OHANA_EXPANSION_159 from "./10faaa4266aa3fb3950f5b11809aa245e32c8aa1-ohana-o17-v1.webp";
import OHANA_EXPANSION_160 from "./4470e9d3159bee7fa3f5f96b82304b6276f24aec-ohana-o18-v1.webp";
import OHANA_EXPANSION_161 from "./0d1d12fcb91946895da632aeacbcafec741aeed9-ohana-o19-v1.webp";
import OHANA_EXPANSION_162 from "./972ab4194c93bb620891169dbbe6b1970280a90c-ohana-o20-v1.webp";
import OHANA_EXPANSION_163 from "./fa8fbfab6a0dcb8f69361051ec0dcf2b4df278a6-ohana-o21-v1.webp";
import OHANA_EXPANSION_164 from "./b37d9377e6dc614daff0a81cf75073fba0d339b5-ohana-o22-v1.webp";
import OHANA_EXPANSION_165 from "./9229266c52dd85caacb40ff4568a7247e76e8043-ohana-o23-v1.webp";
import OHANA_EXPANSION_166 from "./08e17a625ebc135afe988239f1624b4fd12fb55e-ohana-o24-v1.webp";
import WARDROBE_FITTED_0 from "./7864388a29f51b0ec5057177620d2063792c1580-wardrobe-bandit-doctor-v1.webp";
import WARDROBE_FITTED_1 from "./1423a76626f3215a1b14361f992e20638cd7f956-wardrobe-bandit-chef-v1.webp";
import WARDROBE_FITTED_2 from "./070163b4ea7026c6419d90c51fc359c7a7ae34ad-wardrobe-bandit-everyday-v1.webp";
import WARDROBE_FITTED_3 from "./93e389aa5b02bc99708e2ec0f8022ca4ce6ce4b7-wardrobe-bandit-explorer-v1.webp";
import WARDROBE_FITTED_4 from "./6363e144aef0824d50fcdce5996eb5afe5f460bd-wardrobe-honu-police-v1.webp";
import WARDROBE_FITTED_5 from "./b92859f3570b7cc40994b5d203273774d52159e7-wardrobe-honu-nurse-v1.webp";
import WARDROBE_FITTED_6 from "./617ab90cebfc0c2deca8b61d8e311af0f4775188-wardrobe-honu-firefighter-v1.webp";
import WARDROBE_FITTED_7 from "./9f823cc3a63fbc3a78a7f6d543f86b6f35293d7a-wardrobe-eddie-police-v1.webp";
import WARDROBE_FITTED_8 from "./cec2913a20a7d03820bfdee4ac8ecc66a223284c-wardrobe-eddie-nurse-v1.webp";
import WARDROBE_FITTED_9 from "./ad3474e1c9601dd72e07759313c419133d18d8c0-wardrobe-eddie-firefighter-v1.webp";
import WARDROBE_FITTED_10 from "./9ae7a97609f5f33af778309c77e8fcd3c574c6ec-wardrobe-eddie-chef-v1.webp";
import OHANA_NEW_BUDDY_0 from "./304a65c641209c7e5c730f6919eb263f00d85f1e-buddy-bandit-v1.webp";
import OHANA_NEW_BUDDY_1 from "./de28f172972c9f5cc6560c089a0b42b3fe4ac3cb-buddy-pip-v1.webp";
import OHANA_NEW_BUDDY_2 from "./e9e349d864d77510184b408616ee7749a4f9a64e-buddy-maple-v1.webp";
import OHANA_NEW_BUDDY_3 from "./d45e63e55671852b1c1ead1e26f06b5fb19df391-buddy-biscuit-v1.webp";
import OHANA_NEW_BUDDY_4 from "./cb8fb9d5d1e30789bdf3a336e30d3a66288488c5-buddy-waffles-v1.webp";
import OHANA_NEW_BUDDY_5 from "./3d4ac61ab0e76fb3099b0aab6a2a071e2e23efa1-buddy-mochi-v1.webp";
import OHANA_NEW_BUDDY_6 from "./7a013f37559f68ac9a9fde71ed0a8ed9bf153930-buddy-nibbles-v1.webp";
import OHANA_NEW_BUDDY_7 from "./bd76bc71e5d60cbab401e43f02a2ba6cc0a7ce15-buddy-pogo-v1.webp";
import OHANA_NEW_BUDDY_8 from "./0f4da80ad0bc61f629e14a2047da0827de7b5f66-buddy-clover-v1.webp";
import OHANA_NEW_BUDDY_9 from "./c199fa8456b8dc23bbc631e27b9e50db24e0dcf1-buddy-tater-v1.webp";
import OHANA_NEW_BUDDY_11 from "./0666113e52f36ec270cbf3d141231cea7847d9bd-buddy-patches-v1.webp";
import OHANA_NEW_BUDDY_13 from "./3529b64105039a30c888d2983c6358530ae1f135-buddy-poppy-v1.webp";
import OHANA_NEW_BUDDY_15 from "./3a9e3f662e59ccc8443f5c6f1ef21c814a59f02e-buddy-lemon-v1.webp";
import OHANA_NEW_BUDDY_16 from "./73184a1e2c39af8fbcf42dd61a4b3c56039b91c3-buddy-coral-v1.webp";
import OHANA_NEW_BUDDY_17 from "./4d51b0c94c91029ec1539a22fe0d71c6b430c9c0-buddy-tango-v1.webp";
import OHANA_NEW_BUDDY_18 from "./7fc54361beb2998cca1f1d9f9ee021899a9f73b0-buddy-ziggy-v1.webp";
import OHANA_NEW_BUDDY_19 from "./e2b47247f69fd0b66eb38b6d07da9565266eb482-buddy-pebbles-v1.webp";
import OHANA_NEW_BUDDY_20 from "./a78eb44632781579f67a91e7d0537599719fa547-buddy-bubbles-v1.webp";
import OHANA_NEW_BUDDY_21 from "./025a4038c6c5a2ff057109992fbcbe66576054f3-buddy-daisy-v1.webp";
import OHANA_NEW_BUDDY_23 from "./f34acae8eedca254525a56eeccdb2955873e976b-buddy-skippy-v1.webp";
import OHANA_NEW_BUDDY_24 from "./539a9efa0c4d6bf0f76fc6d4c9bb961049712dce-buddy-nova-v1.webp";
import OHANA_NEW_BUDDY_26 from "./ff2f98058331c06b2e5e80f1352126459bf91666-buddy-bandit-police-v1.webp";
import OHANA_NEW_BUDDY_27 from "./eb146dd4fd3f5b9ca08fbc116628d4cd13a93fe3-buddy-bandit-nurse-v1.webp";
import OHANA_NEW_BUDDY_28 from "./9f6b1e9d804adee6086d79671414260200778a4b-buddy-bandit-firefighter-v1.webp";
import OHANA_NEW_BUDDY_29 from "./aa1b37136d9c76026c63b7cd22ca758437b4a98c-buddy-bandit-aloha-v1.webp";
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
import { Writable as Writable22 } from "node:stream";
import { EventEmitter as EventEmitter22 } from "node:events";
import { Writable as Writable222 } from "node:stream";
import { EventEmitter as EventEmitter222 } from "node:events";
import { Writable as Writable2222 } from "node:stream";
import { EventEmitter as EventEmitter2222 } from "node:events";
import OUTFIT_BAMBOO from "./f83fa958604406481bca10dd2dafed71b7b23e0a-buddy-bamboo-outfit.webp";
import OUTFIT_EDDIE from "./08ca5892a76449db8d19d0ea4273f0df6c4eaec3-buddy-eddie-outfit.webp";
import OUTFIT_FLORA from "./abac955ff6adec1c909489483fa3163acb5091c7-buddy-flora-outfit.webp";
import OUTFIT_HONU from "./a4f80761e53918bc776d9896f12678a482e95342-buddy-honu-outfit.webp";
import OUTFIT_HOOT from "./a3932c86afc35840e9aa7ce272e83aa0d1f6317a-buddy-hoot-outfit.webp";
import OUTFIT_KIKO from "./7bc2ac6011eecdc6b31a03bfa8d50504f223802e-buddy-kiko-outfit.webp";
import OUTFIT_KOA from "./873dbe46916864d4582d69c86b25df35b3ca91c3-buddy-koa-outfit.webp";
import OUTFIT_MILO from "./52deaab5594f17b7d455212ba0234ac2ce3ad9ba-buddy-milo-outfit.webp";
const OUTFIT_OTTO = OHANA_EXPANSION_134;
import OUTFIT_PIPPA from "./fdef3879a69b779b1030399f664b49fcd84056a4-buddy-pippa-outfit.webp";
import OUTFIT_SPLASH from "./e259425fb55fb345d7b3af61863203ba63a550e4-buddy-splash-outfit.webp";
import OUTFIT_SUNNY from "./6ea12e168453f3511738dd4120e9b5057710c10c-buddy-sunny-outfit.webp";
import BEACH_SAND from "./68aa4b9ded92cb1fc164cad8aff553ff451223be-beach-sand-light.webp";
import OCEAN_SURF from "./d0a3a6e5eb0ae024925bfee7a467019387bf9447-ocean-surf.webp";
import OHANA_FAMILY_HOME from "./9176524ea460eeb474e68ab302d884d6d49860d1-9176524ea460eeb474e68ab302d884d6d49860d1-ohana-family-home-v2.webp";
import OHANA_DETAIL_0 from "./f644cd96255445368f593a8af41436f741a96c29-f644cd96255445368f593a8af41436f741a96c29-ohana-garden-v1.webp";
import OHANA_DETAIL_1 from "./661bb5a49d556f16278c761456398d43322a55af-661bb5a49d556f16278c761456398d43322a55af-ohana-cove-v1.webp";
import OHANA_DETAIL_2 from "./d74f64bbed2d1c84b131d1ed6e7b6d80a3b42797-d74f64bbed2d1c84b131d1ed6e7b6d80a3b42797-ohana-flowers-v1.webp";
import { Writable as Writable22222 } from "node:stream";
import { EventEmitter as EventEmitter22222 } from "node:events";
import OHANA_ICON_192 from "./f6d12f8332d304befb9df6b21b8c51283b1bed07-f6d12f8332d304befb9df6b21b8c51283b1bed07-f6d12f8332d304befb9df6b21b8c51283b1bed07-ohana-icon-192-v2.png";
import GET_HTML from "./cc9d63f5e409499aae54d64850d612b9532a23bb-cc9d63f5e409499aae54d64850d612b9532a23bb-get.html";
import OHANA_ICON_512 from "./73ef35b4edc71036f93563c858456997b75b9e92-73ef35b4edc71036f93563c858456997b75b9e92-73ef35b4edc71036f93563c858456997b75b9e92-ohana-icon-512-v2.png";
import ACCESSIBILITY_PREVIEW_HTML from "./ohana-accessibility-preview.html.gz";
import HANDFOOT_PREVIEW_HTML from "./979fbbd59bd0b64fdcba95a94dd9029effd1c62b-979fbbd59bd0b64fdcba95a94dd9029effd1c62b-979fbbd59bd0b64fdcba95a94dd9029effd1c62b-handfoot-preview.html";
import WORD_ERROR_PREVIEW_HTML from "./578674b03e14cf233118aaf623cea3be759ee17c-578674b03e14cf233118aaf623cea3be759ee17c-578674b03e14cf233118aaf623cea3be759ee17c-word-error-preview.html";
import SETTINGS_PREVIEW_HTML from "./850bb52f5cd174bb7a67ce80538e6b3fa7387701-850bb52f5cd174bb7a67ce80538e6b3fa7387701-850bb52f5cd174bb7a67ce80538e6b3fa7387701-settings-preview.html";
import EDDIE_PORTRAIT from "./b77ac94cea4c2e86599df63951d2c2aa1f03ed19-b77ac94cea4c2e86599df63951d2c2aa1f03ed19-b77ac94cea4c2e86599df63951d2c2aa1f03ed19-buddy-eddie.webp";
import EDDIE_TALK from "./0a6b97a665d7aa03a53c2927d31585fe22225011-0a6b97a665d7aa03a53c2927d31585fe22225011-0a6b97a665d7aa03a53c2927d31585fe22225011-talk-eddie.webp";
import WORLD_SCENE from "./d29bc81e24930c9b675d6d4df37d113199e38b19-d29bc81e24930c9b675d6d4df37d113199e38b19-ohana-world-scene.webp";
import WORLD_TABLE from "./4cfc56bd3f980f9b5fd59b775542e3194c1cd975-4cfc56bd3f980f9b5fd59b775542e3194c1cd975-ohana-world-table.webp";
import ISLAND_IMAGE from "./6eb4f39b834ea1b442d61fba16be1fea869ae9d7-6eb4f39b834ea1b442d61fba16be1fea869ae9d7-540b90ab51ab22f9d5ebe6f4ede213c18bc5d251-ohana-island.webp";
import ISLAND_ICONS from "./adf170f3bda89283fe6cbeb0b599dd3889808f21-adf170f3bda89283fe6cbeb0b599dd3889808f21-96e0a04bdf7c1f80eb07bfd0e6257ec1690d8e59-island-icons.js.txt";
import SETUP_PREVIEW_HTML from "./0350a042e91c6ec3042c81d1400869ae15ba2a43-0350a042e91c6ec3042c81d1400869ae15ba2a43-0350a042e91c6ec3042c81d1400869ae15ba2a43-setup-preview.html";
import OHANA_PREVIEW_HTML from "./d455966e2cbefa386f2f905a2bbb6ad4cd869617-d455966e2cbefa386f2f905a2bbb6ad4cd869617-d455966e2cbefa386f2f905a2bbb6ad4cd869617-ohana-preview.html";
import NOOK_PREVIEW_HTML from "./6792be01ece7d11b49521a915e03c00211c8ec4c-6792be01ece7d11b49521a915e03c00211c8ec4c-6792be01ece7d11b49521a915e03c00211c8ec4c-nook-preview.html";
import ROOMS_PREVIEW_HTML from "./910ab9c1f683637ead1416f0f2b98d8cfc4a2b4c-910ab9c1f683637ead1416f0f2b98d8cfc4a2b4c-910ab9c1f683637ead1416f0f2b98d8cfc4a2b4c-rooms-preview.html";
import MORE_OTTO_PORTRAIT from "./688b601bd22b69ddf5f93938d0e33693c32e69a9-688b601bd22b69ddf5f93938d0e33693c32e69a9-688b601bd22b69ddf5f93938d0e33693c32e69a9-buddy-otto.webp";
import MORE_OTTO_TALK from "./9de79351464e8aa51d545ab9eeb6f243d08cfac3-9de79351464e8aa51d545ab9eeb6f243d08cfac3-9de79351464e8aa51d545ab9eeb6f243d08cfac3-talk-otto.webp";
import MORE_PIPPA_PORTRAIT from "./b239d31ffd2b89afd29a332fce57567bd5718734-b239d31ffd2b89afd29a332fce57567bd5718734-b239d31ffd2b89afd29a332fce57567bd5718734-buddy-pippa.webp";
import MORE_PIPPA_TALK from "./61e0767d804b3979ff52bda87dc1b9ff68109e3a-61e0767d804b3979ff52bda87dc1b9ff68109e3a-61e0767d804b3979ff52bda87dc1b9ff68109e3a-talk-pippa.webp";
import MORE_LULU_PORTRAIT from "./f313688cf1962205a44dec818036e7e845e67758-f313688cf1962205a44dec818036e7e845e67758-f313688cf1962205a44dec818036e7e845e67758-buddy-lulu.webp";
import MORE_LULU_TALK from "./629d7a14c63d86329727740fb3b840c4a061f4e4-629d7a14c63d86329727740fb3b840c4a061f4e4-629d7a14c63d86329727740fb3b840c4a061f4e4-talk-lulu.webp";
import MORE_HOOT_PORTRAIT from "./dae03a062048cc4a7bd570eafa90f9638af94d9d-dae03a062048cc4a7bd570eafa90f9638af94d9d-dae03a062048cc4a7bd570eafa90f9638af94d9d-buddy-hoot.webp";
import MORE_HOOT_TALK from "./870a04128fe90e869d2f864fd66e14d15a3f101c-870a04128fe90e869d2f864fd66e14d15a3f101c-870a04128fe90e869d2f864fd66e14d15a3f101c-talk-hoot.webp";
import MORE_FLUTTER_PORTRAIT from "./2dcacc7b3f65be06df515768fa06f3356d93d411-2dcacc7b3f65be06df515768fa06f3356d93d411-2dcacc7b3f65be06df515768fa06f3356d93d411-buddy-flutter.webp";
import MORE_FLUTTER_TALK from "./c5cb8ed325a4891da5886a32e393f01b18b8e54f-c5cb8ed325a4891da5886a32e393f01b18b8e54f-c5cb8ed325a4891da5886a32e393f01b18b8e54f-talk-flutter.webp";
import MORE_ROSIE_PORTRAIT from "./c5082bfbfa6b7bc6e19a5c03a505e666d49b94cd-c5082bfbfa6b7bc6e19a5c03a505e666d49b94cd-c5082bfbfa6b7bc6e19a5c03a505e666d49b94cd-buddy-rosie.webp";
import MORE_ROSIE_TALK from "./67dcd932405806fb3feab05b9f39f03022a172af-67dcd932405806fb3feab05b9f39f03022a172af-67dcd932405806fb3feab05b9f39f03022a172af-talk-rosie.webp";
import MORE_KOA_PORTRAIT from "./0b604aa2921e6c3c8d849d6a9e5e699523c9e0af-0b604aa2921e6c3c8d849d6a9e5e699523c9e0af-0b604aa2921e6c3c8d849d6a9e5e699523c9e0af-buddy-koa.webp";
import MORE_KOA_TALK from "./0f6a8b46c174908a2a32415da3d1f9de9054e37c-0f6a8b46c174908a2a32415da3d1f9de9054e37c-0f6a8b46c174908a2a32415da3d1f9de9054e37c-talk-koa.webp";
import MORE_MILO_PORTRAIT from "./ded3c8f31a648ae9dcacb598e74a450211ccafc1-ded3c8f31a648ae9dcacb598e74a450211ccafc1-ded3c8f31a648ae9dcacb598e74a450211ccafc1-buddy-milo.webp";
import MORE_MILO_TALK from "./ec1183b4bb2ab819ffa5464383bea5670b6bd718-ec1183b4bb2ab819ffa5464383bea5670b6bd718-ec1183b4bb2ab819ffa5464383bea5670b6bd718-talk-milo.webp";
import MORE_BAMBOO_PORTRAIT from "./6d407ed217a8e1763b6fe129f1679b87aacb3514-6d407ed217a8e1763b6fe129f1679b87aacb3514-6d407ed217a8e1763b6fe129f1679b87aacb3514-buddy-bamboo.webp";
import MORE_BAMBOO_TALK from "./1bec628419e6e63f8d23d7f067947704b32c3ea0-1bec628419e6e63f8d23d7f067947704b32c3ea0-1bec628419e6e63f8d23d7f067947704b32c3ea0-talk-bamboo.webp";
import MORE_COCO_PORTRAIT from "./d8d6b6b94cb79bb015cdc4d43eeb49ebfe95d553-d8d6b6b94cb79bb015cdc4d43eeb49ebfe95d553-d8d6b6b94cb79bb015cdc4d43eeb49ebfe95d553-buddy-coco.webp";
import MORE_COCO_TALK from "./31319d702f12677c89ee2aa1dd509574804cb043-31319d702f12677c89ee2aa1dd509574804cb043-31319d702f12677c89ee2aa1dd509574804cb043-talk-coco.webp";
import MORE_FINN_PORTRAIT from "./3ffb7ff1dc481e41b733aede9124ce2209cf350e-3ffb7ff1dc481e41b733aede9124ce2209cf350e-3ffb7ff1dc481e41b733aede9124ce2209cf350e-buddy-finn.webp";
import MORE_FINN_TALK from "./c19842965e7508929494b531fcecda495f23bca7-c19842965e7508929494b531fcecda495f23bca7-c19842965e7508929494b531fcecda495f23bca7-talk-finn.webp";
import MORE_INKY_PORTRAIT from "./aa00d7614c93901dd1c96945ef439ec4b5ec3700-aa00d7614c93901dd1c96945ef439ec4b5ec3700-aa00d7614c93901dd1c96945ef439ec4b5ec3700-buddy-inky.webp";
import MORE_INKY_TALK from "./430cd1c320cd2398ce23a8c04e3b72047d9bc808-430cd1c320cd2398ce23a8c04e3b72047d9bc808-430cd1c320cd2398ce23a8c04e3b72047d9bc808-talk-inky.webp";
import MORE_KAI_PORTRAIT from "./08fbbf39ac4e218d9fa89a6ed9cc2204b83d0e5c-08fbbf39ac4e218d9fa89a6ed9cc2204b83d0e5c-08fbbf39ac4e218d9fa89a6ed9cc2204b83d0e5c-buddy-kai.webp";
import MORE_KAI_TALK from "./d7a303ac7fa32b480e88c254b468b2a45a8f973a-d7a303ac7fa32b480e88c254b468b2a45a8f973a-d7a303ac7fa32b480e88c254b468b2a45a8f973a-talk-kai.webp";
import MORE_FLORA_PORTRAIT from "./cc506f0c2425abfb6b5849cf7978cc78ea9df29d-cc506f0c2425abfb6b5849cf7978cc78ea9df29d-cc506f0c2425abfb6b5849cf7978cc78ea9df29d-buddy-flora.webp";
import MORE_FLORA_TALK from "./e12e2bdfe78db55b3276b44e7bbde0f990fadbca-e12e2bdfe78db55b3276b44e7bbde0f990fadbca-e12e2bdfe78db55b3276b44e7bbde0f990fadbca-talk-flora.webp";
import MORE_REEF_PORTRAIT from "./e09f5eeeb65a276c44466d45144f83c7a58e05c5-e09f5eeeb65a276c44466d45144f83c7a58e05c5-e09f5eeeb65a276c44466d45144f83c7a58e05c5-buddy-reef.webp";
import MORE_REEF_TALK from "./95bd168065e30c0112487ddf9f3e5e5c7f678967-95bd168065e30c0112487ddf9f3e5e5c7f678967-95bd168065e30c0112487ddf9f3e5e5c7f678967-talk-reef.webp";
import BUDDIES_PREVIEW_HTML from "./1500537fb28b2cdda20f2b3b3e2f5aeef5b00a0f-1500537fb28b2cdda20f2b3b3e2f5aeef5b00a0f-1500537fb28b2cdda20f2b3b3e2f5aeef5b00a0f-buddies-preview.html";
import TALK_HONU from "./4b6a19a9632736ef570e6f3480a9d9eb6dfa92e8-4b6a19a9632736ef570e6f3480a9d9eb6dfa92e8-4b6a19a9632736ef570e6f3480a9d9eb6dfa92e8-talk-honu.webp";
import TALK_SPLASH from "./0668fc443f34c2b46d46968b0a235dff43f4cb58-0668fc443f34c2b46d46968b0a235dff43f4cb58-0668fc443f34c2b46d46968b0a235dff43f4cb58-talk-splash.webp";
import TALK_KIKO from "./e63e96eff569c399ecfa24b2bf6aaafa5022ebc2-e63e96eff569c399ecfa24b2bf6aaafa5022ebc2-e63e96eff569c399ecfa24b2bf6aaafa5022ebc2-talk-kiko.webp";
import TALK_PEBBLE from "./4828f94ae774bd38d518d7e798c2d28acd511aeb-4828f94ae774bd38d518d7e798c2d28acd511aeb-4828f94ae774bd38d518d7e798c2d28acd511aeb-talk-pebble.webp";
import TALK_MANGO from "./c141f88dea952530cb8095caf6ebec382eb0994f-c141f88dea952530cb8095caf6ebec382eb0994f-c141f88dea952530cb8095caf6ebec382eb0994f-talk-mango.webp";
import TALK_SUNNY from "./9823f89760b728eb24177a89a67e336544482ff8-9823f89760b728eb24177a89a67e336544482ff8-9823f89760b728eb24177a89a67e336544482ff8-talk-sunny.webp";
import BUDDY_KIKO from "./2f81c410717264bdc451d6a86b91a616bae3aebe-2f81c410717264bdc451d6a86b91a616bae3aebe-2f81c410717264bdc451d6a86b91a616bae3aebe-buddy-kiko.webp";
import BUDDY_PEBBLE from "./ac9e96e464ba2a5b8abf181790a8cfc4fcfeac7a-ac9e96e464ba2a5b8abf181790a8cfc4fcfeac7a-ac9e96e464ba2a5b8abf181790a8cfc4fcfeac7a-buddy-pebble.webp";
import BUDDY_MANGO from "./2e8ab63bb885d1e3b1448a77d5da6ad2c715b781-2e8ab63bb885d1e3b1448a77d5da6ad2c715b781-2e8ab63bb885d1e3b1448a77d5da6ad2c715b781-buddy-mango.webp";
import BUDDY_SUNNY from "./5de1a816707f0ef332b9c5f814dd725fe603c86a-5de1a816707f0ef332b9c5f814dd725fe603c86a-5de1a816707f0ef332b9c5f814dd725fe603c86a-buddy-sunny.webp";
import BUDDY_SPLASH from "./00a9c8ee50a17fdc26b3c8c1bed55640c42595c4-00a9c8ee50a17fdc26b3c8c1bed55640c42595c4-00a9c8ee50a17fdc26b3c8c1bed55640c42595c4-buddy-splash.webp";
import MAHJONG_PREVIEW_HTML from "./09246ba466da98b180a867e23a67c4a96f3b9dbc-09246ba466da98b180a867e23a67c4a96f3b9dbc-09246ba466da98b180a867e23a67c4a96f3b9dbc-mahjong-preview.html";
import COLOR_BAMBOO from "./9652f9c2ff561121f3053bae6595e787042edcd0-9652f9c2ff561121f3053bae6595e787042edcd0-color-bamboo.svg.gz";
import COLOR_COCO from "./ccf261ccd9dd1bf0b5c4c0580b155243dacf41c1-ccf261ccd9dd1bf0b5c4c0580b155243dacf41c1-color-coco.svg.gz";
import COLOR_EDDIE from "./b0d8090fa61055f7044d84b384433439d9150879-b0d8090fa61055f7044d84b384433439d9150879-color-eddie.svg.gz";
import COLOR_FINN from "./30bf2eeffbe7c1a024fda30ae180c4a7f774f4ef-30bf2eeffbe7c1a024fda30ae180c4a7f774f4ef-color-finn.svg.gz";
import COLOR_FLORA from "./f6b1ec7bcddb2fbd3303a512fd50f8424260c490-f6b1ec7bcddb2fbd3303a512fd50f8424260c490-color-flora.svg.gz";
import COLOR_FLUTTER from "./7ce80afe087741e2e759da3d44fae373d87d7336-7ce80afe087741e2e759da3d44fae373d87d7336-color-flutter.svg.gz";
import COLOR_HONU from "./cd80de8fe47f96caadd6fd562aaa775dc5faaffa-cd80de8fe47f96caadd6fd562aaa775dc5faaffa-color-honu.svg.gz";
import COLOR_HOOT from "./1da04018d8ac3a77b6da5c4dae3fdffce168c0f9-1da04018d8ac3a77b6da5c4dae3fdffce168c0f9-color-hoot.svg.gz";
import COLOR_INKY from "./da46fec7c4632ecaf285d31a9a1e339d2013a1fb-da46fec7c4632ecaf285d31a9a1e339d2013a1fb-color-inky.svg.gz";
import COLOR_KAI from "./b54232944613df6d2f92b6930f7cd9bd83a17304-b54232944613df6d2f92b6930f7cd9bd83a17304-color-kai.svg.gz";
import COLOR_KIKO from "./e3e0da37cb314ae1e61d136d8f5f1df77c6d8eb2-e3e0da37cb314ae1e61d136d8f5f1df77c6d8eb2-color-kiko.svg.gz";
import COLOR_KOA from "./1fd470c42af8b2dc1f94fc8c0241e58d4b9596c7-1fd470c42af8b2dc1f94fc8c0241e58d4b9596c7-color-koa.svg.gz";
import COLOR_LULU from "./769b6dc96fd3630841e32800095ae76c5c2f9b31-769b6dc96fd3630841e32800095ae76c5c2f9b31-color-lulu.svg.gz";
import COLOR_MANGO from "./1c47c42680d66a4cce2793b8e1acfa76c26af02e-1c47c42680d66a4cce2793b8e1acfa76c26af02e-color-mango.svg.gz";
import COLOR_MILO from "./83c92d833829f8acf6db36a2e27cedb86f8b8e31-83c92d833829f8acf6db36a2e27cedb86f8b8e31-color-milo.svg.gz";
import COLOR_OTTO from "./cb3a176fbda3eb67402242209210732f2717e0c0-cb3a176fbda3eb67402242209210732f2717e0c0-color-otto.svg.gz";
import COLOR_PEBBLE from "./b73ab78a6f2e3ba90524835b78dcd3723f5aa7f8-b73ab78a6f2e3ba90524835b78dcd3723f5aa7f8-color-pebble.svg.gz";
import COLOR_PIPPA from "./1b5c1a11e9f93d67f13d1d466f36b48b896ab883-1b5c1a11e9f93d67f13d1d466f36b48b896ab883-color-pippa.svg.gz";
import COLOR_REEF from "./f38daff03fcd25e9a36cfb204543e2b1706646c2-f38daff03fcd25e9a36cfb204543e2b1706646c2-color-reef.svg.gz";
import COLOR_ROSIE from "./2d525136ddd5fdc7ce528fb55053021ae993ec15-2d525136ddd5fdc7ce528fb55053021ae993ec15-color-rosie.svg.gz";
import COLOR_SPLASH from "./93e5ddcb749dc8a2eb14198318e95fc6d63e1c64-93e5ddcb749dc8a2eb14198318e95fc6d63e1c64-color-splash.svg.gz";
import COLOR_SUNNY from "./845766ccc17502e76c19aa6807e1ce4083d0cfd7-845766ccc17502e76c19aa6807e1ce4083d0cfd7-color-sunny.svg.gz";
import COLOR_A0 from "./ccbda1b412bedd94b629e03cb4bd5ea453216306-ccbda1b412bedd94b629e03cb4bd5ea453216306-color-beach-cottage.svg.gz";
import THUMB_A0 from "./34feb773027b9d4373dba66b443e501fbddc0c3d-34feb773027b9d4373dba66b443e501fbddc0c3d-thumb-beach-cottage.webp";
import COLOR_A1 from "./99a130b67f9f90be9a649a770a1f0e74de3eac50-99a130b67f9f90be9a649a770a1f0e74de3eac50-color-coral-reef.svg.gz";
import THUMB_A1 from "./57831bcdd0a591847698866dfa7863993fb8c096-57831bcdd0a591847698866dfa7863993fb8c096-thumb-coral-reef.webp";
import COLOR_A2 from "./cc186071c5cf6aeb3f452ce06999a6b3387b4582-cc186071c5cf6aeb3f452ce06999a6b3387b4582-color-dolphins.svg.gz";
import THUMB_A2 from "./2ee8d1b912a7a87bf8cd3a341d71710339431133-2ee8d1b912a7a87bf8cd3a341d71710339431133-thumb-dolphins.webp";
import COLOR_A3 from "./e0b1c7d9d0497fd2d324a2ba603897fbab17e541-e0b1c7d9d0497fd2d324a2ba603897fbab17e541-color-family-tree.svg.gz";
import THUMB_A3 from "./e7fb90f8c7bf7262d143016126baad59ee9e51da-e7fb90f8c7bf7262d143016126baad59ee9e51da-thumb-family-tree.webp";
import COLOR_A4 from "./8a4a54f095b3570e81fc2fea2a79e675467deaae-8a4a54f095b3570e81fc2fea2a79e675467deaae-color-hawaiian-quilt.svg.gz";
import THUMB_A4 from "./a7bc16005ccefe7ad1b4e6df5f03d60ccbe8739f-a7bc16005ccefe7ad1b4e6df5f03d60ccbe8739f-thumb-hawaiian-quilt.webp";
import COLOR_A5 from "./8b12c1fda0ed27daa4e18ba8e5431e23f9030347-8b12c1fda0ed27daa4e18ba8e5431e23f9030347-color-hibiscus-mandala.svg.gz";
import THUMB_A5 from "./9d45caa8ffcb3061b22e6b2e3068c74c8af2ebe0-9d45caa8ffcb3061b22e6b2e3068c74c8af2ebe0-thumb-hibiscus-mandala.webp";
import COLOR_A6 from "./3ae7fd4c4dc5f60f11643362c9249cf285e0f667-3ae7fd4c4dc5f60f11643362c9249cf285e0f667-color-honu-mandala.svg.gz";
import THUMB_A6 from "./d19048d34ec2252eaa9e1c7945a3c2f0c50dee0d-d19048d34ec2252eaa9e1c7945a3c2f0c50dee0d-thumb-honu-mandala.webp";
import COLOR_A7 from "./e468e8137cbf78787f0d28d1ed9eb162bc21fc98-e468e8137cbf78787f0d28d1ed9eb162bc21fc98-color-hummingbird.svg.gz";
import THUMB_A7 from "./2d4b201444419360658d6117f847483b14f5964f-2d4b201444419360658d6117f847483b14f5964f-thumb-hummingbird.webp";
import COLOR_A8 from "./3c57eb85d783b09e0d5ef0b6af624daddda80fbc-3c57eb85d783b09e0d5ef0b6af624daddda80fbc-color-island-tribal.svg.gz";
import THUMB_A8 from "./67a6ceb9d74360596af1740e667caa0f1439163e-67a6ceb9d74360596af1740e667caa0f1439163e-thumb-island-tribal.webp";
import COLOR_A9 from "./c42ce2cd91de99750c0eecbaf260daa2aad822c9-c42ce2cd91de99750c0eecbaf260daa2aad822c9-color-ocean-waves.svg.gz";
import THUMB_A9 from "./101dc848788514cc628b0507b4d1b89653e919b4-101dc848788514cc628b0507b4d1b89653e919b4-thumb-ocean-waves.webp";
import COLOR_A10 from "./157b9f1f92e84c3729375e4c7b531fba7f27bab0-157b9f1f92e84c3729375e4c7b531fba7f27bab0-color-ohana-wreath.svg.gz";
import THUMB_A10 from "./95760bacf83e4005d3710df6432ae823531be379-95760bacf83e4005d3710df6432ae823531be379-thumb-ohana-wreath.webp";
import COLOR_A11 from "./72abefb5e4ab06df71ab72b1a329d3edd5db089b-72abefb5e4ab06df71ab72b1a329d3edd5db089b-color-orchids.svg.gz";
import THUMB_A11 from "./91383dcdbf8045e510bb9e49b3186763210fa922-91383dcdbf8045e510bb9e49b3186763210fa922-thumb-orchids.webp";
import COLOR_A12 from "./a2727d2a3506650775b73ceff179e47d9c18a0a4-a2727d2a3506650775b73ceff179e47d9c18a0a4-color-palm-leaves.svg.gz";
import THUMB_A12 from "./f88d196759b9276ce1eed8e0bea4122f2642ed1c-f88d196759b9276ce1eed8e0bea4122f2642ed1c-thumb-palm-leaves.webp";
import COLOR_A13 from "./931581d93449eb992d5bc40bd0b0b67665dd9159-931581d93449eb992d5bc40bd0b0b67665dd9159-color-pineapple-mandala.svg.gz";
import THUMB_A13 from "./7281f0d5c106220cb95a88d7980a7b668633e2ee-7281f0d5c106220cb95a88d7980a7b668633e2ee-thumb-pineapple-mandala.webp";
import COLOR_A14 from "./3b55e95fa0972297648d3b1ffa7a4d573700940a-3b55e95fa0972297648d3b1ffa7a4d573700940a-color-seashells.svg.gz";
import THUMB_A14 from "./5592d34b4a60dc8bab03504ebfe64af296a4723d-5592d34b4a60dc8bab03504ebfe64af296a4723d-thumb-seashells.webp";
import COLOR_A15 from "./9f3ce6b8fa404d8aae92c40be99d6ed3a7df9e4e-9f3ce6b8fa404d8aae92c40be99d6ed3a7df9e4e-color-sunset-sail.svg.gz";
import THUMB_A15 from "./60a9c7f0fd127f7e911695b3140425e34cf13ce7-60a9c7f0fd127f7e911695b3140425e34cf13ce7-thumb-sunset-sail.webp";
import COLOR_A16 from "./5dc720d789cd095a1f905b09f576763a8fe713a4-5dc720d789cd095a1f905b09f576763a8fe713a4-color-surf-day.svg.gz";
import THUMB_A16 from "./9b9c3ed2dd389426e64ab0a60ef4fe430e9d0294-9b9c3ed2dd389426e64ab0a60ef4fe430e9d0294-thumb-surf-day.webp";
import COLOR_A17 from "./1981e6e8a043895f75ba1b84ad191d8c8e35161e-1981e6e8a043895f75ba1b84ad191d8c8e35161e-color-ukulele.svg.gz";
import THUMB_A17 from "./710c4d6c02b9f017a15bea8054c0593e6290745c-710c4d6c02b9f017a15bea8054c0593e6290745c-thumb-ukulele.webp";
import PZPIC_0 from "./2a1a5bb7b74258916e0e1b47bfdedb0be952efd1-2a1a5bb7b74258916e0e1b47bfdedb0be952efd1-puzzle-luau-sunset.webp";
import PZTHUMB_0 from "./2a8f6e096acfe24c575bf7025a12c78b864c01b6-2a8f6e096acfe24c575bf7025a12c78b864c01b6-pzthumb-luau-sunset.webp";
import PZPIC_1 from "./8d0a9b9d11215797e26b9fa56e62cd1ed3d161ad-8d0a9b9d11215797e26b9fa56e62cd1ed3d161ad-puzzle-waterfall-garden.webp";
import PZTHUMB_1 from "./d28c4d983566ee6f7c9f4925cfcbca4e15f9725c-d28c4d983566ee6f7c9f4925cfcbca4e15f9725c-pzthumb-waterfall-garden.webp";
import PZPIC_2 from "./d6a7da4580828fa941b7789b0d913fce05c50358-d6a7da4580828fa941b7789b0d913fce05c50358-puzzle-reef-life.webp";
import PZTHUMB_2 from "./8f0ea23722d78edaa951b730df2f05c3f543a8a8-8f0ea23722d78edaa951b730df2f05c3f543a8a8-pzthumb-reef-life.webp";
import PZPIC_3 from "./d716f15bc60cb0cc833da36b538341de56c95770-d716f15bc60cb0cc833da36b538341de56c95770-puzzle-porch-morning.webp";
import PZTHUMB_3 from "./e6c35f4770da901c2b9c379bb8bffcdee32edefb-e6c35f4770da901c2b9c379bb8bffcdee32edefb-pzthumb-porch-morning.webp";
import PZPIC_4 from "./ca39a7ee770c11afeae7a9c84a8d2804235560dc-ca39a7ee770c11afeae7a9c84a8d2804235560dc-puzzle-market-day.webp";
import PZTHUMB_4 from "./e88322a286bf3570614bbd944151ebe7f6cc11f1-e88322a286bf3570614bbd944151ebe7f6cc11f1-pzthumb-market-day.webp";
import PZPIC_5 from "./dcde1056c3872d0dd60ed70d4d94d7ee226a742a-dcde1056c3872d0dd60ed70d4d94d7ee226a742a-puzzle-canoe-cove.webp";
import PZTHUMB_5 from "./13d67d8a69aac62e9a3f7e9e6cd846fa3e0ebb92-13d67d8a69aac62e9a3f7e9e6cd846fa3e0ebb92-pzthumb-canoe-cove.webp";
import APP_HTML_GZIP from "./5e56a1670589dcba0b60713f79c86ac150466cca-d975c2c4ca11dd0e62f2534a9e5dddeea065a1f8-3bf844cb8c9c2a87e301a8616088ba6047d9ab5e-app.html.gz";
import { gunzipSync as gunzipAppHtml } from "node:zlib";
const APP_HTML = gunzipAppHtml(APP_HTML_GZIP).toString("utf8");
import TSCMS_CABINET_V1 from "./ohana-jukebox.webp";
import TSCMS_DAD_CARDINAL_V1 from "./dad-cardinal.webp";
import HONU_IMAGE from "./94d28c5510f33949297a3b2655dceac18a9966e1-94d28c5510f33949297a3b2655dceac18a9966e1-94d28c5510f33949297a3b2655dceac18a9966e1-honu.webp";
import MIKE_BIRTHDAY_IMAGE from "./466e0a4ecde0efd162492c7d2a17ad46ace7d257-mike-birthday.webp";
import EDDIE_LIMO_IMAGE from "./6139ae2641f3caa5c5befa6be2d771fd230ddeb3-eddie-limo.webp";
import OHANA_MIKES_ROOM_IMAGE from "./97bdd37846ef3d4f93794e095d3bb96251685912-ohana-mikes-room.webp";
import OHANA_SPLASH_FISH from "./87f0899562c9200ab0998cda74511896b95e1c64-87f0899562c9200ab0998cda74511896b95e1c64-87f0899562c9200ab0998cda74511896b95e1c64-ohana-splash-fish-v1.webp";
import OHANA_CHESS_BEACH from "./91004f04cb547f11640241f698b832bddcb2aa5a-91004f04cb547f11640241f698b832bddcb2aa5a-91004f04cb547f11640241f698b832bddcb2aa5a-ohana-chess-beach-v3.webp";
import OHANA_TICTAC_BEACH from "./92fb87c47cf1127575ea0304f416c0a15f0adb5e-92fb87c47cf1127575ea0304f416c0a15f0adb5e-92fb87c47cf1127575ea0304f416c0a15f0adb5e-ohana-tictac-beach-v3.webp";
import OHANA_WORDS_DETAIL from "./bf2573b0937d1454ef25a133afacf323a35839a7-bf2573b0937d1454ef25a133afacf323a35839a7-bf2573b0937d1454ef25a133afacf323a35839a7-ohana-words-detail-v3.webp";
import OHANA_BEACH_PLAY from "./f95241dc3f6a29e816fd5eb0c4581bf167ae0aa9-f95241dc3f6a29e816fd5eb0c4581bf167ae0aa9-f95241dc3f6a29e816fd5eb0c4581bf167ae0aa9-ohana-beach-play-v4.webp";
import OHANA_MIKES_CARDS from "./26e07cc87309486d7a934ff808f0bbae6361cb25-26e07cc87309486d7a934ff808f0bbae6361cb25-26e07cc87309486d7a934ff808f0bbae6361cb25-ohana-mikes-cards-v4.webp";
import OHANA_HANDFOOT_CARDS from "./712b514be3fcb11f13891a18c1be0fe3f78791ad-712b514be3fcb11f13891a18c1be0fe3f78791ad-712b514be3fcb11f13891a18c1be0fe3f78791ad-ohana-handfoot-cards-v4.webp";
import OHANA_WORDS_PORCH from "./38ca15b0ddf6cbe83b5ef138a99925430e20ce10-38ca15b0ddf6cbe83b5ef138a99925430e20ce10-38ca15b0ddf6cbe83b5ef138a99925430e20ce10-ohana-words-sign-v2.webp";
import OHANA_HANDFOOT_PORCH from "./3a9e3d75cee4756f05c8f2eaf5cfd5ba0c8c4a95-3a9e3d75cee4756f05c8f2eaf5cfd5ba0c8c4a95-3a9e3d75cee4756f05c8f2eaf5cfd5ba0c8c4a95-ohana-handfoot-sign-v2.webp";
import OHANA_MAHJONG_PORCH from "./57f8e8d093ef75443322b5891542ef1e5f8c7358-57f8e8d093ef75443322b5891542ef1e5f8c7358-57f8e8d093ef75443322b5891542ef1e5f8c7358-ohana-mahjong-sign-v2.webp";
import OHANA_OHANA10_PORCH from "./7caef025e0229fe999e810bd3ebd5bf90db5b135-7caef025e0229fe999e810bd3ebd5bf90db5b135-7caef025e0229fe999e810bd3ebd5bf90db5b135-ohana-ohana10-sign-v2.webp";
import OHANA_DOMINO_PORCH from "./ohana-domino-sign-v1.webp";
import OHANA_DOMINO_PORCH_V2 from "./ohana-domino-sign-v2.webp";
import OHANA_CHESS_PORCH from "./034cac1f37f7f4e582b4e8258185663ea381044d-034cac1f37f7f4e582b4e8258185663ea381044d-034cac1f37f7f4e582b4e8258185663ea381044d-ohana-chess-sign-v2.webp";
import OHANA_CHECKERS_PORCH from "./c5414856dfcd78e8e79bbd8ed3e45d951c37fa91-c5414856dfcd78e8e79bbd8ed3e45d951c37fa91-c5414856dfcd78e8e79bbd8ed3e45d951c37fa91-ohana-checkers-sign-v2.webp";
import OHANA_MEMORY_PORCH from "./67cf3c7d128f0bdd04029860f1ae54e8f21fa894-67cf3c7d128f0bdd04029860f1ae54e8f21fa894-67cf3c7d128f0bdd04029860f1ae54e8f21fa894-ohana-memory-sign-v2.webp";
import OHANA_TICTAC_PORCH from "./6e87db2c492c892b23e102ae1abbfd3f4f4258d0-6e87db2c492c892b23e102ae1abbfd3f4f4258d0-6e87db2c492c892b23e102ae1abbfd3f4f4258d0-ohana-tictac-sign-v2.webp";
import OHANA_PUZZLE_INVITE from "./aeb18e9b5cc6e41ecbe6347654453dbe40ff8767-aeb18e9b5cc6e41ecbe6347654453dbe40ff8767-aeb18e9b5cc6e41ecbe6347654453dbe40ff8767-ohana-puzzle-sign-v3.webp";
import OHANA_PRAYER_INVITE from "./f4feb3290eaaa4d953b75dde2a8b717994a96cf8-f4feb3290eaaa4d953b75dde2a8b717994a96cf8-f4feb3290eaaa4d953b75dde2a8b717994a96cf8-ohana-prayer-sign-v4.webp";
import OHANA_MIKES_PORCH_IMAGE from "./c1ff16f21573ffaac773b0760754a0d18d857325-ohana-mikes-porch.webp";
import GAME_PREVIEW_HTML from "./eb607b960d62275db46017823e483f847d081e54-eb607b960d62275db46017823e483f847d081e54-eb607b960d62275db46017823e483f847d081e54-game-preview.html";
import SCENE_JS from "./f48732cefab218389d1c1d3d085c3aab985ed034-f48732cefab218389d1c1d3d085c3aab985ed034-b57f6ffb172f8dbeae7f46118808313676d76ea7-ohana-scene.js.txt";
import PORCH_DAWN from "./e9412e1a2126dfd752fc396b6831724a07b14e07-e9412e1a2126dfd752fc396b6831724a07b14e07-e9412e1a2126dfd752fc396b6831724a07b14e07-porch-dawn.webp";
import PORCH_DAY from "./f2acc1dac7ef65de2ed866c71c439942c63af16b-f2acc1dac7ef65de2ed866c71c439942c63af16b-f2acc1dac7ef65de2ed866c71c439942c63af16b-porch-day.webp";
import PORCH_NIGHT from "./1cdc7b70b8c044a684185e7c966e03e99b5eeed5-1cdc7b70b8c044a684185e7c966e03e99b5eeed5-1cdc7b70b8c044a684185e7c966e03e99b5eeed5-porch-night.webp";
import PORCH_PLAYED from "./6472a0a47dcee1857a055eda7c4ecc7f8fe7064c-6472a0a47dcee1857a055eda7c4ecc7f8fe7064c-6472a0a47dcee1857a055eda7c4ecc7f8fe7064c-porch-played.webp";
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2 = class {
  static {
    __name(this, "PerformanceEntry");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3 = class PerformanceMark22 extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMark2");
  }
  static {
    __name2(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMeasure");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2 = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2 = class {
  static {
    __name(this, "Performance");
  }
  static {
    __name2(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2 = class {
  static {
    __name(this, "PerformanceObserver");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
if (!("__unenv__" in performance2)) {
  const proto = Performance2.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2, key, desc);
      }
    }
  }
}
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
  return BigInt(Date.now() * 1e6);
}, "bigint"), "bigint") });
var ReadStream2 = class {
  static {
    __name(this, "ReadStream");
  }
  static {
    __name2(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream2 = class {
  static {
    __name(this, "WriteStream");
  }
  static {
    __name2(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION2 = "22.14.0";
var Process2 = class _Process5 extends EventEmitter2 {
  static {
    __name(this, "_Process5");
  }
  static {
    __name2(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process5.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2}`;
  }
  get versions() {
    return { node: NODE_VERSION2 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var workerdProcess2 = getBuiltinModule2("node:process");
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess2.nextTick
});
var { exit: exit2, features: features2, platform: platform2 } = workerdProcess2;
var {
  _channel: _channel2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _disconnect: _disconnect2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _handleQueue: _handleQueue2,
  _kill: _kill2,
  _linkedBinding: _linkedBinding2,
  _maxListeners: _maxListeners2,
  _pendingMessage: _pendingMessage2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _send: _send2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  assert: assert22,
  availableMemory: availableMemory2,
  binding: binding2,
  channel: channel2,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  disconnect: disconnect2,
  dlopen: dlopen2,
  domain: domain2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exitCode: exitCode2,
  finalization: finalization2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getMaxListeners: getMaxListeners2,
  getuid: getuid2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  hrtime: hrtime32,
  initgroups: initgroups2,
  kill: kill2,
  listenerCount: listenerCount2,
  listeners: listeners2,
  loadEnvFile: loadEnvFile2,
  mainModule: mainModule2,
  memoryUsage: memoryUsage2,
  moduleLoadList: moduleLoadList2,
  nextTick: nextTick2,
  off: off2,
  on: on2,
  once: once2,
  openStdin: openStdin2,
  permission: permission2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  reallyExit: reallyExit2,
  ref: ref2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  send: send2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  setuid: setuid2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  sourceMapsEnabled: sourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  throwDeprecation: throwDeprecation2,
  title: title2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  unref: unref2,
  uptime: uptime2,
  version: version2,
  versions: versions2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var OHANA_COLORING_BEACH_B64 = "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";
function b64ToBytesColoring(b64str) {
  const bin = atob(b64str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
__name(b64ToBytesColoring, "b64ToBytesColoring");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError22(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError22, "createNotImplementedError2");
__name2(createNotImplementedError22, "createNotImplementedError");
__name22(createNotImplementedError22, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented22(name) {
  const fn = /* @__PURE__ */ __name22(() => {
    throw /* @__PURE__ */ createNotImplementedError22(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented22, "notImplemented2");
__name2(notImplemented22, "notImplemented");
__name22(notImplemented22, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass22(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass22, "notImplementedClass2");
__name2(notImplementedClass22, "notImplementedClass");
__name22(notImplementedClass22, "notImplementedClass");
var _timeOrigin22 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow22 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin22;
var nodeTiming22 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry22 = class {
  static {
    __name(this, "PerformanceEntry2");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  static {
    __name22(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow22();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow22() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark32 = class PerformanceMark222 extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceMark22");
  }
  static {
    __name2(this, "PerformanceMark2");
  }
  static {
    __name22(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure22 = class extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceMeasure2");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  static {
    __name22(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming22 = class extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceResourceTiming2");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  static {
    __name22(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList22 = class {
  static {
    __name(this, "PerformanceObserverEntryList2");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  static {
    __name22(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance22 = class {
  static {
    __name(this, "Performance2");
  }
  static {
    __name2(this, "Performance");
  }
  static {
    __name22(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin22;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming22;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming22("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin22) {
      return _performanceNow22();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark32(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure22(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver22 = class {
  static {
    __name(this, "PerformanceObserver2");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  static {
    __name22(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError22("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance22 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance22();
if (!("__unenv__" in performance22)) {
  const proto = Performance22.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance22)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance22, key, desc);
      }
    }
  }
}
globalThis.performance = performance22;
globalThis.Performance = Performance22;
globalThis.PerformanceEntry = PerformanceEntry22;
globalThis.PerformanceMark = PerformanceMark32;
globalThis.PerformanceMeasure = PerformanceMeasure22;
globalThis.PerformanceObserver = PerformanceObserver22;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList22;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming22;
var noop_default22 = Object.assign(() => {
}, { __unenv__: true });
var _console22 = globalThis.console;
var _ignoreErrors22 = true;
var _stderr22 = new Writable22();
var _stdout22 = new Writable22();
var log32 = _console22?.log ?? noop_default22;
var info32 = _console22?.info ?? log32;
var trace32 = _console22?.trace ?? info32;
var debug32 = _console22?.debug ?? log32;
var table32 = _console22?.table ?? log32;
var error32 = _console22?.error ?? log32;
var warn32 = _console22?.warn ?? error32;
var createTask32 = _console22?.createTask ?? /* @__PURE__ */ notImplemented22("console.createTask");
var clear32 = _console22?.clear ?? noop_default22;
var count32 = _console22?.count ?? noop_default22;
var countReset32 = _console22?.countReset ?? noop_default22;
var dir32 = _console22?.dir ?? noop_default22;
var dirxml32 = _console22?.dirxml ?? noop_default22;
var group32 = _console22?.group ?? noop_default22;
var groupEnd32 = _console22?.groupEnd ?? noop_default22;
var groupCollapsed32 = _console22?.groupCollapsed ?? noop_default22;
var profile32 = _console22?.profile ?? noop_default22;
var profileEnd32 = _console22?.profileEnd ?? noop_default22;
var time32 = _console22?.time ?? noop_default22;
var timeEnd32 = _console22?.timeEnd ?? noop_default22;
var timeLog32 = _console22?.timeLog ?? noop_default22;
var timeStamp32 = _console22?.timeStamp ?? noop_default22;
var Console22 = _console22?.Console ?? /* @__PURE__ */ notImplementedClass22("console.Console");
var _times22 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler22 = noop_default22;
var _stderrErrorHandler22 = noop_default22;
var workerdConsole22 = globalThis["console"];
var {
  assert: assert32,
  clear: clear222,
  // @ts-expect-error undocumented public API
  context: context22,
  count: count222,
  countReset: countReset222,
  // @ts-expect-error undocumented public API
  createTask: createTask222,
  debug: debug222,
  dir: dir222,
  dirxml: dirxml222,
  error: error222,
  group: group222,
  groupCollapsed: groupCollapsed222,
  groupEnd: groupEnd222,
  info: info222,
  log: log222,
  profile: profile222,
  profileEnd: profileEnd222,
  table: table222,
  time: time222,
  timeEnd: timeEnd222,
  timeLog: timeLog222,
  timeStamp: timeStamp222,
  trace: trace222,
  warn: warn222
} = workerdConsole22;
Object.assign(workerdConsole22, {
  Console: Console22,
  _ignoreErrors: _ignoreErrors22,
  _stderr: _stderr22,
  _stderrErrorHandler: _stderrErrorHandler22,
  _stdout: _stdout22,
  _stdoutErrorHandler: _stdoutErrorHandler22,
  _times: _times22
});
var console_default22 = workerdConsole22;
globalThis.console = console_default22;
var hrtime42 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime222(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime22"), "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint22() {
  return BigInt(Date.now() * 1e6);
}, "bigint2"), "bigint"), "bigint") });
var ReadStream22 = class {
  static {
    __name(this, "ReadStream2");
  }
  static {
    __name2(this, "ReadStream");
  }
  static {
    __name22(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream22 = class {
  static {
    __name(this, "WriteStream2");
  }
  static {
    __name2(this, "WriteStream");
  }
  static {
    __name22(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION22 = "22.14.0";
var Process22 = class _Process4 extends EventEmitter22 {
  static {
    __name(this, "_Process4");
  }
  static {
    __name2(this, "_Process4");
  }
  static {
    __name22(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process4.prototype), ...Object.getOwnPropertyNames(EventEmitter22.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream22(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream22(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream22(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION22}`;
  }
  get versions() {
    return { node: NODE_VERSION22 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError22("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError22("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError22("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError22("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError22("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError22("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError22("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError22("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError22("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError22("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError22("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError22("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError22("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError22("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented22("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented22("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented22("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented22("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented22("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented22("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name22(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess22 = globalThis["process"];
var getBuiltinModule22 = globalProcess22.getBuiltinModule;
var workerdProcess22 = getBuiltinModule22("node:process");
var unenvProcess22 = new Process22({
  env: globalProcess22.env,
  hrtime: hrtime42,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess22.nextTick
});
var { exit: exit22, features: features22, platform: platform22 } = workerdProcess22;
var {
  _channel: _channel22,
  _debugEnd: _debugEnd22,
  _debugProcess: _debugProcess22,
  _disconnect: _disconnect22,
  _events: _events22,
  _eventsCount: _eventsCount22,
  _exiting: _exiting22,
  _fatalException: _fatalException22,
  _getActiveHandles: _getActiveHandles22,
  _getActiveRequests: _getActiveRequests22,
  _handleQueue: _handleQueue22,
  _kill: _kill22,
  _linkedBinding: _linkedBinding22,
  _maxListeners: _maxListeners22,
  _pendingMessage: _pendingMessage22,
  _preload_modules: _preload_modules22,
  _rawDebug: _rawDebug22,
  _send: _send22,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22,
  _tickCallback: _tickCallback22,
  abort: abort22,
  addListener: addListener22,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22,
  arch: arch22,
  argv: argv22,
  argv0: argv022,
  assert: assert222,
  availableMemory: availableMemory22,
  binding: binding22,
  channel: channel22,
  chdir: chdir22,
  config: config22,
  connected: connected22,
  constrainedMemory: constrainedMemory22,
  cpuUsage: cpuUsage22,
  cwd: cwd22,
  debugPort: debugPort22,
  disconnect: disconnect22,
  dlopen: dlopen22,
  domain: domain22,
  emit: emit22,
  emitWarning: emitWarning22,
  env: env22,
  eventNames: eventNames22,
  execArgv: execArgv22,
  execPath: execPath22,
  exitCode: exitCode22,
  finalization: finalization22,
  getActiveResourcesInfo: getActiveResourcesInfo22,
  getegid: getegid22,
  geteuid: geteuid22,
  getgid: getgid22,
  getgroups: getgroups22,
  getMaxListeners: getMaxListeners22,
  getuid: getuid22,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22,
  hrtime: hrtime322,
  initgroups: initgroups22,
  kill: kill22,
  listenerCount: listenerCount22,
  listeners: listeners22,
  loadEnvFile: loadEnvFile22,
  mainModule: mainModule22,
  memoryUsage: memoryUsage22,
  moduleLoadList: moduleLoadList22,
  nextTick: nextTick22,
  off: off22,
  on: on22,
  once: once22,
  openStdin: openStdin22,
  permission: permission22,
  pid: pid22,
  ppid: ppid22,
  prependListener: prependListener22,
  prependOnceListener: prependOnceListener22,
  rawListeners: rawListeners22,
  reallyExit: reallyExit22,
  ref: ref22,
  release: release22,
  removeAllListeners: removeAllListeners22,
  removeListener: removeListener22,
  report: report22,
  resourceUsage: resourceUsage22,
  send: send22,
  setegid: setegid22,
  seteuid: seteuid22,
  setgid: setgid22,
  setgroups: setgroups22,
  setMaxListeners: setMaxListeners22,
  setSourceMapsEnabled: setSourceMapsEnabled22,
  setuid: setuid22,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22,
  sourceMapsEnabled: sourceMapsEnabled22,
  stderr: stderr22,
  stdin: stdin22,
  stdout: stdout22,
  throwDeprecation: throwDeprecation22,
  title: title22,
  traceDeprecation: traceDeprecation22,
  umask: umask22,
  unref: unref22,
  uptime: uptime22,
  version: version22,
  versions: versions22
} = unenvProcess22;
var _process22 = {
  abort: abort22,
  addListener: addListener22,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22,
  loadEnvFile: loadEnvFile22,
  sourceMapsEnabled: sourceMapsEnabled22,
  arch: arch22,
  argv: argv22,
  argv0: argv022,
  chdir: chdir22,
  config: config22,
  connected: connected22,
  constrainedMemory: constrainedMemory22,
  availableMemory: availableMemory22,
  cpuUsage: cpuUsage22,
  cwd: cwd22,
  debugPort: debugPort22,
  dlopen: dlopen22,
  disconnect: disconnect22,
  emit: emit22,
  emitWarning: emitWarning22,
  env: env22,
  eventNames: eventNames22,
  execArgv: execArgv22,
  execPath: execPath22,
  exit: exit22,
  finalization: finalization22,
  features: features22,
  getBuiltinModule: getBuiltinModule22,
  getActiveResourcesInfo: getActiveResourcesInfo22,
  getMaxListeners: getMaxListeners22,
  hrtime: hrtime322,
  kill: kill22,
  listeners: listeners22,
  listenerCount: listenerCount22,
  memoryUsage: memoryUsage22,
  nextTick: nextTick22,
  on: on22,
  off: off22,
  once: once22,
  pid: pid22,
  platform: platform22,
  ppid: ppid22,
  prependListener: prependListener22,
  prependOnceListener: prependOnceListener22,
  rawListeners: rawListeners22,
  release: release22,
  removeAllListeners: removeAllListeners22,
  removeListener: removeListener22,
  report: report22,
  resourceUsage: resourceUsage22,
  setMaxListeners: setMaxListeners22,
  setSourceMapsEnabled: setSourceMapsEnabled22,
  stderr: stderr22,
  stdin: stdin22,
  stdout: stdout22,
  title: title22,
  throwDeprecation: throwDeprecation22,
  traceDeprecation: traceDeprecation22,
  umask: umask22,
  uptime: uptime22,
  version: version22,
  versions: versions22,
  // @ts-expect-error old API
  domain: domain22,
  initgroups: initgroups22,
  moduleLoadList: moduleLoadList22,
  reallyExit: reallyExit22,
  openStdin: openStdin22,
  assert: assert222,
  binding: binding22,
  send: send22,
  exitCode: exitCode22,
  channel: channel22,
  getegid: getegid22,
  geteuid: geteuid22,
  getgid: getgid22,
  getgroups: getgroups22,
  getuid: getuid22,
  setegid: setegid22,
  seteuid: seteuid22,
  setgid: setgid22,
  setgroups: setgroups22,
  setuid: setuid22,
  permission: permission22,
  mainModule: mainModule22,
  _events: _events22,
  _eventsCount: _eventsCount22,
  _exiting: _exiting22,
  _maxListeners: _maxListeners22,
  _debugEnd: _debugEnd22,
  _debugProcess: _debugProcess22,
  _fatalException: _fatalException22,
  _getActiveHandles: _getActiveHandles22,
  _getActiveRequests: _getActiveRequests22,
  _kill: _kill22,
  _preload_modules: _preload_modules22,
  _rawDebug: _rawDebug22,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22,
  _tickCallback: _tickCallback22,
  _disconnect: _disconnect22,
  _handleQueue: _handleQueue22,
  _pendingMessage: _pendingMessage22,
  _channel: _channel22,
  _send: _send22,
  _linkedBinding: _linkedBinding22
};
var process_default22 = _process22;
globalThis.process = process_default22;
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22((target, value) => __defProp222(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError222(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError222, "createNotImplementedError22");
__name2(createNotImplementedError222, "createNotImplementedError2");
__name22(createNotImplementedError222, "createNotImplementedError");
__name222(createNotImplementedError222, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented222(name) {
  const fn = /* @__PURE__ */ __name222(() => {
    throw /* @__PURE__ */ createNotImplementedError222(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented222, "notImplemented22");
__name2(notImplemented222, "notImplemented2");
__name22(notImplemented222, "notImplemented");
__name222(notImplemented222, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass222(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass222, "notImplementedClass22");
__name2(notImplementedClass222, "notImplementedClass2");
__name22(notImplementedClass222, "notImplementedClass");
__name222(notImplementedClass222, "notImplementedClass");
var _timeOrigin222 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow222 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin222;
var nodeTiming222 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry222 = class {
  static {
    __name(this, "PerformanceEntry22");
  }
  static {
    __name2(this, "PerformanceEntry2");
  }
  static {
    __name22(this, "PerformanceEntry");
  }
  static {
    __name222(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow222();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow222() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark322 = class PerformanceMark2222 extends PerformanceEntry222 {
  static {
    __name(this, "PerformanceMark222");
  }
  static {
    __name2(this, "PerformanceMark22");
  }
  static {
    __name22(this, "PerformanceMark2");
  }
  static {
    __name222(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure222 = class extends PerformanceEntry222 {
  static {
    __name(this, "PerformanceMeasure22");
  }
  static {
    __name2(this, "PerformanceMeasure2");
  }
  static {
    __name22(this, "PerformanceMeasure");
  }
  static {
    __name222(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming222 = class extends PerformanceEntry222 {
  static {
    __name(this, "PerformanceResourceTiming22");
  }
  static {
    __name2(this, "PerformanceResourceTiming2");
  }
  static {
    __name22(this, "PerformanceResourceTiming");
  }
  static {
    __name222(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList222 = class {
  static {
    __name(this, "PerformanceObserverEntryList22");
  }
  static {
    __name2(this, "PerformanceObserverEntryList2");
  }
  static {
    __name22(this, "PerformanceObserverEntryList");
  }
  static {
    __name222(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance222 = class {
  static {
    __name(this, "Performance22");
  }
  static {
    __name2(this, "Performance2");
  }
  static {
    __name22(this, "Performance");
  }
  static {
    __name222(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin222;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError222("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming222;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming222("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin222) {
      return _performanceNow222();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark322(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure222(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError222("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError222("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError222("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver222 = class {
  static {
    __name(this, "PerformanceObserver22");
  }
  static {
    __name2(this, "PerformanceObserver2");
  }
  static {
    __name22(this, "PerformanceObserver");
  }
  static {
    __name222(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError222("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError222("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance222 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance222();
if (!("__unenv__" in performance222)) {
  const proto = Performance222.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance222)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance222, key, desc);
      }
    }
  }
}
globalThis.performance = performance222;
globalThis.Performance = Performance222;
globalThis.PerformanceEntry = PerformanceEntry222;
globalThis.PerformanceMark = PerformanceMark322;
globalThis.PerformanceMeasure = PerformanceMeasure222;
globalThis.PerformanceObserver = PerformanceObserver222;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList222;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming222;
var noop_default222 = Object.assign(() => {
}, { __unenv__: true });
var _console222 = globalThis.console;
var _ignoreErrors222 = true;
var _stderr222 = new Writable222();
var _stdout222 = new Writable222();
var log322 = _console222?.log ?? noop_default222;
var info322 = _console222?.info ?? log322;
var trace322 = _console222?.trace ?? info322;
var debug322 = _console222?.debug ?? log322;
var table322 = _console222?.table ?? log322;
var error322 = _console222?.error ?? log322;
var warn322 = _console222?.warn ?? error322;
var createTask322 = _console222?.createTask ?? /* @__PURE__ */ notImplemented222("console.createTask");
var clear322 = _console222?.clear ?? noop_default222;
var count322 = _console222?.count ?? noop_default222;
var countReset322 = _console222?.countReset ?? noop_default222;
var dir322 = _console222?.dir ?? noop_default222;
var dirxml322 = _console222?.dirxml ?? noop_default222;
var group322 = _console222?.group ?? noop_default222;
var groupEnd322 = _console222?.groupEnd ?? noop_default222;
var groupCollapsed322 = _console222?.groupCollapsed ?? noop_default222;
var profile322 = _console222?.profile ?? noop_default222;
var profileEnd322 = _console222?.profileEnd ?? noop_default222;
var time322 = _console222?.time ?? noop_default222;
var timeEnd322 = _console222?.timeEnd ?? noop_default222;
var timeLog322 = _console222?.timeLog ?? noop_default222;
var timeStamp322 = _console222?.timeStamp ?? noop_default222;
var Console222 = _console222?.Console ?? /* @__PURE__ */ notImplementedClass222("console.Console");
var _times222 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler222 = noop_default222;
var _stderrErrorHandler222 = noop_default222;
var workerdConsole222 = globalThis["console"];
var {
  assert: assert322,
  clear: clear2222,
  // @ts-expect-error undocumented public API
  context: context222,
  count: count2222,
  countReset: countReset2222,
  // @ts-expect-error undocumented public API
  createTask: createTask2222,
  debug: debug2222,
  dir: dir2222,
  dirxml: dirxml2222,
  error: error2222,
  group: group2222,
  groupCollapsed: groupCollapsed2222,
  groupEnd: groupEnd2222,
  info: info2222,
  log: log2222,
  profile: profile2222,
  profileEnd: profileEnd2222,
  table: table2222,
  time: time2222,
  timeEnd: timeEnd2222,
  timeLog: timeLog2222,
  timeStamp: timeStamp2222,
  trace: trace2222,
  warn: warn2222
} = workerdConsole222;
Object.assign(workerdConsole222, {
  Console: Console222,
  _ignoreErrors: _ignoreErrors222,
  _stderr: _stderr222,
  _stderrErrorHandler: _stderrErrorHandler222,
  _stdout: _stdout222,
  _stdoutErrorHandler: _stdoutErrorHandler222,
  _times: _times222
});
var console_default222 = workerdConsole222;
globalThis.console = console_default222;
var hrtime422 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime2222(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime222"), "hrtime22"), "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint222() {
  return BigInt(Date.now() * 1e6);
}, "bigint22"), "bigint2"), "bigint"), "bigint") });
var ReadStream222 = class {
  static {
    __name(this, "ReadStream22");
  }
  static {
    __name2(this, "ReadStream2");
  }
  static {
    __name22(this, "ReadStream");
  }
  static {
    __name222(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream222 = class {
  static {
    __name(this, "WriteStream22");
  }
  static {
    __name2(this, "WriteStream2");
  }
  static {
    __name22(this, "WriteStream");
  }
  static {
    __name222(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION222 = "22.14.0";
var Process222 = class _Process3 extends EventEmitter222 {
  static {
    __name(this, "_Process3");
  }
  static {
    __name2(this, "_Process3");
  }
  static {
    __name22(this, "_Process3");
  }
  static {
    __name222(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process3.prototype), ...Object.getOwnPropertyNames(EventEmitter222.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream222(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream222(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream222(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION222}`;
  }
  get versions() {
    return { node: NODE_VERSION222 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError222("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError222("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError222("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError222("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError222("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError222("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError222("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError222("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError222("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError222("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError222("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError222("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError222("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError222("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError222("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError222("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError222("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented222("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented222("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented222("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented222("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented222("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented222("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name222(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess222 = globalThis["process"];
var getBuiltinModule222 = globalProcess222.getBuiltinModule;
var workerdProcess222 = getBuiltinModule222("node:process");
var unenvProcess222 = new Process222({
  env: globalProcess222.env,
  hrtime: hrtime422,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess222.nextTick
});
var { exit: exit222, features: features222, platform: platform222 } = workerdProcess222;
var {
  _channel: _channel222,
  _debugEnd: _debugEnd222,
  _debugProcess: _debugProcess222,
  _disconnect: _disconnect222,
  _events: _events222,
  _eventsCount: _eventsCount222,
  _exiting: _exiting222,
  _fatalException: _fatalException222,
  _getActiveHandles: _getActiveHandles222,
  _getActiveRequests: _getActiveRequests222,
  _handleQueue: _handleQueue222,
  _kill: _kill222,
  _linkedBinding: _linkedBinding222,
  _maxListeners: _maxListeners222,
  _pendingMessage: _pendingMessage222,
  _preload_modules: _preload_modules222,
  _rawDebug: _rawDebug222,
  _send: _send222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier222,
  _tickCallback: _tickCallback222,
  abort: abort222,
  addListener: addListener222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags222,
  arch: arch222,
  argv: argv222,
  argv0: argv0222,
  assert: assert2222,
  availableMemory: availableMemory222,
  binding: binding222,
  channel: channel222,
  chdir: chdir222,
  config: config222,
  connected: connected222,
  constrainedMemory: constrainedMemory222,
  cpuUsage: cpuUsage222,
  cwd: cwd222,
  debugPort: debugPort222,
  disconnect: disconnect222,
  dlopen: dlopen222,
  domain: domain222,
  emit: emit222,
  emitWarning: emitWarning222,
  env: env222,
  eventNames: eventNames222,
  execArgv: execArgv222,
  execPath: execPath222,
  exitCode: exitCode222,
  finalization: finalization222,
  getActiveResourcesInfo: getActiveResourcesInfo222,
  getegid: getegid222,
  geteuid: geteuid222,
  getgid: getgid222,
  getgroups: getgroups222,
  getMaxListeners: getMaxListeners222,
  getuid: getuid222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback222,
  hrtime: hrtime3222,
  initgroups: initgroups222,
  kill: kill222,
  listenerCount: listenerCount222,
  listeners: listeners222,
  loadEnvFile: loadEnvFile222,
  mainModule: mainModule222,
  memoryUsage: memoryUsage222,
  moduleLoadList: moduleLoadList222,
  nextTick: nextTick222,
  off: off222,
  on: on222,
  once: once222,
  openStdin: openStdin222,
  permission: permission222,
  pid: pid222,
  ppid: ppid222,
  prependListener: prependListener222,
  prependOnceListener: prependOnceListener222,
  rawListeners: rawListeners222,
  reallyExit: reallyExit222,
  ref: ref222,
  release: release222,
  removeAllListeners: removeAllListeners222,
  removeListener: removeListener222,
  report: report222,
  resourceUsage: resourceUsage222,
  send: send222,
  setegid: setegid222,
  seteuid: seteuid222,
  setgid: setgid222,
  setgroups: setgroups222,
  setMaxListeners: setMaxListeners222,
  setSourceMapsEnabled: setSourceMapsEnabled222,
  setuid: setuid222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback222,
  sourceMapsEnabled: sourceMapsEnabled222,
  stderr: stderr222,
  stdin: stdin222,
  stdout: stdout222,
  throwDeprecation: throwDeprecation222,
  title: title222,
  traceDeprecation: traceDeprecation222,
  umask: umask222,
  unref: unref222,
  uptime: uptime222,
  version: version222,
  versions: versions222
} = unenvProcess222;
var _process222 = {
  abort: abort222,
  addListener: addListener222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback222,
  loadEnvFile: loadEnvFile222,
  sourceMapsEnabled: sourceMapsEnabled222,
  arch: arch222,
  argv: argv222,
  argv0: argv0222,
  chdir: chdir222,
  config: config222,
  connected: connected222,
  constrainedMemory: constrainedMemory222,
  availableMemory: availableMemory222,
  cpuUsage: cpuUsage222,
  cwd: cwd222,
  debugPort: debugPort222,
  dlopen: dlopen222,
  disconnect: disconnect222,
  emit: emit222,
  emitWarning: emitWarning222,
  env: env222,
  eventNames: eventNames222,
  execArgv: execArgv222,
  execPath: execPath222,
  exit: exit222,
  finalization: finalization222,
  features: features222,
  getBuiltinModule: getBuiltinModule222,
  getActiveResourcesInfo: getActiveResourcesInfo222,
  getMaxListeners: getMaxListeners222,
  hrtime: hrtime3222,
  kill: kill222,
  listeners: listeners222,
  listenerCount: listenerCount222,
  memoryUsage: memoryUsage222,
  nextTick: nextTick222,
  on: on222,
  off: off222,
  once: once222,
  pid: pid222,
  platform: platform222,
  ppid: ppid222,
  prependListener: prependListener222,
  prependOnceListener: prependOnceListener222,
  rawListeners: rawListeners222,
  release: release222,
  removeAllListeners: removeAllListeners222,
  removeListener: removeListener222,
  report: report222,
  resourceUsage: resourceUsage222,
  setMaxListeners: setMaxListeners222,
  setSourceMapsEnabled: setSourceMapsEnabled222,
  stderr: stderr222,
  stdin: stdin222,
  stdout: stdout222,
  title: title222,
  throwDeprecation: throwDeprecation222,
  traceDeprecation: traceDeprecation222,
  umask: umask222,
  uptime: uptime222,
  version: version222,
  versions: versions222,
  // @ts-expect-error old API
  domain: domain222,
  initgroups: initgroups222,
  moduleLoadList: moduleLoadList222,
  reallyExit: reallyExit222,
  openStdin: openStdin222,
  assert: assert2222,
  binding: binding222,
  send: send222,
  exitCode: exitCode222,
  channel: channel222,
  getegid: getegid222,
  geteuid: geteuid222,
  getgid: getgid222,
  getgroups: getgroups222,
  getuid: getuid222,
  setegid: setegid222,
  seteuid: seteuid222,
  setgid: setgid222,
  setgroups: setgroups222,
  setuid: setuid222,
  permission: permission222,
  mainModule: mainModule222,
  _events: _events222,
  _eventsCount: _eventsCount222,
  _exiting: _exiting222,
  _maxListeners: _maxListeners222,
  _debugEnd: _debugEnd222,
  _debugProcess: _debugProcess222,
  _fatalException: _fatalException222,
  _getActiveHandles: _getActiveHandles222,
  _getActiveRequests: _getActiveRequests222,
  _kill: _kill222,
  _preload_modules: _preload_modules222,
  _rawDebug: _rawDebug222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier222,
  _tickCallback: _tickCallback222,
  _disconnect: _disconnect222,
  _handleQueue: _handleQueue222,
  _pendingMessage: _pendingMessage222,
  _channel: _channel222,
  _send: _send222,
  _linkedBinding: _linkedBinding222
};
var process_default222 = _process222;
globalThis.process = process_default222;
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222((target, value) => __defProp2222(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2222(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2222, "createNotImplementedError222");
__name2(createNotImplementedError2222, "createNotImplementedError22");
__name22(createNotImplementedError2222, "createNotImplementedError2");
__name222(createNotImplementedError2222, "createNotImplementedError");
__name2222(createNotImplementedError2222, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2222(name) {
  const fn = /* @__PURE__ */ __name2222(() => {
    throw /* @__PURE__ */ createNotImplementedError2222(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2222, "notImplemented222");
__name2(notImplemented2222, "notImplemented22");
__name22(notImplemented2222, "notImplemented2");
__name222(notImplemented2222, "notImplemented");
__name2222(notImplemented2222, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2222(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2222, "notImplementedClass222");
__name2(notImplementedClass2222, "notImplementedClass22");
__name22(notImplementedClass2222, "notImplementedClass2");
__name222(notImplementedClass2222, "notImplementedClass");
__name2222(notImplementedClass2222, "notImplementedClass");
var _timeOrigin2222 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2222 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2222;
var nodeTiming2222 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2222 = class {
  static {
    __name(this, "PerformanceEntry222");
  }
  static {
    __name2(this, "PerformanceEntry22");
  }
  static {
    __name22(this, "PerformanceEntry2");
  }
  static {
    __name222(this, "PerformanceEntry");
  }
  static {
    __name2222(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2222();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2222() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3222 = class PerformanceMark22222 extends PerformanceEntry2222 {
  static {
    __name(this, "PerformanceMark2222");
  }
  static {
    __name2(this, "PerformanceMark222");
  }
  static {
    __name22(this, "PerformanceMark22");
  }
  static {
    __name222(this, "PerformanceMark2");
  }
  static {
    __name2222(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2222 = class extends PerformanceEntry2222 {
  static {
    __name(this, "PerformanceMeasure222");
  }
  static {
    __name2(this, "PerformanceMeasure22");
  }
  static {
    __name22(this, "PerformanceMeasure2");
  }
  static {
    __name222(this, "PerformanceMeasure");
  }
  static {
    __name2222(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2222 = class extends PerformanceEntry2222 {
  static {
    __name(this, "PerformanceResourceTiming222");
  }
  static {
    __name2(this, "PerformanceResourceTiming22");
  }
  static {
    __name22(this, "PerformanceResourceTiming2");
  }
  static {
    __name222(this, "PerformanceResourceTiming");
  }
  static {
    __name2222(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2222 = class {
  static {
    __name(this, "PerformanceObserverEntryList222");
  }
  static {
    __name2(this, "PerformanceObserverEntryList22");
  }
  static {
    __name22(this, "PerformanceObserverEntryList2");
  }
  static {
    __name222(this, "PerformanceObserverEntryList");
  }
  static {
    __name2222(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2222 = class {
  static {
    __name(this, "Performance222");
  }
  static {
    __name2(this, "Performance22");
  }
  static {
    __name22(this, "Performance2");
  }
  static {
    __name222(this, "Performance");
  }
  static {
    __name2222(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2222;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2222("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2222;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2222("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2222) {
      return _performanceNow2222();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3222(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2222(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2222("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2222("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2222("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2222 = class {
  static {
    __name(this, "PerformanceObserver222");
  }
  static {
    __name2(this, "PerformanceObserver22");
  }
  static {
    __name22(this, "PerformanceObserver2");
  }
  static {
    __name222(this, "PerformanceObserver");
  }
  static {
    __name2222(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2222("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2222("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2222 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2222();
if (!("__unenv__" in performance2222)) {
  const proto = Performance2222.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2222)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2222, key, desc);
      }
    }
  }
}
globalThis.performance = performance2222;
globalThis.Performance = Performance2222;
globalThis.PerformanceEntry = PerformanceEntry2222;
globalThis.PerformanceMark = PerformanceMark3222;
globalThis.PerformanceMeasure = PerformanceMeasure2222;
globalThis.PerformanceObserver = PerformanceObserver2222;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2222;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2222;
var noop_default2222 = Object.assign(() => {
}, { __unenv__: true });
var _console2222 = globalThis.console;
var _ignoreErrors2222 = true;
var _stderr2222 = new Writable2222();
var _stdout2222 = new Writable2222();
var log3222 = _console2222?.log ?? noop_default2222;
var info3222 = _console2222?.info ?? log3222;
var trace3222 = _console2222?.trace ?? info3222;
var debug3222 = _console2222?.debug ?? log3222;
var table3222 = _console2222?.table ?? log3222;
var error3222 = _console2222?.error ?? log3222;
var warn3222 = _console2222?.warn ?? error3222;
var createTask3222 = _console2222?.createTask ?? /* @__PURE__ */ notImplemented2222("console.createTask");
var clear3222 = _console2222?.clear ?? noop_default2222;
var count3222 = _console2222?.count ?? noop_default2222;
var countReset3222 = _console2222?.countReset ?? noop_default2222;
var dir3222 = _console2222?.dir ?? noop_default2222;
var dirxml3222 = _console2222?.dirxml ?? noop_default2222;
var group3222 = _console2222?.group ?? noop_default2222;
var groupEnd3222 = _console2222?.groupEnd ?? noop_default2222;
var groupCollapsed3222 = _console2222?.groupCollapsed ?? noop_default2222;
var profile3222 = _console2222?.profile ?? noop_default2222;
var profileEnd3222 = _console2222?.profileEnd ?? noop_default2222;
var time3222 = _console2222?.time ?? noop_default2222;
var timeEnd3222 = _console2222?.timeEnd ?? noop_default2222;
var timeLog3222 = _console2222?.timeLog ?? noop_default2222;
var timeStamp3222 = _console2222?.timeStamp ?? noop_default2222;
var Console2222 = _console2222?.Console ?? /* @__PURE__ */ notImplementedClass2222("console.Console");
var _times2222 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2222 = noop_default2222;
var _stderrErrorHandler2222 = noop_default2222;
var workerdConsole2222 = globalThis["console"];
var {
  assert: assert3222,
  clear: clear22222,
  // @ts-expect-error undocumented public API
  context: context2222,
  count: count22222,
  countReset: countReset22222,
  // @ts-expect-error undocumented public API
  createTask: createTask22222,
  debug: debug22222,
  dir: dir22222,
  dirxml: dirxml22222,
  error: error22222,
  group: group22222,
  groupCollapsed: groupCollapsed22222,
  groupEnd: groupEnd22222,
  info: info22222,
  log: log22222,
  profile: profile22222,
  profileEnd: profileEnd22222,
  table: table22222,
  time: time22222,
  timeEnd: timeEnd22222,
  timeLog: timeLog22222,
  timeStamp: timeStamp22222,
  trace: trace22222,
  warn: warn22222
} = workerdConsole2222;
Object.assign(workerdConsole2222, {
  Console: Console2222,
  _ignoreErrors: _ignoreErrors2222,
  _stderr: _stderr2222,
  _stderrErrorHandler: _stderrErrorHandler2222,
  _stdout: _stdout2222,
  _stdoutErrorHandler: _stdoutErrorHandler2222,
  _times: _times2222
});
var console_default2222 = workerdConsole2222;
globalThis.console = console_default2222;
var hrtime4222 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2222(/* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22222(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2222"), "hrtime222"), "hrtime22"), "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2222(/* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2222() {
  return BigInt(Date.now() * 1e6);
}, "bigint222"), "bigint22"), "bigint2"), "bigint"), "bigint") });
var ReadStream2222 = class {
  static {
    __name(this, "ReadStream222");
  }
  static {
    __name2(this, "ReadStream22");
  }
  static {
    __name22(this, "ReadStream2");
  }
  static {
    __name222(this, "ReadStream");
  }
  static {
    __name2222(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream2222 = class {
  static {
    __name(this, "WriteStream222");
  }
  static {
    __name2(this, "WriteStream22");
  }
  static {
    __name22(this, "WriteStream2");
  }
  static {
    __name222(this, "WriteStream");
  }
  static {
    __name2222(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION2222 = "22.14.0";
var Process2222 = class _Process2 extends EventEmitter2222 {
  static {
    __name(this, "_Process2");
  }
  static {
    __name2(this, "_Process2");
  }
  static {
    __name22(this, "_Process2");
  }
  static {
    __name222(this, "_Process2");
  }
  static {
    __name2222(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter2222.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2222(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2222(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2222(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2222}`;
  }
  get versions() {
    return { node: NODE_VERSION2222 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2222("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2222("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2222("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2222("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2222("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2222("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2222("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2222(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2222 = globalThis["process"];
var getBuiltinModule2222 = globalProcess2222.getBuiltinModule;
var workerdProcess2222 = getBuiltinModule2222("node:process");
var unenvProcess2222 = new Process2222({
  env: globalProcess2222.env,
  hrtime: hrtime4222,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess2222.nextTick
});
var { exit: exit2222, features: features2222, platform: platform2222 } = workerdProcess2222;
var {
  _channel: _channel2222,
  _debugEnd: _debugEnd2222,
  _debugProcess: _debugProcess2222,
  _disconnect: _disconnect2222,
  _events: _events2222,
  _eventsCount: _eventsCount2222,
  _exiting: _exiting2222,
  _fatalException: _fatalException2222,
  _getActiveHandles: _getActiveHandles2222,
  _getActiveRequests: _getActiveRequests2222,
  _handleQueue: _handleQueue2222,
  _kill: _kill2222,
  _linkedBinding: _linkedBinding2222,
  _maxListeners: _maxListeners2222,
  _pendingMessage: _pendingMessage2222,
  _preload_modules: _preload_modules2222,
  _rawDebug: _rawDebug2222,
  _send: _send2222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2222,
  _tickCallback: _tickCallback2222,
  abort: abort2222,
  addListener: addListener2222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2222,
  arch: arch2222,
  argv: argv2222,
  argv0: argv02222,
  assert: assert22222,
  availableMemory: availableMemory2222,
  binding: binding2222,
  channel: channel2222,
  chdir: chdir2222,
  config: config2222,
  connected: connected2222,
  constrainedMemory: constrainedMemory2222,
  cpuUsage: cpuUsage2222,
  cwd: cwd2222,
  debugPort: debugPort2222,
  disconnect: disconnect2222,
  dlopen: dlopen2222,
  domain: domain2222,
  emit: emit2222,
  emitWarning: emitWarning2222,
  env: env2222,
  eventNames: eventNames2222,
  execArgv: execArgv2222,
  execPath: execPath2222,
  exitCode: exitCode2222,
  finalization: finalization2222,
  getActiveResourcesInfo: getActiveResourcesInfo2222,
  getegid: getegid2222,
  geteuid: geteuid2222,
  getgid: getgid2222,
  getgroups: getgroups2222,
  getMaxListeners: getMaxListeners2222,
  getuid: getuid2222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2222,
  hrtime: hrtime32222,
  initgroups: initgroups2222,
  kill: kill2222,
  listenerCount: listenerCount2222,
  listeners: listeners2222,
  loadEnvFile: loadEnvFile2222,
  mainModule: mainModule2222,
  memoryUsage: memoryUsage2222,
  moduleLoadList: moduleLoadList2222,
  nextTick: nextTick2222,
  off: off2222,
  on: on2222,
  once: once2222,
  openStdin: openStdin2222,
  permission: permission2222,
  pid: pid2222,
  ppid: ppid2222,
  prependListener: prependListener2222,
  prependOnceListener: prependOnceListener2222,
  rawListeners: rawListeners2222,
  reallyExit: reallyExit2222,
  ref: ref2222,
  release: release2222,
  removeAllListeners: removeAllListeners2222,
  removeListener: removeListener2222,
  report: report2222,
  resourceUsage: resourceUsage2222,
  send: send2222,
  setegid: setegid2222,
  seteuid: seteuid2222,
  setgid: setgid2222,
  setgroups: setgroups2222,
  setMaxListeners: setMaxListeners2222,
  setSourceMapsEnabled: setSourceMapsEnabled2222,
  setuid: setuid2222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2222,
  sourceMapsEnabled: sourceMapsEnabled2222,
  stderr: stderr2222,
  stdin: stdin2222,
  stdout: stdout2222,
  throwDeprecation: throwDeprecation2222,
  title: title2222,
  traceDeprecation: traceDeprecation2222,
  umask: umask2222,
  unref: unref2222,
  uptime: uptime2222,
  version: version2222,
  versions: versions2222
} = unenvProcess2222;
var _process2222 = {
  abort: abort2222,
  addListener: addListener2222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2222,
  loadEnvFile: loadEnvFile2222,
  sourceMapsEnabled: sourceMapsEnabled2222,
  arch: arch2222,
  argv: argv2222,
  argv0: argv02222,
  chdir: chdir2222,
  config: config2222,
  connected: connected2222,
  constrainedMemory: constrainedMemory2222,
  availableMemory: availableMemory2222,
  cpuUsage: cpuUsage2222,
  cwd: cwd2222,
  debugPort: debugPort2222,
  dlopen: dlopen2222,
  disconnect: disconnect2222,
  emit: emit2222,
  emitWarning: emitWarning2222,
  env: env2222,
  eventNames: eventNames2222,
  execArgv: execArgv2222,
  execPath: execPath2222,
  exit: exit2222,
  finalization: finalization2222,
  features: features2222,
  getBuiltinModule: getBuiltinModule2222,
  getActiveResourcesInfo: getActiveResourcesInfo2222,
  getMaxListeners: getMaxListeners2222,
  hrtime: hrtime32222,
  kill: kill2222,
  listeners: listeners2222,
  listenerCount: listenerCount2222,
  memoryUsage: memoryUsage2222,
  nextTick: nextTick2222,
  on: on2222,
  off: off2222,
  once: once2222,
  pid: pid2222,
  platform: platform2222,
  ppid: ppid2222,
  prependListener: prependListener2222,
  prependOnceListener: prependOnceListener2222,
  rawListeners: rawListeners2222,
  release: release2222,
  removeAllListeners: removeAllListeners2222,
  removeListener: removeListener2222,
  report: report2222,
  resourceUsage: resourceUsage2222,
  setMaxListeners: setMaxListeners2222,
  setSourceMapsEnabled: setSourceMapsEnabled2222,
  stderr: stderr2222,
  stdin: stdin2222,
  stdout: stdout2222,
  title: title2222,
  throwDeprecation: throwDeprecation2222,
  traceDeprecation: traceDeprecation2222,
  umask: umask2222,
  uptime: uptime2222,
  version: version2222,
  versions: versions2222,
  // @ts-expect-error old API
  domain: domain2222,
  initgroups: initgroups2222,
  moduleLoadList: moduleLoadList2222,
  reallyExit: reallyExit2222,
  openStdin: openStdin2222,
  assert: assert22222,
  binding: binding2222,
  send: send2222,
  exitCode: exitCode2222,
  channel: channel2222,
  getegid: getegid2222,
  geteuid: geteuid2222,
  getgid: getgid2222,
  getgroups: getgroups2222,
  getuid: getuid2222,
  setegid: setegid2222,
  seteuid: seteuid2222,
  setgid: setgid2222,
  setgroups: setgroups2222,
  setuid: setuid2222,
  permission: permission2222,
  mainModule: mainModule2222,
  _events: _events2222,
  _eventsCount: _eventsCount2222,
  _exiting: _exiting2222,
  _maxListeners: _maxListeners2222,
  _debugEnd: _debugEnd2222,
  _debugProcess: _debugProcess2222,
  _fatalException: _fatalException2222,
  _getActiveHandles: _getActiveHandles2222,
  _getActiveRequests: _getActiveRequests2222,
  _kill: _kill2222,
  _preload_modules: _preload_modules2222,
  _rawDebug: _rawDebug2222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2222,
  _tickCallback: _tickCallback2222,
  _disconnect: _disconnect2222,
  _handleQueue: _handleQueue2222,
  _pendingMessage: _pendingMessage2222,
  _channel: _channel2222,
  _send: _send2222,
  _linkedBinding: _linkedBinding2222
};
var process_default2222 = _process2222;
globalThis.process = process_default2222;
var __defProp22222 = Object.defineProperty;
var __name22222 = /* @__PURE__ */ __name2222((target, value) => __defProp22222(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError22222(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError22222, "createNotImplementedError2222");
__name2(createNotImplementedError22222, "createNotImplementedError222");
__name22(createNotImplementedError22222, "createNotImplementedError22");
__name222(createNotImplementedError22222, "createNotImplementedError2");
__name2222(createNotImplementedError22222, "createNotImplementedError");
__name22222(createNotImplementedError22222, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented22222(name) {
  const fn = /* @__PURE__ */ __name22222(() => {
    throw /* @__PURE__ */ createNotImplementedError22222(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented22222, "notImplemented2222");
__name2(notImplemented22222, "notImplemented222");
__name22(notImplemented22222, "notImplemented22");
__name222(notImplemented22222, "notImplemented2");
__name2222(notImplemented22222, "notImplemented");
__name22222(notImplemented22222, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass22222(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass22222, "notImplementedClass2222");
__name2(notImplementedClass22222, "notImplementedClass222");
__name22(notImplementedClass22222, "notImplementedClass22");
__name222(notImplementedClass22222, "notImplementedClass2");
__name2222(notImplementedClass22222, "notImplementedClass");
__name22222(notImplementedClass22222, "notImplementedClass");
var _timeOrigin22222 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow22222 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin22222;
var nodeTiming22222 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry22222 = class {
  static {
    __name(this, "PerformanceEntry2222");
  }
  static {
    __name2(this, "PerformanceEntry222");
  }
  static {
    __name22(this, "PerformanceEntry22");
  }
  static {
    __name222(this, "PerformanceEntry2");
  }
  static {
    __name2222(this, "PerformanceEntry");
  }
  static {
    __name22222(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow22222();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow22222() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark32222 = class PerformanceMark222222 extends PerformanceEntry22222 {
  static {
    __name(this, "PerformanceMark22222");
  }
  static {
    __name2(this, "PerformanceMark2222");
  }
  static {
    __name22(this, "PerformanceMark222");
  }
  static {
    __name222(this, "PerformanceMark22");
  }
  static {
    __name2222(this, "PerformanceMark2");
  }
  static {
    __name22222(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure22222 = class extends PerformanceEntry22222 {
  static {
    __name(this, "PerformanceMeasure2222");
  }
  static {
    __name2(this, "PerformanceMeasure222");
  }
  static {
    __name22(this, "PerformanceMeasure22");
  }
  static {
    __name222(this, "PerformanceMeasure2");
  }
  static {
    __name2222(this, "PerformanceMeasure");
  }
  static {
    __name22222(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming22222 = class extends PerformanceEntry22222 {
  static {
    __name(this, "PerformanceResourceTiming2222");
  }
  static {
    __name2(this, "PerformanceResourceTiming222");
  }
  static {
    __name22(this, "PerformanceResourceTiming22");
  }
  static {
    __name222(this, "PerformanceResourceTiming2");
  }
  static {
    __name2222(this, "PerformanceResourceTiming");
  }
  static {
    __name22222(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList22222 = class {
  static {
    __name(this, "PerformanceObserverEntryList2222");
  }
  static {
    __name2(this, "PerformanceObserverEntryList222");
  }
  static {
    __name22(this, "PerformanceObserverEntryList22");
  }
  static {
    __name222(this, "PerformanceObserverEntryList2");
  }
  static {
    __name2222(this, "PerformanceObserverEntryList");
  }
  static {
    __name22222(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance22222 = class {
  static {
    __name(this, "Performance2222");
  }
  static {
    __name2(this, "Performance222");
  }
  static {
    __name22(this, "Performance22");
  }
  static {
    __name222(this, "Performance2");
  }
  static {
    __name2222(this, "Performance");
  }
  static {
    __name22222(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin22222;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError22222("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming22222;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming22222("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin22222) {
      return _performanceNow22222();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark32222(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure22222(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22222("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22222("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError22222("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver22222 = class {
  static {
    __name(this, "PerformanceObserver2222");
  }
  static {
    __name2(this, "PerformanceObserver222");
  }
  static {
    __name22(this, "PerformanceObserver22");
  }
  static {
    __name222(this, "PerformanceObserver2");
  }
  static {
    __name2222(this, "PerformanceObserver");
  }
  static {
    __name22222(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22222("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError22222("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance22222 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance22222();
if (!("__unenv__" in performance22222)) {
  const proto = Performance22222.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance22222)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance22222, key, desc);
      }
    }
  }
}
globalThis.performance = performance22222;
globalThis.Performance = Performance22222;
globalThis.PerformanceEntry = PerformanceEntry22222;
globalThis.PerformanceMark = PerformanceMark32222;
globalThis.PerformanceMeasure = PerformanceMeasure22222;
globalThis.PerformanceObserver = PerformanceObserver22222;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList22222;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming22222;
var noop_default22222 = Object.assign(() => {
}, { __unenv__: true });
var _console22222 = globalThis.console;
var _ignoreErrors22222 = true;
var _stderr22222 = new Writable22222();
var _stdout22222 = new Writable22222();
var log32222 = _console22222?.log ?? noop_default22222;
var info32222 = _console22222?.info ?? log32222;
var trace32222 = _console22222?.trace ?? info32222;
var debug32222 = _console22222?.debug ?? log32222;
var table32222 = _console22222?.table ?? log32222;
var error32222 = _console22222?.error ?? log32222;
var warn32222 = _console22222?.warn ?? error32222;
var createTask32222 = _console22222?.createTask ?? /* @__PURE__ */ notImplemented22222("console.createTask");
var clear32222 = _console22222?.clear ?? noop_default22222;
var count32222 = _console22222?.count ?? noop_default22222;
var countReset32222 = _console22222?.countReset ?? noop_default22222;
var dir32222 = _console22222?.dir ?? noop_default22222;
var dirxml32222 = _console22222?.dirxml ?? noop_default22222;
var group32222 = _console22222?.group ?? noop_default22222;
var groupEnd32222 = _console22222?.groupEnd ?? noop_default22222;
var groupCollapsed32222 = _console22222?.groupCollapsed ?? noop_default22222;
var profile32222 = _console22222?.profile ?? noop_default22222;
var profileEnd32222 = _console22222?.profileEnd ?? noop_default22222;
var time32222 = _console22222?.time ?? noop_default22222;
var timeEnd32222 = _console22222?.timeEnd ?? noop_default22222;
var timeLog32222 = _console22222?.timeLog ?? noop_default22222;
var timeStamp32222 = _console22222?.timeStamp ?? noop_default22222;
var Console22222 = _console22222?.Console ?? /* @__PURE__ */ notImplementedClass22222("console.Console");
var _times22222 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler22222 = noop_default22222;
var _stderrErrorHandler22222 = noop_default22222;
var workerdConsole22222 = globalThis["console"];
var {
  assert: assert32222,
  clear: clear222222,
  // @ts-expect-error undocumented public API
  context: context22222,
  count: count222222,
  countReset: countReset222222,
  // @ts-expect-error undocumented public API
  createTask: createTask222222,
  debug: debug222222,
  dir: dir222222,
  dirxml: dirxml222222,
  error: error222222,
  group: group222222,
  groupCollapsed: groupCollapsed222222,
  groupEnd: groupEnd222222,
  info: info222222,
  log: log222222,
  profile: profile222222,
  profileEnd: profileEnd222222,
  table: table222222,
  time: time222222,
  timeEnd: timeEnd222222,
  timeLog: timeLog222222,
  timeStamp: timeStamp222222,
  trace: trace222222,
  warn: warn222222
} = workerdConsole22222;
Object.assign(workerdConsole22222, {
  Console: Console22222,
  _ignoreErrors: _ignoreErrors22222,
  _stderr: _stderr22222,
  _stderrErrorHandler: _stderrErrorHandler22222,
  _stdout: _stdout22222,
  _stdoutErrorHandler: _stdoutErrorHandler22222,
  _times: _times22222
});
var console_default22222 = workerdConsole22222;
globalThis.console = console_default22222;
var hrtime42222 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name22222(/* @__PURE__ */ __name2222(/* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime222222(startTime) {
  const now2 = Date.now();
  const seconds = Math.trunc(now2 / 1e3);
  const nanos = now2 % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime22222"), "hrtime2222"), "hrtime222"), "hrtime22"), "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name22222(/* @__PURE__ */ __name2222(/* @__PURE__ */ __name222(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint22222() {
  return BigInt(Date.now() * 1e6);
}, "bigint2222"), "bigint222"), "bigint22"), "bigint2"), "bigint"), "bigint") });
var ReadStream22222 = class {
  static {
    __name(this, "ReadStream2222");
  }
  static {
    __name2(this, "ReadStream222");
  }
  static {
    __name22(this, "ReadStream22");
  }
  static {
    __name222(this, "ReadStream2");
  }
  static {
    __name2222(this, "ReadStream");
  }
  static {
    __name22222(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream22222 = class {
  static {
    __name(this, "WriteStream2222");
  }
  static {
    __name2(this, "WriteStream222");
  }
  static {
    __name22(this, "WriteStream22");
  }
  static {
    __name222(this, "WriteStream2");
  }
  static {
    __name2222(this, "WriteStream");
  }
  static {
    __name22222(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir322222, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env222222) {
    return 1;
  }
  hasColors(count322222, env222222) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION22222 = "22.14.0";
var Process22222 = class _Process extends EventEmitter22222 {
  static {
    __name(this, "_Process");
  }
  static {
    __name2(this, "_Process");
  }
  static {
    __name22(this, "_Process");
  }
  static {
    __name222(this, "_Process");
  }
  static {
    __name2222(this, "_Process");
  }
  static {
    __name22222(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter22222.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream22222(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream22222(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream22222(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd222222) {
    this.#cwd = cwd222222;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION22222}`;
  }
  get versions() {
    return { node: NODE_VERSION22222 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError22222("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented22222("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented22222("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented22222("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented22222("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented22222("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented22222("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name22222(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess22222 = globalThis["process"];
var getBuiltinModule22222 = globalProcess22222.getBuiltinModule;
var workerdProcess22222 = getBuiltinModule22222("node:process");
var unenvProcess22222 = new Process22222({
  env: globalProcess22222.env,
  hrtime: hrtime42222,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess22222.nextTick
});
var { exit: exit22222, features: features22222, platform: platform22222 } = workerdProcess22222;
var {
  _channel: _channel22222,
  _debugEnd: _debugEnd22222,
  _debugProcess: _debugProcess22222,
  _disconnect: _disconnect22222,
  _events: _events22222,
  _eventsCount: _eventsCount22222,
  _exiting: _exiting22222,
  _fatalException: _fatalException22222,
  _getActiveHandles: _getActiveHandles22222,
  _getActiveRequests: _getActiveRequests22222,
  _handleQueue: _handleQueue22222,
  _kill: _kill22222,
  _linkedBinding: _linkedBinding22222,
  _maxListeners: _maxListeners22222,
  _pendingMessage: _pendingMessage22222,
  _preload_modules: _preload_modules22222,
  _rawDebug: _rawDebug22222,
  _send: _send22222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22222,
  _tickCallback: _tickCallback22222,
  abort: abort22222,
  addListener: addListener22222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22222,
  arch: arch22222,
  argv: argv22222,
  argv0: argv022222,
  assert: assert222222,
  availableMemory: availableMemory22222,
  binding: binding22222,
  channel: channel22222,
  chdir: chdir22222,
  config: config22222,
  connected: connected22222,
  constrainedMemory: constrainedMemory22222,
  cpuUsage: cpuUsage22222,
  cwd: cwd22222,
  debugPort: debugPort22222,
  disconnect: disconnect22222,
  dlopen: dlopen22222,
  domain: domain22222,
  emit: emit22222,
  emitWarning: emitWarning22222,
  env: env22222,
  eventNames: eventNames22222,
  execArgv: execArgv22222,
  execPath: execPath22222,
  exitCode: exitCode22222,
  finalization: finalization22222,
  getActiveResourcesInfo: getActiveResourcesInfo22222,
  getegid: getegid22222,
  geteuid: geteuid22222,
  getgid: getgid22222,
  getgroups: getgroups22222,
  getMaxListeners: getMaxListeners22222,
  getuid: getuid22222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22222,
  hrtime: hrtime322222,
  initgroups: initgroups22222,
  kill: kill22222,
  listenerCount: listenerCount22222,
  listeners: listeners22222,
  loadEnvFile: loadEnvFile22222,
  mainModule: mainModule22222,
  memoryUsage: memoryUsage22222,
  moduleLoadList: moduleLoadList22222,
  nextTick: nextTick22222,
  off: off22222,
  on: on22222,
  once: once22222,
  openStdin: openStdin22222,
  permission: permission22222,
  pid: pid22222,
  ppid: ppid22222,
  prependListener: prependListener22222,
  prependOnceListener: prependOnceListener22222,
  rawListeners: rawListeners22222,
  reallyExit: reallyExit22222,
  ref: ref22222,
  release: release22222,
  removeAllListeners: removeAllListeners22222,
  removeListener: removeListener22222,
  report: report22222,
  resourceUsage: resourceUsage22222,
  send: send22222,
  setegid: setegid22222,
  seteuid: seteuid22222,
  setgid: setgid22222,
  setgroups: setgroups22222,
  setMaxListeners: setMaxListeners22222,
  setSourceMapsEnabled: setSourceMapsEnabled22222,
  setuid: setuid22222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22222,
  sourceMapsEnabled: sourceMapsEnabled22222,
  stderr: stderr22222,
  stdin: stdin22222,
  stdout: stdout22222,
  throwDeprecation: throwDeprecation22222,
  title: title22222,
  traceDeprecation: traceDeprecation22222,
  umask: umask22222,
  unref: unref22222,
  uptime: uptime22222,
  version: version22222,
  versions: versions22222
} = unenvProcess22222;
var _process22222 = {
  abort: abort22222,
  addListener: addListener22222,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22222,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22222,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22222,
  loadEnvFile: loadEnvFile22222,
  sourceMapsEnabled: sourceMapsEnabled22222,
  arch: arch22222,
  argv: argv22222,
  argv0: argv022222,
  chdir: chdir22222,
  config: config22222,
  connected: connected22222,
  constrainedMemory: constrainedMemory22222,
  availableMemory: availableMemory22222,
  cpuUsage: cpuUsage22222,
  cwd: cwd22222,
  debugPort: debugPort22222,
  dlopen: dlopen22222,
  disconnect: disconnect22222,
  emit: emit22222,
  emitWarning: emitWarning22222,
  env: env22222,
  eventNames: eventNames22222,
  execArgv: execArgv22222,
  execPath: execPath22222,
  exit: exit22222,
  finalization: finalization22222,
  features: features22222,
  getBuiltinModule: getBuiltinModule22222,
  getActiveResourcesInfo: getActiveResourcesInfo22222,
  getMaxListeners: getMaxListeners22222,
  hrtime: hrtime322222,
  kill: kill22222,
  listeners: listeners22222,
  listenerCount: listenerCount22222,
  memoryUsage: memoryUsage22222,
  nextTick: nextTick22222,
  on: on22222,
  off: off22222,
  once: once22222,
  pid: pid22222,
  platform: platform22222,
  ppid: ppid22222,
  prependListener: prependListener22222,
  prependOnceListener: prependOnceListener22222,
  rawListeners: rawListeners22222,
  release: release22222,
  removeAllListeners: removeAllListeners22222,
  removeListener: removeListener22222,
  report: report22222,
  resourceUsage: resourceUsage22222,
  setMaxListeners: setMaxListeners22222,
  setSourceMapsEnabled: setSourceMapsEnabled22222,
  stderr: stderr22222,
  stdin: stdin22222,
  stdout: stdout22222,
  title: title22222,
  throwDeprecation: throwDeprecation22222,
  traceDeprecation: traceDeprecation22222,
  umask: umask22222,
  uptime: uptime22222,
  version: version22222,
  versions: versions22222,
  // @ts-expect-error old API
  domain: domain22222,
  initgroups: initgroups22222,
  moduleLoadList: moduleLoadList22222,
  reallyExit: reallyExit22222,
  openStdin: openStdin22222,
  assert: assert222222,
  binding: binding22222,
  send: send22222,
  exitCode: exitCode22222,
  channel: channel22222,
  getegid: getegid22222,
  geteuid: geteuid22222,
  getgid: getgid22222,
  getgroups: getgroups22222,
  getuid: getuid22222,
  setegid: setegid22222,
  seteuid: seteuid22222,
  setgid: setgid22222,
  setgroups: setgroups22222,
  setuid: setuid22222,
  permission: permission22222,
  mainModule: mainModule22222,
  _events: _events22222,
  _eventsCount: _eventsCount22222,
  _exiting: _exiting22222,
  _maxListeners: _maxListeners22222,
  _debugEnd: _debugEnd22222,
  _debugProcess: _debugProcess22222,
  _fatalException: _fatalException22222,
  _getActiveHandles: _getActiveHandles22222,
  _getActiveRequests: _getActiveRequests22222,
  _kill: _kill22222,
  _preload_modules: _preload_modules22222,
  _rawDebug: _rawDebug22222,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22222,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22222,
  _tickCallback: _tickCallback22222,
  _disconnect: _disconnect22222,
  _handleQueue: _handleQueue22222,
  _pendingMessage: _pendingMessage22222,
  _channel: _channel22222,
  _send: _send22222,
  _linkedBinding: _linkedBinding22222
};
var process_default22222 = _process22222;
globalThis.process = process_default22222;
var PUZZLE_ASSETS = { "/puzzle-luau-sunset.webp": PZPIC_0, "/pzthumb-luau-sunset.webp": PZTHUMB_0, "/puzzle-waterfall-garden.webp": PZPIC_1, "/pzthumb-waterfall-garden.webp": PZTHUMB_1, "/puzzle-reef-life.webp": PZPIC_2, "/pzthumb-reef-life.webp": PZTHUMB_2, "/puzzle-porch-morning.webp": PZPIC_3, "/pzthumb-porch-morning.webp": PZTHUMB_3, "/puzzle-market-day.webp": PZPIC_4, "/pzthumb-market-day.webp": PZTHUMB_4, "/puzzle-canoe-cove.webp": PZPIC_5, "/pzthumb-canoe-cove.webp": PZTHUMB_5 };
var COLOR_THUMBS = { "beach-cottage": THUMB_A0, "coral-reef": THUMB_A1, "dolphins": THUMB_A2, "family-tree": THUMB_A3, "hawaiian-quilt": THUMB_A4, "hibiscus-mandala": THUMB_A5, "honu-mandala": THUMB_A6, "hummingbird": THUMB_A7, "island-tribal": THUMB_A8, "ocean-waves": THUMB_A9, "ohana-wreath": THUMB_A10, "orchids": THUMB_A11, "palm-leaves": THUMB_A12, "pineapple-mandala": THUMB_A13, "seashells": THUMB_A14, "sunset-sail": THUMB_A15, "surf-day": THUMB_A16, "ukulele": THUMB_A17 };
const COLOR_GZIP_PAGE_NAMES = new Set(["beach-cottage","coral-reef","dolphins","family-tree","hawaiian-quilt","hibiscus-mandala","honu-mandala","hummingbird","island-tribal","ocean-waves","ohana-wreath","orchids","palm-leaves","pineapple-mandala","seashells","sunset-sail","surf-day","ukulele","bamboo","coco","eddie","finn","flora","flutter","honu","hoot","inky","kai","kiko","koa","lulu","mango","milo","otto","pebble","pippa","reef","rosie","splash","sunny"]);
var COLOR_PAGES = { "beach-cottage": COLOR_A0, "coral-reef": COLOR_A1, "dolphins": COLOR_A2, "family-tree": COLOR_A3, "hawaiian-quilt": COLOR_A4, "hibiscus-mandala": COLOR_A5, "honu-mandala": COLOR_A6, "hummingbird": COLOR_A7, "island-tribal": COLOR_A8, "ocean-waves": COLOR_A9, "ohana-wreath": COLOR_A10, "orchids": COLOR_A11, "palm-leaves": COLOR_A12, "pineapple-mandala": COLOR_A13, "seashells": COLOR_A14, "sunset-sail": COLOR_A15, "surf-day": COLOR_A16, "ukulele": COLOR_A17, bamboo: COLOR_BAMBOO, coco: COLOR_COCO, eddie: COLOR_EDDIE, finn: COLOR_FINN, flora: COLOR_FLORA, flutter: COLOR_FLUTTER, honu: COLOR_HONU, hoot: COLOR_HOOT, inky: COLOR_INKY, kai: COLOR_KAI, kiko: COLOR_KIKO, koa: COLOR_KOA, lulu: COLOR_LULU, mango: COLOR_MANGO, milo: COLOR_MILO, otto: COLOR_OTTO, pebble: COLOR_PEBBLE, pippa: COLOR_PIPPA, reef: COLOR_REEF, rosie: COLOR_ROSIE, splash: COLOR_SPLASH, sunny: COLOR_SUNNY };
// Ohana family Mahjong. Server-owned tile IDs, claims and scoring.
function mjFamilyInit(players, random = Math.random, rounds = 4) {
  if (players.length < 2 || players.length > 4) throw new Error('Mahjong needs two to four players.');
  const st = {players:[...players],mode:'family', rulesVersion:3, scores:Object.fromEntries(players.map(p=>[p,0])), round:1, rounds:rounds===8?8:4, dealer:Math.floor(random()*players.length), revision:0, history:[]};
  mjFamilyDeal(st,players,random); return st;
}
function mjFamilyDeal(st,players,random=Math.random) {
  const wall=Array.from({length:136},(_,id)=>({id,face:Math.floor(id/4)}));
  for(let i=wall.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[wall[i],wall[j]]=[wall[j],wall[i]];}
  st.hands={};st.melds={};st.discards={};st.claimed={};
  for(const p of players){st.hands[p]=wall.splice(0,13);st.melds[p]=[];st.discards[p]=[];st.claimed[p]=false;}
  st.hands[players[st.dealer]].push(wall.shift());
  st.wall=wall;st.nextTurn=st.dealer;st.phase='discard';st.pending=null;st.roundResult=null;st.lastDraw=null;st.opening=true;
}
function mjFamilyWin(hand, exposed=[]) {
  const counts=Array(34).fill(0);for(const t of hand){if(!Number.isInteger(t.face)||t.face<0||t.face>33)return null;counts[t.face]++;}
  if(counts.some(n=>n>4))return null;
  if(!exposed.length&&hand.length===14&&counts.filter(n=>n===2).length===7)return {sevenPairs:true,allPungs:false,kongs:0};
  const need=4-exposed.length;if(need<0||hand.length!==need*3+2)return null;
  const search=(left,remaining,onlyPungs)=>{
    const face=left.findIndex(n=>n>0);if(face<0)return remaining===0?{allPungs:onlyPungs}:null;if(remaining<=0)return null;
    if(left[face]>=3){left[face]-=3;const found=search(left,remaining-1,onlyPungs);left[face]+=3;if(found)return found;}
    if(face<27&&face%9<=6&&left[face+1]&&left[face+2]){left[face]--;left[face+1]--;left[face+2]--;const found=search(left,remaining-1,false);left[face]++;left[face+1]++;left[face+2]++;if(found)return found;}
    return null;
  };
  // Find an all-pung decomposition first so an ambiguous winning hand receives its bonus.
  let fallback=null;
  for(let f=0;f<34;f++)if(counts[f]>=2){counts[f]-=2;const result=search(counts,need,!exposed.some(m=>m.kind==='chow'));counts[f]+=2;if(result){const win={sevenPairs:false,allPungs:result.allPungs,kongs:exposed.filter(m=>m.kind==='kong').length};if(win.allPungs)return win;fallback=win;}}
  return fallback;
}
function mjFamilyOptions(st,players,player) {
  const pending=st.pending;if(!pending||String(pending.from)===String(player))return [];
  const hand=st.hands[player]||[],face=pending.tile.face,same=hand.filter(t=>t.face===face),options=[];
  if(mjFamilyWin([...hand,pending.tile],st.melds[player]))options.push({kind:'win',ids:[]});
  if(same.length>=3)options.push({kind:'kong',ids:same.slice(0,3).map(t=>t.id)});
  if(same.length>=2)options.push({kind:'pung',ids:same.slice(0,2).map(t=>t.id)});
  const next=players[(players.indexOf(pending.from)+1)%players.length];
  if(String(player)===String(next)&&face<27)for(let start=Math.max(Math.floor(face/9)*9,face-2);start<=face&&start%9<=6;start++){
    const faces=[start,start+1,start+2].filter(f=>f!==face),tiles=faces.map(f=>hand.find(t=>t.face===f));
    if(tiles.every(Boolean))options.push({kind:'chow',ids:tiles.map(t=>t.id)});
  }
  return options;
}
function mjFamilyFinish(st,players,winner=null,from=null,self=false) {
  let detail=null,delta=Object.fromEntries(players.map(p=>[p,0]));
  if(winner!==null){detail=mjFamilyWin(st.hands[winner],st.melds[winner]);if(!detail)throw new Error('That hand is not Mahjong.');
    const bonus=(!st.claimed[winner]?5:0)+(detail.allPungs?5:0)+detail.kongs*2+(detail.sevenPairs?10:0);
    for(const p of players)if(p!==winner){const paid=(self||p===from?20:10)+bonus;delta[p]-=paid;delta[winner]+=paid;}
    for(const p of players)st.scores[p]+=delta[p];
    detail={...detail,concealed:!st.claimed[winner],bonus};
  }
  st.roundResult={round:st.round,winner,from,self,detail,delta};st.history.push(st.roundResult);st.pending=null;st.phase=st.round>=st.rounds?'finished':'round-end';
  const best=Math.max(...Object.values(st.scores)),winners=players.filter(p=>st.scores[p]===best);
  return {over:st.phase==='finished',next:st.nextTurn,winner:st.phase==='finished'?(winners.length===1?winners[0]:'tie'):null};
}
function mjFamilyDraw(st,players,player,replacement=false) {
  if(!st.wall.length)return mjFamilyFinish(st,players);
  const tile=replacement?st.wall.pop():st.wall.shift();st.hands[player].push(tile);st.lastDraw={player,id:tile.id,replacement};st.phase='discard';return {over:false,next:players.indexOf(player)};
}
function mjFamilyResolve(st,players,time=Date.now()) {
  const pending=st.pending;if(!pending)return null;
  if(time<pending.deadline&&pending.eligible.some(p=>!Object.hasOwn(pending.responses,p)))return null;
  const rank={win:3,kong:2,pung:2,chow:1},fromIndex=players.indexOf(pending.from);
  const claims=Object.entries(pending.responses).filter(([,r])=>r.kind!=='pass').map(([p,r])=>({player:players.find(x=>String(x)===p),...r}));
  claims.sort((a,b)=>(rank[b.kind]-rank[a.kind])||((players.indexOf(a.player)-fromIndex+players.length)%players.length-(players.indexOf(b.player)-fromIndex+players.length)%players.length));
  st.pending=null;st.revision++;
  if(!claims.length){st.nextTurn=(fromIndex+1)%players.length;st.phase='draw';if(!st.wall.length)return mjFamilyFinish(st,players);return {over:false,next:st.nextTurn};}
  const claim=claims[0],p=claim.player,tiles=claim.ids.map(id=>st.hands[p].find(t=>t.id===id));
  // Remove only the single claimed discard; all other discards remain public.
  st.discards[pending.from]=st.discards[pending.from].filter(t=>t.id!==pending.tile.id);
  st.nextTurn=players.indexOf(p);
  if(claim.kind==='win'){st.hands[p].push(pending.tile);return mjFamilyFinish(st,players,p,pending.from,false);}
  st.hands[p]=st.hands[p].filter(t=>!claim.ids.includes(t.id));st.melds[p].push({kind:claim.kind,tiles:[...tiles,pending.tile],from:pending.from});st.claimed[p]=true;st.phase='discard';
  return claim.kind==='kong'?mjFamilyDraw(st,players,p,true):{over:false,next:st.nextTurn};
}
function mjFamilyMove(st,players,turn,move,actor=players[turn],time=Date.now()) {
  if(!players.includes(actor))throw new Error('Only seated players can act.');
  if(move.revision!==st.revision)throw new Error('The table changed. Please try again.');
  if(st.pending){
    if(time>=st.pending.deadline)throw new Error('The claim window ended. Refresh the table.');
    if(!st.pending.eligible.includes(actor)||Object.hasOwn(st.pending.responses,actor))throw new Error('No claim is waiting for you.');
    if(move.action!=='claim'&&move.action!=='pass')throw new Error('Claim or pass first.');
    const option=move.action==='pass'?{kind:'pass',ids:[]}:mjFamilyOptions(st,players,actor).find(o=>o.kind===move.kind&&JSON.stringify([...o.ids].sort((a,b)=>a-b))===JSON.stringify([...(move.ids||[])].sort((a,b)=>a-b)));
    if(!option)throw new Error('That claim is not legal.');st.pending.responses[actor]=option;
    // Revision stays constant during a claim window; CAS protects concurrent responses.
    return mjFamilyResolve(st,players,time)||{over:false,next:turn};
  }
  if(st.phase==='round-end'){
    if(move.action!=='next-round')throw new Error('Begin the next round.');
    st.dealer=(st.dealer+1)%players.length;st.round++;mjFamilyDeal(st,players);st.revision++;return {over:false,next:st.dealer};
  }
  if(turn!==st.nextTurn||players[turn]!==actor)throw new Error('Wait for your turn.');
  let result={over:false,next:turn};
  if(move.action==='draw'){
    if(st.phase!=='draw')throw new Error('Discard before drawing again.');result=mjFamilyDraw(st,players,actor);
  }else if(move.action==='win'){
    if(st.phase!=='discard'||(!st.opening&&st.lastDraw?.player!==actor))throw new Error('Only a drawn tile can win here; claim a discard as Mahjong.');result=mjFamilyFinish(st,players,actor,null,true);
  }else if(move.action==='kong'){
    if(st.phase!=='discard')throw new Error('Draw first.');
    const ids=move.ids||[],tiles=ids.map(id=>st.hands[actor].find(t=>t.id===id));
    if(ids.length!==4||new Set(ids).size!==4||tiles.some(t=>!t)||!tiles.every(t=>t.face===tiles[0].face))throw new Error('Choose four identical tiles.');
    st.hands[actor]=st.hands[actor].filter(t=>!ids.includes(t.id));st.melds[actor].push({kind:'kong',tiles,from:null});result=mjFamilyDraw(st,players,actor,true);
  }else if(move.action==='discard'){
    if(st.phase!=='discard')throw new Error('Draw a tile first.');
    const index=st.hands[actor].findIndex(t=>t.id===move.id);if(index<0)throw new Error('Choose a tile from your hand.');
    const [tile]=st.hands[actor].splice(index,1);st.discards[actor].push(tile);st.lastDraw=null;st.opening=false;
    st.pending={tile,from:actor,deadline:time+15000,eligible:[],responses:{}};st.phase='claims';
    st.pending.eligible=players.filter(p=>p!==actor&&mjFamilyOptions(st,players,p).length);
    for(const p of st.pending.eligible)if(p<0){const options=mjFamilyOptions(st,players,p);st.pending.responses[p]=options[0];}
    result=mjFamilyResolve(st,players,time)||result;
  }else throw new Error('Unknown Mahjong action.');
  st.revision++;return result;
}
function mjFamilyView(st,players,viewer) {
  const {wall,hands,matchingArchive,...safe}=st;
  const pending=st.pending?{tile:st.pending.tile,from:st.pending.from,deadline:st.pending.deadline,responded:Object.hasOwn(st.pending.responses,viewer)}:null;
  return {...safe,pending,hands:Object.fromEntries(players.map(p=>[p,String(p)===String(viewer)?hands[p]:hands[p].length])),wallCount:wall.length,claims:mjFamilyOptions(st,players,viewer),lastDraw:st.lastDraw?.player===viewer?st.lastDraw:null,legacyScores:matchingArchive?.scores||null};
}
function mjFamilyBot(st,players,turn) {
  const player=players[turn];if(st.phase==='round-end')return {action:'next-round',revision:st.revision};
  if(st.pending)return null;
  if(st.phase==='draw')return {action:'draw',revision:st.revision};
  if(mjFamilyWin(st.hands[player],st.melds[player]))return {action:'win',revision:st.revision};
  const hand=st.hands[player],quad=hand.find(t=>hand.filter(x=>x.face===t.face).length===4);
  if(quad)return {action:'kong',ids:hand.filter(t=>t.face===quad.face).map(t=>t.id),revision:st.revision};
  const value=t=>hand.filter(x=>x.face===t.face).length*3+(t.face<27?hand.filter(x=>x.face<27&&Math.floor(x.face/9)===Math.floor(t.face/9)&&Math.abs(x.face-t.face)<=2).length:0);
  const tile=[...hand].sort((a,b)=>value(a)-value(b))[0];return {action:'discard',id:tile.id,revision:st.revision};
}

function mahjongFree(tiles, t) {
  if (t.removed) return false;
  const live = tiles.filter((x) => !x.removed && x.id !== t.id);
  if (live.some((x) => x.z > t.z && Math.abs(x.x - t.x) < 1 && Math.abs(x.y - t.y) < 1)) return false;
  const side = /* @__PURE__ */ __name22222((dx) => live.some((x) => x.z === t.z && x.x === t.x + dx && Math.abs(x.y - t.y) < 1), "side");
  return !side(-1) || !side(1);
}
__name(mahjongFree, "mahjongFree");
__name2(mahjongFree, "mahjongFree");
__name22(mahjongFree, "mahjongFree");
__name222(mahjongFree, "mahjongFree");
__name2222(mahjongFree, "mahjongFree");
__name22222(mahjongFree, "mahjongFree");
function mahjongDeal(tiles, random = Math.random) {
  const work = tiles.map((t) => ({ ...t })), pairs = [];
  while (work.some((t) => !t.removed)) {
    const top = Math.max(...work.filter((t) => !t.removed).map((t) => t.z));
    const free = work.filter((t) => t.z === top && mahjongFree(work, t));
    if (free.length < 2) throw new Error("This layout cannot be dealt.");
    const a = free.splice(Math.floor(random() * free.length), 1)[0], b = free[Math.floor(random() * free.length)];
    pairs.push([a.id, b.id]);
    a.removed = b.removed = true;
  }
  const faces = pairs.map((_, i) => i % 12);
  for (let i = faces.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [faces[i], faces[j]] = [faces[j], faces[i]];
  }
  const byId = new Map(tiles.map((t) => [t.id, t]));
  pairs.forEach(([a, b], i) => {
    byId.get(a).face = byId.get(b).face = faces[i];
  });
  return pairs;
}
__name(mahjongDeal, "mahjongDeal");
__name2(mahjongDeal, "mahjongDeal");
__name22(mahjongDeal, "mahjongDeal");
__name222(mahjongDeal, "mahjongDeal");
__name2222(mahjongDeal, "mahjongDeal");
__name22222(mahjongDeal, "mahjongDeal");
function mahjongLayout(which) {
  const tiles = [];
  const add = /* @__PURE__ */ __name2((z, cells) => cells.forEach(([x, y]) => tiles.push({ id: tiles.length, x, y, z, face: 0, removed: false })), "add");
  const rect = /* @__PURE__ */ __name2((x0, y0, w, h) => Array.from({ length: w * h }, (_, i) => [x0 + i % w, y0 + Math.floor(i / w)]), "rect");
  add(0, rect(0, 0, 8, 6));
  if (which === 1) add(1, rect(0, 1, 8, 3));
  else if (which === 2) add(1, [...rect(0, 1, 3, 4), ...rect(5, 1, 3, 4)]);
  else if (which === 3) {
    add(1, rect(1, 1, 6, 3));
    add(2, rect(2, 2, 3, 2));
  } else if (which === 4) {
    add(1, rect(2, 1, 4, 4));
    add(2, rect(2, 2, 4, 2));
  } else add(1, rect(1, 1, 6, 4));
  return tiles;
}
__name(mahjongLayout, "mahjongLayout");
__name2(mahjongLayout, "mahjongLayout");
function mahjongGeneratedLayout(pairCount, random = Math.random) {
  const tiles = [];
  const pairs = [];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x += 2) pairs.push([[x, y], [x + 1, y]]);
  const add = /* @__PURE__ */ __name2((z, cells) => cells.forEach(([x, y]) => tiles.push({ id: tiles.length, x, y, z, face: 0, removed: false })), "add");
  add(0, pairs.flat());
  const shuffled = [...pairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const upper = Math.max(0, pairCount - 24);
  const middle = pairCount > 36 ? Math.min(16, upper - 8) : Math.min(upper, random() < 0.5 ? 8 : 12);
  const top = upper - middle;
  add(1, shuffled.slice(0, middle).flat());
  if (top) add(2, shuffled.slice(0, top).flat());
  return tiles;
}
__name(mahjongGeneratedLayout, "mahjongGeneratedLayout");
__name2(mahjongGeneratedLayout, "mahjongGeneratedLayout");
function mahjongInit(players, random = Math.random) {
  if(players.length>1)return mjFamilyInit(players,random,arguments[2]===8?8:4);
  const multiplayer = false, pairCount = 36;
  const tiles = mahjongGeneratedLayout(pairCount, random);
  mahjongDeal(tiles, random);
  return { tiles, layout: "generated", rulesVersion: multiplayer ? 2 : 1, scores: Object.fromEntries(players.map((p) => [p, 0])), pairs: 0, shuffles: 0, lastPair: null, revision: 0 };
}
__name(mahjongInit, "mahjongInit");
__name2(mahjongInit, "mahjongInit");
__name22(mahjongInit, "mahjongInit");
__name222(mahjongInit, "mahjongInit");
__name2222(mahjongInit, "mahjongInit");
__name22222(mahjongInit, "mahjongInit");
function mahjongMove(st, players, turn, move) {
  if(st.mode==="family")return mjFamilyMove(st,players,turn,move,move.actor??players[turn]);
  if (move.revision !== st.revision) throw new Error("The table changed. Pick your tiles again.");
  if (move.action === "shuffle") {
    const live = st.tiles.filter((t) => !t.removed);
    const slots = st.layout === "generated" ? mahjongGeneratedLayout(st.tiles.length / 2) : mahjongLayout(st.layout = ((st.layout ?? 0) + 1 + Math.floor(Math.random() * 4)) % 5);
    slots.slice(0, live.length).forEach((slot, i) => {
      live[i].x = slot.x;
      live[i].y = slot.y;
      live[i].z = slot.z;
    });
    mahjongDeal(st.tiles);
    st.shuffles++;
    st.lastPair = null;
    st.revision++;
    return { over: false, next: turn };
  }
  if (move.action !== "match" || !Array.isArray(move.ids) || move.ids.length !== 2 || move.ids[0] === move.ids[1]) throw new Error("Choose two different matching tiles.");
  const [a, b] = move.ids.map((id) => st.tiles.find((t) => t.id === id));
  if (!a || !b || !mahjongFree(st.tiles, a) || !mahjongFree(st.tiles, b)) throw new Error("Use uncovered tiles with a free left or right edge.");
  if (a.face !== b.face) throw new Error("Those treasures do not match.");
  const wasFree = st.rulesVersion >= 2 ? new Set(st.tiles.filter((t) => mahjongFree(st.tiles, t)).map((t) => t.id)) : null;
  const layer = Math.max(a.z, b.z);
  a.removed = b.removed = true;
  st.pairs++;
  const newlyFree = wasFree ? st.tiles.filter((t) => !wasFree.has(t.id) && mahjongFree(st.tiles, t)).length : 0;
  const layerCleared = !!wasFree && !st.tiles.some((t) => !t.removed && t.z === layer);
  const bonus = wasFree ? layer * 5 + newlyFree * 5 + (layerCleared ? 15 : 0) : 0;
  const points = 10 + bonus;
  st.scores[players[turn]] += points;
  st.lastPair = { face: a.face, player: players[turn], points, base: 10, layerBonus: wasFree ? layer * 5 : 0, revealBonus: newlyFree * 5, clearBonus: layerCleared ? 15 : 0, ids: [a.id, b.id] };
  st.revision++;
  const over = st.tiles.every((t) => t.removed);
  const best = Math.max(...Object.values(st.scores)), winners = players.filter((p) => st.scores[p] === best);
  return { over, next: (turn + 1) % players.length, winner: over ? winners.length === 1 ? winners[0] : "tie" : null };
}
__name(mahjongMove, "mahjongMove");
__name2(mahjongMove, "mahjongMove");
__name22(mahjongMove, "mahjongMove");
__name222(mahjongMove, "mahjongMove");
__name2222(mahjongMove, "mahjongMove");
__name22222(mahjongMove, "mahjongMove");
var __defProp222222 = Object.defineProperty;
var __name222222 = /* @__PURE__ */ __name22222((target, value) => __defProp222222(target, "name", { value, configurable: true }), "__name");
var WELCOME_IMAGE = PORCH_DAWN;
function rng(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
__name(rng, "rng");
__name2(rng, "rng");
__name22(rng, "rng");
__name222(rng, "rng");
__name2222(rng, "rng");
__name22222(rng, "rng");
__name222222(rng, "rng");
function shuffle(arr, r) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
__name(shuffle, "shuffle");
__name2(shuffle, "shuffle");
__name22(shuffle, "shuffle");
__name222(shuffle, "shuffle");
__name2222(shuffle, "shuffle");
__name22222(shuffle, "shuffle");
__name222222(shuffle, "shuffle");
var CH_START = "rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR";
function chInit() {
  return { board: CH_START.split("").map((c) => c === "." ? null : c), castle: { K: true, Q: true, k: true, q: true }, ep: null, half: 0, moves: 0, captured: { w: [], b: [] }, check: false, last: null, history: [], reps: {} };
}
__name(chInit, "chInit");
__name2(chInit, "chInit");
__name22(chInit, "chInit");
__name222(chInit, "chInit");
__name2222(chInit, "chInit");
function chWhite(p) {
  return p && p === p.toUpperCase();
}
__name(chWhite, "chWhite");
__name2(chWhite, "chWhite");
__name22(chWhite, "chWhite");
__name222(chWhite, "chWhite");
__name2222(chWhite, "chWhite");
function chFindKing(b, white) {
  const k = white ? "K" : "k";
  return b.indexOf(k);
}
__name(chFindKing, "chFindKing");
__name2(chFindKing, "chFindKing");
__name22(chFindKing, "chFindKing");
__name222(chFindKing, "chFindKing");
__name2222(chFindKing, "chFindKing");
function chAttacked(b, sq, byWhite) {
  const r = Math.floor(sq / 8), c = sq % 8;
  const at = /* @__PURE__ */ __name2222((rr, cc) => rr < 0 || rr > 7 || cc < 0 || cc > 7 ? void 0 : b[rr * 8 + cc], "at");
  const own = /* @__PURE__ */ __name2222((p, t) => p && chWhite(p) === byWhite && p.toUpperCase() === t, "own");
  const pr = byWhite ? r + 1 : r - 1;
  if (own(at(pr, c - 1), "P") || own(at(pr, c + 1), "P")) return true;
  for (const [dr, dc] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) if (own(at(r + dr, c + dc), "N")) return true;
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && own(at(r + dr, c + dc), "K")) return true;
  for (const [dr, dc, types] of [[1, 0, "RQ"], [-1, 0, "RQ"], [0, 1, "RQ"], [0, -1, "RQ"], [1, 1, "BQ"], [1, -1, "BQ"], [-1, 1, "BQ"], [-1, -1, "BQ"]]) {
    let rr = r + dr, cc = c + dc;
    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
      const p = b[rr * 8 + cc];
      if (p) {
        if (chWhite(p) === byWhite && types.includes(p.toUpperCase())) return true;
        break;
      }
      rr += dr;
      cc += dc;
    }
  }
  return false;
}
__name(chAttacked, "chAttacked");
__name2(chAttacked, "chAttacked");
__name22(chAttacked, "chAttacked");
__name222(chAttacked, "chAttacked");
__name2222(chAttacked, "chAttacked");
function chInCheck(b, white) {
  const k = chFindKing(b, white);
  return k >= 0 && chAttacked(b, k, !white);
}
__name(chInCheck, "chInCheck");
__name2(chInCheck, "chInCheck");
__name22(chInCheck, "chInCheck");
__name222(chInCheck, "chInCheck");
__name2222(chInCheck, "chInCheck");
function chPseudo(st, sq) {
  const b = st.board, p = b[sq];
  if (!p) return [];
  const white = chWhite(p), t = p.toUpperCase(), r = Math.floor(sq / 8), c = sq % 8, out = [];
  const at = /* @__PURE__ */ __name2222((rr, cc) => rr < 0 || rr > 7 || cc < 0 || cc > 7 ? void 0 : b[rr * 8 + cc], "at");
  const push = /* @__PURE__ */ __name2222((rr, cc, extra) => {
    out.push({ from: sq, to: rr * 8 + cc, ...extra });
  }, "push");
  if (t === "P") {
    const dir4 = white ? -1 : 1, start = white ? 6 : 1, last = white ? 0 : 7;
    const one = r + dir4;
    if (one >= 0 && one <= 7 && !at(one, c)) {
      if (one === last) for (const promo of ["Q", "R", "B", "N"]) push(one, c, { promo });
      else push(one, c);
      if (r === start && !at(one + dir4, c)) push(one + dir4, c);
    }
    for (const dc of [-1, 1]) {
      const q = at(one, c + dc);
      if (q !== void 0 && q && chWhite(q) !== white) {
        if (one === last) for (const promo of ["Q", "R", "B", "N"]) push(one, c + dc, { promo });
        else push(one, c + dc);
      }
      if (st.ep !== null && st.ep === one * 8 + c + dc && c + dc >= 0 && c + dc <= 7) push(one, c + dc, { ep: true });
    }
    return out;
  }
  if (t === "N" || t === "K") {
    const deltas = t === "N" ? [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dr, dc] of deltas) {
      const q = at(r + dr, c + dc);
      if (q === void 0) continue;
      if (!q || chWhite(q) !== white) push(r + dr, c + dc);
    }
    if (t === "K") {
      const home = white ? 60 : 4;
      if (sq === home && !chInCheck(b, white)) {
        const ks = white ? st.castle.K : st.castle.k, qs = white ? st.castle.Q : st.castle.q;
        if (ks && !b[home + 1] && !b[home + 2] && b[home + 3] === (white ? "R" : "r") && !chAttacked(b, home + 1, !white) && !chAttacked(b, home + 2, !white)) out.push({ from: sq, to: home + 2, castle: "K" });
        if (qs && !b[home - 1] && !b[home - 2] && !b[home - 3] && b[home - 4] === (white ? "R" : "r") && !chAttacked(b, home - 1, !white) && !chAttacked(b, home - 2, !white)) out.push({ from: sq, to: home - 2, castle: "Q" });
      }
    }
    return out;
  }
  const dirs = t === "R" ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : t === "B" ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (const [dr, dc] of dirs) {
    let rr = r + dr, cc = c + dc;
    while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
      const q = b[rr * 8 + cc];
      if (!q) push(rr, cc);
      else {
        if (chWhite(q) !== white) push(rr, cc);
        break;
      }
      rr += dr;
      cc += dc;
    }
  }
  return out;
}
__name(chPseudo, "chPseudo");
__name2(chPseudo, "chPseudo");
__name22(chPseudo, "chPseudo");
__name222(chPseudo, "chPseudo");
__name2222(chPseudo, "chPseudo");
function chApply(st, m) {
  const n = { board: st.board.slice(), castle: { ...st.castle }, ep: null, half: st.half + 1, moves: st.moves + 1, captured: { w: st.captured.w.slice(), b: st.captured.b.slice() }, check: false, last: [m.from, m.to], history: st.history, reps: st.reps };
  const b = n.board, p = b[m.from], white = chWhite(p), t = p.toUpperCase();
  let cap = b[m.to];
  if (m.ep) {
    const capSq = m.to + (white ? 8 : -8);
    cap = b[capSq];
    b[capSq] = null;
  }
  if (cap) {
    n.captured[white ? "w" : "b"].push(cap);
    n.half = 0;
  }
  if (t === "P") {
    n.half = 0;
    if (Math.abs(m.to - m.from) === 16) n.ep = (m.from + m.to) / 2;
  }
  b[m.to] = m.promo ? white ? m.promo.toUpperCase() : m.promo.toLowerCase() : p;
  b[m.from] = null;
  if (m.castle === "K") {
    b[m.to - 1] = b[m.to + 1];
    b[m.to + 1] = null;
  }
  if (m.castle === "Q") {
    b[m.to + 1] = b[m.to - 2];
    b[m.to - 2] = null;
  }
  if (t === "K") {
    if (white) {
      n.castle.K = n.castle.Q = false;
    } else {
      n.castle.k = n.castle.q = false;
    }
  }
  for (const sq of [m.from, m.to]) {
    if (sq === 63) n.castle.K = false;
    if (sq === 56) n.castle.Q = false;
    if (sq === 7) n.castle.k = false;
    if (sq === 0) n.castle.q = false;
  }
  n.check = chInCheck(b, !white);
  return n;
}
__name(chApply, "chApply");
__name2(chApply, "chApply");
__name22(chApply, "chApply");
__name222(chApply, "chApply");
__name2222(chApply, "chApply");
function chLegal(st, white, fromSq) {
  const out = [];
  for (let sq = 0; sq < 64; sq++) {
    if (fromSq !== void 0 && sq !== fromSq) continue;
    const p = st.board[sq];
    if (!p || chWhite(p) !== white) continue;
    for (const m of chPseudo(st, sq)) {
      const n = chApply(st, m);
      if (!chInCheck(n.board, white)) out.push(m);
    }
  }
  return out;
}
__name(chLegal, "chLegal");
__name2(chLegal, "chLegal");
__name22(chLegal, "chLegal");
__name222(chLegal, "chLegal");
__name2222(chLegal, "chLegal");
function chKey(st, white) {
  return st.board.map((p) => p || ".").join("") + (white ? "w" : "b") + (st.castle.K ? "K" : "") + (st.castle.Q ? "Q" : "") + (st.castle.k ? "k" : "") + (st.castle.q ? "q" : "") + (st.ep ?? "");
}
__name(chKey, "chKey");
__name2(chKey, "chKey");
__name22(chKey, "chKey");
__name222(chKey, "chKey");
__name2222(chKey, "chKey");
function chInsufficient(b) {
  const pieces = b.filter(Boolean).map((p) => p.toUpperCase()).filter((p) => p !== "K");
  if (!pieces.length) return true;
  if (pieces.length === 1 && (pieces[0] === "B" || pieces[0] === "N")) return true;
  return false;
}
__name(chInsufficient, "chInsufficient");
__name2(chInsufficient, "chInsufficient");
__name22(chInsufficient, "chInsufficient");
__name222(chInsufficient, "chInsufficient");
__name2222(chInsufficient, "chInsufficient");
var CH_FILES = "abcdefgh";
function chSquareName(i) {
  return CH_FILES[i % 8] + (8 - Math.floor(i / 8));
}
__name(chSquareName, "chSquareName");
__name2(chSquareName, "chSquareName");
__name22(chSquareName, "chSquareName");
__name222(chSquareName, "chSquareName");
__name2222(chSquareName, "chSquareName");
function chMove(st, players, turnIdx, move) {
  const white = turnIdx === 0;
  const from = +move.from, to = +move.to;
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from > 63 || to < 0 || to > 63) throw new Error("Choose squares on the board.");
  const p = st.board[from];
  if (!p || chWhite(p) !== white) throw new Error("That is not your piece.");
  const promo = move.promo ? String(move.promo).toUpperCase() : null;
  const legal = chLegal(st, white, from).find((m) => m.to === to && (m.promo ? m.promo === (promo || "Q") : true));
  if (!legal) throw new Error("That piece cannot move there.");
  const n = chApply(st, legal);
  const cap = st.board[to] || (legal.ep ? "p" : null);
  const san = (p.toUpperCase() === "P" ? cap ? CH_FILES[from % 8] + "x" : "" : p.toUpperCase() + (cap ? "x" : "")) + chSquareName(to) + (legal.promo ? "=" + legal.promo : "") + (legal.castle ? "" : "");
  const text = legal.castle === "K" ? "O-O" : legal.castle === "Q" ? "O-O-O" : san;
  const hist = st.history.slice(-60);
  hist.push({ p: players[turnIdx], m: text + (n.check ? "+" : ""), from, to, cap: cap || null, promo: legal.promo || null, castle: legal.castle || null });
  n.history = hist;
  n.reps = { ...st.reps };
  const key = chKey(n, !white);
  n.reps[key] = (n.reps[key] || 0) + 1;
  Object.assign(st, n);
  const oppMoves = chLegal(st, !white);
  if (!oppMoves.length) {
    if (st.check) {
      st.result = "checkmate";
      hist[hist.length - 1].m = hist[hist.length - 1].m.replace(/\+$/, "") + "#";
      return { over: true, winner: players[turnIdx], next: 1 - turnIdx };
    }
    st.result = "stalemate";
    return { over: true, winner: "tie", next: 1 - turnIdx };
  }
  if (chInsufficient(st.board)) {
    st.result = "insufficient";
    return { over: true, winner: "tie", next: 1 - turnIdx };
  }
  if (st.half >= 100) {
    st.result = "fifty";
    return { over: true, winner: "tie", next: 1 - turnIdx };
  }
  if (st.reps[key] >= 3) {
    st.result = "repetition";
    return { over: true, winner: "tie", next: 1 - turnIdx };
  }
  return { over: false, next: 1 - turnIdx };
}
__name(chMove, "chMove");
__name2(chMove, "chMove");
__name22(chMove, "chMove");
__name222(chMove, "chMove");
__name2222(chMove, "chMove");
var CH_VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
var CH_PST = {
  P: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  N: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
  B: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
  R: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
  Q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
  K: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20]
};
function chEval(b, forWhite) {
  let s = 0;
  for (let i = 0; i < 64; i++) {
    const p = b[i];
    if (!p) continue;
    const t = p.toUpperCase(), w = chWhite(p);
    const pst = CH_PST[t][w ? i : 63 - i];
    s += (CH_VAL[t] + pst) * (w ? 1 : -1);
  }
  return forWhite ? s : -s;
}
__name(chEval, "chEval");
__name2(chEval, "chEval");
__name22(chEval, "chEval");
__name222(chEval, "chEval");
__name2222(chEval, "chEval");
function chPseudoAll(st, white) {
  const out = [];
  for (let sq = 0; sq < 64; sq++) {
    const p = st.board[sq];
    if (p && chWhite(p) === white) for (const m of chPseudo(st, sq)) out.push(m);
  }
  return out;
}
__name(chPseudoAll, "chPseudoAll");
__name2(chPseudoAll, "chPseudoAll");
__name22(chPseudoAll, "chPseudoAll");
__name222(chPseudoAll, "chPseudoAll");
__name2222(chPseudoAll, "chPseudoAll");
function chSearch(st, white, depth, alpha, beta, forWhite, nodes) {
  nodes.n++;
  if (chFindKing(st.board, white) < 0) return white === forWhite ? -1e5 - depth : 1e5 + depth;
  if (depth === 0 || nodes.n > nodes.cap) return chEval(st.board, forWhite);
  const moves = chPseudoAll(st, white);
  moves.sort((a, b) => (st.board[b.to] ? CH_VAL[st.board[b.to].toUpperCase()] : 0) - (st.board[a.to] ? CH_VAL[st.board[a.to].toUpperCase()] : 0));
  const maximizing = white === forWhite;
  let best = maximizing ? -Infinity : Infinity;
  for (const m of moves) {
    if (st.board[m.to] && st.board[m.to].toUpperCase() === "K") return maximizing ? 1e5 + depth : -1e5 - depth;
    const n = chApply(st, m);
    const v = chSearch(n, !white, depth - 1, alpha, beta, forWhite, nodes);
    if (maximizing) {
      if (v > best) best = v;
      if (best > alpha) alpha = best;
    } else {
      if (v < best) best = v;
      if (best < beta) beta = best;
    }
    if (beta <= alpha) break;
  }
  return best;
}
__name(chSearch, "chSearch");
__name2(chSearch, "chSearch");
__name22(chSearch, "chSearch");
__name222(chSearch, "chSearch");
__name2222(chSearch, "chSearch");
function chBotMove(st, turnIdx, level, random) {
  const white = turnIdx === 0;
  const moves = chLegal(st, white);
  if (!moves.length) return null;
  if (level === "easy") {
    const caps = moves.filter((m) => st.board[m.to] || m.ep);
    if (caps.length && random() < 0.6) {
      caps.sort((a, b) => CH_VAL[(st.board[b.to] || "p").toUpperCase()] - CH_VAL[(st.board[a.to] || "p").toUpperCase()]);
      return caps[0];
    }
    const safe = moves.filter((m) => {
      const n = chApply(st, m);
      return !chAttacked(n.board, m.to, !white);
    });
    const pool = safe.length && random() < 0.7 ? safe : moves;
    return pool[Math.floor(random() * pool.length)];
  }
  const depth = level === "hard" ? 3 : 2;
  const nodes = { n: 0, cap: level === "hard" ? 1500 : 450 };
  let best = null, bestV = -Infinity;
  moves.sort((a, b) => (st.board[b.to] ? CH_VAL[st.board[b.to].toUpperCase()] : 0) - (st.board[a.to] ? CH_VAL[st.board[a.to].toUpperCase()] : 0));
  for (const m of moves) {
    const n = chApply(st, m);
    let v = chSearch(n, !white, depth - 1, -Infinity, Infinity, white, nodes);
    v += (random() - 0.5) * (level === "hard" ? 4 : 30);
    if (v > bestV) {
      bestV = v;
      best = m;
    }
  }
  return best;
}
__name(chBotMove, "chBotMove");
__name2(chBotMove, "chBotMove");
__name22(chBotMove, "chBotMove");
__name222(chBotMove, "chBotMove");
__name2222(chBotMove, "chBotMove");
// Invitations only inspect the selected room. Unlike the game shelf, this
// snapshot is not capped: an older active table must still prevent duplicates.
async function invitationOptions(db,memberId,roomId) {
  const policy=await childPolicy(db,memberId),types=Object.fromEntries(Object.entries(GAME_TYPES).filter(([id])=>!policy||policy.games.includes(id)));
  const policies=(await db.prepare("SELECT key,value FROM settings WHERE key LIKE 'child_%'").all()).results;
  const members=(await db.prepare("SELECT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=? AND m.id>0").bind(roomId).all()).results.filter(m=>String(m.name||'').normalize('NFKC').trim().toLowerCase()!=='codextest').map(m=>{const row=policies.find(p=>p.key==='child_'+m.id),child=row?JSON.parse(row.value):null;return {...m,blocked_types:Object.keys(types).filter(id=>child&&!child.games.includes(id))};});
  const rows=(await db.prepare("SELECT g.id,g.type,g.players,g.status,g.max_players FROM games g WHERE g.room_id=? AND g.status IN ('waiting','playing') AND (EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=?) OR EXISTS (SELECT 1 FROM game_invitations i WHERE i.game_id=g.id AND i.member_id=? AND i.status='pending' AND g.status='waiting'))").bind(roomId,memberId,memberId).all()).results;
  const pending=(await db.prepare("SELECT i.game_id,i.member_id FROM game_invitations i JOIN games g ON g.id=i.game_id WHERE g.room_id=? AND g.status='waiting' AND i.status='pending' AND i.created_at>=? AND (i.member_id=? OR EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=?))").bind(roomId,now()-2*864e5,memberId,memberId).all()).results;
  return {roomId,members,types,games:rows.filter(g=>Object.hasOwn(types,g.type)).map(g=>({...g,players:JSON.parse(g.players),pending_members:pending.filter(i=>i.game_id===g.id).map(i=>i.member_id)}))};
}
function invitationReason(games,me,member,type) {
  for(const g of games.filter(g=>g.type===type)) {
    if(g.players.includes(me)&&g.players.includes(member))return 'Already playing';
    if(g.status==='waiting'&&((g.players.includes(me)&&g.pending_members.includes(member))||(g.pending_members.includes(me)&&g.players.includes(member))))return 'Invitation pending';
  }
  return '';
}
async function sendInvitationBatch(db,me,roomId,body,ctx) {
  const type=body.type,mode=body.mode,requestId=body.request_id;
  const gameMode=type==='shuffle'?shuffleMode(body.game_mode||'rummy'):type==='domino'?dominoCreationMode(body.game_mode||'draw'):type==='words'&&body.game_mode==='random'?'random':'classic';
  const gt=Object.hasOwn(GAME_TYPES,type)?{...GAME_TYPES[type],...(type==='shuffle'&&gameMode==='gin'?{max:2}:{})}:null;
  if(!Object.hasOwn(GAME_TYPES,type)||!gt||gt.max<2||!['individual','group'].includes(mode))throw new Error('Choose a supported multiplayer game and invitation mode.');
  if(typeof requestId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId))throw new Error('Reopen invitations to prepare a send.');
  const ids=body.member_ids;
  if(!Array.isArray(ids)||!ids.length||ids.length>100||ids.some(id=>!Number.isSafeInteger(id)||id<=0||id===me.id)||new Set(ids).size!==ids.length)throw new Error('Choose up to 100 different people in this room.');
  const recipients=[...ids].sort((a,b)=>a-b),seats=mode==='individual'?2:recipients.length+1;
  if(seats<gt.min||seats>gt.max)throw new Error(mode==='individual'?'This game needs a group. Choose Group invitations.':`Choose ${Math.max(1,gt.min-1)} to ${gt.max-1} people for this game.`);
  const plan=JSON.stringify({type,mode,game_mode:gameMode,member_ids:recipients});
  const receipt=async()=>{try{return await db.prepare('SELECT plan,codes FROM invitation_batches WHERE sender_id=? AND room_id=? AND request_id=?').bind(me.id,roomId,requestId).first();}catch(e){throw invitationSendUncertain(e);}};
  const previous=await receipt();
  if(previous&&previous.plan!==plan)throw new Error('This send was already used for a different selection. Reopen invitations.');
  let result=previous,createdGameIds=null;
  if(!previous) {
    // A receipt replay must remain confirmable even if a parent has since
    // changed access. New sends read policies together, then compare those
    // exact values again inside the transaction.
    const policyIds=[me.id,...recipients];
    const policyRows=(await db.prepare("SELECT key,value FROM settings WHERE key IN (SELECT 'child_'||value FROM json_each(?))").bind(JSON.stringify(policyIds)).all()).results;
    const policies=new Map(policyRows.map(row=>[row.key,row.value]));
    for(const id of policyIds){const raw=policies.get('child_'+id);if(raw&&!JSON.parse(raw).games.includes(type))throw new Error('Your parent has not enabled this game. Ask them to update your games in Settings.');}
    const policySnapshot=JSON.stringify(Object.fromEntries(policyIds.map(id=>[id,policies.get('child_'+id)??null])));
    const options=await invitationOptions(db,me.id,roomId);
    if(recipients.some(id=>!options.members.some(m=>m.id===id)||invitationReason(options.games,me.id,id,type)))throw new Error('Someone is already playing or has a pending invitation. Refresh the people and choose again.');
    const count=mode==='individual'?recipients.length:1,codes=[];
    for(let i=0;i<count;i++) {
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${me.id}:${roomId}:${requestId}:${i}`));
      codes.push([...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,32));
    }
    // The receipt is also the atomic eligibility guard. D1 batch executes in
    // one transaction, so a competing send cannot slip between check and write.
    const guard=`INSERT OR IGNORE INTO invitation_batches(sender_id,room_id,request_id,plan,codes,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM room_members WHERE room_id=? AND member_id=?) AND NOT EXISTS (SELECT 1 FROM json_each(?) snapshot WHERE (SELECT value FROM settings WHERE key='child_'||snapshot.key) IS NOT snapshot.value) AND NOT EXISTS (SELECT 1 FROM json_each(?) target WHERE NOT EXISTS (SELECT 1 FROM room_members WHERE room_id=? AND member_id=target.value) OR EXISTS (SELECT 1 FROM games g WHERE g.room_id=? AND g.type=? AND g.status IN ('waiting','playing') AND ((EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=?) AND (EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=target.value) OR (g.status='waiting' AND EXISTS (SELECT 1 FROM game_invitations i WHERE i.game_id=g.id AND i.member_id=target.value AND i.status='pending' AND i.created_at>=?)))) OR (g.status='waiting' AND EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=target.value) AND EXISTS (SELECT 1 FROM game_invitations i WHERE i.game_id=g.id AND i.member_id=? AND i.status='pending' AND i.created_at>=?)))))`;
    const stamps=now(),statements=[db.prepare(guard).bind(me.id,roomId,requestId,plan,JSON.stringify(codes),stamps,roomId,me.id,policySnapshot,JSON.stringify(recipients),roomId,roomId,type,me.id,now()-2*864e5,me.id,now()-2*864e5)];
    const permitted="EXISTS (SELECT 1 FROM invitation_batches WHERE sender_id=? AND room_id=? AND request_id=? AND plan=?)";
    for(const code of codes)statements.push(db.prepare(`INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,mode,invite_code,room_id) SELECT ?,?,?,'waiting',0,?,?,?,?,?,? WHERE ${permitted} AND NOT EXISTS (SELECT 1 FROM games WHERE invite_code=?)`).bind(type,JSON.stringify([me.id]),seats,me.id,stamps,stamps,gameMode,code,roomId,me.id,roomId,requestId,plan,code));
    for(let i=0;i<recipients.length;i++)statements.push(db.prepare(`INSERT OR IGNORE INTO game_invitations(game_id,member_id,sender_id,status,created_at) SELECT id,?,?,'pending',? FROM games WHERE invite_code=? AND ${permitted}`).bind(recipients[i],me.id,stamps,codes[mode==='individual'?i:0],me.id,roomId,requestId,plan));
    let writes;
    try{writes=await db.batch(statements);}catch(e){throw invitationSendUncertain(e);}
    if(!writes[0].meta.changes){
      result=await receipt();
      if(!result||result.plan!==plan)throw new Error('The people or tables changed. Refresh the people and choose again.');
    }else{
      result={plan,codes:JSON.stringify(codes)};
      createdGameIds=writes.slice(1,1+codes.length).map(write=>write.meta.last_row_id);
      if(createdGameIds.some(id=>!id))throw invitationSendUncertain();
    }
    const notified=recipients.filter((_,i)=>writes[1+codes.length+i].meta.changes);
    if(notified.length)ctx?.waitUntil?.(notifyMembers(db,notified,{type:'invite',title:me.name+' saved you a seat',body:'Join '+gt.name+' — open your Game Nook to accept.',tag:'ohana-invite-'+requestId}).catch(()=>{}));
  }
  let storedCodes;
  try{storedCodes=JSON.parse(result.codes);}catch(e){throw invitationSendUncertain(e);}
  let games=createdGameIds;
  if(!games){
    let gameRows;
    try{gameRows=(await db.prepare(`SELECT id,invite_code FROM games WHERE invite_code IN (${storedCodes.map(()=>'?').join(',')})`).bind(...storedCodes).all()).results;}catch(e){throw invitationSendUncertain(e);}
    const gameByCode=new Map(gameRows.map(row=>[row.invite_code,row.id]));
    games=storedCodes.map(code=>gameByCode.get(code));
  }
  if(games.some(id=>!id))throw invitationSendUncertain();
  return {ok:true,mode,type,member_ids:recipients,game_ids:games};
}
function invitationSendUncertain(cause){const error=new Error('Could not confirm this send. Retry the same send safely.');error.invitationUncertain=true;error.cause=cause;return error;}
var GAME_TYPES = {
  shuffle: { name: "Ohana Shuffle · Card table", min: 2, max: 6, tag: "Everybody", desc: "One standard-card table. Choose Regular Rummy or Gin Rummy; browse future card-game rules." },
  mahjong: { name: "Ohana Mahjong", min: 1, max: 4, tag: "Everybody", desc: "Solo tile matching, or real family draw-and-discard Mahjong for two to four players." },
  words: { name: "Ohana Words", min: 2, max: 4, tag: "Grown-ups & big kids", desc: "Our own Wordfeud. Random boards, hidden surprise squares (good & bad!), plus the Ohana Star." },
  tictac: { name: "Tic-Tac-Toe", min: 2, max: 2, tag: "Little ones", desc: "Three in a row wins. Quick and easy." },
  memory: { name: "Memory Match", min: 1, max: 2, tag: "Little ones", desc: "Flip two cards. Find the pairs. Play solo or most pairs wins." },
  checkers: { name: "Checkers", min: 2, max: 2, tag: "Everybody", desc: "Jump your way across the board. Kings move both ways." },
  chess: { name: "Ohana Marie", min: 2, max: 2, tag: "Everybody", desc: "Chess, the Ohana way \u2014 Amber Marie\u2019s board. Honu\u2019s Island vs Splash\u2019s Reef, and every buddy is a piece." },
  handfoot: { name: "Ohanda & Foot", min: 2, max: 4, tag: "Grown-ups & big kids", desc: "Canasta-style card game. Build melds, make canastas, play your hand then your foot!" },
  ohana10: { name: "Ohana 10", min: 2, max: 4, tag: "Everybody", desc: "Complete ten island journeys. Match families, build number trails, share colors and reach the homecoming!" },
  spades: { name: "Ohana Mike's", min: 4, max: 4, tag: "Grown-ups & big kids", desc: "Classic partners trick-taking. Bid your tricks together, spades are always trump. Named for our friend Mike \u2014 the Ohana eagle." },
  domino: { name: "OhanO DominO", min: 2, max: 8, tag: "Everybody", desc: "Ohana-style dominoes with readable island tiles, version choices, automatic scoring, and family-size tables." }
};
var DIST = { A: [9, 1], B: [2, 3], C: [2, 3], D: [4, 2], E: [12, 1], F: [2, 4], G: [3, 2], H: [2, 4], I: [9, 1], J: [1, 8], K: [1, 5], L: [4, 1], M: [2, 3], N: [6, 1], O: [8, 1], P: [2, 3], Q: [1, 10], R: [6, 1], S: [4, 1], T: [6, 1], U: [4, 1], V: [2, 4], W: [2, 4], X: [1, 8], Y: [2, 4], Z: [1, 10], "?": [2, 0] };
var LETTER_VALUES = Object.fromEntries(Object.entries(DIST).map(([k, v]) => [k, v[1]]));
var SURPRISE_POOL = [
  { type: "gift", emoji: "\u{1F381}", label: "Gift! +20" },
  { type: "jackpot", emoji: "\u{1F48E}", label: "Jackpot! Play doubled" },
  { type: "extra", emoji: "\u{1F504}", label: "Another turn!" },
  { type: "oops", emoji: "\u{1F327}\uFE0F", label: "Rain cloud! \u221215" },
  { type: "robin", emoji: "\u{1F91D}", label: "Share the sunshine! Others +10" },
  { type: "freeze", emoji: "\u{1F9CA}", label: "Freeze! Lose a tile" },
  { type: "wave", emoji: "\u{1F30A}", label: "Word wave! +10 per word" },
  { type: "shells", emoji: "\u{1F41A}", label: "Shell trail! +5 per tile played" },
  { type: "longword", emoji: "\u{1F33A}", label: "Long word bloom! +5 per letter" },
  { type: "sunburst", emoji: "\u2600\uFE0F", label: "Sunburst! +10 and another turn" }
];
var N = 15;
var CENTER = 112;
function wordsInit(players, seed, mode) {
  const r = rng(seed);
  const bonus = new Array(225).fill("");
  const open = [...Array(225).keys()].filter((i) => i !== CENTER);
  shuffle(open, r);
  const plan = [["TW", 8], ["DW", 16], ["TL", 12], ["DL", 24]];
  let k = 0;
  for (const [b, n] of plan) for (let j = 0; j < n; j++) bonus[open[k++]] = b;
  const star = open[k++];
  const surpriseList = shuffle([...SURPRISE_POOL], r);
  const surprises = {};
  for (let s = 0; s < surpriseList.length && k < open.length; s++) {
    surprises[open[k++]] = { ...surpriseList[s] };
  }
  let bag = [];
  for (const [l, [n]] of Object.entries(DIST)) for (let j = 0; j < n; j++) bag.push(l);
  shuffle(bag, r);
  const racks = {}, scores = {};
  for (const p of players) {
    racks[p] = bag.splice(0, 7);
    scores[p] = 0;
  }
  return { board: new Array(225).fill(null), bonus, star, starFound: false, surprises, foundSurprises: {}, mysteryVersion: 2, bag, racks, scores, passes: 0, history: [], lastMove: [], mode: mode || "classic" };
}
__name(wordsInit, "wordsInit");
__name2(wordsInit, "wordsInit");
__name22(wordsInit, "wordsInit");
__name222(wordsInit, "wordsInit");
__name2222(wordsInit, "wordsInit");
__name22222(wordsInit, "wordsInit");
__name222222(wordsInit, "wordsInit");
function wordsRefill(st, p) {
  while (st.racks[p].length < 7 && st.bag.length) st.racks[p].push(st.bag.shift());
}
__name(wordsRefill, "wordsRefill");
__name2(wordsRefill, "wordsRefill");
__name22(wordsRefill, "wordsRefill");
__name222(wordsRefill, "wordsRefill");
__name2222(wordsRefill, "wordsRefill");
__name22222(wordsRefill, "wordsRefill");
__name222222(wordsRefill, "wordsRefill");
function collect(board, placed, i, dir322222) {
  const row = Math.floor(i / N), col = i % N;
  const inLine = __name222222((j2) => dir322222 === 1 ? Math.floor(j2 / N) === row : true, "inLine");
  let start = i;
  while (true) {
    const prev = start - dir322222;
    if (prev < 0 || !inLine(prev) || !board[prev]) break;
    start = prev;
  }
  const idx = [];
  let j = start;
  while (j < 225 && inLine(j) && board[j]) {
    idx.push(j);
    j += dir322222;
    if (dir322222 === 1 && j % N === 0) break;
  }
  return idx;
}
__name(collect, "collect");
__name2(collect, "collect");
__name22(collect, "collect");
__name222(collect, "collect");
__name2222(collect, "collect");
__name22222(collect, "collect");
__name222222(collect, "collect");
async function wordsMove(st, players, turnIdx, move, db) {
  const p = players[turnIdx];
  if (move.action === "pass") {
    st.passes++;
    st.lastMove = [];
    st.history.push({ p, words: [], score: 0, note: "passed" });
    return endCheck(st, players, turnIdx);
  }
  if (move.action === "resign") {
    st.resigned = p;
    return { over: true, winner: null, next: turnIdx };
  }
  if (move.action === "swap") {
    const letters = (move.letters || []).map((l) => String(l).toUpperCase());
    if (!letters.length || st.bag.length < 7) throw new Error("You can only swap when the bag has 7 or more tiles.");
    const rack2 = [...st.racks[p]];
    for (const l of letters) {
      const k = rack2.indexOf(l);
      if (k < 0) throw new Error("That tile isn't on your rack.");
      rack2.splice(k, 1);
    }
    st.racks[p] = rack2;
    wordsRefill(st, p);
    st.bag.push(...letters);
    shuffle(st.bag, Math.random);
    st.passes++;
    st.lastMove = [];
    st.history.push({ p, words: [], score: 0, note: `swapped ${letters.length}` });
    return endCheck(st, players, turnIdx);
  }
  const pl = (move.placements || []).map((x) => ({ i: +x.i, l: String(x.l || "").toUpperCase(), blank: !!x.blank }));
  if (!pl.length) throw new Error("Place at least one tile.");
  if (new Set(pl.map((t) => t.i)).size !== pl.length) throw new Error("Use a different square for each tile.");
  for (const t of pl) {
    if (!Number.isInteger(t.i) || t.i < 0 || t.i > 224 || st.board[t.i]) throw new Error("Bad square.");
    if (!/^[A-Z]$/.test(t.l)) throw new Error("Bad letter.");
  }
  const rack = [...st.racks[p]];
  for (const t of pl) {
    const need = t.blank ? "?" : t.l;
    const k = rack.indexOf(need);
    if (k < 0) throw new Error("You don't have those tiles.");
    rack.splice(k, 1);
  }
  const rows = new Set(pl.map((t) => Math.floor(t.i / N))), cols = new Set(pl.map((t) => t.i % N));
  if (rows.size > 1 && cols.size > 1) throw new Error("Tiles must be in one straight line.");
  const board = st.board.slice();
  for (const t of pl) board[t.i] = { l: t.l, v: t.blank ? 0 : LETTER_VALUES[t.l], blank: t.blank };
  const firstMove = st.board.every((x) => !x);
  let dir322222;
  if (pl.length > 1) dir322222 = rows.size === 1 ? 1 : N;
  else dir322222 = collect(board, pl, pl[0].i, 1).length > 1 ? 1 : N;
  const main = collect(board, pl, pl[0].i, dir322222);
  const placedSet = new Set(pl.map((t) => t.i));
  for (const t of pl) if (!main.includes(t.i)) throw new Error("Tiles must be connected in one word, no gaps.");
  if (firstMove) {
    if (!placedSet.has(CENTER)) throw new Error("First word must cover the center star.");
    if (pl.length < 2) throw new Error("First word needs at least 2 letters.");
  } else {
    if (!main.some((i) => !placedSet.has(i)) && !pl.some((t) => {
      const cross = collect(board, pl, t.i, dir322222 === 1 ? N : 1);
      return cross.length > 1;
    })) throw new Error("Your word must connect to a tile already on the board.");
  }
  const wordsFormed = [];
  if (main.length > 1) wordsFormed.push(main);
  for (const t of pl) {
    const cross = collect(board, pl, t.i, dir322222 === 1 ? N : 1);
    if (cross.length > 1) wordsFormed.push(cross);
  }
  const uniq = [];
  const seen = /* @__PURE__ */ new Set();
  for (const w of wordsFormed) {
    const key = w.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(w);
    }
  }
  if (!uniq.length) throw new Error("That does not make a word.");
  const strs = uniq.map((w) => w.map((i) => board[i].l).join(""));
  const bad = [];
  for (const s of strs) {
    const row = await db.prepare("SELECT 1 FROM words WHERE w=?").bind(s).first();
    if (!row) bad.push(s);
  }
  if (bad.length) throw new Error(`Not in our dictionary: ${bad.join(", ")}`);
  let total = 0;
  const detail = [];
  for (const w of uniq) {
    let sum = 0, mult = 1;
    const letters = [];
    for (const i of w) {
      let v = board[i].v;
      if (placedSet.has(i)) {
        const b = st.bonus[i];
        if (b === "DL") v *= 2;
        if (b === "TL") v *= 3;
        if (b === "DW") mult *= 2;
        if (b === "TW") mult *= 3;
      }
      letters.push({ letter: board[i].l, base: board[i].v, points: v, bonus: placedSet.has(i) ? st.bonus[i] || "" : "" });
      sum += v;
    }
    const sc = sum * mult;
    total += sc;
    detail.push({ word: w.map((i) => board[i].l).join(""), score: sc, letters, letterTotal: sum, wordMultiplier: mult });
  }
  let note = "";
  const adjustments = [];
  if (pl.length === 7) {
    total += 50;
    note = "All 7 tiles! +50";
    adjustments.push({ label: note, delta: 50, total });
  }
  if (!st.starFound && placedSet.has(st.star)) {
    st.starFound = true;
    total += 20;
    adjustments.push({ label: "Found the Ohana Star!", delta: 20, total });
    note += (note ? " \xB7 " : "") + "Found the Ohana Star! +20";
  }
  if (!st.mysteryVersion) {
    const unseen = Object.keys(st.surprises || {}).filter((i) => !st.foundSurprises?.[i]).sort((a, b) => Number(a) - Number(b));
    unseen.forEach((i, n) => {
      st.surprises[i] = { ...SURPRISE_POOL[n % SURPRISE_POOL.length] };
    });
    st.mysteryVersion = 2;
  }
  let extraTurn = false;
  for (const t of pl) {
    const surp = st.surprises[t.i];
    if (surp && !st.foundSurprises[t.i]) {
      const before = total, oldNote = note;
      st.foundSurprises[t.i] = surp;
      switch (surp.type) {
        case "gift":
          total += 20;
          note += (note ? " \xB7 " : "") + "\u{1F381} Gift! +20";
          break;
        case "jackpot":
          total *= 2;
          note += (note ? " \xB7 " : "") + "\u{1F48E} Jackpot! Word doubled!";
          break;
        case "extra":
          extraTurn = true;
          note += (note ? " \xB7 " : "") + "\u{1F504} Extra Turn!";
          break;
        case "oops":
          total = Math.max(0, total - 15);
          note += (note ? " \xB7 " : "") + "\u{1F480} Oops! \u201315";
          break;
        case "robin":
          for (const q of players) if (q !== p) st.scores[q] += 10;
          note += (note ? " \xB7 " : "") + "\u{1F3AF} Robin Hood! Others +10 each";
          break;
        case "wave":
          total += 10 * detail.length;
          note += (note ? " \xB7 " : "") + "\u{1F30A} Word wave! +" + 10 * detail.length;
          break;
        case "shells":
          total += 5 * pl.length;
          note += (note ? " \xB7 " : "") + "\u{1F41A} Shell trail! +" + 5 * pl.length;
          break;
        case "longword": {
          const longest = Math.max(...detail.map((w) => w.word.length));
          total += 5 * longest;
          note += (note ? " \xB7 " : "") + "\u{1F33A} Long word bloom! +" + 5 * longest;
          break;
        }
        case "sunburst":
          total += 10;
          extraTurn = true;
          note += (note ? " \xB7 " : "") + "\u2600\uFE0F Sunburst! +10 and another turn";
          break;
        case "freeze":
          if (rack.length > 0) {
            let maxV = -1, maxIdx = 0;
            for (let ri = 0; ri < rack.length; ri++) {
              const v = LETTER_VALUES[rack[ri]] || 0;
              if (v > maxV) {
                maxV = v;
                maxIdx = ri;
              }
            }
            const lost = rack.splice(maxIdx, 1)[0];
            st.bag.push(lost);
            note += (note ? " \xB7 " : "") + "\u{1F9CA} Freeze! Lost " + (lost === "?" ? "blank" : lost);
          }
          break;
      }
      adjustments.push({ type: surp.type, square: t.i, label: note.slice(oldNote.length).replace(/^ · /, ""), delta: total - before, total, ...surp.type === "robin" ? { awards: players.filter((q) => q !== p).map((q) => ({ player: q, points: 10 })) } : {} });
    }
  }
  st.board = board;
  st.racks[p] = rack;
  wordsRefill(st, p);
  st.scores[p] += total;
  st.passes = 0;
  st.lastMove = [...placedSet];
  st.history.push({ p, words: detail, score: total, note, adjustments });
  if (st.mode === "random") {
    const empties = [];
    const bonusPool = [];
    for (let i = 0; i < 225; i++) {
      if (!st.board[i]) {
        if (st.bonus[i]) bonusPool.push(st.bonus[i]);
        empties.push(i);
      }
    }
    for (let i = 0; i < 225; i++) {
      if (!st.board[i]) st.bonus[i] = "";
    }
    shuffle(empties, Math.random);
    for (let b = 0; b < bonusPool.length && b < empties.length; b++) {
      st.bonus[empties[b]] = bonusPool[b];
    }
  }
  const result = endCheck(st, players, turnIdx);
  if (extraTurn && !result.over) result.next = turnIdx;
  return result;
}
__name(wordsMove, "wordsMove");
__name2(wordsMove, "wordsMove");
__name22(wordsMove, "wordsMove");
__name222(wordsMove, "wordsMove");
__name2222(wordsMove, "wordsMove");
__name22222(wordsMove, "wordsMove");
__name222222(wordsMove, "wordsMove");
function endCheck(st, players, turnIdx) {
  const p = players[turnIdx];
  const out = st.racks[p].length === 0 && st.bag.length === 0;
  if (out || st.passes >= players.length * 3) {
    if (out) {
      let bonus = 0;
      for (const q of players) if (q !== p) {
        const rem = st.racks[q].reduce((a, l) => a + LETTER_VALUES[l], 0);
        st.scores[q] -= rem;
        bonus += rem;
      }
      st.scores[p] += bonus;
    } else for (const q of players) st.scores[q] -= st.racks[q].reduce((a, l) => a + LETTER_VALUES[l], 0);
    let best = null, tie = false;
    for (const q of players) {
      if (best === null || st.scores[q] > st.scores[best]) {
        best = q;
        tie = false;
      } else if (st.scores[q] === st.scores[best]) tie = true;
    }
    return { over: true, winner: tie ? "tie" : best, next: turnIdx };
  }
  return { over: false, next: (turnIdx + 1) % players.length };
}
__name(endCheck, "endCheck");
__name2(endCheck, "endCheck");
__name22(endCheck, "endCheck");
__name222(endCheck, "endCheck");
__name2222(endCheck, "endCheck");
__name22222(endCheck, "endCheck");
__name222222(endCheck, "endCheck");
function wordsView(st, viewer) {
  const racks = {};
  for (const p in st.racks) racks[p] = String(p) === String(viewer) ? st.racks[p] : st.racks[p].length;
  const surpriseSquares = Object.keys(st.surprises).map(Number);
  return { ...st, racks, bag: st.bag.length, star: st.starFound ? st.star : null, surprises: surpriseSquares, foundSurprises: st.foundSurprises, mode: st.mode || "classic" };
}
__name(wordsView, "wordsView");
__name2(wordsView, "wordsView");
__name22(wordsView, "wordsView");
__name222(wordsView, "wordsView");
__name2222(wordsView, "wordsView");
__name22222(wordsView, "wordsView");
__name222222(wordsView, "wordsView");
function tttInit() {
  return { board: new Array(9).fill(null) };
}
__name(tttInit, "tttInit");
__name2(tttInit, "tttInit");
__name22(tttInit, "tttInit");
__name222(tttInit, "tttInit");
__name2222(tttInit, "tttInit");
__name22222(tttInit, "tttInit");
__name222222(tttInit, "tttInit");
function tttMove(st, players, turnIdx, move) {
  const i = +move.i;
  if (!Number.isInteger(i) || !(i >= 0 && i < 9) || st.board[i]) throw new Error("Pick an empty square.");
  st.board[i] = turnIdx === 0 ? "X" : "O";
  st.last = i;
  const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, b, c] of L) if (st.board[a] && st.board[a] === st.board[b] && st.board[a] === st.board[c]) {
    st.line = [a, b, c];
    return { over: true, winner: players[turnIdx], next: turnIdx };
  }
  if (st.board.every(Boolean)) return { over: true, winner: "tie", next: turnIdx };
  return { over: false, next: 1 - turnIdx };
}
__name(tttMove, "tttMove");
__name2(tttMove, "tttMove");
__name22(tttMove, "tttMove");
__name222(tttMove, "tttMove");
__name2222(tttMove, "tttMove");
__name22222(tttMove, "tttMove");
__name222222(tttMove, "tttMove");
var EMOJI = ["\u{1F436}", "\u{1F431}", "\u{1F438}", "\u{1F98A}", "\u{1F422}", "\u{1F419}", "\u{1F98B}", "\u{1F308}", "\u{1F355}", "\u{1F366}", "\u{1F680}", "\u2B50", "\u{1F33A}", "\u{1F42C}", "\u{1F984}", "\u{1F349}"];
function memInit(players, seed) {
  const r = rng(seed);
  const pick = shuffle([...EMOJI], r).slice(0, 10);
  const cards = shuffle([...pick, ...pick], r);
  const scores = {};
  for (const p of players) scores[p] = 0;
  return { cards, matched: new Array(20).fill(false), open: [], pending: [], scores };
}
__name(memInit, "memInit");
__name2(memInit, "memInit");
__name22(memInit, "memInit");
__name222(memInit, "memInit");
__name2222(memInit, "memInit");
__name22222(memInit, "memInit");
__name222222(memInit, "memInit");
function memMove(st, players, turnIdx, move) {
  if(Number(st.revealUntil)>Date.now())throw new Error("Watch these cards for a moment.");
  const i = +move.i;
  if (!Number.isInteger(i) || !(i >= 0 && i < 20) || st.matched[i] || st.open.includes(i)) throw new Error("Pick a face-down card.");
  st.pending = [];st.revealUntil=0;
  st.open.push(i);
  if (st.open.length < 2) {if(players[turnIdx]===BOT_ID){st.revealUntil=Date.now()+900;st.revealBy=BOT_ID;}return { over: false, next: turnIdx };}
  const [a, b] = st.open;
  st.revealUntil=Date.now()+1800;st.revealBy=players[turnIdx];st.revealMatch=st.cards[a]===st.cards[b];
  st.open = [];
  const solo = players.length === 1;
  if (solo) st.flips = (st.flips || 0) + 1;
  if (st.cards[a] === st.cards[b]) {
    st.matched[a] = st.matched[b] = true;
    st.scores[players[turnIdx]]++;
    if (st.matched.every(Boolean)) {
      if (solo) return { over: true, winner: players[0], next: turnIdx };
      const [p0, p1] = players;
      const w = st.scores[p0] === st.scores[p1] ? "tie" : st.scores[p0] > st.scores[p1] ? p0 : p1;
      return { over: true, winner: w, next: turnIdx };
    }
    return { over: false, next: turnIdx };
  }
  st.pending = [a, b];
  return { over: false, next: solo ? turnIdx : 1 - turnIdx };
}
__name(memMove, "memMove");
__name2(memMove, "memMove");
__name22(memMove, "memMove");
__name222(memMove, "memMove");
__name2222(memMove, "memMove");
__name22222(memMove, "memMove");
__name222222(memMove, "memMove");
function chkInit() {
  const b = new Array(64).fill(null);
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8), c = i % 8;
    if ((r + c) % 2 === 1) {
      if (r < 3) b[i] = "b";
      else if (r > 4) b[i] = "r";
    }
  }
  return { board: b, mustContinue: null, counts: { r: 12, b: 12 } };
}
__name(chkInit, "chkInit");
__name2(chkInit, "chkInit");
__name22(chkInit, "chkInit");
__name222(chkInit, "chkInit");
__name2222(chkInit, "chkInit");
__name22222(chkInit, "chkInit");
__name222222(chkInit, "chkInit");
function chkOwner(pc) {
  return pc ? pc.toLowerCase() : null;
}
__name(chkOwner, "chkOwner");
__name2(chkOwner, "chkOwner");
__name22(chkOwner, "chkOwner");
__name222(chkOwner, "chkOwner");
__name2222(chkOwner, "chkOwner");
__name22222(chkOwner, "chkOwner");
__name222222(chkOwner, "chkOwner");
function chkJumps(b, i) {
  const pc = b[i];
  if (!pc) return [];
  const own = chkOwner(pc);
  const r = Math.floor(i / 8), c = i % 8;
  const out = [];
  const dirs = pc === "R" || pc === "B" ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : own === "r" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  for (const [dr, dc] of dirs) {
    const mr = r + dr, mc = c + dc, tr = r + 2 * dr, tc = c + 2 * dc;
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
    const mid = b[mr * 8 + mc];
    if (mid && chkOwner(mid) !== own && !b[tr * 8 + tc]) out.push({ to: tr * 8 + tc, over: mr * 8 + mc });
  }
  return out;
}
__name(chkJumps, "chkJumps");
__name2(chkJumps, "chkJumps");
__name22(chkJumps, "chkJumps");
__name222(chkJumps, "chkJumps");
__name2222(chkJumps, "chkJumps");
__name22222(chkJumps, "chkJumps");
__name222222(chkJumps, "chkJumps");
function chkSteps(b, i) {
  const pc = b[i];
  const own = chkOwner(pc);
  const r = Math.floor(i / 8), c = i % 8;
  const out = [];
  const dirs = pc === "R" || pc === "B" ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : own === "r" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  for (const [dr, dc] of dirs) {
    const tr = r + dr, tc = c + dc;
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
    if (!b[tr * 8 + tc]) out.push({ to: tr * 8 + tc });
  }
  return out;
}
__name(chkSteps, "chkSteps");
__name2(chkSteps, "chkSteps");
__name22(chkSteps, "chkSteps");
__name222(chkSteps, "chkSteps");
__name2222(chkSteps, "chkSteps");
__name22222(chkSteps, "chkSteps");
__name222222(chkSteps, "chkSteps");
function chkHasMoves(b, own) {
  for (let i = 0; i < 64; i++) if (b[i] && chkOwner(b[i]) === own && (chkJumps(b, i).length || chkSteps(b, i).length)) return true;
  return false;
}
__name(chkHasMoves, "chkHasMoves");
__name2(chkHasMoves, "chkHasMoves");
__name22(chkHasMoves, "chkHasMoves");
__name222(chkHasMoves, "chkHasMoves");
__name2222(chkHasMoves, "chkHasMoves");
__name22222(chkHasMoves, "chkHasMoves");
__name222222(chkHasMoves, "chkHasMoves");
function chkMove(st, players, turnIdx, move) {
  const own = turnIdx === 0 ? "r" : "b";
  const b = st.board;
  const from = +move.from, to = +move.to;
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from > 63 || to < 0 || to > 63) throw new Error("Choose squares on the board.");
  if (!b[from] || chkOwner(b[from]) !== own) throw new Error("That is not your piece.");
  if (st.mustContinue !== null && st.mustContinue !== from) throw new Error("You must keep jumping with the same piece.");
  const jumps = chkJumps(b, from);
  const j = jumps.find((x) => x.to === to);
  let jumped = false;
  if (j) {
    b[to] = b[from];
    b[from] = null;
    const cap = b[j.over];
    b[j.over] = null;
    st.counts[chkOwner(cap)]--;
    jumped = true;
  } else {
    if (st.mustContinue !== null) throw new Error("You must keep jumping.");
    if (b.some((pc, i) => chkOwner(pc) === own && chkJumps(b, i).length)) throw new Error("A capture is available. Choose a jumping piece.");
    const s = chkSteps(b, from).find((x) => x.to === to);
    if (!s) throw new Error("That piece cannot move there.");
    b[to] = b[from];
    b[from] = null;
  }
  const row = Math.floor(to / 8);
  let crowned = false;
  if (b[to] === "r" && row === 0) {
    b[to] = "R";
    crowned = true;
  }
  if (b[to] === "b" && row === 7) {
    b[to] = "B";
    crowned = true;
  }
  st.last = [from, to];
  if (jumped && !crowned && chkJumps(b, to).length) {
    st.mustContinue = to;
    return { over: false, next: turnIdx };
  }
  st.mustContinue = null;
  const opp = own === "r" ? "b" : "r";
  if (st.counts[opp] === 0 || !chkHasMoves(b, opp)) return { over: true, winner: players[turnIdx], next: turnIdx };
  return { over: false, next: 1 - turnIdx };
}
__name(chkMove, "chkMove");
__name2(chkMove, "chkMove");
__name22(chkMove, "chkMove");
__name222(chkMove, "chkMove");
__name2222(chkMove, "chkMove");
__name22222(chkMove, "chkMove");
__name222222(chkMove, "chkMove");
var BOT_ID = -1;
// Reserved robot seats for four-person Spades; all other games retain their existing pair.
function gameBotPlayer(type,id){return id===BOT_ID||(type==='spades'&&(id===-2||id===-3));}
function gameBotSeats(type,member){return type==='spades'?[member,BOT_ID,-2,-3]:[member,BOT_ID];}
function gameBotNames(type,players,names){for(const id of players)if(gameBotPlayer(type,id))names[id]={id,name:id===BOT_ID?'Ohana Robot':'Ohana Robot '+Math.abs(id),avatar:'@hon',...(type==='spades'?{is_bot:true}:{})};}
function rememberBotCards(st) {
  if (!st.bot || !st.cards) return;
  const seen = [.../* @__PURE__ */ new Set([...st.open || [], ...st.pending || []])];
  st.bot.memory = st.bot.memory || {};
  for (const i of seen) st.bot.memory[i] = st.cards[i];
  for (const i of Object.keys(st.bot.memory)) if (st.matched[i]) delete st.bot.memory[i];
  const keys = Object.keys(st.bot.memory), limit = st.bot.difficulty === "hard" ? 48 : st.bot.difficulty === "medium" ? 10 : 4;
  while (keys.length > limit) delete st.bot.memory[keys.shift()];
}
__name(rememberBotCards, "rememberBotCards");
__name2(rememberBotCards, "rememberBotCards");
__name22(rememberBotCards, "rememberBotCards");
__name222(rememberBotCards, "rememberBotCards");
__name2222(rememberBotCards, "rememberBotCards");
__name22222(rememberBotCards, "rememberBotCards");
var BOT_WORDS = "AT TO IN IT IS AS AN ON NO SO GO DO UP US WE HE ME BE BY OR IF OF AM MY HI OH OX AX EX CAT DOG SUN SEA SKY BAY DAY WAY SAY MAY PAY RAY HAY JOY TOY BOY KEY TRY DRY FLY CRY SHY WHY YES YET SET GET LET MET NET PET WET BET SIT SAT RAT HAT BAT MAT FAT EAT ATE TEA EAR ARE ART TAR CAR FAR BAR WAR RED BED FED LED HEN PEN TEN DEN MEN MAN CAN FAN PAN RAN TAN VAN WIN WON ONE TWO SIX TEN TOP HOP POP POT HOT NOT COT DOT GOT LOT LOG LEG EGG BIG DIG PIG FIG JIG RIG BAG BUG HUG MUG RUG TUG NAP LAP MAP CAP TAP GAP ZIP ZAP ZOO BOX FOX FIX MIX TAX WAX HOME LOVE KIND PLAY GAME GOOD NICE WAVE SAND PALM FISH BIRD DUCK SEAL BOAT COAT GOAT STAR MOON BLUE PINK GOLD WARM COOL RAIN WIND SNOW SNUG SOFT HELP HOPE HUGS FUNNY HAPPY SMILE WATER SHELL BEACH HEART HOUSE CHAIR TABLE FAMILY FLOWER FRIEND TURTLE".split(" ");
function hardTicTac(board, mark) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], other = /* @__PURE__ */ __name22222((m) => m === "X" ? "O" : "X", "other");
  function search(b, m, depth) {
    for (const l of lines) if (b[l[0]] && l.every((i) => b[i] === b[l[0]])) return b[l[0]] === mark ? 10 - depth : depth - 10;
    const empty = b.flatMap((v, i) => v ? [] : [i]);
    if (!empty.length) return 0;
    const scores = empty.map((i) => {
      const next = [...b];
      next[i] = m;
      return search(next, other(m), depth + 1);
    });
    return m === mark ? Math.max(...scores) : Math.min(...scores);
  }
  __name(search, "search");
  __name2(search, "search");
  __name22(search, "search");
  __name222(search, "search");
  __name2222(search, "search");
  __name22222(search, "search");
  return [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => !board[i]).map((i) => {
    const b = [...board];
    b[i] = mark;
    return { i, score: search(b, other(mark), 0) };
  }).sort((a, b) => b.score - a.score)[0].i;
}
__name(hardTicTac, "hardTicTac");
__name2(hardTicTac, "hardTicTac");
__name22(hardTicTac, "hardTicTac");
__name222(hardTicTac, "hardTicTac");
__name2222(hardTicTac, "hardTicTac");
__name22222(hardTicTac, "hardTicTac");
function hardCheckers(st, players, turn, moves) {
  const own = turn === 0 ? "r" : "b";
  function legal(s, t) {
    const out = [];
    s.board.forEach((p, i) => {
      if (p && chkOwner(p) === (t === 0 ? "r" : "b") && (s.mustContinue === null || s.mustContinue === i)) {
        out.push(...chkJumps(s.board, i).map((m) => ({ from: i, to: m.to })));
        if (s.mustContinue === null) out.push(...chkSteps(s.board, i).map((m) => ({ from: i, to: m.to })));
      }
    });
    const captures = out.filter((m) => Math.abs(Math.floor(m.to / 8) - Math.floor(m.from / 8)) === 2);
    return captures.length ? captures : out;
  }
  __name(legal, "legal");
  __name2(legal, "legal");
  __name22(legal, "legal");
  __name222(legal, "legal");
  __name2222(legal, "legal");
  __name22222(legal, "legal");
  function evaluate(s) {
    return s.board.reduce((v, p, i) => !p ? v : v + (chkOwner(p) === own ? 1 : -1) * ((p === p.toUpperCase() ? 175 : 100) + (chkOwner(p) === "r" ? 7 - Math.floor(i / 8) : Math.floor(i / 8)) * 3), 0);
  }
  __name(evaluate, "evaluate");
  __name2(evaluate, "evaluate");
  __name22(evaluate, "evaluate");
  __name222(evaluate, "evaluate");
  __name2222(evaluate, "evaluate");
  __name22222(evaluate, "evaluate");
  function search(s, t, depth) {
    if (!depth) return evaluate(s);
    const options = legal(s, t);
    if (!options.length) return t === turn ? -1e4 : 1e4;
    const values = options.map((m) => {
      const next = structuredClone(s), r = chkMove(next, players, t, m);
      return r.over ? r.winner === players[turn] ? 1e4 : -1e4 : search(next, r.next, depth - 1);
    });
    return t === turn ? Math.max(...values) : Math.min(...values);
  }
  __name(search, "search");
  __name2(search, "search");
  __name22(search, "search");
  __name222(search, "search");
  __name2222(search, "search");
  __name22222(search, "search");
  return moves.map((move) => {
    const next = structuredClone(st), r = chkMove(next, players, turn, move);
    return { move, score: r.over ? 1e4 : search(next, r.next, 2) };
  }).sort((a, b) => b.score - a.score)[0].move;
}
__name(hardCheckers, "hardCheckers");
__name2(hardCheckers, "hardCheckers");
__name22(hardCheckers, "hardCheckers");
__name222(hardCheckers, "hardCheckers");
__name2222(hardCheckers, "hardCheckers");
__name22222(hardCheckers, "hardCheckers");
async function chooseBotMove(type, st, players, turn, db, random = Math.random) {
  if(type==='shuffle') {
    if(players[turn]!==BOT_ID)throw Error('Not the robot turn.');
    const visible=shuffleView(st,BOT_ID);
    // The card just picked up is the robot's own private information, even before the turn is saved.
    visible.drawnDiscard=st.drawnDiscard;
    return chooseShuffleBotMove(visible,BOT_ID);
  }
  const pick = /* @__PURE__ */ __name22222((a) => a[Math.floor(random() * a.length)], "pick"), hard = st.bot.difficulty === "hard", medium = st.bot.difficulty === "medium";
  if (type === "tictac") {
    const empty = st.board.flatMap((v, i) => v ? [] : [i]);
    if (hard) return { i: hardTicTac(st.board, turn === 0 ? "X" : "O") };
    if (medium && random() < 0.75) {
      for (const mark of ["O", "X"]) for (const i of empty) {
        const b = [...st.board];
        b[i] = mark;
        if ([[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].some((l) => l.every((j) => b[j] === mark))) return { i };
      }
    }
    return { i: pick(empty) };
  }
  if (type === "memory") {
    const available = st.cards.flatMap((_, i) => st.matched[i] || st.open.includes(i) ? [] : [i]);
    const memory = st.bot.memory || {}, useMemory = hard || random() < (medium ? 0.85 : 0.5);
    if (useMemory && st.open.length) {
      const known = available.filter((i) => memory[i] === memory[st.open[0]]);
      if (known.length) return { i: pick(known) };
    }
    if (useMemory && !st.open.length) {
      const known = available.filter((i) => Object.hasOwn(memory, i) && available.some((j) => j !== i && memory[j] === memory[i]));
      if (known.length) return { i: pick(known) };
    }
    return { i: pick(available) };
  }
  if (type === "domino") {
    const player = players[turn], playable = dominoPlayable(st, player);
    if (playable.length) {
      const sorted = [...playable].sort((a, b) => dominoPips(b.tile) - dominoPips(a.tile));
      const chosen = hard || medium ? sorted[0] : pick(playable);
      return { action: "play", tileId: chosen.tile.id, side: chosen.side };
    }
    if (st.boneyard?.length && st.mode !== "block" && (!st.trains || !st.drawn)) return { action: "draw" };
    return { action: "pass" };
  }
  if (type === "chess") return chBotMove(st, turn, hard ? "hard" : medium ? "medium" : "easy", random);
  if (type === "spades") {
    const hand = st.hands[players[turn]];
    if (st.phase === "bidding") {
      let est = 0;
      for (const c of hand) {
        if (c.suit === "\u2660") {
          if (["A", "K", "Q"].includes(c.rank)) est += 1;
          else if (c.rank === "J" || c.rank === "10") est += 0.5;
        } else if (c.rank === "A") est += 1;
        else if (c.rank === "K") est += 0.5;
      }
      return { action: "bid", amount: Math.max(1, Math.min(13, Math.round(est))) };
    }
    const leadSuit = st.currentTrick.length ? st.currentTrick[0].card.suit : null;
    let legal;
    if (leadSuit) legal = hand.filter((c) => c.suit === leadSuit);
    else legal = hand.filter((c) => c.suit !== "\u2660" || st.spadesBroken || hand.every((cc) => cc.suit === "\u2660"));
    if (!legal.length) legal = [...hand];
    legal.sort((a, b) => spRankVal(a.rank) - spRankVal(b.rank));
    return { action: "play", cardId: legal[0].id };
  }
  if (type === "checkers") {
    const own = turn === 0 ? "r" : "b", jumps = [], steps = [];
    st.board.forEach((p, i) => {
      if (p && chkOwner(p) === own && (st.mustContinue === null || st.mustContinue === i)) {
        for (const m of chkJumps(st.board, i)) jumps.push({ from: i, to: m.to });
        if (st.mustContinue === null) for (const m of chkSteps(st.board, i)) steps.push({ from: i, to: m.to });
      }
    });
    const legal = jumps.length ? jumps : steps;
    if (hard) return hardCheckers(st, players, turn, legal);
    return pick(legal);
  }
  if (type === "mahjong") {
    if(st.mode==="family")return mjFamilyBot(st,players,turn);
    const free = st.tiles.filter((t) => mahjongFree(st.tiles, t)), pairs = [];
    free.forEach((a, i) => free.slice(i + 1).forEach((b) => {
      if (a.face === b.face) pairs.push([a.id, b.id]);
    }));
    if ((hard || medium) && pairs.length) {
      const scored = pairs.map((ids) => {
        const tiles = st.tiles.map((t) => ids.includes(t.id) ? { ...t, removed: true } : t);
        return { ids, score: tiles.filter((t) => mahjongFree(tiles, t)).length };
      }).sort((a, b) => b.score - a.score);
      if (hard || random() < 0.7) return { action: "match", ids: scored[0].ids, revision: st.revision };
    }
    return pairs.length ? { action: "match", ids: pick(pairs), revision: st.revision } : { action: "shuffle", revision: st.revision };
  }
  if (type === "words") {
    const rack = st.racks[BOT_ID], board = st.board, empty = !board.some(Boolean), known = new Set(BOT_WORDS), candidates = [];
    const words = shuffle(BOT_WORDS.filter((w) => w.length <= (hard ? 7 : medium ? 6 : 4)), random);
    wordSearch: for (const word of words) for (const dir322222 of [1, 15]) for (let start = 0; start < 225; start++) {
      const end = start + (word.length - 1) * dir322222;
      if (end >= 225 || dir322222 === 1 && start % 15 + word.length > 15) continue;
      if (start - dir322222 >= 0 && (dir322222 === 15 || start % 15 > 0) && board[start - dir322222]) continue;
      if (end + dir322222 < 225 && (dir322222 === 15 || end % 15 < 14) && board[end + dir322222]) continue;
      const remaining = [...rack], placements = [];
      let okay = true, connected222222 = empty && start <= 112 && end >= 112 && (dir322222 === 15 ? start % 15 === 7 : Math.floor(start / 15) === 7);
      for (let k = 0; k < word.length; k++) {
        const i = start + k * dir322222, l = word[k];
        if (board[i]) {
          if (board[i].l !== l) {
            okay = false;
            break;
          }
          connected222222 = true;
          continue;
        }
        let ri = remaining.indexOf(l), blank = false;
        if (ri < 0) {
          ri = remaining.indexOf("?");
          blank = true;
        }
        if (ri < 0) {
          okay = false;
          break;
        }
        remaining.splice(ri, 1);
        placements.push({ i, l, blank });
        if ([i - 15, i + 15, ...i % 15 > 0 ? [i - 1] : [], ...i % 15 < 14 ? [i + 1] : []].some((j) => board[j])) connected222222 = true;
      }
      if (!okay || !connected222222 || !placements.length) continue;
      const test = [...board];
      for (const p of placements) test[p.i] = { l: p.l, v: 0 };
      for (const p of placements) {
        const cross = collect(test, p.i, dir322222 === 1 ? 15 : 1);
        if (cross.length > 1 && !known.has(cross.map((i) => test[i].l).join(""))) {
          okay = false;
          break;
        }
      }
      if (okay) candidates.push({ action: "play", placements });
      if (candidates.length >= (hard ? 160 : 60)) break wordSearch;
    }
    let best = null, bestScore = -1;
    for (const move of shuffle(candidates, random).slice(0, hard ? 80 : 8)) {
      try {
        const trial = structuredClone(st);
        if (hard) {
          trial.surprises = {};
          trial.starFound = true;
        }
        await wordsMove(trial, players, turn, move, db);
        if (!hard) return move;
        const score = trial.history.at(-1).score;
        if (score > bestScore) {
          bestScore = score;
          best = move;
        }
      } catch (e) {
        if (!/dictionary|tile|word|connect|line|center|gap/i.test(e.message)) throw e;
      }
    }
    return best || { action: "pass" };
  }
  if (type === "ohana10") {
    const p = players[turn], hand = st.hands[p];
    if (!st.hasDrawn) return { action: "draw", from: hard && o10CanTakePile(hand, st.discard) && random() < 0.45 ? "discard" : "deck" };
    if (!st.completed[p]) {
      const groups = o10FindJourney(hand, O10_JOURNEYS[st.journeys[p]]);
      if (groups) return { action: "journey", cardIds: groups.flatMap((g) => g.cards.map((c) => c.id)) };
    }
    if (st.completed[p]) for (let i = 0; i < hand.length; i++) for (let j = i + 1; j < hand.length; j++) {
      const m = { action: "hit", cardIds: [hand[i].id, hand[j].id] };
      try {
        o10AddCards(structuredClone(st), players, p, m);
        return m;
      } catch {
      }
    }
    if (st.completed[p]) {
      for (const c of hand) for (const owner of players) for (let m = 0; m < (st.melds[owner] || []).length; m++) if (o10CanHit(c, st.melds[owner][m])) return { action: "hit", cardId: c.id, owner, meld: m };
    }
    if (st.completed[p]) {
      const groups = o10FindJourney(hand, O10_JOURNEYS[st.journeys[p]]);
      if (groups) return { action: "hit", cardIds: groups.flatMap((g) => g.cards.map((c) => c.id)) };
    }
    const card = o10BotDiscard(hand, O10_JOURNEYS[st.journeys[p]]);
    return { action: "discard", cardId: card.id };
  }
  if (type === "handfoot") {
    const p = players[turn], hand = st.inFoot[p] ? st.feet[p] : st.hands[p];
    if (!st.hasDrawn) return { action: "draw" };
    const groups = {}, wilds = hand.filter(hfIsWild), options = [];
    for (const c of hand) if (!hfIsWild(c) && c.rank !== "3") (groups[c.rank] ||= []).push(c);
    for (const [rank, cards] of Object.entries(groups)) {
      for (let n = 1; n <= cards.length; n++) for (let w = 0; w <= Math.min(3, wilds.length); w++) {
        const m = { action: "meld", rank, cardIds: [...cards.slice(0, n), ...wilds.slice(0, w)].map((c) => c.id) };
        try {
          hfMove(structuredClone(st), players, turn, m);
          options.push(m);
        } catch {
        }
      }
    }
    const batch = { action: "melds", melds: Object.entries(groups).filter(([rank, cards]) => cards.length >= 3).map(([rank, cards]) => ({ rank, cardIds: cards.map((c) => c.id) })) };
    if (batch.melds.length > 1) try {
      hfMove(structuredClone(st), players, turn, batch);
      options.push({ ...batch, cardIds: batch.melds.flatMap((m) => m.cardIds) });
    } catch {
    }
    if (options.length && (hard || medium || random() < 0.65)) {
      if (hard) options.sort((a, b) => b.cardIds.length - a.cardIds.length);
      return hard ? options[0] : pick(options);
    }
    const discards = [...hand].sort((a, b) => hfIsBlack3(b) - hfIsBlack3(a) || hfCardVal(a) - hfCardVal(b));
    for (const c of discards) {
      const m = { action: "discard", cardId: c.id };
      try {
        hfMove(structuredClone(st), players, turn, m);
        return m;
      } catch {
      }
    }
    return options[0] || null;
  }
  throw new Error("No computer player for this game.");
}
__name(chooseBotMove, "chooseBotMove");
__name2(chooseBotMove, "chooseBotMove");
__name22(chooseBotMove, "chooseBotMove");
__name222(chooseBotMove, "chooseBotMove");
__name2222(chooseBotMove, "chooseBotMove");
__name22222(chooseBotMove, "chooseBotMove");
const MEMORY_BOT_RUNS=new Map();
async function advanceBot(env222222,id){
 const first=await env222222.DB.prepare("SELECT * FROM games WHERE id=?").bind(id).first();
 if(first?.type!=="memory")return advanceBotSteps(env222222,id);
 if(MEMORY_BOT_RUNS.has(id))return MEMORY_BOT_RUNS.get(id);
 const run=advanceBotSteps(env222222,id);MEMORY_BOT_RUNS.set(id,run);
 try{return await run;}finally{if(MEMORY_BOT_RUNS.get(id)===run)MEMORY_BOT_RUNS.delete(id);}
}
async function advanceBotSteps(env222222, id) {
  const db = env222222.DB;
  for (let step = 0; step < 50; step++) {
    const g = await db.prepare("SELECT * FROM games WHERE id=?").bind(id).first();
    if (!g || g.status !== "playing") return;
    const players = JSON.parse(g.players);
    if (!gameBotPlayer(g.type,players[g.turn])) return;
    if(g.type==='spades'&&(players.length!==4||new Set(players).size!==4))return; // Do not mutate an old malformed table.
    const st = JSON.parse(g.state);
    if (!st.bot || (g.type === "mahjong" && st.mode === "family" && st.pending)) return;
    if(g.type==="memory"&&Number(st.revealUntil)>Date.now()){await new Promise(resolve=>setTimeout(resolve,Math.min(2000,st.revealUntil-Date.now())));continue;}
    const move = await chooseBotMove(g.type, g.type==='spades'?spView(st,players[g.turn]):st, players, g.turn, db);
    if (!move) throw new Error("Computer player has no legal move.");
    let res = await applyMove(g.type, st, players, g.turn, move, db);
    let actions = 1;
    // Finish the computer's draw/meld/hit/discard turn in memory, then
    // publish one coherent update instead of a database round trip per action.
    if (g.type === "domino" || g.type === "ohana10" || g.type === "shuffle") {
      while (!res.over && players[res.next] === BOT_ID && actions < 138) {
        const nextMove = await chooseBotMove(g.type, st, players, res.next, db);
        if (!nextMove) throw new Error("Computer player has no legal move.");
        res = await applyMove(g.type, st, players, res.next, nextMove, db);
        actions++;
      }
    }
    rememberBotCards(st);
    st.lastPlay = { ...(g.type === "domino" ? st.lastPlay : {}), p: players[g.turn], at: now() };
    st.bot.moves = (st.bot.moves || 0) + actions;
    const saved = await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=? AND state=? AND turn=? AND status='playing'").bind(JSON.stringify(st), res.next, res.over ? "finished" : "playing", res.over ? String(res.winner) : null, now(), id, g.state, g.turn).run();
    if (!saved.meta.changes) continue;
    if (res.over || !gameBotPlayer(g.type,players[res.next])) return;
  }
}
__name(advanceBot, "advanceBot");
__name2(advanceBot, "advanceBot");
__name22(advanceBot, "advanceBot");
__name222(advanceBot, "advanceBot");
__name2222(advanceBot, "advanceBot");
__name22222(advanceBot, "advanceBot");
var O10_JOURNEYS = [
  { name: "Beach Buddies", note: "Three different pairs of matching numbers", parts: [["pairs", 6]] },
  { name: "Family Rainbow", note: "The same number in all four island colors", parts: [["familyRainbow", 4]] },
  { name: "Lei & Luau", note: "A same-color trail of 4 and a family of 3", parts: [["colorRun", 4], ["set", 3]] },
  { name: "Island Mosaic", note: "Two cards from each of the four island colors", parts: [["mosaic", 8]] },
  { name: "Double Canoe", note: "Four consecutive numbers, with a pair of each", parts: [["doubleRun", 8]] },
  { name: "Shell Stepping Stones", note: "The six even numbers: 2, 4, 6, 8, 10 and 12", parts: [["evenPath", 6]] },
  { name: "Cousin Caravan", note: "Three different families of 3 matching numbers", parts: [["setsOfThree", 9]] },
  { name: "Rainbow Trail", note: "A trail of 6 using at least three island colors", parts: [["rainbowRun", 6]] },
  { name: "Sunset Picnic", note: "A family of 4 and four cards of one color", parts: [["set", 4], ["color", 4]] },
  { name: "Homecoming", note: "A same-color trail of 5 and a family of 5", parts: [["colorRun", 5], ["set", 5]] }
];
var O10_COLORS = ["coral", "ocean", "sun", "leaf"];
function o10Wild(c) {
  return c.wild === true;
}
__name(o10Wild, "o10Wild");
__name2(o10Wild, "o10Wild");
__name22(o10Wild, "o10Wild");
__name222(o10Wild, "o10Wild");
__name2222(o10Wild, "o10Wild");
__name22222(o10Wild, "o10Wild");
function o10CardScore(c) {
  return o10Wild(c) ? 25 : c.n >= 10 ? 10 : 5;
}
__name(o10CardScore, "o10CardScore");
__name2(o10CardScore, "o10CardScore");
__name22(o10CardScore, "o10CardScore");
__name222(o10CardScore, "o10CardScore");
__name2222(o10CardScore, "o10CardScore");
__name22222(o10CardScore, "o10CardScore");
function o10Deck(random) {
  let id = 1, d = [];
  for (let copy = 0; copy < 2; copy++) for (const color of O10_COLORS) for (let n = 1; n <= 12; n++) d.push({ id: id++, n, color });
  for (let i = 0; i < 8; i++) d.push({ id: id++, wild: true, n: 0, color: "star" });
  return shuffle(d, random);
}
__name(o10Deck, "o10Deck");
__name2(o10Deck, "o10Deck");
__name22(o10Deck, "o10Deck");
__name222(o10Deck, "o10Deck");
__name2222(o10Deck, "o10Deck");
__name22222(o10Deck, "o10Deck");
function o10Effective(c) {
  return c.wild && c.wildAs ? { ...c, n: c.wildAs.n, color: c.wildAs.color, wild: false } : c;
}
__name(o10Effective, "o10Effective");
__name2(o10Effective, "o10Effective");
__name22(o10Effective, "o10Effective");
__name222(o10Effective, "o10Effective");
__name2222(o10Effective, "o10Effective");
function o10AssignCards(cards, assignments = {}) {
  return cards.map((c) => {
    if (!c) return c;
    const a = assignments[c.id];
    if (!a) return { ...c };
    if (!c.wild || !Number.isInteger(a.n) || a.n < 1 || a.n > 12 || !O10_COLORS.includes(a.color)) throw Error("Choose a valid number and color for each wild.");
    return { ...c, wildAs: { n: a.n, color: a.color } };
  });
}
__name(o10AssignCards, "o10AssignCards");
__name2(o10AssignCards, "o10AssignCards");
__name22(o10AssignCards, "o10AssignCards");
__name222(o10AssignCards, "o10AssignCards");
__name2222(o10AssignCards, "o10AssignCards");
function o10PartValid(cards, part) {
  const [kind, len] = part;
  if (cards.length !== len) return false;
  if (!cards.some((c) => !o10Wild(c))) return false;
  const naturals = cards.map(o10Effective).filter((c) => !o10Wild(c));
  if (!naturals.length) return false;
  if (kind === "set") return new Set(naturals.map((c) => c.n)).size === 1;
  if (kind === "color") return new Set(naturals.map((c) => c.color)).size === 1;
  if (kind === "pairs") {
    const counts = {};
    for (const c of naturals) counts[c.n] = (counts[c.n] || 0) + 1;
    const singles = Object.values(counts).filter((n) => n === 1).length, over = Object.values(counts).some((n) => n > 2);
    return !over && Object.keys(counts).length === 3 && singles === cards.length - naturals.length;
  }
  if (kind === "familyRainbow") {
    return new Set(naturals.map((c) => c.n)).size === 1 && new Set(naturals.map((c) => c.color)).size === naturals.length;
  }
  if (kind === "mosaic") {
    const counts = Object.fromEntries(O10_COLORS.map((c) => [c, 0]));
    for (const c of naturals) {
      if (++counts[c.color] > 2) return false;
    }
    return Object.values(counts).reduce((n, v) => n + 2 - v, 0) === cards.length - naturals.length;
  }
  if (kind === "doubleRun") {
    const counts = {};
    for (const c of naturals) {
      counts[c.n] = (counts[c.n] || 0) + 1;
      if (counts[c.n] > 2) return false;
    }
    for (let start = 1; start <= 9; start++) {
      let missing = 0, okay = true;
      for (const [n, count322222] of Object.entries(counts)) {
        if (+n < start || +n > start + 3) {
          okay = false;
          break;
        }
        missing += 2 - count322222;
      }
      if (okay) {
        for (let n = start; n < start + 4; n++) if (!counts[n]) missing += 2;
        if (missing === cards.length - naturals.length) return true;
      }
    }
    return false;
  }
  if (kind === "evenPath") {
    const target = /* @__PURE__ */ new Set([2, 4, 6, 8, 10, 12]);
    return naturals.every((c) => target.has(c.n)) && new Set(naturals.map((c) => c.n)).size === naturals.length;
  }
  if (kind === "setsOfThree") {
    const counts = {};
    for (const c of naturals) {
      counts[c.n] = (counts[c.n] || 0) + 1;
      if (counts[c.n] > 3) return false;
    }
    return Object.keys(counts).length === 3 && Object.values(counts).reduce((n, v) => n + 3 - v, 0) === cards.length - naturals.length;
  }
  const sameColor = kind === "colorRun";
  if (sameColor && new Set(naturals.map((c) => c.color)).size !== 1) return false;
  const nums = [...new Set(naturals.map((c) => c.n))].sort((a, b) => a - b);
  if (nums.length !== naturals.length) return false;
  for (let start = 1; start <= 13 - len; start++) if (nums.every((n) => n >= start && n < start + len) && len - nums.length === cards.length - naturals.length) {
    if (kind === "rainbowRun" && new Set(naturals.map((c) => c.color)).size < Math.min(3, naturals.length)) continue;
    return true;
  }
  return false;
}
__name(o10PartValid, "o10PartValid");
__name2(o10PartValid, "o10PartValid");
__name22(o10PartValid, "o10PartValid");
__name222(o10PartValid, "o10PartValid");
__name2222(o10PartValid, "o10PartValid");
__name22222(o10PartValid, "o10PartValid");
function o10Partition(cards, parts, allowExtras = false) {
  const used = /* @__PURE__ */ new Set(), out = [];
  function combinations(avail, k, start = 0, pick = [], all = []) {
    if (pick.length === k) {
      all.push(pick);
      return all;
    }
    for (let i = start; i < avail.length; i++) combinations(avail, k, i + 1, [...pick, avail[i]], all);
    return all;
  }
  __name(combinations, "combinations");
  __name2(combinations, "combinations");
  __name22(combinations, "combinations");
  __name222(combinations, "combinations");
  __name2222(combinations, "combinations");
  __name22222(combinations, "combinations");
  function search(pi) {
    if (pi === parts.length) return used.size === cards.length || allowExtras && o10ExtendGroups(cards.filter((c) => !used.has(c.id)), out);
    const available = cards.filter((c) => !used.has(c.id));
    for (const group322222 of combinations(available, parts[pi][1])) if (o10PartValid(group322222, parts[pi])) {
      group322222.forEach((c) => used.add(c.id));
      out.push({ kind: parts[pi][0], cards: group322222 });
      if (search(pi + 1)) return true;
      out.pop();
      group322222.forEach((c) => used.delete(c.id));
    }
    return false;
  }
  __name(search, "search");
  __name2(search, "search");
  __name22(search, "search");
  __name222(search, "search");
  __name2222(search, "search");
  __name22222(search, "search");
  return search(0) ? out : null;
}
__name(o10Partition, "o10Partition");
__name2(o10Partition, "o10Partition");
__name22(o10Partition, "o10Partition");
__name222(o10Partition, "o10Partition");
__name2222(o10Partition, "o10Partition");
__name22222(o10Partition, "o10Partition");
function o10ExtendGroups(cards, groups) {
  const failed = /* @__PURE__ */ new Set();
  function place(left) {
    if (!left.length) return true;
    const key = JSON.stringify([left.map((c) => c.id).sort(), groups.map((g) => g.cards.map((c) => c.id).sort())]);
    if (failed.has(key)) return false;
    for (let i = 0; i < left.length; i++) {
      const card = left[i], rest = left.filter((_, j) => j !== i);
      for (const group322222 of groups) {
        if (o10CanHit(card, group322222)) {
          group322222.cards.push(card);
          if (place(rest)) return true;
          group322222.cards.pop();
        }
        if (group322222.kind === "pairs") {
          for (let j = 0; j < rest.length; j++) if ((o10Wild(o10Effective(card)) || o10Wild(o10Effective(rest[j])) || o10Effective(card).n === o10Effective(rest[j]).n) && !(card.wild && rest[j].wild)) {
            group322222.cards.push(card, rest[j]);
            if (place(rest.filter((_, k) => k !== j))) return true;
            group322222.cards.splice(-2);
          }
        }
      }
    }
    failed.add(key);
    return false;
  }
  __name(place, "place");
  __name2(place, "place");
  __name22(place, "place");
  __name222(place, "place");
  __name2222(place, "place");
  __name22222(place, "place");
  return place([...cards].sort((a, b) => Number(!!a.wild) - Number(!!b.wild)));
}
__name(o10ExtendGroups, "o10ExtendGroups");
__name2(o10ExtendGroups, "o10ExtendGroups");
__name22(o10ExtendGroups, "o10ExtendGroups");
__name222(o10ExtendGroups, "o10ExtendGroups");
__name2222(o10ExtendGroups, "o10ExtendGroups");
__name22222(o10ExtendGroups, "o10ExtendGroups");
function o10FindJourney(hand, journey, maxChecks = Infinity) {
  let checks = 0;
  const limit = {};
  const need = journey.parts.reduce((n, p) => n + p[1], 0);
  if (hand.length < need) return null;
  const used = /* @__PURE__ */ new Set(), out = [];
  function* combinations(items, k, start = 0, pick = []) {
    if (pick.length === k) {
      yield pick;
      return;
    }
    for (let i = start; i <= items.length - (k - pick.length); i++) yield* combinations(items, k, i + 1, [...pick, items[i]]);
  }
  __name(combinations, "combinations");
  __name2(combinations, "combinations");
  __name22(combinations, "combinations");
  __name222(combinations, "combinations");
  __name2222(combinations, "combinations");
  __name22222(combinations, "combinations");
  function search(pi) {
    if (pi === journey.parts.length) return true;
    const part = journey.parts[pi], available = hand.filter((c) => !used.has(c.id));
    for (const group322222 of combinations(available, part[1])) {
      if (++checks > maxChecks) throw limit;
      if (o10PartValid(group322222, part)) {
        group322222.forEach((c) => used.add(c.id));
        out.push({ kind: part[0], cards: group322222 });
        if (search(pi + 1)) return true;
        out.pop();
        group322222.forEach((c) => used.delete(c.id));
      }
    }
    return false;
  }
  __name(search, "search");
  __name2(search, "search");
  __name22(search, "search");
  __name222(search, "search");
  __name2222(search, "search");
  __name22222(search, "search");
  try {
    return search(0) ? out : null;
  } catch (e) {
    if (e === limit) return void 0;
    throw e;
  }
}
__name(o10FindJourney, "o10FindJourney");
__name2(o10FindJourney, "o10FindJourney");
__name22(o10FindJourney, "o10FindJourney");
__name222(o10FindJourney, "o10FindJourney");
__name2222(o10FindJourney, "o10FindJourney");
__name22222(o10FindJourney, "o10FindJourney");
function o10Init(players, seed) {
  const random = rng(seed), deck = o10Deck(random), hands = {}, journeys = {}, penalties = {}, completed = {};
  for (const p of players) {
    hands[p] = deck.splice(0, 10);
    journeys[p] = 0;
    penalties[p] = 0;
    completed[p] = false;
  }
  return { hands, deck, discard: [deck.shift()], journeys, penalties, completed, melds: Object.fromEntries(players.map((p) => [p, []])), hasDrawn: false, voyage: 1, history: [], chat: [], winner: null };
}
__name(o10Init, "o10Init");
__name2(o10Init, "o10Init");
__name22(o10Init, "o10Init");
__name222(o10Init, "o10Init");
__name2222(o10Init, "o10Init");
__name22222(o10Init, "o10Init");
function o10NewVoyage(st, players, seed) {
  const fresh = o10Init(players, seed);
  st.hands = fresh.hands;
  st.deck = fresh.deck;
  st.discard = fresh.discard;
  st.melds = fresh.melds;
  st.completed = Object.fromEntries(players.map((p) => [p, false]));
  st.hasDrawn = false;
  st.idleTurns = 0;
  st.turnMadeProgress = false;
  st.voyage++;
}
__name(o10NewVoyage, "o10NewVoyage");
__name2(o10NewVoyage, "o10NewVoyage");
__name22(o10NewVoyage, "o10NewVoyage");
__name222(o10NewVoyage, "o10NewVoyage");
__name2222(o10NewVoyage, "o10NewVoyage");
__name22222(o10NewVoyage, "o10NewVoyage");
function o10CanHit(card, meld) {
  const trial = [...meld.cards, card], naturals = meld.cards.map(o10Effective).filter((c) => !o10Wild(c));
  card = o10Effective(card);
  if (["run", "colorRun", "rainbowRun"].includes(meld.kind)) return o10PartValid(trial, [meld.kind, trial.length]);
  if (o10Wild(card)) return true;
  if (["set", "familyRainbow"].includes(meld.kind)) return naturals.some((c) => c.n === card.n);
  if (meld.kind === "color") return naturals.some((c) => c.color === card.color);
  if (meld.kind === "mosaic") return O10_COLORS.includes(card.color);
  if (["pairs", "setsOfThree"].includes(meld.kind)) return naturals.some((c) => c.n === card.n);
  if (meld.kind === "doubleRun") {
    const nums = naturals.map((c) => c.n);
    return card.n >= Math.min(...nums) && card.n <= Math.max(...nums);
  }
  if (meld.kind === "evenPath") return card.n % 2 === 0;
  return o10PartValid(trial, [meld.kind, trial.length]);
}
__name(o10CanHit, "o10CanHit");
__name2(o10CanHit, "o10CanHit");
__name22(o10CanHit, "o10CanHit");
__name222(o10CanHit, "o10CanHit");
__name2222(o10CanHit, "o10CanHit");
__name22222(o10CanHit, "o10CanHit");
function o10AddCards(st, players, p, move) {
  if (!st.completed[p]) throw Error("Complete your own journey before adding cards.");
  const ids = move.cardIds || [move.cardId];
  if (!ids.length || new Set(ids).size !== ids.length) throw Error("Select the cards you want to add.");
  const cards = o10AssignCards(ids.map((id) => st.hands[p].find((c) => c.id === id)), move.wildAssignments);
  // Keep physical card ownership separate from the logical group it extends.
  // Only the trusted acting seat supplies this metadata, never the request.
  cards.forEach((card) => { if (card) card.playedBy = p; });
  if (cards.some((c) => !c)) throw Error("One of those cards is no longer in your hand.");
  const tables = structuredClone(st.melds), targets = [], allTargets = [];
  for (const owner of players) for (let i = 0; i < (tables[owner] || []).length; i++) {
    const group322222 = tables[owner][i];
    allTargets.push(group322222);
    if (move.owner === void 0 || String(owner) === String(move.owner) && i === Number(move.meld)) targets.push(group322222);
  }
  const failed = /* @__PURE__ */ new Set();
  function place(left) {
    if (!left.length) return true;
    const key = JSON.stringify([left.map((c) => c.id).sort(), targets.map((g) => g.cards.map((c) => c.id).sort())]);
    if (failed.has(key)) return false;
    for (let ci = 0; ci < left.length; ci++) {
      const card = left[ci], rest = left.filter((_, i) => i !== ci);
      for (const group322222 of targets) {
        if (o10CanHit(card, group322222)) {
          group322222.cards.push(card);
          if (place(rest)) return true;
          group322222.cards.pop();
        }
        if (group322222.kind === "pairs") {
          for (let j = 0; j < rest.length; j++) if ((o10Wild(o10Effective(card)) || o10Wild(o10Effective(rest[j])) || o10Effective(card).n === o10Effective(rest[j]).n) && !(card.wild && rest[j].wild)) {
            group322222.cards.push(card, rest[j]);
            if (place(rest.filter((_, i) => i !== j))) return true;
            group322222.cards.splice(-2);
          }
        }
      }
    }
    failed.add(key);
    return false;
  }
  __name(place, "place");
  __name2(place, "place");
  __name22(place, "place");
  __name222(place, "place");
  __name2222(place, "place");
  __name22222(place, "place");
  let placed = place(cards);
  if (!placed && move.owner !== void 0) {
    targets.splice(0, targets.length, ...allTargets);
    failed.clear();
    placed = place(cards);
  }
  let bonus = 0;
  if (!placed) {
    const journey = O10_JOURNEYS[st.journeys[p]];
    const groups = journey && o10Partition(cards, journey.parts, true);
    if (groups) {
      tables[p].push(...groups);
      placed = true;
      bonus = 10;
    }
  }
  if (!placed) throw Error("Cannot meld the selected cards: " + cards.map((c) => c.wild ? "Wild" : c.n + " " + c.color).join(", ") + ". Select cards that fit a played group, or a complete extra meld matching your current journey.");
  st.melds = tables;
  st.hands[p] = st.hands[p].filter((c) => !ids.includes(c.id));
  if (bonus) {
    st.penalties[p] -= bonus;
    st.extraMelds ??= {};
    st.extraMelds[p] = (st.extraMelds[p] || 0) + 1;
    st.history.push({ p, note: "Extra meld: 10-shell bonus", bonus: 10 });
  }
}
__name(o10AddCards, "o10AddCards");
__name2(o10AddCards, "o10AddCards");
__name22(o10AddCards, "o10AddCards");
__name222(o10AddCards, "o10AddCards");
__name2222(o10AddCards, "o10AddCards");
__name22222(o10AddCards, "o10AddCards");
function o10FinishVoyage(st, players, turn, reason = "went-out") {
  const p = players[turn];
  const advanced = players.filter((q) => st.completed[q]), remaining = Object.fromEntries(players.map((q) => [q, st.hands[q].reduce((n, c) => n + o10CardScore(c), 0)]));
  const eligible = advanced.length ? advanced : players, min = Math.min(...eligible.map((q) => remaining[q]));
  st.lastRound = { voyage: st.voyage, reason, advanced, winners: reason === "went-out" ? [p] : eligible.filter((q) => remaining[q] === min), remaining };
  st.hasDrawn = false;
  for (const q of players) {
    st.penalties[q] += st.hands[q].reduce((v, c) => v + o10CardScore(c), 0);
    if (st.completed[q]) st.journeys[q]++;
  }
  st.history.push({ p, note: (reason === "stalled" ? "Stalled round settled: no playable melds or additions. " : "") + "Finished voyage " + st.voyage, round: st.lastRound });
  const winners = players.filter((q) => st.journeys[q] >= 10);
  if (winners.length) {
    winners.sort((a, b) => st.penalties[a] - st.penalties[b]);
    st.winner = winners[0];
    return { over: true, winner: st.winner, next: turn };
  }
  o10NewVoyage(st, players, Date.now() + st.voyage * 7919);
  return { over: false, next: (turn + 1) % players.length };
}
__name(o10FinishVoyage, "o10FinishVoyage");
__name2(o10FinishVoyage, "o10FinishVoyage");
__name22(o10FinishVoyage, "o10FinishVoyage");
__name222(o10FinishVoyage, "o10FinishVoyage");
__name2222(o10FinishVoyage, "o10FinishVoyage");
__name22222(o10FinishVoyage, "o10FinishVoyage");
function o10HasTablePlay(st, players, p) {
  const hand = st.hands[p];
  if (!st.completed[p]) return o10FindJourney(hand, O10_JOURNEYS[st.journeys[p]], 25e3) !== null;
  for (const q of players) for (const group322222 of st.melds[q] || []) {
    if (hand.some((c) => o10CanHit(c, group322222))) return true;
    if (group322222.kind === "pairs") {
      for (let i = 0; i < hand.length; i++) for (let j = i + 1; j < hand.length; j++) if ((hand[i].wild || hand[j].wild || hand[i].n === hand[j].n) && !(hand[i].wild && hand[j].wild)) return true;
    }
  }
  return o10FindJourney(hand, O10_JOURNEYS[st.journeys[p]], 25e3) !== null;
}
__name(o10HasTablePlay, "o10HasTablePlay");
__name2(o10HasTablePlay, "o10HasTablePlay");
__name22(o10HasTablePlay, "o10HasTablePlay");
__name222(o10HasTablePlay, "o10HasTablePlay");
__name2222(o10HasTablePlay, "o10HasTablePlay");
__name22222(o10HasTablePlay, "o10HasTablePlay");
function o10Stalled(st, players) {
  return !st.deck.length && (st.idleTurns || 0) >= players.length && !players.some((p) => {
    if (o10HasTablePlay(st, players, p)) return true;
    if (o10CanTakePile(st.hands[p], st.discard)) return o10HasTablePlay({ ...st, hands: { ...st.hands, [p]: [...st.hands[p], ...st.discard] } }, players, p);
    return false;
  });
}
__name(o10Stalled, "o10Stalled");
__name2(o10Stalled, "o10Stalled");
__name22(o10Stalled, "o10Stalled");
__name222(o10Stalled, "o10Stalled");
__name2222(o10Stalled, "o10Stalled");
__name22222(o10Stalled, "o10Stalled");
function o10BotDiscard(hand, journey) {
  const parts = journey.parts.map((p) => p[0]), count322222 = /* @__PURE__ */ __name22222((n) => hand.filter((c) => !c.wild && c.n === n).length, "count");
  const value = /* @__PURE__ */ __name22222((c) => {
    if (c.wild) return 1e3;
    let score = 0;
    for (const kind of parts) {
      if (["set", "pairs", "setsOfThree", "familyRainbow", "doubleRun"].includes(kind)) score += count322222(c.n) * 5;
      if (kind === "familyRainbow") score += new Set(hand.filter((x) => x.n === c.n).map((x) => x.color)).size * 3;
      if (["colorRun", "run", "rainbowRun", "doubleRun"].includes(kind)) score += hand.filter((x) => !x.wild && x.id !== c.id && Math.abs(x.n - c.n) > 0 && Math.abs(x.n - c.n) <= 3 && (kind !== "colorRun" || x.color === c.color)).reduce((n, x) => n + 4 - Math.abs(x.n - c.n), 0) * 3;
      if (kind === "color") score += hand.filter((x) => x.color === c.color).length * 4;
      if (kind === "mosaic") score += hand.filter((x) => x.color === c.color).length <= 2 ? 12 : 2;
      if (kind === "evenPath") score += c.n % 2 === 0 ? 20 / count322222(c.n) : 0;
    }
    return score;
  }, "value");
  return [...hand].sort((a, b) => value(a) - value(b) || o10CardScore(b) - o10CardScore(a))[0];
}
__name(o10BotDiscard, "o10BotDiscard");
__name2(o10BotDiscard, "o10BotDiscard");
__name22(o10BotDiscard, "o10BotDiscard");
__name222(o10BotDiscard, "o10BotDiscard");
__name2222(o10BotDiscard, "o10BotDiscard");
__name22222(o10BotDiscard, "o10BotDiscard");
function o10CanTakePile(hand, discard) {
  const top = discard.at(-1);
  return !!top && !top.wild && hand.filter((c) => !c.wild && c.n === top.n).length >= 2;
}
__name(o10CanTakePile, "o10CanTakePile");
__name2(o10CanTakePile, "o10CanTakePile");
__name22(o10CanTakePile, "o10CanTakePile");
__name222(o10CanTakePile, "o10CanTakePile");
__name2222(o10CanTakePile, "o10CanTakePile");
__name22222(o10CanTakePile, "o10CanTakePile");
function o10Move(st, players, turn, move) {
  const p = players[turn], hand = st.hands[p];
  if (!hand) throw Error("Your hand is not available.");
  if (move.action === "draw") {
    if (st.hasDrawn) throw Error("You already drew. Build your journey or discard.");
    if (o10Stalled(st, players)) return o10FinishVoyage(st, players, turn, "stalled");
    if (move.from === "discard") {
      if (!st.discard.length) throw Error("The beach pile is empty.");
      if (!o10CanTakePile(hand, st.discard)) throw Error("You need two cards in your hand matching the top discard number to take the whole pile. Wild cards do not count.");
      const picked = st.discard.splice(0);
      hand.push(...picked);
      st.turnMadeProgress = false;
      st.hasDrawn = true;
      st.history.push({ p, note: "Picked up " + picked.length + " cards from the beach pile" });
      return { over: false, next: turn };
    } else {
      // One draw action takes up to two available cards, including across a recycle.
      const drawn = [];
      for (let i = 0; i < 2; i++) {
        if (!st.deck.length) {
          if (st.discard.length < 2) {
            if (!drawn.length && !players.some((q) => o10HasTablePlay(st, players, q))) return o10FinishVoyage(st, players, turn, "stalled");
            break;
          }
          const top = st.discard.pop();
          st.deck = shuffle(st.discard.splice(0), Math.random);
          st.discard = [top];
        }
        drawn.push(st.deck.shift());
      }
      hand.push(...drawn);
    }
    st.turnMadeProgress = false;
    st.hasDrawn = true;
    return { over: false, next: turn };
  }
  if (!st.hasDrawn) throw Error("Draw a card first.");
  if (move.action === "journey") {
    if (st.completed[p]) throw Error("Your journey is already on the table. Add cards to any journey.");
    const ids = [...new Set(move.cardIds || [])], cards = o10AssignCards(ids.map((id) => hand.find((c) => c.id === id)), move.wildAssignments);
    if (cards.some((c) => !c)) throw Error("One of those cards is no longer in your hand.");
    const journey = O10_JOURNEYS[st.journeys[p]];
    const groups = o10Partition(cards, journey.parts, true);
    if (!groups) throw Error("Those cards do not complete " + journey.name + ": " + journey.note + ".");
    for (const c of cards) hand.splice(hand.findIndex((x) => x.id === c.id), 1);
    st.melds[p] = groups;
    st.completed[p] = true;
    st.turnMadeProgress = true;
    st.idleTurns = 0;
    st.history.push({ p, note: "Completed " + journey.name });
    return hand.length ? { over: false, next: turn } : o10FinishVoyage(st, players, turn);
  }
  if (move.action === "hit") {
    o10AddCards(st, players, p, move);
    st.turnMadeProgress = true;
    st.idleTurns = 0;
    return st.hands[p].length ? { over: false, next: turn } : o10FinishVoyage(st, players, turn);
  }
  if (move.action === "discard") {
    const card = hand.find((c) => c.id === move.cardId);
    if (!card) throw Error("Choose one card from your hand to discard.");
    hand.splice(hand.indexOf(card), 1);
    st.discard.push(card);
    st.hasDrawn = false;
    st.idleTurns = st.turnMadeProgress ? 0 : (st.idleTurns || 0) + 1;
    st.turnMadeProgress = false;
    if (!hand.length) return o10FinishVoyage(st, players, turn);
    return { over: false, next: (turn + 1) % players.length };
  }
  throw Error("Choose Draw, Lay Journey, Add Card, or Discard.");
}
__name(o10Move, "o10Move");
__name2(o10Move, "o10Move");
__name22(o10Move, "o10Move");
__name222(o10Move, "o10Move");
__name2222(o10Move, "o10Move");
__name22222(o10Move, "o10Move");
function o10View(st, viewer) {
  return { ...st, hands: Object.fromEntries(Object.entries(st.hands).map(([p, h]) => [p, String(p) === String(viewer) ? h : h.length])), deck: st.deck.length, discard: st.discard.slice(-1), discardCount: st.discard.length };
}
__name(o10View, "o10View");
__name2(o10View, "o10View");
__name22(o10View, "o10View");
__name222(o10View, "o10View");
__name2222(o10View, "o10View");
__name22222(o10View, "o10View");
function hfCardVal(card) {
  if (card.rank === "Joker") return 50;
  if (card.rank === "2") return 20;
  if (card.rank === "3" && (card.suit === "\u2665" || card.suit === "\u2666")) return 100;
  if (card.rank === "3") return 0;
  if (card.rank === "A") return 20;
  if (["K", "Q", "J", "10", "9", "8"].includes(card.rank)) return 10;
  return 5;
}
__name(hfCardVal, "hfCardVal");
__name2(hfCardVal, "hfCardVal");
__name22(hfCardVal, "hfCardVal");
__name222(hfCardVal, "hfCardVal");
__name2222(hfCardVal, "hfCardVal");
__name22222(hfCardVal, "hfCardVal");
__name222222(hfCardVal, "hfCardVal");
function hfIsWild(card) {
  return card.rank === "Joker" || card.rank === "2";
}
__name(hfIsWild, "hfIsWild");
__name2(hfIsWild, "hfIsWild");
__name22(hfIsWild, "hfIsWild");
__name222(hfIsWild, "hfIsWild");
__name2222(hfIsWild, "hfIsWild");
__name22222(hfIsWild, "hfIsWild");
__name222222(hfIsWild, "hfIsWild");
function hfIsRed3(card) {
  return card.rank === "3" && (card.suit === "\u2665" || card.suit === "\u2666");
}
__name(hfIsRed3, "hfIsRed3");
__name2(hfIsRed3, "hfIsRed3");
__name22(hfIsRed3, "hfIsRed3");
__name222(hfIsRed3, "hfIsRed3");
__name2222(hfIsRed3, "hfIsRed3");
__name22222(hfIsRed3, "hfIsRed3");
__name222222(hfIsRed3, "hfIsRed3");
function hfIsBlack3(card) {
  return card.rank === "3" && (card.suit === "\u2663" || card.suit === "\u2660");
}
__name(hfIsBlack3, "hfIsBlack3");
__name2(hfIsBlack3, "hfIsBlack3");
__name22(hfIsBlack3, "hfIsBlack3");
__name222(hfIsBlack3, "hfIsBlack3");
__name2222(hfIsBlack3, "hfIsBlack3");
__name22222(hfIsBlack3, "hfIsBlack3");
__name222222(hfIsBlack3, "hfIsBlack3");
function hfMakeDeck(numDecks) {
  const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];
  for (let d = 0; d < numDecks; d++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ rank, suit, id: deck.length });
      }
    }
    deck.push({ rank: "Joker", suit: "\u{1F0CF}", id: deck.length });
    deck.push({ rank: "Joker", suit: "\u{1F0CF}", id: deck.length });
  }
  return deck;
}
__name(hfMakeDeck, "hfMakeDeck");
__name2(hfMakeDeck, "hfMakeDeck");
__name22(hfMakeDeck, "hfMakeDeck");
__name222(hfMakeDeck, "hfMakeDeck");
__name2222(hfMakeDeck, "hfMakeDeck");
__name22222(hfMakeDeck, "hfMakeDeck");
__name222222(hfMakeDeck, "hfMakeDeck");
function hfInit(players, seed) {
  const r = rng(seed);
  const numDecks = players.length + 1;
  const deck = hfMakeDeck(numDecks);
  shuffle(deck, r);
  deck.forEach((c, i) => c.id = i);
  const hands = {};
  const feet = {};
  const melds = {};
  const red3s = {};
  const scores = {};
  for (const p of players) {
    hands[p] = deck.splice(0, 11);
    feet[p] = deck.splice(0, 11);
    melds[p] = [];
    red3s[p] = [];
    scores[p] = 0;
    let foundRed = true;
    while (foundRed) {
      foundRed = false;
      for (let i = hands[p].length - 1; i >= 0; i--) {
        if (hfIsRed3(hands[p][i])) {
          red3s[p].push(hands[p].splice(i, 1)[0]);
          if (deck.length) hands[p].push(deck.shift());
          foundRed = true;
        }
      }
    }
  }
  let initialDiscard = deck.shift();
  while (hfIsRed3(initialDiscard) || hfIsWild(initialDiscard)) {
    deck.push(initialDiscard);
    initialDiscard = deck.shift();
  }
  return {
    drawPile: deck,
    discardPile: [initialDiscard],
    hands,
    feet,
    melds,
    red3s,
    scores,
    rulesVersion: 2,
    inFoot: {},
    round: 1,
    roundScores: [],
    hasDrawn: false,
    history: [],
    goOutApproval: null
  };
}
__name(hfInit, "hfInit");
__name2(hfInit, "hfInit");
__name22(hfInit, "hfInit");
__name222(hfInit, "hfInit");
__name2222(hfInit, "hfInit");
__name22222(hfInit, "hfInit");
__name222222(hfInit, "hfInit");
function hfMinMeld(score) {
  if (score < 0) return 15;
  if (score < 1500) return 50;
  if (score < 3e3) return 90;
  return 120;
}
__name(hfMinMeld, "hfMinMeld");
__name2(hfMinMeld, "hfMinMeld");
__name22(hfMinMeld, "hfMinMeld");
__name222(hfMinMeld, "hfMinMeld");
__name2222(hfMinMeld, "hfMinMeld");
__name22222(hfMinMeld, "hfMinMeld");
__name222222(hfMinMeld, "hfMinMeld");
function hfCountCanastas(melds) {
  let clean = 0, dirty = 0;
  for (const m of melds) {
    if (m.rank !== "3" && m.cards.length >= 7) {
      if (m.cards.every((c) => !hfIsWild(c))) clean++;
      else dirty++;
    }
  }
  return { clean, dirty };
}
__name(hfCountCanastas, "hfCountCanastas");
__name2(hfCountCanastas, "hfCountCanastas");
__name22(hfCountCanastas, "hfCountCanastas");
__name222(hfCountCanastas, "hfCountCanastas");
__name2222(hfCountCanastas, "hfCountCanastas");
__name22222(hfCountCanastas, "hfCountCanastas");
__name222222(hfCountCanastas, "hfCountCanastas");
function hfScoreHand(melds, red3s, handCards) {
  let score = 0;
  score += red3s.length * 100;
  for (const m of melds) {
    for (const c of m.cards) score += hfCardVal(c);
    if (m.rank !== "3" && m.cards.length >= 7) {
      const isClean = m.cards.every((c) => !hfIsWild(c));
      score += isClean ? 500 : 300;
    }
  }
  for (const c of handCards) score -= hfCardVal(c);
  return score;
}
__name(hfScoreHand, "hfScoreHand");
__name2(hfScoreHand, "hfScoreHand");
__name22(hfScoreHand, "hfScoreHand");
__name222(hfScoreHand, "hfScoreHand");
__name2222(hfScoreHand, "hfScoreHand");
__name22222(hfScoreHand, "hfScoreHand");
__name222222(hfScoreHand, "hfScoreHand");
function hfOpening(st, p) {
  return st.rulesVersion === 2 ? [50, 90, 120, 150][Math.min(3, (st.round || 1) - 1)] : hfMinMeld(st.scores[p]);
}
__name(hfOpening, "hfOpening");
__name2(hfOpening, "hfOpening");
__name22(hfOpening, "hfOpening");
__name222(hfOpening, "hfOpening");
__name2222(hfOpening, "hfOpening");
__name22222(hfOpening, "hfOpening");
function hfOpenFoot(st, p) {
  st.inFoot[p] = true;
  st.history.push({ p, note: "Picked up their foot!" });
  for (let i = 0; i < st.feet[p].length; i++) if (hfIsRed3(st.feet[p][i])) {
    st.red3s[p].push(st.feet[p].splice(i, 1)[0]);
    if (st.drawPile.length) st.feet[p].push(st.drawPile.shift());
    i--;
  }
}
__name(hfOpenFoot, "hfOpenFoot");
__name2(hfOpenFoot, "hfOpenFoot");
__name22(hfOpenFoot, "hfOpenFoot");
__name222(hfOpenFoot, "hfOpenFoot");
__name2222(hfOpenFoot, "hfOpenFoot");
__name22222(hfOpenFoot, "hfOpenFoot");
function hfMove(st, players, turnIdx, move) {
  const trial = structuredClone(st);
  const result = hfMoveApply(trial, players, turnIdx, move);
  Object.assign(st, trial);
  return result;
}
__name(hfMove, "hfMove");
__name2(hfMove, "hfMove");
__name22(hfMove, "hfMove");
__name222(hfMove, "hfMove");
__name2222(hfMove, "hfMove");
__name22222(hfMove, "hfMove");
function hfMoveApply(st, players, turnIdx, move) {
  const p = players[turnIdx];
  const hand = st.inFoot[p] ? st.feet[p] : st.hands[p];
  if (move.action === "draw") {
    if (st.hasDrawn) throw new Error("You already drew this turn.");
    if (st.drawPile.length < 2) return hfEndRound(st, players, null);
    const drawn = [];
    for (let i = 0; i < 2 && st.drawPile.length; i++) {
      const c = st.drawPile.shift();
      if (hfIsRed3(c)) {
        st.red3s[p].push(c);
        if (st.drawPile.length) {
          i--;
          continue;
        }
      } else {
        hand.push(c);
        drawn.push(c);
      }
    }
    st.hasDrawn = true;
    return { over: false, next: turnIdx, drawn };
  }
  if (move.action === "pickup") {
    if (st.hasDrawn) throw new Error("You already drew. Meld or discard now.");
    if (st.discardPile.length === 0) throw new Error("Discard pile is empty.");
    const topCard = st.discardPile[st.discardPile.length - 1];
    if (hfIsBlack3(topCard)) throw new Error("A black 3 blocks the pile!");
    if (hfIsWild(topCard)) throw new Error("Can't pick up the pile when a wild is on top.");
    const topRank = topCard.rank;
    const naturalInHand = hand.filter((c) => c.rank === topRank && !hfIsWild(c)).length;
    if (naturalInHand < 2) throw new Error("Hold two natural cards matching the top discard to pick up.");
    const matching = hand.filter((c) => c.rank === topRank && !hfIsWild(c)).slice(0, 2);
    const extra = Array.isArray(move.melds) ? move.melds : [];
    const ownIds = new Set(matching.map((c) => c.id));
    for (const group4 of extra) {
      if (!Array.isArray(group4.cardIds) || !group4.cardIds.length) throw new Error("Choose cards for each meld.");
      for (const id of group4.cardIds) {
        if (!hand.some((c) => c.id === id)) throw new Error("Only cards already in your hand can open from the discard pile.");
        ownIds.add(id);
      }
    }
    const ownPoints = hand.filter((c) => ownIds.has(c.id)).reduce((sum, c) => sum + hfCardVal(c), 0);
    const openingMinimum = hfOpening(st, p);
    if (!st.melds[p].length && ownPoints < openingMinimum) throw new Error("To open from the discard pile, meld " + openingMinimum + " points from your hand; your selected hand cards total " + ownPoints + ". Discard-pile cards do not count toward opening.");
    const same = extra.filter((m) => m.rank === topRank).flatMap((m) => m.cardIds || []);
    const openingGroups = [{ rank: topRank, cardIds: [.../* @__PURE__ */ new Set([...matching.map((c) => c.id), topCard.id, ...same])] }, ...extra.filter((m) => m.rank !== topRank)];
    st.discardPile.pop();
    hand.push(topCard);
    st.hasDrawn = true;
    const pile = st.discardPile.splice(0);
    for (const card of pile) {
      if (hfIsRed3(card)) {
        st.red3s[p].push(card);
        while (st.drawPile.length) {
          const replacement = st.drawPile.shift();
          if (hfIsRed3(replacement)) st.red3s[p].push(replacement);
          else {
            hand.push(replacement);
            break;
          }
        }
      } else hand.push(card);
    }
    st.lastPickup = { p, n: pile.length + 1, at: now() };
    hfMoveApply(st, players, turnIdx, { action: "melds", melds: openingGroups, pickingUp: true });
    return { over: false, next: turnIdx, pickedUp: pile.length + 1 };
  }
  if (move.action === "meld" || move.action === "melds") {
    if (!st.hasDrawn) throw new Error("Draw first!");
    const groups = move.action === "melds" ? move.melds : [move];
    if (!Array.isArray(groups) || !groups.length) throw new Error("Choose one or more meld groups.");
    const remaining = [...hand];
    const proposedByOwner = { [p]: structuredClone(st.melds[p]) };
    const getProposed = /* @__PURE__ */ __name((owner) => proposedByOwner[owner] || (proposedByOwner[owner] = structuredClone(st.melds[owner] || [])), "getProposed");
    let points = 0, ownPoints = 0, playedOffAnother = false, blackThreeGroup = false;
    for (const group322222 of groups) {
      const cards = [];
      if (!Array.isArray(group322222.cardIds) || !group322222.cardIds.length) throw new Error("Choose cards for each meld.");
      for (const id of group322222.cardIds) {
        const i = remaining.findIndex((c) => c.id === id);
        if (i < 0) throw new Error("A card is missing or used in two groups.");
        cards.push(remaining.splice(i, 1)[0]);
      }
      const rank = group322222.rank;
      if (rank === "3") {
        if (group322222.owner != null && String(group322222.owner) !== String(p)) throw new Error("Black threes stay on your own side.");
        if (cards.length < 3 || !cards.every(hfIsBlack3)) throw new Error("Meld at least three black threes with no wilds or red threes.");
        const books = hfCountCanastas(st.melds[p]);
        if (!st.inFoot[p] || !books.clean || !books.dirty) throw new Error("Finish your clean and dirty books in your foot before melding black threes.");
        if (groups.length !== 1 || hand.length !== cards.length + 1) throw new Error("Black threes must be all remaining cards except one final discard.");
        getProposed(p).push({rank:"3",cards}); blackThreeGroup = true; continue;
      }
      if (!["A", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].includes(rank)) throw new Error("Threes cannot meld; twos and jokers must join natural cards.");
      if (cards.some((c) => !hfIsWild(c) && c.rank !== rank)) throw new Error("Keep each rank in its own group. Stage aces and tens separately, then play them together.");
      const rawOwner = group322222.owner;
      const owner = rawOwner == null ? p : players.find(x => String(x) === String(rawOwner));
      if (owner == null) throw new Error("That player is not at this table.");
      const other = String(owner) !== String(p);
      if (other && !st.melds[p].length) throw new Error("Meld on your own side first, then you can play off someone else's pile.");
      const source = other ? (st.melds[owner] || []).find(m => m.rank === rank) : null;
      if (other && !source) throw new Error("Choose a matching pile that is already started.");
      // The other pile establishes a rank; it never receives the acting player's cards.
      const proposed = getProposed(p);
      let meld = proposed.find(m => m.rank === rank);
      if (!meld) {
        if (!source && cards.length < 3) throw new Error("Each new group needs at least three cards, including at least two natural cards.");
        if (source) { const together=[...source.cards,...cards],w=together.filter(hfIsWild).length; if(w>3||w>=together.length-w) throw new Error("Use more natural cards than wild cards, with at most three wilds."); }
        meld = { rank, cards: [] };
        if (source) meld.layoffSupport = { natural: source.cards.filter(c => !hfIsWild(c)).length, wild: source.cards.filter(hfIsWild).length, from: owner };
        proposed.push(meld);
      }
      const all = [...meld.cards, ...cards], wild = all.filter(hfIsWild).length, natural = all.length - wild;
      // A one-card layoff can use the original pile's support until this side has
      // a complete independent meld. Support is counts only and never scores.
      const independent = all.length >= 3 && natural >= 2 && natural > wild;
      const support = !independent && meld.layoffSupport;
      if (wild > 3 || (support ? wild + support.wild > 3 || wild + support.wild >= natural + support.natural : wild >= natural)) throw new Error("Use more natural cards than wild cards, with at most three wilds.");
      meld.cards = all;
      if (independent) delete meld.layoffSupport;
      if (other) playedOffAnother = true;
      const groupPoints = cards.reduce((n, c) => n + hfCardVal(c), 0);
      points += groupPoints;
      ownPoints += groupPoints;
    }
    const minimum = hfOpening(st, p);
    if (!blackThreeGroup && !st.melds[p].length && ownPoints < minimum) throw new Error("Your opening groups together need " + minimum + " points; you selected " + ownPoints + ". Stage another valid group.");
    if (st.inFoot[p] && remaining.length === 0) throw new Error("Keep your final foot card to discard.");
    if (st.inFoot[p] && remaining.length === 1) {
      const books = hfCountCanastas(proposedByOwner[p]);
      if (!books.clean || !books.dirty) throw new Error("Keep two cards until you have a clean and a dirty book.");
    }
    for (const owner in proposedByOwner) st.melds[owner] = proposedByOwner[owner];
    hand.splice(0, hand.length, ...remaining);
    st.history.push({ p, note: "Melded " + groups.length + " group(s)" + (playedOffAnother ? " (played off another pile; cards and points stay on own side)" : ""), points });
    if (!hand.length && !st.inFoot[p]) hfOpenFoot(st, p);
    return { over: false, next: turnIdx };
  }
  if (move.action === "discard") {
    if (!st.hasDrawn) throw new Error("Draw first!");
    const cardId = move.cardId;
    const idx = hand.findIndex((c) => c.id === cardId);
    if (idx < 0) throw new Error("You don't have that card.");
    const discardedFromFoot = !!st.inFoot[p];
    const card = hand.splice(idx, 1)[0];
    st.discardPile.push(card);
    st.lastDiscard = { p, inFoot: discardedFromFoot, cardId: card.id };
    st.hasDrawn = false;
    if (hand.length === 0 && !st.inFoot[p]) {
      hfOpenFoot(st, p);
      return { over: false, next: (turnIdx + 1) % players.length };
    }
    if (hand.length === 0 && st.inFoot[p]) {
      const { clean, dirty } = hfCountCanastas(st.melds[p]);
      if (clean >= 1 && dirty >= 1 && clean + dirty >= 2) {
        st.history.push({ p, note: `Went out!` });
        return hfEndRound(st, players, p);
      }
      st.discardPile.pop();
      hand.push(card);
      const needed = [];
      if (clean < 1) needed.push("1 clean canasta (no wilds)");
      if (dirty < 1) needed.push("1 dirty canasta (has wilds)");
      throw new Error(`Can't go out yet! You still need: ${needed.join(" and ")}.`);
    }
    if (st.drawPile.length === 0 && st.discardPile.length <= 1) {
      return hfEndRound(st, players, null);
    }
    st.history.push({ p, note: "discarded" });
    return { over: false, next: (turnIdx + 1) % players.length };
  }
  throw new Error("Unknown action.");
}
__name(hfMoveApply, "hfMoveApply");
__name2(hfMoveApply, "hfMoveApply");
__name22(hfMoveApply, "hfMoveApply");
__name222(hfMoveApply, "hfMoveApply");
__name2222(hfMoveApply, "hfMoveApply");
__name22222(hfMoveApply, "hfMoveApply");
__name222222(hfMove, "hfMove");
function hfEndRound(st, players, goOutPlayer) {
  for (const p of players) {
    const currentHand = st.inFoot[p] ? st.feet[p] : st.hands[p];
    let handCards = [...currentHand];
    if (!st.inFoot[p]) handCards = [...handCards, ...st.feet[p]];
    const roundScore = hfScoreHand(st.melds[p], st.red3s[p], handCards);
    const goOutBonus = p === goOutPlayer ? 100 : 0;
    st.scores[p] += roundScore + goOutBonus;
  }
  st.roundScores.push(Object.fromEntries(players.map((p) => [p, st.scores[p]])));
  if (st.rulesVersion === 2 && (st.round || 1) < 4) {
    const scores = { ...st.scores }, roundScores = [...st.roundScores], round = st.round + 1, bot = st.bot, chat = st.chat;
    Object.assign(st, hfInit(players, Date.now()));
    Object.assign(st, { scores, roundScores, round, chat });
    if (bot) st.bot = bot;
    return { over: false, next: (round - 1) % players.length };
  }
  let best = null, tie = false;
  for (const p of players) {
    if (best === null || st.scores[p] > st.scores[best]) {
      best = p;
      tie = false;
    } else if (st.scores[p] === st.scores[best]) tie = true;
  }
  st.gameOver = true;
  st.goOutPlayer = goOutPlayer;
  return { over: true, winner: tie ? "tie" : best, next: 0 };
}
__name(hfEndRound, "hfEndRound");
__name2(hfEndRound, "hfEndRound");
__name22(hfEndRound, "hfEndRound");
__name222(hfEndRound, "hfEndRound");
__name2222(hfEndRound, "hfEndRound");
__name22222(hfEndRound, "hfEndRound");
__name222222(hfEndRound, "hfEndRound");
function hfView(st, viewer) {
  const hands = {};
  const feet = {};
  for (const p in st.hands) {
    if (String(p) === String(viewer)) {
      hands[p] = st.hands[p];
      feet[p] = st.inFoot[p] ? st.feet[p] : st.feet[p].length;
    } else {
      hands[p] = st.hands[p].length;
      feet[p] = st.feet[p].length;
    }
  }
  return {
    ...st,
    hands,
    feet,
    drawPile: st.drawPile.length,
    discardPile: st.discardPile.length > 0 ? [st.discardPile[st.discardPile.length - 1]] : [],
    discardCount: st.discardPile.length
  };
}
__name(hfView, "hfView");
__name2(hfView, "hfView");
__name22(hfView, "hfView");
__name222(hfView, "hfView");
__name2222(hfView, "hfView");
__name22222(hfView, "hfView");
__name222222(hfView, "hfView");
function spMakeDeck() {
  const suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];
  for (const suit of suits) for (const rank of ranks) deck.push({ rank, suit, id: deck.length });
  return deck;
}
__name(spMakeDeck, "spMakeDeck");
__name2(spMakeDeck, "spMakeDeck");
__name22(spMakeDeck, "spMakeDeck");
__name222(spMakeDeck, "spMakeDeck");
__name2222(spMakeDeck, "spMakeDeck");
__name22222(spMakeDeck, "spMakeDeck");
__name222222(spMakeDeck, "spMakeDeck");
function spRankVal(rank) {
  const order = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13, A: 14 };
  return order[rank];
}
__name(spRankVal, "spRankVal");
__name2(spRankVal, "spRankVal");
__name22(spRankVal, "spRankVal");
__name222(spRankVal, "spRankVal");
__name2222(spRankVal, "spRankVal");
__name22222(spRankVal, "spRankVal");
__name222222(spRankVal, "spRankVal");
function spSortHand(a, b) {
  const order = ["\u2663", "\u2666", "\u2665", "\u2660"];
  const sa = order.indexOf(a.suit), sb = order.indexOf(b.suit);
  if (sa !== sb) return sa - sb;
  return spRankVal(a.rank) - spRankVal(b.rank);
}
__name(spSortHand, "spSortHand");
__name2(spSortHand, "spSortHand");
__name22(spSortHand, "spSortHand");
__name222(spSortHand, "spSortHand");
__name2222(spSortHand, "spSortHand");
__name22222(spSortHand, "spSortHand");
__name222222(spSortHand, "spSortHand");
function spTeam(seatIdx) {
  return seatIdx % 2 === 0 ? "A" : "B";
}
__name(spTeam, "spTeam");
__name2(spTeam, "spTeam");
__name22(spTeam, "spTeam");
__name222(spTeam, "spTeam");
__name2222(spTeam, "spTeam");
__name22222(spTeam, "spTeam");
__name222222(spTeam, "spTeam");
function spInit(players, seed) {
  if(players.length!==4||new Set(players).size!==4||players.some(p=>!Number.isSafeInteger(p)||(p<=0&&!gameBotPlayer('spades',p))))throw Error('Spades needs four distinct players.');
  const r = rng(seed);
  const deck = shuffle(spMakeDeck(), r);
  deck.forEach((c, i) => c.id = i);
  const hands = {};
  players.forEach((p, i) => {
    hands[p] = deck.slice(i * 13, (i + 1) * 13).sort(spSortHand);
  });
  const bids = {}, tricksWon = {};
  for (const p of players) {
    bids[p] = null;
    tricksWon[p] = 0;
  }
  return {
    hands,
    bids,
    tricksWon,
    phase: "bidding",
    dealerIdx: players.length - 1,
    currentTrick: [],
    lastTrick: null,
    leadIdx: 0,
    spadesBroken: false,
    teamScores: { A: 0, B: 0 },
    scores: Object.fromEntries(players.map((p) => [p, 0])),
    bags: { A: 0, B: 0 },
    round: 1,
    roundHistory: [],
    history: [],
    gameOver: false
  };
}
__name(spInit, "spInit");
__name2(spInit, "spInit");
__name22(spInit, "spInit");
__name222(spInit, "spInit");
__name2222(spInit, "spInit");
__name22222(spInit, "spInit");
__name222222(spInit, "spInit");
function spEndRound(st, players, lastWinnerIdx) {
  const teamBid = { A: 0, B: 0 }, teamTricks = { A: 0, B: 0 };
  players.forEach((p, idx) => {
    const team = spTeam(idx);
    const b = st.bids[p];
    if (b && !b.nil) teamBid[team] += b.amt;
    teamTricks[team] += st.tricksWon[p] || 0;
  });
  players.forEach((p, idx) => {
    const team = spTeam(idx);
    const b = st.bids[p];
    if (b && b.nil) {
      if ((st.tricksWon[p] || 0) === 0) st.teamScores[team] += 100;
      else st.teamScores[team] -= 100;
    }
  });
  for (const team of ["A", "B"]) {
    if (teamTricks[team] >= teamBid[team]) {
      const over = teamTricks[team] - teamBid[team];
      st.teamScores[team] += teamBid[team] * 10 + over;
      st.bags[team] += over;
      if (st.bags[team] >= 10) {
        st.teamScores[team] -= 100;
        st.bags[team] -= 10;
      }
    } else {
      st.teamScores[team] -= teamBid[team] * 10;
    }
  }
  players.forEach((p, idx) => st.scores[p] = st.teamScores[spTeam(idx)]);
  st.roundHistory.push({ round: st.round, bids: { ...st.bids }, tricksWon: { ...st.tricksWon }, teamScores: { ...st.teamScores } });
  if (st.teamScores.A >= 500 || st.teamScores.B >= 500 || st.teamScores.A <= -200 || st.teamScores.B <= -200) {
    st.gameOver = true;
    st.phase = "gameOver";
    const winTeam = st.teamScores.A === st.teamScores.B ? "tie" : st.teamScores.A > st.teamScores.B ? "A" : "B";
    st.finalWinnerTeam = winTeam;
    const winPlayers = winTeam === "tie" ? [] : players.filter((p, idx) => spTeam(idx) === winTeam);
    return { over: true, winner: winTeam === "tie" ? "tie" : winPlayers.join("+"), next: lastWinnerIdx };
  }
  const roundHistory = [...st.roundHistory], teamScores = { ...st.teamScores }, scores = { ...st.scores }, bags = { ...st.bags }, round = st.round + 1, dealerIdx = (st.dealerIdx + 1) % players.length, chat = st.chat, bot = st.bot;
  Object.assign(st, spInit(players, Date.now()));
  Object.assign(st, { roundHistory, teamScores, scores, bags, round, dealerIdx, chat });
  if (bot) st.bot = bot;
  const firstBidder = (st.dealerIdx + 1) % players.length;
  return { over: false, next: firstBidder };
}
__name(spEndRound, "spEndRound");
__name2(spEndRound, "spEndRound");
__name22(spEndRound, "spEndRound");
__name222(spEndRound, "spEndRound");
__name2222(spEndRound, "spEndRound");
__name22222(spEndRound, "spEndRound");
__name222222(spEndRound, "spEndRound");
function spMoveApply(st, players, turnIdx, move) {
  const p = players[turnIdx];
  if (st.phase === "bidding") {
    if (move.action !== "bid") throw new Error("Place your bid first.");
    if (st.bids[p] !== null && st.bids[p] !== void 0) throw new Error("You already bid.");
    let amt, nil = false;
    if (move.nil) {
      amt = 0;
      nil = true;
    } else {
      amt = +move.amount;
      if (!Number.isInteger(amt) || amt < 1 || amt > 13) throw new Error("Bid 1 to 13, or Nil.");
    }
    st.bids[p] = { amt, nil };
    st.history.push({ p, note: nil ? "Bid Nil" : `Bid ${amt}` });
    const allBid = players.every((pl) => st.bids[pl] !== null && st.bids[pl] !== void 0);
    if (!allBid) return { over: false, next: (turnIdx + 1) % players.length };
    st.phase = "playing";
    const leadIdx = (st.dealerIdx + 1) % players.length;
    st.leadIdx = leadIdx;
    return { over: false, next: leadIdx };
  }
  if (st.phase === "playing") {
    if (move.action !== "play") throw new Error("Play a card.");
    const hand = st.hands[p];
    const idx = hand.findIndex((c) => c.id === move.cardId);
    if (idx < 0) throw new Error("You don't have that card.");
    const card = hand[idx];
    const leadSuit = st.currentTrick.length ? st.currentTrick[0].card.suit : null;
    if (leadSuit) {
      const hasLeadSuit = hand.some((c) => c.suit === leadSuit);
      if (hasLeadSuit && card.suit !== leadSuit) throw new Error("You must follow suit (" + leadSuit + ").");
    } else if (card.suit === "\u2660" && !st.spadesBroken) {
      const onlySpades = hand.every((c) => c.suit === "\u2660");
      if (!onlySpades) throw new Error("Spades aren't broken yet \u2014 lead another suit.");
    }
    hand.splice(idx, 1);
    if (card.suit === "\u2660") st.spadesBroken = true;
    st.currentTrick.push({ p, seat: turnIdx, card });
    st.lastTrick = null;
    if (st.currentTrick.length < players.length) {
      return { over: false, next: (turnIdx + 1) % players.length };
    }
    let winner = st.currentTrick[0];
    for (const play of st.currentTrick.slice(1)) {
      const c = play.card;
      if (c.suit === "\u2660" && winner.card.suit !== "\u2660") winner = play;
      else if (c.suit === winner.card.suit && spRankVal(c.rank) > spRankVal(winner.card.rank)) winner = play;
    }
    st.tricksWon[winner.p] = (st.tricksWon[winner.p] || 0) + 1;
    st.history.push({ p: winner.p, note: "Won the trick" });
    st.lastTrick = st.currentTrick;
    st.currentTrick = [];
    const winnerIdx = winner.seat;
    const roundDone = players.every((pl) => st.hands[pl].length === 0);
    if (!roundDone) {
      st.leadIdx = winnerIdx;
      return { over: false, next: winnerIdx };
    }
    return spEndRound(st, players, winnerIdx);
  }
  throw new Error("Unknown phase.");
}
__name(spMoveApply, "spMoveApply");
__name2(spMoveApply, "spMoveApply");
__name22(spMoveApply, "spMoveApply");
__name222(spMoveApply, "spMoveApply");
__name2222(spMoveApply, "spMoveApply");
__name22222(spMoveApply, "spMoveApply");
__name222222(spMoveApply, "spMoveApply");
function spMove(st, players, turnIdx, move) {
  const trial = structuredClone(st);
  const result = spMoveApply(trial, players, turnIdx, move);
  Object.assign(st, trial);
  return result;
}
__name(spMove, "spMove");
__name2(spMove, "spMove");
__name22(spMove, "spMove");
__name222(spMove, "spMove");
__name2222(spMove, "spMove");
__name22222(spMove, "spMove");
__name222222(spMove, "spMove");
function spView(st, viewer) {
  const hands = {};
  for (const p in st.hands) {
    if (String(p) === String(viewer)) hands[p] = st.hands[p];
    else hands[p] = st.hands[p].length;
  }
  return { ...st, hands };
}
__name(spView, "spView");
__name2(spView, "spView");
__name22(spView, "spView");
__name222(spView, "spView");
__name2222(spView, "spView");
__name22222(spView, "spView");
__name222222(spView, "spView");

// ========== OHANO DOMINO ==========
const DOMINO_MODES = {
  draw: { label: "Draw Dominoes", maxPip: 12, hand: 7 },
  block: { label: "Block Dominoes", maxPip: 12, hand: 7 },
  allfives: { label: "All Fives / Muggins", maxPip: 12, hand: 7 },
  mexican: { label: "Mexican Train", maxPip: 12, hand: 12 },
  chicken: { label: "Chicken Foot", maxPip: 12, hand: 7 },
  double15: { label: "Double Fifteen", maxPip: 15, hand: 10 }
};
function dominoTrainInit(players,seed,mode){
 const cfg=DOMINO_MODES[mode],deck=shuffle(dominoTiles(cfg.maxPip),rng(seed));
 const index=deck.findIndex(t=>t.a===cfg.maxPip&&t.b===cfg.maxPip),engine=deck.splice(index,1)[0];
 const size=Math.min(cfg.hand,Math.floor((deck.length-8)/players.length));
 const hands=Object.fromEntries(players.map(p=>[p,deck.splice(0,size)]));
 return {mode,modeLabel:cfg.label,maxPip:cfg.maxPip,trains:Object.fromEntries([...players,'mexican'].map(p=>[p,{tiles:[],end:engine.a,open:p==='mexican'}])),board:[{p:null,tile:engine,side:'start'}],ends:{left:engine.a,right:engine.b},hands,boneyard:deck,scores:Object.fromEntries(players.map(p=>[p,0])),round:1,nextTurn:0,drawn:false,pendingDouble:null,history:[],lastPlay:{tile:engine,note:'engine'}};
}
function dominoTrainPlayable(st,player){
 return (st.hands[player]||[]).flatMap(tile=>Object.entries(st.trains).filter(([id,t])=>(!st.pendingDouble||id===st.pendingDouble)&&(id===String(player)||t.open)&&(tile.a===t.end||tile.b===t.end)).map(([id])=>({tile,side:'train-'+id})));
}
function dominoTrainMove(st,players,turn,move){
 const p=players[turn],hand=st.hands[p],legal=dominoTrainPlayable(st,p);
 if(move.action==='draw'){
  if(legal.length)throw new Error('Play a matching tile.');if(st.drawn)throw new Error('One draw per turn; play or pass.');if(!st.boneyard.length)throw new Error('No tiles left.');
  const tile=st.boneyard.shift();hand.push(tile);st.drawn=true;st.lastPlay={p,tile,note:'drew a tile'};return {over:false,next:turn};
 }
 if(move.action==='pass'){
  if(legal.length)throw new Error('Play a matching tile.');if(st.boneyard.length&&!st.drawn)throw new Error('Draw once before passing.');
  st.trains[p].open=true;st.drawn=false;st.lastPlay={p,note:'passed'};
  const blocked=!st.boneyard.length&&!players.some(who=>dominoTrainPlayable(st,who).length);
  if(blocked){dominoRoundScores(st,players);const winner=dominoRoundWinner(st,players);return {over:true,winner,next:players.indexOf(winner)};}
  return {over:false,next:(turn+1)%players.length};
 }
 if(move.action!=='play')throw new Error('Choose a domino move.');
 const found=legal.find(x=>x.tile.id===Number(move.tileId)&&x.side===move.side);if(!found)throw new Error('That train is not a legal destination.');
 const id=move.side.slice(6),train=st.trains[id],tile=found.tile;hand.splice(hand.findIndex(t=>t.id===tile.id),1);
 const oriented=tile.a===train.end?tile:{...tile,a:tile.b,b:tile.a};train.tiles.push({p,tile:oriented,side:move.side});train.end=oriented.b;
 if(id===String(p))train.open=false;
 st.pendingDouble=tile.a===tile.b?id:null;st.drawn=false;st.lastPlay={p,tile,side:move.side};st.history.push({p,tile,side:move.side});
 if(!hand.length){dominoRoundScores(st,players);return {over:true,winner:p,next:turn};}
 return {over:false,next:st.pendingDouble?turn:(turn+1)%players.length};
}

function dominoMode(mode) {
  return DOMINO_MODES[mode] ? mode : "draw";
}
function dominoTiles(maxPip) {
  const out = [];
  let id = 1;
  for (let a = 0; a <= maxPip; a++) for (let b = a; b <= maxPip; b++) out.push({ id: id++, a, b });
  return out;
}
function dominoPips(tile) {
  return Number(tile?.a || 0) + Number(tile?.b || 0);
}
function dominoTileName(tile) {
  return `${tile.a}-${tile.b}`;
}
function dominoPlayable(st, player) {
  if(st.trains)return dominoTrainPlayable(st,player);
  const hand = st.hands[player] || [];
  if (!st.board.length) return hand.map(tile => ({ tile, side: "right" }));
  return hand.flatMap(tile => {
    const sides = [];
    if (tile.a === st.ends.left || tile.b === st.ends.left) sides.push({ tile, side: "left" });
    if (tile.a === st.ends.right || tile.b === st.ends.right) sides.push({ tile, side: "right" });
    return sides;
  });
}
function dominoOpenScore(st) {
  const total = (Number(st.ends?.left) || 0) + (Number(st.ends?.right) || 0);
  return total && total % 5 === 0 ? total : 0;
}
function dominoHandPips(st, player) {
  return (st.hands[player] || []).reduce((sum, tile) => sum + dominoPips(tile), 0);
}
function dominoRoundScores(st, players) {
  for (const p of players) st.scores[p] = Number(st.scores[p] || 0) + dominoHandPips(st, p);
}
function dominoRoundWinner(st, players) {
  return [...players].sort((a, b) => dominoHandPips(st, a) - dominoHandPips(st, b))[0];
}
function dominoCreationMode(mode) {
  const key = dominoMode(mode);
  return key === "draw" ? "draw-tile-pips-v1" : key;
}
function dominoPlayedPips(st) {
  return st.mode === "draw" && !st.trains && st.scoringVersion === "draw-tile-pips-v1";
}
function dominoSettlePlayedPips(st, players, reason, wentOut = null) {
  if (st.scoreSettlement) {
    const winner = st.scoreSettlement.winner;
    return { over: true, winner, next: winner === "tie" ? 0 : players.indexOf(winner) };
  }
  const remaining = Object.fromEntries(players.map(p => [p, dominoHandPips(st, p)]));
  for (const p of players) st.scores[p] = Number(st.scores[p] || 0) - remaining[p];
  const highest = Math.max(...players.map(p => st.scores[p]));
  const leaders = players.filter(p => st.scores[p] === highest), winner = leaders.length === 1 ? leaders[0] : "tie";
  st.roundWinner = winner;
  st.scoreSettlement = { reason, wentOut, remaining, winner };
  return { over: true, winner, next: winner === "tie" ? 0 : players.indexOf(winner) };
}
function dominoInit(players, seed, mode) {
  if(mode==='mexican')return dominoTrainInit(players,seed,mode);
  const key = dominoMode(mode);
  const cfg = DOMINO_MODES[key];
  const deck = shuffle(dominoTiles(cfg.maxPip), rng(seed));
  const handSize = Math.min(cfg.hand, Math.max(5, Math.floor((deck.length - 1) / players.length)));
  const hands = Object.fromEntries(players.map(p => [p, deck.splice(0, handSize).sort((a, b) => dominoPips(b) - dominoPips(a))]));
  let starterPlayer = players[0], starterIndex = 0, starter = hands[players[0]][0];
  for (const p of players) {
    const hand = hands[p];
    for (let i = 0; i < hand.length; i++) {
      const tile = hand[i];
      const betterDouble = tile.a === tile.b && starter.a !== starter.b;
      const biggerDouble = tile.a === tile.b && starter.a === starter.b && dominoPips(tile) > dominoPips(starter);
      const biggerTile = starter.a !== starter.b && tile.a !== tile.b && dominoPips(tile) > dominoPips(starter);
      if (betterDouble || biggerDouble || biggerTile) {
        starter = tile;
        starterPlayer = p;
        starterIndex = i;
      }
    }
  }
  hands[starterPlayer].splice(starterIndex, 1);
  const starterTurn = players.indexOf(starterPlayer);
  const nextTurn = (starterTurn + 1) % players.length;
  const state = {
    mode: key,
    modeLabel: cfg.label,
    maxPip: cfg.maxPip,
    board: [{ p: starterPlayer, tile: starter, side: "start" }],
    ends: { left: starter.a, right: starter.b },
    hands,
    boneyard: deck,
    scores: Object.fromEntries(players.map(p => [p, 0])),
    round: 1,
    target: 100,
    startedBy: starterPlayer,
    nextTurn,
    lastPlay: { p: starterPlayer, tile: starter, note: "started the table" },
    history: [{ p: starterPlayer, tile: starter, note: `started with ${dominoTileName(starter)}` }]
  };
  if (mode === "draw-tile-pips-v1") {
    state.scoringVersion = "draw-tile-pips-v1";
    state.scoreSettlement = null;
    const gained = dominoPips(starter);
    state.scores[starterPlayer] = gained;
    state.lastPlay.score = gained;
    state.history[0].score = gained;
  }
  return state;
}
function dominoMove(st, players, turnIdx, move) {
  if(st.trains)return dominoTrainMove(st,players,turnIdx,move);
  if (dominoPlayedPips(st) && st.scoreSettlement) throw new Error("This board is already settled.");
  const player = players[turnIdx];
  const hand = st.hands[player] || [];
  const playable = dominoPlayable(st, player);
  if (move.action === "draw") {
    if (playable.length) throw new Error("You have a playable tile.");
    if (st.mode === "block") throw new Error("Block Dominoes uses pass, not draw.");
    if (!st.boneyard.length) throw new Error("No tiles left to draw.");
    const tile = st.boneyard.shift();
    hand.push(tile);
    hand.sort((a, b) => dominoPips(b) - dominoPips(a));
    st.lastPlay = { p: player, tile, note: "drew a tile" };
    st.history.push({ p: player, note: "drew from the boneyard" });
    return { over: false, next: turnIdx };
  }
  if (move.action === "pass") {
    if (playable.length) throw new Error("You have a playable tile.");
    if (st.boneyard.length && st.mode !== "block") throw new Error("Draw before passing.");
    st.lastPlay = { p: player, note: "passed" };
    st.history.push({ p: player, note: "passed" });
    const blocked = !players.some(p => dominoPlayable(st, p).length) && (!st.boneyard.length || st.mode === "block");
    if (blocked) {
      if (dominoPlayedPips(st)) return dominoSettlePlayedPips(st, players, "blocked");
      const winner = dominoRoundWinner(st, players);
      dominoRoundScores(st, players);
      st.roundWinner = winner;
      st.history.push({ p: winner, note: "won the blocked round" });
      return { over: true, winner, next: players.indexOf(winner) };
    }
    return { over: false, next: (turnIdx + 1) % players.length };
  }
  if (move.action !== "play") throw new Error("Choose a domino move.");
  const tileId = Number(move.tileId);
  const side = move.side === "left" ? "left" : "right";
  const index = hand.findIndex(t => t.id === tileId);
  if (index < 0) throw new Error("That tile is not in your hand.");
  const tile = hand[index];
  const end = st.ends[side];
  if (tile.a !== end && tile.b !== end) throw new Error("That tile does not match the open end.");
  hand.splice(index, 1);
  const open = tile.a === end ? tile.b : tile.a;
  if (side === "left") {
    st.ends.left = open;
    st.board.unshift({ p: player, tile, side });
  } else {
    st.ends.right = open;
    st.board.push({ p: player, tile, side });
  }
  let gained = 0;
  if (dominoPlayedPips(st)) {
    gained = dominoPips(tile);
    st.scores[player] = Number(st.scores[player] || 0) + gained;
  } else if (st.mode === "allfives") {
    gained = dominoOpenScore(st);
    if (gained) st.scores[player] = Number(st.scores[player] || 0) + gained;
  }
  st.lastPlay = { p: player, tile, side, score: gained };
  st.history.push({ p: player, tile, side, score: gained, note: `played ${dominoTileName(tile)} ${side}` });
  if (!hand.length) {
    if (dominoPlayedPips(st)) return dominoSettlePlayedPips(st, players, "empty", player);
    dominoRoundScores(st, players);
    st.roundWinner = player;
    return { over: true, winner: player, next: turnIdx };
  }
  return { over: false, next: (turnIdx + 1) % players.length };
}
function dominoView(st, viewer) {
  const hands = {};
  for (const p in st.hands) hands[p] = String(p) === String(viewer) ? st.hands[p] : st.hands[p].length;
  const lastPlay = st.lastPlay?.note === "drew a tile" && String(st.lastPlay.p) !== String(viewer)
    ? { p: st.lastPlay.p, note: st.lastPlay.note }
    : st.lastPlay;
  return { ...st, hands, lastPlay, boneyard: st.boneyard.length, playable: dominoPlayable(st, viewer).map(x => `${x.tile.id}:${x.side}`) };
}
// ========== END OHANO DOMINO ==========

function initState(type, players, seed, mode) {
  if (type === "shuffle") return shuffleInit(players, undefined, mode, {allowBot:players.includes(BOT_ID)});
  if (type === "mahjong") return mahjongInit(players, rng(seed),mode==='rounds8'?8:4);
  if (type === "words") return wordsInit(players, seed, mode);
  if (type === "tictac") return tttInit();
  if (type === "memory") return memInit(players, seed);
  if (type === "checkers") return chkInit();
  if (type === "chess") return chInit();
  if (type === "handfoot") return hfInit(players, seed);
  if (type === "ohana10") return o10Init(players, seed);
  if (type === "spades") return spInit(players, seed);
  if (type === "domino") return dominoInit(players, seed, mode);
  throw new Error("Unknown game");
}
__name(initState, "initState");
__name2(initState, "initState");
__name22(initState, "initState");
__name222(initState, "initState");
__name2222(initState, "initState");
__name22222(initState, "initState");
__name222222(initState, "initState");
async function applyMove(type, st, players, turnIdx, move, db) {
  if (type === "shuffle") {
    const result=shuffleMove(st, players, turnIdx, move);
    // A person reviews the result and chooses Next hand, including when the robot wins.
    if(st.bot && st.phase==='round-end' && !result.over){result.next=players.findIndex(p=>p!==BOT_ID);st.nextTurn=result.next;}
    return result;
  }
  if (type === "mahjong") return mahjongMove(st, players, turnIdx, move);
  if (type === "words") return wordsMove(st, players, turnIdx, move, db);
  if (type === "tictac") return tttMove(st, players, turnIdx, move);
  if (type === "memory") return memMove(st, players, turnIdx, move);
  if (type === "checkers") return chkMove(st, players, turnIdx, move);
  if (type === "chess") return chMove(st, players, turnIdx, move);
  if (type === "handfoot") return hfMove(st, players, turnIdx, move);
  if (type === "ohana10") return o10Move(st, players, turnIdx, move);
  if (type === "spades") return spMove(st, players, turnIdx, move);
  if (type === "domino") return dominoMove(st, players, turnIdx, move);
  throw new Error("Unknown game");
}
__name(applyMove, "applyMove");
__name2(applyMove, "applyMove");
__name22(applyMove, "applyMove");
__name222(applyMove, "applyMove");
__name2222(applyMove, "applyMove");
__name22222(applyMove, "applyMove");
__name222222(applyMove, "applyMove");
function viewState(type, st, viewer) {
  if (type === "shuffle") return shuffleView(st, viewer);
  if(type==="mahjong"&&st.mode==="family")return mjFamilyView(st,st.players,viewer);
  if (type === "words") return wordsView(st, viewer);
  if (type === "handfoot") return hfView(st, viewer);
  if (type === "ohana10") return o10View(st, viewer);
  if (type === "spades") return spView(st, viewer);
  if (type === "domino") return dominoView(st, viewer);
  if (type === "memory") {
    const visible = /* @__PURE__ */ new Set([...st.open || [], ...st.pending || []]);
    const safe = { ...st, cards: st.cards.map((card, i) => st.matched[i] || visible.has(i) ? card : null) };
    if (st.bot) {
      const { memory, ...bot } = st.bot;
      safe.bot = bot;
    }
    return safe;
  }
  return st;
}
__name(viewState, "viewState");
__name2(viewState, "viewState");
__name22(viewState, "viewState");
__name222(viewState, "viewState");
__name2222(viewState, "viewState");
__name22222(viewState, "viewState");
__name222222(viewState, "viewState");
var json = __name222222((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } }), "json");
var err = __name222222((msg, status = 400) => json({ error: msg }, status), "err");
var now = __name222222(() => Date.now(), "now");
function rid(n = 24) {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(rid, "rid");
__name2(rid, "rid");
__name22(rid, "rid");
__name222(rid, "rid");
__name2222(rid, "rid");
__name22222(rid, "rid");
__name222222(rid, "rid");
// Real local wind for the wind chimes. Location comes from Cloudflare's request geolocation (city level,
// no browser permission prompt); Ohana home base is the fallback. Open-Meteo needs no key. Cached ten minutes
// per rounded location so a family refreshing all day costs a handful of calls.
const WIND_HOME = { lat: 37.07, lon: -93.55, name: "Billings, MO" };
function weatherWords(code) {
  if (!Number.isFinite(code)) return "";
  if (code === 0) return "Clear"; if (code === 1) return "Mostly clear"; if (code === 2) return "Partly cloudy"; if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy"; if (code >= 51 && code <= 57) return "Drizzle"; if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow"; if (code >= 80 && code <= 82) return "Rain showers"; if (code === 85 || code === 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm"; return "";
}
async function radarFramesApi() {
  const key = new Request("https://ohana-wind.internal/radar-frames");
  let cache = null, hit = null; try { cache = caches.default; hit = await cache.match(key); } catch {}
  if (hit) return new Response(await hit.text(), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  let body = { frames: [], host: "" };
  try { const r = await fetch("https://api.rainviewer.com/public/weather-maps.json", { cf: { cacheTtl: 300 } }); if (r.ok) { const j = await r.json(); const past = (j.radar?.past || []).slice(-8), now = (j.radar?.nowcast || []).slice(0, 2); body = { generated: j.generated, frames: [...past.map((f) => ({ time: f.time, path: f.path, kind: "past" })), ...now.map((f) => ({ time: f.time, path: f.path, kind: "nowcast" }))] }; } } catch {}
  if (cache) { try { await cache.put(key, new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "public, max-age=300" } })); } catch {} }
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
async function weatherTileApi(req, p) {
  // /api/weather/tile/map/{z}/{x}/{y}  or  /api/weather/tile/radar/{pathId}/{z}/{x}/{y}
  const m = /^\/api\/weather\/tile\/(map|radar)\/(?:([a-f0-9]{6,16})\/)?(\d{1,2})\/(\d{1,7})\/(\d{1,7})$/.exec(p);
  if (!m) return new Response("Not found", { status: 404 });
  const [, kind, id, z, x, y] = m;
  if (Number(z) > 12) return new Response("Not found", { status: 404 });
  const upstream = kind === "map" ? "https://basemaps.cartocdn.com/rastertiles/voyager/" + z + "/" + x + "/" + y + ".png" : id ? "https://tilecache.rainviewer.com/v2/radar/" + id + "/256/" + z + "/" + x + "/" + y + "/4/1_1.png" : null;
  if (!upstream) return new Response("Not found", { status: 404 });
  try {
    const r = await fetch(upstream, { headers: { "user-agent": "OhanaHome weather station (ohanahome.app)" }, cf: { cacheTtl: kind === "map" ? 86400 : 900, cacheEverything: true } });
    if (!r.ok) return new Response("Unavailable", { status: 502 });
    return new Response(r.body, { headers: { "content-type": r.headers.get("content-type") || "image/png", "cache-control": kind === "map" ? "public, max-age=86400" : "public, max-age=900" } });
  } catch { return new Response("Unavailable", { status: 502 }); }
}
async function windApi(req) {
  const cf = req.cf || {};
  let lat = Number(cf.latitude), lon = Number(cf.longitude), name = [cf.city, cf.region].filter(Boolean).join(", ");
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) { lat = WIND_HOME.lat; lon = WIND_HOME.lon; name = WIND_HOME.name; }
  lat = Math.round(lat * 10) / 10; lon = Math.round(lon * 10) / 10;
  const key = new Request("https://ohana-wind.internal/v3?lat=" + lat + "&lon=" + lon);
  let cache = null, hit = null;
  try { cache = caches.default; hit = await cache.match(key); } catch {}
  let body = null;
  if (hit) { try { body = await hit.json(); } catch { body = null; } }
  if (!body) {
    let data = null;
    try {
      const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m,temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,pressure_msl,precipitation,cloud_cover,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&forecast_days=1&wind_speed_unit=ms&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto", { cf: { cacheTtl: 600, cacheEverything: true } });
      if (r.ok) data = await r.json();
    } catch {}
    const c = data && data.current;
    const speed = c ? Number(c.wind_speed_10m) : NaN;
    body = Number.isFinite(speed)
      ? { authorized: true, available: true, units: "m/s", speedMps: speed, gustMps: Number.isFinite(Number(c.wind_gusts_10m)) ? Number(c.wind_gusts_10m) : Math.round(speed * 15) / 10, directionDeg: Number.isFinite(Number(c.wind_direction_10m)) ? Number(c.wind_direction_10m) : 0, observed: c.time || null, updatedAt: Date.now(), place: { lat, lon, name },
          /* Weather center (Ohana Gathering): plain readings for people. */
          tempF: Number.isFinite(Number(c.temperature_2m)) ? Math.round(Number(c.temperature_2m)) : null, feelsF: Number.isFinite(Number(c.apparent_temperature)) ? Math.round(Number(c.apparent_temperature)) : null, humidity: Number.isFinite(Number(c.relative_humidity_2m)) ? Math.round(Number(c.relative_humidity_2m)) : null,
          windMph: Math.round(speed * 2.23694), gustMph: Math.round((Number.isFinite(Number(c.wind_gusts_10m)) ? Number(c.wind_gusts_10m) : speed * 1.5) * 2.23694), windFrom: ["N","NE","E","SE","S","SW","W","NW"][Math.round(((Number(c.wind_direction_10m) || 0) % 360) / 45) % 8],
          weatherCode: Number.isFinite(Number(c.weather_code)) ? Number(c.weather_code) : null, condition: weatherWords(Number(c.weather_code)),
          /* Weather station extras */
          pressureInHg: Number.isFinite(Number(c.pressure_msl)) ? Math.round(Number(c.pressure_msl) * 0.02953 * 100) / 100 : null, rainTodayIn: Number.isFinite(Number(c.precipitation)) ? Number(c.precipitation) : null, cloudPct: Number.isFinite(Number(c.cloud_cover)) ? Number(c.cloud_cover) : null, isDay: c.is_day === 1 || c.is_day === true,
          highF: Number.isFinite(Number(data.daily?.temperature_2m_max?.[0])) ? Math.round(Number(data.daily.temperature_2m_max[0])) : null, lowF: Number.isFinite(Number(data.daily?.temperature_2m_min?.[0])) ? Math.round(Number(data.daily.temperature_2m_min[0])) : null,
          rainChancePct: Number.isFinite(Number(data.daily?.precipitation_probability_max?.[0])) ? Number(data.daily.precipitation_probability_max[0]) : null, uvMax: Number.isFinite(Number(data.daily?.uv_index_max?.[0])) ? Math.round(Number(data.daily.uv_index_max[0]) * 10) / 10 : null,
          sunrise: data.daily?.sunrise?.[0] || null, sunset: data.daily?.sunset?.[0] || null }
      : { authorized: true, available: false, units: "m/s", updatedAt: Date.now(), place: { lat, lon, name } };
    if (cache) { try { await cache.put(key, new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "public, max-age=" + (body.available ? 600 : 120) } })); } catch {} }
  }
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
async function hash(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ohana:" + s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(hash, "hash");
__name2(hash, "hash");
__name22(hash, "hash");
__name222(hash, "hash");
__name2222(hash, "hash");
__name22222(hash, "hash");
__name222222(hash, "hash");
var ONLINE_MS = 4 * 60 * 1e3;
async function getSetting(db, k) {
  const r = await db.prepare("SELECT value FROM settings WHERE key=?").bind(k).first();
  return r ? r.value : null;
}
__name(getSetting, "getSetting");
__name2(getSetting, "getSetting");
__name22(getSetting, "getSetting");
__name222(getSetting, "getSetting");
__name2222(getSetting, "getSetting");
__name22222(getSetting, "getSetting");
__name222222(getSetting, "getSetting");
async function auth(req, env222222) {
  if(env222222.__ohanaInviteMe)return env222222.__ohanaInviteMe;
  let t = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!t) {
    try {
      t = new URL(req.url).searchParams.get("t") || "";
    } catch {
    }
  }
  if (!t) return null;
  const m = await env222222.DB.prepare("SELECT id,name,avatar,is_admin,last_seen,COALESCE((SELECT value FROM settings WHERE key='profile_about_'||members.id),'') AS about FROM members WHERE token=?").bind(t).first();
  if (m && (env222222.ADMIN_NAME || "").toLowerCase() === m.name.toLowerCase()) m.is_admin = 1;
  if (m && now() - m.last_seen > 45e3) await env222222.DB.prepare("UPDATE members SET last_seen=? WHERE id=?").bind(now(), m.id).run();
  return m;
}
__name(auth, "auth");
__name2(auth, "auth");
__name22(auth, "auth");
__name222(auth, "auth");
__name2222(auth, "auth");
__name22222(auth, "auth");
__name222222(auth, "auth");
function gameRow(g, me) {
  const players = JSON.parse(g.players);
  const state = g.state ? JSON.parse(g.state) : {};
  const lastWordPlay = g.type === "words" ? state.history?.at(-1) : null;
  return {
    id: g.id,
    room_id: g.room_id || 1,
    room_name: g.room_name || null,
    type: g.type,
    name: g.type === "shuffle" ? "Ohana Shuffle · " + (g.mode === "gin" ? "Gin Rummy" : "Regular Rummy") : GAME_TYPES[g.type]?.name || g.type,
    players,
    max_players: g.max_players,
    status: g.status,
    turn: g.turn,
    winner: g.winner,
    created_by: g.created_by,
    created_at: g.created_at,
    updated_at: g.updated_at,
    last_play: state.lastPlay || null,
    scores: state.scores ? Object.fromEntries(players.map((id) => [id, Number(state.scores[id]) || 0])) : null,
    last_score: lastWordPlay && Number.isFinite(lastWordPlay.score) ? { p: lastWordPlay.p, score: lastWordPlay.score } : null,
    my_turn: g.status === "playing" && players[g.turn] === me,
    in_game: players.includes(me),
    bot: g.state ? JSON.parse(g.state).bot || null : null,
    mode: g.mode || "classic",
    score_review: players.includes(me) && g.score_review ? JSON.parse(g.score_review) : null,
    invite_code: g.invite_code || null
  };
}
__name(gameRow, "gameRow");
__name2(gameRow, "gameRow");
__name22(gameRow, "gameRow");
__name222(gameRow, "gameRow");
__name2222(gameRow, "gameRow");
__name22222(gameRow, "gameRow");
__name222222(gameRow, "gameRow");
var VAPID_PUBLIC_KEY = "BD0GDGi2zMk91cWmhOB9CK9bLx8t53cJhTiLLm8TDSHycDV6b5ndcTUwRrzK5VstUuBkX34fSfYeT61r047zuwc";
// Read the encrypted Worker binding when signing; never cache or embed its value.
function ohanaVapidPrivateKey() {
  const value = OHANA_PUSH_ENV.VAPID_PRIVATE_KEY;
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value) || b64urlDecode(value).length !== 32) {
    throw new Error("Push signing is not configured.");
  }
  return value;
}
var VAPID_SUBJECT = "mailto:kevin.fudge911@gmail.com";
function b64urlDecode(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
__name(b64urlDecode, "b64urlDecode");
__name2(b64urlDecode, "b64urlDecode");
__name22(b64urlDecode, "b64urlDecode");
__name222(b64urlDecode, "b64urlDecode");
__name2222(b64urlDecode, "b64urlDecode");
__name22222(b64urlDecode, "b64urlDecode");
__name222222(b64urlDecode, "b64urlDecode");
function b64urlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(b64urlEncode, "b64urlEncode");
__name2(b64urlEncode, "b64urlEncode");
__name22(b64urlEncode, "b64urlEncode");
__name222(b64urlEncode, "b64urlEncode");
__name2222(b64urlEncode, "b64urlEncode");
__name22222(b64urlEncode, "b64urlEncode");
__name222222(b64urlEncode, "b64urlEncode");
async function createVapidJwt(audience) {
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1e3) + 3600,
    sub: VAPID_SUBJECT
  };
  const encHeader = b64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encPayload = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsigned = `${encHeader}.${encPayload}`;
  const rawKey = b64urlDecode(ohanaVapidPrivateKey());
  const pubKey = b64urlDecode(VAPID_PUBLIC_KEY);
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: b64urlEncode(pubKey.slice(1, 33)),
    y: b64urlEncode(pubKey.slice(33, 65)),
    d: b64urlEncode(rawKey)
  };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(unsigned));
  const sigBytes = new Uint8Array(sig);
  let rawSig;
  if (sigBytes.length === 64) {
    rawSig = sigBytes;
  } else {
    rawSig = sigBytes;
  }
  return `${unsigned}.${b64urlEncode(rawSig)}`;
}
__name(createVapidJwt, "createVapidJwt");
__name2(createVapidJwt, "createVapidJwt");
__name22(createVapidJwt, "createVapidJwt");
__name222(createVapidJwt, "createVapidJwt");
__name2222(createVapidJwt, "createVapidJwt");
__name22222(createVapidJwt, "createVapidJwt");
__name222222(createVapidJwt, "createVapidJwt");
async function encryptPayload(p256dhB64, authB64, payloadText) {
  const clientPublicKey = b64urlDecode(p256dhB64);
  const clientAuth = b64urlDecode(authB64);
  const payload = new TextEncoder().encode(payloadText);
  const ephemeral = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const ephemeralPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", ephemeral.publicKey));
  const clientKey = await crypto.subtle.importKey("raw", clientPublicKey, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: clientKey }, ephemeral.privateKey, 256));
  const enc = new TextEncoder();
  const prk = await hkdfExtract(clientAuth, sharedSecret);
  const ikm = await hkdfExpand(prk, new Uint8Array([...enc.encode("WebPush: info\0"), ...clientPublicKey, ...ephemeralPublicRaw]), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk2 = await hkdfExtract(salt, ikm);
  const contentKey = await hkdfExpand(prk2, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk2, enc.encode("Content-Encoding: nonce\0"), 12);
  const padded = new Uint8Array([...payload, 2]);
  const aesKey = await crypto.subtle.importKey("raw", contentKey, "AES-GCM", false, ["encrypt"]);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, padded));
  const header = new Uint8Array(86);
  header.set(salt);
  new DataView(header.buffer).setUint32(16, 4096);
  header[20] = 65;
  header.set(ephemeralPublicRaw, 21);
  return { encrypted: new Uint8Array([...header, ...encrypted]), salt, ephemeralPublicRaw };
}
__name(encryptPayload, "encryptPayload");
__name2(encryptPayload, "encryptPayload");
__name22(encryptPayload, "encryptPayload");
__name222(encryptPayload, "encryptPayload");
__name2222(encryptPayload, "encryptPayload");
__name22222(encryptPayload, "encryptPayload");
__name222222(encryptPayload, "encryptPayload");
async function hkdfExtract(salt, ikm) {
  const key = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, ikm));
}
__name(hkdfExtract, "hkdfExtract");
__name2(hkdfExtract, "hkdfExtract");
__name22(hkdfExtract, "hkdfExtract");
__name222(hkdfExtract, "hkdfExtract");
__name2222(hkdfExtract, "hkdfExtract");
__name22222(hkdfExtract, "hkdfExtract");
__name222222(hkdfExtract, "hkdfExtract");
async function hkdfExpand(prk, info322222, length) {
  const key = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const input = new Uint8Array([...info322222, 1]);
  const output = new Uint8Array(await crypto.subtle.sign("HMAC", key, input));
  return output.slice(0, length);
}
__name(hkdfExpand, "hkdfExpand");
__name2(hkdfExpand, "hkdfExpand");
__name22(hkdfExpand, "hkdfExpand");
__name222(hkdfExpand, "hkdfExpand");
__name2222(hkdfExpand, "hkdfExpand");
__name22222(hkdfExpand, "hkdfExpand");
__name222222(hkdfExpand, "hkdfExpand");
async function sendPush(subscription, payloadObj) {
  try {
    ohanaVapidPrivateKey(); // Missing configuration must stop before encryption or delivery.
    const payloadText = JSON.stringify(payloadObj);
    const { encrypted, salt, ephemeralPublicRaw } = await encryptPayload(subscription.p256dh, subscription.auth, payloadText);
    const endpoint = subscription.endpoint;
    const url = new URL(endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const jwt = await createVapidJwt(audience);
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        "Authorization": `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
        "Urgency": "high",
        "TTL": "86400"
      },
      body: encrypted
    });
    return resp.status;
  } catch (e) {
    return 0;
  }
}
__name(sendPush, "sendPush");
__name2(sendPush, "sendPush");
__name22(sendPush, "sendPush");
__name222(sendPush, "sendPush");
__name2222(sendPush, "sendPush");
__name22222(sendPush, "sendPush");
__name222222(sendPush, "sendPush");
async function notifyMembers(db, memberIds, payload) {
  if (!memberIds.length) return;
  const placeholders = memberIds.map(() => "?").join(",");
  const subs = (await db.prepare(`SELECT * FROM push_subscriptions WHERE member_id IN (${placeholders})`).bind(...memberIds).all()).results;
  const toDelete = [];
  for (const sub of subs) {
    let status = await sendPush(sub, payload);
    if (status === 0 || status === 429 || status >= 500) status = await sendPush(sub, payload);
    if (status < 200 || status >= 300) console.warn("Push delivery failed", sub.member_id, status);
    if (status === 404 || status === 410) {
      toDelete.push(sub.id);
    }
  }
  for (const id of toDelete) {
    await db.prepare("DELETE FROM push_subscriptions WHERE id=?").bind(id).run();
  }
}
__name(notifyMembers, "notifyMembers");
__name2(notifyMembers, "notifyMembers");
__name22(notifyMembers, "notifyMembers");
__name222(notifyMembers, "notifyMembers");
__name2222(notifyMembers, "notifyMembers");
__name22222(notifyMembers, "notifyMembers");
__name222222(notifyMembers, "notifyMembers");
async function notifyTurnIfAway(db, memberIds, payload) {
  if (!memberIds || !memberIds.length) return;
  const placeholders = memberIds.map(() => "?").join(",");
  const rows = (await db.prepare(`SELECT id,last_seen FROM members WHERE id IN (${placeholders})`).bind(...memberIds).all()).results;
  const away = rows.filter((r) => now() - (r.last_seen || 0) > 9e4).map((r) => r.id);
  if (away.length) return notifyMembers(db, away, payload);
}
__name(notifyTurnIfAway, "notifyTurnIfAway");
__name2(notifyTurnIfAway, "notifyTurnIfAway");
__name22(notifyTurnIfAway, "notifyTurnIfAway");
__name222(notifyTurnIfAway, "notifyTurnIfAway");
__name2222(notifyTurnIfAway, "notifyTurnIfAway");
__name22222(notifyTurnIfAway, "notifyTurnIfAway");
function puzzleRng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 1831565813;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
__name(puzzleRng, "puzzleRng");
__name2(puzzleRng, "puzzleRng");
__name22(puzzleRng, "puzzleRng");
__name222(puzzleRng, "puzzleRng");
__name2222(puzzleRng, "puzzleRng");
var PUZZLE_STYLES = { mix: [1, 2, 3, 4, 5, 6, 0], classic: [0], hibiscus: [1], honu: [2], shell: [3], wave: [4], leaf: [5], heart: [6] };
function puzzleEdges(cols, rows, seed, style) {
  const r = puzzleRng(seed), h = [], v = [], th = [], tv = [];
  const types = PUZZLE_STYLES[style] || PUZZLE_STYLES.mix;
  const pick = /* @__PURE__ */ __name2222(() => types[Math.floor(r() * types.length)], "pick");
  for (let y = 0; y < rows - 1; y++) {
    h[y] = [];
    th[y] = [];
    for (let x = 0; x < cols; x++) {
      h[y][x] = r() < 0.5 ? 1 : -1;
      th[y][x] = pick();
    }
  }
  for (let y = 0; y < rows; y++) {
    v[y] = [];
    tv[y] = [];
    for (let x = 0; x < cols - 1; x++) {
      v[y][x] = r() < 0.5 ? 1 : -1;
      tv[y][x] = pick();
    }
  }
  return { h, v, th, tv };
}
__name(puzzleEdges, "puzzleEdges");
__name2(puzzleEdges, "puzzleEdges");
__name22(puzzleEdges, "puzzleEdges");
__name222(puzzleEdges, "puzzleEdges");
__name2222(puzzleEdges, "puzzleEdges");
function puzzleTrayDeploymentPlan(data,requestedIds,area=null,holder=0,fromTray=false){
 const meta=data?.meta,P=data?.pieces;if(!meta||!Array.isArray(P)||!Array.isArray(requestedIds))return {moves:[],reason:'not-ready'};
 const pw=meta.w/meta.cols,ph=meta.h/meta.rows;if(!(pw>0&&ph>0))return {moves:[],reason:'not-ready'};
 const groups=new Map();for(const q of P){const g=q.g??q.i;if(!groups.has(g))groups.set(g,[]);groups.get(g).push(q);}
 const byId=new Map(P.map(q=>[q.i,q])),seen=new Set(),moves=[],activeHold=q=>!!q.h&&Date.now()-(q.ht||0)<=15000;
 const cx=area&&Number.isFinite(area.x0)&&Number.isFinite(area.x1)?(area.x0+area.x1)/2:meta.w/2,cy=area&&Number.isFinite(area.y0)&&Number.isFinite(area.y1)?(area.y0+area.y1)/2:meta.h/2;
 for(const i of requestedIds){const pc=byId.get(i);if(!pc)continue;const g=pc.g??pc.i;if(seen.has(g))continue;seen.add(g);const members=groups.get(g);
  if(members.some(q=>q.l||(activeHold(q)&&!(fromTray&&q.h===holder&&q._pzOriginTrayEntry))||!(q.tray||!q.onTable||q.catalogReady||(q.h&&q._pzOriginTrayEntry&&(!activeHold(q)||fromTray&&q.h===holder)))))continue;
  const base=members[0],offsets=members.map(q=>({q,dx:q.x-base.x,dy:q.y-base.y})),bounds=offsets.map(o=>puzzlePieceBounds(meta,o.q,o.dx,o.dy));
  const loX=-Math.min(...bounds.map(b=>b.x0)),hiX=meta.w-Math.max(...bounds.map(b=>b.x1)),loY=-Math.min(...bounds.map(b=>b.y0)),hiY=meta.h-Math.max(...bounds.map(b=>b.y1));if(loX>hiX||loY>hiY)continue;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),x=clamp(cx-pw/2,loX,hiX),y=clamp(cy-ph/2,loY,hiY),spots=[[x,y]];
  for(let n=1;n<=24;n++){const angle=n*2.399963229728653,step=Math.ceil(n/6);spots.push([clamp(x+Math.cos(angle)*pw*.6*step,loX,hiX),clamp(y+Math.sin(angle)*ph*.6*step,loY,hiY)]);}
  const tol=Math.min(pw,ph)*.3,safe=spots.filter(([a,b])=>offsets.every(o=>Math.abs(a+o.dx-o.q.c*pw)>=tol||Math.abs(b+o.dy-o.q.r*ph)>=tol));
  const candidates=safe.length?safe:spots;let best=candidates[0],score=Infinity;
  for(const spot of candidates){let overlap=0;for(const o of offsets){const b=puzzlePieceBounds(meta,o.q,spot[0]+o.dx,spot[1]+o.dy);for(const q of P)if((q.g??q.i)!==g&&!q.tray&&q.onTable){const z=puzzlePieceBounds(meta,q);if(Math.min(b.x1,z.x1)>Math.max(b.x0,z.x0)&&Math.min(b.y1,z.y1)>Math.max(b.y0,z.y0))overlap++;}}const cost=overlap*pw*ph*4+(spot[0]-x)**2+(spot[1]-y)**2;if(cost<score){score=cost;best=spot;}}
  for(const o of offsets)moves.push({i:o.q.i,x:best[0]+o.dx,y:best[1]+o.dy});
 }
 return {moves,reason:moves.length?'':'none'};
}

function puzzleInsideDeploymentPlan(data,edgesOnly=true,requestedIds=null,area=null){
 const meta=data?.meta,P=data?.pieces;if(!meta||!Array.isArray(P))return {moves:[],reason:'not-ready'};
 const {w,h,cols,rows}=meta,pw=w/cols,ph=h/rows;if(!(pw>0&&ph>0))return {moves:[],reason:'not-ready'};
 const group=pc=>pc.g??pc.i,sizes=new Map();for(const pc of P)sizes.set(group(pc),(sizes.get(group(pc))||0)+1);
 const requested=Array.isArray(requestedIds)?new Set(requestedIds):null,edge=pc=>pc.r===0||pc.c===0||pc.r===rows-1||pc.c===cols-1;
 const targets=P.filter(pc=>!pc.l&&!pc.h&&sizes.get(group(pc))===1&&(!edgesOnly||edge(pc))&&(!requested||requested.has(pc.i))&&(pc.tray||!pc.onTable||pc.catalogReady));
 if(!targets.length)return {moves:[],reason:'none'};
 const work=P.map(pc=>({...pc})),byId=new Map(work.map(pc=>[pc.i,pc])),pad=Math.min(pw,ph)*.36,tol=Math.min(pw,ph)*.3,slots=[],moves=[];
 let x0=pad,y0=pad,x1=w-pad,y1=h-pad;const blocked=[];
 if(area!==null){
  if(!area||!['x0','y0','x1','y1'].every(key=>Number.isFinite(area[key]))||area.x1<=area.x0||area.y1<=area.y0)return {moves:[],reason:'view-unavailable'};
  x0=Math.max(x0,area.x0+pad);y0=Math.max(y0,area.y0+pad);x1=Math.min(x1,area.x1-pad);y1=Math.min(y1,area.y1-pad);
  if(area.blocked!==undefined){if(!Array.isArray(area.blocked)||area.blocked.length>5)return {moves:[],reason:'view-unavailable'};for(const rect of area.blocked){if(!rect||!['x0','y0','x1','y1'].every(key=>Number.isFinite(rect[key]))||rect.x1<=rect.x0||rect.y1<=rect.y0)return {moves:[],reason:'view-unavailable'};blocked.push(rect);}}
 }
 const xmin=Math.ceil(x0),ymin=Math.ceil(y0),xmax=Math.floor(x1-pw),ymax=Math.floor(y1-ph),crowded=area===null?'crowded':'visible-crowded';
 if(xmin>xmax||ymin>ymax)return {moves:[],reason:crowded};
 if(area!==null)slots.push([Math.round((xmin+xmax)/2),Math.round((ymin+ymax)/2)]);
 for(let y=ymin;y<=ymax;y+=ph*1.8)for(let x=xmin;x<=xmax;x+=pw*1.8)slots.push([Math.round(x),Math.round(y)]);
 if(area!==null){slots.push([xmin,ymin],[xmax,ymin],[xmin,ymax],[xmax,ymax]);const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;slots.sort((a,b)=>(a[0]-cx)**2+(a[1]-cy)**2-((b[0]-cx)**2+(b[1]-cy)**2));}
 if(blocked.length){const xs=new Set([xmin,xmax,Math.round((xmin+xmax)/2)]),ys=new Set([ymin,ymax,Math.round((ymin+ymax)/2)]);for(const rect of blocked){xs.add(Math.floor(rect.x0-pw-pad));xs.add(Math.ceil(rect.x1+pad));ys.add(Math.floor(rect.y0-ph-pad));ys.add(Math.ceil(rect.y1+pad));}for(const x of xs)for(const y of ys)slots.push([x,y]);const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;slots.sort((a,b)=>(a[0]-cx)**2+(a[1]-cy)**2-((b[0]-cx)**2+(b[1]-cy)**2));}
 const free=(pc,x,y)=>{
  if(x<x0||x+pw>x1||y<y0||y+ph>y1)return false;
  if(blocked.some(rect=>x+pw+pad>rect.x0&&x-pad<rect.x1&&y+ph+pad>rect.y0&&y-pad<rect.y1))return false;
  if(Math.abs(x-pc.c*pw)<tol&&Math.abs(y-pc.r*ph)<tol)return false;
  for(const q of work)if(q.i!==pc.i&&!q.tray&&Math.abs(q.x-x)<pw+pad*2-.5&&Math.abs(q.y-y)<ph+pad*2-.5)return false;
  for(const [dr,dc]of [[0,1],[0,-1],[1,0],[-1,0]]){const nr=pc.r+dr,nc=pc.c+dc;if(nr<0||nc<0||nr>=rows||nc>=cols)continue;const nb=work.find(q=>q.r===nr&&q.c===nc);if(nb&&!nb.l&&!nb.tray&&group(nb)!==group(pc)&&Math.abs(x-(nb.x-dc*pw))<tol&&Math.abs(y-(nb.y-dr*ph))<tol)return false;}
  return true;
 };
 let cursor=0;
 for(const target of targets){const pc=byId.get(target.i);let spot=null;while(cursor<slots.length){const [x,y]=slots[cursor++];if(free(pc,x,y)){spot=[x,y];break;}}
  if(!spot)return {moves:[],reason:crowded};
  moves.push({i:pc.i,x:spot[0],y:spot[1]});pc.x=spot[0];pc.y=spot[1];pc.tray=null;pc.onTable=true;pc.catalogReady=false;
 }
 return {moves,reason:''};
}
function puzzleWorkspace(meta){
 const {w,h,cols,rows}=meta,pw=w/cols,ph=h/rows,t=meta.table||{};
 const side=Math.max(pw*3,w*.35),top=Math.max(ph*3,h*.22),pad=Math.min(pw,ph)*.4;
 const n=Math.max(1,Math.floor((w+side*2-pad*2-pw)/(pw*1.8))+1);
 const bottom=h+pad*2+(Math.ceil(cols*rows*1.15/n)-1)*ph*1.8+ph+pad;
 return {x0:Math.min(-side,t.x0??0),y0:Math.min(-top,t.y0??0),x1:Math.max(w+side,t.x1??w),y1:Math.max(bottom,t.y1??h)};
}
function puzzleGridSlots(meta){
 const {w,h,cols,rows}=meta,pw=w/cols,ph=h/rows,b=puzzleWorkspace(meta),pad=Math.min(pw,ph)*.4;
 const n=Math.max(1,Math.floor((b.x1-b.x0-pad*2-pw)/(pw*1.8))+1),slots=[];
 for(let r=0;r<Math.ceil(cols*rows*1.15/n);r++)for(let c=0;c<n;c++)slots.push([Math.round(b.x0+pad+c*pw*1.8),Math.round(h+pad*2+r*ph*1.8)]);
 return slots;
}
function puzzleOnTable(meta,q){const pw=meta.w/meta.cols,ph=meta.h/meta.rows;return !!(q.l||q.h||q.onTable||(q.x+pw*.5>=0&&q.x+pw*.5<=meta.w&&q.y+ph*.5>=0&&q.y+ph*.5<=meta.h));}
function puzzleFindSpot(meta,pieces,members,tx,ty,rows,limits=null){
 const pw=meta.w/meta.cols,ph=meta.h/meta.rows,pad=Math.min(pw,ph)*(rows?.36:.18),b=puzzleWorkspace(meta),base=members[0];
 if(!base)return [tx,ty];
 const offsets=members.map(q=>({x:q.x-base.x,y:q.y-base.y})),ids=new Set(members.map(q=>q.i));
 // Unplaced off-picture pieces are represented in the virtual tray, not on the table.
 const others=pieces.filter(q=>!q.tray&&!ids.has(q.i)&&(rows||puzzleOnTable(meta,q)));
 const xmin=Math.ceil(Math.max(b.x0+pad,limits?.x0??-Infinity)-Math.min(...offsets.map(q=>q.x))),xmax=Math.floor(Math.min(b.x1-pw-pad,limits?.x1??Infinity)-Math.max(...offsets.map(q=>q.x)));
 const ymin=Math.ceil(Math.max(b.y0+pad,limits?.y0??-Infinity)-Math.min(...offsets.map(q=>q.y))),ymax=Math.floor(Math.min(b.y1-ph-pad,limits?.y1??Infinity)-Math.max(...offsets.map(q=>q.y)));
 if(xmin>xmax||ymin>ymax)return null;
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 tx=clamp(Math.round(tx),xmin,xmax);ty=clamp(Math.round(ty),ymin,ymax);
 const gx=pw+pad*2-.5,gy=ph+pad*2-.5;
 const free=(x,y)=>x>=xmin&&x<=xmax&&y>=ymin&&y<=ymax&&!offsets.some(o=>others.some(q=>Math.abs(q.x-x-o.x)<gx&&Math.abs(q.y-y-o.y)<gy));
 // Clear drops stay where the player puts them. Initial scatter and Tidy still arrange rows.
 if(free(tx,ty))return [tx,ty];
 const candidates=[],seen=new Set(),xs=new Set([tx]),ys=new Set([ty]);
 const add=(x,y)=>{x=clamp(Math.round(x),xmin,xmax);y=clamp(Math.round(y),ymin,ymax);const key=x+','+y;if(!seen.has(key)){seen.add(key);candidates.push([x,y]);}};
 for(const o of offsets)for(const q of others){
  const left=Math.floor(q.x-o.x-gx),right=Math.ceil(q.x-o.x+gx),above=Math.floor(q.y-o.y-gy),below=Math.ceil(q.y-o.y+gy);
  add(left,ty);add(right,ty);add(tx,above);add(tx,below);
  if(Math.abs(q.x-tx-o.x)<gx&&Math.abs(q.y-ty-o.y)<gy){xs.add(left);xs.add(right);ys.add(above);ys.add(below);}
 }
 for(const x of xs)for(const y of ys)add(x,y);
 if(rows)for(const [x,y] of puzzleGridSlots(meta))add(x,y);
 if(limits)for(let y=ymin;y<=ymax;y+=gy)for(let x=xmin;x<=xmax;x+=gx)add(x,y);
 add(xmin,ty);add(xmax,ty);add(tx,ymin);add(tx,ymax);
 const distance=p=>(p[0]-tx)**2+(p[1]-ty)**2;
 candidates.sort((a,b)=>distance(a)-distance(b)||a[1]-b[1]||a[0]-b[0]);
 for(const [x,y] of candidates)if((rows||limits||Math.hypot(x-tx,y-ty)<=Math.max(pw,ph)*1.25)&&free(x,y))return [x,y];
 return null;
}
// Coordinates are unzoomed puzzle-space coordinates; only settled exterior
// intersections are blocked. Temporary overlap wholly inside the board is legal.
function puzzlePieceBounds(meta,q,x=q.x,y=q.y){
 const pw=meta.w/meta.cols,ph=meta.h/meta.rows,tab=Math.min(pw,ph)*.36;
 return {x0:x-(q.c===0?0:tab),y0:y-(q.r===0?0:tab),x1:x+pw+(q.c===meta.cols-1?0:tab),y1:y+ph+(q.r===meta.rows-1?0:tab)};
}
function puzzleExteriorIntersects(meta,a,b){
 const x0=Math.max(a.x0,b.x0),y0=Math.max(a.y0,b.y0),x1=Math.min(a.x1,b.x1),y1=Math.min(a.y1,b.y1);
 return x1>x0+.01&&y1>y0+.01&&(x0<0||y0<0||x1>meta.w||y1>meta.h);
}
function puzzleExtendSurface(meta,pieces){
 const b=puzzleWorkspace(meta);
 for(const q of pieces)if(!q.tray){const r=puzzlePieceBounds(meta,q);b.x0=Math.min(b.x0,Math.floor(r.x0)-2);b.y0=Math.min(b.y0,Math.floor(r.y0)-2);b.x1=Math.max(b.x1,Math.ceil(r.x1)+2);b.y1=Math.max(b.y1,Math.ceil(r.y1)+2);}
 meta.table=b;return b;
}
function puzzleSettleExterior(meta,pieces,members){
 if(!members.length||members.some(q=>q.l))return;
 const base=members[0],ids=new Set(members.map(q=>q.i)),other=pieces.filter(q=>!q.tray&&!ids.has(q.i)),rects=other.map(q=>puzzlePieceBounds(meta,q));
 const offsets=members.map(q=>({q,dx:q.x-base.x,dy:q.y-base.y})),origin={x:base.x,y:base.y};
 const bounds=(x,y)=>offsets.map(o=>puzzlePieceBounds(meta,o.q,x+o.dx,y+o.dy));
 const outside=b=>b.x0<0||b.y0<0||b.x1>meta.w||b.y1>meta.h;
 const wasOutside=bounds(origin.x,origin.y).some(outside);
 const free=(x,y)=>{const bs=bounds(x,y);return (!wasOutside||bs.some(outside))&&!bs.some(b=>rects.some(r=>puzzleExteriorIntersects(meta,b,r)));};
 if(free(origin.x,origin.y))return;
 const own=bounds(0,0),left=Math.min(...own.map(b=>b.x0)),right=Math.max(...own.map(b=>b.x1)),top=Math.min(...own.map(b=>b.y0)),bottom=Math.max(...own.map(b=>b.y1));
 const candidates=[];
 for(const r of rects){candidates.push([Math.floor(r.x0-right-2),origin.y],[Math.ceil(r.x1-left+2),origin.y],[origin.x,Math.floor(r.y0-bottom-2)],[origin.x,Math.ceil(r.y1-top+2)]);}
 candidates.sort((a,b)=>(a[0]-origin.x)**2+(a[1]-origin.y)**2-((b[0]-origin.x)**2+(b[1]-origin.y)**2)||a[1]-b[1]||a[0]-b[0]);
 let spot=candidates.find(p=>free(p[0],p[1]));
 // A finite set of existing pieces always leaves space below its lowest bound.
 if(!spot)spot=[Math.round(origin.x),Math.ceil(Math.max(meta.h,...rects.map(r=>r.y1))-top+2)];
 const dx=spot[0]-origin.x,dy=spot[1]-origin.y;
 for(const q of members){q.x+=dx;q.y+=dy;}
 puzzleExtendSurface(meta,pieces);
}
function puzzleTidyAround(meta,pieces,targets){
 const {w,h,cols,rows}=meta,pw=w/cols,ph=h/rows,tab=Math.min(pw,ph)*.36,gap=2,sx=pw+tab*2+gap,sy=ph+tab*2+gap;
 const requested=new Set(targets.map(q=>q.i)),groups=new Map();
 for(const q of pieces){const key=q.g??q.i;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q);}
 const units=[],seen=new Set();
 for(const q of targets){const key=q.g??q.i;if(seen.has(key))continue;seen.add(key);const members=groups.get(key);
  if(members.length===1&&members.every(p=>requested.has(p.i)&&!p.l&&!p.h&&!p.tray))units.push(members);
 }
 const ids=new Set(units.flatMap(u=>u.map(q=>q.i))),occupied=pieces.filter(q=>!q.tray&&!ids.has(q.i)).map(q=>puzzlePieceBounds(meta,q));
 const nx=Math.max(1,Math.floor(w/sx)),ny=Math.max(1,Math.floor(h/sy)),pitchX=w/nx,pitchY=h/ny;
 // Finish every side of the nearest ring before using the next ring.
 function* slots(){
  // Spread each axis remainder across its slots instead of leaving one wide seam.
  const xAt=i=>i<0?-gap+i*pitchX:i>=nx?w+gap+(i-nx)*pitchX:i*pitchX;
  const yAt=i=>i<0?-gap+i*pitchY:i>=ny?h+gap+(i-ny)*pitchY:i*pitchY;
  for(let ring=0;;ring++){
   const left=-ring-1,right=nx+ring,top=-ring-1,bottom=ny+ring;
   for(let x=left;x<=right;x++)yield {x:xAt(x),y:yAt(top)};
   for(let y=top+1;y<=bottom;y++)yield {x:xAt(right),y:yAt(y)};
   for(let x=right-1;x>=left;x--)yield {x:xAt(x),y:yAt(bottom)};
   for(let y=bottom-1;y>top;y--)yield {x:xAt(left),y:yAt(y)};
  }
 }
 const iterator=slots();
 for(const members of units){
  const base=members[0],offsets=members.map(q=>({q,dx:q.x-base.x,dy:q.y-base.y}));
  const rects=(x,y)=>offsets.map(o=>puzzlePieceBounds(meta,o.q,x+o.dx,y+o.dy)),initial=rects(0,0);
  const own={x0:Math.min(...initial.map(b=>b.x0)),y0:Math.min(...initial.map(b=>b.y0)),x1:Math.max(...initial.map(b=>b.x1)),y1:Math.max(...initial.map(b=>b.y1))};let x,y,bs;
  do{const slot=iterator.next().value;x=Math.ceil(slot.x-own.x0);y=Math.ceil(slot.y-own.y0);
   bs=rects(x,y);
  }while(bs.some(b=>occupied.some(r=>puzzleExteriorIntersects(meta,b,r))));
  for(const o of offsets){o.q.x=x+o.dx;o.q.y=y+o.dy;o.q.onTable=true;}
  occupied.push(...bs);
 }
 puzzleExtendSurface(meta,pieces);
}

function puzzleArrangeRows(meta,pieces,targets){
 const ids=new Set(targets.map(q=>q.i)),occupied=pieces.filter(q=>!ids.has(q.i)),slots=puzzleGridSlots(meta);
 const pw=meta.w/meta.cols,ph=meta.h/meta.rows,pad=Math.min(pw,ph)*.36;let k=0;
 for(const pc of targets){let spot=null;
  while(k<slots.length){const s=slots[k++];if(!occupied.some(q=>!q.tray&&Math.abs(q.x-s[0])<pw+pad*2-.5&&Math.abs(q.y-s[1])<ph+pad*2-.5)){spot=s;break;}}
  if(!spot)spot=puzzleFindSpot(meta,occupied.concat(pc),[pc],pc.x,pc.y,true);
  if(spot){pc.x=spot[0];pc.y=spot[1];pc.onTable=false;}puzzleSettleExterior(meta,occupied.concat(pc),[pc]);occupied.push(pc);
 }
}
function puzzleScatter(meta,pieces,rng2,onlyLoose){
 const targets=pieces.filter(pc=>!onlyLoose||(!pc.l&&!pc.h&&!pc.tray));
 for(let i=targets.length-1;i>0;i--){const j=Math.floor(rng2()*(i+1));[targets[i],targets[j]]=[targets[j],targets[i]];}
 puzzleArrangeRows(meta,pieces,targets);
}
__name(puzzleScatter, "puzzleScatter");
__name2(puzzleScatter, "puzzleScatter");
__name22(puzzleScatter, "puzzleScatter");
__name222(puzzleScatter, "puzzleScatter");
__name2222(puzzleScatter, "puzzleScatter");
function puzzleSlots(meta){return puzzleGridSlots(meta);}
__name(puzzleSlots, "puzzleSlots");
__name2(puzzleSlots, "puzzleSlots");
__name22(puzzleSlots, "puzzleSlots");
__name222(puzzleSlots, "puzzleSlots");
__name2222(puzzleSlots, "puzzleSlots");
function puzzleTable(w,h,cols,rows){return puzzleWorkspace({w,h,cols,rows});}
__name(puzzleTable, "puzzleTable");
__name2(puzzleTable, "puzzleTable");
__name22(puzzleTable, "puzzleTable");
__name222(puzzleTable, "puzzleTable");
__name2222(puzzleTable, "puzzleTable");
var PuzzleRoom = class {
  static {
    __name(this, "PuzzleRoom");
  }
  static {
    __name2(this, "PuzzleRoom");
  }
  static {
    __name22(this, "PuzzleRoom");
  }
  static {
    __name222(this, "PuzzleRoom");
  }
  static {
    __name2222(this, "PuzzleRoom");
  }
  constructor(ctx, env3) {
    this.ctx = ctx;
    this.env = env3;
    this.meta = null;
    this.pieces = null;
    this.trays = [];
    this.chat = [];
    this.dirty = false;
    this.saveTimer = null;
    this.seq = 0;
    this.events = [];
    this.ctx.blockConcurrencyWhile(async () => {
      this.meta = await ctx.storage.get("meta") || null;
      this.pieces = await ctx.storage.get("pieces") || null;
      this.trays = await ctx.storage.get("trays") || [];
      this.chat = await ctx.storage.get("chat") || [];
      this.seq = await ctx.storage.get("seq") || 0;
      this.stats = await ctx.storage.get("stats") || {};
      if (this.pieces) {
        for (const pc of this.pieces) if (pc.g === void 0) pc.g = pc.i;
        if(this.meta)puzzleExtendSurface(this.meta,this.pieces);
      }
    });
  }
  people() {
    const out = [], seen = /* @__PURE__ */ new Set();
    for (const ws of this.ctx.getWebSockets()) {
      const m = ws.deserializeAttachment();
      if (m && !seen.has(m.id)) {
        seen.add(m.id);
        out.push({ id: m.id, name: m.name, avatar: m.avatar, x: m.x, y: m.y });
      }
    }
    const now2 = Date.now();
    for (const [id, p] of Object.entries(this.pollers || {})) if (!seen.has(+id) && now2 - p.at < 30e3) {
      seen.add(+id);
      out.push({ id: +id, name: p.name, avatar: p.avatar, x: p.x, y: p.y });
    }
    return out;
  }
  broadcast(msg, except) {
    if(["drop","tidy","tray-piece","tray-return"].includes(msg.t)&&this.meta)msg.table=this.meta.table;
    msg.seq = ++this.seq;
    this.events.push(msg);
    if (this.events.length > 600) this.events = this.events.slice(-600);
    const s = JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === except) continue;
      try {
        ws.send(s);
      } catch {
      }
    }
  }
  scheduleSave() {
    this.dirty = true;
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      if (this.dirty) {
        this.dirty = false;
        this.ctx.storage.put({ pieces: this.pieces, trays: this.trays, seq: this.seq }).catch(() => {
        });
      }
    }, 1500);
  }
  summary() {
    const total = this.pieces ? this.pieces.length : 0, locked = this.pieces ? this.pieces.filter((p) => p.l).length : 0;
    return { total, locked, done: !!this.meta?.done, people: this.people().map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })), stats: this.stats || {} };
  }
  fullState(meId) {
    return { meta: this.meta, pieces: this.pieces, trays: this.trays || [], chat: this.chat.slice(-40), people: this.people(), me: meId, seq: this.seq, stats: this.stats || {} };
  }
  async fetch(req) {
    const url = new URL(req.url), p = url.pathname;
    if (p === "/init" && req.method === "POST") {
      const m = await req.json();
      const cols = m.cols, rows = m.rows, w = m.w, h = m.h, seed = m.seed || 1;
      const rng2 = puzzleRng(seed + 7);
      const table4 = puzzleTable(w, h, cols, rows);
      const pieces = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pieces.push({ i: pieces.length, r, c, x: 0, y: 0, l: false, h: null, g: pieces.length });
      this.meta = { cols, rows, w, h, seed, table: table4, style: PUZZLE_STYLES[m.style] ? m.style : "mix", edges: puzzleEdges(cols, rows, seed, PUZZLE_STYLES[m.style] ? m.style : "mix"), created: Date.now(), done: 0, roomId: m.roomId || null, name: m.name || "", puzzleId: m.puzzleId || null, creator: m.creator || null };
      this.stats = {};
      puzzleScatter(this.meta, pieces, rng2, false);
      this.pieces = pieces;
      this.trays = [];
      this.chat = [];
      this.seq = 0;
      this.events = [];
      await this.ctx.storage.put({ meta: this.meta, pieces: this.pieces, trays: [], chat: [], seq: 0, stats: {} });
      return Response.json({ ok: true });
    }
    if (p === "/summary") return Response.json(this.summary());
    if (p === "/state") return Response.json(this.fullState(null));
    if (p === "/reset" && req.method === "POST") {
      await this.ctx.storage.deleteAll();
      this.meta = null;
      this.pieces = null;
      this.chat = [];
      this.broadcast({ t: "closed" });
      for (const ws of this.ctx.getWebSockets()) {
        try {
          ws.close(1e3, "closed");
        } catch {
        }
      }
      return Response.json({ ok: true });
    }
    const member = /* @__PURE__ */ __name2222(() => ({ id: +req.headers.get("x-member-id"), name: req.headers.get("x-member-name") || "Someone", avatar: req.headers.get("x-member-avatar") || "@hon", admin: req.headers.get("x-member-host") === "1", x: null, y: null }), "member");
    if (p === "/events") {
      if (!this.meta) return Response.json({ error: "Puzzle not ready" }, { status: 409 });
      const me = member();
      const since = +url.searchParams.get("since") || 0;
      this.pollers = this.pollers || {};
      const prev = this.pollers[me.id];
      this.pollers[me.id] = { ...me, x: prev?.x ?? null, y: prev?.y ?? null, at: Date.now() };
      if (!prev || Date.now() - prev.at >= 30e3) this.broadcast({ t: "join", p: { id: me.id, name: me.name, avatar: me.avatar } });
      if (!since || since > this.seq || this.events.length && since < this.events[0].seq - 1) return Response.json({ full: this.fullState(me.id) });
      let events = this.events.filter((e) => e.seq > since);
      if (!events.length) {
        await new Promise((r) => setTimeout(r, 1500));
        events = this.events.filter((e) => e.seq > since);
      }
      return Response.json({ events, seq: this.seq, people: this.people() });
    }
    if (p === "/act" && req.method === "POST") {
      if (!this.meta) return Response.json({ error: "Puzzle not ready" }, { status: 409 });
      const me = member();
      this.pollers = this.pollers || {};
      const prev = this.pollers[me.id];
      this.pollers[me.id] = { ...prev, ...me, x: prev?.x ?? null, y: prev?.y ?? null, at: Date.now() };
      if (!prev || Date.now() - prev.at >= 30e3) this.broadcast({ t: "join", p: { id: me.id, name: me.name, avatar: me.avatar } });
      const acts = await req.json();
      const replies = [];
      for (const a of Array.isArray(acts) ? acts : [acts]) {
        const r = this.handle(me, a, null);
        if (r) replies.push(r);
      }
      return Response.json({ ok: true, replies, seq: this.seq });
    }
    if (p === "/ws") {
      if ((req.headers.get("upgrade") || "").toLowerCase() !== "websocket") return new Response("Expected websocket", { status: 426 });
      if (!this.meta) return new Response("Puzzle not ready", { status: 409 });
      const me = member();
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment(me);
      server.send(JSON.stringify({ t: "init", ...this.fullState(me.id) }));
      this.broadcast({ t: "join", p: { id: me.id, name: me.name, avatar: me.avatar } }, server);
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Not found", { status: 404 });
  }
  // Shared action handler for WS and HTTP. Returns a direct reply for the sender (or null).
  handle(me, m, ws) {
    const P = this.pieces;
    if (!P) return null;
    const piece = /* @__PURE__ */ __name2222((id) => P[id], "piece");
    const now2 = Date.now();
    if (m.t === "cursor") {
      me.x = m.x;
      me.y = m.y;
      if (ws) ws.serializeAttachment(me);
      else if (this.pollers?.[me.id]) {
        this.pollers[me.id].x = m.x;
        this.pollers[me.id].y = m.y;
      }
      this.broadcast({ t: "cursor", id: me.id, x: m.x, y: m.y }, ws);
      return null;
    }
    const group4 = /* @__PURE__ */ __name2222((g) => P.filter((q) => q.g === g && !q.l), "group");
    const heldByOther = (q) => q.h && q.h !== me.id && q.ht && now2 - q.ht < 15000;
    const deny = (pc) => ({ t: "deny", p: m.p, people: this.people(), pieces: pc ? P.filter(q => q.g === pc.g).map(q => ({ ...q })) : [] });
    if (m.t === "deploy") {
      const ids=Array.isArray(m.ids)?m.ids.filter(Number.isInteger):null;
      if(m.edges!==true&&!ids?.length)return null;
      const hasArea=m.edges===true&&Object.prototype.hasOwnProperty.call(m,"area");
      if(hasArea&&(!m.area||typeof m.area!=="object"||Array.isArray(m.area)))return {t:"tray-deny",text:"The visible puzzle area is unavailable. Try again without moving any pieces."};
      const area=hasArea?m.area:null;
      const plan=m.edges===true?puzzleInsideDeploymentPlan({meta:this.meta,pieces:P},true,ids,area):puzzleTrayDeploymentPlan({meta:this.meta,pieces:P},ids,m.area,me.id,m.fromTray===true);
      if(!plan.moves.length)return {t:"tray-deny",text:plan.reason==="visible-crowded"||plan.reason==="view-unavailable"?"There is no clear space in the visible puzzle area. Clear a space or zoom out, then try again. Your pieces are unchanged.":plan.reason==="crowded"?"There is not enough open space inside the puzzle to deploy safely. Your pieces are unchanged.":"No eligible loose pieces are available. Placed, held and joined pieces stay put."};
      for(const move of plan.moves){const q=P[move.i];q.x=move.x;q.y=move.y;q.tray=null;q.onTable=true;q.catalogReady=false;q.h=null;q.ht=null;delete q._pzOriginTrayEntry;}
      this.scheduleSave();
      this.broadcast({t:"tray-piece",ids:plan.moves.map(q=>q.i),tray:null,pieces:plan.moves.map(q=>[q.i,q.x,q.y]),deployed:true,edges:m.edges===true,by:me.id});
      return null;
    }
    if (m.t === "tray-create") {
      this.trays = this.trays || [];
      const id = [1, 2, 3, 4, 5].find((n) => !this.trays.some((t) => t.id === n));
      if (!id) return { t: "tray-deny", text: "Five trays are already on the table." };
      const tray = { id, name: "Tray " + id, color: "#247a88", x: Math.min(0.65, 0.08 + (id - 1) * 0.11), y: Math.min(0.55, 0.1 + (id - 1) * 0.1), docked: false };
      this.trays.push(tray);
      this.scheduleSave();
      this.broadcast({ t: "tray-update", tray });
      return null;
    }
    if (m.t === "tray-update") {
      const tray = (this.trays || []).find((t) => t.id === +m.id);
      if (!tray) return null;
      if (typeof m.name === "string") tray.name = m.name.trim().slice(0, 28) || "Tray " + tray.id;
      if (typeof m.color==="string"&&/^#[0-9a-f]{6}$/i.test(m.color)) tray.color = m.color.toLowerCase();
      if (Number.isFinite(m.x)) tray.x = Math.max(0, Math.min(0.85, m.x));
      if (Number.isFinite(m.y)) tray.y = Math.max(0, Math.min(0.85, m.y));
      if (typeof m.docked === "boolean") tray.docked = m.docked;
      this.scheduleSave();
      this.broadcast({ t: "tray-update", tray: { ...tray } });
      return null;
    }
    if (m.t === "tray-delete") {
      const tray = (this.trays || []).find((t) => t.id === +m.id);
      if (!tray || P.some((pc) => pc.tray === tray.id)) return { t: "tray-deny", text: "Empty the tray before removing it." };
      this.trays = this.trays.filter((t) => t.id !== tray.id);
      this.scheduleSave();
      this.broadcast({ t: "tray-delete", id: tray.id });
      return null;
    }
    if (m.t === "tray-add") {
      const pc = piece(m.p), tray = (this.trays || []).find((t) => t.id === +m.id);
      if (!pc || !tray || pc.l || pc.tray === tray.id) return { t: "tray-deny", text: "That piece cannot go in this tray." };
      const members = group4(pc.g);
      if (members.some((q) => q.tray !== pc.tray || q.h && q.h !== me.id && q.ht && now2 - q.ht < 15e3)) return { t: "tray-deny", text: "Someone else has that piece." };
      for (const q of members) {
        q.tray = tray.id;
        q.h = null;
        q.ht = null;
      }
      this.scheduleSave();
      this.broadcast({ t: "tray-piece", ids: members.map((q) => q.i), tray: tray.id });
      return null;
    }
    if (m.t === "tray-out") {
      const pc = piece(m.p);
      if (!pc || !pc.tray || !Number.isFinite(m.x) || !Number.isFinite(m.y)) return null;
      const members = group4(pc.g);
      if(pc.l||members.some(q=>q.tray!==pc.tray))return deny(pc);
      if (members.some(heldByOther)) return deny(pc);
      const surface=puzzleWorkspace(this.meta);
      const dx=Math.max(surface.x0,Math.min(surface.x1,m.x))-pc.x;
      const dy=Math.max(surface.y0,Math.min(surface.y1,m.y))-pc.y;
      for (const q of members) {
        q.tray = null;
        q.x += dx;
        q.y += dy;
        q.onTable = true;
        q.h = null;
        q.ht = null;
      }
      puzzleSettleExterior(this.meta,P,members);
      puzzleExtendSurface(this.meta,P);
      this.scheduleSave();
      this.broadcast({ t: "tray-piece", ids: members.map((q) => q.i), tray: null, pieces: members.map((q) => [q.i, q.x, q.y]) });
      return null;
    }
    if (m.t === "tray-return") {
      const pc=piece(m.p);if(!pc||pc.l||group4(pc.g).some(heldByOther))return deny(pc);
      const members=group4(pc.g),pw=this.meta.w/this.meta.cols,ph=this.meta.h/this.meta.rows,b=puzzleWorkspace(this.meta);
      let spot=puzzleFindSpot(this.meta,P,members,b.x0+pw,this.meta.h+ph,true,{y0:this.meta.h+ph*.4,y1:b.y1-ph});
      // These pieces are displayed in the virtual bottom tray, not the table.
      // A crowded off-picture staging area must never prevent returning a group.
      if(!spot){const base=members[0],minX=Math.min(...members.map(q=>q.x-base.x)),minY=Math.min(...members.map(q=>q.y-base.y));spot=[b.x0+pw-minX,this.meta.h+ph-minY];}
      const dx=spot[0]-members[0].x,dy=spot[1]-members[0].y;
      for(const q of members){q.x+=dx;q.y+=dy;q.onTable=false;q.tray=null;q.h=null;q.ht=null;delete q._pzOriginX;delete q._pzOriginY;}
      puzzleSettleExterior(this.meta,P,members);puzzleExtendSurface(this.meta,P);
      this.scheduleSave();this.broadcast({t:"tray-return",by:me.id,pieces:members.map(q=>({...q}))});return null;
    }
    if (m.t === "grab") {
      const pc = piece(m.p);
      if (!pc || pc.l || pc.tray) return deny(pc);
      const members = group4(pc.g);
      if (members.some(heldByOther)) return deny(pc);
      for (const q of members) {
        if(q.h!==me.id){q._pzOriginX=q.x;q._pzOriginY=q.y;q._pzOriginTrayEntry=!q.onTable||!!q.catalogReady;}
        q.h = me.id;
        q.ht = now2;
        q.catalogReady = false;
      }
      this.broadcast({ t: "grab", p: m.p, g: pc.g, by: me.id }, ws);
      return null;
    }
    if (m.t === "move") {
      const pc = piece(m.p);
      if (!pc || pc.l || pc.tray || group4(pc.g).some(heldByOther)) return deny(pc);
      if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) return null;
      const dx = m.x - pc.x, dy = m.y - pc.y;
      if (!dx && !dy) return null;
      for (const q of group4(pc.g)) {
        q.x += dx;
        q.y += dy;
        q.onTable = true;
        q.catalogReady = false;
        q.ht = now2;
      }
      this.broadcast({ t: "move", p: m.p, x: pc.x, y: pc.y, g: pc.g, by: me.id }, ws);
      return null;
    }
    if (m.t === "drop") {
      const pc = piece(m.p);
      if (!pc || pc.l || pc.tray || group4(pc.g).some(heldByOther)) return deny(pc);
      if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) return null;
      const {cols,rows,w,h}=this.meta,table4=puzzleWorkspace(this.meta),pw=w/cols,ph=h/rows;
      const tol = Math.min(pw, ph) * 0.3;
      let members = group4(pc.g);
      let dx = Math.max(table4.x0, Math.min(table4.x1 - pw, m.x)) - pc.x, dy = Math.max(table4.y0, Math.min(table4.y1 - ph, m.y)) - pc.y;
      for (const q of members) {
        q.x += dx;
        q.y += dy;
        q.onTable = true;
        q.catalogReady = false;
        q.h = null;
        q.ht = null;
      }
      let locked = false, joined = false;
      const onSpot = members.find((q) => Math.abs(q.x - q.c * pw) < tol && Math.abs(q.y - q.r * ph) < tol);
      if (onSpot) {
        for (const q of members) {
          q.x = q.c * pw;
          q.y = q.r * ph;
          q.l = true;
          q.h = null;
        }
        locked = true;
      } else {
        for (let pass = 0; pass < 4; pass++) {
          let merged = false;
          outer: for (const q of members) for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const nr = q.r + dr, nc = q.c + dc;
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            const nb = P[nr * cols + nc];
            if (!nb || nb.l || nb.tray || (m.looseView!==true&&!puzzleOnTable(this.meta,nb)) || nb.g === q.g || group4(nb.g).some(heldByOther)) continue;
            const ex = nb.x - dc * pw, ey = nb.y - dr * ph;
            if (Math.abs(q.x - ex) < tol && Math.abs(q.y - ey) < tol) {
              const sx = ex - q.x, sy = ey - q.y, newG = nb.g;
              for (const r2 of members) {
                r2.x += sx;
                r2.y += sy;
                r2.g = newG;
              }
              members = group4(newG);
              merged = joined = true;
              break outer;
            }
          }
          if (!merged) break;
        }
      }
      if(!locked&&!joined&&m.staged===true){
        const spot=puzzleFindSpot(this.meta,P,members,members[0].x,members[0].y,false,puzzleWorkspace(this.meta));
        if(spot){const dx=spot[0]-members[0].x,dy=spot[1]-members[0].y;for(const q of members){q.x+=dx;q.y+=dy;}}else{if(m.staged===true){for(const q of members){q.x=Number.isFinite(q._pzOriginX)?q._pzOriginX:q.x;q.y=Number.isFinite(q._pzOriginY)?q._pzOriginY:q.y;q.onTable=false;q.h=null;q.ht=null;delete q._pzOriginX;delete q._pzOriginY;}this.scheduleSave();this.broadcast({t:'stage-denied',by:me.id,pieces:members.map(q=>({...q}))});return null;}for(const q of members){q.h=me.id;q.ht=now2;}this.scheduleSave();this.broadcast({t:'drop-blocked',p:m.p,by:me.id,pieces:members.map(q=>[q.i,q.x,q.y])});return null;}
      }
      if(!locked)puzzleSettleExterior(this.meta,P,members);
      puzzleExtendSurface(this.meta,P);
      for(const q of members){delete q._pzOriginX;delete q._pzOriginY;}
      this.scheduleSave();
      if (locked || joined) {
        const st = this.stats[me.id] || (this.stats[me.id] = { name: me.name, avatar: me.avatar, placed: 0, joins: 0 });
        if (locked) st.placed += members.length;
        else st.joins += 1;
        this.ctx.storage.put("stats", this.stats).catch(() => {
        });
      }
      const lockedCount = P.filter((q) => q.l).length;
      this.broadcast({ t: "drop", p: m.p, g: members[0].g, pieces: members.map((q) => [q.i, q.x, q.y]), l: locked, joined, by: me.id, byName: me.name, clientAction:typeof m.clientAction==="string"&&m.clientAction.length<=100?m.clientAction:void 0, locked: lockedCount, stats: locked || joined ? this.stats : void 0 });
      if (lockedCount === P.length && !this.meta.done) {
        this.meta.done = now2;
        this.ctx.storage.put("meta", this.meta).catch(() => {
        });
        this.broadcast({ t: "done", at: now2, by: me.name, stats: this.stats });
        this.announceDone().catch(() => {
        });
      }
      return null;
    }
    if (m.t === "release") {
      const pc = piece(m.p);
      if (pc && pc.h === me.id) {
        for (const q of group4(pc.g)) {
          q.h = null;
          q.ht = null;
        }
        this.broadcast({ t: "release", p: m.p, g: pc.g }, ws);
      }
      return null;
    }
    if (m.t === "tidy") {
      const rng2 = puzzleRng(now2 & 65535);
      for (const pc of P) if (pc.h && now2 - (pc.ht || 0) > 15e3) {
        pc.h = null;
        pc.ht = null;
      }
      const protectedGroups=new Set(P.filter(pc=>pc.l||pc.h||pc.tray).map(pc=>pc.g));
      const sizes=new Map();for(const q of P)sizes.set(q.g,(sizes.get(q.g)||0)+1);
      const loose = P.filter(pc=>!protectedGroups.has(pc.g)&&sizes.get(pc.g)===1);
      // Mix before laying out: array/solution index must never reveal the picture.
      for(let i=loose.length-1;i>0;i--){const j=Math.floor(rng2()*(i+1));[loose[i],loose[j]]=[loose[j],loose[i]];}
      puzzleTidyAround(this.meta,P,loose);
      for(const q of loose)q.catalogReady=true;
      this.scheduleSave();
      this.broadcast({ t: "tidy", pieces: loose.map((q) => [q.i, q.x, q.y]), by: me.name, tabled:true, catalogReady:true });
      return null;
    }
    if (m.t === "shuffle") {
      const rng2 = puzzleRng((now2 ^ this.seq * 2654435761) & 2147483647);
      for (const pc of P) if (pc.h && now2 - (pc.ht || 0) > 15e3) {
        pc.h = null;
        pc.ht = null;
      }
      const sizes = {};
      for (const pc of P) if (!pc.l) sizes[pc.g] = (sizes[pc.g] || 0) + 1;
      const singles = P.filter((pc) => !pc.l && !pc.h && !pc.tray && sizes[pc.g] === 1);
      for (let i = singles.length - 1; i > 0; i--) {
        const j = Math.floor(rng2() * (i + 1));
        [singles[i], singles[j]] = [singles[j], singles[i]];
      }
      puzzleArrangeRows(this.meta,P,singles);
      this.scheduleSave();
      this.broadcast({ t: "tidy", pieces: singles.map((q) => [q.i, q.x, q.y]), by: me.name, shuffle: true });
      return null;
    }
    if (m.t === "recall") {
      const rng2 = puzzleRng(now2 & 65535);
      for (const pc of P) if (pc.h && now2 - (pc.ht || 0) > 15e3) {
        pc.h = null;
        pc.ht = null;
      }
      const slots = puzzleSlots(this.meta);
      for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(rng2() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }
      const pw = this.meta.w / this.meta.cols, ph = this.meta.h / this.meta.rows;
      const groups = {};
      for (const pc of P) {
        if (pc.l || pc.tray) continue;
        (groups[pc.g] = groups[pc.g] || []).push(pc);
      }
      const moved = [];
      let k = 0;
      for (const g in groups) {
        const mem = groups[g];
        if(mem.some(p=>p.h)||P.some(p=>p.g===mem[0].g&&(p.l||p.tray)))continue;
        const ax = Math.min(...mem.map((p) => p.x)), ay = Math.min(...mem.map((p) => p.y));
        const s = slots[k % slots.length];
        k++;
        const tx = Math.round(s[0] + (rng2() - 0.5) * pw * 0.25), ty = Math.round(s[1] + (rng2() - 0.5) * ph * 0.25);
        const dx = tx - ax, dy = ty - ay;
        for (const p of mem) {
          p.x += dx;
          p.y += dy;
          p.onTable = false;
          // Positions are recorded after resolving the complete joined group.
        }
        puzzleSettleExterior(this.meta,P,mem);
        for(const p of mem)moved.push([p.i,p.x,p.y]);
      }
      puzzleExtendSurface(this.meta,P);
      this.scheduleSave();
      this.broadcast({ t: "tidy", pieces: moved, by: me.name, recall: true });
      return null;
    }
    if (m.t === "restyle") {
      const style = PUZZLE_STYLES[m.style] ? m.style : "mix";
      this.meta.style = style;
      this.meta.edges = puzzleEdges(this.meta.cols, this.meta.rows, (this.meta.seed || 1) + (Date.now() & 4095), style);
      this.ctx.storage.put("meta", this.meta).catch(() => {
      });
      this.broadcast({ t: "restyle", style, edges: this.meta.edges, by: me.name });
      return null;
    }
    if (m.t === "recount") {
      if (!me.admin) return { t: "denyRecount" };
      const allowed = [24, 48, 100, 200, 300, 500, 750, 1e3];
      const n = allowed.includes(+m.pieces) ? +m.pieces : 100;
      const ar = this.meta.w / this.meta.h;
      let cols = Math.max(2, Math.round(Math.sqrt(n * ar))), rows = Math.max(2, Math.round(n / cols));
      while (cols * rows > 1050) cols--;
      const big = n >= 500 ? 2400 : n >= 200 ? 2e3 : 1600;
      const W = ar >= 1 ? big : Math.round(big * ar), H = ar >= 1 ? Math.round(big / ar) : big;
      const seed = Math.floor(Math.random() * 2e9);
      const rng2 = puzzleRng(seed + 7);
      const table4 = puzzleTable(W, H, cols, rows);
      const pieces = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pieces.push({ i: pieces.length, r, c, x: 0, y: 0, l: false, h: null, g: pieces.length });
      this.meta.cols = cols;
      this.meta.rows = rows;
      this.meta.w = W;
      this.meta.h = H;
      this.meta.seed = seed;
      this.meta.table = table4;
      this.meta.edges = puzzleEdges(cols, rows, seed, this.meta.style || "mix");
      this.meta.done = 0;
      puzzleScatter(this.meta, pieces, rng2, false);
      this.pieces = pieces;
      this.stats = {};
      this.ctx.storage.put({ meta: this.meta, pieces: this.pieces, stats: {} }).catch(() => {
      });
      if (this.meta.puzzleId && this.env.DB) {
        this.env.DB.prepare("UPDATE puzzles SET cols=?,rows=?,w=?,h=? WHERE id=?").bind(cols, rows, W, H, this.meta.puzzleId).run().catch(() => {
        });
      }
      this.broadcast({ t: "recount", cols, rows, w: W, h: H, edges: this.meta.edges, table: table4, pieces, stats: {}, by: me.name });
      return null;
    }
    if (m.t === "arrange") {
      const sizes = {};
      for (const pc of P) if (!pc.l) sizes[pc.g] = (sizes[pc.g] || 0) + 1;
      const ok = new Set(P.filter((pc) => !pc.l && !pc.h && !pc.tray && sizes[pc.g] === 1).map((pc) => pc.i));
      const order = (Array.isArray(m.order) ? m.order : []).filter((i) => ok.has(i));
      puzzleArrangeRows(this.meta,P,[...new Set(order)].map(i=>P[i]));
      this.scheduleSave();
      this.broadcast({ t: "tidy", pieces: order.map((i) => [i, P[i].x, P[i].y]), by: me.name, sorted: !m.edges&&!m.rows, edges: !!m.edges, rows: !!m.rows });
      return null;
    }
    if (m.t === "typing") {
      this.broadcast({ t: "typing", id: me.id, on: !!m.on }, ws);
      return null;
    }
    if (m.t === "chat") {
      const text = String(m.text || "").trim().slice(0, 240);
      if (!text) return null;
      const entry = { id: me.id, name: me.name, avatar: me.avatar, text, at: now2 };
      this.chat.push(entry);
      if (this.chat.length > 80) this.chat = this.chat.slice(-80);
      this.ctx.storage.put("chat", this.chat).catch(() => {
      });
      this.broadcast({ t: "chat", ...entry });
      if (this.meta && this.meta.roomId && me.id > 0) {
        try {
          this.env.DB.prepare("INSERT OR IGNORE INTO chat_messages(conversation,sender,text,image,created_at,source) VALUES(?,?,?,?,?,?)").bind("room:" + this.meta.roomId, me.id, text, null, now2, "pz:" + (this.meta.puzzleId || 0) + ":" + me.id + ":" + now2).run().catch(() => {
          });
        } catch {
        }
      }
      return null;
    }
    if (m.t === "ping") return { t: "pong", people: this.people() };
    return null;
  }
  async announceDone() {
    const m = this.meta;
    if (!m || !m.roomId || !this.env.DB) return;
    const who = Object.values(this.stats || {}).sort((a, b) => b.placed - a.placed).map((x) => x.name + " " + x.placed).join(" \xB7 ");
    await saveJourneyMemory(this.env.DB,m.puzzleId,m.roomId,this.stats);
    const text = "\u{1F9E9} We finished \u201C" + (m.name || "the puzzle") + "\u201D together \u2014 " + this.pieces.length + " pieces!" + (who ? " Pieces placed: " + who : "");
    await this.env.DB.prepare("INSERT OR IGNORE INTO chat_messages(conversation,sender,text,image,created_at,source) VALUES(?,?,?,?,?,?)").bind("room:" + m.roomId, m.creator || 0, text, null, Date.now(), "puzzle-done:" + m.puzzleId).run();
  }
  async webSocketMessage(ws, raw) {
    let m;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    const me = ws.deserializeAttachment();
    if (!me) return;
    const r = this.handle(me, m, ws);
    if (r) {
      try {
        ws.send(JSON.stringify(r));
      } catch {
      }
    }
  }
  async webSocketClose(ws) {
    this.leave(ws);
  }
  async webSocketError(ws) {
    this.leave(ws);
  }
  leave(ws) {
    const me = ws.deserializeAttachment();
    try {
      ws.close();
    } catch {
    }
    if (!me) return;
    const still = this.ctx.getWebSockets().some((o) => o !== ws && o.deserializeAttachment()?.id === me.id);
    if (still) return;
    if (this.pieces) {
      const gs = /* @__PURE__ */ new Set();
      for (const pc of this.pieces) if (pc.h === me.id) {
        pc.h = null;
        pc.ht = null;
        gs.add(pc.g);
      }
      for (const g of gs) {
        const any = this.pieces.find((q) => q.g === g);
        if (any) this.broadcast({ t: "release", p: any.i, g });
      }
    }
    this.broadcast({ t: "leave", id: me.id, people: this.people().filter((p) => p.id !== me.id) });
  }
};
__name22222(PuzzleRoom, "PuzzleRoom");
var PUZZLE_PICTURES = { "luau-sunset": "/puzzle-luau-sunset.webp", "waterfall-garden": "/puzzle-waterfall-garden.webp", "reef-life": "/puzzle-reef-life.webp", "porch-morning": "/puzzle-porch-morning.webp", "market-day": "/puzzle-market-day.webp", "canoe-cove": "/puzzle-canoe-cove.webp", island: "/ohana-island.webp", home: "/ohana-family-home-v2.webp", garden: "/ohana-garden-v1.webp", cove: "/ohana-cove-v1.webp", flowers: "/ohana-flowers-v1.webp", world: "/ohana-world-scene.webp" };
var PUZZLE_THUMBS = { "luau-sunset": "/pzthumb-luau-sunset.webp", "waterfall-garden": "/pzthumb-waterfall-garden.webp", "reef-life": "/pzthumb-reef-life.webp", "porch-morning": "/pzthumb-porch-morning.webp", "market-day": "/pzthumb-market-day.webp", "canoe-cove": "/pzthumb-canoe-cove.webp" };
async function puzzleMember(env222222, url) {
  if(env222222.__ohanaInviteMe)return env222222.__ohanaInviteMe;
  const t = url.searchParams.get("t") || "";
  return t ? await env222222.DB.prepare("SELECT id,name,avatar FROM members WHERE token=?").bind(t).first() : null;
}
__name(puzzleMember, "puzzleMember");
__name2(puzzleMember, "puzzleMember");
__name22(puzzleMember, "puzzleMember");
__name222(puzzleMember, "puzzleMember");
__name2222(puzzleMember, "puzzleMember");
async function puzzleGate(env222222, url) {
  const id = +url.pathname.split("/")[2];
  const me = await puzzleMember(env222222, url);
  if (!me) return { error: new Response("Please sign in.", { status: 401 }) };
  const pz = await env222222.DB.prepare("SELECT id,room_id FROM puzzles WHERE id=? AND status!='deleted'").bind(id).first();
  if (!pz) return { error: new Response("Puzzle not found", { status: 404 }) };
  const ok = await env222222.DB.prepare("SELECT 1 AS ok FROM room_members WHERE room_id=? AND member_id=?").bind(pz.room_id, me.id).first();
  if (!ok) return { error: new Response("Not your room", { status: 403 }) };
  let isHost = false;
  try {
    if (pz.room_id === 1) {
      const full = await env222222.DB.prepare("SELECT is_admin FROM members WHERE id=?").bind(me.id).first();
      isHost = !!full?.is_admin;
    } else {
      const room = await env222222.DB.prepare("SELECT owner_id FROM rooms WHERE id=?").bind(pz.room_id).first();
      isHost = room?.owner_id === me.id;
    }
  } catch {
  }
  const h = new Headers();
  h.set("x-member-id", String(me.id));
  h.set("x-member-name", me.name);
  h.set("x-member-avatar", me.avatar || "@hon");
  h.set("x-member-host", isHost ? "1" : "0");
  return { me, id, headers: h, stub: env222222.PUZZLE.get(env222222.PUZZLE.idFromName("puzzle-" + id)) };
}
__name(puzzleGate, "puzzleGate");
__name2(puzzleGate, "puzzleGate");
__name22(puzzleGate, "puzzleGate");
__name222(puzzleGate, "puzzleGate");
__name2222(puzzleGate, "puzzleGate");
async function puzzleWs(req, env222222, url) {
  const g = await puzzleGate(env222222, url);
  if (g.error) return g.error;
  const h = new Headers(req.headers);
  for (const [k, v] of g.headers) h.set(k, v);
  if (!h.get("upgrade")) h.set("upgrade", "websocket");
  return g.stub.fetch(new Request("https://puzzle/ws", { method: "GET", headers: h }));
}
__name(puzzleWs, "puzzleWs");
__name2(puzzleWs, "puzzleWs");
__name22(puzzleWs, "puzzleWs");
__name222(puzzleWs, "puzzleWs");
__name2222(puzzleWs, "puzzleWs");
__name22222(puzzleWs, "puzzleWs");
async function puzzlePoll(req, env222222, url) {
  const g = await puzzleGate(env222222, url);
  if (g.error) return g.error;
  if (req.method === "POST") return g.stub.fetch(new Request("https://puzzle/act", { method: "POST", headers: g.headers, body: await req.text() }));
  return g.stub.fetch(new Request("https://puzzle/events?since=" + (url.searchParams.get("since") || 0), { headers: g.headers }));
}
__name(puzzlePoll, "puzzlePoll");
__name2(puzzlePoll, "puzzlePoll");
__name22(puzzlePoll, "puzzlePoll");
__name222(puzzlePoll, "puzzlePoll");
__name2222(puzzlePoll, "puzzlePoll");
__name22222(puzzlePoll, "puzzlePoll");
async function puzzleApi(req, env222222, p, body, me, roomId, roomList, canManageRoom) {
  const db = env222222.DB;
  const stubOf = /* @__PURE__ */ __name2222((id) => env222222.PUZZLE.get(env222222.PUZZLE.idFromName("puzzle-" + id)), "stubOf");
  if (p === "/api/puzzles" && req.method === "GET") {
    const rows = (await db.prepare("SELECT id,room_id,name,cols,rows,w,h,created_by,created_at,status,CASE WHEN image LIKE 'data:%' THEN NULL ELSE image END AS image FROM puzzles WHERE room_id=? AND status NOT IN ('deleted','memory') ORDER BY created_at DESC LIMIT 24").bind(roomId).all()).results;
    const names = {};
    for (const m of (await db.prepare("SELECT m.id,m.name FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?").bind(roomId).all()).results) names[m.id] = m.name;
    const out = [];
    for (const r of rows) {
      let s = { total: r.cols * r.rows, locked: 0, people: [], done: false };
      try {
        s = await (await stubOf(r.id).fetch("https://puzzle/summary")).json();
      } catch {
      }
      if(s.done){await saveJourneyMemory(db,r.id,roomId,s.stats||{});continue;}
      out.push({ ...r, ...s, by: names[r.created_by] || "Someone", thumb: r.image || "/api/puzzle/" + r.id + "/image" });
    }
    return json({ puzzles: out, pictures: PUZZLE_PICTURES, thumbs: PUZZLE_THUMBS });
  }
  if (p === "/api/puzzle/create" && req.method === "POST") {
    const name = String(body.name || "").trim().slice(0, 60) || "Family puzzle";
    let image = String(body.image || "");
    if (PUZZLE_PICTURES[image]) image = PUZZLE_PICTURES[image];
    else if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 9e5) throw new Error("Choose a picture (a smaller photo if it is big).");
    const cols = Math.max(2, Math.min(48, +body.cols || 6)), rows = Math.max(2, Math.min(48, +body.rows || 4));
    if (cols * rows > 1050) throw new Error("That is more than 1000 pieces. Let's keep it to 1000.");
    const w = Math.max(400, Math.min(3e3, +body.w || 1600)), h = Math.max(300, Math.min(3e3, +body.h || 1200));
    const seed = Math.floor(Math.random() * 2e9);
    const r = await db.prepare("INSERT INTO puzzles(room_id,name,image,cols,rows,w,h,created_by,created_at,status,seed) VALUES(?,?,?,?,?,?,?,?,?,'playing',?)").bind(roomId, name, image, cols, rows, w, h, me.id, now(), seed).run();
    const id = r.meta.last_row_id;
    await stubOf(id).fetch("https://puzzle/init", { method: "POST", body: JSON.stringify({ cols, rows, w, h, seed, roomId, name, puzzleId: id, creator: me.id, style: String(body.style || "mix") }) });
    const others = (await db.prepare("SELECT member_id FROM room_members WHERE room_id=? AND member_id!=?").bind(roomId, me.id).all()).results.map((x) => x.member_id);
    env222222.ctx?.waitUntil?.(notifyMembers(db, others, { type: "puzzle", title: "A new puzzle is on the table", body: me.name + " opened \u201C" + name + "\u201D \u2014 " + cols * rows + " pieces. Pull up a chair!", tag: "ohana-puzzle-" + id }).catch(() => {
    }));
    return json({ id });
  }
  const pm = p.match(/^\/api\/puzzle\/(\d+)(?:\/(\w+))?$/);
  if (pm) {
    const id = +pm[1], action = pm[2];
    const pz = await db.prepare("SELECT * FROM puzzles WHERE id=? AND status!='deleted'").bind(id).first();
    if (!pz) throw new Error("Puzzle not found.");
    if (!roomList.some((r) => r.id === pz.room_id)) return err("This puzzle belongs to another room.", 403);
    if (action === "image") return new Response(pz.image.startsWith("data:") ? Uint8Array.from(atob(pz.image.split(",")[1]), (c) => c.charCodeAt(0)) : "", { headers: { "content-type": pz.image.startsWith("data:") ? pz.image.slice(5, pz.image.indexOf(";")) : "text/plain", "cache-control": "private, max-age=86400" } });
    if (!action) {
      const state = await (await stubOf(id).fetch("https://puzzle/state")).json();
      return json({ id: pz.id, name: pz.name, room_id: pz.room_id, cols: pz.cols, rows: pz.rows, w: pz.w, h: pz.h, created_by: pz.created_by, image: pz.image.startsWith("data:") ? "/api/puzzle/" + id + "/image" : pz.image, ...state });
    }
    if (action === "delete" && req.method === "POST") {
      if (!canManageRoom()) throw new Error("Only the room host can put this puzzle away.");
      await db.prepare("UPDATE puzzles SET status='deleted' WHERE id=?").bind(id).run();
      await stubOf(id).fetch("https://puzzle/reset", { method: "POST" });
      return json({ ok: true });
    }
    if (action === "album" && req.method === "POST") {
      if (!canManageRoom()) throw new Error("Only the room host can move a puzzle to Memories.");
      const sum=await (await stubOf(id).fetch("https://puzzle/summary")).json();
      if(!sum.done)throw new Error("Finish this puzzle before moving it to Memories.");
      await saveJourneyMemory(db,id,pz.room_id,sum.stats||{});
      return json({ok:true,memoryId:id});
    }
  }
  const am = p.match(/^\/api\/album(?:\/(\d+)(?:\/(\w+))?)?$/);
  if (am) {
    const aid = am[1] ? +am[1] : 0, aAction = am[2];
    if (!aid && req.method === "GET") {
      const rows = (await db.prepare("SELECT id,name,cols,rows,pieces,helpers,finished_at,saved_by,saved_at,CASE WHEN image LIKE 'data:%' THEN NULL ELSE image END AS image FROM puzzle_album WHERE room_id=? ORDER BY saved_at DESC LIMIT 60").bind(roomId).all()).results;
      const names = {};
      for (const m of (await db.prepare("SELECT m.id,m.name FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?").bind(roomId).all()).results) names[m.id] = m.name;
      return json({ album: rows.map((r) => ({ id: r.id, name: r.name, pieces: r.pieces, helpers: r.helpers ? JSON.parse(r.helpers) : {}, finished_at: r.finished_at, saved_at: r.saved_at, by: names[r.saved_by] || "Someone", thumb: r.image || "/api/album/" + r.id + "/image" })) });
    }
    if (aid) {
      const row = await db.prepare("SELECT * FROM puzzle_album WHERE id=? AND room_id=?").bind(aid, roomId).first();
      if (!row) throw new Error("That album picture is no longer here.");
      if (aAction === "image") return new Response(row.image.startsWith("data:") ? Uint8Array.from(atob(row.image.split(",")[1]), (c) => c.charCodeAt(0)) : "", { headers: { "content-type": row.image.startsWith("data:") ? row.image.slice(5, row.image.indexOf(";")) : "text/plain", "cache-control": "private, max-age=86400" } });
      if (aAction === "delete" && req.method === "POST") {
        if (!canManageRoom()) throw new Error("Only the room host can remove an album picture.");
        await db.prepare("DELETE FROM puzzle_album WHERE id=?").bind(aid).run();
        return json({ ok: true });
      }
    }
  }
  return null;
}
__name(puzzleApi, "puzzleApi");
__name2(puzzleApi, "puzzleApi");
__name22(puzzleApi, "puzzleApi");
__name222(puzzleApi, "puzzleApi");
__name2222(puzzleApi, "puzzleApi");
__name22222(puzzleApi, "puzzleApi");
// Personal puzzle saves. Existing games, rooms and shared puzzles are untouched.
async function grannyApi(req, db, me, body) {
  await db.prepare("CREATE TABLE IF NOT EXISTS granny_progress (member_id INTEGER NOT NULL, puzzle_key TEXT NOT NULL, state TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at INTEGER NOT NULL, PRIMARY KEY(member_id,puzzle_key))").run();
  if (req.method === 'GET') {
    const rows = (await db.prepare('SELECT puzzle_key AS key,state,revision,updated_at FROM granny_progress WHERE member_id=? ORDER BY updated_at DESC LIMIT 100').bind(me.id).all()).results;
    return json({records:rows.map(row=>({...row,state:JSON.parse(row.state)}))});
  }
  if (req.method !== 'POST') return err('Method not allowed',405);
  const key=String(body.key||''), revision=Number(body.revision);
  if(!(key==='preferences'||/^(crossword|wordfind|wordmix)-[a-z0-9-]{1,80}$/.test(key))||!Number.isSafeInteger(revision)||revision<0) return err('Invalid puzzle save',400);
  const state=body.state;
  if(!state||typeof state!=='object'||Array.isArray(state))return err('Invalid puzzle progress',400);
  if(key!=='preferences'&&(!['crossword','wordfind','wordmix'].includes(state.kind)||!key.startsWith(state.kind+'-')||!Number.isInteger(state.theme)||state.theme<0||state.theme>7||!Number.isInteger(state.seed)||!Number.isInteger(state.variant)||state.variant<0||state.variant>3||!state.answers||typeof state.answers!=='object'||!Array.isArray(state.found)))return err('Invalid puzzle progress',400);
  const data=JSON.stringify(state);if(data.length>50000)return err('Puzzle save is too large',413);
  const updated=Date.now();
  const saved=revision===0?await db.prepare('INSERT INTO granny_progress(member_id,puzzle_key,state,revision,updated_at) VALUES(?,?,?,1,?) ON CONFLICT(member_id,puzzle_key) DO NOTHING RETURNING revision').bind(me.id,key,data,updated).first():await db.prepare('UPDATE granny_progress SET state=?,revision=revision+1,updated_at=? WHERE member_id=? AND puzzle_key=? AND revision=? RETURNING revision').bind(data,updated,me.id,key,revision).first();
  if(!saved){const row=await db.prepare('SELECT puzzle_key AS key,state,revision,updated_at FROM granny_progress WHERE member_id=? AND puzzle_key=?').bind(me.id,key).first();return json({error:'A newer save is available.',record:row?{...row,state:JSON.parse(row.state)}:null},409);}
  return json({ok:true,revision:saved.revision,updated_at:updated});
}

// Friendly reminders use existing D1 settings; no Durable Object changes.
async function recordOhanaGameActivity(db, memberId, stamp=Date.now()) {
  if(!Number.isSafeInteger(memberId)||memberId<=0||!Number.isFinite(stamp)||stamp<=0)return;
  await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(settings.value AS INTEGER)<CAST(excluded.value AS INTEGER)")
    .bind('game_last_played_'+memberId,String(Math.floor(stamp))).run();
}
async function runOhanaInactivityReminders(db, stamp=Date.now(), deliver=notifyMembers) {
  const cutoff=stamp-72*60*60*1000;
  const games=(await db.prepare("SELECT id,players,turn,state,room_id FROM games WHERE status='playing'").all()).results||[];
  const waiting=new Map();
  for(const game of games){
    try{
      const players=JSON.parse(game.players),state=JSON.parse(game.state),memberId=players[game.turn],room=Number(game.room_id);
      if(!Array.isArray(players)||players.length<2||state?.bot||players.includes(BOT_ID)||!Number.isSafeInteger(memberId)||memberId<=0||!Number.isSafeInteger(room)||room<=0)continue;
      if(!waiting.has(memberId))waiting.set(memberId,new Set());
      waiting.get(memberId).add(room);
    }catch{}
  }
  let attempts=0;
  for(const [memberId,roomSet] of waiting){
    const rooms=[...roomSet],marks=rooms.map(()=>'?').join(',');
    const member=await db.prepare("SELECT m.id,m.last_seen,m.created_at FROM members m WHERE m.id=? AND EXISTS(SELECT 1 FROM push_subscriptions s WHERE s.member_id=m.id) AND EXISTS(SELECT 1 FROM room_members r WHERE r.member_id=m.id AND r.room_id IN ("+marks+"))").bind(memberId,...rooms).first();
    if(!member)continue;
    const activityKey='game_last_played_'+memberId;
    // Legacy accounts have no historical per-member move timestamp. Start from
    // their latest known visit once, then only successful moves advance it.
    const baseline=Math.max(Number(member.last_seen)||0,Number(member.created_at)||0);
    if(baseline>0)await db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)").bind(activityKey,String(Math.floor(baseline))).run();
    const activity=Number((await db.prepare("SELECT value FROM settings WHERE key=?").bind(activityKey).first())?.value);
    if(!Number.isFinite(activity)||activity<=0||activity>cutoff)continue;
    // One atomic claim across all waiting games and overlapping cron runs.
    // Recheck activity, current turn, membership and opt-in atomically. Also
    // inspect committed lastPlay data to cover the short gap before its
    // separate best-effort activity timestamp write finishes.
    const claim=await db.prepare("INSERT INTO settings(key,value) SELECT ?,? WHERE EXISTS(SELECT 1 FROM settings WHERE key=? AND CAST(value AS INTEGER)=? AND CAST(value AS INTEGER)<=?) AND EXISTS(SELECT 1 FROM push_subscriptions WHERE member_id=?) AND EXISTS(SELECT 1 FROM games g JOIN room_members r ON r.room_id=g.room_id JOIN members m ON m.id=r.member_id WHERE g.status='playing' AND r.member_id=? AND CASE WHEN json_valid(g.players) AND json_valid(g.state) THEN json_array_length(g.players)>=2 AND CAST(json_extract(g.players,'$['||g.turn||']') AS INTEGER)=? AND NOT EXISTS(SELECT 1 FROM json_each(g.players) p WHERE p.value=?) AND (json_type(g.state,'$.bot') IS NULL OR json_type(g.state,'$.bot')='null' OR json_extract(g.state,'$.bot')=0) ELSE 0 END) AND NOT EXISTS(SELECT 1 FROM games g WHERE CASE WHEN json_valid(g.state) THEN CAST(json_extract(g.state,'$.lastPlay.p') AS INTEGER)=? AND CAST(json_extract(g.state,'$.lastPlay.at') AS INTEGER)>? ELSE 0 END) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE CAST(settings.value AS INTEGER)<CAST(excluded.value AS INTEGER)")
      .bind('game_inactivity_reminded_'+memberId,String(activity),activityKey,activity,cutoff,memberId,memberId,memberId,BOT_ID,memberId,cutoff).run();
    if(!claim.meta?.changes)continue;
    attempts++;
    try{await deliver(db,[memberId],{type:'reminder',title:'We miss you in Ohana',body:'Hey, we miss you in Ohana. Your games are waiting.',tag:'ohana-friendly-reminder-'+memberId});}
    catch(error){console.warn('Ohana reminder delivery failed',error.message);}
  }
  return {attempts};
}

var worker_default = {
  async scheduled(event, env222222, ctx) {
    ctx.waitUntil(runOhanaInactivityReminders(env222222.DB).catch(error=>console.error('Ohana friendly reminder failed',error.message)));
  },
  async fetch(req, env222222, ctx) {
    const url = new URL(req.url);
    const p = url.pathname;
    if(p.startsWith('/api/ohana-character/'))return createPePawRoute({auth,roomId:env222222.PEPAW_FAMILY_ROOM_ID,ownerMemberId:env222222.PEPAW_OWNER_MEMBER_ID})(req,env222222);
    if(p.startsWith('/api/duckville/')) {
      try {
        const handler=bindCurrentWorker({auth,privateRead:readDuckvillePrivateFile,approvedRoomId:env222222.DUCKVILLE_APPROVED_ROOM_ID});
        return await handler(req,env222222) || new Response('Unavailable',{status:404,headers:{'cache-control':'private, no-store'}});
      } catch {return new Response('Unavailable',{status:503,headers:{'cache-control':'private, no-store'}});}
    }
    const chimeAsset=chimeStaticResponse(req);if(chimeAsset)return chimeAsset;
    if(/^\/api\/music\/audio\/m_[a-f0-9-]+$/.test(p))return handleMusicAudio(req,env222222,ohanaMusicReadable);
    if(req.method==='GET'&&p==='/ohana-blessings-prayer-sign-v1.webp')return new Response(OHANA_BLESSINGS_SIGN,{headers:{'content-type':'image/webp','cache-control':'public,max-age=3600'}});
    if(req.method==='GET'&&p==='/ohana-united-puzzle-sign-v1.webp')return new Response(OHANA_UNITED_SIGN,{headers:{'content-type':'image/webp','cache-control':'public,max-age=3600'}});
    if(p === "/ohana-action-bowls-v1.webp")return new Response(ACTION_BOWLS,{headers:{"content-type":"image/webp","cache-control":"public,max-age=86400"}});
    if(req.method==='GET'&&p==='/ohana-guide-journey-v1.webp')return new Response(OHANA_ROOM_GUIDE_JOURNEY,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-guide-blessings-v1.webp')return new Response(OHANA_ROOM_GUIDE_BLESSINGS,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-guide-united-v1.webp')return new Response(OHANA_ROOM_GUIDE_UNITED,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-guide-bridge-v1.webp')return new Response(OHANA_ROOM_GUIDE_BRIDGE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-guide-memories-v1.webp')return new Response(OHANA_ROOM_GUIDE_MEMORIES,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-shuffle-entrance-v1.webp')return new Response(OHANA_SHUFFLE_ENTRANCE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-tile-entrance-v1.webp')return new Response(OHANA_TILE_ENTRANCE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-bridge-setting-v1.webp')return new Response(OHANA_BRIDGE_LANDSCAPE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
    if(req.method==='GET'&&p==='/ohana-bridge-command-icons-v1.webp')return new Response(OHANA_BRIDGE_COMMAND_ICONS,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
    if(req.method==='GET'&&p==='/ohana-bridge-setting-portrait-v1.webp')return new Response(OHANA_BRIDGE_PORTRAIT,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
    if(req.method==='GET'&&p==='/ohana-hub-record-player-v1.webp')return new Response(OHANA_BRIDGE_RECORD,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
    if(req.method==='GET'&&p==='/ohana-announcement-menu-hide-v1.jpg')return new Response(OHANA_MENU_HIDE_NOTICE,{headers:{'content-type':'image/jpeg','cache-control':'public,max-age=31536000,immutable'}});
    if(p === "/ohana-cardinal-daddy-cap-v1.png")return new Response(CARDINAL_DADDY_CAP,{headers:{"content-type":"image/png","cache-control":"public,max-age=86400"}});
    if(p === "/ohana-cardinal-daddy-cap-reverse-v1.png")return new Response(CARDINAL_DADDY_CAP_REVERSE,{headers:{"content-type":"image/png","cache-control":"public,max-age=86400"}});
    if(p === "/ohana-cardinal-control-v1.webp")return new Response(CARDINAL_CONTROL,{headers:{"content-type":"image/webp","cache-control":"public,max-age=86400"}});
    if(url.pathname==='/ohana-wood.webp'&&req.method==='GET'){const art=APP_HTML.match(/--ohana-wood:url\("data:image\/webp;base64,([^"\)]+)"\)/);if(art)return new Response(Uint8Array.from(atob(art[1]),c=>c.charCodeAt(0)),{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});}
    try{const senior=await seniorRoute(req,env222222,url,{auth,childPolicy,grannyApi,unifiedChat,page:APP_HTML,setup:SENIOR_SETUP_HTML,api:api2,grannyWordCheck,wardrobeApi,memoriesApi,memoriesPage:MEMORIES_HTML,puzzleWs,puzzlePoll,ctx});if(senior)return senior;}catch(e){return Response.json({error:'Could not open this invitation. Please try again.'},{status:500,headers:{'cache-control':'no-store'}});}
    if(p==='/ohana-spades-bid-check.html' && req.method==='GET')return new Response(SPADES_BID_CHECK_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(p==='/ohana-puzzle-deploy-check.html' && req.method==='GET')return new Response(PUZZLE_DEPLOY_CHECK_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'"}});
    if(p==='/ohana-memories-layout-check.html' && req.method==='GET')return new Response(MEMORIES_LAYOUT_CHECK_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(p==='/ohana-o10-touch-check.html' && req.method==='GET')return new Response(O10_TOUCH_CHECK_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(p==='/ohana-words-draft-check.html' && req.method==='GET')return new Response(WORDS_DRAFT_CHECK_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:"}});
    if(p==='/memories' && req.method==='GET')return new Response(MEMORIES_HTML,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    if(p==='/memories/incoming' && req.method==='POST') {try{return await memoriesIncoming(req);}catch{return new Response('These photos could not be received. Open Ohana Memories and choose Add photos.',{status:400});}}
    if(p==='/api/coloring/table')return sharedColoringApi(req,env222222,url);
    if(p.startsWith('/api/memories')) {try{return await memoriesApi(req,env222222,url);}catch(e){return Response.json({error:'Could not open Memories. Please try again.'},{status:500,headers:{'cache-control':'no-store'}});}}
    if (p.startsWith("/puzzle-ws/")) return puzzleWs(req, env222222, url);
    if (p.startsWith("/puzzle-poll/")) {
      try {
        return await puzzlePoll(req, env222222, url);
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }
    if (req.method === "GET" && ["/ohana-icon-192-v2.png", "/ohana-icon-512-v2.png"].includes(p)) return new Response(p.includes("192") ? OHANA_ICON_192 : OHANA_ICON_512, { headers: { "content-type": "image/png", "cache-control": "public,max-age=31536000,immutable" } });
    const chessAssets = {
      "/buddy-bamboo-outfit.webp": OUTFIT_BAMBOO,
      "/buddy-bamboo-outfit.png": OUTFIT_BAMBOO,
      "/buddy-eddie-outfit.webp": OUTFIT_EDDIE,
      "/buddy-eddie-outfit.png": OUTFIT_EDDIE,
      "/buddy-flora-outfit.webp": OUTFIT_FLORA,
      "/buddy-flora-outfit.png": OUTFIT_FLORA,
      "/buddy-honu-outfit.webp": OUTFIT_HONU,
      "/buddy-honu-outfit.png": OUTFIT_HONU,
      "/buddy-hoot-outfit.webp": OUTFIT_HOOT,
      "/buddy-hoot-outfit.png": OUTFIT_HOOT,
      "/buddy-kiko-outfit.webp": OUTFIT_KIKO,
      "/buddy-kiko-outfit.png": OUTFIT_KIKO,
      "/buddy-koa-outfit.webp": OUTFIT_KOA,
      "/buddy-koa-outfit.png": OUTFIT_KOA,
      "/buddy-milo-outfit.webp": OUTFIT_MILO,
      "/buddy-milo-outfit.png": OUTFIT_MILO,
      "/buddy-otto-outfit.webp": OUTFIT_OTTO,
      "/buddy-otto-outfit.png": OUTFIT_OTTO,
      "/buddy-pippa-outfit.webp": OUTFIT_PIPPA,
      "/buddy-pippa-outfit.png": OUTFIT_PIPPA,
      "/buddy-splash-outfit.webp": OUTFIT_SPLASH,
      "/buddy-splash-outfit.png": OUTFIT_SPLASH,
      "/buddy-sunny-outfit.webp": OUTFIT_SUNNY,
      "/buddy-sunny-outfit.png": OUTFIT_SUNNY,
      "/beach-sand-light.webp": BEACH_SAND,
      "/beach-sand-light.jpg": BEACH_SAND,
      "/ocean-surf.webp": OCEAN_SURF,
      "/ocean-surf.jpg": OCEAN_SURF
    };
    if (req.method === "GET" && chessAssets[p]) {
      const ct = p.endsWith(".png") ? "image/png" : p.endsWith(".jpg") ? "image/jpeg" : "image/webp";
      return new Response(chessAssets[p], { headers: { "content-type": ct, "cache-control": "public,max-age=86400" } });
    }
    const expansionAssets = { "/ohana-a00-v1.webp": OHANA_EXPANSION_0, "/ohana-a01-v1.webp": OHANA_EXPANSION_1, "/ohana-a02-v1.webp": OHANA_EXPANSION_2, "/ohana-a03-v1.webp": OHANA_EXPANSION_3, "/ohana-a04-v1.webp": OHANA_EXPANSION_4, "/ohana-a05-v1.webp": OHANA_EXPANSION_5, "/ohana-a06-v1.webp": OHANA_EXPANSION_6, "/ohana-a07-v1.webp": OHANA_EXPANSION_7, "/ohana-a08-v1.webp": OHANA_EXPANSION_8, "/ohana-a09-v1.webp": OHANA_EXPANSION_9, "/ohana-a13-v1.webp": OHANA_EXPANSION_10, "/ohana-a14-v1.webp": OHANA_EXPANSION_11, "/ohana-a15-v1.webp": OHANA_EXPANSION_12, "/ohana-a16-v1.webp": OHANA_EXPANSION_13, "/ohana-a17-v1.webp": OHANA_EXPANSION_14, "/ohana-a18-v1.webp": OHANA_EXPANSION_15, "/ohana-a19-v1.webp": OHANA_EXPANSION_16, "/ohana-a20-v1.webp": OHANA_EXPANSION_17, "/ohana-a22-v1.webp": OHANA_EXPANSION_18, "/ohana-a23-v1.webp": OHANA_EXPANSION_19, "/ohana-a25-v1.webp": OHANA_EXPANSION_20, "/ohana-a26-v1.webp": OHANA_EXPANSION_21, "/ohana-a27-v1.webp": OHANA_EXPANSION_22, "/ohana-a28-v1.webp": OHANA_EXPANSION_23, "/ohana-a29-v1.webp": OHANA_EXPANSION_24, "/ohana-a30-v1.webp": OHANA_EXPANSION_25, "/ohana-a31-v1.webp": OHANA_EXPANSION_26, "/ohana-a32-v1.webp": OHANA_EXPANSION_27, "/ohana-a33-v1.webp": OHANA_EXPANSION_28, "/ohana-a34-v1.webp": OHANA_EXPANSION_29, "/ohana-a35-v1.webp": OHANA_EXPANSION_30, "/ohana-a36-v1.webp": OHANA_EXPANSION_31, "/ohana-a37-v1.webp": OHANA_EXPANSION_32, "/ohana-a38-v1.webp": OHANA_EXPANSION_33, "/ohana-a39-v1.webp": OHANA_EXPANSION_34, "/ohana-a40-v1.webp": OHANA_EXPANSION_35, "/ohana-a41-v1.webp": OHANA_EXPANSION_36, "/ohana-a43-v1.webp": OHANA_EXPANSION_37, "/ohana-a44-v1.webp": OHANA_EXPANSION_38, "/ohana-a45-v1.webp": OHANA_EXPANSION_39, "/ohana-a46-v1.webp": OHANA_EXPANSION_40, "/ohana-a47-v1.webp": OHANA_EXPANSION_41, "/ohana-a48-v1.webp": OHANA_EXPANSION_42, "/ohana-a49-v1.webp": OHANA_EXPANSION_43, "/ohana-a50-v1.webp": OHANA_EXPANSION_44, "/ohana-a51-v1.webp": OHANA_EXPANSION_45, "/ohana-a52-v1.webp": OHANA_EXPANSION_46, "/ohana-a53-v1.webp": OHANA_EXPANSION_47, "/ohana-a54-v1.webp": OHANA_EXPANSION_48, "/ohana-a55-v1.webp": OHANA_EXPANSION_49, "/ohana-a56-v1.webp": OHANA_EXPANSION_50, "/ohana-a57-v1.webp": OHANA_EXPANSION_51, "/ohana-a58-v1.webp": OHANA_EXPANSION_52, "/ohana-a59-v1.webp": OHANA_EXPANSION_53, "/ohana-a60-v1.webp": OHANA_EXPANSION_54, "/ohana-a61-v1.webp": OHANA_EXPANSION_55, "/ohana-a62-v1.webp": OHANA_EXPANSION_56, "/ohana-a63-v1.webp": OHANA_EXPANSION_57, "/ohana-a64-v1.webp": OHANA_EXPANSION_58, "/ohana-a65-v1.webp": OHANA_EXPANSION_59, "/ohana-a66-v1.webp": OHANA_EXPANSION_60, "/ohana-a67-v1.webp": OHANA_EXPANSION_61, "/ohana-a68-v1.webp": OHANA_EXPANSION_62, "/ohana-a69-v1.webp": OHANA_EXPANSION_63, "/ohana-a70-v1.webp": OHANA_EXPANSION_64, "/ohana-a71-v1.webp": OHANA_EXPANSION_65, "/ohana-a72-v1.webp": OHANA_EXPANSION_66, "/ohana-a73-v1.webp": OHANA_EXPANSION_67, "/ohana-a74-v1.webp": OHANA_EXPANSION_68, "/ohana-a75-v1.webp": OHANA_EXPANSION_69, "/ohana-a76-v1.webp": OHANA_EXPANSION_70, "/ohana-a77-v1.webp": OHANA_EXPANSION_71, "/ohana-a78-v1.webp": OHANA_EXPANSION_72, "/ohana-a79-v1.webp": OHANA_EXPANSION_73, "/ohana-a80-v1.webp": OHANA_EXPANSION_74, "/ohana-a82-v1.webp": OHANA_EXPANSION_75, "/ohana-a83-v1.webp": OHANA_EXPANSION_76, "/ohana-a84-v1.webp": OHANA_EXPANSION_77, "/ohana-a85-v1.webp": OHANA_EXPANSION_78, "/ohana-a86-v1.webp": OHANA_EXPANSION_79, "/ohana-a87-v1.webp": OHANA_EXPANSION_80, "/ohana-a89-v1.webp": OHANA_EXPANSION_81, "/ohana-a90-v1.webp": OHANA_EXPANSION_82, "/ohana-a91-v1.webp": OHANA_EXPANSION_83, "/ohana-a92-v1.webp": OHANA_EXPANSION_84, "/ohana-a93-v1.webp": OHANA_EXPANSION_85, "/ohana-a94-v1.webp": OHANA_EXPANSION_86, "/ohana-a95-v1.webp": OHANA_EXPANSION_87, "/ohana-a97-v1.webp": OHANA_EXPANSION_88, "/ohana-a98-v1.webp": OHANA_EXPANSION_89, "/ohana-a99-v1.webp": OHANA_EXPANSION_90, "/ohana-c00-v1.webp": OHANA_EXPANSION_91, "/ohana-c01-v1.webp": OHANA_EXPANSION_92, "/ohana-c02-v1.webp": OHANA_EXPANSION_93, "/ohana-c03-v1.webp": OHANA_EXPANSION_94, "/ohana-c04-v1.webp": OHANA_EXPANSION_95, "/ohana-c05-v1.webp": OHANA_EXPANSION_96, "/ohana-c06-v1.webp": OHANA_EXPANSION_97, "/ohana-c07-v1.webp": OHANA_EXPANSION_98, "/ohana-c08-v1.webp": OHANA_EXPANSION_99, "/ohana-c09-v1.webp": OHANA_EXPANSION_100, "/ohana-c10-v1.webp": OHANA_EXPANSION_101, "/ohana-c11-v1.webp": OHANA_EXPANSION_102, "/ohana-c12-v1.webp": OHANA_EXPANSION_103, "/ohana-c13-v1.webp": OHANA_EXPANSION_104, "/ohana-c14-v1.webp": OHANA_EXPANSION_105, "/ohana-c15-v1.webp": OHANA_EXPANSION_106, "/ohana-c16-v1.webp": OHANA_EXPANSION_107, "/ohana-c17-v1.webp": OHANA_EXPANSION_108, "/ohana-c18-v1.webp": OHANA_EXPANSION_109, "/ohana-c19-v1.webp": OHANA_EXPANSION_110, "/ohana-c20-v1.webp": OHANA_EXPANSION_111, "/ohana-c21-v1.webp": OHANA_EXPANSION_112, "/ohana-c22-v1.webp": OHANA_EXPANSION_113, "/ohana-c23-v1.webp": OHANA_EXPANSION_114, "/ohana-c24-v1.webp": OHANA_EXPANSION_115, "/ohana-c25-v1.webp": OHANA_EXPANSION_116, "/ohana-c26-v1.webp": OHANA_EXPANSION_117, "/ohana-c28-v1.webp": OHANA_EXPANSION_118, "/ohana-c29-v1.webp": OHANA_EXPANSION_119, "/ohana-c30-v1.webp": OHANA_EXPANSION_120, "/ohana-c31-v1.webp": OHANA_EXPANSION_121, "/ohana-c32-v1.webp": OHANA_EXPANSION_122, "/ohana-c33-v1.webp": OHANA_EXPANSION_123, "/ohana-c34-v1.webp": OHANA_EXPANSION_124, "/ohana-c35-v1.webp": OHANA_EXPANSION_125, "/ohana-c36-v1.webp": OHANA_EXPANSION_126, "/ohana-c37-v1.webp": OHANA_EXPANSION_127, "/ohana-c38-v1.webp": OHANA_EXPANSION_128, "/ohana-c39-v1.webp": OHANA_EXPANSION_129, "/ohana-l00-v1.webp": OHANA_EXPANSION_130, "/ohana-l01-v1.webp": OHANA_EXPANSION_131, "/ohana-l02-v1.webp": OHANA_EXPANSION_132, "/ohana-l03-v1.webp": OHANA_EXPANSION_133, "/ohana-l04-v1.webp": OHANA_EXPANSION_134, "/ohana-l05-v1.webp": OHANA_EXPANSION_135, "/ohana-l06-v1.webp": OHANA_EXPANSION_136, "/ohana-l07-v1.webp": OHANA_EXPANSION_137, "/ohana-l08-v1.webp": OHANA_EXPANSION_138, "/ohana-l09-v1.webp": OHANA_EXPANSION_139, "/ohana-l10-v1.webp": OHANA_EXPANSION_140, "/ohana-l11-v1.webp": OHANA_EXPANSION_141, "/ohana-o00-v1.webp": OHANA_EXPANSION_142, "/ohana-o01-v1.webp": OHANA_EXPANSION_143, "/ohana-o02-v1.webp": OHANA_EXPANSION_144, "/ohana-o03-v1.webp": OHANA_EXPANSION_145, "/ohana-o04-v1.webp": OHANA_EXPANSION_146, "/ohana-o05-v1.webp": OHANA_EXPANSION_147, "/ohana-o06-v1.webp": OHANA_EXPANSION_148, "/ohana-o07-v1.webp": OHANA_EXPANSION_149, "/ohana-o08-v1.webp": OHANA_EXPANSION_150, "/ohana-o09-v1.webp": OHANA_EXPANSION_151, "/ohana-o10-v1.webp": OHANA_EXPANSION_152, "/ohana-o11-v1.webp": OHANA_EXPANSION_153, "/ohana-o12-v1.webp": OHANA_EXPANSION_154, "/ohana-o13-v1.webp": OHANA_EXPANSION_155, "/ohana-o14-v1.webp": OHANA_EXPANSION_156, "/ohana-o15-v1.webp": OHANA_EXPANSION_157, "/ohana-o16-v1.webp": OHANA_EXPANSION_158, "/ohana-o17-v1.webp": OHANA_EXPANSION_159, "/ohana-o18-v1.webp": OHANA_EXPANSION_160, "/ohana-o19-v1.webp": OHANA_EXPANSION_161, "/ohana-o20-v1.webp": OHANA_EXPANSION_162, "/ohana-o21-v1.webp": OHANA_EXPANSION_163, "/ohana-o22-v1.webp": OHANA_EXPANSION_164, "/ohana-o23-v1.webp": OHANA_EXPANSION_165, "/ohana-o24-v1.webp": OHANA_EXPANSION_166 };
    if (req.method === "GET" && expansionAssets[p]) return new Response(expansionAssets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    const wardrobeV92Assets = { "/wardrobe-eddie-explorer-v92.webp": WARDROBE_V92_0, "/wardrobe-eddie-sunday-best-v92.webp": WARDROBE_V92_1, "/wardrobe-honu-chef-v92.webp": WARDROBE_V92_2, "/wardrobe-honu-explorer-v92.webp": WARDROBE_V92_3, "/wardrobe-honu-gardener-v92.webp": WARDROBE_V92_4, "/wardrobe-honu-sunday-best-v92.webp": WARDROBE_V92_5, "/wardrobe-splash-chef-v92.webp": WARDROBE_V92_6, "/wardrobe-splash-pilot-v92.webp": WARDROBE_V92_7, "/wardrobe-splash-doctor-v92.webp": WARDROBE_V92_8, "/wardrobe-splash-explorer-v92.webp": WARDROBE_V92_9, "/wardrobe-splash-gardener-v92.webp": WARDROBE_V92_10, "/wardrobe-splash-sunday-best-v92.webp": WARDROBE_V92_11, "/wardrobe-kiko-chef-v92.webp": WARDROBE_V92_12, "/wardrobe-kiko-police-v92.webp": WARDROBE_V92_13, "/wardrobe-kiko-firefighter-v92.webp": WARDROBE_V92_14, "/wardrobe-kiko-doctor-v92.webp": WARDROBE_V92_15, "/wardrobe-kiko-gardener-v92.webp": WARDROBE_V92_16, "/wardrobe-kiko-sunday-best-v92.webp": WARDROBE_V92_17, "/wardrobe-pebble-chef-v92.webp": WARDROBE_V92_18, "/wardrobe-pebble-police-v92.webp": WARDROBE_V92_19, "/wardrobe-pebble-firefighter-v92.webp": WARDROBE_V92_20, "/wardrobe-pebble-doctor-v92.webp": WARDROBE_V92_21, "/wardrobe-pebble-explorer-v92.webp": WARDROBE_V92_22, "/wardrobe-pebble-gardener-v92.webp": WARDROBE_V92_23, "/wardrobe-pebble-sunday-best-v92.webp": WARDROBE_V92_24, "/wardrobe-mango-chef-v92.webp": WARDROBE_V92_25, "/wardrobe-mango-police-v92.webp": WARDROBE_V92_26, "/wardrobe-mango-firefighter-v92.webp": WARDROBE_V92_27, "/wardrobe-mango-doctor-v92.webp": WARDROBE_V92_28, "/wardrobe-mango-explorer-v92.webp": WARDROBE_V92_29, "/wardrobe-mango-gardener-v92.webp": WARDROBE_V92_30, "/wardrobe-mango-sunday-best-v92.webp": WARDROBE_V92_31, "/wardrobe-sunny-police-v92.webp": WARDROBE_V92_32, "/wardrobe-sunny-firefighter-v92.webp": WARDROBE_V92_33, "/wardrobe-sunny-doctor-v92.webp": WARDROBE_V92_34, "/wardrobe-sunny-explorer-v92.webp": WARDROBE_V92_35, "/wardrobe-sunny-gardener-v92.webp": WARDROBE_V92_36, "/wardrobe-sunny-sunday-best-v92.webp": WARDROBE_V92_37, "/wardrobe-otto-chef-v92.webp": WARDROBE_V92_38, "/wardrobe-otto-police-v92.webp": WARDROBE_V92_39, "/wardrobe-otto-firefighter-v92.webp": WARDROBE_V92_40, "/wardrobe-otto-doctor-v92.webp": WARDROBE_V92_41, "/wardrobe-otto-explorer-v92.webp": WARDROBE_V92_42, "/wardrobe-otto-sunday-best-v92.webp": WARDROBE_V92_43, "/wardrobe-pippa-chef-v92.webp": WARDROBE_V92_44, "/wardrobe-pippa-police-v92.webp": WARDROBE_V92_45, "/wardrobe-pippa-firefighter-v92.webp": WARDROBE_V92_46, "/wardrobe-pippa-doctor-v92.webp": WARDROBE_V92_47, "/wardrobe-pippa-explorer-v92.webp": WARDROBE_V92_48, "/wardrobe-pippa-sunday-best-v92.webp": WARDROBE_V92_49, "/wardrobe-lulu-chef-v92.webp": WARDROBE_V92_50, "/wardrobe-lulu-police-v92.webp": WARDROBE_V92_51, "/wardrobe-lulu-firefighter-v92.webp": WARDROBE_V92_52, "/wardrobe-lulu-doctor-v92.webp": WARDROBE_V92_53, "/wardrobe-lulu-explorer-v92.webp": WARDROBE_V92_54, "/wardrobe-lulu-gardener-v92.webp": WARDROBE_V92_55, "/wardrobe-lulu-sunday-best-v92.webp": WARDROBE_V92_56 };
    if (req.method === "GET" && wardrobeV92Assets[p]) return new Response(wardrobeV92Assets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=31536000,immutable" } });
    const wardrobeFittedAssets = { "/wardrobe-bandit-doctor-v1.webp": WARDROBE_FITTED_0, "/wardrobe-bandit-chef-v1.webp": WARDROBE_FITTED_1, "/wardrobe-bandit-everyday-v1.webp": WARDROBE_FITTED_2, "/wardrobe-bandit-explorer-v1.webp": WARDROBE_FITTED_3, "/wardrobe-honu-police-v1.webp": WARDROBE_FITTED_4, "/wardrobe-honu-nurse-v1.webp": WARDROBE_FITTED_5, "/wardrobe-honu-firefighter-v1.webp": WARDROBE_FITTED_6, "/wardrobe-eddie-police-v1.webp": WARDROBE_FITTED_7, "/wardrobe-eddie-nurse-v1.webp": WARDROBE_FITTED_8, "/wardrobe-eddie-firefighter-v1.webp": WARDROBE_FITTED_9, "/wardrobe-eddie-chef-v1.webp": WARDROBE_FITTED_10 };
    if (req.method === "GET" && wardrobeFittedAssets[p]) return new Response(wardrobeFittedAssets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    const ohanaNewBuddyAssets = { "/buddy-bandit-v1.webp": OHANA_NEW_BUDDY_0, "/buddy-pip-v1.webp": OHANA_NEW_BUDDY_1, "/buddy-maple-v1.webp": OHANA_NEW_BUDDY_2, "/buddy-biscuit-v1.webp": OHANA_NEW_BUDDY_3, "/buddy-waffles-v1.webp": OHANA_NEW_BUDDY_4, "/buddy-mochi-v1.webp": OHANA_NEW_BUDDY_5, "/buddy-nibbles-v1.webp": OHANA_NEW_BUDDY_6, "/buddy-pogo-v1.webp": OHANA_NEW_BUDDY_7, "/buddy-clover-v1.webp": OHANA_NEW_BUDDY_8, "/buddy-tater-v1.webp": OHANA_NEW_BUDDY_9, "/buddy-patches-v1.webp": OHANA_NEW_BUDDY_11, "/buddy-poppy-v1.webp": OHANA_NEW_BUDDY_13, "/buddy-lemon-v1.webp": OHANA_NEW_BUDDY_15, "/buddy-coral-v1.webp": OHANA_NEW_BUDDY_16, "/buddy-tango-v1.webp": OHANA_NEW_BUDDY_17, "/buddy-ziggy-v1.webp": OHANA_NEW_BUDDY_18, "/buddy-pebbles-v1.webp": OHANA_NEW_BUDDY_19, "/buddy-bubbles-v1.webp": OHANA_NEW_BUDDY_20, "/buddy-daisy-v1.webp": OHANA_NEW_BUDDY_21, "/buddy-skippy-v1.webp": OHANA_NEW_BUDDY_23, "/buddy-nova-v1.webp": OHANA_NEW_BUDDY_24, "/buddy-bandit-police-v1.webp": OHANA_NEW_BUDDY_26, "/buddy-bandit-nurse-v1.webp": OHANA_NEW_BUDDY_27, "/buddy-bandit-firefighter-v1.webp": OHANA_NEW_BUDDY_28, "/buddy-bandit-aloha-v1.webp": OHANA_NEW_BUDDY_29 };
    if (req.method === "GET" && ohanaNewBuddyAssets[p]) return new Response(ohanaNewBuddyAssets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    const buddyAssets = { "/buddy-eddie.webp": EDDIE_PORTRAIT, "/talk-eddie.webp": EDDIE_TALK, "/buddy-otto.webp": MORE_OTTO_PORTRAIT, "/talk-otto.webp": MORE_OTTO_TALK, "/buddy-pippa.webp": MORE_PIPPA_PORTRAIT, "/talk-pippa.webp": MORE_PIPPA_TALK, "/buddy-lulu.webp": MORE_LULU_PORTRAIT, "/talk-lulu.webp": MORE_LULU_TALK, "/buddy-hoot.webp": MORE_HOOT_PORTRAIT, "/talk-hoot.webp": MORE_HOOT_TALK, "/buddy-flutter.webp": MORE_FLUTTER_PORTRAIT, "/talk-flutter.webp": MORE_FLUTTER_TALK, "/buddy-rosie.webp": MORE_ROSIE_PORTRAIT, "/talk-rosie.webp": MORE_ROSIE_TALK, "/buddy-koa.webp": MORE_KOA_PORTRAIT, "/talk-koa.webp": MORE_KOA_TALK, "/buddy-milo.webp": MORE_MILO_PORTRAIT, "/talk-milo.webp": MORE_MILO_TALK, "/buddy-bamboo.webp": MORE_BAMBOO_PORTRAIT, "/talk-bamboo.webp": MORE_BAMBOO_TALK, "/buddy-coco.webp": MORE_COCO_PORTRAIT, "/talk-coco.webp": MORE_COCO_TALK, "/buddy-finn.webp": MORE_FINN_PORTRAIT, "/talk-finn.webp": MORE_FINN_TALK, "/buddy-inky.webp": MORE_INKY_PORTRAIT, "/talk-inky.webp": MORE_INKY_TALK, "/buddy-kai.webp": MORE_KAI_PORTRAIT, "/talk-kai.webp": MORE_KAI_TALK, "/buddy-flora.webp": MORE_FLORA_PORTRAIT, "/talk-flora.webp": MORE_FLORA_TALK, "/buddy-reef.webp": MORE_REEF_PORTRAIT, "/talk-reef.webp": MORE_REEF_TALK, "/talk-honu.webp": TALK_HONU, "/talk-splash.webp": TALK_SPLASH, "/talk-kiko.webp": TALK_KIKO, "/talk-pebble.webp": TALK_PEBBLE, "/talk-mango.webp": TALK_MANGO, "/talk-sunny.webp": TALK_SUNNY, "/buddy-kiko.webp": BUDDY_KIKO, "/buddy-pebble.webp": BUDDY_PEBBLE, "/buddy-mango.webp": BUDDY_MANGO, "/buddy-sunny.webp": BUDDY_SUNNY, "/buddy-splash.webp": BUDDY_SPLASH };
    if (req.method === "GET" && buddyAssets[p]) return new Response(buddyAssets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/honu.webp") return new Response(HONU_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/mike-birthday.webp") return new Response(MIKE_BIRTHDAY_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/eddie-limo.webp") return new Response(EDDIE_LIMO_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-splash-fish-v1.webp") return new Response(OHANA_SPLASH_FISH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-chess-beach-v3.webp") return new Response(OHANA_CHESS_BEACH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-tictac-beach-v3.webp") return new Response(OHANA_TICTAC_BEACH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if(req.method==='GET'&&p==='/ohana-family-bible-table-v1.webp')return new Response(OHANA_FAMILY_BIBLE_TABLE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=3600'}});
    if(req.method==='GET'&&p==='/journey-coloring-character-v1.webp')return new Response(JOURNEY_COLORING_CHARACTER,{headers:{'content-type':'image/webp','cache-control':'public,max-age=3600'}});
    if(req.method==='GET'&&p==='/ohana-color-entrance-v1.webp')return new Response(OHANA_COLOR_ENTRANCE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=86400'}});
if(req.method==='GET'&&p==='/ohana-journey-entrance-v1.webp')return new Response(JOURNEY_COLORING_ENTRANCE,{headers:{'content-type':'image/webp','cache-control':'public,max-age=3600'}});
    if (req.method === "GET" && p === "/ohana-coloring-beach-v1.webp") return new Response(b64ToBytesColoring(OHANA_COLORING_BEACH_B64), { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-words-detail-v3.webp") return new Response(OHANA_WORDS_DETAIL, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-beach-play-v4.webp") return new Response(OHANA_BEACH_PLAY, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-mikes-cards-v4.webp") return new Response(OHANA_MIKES_CARDS, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-handfoot-cards-v4.webp") return new Response(OHANA_HANDFOOT_CARDS, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-mikes-room-photo-v2.webp") return new Response(OHANA_MIKES_ROOM_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-mikes-room.webp") return new Response(OHANA_MIKES_ROOM_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-words-sign-v2.webp") return new Response(OHANA_WORDS_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-handfoot-sign-v2.webp") return new Response(OHANA_HANDFOOT_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-mahjong-sign-v2.webp") return new Response(OHANA_MAHJONG_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-ohana10-sign-v2.webp") return new Response(OHANA_OHANA10_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-domino-sign-v1.webp") return new Response(OHANA_DOMINO_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-domino-sign-v2.webp") return new Response(OHANA_DOMINO_PORCH_V2, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-chess-sign-v2.webp") return new Response(OHANA_CHESS_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-checkers-sign-v2.webp") return new Response(OHANA_CHECKERS_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-granny-crossword-cherish-20261013.webp") return new Response(OHANA_GRANNY_FINAL_0, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-granny-wordfind-cherish-20261013.webp") return new Response(OHANA_GRANNY_FINAL_1, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-granny-wordmix-cherish-20261013.webp") return new Response(OHANA_GRANNY_FINAL_2, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-granny-rocking-chair-cherish-20261013.webp") return new Response(OHANA_GRANNY_FINAL_3, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-granny-room-v89.webp") return new Response(OHANA_GRANNY_ROOM_V89, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-memories-room-v89.webp") return new Response(OHANA_MEMORIES_ROOM_V89, { headers: { "content-type":"image/webp", "cache-control":"public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-granny-nook-v86.webp") return new Response(OHANA_GRANNY_NOOK_V86, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=31536000,immutable" } });
    if (req.method === "GET" && p === "/ohana-memory-sign-v2.webp") return new Response(OHANA_MEMORY_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-tictac-sign-v2.webp") return new Response(OHANA_TICTAC_PORCH, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-puzzle-sign-v3.webp") return new Response(OHANA_PUZZLE_INVITE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-prayer-sign-v4.webp") return new Response(OHANA_PRAYER_INVITE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-mikes-porch.webp") return new Response(OHANA_MIKES_PORCH_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-ten-room-v103.webp") return new Response(OHANA_TEN_ROOM_V103, {headers:{"content-type":"image/webp","cache-control":"public,max-age=31536000,immutable"}});
    if (req.method === "GET" && p === "/ohana-jukebox.webp") return new Response(TSCMS_CABINET_V1,{headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if (req.method === "GET" && p === "/dad-cardinal.webp") return new Response(TSCMS_DAD_CARDINAL_V1,{headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if (req.method === "GET" && p === "/ohana-workstation-v103.webp") return new Response(OHANA_WORKSTATION_V103, {headers:{"content-type":"image/webp","cache-control":"public,max-age=31536000,immutable"}});
    if (req.method === "GET" && p === "/ohana-teal-mat-v103.webp") return new Response(OHANA_TEAL_MAT_V103, {headers:{"content-type":"image/webp","cache-control":"public,max-age=31536000,immutable"}});
    if (req.method === "GET" && p === "/layout-preview") {
      const width = Math.max(320, Math.min(1600, Number(url.searchParams.get("width")) || 864));
      const height = Math.max(480, Math.min(1800, Number(url.searchParams.get("height")) || 1e3));
      const game = encodeURIComponent(url.searchParams.get("game") || "words"), section = url.searchParams.get("section") === "bottom" ? "bottom" : "top";
      return new Response(`<!doctype html><html><head><title>Ohana responsive practice</title><style>body{margin:0;background:#173f50;color:white;font:14px sans-serif}iframe{display:block;border:0;margin:0 auto;width:${width}px;height:${height}px}</style></head><body><iframe title="Fictional game viewport" src="/accessibility-preview?game=${game}&section=${section}&build=ohana-v105-menu-label-repair"></iframe></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    }
    if (req.method === "GET" && p === "/accessibility-preview") return new Response(ACCESSIBILITY_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "content-encoding": "gzip", "cache-control": "no-store" } });
    if (req.method === "GET" && p === "/handfoot-preview") return new Response(HANDFOOT_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/word-error-preview") return new Response(WORD_ERROR_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/settings-preview") return new Response(SETTINGS_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/ohana-preview") return new Response(OHANA_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/setup-preview") return new Response(SETUP_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/nook-preview") return new Response(NOOK_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/rooms-preview") return new Response(ROOMS_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/buddies") return new Response(BUDDIES_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && PUZZLE_ASSETS[p]) return new Response(PUZZLE_ASSETS[p], { headers: { "content-type": "image/webp", "cache-control": "public, max-age=604800" } });
    if (req.method === "GET" && p.startsWith("/color/") && p.endsWith(".webp")) {
      const t = COLOR_THUMBS[p.slice(7, -5)];
      return t ? new Response(t, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=86400" } }) : new Response("Not found", { status: 404 });
    }
    if (req.method === "GET" && p.startsWith("/color/") && p.endsWith(".svg")) {
      const name = p.slice(7, -4), svg = COLOR_PAGES[name];
      return svg ? new Response(svg, { headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=86400", ...(COLOR_GZIP_PAGE_NAMES.has(name) ? { "content-encoding": "gzip" } : {}) } }) : new Response("Not found", { status: 404 });
    }
    if (req.method === "GET" && p === "/mahjong-preview") return new Response(MAHJONG_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/game-preview") return new Response(GAME_PREVIEW_HTML, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/porch") return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ohana Home \xB7 Living Porch</title><style>body{margin:0;min-height:100vh;background:#0b2e36;color:#f5e8cc;display:grid;place-content:center;font-family:Georgia,serif}main{width:min(96vw,620px)}a{display:block;text-align:center;color:#f5e8cc;margin:20px;text-decoration:none}</style></head><body><main><ohana-scene></ohana-scene><a href="/">Come on in \xB7 Ohana Home</a></main><script src="/ohana-scene.js"><\/script></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/ohana-garden-v1.webp") return new Response(OHANA_DETAIL_0, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    if (req.method === "GET" && p === "/ohana-cove-v1.webp") return new Response(OHANA_DETAIL_1, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    if (req.method === "GET" && p === "/ohana-flowers-v1.webp") return new Response(OHANA_DETAIL_2, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    if (req.method === "GET" && (p === "/ohana-family-home-v1.webp" || p === "/ohana-family-home-v2.webp")) return new Response(OHANA_FAMILY_HOME, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=86400" } });
    if (req.method === "GET" && p === "/ohana-world-scene.webp") return new Response(WORLD_SCENE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-world-table.webp") return new Response(WORLD_TABLE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-island.webp") return new Response(ISLAND_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/island-icons.js") return new Response(ISLAND_ICONS, { headers: { "content-type": "application/javascript", "cache-control": "no-cache" } });
    if (req.method === "GET" && p === "/ohana-scene.js") return new Response(SCENE_JS, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-cache" } });
    const porchAssets = { "/porch-dawn.webp": PORCH_DAWN, "/porch-day.webp": PORCH_DAY, "/porch-night.webp": PORCH_NIGHT, "/porch-played.webp": PORCH_PLAYED };
    if (req.method === "GET" && porchAssets[p]) return new Response(porchAssets[p], { headers: { "content-type": "image/webp", "cache-control": "public,max-age=3600" } });
    if (req.method === "GET" && p === "/ohana-welcome.png") return new Response(WELCOME_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=3600" } });
    // Browser review surface: runs the real app inside a phone-sized viewport.
    // It uses the regular sign-in and game APIs; it grants no extra access.
    if (req.method === "GET" && p === "/domino-mobile-review") {
      const reviewWidth = Math.max(320, Math.min(1280, Number(url.searchParams.get("width")) || 412));
      const reviewHeight = Math.max(280, Math.min(1100, Number(url.searchParams.get("height")) || 915));
      return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ohana phone review</title><style>body{margin:0;background:#133b44;color:#fff;font:16px system-ui;text-align:center}header{padding:12px}a{color:#83f0e3;margin:0 8px}iframe{display:block;margin:0 auto;border:0;width:${reviewWidth}px;height:${reviewHeight}px;max-width:100vw}</style></head><body><header>Ohana phone review · ${reviewWidth} × ${reviewHeight}<br><a href="?width=360&height=800">Small phone</a><a href="?width=412&height=915">Phone</a><a href="?width=768&height=1024">Tablet</a></header><iframe title="Ohana Home mobile app" src="/?v=ohana-family-tables-v70"></iframe></body></html>`, {headers:{"content-type":"text/html;charset=utf-8","cache-control":"no-store"}});
    }
    if (req.method === "GET" && (p === "/" || p === "/index.html")) return new Response(APP_HTML, { headers: { "content-type": "text/html;charset=utf-8", "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache", "expires": "0" } });
    if (req.method === "GET" && p.match(/^\/(?:invite|room)\/[a-f0-9]+$/)) return new Response(APP_HTML, { headers: { "content-type": "text/html;charset=utf-8", "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache", "expires": "0" } });
    if (req.method === "GET" && ["/get", "/download", "/install"].includes(p)) return new Response(GET_HTML, { headers: { "content-type": "text/html;charset=utf-8", "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache", "expires": "0" } });
    if (p === "/manifest.json") return json({ share_target: { action:"/memories/incoming", method:"POST", enctype:"multipart/form-data", params:{title:"title",text:"text",files:[{name:"photos",accept:["image/*",".jpg",".jpeg",".png",".webp",".heic",".heif"]}]} }, shortcuts:[{name:"Ohana Memories",short_name:"Memories",url:"/memories"}], name: "Ohana Home", short_name: "Ohana", start_url: "/", display: "standalone", background_color: "#0E3B47", theme_color: "#0E3B47", icons: [{ src: "/ohana-icon-192-v2.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/ohana-icon-512-v2.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }] });
    if (p === "/icon.svg") return Response.redirect(new URL("/ohana-icon-192-v2.png", url).href, 302);
    if (p === "/notification-badge.svg") return new Response(ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public,max-age=86400" } });
    if (p === "/sw.js") return new Response(SW, { headers: { "content-type": "application/javascript", "cache-control": "no-store, no-cache, must-revalidate, max-age=0" } });
    if (!p.startsWith("/api/")) return new Response("Not found", { status: 404 });
    try {
      return await api2(req, { ...env222222, ctx }, url);
    } catch (e) {
      return err(e.message || "Something went wrong", 400);
    }
  }
};
async function childPolicy(db, id) {
  const r = await db.prepare("SELECT value FROM settings WHERE key=?").bind("child_" + id).first();
  return r ? JSON.parse(r.value) : null;
}
__name(childPolicy, "childPolicy");
__name2(childPolicy, "childPolicy");
__name22(childPolicy, "childPolicy");
__name222(childPolicy, "childPolicy");
__name2222(childPolicy, "childPolicy");
__name22222(childPolicy, "childPolicy");
async function allowGame(db, id, type) {
  const policy = await childPolicy(db, id);
  if (policy && !policy.games.includes(type)) throw new Error("Your parent has not enabled this game. Ask them to update your games in Settings.");
}
__name(allowGame, "allowGame");
__name2(allowGame, "allowGame");
__name22(allowGame, "allowGame");
__name222(allowGame, "allowGame");
__name2222(allowGame, "allowGame");
__name22222(allowGame, "allowGame");
async function addNotices(env222222, ids, data) {
  ids = [...new Set(ids.filter((id) => id > 0))];
  if (!ids.length) return;
  await env222222.DB.batch(ids.map((id) => env222222.DB.prepare("INSERT INTO activity_notices(member_id,room_id,game_id,type,title,body,created_at) VALUES(?,?,?,?,?,?,?)").bind(id, data.roomId || null, data.gameId || null, data.type, data.title, data.body || "", now())));
  env222222.ctx?.waitUntil?.(notifyMembers(env222222.DB, ids, data).catch((e) => console.error("Ohana push delivery failed", e.message)));
}
__name(addNotices, "addNotices");
__name2(addNotices, "addNotices");
__name22(addNotices, "addNotices");
__name222(addNotices, "addNotices");
__name2222(addNotices, "addNotices");
__name22222(addNotices, "addNotices");
async function joinedRoom(env222222, roomId, member) {
  const added = await env222222.DB.prepare("INSERT OR IGNORE INTO room_members(room_id,member_id) VALUES(?,?)").bind(roomId, member.id).run();
  if (added.meta.changes) {
    const others = (await env222222.DB.prepare("SELECT member_id FROM room_members WHERE room_id=? AND member_id!=?").bind(roomId, member.id).all()).results;
    const room = await env222222.DB.prepare("SELECT name FROM rooms WHERE id=?").bind(roomId).first();
    await addNotices(env222222, others.map((x) => x.member_id), { type: "joined", title: member.name + " joined your Ohana", body: "Welcome them to " + (room?.name || "your room") + ".", roomId, tag: "ohana-join-" + roomId + "-" + member.id });
  }
}
__name(joinedRoom, "joinedRoom");
__name2(joinedRoom, "joinedRoom");
__name22(joinedRoom, "joinedRoom");
__name222(joinedRoom, "joinedRoom");
__name2222(joinedRoom, "joinedRoom");
__name22222(joinedRoom, "joinedRoom");
function mentions(text, members) {
  return members.filter((m) => new RegExp("(^|\\s)@" + m.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=$|[\\s.,!?;:])", "i").test(text) || /(^|\s)@everybody\b/i.test(text)).map((m) => m.id);
}
__name(mentions, "mentions");
__name2(mentions, "mentions");
__name22(mentions, "mentions");
__name222(mentions, "mentions");
__name2222(mentions, "mentions");
__name22222(mentions, "mentions");
function chatPeopleKey(players) {
  const ids = [...new Set(players.filter((p) => Number(p) > 0).map(Number))].sort((a, b) => a - b);
  return ids.length >= 2 ? "people:" + ids.join(",") : null;
}
__name(chatPeopleKey, "chatPeopleKey");
__name2(chatPeopleKey, "chatPeopleKey");
__name22(chatPeopleKey, "chatPeopleKey");
__name222(chatPeopleKey, "chatPeopleKey");
__name2222(chatPeopleKey, "chatPeopleKey");
__name22222(chatPeopleKey, "chatPeopleKey");
async function chatCatalog(db, me) {
  const policy = await childPolicy(db, me.id);
  const rooms = (await db.prepare("SELECT r.id,r.name FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE rm.member_id=?").bind(me.id).all()).results;
  const games = (await db.prepare("SELECT g.id,g.players,g.state,g.room_id,g.type FROM games g JOIN room_members rm ON rm.room_id=g.room_id WHERE rm.member_id=? AND EXISTS(SELECT 1 FROM json_each(g.players) WHERE value=?)").bind(me.id, me.id).all()).results;
  const threads = /* @__PURE__ */ new Map();
  for (const r of rooms) {
    const people = (await db.prepare("SELECT m.id,m.name,m.avatar,m.last_seen FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?").bind(r.id).all()).results.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, online: now() - (p.last_seen || 0) < ONLINE_MS }));
    threads.set("room:" + r.id, { key: "room:" + r.id, kind: "room", name: r.name, people, roomId: r.id, games: [] });
  }
  for (const g of games) {
    if (policy && !policy.games.includes(g.type)) continue;
    const key = chatPeopleKey(JSON.parse(g.players));
    if (!key) continue;
    const ids = key.slice(7).split(",").map(Number);
    const people = (threads.get("room:" + g.room_id)?.people || []).filter((p) => ids.includes(p.id));
    if (people.length !== ids.length) continue;
    if (!threads.has(key)) threads.set(key, { key, kind: ids.length === 2 ? "person" : "group", name: people.filter((p) => p.id !== me.id).map((p) => p.name).join(", "), people, roomId: g.room_id, games: [] });
    threads.get(key).games.push(g.id);
  }
  const direct = (await db.prepare("SELECT * FROM chat_threads WHERE EXISTS(SELECT 1 FROM json_each(members) WHERE value=?)").bind(me.id).all()).results;
  for (const t of direct) {
    if (threads.has(t.conversation)) continue;
    const room = threads.get("room:" + t.room_id), ids = JSON.parse(t.members);
    if (!room) continue;
    const people = room.people.filter((p) => ids.includes(p.id));
    if (people.length !== ids.length) continue;
    threads.set(t.conversation, { key: t.conversation, kind: ids.length === 2 ? "person" : "group", name: people.filter((p) => p.id !== me.id).map((p) => p.name).join(", "), people, roomId: t.room_id, games: [] });
  }
  return { threads, games, rooms };
}
__name(chatCatalog, "chatCatalog");
__name2(chatCatalog, "chatCatalog");
__name22(chatCatalog, "chatCatalog");
__name222(chatCatalog, "chatCatalog");
__name2222(chatCatalog, "chatCatalog");
__name22222(chatCatalog, "chatCatalog");
async function chatImport(db, catalog) {
  const statements = [], imports = new Map((await db.prepare("SELECT source,signature FROM chat_imports").all()).results.map((r) => [r.source, r.signature]));
  for (const r of catalog.rooms) statements.push(db.prepare("INSERT OR IGNORE INTO chat_messages(conversation,sender,text,image,created_at,source) SELECT ?,member_id,COALESCE(text,''),image,created_at,'room-message:'||id FROM messages WHERE room_id=?").bind("room:" + r.id, r.id));
  for (const g of catalog.games) {
    const key = chatPeopleKey(JSON.parse(g.players));
    if (!key || !catalog.threads.has(key) || !g.state) continue;
    let old;
    try {
      old = JSON.parse(g.state).chat || [];
    } catch {
      continue;
    }
    const signature = JSON.stringify(old), source = "game:" + g.id;
    if (imports.get(source) === signature) continue;
    const seen = {};
    for (const m of old) {
      if (!catalog.threads.get(key).people.some((p) => p.id === m.p)) continue;
      const fingerprint = JSON.stringify([m.p, m.t, m.text]), occurrence = seen[fingerprint] = (seen[fingerprint] || 0) + 1;
      statements.push(db.prepare("INSERT OR IGNORE INTO chat_messages(conversation,sender,text,created_at,source) VALUES(?,?,?,?,?)").bind(key, m.p, String(m.text || ""), Number(m.t) || 0, source + ":" + fingerprint + ":" + occurrence));
    }
    statements.push(db.prepare("INSERT INTO chat_imports(source,signature) VALUES(?,?) ON CONFLICT(source) DO UPDATE SET signature=excluded.signature").bind(source, signature));
  }
  for (let i = 0; i < statements.length; i += 50) await db.batch(statements.slice(i, i + 50));
}
__name(chatImport, "chatImport");
__name2(chatImport, "chatImport");
__name22(chatImport, "chatImport");
__name222(chatImport, "chatImport");
__name2222(chatImport, "chatImport");
__name22222(chatImport, "chatImport");

const OHANA_CHAT_REACTIONS=new Set(['like','love','laugh','wow','sad','pray','hug','ohana:honu-love','ohana:eddie-cheer','ohana:honu-hug']);
async function ensureChatReactions(db){await db.prepare('CREATE TABLE IF NOT EXISTS chat_reactions(message_id INTEGER NOT NULL,member_id INTEGER NOT NULL,reaction TEXT,updated_at INTEGER NOT NULL,PRIMARY KEY(message_id,member_id))').run();}
async function readChatReactions(db,conversation,ids,memberId){const result=[];ids=[...new Set(ids)];for(let offset=0;offset<ids.length;offset+=80){const chunk=ids.slice(offset,offset+80),marks=chunk.map(()=>'?').join(',');result.push(...(await db.prepare('SELECT r.message_id,r.reaction AS id,COUNT(*) AS count,MAX(CASE WHEN r.member_id=? THEN 1 ELSE 0 END) AS mine FROM chat_reactions r JOIN chat_messages m ON m.id=r.message_id WHERE m.conversation=? AND r.message_id IN ('+marks+') AND r.reaction IS NOT NULL GROUP BY r.message_id,r.reaction').bind(memberId,conversation,...chunk).all()).results);}return result;}

async function unifiedChat(req, env222222, me, body, url) {
  const db = env222222.DB, { threads, ...rest } = await chatCatalog(db, me), catalog = { threads, ...rest };
  await chatImport(db, catalog);
  await ensureChatReactions(db);
  const started = Number((await db.prepare("SELECT value FROM settings WHERE key='chat_started'").first())?.value) || 0;
  if (req.method === "POST" && body.action === "start") {
    const target = Number(body.memberId), room = [...threads.values()].find((t) => t.kind === "room" && t.people.some((p) => p.id === target));
    if (!room || target === me.id) return err("Choose someone in your Ohana.", 403);
    const members = [me.id, target].sort((a, b) => a - b), key2 = chatPeopleKey(members);
    await db.prepare("INSERT OR IGNORE INTO chat_threads(conversation,room_id,members) VALUES(?,?,?)").bind(key2, room.roomId, JSON.stringify(members)).run();
    return json({ conversation: key2 });
  }
  const key = String(body.conversation || url.searchParams.get("conversation") || ""), thread = threads.get(key);
  if (key && !thread) return err("This conversation is not available to you.", 403);
  if (req.method === "POST") {
    if (!thread) return err("Choose a conversation.", 400);
    if(body.action==='react'){
      const messageId=Number(body.messageId),reaction=String(body.reaction??'');
      if(!Number.isSafeInteger(messageId)||messageId<1||reaction&&!OHANA_CHAT_REACTIONS.has(reaction))return err('Choose a valid message reaction.',400);
      const message=await db.prepare('SELECT id FROM chat_messages WHERE id=? AND conversation=?').bind(messageId,key).first();
      if(!message)return err('This message is not available in this conversation.',404);
      await db.prepare('INSERT INTO chat_reactions(message_id,member_id,reaction,updated_at) VALUES(?,?,?,?) ON CONFLICT(message_id,member_id) DO UPDATE SET reaction=excluded.reaction,updated_at=excluded.updated_at').bind(messageId,me.id,reaction||null,now()).run();
      return json({ok:true});
    }
    if (body.action === "delete") {
      if (thread.kind === "room") return err("Room chats stay put \u2014 they belong to the whole room.", 400);
      await db.batch([
        db.prepare("DELETE FROM chat_reactions WHERE message_id IN (SELECT id FROM chat_messages WHERE conversation=?)").bind(key),
        db.prepare("DELETE FROM chat_messages WHERE conversation=?").bind(key),
        db.prepare("DELETE FROM chat_threads WHERE conversation=?").bind(key),
        db.prepare("DELETE FROM chat_reads WHERE conversation=?").bind(key),
        db.prepare("DELETE FROM chat_preferences WHERE conversation=?").bind(key)
      ]);
      return json({ ok: true });
    }
    if (body.action === "mute") {
      await db.prepare("INSERT INTO chat_preferences(conversation,member_id,muted) VALUES(?,?,?) ON CONFLICT(conversation,member_id) DO UPDATE SET muted=excluded.muted").bind(key, me.id, body.muted ? 1 : 0).run();
      return json({ ok: true });
    }
    if (body.action === "read") {
      const through = Math.max(0, Number(body.through) || 0), last = await db.prepare("SELECT MAX(id) AS id FROM chat_messages WHERE conversation=? AND id<=?").bind(key, through).first();
      await db.prepare("INSERT INTO chat_reads(conversation,member_id,through_id) VALUES(?,?,?) ON CONFLICT(conversation,member_id) DO UPDATE SET through_id=MAX(through_id,excluded.through_id)").bind(key, me.id, last.id || 0).run();
      const stamp = await db.prepare("SELECT MAX(created_at) AS t FROM chat_messages WHERE conversation=? AND id<=?").bind(key, last.id || 0).first();
      if (thread.kind === "room") await db.prepare("UPDATE activity_notices SET seen=1 WHERE member_id=? AND room_id=? AND game_id IS NULL AND type IN ('chat','mention') AND created_at<=?").bind(me.id, thread.roomId, stamp.t || 0).run();
      else for (const game of thread.games) await db.prepare("UPDATE activity_notices SET seen=1 WHERE member_id=? AND game_id=? AND type IN ('chat','mention') AND created_at<=?").bind(me.id, game, stamp.t || 0).run();
      return json({ ok: true });
    }
    const text = String(body.text || "").trim().slice(0, 2e3), image = body.image ? String(body.image) : null, client = String(body.clientId || "");
    if (!text && !image) return err("Write a message first.", 400);
    if (!/^[a-zA-Z0-9_-]{8,100}$/.test(client)) return err("Message identifier missing.", 400);
    if (image && (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 9e5)) return err("Choose a smaller photo.", 400);
    const source = "send:" + me.id + ":" + client;
    const saved = await db.prepare("INSERT OR IGNORE INTO chat_messages(conversation,sender,text,image,created_at,source) VALUES(?,?,?,?,?,?)").bind(key, me.id, text, image, now(), source).run();
    if (saved.meta.changes) {
      const muted = (await db.prepare("SELECT member_id FROM chat_preferences WHERE conversation=? AND muted=1").bind(key).all()).results.map((p) => p.member_id);
      const recipients = thread.people.filter((p) => p.id !== me.id && !muted.includes(p.id)), tagged = mentions(text, thread.people);
      env222222.ctx?.waitUntil?.(notifyMembers(db, recipients.map((p) => p.id), { type: "chat", title: me.name + (tagged.length ? " sent a message or mention" : ""), body: text || "Shared a photo", conversation: key, roomId: thread.roomId, tag: "ohana-conversation-" + key }).catch(() => {
      }));
    }
    return json({ ok: true });
  }
  if(thread&&url.searchParams.get('reactionsOnly')==='1'){const ids=String(url.searchParams.get('ids')||'').split(',').map(Number).filter(n=>Number.isSafeInteger(n)&&n>0).slice(0,1000);return json({reactions:await readChatReactions(db,key,ids,me.id)});}
  if (thread) {
    const before = Math.max(0, Number(url.searchParams.get("before")) || 0);
    const rows = (await db.prepare("SELECT id,sender,text,image,created_at FROM chat_messages WHERE conversation=? AND (?=0 OR id<?) ORDER BY id DESC LIMIT 100").bind(key, before, before).all()).results.reverse();
    const reactions=await readChatReactions(db,key,rows.map(m=>m.id),me.id);for(const message of rows)message.reactions=reactions.filter(r=>r.message_id===message.id).map(r=>({id:r.id,count:Number(r.count),mine:!!r.mine}));
    return json({ thread, messages: rows, more: rows.length === 100 });
  }
  const keys = [...threads.keys()];
  if (!keys.length) return json({ conversations: [], unread: 0 });
  const marks = keys.map(() => "?").join(",");
  const statistics = (await db.prepare(`SELECT m.conversation,MAX(m.id) AS last_id,SUM(CASE WHEN m.sender!=? AND m.id>COALESCE(r.through_id,0) AND m.created_at>? THEN 1 ELSE 0 END) AS unread FROM chat_messages m LEFT JOIN chat_reads r ON r.conversation=m.conversation AND r.member_id=? WHERE m.conversation IN (${marks}) GROUP BY m.conversation`).bind(me.id, started, me.id, ...keys).all()).results;
  const lastIds = statistics.map((t) => t.last_id), latest = lastIds.length ? (await db.prepare("SELECT id,text,sender,created_at FROM chat_messages WHERE id IN (" + lastIds.map(() => "?").join(",") + ")").bind(...lastIds).all()).results : [];
  const preferences = (await db.prepare("SELECT conversation,muted FROM chat_preferences WHERE member_id=?").bind(me.id).all()).results;
  const summaries = [...threads.values()].map((t) => {
    const stats = statistics.find((s) => s.conversation === t.key);
    return { ...t, unread: stats?.unread || 0, last: latest.find((m) => m.id === stats?.last_id) || null, muted: !!preferences.find((p) => p.conversation === t.key)?.muted };
  });
  summaries.sort((a, b) => (b.last?.created_at || 0) - (a.last?.created_at || 0));
  return json({ conversations: summaries, unread: summaries.reduce((n, t) => n + t.unread, 0) });
}
__name(unifiedChat, "unifiedChat");
__name2(unifiedChat, "unifiedChat");
__name22(unifiedChat, "unifiedChat");
__name222(unifiedChat, "unifiedChat");
__name2222(unifiedChat, "unifiedChat");
__name22222(unifiedChat, "unifiedChat");
async function prayerApi(req, env222222, p, body, me, roomId) {
  const db = env222222.DB;
  const COMFORT = [
    ["Cast all your anxiety on Him because He cares for you.", "1 Peter 5:7"],
    ["The Lord is near to the brokenhearted.", "Psalm 34:18"],
    ["Where two or three gather in My name, there am I with them.", "Matthew 18:20"],
    ["Do not be anxious about anything... present your requests to God.", "Philippians 4:6"],
    ["Give thanks in all circumstances.", "1 Thessalonians 5:18"],
    ["The prayer of a righteous person is powerful and effective.", "James 5:16"],
    ["He heals the brokenhearted and binds up their wounds.", "Psalm 147:3"],
    ["Come to Me, all you who are weary, and I will give you rest.", "Matthew 11:28"]
  ];
  const shape = /* @__PURE__ */ __name2222((row, lifts, mine) => ({
    id: row.id,
    kind: row.kind,
    text: row.text,
    status: row.status,
    color: row.color,
    anon: !!row.anon,
    name: row.anon ? null : row.name || "Someone",
    avatar: row.anon ? null : row.avatar,
    mine: row.author_id === me.id,
    created_at: row.created_at,
    lifts: lifts[row.id] || 0,
    i_lifted: !!(mine && mine.has(row.id))
  }), "shape");
  if (p === "/api/prayers" && req.method === "GET") {
    const rows = (await db.prepare("SELECT * FROM prayers WHERE room_id=? ORDER BY created_at DESC LIMIT 400").bind(roomId).all()).results;
    const ids = rows.map((r) => r.id);
    const lifts = {};
    const mineSet = /* @__PURE__ */ new Set();
    if (ids.length) {
      const marks = ids.map(() => "?").join(",");
      for (const r of (await db.prepare("SELECT prayer_id, COUNT(*) c FROM prayer_lifts WHERE prayer_id IN (" + marks + ") GROUP BY prayer_id").bind(...ids).all()).results) lifts[r.prayer_id] = r.c;
      for (const r of (await db.prepare("SELECT prayer_id FROM prayer_lifts WHERE member_id=? AND prayer_id IN (" + marks + ")").bind(me.id, ...ids).all()).results) mineSet.add(r.prayer_id);
    }
    const verse = COMFORT[Math.floor(Date.now() / 864e5) % COMFORT.length];
    return json({ prayers: rows.map((r) => shape(r, lifts, mineSet)), verse });
  }
  if (p === "/api/prayers/create" && req.method === "POST") {
    const kind = body.kind === "praise" ? "praise" : "prayer";
    const text = String(body.text || "").trim().slice(0, 800);
    if (!text) throw new Error("Write a few words first.");
    const anon = body.anon ? 1 : 0;
    const color = Math.max(0, Math.min(4, parseInt(body.color, 10) || 0));
    const r = await db.prepare("INSERT INTO prayers(room_id,author_id,name,avatar,kind,text,anon,status,color,created_at,updated_at) VALUES(?,?,?,?,?,?,?, 'open', ?,?,?)").bind(roomId, me.id, me.name, me.avatar, kind, text, anon, color, now(), now()).run();
    const others = (await db.prepare("SELECT member_id FROM room_members WHERE room_id=? AND member_id!=?").bind(roomId, me.id).all()).results.map((x) => x.member_id);
    const who = anon ? "Someone in the Ohana" : me.name;
    env222222.ctx?.waitUntil?.(addNotices(env222222, others, { type: "prayer", roomId, title: kind === "praise" ? who + " shared a praise \u{1F64C}" : who + " shared a prayer request \u{1F64F}", body: text.slice(0, 90), tag: "prayer-" + r.meta.last_row_id }).catch(() => {
    }));
    return json({ ok: true, id: r.meta.last_row_id });
  }
  const m = p.match(/^\/api\/prayers\/(\d+)\/(\w+)$/);
  if (m && req.method === "POST") {
    const id = +m[1], action = m[2];
    const row = await db.prepare("SELECT * FROM prayers WHERE id=? AND room_id=?").bind(id, roomId).first();
    if (!row) throw new Error("That note is no longer here.");
    const owner = row.author_id === me.id || (roomId === 1 ? me.is_admin : false);
    if (action === "lift") {
      const ins = await db.prepare("INSERT OR IGNORE INTO prayer_lifts(prayer_id,member_id,created_at) VALUES(?,?,?)").bind(id, me.id, now()).run();
      if (ins.meta.changes > 0 && row.author_id && row.author_id !== me.id) {
        const isPraise = row.kind === "praise";
        env222222.ctx?.waitUntil?.(addNotices(env222222, [row.author_id], {
          type: "prayer",
          roomId,
          title: isPraise ? me.name + " is celebrating with you \u{1F64C}" : me.name + " is praying with you \u{1F64F}",
          body: (row.text || "").slice(0, 90),
          tag: "prayer-lift-" + id + "-" + me.id
        }).catch(() => {
        }));
      }
    } else if (action === "unlift") {
      await db.prepare("DELETE FROM prayer_lifts WHERE prayer_id=? AND member_id=?").bind(id, me.id).run();
    } else if (action === "answered") {
      if (!owner) throw new Error("Only the person who shared it can mark it answered.");
      await db.prepare("UPDATE prayers SET status='answered', updated_at=? WHERE id=?").bind(now(), id).run();
    } else if (action === "reopen") {
      if (!owner) throw new Error("Only the person who shared it can change it.");
      await db.prepare("UPDATE prayers SET status='open', updated_at=? WHERE id=?").bind(now(), id).run();
    } else if (action === "delete") {
      if (!owner) throw new Error("Only the person who shared it can remove it.");
      await db.batch([
        db.prepare("DELETE FROM prayer_lifts WHERE prayer_id=?").bind(id),
        db.prepare("DELETE FROM prayers WHERE id=?").bind(id)
      ]);
    } else if (action === "edit") {
      if (!owner) throw new Error("Only the person who shared it can edit it.");
      const text = String(body.text || "").trim().slice(0, 800);
      if (!text) throw new Error("Write a few words first.");
      await db.prepare("UPDATE prayers SET text=?, updated_at=? WHERE id=?").bind(text, now(), id).run();
    } else throw new Error("Unknown action.");
    const c = (await db.prepare("SELECT COUNT(*) c FROM prayer_lifts WHERE prayer_id=?").bind(id).first()).c;
    return json({ ok: true, lifts: c });
  }
  return null;
}
__name(prayerApi, "prayerApi");
__name2(prayerApi, "prayerApi");
__name22(prayerApi, "prayerApi");
__name222(prayerApi, "prayerApi");
__name2222(prayerApi, "prayerApi");
__name22222(prayerApi, "prayerApi");
// Private megaphone responses. Author identity and original recipients are persisted.
function ohanaAnnouncementImages(images){
 if(images==null)return [];if(!Array.isArray(images)||images.length>2)throw Error('Choose up to two announcement pictures/videos.');
 const out=[];for(const image of images){const builtin=image?.src==='/ohana-announcement-menu-hide-v1.jpg',privateMedia=/^\/api\/announce-media\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(image?.src||'');if(!image||(!builtin&&!privateMedia)||image.alt!=null&&typeof image.alt!=='string'||privateMedia&&!['image/jpeg','video/mp4','video/webm'].includes(image.mime))throw Error('Choose an available announcement picture/video.');if(!out.some(x=>x.src===image.src))out.push({src:image.src,alt:String(image.alt||'Ohana announcement').trim().slice(0,160),...(privateMedia?{mime:image.mime}:{})});}return out;
}
async function ensureOhanaAnnouncementSchema(db){
 await db.batch([
  db.prepare("CREATE TABLE IF NOT EXISTS megaphone_attachments(announcement_id INTEGER PRIMARY KEY,images TEXT NOT NULL)"),
  db.prepare("CREATE TABLE IF NOT EXISTS megaphone_announcements(id INTEGER PRIMARY KEY,room_id INTEGER NOT NULL,author_id INTEGER NOT NULL,text TEXT NOT NULL,name TEXT NOT NULL,avatar TEXT NOT NULL,created_at INTEGER NOT NULL)"),
  db.prepare("CREATE TABLE IF NOT EXISTS megaphone_recipients(announcement_id INTEGER NOT NULL,member_id INTEGER NOT NULL,PRIMARY KEY(announcement_id,member_id))"),
  db.prepare("CREATE TABLE IF NOT EXISTS megaphone_responses(announcement_id INTEGER NOT NULL,member_id INTEGER NOT NULL,emoji TEXT NOT NULL DEFAULT '',text TEXT NOT NULL DEFAULT '',created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,PRIMARY KEY(announcement_id,member_id))")
 ]);
}
async function ohanaAnnouncementRoomAccess(db,roomId,memberId){return !!await db.prepare("SELECT r.id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')").bind(roomId,memberId).first();}
async function createOhanaAnnouncement(db,me,roomId,text,media){
 if(!await ohanaAnnouncementRoomAccess(db,roomId,me.id))throw Error('This room is no longer available.');
 const images=ohanaAnnouncementImages(media);if(images.some(i=>i.src.startsWith('/api/')))throw Error('Use the photo/video composer to send uploaded media.');await ensureOhanaAnnouncementSchema(db);const createdAt=now();
 const inserted=await db.prepare("INSERT INTO megaphone_announcements(id,room_id,author_id,text,name,avatar,created_at) SELECT MAX(?,COALESCE((SELECT MAX(id) FROM megaphone_announcements),0)+1),?,?,?,?,?,?").bind(createdAt,roomId,me.id,text,String(me.name||''),String(me.avatar||''),createdAt).run();
 const id=Number(inserted.meta.last_row_id);
 if(!Number.isSafeInteger(id)||id<=0)throw Error('The announcement was not saved. Please try again.');
 const announcement={id,text,member_id:me.id,name:me.name,avatar:me.avatar,created_at:createdAt,responses_enabled:true,images};
  const writes=await db.batch([
   db.prepare("INSERT INTO megaphone_attachments(announcement_id,images) VALUES(?,?)").bind(id,JSON.stringify(images)),
   db.prepare("INSERT INTO megaphone_recipients(announcement_id,member_id) SELECT ?,member_id FROM room_members WHERE room_id=? AND member_id<>?").bind(id,roomId,me.id),
  db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind('announce_room_'+roomId,JSON.stringify(announcement))
 ]);
  announcement.recipient_count=Number(writes[1]?.meta?.changes||0);return announcement;
}
async function ohanaAnnouncementResponseApi(req,db,me,roomId,body,url){
 const p=url.pathname,m=p.match(/^\/api\/announce\/(\d+)\/(responses|respond)$/);
 if(p!=='/api/announce/mine'&&!m)return null;
 if(!await ohanaAnnouncementRoomAccess(db,roomId,me.id))return err('This room is no longer available.',403);
 await ensureOhanaAnnouncementSchema(db);
 if(p==='/api/announce/mine'){
  if(req.method!=='GET')return err('Use GET to view your announcements.',405);
  const announcements=(await db.prepare("SELECT a.id,a.text,a.name,a.avatar,a.created_at,a.author_id AS member_id,COALESCE(media.images,'[]') AS images_json,(SELECT COUNT(*) FROM megaphone_recipients r WHERE r.announcement_id=a.id) AS recipient_count,(SELECT COUNT(*) FROM megaphone_responses x WHERE x.announcement_id=a.id) AS response_count FROM megaphone_announcements a LEFT JOIN megaphone_attachments media ON media.announcement_id=a.id WHERE a.room_id=? AND a.author_id=? ORDER BY a.id DESC LIMIT 50").bind(roomId,me.id).all()).results;
  return json({announcements:announcements.map(a=>{let images=[];try{images=ohanaAnnouncementImages(JSON.parse(a.images_json));}catch{}const {images_json,...rest}=a;return {...rest,images};})});
 }
 const id=Number(m[1]);if(!Number.isSafeInteger(id)||id<=0)return err('This announcement is unavailable.',404);
 const announcement=await db.prepare("SELECT id,room_id,author_id FROM megaphone_announcements WHERE id=? AND room_id=?").bind(id,roomId).first();
 if(!announcement)return err('This announcement is unavailable.',404);
 if(m[2]==='responses'){
  if(req.method!=='GET')return err('Use GET to view responses.',405);
  if(Number(announcement.author_id)!==Number(me.id))return err('Only the person who sent this announcement can view its responses.',403);
  const responses=(await db.prepare("SELECT x.member_id,COALESCE(m.name,'Ohana member') AS name,COALESCE(m.avatar,'') AS avatar,x.emoji,x.text,x.created_at,x.updated_at FROM megaphone_responses x LEFT JOIN members m ON m.id=x.member_id WHERE x.announcement_id=? ORDER BY x.updated_at DESC,x.member_id").bind(id).all()).results;
  return json({responses});
 }
 if(!['GET','POST'].includes(req.method))return err('Use GET or POST for your response.',405);
 const recipient=await db.prepare("SELECT member_id FROM megaphone_recipients WHERE announcement_id=? AND member_id=?").bind(id,me.id).first();
 if(!recipient)return err('Only an original recipient can respond to this announcement.',403);
 if(req.method==='POST'){
  if((body.text!=null&&typeof body.text!=='string')||(body.emoji!=null&&typeof body.emoji!=='string'))return err('Write a reply or choose a reaction.',400);
  const text=String(body.text||'').trim(),emoji=String(body.emoji||'');
  if(text.length>500)return err('Keep your reply to 500 characters.',400);
  if(emoji&&!['👍','❤️','😂','😮','😢','🙏','🎉'].includes(emoji))return err('Choose one of the available reactions.',400);
  if(!text&&!emoji)return err('Write a reply or choose a reaction.',400);
  const at=now();
  const saved=await db.prepare("INSERT INTO megaphone_responses(announcement_id,member_id,emoji,text,created_at,updated_at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM room_members WHERE room_id=? AND member_id=?) AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||? AND value<>'') AND EXISTS(SELECT 1 FROM megaphone_recipients WHERE announcement_id=? AND member_id=?) ON CONFLICT(announcement_id,member_id) DO UPDATE SET emoji=excluded.emoji,text=excluded.text,updated_at=excluded.updated_at").bind(id,me.id,emoji,text,at,at,roomId,me.id,roomId,id,me.id).run();
  if(!saved.meta.changes)return err('This room is no longer available.',403);
 }
 const response=await db.prepare("SELECT emoji,text,created_at,updated_at FROM megaphone_responses WHERE announcement_id=? AND member_id=?").bind(id,me.id).first();
 return json({ok:true,response:response||null});
}

async function ohanaCreateReplay(db,env,me,g,players,names){
 if(g.status!=='finished'||!players.includes(me.id))throw Error('Finish this game before replaying.');
 await db.prepare('CREATE TABLE IF NOT EXISTS game_replays (original_game_id INTEGER PRIMARY KEY, new_game_id INTEGER NOT NULL DEFAULT 0)').run();
 const existing=await db.prepare('SELECT new_game_id FROM game_replays WHERE original_game_id=?').bind(g.id).first();
 if(existing?.new_game_id>0)return {id:existing.new_game_id,existing:true};
 if(existing?.new_game_id<0)throw Error('This replay is still being prepared. Check My games before trying again.');
 const type=GAME_TYPES[g.type],seats=[...new Set(players)],human=seats.filter(id=>!gameBotPlayer(g.type,id)),withBot=seats.some(id=>gameBotPlayer(g.type,id));
 const spadesBotReplay=g.type==='spades'&&withBot&&human.length===1&&seats.includes(BOT_ID)&&((seats.length===2)||(seats.length===4&&seats.includes(-2)&&seats.includes(-3)));
 if(!type||seats.length!==players.length||!human.every(id=>Number.isInteger(id)&&id>0&&names[id])||(!spadesBotReplay&&seats.length<type.min)||seats.length>type.max)throw Error('The original players are no longer all available for this game. Your finished game is unchanged.');
 if(withBot&&!spadesBotReplay&&(human.length!==1||seats.length!==2||!['words','domino','tictac','memory','checkers','chess','handfoot','ohana10','mahjong','shuffle'].includes(g.type)))throw Error('This replay needs the original family players. Your finished game is unchanged.');
 for(const member of human)await allowGame(db,member,g.type);
 const recipients=human.filter(id=>id!==me.id),ts=now(),inviteCode=rid(6),max=spadesBotReplay?4:seats.length,started=withBot||max===1;
 const nextSeats=started?(withBot?gameBotSeats(g.type,me.id):[me.id]):[me.id];let state=null;
 const replayMode=g.type==='domino'?dominoCreationMode(g.mode):(g.mode||'classic');
 if(started){state=initState(g.type,nextSeats,g.id*7919+ts%100000,replayMode);if(withBot)state.bot={id:BOT_ID,name:'Ohana Robot',avatar:'@hon',difficulty:JSON.parse(g.state||'{}').bot?.difficulty||'easy',memory:{},moves:0};}
 await db.prepare('INSERT OR IGNORE INTO game_replays(original_game_id,new_game_id) VALUES(?,0)').bind(g.id).run();
 const batch=[
  db.prepare('INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,mode,invite_code,room_id,state) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM game_replays WHERE original_game_id=? AND new_game_id=0)').bind(g.type,JSON.stringify(nextSeats),max,started?'playing':'waiting',state&&Number.isInteger(state.nextTurn)?state.nextTurn:0,me.id,ts,ts,replayMode,inviteCode,g.room_id,state?JSON.stringify(state):null,g.id),
  db.prepare('UPDATE game_replays SET new_game_id=(SELECT id FROM games WHERE invite_code=? AND created_by=? AND created_at=? AND room_id=? ORDER BY id DESC LIMIT 1) WHERE original_game_id=? AND new_game_id=0').bind(inviteCode,me.id,ts,g.room_id,g.id)
 ];
 if(!started)for(const member of recipients)batch.push(db.prepare("INSERT OR IGNORE INTO game_invitations(game_id,member_id,sender_id,status,created_at) SELECT r.new_game_id,?,?,'pending',? FROM game_replays r JOIN games child ON child.id=r.new_game_id WHERE r.original_game_id=? AND r.new_game_id>0 AND child.invite_code=? AND child.created_by=? AND child.created_at=?").bind(member,me.id,ts,g.id,inviteCode,me.id,ts));
 const results=await db.batch(batch),mapped=await db.prepare('SELECT new_game_id FROM game_replays WHERE original_game_id=?').bind(g.id).first();
 if(!(mapped?.new_game_id>0))throw Error('Could not confirm the replay. Check My games before trying again.');
 const created=!!results[0]?.meta?.changes;
 if(created&&!started&&recipients.length)env.ctx?.waitUntil?.(notifyMembers(db,recipients,{type:'invite',title:me.name+' invited you to replay',body:'Join '+(type.name||g.type)+' in Ohana Home.',tag:'ohana-replay-'+mapped.new_game_id}).catch(()=>{}));
 return {id:mapped.new_game_id,existing:!created};
}

async function api2(req, env222222, url) {
  const db = env222222.DB;
  const p = url.pathname;
  const body = req.method === "POST" && p!=="/api/music/upload" && !p.startsWith("/api/announce-media/") ? await req.json().catch(() => ({})) : {};
  if (p === "/api/ai-chat") {
    const conv = "ohana-ai-chat";
    const AI_CODES = { "CLAUDE-KTAMA3L5TCW6": "claude", "ANTIGRAV-P7OY4JFRL936": "antigravity", "CHATGPT-9IS145SNOYKZ": "chatgpt" };
    const AI_IDS = { claude: -101, antigravity: -102, chatgpt: -103 };
    const meAi = await auth(req, env222222);
    let author = null, senderId = 0;
    const codeIn = String(body && body.code || url.searchParams.get("code") || "").trim();
    if (codeIn && AI_CODES[codeIn]) {
      author = AI_CODES[codeIn];
      senderId = AI_IDS[author];
    } else if (meAi && meAi.is_admin) {
      author = "kevin";
      senderId = meAi.id;
    }
    if (!author) return err("This chat is private.", 403);
    const sayText = String(body && body.text || url.searchParams.get("say") || "").trim().slice(0, 4e3);
    const doWrite = req.method === "POST" ? !!sayText : url.searchParams.has("say");
    if (doWrite) {
      let target = String(body && body.target || url.searchParams.get("target") || "any").toLowerCase();
      if (!["claude", "antigravity", "chatgpt", "kevin", "any"].includes(target)) target = "any";
      const msgSource = "aichat:" + author + ":" + target + ":" + now() + ":" + Math.random().toString(36).slice(2, 8);
      await db.prepare("INSERT INTO chat_messages(conversation,sender,text,image,created_at,source) VALUES(?,?,?,?,?,?)").bind(conv, senderId, sayText, null, now(), msgSource).run();
    }
    const since = Math.max(0, Number(url.searchParams.get("since")) || 0);
    const rows = (await db.prepare("SELECT id,sender,text,created_at,source FROM chat_messages WHERE conversation=? AND id>? ORDER BY id ASC LIMIT 400").bind(conv, since).all()).results;
    const who = /* @__PURE__ */ __name222((x) => {
      const m = /^aichat:([a-z]+):/.exec(x || "");
      return m ? m[1] : "?";
    }, "who");
    const tgt = /* @__PURE__ */ __name222((x) => {
      const m = /^aichat:[a-z]+:([a-z]+)/.exec(x || "");
      return m ? m[1] : "any";
    }, "tgt");
    return json({ you: author, messages: rows.map((r) => ({ id: r.id, from: who(r.source), target: tgt(r.source), text: r.text, at: r.created_at })) });
  }
  if (p === "/api/join" && req.method === "POST") {
    const code = String(body.code || "").trim().toUpperCase();
    const name = String(body.name || "").trim().slice(0, 24);
    const pin = String(body.pin || "").trim();
    const avatar = String(body.avatar || "\u{1F642}").slice(0, 4);
    const signin = !!body.signin;
    if (!name) throw new Error("Tell us your name.");
    if (!/^\d{4}$/.test(pin)) throw new Error("PIN needs to be 4 numbers.");
    const ph = await hash(pin);
    let m = await db.prepare("SELECT * FROM members WHERE name=? COLLATE NOCASE").bind(name).first();
    if (signin) {
      if (!m) throw new Error("We don't see anyone named " + name + ". Check the spelling, or tap 'First time here?' to join.");
      if (m.pin !== ph) throw new Error("That PIN does not match. Try again.");
    } else if (code !== (await getSetting(db, "family_code")).toUpperCase()) throw new Error("That family code is not right.");
    else if (m) {
      if (m.pin !== ph) throw new Error("That PIN does not match this name. If this is you, try again. If not, pick a different name.");
    } else {
      const count322222 = (await db.prepare("SELECT COUNT(*) c FROM members").first()).c;
      const r = await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,?,?,?)").bind(name, ph, avatar, rid(), count322222 === 0 ? 1 : 0, now(), now()).run();
      m = await db.prepare("SELECT * FROM members WHERE id=?").bind(r.meta.last_row_id).first();
    }
    if (!m.token) {
      m.token = rid();
      await db.prepare("UPDATE members SET token=? WHERE id=?").bind(m.token, m.id).run();
    }
    if (!signin && avatar && avatar !== m.avatar) await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, m.id).run();
    const policy = await childPolicy(db, m.id);
    if (!policy) await joinedRoom(env222222, 1, m);
    return json({ token: m.token, room_id: policy ? (await db.prepare("SELECT room_id FROM room_members WHERE member_id=? ORDER BY room_id LIMIT 1").bind(m.id).first())?.room_id : 1, me: { id: m.id, name: m.name, avatar: signin ? m.avatar : avatar, is_admin: m.is_admin || ((env222222.ADMIN_NAME || "").toLowerCase() === m.name.toLowerCase() ? 1 : 0) } });
  }
  const invMatch = p.match(/^\/api\/invite\/([a-f0-9]+)(?:\/(\w+))?$/);
  if (invMatch) {
    const invCode = invMatch[1];
    const invAction = invMatch[2];
    const g = await db.prepare("SELECT * FROM games WHERE invite_code=?").bind(invCode).first();
    if (!g) throw new Error("This invite link isn't valid anymore.");
    const players = JSON.parse(g.players);
    const gt = GAME_TYPES[g.type];
    const creatorRow = await db.prepare("SELECT name,avatar FROM members WHERE id=?").bind(g.created_by).first();
    if (!invAction && req.method === "GET") {
      return json({
        game_id: g.id,
        type: g.type,
        game_name: gt?.name || g.type,
        bot: g.state ? JSON.parse(g.state).bot || null : null,
        mode: g.mode || "classic",
        status: g.status,
        player_count: players.length,
        max_players: g.max_players,
        created_by: creatorRow ? creatorRow.name : "Someone",
        created_by_avatar: creatorRow ? creatorRow.avatar : "\u{1F642}"
      });
    }
    if (invAction === "join" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("This game already started. Ask for a new invite!");
      if (players.length >= g.max_players) throw new Error("This game is full.");
      const name = String(body.name || "").trim().slice(0, 24);
      const pin = String(body.pin || "").trim();
      const avatar = String(body.avatar || "\u{1F642}").slice(0, 4);
      if (!name) throw new Error("Tell us your name.");
      if (!/^\d{4}$/.test(pin)) throw new Error("PIN needs to be 4 numbers.");
      const ph = await hash(pin);
      const signedIn = await auth(req, env222222);
      let m = signedIn ? await db.prepare("SELECT * FROM members WHERE id=?").bind(signedIn.id).first() : await db.prepare("SELECT * FROM members WHERE name=?").bind(name).first();
      if (m) {
        if (!signedIn && m.pin !== ph) throw new Error("That name is taken. Use the same PIN, or pick a different name.");
      } else {
        const count322222 = (await db.prepare("SELECT COUNT(*) c FROM members").first()).c;
        const r2 = await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,?,?,?)").bind(name, ph, avatar, rid(), 0, now(), now()).run();
        m = await db.prepare("SELECT * FROM members WHERE id=?").bind(r2.meta.last_row_id).first();
      }
      if (!m.token) {
        m.token = rid();
        await db.prepare("UPDATE members SET token=? WHERE id=?").bind(m.token, m.id).run();
      }
      if (avatar && avatar !== m.avatar) await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, m.id).run();
      await allowGame(db, m.id, g.type);
      const child = await childPolicy(db, m.id);
      if (child && !await db.prepare("SELECT 1 FROM room_members WHERE room_id=? AND member_id=?").bind(g.room_id, m.id).first()) throw new Error("Ask your parent to choose your rooms.");
      await joinedRoom(env222222, g.room_id, m);
      if (!players.includes(m.id)) {
        if (players.length >= g.max_players) throw new Error("This game is full.");
        players.push(m.id);
      }
      let status = "waiting", state = null, turn = g.turn;
      if (players.length >= g.max_players) {
        status = "playing";
        const st = initState(g.type, players, g.id * 7919 + now() % 1e5, g.mode || "classic");
        turn = Number.isInteger(st.nextTurn) ? st.nextTurn : 0;
        state = JSON.stringify(st);
      }
      await db.prepare("UPDATE games SET players=?,status=?,state=?,turn=?,updated_at=? WHERE id=?").bind(JSON.stringify(players), status, state, turn, now(), g.id).run();
      if (status === "playing") {
        const firstPlayer = players[turn] ?? players[0];
        if (firstPlayer !== m.id) {
          const gameName = gt?.name || g.type;
          env222222.ctx?.waitUntil?.(notifyTurnIfAway(db, [firstPlayer], {
            type: "turn",
            title: "Game on!",
            body: `${m.name} joined your ${gameName} game. Your turn!`,
            tag: `ohana-game-${g.id}`
          }).catch(() => {
          }));
        }
      }
      return json({ token: m.token, me: { id: m.id, name: m.name, avatar, is_admin: m.is_admin }, game_id: g.id, room_id: g.room_id, status });
    }
  }
  const roomInvite = p.match(/^\/api\/room-invite\/([a-f0-9]{32})(?:\/(join))?$/);
  if (roomInvite) {
    const room = await db.prepare("SELECT id,name FROM rooms WHERE invite_code=?").bind(roomInvite[1]).first();
    if (!room || await getSetting(db, "room_deleted_" + room.id)) return err("This room invitation is no longer available.", 404);
    if (req.method === "GET" && !roomInvite[2]) return json({ name: room.name });
    if (req.method === "POST" && roomInvite[2] === "join") {
      let member = await auth(req, env222222);
      if (!member) {
        const name = String(body.name || "").trim().slice(0, 24), pin = String(body.pin || "");
        if (!name || !/^\d{4}$/.test(pin)) throw new Error("Enter your name and a four-number PIN.");
        const ph = await hash(pin);
        member = await db.prepare("SELECT * FROM members WHERE name=?").bind(name).first();
        if (member && member.pin !== ph) throw new Error("That name and PIN do not match. Try again or choose a different name.");
        if (!member) {
          const result = await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,0,?,?)").bind(name, ph, String(body.avatar || "@hon").slice(0, 4), rid(), now(), now()).run();
          member = await db.prepare("SELECT * FROM members WHERE id=?").bind(result.meta.last_row_id).first();
        }
      }
      const identity = await db.prepare("SELECT token FROM members WHERE id=?").bind(member.id).first();
      const token = identity.token || rid();
      if (!identity.token) await db.prepare("UPDATE members SET token=? WHERE id=?").bind(token, member.id).run();
      if (await childPolicy(db, member.id) && !await db.prepare("SELECT 1 FROM room_members WHERE room_id=? AND member_id=?").bind(room.id, member.id).first()) throw new Error("Ask your parent to choose your rooms.");
      await joinedRoom(env222222, room.id, member);
      return json({ token, room_id: room.id, me: { id: member.id, name: member.name, avatar: member.avatar, is_admin: member.is_admin } });
    }
    return err("Not found", 404);
  }
  const me = await auth(req, env222222);
  if (!me) return err("Please sign in.", 401);
  if (p === "/api/wind" && req.method === "GET") return windApi(req);
  /* Weather station: radar frame list and map/radar tiles proxied through the Worker (member-only, cached). */
  if (p === "/api/weather/radar" && req.method === "GET") return radarFramesApi();
  if (p.startsWith("/api/weather/tile/") && req.method === "GET") return weatherTileApi(req, p);
  if(p === "/api/granny/word-check" && req.method === "GET")return grannyWordCheck(req,db,url);
  if (p === "/api/granny") return grannyApi(req, db, me, body);
  const managed = await childPolicy(db, me.id);
  if (managed && (p.startsWith("/api/rooms/") || p.startsWith("/api/admin/") || p === "/api/rename")) return err("Ask your parent to manage this setting.", 403);
  if (p === "/api/rooms/create" && req.method === "POST") {
    const name = String(body.name || "").trim().slice(0, 48);
    if (!name) throw new Error("Give your room a name.");
    const invite = rid(16);
    await db.batch([
      db.prepare("INSERT INTO rooms(name,owner_id,invite_code,created_at) VALUES(?,?,?,?)").bind(name, me.id, invite, now()),
      db.prepare("INSERT INTO room_members(room_id,member_id) SELECT id,? FROM rooms WHERE invite_code=?").bind(me.id, invite)
    ]);
    const room = await db.prepare("SELECT id,name,invite_code FROM rooms WHERE invite_code=?").bind(invite).first();
    return json(room);
  }
  // Room deletion is reversible; all associated data and membership remain intact.
  if (["/api/rooms/rename", "/api/rooms/delete", "/api/rooms/restore"].includes(p) && req.method === "POST") {
    const targetId = Number(body.room_id);
    if (!Number.isSafeInteger(targetId) || targetId < 1) return err("Choose a room.", 400);
    const target = await db.prepare("SELECT r.* FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=?").bind(targetId, me.id).first();
    if (!target || !(me.is_admin || target.owner_id === me.id)) return err("Only the room host or an administrator can manage this room.", 403);
    const deletedKey = "room_deleted_" + targetId;
    if (p === "/api/rooms/rename") {
      if (await getSetting(db, deletedKey)) return err("Restore this room before editing its name.", 409);
      const name = String(body.name || "").trim();
      if (!name || name.length > 48) return err("Use a room name from 1 to 48 characters.", 400);
      const statements = [db.prepare("UPDATE rooms SET name=? WHERE id=?").bind(name, targetId)];
      if (targetId === 1) statements.push(db.prepare("INSERT INTO settings(key,value) VALUES('family_name',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(name));
      await db.batch(statements);
      return json({ok:true, name});
    }
    if (targetId === 1) return err("The main Ohana room cannot be deleted.", 400);
    if (p === "/api/rooms/delete") {
      if (body.confirm_name !== target.name) return err("Confirm the room name before deleting.", 400);
      await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(deletedKey, String(now())).run();
    } else {
      await db.prepare("DELETE FROM settings WHERE key=?").bind(deletedKey).run();
    }
    return json({ok:true});
  }
  const availableRooms = (await db.prepare("SELECT r.id,r.name,r.owner_id,r.invite_code,COALESCE((SELECT value FROM settings WHERE key='room_deleted_'||r.id),'') AS deleted_at FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE rm.member_id=? ORDER BY r.id").bind(me.id).all()).results;
  const roomList = availableRooms.filter(r => !r.deleted_at);
  const deletedRooms = availableRooms.filter(r => r.deleted_at && (me.is_admin || r.owner_id === me.id));
  const requestedRoom = Number(req.headers.get("x-ohana-room"));
  let activeRoom = roomList.find((r) => r.id === requestedRoom) || (!requestedRoom ? roomList[0] : null);
  if (!activeRoom && requestedRoom > 0 && availableRooms.some(r => r.id === requestedRoom && r.deleted_at)) activeRoom = roomList[0];
  if (!activeRoom && requestedRoom > 0 && !await db.prepare("SELECT id FROM rooms WHERE id=?").bind(requestedRoom).first()) activeRoom = roomList[0];
  if (!activeRoom) return err("You do not belong to this room. Open Rooms or use a room invitation.", 403);
  const roomId = activeRoom.id;
  if(p==='/api/game/invitations'&&req.method==='GET')return json(await invitationOptions(db,me.id,roomId));
  if(p==='/api/game/invitations'&&req.method==='POST'){
    try{return json(await sendInvitationBatch(db,me,roomId,body,env222222.ctx));}
    catch(e){if(e.invitationUncertain)return err(e.message,503);throw e;}
  }
  const canManageRoom = /* @__PURE__ */ __name22222(() => roomId === 1 ? !!me.is_admin : activeRoom.owner_id === me.id, "canManageRoom");
  if(p.startsWith('/api/announce-media/'))return handleAnnouncementMedia(req,{db,me,room:roomId,roomAccess:ohanaAnnouncementRoomAccess,normalize:ohanaAnnouncementImages,ensureSchema:ensureOhanaAnnouncementSchema});
  if(p==='/api/music/upload')return handleMusicUpload(req,{db,me,room:roomId,bucket:env222222.MUSIC_FILES,ensureMusicSchema:ensureOhanaMusicSchema,audience:ohanaMusicAudience,track:ohanaMusicTrack,text:ohanaMusicText,requestId:ohanaMusicRequestId});
  const musicPlayback=p.match(/^\/api\/music\/tracks\/(m_[a-f0-9-]+)\/playback$/);
  if(musicPlayback)return createMusicPlaybackTicket(req,{db,me,room:roomId,bucket:env222222.MUSIC_FILES,id:musicPlayback[1],readable:ohanaMusicReadable});
  if(p.startsWith("/api/music/")) return ohanaMusicApi(req,db,me,roomId,body,url);
  if(p === "/api/announce/access"){
    if(!me.is_admin)return err("Only administrators can grant shout-out access.",403);
    if(req.method === "GET"){
      const members=(await db.prepare("SELECT m.id,m.name,m.is_admin,COALESCE((SELECT value FROM settings WHERE key='announce_access_'||?||'_'||m.id),'0') AS granted FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=? AND m.token IS NOT NULL ORDER BY m.name").bind(roomId,roomId).all()).results;
      return json({members:members.map(m=>({id:m.id,name:m.name,is_admin:!!m.is_admin,enabled:!!m.is_admin||m.granted==='1'}))});
    }
    if(req.method === "POST"){
      if(!Number.isInteger(body.member_id)||typeof body.enabled!=='boolean')return err("Choose a member and access setting.",400);
      const target=await db.prepare("SELECT m.id,m.is_admin FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE m.id=? AND rm.room_id=? AND m.token IS NOT NULL").bind(body.member_id,roomId).first();
      if(!target||target.is_admin)return err("Choose a regular member in this room.",400);
      await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind('announce_access_'+roomId+'_'+target.id,body.enabled?'1':'0').run();
      return json({ok:true,enabled:body.enabled});
    }
    return err("Method not supported.",405);
  }
  if (p === "/api/chat") return unifiedChat(req, env222222, me, body, url);
  if (p === "/api/puzzles" || p.startsWith("/api/puzzle/") || p.startsWith("/api/album")) {
    const pr = await puzzleApi(req, env222222, p, body, me, roomId, roomList, canManageRoom);
    if (pr) return pr;
  }
  if (p === "/api/prayers" || p.startsWith("/api/prayers/")) {
    const pr = await prayerApi(req, env222222, p, body, me, roomId);
    if (pr) return pr;
  }
  if (p === "/api/rooms/invite" && req.method === "POST") {
    await db.prepare("UPDATE rooms SET invite_code=? WHERE id=? AND invite_code IS NULL").bind(rid(16), roomId).run();
    const invitation = await db.prepare("SELECT id,name,invite_code FROM rooms WHERE id=?").bind(roomId).first();
    return json(invitation);
  }
  if (p === "/api/rooms/rotate-invite" && req.method === "POST") {
    if (!canManageRoom()) return err("Only the room host can replace its invitation.", 403);
    await db.prepare("UPDATE rooms SET invite_code=? WHERE id=?").bind(rid(16), roomId).run();
    return json({ ok: true });
  }
  if (p === "/api/rooms/candidates" && req.method === "GET") {
    if (!canManageRoom()) return err("Only the room host can add people to this room.", 403);
    const people = me.is_admin ? (await db.prepare(`SELECT m.id,m.name,m.avatar FROM members m
      LEFT JOIN room_members already ON already.room_id=? AND already.member_id=m.id
      WHERE m.id!=? AND already.member_id IS NULL ORDER BY m.name`).bind(roomId, me.id).all()).results : (await db.prepare(`SELECT DISTINCT m.id,m.name,m.avatar FROM members m
      JOIN room_members shared ON shared.member_id=m.id
      JOIN room_members mine ON mine.room_id=shared.room_id AND mine.member_id=?
      LEFT JOIN room_members already ON already.room_id=? AND already.member_id=m.id
      LEFT JOIN settings child ON child.key='child_'||m.id
      WHERE m.id!=? AND already.member_id IS NULL
        AND (child.value IS NULL OR json_extract(child.value,'$.parent')=?)
      ORDER BY m.name`).bind(me.id, roomId, me.id, me.id).all()).results;
    return json({ people });
  }
  if (p === "/api/rooms/add-members" && req.method === "POST") {
    if (!canManageRoom()) return err("Only the room host can add people to this room.", 403);
    const ids = [...new Set((Array.isArray(body.member_ids) ? body.member_ids : []).map(Number).filter((id) => id > 0 && id !== me.id))].slice(0, 50);
    if (!ids.length) throw new Error("Choose at least one person.");
    const marks = ids.map(() => "?").join(",");
    const allowed = me.is_admin ? (await db.prepare(`SELECT m.id,m.name FROM members m
      LEFT JOIN room_members already ON already.room_id=? AND already.member_id=m.id
      WHERE m.id IN (${marks}) AND already.member_id IS NULL`).bind(roomId, ...ids).all()).results : (await db.prepare(`SELECT DISTINCT m.id,m.name FROM members m
      JOIN room_members shared ON shared.member_id=m.id
      JOIN room_members mine ON mine.room_id=shared.room_id AND mine.member_id=?
      LEFT JOIN room_members already ON already.room_id=? AND already.member_id=m.id
      LEFT JOIN settings child ON child.key='child_'||m.id
      WHERE m.id IN (${marks}) AND already.member_id IS NULL
        AND (child.value IS NULL OR json_extract(child.value,'$.parent')=?)`).bind(me.id, roomId, ...ids, me.id).all()).results;
    if (!allowed.length) throw new Error("Those people are already in this room or are not available to add.");
    await db.batch(allowed.map((person) => db.prepare("INSERT OR IGNORE INTO room_members(room_id,member_id) VALUES(?,?)").bind(roomId, person.id)));
    const roomName = roomId === 1 ? await getSetting(db, "family_name") : activeRoom.name;
    await addNotices(env222222, allowed.map((p2) => p2.id), { type: "room", title: me.name + " added you to " + roomName, body: "Open Rooms to visit this Ohana room.", roomId, tag: "ohana-room-added-" + roomId });
    return json({ ok: true, added: allowed.map((p2) => p2.id) });
  }
  if (p === "/api/children" && req.method === "GET") {
    const rows = managed ? [] : (await db.prepare("SELECT m.id,m.name,m.avatar,s.value FROM settings s JOIN members m ON s.key='child_'||m.id WHERE json_extract(s.value,'$.parent')=?").bind(me.id).all()).results;
    return json({ children: rows.map((r) => ({ ...r, ...JSON.parse(r.value), value: void 0 })), types: GAME_TYPES });
  }
  if (p === "/api/children" && req.method === "POST") {
    if (managed) return err("Only a parent can manage child profiles.", 403);
    const age = String(body.age || "");
    if (!["little", "kids", "teen"].includes(age)) throw new Error("Choose an age group.");
    const games = [...new Set((Array.isArray(body.games) ? body.games : []).filter((t) => Object.hasOwn(GAME_TYPES, t)))];
    const policy = { parent: me.id, age, games };
    if (body.id) {
      const old = await childPolicy(db, +body.id);
      if (!old || old.parent !== me.id) return err("Only this child\u2019s parent can change these choices.", 403);
      await db.prepare("UPDATE settings SET value=? WHERE key=?").bind(JSON.stringify(policy), "child_" + +body.id).run();
      return json({ ok: true });
    }
    const name = String(body.name || "").trim();
    if (!name || name.length > 20 || !/^\d{4}$/.test(String(body.pin || ""))) throw new Error("Enter a name and a four-number PIN for your child.");
    if (await db.prepare("SELECT id FROM members WHERE LOWER(name)=LOWER(?)").bind(name).first()) throw new Error("That name is already in use. Choose a different name.");
    const token = rid(), pin = await hash(String(body.pin));
    await db.batch([
      db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,0,?,?)").bind(name, pin, "@hon", token, now(), now()),
      db.prepare("INSERT INTO settings(key,value) SELECT 'child_'||id,? FROM members WHERE token=?").bind(JSON.stringify(policy), token),
      db.prepare("INSERT INTO room_members(room_id,member_id) SELECT ?,id FROM members WHERE token=?").bind(roomId, token)
    ]);
    return json({ ok: true });
  }
  if (p === "/api/notices/read" && req.method === "POST") {
    await db.prepare("UPDATE activity_notices SET seen=1 WHERE member_id=? AND id<=?").bind(me.id, Number(body.through) || 0).run();
    return json({ ok: true });
  }
  if(p === "/api/wardrobe" && ["GET","POST"].includes(req.method))return wardrobeApi(req,db,me,body);
  if (p === "/api/avatar" && req.method === "POST") {
    const avatar = String(body.avatar || "");
    const characters = ["@eag", "@eaglimo", "@hon", "@spl", "@kik", "@peb", "@man", "@sun", "@ott", "@pip", "@lul", "@hoo", "@flu", "@ros", "@koa", "@mil", "@bam", "@coc", "@fin", "@ink", "@kai", "@flo", "@ree", "@bnd", "@n01", "@n02", "@n03", "@n04", "@n05", "@n06", "@n07", "@n08", "@n09", "@n11", "@n13", "@n15", "@n16", "@n17", "@n18", "@n19", "@n20", "@n21", "@n23", "@n24", "@bp1", "@bn1", "@bf1", "@ba1", "@w00", "@w01", "@w02", "@w03", "@w04", "@w05", "@w06", "@w08", "@w09", "@w10", "@w11", "@a00", "@a01", "@a02", "@a03", "@a04", "@a05", "@a06", "@a07", "@a08", "@a09", "@a13", "@a14", "@a15", "@a16", "@a17", "@a18", "@a19", "@a20", "@a22", "@a23", "@a25", "@a26", "@a27", "@a28", "@a29", "@a30", "@a31", "@a32", "@a33", "@a34", "@a35", "@a36", "@a37", "@a38", "@a39", "@a40", "@a41", "@a43", "@a44", "@a45", "@a46", "@a47", "@a48", "@a49", "@a50", "@a51", "@a52", "@a53", "@a54", "@a55", "@a56", "@a57", "@a58", "@a59", "@a60", "@a61", "@a62", "@a63", "@a64", "@a65", "@a66", "@a67", "@a68", "@a69", "@a70", "@a71", "@a72", "@a73", "@a74", "@a75", "@a76", "@a77", "@a78", "@a79", "@a80", "@a82", "@a83", "@a84", "@a85", "@a86", "@a87", "@a89", "@a90", "@a91", "@a92", "@a93", "@a94", "@a95", "@a97", "@a98", "@a99", "@c00", "@c01", "@c02", "@c03", "@c04", "@c05", "@c06", "@c07", "@c08", "@c09", "@c10", "@c11", "@c12", "@c13", "@c14", "@c15", "@c16", "@c17", "@c18", "@c19", "@c20", "@c21", "@c22", "@c23", "@c24", "@c25", "@c26", "@c28", "@c29", "@c30", "@c31", "@c32", "@c33", "@c34", "@c35", "@c36", "@c37", "@c38", "@c39", "@l00", "@l01", "@l02", "@l03", "@l04", "@l05", "@l06", "@l07", "@l08", "@l09", "@l10", "@l11", "@o00", "@o01", "@o02", "@o03", "@o04", "@o05", "@o06", "@o07", "@o08", "@o09", "@o10", "@o11", "@o12", "@o13", "@o14", "@o15", "@o16", "@o17", "@o18", "@o19", "@o20", "@o21", "@o22", "@o23", "@o24", "@u00", "@u01", "@u02", "@u03", "@u04", "@u05", "@u06", "@u07", "@u08", "@u09", "@u10", "@u11", "@u12", "@u13", "@u14", "@u15", "@u16", "@u17", "@u18", "@u19", "@u20", "@u21", "@u22", "@u23", "@u24", "@u25", "@u26", "@u27", "@u28", "@u29", "@u30", "@u31", "@u32", "@u33", "@u34", "@u35", "@u36", "@u37", "@u38", "@u39", "@u40", "@u41", "@u42", "@u43", "@u44", "@u45", "@u46", "@u47", "@u48", "@u49", "@u50", "@u51", "@u52", "@u53", "@u54", "@u55", "@u56"];
    if (!characters.includes(avatar) && !(avatar.length <= 4 && /\p{Extended_Pictographic}/u.test(avatar) && !/[<>@]/.test(avatar))) throw new Error("Choose a character from the picker.");
    await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, me.id).run();
    return json({ ok: true, avatar });
  }
  if (p === "/api/prefs") {
    const key = "prefs_" + me.id;
    const row = await db.prepare("SELECT value FROM settings WHERE key=?").bind(key).first();
    let prefs = {};
    try {
      prefs = JSON.parse(row?.value || "{}") || {};
    } catch {
      prefs = {};
    }
    if (req.method === "POST") {
      const patch = body && typeof body.prefs === "object" && body.prefs ? body.prefs : {};
      prefs = { ...prefs, ...patch };
      const packed = JSON.stringify(prefs);
      if (packed.length > 6e3) throw new Error("Too many saved preferences.");
      await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(key, packed).run();
    }
    return json({ ok: true, prefs });
  }
  if (p === "/api/profile" && req.method === "POST") {
    const name = String(body.name || "").trim(), about = String(body.about || "").trim();
    if (!name || name.length > 20) throw new Error("Use a name between 1 and 20 characters.");
    if (about.length > 300) throw new Error("Keep About me to 300 characters.");
    const avatar = String(body.avatar || "");
    const characters = ["@eag", "@hon", "@spl", "@kik", "@peb", "@man", "@sun", "@ott", "@pip", "@lul", "@hoo", "@flu", "@ros", "@koa", "@mil", "@bam", "@coc", "@fin", "@ink", "@kai", "@flo", "@ree", "@eaglimo", "@bnd", "@n01", "@n02", "@n03", "@n04", "@n05", "@n06", "@n07", "@n08", "@n09", "@n11", "@n13", "@n15", "@n16", "@n17", "@n18", "@n19", "@n20", "@n21", "@n23", "@n24", "@bp1", "@bn1", "@bf1", "@ba1", "@w00", "@w01", "@w02", "@w03", "@w04", "@w05", "@w06", "@w08", "@w09", "@w10", "@w11", "@a00", "@a01", "@a02", "@a03", "@a04", "@a05", "@a06", "@a07", "@a08", "@a09", "@a13", "@a14", "@a15", "@a16", "@a17", "@a18", "@a19", "@a20", "@a22", "@a23", "@a25", "@a26", "@a27", "@a28", "@a29", "@a30", "@a31", "@a32", "@a33", "@a34", "@a35", "@a36", "@a37", "@a38", "@a39", "@a40", "@a41", "@a43", "@a44", "@a45", "@a46", "@a47", "@a48", "@a49", "@a50", "@a51", "@a52", "@a53", "@a54", "@a55", "@a56", "@a57", "@a58", "@a59", "@a60", "@a61", "@a62", "@a63", "@a64", "@a65", "@a66", "@a67", "@a68", "@a69", "@a70", "@a71", "@a72", "@a73", "@a74", "@a75", "@a76", "@a77", "@a78", "@a79", "@a80", "@a82", "@a83", "@a84", "@a85", "@a86", "@a87", "@a89", "@a90", "@a91", "@a92", "@a93", "@a94", "@a95", "@a97", "@a98", "@a99", "@c00", "@c01", "@c02", "@c03", "@c04", "@c05", "@c06", "@c07", "@c08", "@c09", "@c10", "@c11", "@c12", "@c13", "@c14", "@c15", "@c16", "@c17", "@c18", "@c19", "@c20", "@c21", "@c22", "@c23", "@c24", "@c25", "@c26", "@c28", "@c29", "@c30", "@c31", "@c32", "@c33", "@c34", "@c35", "@c36", "@c37", "@c38", "@c39", "@l00", "@l01", "@l02", "@l03", "@l04", "@l05", "@l06", "@l07", "@l08", "@l09", "@l10", "@l11"];
    if (!characters.includes(avatar) && !(avatar.length <= 4 && /\p{Extended_Pictographic}/u.test(avatar) && !/[<>@]/.test(avatar))) throw new Error("Choose a character from the picker.");
    const existing = await db.prepare("SELECT id FROM members WHERE LOWER(name)=LOWER(?) AND id!=?").bind(name, me.id).first();
    if (existing) throw new Error("Someone already has that name.");
    await db.batch([
      db.prepare("UPDATE members SET name=?,avatar=? WHERE id=?").bind(name, avatar, me.id),
      db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind("profile_about_" + me.id, about)
    ]);
    return json({ ok: true, name, avatar, about });
  }
  if (p === "/api/push/subscribe" && req.method === "POST") {
    const endpoint = String(body.endpoint || "");
    const p256dh = String(body.p256dh || "");
    const authKey = String(body.auth || "");
    if (!endpoint || !p256dh || !authKey) throw new Error("Missing push subscription data.");
    const pushURL = new URL(endpoint);
    if (pushURL.protocol !== "https:" || !/^(fcm\.googleapis\.com|(?:[a-z0-9-]+\.)*push\.services\.mozilla\.com|(?:[a-z0-9-]+\.)*notify\.windows\.com|web\.push\.apple\.com)$/.test(pushURL.hostname)) throw new Error("Unsupported notification service.");
    if (b64urlDecode(p256dh).length !== 65 || b64urlDecode(authKey).length !== 16) throw new Error("Invalid notification keys. Try enabling again.");
    await db.batch([db.prepare("DELETE FROM push_subscriptions WHERE endpoint=?").bind(endpoint), db.prepare("INSERT INTO push_subscriptions(member_id,endpoint,p256dh,auth,created_at) VALUES(?,?,?,?,?)").bind(me.id, endpoint, p256dh, authKey, now())]);
    return json({ ok: true });
  }
  if (p === "/api/push/test" && req.method === "POST") {
    const sub = await db.prepare("SELECT * FROM push_subscriptions WHERE member_id=? AND endpoint=?").bind(me.id, String(body.endpoint || "")).first();
    if (!sub) return err("This device is not connected yet. Tap Enable notifications.", 400);
    const status = await sendPush(sub, { type: "test", title: "Ohana notifications are ready", body: "Your turn alerts will arrive here\u2014even when Ohana Home is closed.", tag: "ohana-test" });
    if (status === 404 || status === 410) await db.prepare("DELETE FROM push_subscriptions WHERE id=?").bind(sub.id).run();
    if (status < 200 || status >= 300) return err(status === 404 || status === 410 ? "This device connection expired. Tap Enable notifications again." : "The notification service did not accept the test. Please try again.", 502);
    return json({ ok: true, accepted: true });
  }
  if (p === "/api/push/unsubscribe" && req.method === "POST") {
    const endpoint = String(body.endpoint || "");
    if (endpoint) {
      await db.prepare("DELETE FROM push_subscriptions WHERE member_id=? AND endpoint=?").bind(me.id, endpoint).run();
    } else {
      await db.prepare("DELETE FROM push_subscriptions WHERE member_id=?").bind(me.id).run();
    }
    return json({ ok: true });
  }
  if (p === "/api/rename" && req.method === "POST") {
    const newName = String(body.name || "").trim().slice(0, 20);
    if (!newName) throw new Error("Name can't be empty.");
    const existing = await db.prepare("SELECT id FROM members WHERE LOWER(name)=LOWER(?) AND id!=?").bind(newName, me.id).first();
    if (existing) throw new Error("Someone already has that name.");
    await db.prepare("UPDATE members SET name=? WHERE id=?").bind(newName, me.id).run();
    return json({ ok: true, name: newName });
  }
  if (p === "/api/sync") {
    me.can_announce=!!me.is_admin||await getSetting(db,"announce_access_"+roomId+"_"+me.id)==="1";
    const since = +url.searchParams.get("msgSince") || 0;
    const members = (await db.prepare("SELECT m.id,m.name,m.avatar,m.last_seen,m.is_admin,COALESCE((SELECT value FROM settings WHERE key='profile_about_'||m.id),'') AS about FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=? ORDER BY m.name").bind(roomId).all()).results.map((m) => ({ ...m, online: now() - m.last_seen < ONLINE_MS }));
    const msgs = (await db.prepare("SELECT id,member_id,text,image,created_at FROM messages WHERE room_id=? AND id>? ORDER BY id DESC LIMIT 60").bind(roomId, since).all()).results.reverse();
    const centralized = (await db.prepare("SELECT id, sender AS member_id,text,image,created_at FROM chat_messages WHERE conversation=? AND id>? ORDER BY id DESC LIMIT 60").bind("room:" + roomId, since).all()).results.reverse();
    const games = (await db.prepare("SELECT games.*,score_reviews.payload AS score_review FROM games LEFT JOIN score_reviews ON score_reviews.game_id=games.id WHERE games.room_id=? AND (status!='finished' OR updated_at>?) ORDER BY updated_at DESC LIMIT 80").bind(roomId, now() - 3 * 864e5).all()).results.map((g) => gameRow(g, me.id));
    const allGames = (await db.prepare("SELECT g.*,r.name AS room_name FROM games g JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id WHERE rm.member_id=? AND (g.status!='finished' OR g.updated_at>?) ORDER BY g.updated_at DESC LIMIT 120").bind(me.id, now() - 3 * 864e5).all()).results.map((g) => gameRow(g, me.id));
    const visiblePeople = (await db.prepare("SELECT DISTINCT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id IN (SELECT room_id FROM room_members WHERE member_id=?)").bind(me.id).all()).results;
    const ohanaMembers = roomList.some((r) => r.id === 1) ? (await db.prepare("SELECT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=1 ORDER BY m.name").all()).results : members;
    const peopleById = Object.fromEntries(visiblePeople.map((m) => [m.id, m]));
    for (const game of allGames) game.names = Object.fromEntries(game.players.filter((id) => peopleById[id]).map((id) => [id, peopleById[id]]));
    const familyName = await getSetting(db, "family_name");
    await db.prepare("UPDATE game_invitations SET status='expired' WHERE status='pending' AND created_at < ?").bind(now() - 2 * 864e5).run();
    const invitations = (await db.prepare("SELECT i.game_id,i.sender_id,m.name AS sender_name,m.avatar AS sender_avatar,g.type,g.room_id,r.name AS room_name FROM game_invitations i JOIN games g ON g.id=i.game_id JOIN members m ON m.id=i.sender_id JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id AND rm.member_id=i.member_id WHERE i.member_id=? AND i.status='pending' AND g.status='waiting' AND NOT EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=i.member_id)").bind(me.id).all()).results;
    const sentInvitations = (await db.prepare("SELECT i.game_id,i.member_id,m.name AS recipient_name,g.type,g.room_id,r.name AS room_name FROM game_invitations i JOIN games g ON g.id=i.game_id JOIN members m ON m.id=i.member_id JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id AND rm.member_id=? WHERE i.sender_id=? AND i.status='pending' AND g.status='waiting' AND NOT EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=i.member_id) ORDER BY i.game_id DESC LIMIT 60").bind(me.id, me.id).all()).results;
    const notices = (await db.prepare("SELECT n.* FROM activity_notices n JOIN room_members rm ON rm.room_id=n.room_id AND rm.member_id=n.member_id WHERE n.member_id=? AND n.seen=0 ORDER BY n.id DESC LIMIT 50").bind(me.id).all()).results;
    const permitted = /* @__PURE__ */ __name22222((t) => !managed || managed.games.includes(t), "permitted");
    let announcement = null;
    try {
      const raw = await getSetting(db, "announce_room_" + roomId);
      if (raw) {
        const a = JSON.parse(raw);
        const ackRaw = await getSetting(db, "announce_ack_" + me.id + "_" + roomId);
        const acked = ackRaw ? Number(ackRaw) : 0;
        const imageAck=Number(await getSetting(db,"announce_image_ack_"+me.id+"_"+roomId))||0;
        const imageDue=url.searchParams.get("announcementMedia")==="1"&&Array.isArray(a?.images)&&a.images.length>0&&Number(a.id)>imageAck;
        if (a && (a.id > acked || imageDue)) { announcement = a; if(a.responses_enabled) announcement={...a,can_respond:Number(a.member_id)!==Number(me.id)&&!!await db.prepare("SELECT member_id FROM megaphone_recipients WHERE announcement_id=? AND member_id=?").bind(a.id,me.id).first()}; }
      }
    } catch {
    }
    return json({ version: "ohana-family-tables-v62", notices, announcement, childPolicy: managed, invitations: invitations.filter((g) => permitted(g.type) && roomList.some(r => r.id === g.room_id)), sentInvitations: sentInvitations.filter((g) => permitted(g.type) && roomList.some(r => r.id === g.room_id)), me, familyName: roomId === 1 ? familyName : activeRoom.name, roomId, deletedRooms, rooms: roomList.map((r) => ({ ...r, name: r.id === 1 ? familyName : r.name })), members, ohanaMembers, messages: centralized, games: games.filter((g) => permitted(g.type)), allGames: allGames.filter((g) => permitted(g.type) && roomList.some(r => r.id === g.room_id)), types: Object.fromEntries(Object.entries(GAME_TYPES).filter(([t]) => permitted(t))) });
  }
  if (p === "/api/message" && req.method === "POST") {
    const text = String(body.text || "").trim().slice(0, 2e3);
    const image = body.image ? String(body.image) : null;
    if (!text && !image) throw new Error("Nothing to send.");
    if (image && image.length > 9e5) throw new Error("That picture is too big.");
    return unifiedChat(req, env222222, me, { conversation: "room:" + roomId, text, image, clientId: "legacy-" + rid(20) }, url);
  }
  if (p.startsWith("/api/announce/")) { const privateResponse=await ohanaAnnouncementResponseApi(req,db,me,roomId,body,url);if(privateResponse)return privateResponse; }
  if (p === "/api/announce" && req.method === "POST") {
    if (!me.is_admin && await getSetting(db,"announce_access_"+roomId+"_"+me.id)!=="1") return err("Ask an administrator for shout-out access in this room.", 403);
    const text = String(body.text || "").trim().slice(0, 300);
    if (!text) throw new Error("Write something to announce first.");
    const announcement = await createOhanaAnnouncement(db,me,roomId,text,body.images);
    return json({ ok: true, announcement });
  }
  if (p === "/api/announce/ack" && req.method === "POST") {
    const id = Number(body.id) || 0;
    if (!id) throw new Error("Nothing to acknowledge.");
    await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=CAST(MAX(CAST(settings.value AS INTEGER),CAST(excluded.value AS INTEGER)) AS TEXT)").bind("announce_ack_" + me.id + "_" + roomId, String(id)).run();
    if(body.images_seen===true&&await db.prepare("SELECT id FROM megaphone_announcements WHERE id=? AND room_id=?").bind(id,roomId).first())await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=CAST(MAX(CAST(settings.value AS INTEGER),CAST(excluded.value AS INTEGER)) AS TEXT)").bind("announce_image_ack_"+me.id+"_"+roomId,String(id)).run();
    return json({ ok: true });
  }
  if (p === "/api/leaderboard" && req.method === "GET") {
    const scoringView = url.searchParams.get("scoring") || "original";
    if (!["original", "draw-pips-v1"].includes(scoringView)) throw new Error("Choose a valid scoring view.");
    const finished = (await db.prepare("SELECT id,type,players,winner,state FROM games WHERE room_id=? AND status='finished'").bind(roomId).all()).results;
    const stats = {};
    const touch = /* @__PURE__ */ __name((type, pid3) => {
      if (!stats[type]) stats[type] = {};
      if (!stats[type][pid3]) stats[type][pid3] = { wins: 0, played: 0, points: 0 };
      return stats[type][pid3];
    }, "touch");
    for (const g of finished) {
      let players, state;
      try {
        players = JSON.parse(g.players) || [];
      } catch {
        players = [];
      }
      try {
        state = g.state ? JSON.parse(g.state) : {};
      } catch {
        state = {};
      }
      const earnedDraw = g.type === "domino" && dominoPlayedPips(state);
      if ((scoringView === "draw-pips-v1") !== earnedDraw) continue;
      const scores = state.scores || null;
      const winnerStr = g.winner != null ? String(g.winner) : "";
      for (const pid3 of players) {
        if (gameBotPlayer(g.type,pid3)) continue;
        const row = touch(g.type, pid3);
        row.played++;
        if (scores && Number.isFinite(Number(scores[pid3]))) row.points += Number(scores[pid3]);
        if (winnerStr && winnerStr === String(pid3)) row.wins++;
      }
    }
    const ids = [...new Set(Object.values(stats).flatMap((byType2) => Object.keys(byType2)))].map(Number).filter((id) => id !== BOT_ID);
    const people = ids.length ? (await db.prepare(`SELECT id,name,avatar FROM members WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results : [];
    const names = Object.fromEntries(people.map((m) => [m.id, m]));
    const byType = {};
    const overall = {};
    for (const [type, byPlayer] of Object.entries(stats)) {
      byType[type] = Object.entries(byPlayer).map(([pid3, row]) => ({ id: Number(pid3), name: names[pid3]?.name || "Someone", avatar: names[pid3]?.avatar || "@hon", ...row })).filter((r) => names[r.id]).sort((a, b) => b.wins - a.wins || b.points - a.points);
      for (const row of byType[type]) {
        if (!overall[row.id]) overall[row.id] = { id: row.id, name: row.name, avatar: row.avatar, wins: 0, played: 0, points: 0 };
        overall[row.id].wins += row.wins;
        overall[row.id].played += row.played;
        overall[row.id].points += row.points;
      }
    }
    const overallList = Object.values(overall).sort((a, b) => b.wins - a.wins || b.points - a.points);
    const net = scoringView === "draw-pips-v1";
    const scoring = {
      view: scoringView,
      overallLabel: net ? "New Draw standings" : "Other games · original totals",
      pointsLabel: net ? "net points" : "recorded points",
      note: net ? "Only new Draw Dominoes tile-point games. Each stored total is earned tile points minus leftover pips. Other saved rules are excluded."
        : "Original Draw scores count leftover pips as penalties; these historical counters keep their original ranking. New Draw net points have separate standings and are excluded here."
    };
    const types = { ...GAME_TYPES, domino: { ...GAME_TYPES.domino, name: net ? "Draw Dominoes · tile points" : "Dominoes · original rules" } };
    return json({ byType, overall: overallList, types, scoring });
  }
  if (p === "/api/game/history" && req.method === "GET") {
    const before = Math.max(0, Number.parseInt(url.searchParams.get("before") || "0", 10) || 0);
    const history = (await db.prepare(`SELECT g.*,r.name AS room_name FROM games g JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id AND rm.member_id=? WHERE g.status='finished' AND EXISTS(SELECT 1 FROM json_each(g.players) WHERE value=?) AND (?=0 OR g.updated_at<(SELECT updated_at FROM games WHERE id=?) OR (g.updated_at=(SELECT updated_at FROM games WHERE id=?) AND g.id<?)) ORDER BY g.updated_at DESC,g.id DESC LIMIT 31`).bind(me.id, me.id, before, before, before, before).all()).results;
    const page = history.slice(0, 30).map((g) => gameRow(g, me.id));
    const ids = [...new Set(page.flatMap((g) => g.players).filter((id) => id !== BOT_ID))];
    const people = ids.length ? (await db.prepare(`SELECT id,name,avatar FROM members WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results : [];
    const names = Object.fromEntries(people.map((m) => [m.id, m]));
    for (const g of page) {
      g.names = Object.fromEntries(g.players.filter((id) => names[id]).map((id) => [id, names[id]]));
      gameBotNames(g.type,g.players,g.names);
    }
    return json({ games: page.filter((g) => !managed || managed.games.includes(g.type)), next: history.length > 30 ? page.at(-1)?.id : null });
  }
  if (p === "/api/game/create" && req.method === "POST") {
    const type = body.type;
    await allowGame(db, me.id, type);
    const gt = GAME_TYPES[type];
    if (!gt) throw new Error("Unknown game.");
    const withBot = body.opponent === "bot";
    if(type==='spades'&&withBot&&body.max_players!==undefined&&body.max_players!==4)throw Error('Spades needs four seats: you and three robots.');
    const cardMode = type === "shuffle" ? shuffleMode(body.mode || "rummy") : null;
    if (type === "shuffle" && body.opponent && !["family","bot"].includes(body.opponent)) throw Error("Choose family players or Ohana Robot.");
    if(type==="shuffle" && withBot && body.max_players!==undefined && body.max_players!==2)throw Error("Ohana Robot needs a two-player table.");
    const cardMax = cardMode === "gin" ? 2 : 6;
    if (type === "shuffle" && body.max_players !== undefined && (!Number.isInteger(body.max_players) || body.max_players < 2 || body.max_players > cardMax)) throw Error(cardMode === "gin" ? "Gin Rummy needs exactly two players." : "Regular Rummy needs two to six players.");
    const max = type === "shuffle" ? (withBot?2:body.max_players || 2) : withBot ? (type==='spades'?4:2) : Math.min(gt.max, Math.max(gt.min, +body.max_players || gt.min));
    const mode = type === "shuffle" ? cardMode : type === "words" && body.mode === "random" ? "random" : type === "domino" ? dominoCreationMode(body.mode) : type === "mahjong" && body.mode === "rounds8" ? "rounds8" : "classic";
    const inviteCode = rid(6);
    const r = await db.prepare("INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,mode,invite_code,room_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)").bind(type, JSON.stringify([me.id]), max, "waiting", 0, me.id, now(), now(), mode, inviteCode, roomId).run();
    if (max === 1 || withBot) {
      const players = withBot ? gameBotSeats(type,me.id) : [me.id];
      const st = initState(type, players, now(), mode);
      if (withBot) st.bot = { id: BOT_ID, name: "Ohana Robot", avatar: "@hon", difficulty: ["easy", "medium", "hard"].includes(body.difficulty) ? body.difficulty : "easy", memory: {}, moves: 0 };
      if (withBot) await db.prepare("UPDATE games SET players=? WHERE id=?").bind(JSON.stringify(players), r.meta.last_row_id).run();
      const state = JSON.stringify(st);
      await db.prepare("UPDATE games SET state=?,status='playing',turn=? WHERE id=?").bind(state, Number.isInteger(st.nextTurn) ? st.nextTurn : 0, r.meta.last_row_id).run();
    }
    return json({ id: r.meta.last_row_id, invite_code: inviteCode });
  }
  const gm = p.match(/^\/api\/game\/(\d+)(?:\/(\w+))?$/);
  if (gm) {
    const id = +gm[1];
    const action = gm[2];
    const g = await db.prepare("SELECT games.*, score_reviews.payload AS score_review FROM games LEFT JOIN score_reviews ON score_reviews.game_id=games.id WHERE games.id=?").bind(id).first();
    if (!g) throw new Error("Game not found.");
    if (!roomList.some((r) => r.id === g.room_id)) return err("This game belongs to a private room.", 403);
    await allowGame(db, me.id, g.type);
    const players = JSON.parse(g.players);
    const names = {};
    for (const m of (await db.prepare("SELECT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?").bind(g.room_id).all()).results) names[m.id] = m;
    gameBotNames(g.type,players,names);
    if (!action) {
      if(g.type==='mahjong'&&g.state&&g.status==='playing'){
        const raw=JSON.parse(g.state);
        if(raw.mode==='family'&&raw.pending&&Date.now()>=raw.pending.deadline){
          const resolved=mjFamilyResolve(raw,players);
          if(resolved){
            const saved=await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=? AND state=? AND status='playing'").bind(JSON.stringify(raw),resolved.next,resolved.over?'finished':'playing',resolved.over?String(resolved.winner):null,now(),id,g.state).run();
            if(saved.meta.changes){g.state=JSON.stringify(raw);g.turn=resolved.next;g.status=resolved.over?'finished':'playing';g.winner=resolved.over?String(resolved.winner):null;}
            else {const fresh=await db.prepare('SELECT state,turn,status,winner FROM games WHERE id=?').bind(id).first();Object.assign(g,fresh);}
          }
        }
      }
      if (players.includes(me.id) && g.status === "playing" && gameBotPlayer(g.type,players[g.turn])) env222222.ctx?.waitUntil?.(advanceBot(env222222, id).catch((e) => console.error("Computer move failed", e.message)));
      const st = g.state ? viewState(g.type, JSON.parse(g.state), me.id) : null;
      const chatKey = chatPeopleKey(players);
      if (st && chatKey) {
        st.chat = [];
        if (players.includes(me.id)) {
          const catalog = await chatCatalog(db, me);
          if (catalog.threads.has(chatKey)) {
            await chatImport(db, catalog);
            st.chat = (await db.prepare("SELECT sender AS p,text,created_at AS t FROM chat_messages WHERE conversation=? ORDER BY id DESC LIMIT 50").bind(chatKey).all()).results.reverse();
          }
        }
      }
      const invited_members = players.includes(me.id) && g.status === "waiting" ? (await db.prepare("SELECT member_id FROM game_invitations WHERE game_id=? AND status='pending'").bind(id).all()).results.map((i) => i.member_id) : [];
      let replay=null;
      if(g.status==="waiting")try{const found=await db.prepare("SELECT r.original_game_id,g.players FROM game_replays r JOIN games g ON g.id=r.original_game_id WHERE r.new_game_id=?").bind(id).first();if(found&&JSON.parse(found.players).includes(me.id))replay=found;}catch(error){if(!/no such table:\s*game_replays/i.test(error.message))throw error;}
      return json({ ...gameRow(g, me.id), state: st, names, invited_members,...(replay?{replay_of:replay.original_game_id,replay_players:JSON.parse(replay.players)}:{}) });
    }
    if (action === "replay" && req.method === "POST") return json(await ohanaCreateReplay(db,env222222,me,g,players,names));
    if (action === "bot" && req.method === "POST") {
      if(g.type==="shuffle" && g.max_players!==2)throw Error("Ohana Robot needs a two-player waiting table.");
      if (g.status !== "waiting") throw new Error("This game already started.");
      if (g.created_by !== me.id && !(me.is_admin && g.room_id === 1)) throw new Error("Only the person who made the game can add Honu.");
      if (players.includes(BOT_ID)) throw new Error("Honu is already at this table.");
      if (!players.includes(me.id)) throw new Error("Join the table before adding Honu.");
      const humanPlayers = players.filter((p2) => !gameBotPlayer(g.type,p2));
      if (humanPlayers.length !== 1) throw new Error("Honu can only join a one-person waiting table.");
      const seats = gameBotSeats(g.type,me.id);
      const st = initState(g.type, seats, id * 7919 + now() % 1e5, g.mode || "classic");
      st.bot = { id: BOT_ID, name: "Ohana Robot", avatar: "@hon", difficulty: ["easy", "medium", "hard"].includes(body.difficulty) ? body.difficulty : "easy", memory: {}, moves: 0 };
      const turn = Number.isInteger(st.nextTurn) ? st.nextTurn : 0;
      const started = await db.prepare("UPDATE games SET players=?,max_players=?,state=?,status='playing',turn=?,updated_at=? WHERE id=? AND status='waiting' AND players=?").bind(JSON.stringify(seats), seats.length, JSON.stringify(st), turn, now(), id, g.players).run();
      if (!started.meta.changes) throw new Error("This table just changed. Please open it again.");
      await db.prepare("UPDATE game_invitations SET status='declined' WHERE game_id=? AND status='pending'").bind(id).run();
      return json({ ok: true });
    }
    if (action === "invite" && req.method === "POST") {
      if (!players.includes(me.id)) return err("Only a player at this table can invite Ohana.", 403);
      if (g.status !== "waiting" || players.length >= g.max_players) throw new Error("Choose a table that is waiting for players.");
      const recipient = Number(body.member_id);
      await allowGame(db, recipient, g.type);
      if (!names[recipient] || recipient === me.id || players.includes(recipient)) throw new Error("Choose another member of this room\u2019s Ohana.");
      const sent = await db.prepare("INSERT INTO game_invitations(game_id,member_id,sender_id,status,created_at) VALUES(?,?,?,'pending',?) ON CONFLICT(game_id,member_id) DO UPDATE SET sender_id=excluded.sender_id,status='pending',created_at=excluded.created_at WHERE game_invitations.status!='pending'").bind(id, recipient, me.id, now()).run();
      if (sent.meta.changes) env222222.ctx?.waitUntil?.(notifyMembers(db, [recipient], { type: "invite", title: me.name + " saved you a seat", body: "Join " + (GAME_TYPES[g.type]?.name || g.type) + " \u2014 open your Game Nook to accept.", tag: "ohana-invite-" + id }).catch(() => {
      }));
      return json({ ok: true });
    }
    if (action === "decline" && req.method === "POST") {
      await db.prepare("UPDATE game_invitations SET status='declined' WHERE game_id=? AND member_id=? AND status='pending'").bind(id, me.id).run();
      return json({ ok: true });
    }
    if (action === "reviewack" && req.method === "POST") {
      if (!players.includes(me.id)) throw new Error("Only players in this game can acknowledge its score review.");
      const review = g.score_review ? JSON.parse(g.score_review) : null;
      if (!review || body.reviewId !== review.id) throw new Error("This score review changed. Please refresh and read it again.");
      const result = await db.prepare("UPDATE score_reviews SET payload=json_set(payload,?,COALESCE(json_extract(payload,?),?)) WHERE game_id=? AND json_extract(payload,'$.id')=?").bind('$.acknowledged."' + me.id + '"', '$.acknowledged."' + me.id + '"', now(), id, review.id).run();
      if (!result.meta.changes) throw new Error("This score review changed. Please refresh and read it again.");
      return json({ ok: true });
    }
    if (action === "join" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("This game already started.");
      if (!players.includes(me.id)) {
        if (players.length >= g.max_players) throw new Error("This game is full.");
        players.push(me.id);
      }
      let status = "waiting", state = null, turn = g.turn;
      if (players.length >= g.max_players) {
        status = "playing";
        const st = initState(g.type, players, id * 7919 + now() % 1e5, g.mode || "classic");
        turn = Number.isInteger(st.nextTurn) ? st.nextTurn : 0;
        state = JSON.stringify(st);
      }
      const joined = await db.prepare("UPDATE games SET players=?,status=?,state=?,turn=?,updated_at=? WHERE id=? AND status='waiting' AND players=?").bind(JSON.stringify(players), status, state, turn, now(), id, g.players).run();
      if (!joined.meta.changes) throw new Error("This table just changed. Please open it again.");
      await db.prepare("UPDATE game_invitations SET status='accepted' WHERE game_id=? AND member_id=?").bind(id, me.id).run();
      if (status === "playing") {
        const firstPlayer = players[turn] ?? players[0];
        if (firstPlayer !== me.id) {
          const gameName = GAME_TYPES[g.type]?.name || g.type;
          env222222.ctx?.waitUntil?.(notifyTurnIfAway(db, [firstPlayer], {
            type: "turn",
            title: "Your turn!",
            body: `It's your turn in ${gameName}`,
            tag: `ohana-game-${id}`
          }).catch(() => {
          }));
        }
      }
      return json({ ok: true, status });
    }
    if (action === "start" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("Already started.");
      if (g.created_by !== me.id && !(me.is_admin && g.room_id === 1)) throw new Error("Only the person who made the game can start it.");
      if (players.length < GAME_TYPES[g.type].min) throw new Error("Need more players first.");
      const st = initState(g.type, players, id * 7919 + now() % 1e5, g.mode || "classic");
      const state = JSON.stringify(st);
      const turn = Number.isInteger(st.nextTurn) ? st.nextTurn : 0;
      const started = await db.prepare("UPDATE games SET status='playing',state=?,turn=?,max_players=?,updated_at=? WHERE id=? AND status='waiting' AND players=?").bind(state, turn, players.length, now(), id, g.players).run();
      if (!started.meta.changes) throw new Error("This table just changed. Please open it again.");
      const firstPlayer = players[turn] ?? players[0];
      if (firstPlayer !== me.id) {
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env222222.ctx?.waitUntil?.(notifyTurnIfAway(db, [firstPlayer], {
          type: "turn",
          title: "Your turn!",
          body: `It's your turn in ${gameName}`,
          tag: `ohana-game-${id}`
        }).catch(() => {
        }));
      }
      return json({ ok: true });
    }
    if (action === "leave" && req.method === "POST") {
      if (g.status === "waiting") {
        const left = g.created_by === me.id || me.is_admin && g.room_id === 1 ? await db.prepare("DELETE FROM games WHERE id=? AND status='waiting' AND players=?").bind(id, g.players).run() : await db.prepare("UPDATE games SET players=? WHERE id=? AND status='waiting' AND players=?").bind(JSON.stringify(players.filter((x) => x !== me.id)), id, g.players).run();
        if (!left.meta.changes) throw new Error("This table just changed. Please open it again.");
      } else if (g.status === "playing" && players.includes(me.id)) {
        const ended = await db.prepare("UPDATE games SET status='finished',winner=?,updated_at=? WHERE id=? AND status='playing'").bind(players.length === 2 ? String(players.find((x) => x !== me.id)) : "resigned", now(), id).run();
        if (!ended.meta.changes) throw new Error("This table just changed. Please open it again.");
      }
      return json({ ok: true });
    }
    if (action === "move" && req.method === "POST") {
      if (g.status !== "playing") throw new Error("This game is not in play.");
      const st = JSON.parse(g.state);
      const familyClaim=g.type==="mahjong"&&st.mode==="family"&&!!st.pending;
      const nextRound=g.type==="mahjong"&&st.mode==="family"&&st.phase==="round-end";
      if(!players.includes(me.id))throw new Error("Only seated players can act.");
      if (players[g.turn] !== me.id && !familyClaim && !nextRound) throw new Error("It's not your turn yet.");
      if(g.type==="mahjong"&&st.mode==="family")body.actor=me.id;
      const res = await applyMove(g.type, st, players, g.turn, body, db);
      st.lastPlay = { ...(g.type === "domino" ? st.lastPlay : {}), p: me.id, at: now() };
      rememberBotCards(st);
      const status = res.over ? "finished" : "playing";
      const saved = await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=? AND state=? AND turn=? AND status='playing'").bind(JSON.stringify(st), res.next, status, res.over ? String(res.winner) : null, now(), id, g.state, g.turn).run();
      if (!saved.meta.changes) throw new Error("The table changed. Please refresh and try again.");
      await recordOhanaGameActivity(db,me.id,st.lastPlay.at).catch(error=>console.warn("Game activity tracking failed",error.message));
      if (!res.over && gameBotPlayer(g.type,players[res.next])) env222222.ctx?.waitUntil?.(advanceBot(env222222, id).catch((e) => console.error("Computer move failed", e.message)));
      if (!res.over && players[res.next] > 0 && players[res.next] !== me.id) {
        const nextPlayerId = players[res.next];
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env222222.ctx?.waitUntil?.(notifyTurnIfAway(db, [nextPlayerId], {
          type: "turn",
          title: "Your turn!",
          body: `${me.name} played in ${gameName}. Your move!`,
          tag: `ohana-game-${id}`
        }).catch(() => {
        }));
      }
      if (res.over && res.winner && res.winner !== "tie" && res.winner !== "resigned" && +res.winner > 0 && +res.winner !== me.id) {
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env222222.ctx?.waitUntil?.(notifyMembers(db, [+res.winner], {
          type: "win",
          title: "You won! \u{1F389}",
          body: `You won ${gameName}!`,
          tag: `ohana-game-${id}`
        }).catch(() => {
        }));
      }
      return json({ ok: true, over: res.over, winner: res.winner, last: st.history ? st.history[st.history.length - 1] : null });
    }
    if (action === "say" && req.method === "POST") {
      if (!players.includes(me.id)) throw new Error("You're not in this game.");
      const text = String(body.text || "").trim().slice(0, 140);
      if (!text) throw new Error("Pick something to say.");
      const st = g.state ? JSON.parse(g.state) : {};
      st.says = (st.says || []).slice(-9);
      st.says.push({ id: rid(8), p: me.id, text, kind: String(body.kind || "nice").slice(0, 12), at: now() });
      await db.prepare("UPDATE games SET state=? WHERE id=? AND state=?").bind(JSON.stringify(st), id, g.state).run();
      const others = players.filter((p2) => p2 > 0 && p2 !== me.id);
      env222222.ctx?.waitUntil?.(notifyMembers(db, others, { type: "say", title: me.name + " says\u2026", body: "\u201C" + text + "\u201D \u2014 in " + (GAME_TYPES[g.type]?.name || g.type), tag: "ohana-say-" + id }).catch(() => {
      }));
      return json({ ok: true });
    }
    if (action === "chat" && req.method === "POST") {
      if (!players.includes(me.id)) throw new Error("You're not in this game.");
      const text = String(body.text || "").trim().slice(0, 200);
      if (!text) throw new Error("Say something!");
      const conversation = chatPeopleKey(players);
      if (!conversation) return err("Choose a person or room in Ohana Chat.", 400);
      return unifiedChat(req, env222222, me, { conversation, text, clientId: "legacy-" + rid(20) }, url);
    }
  }
  if (p.startsWith("/api/admin/")) {
    if (!me.is_admin || roomId !== 1) return err("Family admins only.", 403);
    if (p === "/api/admin/settings" && req.method === "POST") {
      if (body.family_code) await db.prepare("UPDATE settings SET value=? WHERE key='family_code'").bind(String(body.family_code).trim().toUpperCase()).run();
      if (body.family_name) await db.prepare("UPDATE settings SET value=? WHERE key='family_name'").bind(String(body.family_name).trim()).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/info") return json({ family_code: await getSetting(db, "family_code"), family_name: await getSetting(db, "family_name") });
    if (p === "/api/admin/remove" && req.method === "POST") {
      await db.prepare("DELETE FROM room_members WHERE member_id=? AND room_id=1 AND member_id IN (SELECT id FROM members WHERE is_admin=0)").bind(+body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/reset_pin" && req.method === "POST") {
      await db.prepare("UPDATE members SET pin=?,token=NULL WHERE id=? AND id IN (SELECT member_id FROM room_members WHERE room_id=1)").bind(await hash(String(body.pin)), +body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/clear_chat" && req.method === "POST") {
      await db.batch([db.prepare("DELETE FROM messages WHERE room_id=1"), db.prepare("DELETE FROM chat_messages WHERE conversation='room:1'")]);
      return json({ ok: true });
    }
  }
  return err("Not found", 404);
}
__name(api2, "api2");
__name2(api2, "api2");
__name22(api2, "api2");
__name222(api2, "api2");
__name2222(api2, "api2");
__name22222(api2, "api2");
__name222222(api2, "api2");
var ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><g fill="white"><ellipse cx="48" cy="53" rx="24" ry="29"/><circle cx="48" cy="16" r="13"/><ellipse cx="19" cy="38" rx="16" ry="9" transform="rotate(35 19 38)"/><ellipse cx="77" cy="38" rx="16" ry="9" transform="rotate(-35 77 38)"/><ellipse cx="25" cy="77" rx="14" ry="8" transform="rotate(-35 25 77)"/><ellipse cx="71" cy="77" rx="14" ry="8" transform="rotate(35 71 77)"/></g></svg>`;
var SW = `
// version: ohana-family-tables-v62
const OHANA_SW_BUILD='ohana-workstation-wrap-20261014';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('push', function(event) {
  let data = { title: 'Ohana Home', body: 'Something happened!', tag: 'ohana' };
  try { data = event.data.json(); } catch(e) {}
  const title = data.title || 'Ohana Home';
  const options = {
    body: data.body || '',
    icon: '/ohana-icon-192-v2.png',
    badge: '/notification-badge.svg',
    tag: data.tag || 'ohana',
    renotify: true,
    data: { type: data.type || 'general', roomId:data.roomId, gameId:data.gameId, conversation:data.conversation },
    silent:false,
    requireInteraction:data.type==='turn',
    vibrate:[200,100,200]
  };
  event.waitUntil((async()=>{
    if(data.conversation){const windows=await clients.matchAll({type:'window',includeUncontrolled:true});const visible=windows.filter(c=>c.visibilityState==='visible');if(visible.length){visible.forEach(c=>c.postMessage({type:'ohana-chat-refresh'}));return;}}
    await self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      const d=event.notification.data||{};
      const target='/?noticeRoom='+(Number(d.roomId)||'')+'&noticeGame='+(Number(d.gameId)||'')+'&noticeType='+encodeURIComponent(d.type||'')+'&conversation='+encodeURIComponent(d.conversation||'');
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          client.postMessage({type:'ohana-notification',...d});return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

// Also used by the service worker, so sharing can arrive while Ohana is closed.
async function memoryInboxAdd(files,caption=''){
  if(!files.length||files.length>20||files.some(f=>!f.type.startsWith('image/')||f.type==='image/svg+xml')||files.reduce((n,f)=>n+f.size,0)>20*1024*1024)throw Error('Choose up to 20 photos, totaling no more than 20 MB.');
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ohana-memories-inbox',1);r.onupgradeneeded=()=>r.result.createObjectStore('pending',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('Could not keep the shared photos on this device.'));});
  try{await new Promise((resolve,reject)=>{const tx=db.transaction('pending','readwrite');const store=tx.objectStore('pending');const count=store.count();count.onsuccess=()=>{if(count.result+files.length>20){tx.abort();return;}for(const file of files)store.put({id:crypto.randomUUID(),file,caption:String(caption).slice(0,500),created:Date.now()});};tx.oncomplete=resolve;tx.onerror=()=>reject(Error('Could not keep these photos. Open Ohana Memories and clear or add the previous photos first.'));tx.onabort=()=>reject(Error('You already have selected photos waiting. Add them first, then share more.'));});}finally{db.close();}
}

self.addEventListener('fetch', e => {
  if(e.request.method==='POST' && new URL(e.request.url).pathname==='/memories/incoming'){
    e.respondWith((async()=>{try{const f=await e.request.formData();await memoryInboxAdd(f.getAll('photos').filter(x=>x?.arrayBuffer),f.get('text')||f.get('title')||'');return Response.redirect(new URL('/memories?shared=1',self.location.origin).href,303);}catch(x){return new Response(x.message,{status:400,headers:{'content-type':'text/plain; charset=utf-8'}});}})());return;
  }
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request, { cache: 'reload' }).catch(() => caches.match(e.request)));
  }
});
`;
export {
  PuzzleRoom,
  worker_default as default
};
//# sourceMappingURL=worker.js.map

// Private Ohana Memories: isolated tables, with room membership on every read/write.
async function ensureJourneyMemories(db){
 await db.prepare('CREATE TABLE IF NOT EXISTS ohana_journey_memories(puzzle_id INTEGER PRIMARY KEY,room_id INTEGER NOT NULL,name TEXT NOT NULL,image TEXT NOT NULL,pieces INTEGER NOT NULL,helpers TEXT NOT NULL,finished_at INTEGER NOT NULL)').run();
}
async function saveJourneyMemory(db,puzzleId,roomId,stats){
 if(!puzzleId||!roomId)return;
 await ensureJourneyMemories(db);
 await db.prepare('INSERT OR IGNORE INTO ohana_journey_memories(puzzle_id,room_id,name,image,pieces,helpers,finished_at) SELECT id,room_id,name,image,cols*rows,?,? FROM puzzles WHERE id=? AND room_id=?').bind(JSON.stringify(stats||{}),Date.now(),puzzleId,roomId).run();
 await db.prepare("UPDATE puzzles SET status='memory' WHERE id=? AND room_id=? AND status!='deleted'").bind(puzzleId,roomId).run();
}
async function memoriesApi(req, env, url) {
  const me = await auth(req, env);
  if (!me) return Response.json({error:'Sign in to your Ohana family to open Memories.'},{status:401});
  const db=env.DB;
const rooms=(await db.prepare("SELECT r.id,r.name,r.owner_id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'') ORDER BY r.name").bind(me.id).all()).results;
  const headers={'cache-control':'private, no-store','x-content-type-options':'nosniff'};
  const reply=(data,status=200)=>Response.json(data,{status,headers});
  if(url.pathname==='/api/memories/rooms' && req.method==='GET')return reply({rooms,me:{id:me.id,name:me.name,is_admin:!!me.is_admin}});
  await db.prepare('CREATE TABLE IF NOT EXISTS ohana_memories (id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,caption TEXT NOT NULL DEFAULT \'\',created_at INTEGER NOT NULL,mime TEXT NOT NULL,data BLOB NOT NULL,thumbnail BLOB NOT NULL,hidden INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS ohana_memories_room_date ON ohana_memories(room_id,hidden,created_at DESC,id DESC)').run();
  const room=Number(req.headers.get('x-ohana-room')||url.searchParams.get('room'));
  if(!Number.isSafeInteger(room)||!rooms.some(r=>r.id===room))return reply({error:'This album belongs to another family room.'},403);
  await db.prepare('CREATE TABLE IF NOT EXISTS ohana_memory_albums(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,name TEXT NOT NULL COLLATE NOCASE,created_by INTEGER NOT NULL,created_at INTEGER NOT NULL,UNIQUE(room_id,name))').run();
  const cols=(await db.prepare('PRAGMA table_info(ohana_memories)').all()).results;
  if(!cols.some(c=>c.name==='album_id')){try{await db.prepare("ALTER TABLE ohana_memories ADD COLUMN album_id TEXT NOT NULL DEFAULT '0'").run();}catch(e){const check=(await db.prepare('PRAGMA table_info(ohana_memories)').all()).results;if(!check.some(c=>c.name==='album_id'))throw e;}}
  const validAlbum=async id=>id==='0'||!!(await db.prepare('SELECT id FROM ohana_memory_albums WHERE id=? AND room_id=?').bind(id,room).first());
  await db.prepare('CREATE TABLE IF NOT EXISTS ohana_memory_video_parts(memory_id TEXT NOT NULL,part INTEGER NOT NULL,data BLOB NOT NULL,PRIMARY KEY(memory_id,part))').run();
  const path=url.pathname;
  if(path==='/api/memories/frames'&&req.method==='GET'){
    const photos=(await db.prepare("SELECT id,caption FROM ohana_memories WHERE room_id=? AND hidden=0 AND mime='image/jpeg' ORDER BY created_at DESC,id DESC LIMIT 6").bind(room).all()).results;
    return reply({photos:photos.map(p=>({...p,image_url:'/api/memories/photo/'+p.id+'?thumbnail=1'}))});
  }
  const feedback=await ohanaPhotoFeedbackApi(req,env,url,me,room,reply);if(feedback)return feedback;
  if(path==='/api/memories/family-original'&&req.method==='GET'){
    const original=APP_HTML.match(/const GR_FAMILY_MEMORY=['"]data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)/);
    if(!original)return reply({error:'The original family photograph is unavailable.'},404);
    return new Response(Uint8Array.from(atob(original[2]),c=>c.charCodeAt(0)),{headers:{...headers,'content-type':original[1]}});
  }
  // The photo album and porch slideshow share one room-scoped collection.
  // Uploaded originals are photographs; built-in illustrated puzzle scenes stay in Journey history.
  if(path==='/api/memories/gallery'&&req.method==='GET'){
    await ensureJourneyMemories(db);
    const album=url.searchParams.get('album');
    if(album&&!await validAlbum(album))return reply({error:'This album is not in your family room.'},404);
    const uploaded=(await db.prepare('SELECT p.id,p.member_id,p.caption,p.created_at,p.album_id,p.mime,m.name AS author FROM ohana_memories p JOIN members m ON m.id=p.member_id WHERE p.room_id=? AND p.hidden=0'+(album?' AND p.album_id=?':'')+' ORDER BY p.created_at DESC LIMIT 1000').bind(...(album?[room,album]:[room])).all()).results;
    let photos=uploaded.map(p=>({...p,image_url:'/api/memories/photo/'+p.id,thumbnail_url:'/api/memories/photo/'+p.id+'?thumbnail=1'}));
    if(!album){
      const journeys=(await db.prepare("SELECT puzzle_id,name,finished_at FROM ohana_journey_memories WHERE room_id=? AND image LIKE 'data:image/%' ORDER BY finished_at DESC LIMIT 1000").bind(room).all()).results;
      const earlier=(await db.prepare("SELECT a.id,a.name,a.finished_at,a.saved_at FROM puzzle_album a WHERE a.room_id=? AND a.image LIKE 'data:image/%' AND NOT EXISTS(SELECT 1 FROM ohana_journey_memories j WHERE j.room_id=a.room_id AND j.image=a.image AND j.name=a.name) ORDER BY a.saved_at DESC LIMIT 1000").bind(room).all()).results;
      photos.push(...journeys.map(p=>({id:'journey-'+p.puzzle_id,caption:p.name,created_at:p.finished_at,author:'Our Ohana',read_only:true,image_url:'/api/memories/journeys/'+p.puzzle_id+'/image'})),...earlier.map(p=>({id:'album-'+p.id,caption:p.name,created_at:p.finished_at||p.saved_at,author:'Our Ohana',read_only:true,image_url:'/api/album/'+p.id+'/image'})));
      // Retain the real Mike photograph already displayed on the porch.
      photos.push({id:'mike-birthday',caption:'Mike',created_at:0,author:'Our Ohana',read_only:true,image_url:'/mike-birthday.webp'},{id:'granny-family-original',caption:'Granny’s family photograph',created_at:0,author:'Our Ohana',read_only:true,image_url:'/api/memories/family-original'});
    }
    photos.sort((a,b)=>b.created_at-a.created_at||b.id.localeCompare(a.id));
    const before=Number(url.searchParams.get('before')),beforeId=url.searchParams.get('beforeId');
    if(beforeId)photos=photos.filter(p=>p.created_at<before||(p.created_at===before&&p.id<beforeId));
    return reply({photos:photos.slice(0,30),more:photos.length>30});
  }
  if(path==='/api/memories/journeys'&&req.method==='GET'){

    await ensureJourneyMemories(db);
    const journeys=(await db.prepare('SELECT puzzle_id,name,pieces,helpers,finished_at FROM ohana_journey_memories WHERE room_id=? ORDER BY finished_at DESC LIMIT 100').bind(room).all()).results;
    return reply({journeys});
  }
  const journeyImage=path.match(/^\/api\/memories\/journeys\/(\d+)\/image$/);
  if(journeyImage&&req.method==='GET'){
    await ensureJourneyMemories(db);
    const row=await db.prepare('SELECT image FROM ohana_journey_memories WHERE puzzle_id=? AND room_id=?').bind(Number(journeyImage[1]),room).first();
    if(!row)return reply({error:'This Journey memory is not in your family room.'},404);
    if(row.image.startsWith('data:image/')){const match=row.image.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);if(!match)return reply({error:'This picture cannot be opened.'},400);return new Response(Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0)),{headers:{...headers,'content-type':match[1]}});}
    if(!/^\/[a-z0-9-]+\.webp$/.test(row.image))return reply({error:'This picture cannot be opened.'},400);
    const image=await fetch(new URL(row.image,req.url));if(!image.ok)return reply({error:'The picture is not available.'},502);
    return new Response(image.body,{headers:{...headers,'content-type':'image/webp'}});
  }

  if(path==='/api/memories/albums'&&req.method==='GET'){
    const albums=(await db.prepare('SELECT a.id,a.name,COUNT(p.id) AS photos FROM ohana_memory_albums a LEFT JOIN ohana_memories p ON p.album_id=a.id AND p.room_id=a.room_id AND p.hidden=0 WHERE a.room_id=? GROUP BY a.id ORDER BY a.name').bind(room).all()).results;
    return reply({albums});
  }
  if(path==='/api/memories/albums'&&req.method==='POST'){
    const body=await req.json().catch(()=>({}));const name=String(body.name||'').trim().replace(/\s+/g,' ');
    if(!name||name.length>80)return reply({error:'Give this album a name, up to 80 characters.'},400);
    const id=crypto.randomUUID();
    try{await db.prepare('INSERT INTO ohana_memory_albums(id,room_id,name,created_by,created_at) VALUES(?,?,?,?,?)').bind(id,room,name,me.id,Date.now()).run();}catch(e){const same=await db.prepare('SELECT id,name FROM ohana_memory_albums WHERE room_id=? AND name=?').bind(room,name).first();if(same)return reply({error:'There is already an album with that name.'},409);throw e;}
    return reply({album:{id,name,photos:0}},201);
  }
  if(path==='/api/memories' && req.method==='GET'){
    const before=Number(url.searchParams.get('before'))||Number.MAX_SAFE_INTEGER;
    const beforeId=String(url.searchParams.get('beforeId')||'\uffff');
    const album=url.searchParams.get('album');if(album!==null&&!await validAlbum(album))return reply({error:'This album is not in your family room.'},404);
    const filter=album!==null?' AND p.album_id=?':'';
    const args=album!==null?[room,album,before,before,beforeId]:[room,before,before,beforeId];
    const photos=(await db.prepare('SELECT p.id,p.room_id,p.member_id,p.caption,p.created_at,p.album_id,p.mime,a.name AS album_name,m.name AS author FROM ohana_memories p JOIN members m ON m.id=p.member_id LEFT JOIN ohana_memory_albums a ON a.id=p.album_id AND a.room_id=p.room_id WHERE p.room_id=? AND p.hidden=0'+filter+' AND (p.created_at<? OR (p.created_at=? AND p.id<?)) ORDER BY p.created_at DESC,p.id DESC LIMIT 31').bind(...args).all()).results;
    const more=photos.length>30;if(more)photos.pop();return reply({photos,more});
  }
  if(path==='/api/memories' && req.method==='POST'){
    const limit=20*1024*1024;
    if(Number(req.headers.get('content-length'))>limit+200000)return reply({error:'Choose a video up to 20 MB or a photo Ohana can resize.'},413);
    const form=await req.formData(),image=form.get('photo'),thumb=form.get('thumbnail');
    const id=String(form.get('id')||''),album=String(form.get('album')||'0');
    if(!await validAlbum(album))return reply({error:'Choose an album in this family room.'},400);
    if(!/^[a-f0-9-]{36}$/.test(id)||!image?.arrayBuffer||!thumb?.arrayBuffer)return reply({error:'Choose a photo or video to share.'},400);
    const video=['video/mp4','video/webm'].includes(image.type),mime=video?image.type:'image/jpeg';
    if(image.size<4||image.size>(video?limit:900000)||thumb.size<4||thumb.size>100000)return reply({error:'Videos must be up to 20 MB. Choose the photo again to resize it.'},413);
    const data=await image.arrayBuffer(),small=await thumb.arrayBuffer(),bytes=new Uint8Array(data);
    const jpeg=b=>{const a=new Uint8Array(b);return a[0]===255&&a[1]===216&&a[a.length-2]===255&&a[a.length-1]===217;};
    const supported=video?(mime==='video/mp4'?bytes.length>=12&&String.fromCharCode(...bytes.slice(4,8))==='ftyp':bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163):jpeg(data);
    if(!supported||!jpeg(small))return reply({error:'Choose a JPG photo or a supported MP4/WebM video.'},400);
    const old=await db.prepare('SELECT room_id,member_id FROM ohana_memories WHERE id=?').bind(id).first();
    if(old)return old.room_id===room&&old.member_id===me.id?reply({id,saved:true}):reply({error:'Please choose this memory again.'},409);
    const statements=[db.prepare('INSERT INTO ohana_memories(id,room_id,member_id,caption,created_at,mime,data,thumbnail,album_id) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,room,me.id,String(form.get('caption')||'').trim().slice(0,500),Date.now(),mime,video?new Uint8Array([0]):data,small,album)];
    // Keep each D1 row below its size limit. Batch is atomic, including the metadata row.
    if(video)for(let offset=0,part=0;offset<bytes.length;offset+=1024*1024,part++)statements.push(db.prepare('INSERT INTO ohana_memory_video_parts(memory_id,part,data) VALUES(?,?,?)').bind(id,part,bytes.slice(offset,offset+1024*1024)));
    await db.batch(statements);
    return reply({id,saved:true},201);
  }
  const move=path.match(/^\/api\/memories\/photo\/([a-f0-9-]{36})\/album$/);
  if(move&&req.method==='POST'){
    const p=await db.prepare('SELECT member_id FROM ohana_memories WHERE id=? AND room_id=? AND hidden=0').bind(move[1],room).first();
    if(!p)return reply({error:'Photo not found.'},404);
    if(p.member_id!==me.id&&rooms.find(r=>r.id===room)?.owner_id!==me.id&&!me.is_admin)return reply({error:'Only the person who added this photo or the room owner can move it.'},403);
    const body=await req.json().catch(()=>({}));const album=String(body.album||'0');if(!await validAlbum(album))return reply({error:'Choose an album in this family room.'},400);
    await db.prepare('UPDATE ohana_memories SET album_id=? WHERE id=? AND room_id=?').bind(album,move[1],room).run();return reply({moved:true,album});
  }
  const media=path.match(/^\/api\/memories\/photo\/([a-f0-9-]{36})$/);
  if(media&&req.method==='GET'){
    const thumbnail=url.searchParams.has('thumbnail'),column=thumbnail?'thumbnail':'data';
    const photo=await db.prepare('SELECT '+column+' AS bytes,mime FROM ohana_memories WHERE id=? AND room_id=? AND hidden=0').bind(media[1],room).first();
    if(!photo)return reply({error:'This memory is not in your album.'},404);
    let bytes=new Uint8Array(photo.bytes);
    if(!thumbnail&&photo.mime.startsWith('video/')){
      // Read parts individually: a D1 result row never contains the entire video.
      const count=await db.prepare('SELECT COUNT(*) AS n FROM ohana_memory_video_parts WHERE memory_id=?').bind(media[1]).first();
      const parts=[];let length=0;
      if(!count.n||count.n>20)return reply({error:'This video is temporarily unavailable.'},404);
      for(let part=0;part<count.n;part++){const row=await db.prepare('SELECT data FROM ohana_memory_video_parts WHERE memory_id=? AND part=?').bind(media[1],part).first();if(!row)return reply({error:'This video is temporarily unavailable.'},404);const data=new Uint8Array(row.data);parts.push(data);length+=data.length;}
      bytes=new Uint8Array(length);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
    }
    const type=thumbnail?'image/jpeg':photo.mime;
    return new Response(bytes,{headers:{...headers,'content-type':type,'content-length':String(bytes.length)}});
  }
  const hide=path.match(/^\/api\/memories\/photo\/([a-f0-9-]{36})\/hide$/);
  if(hide&&req.method==='POST'){
    const p=await db.prepare('SELECT member_id FROM ohana_memories WHERE id=? AND room_id=?').bind(hide[1],room).first();
    const owner=await db.prepare('SELECT owner_id FROM rooms WHERE id=?').bind(room).first();
    if(!p)return reply({error:'Photo not found.'},404);
    if(p.member_id!==me.id&&owner?.owner_id!==me.id&&!me.is_admin)return reply({error:'Only the person who added this photo or the room owner can remove it.'},403);
    await db.prepare('UPDATE ohana_memories SET hidden=1 WHERE id=? AND room_id=?').bind(hide[1],room).run();return reply({hidden:true});
  }
  return reply({error:'Not found'},404);
}

// Also used by the service worker, so sharing can arrive while Ohana is closed.
async function memoryInboxAdd(files,caption=''){
  if(!files.length||files.length>20||files.some(f=>!f.type.startsWith('image/')||f.type==='image/svg+xml')||files.reduce((n,f)=>n+f.size,0)>20*1024*1024)throw Error('Choose up to 20 photos, totaling no more than 20 MB.');
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ohana-memories-inbox',1);r.onupgradeneeded=()=>r.result.createObjectStore('pending',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('Could not keep the shared photos on this device.'));});
  try{await new Promise((resolve,reject)=>{const tx=db.transaction('pending','readwrite');const store=tx.objectStore('pending');const count=store.count();count.onsuccess=()=>{if(count.result+files.length>20){tx.abort();return;}for(const file of files)store.put({id:crypto.randomUUID(),file,caption:String(caption).slice(0,500),created:Date.now()});};tx.oncomplete=resolve;tx.onerror=()=>reject(Error('Could not keep these photos. Open Ohana Memories and clear or add the previous photos first.'));tx.onabort=()=>reject(Error('You already have selected photos waiting. Add them first, then share more.'));});}finally{db.close();}
}
async function memoriesIncoming(req){
  const limit=20*1024*1024;
  if(Number(req.headers.get('content-length'))>limit+100000)return new Response('Share up to 20 MB of photos at a time.',{status:413});
  const form=await req.formData();const files=form.getAll('photos').filter(f=>f?.arrayBuffer);
  if(!files.length||files.length>20||files.reduce((n,f)=>n+f.size,0)>limit||files.some(f=>!f.type.startsWith('image/')||f.type==='image/svg+xml'))return new Response('Choose up to 20 image photos, totaling no more than 20 MB.',{status:400});
  const records=[];
  for(const f of files){const a=new Uint8Array(await f.arrayBuffer());let binary='';for(let i=0;i<a.length;i+=8192)binary+=String.fromCharCode(...a.subarray(i,i+8192));records.push({name:f.name,type:f.type,data:btoa(binary)});}
  const payload=JSON.stringify({files:records,caption:String(form.get('text')||form.get('title')||'').slice(0,500)}).replace(/</g,'\\u003c');
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ohana Memories</title><body style="background:#875024;color:#fff5d9;font:22px sans-serif;padding:28px"><h1>Ohana Memories</h1><p id="message">Keeping your selected photos ready for you…</p><a style="color:#a5ffff" href="/memories">Open Memories</a><script>'+memoryInboxAdd.toString()+';const shared='+payload+';(async()=>{try{const files=shared.files.map(f=>{const a=Uint8Array.from(atob(f.data),c=>c.charCodeAt(0));return new File([a],f.name,{type:f.type});});await memoryInboxAdd(files,shared.caption);location.replace("/memories?shared=1");}catch(e){document.getElementById("message").textContent=e.message;}})();<\/script></body></html>';
  return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
}

async function wardrobeApi(req,db,me,body){
    const key = "wardrobe_" + me.id;
    const row = await db.prepare("SELECT value FROM settings WHERE key=?").bind(key).first();
    let wardrobe = {};
    try {
      wardrobe = JSON.parse(row?.value || "{}") || {};
    } catch {
    }
    if (req.method === "GET") return json({ ok: true, avatar: me.avatar, wardrobe });
    const avatar = String(body.avatar || "");
    const allowed = ["@eag", "@eaglimo", "@hon", "@spl", "@kik", "@peb", "@man", "@sun", "@ott", "@pip", "@lul", "@hoo", "@flu", "@ros", "@koa", "@mil", "@bam", "@coc", "@fin", "@ink", "@kai", "@flo", "@ree", "@bnd", "@n01", "@n02", "@n03", "@n04", "@n05", "@n06", "@n07", "@n08", "@n09", "@n11", "@n13", "@n15", "@n16", "@n17", "@n18", "@n19", "@n20", "@n21", "@n23", "@n24", "@bp1", "@bn1", "@bf1", "@ba1", "@w00", "@w01", "@w02", "@w03", "@w04", "@w05", "@w06", "@w08", "@w09", "@w10", "@w11", "@a00", "@a01", "@a02", "@a03", "@a04", "@a05", "@a06", "@a07", "@a08", "@a09", "@a13", "@a14", "@a15", "@a16", "@a17", "@a18", "@a19", "@a20", "@a22", "@a23", "@a25", "@a26", "@a27", "@a28", "@a29", "@a30", "@a31", "@a32", "@a33", "@a34", "@a35", "@a36", "@a37", "@a38", "@a39", "@a40", "@a41", "@a43", "@a44", "@a45", "@a46", "@a47", "@a48", "@a49", "@a50", "@a51", "@a52", "@a53", "@a54", "@a55", "@a56", "@a57", "@a58", "@a59", "@a60", "@a61", "@a62", "@a63", "@a64", "@a65", "@a66", "@a67", "@a68", "@a69", "@a70", "@a71", "@a72", "@a73", "@a74", "@a75", "@a76", "@a77", "@a78", "@a79", "@a80", "@a82", "@a83", "@a84", "@a85", "@a86", "@a87", "@a89", "@a90", "@a91", "@a92", "@a93", "@a94", "@a95", "@a97", "@a98", "@a99", "@c00", "@c01", "@c02", "@c03", "@c04", "@c05", "@c06", "@c07", "@c08", "@c09", "@c10", "@c11", "@c12", "@c13", "@c14", "@c15", "@c16", "@c17", "@c18", "@c19", "@c20", "@c21", "@c22", "@c23", "@c24", "@c25", "@c26", "@c28", "@c29", "@c30", "@c31", "@c32", "@c33", "@c34", "@c35", "@c36", "@c37", "@c38", "@c39", "@l00", "@l01", "@l02", "@l03", "@l04", "@l05", "@l06", "@l07", "@l08", "@l09", "@l10", "@l11", "@o00", "@o01", "@o02", "@o03", "@o04", "@o05", "@o06", "@o07", "@o08", "@o09", "@o10", "@o11", "@o12", "@o13", "@o14", "@o15", "@o16", "@o17", "@o18", "@o19", "@o20", "@o21", "@o22", "@o23", "@o24", "@u00", "@u01", "@u02", "@u03", "@u04", "@u05", "@u06", "@u07", "@u08", "@u09", "@u10", "@u11", "@u12", "@u13", "@u14", "@u15", "@u16", "@u17", "@u18", "@u19", "@u20", "@u21", "@u22", "@u23", "@u24", "@u25", "@u26", "@u27", "@u28", "@u29", "@u30", "@u31", "@u32", "@u33", "@u34", "@u35", "@u36", "@u37", "@u38", "@u39", "@u40", "@u41", "@u42", "@u43", "@u44", "@u45", "@u46", "@u47", "@u48", "@u49", "@u50", "@u51", "@u52", "@u53", "@u54", "@u55", "@u56"];
    if (!allowed.includes(avatar)) throw new Error("Choose a character and outfit from the wardrobe.");
    const nickname = String(body.nickname || "").trim(), motto = String(body.motto || "").trim(), trait = String(body.trait || "Kindhearted");
    if (nickname.length > 24 || motto.length > 80) throw new Error("Keep the nickname to 24 characters and the saying to 80.");
    if (!["Kindhearted", "Playful", "Brave", "Curious", "Calm", "Helpful", "Adventurous", "Cheerful"].includes(trait)) throw new Error("Choose a personality from the list.");
    wardrobe = { nickname, motto, trait, avatar };
    await db.batch([
      db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, me.id),
      db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(key, JSON.stringify(wardrobe))
    ]);
    return json({ ok: true, avatar, wardrobe });
  
}

async function grannyWordCheck(req,db,url){const word=String(url.searchParams.get('word')||'').toUpperCase(),letters=String(url.searchParams.get('letters')||'').toUpperCase();if(!/^[A-Z]{3,24}$/.test(word)||!/^[A-Z]{3,24}$/.test(letters))return Response.json({error:'Use the letters on your wheel.'},{status:400});const remaining=[...letters];for(const letter of word){const at=remaining.indexOf(letter);if(at<0)return Response.json({word,valid:false});remaining.splice(at,1);}return Response.json({word,valid:!!await db.prepare('SELECT 1 FROM words WHERE w=?').bind(word).first()},{headers:{'cache-control':'no-store'}});}

// ohana-music-contributions-private-v1
const OHANA_MUSIC_BUILTIN_IDS=new Set(["a0eb7444-7efc-4215-848a-067cc7adc70c","767a5808-f252-45d9-ace3-369a5dac6262","9bd5dfa5-ea18-4d67-9343-7bd80cb11ddb","99214295-43e1-44d2-aa93-cc3717e81761","ec7e507e-baa2-479e-8839-f4b65268a5ed","f4db11a7-3cbf-40ce-af46-be9cedb68a56","d210aac3-754a-4f08-8209-54e01d23b51e","05feffb4-b57e-42a3-93e9-c151288eb59c","7c0d7eb9-d7a0-43e5-a61c-aa383db77fb5","a95d769d-d654-477c-a140-8eb9370ba78b","802b9415-42bf-4795-937a-c16ea3c92c03","e37b5d0a-7d90-4850-85a4-9bdd47c6dd1c","0a937595-e372-4cf6-850f-dfdfb0545ba2","73a1c607-c344-4e96-84e1-86e1cb43531d","83e39d6a-950e-4b37-94ee-7eb7950e0ac7","38bf25eb-6101-4c6f-a276-7425742103e6","7185b367-26f0-435e-b439-b6cb96a2dd18","9b8a0a95-3d09-46f2-9c17-090e06ff31a0","f826fb2d-0e23-4f5b-b14c-56fde7e02185","c35668d1-37d1-4675-9179-50b0c096e14c","b515ac87-e94d-41ae-b427-170d931343d1","73356656-06d2-481d-a2d6-6fcf8afc31ec","120bb63c-b75e-493f-869a-5c84d484004d","cf055d3a-3ff7-4fe4-a882-12b111894f87","525b7b07-f6de-4406-aba0-8b2a5b6faa02","263c64a0-257d-4b03-8b4d-fb5ea7793166","61835a89-2272-48d8-8954-aafe5340671b","82ead92b-7439-4029-95e6-77faa28e9aa1","de8c0a3b-0a4f-448f-aca6-2e9c97b529fc","ee4b81b1-e55c-4beb-a128-8ea8dec85cdf","9c32376a-665a-4ee1-afce-bc34b6cf4599","59db8f96-c329-4ec1-8f50-b0074b3d350c","00eae232-81e5-45e4-8666-38c1519742cb","0cb9b4c7-1efc-4daa-ba91-cf4131a2d0b4","42d738f1-4517-49a9-bd9f-942d47e5c271","c75d4436-d3cf-48f4-b8aa-8ca6c46876f0","2883a524-0197-44b6-9816-4d00c35645f5","ff591f71-3c04-4790-8a4c-55ef57900bee","0c402044-3f44-4858-9bde-3f7c932c14cd","49ce4a05-30c4-4813-a6aa-cefd41ed8cdd","59560edd-f8cc-4a3c-bd55-d4cc24bcdf34","d99fdece-6a17-4abf-b878-6b5b9768df71","0eb800b8-676f-4d48-8e79-74a17250d5aa","d50ac745-01ff-4991-95f1-27d7294054a6","8f8f467a-2080-4184-a222-a50526f052c5","128768cf-e9d7-437c-a595-315c5b24cf5e","9bffd9d6-845e-4b3d-acd6-c63db3e59dca","09d51a7e-d3f9-414d-8a67-f85286db28f7","94b09a7e-9223-461d-b262-bf5db1287421","47e50e58-1ea4-4f7f-bfc9-47304a3c2b7c","c237e172-dcce-4e83-a1b8-0fe89b8f8287","40437fa5-a28b-4638-80f1-3bf4fe19292d","0fa1b302-f913-46ff-a273-c4e5d6e57692","ecc8b032-a7e0-43c4-956f-75d2203503c6","83ba4cd5-c0a6-43bc-b8d2-cd4f8166f79b","2de10660-047d-4cce-b0fa-100e136956a7","8be826fb-d7b3-4a7a-b073-5d84b22c1296","082ac542-d49c-4c75-b33c-ee46c85aec53","1212f651-de72-4aec-a0e0-1f88655970e2","a5ecf302-8f67-48fc-a611-1aa4c5812a11","1c4053be-3961-4d1e-8927-d5234d1f7f43","924d9eec-e277-451e-a068-cce205584fd3","45114470-90f5-414b-aebc-f068a3a25e58","6cb702a0-56e9-4e7a-b4ea-9a476a41f038","3fd5d26e-85c4-4a21-993c-e8e958f02f5e","139826e0-1929-4bd1-99ea-da7edf7c114d","cc39c136-964c-4b7b-bc5e-cad38a59deeb","942e04b5-daf7-4480-9495-1a3ad4440e22","6e68bc5b-35a6-4201-8d99-8a0380c57574","bfd72966-73df-49a5-b7b1-e105824937d7","4aaa2dd0-a4c3-4d05-b035-de7a3ecc68d2","8fecb50d-0000-4823-947e-e5749430cb8a","c6b4c546-3f4e-49e1-9400-5487a8b5fd17","fcb6ad99-8f7e-43c1-a6de-eaad304181f7","d02581ce-57bf-4077-a800-5ff8245d2b69","75fd40c7-bc05-4dcc-840b-dfcf873b2bf3","24ec50af-4201-446d-bd5d-81c08aa9e8f4","97e774e1-8ca5-4f61-bc26-fa96c4fd51c2","04257a5d-f8a1-448b-ad07-c04708e1f07b","43b3794a-1e53-4feb-89b3-47af61511d09","3f338296-3a42-4f2d-8e92-30e39df05fa5","3815942e-d12e-40af-94bb-e69e59b1c616","5126ca25-4f73-4a90-bf8a-baedb99cc60b","038d0a0a-421b-4117-8c25-66aba095d09c","c01028e9-1f91-4d10-96d3-0e23a5e8a520","15be7d90-d5bf-4bcb-af68-83049fae487a","da12fcf1-caf9-4683-8ca9-f3b77cdf79bb","441a428e-8f46-40b9-bd5f-fb28b0fc3023","e0c6f9ba-224f-45bb-88bb-f3a5aab2fa2e","45b1c1d4-5745-4c15-8977-82f6c12f05ee","9b006db1-15a6-4e7e-be85-249e80d516bc","a9c0e20f-03b0-4e15-9b17-88db288de847","42a54005-8a39-4037-93a9-73fec69e5f75","f9dfdd46-2b3c-4f39-9f28-2885f358fcff","4fe68dca-69d2-4e07-8e24-e72176be137e","d47f8f85-4f3b-4ae7-9b9e-b38fee92e734","be1161ce-07fa-4ad4-80f0-981a337a7acf","85b2608e-a767-4459-9d66-925f61c460b3","9a22ccb8-2942-4536-8d85-e3b3ddfac0e9","caae6523-65ef-47ca-8fcd-b25599b9c24d","d79b5059-e005-4b91-97cc-790700a02f6a","69d5c94b-6dcc-4a15-8f64-c5aaf2f20802","295f05d9-de8a-4dd4-85ab-1990a96b44cd","718d8090-7762-48ab-a275-ade425dcf696","b3c3e74c-efbd-4c43-b5ac-9cd1ade3a9ee","420e5001-8d19-4627-8374-9d08a5075c55","f9c1223c-c664-4690-9c14-779771cfceaf","fbdfa308-9987-4c06-9529-8fe84461a6cc","7500f3e3-c124-4ecb-8ae8-739331c4741e","374c0eb6-4862-4d06-bf2f-ecc54f35b837","45a997d1-dd4a-4e80-b742-d28d32e60ef1","ca96e9ee-950f-4df5-a904-29bb59fb0e44","cb5b74c6-825d-447e-a464-e36788650628","0c3009d9-6857-4595-83ec-b29bcb27840c","690e0e79-ba09-4fb3-86c7-6fb84f59f806","f92519af-c816-42d4-8f54-04a8663fc30d","742eb1fc-0f03-41df-89bf-1268027faf65","d579c124-a4e9-4134-a9a6-1cab9458688f","e379ba23-1862-474c-b17c-346af1600919","7802bf73-6981-4df4-b2b1-5d23fb5a6c47","759c5b88-3b99-4890-a160-961c9870ef03","366e9c59-163c-44ae-90c5-028168843b7a","d90b709f-700a-49d9-a926-8293723b9076","b1139865-f1a9-4b4e-a253-2481ea94a5d3","dd6630c9-dcd2-4cfc-8c85-7e55ea421e87","e9d85cae-0319-49dc-9d5a-f7b2b5a4f4b5","f22babdc-9cda-493b-a01d-24f5fc8897ed","130d675f-66b1-4537-874c-d67c4a6aee19","e1e14cf0-11f8-471e-8e5b-edf2fed2bb78","d8cfcfba-8866-4b35-a953-d61498a4ba28","c91c3cbf-438e-4084-90ce-2a1b8fc9c7a8","0e21ac3d-1e69-475d-b93e-e90e84528e50","be07571a-e1b1-428b-8af5-07729467fa63","b748ea45-18b5-4e43-9d90-22e9cdfa08dd","19698eca-e54b-44cf-b967-b455d0899cb4","1d4377af-02e0-4b50-9786-b1b5849d6c64","7bf288a7-a168-45ca-a0f2-01b930d74437","708e69bf-eae4-4fe4-b81a-be0501a41ef0","0403a47e-e285-4ced-8b19-f073d5feba75","4ae46ea5-64d4-4a11-9896-faa0c3bc411c","f0fdcb7d-d8ff-40d5-b59a-eb342c4f1879","0f0177d8-b2ee-49c7-8c46-c0af9dd5bc79","e7d13262-5a43-421e-b584-49020bf9616e","afbb3b4b-58b0-4e0d-b2d8-4ae459611f7c","50305e55-f6f0-4605-b229-a24ae015b94b","42ff7c8e-04de-4de8-8765-9a58ec103a23","5f90f396-bc78-44f5-be83-21e37b6818a5","7fe49fb7-cbb8-4de6-9a35-fed9ed4a2d0a","5c66e467-b365-46bc-abd8-5bfc82cbee23","d895f9f2-d4d9-414c-a249-772d40113873","15f7717a-a243-420a-8cfc-336ba0468ef5","0df1b5b8-fd7b-4ef0-9cfa-5549180d5d7c","6fa1f102-1f42-401b-a9dc-a26db1e09c11","4d44c699-8e34-448e-b5f5-9aa86867fdcd","ec4a13d2-2648-4385-a077-c0c2b3cf76da","9c1dc320-3a2c-46e5-ba26-bbd6bd592ed3","ea0f8bc7-b90a-49d3-a77b-bd9bae44abe5","9e6e2e3c-4149-4e01-88a6-f494096a51b0","641f2a45-4793-4f46-afbb-6a661e36675e","732ec72d-9b30-43e8-b3fd-a086a10cb2e2","9fc36836-0e42-4218-90ec-dd5a5753d8c0","aaf04f61-8df5-46ef-812c-31e66fdc9d40","428c220c-071f-4959-b7a4-54e2686e99d7","75ed1092-fdad-44a1-9d0c-281a6a71f793","542dd6d5-99b9-48ae-93e0-e0c182b43a4e","2309102b-d09c-4dbc-83fa-165f9236eed4","e3b76c9f-3b53-41bc-8fa1-8bd1d2214f41","2fd46670-560a-42ef-8f62-f5de5f16a875","bc7ba6a3-fcbc-4a0f-a8da-eee3ad383302","8fabd595-2c10-4bec-bae5-aba012d4601f","f5909872-18de-4485-b9e4-c726b63a2694","1d6f0647-9395-4921-8ec2-bf6bc9772a2c","b6e46649-269a-4425-a5b7-7087c674c2f7","14b2d7b6-859f-4344-9b52-8cbde09b9481","64f15641-17b9-42a6-a76b-2cf1d4f2abd7","6131737d-5784-487b-8c45-3709de833c18","073759d5-f4ca-420b-913f-a4ec80c050f2","7461c2c7-c01d-4683-9cb5-db1d263564f4","50170cfd-da82-4e2c-b032-a5b3a08cc7a7","5be1ee7e-ec1c-45ed-a668-c88b45eff289","08a0e584-4c55-492c-8663-96e6fc7973c9","0ce0da3b-368a-4d66-9637-d65c8ce4b9d9","cfc2ba0a-21ff-49cd-96ca-8871da580bf7","a4519149-510b-470d-8c22-070bc04c5958","28d0125f-e4e8-43fd-8b7f-19a168e07168","ea9dfeb9-38e0-4a5b-bf4b-affe08e81899","3bb13f93-7d00-4383-b7c2-f5077edae717","cdc17c61-824e-40e0-b5a5-57e0cfa751a2","39b7eabd-057d-44ff-93bc-f3d817bac84f","fced306d-1a21-41d1-a276-36175844c0ad","2266940a-cf30-438d-b894-0cb4edf1cf9e","8b0428ee-3af7-42c6-ba89-942ec810fbe2","232aac4a-37c1-4766-8e3f-f289cd615ea5","f68644cd-5d57-4f5d-b012-cb7b6bc4a409","db3f2e01-a847-4470-aae7-1e7b52c544db","f8d25238-809f-4ea2-9878-9895f965e6b9","cb2a3ba1-067c-4070-99c9-e167e490395c","48b1deb3-4d02-445c-bb31-0409d92ba4a8","a33f1ff8-5ec5-4a5f-acdd-85d4bc12946c","f9723d14-46aa-47a0-ac46-c37a87ae6b60","65719101-acd4-400b-9ce3-b273f9a9d24f","614c3774-adbe-4dd3-8160-e7ca8fb04c9f","6b1bc7aa-2fd4-4215-9510-d4aa9b6cd627","2cf2723f-0388-4f2a-a54c-515b0255030c","1298bbaa-01fd-455a-b760-de5f07742beb","e192a904-c670-4eaa-91c8-aeaab1b932a9","5bbd3b88-08c9-4bfb-9779-f9f3fc92fc94","1db85fdd-9b3d-4ea9-a499-82498c2bcab8","d2252f86-12d9-49f5-be9d-0c22152f536a","36e58def-7106-4aa0-8903-76f9da471d3f","3297d352-be54-4c0d-8d41-695ca0eeddf8","8d64de12-25e8-4623-8d31-a3a41c62ef48","076cd6b9-8ab5-4e2d-8241-95808979a107","557e1d81-3269-41e1-8ecf-73680afc2f70","fef9df05-145f-4951-ac6e-feb2b2969795","5e94238c-b903-43e4-8c5a-ee2916275a7e","bfb17fd9-021c-451a-aa7e-bb1fc5c5d336","35651ea1-d944-449d-9171-a18a315e5263","564e7ff0-46f7-4dbb-bc6a-edcaa1b53a30","a44b1612-748a-495c-a2a8-2291a5f48070","bc963a8e-2dd2-4908-8363-8ad68f77e7e9","0febb571-4ec9-45dd-9608-d99b2d93aac3","cc199e5a-9e03-4755-810c-3714871bd634","e1d215e8-4595-45bd-9d19-1e261c1e234c","0f99149b-47d6-4412-8be1-7cce254746ec","418f0e69-58cc-4ab5-841c-82726b194ff4","0025f270-7732-490c-9a3c-e66a938d3d30","3c31bcbc-a20b-4e3e-8e34-b84f2716d596","7890dfd5-97bf-48b5-87ab-3f612a2cfa9f","594d881b-97d3-4b3a-8add-6c9ce38f55cf","68ad2171-7daa-4603-b044-2e8e802a4853","626e254f-7e1e-480d-80eb-d4e100b6ece9","ace7910c-8acf-4fdf-b8cf-f805bcc89e6b","d08d1285-0f0b-4771-9810-8e4725362ea9","ab29f409-81a5-4b1f-93f8-4698cb1cd433","5c4922a4-cd0c-41b0-860b-c39925675dd7","d0f46f7e-0f6a-44c3-8c92-6d0de34f49c4","64682356-e6b0-4716-b1eb-1f360e4e13ab","65799eff-ffc0-45bb-9c18-41ffa3410e4e","f3f5f1a5-2a93-45dd-9d1d-759a11135a57","f27dcefc-323b-489f-8394-713635aa63b6","05b31d39-9861-4ec9-b696-a3ef426dfbb3","65b8172d-ac6a-46dd-9721-cb99018add6e","49ff45b8-df15-4f7e-bed3-6655f1ce17ed","49cb26ac-8504-46fb-bb84-bc60f1ef8695","8d9a5ee5-044f-493d-b599-cd3345cda0b6","5913012a-c71e-484b-bc15-ee65a8e6b2c8","b8a01f9d-26b2-4b6b-bfed-8f4879e42006","6297ea7f-b86b-4d5a-9b20-51898c8f2051","130071b2-fa92-472f-8f1a-e58f545b4835","e2be48d6-f8b4-41cf-9021-0bf82308f487","8e5cf8ff-fa35-43e1-aa28-810bee186ab8","59c57b13-ca1d-4264-89f1-7e1122159967","e84c310b-7125-4cee-952f-a64462fa7fc5","f3f7eef8-9cfd-4861-882b-d933cb643655","aa8daa17-478e-44c8-a06a-ccb5127be3f1","703c56e8-25dc-4262-8e6e-2a3074320430","54825244-d5db-4c05-8e18-b1932fa27d4a","c5d245a7-ef5b-4fa8-a892-e708ecb8ef4c","192acc64-9f88-4184-a7dd-a6fab92c634c","70e7ba10-5a83-4179-af57-fe9ee23cf7fb","4c0f5b4e-6794-4702-b454-59c1173ea14b","961348b5-bba5-48e3-a0ff-e880505222f0","d511b0ef-4d16-4477-8ffc-229a0bf3a9fc","78605602-abef-4932-8e69-9ea18c54efe9","bd6db377-5ddc-4599-99ef-04b78b4ad745","e64d11d0-1e05-43ac-b320-3561ed8edca1","ad21ba0d-d039-4a7f-8cee-179e38f3f491","d67ec772-57f6-46fb-b009-b84888d7ec01","8ad7024d-53b8-499b-9993-5f6a686e3413","9d6dca4c-e84f-43c7-bdc1-5e9c9d5fe018","7d8994dc-3e07-4e2b-abe6-04fcbb5e6a95","b162645b-f9e8-4f97-8eea-f0cb0d14cd3b","1cffda2a-2fb8-4567-a30b-4a0f7ac1aba3","ca102510-b538-47e2-a4c9-63fe57486752","946292c2-d618-40ed-8a4a-0c8386b61503","ff064a8d-db5a-4f5f-bbbe-fa6cdd1355c1","d14be4ae-785c-40b6-b829-d2d66df1f1f0","95dcfc31-8856-4a61-ac98-b8c852ae105b","c2f36b41-b378-4acd-bf65-6f339a737585","a9af03a9-f773-4ca6-a95b-a0455fcc0e1e","7585ff32-378b-45a6-ac08-58e94210fc30","7b602494-c86e-403c-87aa-cc63034d02cb","3eb9b659-907f-41fa-bc9c-29380bead5ac","a6f4f556-e9b8-4e56-bf42-36dc2483e871","51b127cc-fd89-4b7e-a275-21ce2d72e23a","bb8e9acc-8f8f-4157-b233-24c8a963cc4e","aa0ff1f3-20f3-4a56-9605-d2bfffb0be62","90bdff72-0f5e-430d-b830-faa5ba8bd4b3","aa6168c9-9e22-4634-b3d5-e5a0d103da4e","348e1708-eebd-4a26-8787-11121f526849","9371fefc-33ed-4572-a142-6f78042d681f","ce8ca21e-b586-4332-9071-f3328ca4a5a3","4a04a358-45b8-4e3d-8b04-6a605ac3ed64","d822a230-2e56-4086-b239-5d1076eb2a56","e555b4c3-dc11-458b-9098-9dfe4941043f","8723d081-aa81-4053-8048-68d848950dc4","0f2740a4-89d1-4a48-9e67-ad31d0abc598","e9d9cf78-4ebe-4b6f-926b-7fd9757681e0","c598904e-a49e-4cf3-8e02-316ec3296e92","81b0024e-dcde-45d9-80e5-90da17c85633","503ce6dc-0625-4e02-a086-0f9ec65ae3a5","8bca01cb-da61-4625-9a1d-dd9ca4085bd5","3fd2ca14-54c0-4781-9160-b989efc4d021","d87f1b21-4e31-4420-8e5f-d2df1a69e9f0","5500a3c3-9b60-4c88-96e8-77c070958a2c","a918f18f-8e88-41f3-ba79-ba6a9a5de551","f06db837-b001-48e2-b8ef-845da7edb84b","17dd5383-6c61-4a7a-85eb-9eac3cb8c516","28600559-7da8-4eaf-8ace-a37e135ac379","492b5982-eeea-42c0-a854-afd86313774c","aa5cbdc5-3c33-41e8-a3c3-e5e1608f36ee","a8da7be3-86ca-4156-b985-d520018d7281","23eb4c7b-955a-4571-8564-63f70bc7b647","74e35a70-3fbc-4dc0-b07a-ce6816393a91","b1f2f117-380d-4bc1-86f0-12713edea274","726d19f8-685c-4dc4-b727-20ff94b57c81","a8b04978-6880-4279-93aa-ab379921dc0a","c3fbe22e-e813-4b77-bfa6-caee192a0559","8cdd1b84-9ce6-45a6-a06b-957f220495f8","59b34f86-25db-4e50-9730-0efdfb09c861","8c687231-274b-49bd-8837-06851e0fc49a","0f42944f-8a31-4d76-a8ff-b0f3c8eb7ccc","c0ae6fb9-282c-4d32-a9b8-d45e45093b03","45bdf813-f743-4d59-87eb-c9d99b413067","4fab0a23-8d53-46fa-a19c-ef7115ebb4cd","35689e64-4f8c-4597-85e7-ae400f1817a4","368f8f7e-af52-44fb-903f-f0875420012a","dd1fc3ae-d669-4644-9404-a9fc1c64d02e","ec0ba661-e5c3-461c-8ffa-ac95426a581b","b8d83ad5-c4ec-42a2-bcd1-9e8bb7b70c81","cb2cbc86-ef9e-4395-845f-471cedb387fa","073fc377-c500-4fa6-a5f4-c33cc8683aff","c8778e02-2e23-4f5f-9ada-1c7c401d0062","dc11e4a9-c4cb-4d99-b696-fbd574e66442","7d5e3464-91ee-4ba2-8e01-9c79c3821ece","4f2ac2d0-551a-4105-8133-fdfc1daa901a","c09a7a64-1f3c-48a3-984d-6080b7774c8c","f6639ecc-d727-43f0-b44b-f466536e9035","110defd5-3181-40a0-a162-2548ff14ad56","80f9e4fd-a14e-4a51-ad7b-939e41c93b18","4f54559b-3158-4736-934c-06c2c4f00b8f","deb38c45-389a-40f9-9b24-fc8c47ea2a55","fd774030-1f6a-43ee-adf9-4af4febc421d","f880a18e-8ba5-473a-937a-318d5bc99cd2","6dee00d1-ad40-42ec-85e8-6a9aae75a3a8","4c52c8ad-9d6c-4cfa-bbf5-7f533ced93b9","ce7dfd6e-613c-42b6-a1aa-600e1a0b51ce","aba306dd-ad0d-433b-8f6c-74745e0af87a","b832328e-81d1-42e2-b06a-235bfd3a644a","95ddca90-5535-4d58-863b-d122f8884bd8","ed6c0597-fbf1-4a9d-981a-fee62ed5e1c6","0d5652fa-71a5-4f30-ad5b-d3975620b7a7","b3e7508f-f1e2-4bc5-8957-04afa53ea51c","12408e22-8439-4352-bc7f-92d138c4066a","f7783d73-e984-4559-a74f-c80ebbbb2b4c","241d5083-4b62-4b1d-b5d7-67d8e4b2a9c5","bd3e8fec-7e72-4f21-b2a7-470a1789a21e","97ff1581-47f6-4b7f-bea2-c61f8a1447c1","1fab3a3f-4aff-4eb8-b361-7309f644dd7b","719e8de5-af73-4f5d-afb8-a248f84f16b5","5520c38d-3a0d-4034-a442-80107362d60c","a095c24f-6046-49d9-8143-bddf2c1cc643","b526d482-54a1-459c-aaf3-28bbe1022c8b","2e868ab7-1e57-416b-a9d1-b819e0b9f157","eec24578-2923-44ee-9d1d-b539c74d3dd5","6c730118-b04d-4c79-9807-8e00757e00f2","1823d45a-6cdd-4021-a5dd-1629b4ef109e","e2d5d960-46a5-4bfa-8aae-da55441887b6","63dd609b-878e-4020-8aeb-50ae027c492f","fc5090a4-ddc8-4dd4-bb3b-be984b1ef8de","78e0542e-b67c-4587-acf7-185fde4625e9","2ccee27c-58c6-404e-a5ff-02b65cc41e1b","197ee2fa-28fa-4ca9-a392-e20664aca4f6","d3b5b987-b5c1-445e-b3b8-bbe2cad69c06","1e12be4f-1c1e-43ce-83c3-0134a6f12fe0","69be82f5-624f-4b8f-b0c9-804ed8c6330f","72e1d1d8-be3a-4c54-8ee7-2ebc88346dda","280dc9f6-931a-4c25-914d-0fbfacfb3507","1ec724c9-f457-4895-b647-da4b973cffa8","6c5799bc-5de4-4708-af80-6b09f42854b7","82b080f3-6594-4bea-8b76-9a77c6dc6fa3","bb50b3c5-38fd-4498-8532-6859262a8e2f","1923b88c-262b-4ae5-ba42-eb296a050abd","d1c2c372-905a-4c93-aa1b-c2de3c0b846e","8e8ed494-60fa-4a48-8794-920cec44361d","0bb069f9-023c-478b-a685-bf05db40fff7","4a99f5c1-331f-4a79-bc4b-39123477023d","dc8343e1-7b3c-48f4-8dd0-aca49089ddb8","ab2a5c14-59e3-4b10-98cf-8296003f4be7","87bce7a1-806c-48ce-b565-12239fc7a288","a9cf46c1-835d-4b81-a36c-4bb231f58a4f","a2d612a2-2885-45af-b1e7-95fb7ad842fe","a340ed71-f992-41cc-92df-a95b2bcbff75","a551e71f-f250-4240-b62d-e6cc50978dd5","e621f851-877d-4037-9c36-7ee0cbf3be72","49d539a8-63b0-4824-8e98-fed78374c031","ef414714-8e85-44f4-b7e7-7fef50715140","02a8fb9e-22ef-43d1-b6b1-e4de6c9250c9","3d3e3249-14de-4737-beb3-ffeb227282e6","dddd19e4-4584-4363-a08e-edab7bb6baec","6f0ea492-7c02-48f1-94ef-7a52ea5745cf","b342cfb6-dcfc-4790-8c31-bf2c16d446d4","6bd49902-5811-4d19-9fc9-211255368b29","c95d4394-4067-4cfd-994b-0023639bdd31","468a87a2-d280-4265-9a82-b9845fc65f60","47786594-faed-45f5-bc40-1bf27f69610b","98e9906f-c1dd-4f00-91c2-78458d609fd8","d5ebb829-6c14-4d28-8757-a6b027ef7889","e2b77b77-9871-4eb1-8acd-b6af756ed690","10f8fa2e-f70d-4885-b4eb-0258ab5ed4a3","86e86f9f-dd15-41a8-a54f-3ca91df430d7","7b7d9362-8d1f-4c13-b60e-7d5d47bf5a36","383cc7b1-74d7-4177-a92f-c7f51aa625c5","59db5b80-bc79-41f5-b3d0-67b6ab45f43e","045febb3-39a3-43a2-bf2e-351e9af8a398","8af55809-48cc-4354-895f-a720a4ab9bd6","cac19ce9-2aa9-44de-8ffd-c47fc428b59f","a50bc082-3263-49f3-a397-1bfb4c20cc48","9de3cedf-f780-4558-ba09-52fee3307a39","0e9dabef-27ce-4c55-8262-3047b3a4c8ec","9566493b-f4bd-4938-8e13-16275d2120dc","16f99a45-fc78-4733-b89e-3d84dcc69970","167f58c1-9149-4d6c-b0d0-e9f0079e82d0","8adb31c0-f84d-47bd-95e1-baf64c06db93","07681cf6-0c3f-4e35-8675-c1a2e295b1cd","9a5ec4f7-da0d-4505-89d4-56a363ddf71b","ae473d8a-d815-48f5-a0d6-6f76c8493cbe","e87feb94-b54d-47f4-b608-f79a3465043b","535dce96-4ce6-4442-ae5d-83166c87d43f","4436f641-5284-44af-b2dd-69fb8461e3bb","f6b11f8b-f4d9-4e43-b507-78b9f621a59d","8fdd625d-1f0d-4f47-99ea-00d3b6fcfe2a","12428bd3-5f23-4ca9-93af-8634221749ec","dd6b9c40-937d-4512-ada8-46f47fc6801f","df8d7797-a22a-4775-aaf1-314169c36b3b","60a79585-eac5-48ac-be52-5e3f324c99d4","f42d48f1-02c8-4c8b-9514-0cadf5131e4a","54ee5bd4-b99d-472c-9d81-4a4ba9bc0bee","2edc2815-e049-4c32-ab1e-14f69e1a928b","074f0493-812a-4ee0-bc55-b1d222bd771d","e069e75b-8294-4591-9856-06d1158d4b90","3e1d4377-ee40-474f-b2ae-f7d125929f3a","ad2b766f-8757-4cec-9d3b-7b12f2933473","12c85b2b-bc6d-4877-886a-c39bff9b20ea","9a066523-d50d-4e35-9ebc-ae790b648280","d7dcd21a-d603-45e7-b029-e1614454762a","ee685ec6-4428-4fa6-bed9-c7db362db230","9b2a7bbb-5bc3-407e-9970-bfceee3b25ca","ad08542a-7cf2-4617-9cff-3791d8b09b8a","e3200419-9967-4ee2-83ef-13b2b2dbb026","292931df-9732-45fe-8dc7-b26dda06f6fd","23450977-62fc-4490-8266-5a90015a15e3","ce519d68-4632-41e0-8ae0-01c560212264","06d85f4b-141b-4c5e-83b8-2ce48a63e7ac","2f9c23a5-08a9-4d23-8671-6a7bf6c475bc","90cf42b6-8ad8-4559-8c1f-f451084f2c6e","4b0b397a-b9c7-4658-9b0f-9600abb26c9d","a4312840-bc28-448c-a0ec-48e5ced95479","b8ff685d-39c7-4eb1-884e-79f0ea155528","fccd8846-7bad-4fcc-9ac0-85756494463a","bcd0ab2f-914b-45e7-a793-27caa009f096","dc637813-7aed-4203-9b7b-96adaced8f60","02b3c6d0-4908-47ab-9f23-c8574d6df53a","599730ee-b653-423d-bbcb-02403f6ea8e7","84a1bd36-e9e4-4684-836e-1d25eac83be6","6dd349e4-8ba5-46af-a9b1-e9c6bf7c0b04","9d454ec4-00a3-4f95-a853-b7be5652ce15","83c78fdb-dca1-48a4-bcbc-785f94c0947e","45a0b5b5-36b0-4ac3-a578-403afed1d77a","23613dc1-45d0-4f9a-aeb6-5b960592182f","487dd653-7aa1-47f5-b5c2-ab09e0c88e61","3187a938-03b7-4412-9280-4e62fa8fadbe","bea32159-3929-4f95-a3a9-98bc05d56faf","ea9d1bbd-b305-4ae0-b308-315f5907dbc1","3e055591-089e-4122-91d0-5e0d5e2c8441","d4b8696b-390d-4aff-9da4-923ba2c39a8f","f3f0f132-2532-45ee-862e-9c6a0a49b9f5","3410865a-226d-4790-bf28-7378495940f8","c10b7727-b830-4e21-8460-6196a030ce91","4e6873f2-f018-4215-8bd1-82efcea67a1d","8be18135-3eed-4acf-88fd-18586b1b9b0c","3d33dd5f-ba96-4945-a1dd-d4563ebad7ba","b38071d3-1090-42e8-9a33-cc042c9d71cd","77b12e97-5ed1-4043-a7fc-516706519503","769e8ba0-da0c-48b8-9a83-c86a20799cbe","cfd943e4-2808-43b6-b5dd-80d90e257dc9","6a403535-18bf-4900-a751-9dc6f105c9e3","b50ee7bd-4472-4198-b089-26eef76c2a8b","2754e3d5-7e00-4366-acfb-b9026869c605","0fa24875-beb6-4455-878a-920bfa3ec51b","e950750e-3b09-4cf4-84ce-f6bb0e37bbe4","228a4a71-6370-4c36-9c3e-89fe7ed1b169","9cdd69d6-9774-47a6-b204-95ab0b4358d3","278b4efd-6969-4bc7-8feb-2e51c4b3caa0","678387f8-4552-42ca-9913-d2a07de5866d","83194196-9e79-42c4-ad9e-ec9a6c38bf2e","f4ad0067-9be8-49c1-b4fb-83e1a54e1b3e","ee9a6320-e203-4169-baff-f40e05c1f2f5","e401727d-5ca4-45da-b757-d941c473eb6e","d77571fd-2c68-4caa-a9c2-f784cd923734","4ee2071b-9f9e-4bac-8296-62a8256c3a81","92094929-46fa-4fb7-a2d2-5b16662449dd","6bfacd66-7fd1-4ad6-aef3-f57fd004f919","9ac3f476-5305-45fa-9351-a5c8b7451d06","1174d251-550b-42d7-abfb-02cb2026ae33","fa67bf72-70d9-4f26-bf09-796badf586e7","0a87406d-ffb9-4e86-9b30-1aefd971bc05","49cc07f1-d7b4-4892-9641-ca802ff74b88","a422ee3b-ad09-4b38-9274-b1d6db1f2f7a","4d0eb821-54da-4501-84f3-61839593143b","1964353a-5bcf-48ba-8d98-fc2b41701730","2991e50f-548e-4d8a-a043-3e0003f4b3ac","6ee42f6c-478c-450e-b6d8-25b0b1f4b414","d6420870-7966-4542-8ba9-78771cdebc90","8e127104-744e-4f06-aa3e-62c7d05e3433","92e3545f-cc6f-411a-9a06-05de8230cdc1","b51672d4-92ee-41b5-b03d-bfed7db37ba6","563db112-d9f1-42a7-91af-1c87f7590893","f7fe28a7-b60a-461e-8b2f-8a28efb09d8f","b8e1222a-856d-4d6e-aef1-5bd8c8b71823","5ee535f6-126b-4e96-a5da-a21a3434247b","6b400e37-8b92-4984-940e-0e2ceb7af6a2","778d5b0a-f9cc-4788-b4ed-ec26dfc4d004","267be644-0bbc-49d8-ba4a-de090d4ddb44","66e58556-2a4d-426e-b1e3-0b71a9fdbfd7","1cda6eae-7fd7-467e-b579-53257a5c25b2","edd45c2e-2509-4ef9-96ec-30bd5d22299c","805bc839-e152-4271-860c-27a5769b295b","3e8bbf18-8d9c-4c01-aaa2-e58ad0fe8d9a","46943373-e110-4c78-b7c2-27f9536f2a87","62e23d1b-ae3d-4734-9d5e-70221e05d2ad","d48f0813-f8b3-4473-bca7-d6efdbd913c2","0200337d-01c8-4794-8551-6a90b437d96b","6081974f-aa12-46e2-a30a-a57e17445fda","5f609bf9-2630-4678-bfa7-79a92a64ee5b","552eb691-7d2a-47c3-94f7-bfdce58ad1f4","e86851b2-edf8-4649-83c1-ed6607d8b150","01cb5cfb-533d-44d9-99f8-ca83c413fb39","bebb4087-4ac9-45d2-b3c6-5d177d864d04","124fac76-5d07-4087-875e-beafb7ee6dc1","b34f1069-70bc-42ac-b938-98f876e3111e","c72719b2-fe77-455e-b8d1-a59fae8525a5","55075010-02f7-442c-95db-f7c859a3eb7d","dbd2a326-5902-44c5-b7b3-db9cffd3bb7e","20f039f1-c28a-4608-b57e-346e4db3cce6","83c5c6f9-082f-4a84-ac03-7ffbd7877780","e6a78369-1a68-497b-a350-088303b75787","a0c04be0-086d-4c8f-bcf8-0ca1a96744da","0486b6f9-7020-4958-9ce6-74982a19da45","7621b6be-f516-4205-a6c4-e725c1aa450e","02791e46-39f9-4480-bfc8-428c2974f5b4","953087e3-71ed-414d-95cf-74dd8baf140e","a379d517-ca6c-4e4b-a37d-41f61e25d048","5ff2a44b-a52b-4a60-abb8-2da00716a756","6d2ab540-69f4-4316-90bc-87bae8cdee62","6f7e7388-6b21-40b3-994a-59ec934fe819","2cccb117-5c61-4b06-ad2c-614788116809","1bcf4432-a843-46e2-ad53-fe6408c22ac5","837091d1-f31c-4fb4-8eb5-e132adb443df","66efe7e3-eceb-44aa-a408-ae19f0713d4a","51949580-2ca8-48ff-b7bc-bdbc55e65cef","c227b9fb-4556-4067-8a96-1b4149bd0eaa","0638cd63-c9c6-45a9-894e-e9d4f74a4e2e","6f2a4a74-7607-437c-a0dd-353d9d9c0a02","cf90a0a5-8d39-4d62-bf90-d3b8862f894a","d41b5c84-b9b5-4d4a-8b55-beba18bd0a33","571b7b3b-5de0-440a-b712-a32d31b2ef32","2635cada-005d-49b2-bf23-847045b6b65a","0bd5a57d-9ed0-4a02-8159-2c05b1b3ce08","456a881d-5734-4806-8387-3ce5ed862795","674cdc79-1416-43bd-81d3-e1116715e92a","517573f0-03d6-438d-9902-d99d2531e020","8a577fbb-1b92-41ef-9072-1e3cf50cf760","d91d7918-d3cc-4307-83f0-a558e410ef9a","4d798f2d-db10-401b-a21d-b253fa19cb41","90c33236-a84d-418e-b874-9829609901be","5cb43e68-2ad2-405e-a537-895b1767033f","3baa35f4-85fc-4679-95a9-42929d3de7b6","dda6462f-7c5c-4068-b94b-007027d284cd","db02b0d9-5c28-4ee1-a35c-fc8cb67b9ce5","e667e0cc-75a4-4357-8bbc-85ef710c388a","a5213ef7-fe4a-4e52-8b56-f7e875df4984","757b3aea-af26-4c3b-896a-173807f363eb","9a072975-0c5d-46eb-bf88-01fafd870154","0260c80a-0382-48a5-8885-9ae0856c9a80","69be182c-7fe9-46f8-b18f-34e871e42bbb","89af379e-e3e1-43db-9d2d-649fd325208f","c36a8af2-b14e-4321-a73e-36ca1d19abf4","4787d38d-e280-487e-b371-28e32725d6da","443dee2e-2480-443d-80f5-09795fa8c134","c83de70f-3d3a-4461-aa4c-a8cc5c002c86","6b379c10-5885-4e2c-99cb-8b68c3c3f064","68dc1e57-90e4-4365-8858-f73e86752393","692475a2-27a3-4719-9392-e5c4573d2432","a4776243-b821-4a01-a9c6-263683ec8177","2e7d74cb-eb59-47bd-be95-5ef91ef7ff1c","b2f4a98b-6ac6-4cc9-ab61-fb919c0063cb","5f7adefe-07ef-49bc-a03c-d9ab075070d8","62e315d3-25c7-4989-8c77-6de882c6138a","14c74344-f4b7-493e-8b26-322fed5f49c3","ad813f54-0f38-4ecc-a770-d9b652b5521c","019460d1-4672-4b97-8692-375a698bc7e8","e1814b67-c6d5-4e59-ab54-57d03aeef810","8af57e10-4596-4f7b-9af4-140c86c7ab91","18e82982-032f-42cc-b622-c7e245964de1","2b05c8b0-0d48-4697-b76a-8de3281c2533","77eeb783-f324-4a44-b5df-997fe94df7fd","1221cf5a-d36d-42b4-8f5a-97b988806a07","c5ca953f-139b-4cc1-b7be-f4804b042ac9","c635da4e-a608-4611-8c9a-261a7eb0fd98","265e71be-2212-41e6-bbdf-d16d17d428b0","0a9cbd49-4313-4900-9cdb-5b6d7dd0c6ff","41a8a02e-95cf-445e-b4da-73e35da3fd60","b4f660bd-0ccb-4474-8154-e43d097ac7ca","74334598-e8e9-4fda-8703-61f8a29f7c55","e9664cb8-40b9-4a8d-a96e-42e7585cdf0f","423fc3ad-c3a8-4697-ba3c-740ecd9adf7e","72ef2905-499d-4569-bb03-d06969932b77","a44bbfaf-77e9-4c7c-9583-0923ac5f4d64","5da40f2d-9611-45ea-96d3-997e76db1b0a","e106b898-71f4-4a07-8275-925a7978dcb4","7b41c1cc-e84d-4ecc-9668-df7846b5b4ea","009f715e-09e5-4c90-9fe6-21def69bfc3c","7e374ea4-60a3-4653-8693-8d30d7e857be","d894579b-d1f3-4341-96e2-e218f07a2485","d69329d4-4b83-4455-9e1d-5dd1a1a6b875","92226139-2a77-402b-b165-4ee59462c785","7f06be00-5d05-4631-8533-d0ab78fc850f","e345708c-2707-4110-b789-64eed6d6b77f","6e63816b-819c-4158-b577-48428ee082e9","6626cd8e-dd62-4b58-bbe4-6fe5efc242b6","098a328c-3c2f-4478-bc24-186ccad9ce63","46d77da3-60c7-4b34-bb93-c501f7386c9f","dac1a225-1d21-4e33-9da2-c83c0a3b6ec3","3aa6c682-e91e-4617-8301-3cd4644909d2","1ec497f8-3052-41c8-808c-e93b4c0c8949","cbb70618-1987-463f-8ec2-3139268eba29","12b62bb4-b400-48c1-8c40-e12d109e0740","56c5f323-581d-4c9e-ae19-b4cae41f364a","57cb45ab-a9fd-4b8f-8c04-5b0311ab4e5f","43aea89b-5f07-4025-82e2-b38d147a118d","6839d370-5308-4760-b3d6-69f33845731c","d42345fb-1494-430d-b7e0-cbdd5bc1a9f2","af92c92e-3c15-4cfc-b73b-44e750fcd853","6b54f869-4896-4f2e-b3a1-391e2fa66802","367ca185-76bd-46e6-8a3a-062f4140bf7a","6dc3e7f9-0ac8-4aa8-8d04-a34c537efcbf","27fa312b-d11b-4e06-bc1a-9c96f9b52095","b56b959c-a2c4-42f0-a6ea-5125ed2016e1","ae82fe88-f5dd-408a-95be-0c283bac8c88","3c715150-4096-4077-af5e-0fd1f9ee20e9","ca9f4e87-00cd-4e9e-8c13-9168bfc85449","6f06cc47-d9a2-4e15-a3c8-7d6187ece0a1","50bd3193-d956-47a2-8fc2-d94c9e2345ec","f58c95ba-2eb3-4b6a-b4c3-302f7f98879b","f3ae5ed7-eb10-41fa-b27d-4885dfe2b274","78c997f0-ef9a-4b28-aef4-e8f2dde64a3b","dbfec2f7-a456-4499-994c-93a377b513cd","0d7ce6a1-9047-4a28-b1c3-28ffcd92887b","18ca676a-733c-4cac-9a61-01ae10f45910","d67093d2-9aa8-4667-8443-8f235e51b9ae","fb376479-d935-476c-abbf-24f53a6f2def","b48003a2-8b79-4aa1-b21a-75d7b6dc2d0a","c5d7d00e-adaf-47d6-904d-7b16d5f1a645","4407c99f-5fa9-4487-ad02-76646f6aecdd","7faafe11-6e62-4af2-b059-4026fbf9cc4d","479b614d-4ae6-44d5-b91a-aa10c8aaacc2","ccf8faf0-614b-4ac9-b45d-c55d560f1c46","bcc9933a-8cf2-4e5f-b772-8e7dc21a09d7","f47ab302-b67a-472c-82e2-bbfe5c186889","a2189fa1-15b1-4cf4-ab61-273ce1522891","b4bd4ccd-44cf-4be7-abd1-25bece2c83e4","e61a970a-15de-4834-a41d-d500120c8170","c2eba193-dfc3-49b5-9771-c6032d9b4466","ee92a8aa-8b0d-4d98-9f62-85c784c43a85","03d6b8cc-664a-44ed-b303-00f690f1f365","aff6c639-4f68-4ce0-a132-d7d80a0c9d3c","fdc88dc8-b0f1-4a84-9713-0a1e2102f5d0","7dbc4584-8465-482b-b773-6a2cee23b27c","dd35d7a4-7fbf-4746-a099-aa0feac76b47","17ec543c-34ab-45d7-ac06-907b805f9dd7","4a8626f4-7438-491b-bf95-f9325c91e4fd","4c51b4e4-7d26-40ed-af92-2b95467ea20a","78a26c29-d33e-4a92-b9fa-7801166d25ce","3ab679ed-3cfd-4cf8-b149-4f9a9a9bc3d6","1f96bd47-d83a-4bb9-b67b-75fe28b6eb3e","b159c99e-144a-43d7-9c27-b7c8cfb94513","5e5f5a7b-13f2-4c40-bd1a-d5442b3ed838","db880760-fe2e-4298-bfaf-597de37f5936","e21c6acb-1095-456b-841f-5b5d7e638732","b7468967-7086-4cb2-825d-243a3c1e1ed8","b8584dc5-6579-437e-8eca-f23062ed3df3","a2be8ac6-29af-47ea-a5f6-dc7fadc9618a","fbbd38d2-e790-4ca8-ad2e-0105fc300178","7fc7ced0-012a-4e47-918c-4fa61be82ea9","2b14a238-1072-4063-816c-53ed3c81f415","f5361347-c363-49b0-97dc-cd8a784099f0","79d09212-9ab2-4e58-9144-801caf00d8ea","8a6deb8b-3cf4-471d-92a3-9801b5c43c72","e30b50a6-34f1-4f16-ac77-577489c07090","f3430a80-cf61-4583-a876-451b91fb1ff2","03344c4f-7a7f-44c5-94e5-8cb4f5acd3dc","3e1a5947-7c96-4d98-9071-20dfd64b9c5d","adef738c-e4a8-4085-bff9-a50575c6e656","8511959b-c3c9-4ebe-9d04-0c3c53b91fcc","1e25484b-b953-47f1-bc74-b3684936dc74","a050c193-55d2-4306-9697-44baaf3eb66f","376397d8-61e3-4b28-b424-090b30c52e9b","aadf0299-e956-4358-9152-afce8fabf6ef","9b571eaa-a270-414c-9d81-9b7402e0f4cc","7c3f1759-12d9-4bde-8028-595e8ff903bc","24c81443-aba2-4622-b600-42d6daeda979","8a408978-727f-4576-b394-34f0ef5ac95c","c19c7d2a-c544-47c9-9b4f-598ece8093c9","8a416044-6681-42ec-9a0e-6a2b55028552","1f28e4c7-9dbf-4c73-9b5d-3d41d813c8d5","dc2c602c-8a4d-4548-b7d6-fb459fb72904","646a670c-187e-411f-a787-6a1b0ec52727","3ffd702f-6314-4f29-b6b1-16a9e0db8355","f33908b3-8f52-4c5b-8a65-495a261e8f76","a7aacc95-031d-4361-9e7c-567b8b6e60ed","3ae2238d-d4da-467a-9628-1f956cabb26b","ec3bced9-355c-467f-af7a-62136d54cd6c","1057b8e9-110a-4c6e-943e-eedd39f75210","3e80cd49-4061-403b-94df-5daf78e85204","88faef21-af77-44d9-9647-5e4faf77e714","edb6d6ab-5a66-4726-9def-680b104b9919","d458df01-d6ce-4483-b3bd-36631b9f80a3","0898e188-7fe3-46d6-aa08-089f9fa90a26","4852fa76-1e91-454e-9088-6f1248e6244f","4e15d3a8-046b-425e-af31-1053357ee369","993fff0c-8697-4891-b245-860de2c4c232","515749d7-22ab-420f-a754-f6750469a7f3","54da6558-4b20-4eba-8c88-caa46d0b1139","b974dcea-8943-4ccc-aef3-b537f81dea2b","899647b3-8dab-42ea-a9b9-97ec847b509a","89dbf767-10a9-4e09-bb4d-98cb025b1056","e889942b-e5ed-44d8-8a42-166620b8d3f8","a7dea10d-1ace-40fb-8850-38eae48b6586","f011212e-c57f-480f-b5e8-0340cf75c55e","7feb89cf-d9b0-4f90-a83d-1a88c2d4aef2","e928d468-43db-478c-bdc5-46fdb6df6c94","ff79fdee-626e-494f-85ba-baeb06f03e2c","a6070bf9-930e-4247-a2f9-7f3a7f101d91","45868390-cc5b-4b25-895e-2112ecedd9fa","df4093f4-574e-4a51-aca0-6407f13cd0b0","64a3733a-807c-43d5-917d-75a08d3c2d65","2a2964d3-e8d8-4de8-bd27-8cf718a45697","f5f2a325-0fb2-4c39-8165-5dfefd3a8fef","0a8a3741-a950-4e3b-9cfd-72c894ab3e1f","027a971c-f54d-4c7e-8c29-9f147887563d","e9ca6d2b-95f7-4912-b4d2-eec6ad546f9a","da90d109-7fda-4bd0-8e6b-5a4064a1f500","65bec6f4-a9f9-4c33-9f76-615889eba960","8f8cbe01-1555-4825-9a44-3c267d6cd08d","5a517454-0423-4108-87de-6ca07bf4b51a","e0af36bb-d6d1-464e-bc0d-83c18af02fcc","d7a45ab2-7a52-40f3-a8b3-130a385f1ab6","4df757ac-bb84-4887-818a-fbe3b4a4d749","65d47116-bb33-4b6c-bbc2-23f85fa8fdbd","ba1d0dc2-b413-47d4-97db-d3fb3e49dc47","cfb4395e-35a1-4e24-b21d-0dc5c6022e22","3e2122f1-28e3-4c9d-86de-6dd74d7ef583","8996cc9d-4267-44f4-b1a4-727ce931d57a","d2e59c97-c972-4033-9bf7-401487916a62","57827e55-b5b0-4b6f-8582-b5df83dd2f83","50afa39e-1cd9-4976-b940-9b8f92da84af","1ae1fbba-4339-4957-a597-09c298ee55b8","27f80ac8-768d-489a-95aa-df7504a3b4c7","632da024-c4db-4fc5-bf2b-ffd17b68e634","15cc8348-97d3-4891-8865-dffd389f3313","a9d9797d-40de-4a6f-ac78-f3b1e8b52099","d64115cb-a413-46cc-b7bf-f68e8a8d3066","97b090f0-b1d6-4db5-a4c8-24be0492c515","535eeaa2-7a29-4852-a8da-a9672120d472","be227e3b-7fbf-4a76-a49e-0a151b1bb14f","bee35c7a-0df3-4d62-9a29-87be4d7eb0fc","1c8e5ac3-ce34-423f-ae20-d0b97572baac","849b0af6-2818-47d5-a3d3-2f7863d722be","8ff30c7b-d409-4253-a1d5-8693cea42dfa","d9bc4b1e-0a80-4435-aa0d-9b9b7b6e1e49","55692f5a-b619-4d81-b4bc-4913c438c97c","0c69c40c-3bfa-4a6f-8b7e-bc6f584aae3f","a1c09254-0f4c-47fe-8933-8eceef58ad3c","02bfba29-e829-4c88-a479-23e826bff511","f21f422b-99b6-4280-a4ba-458973e0efc0","55fcf854-c749-40d3-8996-6ce79f601e71","8ef74758-96c2-427d-b52e-3dacfb2c599c","7cb435b4-347f-458b-983e-5a8d3932be25","79fedfee-769e-42fb-9f26-4ffa7d7b4541","b4ed85c9-2868-45f7-9494-aee903d56bf2","52b8d6fd-b6f7-410c-ad1b-bcf0df962e31","ea4f905a-5e12-44fe-9e2f-58a5c3863fb8","c3a10bb8-675b-432a-b81b-fef363ee7c35","8fed3cb9-3e3e-4aec-9376-31d9ded9a1df","5ae3558b-2e4f-430f-8b5d-fbaa9e55fa35","a16c8784-fa41-4507-be0e-977fcd8df72f","3e28bb78-e0b7-4e14-8c8c-dc52e7b6a661","7df2e848-0313-4dd7-8267-e24dd5777390","d0eb4b18-4962-4fea-a783-1cef170f2654","0e19f99e-ba46-4793-970d-c689fa4ba59f","49b62135-aea0-4cd4-873d-8357282f6222","d46853bc-4ae3-4a06-8ea5-b08905fc3526","db6ba821-e93c-4d14-9faa-cdb9b28c031d","a50b6f1f-86d3-44b7-910c-e6c65470306b","f02804ea-4b57-4982-b8f1-b432ca390e09","58ad56fd-146a-466f-88fd-ecf364bf9596","2a00be85-2121-4695-b2f5-80833455234b","0368ec26-6d18-460a-b4b2-d15be1f2f0a6","0fe1190e-fc69-42f3-83b1-ea517c3e5ae0","65f1ad33-ef9c-4e41-a96d-28b08aa30fe3","50b07a54-de58-4292-85e0-17d5d6790d8b","397dbb58-d7ca-4430-b41e-a6f25b4755bb","4b7d4b4c-611c-4f26-9892-8b0af589080b","46f590cc-2e18-4ee2-b976-51090804b8cc","8463af65-cd46-49cc-a658-732a2a9322d8","d2900b16-4cfb-45a3-9684-e1cdc67d538e","fba3252f-aa36-41db-b4a3-f32f75e50a56","dee1657f-ae72-4af1-b6d2-2f9cd781069c","5ae00bb0-8483-4d4f-aa66-ad7c7c2b9d4a","30940a88-c48c-4865-a0de-7be6ffebdfc9","48013615-9a0d-41cd-8122-06dfb9ee0dc6","9ea64fb0-da63-450b-8d04-fb086a918527","b3876de4-9b98-4f85-9f5e-1767adf9bc90","8cb5d43b-6bf9-4ed3-a071-90ec3fc215a0","0e632658-4191-41ef-b892-5370e97860e4","9526d184-d35e-49e7-b3b4-620709e5c7c2","dd88b2ee-7983-4cb1-b25d-38bbb9af3bd5","c80ef8ef-df8a-4268-9709-a78332b135a6","3d10ff2c-c9cb-4fa4-9c0f-c6ed71079cd2","e7e46f3a-9e73-4881-a650-6c8002c7a5e1","4fbaea48-a8c7-4a3d-94ea-3320cff791c0","0fb851f1-7741-40f1-9833-04fcba5a4126","b31fe5cb-5d1c-4557-8e8c-66a28283f189","f726d95a-9ab7-4e97-8ac3-cf992dfa9897","a3e5b010-b64e-4d27-9c45-f451379e2a87","e3dde67b-b04e-460f-b7c7-a4874efb61f6","70ec2ced-f391-4e79-880e-078dc07913ab","d4c94099-5dc7-420e-b0f3-3a113430ec8b","6449c3eb-a30b-4be6-9da7-619ba0730371","f0fddf7a-4f66-4955-beb0-ff425ad9a44e","84a8ca32-16f6-4238-aa8d-1355cee7c571","221ac500-ba47-4ec4-b2d1-733a347544de","3372f9e2-4ff0-48a9-96ab-18dfe7e86667","81a9eb93-5480-431e-8098-a19139f1c260","321fe103-ec59-4da8-afab-e0078217aae6","cf8f2dff-aca1-4893-af79-57958f2893f6","541aa14f-da47-4573-b5ca-1b4d62612d4f","94bdd127-b5f6-4790-9915-594b59d4c4b0","cb4ade08-9846-49a6-9bd7-8c5dc8d58b44","0511c34d-a1ab-40a9-ae78-7791ff40da97","b79ed233-0d74-42c5-a477-5ab01714021c","7c2b630a-96d3-4987-ac78-72ed1b48608b","48a01e5d-6688-4505-8e4f-a14607a347c3","c4825732-b58c-49b5-9cf0-892cc78aa02e","abb3b380-426b-422e-bb37-e11191658f04","0bb21e6f-dcd1-4c7e-8f0f-b503b4429d34","0e076a58-5a64-4c39-8add-a8bd0a60f791","fb32c2c7-66cc-48e5-82ed-182613273add","cc420780-176b-4806-baa4-e9737020d4ca","4c1d566e-dc1a-4913-8db3-610631d40ff0","c958c873-f720-4a47-bc43-57f4975185b3","bcd4614c-8ffc-46a9-9ea9-3588c3073135","fa41598c-edb8-4f1e-82bf-98f2df8183b7","87077647-f0b1-4d3f-9c8d-3fb5e9e34bd1","68287389-5125-40ae-8854-4a4dac10bcd0","a9fb22b8-d945-4e37-b336-c9b1a3b5de50","ccb1731a-f804-4e63-854e-b720f6070e75","3df4b4c6-d046-4599-a240-906e386d40ac","ec8fdacc-cecc-4dbf-9a84-c0e1e6991009","525efcb6-39ca-42fb-993e-1576e3b2095b","53a7ea61-af09-47af-bf93-d2c7586b17ef","c92998f1-dda8-4e88-8c98-1580dde0c4b5","e607bd2d-1361-4405-a64d-f9d5864765a8","52db5a18-3f2b-4b75-9e45-429ed6aaf957","f3e08f7d-cbef-4a98-aa7b-3a3f88638000","608caa50-0a4c-434e-b49f-6f9ae9437181","764c994e-7390-47f8-8352-2af386c686b7","2f547e7e-f857-4715-a9f7-affab4ad8c59","95fa0703-66fb-4ee7-9155-205e585ca186","9f2a86d1-6e07-4edc-87ae-03cb566a8377","512b14d5-b5f8-4360-8a33-7f0e817dfa47","26b3d405-7d22-45e6-b698-365e758ab0f0","d21de773-f520-408d-bb45-d49f71e2f8b3","c79f05ce-c6dd-4883-b5d9-759a551decd6","50d008e8-ea65-4141-a511-efdf30a50f35","f6d05517-c120-40a3-a5b2-2a08d9069611","1418ee2a-4e65-43fd-abc6-58e59fe5ccc9","73349386-3be2-4dd7-aa3a-d7090eb117b9","cb2223f0-11cc-4330-80e2-82dd1c9b216c","db2311f2-2002-4701-a660-d4ee29310bd9","14867299-1ea1-4912-8cc0-6e9cf3696690","63be3c8b-4f73-422a-9f28-4677e1acf780","ae9708ae-4db9-40e0-8a18-87ebecb3641c","e0b6e079-1553-4c24-9199-532e49cff5be","b8e6c1a8-e091-49a5-8852-bccbf4f014f1","71581546-ee44-4133-afb3-5e4a508d0b15","747a2b4d-77d0-4c95-a279-e3d39613e22e","1cbbfd44-4368-426f-b9b5-5891a9637128","8b74a337-7033-47e9-ab00-8c368896ddac","93533fd1-1118-41fd-b204-7cea9e64790b","914adf0a-9494-423d-b98e-e0cad9c1825b","4f884d4a-a7e3-40c3-82f9-86fa4de415ab","f6218cb7-36ff-4efb-89d7-ab273204d5ca","51fa8149-43a6-4d63-b0c9-1a05b2387dc5","d2fa5fdc-53f8-4585-afbb-3b1f0fe44605","ohana-pd-stpeter-it-is-well","ohana-pd-stpeter-great-is-thy-faithfulness","ohana-pd-stpeter-what-a-friend","ohana-pd-stpeter-jesus-loves-me","ohana-pd-stpeter-little-lamb","ohana-pd-stpeter-holy-holy-holy","ohana-pd-stpeter-rock-of-ages","ohana-ccby-hmg-without-you","ohana-ccby-hmg-the-almighty","ohana-pd-stpeter-mighty-fortress","ohana-pd-stpeter-abide-with-me","ohana-pd-stpeter-beautiful-savior","ohana-pd-stpeter-now-thank-we","ohana-pd-stpeter-praise-god","ohana-pd-stpeter-praise-to-the-lord","ohana-pd-stpeter-lords-my-shepherd","ohana-pd-stpeter-all-hail-power","ohana-pd-stpeter-eternal-father","ohana-pd-stpeter-o-god-our-help","ohana-pd-stpeter-church-one-foundation","ohana-ccby-incompetech-monkeys-spinning-monkeys","ohana-ccby-incompetech-carefree","ohana-ccby-hmg-there-was-a-time","ohana-ccby-hmg-you-showed-me-love","ohana-ccby-hmg-real-freedom","ohana-ccby-hmg-let-not-your-heart-be-troubled","ohana-ccby-hmg-chosen-generation","ohana-ccby-hmg-its-been-awhile","ohana-ccby-hmg-sowing-seeds","ohana-ccby-hmg-abundant-life","ohana-ccby-hmg-you-love-me","ohana-ccby-hmg-watch-today"]);
/* Private staged library API. Shared metadata only; never playback state. */
async function ensureOhanaMusicSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS music_tracks(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,title TEXT NOT NULL,artist TEXT NOT NULL,stream_url TEXT NOT NULL,category TEXT NOT NULL,visibility TEXT NOT NULL DEFAULT 'private',recipients TEXT NOT NULL DEFAULT '[]',revision INTEGER NOT NULL DEFAULT 1,request_id TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,UNIQUE(room_id,member_id,request_id))`),
    db.prepare('CREATE INDEX IF NOT EXISTS music_tracks_room ON music_tracks(room_id,deleted_at)'),
    db.prepare(`CREATE TABLE IF NOT EXISTS music_playlists(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,name TEXT NOT NULL,visibility TEXT NOT NULL DEFAULT 'private',recipients TEXT NOT NULL DEFAULT '[]',revision INTEGER NOT NULL DEFAULT 1,request_id TEXT NOT NULL,mutation_token TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,deleted_at INTEGER,UNIQUE(room_id,member_id,request_id))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS music_playlist_items(playlist_id TEXT NOT NULL,track_id TEXT NOT NULL,position INTEGER NOT NULL,PRIMARY KEY(playlist_id,track_id))`)
  ]);
}
function ohanaMusicFault(status, message) { throw Object.assign(new Error(message), { musicStatus: status }); }
function ohanaMusicText(value, label, limit) {
  const text = String(value ?? '').trim();
  if (!text || text.length > limit || /[\u0000-\u001f\u007f]/.test(text)) ohanaMusicFault(400, 'Use a '+label+' from 1 to '+limit+' characters.');
  return text;
}
// Resolve only public, allowlisted Mureka sharing pages. No caller credentials leave Ohana.
function ohanaMurekaPage(value){
 if(typeof value!=='string'||value.length>2048)ohanaMusicFault(400,'Use a supported song link.');
 const raw=value.trim(),match=raw.match(/^https:\/\/(?:www\.)?mureka\.ai\/song-detail\/([A-Za-z0-9_-]{8,80})(?:\?[^#]*)?$/i);
 if(!match)return null;const url=new URL(raw);
 if(url.username||url.password||url.port||url.hash||!['www.mureka.ai','mureka.ai'].includes(url.hostname))return null;
 return{url:'https://www.mureka.ai/song-detail/'+match[1],id:match[1]};
}
function ohanaMurekaAudio(value){
 if(typeof value!=='string'||value.length>2048)return null;
 const raw=value.trim(),absolute=raw.startsWith('cos-prod/song/audio/')?'https://static-cos.mureka.ai/'+raw:raw;
 if(!/^https:\/\/static-cos\.mureka\.ai\/cos-prod\/song\/audio\/\d{8}\/music_[A-Za-z0-9_-]+\.mp3$/.test(absolute))return null;
 const url=new URL(absolute);return url.hostname==='static-cos.mureka.ai'&&!url.username&&!url.password&&!url.port&&!url.hash&&!url.search?url.href:null;
}
function ohanaParseMurekaPage(html,page){
 if(typeof html!=='string'||html.length>2*1024*1024)ohanaMusicFault(502,'The Mureka sharing page is too large. Upload your song file instead.');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1].trim()).filter(script=>/^window\.__INITIAL_STATE__\s*=/.test(script));
 if(scripts.length!==1)ohanaMusicFault(502,'This Mureka sharing page could not be read. Upload your song file instead.');
 let state;try{state=JSON.parse(scripts[0].replace(/^window\.__INITIAL_STATE__\s*=\s*/,'').replace(/;\s*$/,''));}catch{ohanaMusicFault(502,'This Mureka sharing page could not be read. Upload your song file instead.');}
 const detail=state?.storeDetailStoreData,info=detail?.info,routeKey=detail?.curDetailIdOrKey?.share_key;
 if(!info||typeof info!=='object'||Array.isArray(info)||(routeKey!=null&&routeKey!==page.id)||![info.share_key,info.original_share_key].includes(page.id))ohanaMusicFault(502,'Mureka returned a different song. Your shared song was not added.');
 const stream=ohanaMurekaAudio(info.mp3_url),title=typeof info.title==='string'?info.title.trim():'',artist=typeof info.user?.stage_name==='string'?info.user.stage_name.trim():'';
 if(!stream||!title||title.length>160||artist.length>120||/[\u0000-\u001f\u007f]/.test(title+artist))ohanaMusicFault(502,'This Mureka song does not have supported song details. Upload your song file instead.');
 return{title,artist,stream,source_url:page.url,provider:'mureka'};
}
async function ohanaResolveMusicLink(value,fetcher=fetch){
 const page=ohanaMurekaPage(value);
 if(!page){const stream=ohanaMusicStream(value);return{stream,provider:ohanaMurekaAudio(stream)?'mureka':'suno'};}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000),limit=2*1024*1024;
 try{
  let target=page.url,response;const visited=new Set();
  for(let redirects=0;redirects<=2;redirects++){
   if(visited.has(target))ohanaMusicFault(502,'This Mureka sharing link could not be opened.');visited.add(target);
   response=await fetcher(target,{method:'GET',redirect:'manual',credentials:'omit',headers:{Accept:'text/html'},signal:controller.signal});
   if([301,302,303,307,308].includes(response.status)){
    const location=response.headers.get('location');let next;try{next=ohanaMurekaPage(new URL(location,target).href);}catch{}
    if(!location||!next||next.id!==page.id||redirects===2)ohanaMusicFault(502,'This Mureka sharing link redirected to an unsupported page.');
    target=next.url;continue;
   }
   break;
  }
  if(!response?.ok||!/^text\/html\b/i.test(response.headers.get('content-type')||''))ohanaMusicFault(502,'Mureka could not open this shared song. Upload your song file instead.');
  const length=Number(response.headers.get('content-length'));if(Number.isFinite(length)&&length>limit)ohanaMusicFault(502,'The Mureka sharing page is too large.');
  if(!response.body)ohanaMusicFault(502,'The Mureka sharing page is unavailable.');
  const reader=response.body.getReader(),decoder=new TextDecoder();let bytes=0,html='';
  try{for(;;){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>limit){controller.abort();await reader.cancel().catch(()=>{});ohanaMusicFault(502,'The Mureka sharing page is too large.');}html+=decoder.decode(chunk.value,{stream:true});}html+=decoder.decode();}finally{reader.releaseLock();}
  return ohanaParseMurekaPage(html,page);
 }catch(error){if(error?.musicStatus)throw error;ohanaMusicFault(502,'Mureka could not open this shared song. Please try again, or upload your song file.');}
 finally{clearTimeout(timer);}
}

function ohanaMusicStream(value) {
  const raw = String(value ?? ''); let u;
  try { u = new URL(raw); } catch { ohanaMusicFault(400, 'Use a direct Suno media link.'); }
  const mureka=ohanaMurekaAudio(raw);if(mureka)return mureka;
  if (raw.length > 2048 || u.protocol !== 'https:' || u.hostname !== 'cdn1.suno.ai' || u.port || u.username || u.password || u.hash || !/\.(mp3|mp4|m4a|ogg|wav)$/i.test(u.pathname)) ohanaMusicFault(400, 'Use a direct Suno media link or a Mureka song sharing link.');
  return u.href;
}
function ohanaMusicRequestId(body) {
  const id = String(body.request_id ?? '');
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(id)) ohanaMusicFault(400, 'This save needs a new request identifier.');
  return id;
}
function ohanaMusicRevision(body) {
  if (!Number.isSafeInteger(body.revision) || body.revision < 1) ohanaMusicFault(400, 'Reload this item before saving.');
  return body.revision;
}
async function ohanaMusicOwn(db, table, id, room, member) {
  const row = await db.prepare('SELECT * FROM '+table+' WHERE id=? AND room_id=?').bind(id, room).first();
  if (!row) ohanaMusicFault(404, 'This music item is unavailable.');
  if (row.member_id !== member) ohanaMusicFault(403, 'You can change only music you added.');
  return row;
}

function ohanaMusicRecipients(row){try{const x=JSON.parse(row.recipients||'[]');return Array.isArray(x)?x:[];}catch{return[];}}
function ohanaMusicReadable(row,member){return row.member_id===member||row.visibility==='room'||row.visibility==='selected'&&ohanaMusicRecipients(row).includes(member);}
async function ohanaMusicAudience(db,room,member,body,row){const visibility=body.visibility??row?.visibility??'private';if(!['private','room','selected'].includes(visibility))ohanaMusicFault(400,'Choose Only me, Everyone in my Ohana, or Selected people.');let recipients=body.recipient_ids??(row?ohanaMusicRecipients(row):[]);if(!Array.isArray(recipients)||recipients.length>500||recipients.some(x=>!Number.isSafeInteger(x)||x<1))ohanaMusicFault(400,'Choose people from this Ohana.');recipients=[...new Set(recipients)].filter(x=>x!==member);if(visibility==='selected'){if(!recipients.length)ohanaMusicFault(400,'Choose at least one person.');const members=new Set((await db.prepare('SELECT member_id FROM room_members WHERE room_id=?').bind(room).all()).results.map(x=>x.member_id));if(recipients.some(x=>!members.has(x)))ohanaMusicFault(400,'Choose people who belong to this Ohana.');}else recipients=[];return{visibility,recipients:JSON.stringify(recipients)};}
function ohanaMusicPlaylist(row,member,items,allowed){return{id:row.id,name:row.name,member_id:row.member_id,revision:row.revision,deleted_at:row.deleted_at,visibility:row.visibility||'private',...(row.member_id===member?{recipient_ids:ohanaMusicRecipients(row)}:{}),track_ids:items.filter(i=>i.playlist_id===row.id&&(OHANA_MUSIC_BUILTIN_IDS.has(i.track_id)||allowed.has(i.track_id))).map(i=>i.track_id)};}

async function ohanaMusicTrackIds(db, room, member, input) {
  if (!Array.isArray(input) || input.length > 2000 || input.some(x => typeof x !== 'string' || x.length > 80)) ohanaMusicFault(400, 'Choose up to 2,000 songs.');
  const ids = [...new Set(input)];
  const custom = (await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND deleted_at IS NULL').bind(room).all()).results;
  const allowed = new Set(custom.filter(x=>ohanaMusicReadable(x,member)).map(x => x.id));
  for (const id of ids) if (!OHANA_MUSIC_BUILTIN_IDS.has(id) && !allowed.has(id)) ohanaMusicFault(400, 'One of these songs is unavailable in this room.');
  return ids;
}
function ohanaMusicTrack(row,member=row.member_id) {
  return { id: row.id, title: row.title, artist: row.artist, stream: row.stream_url, sources: [row.category === 'sunday' ? 'Sunday Best' : 'Family Radio'], member_id: row.member_id, revision: row.revision, deleted_at: row.deleted_at, visibility:row.visibility||'private', ...(row.member_id===member?{recipient_ids:ohanaMusicRecipients(row)}:{}) };
}
async function ohanaMusicApi(req, db, me, room, body, url) {
  const reply = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
  try {
    if (!me) return reply({error:'Please sign in.'},401);
    if (!Number.isSafeInteger(room) || !await db.prepare('SELECT 1 FROM room_members WHERE room_id=? AND member_id=?').bind(room, me.id).first()) return reply({error:'You do not belong to this room.'},403);
    await ensureOhanaMusicSchema(db);
    const p = url.pathname, stamp = Date.now(); body = body || {};
    if(p==='/api/music/resolve-link'&&req.method==='POST')return reply(await ohanaResolveMusicLink(body.url??body.stream));
    if (['/api/music/library','/api/music/mine'].includes(p) && req.method === 'GET') {
      const mine=p==='/api/music/mine',all=(await db.prepare('SELECT * FROM music_tracks WHERE room_id=? ORDER BY created_at,id').bind(room).all()).results;
      const tracks=all.filter(x=>mine?x.member_id===me.id:!x.deleted_at&&ohanaMusicReadable(x,me.id)).map(x=>ohanaMusicTrack(x,me.id));
      const allowed=new Set(all.filter(x=>!x.deleted_at&&ohanaMusicReadable(x,me.id)).map(x=>x.id));
      const lists=(await db.prepare('SELECT * FROM music_playlists WHERE room_id=? ORDER BY created_at,id').bind(room).all()).results.filter(x=>mine?x.member_id===me.id:!x.deleted_at&&ohanaMusicReadable(x,me.id));
      const items=(await db.prepare('SELECT i.playlist_id,i.track_id FROM music_playlist_items i JOIN music_playlists p ON p.id=i.playlist_id WHERE p.room_id=? ORDER BY i.position').bind(room).all()).results;
      return reply({tracks,playlists:lists.map(x=>ohanaMusicPlaylist(x,me.id,items,allowed)),can_add:true});
    }
    const read=p.match(/^\/api\/music\/(tracks|playlists)\/([A-Za-z0-9_-]+)$/);
    if(read&&req.method==='GET'){const table=read[1]==='tracks'?'music_tracks':'music_playlists',row=await db.prepare('SELECT * FROM '+table+' WHERE id=? AND room_id=?').bind(read[2],room).first();if(!row||row.deleted_at&&row.member_id!==me.id||!ohanaMusicReadable(row,me.id))return reply({error:'This music item is unavailable.'},404);if(read[1]==='tracks')return reply({track:ohanaMusicTrack(row,me.id)});const tracks=(await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND deleted_at IS NULL').bind(room).all()).results,allowed=new Set(tracks.filter(x=>ohanaMusicReadable(x,me.id)).map(x=>x.id)),items=(await db.prepare('SELECT playlist_id,track_id FROM music_playlist_items WHERE playlist_id=? ORDER BY position').bind(row.id).all()).results;return reply({playlist:ohanaMusicPlaylist(row,me.id,items,allowed)});}
    const route = p.match(/^\/api\/music\/(tracks|playlists)(?:\/([A-Za-z0-9_-]+)(?:\/(delete|restore))?)?$/);
    if (!route || req.method !== 'POST') return reply({error:'Method not supported.'},405);
    const kind=route[1], id=route[2], action=route[3], table=kind==='tracks'?'music_tracks':'music_playlists';
    let row = id ? await ohanaMusicOwn(db,table,id,room,me.id) : null;
    if (row && row.revision !== ohanaMusicRevision(body)) ohanaMusicFault(409,'This item changed. Reload it before saving.');
    if (action) {
      const result=await db.prepare('UPDATE '+table+' SET deleted_at=?,revision=revision+1,updated_at=? WHERE id=? AND room_id=? AND member_id=? AND revision=?').bind(action==='delete'?stamp:null,stamp,id,room,me.id,body.revision).run();
      if (!result.meta.changes) ohanaMusicFault(409,'This item changed. Reload it before saving.');
      return reply({ok:true,id,revision:body.revision+1,deleted:action==='delete'});
    }
    if (row?.deleted_at) ohanaMusicFault(409,'Restore this item before editing it.');
    const audience=await ohanaMusicAudience(db,room,me.id,body,row);
    if (kind === 'tracks') {
      const title=ohanaMusicText(body.title,'title',160),artist=ohanaMusicText(body.artist,'artist',120),stream=row&&row.stream_url.startsWith('/api/music/audio/')&&body.stream===row.stream_url?row.stream_url:(await ohanaResolveMusicLink(body.stream)).stream;
      const category=body.category||'radio';if(!['radio','sunday'].includes(category)) ohanaMusicFault(400,'Choose Radio or Sunday Best.');
      if (!row) {
        const request=ohanaMusicRequestId(body), existing=await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();
        if (existing) return reply({ok:true,track:ohanaMusicTrack(existing),repeated:true});
        const newId='m_'+crypto.randomUUID();
        const result=await db.prepare('INSERT OR IGNORE INTO music_tracks(id,room_id,member_id,title,artist,stream_url,category,visibility,recipients,request_id,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM music_tracks WHERE room_id=? AND member_id=?)<1000').bind(newId,room,me.id,title,artist,stream,category,audience.visibility,audience.recipients,request,stamp,stamp,room,me.id).run();
        if(!result.meta.changes){const retry=await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();if(retry)return reply({ok:true,track:ohanaMusicTrack(retry),repeated:true});ohanaMusicFault(409,'Your library has reached 1,000 added songs.');}
        row=await db.prepare('SELECT * FROM music_tracks WHERE id=?').bind(newId).first();
      } else {
        const result=await db.prepare('UPDATE music_tracks SET title=?,artist=?,stream_url=?,category=?,visibility=?,recipients=?,revision=revision+1,updated_at=? WHERE id=? AND room_id=? AND member_id=? AND revision=? AND deleted_at IS NULL').bind(title,artist,stream,category,audience.visibility,audience.recipients,stamp,id,room,me.id,body.revision).run();
        if(!result.meta.changes)ohanaMusicFault(409,'This item changed. Reload it before saving.');
        row=await db.prepare('SELECT * FROM music_tracks WHERE id=?').bind(id).first();
      }
      return reply({ok:true,track:ohanaMusicTrack(row)});
    }
    const name=ohanaMusicText(body.name,'playlist name',80),ids=await ohanaMusicTrackIds(db,room,me.id,body.track_ids),token=crypto.randomUUID();
    if(!row){
      const request=ohanaMusicRequestId(body),existing=await db.prepare('SELECT id,revision FROM music_playlists WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();
      if(existing)return reply({ok:true,...existing,repeated:true});
      const newId='p_'+crypto.randomUUID();
      const statements=[db.prepare('INSERT OR IGNORE INTO music_playlists(id,room_id,member_id,name,visibility,recipients,request_id,mutation_token,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM music_playlists WHERE room_id=? AND member_id=?)<100').bind(newId,room,me.id,name,audience.visibility,audience.recipients,request,token,stamp,stamp,room,me.id)];
      ids.forEach((track,i)=>statements.push(db.prepare('INSERT INTO music_playlist_items(playlist_id,track_id,position) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM music_playlists WHERE id=? AND mutation_token=?)').bind(newId,track,i,newId,token)));
      const result=await db.batch(statements);
      if(!result[0].meta.changes){const retry=await db.prepare('SELECT id,revision FROM music_playlists WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();if(retry)return reply({ok:true,...retry,repeated:true});ohanaMusicFault(409,'Your library has reached 100 playlists.');}
      return reply({ok:true,id:newId,revision:1});
    }
    const statements=[db.prepare('UPDATE music_playlists SET name=?,visibility=?,recipients=?,revision=revision+1,mutation_token=?,updated_at=? WHERE id=? AND room_id=? AND member_id=? AND revision=? AND deleted_at IS NULL').bind(name,audience.visibility,audience.recipients,token,stamp,id,room,me.id,body.revision),db.prepare('DELETE FROM music_playlist_items WHERE playlist_id=? AND EXISTS(SELECT 1 FROM music_playlists WHERE id=? AND mutation_token=?)').bind(id,id,token)];
    ids.forEach((track,i)=>statements.push(db.prepare('INSERT INTO music_playlist_items(playlist_id,track_id,position) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM music_playlists WHERE id=? AND mutation_token=?)').bind(id,track,i,id,token)));
    const result=await db.batch(statements);if(!result[0].meta.changes)ohanaMusicFault(409,'This playlist changed. Reload it before saving.');
    return reply({ok:true,id,revision:body.revision+1});
  } catch(e) { if(e.musicStatus)return reply({error:e.message},e.musicStatus);throw e; }
}

const SHARED_COLOR_STATIC_PAGES=["honu","hibiscus","palm","canoe","splash","pineapple","sandcastle","home"];
const SHARED_COLOR_PREFIX_PAGES=["buddy:honu","buddy:eddie","buddy:splash","buddy:kiko","buddy:pebble","buddy:mango","buddy:sunny","buddy:otto","buddy:pippa","buddy:lulu","buddy:hoot","buddy:flutter","buddy:rosie","buddy:koa","buddy:milo","buddy:bamboo","buddy:coco","buddy:finn","buddy:inky","buddy:kai","buddy:flora","buddy:reef","adult:hibiscus-mandala","adult:honu-mandala","adult:ohana-wreath","adult:ocean-waves","adult:palm-leaves","adult:coral-reef","adult:ukulele","adult:hummingbird","adult:dolphins","adult:island-tribal","adult:surf-day","adult:pineapple-mandala","adult:beach-cottage","adult:seashells","adult:orchids","adult:family-tree","adult:sunset-sail","adult:hawaiian-quilt"];
/* Private candidate: additive, room-scoped coloring operations. */
async function sharedColoringApi(req,env,url){
 const headers={'cache-control':'private,no-store','x-content-type-options':'nosniff'},reply=(d,status=200)=>Response.json(d,{status,headers});
 const me=await auth(req,env);if(!me)return reply({error:'Sign in to color with your Ohana.'},401);
 const roomId=Number(req.headers.get('x-ohana-room')||url.searchParams.get('room'));if(!Number.isSafeInteger(roomId)||roomId<1)return reply({error:'Choose a family room.'},400);
 const db=env.DB,room=await db.prepare("SELECT r.id,r.name,r.owner_id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')").bind(roomId,me.id).first();if(!room)return reply({error:'This coloring table belongs to another family room.'},403);
 const canManage=!!me.is_admin||(room.id!==1&&room.owner_id===me.id);
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_tables(room_id INTEGER PRIMARY KEY,active_page TEXT NOT NULL)').run();
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_pages(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,page_key TEXT NOT NULL,created_by INTEGER NOT NULL,request_id TEXT NOT NULL,created_at INTEGER NOT NULL,UNIQUE(room_id,created_by,request_id))').run();
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_ops(seq INTEGER PRIMARY KEY AUTOINCREMENT,page_id TEXT NOT NULL,member_id INTEGER NOT NULL,client_id TEXT NOT NULL,kind TEXT NOT NULL,payload TEXT NOT NULL,undo_target INTEGER,created_at INTEGER NOT NULL,UNIQUE(page_id,member_id,client_id))').run();
 await db.prepare('CREATE INDEX IF NOT EXISTS coloring_shared_ops_page ON coloring_shared_ops(page_id,seq)').run();
 const current=await db.prepare('SELECT p.* FROM coloring_shared_tables t JOIN coloring_shared_pages p ON p.id=t.active_page WHERE t.room_id=?').bind(roomId).first();
 const cleanOp=o=>({seq:o.seq,member_id:o.member_id,client_id:o.client_id,kind:o.kind,payload:JSON.parse(o.payload),undo_target:o.undo_target,created_at:o.created_at});
 if(req.method==='GET'){
  const requested=url.searchParams.get('page'),page=requested?await db.prepare('SELECT * FROM coloring_shared_pages WHERE id=? AND room_id=?').bind(requested,roomId).first():current;if(requested&&!page)return reply({error:'That picture is not in this family room.'},404);
  const since=Number(url.searchParams.get('since')||0);if(!Number.isSafeInteger(since)||since<0)return reply({error:'Invalid coloring position.'},400);if(!page)return reply({page:null,activePage:null,ops:[],more:false,canManage,me:{id:me.id,name:me.name}});
  const rows=(await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND seq>? ORDER BY seq LIMIT 201').bind(page.id,since).all()).results;return reply({page,activePage:current?.id||null,ops:rows.slice(0,200).map(cleanOp),more:rows.length>200,canManage,me:{id:me.id,name:me.name}});
 }
 if(req.method!=='POST')return reply({error:'Unsupported coloring action.'},405);
 const raw=await req.text();if(raw.length>180000)return reply({error:'That marker line is too long. Try a shorter line.'},413);let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid coloring action.'},400);}if(!body||typeof body!=='object'||Array.isArray(body))return reply({error:'Invalid coloring action.'},400);
 const validId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{8,80}$/.test(x);
 if(body.action==='open'){
  if(!canManage)return reply({error:'The room owner chooses the shared picture.'},403);if(!validId(body.clientId)||typeof body.pageKey!=='string'||!isSharedColorPage(body.pageKey))return reply({error:'Choose one of Ohana Journey’s pictures.'},400);
  const old=await db.prepare('SELECT * FROM coloring_shared_pages WHERE room_id=? AND created_by=? AND request_id=?').bind(roomId,me.id,body.clientId).first();if(old)return current?.id===old.id?reply({page:old,activePage:old.id,canManage}):reply({error:'The family table has moved to another picture.',activePage:current?.id||null},409);
  if((body.expectedPage||null)!==(current?.id||null))return reply({error:'Someone changed the family picture. Open it again first.',activePage:current?.id||null},409);
  const page={id:crypto.randomUUID(),room_id:roomId,page_key:body.pageKey,created_by:me.id,request_id:body.clientId,created_at:Date.now()};await db.prepare('INSERT INTO coloring_shared_pages(id,room_id,page_key,created_by,request_id,created_at) VALUES(?,?,?,?,?,?)').bind(page.id,roomId,page.page_key,me.id,body.clientId,page.created_at).run();
  const result=current?await db.prepare('UPDATE coloring_shared_tables SET active_page=? WHERE room_id=? AND active_page=?').bind(page.id,roomId,current.id).run():await db.prepare('INSERT OR IGNORE INTO coloring_shared_tables(room_id,active_page) VALUES(?,?)').bind(roomId,page.id).run();if(!result.meta?.changes)return reply({error:'Someone changed the family picture. Open it again first.'},409);return reply({page,activePage:page.id,canManage});
 }
 if(body.action!=='op'||!validId(body.clientId)||typeof body.pageId!=='string')return reply({error:'Invalid coloring action.'},400);
 const page=await db.prepare('SELECT * FROM coloring_shared_pages WHERE id=? AND room_id=?').bind(body.pageId,roomId).first();if(!page)return reply({error:'That picture is not in this family room.'},404);
 const prior=await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND member_id=? AND client_id=?').bind(page.id,me.id,body.clientId).first();if(prior)return reply({op:cleanOp(prior),activePage:current?.id||null});
 let payload={},target=null;const kind=body.kind;
 if(kind==='fill'){if(!Number.isInteger(body.payload?.region)||body.payload.region<0||body.payload.region>10000||!/^#[0-9a-f]{6}$/i.test(body.payload?.color||''))return reply({error:'Invalid fill.'},400);payload={region:body.payload.region,color:body.payload.color.toLowerCase()};}
 else if(kind==='stroke'){const s=body.payload;if(!s||!/^#[0-9a-f]{6}$/i.test(s.color||'')||![5,12,22,40].includes(s.size)||typeof s.erase!=='boolean'||!Array.isArray(s.pts)||!s.pts.length||s.pts.length>5000||s.pts.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||v< -400||v>800)))return reply({error:'Invalid marker line.'},400);payload={color:s.color.toLowerCase(),size:s.size,erase:s.erase,pts:s.pts.map(p=>p.map(v=>Math.round(v*10)/10))};}
 else if(kind==='clear'){if(!canManage)return reply({error:'Only the room owner can clear everyone’s picture.'},403);}
 else if(kind==='undo'){
  const last=await db.prepare("SELECT o.seq FROM coloring_shared_ops o WHERE o.page_id=? AND o.member_id=? AND o.kind IN('fill','stroke') AND o.seq>COALESCE((SELECT MAX(seq) FROM coloring_shared_ops WHERE page_id=? AND kind='clear'),0) AND NOT EXISTS(SELECT 1 FROM coloring_shared_ops u WHERE u.page_id=o.page_id AND u.undo_target=o.seq) ORDER BY o.seq DESC LIMIT 1").bind(page.id,me.id,page.id).first();if(!last)return reply({error:'There is no coloring of yours to undo.'},409);if(body.payload?.target!==last.seq)return reply({error:'Your latest coloring changed. Try Undo again.'},409);target=last.seq;
 }else return reply({error:'Invalid coloring tool.'},400);
 await db.prepare('INSERT OR IGNORE INTO coloring_shared_ops(page_id,member_id,client_id,kind,payload,undo_target,created_at) VALUES(?,?,?,?,?,?,?)').bind(page.id,me.id,body.clientId,kind,JSON.stringify(payload),target,Date.now()).run();const op=await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND member_id=? AND client_id=?').bind(page.id,me.id,body.clientId).first();return reply({op:cleanOp(op),activePage:current?.id||null});
}
function isSharedColorPage(key){
 return SHARED_COLOR_STATIC_PAGES.includes(key)||/^gen:(?:0|[1-9]\d{0,9})$/.test(key)&&Number(key.slice(4))<=4294967295||SHARED_COLOR_PREFIX_PAGES.includes(key);
}

// Photo feedback stays inside the photo's current, active family room.
async function ohanaPhotoFeedbackApi(req,env,url,me,room,reply){
 const route=url.pathname.match(/^\/api\/memories\/photo\/([a-f0-9-]{36}|journey-[1-9][0-9]*|album-[1-9][0-9]*|mike-birthday|granny-family-original)\/(feedback|comments(?:\/([a-f0-9-]{36})(\/remove)?)?|reaction(?:\/([1-9][0-9]*))?)$/);
 if(!route)return null;
 const db=env.DB,photoId=route[1],kind=route[2],commentId=route[3],remove=!!route[4],moderation=!!route[5],reactionMember=moderation?Number(route[5]):me.id;
 if(!Number.isSafeInteger(reactionMember))return reply({error:'Invalid reaction member.'},400);
 const emojis=['👍','❤️','😂','😮','😢','🙏','🎉'];
 const legacy=photoId.match(/^(journey|album)-([1-9][0-9]*)$/),builtIn=photoId==='mike-birthday'||photoId==='granny-family-original';
 if(legacy&&!Number.isSafeInteger(Number(legacy[2])))return reply({error:'That photo is unavailable.'},404);
 if(legacy)await ensureJourneyMemories(db);
 let subject="EXISTS(SELECT 1 FROM ohana_memories p WHERE p.id=? AND p.room_id=r.id AND p.hidden=0)",subjectArgs=[photoId];
 if(builtIn){subject='1=1';subjectArgs=[];}
 else if(legacy&&legacy[1]==='journey'){subject="EXISTS(SELECT 1 FROM ohana_journey_memories j WHERE j.puzzle_id=? AND j.room_id=r.id AND j.image LIKE 'data:image/%')";subjectArgs=[Number(legacy[2])];}
 else if(legacy){subject="EXISTS(SELECT 1 FROM puzzle_album a WHERE a.id=? AND a.room_id=r.id AND a.image LIKE 'data:image/%' AND NOT EXISTS(SELECT 1 FROM ohana_journey_memories j WHERE j.room_id=a.room_id AND j.image=a.image AND j.name=a.name))";subjectArgs=[Number(legacy[2])];}
 const photo=await db.prepare("SELECT r.owner_id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'') AND "+subject).bind(room,me.id,...subjectArgs).first();
 if(!photo)return reply({error:'This photo is not available in your family room.'},404);
 const moderate=!!me.is_admin||photo.owner_id===me.id;
 if(moderation&&!moderate)return reply({error:'Only a family admin can change another member’s reaction.'},403);
 await db.batch([
  db.prepare('CREATE TABLE IF NOT EXISTS ohana_photo_comments(id TEXT PRIMARY KEY,photo_id TEXT NOT NULL,room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,author TEXT NOT NULL,text TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,revision INTEGER NOT NULL DEFAULT 1,deleted_at INTEGER,edited_by INTEGER)'),
  db.prepare('CREATE INDEX IF NOT EXISTS ohana_photo_comments_photo ON ohana_photo_comments(room_id,photo_id,deleted_at,created_at)'),
  db.prepare('CREATE TABLE IF NOT EXISTS ohana_photo_reactions(photo_id TEXT NOT NULL,room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,emoji TEXT,revision INTEGER NOT NULL,updated_at INTEGER NOT NULL,PRIMARY KEY(photo_id,room_id,member_id))'),
  db.prepare('CREATE TABLE IF NOT EXISTS ohana_photo_reaction_moderation(room_id INTEGER NOT NULL,photo_id TEXT NOT NULL,member_id INTEGER NOT NULL,actor_id INTEGER NOT NULL,request_id TEXT NOT NULL,previous_emoji TEXT NOT NULL,new_emoji TEXT,previous_revision INTEGER NOT NULL,created_at INTEGER NOT NULL,PRIMARY KEY(room_id,actor_id,request_id))'),
  db.prepare('CREATE TABLE IF NOT EXISTS ohana_photo_feedback_requests(room_id INTEGER NOT NULL,member_id INTEGER NOT NULL,request_id TEXT NOT NULL,fingerprint TEXT NOT NULL,target_id TEXT NOT NULL,mutation_token TEXT NOT NULL,created_at INTEGER NOT NULL,PRIMARY KEY(room_id,member_id,request_id))')
 ]);
 if(kind==='feedback'&&req.method==='GET'){
  const rows=(await db.prepare('SELECT id,member_id,author,text,created_at,updated_at,revision FROM ohana_photo_comments WHERE photo_id=? AND room_id=? AND deleted_at IS NULL ORDER BY created_at DESC,id DESC LIMIT 501').bind(photoId,room).all()).results;
  const hasMore=rows.length>500;if(hasMore)rows.pop();rows.reverse();
  const reactions=(await db.prepare('SELECT emoji,COUNT(*) AS count,MAX(CASE WHEN member_id=? THEN 1 ELSE 0 END) AS mine FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND emoji IS NOT NULL GROUP BY emoji').bind(me.id,photoId,room).all()).results.map(r=>({...r,mine:!!r.mine}));
  const own=await db.prepare('SELECT emoji,revision FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND member_id=?').bind(photoId,room,me.id).first();
  const reactionDetails=moderate?(await db.prepare('SELECT pr.member_id,m.name AS author,pr.emoji,pr.revision FROM ohana_photo_reactions pr JOIN members m ON m.id=pr.member_id WHERE pr.photo_id=? AND pr.room_id=? AND pr.emoji IS NOT NULL ORDER BY pr.member_id').bind(photoId,room).all()).results.map(r=>({...r,can_edit:true,can_remove:true})):[];
  return reply({can_moderate_reactions:moderate,reaction_details:reactionDetails,comments:rows.map(c=>({...c,can_edit:moderate||c.member_id===me.id,can_remove:moderate||c.member_id===me.id})),has_more_comments:hasMore,reactions,my_reaction:own?.emoji||null,reaction_revision:own?.revision||0,allowed_emojis:emojis,can_comment:true});
 }
 if(req.method!=='POST'||kind==='feedback')return reply({error:'This photo action is not supported.'},405);
 if(Number(req.headers.get('content-length'))>6000)return reply({error:'Keep photo feedback short.'},413);
 let raw;try{raw=await req.text();}catch{return reply({error:'Please try that photo action again.'},400);}
 if(raw.length>6000)return reply({error:'Keep photo feedback short.'},413);
 let body;try{body=JSON.parse(raw);}catch{return reply({error:'Please try that photo action again.'},400);}
 if(!body||typeof body!=='object'||Array.isArray(body)||typeof body.request_id!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(body.request_id))return reply({error:'Please reopen this photo and try again.'},400);
 const reaction=kind==='reaction'||moderation,create=kind==='comments';
 if(moderation){const existing=await db.prepare('SELECT emoji FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND member_id=?').bind(photoId,room,reactionMember).first();if(!existing||existing.emoji===null){const retry=await db.prepare('SELECT fingerprint FROM ohana_photo_feedback_requests WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,body.request_id).first();if(!retry)return reply({error:'That reaction is no longer available.'},404);}}
 const text=!reaction&&!remove&&typeof body.text==='string'?body.text.trim():'';
 if(!reaction&&!remove&&(!text||text.length>500||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)))return reply({error:'Write a comment from 1 to 500 characters.'},400);
 if(reaction&&body.emoji!==null&&!emojis.includes(body.emoji))return reply({error:'Choose one of the photo reactions.'},400);
 if(!create&&(!Number.isSafeInteger(body.revision)||body.revision<(reaction?0:1)))return reply({error:'Reopen this photo to see the latest changes.'},400);
 const fingerprint=JSON.stringify([photoId,kind,reaction?body.emoji:text,create?null:body.revision]);
 const previous=await db.prepare('SELECT fingerprint,target_id FROM ohana_photo_feedback_requests WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,body.request_id).first();
 if(previous)return previous.fingerprint===fingerprint?reply({saved:true,...(remove?{removed:true}:{}),id:previous.target_id}):reply({error:'That request was already used. Reopen this photo and try again.'},409);
 const target=create?crypto.randomUUID():(commentId||photoId),token=crypto.randomUUID(),stamp=Date.now();
 // The ledger and feedback write share one transaction; the insert guard rechecks live access.
 let guard="EXISTS(SELECT 1 FROM rooms r JOIN room_members rm ON rm.room_id=r.id JOIN members m ON m.id=rm.member_id WHERE r.id=? AND m.id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'') AND "+subject+")";
 const args=[room,me.id,...subjectArgs];
 if(reaction){guard+=' AND COALESCE((SELECT revision FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND member_id=?),0)=?';args.push(photoId,room,reactionMember,body.revision);
  if(moderation){const adminName=String(env.ADMIN_NAME||'').toLowerCase();guard+=" AND EXISTS(SELECT 1 FROM rooms r JOIN members m ON m.id=? WHERE r.id=? AND (r.owner_id=m.id OR m.is_admin=1 OR (?<>'' AND LOWER(m.name)=?))) AND EXISTS(SELECT 1 FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND member_id=? AND emoji IS NOT NULL)";args.push(me.id,room,adminName,adminName,photoId,room,reactionMember);}
 }
 else if(!create){
  const adminName=String(env.ADMIN_NAME||'').toLowerCase();
  guard+=" AND EXISTS(SELECT 1 FROM ohana_photo_comments c JOIN rooms r ON r.id=c.room_id JOIN members m ON m.id=? WHERE c.id=? AND c.photo_id=? AND c.room_id=? AND c.deleted_at IS NULL AND c.revision=? AND (c.member_id=m.id OR r.owner_id=m.id OR m.is_admin=1 OR (?<>'' AND LOWER(m.name)=?)))";
  args.push(me.id,commentId,photoId,room,body.revision,adminName,adminName);
  const existing=await db.prepare('SELECT member_id,revision,deleted_at FROM ohana_photo_comments WHERE id=? AND photo_id=? AND room_id=?').bind(commentId,photoId,room).first();
  if(!existing||existing.deleted_at!==null)return reply({error:'That comment is no longer available.'},404);
  if(existing.member_id!==me.id&&photo.owner_id!==me.id&&!me.is_admin)return reply({error:'Only the author or a family admin can change this comment.'},403);
 }
 const ledger=db.prepare('INSERT OR IGNORE INTO ohana_photo_feedback_requests(room_id,member_id,request_id,fingerprint,target_id,mutation_token,created_at) SELECT ?,?,?,?,?,?,? WHERE '+guard).bind(room,me.id,body.request_id,fingerprint,target,token,stamp,...args);
 const applied='EXISTS(SELECT 1 FROM ohana_photo_feedback_requests WHERE room_id=? AND member_id=? AND request_id=? AND mutation_token=?)';
 const appliedArgs=[room,me.id,body.request_id,token];let write;
 if(create)write=db.prepare('INSERT INTO ohana_photo_comments(id,photo_id,room_id,member_id,author,text,created_at,updated_at) SELECT ?,?,?,?,?,?,?,? WHERE '+applied).bind(target,photoId,room,me.id,me.name,text,stamp,stamp,...appliedArgs);
 else if(reaction)write=db.prepare('INSERT INTO ohana_photo_reactions(photo_id,room_id,member_id,emoji,revision,updated_at) SELECT ?,?,?,?,?,? WHERE '+applied+' ON CONFLICT(photo_id,room_id,member_id) DO UPDATE SET emoji=excluded.emoji,revision=excluded.revision,updated_at=excluded.updated_at').bind(photoId,room,reactionMember,body.emoji,body.revision+1,stamp,...appliedArgs);
 else if(remove)write=db.prepare('UPDATE ohana_photo_comments SET deleted_at=?,updated_at=?,edited_by=?,revision=revision+1 WHERE id=? AND photo_id=? AND room_id=? AND '+applied).bind(stamp,stamp,me.id,commentId,photoId,room,...appliedArgs);
 else write=db.prepare('UPDATE ohana_photo_comments SET text=?,updated_at=?,edited_by=?,revision=revision+1 WHERE id=? AND photo_id=? AND room_id=? AND '+applied).bind(text,stamp,me.id,commentId,photoId,room,...appliedArgs);
 const audit=moderation?db.prepare('INSERT INTO ohana_photo_reaction_moderation(room_id,photo_id,member_id,actor_id,request_id,previous_emoji,new_emoji,previous_revision,created_at) SELECT ?,?,?,?,?,emoji,?,revision,? FROM ohana_photo_reactions WHERE photo_id=? AND room_id=? AND member_id=? AND '+applied).bind(room,photoId,reactionMember,me.id,body.request_id,body.emoji,stamp,photoId,room,reactionMember,...appliedArgs):null;
 await db.batch(audit?[ledger,audit,write]:[ledger,write]);
 const result=await db.prepare('SELECT fingerprint,target_id FROM ohana_photo_feedback_requests WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,body.request_id).first();
 if(!result||result.fingerprint!==fingerprint)return reply({error:'The photo or its feedback changed. Reopen it and try again.'},409);
 return reply({saved:true,...(remove?{removed:true}:{}),id:result.target_id});
}
