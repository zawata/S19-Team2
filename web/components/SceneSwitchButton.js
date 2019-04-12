import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  updateCamera,
  SOLAR_CAMERA,
  MOON_CAMERA
} from '../actions/spaceSceneActions';

class SceneSwitchButton extends Component {
  constructor(props) {
    super(props);

    this.state = { viewingMoon: false };

    this.handleToggle = this.handleToggle.bind(this);
  }


  handleToggle() {
    this.setState({ viewingMoon: !this.state.viewingMoon });
    // event.target.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> loading...';
    this.state.viewingMoon ? this.props.updateCamera('solar')
      : this.props.updateCamera('moon');
  }

  render() {
    return(
      <div className="toggleControlsButton">
        <button onClick={this.handleToggle}>{
          this.state.viewingMoon ? 'Earth View' : 'Moon View' 
          }
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { updateCamera })(SceneSwitchButton)