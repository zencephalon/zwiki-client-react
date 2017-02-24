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
  REFOCUS,
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
  insertLinkCompletion,
  selectBlockDown,
  selectBlockUp,
  insertTimeStamp,
  insertDateStamp,
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
    const { timer, previousPlainText } = this.state
    let newTimer

    clearTimeout(timer)

    const plainText = editorState.getCurrentContent().getPlainText()

    if (plainText !== previousPlainText) {
      newTimer = setTimeout(() => {
        this.saveToServer(plainText)
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

  saveToServer = (content) => {
    const { node, dispatch } = this.props
    dispatch(PUT(node.id, { content })).then(() => {
      this.setState({ timer: null })
    })
  }

  focus = () => {
    this.editor.focus()
  }

  handleKeyCommand = (command) => {
    const { dispatch, node } = this.props
    const { editorState } = this.state

    if (command === 'INSERT_TIME_STAMP') {
      this.setState({
        editorState: insertTimeStamp(editorState),
      })
      return 'handled'
    }
    if (command === 'INSERT_DATE_STAMP') {
      this.setState({
        editorState: insertDateStamp(editorState),
      })
      return 'handled'
    }
    if (command === 'SELECT_BLOCK_DOWN') {
      this.setState({
        editorState: selectBlockDown(editorState),
      })
      return 'handled'
    }
    if (command === 'SELECT_BLOCK_UP') {
      console.log('got select block up')
      this.setState({
        editorState: selectBlockUp(editorState),
      })
      return 'handled'
    }
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
        this.setState({
          editorState: insertLinkCompletion(editorState, id)
        })
        dispatch(TOGGLE_LINK({ nodeId: id }))
        dispatch(SLIDE_RIGHT())
      })
      return 'handled'
    }
    if (command === 'OPEN_LINK') {
      const nodeId = getSelectionNodeId(editorState)
      dispatch(TOGGLE_LINK({ nodeId }))
      dispatch(SLIDE_RIGHT())
      return 'handled'
    }
    if (command === 'REFOCUS') {
      dispatch(REFOCUS({ nodeId: node.id }))
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

            e.preventDefault()

            this.setState({
              editorState: selectMatch(editorState, LINK_REGEX, !e.shiftKey),
            })
          }}
          onBlur={() => {
            this.saveToServer(this.state.editorState.getCurrentContent().getPlainText())
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

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'name',
      weight: 0.8,
    },
    {
      name: 'content',
      weight: 0.2
    },
  ],
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

  const sortedSuggestions = confirmed ? new Fuse(suggestions, options).search(q) : [{ name: '…' }]

  return {
    suggestions: fromJS(sortedSuggestions),
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
