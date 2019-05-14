'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var queryString = require('query-string');
var uuid = _interopDefault(require('uuid/v1'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var LIST = 'list';
var ITEMS = 'items';
var PATCHES = 'patches';
var DATA = 'data';
var PERMISSIONS = 'permissions';
var STATE = '__STATE__';
var VERB = '__VERB__';
var TIMESTAMP = '__TIMESTAMP__';
var ERROR = '__ERROR__';
var CODE = '__CODE__';
var STATES = {
  PENDING: 'PENDING',
  SYNCED: 'SYNCED',
  FAILED: 'FAILED',
  STALE: 'STALE'
};
var VERBS = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

var _defaultState;
var defaultState = (_defaultState = {}, _defineProperty(_defaultState, LIST, {}), _defineProperty(_defaultState, ITEMS, {}), _defineProperty(_defaultState, PATCHES, {}), _defaultState);
var defaultList = _defineProperty({}, DATA, []);
var defaultItem = _defineProperty({}, DATA, {});

function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return value !== null && _typeof(value) === 'object' && !isArray(value);
}
function isStringLike(value) {
  var valueType = _typeof(value);

  return valueType === 'string' || valueType === 'number';
}
function sortedStringify(query) {
  if (!query && !isObject(query)) {
    return '';
  }

  var keys = Object.keys(query).sort();
  var sortedObject = {};
  keys.forEach(function (key) {
    sortedObject[key] = query[key];
  });
  return queryString.stringify(sortedObject);
}

function getTimestamp() {
  if (process.env && process.env.NODE_ENV === 'test') {
    return 9999;
  }

  return Date.now();
}
function changeStateHelper(state, verb) {
  return {
    isLoading: state === STATES.PENDING && verb === VERBS.GET,
    isLoaded: state === STATES.SYNCED && verb === VERBS.GET,
    isLoadingFailed: state === STATES.FAILED && verb === VERBS.GET,
    isCreating: state === STATES.PENDING && verb === VERBS.POST,
    isCreated: state === STATES.SYNCED && verb === VERBS.POST,
    isCreatingFailed: state === STATES.FAILED && verb === VERBS.POST,
    isUpdating: state === STATES.PENDING && verb === VERBS.PUT,
    isUpdated: state === STATES.SYNCED && verb === VERBS.PUT,
    isUpdatingFailed: state === STATES.FAILED && verb === VERBS.PUT,
    isPatching: state === STATES.PENDING && verb === VERBS.PATCH,
    isPatched: state === STATES.SYNCED && verb === VERBS.PATCH,
    isPatchingFailed: state === STATES.FAILED && verb === VERBS.PATCH,
    isDeleting: state === STATES.PENDING && verb === VERBS.DELETE,
    isDeleted: state === STATES.SYNCED && verb === VERBS.DELETE,
    isDeletingFailed: state === STATES.FAILED && verb === VERBS.DELETE,
    isStale: state === STATES.STALE
  };
}
function changeMeta(state, verb, code, error) {
  var _objectSpread2;

  if (!state || !STATES[state]) {
    throw new Error('Expected state to be enum of `STATES` constants');
  }

  if (code && typeof code !== 'number') {
    throw new Error('Expected code to be a number');
  }

  return _objectSpread((_objectSpread2 = {}, _defineProperty(_objectSpread2, STATE, state), _defineProperty(_objectSpread2, VERB, verb), _defineProperty(_objectSpread2, CODE, code || null), _defineProperty(_objectSpread2, TIMESTAMP, getTimestamp()), _defineProperty(_objectSpread2, ERROR, error || null), _objectSpread2), changeStateHelper(state, verb));
}

function changeListToStale(state) {
  var list = {};

  for (var key in state[LIST]) {
    list[key] = _objectSpread({}, state[LIST][key], changeMeta(STATES.STALE));
  }

  return _objectSpread({}, state, _defineProperty({}, LIST, list));
}

function changeItemToStale(state, id, query) {
  var qs = query ? "".concat(id, "::").concat(sortedStringify(query)) : id;
  var item = state[ITEMS][qs];

  if (!item) {
    return state;
  }

  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, qs, _objectSpread({}, item, changeMeta(STATES.STALE))))));
}

