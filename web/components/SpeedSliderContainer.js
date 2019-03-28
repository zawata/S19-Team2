import React, { Component } from 'react';
import SpeedSlider from './SpeedSlider';

export default class SpeedSliderContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="speed-slider-container">
          <SpeedSlider/>
      </div>
    )
  }
}
