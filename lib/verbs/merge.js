import { isObject, sortedStringify } from '../helpers';
import { defaultList } from '../defaults';
import { LIST, DATA } from '../constants';
import applyMiddleware from '../middleware';
import {
  checkStateMW,
  checkListMW,
} from '../middlewares/errors';

export const mergeAll = applyMiddleware((state, { query, value, primaryKey } = {}) => {
  const qs = sortedStringify(query);
  const list = state[LIST][qs] || defaultList;
  let data = list[DATA];

  if (isObject(value)) {
    const index = data.findIndex(item => item[primaryKey] === value[primaryKey]);

    data = index > 0 ? [...data.slice(0, index), value, ...data.slice(index)] : [...data, value];
  }

  return {
    ...state,
    [LIST]: {
      ...state[LIST],
      [qs]: {
        ...list,
        data: data,
      },
    },
  };
}, [checkListMW, checkStateMW]);

