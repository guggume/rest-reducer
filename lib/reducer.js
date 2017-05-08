import { defaultState } from './defaults';
import { get, getSuccess, getFailure } from './verbs/get';

export default function reducer({
  GET,
  GET_SUCCESS,
  GET_FAILURE,
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
    switch (type) {
      case GET:
        return get(state, payload);
      case GET_SUCCESS:
        return getSuccess(state, payload);
      case GET_FAILURE:
        return getFailure(state, payload);
      default:
        return cReducer ? cReducer(state, { type, payload }) : state;
    }
  };
}
