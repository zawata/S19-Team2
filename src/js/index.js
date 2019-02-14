import * as THREE from './three'
import OrbitControls from './OrbitControls'
import Earth from './models/earth'
import Moon from './models/moon'

// Constants
const sunScale = 50;
const earthScale = 5;
const moonScale = 1.25;

// Class-like promise loader
// Pattern inspired by: https://blackthread.io/blog/promisifying-threejs-loaders/
const promisifyLoader = (loader, onProgress) => {
    let promiseLoader = (path) => {
        return new Promise( (resolve, reject) => {
            loader.load(path, resolve, onProgress, reject);
        });
    }
    return {
        originalLoader: loader,
        load: promiseLoader,
    };
}

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

// Create scene and camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5; // set camera away from origin
camera.position.x = 200;
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

// Create earth object
let earth = new Earth(0.5, earthScale);
earth.load().then((earthMesh) => {
    earth = earthMesh;
    scene.add(earth);
});

// Create moon object (ssshhh.... i'm actually using a pluto texture)
let moon = new Moon(0.1, moonScale);
moon.load().then((moonMesh) => {
    moon = moonMesh;
    scene.add(moon);
});

// Create axis of rotation
let earthAxis = new THREE.Vector3(0,0.4101524,0).normalize();
let moonAxis = new THREE.Vector3(0,0.116588,0).normalize();

const moonOrbitRadius = 5;
const earthOrbitRaius = 200;

// update function (runs on every frame)
const update = () => {
    let date = Date.now() * 0.0001;
    moon.position.z = earth.position.z + Math.cos(date * 5) * moonOrbitRadius;
    moon.position.x = earth.position.x + Math.sin(date * 5) * moonOrbitRadius;
    moon.position.y = earth.position.y + Math.sin(date * 5) * 2;

    earth.position.z = sphere.position.z + (1.2 * Math.cos(date)) * earthOrbitRaius;
    earth.position.x = sphere.position.x + (1.2 * Math.sin(date)) * earthOrbitRaius;

    earth.rotateOnAxis(earthAxis, 0.01);
    moon.rotateOnAxis(moonAxis, 0.0004);
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

animate();