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
export const UPDATE_BODY_POSITION = 'UPDATE_BODY_POSITION';
export const UPDATE_TRAIL_TYPE = 'UPDATE_TRAIL_TYPE';
export const UPDATE_CAMERA = 'UPDATE_CAMERA';
export const TOGGLE_LABELS = 'TOGGLE_LABELS';

/** Object Types */
export const EARTH = 'earth';
export const MOON = 'moon';
export const LMAP = 'LMAP'; //LMAP shouldn't be referred to directly if we want this to be extensible to other missions.
export const SUN = 'sun';

/** Camera Types */
const SOLAR_CAMERA = 'solar';
const MOON_CAMERA = 'moon';
const SATELLITE_CAMERA = 'satellite';

/** 
 * Thunks (actions that return a function that calls dispatch after async request(s))
 * 
 * Dispatched actions are categorized by their type, 
 * and given a payload to send to the reducers 
*/
export const updateSimulationTime = (newTime) => dispatch => {
  console.log("updating time!");
  dispatch({type: UPDATE_SIMULATION_TIME, payload: newTime});
}

export const updateAnimationSpeed = (newSpeed) => dispatch => {
  dispatch({type: UPDATE_ANIMATION_SPEED, payload: newSpeed});
}

export const updateCamera = (newCamera) => dispatch => {
  dispatch({type: UPDATE_CAMERA, payload: newCamera})
}

export const updateTrailType = (newTrailType) => dispatch => {
  dispatch({type: UPDATE_TRAIL_TYPE, payload: newTrailType})
}

/**
 * Spyce Library calls (using network_library)
 */

export const updateObjectPositions = (bodiesToUpdate, observer, date) => async(dispatch) => {
  // For every body to update, get frame data 
  bodiesToUpdate.forEach( async(spaceBody) => {
    try {
      console.log('gettting positional data for: ', spaceBody);
      const bodyPosition = await get_frame(spaceBody, observer, date);
      const bodyData = { name: spaceBody, position: bodyPosition };
      dispatch({type: UPDATE_BODY_POSITION, payload: bodyData});
    } catch (error) {
      console.error(error);
    }
  });
}

export const getMainObject = () => async(dispatch) => {
  const mainObject = await get_main_object()
  dispatch({type: GET_MAIN_OBJECT, payload: mainObject});
}

export const getObjectList = () => async(dispatch) => {
  const objectList = await get_all_objects();
  dispatch({type: GET_OBJECT_LIST, payload: objectList});
}

export const getObjectFrame = (object, observer, date) => async(dispatch) => {
  const dateFrame = await get_frame(object, observer, date);
  dispatch({type: GET_FRAME, payload: dateFrame});
}

export const getObject = async(objectToGet) => {
  const planetaryObject = await get_object(objectToGet);
  return planetaryObject;
}

export const getObjectFrames = (object, observer, dateList) => async(dispatch) => {
  const dateFrames = await get_frames(object, observer, dateList);
  dispatch({type: GET_FRAMES, payload: dateFrames});
}

export const getObjectCoverage = (object) => async(dispatch) => {
  const objectCoverage = await get_coverage(object);
  dispatch({type: GET_COVERAGE, payload: objectCoverage});
}

export const toggleLabels = (showLabels) => dispatch => {
  dispatch({type: TOGGLE_LABELS, payload: showLabels});
}

