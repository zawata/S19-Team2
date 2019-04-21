import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTrailType } from '../actions/spaceSceneActions';
import { selectCurrentTrailType } from '../reducers';

class TrailControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullTrail: (this.props.currentTrailType === 'full'),
      showPartialTrail: (this.props.currentTrailType === 'partial'),
      showNoTrail: (this.props.currentTrailType === '')
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(buttonClicked) {
    switch(buttonClicked) {
      case 'fullTrail':
        this.setState({
          showFullTrail: true,
          showPartialTrail: false,
          showNoTrail: false
        });
        this.props.updateTrailType('full');
        break;
      case 'partialTrail':
        this.setState({
          showPartialTrail: true,
          showFullTrail: false,
          showNoTrail: false
        });
        this.props.updateTrailType('partial');
        break;
      case '':
        this.setState({
          showPartialTrail: false,
          showFullTrail: false,
          showNoTrail: true
        });
        this.props.updateTrailType('');
    }
  }

  render() {
    return(
      <div className="multi-option-toggler">
        <span>Trajectory </span>
        <button className={'toggleControlsButton' + (this.state.showFullTrail ? ' selected' : '')}
          onClick={() => {this.handleClick('fullTrail')}}>Full</button>
        <button className={'toggleControlsButton' + (this.state.showPartialTrail ? ' selected' : '')}
          onClick={() => {this.handleClick('partialTrail')}}>Partial</button>
        <button className={'toggleControlsButton' + (this.state.showNoTrail ? ' selected' : '')}
          onClick={() => {this.handleClick('')}}>None</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentTrailType: selectCurrentTrailType(state)
});

export default connect(mapStateToProps, { updateTrailType })(TrailControls)