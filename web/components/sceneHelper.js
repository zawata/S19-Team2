import * as THREE from '../three/three';
import { loadTexture } from '../textures/texture';
import OrbitControls from '../three/OrbitControls';
import LensFlare from '../three/LensFlare'
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

  // Create renderer
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add mouse controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Make scene responsive
  window.addEventListener('resize', function() {
    let widthWindow = window.innerWidth;
    let heightWindow = window.innerHeight;
    renderer.setSize(widthWindow, heightWindow);
    camera.aspect = widthWindow / heightWindow;
    camera.updateProjectionMatrix();
  });

  // Return created objects to the scene
  return {
    scene,
    camera,
    controls,
    renderer
  }
}

/**
 * addObjects
 * Adds earth and moon to the scene
 */
export async function addObjects(scene, earthScale, moonScale) {

    // Create base objects
    let earth = new Earth(0.5, earthScale);
    let moon = new Moon(0.1, moonScale);

    // Load earth texture, and add to the scene
    const earthMesh = await earth.load();
    earth = earthMesh;
    earth.position.x = 0;
    earth.position.y = 0;
    earth.position.z = 0;
    scene.add(earth);

    // Load moon texture, and add to scene
    const moonMesh = await moon.load();
    moon = moonMesh;
    scene.add(moon);

    // Return loaded earth and moon objects
    return {
        earthObj: earth,
        moonObj: moon
    };
}

/**
 * addLighting
 * Returns a promise that loads sun lighting / textures
 */
export async function addLighting(scene) {
  const textureFlare = await makeTextureFlare();
  let pointLight = makePointLight(0.995, 0.5, 0.9, 0, 0, 0);
  let lensFlare = makeLensflare(textureFlare, pointLight);
  scene.add(pointLight);
  pointLight.add(lensFlare);
  return pointLight;
}

/**
 * makeTextureFlare
 * loads the solarFlare texture
 */
export function makeTextureFlare() {
  return loadTexture(solarFlare, new THREE.TextureLoader())
}

/**
 * makePointLight
 * Creates point light and sets color of light
 */
export function makePointLight(h, s, l, x, y, z) {
  let light = new THREE.PointLight(0xffffff, 1.5, 2000);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);

  return light;
}

/**
 * makeLensflare
 * Creates lensflare effect
 */
export function makeLensflare(textureFlare, light) {
  let lensflare = new THREE.Lensflare();
  lensflare.addElement(new THREE.LensflareElement(textureFlare, 100, 0, light.color));
  return lensflare;
}

/**
 * addAxisHelper
 * Adds axis at origin to orient
 */
export function addAxisHelper(scene) {
  let axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}