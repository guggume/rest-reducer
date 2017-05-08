import { defaultState, defaultList, defaultItem } from '../lib/defaults';

test('check default state', () => {
  expect(defaultState).toEqual({
    list: {},
    items: {},
  });
});

test('check default list', () => {
  expect(defaultList).toEqual({
    data: [],
  });
});

test('check default item', () => {
  expect(defaultItem).toEqual({
    data: {},
  });
});
