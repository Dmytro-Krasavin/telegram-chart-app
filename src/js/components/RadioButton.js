/* eslint-disable react/prop-types */
import React from 'react';

const RadioButton = (props) => {
  return (
      <label className={'radio-button-container'}>{props.text}
        <input type={'radio'} checked={props.isChecked} onChange={props.radioButtonClickHandler}/>
        <span className='checkmark'/>
      </label>
  );
};

export default RadioButton;
