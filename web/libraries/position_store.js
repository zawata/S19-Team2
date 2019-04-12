import config from './config/config'
import net from './libraries/network_layer';

const base_objects = [
  "sun",
  "moon",
  config.main_spacecraft_name
]

let app_store = {}
let timeout_ref = undefined;
let will_refresh_loop = false;

export
async function init_object(obj) {
  let obj_data = await net.get_object(obj);
  let obj_pos = await net.get_frame(obj, "earth", app_store.working_date);
  let obj_cov = await net.get_coverage(obj);
  app_store.objects[obj] = {
    name: obj_data.name,
    id: obj_data.id,
    position: {
      x: obj_pos.y,
      y: obj_pos.z,
      z: obj_pos.x
    },
    coverage: obj_cov
  }
}

export
async function init_store() {
  app_store = {
    working_date: new Date(),
    update_frequency: 1,
  }

  app_store.coverage = await net.get_coverage("main");

  for(let obj of base_objects) {
    init_object(obj);
  }

  timeout_ref = setTimeout(config.updatePeriod, request_loop);
}

export
function restart_loop() {
  timeout_ref.refresh();
}

export
function stop_loop() {
  will_refresh_loop = false;
}

function request_loop() {
  app_store.working_date.setTime(app_store.working_date.getTime() + (config.updatePeriod * app_store.update_frequency));

  if(app_store.working_date < app_store.coverage.end) {
    for(let key in app_store.objects) {
      let spice_pos = net.get_frame(key, "earth", app_store.working_date);
      app_store.objects[key].position = {
        x: spice_pos.frame.y,
        y: spice_pos.frame.z,
        z: spice_pos.frame.x
      }
    }

    //reissue timeout;
    if(will_refresh_loop){
      restart_loop();
    }
  }
}

export
function get_working_date() {
  return app_store.working_date;
}

export
function set_working_date(date) {
    app_store.working_date = date;
}

export
function get_update_frequency() {
  return app_store.update_frequency;
}

export
function set_update_frequency(freq) {
    app_store.update_frequency = freq;
}

export
function get_object_name(object) {
  return app_store.objects[object].name;
}

export
function get_object_id(object) {
  return app_store.objects[object].id;
}

export
function get_object_position(object) {
  return app_store.objects[object].position;
}

export
function get_object_coverage(object) {
  return app_store.objects[object].coverage;
}