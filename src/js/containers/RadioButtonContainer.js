/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import RadioButton from '../components/RadioButton';

class RadioButtonContainer extends Component {
  isChecked = true;

  render() {
    return (
      <RadioButton text={this.props.text}
                   isChecked={this.isChecked}
                   radioButtonClickHandler={this.radioButtonClickHandler}/>
    );
  }

  radioButtonClickHandler = () => {
    this.setState(() => ({
      isChecked: !this.isChecked
    }));
  };
}

export default RadioButtonContainer;
