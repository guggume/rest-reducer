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

const getAll = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params = {}) => (query) => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { query, code: -1 }
  });

  try {
    const response = await fetch(url(query), params);
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
}, params = {}) => (id, query) => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { id, query, code: -1 }
  });

  try {
    const response = await fetch(url(id, query), params);
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
}, params= {}) => (id, value) => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { id, value, code: -1 },
  });

  try {
    const response = await fetch(url(id), {
      ...params,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(params.headers ? params.headers : {}),
      },
      body: JSON.stringify(value),
    });
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
}, params = {}, raw = false) => (id, value) => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { id, value, code: -1 },
  });

  try {
    const response = await fetch(url(id, value), {
      ...params,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(params.headers ? params.headers : {}),
      },
      body: raw ? value : JSON.stringify(value),
    });
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
}, params = {}) => (patchId, id, value) => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { id, patchId, value, code: -1 },
  });

  try {
    const response = await fetch(url(id), {
      ...params,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(params.headers ? params.headers : {}),
      },
      body: JSON.stringify(value),
    });
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
}, params = {}) => id => async(dispatch) => {
  dispatch({
    type: PENDING,
    payload: { id, code: -1 },
  });

  try {
    const response = await fetch(url(id), {
      ...params,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(params.headers ? params.headers : {}),
      }
    });
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

export default {
  getAll, get, put, post, patch, remove,
}
