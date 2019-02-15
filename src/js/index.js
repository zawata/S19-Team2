import * as THREE from './three'
import OrbitControls from './OrbitControls'
import Earth from './models/earth'
import Moon from './models/moon'
import Sun from './models/sun'

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

//Code to adapt to resizing of windows- fit to window size
window.addEventListener('resize', function() {
                    var widthWindow = window.innerWidth;
                    var heightWindow = window.innerHeight;
                    renderer.setSize(widthWindow, heightWindow);
                    camera.aspect = widthWindow/heightWindow;
                    camera.updateProjectionMatrix();
                });


//This lighting makes the Sun glow and removes shadow from the sun
//Ambient and Directional light do not look as good as HemiLight
let hemiLight = new THREE.HemisphereLight( 0xf2c559, 0xffffff, 1.25 );
scene.add(hemiLight);

// Add X, Y, Z axis helper (axes are colored in scene)
let axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//Create sun object
let sun = new Sun(3);
sun.load().then((sunMesh) => {
    sun = sunMesh;
    sun.scale.set(sunScale,sunScale,sunScale);
    scene.add(sun);
});


// Create earth object
let earth = new Earth(0.5, earthScale);
earth.load().then((earthMesh) => {
    earth = earthMesh;
    scene.add(earth);
});

// Create moon object
let moon = new Moon(0.1, moonScale);
moon.load().then((moonMesh) => {
    moon = moonMesh;
    scene.add(moon);
});

// Create axis of rotation
let axis = new THREE.Vector3(0,0.4101524,0).normalize();

const moonOrbitRadius = 5;
const earthOrbitRaius = 200;

// update function (runs on every frame)
const update = () => {
    let date = Date.now() * 0.0001;
    moon.position.x = earth.position.x + Math.cos(date * 10) * moonOrbitRadius;
    moon.position.z = earth.position.z + Math.sin(date * 10) * moonOrbitRadius;

    earth.position.x = sun.position.x + Math.cos(date) * earthOrbitRaius;
    earth.position.z = sun.position.z + Math.sin(date) * earthOrbitRaius;

    sun.rotateOnAxis(axis, 0.01);
    earth.rotateOnAxis(axis, 0.01);
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