var utils = {
  changeListToStale: changeListToStale,
  changeItemToStale: changeItemToStale
};

function applyMiddleware (fn, middlewares) {
  middlewares.forEach(function (mw) {
    fn = mw(fn);
  });
  return fn;
}

var checkStateMW = function checkStateMW(next) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var state = args[0];

    if (!state) {
      throw new Error('Expected state to be an object');
    }

    return next.apply(void 0, args);
  };
};
var checkItemsMW = function checkItemsMW(next) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var state = args[0];

    if (!isObject(state[ITEMS])) {
      throw new Error('Expected state to have `items` object');
    }

    return next.apply(void 0, args);
  };
};
var checkListMW = function checkListMW(next) {
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var state = args[0];

    if (!isObject(state[LIST])) {
      throw new Error('Expected state to have `list` object');
    }

    return next.apply(void 0, args);
  };
};
var checkIdMW = function checkIdMW(next) {
  return function () {
    var _ref = (arguments.length <= 1 ? undefined : arguments[1]) || {},
        id = _ref.id;

    if (!isStringLike(id)) {
      throw new Error('Expected id to be string or number');
    }

    return next.apply(void 0, arguments);
  };
};
var checkCodeMW = function checkCodeMW(next) {
  return function () {
    var _ref5 = (arguments.length <= 1 ? undefined : arguments[1]) || {},
        code = _ref5.code;

    if (isNaN(code)) {
      throw new Error('Expected code to be a number');
    }

    return next.apply(void 0, arguments);
  };
};

var get = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref.id,
      query = _ref.query;

  var qs = query ? "".concat(id, "::").concat(sortedStringify(query)) : id;
  var item = state[ITEMS][qs] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, qs, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.GET, -1))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var getSuccess = applyMiddleware(function (state) {
  var _objectSpread4;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      query = _ref2.query,
      value = _ref2.value,
      permissions = _ref2.permissions,
      code = _ref2.code,
      etag = _ref2.etag;

  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, query ? "".concat(id, "::").concat(sortedStringify(query)) : id, _objectSpread((_objectSpread4 = {}, _defineProperty(_objectSpread4, DATA, value), _defineProperty(_objectSpread4, PERMISSIONS, permissions), _objectSpread4), changeMeta(STATES.SYNCED, VERBS.GET, code))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var getFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      query = _ref3.query,
      code = _ref3.code,
      error = _ref3.error;

  var qs = query ? "".concat(id, "::").concat(sortedStringify(query)) : id;
  var item = state[ITEMS][qs] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, qs, _objectSpread({}, item, _defineProperty({}, ERROR, error), changeMeta(STATES.FAILED, VERBS.GET, code, error))))));
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);

var getAll = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      query = _ref.query;

  var qs = sortedStringify(query);
  var list = state[LIST][qs] || defaultList;
  return _objectSpread({}, state, _defineProperty({}, LIST, _objectSpread({}, state[LIST], _defineProperty({}, qs, _objectSpread({}, list, changeMeta(STATES.PENDING, VERBS.GET, -1))))));
}, [checkListMW, checkStateMW]);
var getAllSuccess = applyMiddleware(function (state) {
  var _objectSpread4;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      query = _ref2.query,
      value = _ref2.value,
      permissions = _ref2.permissions,
      code = _ref2.code;

  var qs = sortedStringify(query);
  return _objectSpread({}, state, _defineProperty({}, LIST, _objectSpread({}, state[LIST], _defineProperty({}, qs, _objectSpread((_objectSpread4 = {}, _defineProperty(_objectSpread4, DATA, value), _defineProperty(_objectSpread4, PERMISSIONS, permissions), _objectSpread4), changeMeta(STATES.SYNCED, VERBS.GET, code))))));
}, [checkListMW, checkStateMW]);
var getAllFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      query = _ref3.query,
      code = _ref3.code,
      error = _ref3.error;

  var qs = sortedStringify(query);
  var list = state[LIST][qs] || defaultList;
  return _objectSpread({}, state, _defineProperty({}, LIST, _objectSpread({}, state[LIST], _defineProperty({}, qs, _objectSpread({}, list, changeMeta(STATES.FAILED, VERBS.GET, code, error))))));
}, [checkListMW, checkStateMW]);

