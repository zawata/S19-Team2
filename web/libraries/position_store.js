import config from '../config/config'
import net from './network_layer';

const base_objects = [
  "sun",
  "moon",
  config.mainSpacecraftName
]

let app_store = {}
let timeout_ref = undefined;
let will_refresh_loop = false;


async function init_object(obj) {
  let obj_data = await net.get_object(obj);
  let obj_cov = await net.get_coverage(obj);

  app_store.objects[obj] = {
    name: obj_data.name,
    id: obj_data.id,
    position: {},
    coverage: obj_cov
  }
}

async function update_objects() {
  for(let key of Object.keys(app_store.objects)) {
    let spice_pos = await net.get_frame(key, "earth", app_store.working_date);

    /*
      * Coordinate frames:
      *
      *    ThreeJS           SPICE
      *      |Y                |Z
      *      |                 |
      *      |                 |
      *      |________         |________
      *     /        X        /        Y
      *    /                 /
      *   /Z                /X
      */
    app_store.objects[key].position = {
      x: spice_pos.frame.y,
      y: spice_pos.frame.z,
      z: spice_pos.frame.x
    }
  }
}

export
async function init_store() {
  app_store.coverage = await net.get_coverage("main");
  if(new Date() > app_store.coverage.start && new Date() < app_store.coverage.end) {
    app_store.working_date = new Date();
  } else {
    app_store.working_date = new Date(app_store.coverage.start);
  }
  app_store.update_frequency = 1;

  app_store.objects = {};
  for(let obj of base_objects) {
    await init_object(obj);
  }
  await update_objects();

  will_refresh_loop = true;
  start_loop();
}

export
function start_loop() {
  timeout_ref = setTimeout(request_loop, config.updatePeriod);
}

export
function restart_loop() {
  stop_loop();
  start_loop();
}

export
function stop_loop() {
  clearTimeout(timeout_ref);
}

async function request_loop() {
  app_store.working_date.setTime(app_store.working_date.getTime() + (config.updatePeriod * app_store.update_frequency));

  if(app_store.working_date < app_store.coverage.end) {
    update_objects();

    //reissue timeout;
    if(will_refresh_loop){
      restart_loop();
      return;
    }
  }
  stop_loop();
}

export
function get_working_date() {
  return app_store.working_date;
}

export
function set_working_date(date) {
    app_store.working_date = date;
    update_objects();
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
  if (app_store.objects[object] === undefined){
    //This case is encountered sometimes if the slider component is loaded before the store is initialized.
    //If left to throw an error, the component will break, hence the false position data.
    return {x: 0, y: 0, z: 0}
  }
  return app_store.objects[object].position;
}

export
function get_object_coverage(object) {
  return app_store.objects[object].coverage;
}