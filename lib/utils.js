import {
  STATES, VERBS, STATE, VERB, TIMESTAMP, ERROR, CODE, ETAG
} from './constants';

export function getTimestamp() {
  return process.env.NODE_ENV === 'test' ? 9999 : Date.now();
}

function changeStateHelper(state, verb) {
  return {
    isLoading: state === STATES.PENDING && verb === VERBS.GET,
    isLoaded: state === STATES.SYNCED && verb === VERBS.GET,
    isLoadFailed: state === STATES.FAILED && verb === VERBS.GET,
    isCreating: state === STATES.PENDING && verb === VERBS.POST,
    isCreated: state === STATES.SYNCED && verb === VERBS.POST,
    isCreateFailed: state === STATES.FAILED && verb === VERBS.POST,
    isUpdating: state === STATES.PENDING && verb === VERBS.PUT,
    isUpdated: state === STATES.SYNCED && verb === VERBS.PUT,
    isUpdateFailed: state === STATES.FAILED && verb === VERBS.PUT,
    isDeleting: state === STATES.PENDING && verb === VERBS.DELETE,
    isDeleted: state === STATES.SYNCED && verb === VERBS.DELETE,
    isDeleteFailed: state === STATES.FAILED && verb === VERBS.DELETE,
  };
}

export function changeMeta(state, verb, code, error, etag) {
  if (!state || !STATES[state]) {
    throw new Error('Expected state to be enum of `STATES` constants');
  }

  if (!verb || !VERBS[verb]) {
    throw new Error('Expected state to be enum of `VERBS` constants');
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
    ...(etag ? { [ETAG] : etag } : {}),
    ...changeStateHelper(state, verb),
  };
}
