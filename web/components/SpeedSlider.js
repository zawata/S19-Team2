import React, { Component } from 'react';
import { connect } from 'react-redux';
import { render } from "react-dom";
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source in sliderComponents
import { selectAnimationSpeed } from '../reducers';
import { updateAnimationSpeed } from '../actions/spaceSceneActions';
import { set_update_frequency } from '../libraries/position_store';

const sliderStyle = {
  position: "relative",
  width: "100%"
};

const domain = [0, 50];
const stepSize = 0.5;

class SpeedSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      update: this.props.animationSpeed,
    };
  }

  onUpdate = (update) => {
    this.setState({ update })
  }

  onChange = ([newSpeed]) => {
    set_update_frequency(newSpeed);
  }

  renderSpeedHeading(speed){
    return (
      <div className="speed-heading">
        Speed: {speed}x
      </div>
    )
  }

  render() {
    const{ update } = this.state;

    return (
      <div className="speed-slider">
      {this.renderSpeedHeading(update)}
      <div className="speed-slider-core-container" >
        <Slider
          mode={1}
          step={stepSize}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={[+this.props.animationSpeed]}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ activeHandleID, handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    activeHandleID={activeHandleID}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={5}>
            {({ ticks }) => (
              <div>
                {ticks.map(tick => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                  />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  animationSpeed: selectAnimationSpeed(state)
});

export default connect(mapStateToProps, { updateAnimationSpeed })(SpeedSlider)