var post = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref.id;

  var item = state[ITEMS][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.POST, -1))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var postSuccess = applyMiddleware(function (state) {
  var _objectSpread4;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      value = _ref2.value,
      permissions = _ref2.permissions,
      code = _ref2.code;

  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread((_objectSpread4 = {}, _defineProperty(_objectSpread4, DATA, value), _defineProperty(_objectSpread4, PERMISSIONS, permissions), _objectSpread4), changeMeta(STATES.SYNCED, VERBS.POST, code))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var postFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      code = _ref3.code,
      error = _ref3.error;

  var item = state[ITEMS][id];
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.FAILED, VERBS.POST, code, error))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);

var put = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref.id;

  var item = state[ITEMS][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.PUT))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var putSuccess = applyMiddleware(function (state) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      code = _ref2.code,
      etag = _ref2.etag;

  var item = state[ITEMS][id];
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.SYNCED, VERBS.PUT, code, null, etag))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var putFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      code = _ref3.code,
      error = _ref3.error;

  var item = state[ITEMS][id];
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.FAILED, VERBS.PUT, code, error))))));
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);

var patch = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      patchId = _ref.patchId,
      value = _ref.value;

  var item = defaultItem;
  return _objectSpread({}, state, _defineProperty({}, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, patchId, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.PATCH, -1))))));
}, [checkStateMW]);
var patchSuccess = applyMiddleware(function (state) {
  var _objectSpread4, _objectSpread7;

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      patchId = _ref2.patchId,
      value = _ref2.value,
      permissions = _ref2.permissions,
      code = _ref2.code;

  var item = state[PATCHES][patchId];
  return _objectSpread({}, state, (_objectSpread7 = {}, _defineProperty(_objectSpread7, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, patchId, _objectSpread({}, item, (_objectSpread4 = {}, _defineProperty(_objectSpread4, DATA, value), _defineProperty(_objectSpread4, PERMISSIONS, permissions), _objectSpread4), changeMeta(STATES.SYNCED, VERBS.PATCH, code, null))))), _defineProperty(_objectSpread7, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, state[ITEMS][id], changeMeta(STATES.STALE, VERBS.PATCH))))), _objectSpread7));
}, [checkStateMW]);
var patchFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      patchId = _ref3.patchId,
      code = _ref3.code,
      error = _ref3.error;

  var item = state[ITEMS][id];
  return _objectSpread({}, state, _defineProperty({}, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, patchId, _objectSpread({}, item, changeMeta(STATES.FAILED, VERBS.PATCH, code, error))))));
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);

var remove = applyMiddleware(function (state, _ref) {
  var id = _ref.id;
  var item = state[ITEMS][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.DELETE, -1))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var removeSuccess = applyMiddleware(function (state) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      code = _ref2.code;

  var item = state[ITEMS][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.SYNCED, VERBS.DELETE, code))))));
}, [checkIdMW, checkItemsMW, checkStateMW]);
var removeFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      code = _ref3.code,
      error = _ref3.error;

  var item = state[ITEMS][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, ITEMS, _objectSpread({}, state[ITEMS], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.FAILED, VERBS.DELETE, code, error))))));
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);

