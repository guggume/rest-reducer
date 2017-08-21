import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';
import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, ERROR } from '../constants';

export const remove = applyMiddleware((state, { id }) => {
  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.DELETE),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const removeSuccess = applyMiddleware((state, { id, code } = {}) => {
  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.SYNCED, VERBS.DELETE, code || 200),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const removeFailure = applyMiddleware((state, { id, code } = {}) => {
  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.FAILED, VERBS.DELETE, code),
      },
    },
  };
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);
