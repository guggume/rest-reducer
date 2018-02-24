import { sortedStringify } from '../helpers';
import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, PERMISSIONS, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkCodeMW
} from '../middlewares/errors';

export const get = applyMiddleware((state, { id, query } = {}) => {
  const qs = query ? `${id}::${sortedStringify(query)}` : id;
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
  (state, { id, query, value, permissions, code, etag } = {}) => ({
  ...state,
  [ITEMS]: {
    ...state[ITEMS],
    [query ? `${id}::${sortedStringify(query)}` : id]: {
      [DATA]: value,
      [PERMISSIONS]: permissions,
      ...changeMeta(STATES.SYNCED, VERBS.GET, code),
    },
  },
}), [checkIdMW, checkItemsMW, checkStateMW]);

export const getFailure = applyMiddleware(
  (state, { id, query, code, error } = {}) => {
  const qs = query ? `${id}::${sortedStringify(query)}` : id;
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
