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
}) => (query) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { query }
  });

  fetch(url(query))
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
}) => id => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id }
  });

  fetch(url(id))
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
            error: data.error,
          }
        });
      });
    });
};

const put = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}) => (id, value) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id, value },
  });

  fetch(url(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
          error: data.error,
        }
      });
    });
  });
};

const post = (url, {
  PENDING,
  SUCCESS,
  FAILURE,
}) => (id, value) => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id, value },
  });

  fetch(url(id, value), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
}) => (id, value) => dispatch => {
  const patchId = uuid();

  dispatch({
    type: PENDING,
    payload: { id, patchId, value },
  });

  fetch(url(id, value), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
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
          error: data.error,
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
}) => id => dispatch => {
  dispatch({
    type: PENDING,
    payload: { id },
  });

  fetch(url(id), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
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
          error: data.error,
        }
      });
    });
  });
};

export default {
  getAll, get, put, post, remove,
}
