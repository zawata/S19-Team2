import * as THREE from '../three/three';
import { loadTexture } from '../textures/texture';
import earthTextureImg from '../textures/1_earth_8k.jpg';
import earthBumpImg from '../textures/nasa_bump_map.png';
import { resolve } from 'path';

export default class Earth {
    constructor(size, earthScale) {
        this.size = size;
        this.earthScale = earthScale;
    }

    async load() {
        const earthTexture = await loadTexture(earthTextureImg, new THREE.TextureLoader());
        let earthGeo = new THREE.SphereGeometry(this.size, 32, 32);
        let earthMaterial = new THREE.MeshPhongMaterial({
            map:    earthTexture,
        });
        const earthBumpMap = await loadTexture(earthBumpImg, new THREE.TextureLoader());
        earthMaterial.bumpMap = earthBumpMap;
        earthMaterial.bumpScale = 0.05;
        let earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
        earthMesh.scale.set(this.earthScale, this.earthScale, this.earthScale);
        return earthMesh;
    }
}