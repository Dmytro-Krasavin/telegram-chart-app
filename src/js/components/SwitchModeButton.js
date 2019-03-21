import React from 'react';

const SwitchModeButton = (props) => {
  const modeText = props.isNightMode ? 'Day' : 'Night';
  const modeClass = props.isNightMode ? 'row switch-mode-container night' : 'row switch-mode-container';
  return (
    <div className={modeClass}>
      <div className={'col-sm'}>
          <a href={'/'} className={'switch-mode-button'}
             onClick={props.switchModeHandler}>{`Switch to ${modeText} mode`}</a>
      </div>
    </div>
  );
};

export default SwitchModeButton;
