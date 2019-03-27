import 'axios';

axios.defaults.baseURL = "localhost:5000/api" //TODO

function to_iso(date) {
    return new Date(date).toISOString()
}

exports.get_all_objects =
async function() {
    let response = await axios.get("/objects");

    if(response.status != 200) {
        //TODO
    } else {
        let ret_arr = [];
        for(let entry of response.data) {
            ret_arr.push(entry["name"]);
        }
    }
}

exports.get_main_object =
async function() {
    let response = await axios.get("/objects/main");

    if(response.status != 200) {
        //TODO
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
        //TODO
    } else {
        return response.data;
    }
}

exports.get_coverage =
async function(object, date) {
    let response = await axios.get(`/objects/${object}/coverage`);

    if(response.status != 200) {
        //TODO
    } else {
        //TODO don't know what the data will look like
    }
}