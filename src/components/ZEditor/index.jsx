import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  EditorState,
  ContentState,
  getDefaultKeyBinding,
} from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import {
  FOCUS,
  CYCLE_DOWN,
  CYCLE_UP,
  SHIFT_DOWN,
  SHIFT_UP,
  SLIDE_RIGHT,
  SLIDE_LEFT,
} from '~/apis/flex/actions'

import '~/Autocomplete/mentionStyles.css'
import '~/Autocomplete/mentionSuggestionsStyles.css'
import '~/Autocomplete/mentionSuggestionsEntryStyles.css'

import { OMNI_SEARCH, EDITOR, LINK_REGEX } from '~/constants'
import createMentionPlugin, { defaultSuggestionsFilter } from '~/Autocomplete' // eslint-disable-line import/no-unresolved
import { findWithRegex } from './helpers'

import Link from './Link'
import mentions from './mentions'

const mentionPlugin = createMentionPlugin({ theme: {
  mention: 'mention',
  mentionSuggestions: 'mentionSuggestions',
  mentionSuggestionsEntry: 'mentionSuggestionsEntry',
  mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
  mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
} })
const { MentionSuggestions } = mentionPlugin

// const linkifyPlugin = createLinkifyPlugin()
const plugins = [mentionPlugin]

function keyBindings(e) {
  if (e.key === ' ' && e.ctrlKey) {
    return 'SWITCH_FOCUS'
  }
  if (e.key === 'j' && e.ctrlKey && !e.shiftKey) {
    return 'CYCLE_DOWN'
  }
  if (e.key === 'k' && e.ctrlKey && !e.shiftKey) {
    return 'CYCLE_UP'
  }
  if (e.key === 'j' && e.ctrlKey && e.shiftKey) {
    return 'SHIFT_DOWN'
  }
  if (e.key === 'k' && e.ctrlKey && e.shiftKey) {
    return 'SHIFT_UP'
  }
  if (e.key === 'l' && e.ctrlKey) {
    return 'SLIDE_RIGHT'
  }
  if (e.key === 'h' && e.ctrlKey) {
    return 'SLIDE_LEFT'
  }
  return getDefaultKeyBinding(e)
}

function linkStrategy(contentBlock, callback) {
  findWithRegex(LINK_REGEX, contentBlock, callback)
}

class ZEditor extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    previousPlainText: this.props.node.content,
    timer: null,
    editorId: this.props.editorId || uniqueId('editor_'),
    suggestions: mentions,
  }

  componentDidMount() {
    if (this.props.focused) {
      setTimeout(this.focus, 10)
    }
  }

  componentDidUpdate(lastProps) {
    const { focused, focusType } = this.props
    if (focused && focusType === EDITOR && lastProps.focusType !== EDITOR) {
      this.focus()
    }
  }

  onChange = (editorState) => {
    const { node, dispatch } = this.props
    const { timer, previousPlainText } = this.state
    let newTimer

    clearTimeout(timer)

    const plainText = editorState.getCurrentContent().getPlainText()

    if (plainText !== previousPlainText) {
      newTimer = setTimeout(() => {
        dispatch(PUT(node.id, this.parseNode(plainText))).then(() => {
          this.setState({ timer: null })
        })
      }, 1500)
    }

    this.setState({
      editorState,
      timer: newTimer,
      previousPlainText: plainText,
    })
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    })
  }

  onAddMention = () => {
    // get the mention object selected
  }

  parseNode = plainText => (
    {
      content: plainText.replace(/\n\u200B/, ''),
      // TODO: this will break without a title to find, default to untitled
      name: plainText.split('\n', 1)[0].match(/#+\s*(.*)$/)[1],
    }
  )

  focus = () => {
    this.editor.focus()
  }

  handleKeyCommand = (command) => {
    const { dispatch } = this.props
    if (command === 'SWITCH_FOCUS') {
      dispatch(FOCUS({ type: OMNI_SEARCH }))
      this.editor.blur()
      return 'handled'
    }
    if (command === 'CYCLE_DOWN') {
      dispatch(CYCLE_DOWN())
    }
    if (command === 'CYCLE_UP') {
      dispatch(CYCLE_UP())
    }
    if (command === 'SHIFT_UP') {
      dispatch(SHIFT_UP())
    }
    if (command === 'SHIFT_DOWN') {
      dispatch(SHIFT_DOWN())
    }
    if (command === 'SLIDE_RIGHT') {
      dispatch(SLIDE_RIGHT())
    }
    if (command === 'SLIDE_LEFT') {
      dispatch(SLIDE_LEFT())
    }
    return 'not-handled'
  }

  render() {
    const { timer } = this.state
    const { focused } = this.props
    return (
      <div
        className={classNames('editor', { saved: !timer, focused })}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
          defaultKeyBindings={false}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={keyBindings}
          decorators={[{
            strategy: linkStrategy,
            component: props => (
              <Link
                {...props}
              />
            ),
          }]}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    focusType: state.flex.focusType,
  }
}

ZEditor.propTypes = {
  node: nodeShape,
  dispatch: PropTypes.func.isRequired,
  editorId: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  focusType: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(ZEditor)
