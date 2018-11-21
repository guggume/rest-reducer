import uuid from 'uuid/v1';
import ERRORS from './errors';
import { isArray, isObject } from './helpers';

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

function dispatchSuccess(dispatch, code, value, permissions, action, payload = {}) {
  const actions = Array.isArray(action) ? action : [action];

  actions.forEach(action => {
    if (action) {
      dispatch({
        type: action,
        payload: {
          ...payload,
          value,
          permissions,
          code,
        },
      });
    }
  });
}

const getParams = function(store, globalParams, params, config = {}) {
  const { authKey, authExtractor } = config;

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
  const mergeAll = ({ MERGE_ALL }) => (items, primaryKey) => dispatch => {
    if (!primaryKey) {
      throw new Error('mergeAll requires primary key for merging');
    }

    if (isArray(items) || isObject(items)) {
      dispatch({
        type: MERGE_ALL,
        payload: {
          value: items,
          primaryKey,
        },
      });
    } else {
      throw new Error('mergeAll requires items to be an Array or An Object');
    }
  };

  const getAll = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => (query, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { query, meta, code: -1 }
    });

    try {
      const response = await fetch(url(query, meta), getParams(getState(), globalParams, {
        method: 'GET',
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { query });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(
          dispatch, response.status, data.value, data.permissions || {}, SUCCESS, { query }
        );
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { query, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { query });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { query });
    }
  };

  const get = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => (id, query, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, query, meta, code: -1 }
    });

    try {
      const response = await fetch(url(id, query, meta), getParams(getState(), globalParams, {
        method: 'GET',
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { id, query });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(
          dispatch, response.status, data.value, data.permissions || {}, SUCCESS, { id, query }
        );
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { id, query, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, query });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id, query });
    }
  };
  const put = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params= {}, raw = false) => (id, value, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, value, meta, code: -1 },
    });

    try {
      const response = await fetch(url(id, value, meta), getParams(getState(), globalParams, {
        method: 'PUT',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { id });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, { id });
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { id, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  const post = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}, raw = false) => (id, value, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, value, meta, code: -1 },
    });

    try {
      const response = await fetch(url(id, value, meta), getParams(getState(), globalParams, {
        method: 'POST',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { id });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, { id });
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { id, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  const patch = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}, raw = false) => (patchId, id, value, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      payload: { id, patchId, value, meta, code: -1 },
    });

    try {
      const response = await fetch(url(id, value, meta), getParams(getState(), globalParams, {
        method: 'PATCH',
        headers: {
          'Content-Type': CONTENT_TYPE,
        },
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { id, patchId });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(dispatch, response.status, data.value, data.permissions || {}, SUCCESS, { id, patchId });
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { id, patchId, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id, patchId });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id, patchId });
    }
  };

  const remove = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}) => (id, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      headers: {
        'Content-Type': CONTENT_TYPE,
      },
      payload: { id, meta, code: -1 },
    });

    try {
      const response = await fetch(url(id, meta), getParams(getState(), globalParams, {
        method: 'DELETE',
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { id });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(dispatch, response.status, {}, {}, SUCCESS, { id });
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { id, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { id });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { id });
    }
  };

  const removeAll = (url, {
    PENDING,
    SUCCESS,
    FAILURE,
  }, params = {}, raw = false) => (id, ids, value, meta) => async(dispatch, getState) => {
    dispatch({
      type: PENDING,
      headers: {
        'Content-Type': CONTENT_TYPE,
      },
      payload: { id, ids, value, meta, code: -1 },
    });

    try {
      const response = await fetch(url(ids, value, meta), getParams(getState(), globalParams, {
        method: 'DELETE',
        body: raw ? value : JSON.stringify(value),
        ...params,
      }, config));

      if (!response.status) {
        dispatchErrors(dispatch, null, FAILURE, { ids, id });
      } else if (response.status >= 200 && response.status < 300) {
        const data = await response.json();

        dispatchSuccess(dispatch, response.status, {}, {}, SUCCESS, { ids, id });
      } else if (response.status >= 400 && response.status < 500) {
        const data = await response.json();

        dispatchErrors(dispatch, response, FAILURE, { ids, id, error: data.error });
      } else {
        dispatchErrors(dispatch, response, FAILURE, { ids, id });
      }
    } catch(e) {
      dispatchErrors(dispatch, null, FAILURE, { ids, id });
    }
  };

  return {
    mergeAll,
    getAll,
    get,
    put,
    post,
    patch,
    remove,
    removeAll,
  };
}
