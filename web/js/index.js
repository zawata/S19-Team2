import * as THREE from './three'
import OrbitControls from './OrbitControls'
import Earth from './models/earth'
import Moon from './models/moon'
import Sun from './models/sun'
import solarFlare from '../lensflare0.png'
import solarBubble from '../lensflare3.png'

// Constants
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

// Create scene and camera
let scene;
let spaceScene = new THREE.Scene();
let moonScene = new THREE.Scene();

scene = spaceScene;

//The button loading animation uses Bootstrap and Font Awesome
$('#changeSceneButtonID').on('click', function(event) {
  event.target.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> loading...';
  if (scene == spaceScene) {
    setTimeout(function() {
      $('#changeSceneButtonID').html('<i class="fas fa-rocket"></i>  Fly Back');
    }, 1500);
    scene = moonScene;
  } else {
    setTimeout(function() {
      $('#changeSceneButtonID').html('<i class="fas fa-rocket"></i>  Fly to Moon');
    }, 1500);
    scene = spaceScene;
  }
});

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

//The following textures and flares are for the Sun in the first scene
let textureFlare0;
let textureFlare3;
let solarFlareLight;

loadTexture(solarFlare, new THREE.TextureLoader()).then((flareTexture) => {
  textureFlare0 = flareTexture;
  loadTexture(solarBubble, new THREE.TextureLoader());
}).then((bubbleFlareTexture) => {
  textureFlare3 = bubbleFlareTexture;
}).then(() => {
  solarFlareLight = addLight(0.995, 0.5, 0.9, 0, 0, 0);
}).catch((err) => {
  console.error(err);
});

// https://threejs.org/examples/#webgl_lensflares
function addLight(h, s, l, x, y, z) {
  let light = new THREE.PointLight(0xffffff, 1.5, 2000);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);
  spaceScene.add(light);
  let lensflare = new THREE.Lensflare();
  lensflare.addElement(new THREE.LensflareElement(textureFlare0, 100, 0, light.color));
  light.add(lensflare);

  return light;
}

// Add X, Y, Z axis helper (axes are colored in scene)
let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Create axis of rotation
let axis = new THREE.Vector3(0, 0.4101524, 0).normalize();

//Scene 1 spheres
// Declaring update, render, and animation function: rotations for the first scene
const update = () => {
  let date = Date.now() * 0.00001;

  solarFlareLight.position.x = earth.position.x + Math.sin(date) * earthOrbitRadius;
  solarFlareLight.position.z = earth.position.z + Math.cos(date) * earthOrbitRadius;

  moon.position.x = earth.position.x + Math.sin(date * 3) * moonOrbitRadius;
  moon.position.z = earth.position.z + Math.cos(date * 3) * moonOrbitRadius;

  earth.rotateOnAxis(axis, 0.0009);
  moon.rotateOnAxis(axis, 0.001); //moon's rotation on its axis
};

let sun = new Sun(sunScale);
let earth = new Earth(0.5, earthScale);
let moon = new Moon(0.1, moonScale);

// Load and Kick Off Simulation
earth.load().then((earthMesh) => {
  earth = earthMesh;
  earth.position.x = 0;
  earth.position.y = 0;
  earth.position.z = 0;
  spaceScene.add(earth);
  return moon.load();
}).then((moonMesh) => {
  moon = moonMesh;
  spaceScene.add(moon);
  return sun.load();
}).then((sunMesh) => {
}).then(() => {
  animate();
});;

//Scene 2 here: Just Moon right now
//Extra light created for moonScene
let lightMoonScene = new THREE.DirectionalLight(0xffffff);
lightMoonScene.position.set(0, 0, 0).normalize();

moonScene.add(lightMoonScene);

let moonEnlarged = new Moon(0.8, moonScale);

moonEnlarged.load().then((moonMeshEnlarged) => {
  moonEnlarged = moonMeshEnlarged;
  moonEnlarged.position.x = 0;
  moonEnlarged.position.y = 0;
  moonEnlarged.position.z = 0;
  moonScene.add(moonEnlarged);
}).then(() => {
  render();
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
