'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var queryString = require('query-string');
var uuid = _interopDefault(require('uuid/v1'));

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

var ERRORS = {
  0: 'RRR_NO_RESPONSE',
  403: 'RRR_FORBIDDEN',
  401: 'RRR_UNAUTHORIZED'
};

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
function getParams(store, globalParams, params) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var authKey = config.authKey,
      authExtractor = config.authExtractor;
  return _objectSpread({}, globalParams, params, {
    headers: _objectSpread({}, globalParams.headers ? globalParams.headers : {}, params.headers ? params.headers : {}, authKey && authExtractor ? _defineProperty({}, authKey, authExtractor(store)) : {})
  });
}
function dispatchErrors(dispatch, response, action) {
  var payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var code = response ? response.status : 0;
  var actions = [];

  if (action) {
    actions = [].concat(_toConsumableArray(Array.isArray(action) ? action : [action]), [ERRORS[code]]);
  } else {
    actions = [ERRORS[code]];
  }

  actions.forEach(function (item) {
    if (item) {
      dispatch({
        type: item,
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
  actions.forEach(function (item) {
    if (item) {
      dispatch({
        type: item,
        payload: _objectSpread({}, payload, {
          value: value,
          permissions: permissions,
          code: code
        })
      });
    }
  });
}

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

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

var handleResponse$$1 = {
  get: handleResponse$1
};
var replayAction = {
  get: getAction
};
var refreshing = false;
var queue = [];

function handleResponses(response) {
  queue.forEach(function (_ref) {
    var options = _ref.options,
        action = _ref.action;
    handleResponse$$1[action](response, options, true);
  });
  queue = [];
}

function replayActions() {
  queue.forEach(function (_ref2) {
    var options = _ref2.options,
        action = _ref2.action;
    replayAction[action](options, true);
  });
  queue = [];
}

function fetchAccessToken(_x) {
  return _fetchAccessToken.apply(this, arguments);
}

function _fetchAccessToken() {
  _fetchAccessToken = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(options) {
    var config, dispatch, getState, refreshTokenKey, refreshTokenExtractor, refreshTokenACTION, refreshTokenURL, refreshToken, _fetch, resp, data;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = options.config, dispatch = options.dispatch, getState = options.getState;
            refreshTokenKey = config.refreshTokenKey, refreshTokenExtractor = config.refreshTokenExtractor, refreshTokenACTION = config.refreshTokenACTION, refreshTokenURL = config.refreshTokenURL;
            refreshToken = refreshTokenExtractor(getState());
            _context.prev = 3;
            _context.next = 6;
            return fetch(refreshTokenURL, (_fetch = {}, _defineProperty(_fetch, refreshTokenKey, refreshToken), _defineProperty(_fetch, "method", 'POST'), _fetch));

          case 6:
            resp = _context.sent;

            if (!(resp && resp.status && resp.status >= 200 && resp.status < 300)) {
              _context.next = 15;
              break;
            }

            _context.next = 10;
            return resp.json();

          case 10:
            data = _context.sent;
            dispatch({
              type: refreshTokenACTION,
              payload: data.value
            });
            replayActions();
            _context.next = 16;
            break;

          case 15:
            handleResponses(resp);

          case 16:
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](3);
            handleResponses({});

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 18]]);
  }));
  return _fetchAccessToken.apply(this, arguments);
}

function canRefreshToken(_ref3) {
  var refreshTokenKey = _ref3.refreshTokenKey,
      refreshTokenExtractor = _ref3.refreshTokenExtractor,
      refreshTokenACTION = _ref3.refreshTokenACTION,
      refreshTokenURL = _ref3.refreshTokenURL;
  return refreshTokenKey && refreshTokenExtractor && refreshTokenACTION && refreshTokenURL;
}
function isRefreshing() {
  return refreshing;
}
function addToQueue(options, action) {
  queue.push({
    options: options,
    action: action
  });
}
function refreshToken (options, action) {
  queue.push({
    options: options,
    action: action
  });

  if (!refreshing) {
    refreshing = true;
    fetchAccessToken(options);
  }
}

function handleResponse$1(_x, _x2) {
  return _handleResponse.apply(this, arguments);
}

