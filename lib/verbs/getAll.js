import { stringify } from 'querystring';
import { defaultList } from '../defaults';
import { changeMeta } from '../utils';
import { LIST, STATES, VERBS, DATA, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW,
  checkItemsMW,
  checkListMW,
  checkIdMW,
  checkValueArrayMW,
  checkItemDataMW,
  checkCodeMW
} from '../middlewares/errors';

export const getAll = applyMiddleware((state, { query } = {}) => {
  const qs = stringify(query);
  const list = state[LIST][qs] || defaultList;

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        ...list,
        ...changeMeta(STATES.PENDING, VERBS.GET),
      },
    },
  };
}, [checkListMW, checkStateMW]);

export const getAllSuccess = applyMiddleware((state, { query, value, code } = {}) => {
  const qs = stringify(query);

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        [DATA]: value,
        ...changeMeta(STATES.SYNCED, VERBS.GET, code || 200),
      },
    },
  };
}, [checkValueArrayMW, checkListMW, checkStateMW]);
