import { defaultItem } from '../defaults';
import { changeMeta } from '../utils';
import {
  ITEMS, PATCHES, STATES, STATE, VERBS, DATA, ERROR
} from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW, checkItemsMW, checkIdMW, checkValueObjectMW, checkCodeMW
} from '../middlewares/errors';

export const patch = applyMiddleware((state, { patchId, value } = {}) => {
  const item = defaultItem;

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [patchId]: {
        ...item,
        ...changeMeta(STATES.PENDING, VERBS.PATCH, -1),
      },
    },
  };
}, [checkStateMW]);

export const patchSuccess = applyMiddleware((state, { id, patchId, value, code } = {}) => {
  const item = state[PATCHES][patchId];

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [patchId]: {
        ...item,
        [DATA]: value,
        ...changeMeta(STATES.SYNCED, VERBS.PATCH, code, null),
      },
    },
    [ITEMS]: {
      ...state[ITEMS],
      [id]: {
        ...state[ITEMS][id],
        ...changeMeta(STATES.STALE, VERBS.PATCH)
      },
    },
  };
}, [checkStateMW]);

export const patchFailure = applyMiddleware((state, { id, patchId, code, error } = {}) => {
  const item = state[ITEMS][id];

  return {
    ...state,
    [PATCHES]: {
      ...state[PATCHES],
      [patchId]: {
        ...item,
        ...changeMeta(STATES.FAILED, VERBS.PATCH, code, error),
      },
    },
  };
}, [checkCodeMW, checkIdMW, checkItemsMW, checkStateMW]);
