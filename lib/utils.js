import { sortedStringify } from './helpers';
import {
  LIST, ITEMS, STATES, VERBS, STATE, VERB, TIMESTAMP, ERROR, CODE, ETAG
} from './constants';

export function getTimestamp() {
  if (process.env && process.env.NODE_ENV === 'test') {
    return 9999;
  }
  return Date.now();
}

export function changeStateHelper(state, verb) {
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
    isStale: state === STATES.STALE,
  };
}

export function changeMeta(state, verb, code, error) {
  if (!state || !STATES[state]) {
    throw new Error('Expected state to be enum of `STATES` constants');
  }

  if (code && typeof code !== 'number') {
    throw new Error('Expected code to be a number');
  }

  return {
    [STATE]: state,
    [VERB]: verb,
    [CODE]: code || null,
    [TIMESTAMP]: getTimestamp(),
    [ERROR]: error || null,
    ...changeStateHelper(state, verb),
  };
}

function changeListToStale(state) {
  const list = {};

  for(let key in state[LIST]) {
    list[key] = {
      ...state[LIST][key],
      ...changeMeta(STATES.STALE)
    };
  }

  return {
    ...state,
    [LIST]: list
  };
}

function changeItemToStale(state, id, query) {
  const qs = query ? `${id}::${sortedStringify(query)}` : id;
  const item = state[ITEMS][qs];

  if (!item) {
    return state;
  }

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [qs]: {
        ...item,
        ...changeMeta(STATES.STALE)
      }
    }
  };
}

export default {
  changeListToStale,
  changeItemToStale
};
