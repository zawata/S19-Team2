import React, { Component } from 'react';
import { connect } from 'react-redux';

import {

} from '../actions/spaceSceneActions';

class ShowTagButton extends Component {
  constructor(props) {
    super(props);

    this.state = { viewingMoon: false };

    this.handleToggle = this.handleToggle.bind(this);
  }


  handleToggle() {
    this.setState({ viewingMoon: !this.state.viewingMoon });
    // event.target.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> loading...';
    // this.state.viewingMoon ? this.props.updateCamera('solar')
    //   : this.props.updateCamera('moon');
  }

  render() {
    return(
      <div className="Show Tag">
        <button onClick={this.handleToggle}>{
          //this.state.viewingMoon ? 'View Earth' : 'View Moon'
          }
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { updateCamera })(SceneSwitchButton)