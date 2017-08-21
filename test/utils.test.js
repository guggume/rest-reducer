import { getTimestamp, changeMeta } from '../lib/utils';
import {
  STATES, VERBS, STATE, VERB, TIMESTAMP, CODE, ERROR,
} from '../lib/constants';

test('getTimestamp should return 9999', () => {
  expect(getTimestamp()).toBe(9999);
});

test('changeMeta without state and invalid state', () => {
  expect(() => changeMeta())
    .toThrow('Expected state to be enum of `STATES` constants');

  expect(() => changeMeta('RANDOM'))
    .toThrow('Expected state to be enum of `STATES` constants');
});

test('changeMeta without verb and invalid verb', () => {
  expect(() => changeMeta(STATES.SYNCED))
    .toThrow('Expected state to be enum of `VERBS` constants');

  expect(() => changeMeta(STATES.SYNCED, 'RANDOM'))
    .toThrow('Expected state to be enum of `VERBS` constants');
});

test('changeMeta without verb and invalid verb', () => {
  expect(() => changeMeta(STATES.SYNCED))
    .toThrow('Expected state to be enum of `VERBS` constants');

  expect(() => changeMeta(STATES.SYNCED, 'RANDOM'))
    .toThrow('Expected state to be enum of `VERBS` constants');
});

test('changeMeta with invalid code and not a number', () => {
  expect(() => changeMeta(STATES.SYNCED, VERBS.GET, 'RANDOM'))
    .toThrow('Expected code to be a number');

  expect(() => changeMeta(STATES.SYNCED, 'RANDOM'))
    .toThrow('Expected state to be enum of `VERBS` constants');
});

test('changeMeta without error', () => {
  expect(changeMeta(STATES.SYNCED, VERBS.GET, 200)).toEqual({
    [STATE]: STATES.SYNCED,
    [VERB]: VERBS.GET,
    [CODE]: 200,
    [ERROR]: null,
    [TIMESTAMP]: 9999,
    isLoading: false,
    isLoaded: true,
    isLoadingFailed: false,
  });
});

test('changeMeta with error', () => {
  expect(changeMeta(STATES.FAILED, VERBS.GET, 400, 'Screwed up.')).toEqual({
    [STATE]: STATES.FAILED,
    [VERB]: VERBS.GET,
    [CODE]: 400,
    [ERROR]: 'Screwed up.',
    [TIMESTAMP]: 9999,
    isLoading: false,
    isLoaded: false,
    isLoadingFailed: true,
  });
});


