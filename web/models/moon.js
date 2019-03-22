import * as THREE from '../three/three';
import { loadTexture } from '../textures/texture';
import moonTextureImg from '../textures/moon.jpg'

export default class Moon {
    constructor(size,moonScale) {
        this.size = size;
        this.moonScale = moonScale;
    }

    async load() {
        const moonTexture = await loadTexture(moonTextureImg, new THREE.TextureLoader());
        let geometry = new THREE.SphereGeometry(this.size, 15, 15);
        let material = new THREE.MeshPhongMaterial({
            map:    moonTexture,
        });
        let moon = new THREE.Mesh(geometry, material);
        moon.scale.set(this.moonScale, this.moonScale, this.moonScale);
        return moon;
    }

}