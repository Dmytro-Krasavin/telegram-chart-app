/* eslint-disable max-len */
import React, { PureComponent } from 'react';

class Checkbox extends PureComponent {
  state = {
    checked: this.props.initialChecked,
    isAnimating: false
  };

  toggleChecked = () => {
    const checkedState = !this.state.checked;
    this.setState({
      checked: checkedState,
      isAnimating: true
    });
    this.props.changeLineVisibility(this.props.label, checkedState);
  };

  ping = () => this.setState({ isAnimating: false });

  composeStateClasses = (core) => {
    const { checked, isAnimating } = this.state;
    const { isNightMode } = this.props;
    let result = core;
    if (checked) {
      result += ' is-checked';
    } else {
      result += ' is-unchecked';
    }
    if (isAnimating) {
      result += ' do-ping';
    }
    if (isNightMode) {
      result += ' night';
    }
    return result;
  };

  render() {
    const className = this.composeStateClasses('ui-checkbox-btn');
    const { color } = this.props;
    const { checked } = this.state;
    const checkedStyle = {
      backgroundColor: color,
      borderColor: color
    };

    return (
      <div className={className} onClick={this.toggleChecked}>
        <input className="ui ui-checkbox" type="checkbox" checked={checked} onChange={this.toggleChecked}/>
        {
          checked
            ? <i className="icon" style={checkedStyle}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M21 5q0.43 0 0.715 0.285t0.285 0.715q0 0.422-0.289 0.711l-12 12q-0.289 0.289-0.711 0.289t-0.711-0.289l-6-6q-0.289-0.289-0.289-0.711 0-0.43 0.285-0.715t0.715-0.285q0.422 0 0.711 0.289l5.289 5.297 11.289-11.297q0.289-0.289 0.711-0.289z"/>
              </svg>
            </i>
            : <i className="icon"/>
        }
        <label className="text">{this.props.children}</label>
        <div className="ui-btn-ping" onTransitionEnd={this.ping}/>
      </div>
    );
  }
}

export default Checkbox;
