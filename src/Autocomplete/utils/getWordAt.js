import { escapeRegExp } from 'lodash'

export const getLeftEdge = (string, position, mentionTrigger) => {
  let left = 0
  const triggerRegex = new RegExp(`${escapeRegExp(mentionTrigger)}`)
  let leftSearchString = string

  while (true) {
    let leftIncrement = leftSearchString.search(triggerRegex)

    if (leftIncrement < 0) break

    leftIncrement += mentionTrigger.length

    if (left + leftIncrement > position) break

    left += leftIncrement
    leftSearchString = leftSearchString.slice(leftIncrement)
  }

  return left
}

export const getRightEdge = (string, position) => {
  const space = string.slice(position).search(/\s/)
  return space >= 0 ? position + space : string.length
}

const getWordAt = (string, position, mentionTrigger) => {
  // Perform type conversions.
  const str = String(string)
  // eslint-disable-next-line no-bitwise
  const pos = Number(position) >>> 0

  const begin = getLeftEdge(string, pos, mentionTrigger)
  const end = getRightEdge(string, pos)
  const word = str.substring(begin, end)

  // Return the word, using the located bounds to extract it from the string.
  return {
    word,
    begin,
    end,
  }
}

export default getWordAt
