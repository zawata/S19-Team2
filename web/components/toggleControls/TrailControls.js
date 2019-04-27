import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTrailType } from '../../actions/spaceSceneActions';
import { selectCurrentTrailType } from '../../reducers';

const FULL_TRAIL = 'full';
const PARTIAL_TRAIL = 'partial';
const NO_TRAIL = '';

class TrailControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTrailType: this.props.currentTrailType
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(buttonClicked) {
    this.props.updateTrailType(buttonClicked);
    this.setState({ selectedTrailType: buttonClicked });
  }

  render() {
    return(
      <div className="multi-option-toggler">
        <span>Trajectory </span>
        <button className={'toggleControlsButton' + (this.state.selectedTrailType === FULL_TRAIL ? ' selected' : '')}
          onClick={() => {this.handleClick(FULL_TRAIL)}}>Full</button>
        <button className={'toggleControlsButton' + (this.state.selectedTrailType === PARTIAL_TRAIL ? ' selected' : '')}
          onClick={() => {this.handleClick(PARTIAL_TRAIL)}}>Partial</button>
        <button className={'toggleControlsButton' + (this.state.selectedTrailType === NO_TRAIL ? ' selected' : '')}
          onClick={() => {this.handleClick(NO_TRAIL)}}>None</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentTrailType: selectCurrentTrailType(state)
});

export default connect(mapStateToProps, { updateTrailType })(TrailControls)