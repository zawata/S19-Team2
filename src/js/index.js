import * as THREE from './three'
import OrbitControls from './OrbitControls'
import Earth from './models/earth'
import Moon from './models/moon'

// Constants
const sunScale = 5;
const earthScale = 4;
const moonScale = 1;
const moonOrbitRadius = 50; //Real Life: Radius is 100x that of the size of the moon
const earthOrbitRaius = 930;

// Create scene and camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 10; // set camera away from origin
camera.position.x = 10;
camera.position.y = 0;

// Add mouse controls
const controls = new OrbitControls(camera);

// Create renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add lighting
let directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
let ambientLight = new THREE.AmbientLight(0xff0000, 3.0);
scene.add(directionalLight);
scene.add(ambientLight);

// Add X, Y, Z axis helper (axes are colored in scene)
let axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Create wire-frame 'sun' and add to the scene
let geometry = new THREE.SphereGeometry( 3, 32, 32 );
let material = new THREE.MeshPhongMaterial( {color: 0xffff00, wireframe: true} );
let sphere = new THREE.Mesh( geometry, material );
sphere.scale.set(sunScale,sunScale,sunScale);
sphere.rotation.x += 0.5;
scene.add( sphere );

// Create axis of rotation
let axis = new THREE.Vector3(0,0.4101524,0).normalize();

// Declaring update, render, and animation function
const update = () => {
    let date = Date.now() * 0.00001;

    sphere.position.x = earth.position.x + Math.cos(date) * earthOrbitRaius;
    sphere.position.z = earth.position.z + Math.sin(date) * earthOrbitRaius;

    moon.position.x = earth.position.x + Math.cos(date * 2) * moonOrbitRadius;
    moon.position.z = earth.position.z + Math.sin(date * 2) * moonOrbitRadius;

    // sphere.rotateOnAxis(axis, 0.0);
    earth.rotateOnAxis(axis, 0.002);
};

// sends scene and camera props to renderer
const render = () => {
    renderer.render(scene, camera);
};

// gets new frame, updates, and renders scene
const animate = () => {
    requestAnimationFrame( animate );
    update();
    render();
};

let earth = new Earth(0.5, earthScale);
let moon = new Moon(0.1, moonScale);

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
});




