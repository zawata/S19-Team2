import {
  UPDATE_SIMULATION_TIME,
  UPDATE_ANIMATION_SPEED,
  GET_MAIN_OBJECT,
  GET_OBJECT_LIST,
  UPDATE_BODY_POSITION,
} from '../actions/spaceSceneActions';

const initialState = {
  simulationStartTime: new Date(),
  animationSpeed: 1,
  mainObject: {},
  allObjects: [],
  frameRunway: [],
  objectCoverage: {},
  objectFrames: [],
  frameData: {},
  earth: { position: { x: 0, y: 0, z: 0 } },
  moon: { position: { x: 0, y: 0, z: 0 } },
  sun: { position: { x: 0, y: 0, z: 0 } },
  LMAP: { position: { x: 0, y: 0, z: 0 } }
}

const spaceSceneReducer = (state = {}, action) => {
  switch(action.type) {
    case UPDATE_SIMULATION_TIME:
      return {
        ...state,
        simulationStartTime: action.payload
      }
    case UPDATE_ANIMATION_SPEED:
      return {
        ...state,
        animationSpeed: action.payload
      }
    case UPDATE_BODY_POSITION:
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
      const objectPosition = action.payload.position.frame;
      let newState = { ...state };
      newState[action.payload.name] = {
            position: {
              x: objectPosition.y,
              y: objectPosition.z,
              z: objectPosition.x
          }
        };
      return newState;
    case GET_MAIN_OBJECT:
      return {
        ...state,
        mainObject: action.payload
      }
    case GET_OBJECT_LIST:
      return {
        ...state,
        allObjects: action.payload
      }
    default:
      return {
        ...state,
        ...initialState
      }
  }
}

export const selectMoonPosition = (state) => {
  return state.moon.position;
}

export const selectLMAPPosition = (state) => {
  return state.LMAP.position;
}

export const selectSunPosition = (state) => {
  return state.sun.position;
}

export const selectSimulationTime = (state) => {
  return state.simulationStartTime;
}

export const selectAnimationSpeed = (state) => {
  return state.animationSpeed;
}

export const selectMainObject = (state) => {
  return state.mainObject;
}

export const selectAllObjects = (state) => {
  return state.allObjects;
}

export default spaceSceneReducer