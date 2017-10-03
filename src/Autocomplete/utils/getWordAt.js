import { escapeRegExp } from 'lodash'

const getWordAt = (string, position, mentionTrigger) => {
  // Perform type conversions.
  const str = String(string)
  // eslint-disable-next-line no-bitwise
  const pos = Number(position) >>> 0

  // Search for the word's beginning and end.
  const left = str.slice(0, pos + 1).search(/(\S|])+$/)
  const right = str.slice(pos).search(/\s/)

  const word = str.slice(left)
  const triggerLeft = word.search(new RegExp(`${escapeRegExp(mentionTrigger)}`))

  console.log({ str, pos, left, right, word, triggerLeft })

  // The last word in the string is a special case.
  if (right < 0) {
    return {
      word: str.slice(left + triggerLeft),
      begin: left + triggerLeft,
      end: str.length,
    }
  }

  // Return the word, using the located bounds to extract it from the string.
  return {
    word: str.slice(left + triggerLeft, right + pos),
    begin: left + triggerLeft,
    end: right + pos,
  }
}

export default getWordAt
