import React, { Component } from 'react';
import * as THREE from '../js/three';
import LensFlare from '../js/LensFlare'
import OrbitControls from '../js/OrbitControls';
import Earth from '../js/models/earth'
import Moon from '../js/models/moon'
import Sun from '../js/models/sun'
import { addLighting, buildScene, makeTextureFlare, makePointLight, makeLensflare } from './sceneHelper';

let earth;
let moon;
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

    earth = new Earth(0.5, earthScale);
    moon = new Moon(0.1, moonScale);

    // Load and Kick Off Simulation
    earth.load().then((earthMesh) => {
      earth = earthMesh;
      earth.position.x = 0;
      earth.position.y = 0;
      earth.position.z = 0;
      scene.add(earth);
      return moon.load();
    }).then((moonMesh) => {
      moon = moonMesh;
      scene.add(moon);
    }).then(() => {
      animate();
    });;

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