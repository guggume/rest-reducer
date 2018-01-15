import { stringify } from 'query-string';
import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';

export const get = applyMiddleware((state, { id, query } = {}) => {
  const qs = query ? `${id}::${stringify(query)}` : id;
  const item = state[ITEMS][qs] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [qs]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.GET, -1),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const getSuccess = applyMiddleware(
  (state, { id, query, value, code, etag } = {}) => ({
  ...state,
  [ITEMS]: {
    ...state[ITEMS],
    [query ? `${id}::${stringify(query)}` : id]: {
      [DATA]: value,
      ...changeMeta(STATES.SYNCED, VERBS.GET, code),
    },
  },
}), [checkValueObjectMW, checkIdMW, checkItemsMW, checkStateMW]);

export const getFailure = applyMiddleware(
  (state, { id, query, code, error } = {}) => {
  const qs = query ? `${id}::${stringify(query)}` : id;
  const item = state[ITEMS][qs] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [qs]: {
        ...item,
        [ERROR]: error,
        ...changeMeta(STATES.FAILED, VERBS.GET, code, error),
      },
    },
  };
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);
