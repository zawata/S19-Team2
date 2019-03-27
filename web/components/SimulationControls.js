import React, { Component } from 'react';
import TimelineSlider from './TimelineSlider';

export default class SimulationControls extends Component {
  constructor(props) {
    super(props);
    this.state = { controlsVisible: false };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ controlsVisible: ! this.state.controlsVisible });
  }

  render() {
    return(
      <div className="simulation-controls-container">
        <button onClick={this.handleClick}>{this.state.controlsVisible ? 'Hide Controls' : 'Show Controls'}</button>
        <div className="simulation-controls">
          {this.state.controlsVisible && <TimelineSlider/>}
        </div>
      </div>
    )
  }
}