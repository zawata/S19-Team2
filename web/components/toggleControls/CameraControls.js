import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCamera } from '../../actions/spaceSceneActions';
import { selectCurrentCamera } from '../../reducers';

const SOLAR = 'solar';
const MOON = 'moon';
const SPACECRAFT = 'spacecraft';

class CameraControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCamera: this.props.currentCamera
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(buttonClicked) {
    this.props.updateCamera(buttonClicked);
    this.setState({ selectedCamera: buttonClicked });
  }

  render() {
    return(
      <div className="multi-option-toggler">
        <span>Camera </span>
        <button className={'toggleControlsButton' + (this.state.selectedCamera === SOLAR ? ' selected' : '')}
          onClick={() => {this.handleClick(SOLAR)}}>Solar</button>
        <button className={'toggleControlsButton' + (this.state.selectedCamera === MOON ? ' selected' : '')}
          onClick={() => {this.handleClick(MOON)}}>Moon</button>
        <button className={'toggleControlsButton' + (this.state.selectedCamera === SPACECRAFT ? ' selected' : '')}
          onClick={() => {this.handleClick(SPACECRAFT)}}>Spacecraft</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCamera: selectCurrentCamera(state)
});

export default connect(mapStateToProps, { updateCamera })(CameraControls)