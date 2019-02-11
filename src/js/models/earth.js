import * as THREE from '../three';
import earthTextureImg from '../../earthmap1k.jpg';

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => { 
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

export default class Earth {
    constructor(size, earthScale) {
        this.size = size;
        this.earthScale = earthScale;
    }

    load() {
        return loadTexture(earthTextureImg, new THREE.TextureLoader()).then((earthTexture) => {
            let earthGeo = new THREE.SphereGeometry(this.size, 32, 32);
            let earthMaterial = new THREE.MeshBasicMaterial({
                map:    earthTexture,
            });
            let earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
            earthMesh.scale.set(this.earthScale, this.earthScale, this.earthScale);
            earthMesh.rotation.x += 500;
            earthMesh.position.x += 500;
            return earthMesh;
        }).catch((err) => {
            console.log(err);
        });
    }

}