var removeAll = applyMiddleware(function (state, _ref) {
  var id = _ref.id,
      ids = _ref.ids;
  var item = state[PATCHES][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.PENDING, VERBS.DELETE, -1))))));
}, [checkStateMW]);
var removeAllSuccess = applyMiddleware(function (state) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref2.id,
      ids = _ref2.ids,
      code = _ref2.code;

  var item = state[PATCHES][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.SYNCED, VERBS.DELETE, code))))));
}, [checkStateMW]);
var removeAllFailure = applyMiddleware(function (state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      id = _ref3.id,
      code = _ref3.code,
      error = _ref3.error;

  var item = state[PATCHES][id] || defaultItem;
  return _objectSpread({}, state, _defineProperty({}, PATCHES, _objectSpread({}, state[PATCHES], _defineProperty({}, id, _objectSpread({}, item, changeMeta(STATES.FAILED, VERBS.DELETE, code, error))))));
}, [checkStateMW]);

var mergeAll = applyMiddleware(function (state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      query = _ref.query,
      value = _ref.value,
      primaryKey = _ref.primaryKey;

  var qs = sortedStringify(query);
  var list = state[LIST][qs] || defaultList;
  var data = list[DATA];

  if (isObject(value)) {
    var index = data.findIndex(function (item) {
      return item[primaryKey] === value[primaryKey];
    });
    data = index > 0 ? [].concat(_toConsumableArray(data.slice(0, index)), [value], _toConsumableArray(data.slice(index))) : [].concat(_toConsumableArray(data), [value]);
  }

  return _objectSpread({}, state, _defineProperty({}, LIST, _objectSpread({}, state[LIST], _defineProperty({}, qs, _objectSpread({}, list, {
    data: data
  })))));
}, [checkListMW, checkStateMW]);

function reducer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    FLUSH_ACTIONS: []
  },
      FLUSH_ACTIONS = _ref.FLUSH_ACTIONS;

  return function (_ref2) {
    var MERGE_ALL = _ref2.MERGE_ALL,
        GET = _ref2.GET,
        GET_SUCCESS = _ref2.GET_SUCCESS,
        GET_FAILURE = _ref2.GET_FAILURE,
        GET_ALL = _ref2.GET_ALL,
        GET_ALL_SUCCESS = _ref2.GET_ALL_SUCCESS,
        GET_ALL_FAILURE = _ref2.GET_ALL_FAILURE,
        POST = _ref2.POST,
        POST_SUCCESS = _ref2.POST_SUCCESS,
        POST_FAILURE = _ref2.POST_FAILURE,
        PUT = _ref2.PUT,
        PUT_SUCCESS = _ref2.PUT_SUCCESS,
        PUT_FAILURE = _ref2.PUT_FAILURE,
        PATCH = _ref2.PATCH,
        PATCH_SUCCESS = _ref2.PATCH_SUCCESS,
        PATCH_FAILURE = _ref2.PATCH_FAILURE,
        DELETE = _ref2.DELETE,
        DELETE_SUCCESS = _ref2.DELETE_SUCCESS,
        DELETE_FAILURE = _ref2.DELETE_FAILURE,
        DELETE_ALL = _ref2.DELETE_ALL,
        DELETE_ALL_SUCCESS = _ref2.DELETE_ALL_SUCCESS,
        DELETE_ALL_FAILURE = _ref2.DELETE_ALL_FAILURE;
    var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultState;
    var customReducer = arguments.length > 2 ? arguments[2] : undefined;
    var iState = initialState;
    var cReducer = customReducer; // initialState should be either function or object
    // if it's function it will be used as customReducer
    // and initialState with defaultState

    if (typeof iState === 'function') {
      cReducer = initialState;
      iState = defaultState;
    } else if (_typeof(iState) !== 'object') ; // throw error;
    // type is an action string
    // payload is data passed with action


    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : iState;

      var _ref3 = arguments.length > 1 ? arguments[1] : undefined,
          type = _ref3.type,
          payload = _ref3.payload;

      if (FLUSH_ACTIONS.includes(type)) {
        return defaultState;
      }

      switch (type) {
        case MERGE_ALL:
          return mergeAll(state, payload);

        case GET:
          return get(state, payload);

        case GET_SUCCESS:
          return getSuccess(state, payload);

        case GET_FAILURE:
          return getFailure(state, payload);

        case GET_ALL:
          return getAll(state, payload);

        case GET_ALL_SUCCESS:
          return getAllSuccess(state, payload);

        case GET_ALL_FAILURE:
          return getAllFailure(state, payload);

        case POST:
          return post(state, payload);

        case POST_SUCCESS:
          return postSuccess(state, payload);

        case POST_FAILURE:
          return postFailure(state, payload);

        case PUT:
          return put(state, payload);

        case PUT_SUCCESS:
          return putSuccess(state, payload);

        case PUT_FAILURE:
          return putFailure(state, payload);

        case PATCH:
          return patch(state, payload);

        case PATCH_SUCCESS:
          return patchSuccess(state, payload);

        case PATCH_FAILURE:
          return patchFailure(state, payload);

        case DELETE:
          return remove(state, payload);

        case DELETE_SUCCESS:
          return removeSuccess(state, payload);

        case DELETE_FAILURE:
          return removeFailure(state, payload);

        case DELETE_ALL:
          return removeAll(state, payload);

        case DELETE_ALL_SUCCESS:
          return removeAllSuccess(state, payload);

        case DELETE_ALL_FAILURE:
          return removeAllFailure(state, payload);

        default:
          return cReducer ? cReducer(state, {
            type: type,
            payload: payload
          }) : state;
      }
    };
  };
}

