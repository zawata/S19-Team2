import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCamera } from '../actions/spaceSceneActions';
import { selectCurrentCamera } from '../reducers';

class CameraControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solarCamera: (this.props.currentCamera === 'solar'),
      moonCamera: (this.props.currentCamera === 'moon'),
      spacecraftCamera: (this.props.currentCamera == 'spacecraft')
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(buttonClicked) {
    switch(buttonClicked) {
      case 'solar':
        this.setState({
          solarCamera: true,
          moonCamera: false,
          spacecraftCamera: false
        });
        this.props.updateCamera('solar');
        break;
      case 'moon':
        this.setState({
          solarCamera: false,
          moonCamera: true,
          spacecraftCamera: false
        });
        this.props.updateCamera('moon');
        break;
      case 'spacecraft':
        this.setState({
          solarCamera: false,
          moonCamera: false,
          spacecraftCamera: true
        });
        this.props.updateCamera('spacecraft');
        break;
    }
  }

  render() {
    return(
      <div className="multi-option-toggler">
        <span>Camera </span>
        <button className={'toggleControlsButton' + (this.state.solarCamera ? ' selected' : '')}
          onClick={() => {this.handleClick('solar')}}>Solar</button>
        <button className={'toggleControlsButton' + (this.state.moonCamera ? ' selected' : '')}
          onClick={() => {this.handleClick('moon')}}>Moon</button>
        <button className={'toggleControlsButton' + (this.state.spacecraftCamera ? ' selected' : '')}
          onClick={() => {this.handleClick('spacecraft')}}>Spacecraft</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentCamera: selectCurrentCamera(state)
});

export default connect(mapStateToProps, { updateCamera })(CameraControls)