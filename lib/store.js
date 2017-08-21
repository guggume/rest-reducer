import { stringify } from 'querystring';
import { defaultList } from './defaults';
import { LIST, ITEMS } from './constants';

// getAll(skills)({ query });
const getAll = (data) => ({ query = {} } = {}) => {
  const qs = stringify(query);

  return data[LIST][qs] || defaultList;
};

// get(skills)({ id })
const get = (data) => ({ id }) => {
  return data[ITEMS][id] || null;
}

export default {
  get,
  getAll
}
