import * as THREE from '../three/three';
import { loadTexture } from '../textures/texture';
import point_texture_img from '../textures/point.png';

export default
class Satellite {
    constructor(size, satelliteScale) {
        this.size = size;
        this.satelliteScale = satelliteScale;
    }

    async load() {
        const satelliteTexture = await loadTexture(point_texture_img, new THREE.TextureLoader());
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3());
        var dotMaterial = new THREE.PointsMaterial({
            size: 5,
            sizeAttenuation: false,
            map: satelliteTexture,
            alphaTest: 0.5,
            transparent: true});
        return new THREE.Points(dotGeometry, dotMaterial);
    }
}