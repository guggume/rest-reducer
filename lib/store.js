import uuid from 'uuid/v1';
import { sortedStringify } from './helpers';
import { defaultList } from './defaults';
import { LIST, ITEMS, PATCHES, ERROR, CODE } from './constants';

// getAll(skills)({ query });
const getAll = (data, query = {}) => {
  const qs = sortedStringify(query);

  return data[LIST][qs] || defaultList;
};

// get(skills)({ id })
const get = (data, id, query) => {
  const qs = query ? `${id}::${sortedStringify(query)}` : id;

  return data[ITEMS][qs] || null;
};

const getPatch = data => (id) => {
  return data[PATCHES][id] || null;
};

const post = (data, id) => {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null,
    };
  }

  const item = data[ITEMS][id] || null;

  if (item && (item.isCreated || item.isCreatingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item,
    };
  }

  return {
    id,
    current: item,
    resolved: null,
  };
};

const patch = (data, id) => {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null,
    };
  }

  const item = data[PATCHES][id] || null;

  if (item && (item.isPatched || item.isPatchingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item,
    };
  }

  return {
    id,
    current: item,
    resolved: null,
  };
};

const removeAll = (data, id) => {
  if (!id) {
    return {
      id: uuid(),
      current: null,
      resolved: null,
    };
  }

  const item = data[PATCHES][id] || null;

  if (item && (item.isDeleted || item.isDeletingFailed)) {
    return {
      id: uuid(),
      current: null,
      resolved: item,
    };
  }

  return {
    id,
    current: item,
    resolved: null,
  };
};

const getError = (resource) => {
  return resource[ERROR] || null;
};

export default {
  getError,
  get,
  getPatch,
  getAll,
  patch,
  post,
  removeAll,
}
