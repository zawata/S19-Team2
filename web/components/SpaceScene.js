import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as THREE from '../three/three';
import {
  addLighting,
  buildScene,
  addObjects,
  addAxisHelper
} from './sceneHelper';
import {
  getObjectList,
  getMainObject,
  getObjectFrame,
  getObject,
  getObjectFrames,
  getObjectCoverage,
  updateObjectPositions
} from '../actions/spaceSceneActions';
import {
  selectAllObjects,
  selectMainObject,
  selectMoonPosition,
  selectLMAPPosition,
  selectSunPosition
} from '../reducers';

const earthScale = 0.0085270424;
const moonScale = 0.0023228;
const axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

class SpaceScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      earth: {},
      moon: {},
      pointLight: {}
    };

    this.updatePositions = this.updatePositions.bind(this);
  }

  /**
   * componentDidMount
   * Lifecycle method in React
   * Gets called everytime the component (page) loads
   */
  async componentDidMount() {

    setInterval(this.updatePositions, 3000);

    /**
     * Update function
     * Runs every frame to animate the scene
     */
    const update = () => {
      this.state.pointLight.position.x = this.props.sunPosition.x;
      this.state.pointLight.position.y = this.props.sunPosition.y;
      this.state.pointLight.position.z = this.props.sunPosition.z;

      this.state.moon.position.x = this.props.moonPosition.x;
      this.state.moon.position.y = this.props.moonPosition.y;
      this.state.moon.position.z = this.props.moonPosition.z;

      this.state.earth.rotateOnAxis(axis, 0.0009);
      this.state.moon.rotateOnAxis(axis, 0.001);
    };

    /**
     * Render function
     * sends scene and camera props to renderer
     */
    const render = () => {
      renderer.render(scene, camera);
    };

    /**
     * Animate function
     * gets new frame, updates, and renders scene
     */
    const animate = () => {
      requestAnimationFrame(animate);
      update();
      render();
    };

    // Build base scene objects
    let { scene, camera, controls, renderer } = buildScene();

    // Add lighting (sun flare)
    let lighting = await addLighting(scene);
    this.setState({ pointLight: lighting });

    // Load mesh objects for earth and moon
    let { earthObj, moonObj } = await addObjects(scene, earthScale, moonScale);
    this.setState({ earth: earthObj });
    this.setState({ moon: moonObj });

    addAxisHelper(scene);

    animate();
  }

  updatePositions() {
    const bodiesToUpdate = ['moon', 'LMAP', 'sun'];
    const observer = 'earth';
    const currentDate = new Date();
    this.props.updateObjectPositions(bodiesToUpdate, observer, currentDate);
  }

  render() {
    return(
      <div className="space-scene"
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

/**
 * mapStateToProps
 * maps state in redux store (right)
 * to component props property (left)
 */
const mapStateToProps = state => ({
  mainObject: selectMainObject(state),
  objectList: selectAllObjects(state),
  moonPosition: selectMoonPosition(state),
  lmapPosition: selectLMAPPosition(state),
  sunPosition: selectSunPosition(state)
});

export default connect(mapStateToProps, {
  getObjectList,
  getMainObject,
  getObjectFrame,
  getObject,
  getObjectFrames,
  getObjectCoverage,
  updateObjectPositions
})(SpaceScene)
