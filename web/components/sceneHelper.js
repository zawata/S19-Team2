import * as THREE from '../three/three';
import { loadTexture } from '../textures/texture';
import OrbitControls from '../three/OrbitControls';
import solarFlare from '../textures/lensflare0.png';
import Earth from '../models/earth'
import Moon from '../models/moon'

/**
 * buildScene
 * Creates the scene, camera, and controls
 */
export function buildScene() {
  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  camera.position.x = 10;
  camera.position.y = 0;

  // Add mouse controls
  const controls = new OrbitControls(camera);

  // Create renderer
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //Code to adapt to resizing of windows- fit to window size
  window.addEventListener('resize', function() {
    let widthWindow = window.innerWidth;
    let heightWindow = window.innerHeight;
    renderer.setSize(widthWindow, heightWindow);
    camera.aspect = widthWindow / heightWindow;
    camera.updateProjectionMatrix();
  });

  return {
    scene,
    camera,
    controls,
    renderer
  }
}

export function makeTextureFlare() {
  return loadTexture(solarFlare, new THREE.TextureLoader())
}

export function makePointLight(h, s, l, x, y, z) {
  let light = new THREE.PointLight(0xffffff, 1.5, 2000);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);

  return light;
}

export function makeLensflare(textureFlare, light) {
  let lensflare = new THREE.Lensflare();
  lensflare.addElement(new THREE.LensflareElement(textureFlare, 100, 0, light.color));
  return lensflare;
}

export function addLighting(scene) {
  return new Promise((resolve, reject) => {
    makeTextureFlare().then(textureFlare => {
      let pointLight = makePointLight(0.995, 0.5, 0.9, 0, 0, 0);
      let lensFlare = makeLensflare(textureFlare, pointLight);
      scene.add(pointLight);
      pointLight.add(lensFlare);
      resolve(pointLight);
    });
  });
}

export function addObjects(scene, earthScale, moonScale) {
  return new Promise((resolve, reject) => {
    let earth = new Earth(0.5, earthScale);
    let moon = new Moon(0.1, moonScale);
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
      resolve({
        earthObj: earth,
        moonObj: moon
      });
    });
  });
}

export function addAxisHelper(scene) {
  let axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}


// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, onProgress, reject);
  });
}