var getAll$1 = function getAll(data) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var qs = sortedStringify(query);
  return data[LIST][qs] || defaultList;
}; // get(skills)({ id })


var get$1 = function get(data, id, query) {
  var qs = query ? "".concat(id, "::").concat(sortedStringify(query)) : id;
  return data[ITEMS][qs] || null;
};

var getPatch = function getPatch(data) {
  return function (id) {
    return data[PATCHES][id] || null;
  };
};

var post$1 = function post(data, id) {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null
    };
  }

  var item = data[ITEMS][id] || null;

  if (item && (item.isCreated || item.isCreatingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item
    };
  }

  return {
    id: id,
    current: item,
    resolved: null
  };
};

var patch$1 = function patch(data, id) {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null
    };
  }

  var item = data[PATCHES][id] || null;

  if (item && (item.isPatched || item.isPatchingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item
    };
  }

  return {
    id: id,
    current: item,
    resolved: null
  };
};

var removeAll$1 = function removeAll(data, id) {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null
    };
  }

  var item = data[PATCHES][id] || null;

  if (item && (item.isDeleted || item.isDeletingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item
    };
  }

  return {
    id: id,
    current: item,
    resolved: null
  };
};

var getError = function getError(resource) {
  return resource[ERROR] || null;
};

var store = {
  getError: getError,
  get: get$1,
  getPatch: getPatch,
  getAll: getAll$1,
  patch: patch$1,
  post: post$1,
  removeAll: removeAll$1
};

var ERRORS = {
  0: 'RRR_NO_RESPONSE',
  403: 'RRR_FORBIDDEN',
  401: 'RRR_UNAUTHORIZED'
};

function dispatchErrors(dispatch, response, action) {
  var payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var code = response ? response.status : 0;
  var actions = action ? Array.isArray(action) ? [].concat(_toConsumableArray(action), [ERRORS[code]]) : [action, ERRORS[code]] : [ERRORS[code]];
  actions.forEach(function (action) {
    if (action) {
      dispatch({
        type: action,
        payload: _objectSpread({}, payload, {
          code: code
        })
      });
    }
  });
}

function dispatchSuccess(dispatch, code, value, permissions, action) {
  var payload = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var actions = Array.isArray(action) ? action : [action];
  actions.forEach(function (action) {
    if (action) {
      dispatch({
        type: action,
        payload: _objectSpread({}, payload, {
          value: value,
          permissions: permissions,
          code: code
        })
      });
    }
  });
}

var getParams = function getParams(store, globalParams, params) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var authKey = config.authKey,
      authExtractor = config.authExtractor;
  return _objectSpread({}, globalParams, params, {
    headers: _objectSpread({}, globalParams.headers ? globalParams.headers : {}, params.headers ? params.headers : {}, authKey && authExtractor ? _defineProperty({}, authKey, authExtractor(store)) : {})
  });
};

