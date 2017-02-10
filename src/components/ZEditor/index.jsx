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

import { SET_FOCUS } from '~/apis/focus/actions'

import { OMNI_SEARCH, EDITOR, LINK_REGEX } from '~/constants'
import { setStatePromise } from '~/helpers'
import createMentionPlugin, { defaultSuggestionsFilter } from '~/Autocomplete' // eslint-disable-line import/no-unresolved
import { findWithRegex, moveToEnd, insertPortal, getEntitySelectionState } from './helpers'

import Link from './Link'
import Portal from './Portal'
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
    if (this.editable()) {
      setTimeout(this.focus, 10)
    }
  }

  componentDidUpdate(lastProps) {
    if (this.editable() && lastProps.focus.kind !== EDITOR) {
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

  editable = () => {
    const { focus } = this.props
    const { editorId } = this.state
    return focus.kind === EDITOR && focus.id === editorId
  }

  moveToEnd = (text) => {
    const { editorState } = this.state

    return setStatePromise(this, {
      editorState: moveToEnd(editorState, text),
    })
  }

  insertPortal = (id) => {
    const { editorState } = this.state
    const { editorState: newEditorState, entityKey } = insertPortal(editorState, id)
    this.setState({
      editorState: newEditorState,
    })
    return entityKey
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

  blockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Portal,
        editable: false,
        props: {
          parentSetReadOnly: this.setReadOnly,
        },
      }
    }
    return null
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

  hoverFocus = (e) => {
    const { dispatch, focus } = this.props
    const { editorId } = this.state
    if (focus.kind !== EDITOR || focus.id !== editorId) {
      dispatch(SET_FOCUS(EDITOR, editorId))
    }
    e.stopPropagation()
  }

  handleKeyCommand = (command) => {
    if (command === 'switch-focus') {
      this.props.dispatch(SET_FOCUS(OMNI_SEARCH))
      this.editor.blur()
      return 'handled'
    }
    return 'not-handled'
  }

  render() {
    const { timer } = this.state
    return (
      <div
        className={classNames('editor', { saved: !timer })}
        onMouseOver={this.hoverFocus}
      >
        <Editor
          readOnly={!this.editable()}
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
                insertPortal={this.insertPortal}
                moveToEnd={this.moveToEnd}
                removeEntity={this.removeEntity}
              />
            ),
          }]}
          blockRendererFn={this.blockRenderer}
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
    focus: state.focus,
  }
}

ZEditor.propTypes = {
  node: nodeShape,
  dispatch: PropTypes.func.isRequired,
  editorId: PropTypes.string,
}

export default connect(mapStateToProps)(ZEditor)