function _handleResponse() {
  _handleResponse = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(response, options) {
    var replay,
        ACTIONS,
        dispatch,
        id,
        query,
        config,
        data,
        _data,
        _args = arguments;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            replay = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            ACTIONS = options.ACTIONS, dispatch = options.dispatch, id = options.id, query = options.query, config = options.config;

            if (response.status) {
              _context.next = 6;
              break;
            }

            dispatchErrors(dispatch, null, ACTIONS.FAILURE, {
              id: id,
              query: query
            });
            _context.next = 25;
            break;

          case 6:
            if (!(response.status >= 200 && response.status < 300)) {
              _context.next = 13;
              break;
            }

            _context.next = 9;
            return response.json();

          case 9:
            data = _context.sent;
            dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, ACTIONS.SUCCESS, {
              id: id,
              query: query
            });
            _context.next = 25;
            break;

          case 13:
            if (!(response.status === 401 && canRefreshToken(config) && !replay)) {
              _context.next = 17;
              break;
            }

            refreshToken(options, 'get', response);
            _context.next = 25;
            break;

          case 17:
            if (!(response.status >= 400 && response.status < 500)) {
              _context.next = 24;
              break;
            }

            _context.next = 20;
            return response.json();

          case 20:
            _data = _context.sent;
            dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
              id: id,
              query: query,
              error: _data.error
            });
            _context.next = 25;
            break;

          case 24:
            dispatchErrors(dispatch, response, ACTIONS.FAILURE, {
              id: id,
              query: query
            });

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _handleResponse.apply(this, arguments);
}

function getAction (_x3) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2(options) {
    var replay,
        ACTIONS,
        dispatch,
        getState,
        globalParams,
        url,
        id,
        query,
        meta,
        params,
        config,
        response,
        _args2 = arguments;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            replay = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            ACTIONS = options.ACTIONS, dispatch = options.dispatch, getState = options.getState, globalParams = options.globalParams, url = options.url, id = options.id, query = options.query, meta = options.meta, params = options.params, config = options.config;

            if (!replay) {
              dispatch({
                type: ACTIONS.PENDING,
                payload: {
                  id: id,
                  query: query,
                  meta: meta,
                  code: -1
                }
              });
            }

            if (!isRefreshing()) {
              _context2.next = 7;
              break;
            }

            addToQueue(options, 'get');
            _context2.next = 17;
            break;

          case 7:
            _context2.prev = 7;
            _context2.next = 10;
            return fetch(url(id, query, meta), getParams(getState(), globalParams, _objectSpread({
              method: 'GET'
            }, params), config));

          case 10:
            response = _context2.sent;
            handleResponse$1(response, options);
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](7);
            handleResponse$1({}, options);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 14]]);
  }));
  return _ref.apply(this, arguments);
}

