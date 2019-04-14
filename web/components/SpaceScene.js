import React, { Component } from 'react';
import * as THREE from '../three/three';
import { 
  addLighting,
  buildScene, 
  addObjects,
  addAxisHelper
} from './sceneHelper';

const earthScale = 0.0085;
const moonScale = 0.00232;
// const earthScale = 

// Moon Orbit Radius to be calculated in real-time using spyce data
// const moonOrbitRadius = 2.38;

// Earth Orbit Radius to be calculated in real-time using spyce data
// const earthOrbitRadius = 930;
const axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

export default class SpaceScene extends Component {

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