import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as THREE from '../three/three';

import * as pos_store from '../libraries/position_store'
import {
  addLighting,
  buildScene,
  addObjects,
  addAxisHelper
} from './sceneHelper';
import config from '../config/config';
import { selectCurrentTrailType, selectCurrentCamera } from '../reducers';

const earthScale = 0.0085270424;
const moonScale = 0.0023228;
const axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

class SpaceScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      earth: {},
      moon: {},
      satellite: {},
      pointLight: {},
      fullTrail: {},
      partialTrail: {}
    };

    //starts the update loop
    pos_store.init_store();
  }

  /**
   * componentDidMount
   * Lifecycle method in React
   * Gets called everytime the component (page) loads
   */
  async componentDidMount() {

    /**
     * Update function
     * Runs every frame to animate the scene
     */
    const update = () => {
      let sun_pos = pos_store.get_object_position("sun");
      this.state.pointLight.position.x = sun_pos.x;
      this.state.pointLight.position.y = sun_pos.y;
      this.state.pointLight.position.z = sun_pos.z;

      let moon_pos = pos_store.get_object_position("moon");
      this.state.moon.position.x = moon_pos.x;
      this.state.moon.position.y = moon_pos.y;
      this.state.moon.position.z = moon_pos.z;

      let sat_pos = pos_store.get_object_position(config.mainSpacecraftName);
      this.state.satellite.position.x = sat_pos.x;
      this.state.satellite.position.y = sat_pos.y;
      this.state.satellite.position.z = sat_pos.z;

      this.state.moon.lookAt(0,0,0);

      moonCamera.lookAt(this.state.moon.position);

      let satVelocityMagnitude = Math.sqrt(
        Math.pow(sat_pos.dx, 2) + Math.pow(sat_pos.dy, 2) + Math.pow(sat_pos.dz, 2)
      );
      let normalizedSatelliteVelocityVector = {
        x: sat_pos.dx/satVelocityMagnitude,
        y: sat_pos.dy/satVelocityMagnitude,
        z: sat_pos.dz/satVelocityMagnitude
      }
      spacecraftCamera.position.x = sat_pos.x - normalizedSatelliteVelocityVector.x*.001;
      spacecraftCamera.position.y = sat_pos.y - normalizedSatelliteVelocityVector.y*.001;
      spacecraftCamera.position.z = sat_pos.z - normalizedSatelliteVelocityVector.z*.001;
      spacecraftCamera.lookAt(this.state.satellite.position);
      console.log("spacecraft camera pos: ");
      console.log(spacecraftCamera.position);

      this.state.earth.rotateOnAxis(axis, 0.0009);
      this.state.moon.rotateOnAxis(axis, 0.001);
    };

    /**
     * Render function
     * sends scene and camera props to renderer
     */
    const render = () => {
      switch(this.props.selectedCamera) {
        case 'solar':
          renderer.render(scene, solarCamera);
          break;
        case 'moon':
          renderer.render(scene, moonCamera);
          break;
        case 'spacecraft':
          renderer.render(scene, spacecraftCamera);
          break;
        default:
          renderer.render(scene, solarCamera);
      }
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
    let { scene, solarCamera, moonCamera, spacecraftCamera, controls, renderer } = buildScene();

    // Add lighting (sun flare)
    let lighting = await addLighting(scene);
    this.setState({ pointLight: lighting });

    // Load mesh objects for earth and moon
    let { earthObj, moonObj, satelliteObj } = await addObjects(scene, earthScale, moonScale);
    this.setState({ earth: earthObj });
    this.setState({ moon: moonObj });
    this.setState({ satellite: satelliteObj });

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
  currentTrailType: selectCurrentTrailType(state),
  selectedCamera: selectCurrentCamera(state)
});

export default connect(mapStateToProps, {})(SpaceScene)
