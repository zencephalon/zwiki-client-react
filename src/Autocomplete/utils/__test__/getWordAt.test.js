import { getLeftEdge, getRightEdge } from '../getWordAt'

test('getLeftEdge works at start of string', () => {
  expect(getLeftEdge('[ILUVU ILUVU', 5, '[')).toBe(1)
})

test('getLeftEdge gets the right most left edge', () => {
  expect(getLeftEdge('[ILUVU](5) [ILUVU still', 15, '[')).toBe(12)
})

test('getLeftEdge gets the right most left edge not past the cursor', () => {
  expect(getLeftEdge('[ILUVU](5) [ILUVU still] [and still', 15, '[')).toBe(12)
})

test('getLeftEdge gets the end of a string', () => {
  expect(getLeftEdge('I[', 2, '[')).toBe(2)
})

test('getRightEdge gets the end of a string', () => {
  expect(getRightEdge('ILUVU', 1)).toBe(5)
})

test('getRightEdge gets the end of a word', () => {
  expect(getRightEdge('ILUVU fool', 1)).toBe(5)
})

test("getRightEdge won't go too far", () => {
  expect(getRightEdge('ILUVU fool goodbye', 5)).toBe(5)
})

test("getRightEdge will get the next word", () => {
  expect(getRightEdge('ILUVU fool goodbye', 6)).toBe(10)
})

// test('finds a word in between sentences', () => {
//   const expected = {
//     word: 'is',
//     begin: 5,
//     end: 7,
//   }
//   expect(getWordAt('this is a test', 5)).toEqual(expected)
// })

// test('finds the first word', () => {
//   const expected = {
//     word: 'this',
//     begin: 0,
//     end: 4,
//   }
//   expect(getWordAt('this is a test', 0)).toEqual(expected)
// })

// test('finds the last word', () => {
//   const expected = {
//     word: 'test',
//     begin: 10,
//     end: 14,
//   }
//   expect(getWordAt('this is a test', 15)).toEqual(expected)
// })
