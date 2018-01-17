import { stringify } from 'query-string';

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return value !== null && typeof value === 'object' && !isArray(value);
}

export function isStringLike(value) {
  const valueType = typeof value;

  return valueType === 'string' || valueType === 'number';
}

export function sortedStringify(query) {
  if (!query && !isObject(query)) {
    return '';
  }

  const keys = Object.keys(query).sort();
  const sortedObject = {};

  keys.forEach(key => {
    sortedObject[key] = query[key];
  });

  return stringify(sortedObject);
}
