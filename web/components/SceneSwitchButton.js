import React, { Component } from 'react';

export default class SceneSwitchButton extends Component {
  render() {
    return(
      <div className="changeSceneButtonID">
        <button type="button" className="btn btn-secondary">
          <i className="fas fa-rocket">Fly to Moon</i> 
        </button>
      </div>
    )
  }
}