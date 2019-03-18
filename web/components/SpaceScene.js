import React, { Component } from 'react';
import * as THREE from '../js/three';
import LensFlare from '../js/LensFlare'
import OrbitControls from '../js/OrbitControls';
import Earth from '../js/models/earth'
import Moon from '../js/models/moon'
import Sun from '../js/models/sun'
import { buildScene, makeTextureFlare, makePointLight, makeLensflare } from './sceneHelper';

const sunScale = 5;
const earthScale = 4;
const moonScale = 3.5;
const moonOrbitRadius = 10;
const earthOrbitRadius = 930;

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, onProgress, reject);
  });
}

export default class SpaceScene extends Component {

  componentDidMount() {
    
    let { scene, camera, controls, renderer } = buildScene();

    let pointLight;
    makeTextureFlare().then(textureFlare => {
      pointLight = makePointLight(0.995, 0.5, 0.9, 0, 0, 0);
      let lensFlare = makeLensflare(textureFlare, pointLight);
      scene.add(pointLight);
      pointLight.add(lensFlare);
    });

    // Add X, Y, Z axis helper (axes are colored in scene)
    let axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create axis of rotation
    let axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

    //Scene 1 spheres
    // Declaring update, render, and animation function: rotations for the first scene
    const update = () => {
      let date = Date.now() * 0.00001;

      pointLight.position.x = earth.position.x + Math.sin(date) * earthOrbitRadius;
      pointLight.position.z = earth.position.z + Math.cos(date) * earthOrbitRadius;

      moon.position.x = earth.position.x + Math.sin(date * 3) * moonOrbitRadius;
      moon.position.z = earth.position.z + Math.cos(date * 3) * moonOrbitRadius;

      earth.rotateOnAxis(axis, 0.0009);
      moon.rotateOnAxis(axis, 0.001); //moon's rotation on its axis

      // controls.target.set(moon.position.x, moon.position.y, moon.position.z);
    };

    let earth = new Earth(0.5, earthScale);
    let moon = new Moon(0.1, moonScale);

    // Load and Kick Off Simulation
    earth.load().then((earthMesh) => {
      earth = earthMesh;
      earth.position.x = 0;
      earth.position.y = 0;
      earth.position.z = 0;
      debugger;
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