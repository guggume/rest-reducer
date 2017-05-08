import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { isObject, isStringLike } from '../helpers';
import { ITEMS, STATES, VERBS, DATA, ERROR } from '../constants';

export function get(state, { id } = {}) {
  if (!state) {
    throw new Error('Expected state to be an object');
  }

  if (!isObject(state[ITEMS])) {
    throw new Error('Expected state to have `items` object');
  }

  if (!isStringLike(id)) {
    throw new Error('Expected id to be string or number');
  }

  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.GET),
      },
    },
  };
}

export function getSuccess(state, { id, item, code } = {}) {
  if (!state) {
    throw new Error('Expected state to be an object');
  }

  if (!isObject(state[ITEMS])) {
    throw new Error('Expected state to have `items` object');
  }

  if (!isStringLike(id)) {
    throw new Error('Expected id to be string or number');
  }

  if (!isObject(item)) {
    throw new Error('Expected item to be an object');
  }

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        [DATA]: item,
        ...changeMeta(STATES.SYNCED, VERBS.GET, code || 200),
      },
    },
  };
}

export function getFailure(state, { id, code, error } = {}) {
  if (!state) {
    throw new Error('Expected state to be an object');
  }

  if (!isObject(state[ITEMS])) {
    throw new Error('Expected state to have `items` object');
  }

  if (!isStringLike(id)) {
    throw new Error('Expected id to be string or number');
  }

  if (isNaN(code)) {
    throw new Error('Expected code to be a number');
  }

  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        [ERROR]: error,
        ...changeMeta(STATES.FAILED, VERBS.GET, code, error || 'Error'),
      },
    },
  };
}
