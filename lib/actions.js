import uuid from 'uuid/v1';
import ERRORS from './errors';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function dispatchErrors(dispatch, response, action, payload = {}) {
  const code = response ? response.status : 0;
  const actions = action ? (Array.isArray(action) ? [...action, ERRORS[code]] : [action, ERRORS[code]]) : [ERRORS[code]];

  actions.forEach(action => {
    if (action) {
      dispatch({
        type: action,
        payload: {
          ...payload,
          code,
        },
      });
    }
  });
}

function dispatchSuccess(dispatch, code, value, action, payload = {}) {
  const actions = Array.isArray(action) ? action : [action];

  actions.forEach(action => {
    if (action) {
      dispatch({
        type: action,
        payload: {
          ...payload,
          value,
          code,
        },
      });
    }
  });
}

const getParams = function(store, globalParams, params, config = {}) {
  const {  authKey, authExtractor } = config;

  return {
    ...globalParams,
    ...params,
    headers: {
      ...(globalParams.headers ? globalParams.headers : {}),
      ...(params.headers ? params.headers : {}),
      ...(authKey && authExtractor ? { [authKey]: authExtractor(store) } : {})
    },
  };
}

const CONTENT_TYPE = "application/JSON"

export default function (globalParams = {}, config = {}) {
  const getAll = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => (query) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { query, code: -1 }
    });

    try {
      const response = await fetch(url(query), getParams(getState(), globalParams, {
        method: 'GET',
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, data.value, SUCCESS, { query });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { query, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { query });
    }
  };

  const get = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => (id, query) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, query, code: -1 }
    });

    try {
      const response = await fetch(url(id, query), getParams(getState(), globalParams, {
        method: 'GET',
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, data.value, SUCCESS, { id, query });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, query, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id, query });
    }
  };
  const put = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params= {}, raw = false) => (id, value) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, value, code: -1 },
    });

    try {
      const response = await fetch(url(id), getParams(getState(), globalParams, {
        method: 'PUT',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, data.value, SUCCESS, { id });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  const post = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}, raw = false) => (id, value) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, value, code: -1 },
    });

    try {
      const response = await fetch(url(id, value), getParams(getState(), globalParams, {
        method: 'POST',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, data.value, SUCCESS, { id });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  const patch = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}, raw = false) => (patchId, id, value) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, patchId, value, code: -1 },
    });

    try {
      const response = await fetch(url(id), getParams(getState(), globalParams, {
        method: 'PATCH',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, data.value, SUCCESS, { id, patchId });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, patchId, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id, patchId });
    }
  };

  const remove = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => id => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      headers: {
        'Content-Type': CONTENT_TYPE,
      },
      payload: { id, code: -1 },
    });

    try {
      const response = await fetch(url(id), getParams(getState(), globalParams, {
        method: 'DELETE',
        ...params,
      }, config));
      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        dispatchSuccess(dispatch, response.status, {}, SUCCESS, { id });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, error: data.message });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  return {
    getAll,
    get,
    put,
    post,
    patch,
    remove,
  };
}
