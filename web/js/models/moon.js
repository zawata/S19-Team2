import * as THREE from '../three'
import totallyMoonTexture from '../../plutomap1k.jpg'

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

export default class Moon {
    constructor(size) {
        this.size = size
    }

    load() {
        return loadTexture(totallyMoonTexture, new THREE.TextureLoader()).then((moonTexture) => {
            let geometry = new THREE.SphereGeometry(this.size, 32, 32);
            let material = new THREE.MeshBasicMaterial({
                map:    moonTexture,
            });
            let moon = new THREE.Mesh(geometry, material);
            moon.position.x += 6;
            moon.position.y += 0.2;
            return moon;
        }).catch((err) => {
            console.log(err);
        });
    }

}