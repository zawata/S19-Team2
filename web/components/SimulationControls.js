import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import TimelineSlider from './sliders/TimelineSlider';
import SpeedSlider from './sliders/SpeedSlider';
import TrailControls from './toggleControls/TrailControls';
import CameraControls from './toggleControls/CameraControls';
import LabelControls from './toggleControls/LabelControls';

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
        <button className="toggleControlsButton"
          onClick={this.handleClick}>{this.state.controlsVisible ? 'Hide Controls' : 'Show Controls'}</button>
        <div className="simulation-controls">
          <CSSTransitionGroup transitionName="controls" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            {this.state.controlsVisible && (
              <div className="toggleControls">
                <CameraControls/>
                <TrailControls/>
                <LabelControls/>
              </div>
            )}
            {this.state.controlsVisible && <TimelineSlider/>}
            {this.state.controlsVisible && <SpeedSlider/>}
          </CSSTransitionGroup>
        </div>
      </div>
    )
  }
}
