import React, { Component } from 'react';
import TimelineSlider from './TimelineSlider';

export default class SimulationControls extends Component {
  render() {
    return(
      <div className="simulation-controls">
        <TimelineSlider/>
      </div>
    )
  }
}