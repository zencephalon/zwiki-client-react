import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  EditorState,
  ContentState,
} from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { POST, PUT, INDEX, LINK_QUERY } from '~/apis/nodes/actions'
import nodeShape from '~/apis/nodes/shape'

import { fromJS } from 'immutable'

import {
  FOCUS,
  CYCLE_DOWN,
  CYCLE_UP,
  SHIFT_DOWN,
  SHIFT_UP,
  SLIDE_RIGHT,
  SLIDE_LEFT,
  TOGGLE_LINK,
} from '~/apis/flex/actions'

import '~/Autocomplete/mentionStyles.css'
import '~/Autocomplete/mentionSuggestionsStyles.css'
import '~/Autocomplete/mentionSuggestionsEntryStyles.css'

import { OMNI_SEARCH, EDITOR, LINK_REGEX } from '~/constants'
import createMentionPlugin from '~/Autocomplete' // eslint-disable-line import/no-unresolved
import {
  findWithRegex,
  selectMatch,
  getNodeTitle,
  getSelectionNodeId,
} from './helpers'

import Link from './Link'
import keyBindings from './keyBindings'

function linkStrategy(contentBlock, callback) {
  findWithRegex(LINK_REGEX, contentBlock, callback)
}

const theme = {
  mention: 'mention',
  mentionSuggestions: 'mentionSuggestions',
  mentionSuggestionsEntry: 'mentionSuggestionsEntry',
  mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
  mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
}

class ZEditor extends Component {
  constructor(props) {
    super(props)

    this.mentionPlugin = createMentionPlugin({
      theme,
      mentionTrigger: '[',
      replaceTemplate: ({ name, id }) => `[${name}](${id})`,
    })
    this.mentionPluginTwo = createMentionPlugin({
      theme,
      mentionTrigger: '](',
      replaceTemplate: ({ id }) => `](${id})`,
    })
  }
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)),
    previousPlainText: this.props.node.content,
    timer: null,
    linkTimer: null,
    editorId: this.props.editorId || uniqueId('editor_'),
  }

  componentDidMount() {
    if (this.props.focused) {
      setTimeout(this.focus, 10)
    }
  }

  componentDidUpdate(lastProps) {
    const { focused, focusType } = this.props
    if (focused &&
        focusType === EDITOR &&
        (lastProps.focusType !== EDITOR || !lastProps.focused)) {
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
    const { dispatch } = this.props
    const { linkTimer } = this.state

    const q = value

    dispatch(LINK_QUERY(q))
    clearTimeout(linkTimer)

    this.setState({
      linkTimer: setTimeout(() => {
        dispatch(INDEX(q)).then(() => {
          this.setState({ linkTimer: null, selected: 0 })
        })
      }, 150),
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
    const { editorState } = this.state

    if (command === 'SWITCH_FOCUS') {
      dispatch(FOCUS({ type: OMNI_SEARCH }))
      this.editor.blur()
      return 'handled'
    }
    if (command === 'CYCLE_DOWN') {
      dispatch(CYCLE_DOWN())
      return 'handled'
    }
    if (command === 'CYCLE_UP') {
      dispatch(CYCLE_UP())
      return 'handled'
    }
    if (command === 'SHIFT_UP') {
      dispatch(SHIFT_UP())
      return 'handled'
    }
    if (command === 'SHIFT_DOWN') {
      dispatch(SHIFT_DOWN())
      return 'handled'
    }
    if (command === 'SLIDE_RIGHT') {
      dispatch(SLIDE_RIGHT())
      return 'handled'
    }
    if (command === 'SLIDE_LEFT') {
      dispatch(SLIDE_LEFT())
      return 'handled'
    }
    if (command === 'NEW_NODE') {
      const nodeTitle = getNodeTitle(editorState)
      dispatch(POST('NEW_NODE', {
        content: `# ${nodeTitle}\n\n`,
        name: nodeTitle,
      })).then(({ data: { id } }) => {
        dispatch(TOGGLE_LINK({ nodeId: id }))
      })
      return 'handled'
    }
    return 'not-handled'
  }

  render() {
    const { timer } = this.state
    const { focused } = this.props
    const { MentionSuggestions } = this.mentionPlugin
    const { MentionSuggestions: MentionSuggestionsTwo } = this.mentionPluginTwo
    return (
      <div
        className={classNames('editor', { saved: !timer, focused })}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={[this.mentionPlugin, this.mentionPluginTwo]}
          ref={(element) => { this.editor = element }}
          defaultKeyBindings={false}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={keyBindings}
          onTab={(e) => {
            const { editorState } = this.state
            const { dispatch } = this.props
            e.preventDefault()
            if (e.ctrlKey) {
              const nodeId = getSelectionNodeId(editorState)
              dispatch(TOGGLE_LINK({ nodeId }))
              return
            }

            this.setState({
              editorState: selectMatch(this.state.editorState, LINK_REGEX, !e.shiftKey),
            })
          }}
          decorators={[{
            strategy: linkStrategy,
            component: props => (
              <Link
                {...props}
              />
            ),
          }]}
        />
        {focused &&
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.props.suggestions}
            onAddMention={this.onAddMention}
          />
        }
        {focused &&
          <MentionSuggestionsTwo
            onSearchChange={this.onSearchChange}
            suggestions={this.props.suggestions}
            onAddMention={this.onAddMention}
          />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { linkQ: q } = state.nodes.query

  const {
    data: suggestions,
    confirmed,
  } = state.nodes.http.collections[q] || {
    data: [],
    confirmed: false,
  }

  return {
    suggestions: fromJS(confirmed ? suggestions : [{ name: '…' }]),
    confirmed,
    q,
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
