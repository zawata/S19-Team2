import {
  get_main_object,
  get_object,
  get_all_objects,
  get_frame,
  get_frames,
  get_coverage
} from '../libraries/network_layer'

/** Actions types */
export const UPDATE_SIMULATION_TIME = 'UPDATE_SIMULATION_TIME';
export const UPDATE_ANIMATION_SPEED = 'UPDATE_ANIMATION_SPEED';
export const GET_ALL_BODY_POSITIONS = 'GET_ALL_BODY_POSITIONS';
export const GET_MAIN_OBJECT = 'GET_MAIN_OBJECT';
export const GET_OBJECT = 'GET_OBJECT';
export const GET_OBJECT_LIST = 'GET_OBJECT_LIST';
export const GET_FRAME = 'GET_FRAME';
export const GET_FRAMES = 'GET_FRAMES';
export const GET_COVERAGE = 'GET_COVERAGE';

/** 
 * Thunks (actions that return a function that calls dispatch after async request(s))
 * 
 * Dispatched actions are categorized by their type, 
 * and given a payload to send to the reducers 
*/
export const updateSimulationTime = (newTime) => dispatch => {
  dispatch({type: UPDATE_SIMULATION_TIME, payload: newTime});
}

export const updateAnimationSpeed = (newSpeed) => dispatch => {
  dispatch({type: UPDATE_ANIMATION_SPEED, payload: newSpeed});
}

/**
 * Spyce Library calls (using network_library)
 */
export const getMainObject = () => dispatch => {
  get_main_object()
    .then((mainObject) => dispatch({type: GET_MAIN_OBJECT, payload: mainObject}));
}

export const getObjectList = () => dispatch => {
  get_all_objects()
    .then((objectList) => dispatch({type: GET_OBJECT_LIST, payload: objectList}));
}

export const getObjectFrame = (object, observer, date) => dispatch => {
  get_frame(object, observer, date)
    .then((dateFrame) => dispatch({type: GET_FRAME, payload: dateFrame}));
}

export const getObject = (objectToGet) => {
  return get_object(objectToGet);
}

export const getObjectFrames = (object, observer, dateList) => dispatch => {
  get_frames(object, observer, dateList)
    .then((dateFrames) => dispatch({type: GET_FRAMES, payload: dateFrames}));
}

export const getObjectCoverage = (object) => dispatch => {
  get_coverage(object)
    .then((objectCoverage) => dispatch({type: GET_COVERAGE, payload: objectCoverage}));
}

