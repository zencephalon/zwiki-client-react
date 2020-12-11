import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fromJS } from 'immutable';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import { EditorState, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import nodeShape from '~/apis/nodes/shape';
import { POST, PUT, INDEX, LINK_QUERY } from '~/apis/nodes/actions';

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
  SET_VISIBLE_COLUMNS,
  FOCUS_NODE,
} from '~/apis/flex/actions';

import { NEW_ENTRY, UPDATE_ENTRY } from '~/apis/suggest/actions';

import '~/Autocomplete/mentionStyles.css';
import '~/Autocomplete/mentionSuggestionsStyles.css';
import '~/Autocomplete/mentionSuggestionsEntryStyles.css';

import createMentionPlugin from '~/Autocomplete'; // eslint-disable-line import/no-unresolved

import {
  OMNI_SEARCH,
  EDITOR,
  LINK_REGEX,
  IMPORT_REGEX,
  LINK_AND_IMPORT_REGEX,
} from '~/constants';
import { fuseSort } from '~/helpers';
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
  toggleTodo,
  extractName,
} from './helpers';

import Link from './Link';
import keyBindings from './keyBindings';

function linkStrategy(contentBlock, callback) {
  findWithRegex(LINK_REGEX, contentBlock, callback);
}
function importStrategy(contentBlock, callback) {
  findWithRegex(IMPORT_REGEX, contentBlock, callback);
}

const theme = {
  mention: 'mention',
  mentionSuggestions: 'mentionSuggestions',
  mentionSuggestionsEntry: 'mentionSuggestionsEntry',
  mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
  mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
};

