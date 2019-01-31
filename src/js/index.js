import * as THREE from './three.js'
import OrbitControls from './OrbitControls.js'
import earthTextureImg from '../earthmap1k.jpg'
import totallyMoonTexture from '../plutomap1k.jpg'
import bumpImg from '../earthbump1k.jpg'

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
    return new Promise( (resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

// Create scene and camera
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5; // set camera away from origin

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

// Create wire-frame object and add to the scene
let geometry = new THREE.SphereGeometry( 3, 32, 32 );
let material = new THREE.MeshPhongMaterial( {color: 0xffff00, wireframe: true} );
let sphere = new THREE.Mesh( geometry, material );
sphere.rotation.x += 0.5;
scene.add( sphere );

// Create earth object
let earthMesh;
let earthMaterial;
loadTexture(earthTextureImg, new THREE.TextureLoader()).then((earthTexture) => {
    debugger;
    let earthGeo = new THREE.SphereGeometry(0.5, 32, 32);
    let earthMaterial = new THREE.MeshBasicMaterial({
        map : 	earthTexture,
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
    earthMesh.rotation.x += 0.5;
    earthMesh.position.x += 5;
    scene.add(earthMesh);
}).catch((err) => {
    console.log(err);
});

// Create moon object (ssshhh.... i'm actually using a pluto texture)
let moonMesh;
loadTexture(totallyMoonTexture, new THREE.TextureLoader()).then((moonTexture) => {
    debugger;
    let moonGeo = new THREE.SphereGeometry(0.1, 32, 32);
    let moonMaterial = new THREE.MeshBasicMaterial({
        map : 	moonTexture,
    });
    moonMesh = new THREE.Mesh(moonGeo, moonMaterial);
    moonMesh.position.x += 6;
    moonMesh.position.y += 0.2;
    scene.add(moonMesh);
}).catch((err) => {
    console.log(err);
});

// Create axis of rotation
let axis = new THREE.Vector3(0,0.4101524,0).normalize();

// update function (runs on every frame)
const update = () => {
    sphere.rotateOnAxis(axis, 0.01);
    earthMesh.rotateOnAxis(axis, 0.01);
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















//Attempting to load bump map on top
// let loadedEarthTexture;
// loadTexture(earthTextureImg, new THREE.TextureLoader()).then((earthTexture) => {
//     loadedEarthTexture = earthTexture;
//     return loadTexture(bumpImg, new THREE.TextureLoader());
// }).then((bumpTexture) => {
//     debugger;
//     earthMaterial = new THREE.MeshBasicMaterial({
//         map: loadedEarthTexture,
//         bumpMap: bumpTexture,
//     });
//     let earthGeo = new THREE.SphereGeometry(0.5, 32, 32);
//     earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
//     earthMesh.rotation.x += 0.5;
//     earthMesh.position.x += 5;
//     scene.add(earthMesh);
// }).catch((err) => {
//     console.log(err);
// });