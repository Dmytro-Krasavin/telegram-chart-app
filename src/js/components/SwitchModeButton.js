/* eslint-disable react/prop-types */
import React from 'react';

const SwitchModeButton = (props) => {
  const modeText = props.isNightMode ? 'day' : 'night';
  return (
    <div className={'row switch-mode-container'}>
      <div className={'col-sm'}>
          <a href={'/'} className={'switch-mode-button'}
             onClick={props.switchModeHandler}>{`Switch to ${modeText} mode`}</a>
      </div>
    </div>
  );
};

export default SwitchModeButton;
