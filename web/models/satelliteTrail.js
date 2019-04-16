import * as THREE from '../three/three';

import * as net from '../libraries/network_layer'

import { loadTexture } from '../textures/texture';
import earthTextureImg from '../textures/1_earth_8k.jpg';
import earthBumpImg from '../textures/nasa_bump_map.png';

export default class SatelliteTrail {
    constructor() {
        this.date_list = []
        this.vector_arr = []
        this.full_path_object = null;
    }

    async preload() {
        let main_object = await net.get_main_object();
        let coverage =    await net.get_coverage(main_object.name);

        let next_date = new Date(coverage.start);
        while(next_date < coverage.end) {
            this.date_list.push(new Date(next_date));
            next_date.setHours(next_date.getHours() + 12);
        }
        this.date_list.push(new Date(coverage.end));

        (await net.get_frames(main_object.name, "earth", this.date_list)).forEach(e => {
            this.vector_arr.push(new THREE.Vector3(
                e.frame.y,
                e.frame.z,
                e.frame.x))
        });

        if(this.date_list.length != this.vector_arr.length)
            console.warn("date_list and vector_arr are different sizes:",
                    this.date_list.length,
                    this.vector_arr.length);
        this.full_path_object = new THREE.CatmullRomCurve3(this.vector_arr);
    }

    getFullPath() {
        let geometry = new THREE.BufferGeometry().setFromPoints(this.full_path_object.getPoints(this.vector_arr.length * 5));
        let material = new THREE.LineBasicMaterial();

        return new THREE.Line(geometry, material);
    }

    getPartialPath(end_date) {

        let end_index = -1,
            start_index = 0;
        for(let i = 0; i < this.date_list.length; i++) {
            if(this.date_list[i] >= end_date) {
                end_index = i-1;
                break;
            }
        }
        if(end_index == -1) end_index = this.date_list.length -1;

        if((end_index - 23) < 0) start_index = 0;
        else                     start_index = end_index-23;

        let curve = new THREE.CatmullRomCurve3(this.vector_arr.slice(start_index, end_index + 1));
        let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(250));
        let material = new THREE.LineBasicMaterial();

        return new THREE.Line(geometry, material);
    }
}