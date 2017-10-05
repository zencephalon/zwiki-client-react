import { getLeftEdge } from '../getWordAt'

test('getLeftEdge works at start of string', () => {
  expect(getLeftEdge('[ILUVU ILUVU', 5, '[')).toBe(1)
})

test('getLeftEdge gets the right most left edge', () => {
  expect(getLeftEdge('[ILUVU](5) [ILUVU still', 15, '[')).toBe(12)
})

test('getLeftEdge gets the right most left edge not past the cursor', () => {
  expect(getLeftEdge('[ILUVU](5) [ILUVU still] [and still', 15, '[')).toBe(12)
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
