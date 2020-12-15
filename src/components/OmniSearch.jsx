import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce, unionBy } from 'lodash';
import { parseDate } from 'chrono-node';

import { INDEX, OMNI_QUERY, POST } from '~/apis/nodes/actions';
import nodeShape from '~/apis/nodes/shape';

import { RECEIVE_INDEX } from '~/apis/suggest/actions';

import { FOCUS, OPEN_NODE } from '~/apis/flex/actions';
import { OMNI_SEARCH, EDITOR } from '~/constants';
import { fuseSort, getDateStamp } from '~/helpers';

import { NEW_ENTRY } from '~/apis/suggest/actions';

import classNames from 'classnames';

const shortCommands = ['today', 'tomorrow', 'yesterday'];

class OmniSearch extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timer: null,
      selected: 0,
    };
  }

  componentWillMount() {
    this.props.dispatch(INDEX('')).then((res) => {
      this.props.dispatch(RECEIVE_INDEX(res.data));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focusType === OMNI_SEARCH) {
      this.input.focus();
    }
  }

  query = debounce((q) => {
    const { dispatch } = this.props;

    dispatch(INDEX(q)).then(() => {
      this.setState({ timer: null });
    });
  }, 250);

  qChange = (e) => {
    const { dispatch } = this.props;

    const q = e.target.value;

    dispatch(OMNI_QUERY(q));
    this.query(q);
  };

  createOrOpen = (q) => {
    const { dispatch } = this.props;
    // ILUVU: not a great idea to have a content template here
    dispatch(POST('new-omni', { content: `# ${q}\n\n`, name: q })).then(
      (ret) => {
        const { data: new_node } = ret;
        dispatch(OPEN_NODE({ nodeId: new_node.id }));
        dispatch(NEW_ENTRY(new_node.name, new_node.id));
      }
    );
  };

  handleKeyPress = (e) => {
    const { suggestions, dispatch, q } = this.props;
    const size = suggestions.length;
    const { selected } = this.state;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.setState({
        selected: selected === 0 ? size - 1 : selected - 1,
      });
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.setState({
        selected: selected === size - 1 ? 0 : selected + 1,
      });
    }
    // Deal with /slash commands here
    if (e.key === 'Enter') {
      e.preventDefault();

      if (q[0] === '/') {
        const command = q.slice(1);

        if (shortCommands.includes(command)) {
          const slashQ = getDateStamp(parseDate(command));
          console.log({ slashQ });
          this.createOrOpen(slashQ);
        }

        if (command[0] === 'd') {
          const dateStr = command.slice(2);

          const slashQ = getDateStamp(parseDate(dateStr));
          this.createOrOpen(slashQ);
        }
      } else {
        if (e.ctrlKey) {
          this.createOrOpen(q);
        } else {
          dispatch(OPEN_NODE({ nodeId: suggestions[selected].id }));
        }
      }

      this.input.blur();
      dispatch(OMNI_QUERY(''));
      dispatch(FOCUS({ type: EDITOR }));
      this.setState({
        selected: 0,
      });
    }
    if (e.key === ' ' && e.ctrlKey) {
      this.input.blur();
      dispatch(FOCUS({ type: EDITOR }));
    }
    if (e.key === 'D' && e.ctrlKey) {
      const newQ = q + getDateStamp();
      dispatch(OMNI_QUERY(newQ));
      dispatch(INDEX(newQ));
    }
  };

  handleBlur = () => {
    this.input.blur();
    this.props.dispatch(OMNI_QUERY(''));
  };

  render() {
    const { q, confirmed, suggestions, focusType } = this.props;
    const { selected } = this.state;

    return (
      <div className="omni-search">
        <input
          type="text"
          onBlur={this.handleBlur}
          onChange={this.qChange}
          onKeyDown={this.handleKeyPress}
          value={q}
          placeholder="Search"
          ref={(element) => {
            this.input = element;
          }}
        />
        <div className="suggestions">
          <div className="suggestion-popover">
            {focusType === OMNI_SEARCH &&
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={classNames('suggestion-item', {
                    selected: index === selected,
                  })}
                >
                  {suggestion.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { omniQ: q } = state.nodes.query;

  const trieSuggestions = state.suggest.trie.find(q) || [];
  const { data: suggs, confirmed } = state.nodes.http.collections[q] || {
    data: [],
    confirmed: false,
  };

  const searchSuggs =
    q === '' ? [] : confirmed ? suggs : [{ name: '🔍⏳...', id: '🔍⏳...' }];

  const suggestions = unionBy(
    trieSuggestions.slice(0, 10),
    searchSuggs.slice(0, 10),
    'id'
  );

  return {
    q,
    confirmed,
    suggestions,
    focusType: state.flex.focusType,
  };
}

OmniSearch.propTypes = {
  q: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  confirmed: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(nodeShape),
  focusType: PropTypes.string,
};

export default connect(mapStateToProps)(OmniSearch);
