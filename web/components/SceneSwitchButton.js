import React, { Component } from 'react';

export default class SceneSwitchButton extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }


  handleToggle() {
    console.log('I was clicked!');
    event.target.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> loading...';
  }

  render() {
    return(
      <div className="changeSceneButtonID">
        <button onClick={this.handleToggle} className="btn btn-secondary">
          <i className="fas fa-rocket"></i>
          <span className="button-text">View the Moon</span>
        </button>
      </div>
    )
  }
}