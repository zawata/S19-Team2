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
  getObjectCoverage
} from '../actions/spaceSceneActions';
import {
  selectAllObjects,
  selectMainObject
} from '../reducers';

const earthScale = 4;
const moonScale = 3.5;
const moonOrbitRadius = 10;
const earthOrbitRadius = 930;
const axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

class SpaceScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      earth: {},
      moon: {},
      pointLight: {}
    };
  }

  /**
   * componentDidMount
   * Lifecycle method in React
   * Gets called everytime the component (page) loads
   */
  async componentDidMount() {
    this.props.getMainObject();
    this.props.getObjectList();
    this.props.getObjectCoverage('earth');
    this.props.getObjectFrame('LMAP', 'earth', new Date());
    this.props.getObjectFrames('LMAP', 'earth', [
      new Date(),                       //today
      new Date("2018-10-10T00:00:00Z"), //date shortly after launch
      new Date("2020-04-25T00:00:00Z")  //date shortly before mission end
    ]);
    this.props.getObjectCoverage('earth');

    /**
     * Update function
     * Runs every frame to animate the scene
     */
    const update = () => {
      let date = Date.now() * 0.00001;

      this.state.pointLight.position.x = this.state.earth.position.x + Math.sin(date) * earthOrbitRadius;
      this.state.pointLight.position.z = this.state.earth.position.z + Math.cos(date) * earthOrbitRadius;

      this.state.moon.position.x = this.state.earth.position.x + Math.sin(date * 3) * moonOrbitRadius;
      this.state.moon.position.z = this.state.earth.position.z + Math.cos(date * 3) * moonOrbitRadius;

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
  objectList: selectAllObjects(state)
});

export default connect(mapStateToProps, {
  getObjectList,
  getMainObject,
  getObjectFrame,
  getObject,
  getObjectFrames,
  getObjectCoverage
})(SpaceScene)
