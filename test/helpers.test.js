import { isArray, isObject, isStringLike } from '../lib/helpers';

test('isArray', () => {
  expect(isArray()).toBeFalsy();
  expect(isArray(undefined)).toBeFalsy();
  expect(isArray(null)).toBeFalsy();
  expect(isArray(1)).toBeFalsy();
  expect(isArray('RANDOM')).toBeFalsy();
  expect(isArray({})).toBeFalsy();
  expect(isArray(() => {})).toBeFalsy();
  expect(isArray([])).toBeTruthy();
});

test('isObject', () => {
  expect(isObject()).toBeFalsy();
  expect(isObject(undefined)).toBeFalsy();
  expect(isObject(null)).toBeFalsy();
  expect(isObject(1)).toBeFalsy();
  expect(isObject('RANDOM')).toBeFalsy();
  expect(isObject(() => {})).toBeFalsy();
  expect(isObject([])).toBeFalsy();
  expect(isObject({})).toBeTruthy();
});

test('isStringLike', () => {
  expect(isStringLike()).toBeFalsy();
  expect(isStringLike(undefined)).toBeFalsy();
  expect(isStringLike(null)).toBeFalsy();
  expect(isStringLike(() => {})).toBeFalsy();
  expect(isStringLike([])).toBeFalsy();
  expect(isStringLike({})).toBeFalsy();
  expect(isStringLike('RANDOM')).toBeTruthy();
  expect(isStringLike(1)).toBeTruthy();
});
