/* @flow */

import { escapeRegExp } from 'lodash'

const findWithRegexUntilCursor = (regex, contentBlock, callback) => {
  // Get the text from the contentBlock
  const text = contentBlock.getText()
  let matchArr
  let start
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) { // eslint-disable-line
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

export default (trigger: String, regExp: String) => (contentBlock: Object, callback: Function) => {
  findWithRegexUntilCursor(new RegExp(`${escapeRegExp(trigger)}(?!])${regExp}`, 'g'), contentBlock, callback)
}
