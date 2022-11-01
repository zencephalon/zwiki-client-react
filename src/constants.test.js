import {
  LINK_REGEX_NO_G,
  IMPORT_REGEX_NO_G,
  LINK_AND_IMPORT_REGEX_NO_G,
} from './constants';

test('LINK_REGEX_NO_G', () => {
  const match = LINK_REGEX_NO_G.exec('foo [bar](baz) qux');

  expect(match[0]).toEqual('[bar](baz)');
  expect(match[1]).toEqual('bar');
  expect(match[2]).toEqual('baz');
});

test('IMPORT_REGEX_NO_G', () => {
  const match = IMPORT_REGEX_NO_G.exec('foo {bar}(baz) qux');

  expect(match[0]).toEqual('{bar}(baz)');
  expect(match[1]).toEqual('bar');
  expect(match[2]).toEqual('baz');
});

test('LINK_AND_IMPORT_REGEX_NO_G', () => {
  let match = LINK_AND_IMPORT_REGEX_NO_G.exec('foo {bar}(baz) qux');

  expect(match[0]).toEqual('{bar}(baz)');
  expect(match[1]).toEqual('bar');
  expect(match[2]).toEqual('baz');

  match = LINK_AND_IMPORT_REGEX_NO_G.exec('foo [bar](baz) qux');
  expect(match[0]).toEqual('[bar](baz)');
  expect(match[1]).toEqual('bar');
  expect(match[2]).toEqual('baz');
});