var CONTENT_TYPE = "application/JSON";
function actions () {
  var globalParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var mergeAll = function mergeAll(_ref2) {
    var MERGE_ALL = _ref2.MERGE_ALL;
    return function (items, primaryKey) {
      return function (dispatch) {
        if (!primaryKey) {
          throw new Error('mergeAll requires primary key for merging');
        }

        if (isArray(items) || isObject(items)) {
          dispatch({
            type: MERGE_ALL,
            payload: {
              value: items,
              primaryKey: primaryKey
            }
          });
        } else {
          throw new Error('mergeAll requires items to be an Array or An Object');
        }
      };
    };
  };

  var getAll = function getAll(url, _ref3) {
    var PENDING = _ref3.PENDING,
        SUCCESS = _ref3.SUCCESS,
        FAILURE = _ref3.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (query, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref4 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var response, data, _data;

            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      payload: {
                        query: query,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context.prev = 1;
                    _context.next = 4;
                    return fetch(url(query, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'GET'
                    }, params), config));

                  case 4:
                    response = _context.sent;

                    if (response.status) {
                      _context.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      query: query
                    });
                    _context.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context.next = 16;
                      break;
                    }

                    _context.next = 12;
                    return response.json();

                  case 12:
                    data = _context.sent;
                    dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
                      query: query
                    });
                    _context.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context.next = 23;
                      break;
                    }

                    _context.next = 19;
                    return response.json();

                  case 19:
                    _data = _context.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      query: query,
                      error: _data.error
                    });
                    _context.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      query: query
                    });

                  case 24:
                    _context.next = 29;
                    break;

                  case 26:
                    _context.prev = 26;
                    _context.t0 = _context["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      query: query
                    });

                  case 29:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[1, 26]]);
          }));

          return function (_x, _x2) {
            return _ref4.apply(this, arguments);
          };
        }()
      );
    };
  };

  var get = function get(url, _ref5) {
    var PENDING = _ref5.PENDING,
        SUCCESS = _ref5.SUCCESS,
        FAILURE = _ref5.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (id, query, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref6 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee2(dispatch, getState) {
            var response, data, _data2;

            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      payload: {
                        id: id,
                        query: query,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context2.prev = 1;
                    _context2.next = 4;
                    return fetch(url(id, query, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'GET'
                    }, params), config));

                  case 4:
                    response = _context2.sent;

                    if (response.status) {
                      _context2.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id,
                      query: query
                    });
                    _context2.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context2.next = 16;
                      break;
                    }

                    _context2.next = 12;
                    return response.json();

                  case 12:
                    data = _context2.sent;
                    dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
                      id: id,
                      query: query
                    });
                    _context2.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context2.next = 23;
                      break;
                    }

                    _context2.next = 19;
                    return response.json();

                  case 19:
                    _data2 = _context2.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      query: query,
                      error: _data2.error
                    });
                    _context2.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      query: query
                    });

                  case 24:
                    _context2.next = 29;
                    break;

                  case 26:
                    _context2.prev = 26;
                    _context2.t0 = _context2["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id,
                      query: query
                    });

                  case 29:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this, [[1, 26]]);
          }));

          return function (_x3, _x4) {
            return _ref6.apply(this, arguments);
          };
        }()
      );
    };
  };

  var put = function put(url, _ref7) {
    var PENDING = _ref7.PENDING,
        SUCCESS = _ref7.SUCCESS,
        FAILURE = _ref7.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref8 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee3(dispatch, getState) {
            var response, data, _data3;

            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      payload: {
                        id: id,
                        value: value,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context3.prev = 1;
                    _context3.next = 4;
                    return fetch(url(id, value, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'PUT',
                      headers: {
                        'Content-Type': CONTENT_TYPE
                      },
                      body: raw ? value : JSON.stringify(value)
                    }, params), config));

                  case 4:
                    response = _context3.sent;

                    if (response.status) {
                      _context3.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });
                    _context3.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context3.next = 16;
                      break;
                    }

                    _context3.next = 12;
                    return response.json();

                  case 12:
                    data = _context3.sent;
                    dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
                      id: id
                    });
                    _context3.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context3.next = 23;
                      break;
                    }

                    _context3.next = 19;
                    return response.json();

                  case 19:
                    _data3 = _context3.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      error: _data3.error
                    });
                    _context3.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context3.next = 29;
                    break;

                  case 26:
                    _context3.prev = 26;
                    _context3.t0 = _context3["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });

                  case 29:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this, [[1, 26]]);
          }));

          return function (_x5, _x6) {
            return _ref8.apply(this, arguments);
          };
        }()
      );
    };
  };

  var post = function post(url, _ref9) {
    var PENDING = _ref9.PENDING,
        SUCCESS = _ref9.SUCCESS,
        FAILURE = _ref9.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref10 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee4(dispatch, getState) {
            var response, data, _data4;

            return _regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      payload: {
                        id: id,
                        value: value,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context4.prev = 1;
                    _context4.next = 4;
                    return fetch(url(id, value, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'POST',
                      headers: {
                        'Content-Type': CONTENT_TYPE
                      },
                      body: raw ? value : JSON.stringify(value)
                    }, params), config));

                  case 4:
                    response = _context4.sent;

                    if (response.status) {
                      _context4.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });
                    _context4.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context4.next = 16;
                      break;
                    }

                    _context4.next = 12;
                    return response.json();

                  case 12:
                    data = _context4.sent;
                    dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
                      id: id
                    });
                    _context4.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context4.next = 23;
                      break;
                    }

                    _context4.next = 19;
                    return response.json();

                  case 19:
                    _data4 = _context4.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      error: _data4.error
                    });
                    _context4.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context4.next = 29;
                    break;

                  case 26:
                    _context4.prev = 26;
                    _context4.t0 = _context4["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });

                  case 29:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this, [[1, 26]]);
          }));

          return function (_x7, _x8) {
            return _ref10.apply(this, arguments);
          };
        }()
      );
    };
  };

  var patch = function patch(url, _ref11) {
    var PENDING = _ref11.PENDING,
        SUCCESS = _ref11.SUCCESS,
        FAILURE = _ref11.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (patchId, id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref12 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee5(dispatch, getState) {
            var response, data, _data5;

            return _regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      payload: {
                        id: id,
                        patchId: patchId,
                        value: value,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context5.prev = 1;
                    _context5.next = 4;
                    return fetch(url(id, value, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'PATCH',
                      headers: {
                        'Content-Type': CONTENT_TYPE
                      },
                      body: raw ? value : JSON.stringify(value)
                    }, params), config));

                  case 4:
                    response = _context5.sent;

                    if (response.status) {
                      _context5.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id,
                      patchId: patchId
                    });
                    _context5.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context5.next = 16;
                      break;
                    }

                    _context5.next = 12;
                    return response.json();

                  case 12:
                    data = _context5.sent;
                    dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
                      id: id,
                      patchId: patchId
                    });
                    _context5.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context5.next = 23;
                      break;
                    }

                    _context5.next = 19;
                    return response.json();

                  case 19:
                    _data5 = _context5.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      patchId: patchId,
                      error: _data5.error
                    });
                    _context5.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      patchId: patchId
                    });

                  case 24:
                    _context5.next = 29;
                    break;

                  case 26:
                    _context5.prev = 26;
                    _context5.t0 = _context5["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id,
                      patchId: patchId
                    });

                  case 29:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this, [[1, 26]]);
          }));

          return function (_x9, _x10) {
            return _ref12.apply(this, arguments);
          };
        }()
      );
    };
  };

  var remove = function remove(url, _ref13) {
    var PENDING = _ref13.PENDING,
        SUCCESS = _ref13.SUCCESS,
        FAILURE = _ref13.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (id, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref14 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee6(dispatch, getState) {
            var response, data, _data6;

            return _regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      headers: {
                        'Content-Type': CONTENT_TYPE
                      },
                      payload: {
                        id: id,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context6.prev = 1;
                    _context6.next = 4;
                    return fetch(url(id, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'DELETE'
                    }, params), config));

                  case 4:
                    response = _context6.sent;

                    if (response.status) {
                      _context6.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });
                    _context6.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context6.next = 16;
                      break;
                    }

                    _context6.next = 12;
                    return response.json();

                  case 12:
                    data = _context6.sent;
                    dispatchSuccess(dispatch, response.status, {}, {}, SUCCESS, {
                      id: id
                    });
                    _context6.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context6.next = 23;
                      break;
                    }

                    _context6.next = 19;
                    return response.json();

                  case 19:
                    _data6 = _context6.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id,
                      error: _data6.error
                    });
                    _context6.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context6.next = 29;
                    break;

                  case 26:
                    _context6.prev = 26;
                    _context6.t0 = _context6["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      id: id
                    });

                  case 29:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this, [[1, 26]]);
          }));

          return function (_x11, _x12) {
            return _ref14.apply(this, arguments);
          };
        }()
      );
    };
  };

  var removeAll = function removeAll(url, _ref15) {
    var PENDING = _ref15.PENDING,
        SUCCESS = _ref15.SUCCESS,
        FAILURE = _ref15.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, ids, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref16 = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee7(dispatch, getState) {
            var response, data, _data7;

            return _regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    dispatch({
                      type: PENDING,
                      headers: {
                        'Content-Type': CONTENT_TYPE
                      },
                      payload: {
                        id: id,
                        ids: ids,
                        value: value,
                        meta: meta,
                        code: -1
                      }
                    });
                    _context7.prev = 1;
                    _context7.next = 4;
                    return fetch(url(ids, value, meta), getParams(getState(), globalParams, _objectSpread({
                      method: 'DELETE',
                      body: raw ? value : JSON.stringify(value)
                    }, params), config));

                  case 4:
                    response = _context7.sent;

                    if (response.status) {
                      _context7.next = 9;
                      break;
                    }

                    dispatchErrors(dispatch, null, FAILURE, {
                      ids: ids,
                      id: id
                    });
                    _context7.next = 24;
                    break;

                  case 9:
                    if (!(response.status >= 200 && response.status < 300)) {
                      _context7.next = 16;
                      break;
                    }

                    _context7.next = 12;
                    return response.json();

                  case 12:
                    data = _context7.sent;
                    dispatchSuccess(dispatch, response.status, {}, {}, SUCCESS, {
                      ids: ids,
                      id: id
                    });
                    _context7.next = 24;
                    break;

                  case 16:
                    if (!(response.status >= 400 && response.status < 500)) {
                      _context7.next = 23;
                      break;
                    }

                    _context7.next = 19;
                    return response.json();

                  case 19:
                    _data7 = _context7.sent;
                    dispatchErrors(dispatch, response, FAILURE, {
                      ids: ids,
                      id: id,
                      error: _data7.error
                    });
                    _context7.next = 24;
                    break;

                  case 23:
                    dispatchErrors(dispatch, response, FAILURE, {
                      ids: ids,
                      id: id
                    });

                  case 24:
                    _context7.next = 29;
                    break;

                  case 26:
                    _context7.prev = 26;
                    _context7.t0 = _context7["catch"](1);
                    dispatchErrors(dispatch, null, FAILURE, {
                      ids: ids,
                      id: id
                    });

                  case 29:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this, [[1, 26]]);
          }));

          return function (_x13, _x14) {
            return _ref16.apply(this, arguments);
          };
        }()
      );
    };
  };

  return {
    mergeAll: mergeAll,
    getAll: getAll,
    get: get,
    put: put,
    post: post,
    patch: patch,
    remove: remove,
    removeAll: removeAll
  };
}

exports.default = reducer;
exports.store = store;
exports.actions = actions;
exports.utils = utils;
exports.defaults = defaultState;
exports.errors = ERRORS;
