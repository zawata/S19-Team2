import * as THREE from '../three';
import totallyMoonTexture from '../../moon.jpg'

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => {
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

export default class Moon {
    constructor(size,moonScale) {
        this.size = size;
        this.moonScale = moonScale;
    }

    load() {
        return loadTexture(totallyMoonTexture, new THREE.TextureLoader()).then((moonTexture) => {
            let geometry = new THREE.SphereGeometry(this.size, 15, 15);
            let material = new THREE.MeshBasicMaterial({
                map:    moonTexture,
            });
            let moon = new THREE.Mesh(geometry, material);
            moon.scale.set(this.moonScale, this.moonScale, this.moonScale);

            moon.position.x += 5005;
            moon.position.y += 0.2;
            return moon;
        }).catch((err) => {
            console.log(err);
        });
    }

}