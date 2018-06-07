import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';
import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { PATCHES, STATES, VERBS, DATA, ERROR } from '../constants';

export const removeAll = applyMiddleware((state, { id, ids }) => {
  const item = state[PATCHES][id] || defaultItem;

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [id]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.DELETE, -1),
      },
    },
  };
}, [checkStateMW]);

export const removeAllSuccess = applyMiddleware((state, { id, ids, code } = {}) => {
  const item = state[PATCHES][id] || defaultItem;

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [id]: {
        ...item,
        ...changeMeta(STATES.SYNCED, VERBS.DELETE, code),
      },
    },
  };
}, [checkStateMW]);

export const removeAllFailure = applyMiddleware((state, { id, code, error } = {}) => {
  const item = state[PATCHES][id] || defaultItem;

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [id]: {
        ...item,
        ...changeMeta(STATES.FAILED, VERBS.DELETE, code, error),
      },
    },
  };
}, [checkStateMW]);
