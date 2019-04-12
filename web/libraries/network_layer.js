import config from '../config/config';
import axios from 'axios';
import math from 'mathjs';

axios.defaults.baseURL = `http://${config.backendURL}api`

// kilometers to Astronomical Units
const km_p_au = math.number(149597870.7);
const au_p_km = math.eval(`1 / ${km_p_au}`);

//Astronomical Units to GL Units
const au_p_gl = math.eval(`1 / 100`);
const gl_p_au = math.number(100);

/**
 * Internal Conversion Functions
 */
function to_iso(date) {
    return new Date(date).toISOString()
}

function to_au(km) {
    let d_au = math.eval(`${km} / ${km_p_au}`);
    return math.eval(`${d_au} / ${au_p_gl}`);
}

/**
 * @name get_main_object()
 * @description Get the main object for the model
 */
exports.get_main_object =
async function() {
    try {
        let response = await axios.get("/objects/main");

        if(response.status == 200) {
            return response.data;
        }
    } catch(error) {
        console.log(error);
    }
    return undefined;
}

/**
 * @name get_object(object)
 * @description Get the a particular object for the model
 * @param object: string
 */
exports.get_object =
async function(object) {
    try {
        let response = await axios.get(`/objects/${object}`);

        if(response.status == 200) {
            return response.data;
        }
    } catch(error) {
        console.log(error);
    }
    return undefined;
}

/**
 * @name get_all_objects()
 * @description Get the a list of available objects for the model
 */
exports.get_all_objects =
async function() {
    try {
        let response = await axios.get("/objects");

        if(response.status == 200) {
            let ret_arr = [];
            for(let entry of response.data) {
                ret_arr.push({
                    name: entry["name"],
                    id: entry["id"]
                });
            }
            return ret_arr;
        }
    } catch(error) {
        console.log(error);
    }
    return undefined;
}

/**
 * @name get_frame(object, observer, date)
 * @description get a frame for an object at a particular time from a particular observer
 * @param object: string
 * @param observer: string
 * @param date: any type convertable to a Date object
 */
exports.get_frame =
async function(object, observer, date) {
    try {
        let response = await axios.post(`/objects/${object}/frames`, {
            observer: observer,
            times: [to_iso(date)]
        });

        if(response.status == 200) {
            let frame = response.data[0]
            return {
                date: new Date(frame["date"]),
                frame: {
                    x: to_au(frame["frame"]["x"]),
                    y: to_au(frame["frame"]["y"]),
                    z: to_au(frame["frame"]["z"]),
                    dx: to_au(frame["frame"]["dx"]),
                    dy: to_au(frame["frame"]["dy"]),
                    dz: to_au(frame["frame"]["dz"])
                }
            };
        }
    } catch(error) {
        console.log(error);
    }
    return undefined;
}

/**
 * @name get_frames(object, observer, date_list)
 * @description get a frame for an object at a particular time from a particular observer
 * @param object: string
 * @param observer: string
 * @param date_list: a lit of dates. any type convertable to a Date object
 */
exports.get_frames =
async function(object, observer, date_list) {
    let data_arr = [];
    for(let entry of date_list) {
        data_arr.push(to_iso(entry));
    }

    try {
        let response = await axios.post(`/objects/${object}/frames`, {
            observer: observer,
            times: data_arr
        });

        if(response.status == 200) {
            let return_arr = [];
            for(let frame of response.data) {
                return_arr.push({
                    date: new Date(frame["date"]),
                    frame: {
                        x: to_au(frame["frame"]["x"]),
                        y: to_au(frame["frame"]["y"]),
                        z: to_au(frame["frame"]["z"]),
                        dx: to_au(frame["frame"]["dx"]),
                        dy: to_au(frame["frame"]["dy"]),
                        dz: to_au(frame["frame"]["dz"])
                    }
                });
            }

            return return_arr;
        }
    } catch(error) {
        console.log(error);
    }
    return undefined;
}

/**
 * @name get_coverage(object)
 * @description get a object representing the available coverage of an object
 * @param object: string
 */
exports.get_coverage =
async function(object) {
    try {
        let response = await axios.get(`/objects/${object}/coverage`);

        if(response.status == 200) {
            return {
                start: new Date(response.data["start"]),
                end: new Date(response.data["end"])
            };
        }
    }
    catch(error) {
        console.log(error);
    }
    return undefined;
}