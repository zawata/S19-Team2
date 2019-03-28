import 'axios';
import math from 'mathjs';

axios.defaults.baseURL = "localhost:5000/api" //TODO

// kilometers to Astronomical Units
const km_p_au = math.number(149597870.7);
const au_p_km = math.eval(`1 / ${km_p_au}`);

//Astronomical Units to GL Units
const au_p_gl = math.eval(`1 / 100`);
const gl_p_au = math.number(100);

function to_iso(date) {
    return new Date(date).toISOString()
}

function to_au(km) {
    let d_au = math.eval(`${km} / ${km_p_au}`);
    return math.eval(`${d_au} / ${gl_p_au}`);
}

exports.get_all_objects =
async function() {
    let response = await axios.get("/objects");

    if(response.status != 200) {
        return undefined;
    } else {
        let ret_arr = [];
        for(let entry of response.data) {
            ret_arr.push(entry["name"]);
        }
        return ret_array;
    }
}

exports.get_main_object =
async function() {
    let response = await axios.get("/objects/main");

    if(response.status != 200) {
        return undefined;
    } else {
        return data.data["name"];
    }
}

exports.get_frame =
async function(object, date) {
    let response = await axios.get(`/objects/${object}/frame`, {
        data: {
            time: to_iso(date)
        }
    });

    if(response.status != 200) {
        return undefined;
    } else {
        let frame = response.data[0];
        return {
            date: frame["date"],
            frame: {
                x: to_au(frame["frame"]["x"]),
                y: to_au(frame["frame"]["x"]),
                z: to_au(frame["frame"]["x"]),
                dx: to_au(frame["frame"]["x"]),
                dy: to_au(frame["frame"]["x"]),
                dz: to_au(frame["frame"]["x"])
            }
        };
    }
}

exports.get_frame =
async function(object, date) {
    let response = await axios.get(`/objects/${object}/frames`, {
        data: {
            observer: observer,
            times: [ to_iso(date) ]
        }
    });

    if(response.status != 200) {
        return undefined;
    } else {
        let return_arr;
        for(let frame of response.data) {
            return_arr.push({
                date: frame["date"],
                frame: {
                    x: to_au(frame["frame"]["x"]),
                    y: to_au(frame["frame"]["x"]),
                    z: to_au(frame["frame"]["x"]),
                    dx: to_au(frame["frame"]["x"]),
                    dy: to_au(frame["frame"]["x"]),
                    dz: to_au(frame["frame"]["x"])
                }
            });
        }

        return return_arr;
    }
}

exports.get_frames =
async function(observer, date_list) {
    let data_arr = [];
    for(let entry of date_list) {
        data_arr.push(to_iso(entry));
    }
    let response = await axios.get(`/objects/${object}/frames`, {
        data: {
            observer: observer,
            times: array
        }
    });

    if(response.status != 200) {
        return undefined;
    } else {
        return response.data[0]["date"];
    }
}
bv
exports.get_coverage =
async function(object, date) {
    let response = await axios.get(`/objects/${object}/coverage`);

    if(response.status != 200) {
        return undefined;
    } else {
        return {
            start: new Date(data.response["start"]),
            end: new Date(data.response["end"])
        };
    }
}