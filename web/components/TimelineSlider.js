import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source in sliderComponents
import { subDays, startOfToday, format, getTime } from "date-fns";
import { scaleTime } from "d3-scale";

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

export default class TimelineSlider extends Component {
  constructor(props) {
    super(props);

    // Setting min and max of slider
    const today = startOfToday();
    const missionStart = getTime(new Date(2019, 1, 5, 0, 0, 0, 0));
    const missionEnd = getTime(new Date(2020, 8, 21, 0, 0, 0, 0));

    this.state = {
      selected: today,
      updated: today,
      min: missionStart,
      max: missionEnd
    };
  }

  onChange = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
  };

  onUpdate = ([ms]) => {
    this.setState({
      updated: new Date(ms)
    });
  };

  renderDateTime(date) {
    return (
      <div className="displayed-date">
        <div className="date">Date: {format(date, "MMM Do YYYY h:mm a")}</div>
      </div>
    );
  }

  render() {
    const { min, max, selected, updated } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(12)
      .map(d => +d);

    return (
      <div className="date-picker">
        {/* {this.renderDateTime(selected)} */}
        {this.renderDateTime(updated)}
        <div className="core-slider">
          <Slider
            mode={1}
            step={halfHour}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={[+selected]}
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
