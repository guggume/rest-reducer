const {
  LIST, ITEMS, DATA,
  STATE, VERB, TIMESTAMP, ERROR, CODE,
  STATES, VERBS,
} = require('../lib/constants');

test('check data structure constants', () => {
  expect(LIST).toBe('list');
  expect(ITEMS).toBe('items');
  expect(DATA).toBe('data');
});

test('check meta constants', () => {
  expect(STATE).toBe('__STATE__');
  expect(VERB).toBe('__VERB__');
  expect(TIMESTAMP).toBe('__TIMESTAMP__');
  expect(ERROR).toBe('__ERROR__');
  expect(CODE).toBe('__CODE__');
});

test('check state constants', () => {
  expect(STATES.PENDING).toBe('PENDING');
  expect(STATES.SYNCED).toBe('SYNCED');
  expect(STATES.FAILED).toBe('FAILED');
});

test('check verb constants', () => {
  expect(VERBS.POST).toBe('POST');
  expect(VERBS.GET).toBe('GET');
  expect(VERBS.PUT).toBe('PUT');
  expect(VERBS.PATCH).toBe('PATCH');
  expect(VERBS.DELETE).toBe('DELETE');
});
