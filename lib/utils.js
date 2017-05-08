import {
  STATES, VERBS, STATE, VERB, TIMESTAMP, ERROR, CODE
} from './constants';

export function getTimestamp() {
  return process.env.NODE_ENV === 'test' ? 9999 : Date.now();
}

export function changeMeta(state, verb, code, error) {
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
  };
}
