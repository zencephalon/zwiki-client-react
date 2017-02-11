import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  EditorState,
  ContentState,
  getDefaultKeyBinding,
  Modifier,
} from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { PUT } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import { FOCUS } from '~/apis/flex/actions'

import { OMNI_SEARCH, EDITOR, LINK_REGEX } from '~/constants'
import { setStatePromise } from '~/helpers'
import createMentionPlugin, { defaultSuggestionsFilter } from '~/Autocomplete' // eslint-disable-line import/no-unresolved
import { findWithRegex, moveToEnd, getEntitySelectionState } from './helpers'

import Link from './Link'
import mentions from './mentions'

import '~/Autocomplete/mentionStyles.css'
import '~/Autocomplete/mentionSuggestionsStyles.css'
import '~/Autocomplete/mentionSuggestionsEntryStyles.css'

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
    return 'switch-focus'
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
    if (this.props.focused && lastProps.focusType !== EDITOR) {
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

  moveToEnd = (text) => {
    const { editorState } = this.state

    return setStatePromise(this, {
      editorState: moveToEnd(editorState, text),
    })
  }

  removeEntity = (entityKey) => {
    const {
      editorState,
    } = this.state
    const content = editorState.getCurrentContent()
    const entitySelection = getEntitySelectionState(content, entityKey)
    console.log(entitySelection.serialize())
    this.setState({
      editorState: EditorState.push(
        editorState,
        Modifier.removeRange(content, entitySelection, 'forward'),
        'remove-range'),
    })
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
    if (command === 'switch-focus') {
      this.props.dispatch(FOCUS({ type: OMNI_SEARCH }))
      this.editor.blur()
      return 'handled'
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
                moveToEnd={this.moveToEnd}
                removeEntity={this.removeEntity}
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
