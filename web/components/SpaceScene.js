import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as THREE from '../three/three';

import * as pos_store from '../libraries/position_store'
import {
  addLighting,
  buildScene,
  addObjects
} from './sceneHelper';
import config from '../config/config';
import {
  selectCurrentTrailType,
  selectCurrentCamera,
  selectShowLabels
} from '../reducers';

const earthScale = 0.0085270424;
const moonScale = 0.0023228;
const axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

class SpaceScene extends Component {

  constructor(props) {
    super(props);
    this.state = {};

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
      pointLight.position.x = sun_pos.x;
      pointLight.position.y = sun_pos.y;
      pointLight.position.z = sun_pos.z;

      let moon_pos = pos_store.get_object_position("moon");
      moonObj.position.x = moon_pos.x;
      moonObj.position.y = moon_pos.y;
      moonObj.position.z = moon_pos.z;

      let sat_pos = pos_store.get_object_position(config.mainSpacecraftName);
      satelliteObj.position.x = sat_pos.x;
      satelliteObj.position.y = sat_pos.y;
      satelliteObj.position.z = sat_pos.z;

      moonObj.lookAt(0,0,0);

      moonCamera.lookAt(moonObj.position);

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
      spacecraftCamera.lookAt(satelliteObj.position);

      scene.remove(currentTrailObj);
      if(this.props.currentTrailType == "full") {
        currentTrailObj = trailObj.getFullPath();
      } else if(this.props.currentTrailType == "partial") {
        currentTrailObj = trailObj.getPartialPath(pos_store.get_working_date());
      } else {
        currentTrailObj = null;
      }

      if(currentTrailObj) {
        scene.add(currentTrailObj);
      }

      earthObj.rotateOnAxis(axis, 0.0009);
      moonObj.rotateOnAxis(axis, 0.001);

      labelList.forEach(label => {
        label.updatePosition(renderer, selectedCameraObj, this.props.showLabels);
      });
    };

    /**
     * Render function
     * sends scene and camera props to renderer
     */
    const render = () => {
      renderer.render(scene, selectedCameraObj);
    };

    /**
     * Animate function
     * gets new frame, updates, and renders scene
     */
    const animate = () => {
      requestAnimationFrame(animate);

      switch(this.props.selectedCamera) {
      case 'solar':
        selectedCameraObj = solarCamera;
        break;
      case 'moon':
        selectedCameraObj = moonCamera;
        break;
      case 'spacecraft':
        selectedCameraObj = spacecraftCamera;
        break;
      default:
        selectedCameraObj = solarCamera;
      }

      update();
      render();
    };

    // Build base scene objects
    let { scene, solarCamera, moonCamera, spacecraftCamera, controls, renderer } = buildScene();

    // Add lighting (sun flare)
    let pointLight = await addLighting(scene);

    // Load mesh objects
    let {
      earthObj,
      moonObj,
      satelliteObj,
      trailObj,
      labelList
    } = await addObjects(scene, earthScale, moonScale);
    let currentTrailObj;
    let selectedCameraObj = solarCamera;

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
  selectedCamera: selectCurrentCamera(state),
  showLabels: selectShowLabels(state)
});

export default connect(mapStateToProps, {})(SpaceScene)