class ZEditor extends Component {
  constructor(props) {
    super(props);

    this.mentionPlugin = createMentionPlugin({
      theme,
      mentionTrigger: '[',
      replaceTemplate: ({ name, id }) => `${name}](${id})`,
    });
    this.mentionPluginTwo = createMentionPlugin({
      theme,
      mentionTrigger: '](',
      replaceTemplate: ({ id }) => `${id})`,
    });
    this.mentionPluginThree = createMentionPlugin({
      theme,
      mentionTrigger: '{',
      replaceTemplate: ({ name, id }) => `${name}}(${id})`,
    });
  }

  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromText(this.props.node.content)
    ),
    previousPlainText: this.props.node.content,
    timer: null,
    linkTimer: null,
    editorId: this.props.editorId || uniqueId('editor_'),
  };

  componentDidMount() {
    if (this.props.focused) {
      setTimeout(this.focus, 10);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      node: { content, version },
    } = nextProps;
    if (
      this.props.node.version < version &&
      content !== this.state.previousPlainText
    ) {
      console.log('ILUVU2, sync occurred', this.props.node.version, version);
      console.log(this.state.previousPlainText);
      console.log(content);
      this.setState({
        editorState: EditorState.createWithContent(
          ContentState.createFromText(content)
        ),
        previousPlainText: content,
      });
    }
  }

  componentDidUpdate(lastProps) {
    const { focused, focusType, node } = this.props;
    if (
      focused &&
      focusType === EDITOR &&
      (lastProps.focusType !== EDITOR || !lastProps.focused)
    ) {
      this.focus();
    }
  }

  componentWillUnmount() {
    // this.saveToServer(this.state.editorState.getCurrentContent().getPlainText())
  }

  onChange = (editorState) => {
    const { timer, previousPlainText } = this.state;
    let newTimer;

    clearTimeout(timer);

    const plainText = editorState.getCurrentContent().getPlainText();

    newTimer = setTimeout(() => {
      this.saveToServer();
    }, 1500);

    this.setState({
      editorState,
      timer: newTimer,
    });
  };

  onSearchChange = ({ value }) => {
    const { dispatch } = this.props;

    dispatch(LINK_QUERY(value));
  };

  onAddMention = () => {
    // get the mention object selected
  };

  saveToServer = () => {
    const { editorState } = this.state;
    const content = editorState.getCurrentContent().getPlainText();
    const { node, dispatch } = this.props;
    const oldName = node.name;
    const newName = extractName(content);

    this.setState({ timer: null, previousPlainText: content });

    if (oldName !== newName) {
      dispatch(UPDATE_ENTRY(oldName, newName, { id: node.id, name: newName }));
    }

    return dispatch(PUT(node.id, { content, version: node.version + 1 })).catch(
      () => {
        this.props.refetch();
        console.log('ILUVU, versions out of sync.');
      }
    );
  };

  focus = () => {
    this.props.refetch();
    this.editor.focus();

    setTimeout(() => {
      window.getSelection().anchorNode.parentElement.scrollIntoViewIfNeeded();
    }, 10);
  };

  handleKeyCommand = (command) => {
    const { dispatch, node } = this.props;
    const { editorState } = this.state;

    if (command === 'INSERT_TIME_STAMP') {
      this.setState({
        editorState: insertTimeStamp(editorState),
      });
      return 'handled';
    }
    if (command === 'INSERT_DATE_STAMP') {
      this.setState({
        editorState: insertDateStamp(editorState),
      });
      return 'handled';
    }
    if (command === 'TOGGLE_TODO') {
      this.setState({
        editorState: toggleTodo(editorState),
      });
      return 'handled';
    }
    if (command === 'SELECT_BLOCK_DOWN') {
      this.setState({
        editorState: selectBlockDown(editorState),
      });
      return 'handled';
    }
    if (command === 'SELECT_BLOCK_UP') {
      this.setState({
        editorState: selectBlockUp(editorState),
      });
      return 'handled';
    }
    if (command === 'SWITCH_FOCUS') {
      dispatch(FOCUS({ type: OMNI_SEARCH }));
      this.editor.blur();
      return 'handled';
    }
    if (command === 'CYCLE_DOWN') {
      dispatch(CYCLE_DOWN());
      return 'handled';
    }
    if (command === 'CYCLE_UP') {
      dispatch(CYCLE_UP());
      return 'handled';
    }
    if (command === 'SHIFT_UP') {
      dispatch(SHIFT_UP());
      return 'handled';
    }
    if (command === 'SHIFT_DOWN') {
      dispatch(SHIFT_DOWN());
      return 'handled';
    }
    if (command === 'SLIDE_RIGHT') {
      dispatch(SLIDE_RIGHT());
      return 'handled';
    }
    if (command === 'SLIDE_LEFT') {
      dispatch(SLIDE_LEFT());
      return 'handled';
    }
    if (command === 'NEW_NODE') {
      const { char, title } = getNodeTitle(editorState);
      if (!char) return 'handled';

      dispatch(
        POST('NEW_NODE', {
          content: `# ${title}\n\n`,
          name: title,
        })
      ).then(({ data: { id, name } }) => {
        this.setState({
          editorState: insertLinkCompletion(editorState, id, char),
        });
        dispatch(NEW_ENTRY(name, id));
        dispatch(TOGGLE_LINK({ nodeId: id }));
        dispatch(FOCUS({ nodeId: id }));
      });
      return 'handled';
    }
    if (command === 'OPEN_LINK') {
      const nodeId = getSelectionNodeId(editorState);
      dispatch(TOGGLE_LINK({ nodeId }));
      dispatch(FOCUS({ nodeId }));
      return 'handled';
    }
    if (command === 'REFOCUS') {
      this.saveToServer().then(() => {
        dispatch(REFOCUS({ nodeId: node.id }));
      });
      return 'handled';
    }
    if (command.setColumn) {
      dispatch(SET_VISIBLE_COLUMNS(command.num));
      return 'handled';
    }

    return 'not-handled';
  };

  render() {
    const { timer } = this.state;
    const { focused } = this.props;
    const { MentionSuggestions } = this.mentionPlugin;
    const { MentionSuggestions: MentionSuggestionsTwo } = this.mentionPluginTwo;
    const {
      MentionSuggestions: MentionSuggestionsThree,
    } = this.mentionPluginThree;
    return (
      <div className={classNames('editor', { saved: !timer, focused })}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={[
            this.mentionPlugin,
            this.mentionPluginTwo,
            this.mentionPluginThree,
          ]}
          ref={(element) => {
            this.editor = element;
          }}
          defaultKeyBindings={false}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={keyBindings}
          spellCheck
          onTab={(e) => {
            const { editorState } = this.state;

            e.preventDefault();

            this.setState({
              editorState: selectMatch(
                editorState,
                LINK_AND_IMPORT_REGEX,
                !e.shiftKey
              ),
            });

            setTimeout(this.focus, 10);
          }}
          onBlur={() => {
            this.saveToServer();
          }}
          decorators={[
            {
              strategy: linkStrategy,
              component: (props) => <Link {...props} />,
            },
            {
              strategy: importStrategy,
              component: (props) => <Link {...props} />,
            },
          ]}
        />
        {focused && (
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.props.suggestions}
            onAddMention={this.onAddMention}
          />
        )}
        {focused && (
          <MentionSuggestionsTwo
            onSearchChange={this.onSearchChange}
            suggestions={this.props.suggestions}
            onAddMention={this.onAddMention}
          />
        )}
        {focused && (
          <MentionSuggestionsThree
            onSearchChange={this.onSearchChange}
            suggestions={this.props.suggestions}
            onAddMention={this.onAddMention}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { linkQ: q } = state.nodes.query;

  const sortedSuggestions = state.suggest.trie.find(q) || [];

  return {
    suggestions: fromJS(sortedSuggestions),
    q,
    focusType: state.flex.focusType,
  };
}

ZEditor.propTypes = {
  node: nodeShape,
  dispatch: PropTypes.func.isRequired,
  editorId: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  focusType: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ZEditor);