function dispatchErrors$1(dispatch, response, action) {
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

function dispatchSuccess$1(dispatch, code, value, permissions, action) {
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

var getParams$1 = function getParams(store, globalParams, params) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var authKey = config.authKey,
      authExtractor = config.authExtractor;
  return _objectSpread({}, globalParams, params, {
    headers: _objectSpread({}, globalParams.headers ? globalParams.headers : {}, params.headers ? params.headers : {}, authKey && authExtractor ? _defineProperty({}, authKey, authExtractor(store)) : {})
  });
};

var CONTENT_TYPE = 'application/JSON';
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
          regenerator.mark(function _callee(dispatch, getState) {
            var response, data, _data;

            return regenerator.wrap(function _callee$(_context) {
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
                    return fetch(url(query, meta), getParams$1(getState(), globalParams, _objectSpread({
                      method: 'GET'
                    }, params), config));

                  case 4:
                    response = _context.sent;

                    if (response.status) {
                      _context.next = 9;
                      break;
                    }

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
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
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      query: query,
                      error: _data.error
                    });
                    _context.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      query: query
                    });

                  case 24:
                    _context.next = 29;
                    break;

                  case 26:
                    _context.prev = 26;
                    _context.t0 = _context["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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

  var get = function get(url, ACTIONS) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (id, query, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref5 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee2(dispatch, getState) {
            return regenerator.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return getAction({
                      ACTIONS: ACTIONS,
                      url: url,
                      id: id,
                      query: query,
                      meta: meta,
                      params: params,
                      globalParams: globalParams,
                      config: config,
                      dispatch: dispatch,
                      getState: getState
                    });

                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function (_x3, _x4) {
            return _ref5.apply(this, arguments);
          };
        }()
      );
    };
  };

  var put = function put(url, _ref6) {
    var PENDING = _ref6.PENDING,
        SUCCESS = _ref6.SUCCESS,
        FAILURE = _ref6.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref7 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee3(dispatch, getState) {
            var response, data, _data2;

            return regenerator.wrap(function _callee3$(_context3) {
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
                    return fetch(url(id, value, meta), getParams$1(getState(), globalParams, _objectSpread({
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

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
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
                    _data2 = _context3.sent;
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id,
                      error: _data2.error
                    });
                    _context3.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context3.next = 29;
                    break;

                  case 26:
                    _context3.prev = 26;
                    _context3.t0 = _context3["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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
            return _ref7.apply(this, arguments);
          };
        }()
      );
    };
  };

  var post = function post(url, _ref8) {
    var PENDING = _ref8.PENDING,
        SUCCESS = _ref8.SUCCESS,
        FAILURE = _ref8.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref9 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee4(dispatch, getState) {
            var response, data, _data3;

            return regenerator.wrap(function _callee4$(_context4) {
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
                    return fetch(url(id, value, meta), getParams$1(getState(), globalParams, _objectSpread({
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

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
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
                    _data3 = _context4.sent;
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id,
                      error: _data3.error
                    });
                    _context4.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context4.next = 29;
                    break;

                  case 26:
                    _context4.prev = 26;
                    _context4.t0 = _context4["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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
            return _ref9.apply(this, arguments);
          };
        }()
      );
    };
  };

  var patch = function patch(url, _ref10) {
    var PENDING = _ref10.PENDING,
        SUCCESS = _ref10.SUCCESS,
        FAILURE = _ref10.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (patchId, id, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref11 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee5(dispatch, getState) {
            var response, data, _data4;

            return regenerator.wrap(function _callee5$(_context5) {
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
                    return fetch(url(id, value, meta), getParams$1(getState(), globalParams, _objectSpread({
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

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, {
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
                    _data4 = _context5.sent;
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id,
                      patchId: patchId,
                      error: _data4.error
                    });
                    _context5.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id,
                      patchId: patchId
                    });

                  case 24:
                    _context5.next = 29;
                    break;

                  case 26:
                    _context5.prev = 26;
                    _context5.t0 = _context5["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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
            return _ref11.apply(this, arguments);
          };
        }()
      );
    };
  };

  var remove = function remove(url, _ref12) {
    var PENDING = _ref12.PENDING,
        SUCCESS = _ref12.SUCCESS,
        FAILURE = _ref12.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return function (id, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref13 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee6(dispatch, getState) {
            var response, data, _data5;

            return regenerator.wrap(function _callee6$(_context6) {
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
                    return fetch(url(id, meta), getParams$1(getState(), globalParams, _objectSpread({
                      method: 'DELETE'
                    }, params), config));

                  case 4:
                    response = _context6.sent;

                    if (response.status) {
                      _context6.next = 9;
                      break;
                    }

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, {}, {}, SUCCESS, {
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
                    _data5 = _context6.sent;
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id,
                      error: _data5.error
                    });
                    _context6.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      id: id
                    });

                  case 24:
                    _context6.next = 29;
                    break;

                  case 26:
                    _context6.prev = 26;
                    _context6.t0 = _context6["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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
            return _ref13.apply(this, arguments);
          };
        }()
      );
    };
  };

  var removeAll = function removeAll(url, _ref14) {
    var PENDING = _ref14.PENDING,
        SUCCESS = _ref14.SUCCESS,
        FAILURE = _ref14.FAILURE;
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var raw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return function (id, ids, value, meta) {
      return (
        /*#__PURE__*/
        function () {
          var _ref15 = _asyncToGenerator(
          /*#__PURE__*/
          regenerator.mark(function _callee7(dispatch, getState) {
            var response, data, _data6;

            return regenerator.wrap(function _callee7$(_context7) {
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
                    return fetch(url(ids, value, meta), getParams$1(getState(), globalParams, _objectSpread({
                      method: 'DELETE',
                      body: raw ? value : JSON.stringify(value)
                    }, params), config));

                  case 4:
                    response = _context7.sent;

                    if (response.status) {
                      _context7.next = 9;
                      break;
                    }

                    dispatchErrors$1(dispatch, null, FAILURE, {
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
                    dispatchSuccess$1(dispatch, response.status, {}, {}, SUCCESS, {
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
                    _data6 = _context7.sent;
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      ids: ids,
                      id: id,
                      error: _data6.error
                    });
                    _context7.next = 24;
                    break;

                  case 23:
                    dispatchErrors$1(dispatch, response, FAILURE, {
                      ids: ids,
                      id: id
                    });

                  case 24:
                    _context7.next = 29;
                    break;

                  case 26:
                    _context7.prev = 26;
                    _context7.t0 = _context7["catch"](1);
                    dispatchErrors$1(dispatch, null, FAILURE, {
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
            return _ref15.apply(this, arguments);
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
exports.utils = getTimestamp;
exports.defaults = defaultState;
exports.errors = ERRORS;
