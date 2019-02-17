import * as THREE from '../three';
import sunTextureImg from '../../2k_sun.jpg';

// Function-like promise loader
const loadTexture = (path, loader, onProgress) => { 
    return new Promise((resolve, reject) => {
        loader.load(path, resolve, onProgress, reject);
    });
}

export default class Sun {
    constructor(sunScale) {
        this.sunScale = sunScale;
    }

    load() {
        return loadTexture(sunTextureImg, new THREE.TextureLoader()).then((sunTexture) => {
            let sunGeo = new THREE.SphereGeometry(this.sunScale, 32, 32);
            let sunMaterial = new THREE.MeshPhongMaterial({
                map:    sunTexture,
            });
            let sunMesh = new THREE.Mesh(sunGeo, sunMaterial);
            sunMesh.rotation.x += 0.5;
            return sunMesh;
        }).catch((err) => {
            console.log(err);
        });
    }

}