import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleLabels } from '../../actions/spaceSceneActions';
import { selectShowLabels } from '../../reducers';

class LabelControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLabels: this.props.showLabels
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.toggleLabels(!this.state.showLabels);
    this.setState(prevState => ({
      showLabels: !prevState.showLabels
    }));
  }

  render() {
    return(
      <div className="multi-option-toggler">
        <span>Labels </span>
        <button className={'toggleControlsButton' + (this.state.showLabels ? ' selected' : '')}
          onClick={() => {this.handleClick()}}>Show</button>
        <button className={'toggleControlsButton' + (!this.state.showLabels ? ' selected' : '')}
          onClick={() => {this.handleClick()}}>Hide</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  showLabels: selectShowLabels(state)
});

export default connect(mapStateToProps, { toggleLabels })(LabelControls)