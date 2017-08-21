import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import { ITEMS, STATES, VERBS, DATA, ERROR } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';

export const put = applyMiddleware((state, { id } = {}) => {
  const item = state[ITEMS][id] || defaultItem;

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.PUT),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const putSuccess = applyMiddleware((state, { id, code, etag } = {}) => {
  const item = state[ITEMS][id];

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.SYNCED, VERBS.PUT, code, null, etag),
      },
    },
  };
}, [checkIdMW, checkItemsMW, checkStateMW]);

export const putFailure = applyMiddleware((state, { id, code } = {}) => {
  const item = state[ITEMS][id];

  return {
    ...state,
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...item,
        ...changeMeta(STATES.FAILED, VERBS.PUT),
      },
    },
  };
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);
