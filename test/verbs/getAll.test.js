import { getAll } from '../../lib/verbs/getAll';
import { defaultList } from '../../lib/defaults';
import {
  STATES, VERBS, STATE, VERB, DATA, CODE, ERROR, TIMESTAMP,
} from '../../lib/constants';

test('getAll', () => {
  expect(() => getAll()).toThrow('Expected state to be an object');
  expect(() => getAll(null)).toThrow('Expected state to be an object');
  expect(() => getAll('RANDOM')).toThrow('Expected state to have `list` object');
  expect(() => getAll([])).toThrow('Expected state to have `list` object');
  expect(() => getAll(2)).toThrow('Expected state to have `list` object');
  expect(() => getAll({})).toThrow('Expected state to have `list` object');
  expect(() => getAll({ list: undefined }))
    .toThrow('Expected state to have `list` object');
  expect(() => getAll({ list: 'RANDOM' }))
    .toThrow('Expected state to have `list` object');
  expect(() => getAll({ list: 2 }))
    .toThrow('Expected state to have `list` object');
  expect(() => getAll({ list: [] }))
    .toThrow('Expected state to have `list` object');
  expect(() => getAll({ list: null }))
    .toThrow('Expected state to have `list` object');
  expect(
    getAll({ list: {} })
  ).toEqual({
    list: {
      '': {
        ...defaultList,
        [STATE]: STATES.PENDING,
        [VERB]: VERBS.GET,
        [CODE]: null,
        [ERROR]: null,
        [TIMESTAMP]: 9999,
        isLoading: true,
        isLoaded: false,
        isLoadingFailed: false,
      }
    }
  });
});
