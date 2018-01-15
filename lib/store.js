import { stringify } from 'querystring';
import { defaultList } from './defaults';
import { LIST, ITEMS, PATCHES } from './constants';

// getAll(skills)({ query });
const getAll = data => (query = {}) => {
  const qs = stringify(query);

  return data[LIST][qs] || defaultList;
};

// get(skills)({ id })
const get = data => ({ id, query }) => {
  const qs = query ? `${id}::${stringify(query)}` : id;
  return data[ITEMS][qs] || null;
};

const getPatch = data => (id) => {
  return data[PATCHES][id] || null;
};

export default {
  get,
  getPatch,
  getAll
}
