import { isArray,isObject, isStringLike } from '../helpers';
import { ITEMS, LIST, STATES, VERBS, DATA, ERROR } from '../constants';

export const checkStateMW = next => (...args) => {
  const [state] = args;

  if (!state) {
    throw new Error('Expected state to be an object');
  }

  return next(...args);
};

export const checkItemsMW = next => (...args) => {
  const [state] = args;

  if (!isObject(state[ITEMS])) {
    throw new Error('Expected state to have `items` object');
  }

  return next(...args);
};

export const checkListMW = next => (...args) => {
  const [state] = args;

  if (!isObject(state[LIST])) {
    throw new Error('Expected state to have `list` object');
  }

  return next(...args);
};

export const checkIdMW = next => (...args) => {
  const { id } = args[1] || {};

  if (!isStringLike(id)) {
    throw new Error('Expected id to be string or number');
  }

  return next(...args);
};

export const checkItemDataMW = next => (...args) => {
  const { item } = args[1] || {};

  if (!isObject(item)) {
    throw new Error('Expected item to be an object');
  }

  return next(...args);
};

export const checkValueArrayMW = next => (...args) => {
  const { value } = args[1] || {};

  if (!isArray(value)) {
    throw new Error('Expected value to be an array');
  }

  return next(...args);
};

export const checkValueObjectMW = next => (...args) => {
  const { value } = args[1] || {};

  if (!isObject(value)) {
    throw new Error('Expected value to be an object');
  }

  return next(...args);
};

export const checkCodeMW = next => (...args) => {
  const { code } = args[1] || {};

  if (isNaN(code)) {
    throw new Error('Expected code to be a number');
  }

  return next(...args);
};
