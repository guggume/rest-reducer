import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, PERMISSIONS, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';

export const post = applyMiddleware((state, { id } = {}) => {
  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.POST, -1),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const postSuccess = applyMiddleware((state, { id, value, permissions, code } = {}) => {
  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        [DATA]: value,
        [PERMISSIONS]: permissions,
        ...changeMeta(STATES.SYNCED, VERBS.POST, code),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const postFailure = applyMiddleware((state, { id, code, error } = {}) => {
  const item = state[ITEMS][id];

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.FAILED, VERBS.POST, code, error),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);
