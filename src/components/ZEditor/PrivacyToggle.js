import React from 'react';

import classNames from 'classnames';

export default function PrivacyToggle({ isPrivate, togglePrivacy }) {
  return (
    <div
      className={classNames('privacy-toggle', {
        public: !isPrivate,
        private: isPrivate,
      })}
      onClick={togglePrivacy}
    ></div>
  );
}
