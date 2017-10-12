import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';

export const get = applyMiddleware((state, { id } = {}) => {
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
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const getSuccess = applyMiddleware(
  (state, { id, value, code, etag } = {}) => ({
  ...state,
  [ITEMS]: {
    ...state[ITEMS],
    [id]: {
      [DATA]: value,
      ...changeMeta(STATES.SYNCED, VERBS.GET, code || 200),
    },
  },
}), [checkValueObjectMW, checkIdMW, checkItemsMW, checkStateMW]);

export const getFailure = applyMiddleware(
  (state, { id, code, error } = {}) => {
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
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);
