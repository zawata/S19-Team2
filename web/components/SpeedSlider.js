import React, { Component } from 'react'
import { render } from "react-dom";
import PropTypes from 'prop-types'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { withStyles } from '@material-ui/core/styles'
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source below

const style = () => ({
  slider: {
    position: 'relative',
    width: '100%',
  },
})

const domain = [0.5, 4]
const defaultValues = [1]

class SpeedSlider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      values: defaultValues.slice(),
      update: defaultValues.slice(),
    };
  }

  onUpdate = update => {
    this.setState({ update })
  }

  onChange = values => {
    this.setState({ values })
  }

  renderSpeedHeading(speed){
    return (
      <div className="speed-heading">
        Speed: {speed}x
      </div>
    )
  }

  render() {
    const {
      props: { classes },
      state: { values, update },
    } = this

    return (
      <div className={classes.root}>
      {this.renderSpeedHeading(update)}
      <div className="speed-slider-core-container" >
        <Slider
          mode={1}
          step={0.5}
          domain={domain}
          className={classes.slider}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
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

SpeedSlider.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(style)(SpeedSlider)
