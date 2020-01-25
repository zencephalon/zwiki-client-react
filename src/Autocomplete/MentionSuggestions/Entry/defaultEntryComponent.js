import React from "react";

const defaultEntryComponent = props => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <span className={theme.mentionSuggestionsEntryText}>
        {mention.get("name")}
      </span>
    </div>
  );
};

export default defaultEntryComponent;
