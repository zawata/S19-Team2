import React, { Component } from 'react';
import * as THREE from '../js/three';
import LensFlare from '../js/LensFlare'
import OrbitControls from '../js/OrbitControls';
import { addLighting, buildScene, addObjects } from './sceneHelper';

let earth = {};
let moon = {};
const earthScale = 4;
const moonScale = 3.5;
const moonOrbitRadius = 10;
const earthOrbitRadius = 930;
let pointLight;

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, onProgress, reject);
  });
}

/**
 * Structure should be
 * Make scene, camera, and renderer
 * Add lights
 * Add objects
 * Start animation
 */

export default class SpaceScene extends Component {

  componentDidMount() {
    
    let { scene, camera, controls, renderer } = buildScene();

    addLighting(scene).then(pointLighting => {
      pointLight = pointLighting;
    });

    addObjects(scene, earthScale, moonScale).then(({ earthObj, moonObj }) => {
      earth = earthObj;
      moon = moonObj;
    }).then(() => {
      animate();
    });

    // Add X, Y, Z axis helper (axes are colored in scene)
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create axis of rotation
    let axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

    const update = () => {
      let date = Date.now() * 0.00001;

      pointLight.position.x = earth.position.x + Math.sin(date) * earthOrbitRadius;
      pointLight.position.z = earth.position.z + Math.cos(date) * earthOrbitRadius;

      moon.position.x = earth.position.x + Math.sin(date * 3) * moonOrbitRadius;
      moon.position.z = earth.position.z + Math.cos(date * 3) * moonOrbitRadius;

      earth.rotateOnAxis(axis, 0.0009);
      moon.rotateOnAxis(axis, 0.001);
    };

    // sends scene and camera props to renderer
    const render = () => {
      renderer.render(scene, camera);
    };

    // gets new frame, updates, and renders scene
    const animate = () => {
      requestAnimationFrame(animate);
      update();
      render();
    };

  }

  render() {
    return(
      <div
        style={{ width: '100px', height: '100px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}