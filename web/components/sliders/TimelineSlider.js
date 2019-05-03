import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source in sliderComponents
import { format, getTime } from "date-fns";
import { scaleTime } from "d3-scale";
import { updateSimulationTime } from '../../actions/spaceSceneActions';
import { selectSimulationTime } from '../../reducers';
import { set_working_date, get_coverage } from '../../libraries/position_store';

const sliderStyle = {
  position: "relative",
  width: "100%"
};

// Format of bottom ticks of slider
function formatTick(ms) {
  return format(new Date(ms), "MMM YYYY");
}

// Seting tick distance
const halfHour = 1000 * 60 * 30;
const month = 1000 * 60 * 60 * 24 * 7 * 4;

class TimelineSlider extends Component {
  constructor(props) {
    super(props);

    // Setting min and max of slider
    const coverage = get_coverage();
    //Plus and minuus half hour added to keep slider from rounding to uncovered dates.
    const missionStart = getTime(coverage.start) + halfHour;
    const missionEnd = getTime(coverage.end) - halfHour;

    // Check that current time is within mission time
    if (this.props.simulationTime <= missionStart
      || this.props.simulationTime >= missionEnd) {
      this.props.updateSimulationTime(missionStart);
    }
    this.state = {
      updated: this.props.simulationTime,
      allowTick: true,
      min: missionStart,
      max: missionEnd
    };
  }

  // On user letting go of slider after update
  onChange = ([ms]) => {
    if (!Number.isNaN(ms) && ms != undefined && ms != null) {
      // Only change the date if it was triggered by a user input
      if (!this.state.allowTick) {
        set_working_date(new Date(ms));
        this.props.updateSimulationTime(ms);
      }
      // Allow the slider to tick after user is done changing the date
      this.setState({
        allowTick: true,
      })
    }
  };

  // On user drag
  onUpdate = ([ms]) => {
    if (!Number.isNaN(ms) && ms != undefined && ms != null){
      // Don't allow the slider to tick while the user is updating the date
      this.setState({
        updated: new Date(ms),
        allowTick: false,
      });
    }
  };

  // Returns a div with proper date formatting
  renderDateTime(date) {
    return (
      <div className="displayed-date">
        <div className="date">Date: {format(date, "MMM Do YYYY h:mm:ss a")}</div>
      </div>
    );
  }

  render() {
    const { min, max, updated } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(12)
      .map(d => +d);

    return (
      <div className="date-picker">
        {this.state.allowTick ? this.renderDateTime(this.props.simulationTime) : this.renderDateTime(this.state.updated)}
        <div className="core-slider">
          <Slider
            mode={1}
            step={halfHour}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={[+this.props.simulationTime]}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={[+min, +max]}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
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
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={formatTick}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
  }
}

/**
 * Redux Pattern
 * binds this.props.simulationTime to the
 * current value of the simulation time in the store
 */
const mapStateToProps = (state) => ({
  simulationTime: selectSimulationTime(state)
});

export default connect(mapStateToProps, { updateSimulationTime })(TimelineSlider)