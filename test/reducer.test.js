import reducer from '../lib/reducer';
import { defaultState, defaultItem } from '../lib/defaults';
import {
  ITEMS, STATES, VERBS, STATE, VERB, DATA, ERROR, CODE, TIMESTAMP,
} from '../lib/constants';

const actions = {
  GET: 'GET',
  GET_SUCCESS: 'GET_SUCCESS',
  GET_FAILURE: 'GET_FAILURE',
  GETALL: 'GETALL',
};

const testReducer = reducer(actions);

test('reducer with no action match', () => {
  expect(
    testReducer(defaultState, {
      type: 'RANDOM',
    }),
  ).toBe(defaultState);
});

test('reducer with get action', () => {
  expect(
    () => testReducer(defaultState, {
      type: actions.GET,
    })
  ).toThrow('Expected id to be string or number');

  expect(
    testReducer(defaultState, {
      type: actions.GET,
      payload: {
        id: 1,
      },
    }),
  ).toEqual({
    ...defaultState,
    [ITEMS]: {
      ...defaultState[ITEMS],
      1: {
        ...defaultItem,
        [STATE]: STATES.PENDING,
        [VERB]: VERBS.GET,
        [CODE]: null,
        [ERROR]: null,
        [TIMESTAMP]: 9999,
        isLoading: true,
        isLoaded: false,
        isLoadingFailed: false,
      },
    },
  });
});

test('reducer with getSuccess action', () => {
  expect(
    () => testReducer(defaultState, {
      type: actions.GET_SUCCESS,
    })
  ).toThrow('Expected id to be string or number');

  expect(
    () => testReducer(defaultState, {
      type: actions.GET_SUCCESS,
      payload: { id: 1 },
    })
  ).toThrow('Expected value to be an object');

  expect(
    testReducer(defaultState, {
      type: actions.GET_SUCCESS,
      payload: {
        id: 1,
        value: {
          id: 1,
          name: 'one',
        },
        code: 200,
      },
    }),
  ).toEqual({
    ...defaultState,
    [ITEMS]: {
      ...defaultState[ITEMS],
      1: {
        [DATA]: {
          id: 1,
          name: 'one',
        },
        [STATE]: STATES.SYNCED,
        [VERB]: VERBS.GET,
        [CODE]: 200,
        [ERROR]: null,
        [TIMESTAMP]: 9999,
        isLoading: false,
        isLoaded: true,
        isLoadingFailed: false,
      },
    },
  });
});

test('reducer with getFailure action', () => {
  expect(
    () => testReducer(defaultState, {
      type: actions.GET_FAILURE,
    })
  ).toThrow('Expected id to be string or number');

  expect(
    () => testReducer(defaultState, {
      type: actions.GET_FAILURE,
      payload: { id: 1 },
    })
  ).toThrow('Expected code to be a number');

  expect(
    testReducer(defaultState, {
      type: actions.GET_FAILURE,
      payload: {
        id: 1,
        item: {
          id: 1,
          name: 'one',
        },
        code: 404,
        error: 'Not found'
      },
    }),
  ).toEqual({
    ...defaultState,
    [ITEMS]: {
      ...defaultState[ITEMS],
      1: {
        ...defaultItem,
        [STATE]: STATES.FAILED,
        [VERB]: VERBS.GET,
        [CODE]: 404,
        [ERROR]: 'Not found',
        [TIMESTAMP]: 9999,
        isLoading: false,
        isLoaded: false,
        isLoadingFailed: true,
      },
    },
  });
});
