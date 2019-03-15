/* eslint-disable react/prop-types */
import React from 'react';

const SwitchModeButton = (props) => {
  const modeText = props.isNightMode ? 'day' : 'night';
  return (
    <div className={'row'}>
      <div className={'col-sm'}>
        <div className={'d-flex justify-content-center'}>
          <a href={'/'} className={'btn btn-link btn-lg'}
             onClick={props.switchModeHandler}>{`Switch to ${modeText} mode`}</a>
        </div>
      </div>
    </div>
  );
};

export default SwitchModeButton;
