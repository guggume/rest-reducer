import { sortedStringify } from '../helpers';
import { defaultList } from '../defaults';
import { changeMeta } from '../utils';
import { LIST, STATES, VERBS, DATA, PERMISSIONS, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW,
  checkItemsMW,
  checkListMW,
  checkIdMW,
  checkItemDataMW,
  checkCodeMW
} from '../middlewares/errors';

export const getAll = applyMiddleware((state, { query } = {}) => {
  const qs = sortedStringify(query);
  const list = state[LIST][qs] || defaultList;

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        ...list,
        ...changeMeta(STATES.PENDING, VERBS.GET, -1),
      },
    },
  };
}, [checkListMW, checkStateMW]);

export const getAllSuccess = applyMiddleware((state, { query, value, permissions, code } = {}) => {
  const qs = sortedStringify(query);

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        [DATA]: value,
        [PERMISSIONS]: permissions,
        ...changeMeta(STATES.SYNCED, VERBS.GET, code),
      },
    },
  };
}, [checkListMW, checkStateMW]);

export const getAllFailure = applyMiddleware((state, { query, code, error } = {}) => {
  const qs = sortedStringify(query);
  const list = state[LIST][qs] || defaultList;

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        ...list,
        ...changeMeta(STATES.FAILED, VERBS.GET, code, error),
      },
    },
  };
}, [checkListMW, checkStateMW]);
