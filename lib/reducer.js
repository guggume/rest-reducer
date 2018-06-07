import { defaultState } from './defaults';
import { get, getSuccess, getFailure } from './verbs/get';
import { getAll, getAllSuccess, getAllFailure } from './verbs/getAll';
import { post, postSuccess, postFailure } from './verbs/post';
import { put, putSuccess, putFailure } from './verbs/put';
import { patch, patchSuccess, patchFailure } from './verbs/patch';
import { remove, removeSuccess, removeFailure } from './verbs/delete';
import { removeAll, removeAllSuccess, removeAllFailure } from './verbs/deleteAll';

export default function reducer({ FLUSH_ACTIONS } = {
  FLUSH_ACTIONS: [],
}) {
  return function({
    GET, GET_SUCCESS, GET_FAILURE,
    GET_ALL, GET_ALL_SUCCESS, GET_ALL_FAILURE,
    POST, POST_SUCCESS, POST_FAILURE,
    PUT, PUT_SUCCESS, PUT_FAILURE,
    PATCH, PATCH_SUCCESS, PATCH_FAILURE,
    DELETE, DELETE_SUCCESS, DELETE_FAILURE,
    DELETE_ALL, DELETE_ALL_SUCCESS, DELETE_ALL_FAILURE,
  }, initialState = defaultState, customReducer) {
    let iState = initialState;
    let cReducer = customReducer;

    // initialState should be either function or object
    // if it's function it will be used as customReducer
    // and initialState with defaultState

    if (typeof iState === 'function') {
      cReducer = initialState;
      iState = defaultState;
    } else if (typeof iState !== 'object') {
      // throw error;
    }

    // type is an action string
    // payload is data passed with action
    return (state = iState, { type, payload }) => {
      if (FLUSH_ACTIONS.includes(type)) {
        return defaultState;
      }

      switch (type) {
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
          return cReducer ? cReducer(state, { type, payload }) : state;
      }
    };
  };
}
