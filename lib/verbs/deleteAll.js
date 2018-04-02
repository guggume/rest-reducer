import { defaultItem } from "../defaults";
import { changeMeta } from "../utils";
import { ITEMS, STATES, VERBS, DATA, ERROR } from "../constants";
import applyMiddleware from "../middleware";
import {
  checkStateMW,
  checkItemsMW,
  checkIdMW,
  checkValueObjectMW,
  checkCodeMW
} from "../middlewares/errors";

export const removeAll = applyMiddleware(
  (state, { id } = {}) => {
    const item = state[ITEMS][id] || defaultItem;

    return {
      ...state,
      [ITEMS]: {
        ...state[ITEMS],
        [id]: {
          ...item,
          ...changeMeta(STATES.PENDING, VERBS.DELETE, -1)
        }
      }
    };
  },
  [checkIdMW, checkItemsMW, checkStateMW]
);

export const removeAllSuccess = applyMiddleware(
  (state, { id, value, code } = {}) => {
    return {
      ...state,
      [ITEMS]: {
        ...state[ITEMS],
        [id]: {
          [DATA]: value,
          ...changeMeta(STATES.SYNCED, VERBS.DELETE, code)
        }
      }
    };
  },
  [checkIdMW, checkItemsMW, checkStateMW]
);

export const removeAllFailure = applyMiddleware(
  (state, { id, code, error } = {}) => {
    const item = state[ITEMS][id];

    return {
      ...state,
      [ITEMS]: {
        ...state[ITEMS],
        [id]: {
          ...item,
          ...changeMeta(STATES.FAILED, VERBS.DELETE, code, error)
        }
      }
    };
  },
  [checkIdMW, checkItemsMW, checkStateMW]
);
