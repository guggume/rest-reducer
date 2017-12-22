import uuid from 'uuid/v1';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const getAll = (url, {
  PENDING,
  SUCCESS,
}, params = {}) => (query) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { query }
  });

  fetch(url(query), params)
  .then(checkStatus)
  .then(response => {
    response.json().then(data => {
      dispatch({
        type: SUCCESS,
        payload: {
          query: query,
          value: data.value,
          code: response.status,
        },
      });
    });
  });
};

const get = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params = {}) => id => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id }
  });

  fetch(url(id), params)
    .then(checkStatus)
    .then(response => {
      response.json().then(data => {
        dispatch({
          type: SUCCESS,
          payload: {
            id,
            code: response.status,
            value: data.value,
          },
        });
      });
    }).catch(({ response }) => {
      response.json().then(data => {
        dispatch({
          type: FAILURE,
          payload: {
            id,
            code: response.status,
            error: data.message,
          }
        });
      });
    });
};

const put = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params= {}) => (id, value) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id, value },
  });

  fetch(url(id), {
    ...params,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(params.headers ? params.headers : {}),
    },
    body: JSON.stringify(value),
  })
  .then(checkStatus)
  .then(response => {
    response.json().then(data => {
      dispatch({
        type: SUCCESS,
        payload: {
          id,
          value: data.value,
          code: response.status,
        },
      });
    });
  })
  .catch(({ response }) => {
    response.json().then(data => {
      dispatch({
        type: FAILURE,
        payload: {
          id,
          code: response.status,
          error: data.message,
        }
      });
    });
  });
};

const post = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params = {}) => (id, value) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id, value },
  });

  fetch(url(id, value), {
    ...params,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(params.headers ? params.headers : {}),
    },
    body: JSON.stringify(value),
  })
  .then(checkStatus)
  .then(response => {
    response.json().then(data => {
      dispatch({
        type: SUCCESS,
        payload: {
          id,
          value: data.value,
          code: response.status,
        },
      });
    });
  });
};

const patch = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params = {}) => (id, value) => dispatch => {
  const patchId = uuid();

  dispatch({
    type: PENDING,
    payload: { id, patchId, value },
  });

  fetch(url(id, value), {
    ...params,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(params.headers ? params.headers : {}),
    },
    body: JSON.stringify(value),
  })
  .then(checkStatus)
  .then(response => {
    response.json().then(data => {
      dispatch({
        type: SUCCESS,
        payload: {
          id,
          patchId,
          value: data.value,
          code: response.status,
        },
      });
    });
  })
  .catch(({ response }) => {
    response.json().then(data => {
      dispatch({
        type: FAILURE,
        payload: {
          id,
          patchId,
          code: response.status,
          error: data.message,
        }
      });
    });
  });

  return patchId;
};

const remove = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}, params = {}) => id => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id },
  });

  fetch(url(id), {
    ...params,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(params.headers ? params.headers : {}),
    },
  })
  .then(checkStatus)
  .then(response => {
    dispatch({
      type: SUCCESS,
      payload: { id, code: response.status },
    });
  })
  .catch(({ response }) => {
    response.json().then(data => {
      dispatch({
        type: FAILURE,
        payload: {
          id,
          code: response.status,
          error: data.message,
        }
      });
    });
  });
};

export default {
  getAll, get, put, post, patch, remove,
}
