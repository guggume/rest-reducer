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
