import * as THREE from '../js/three';
import OrbitControls from '../js/OrbitControls';
import solarFlare from '../lensflare0.png';
import solarBubble from '../lensflare3.png';

export function buildScene() {
  let scene = new THREE.Scene();

  //The scenes share the same camera, controls, renderer defined below
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10; // set camera away from origin
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

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, onProgress, reject);
  });
}