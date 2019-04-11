import { 
  UPDATE_SIMULATION_TIME,
  UPDATE_ANIMATION_SPEED,
  GET_ALL_BODY_POSITIONS,
  GET_MAIN_OBJECT,
  GET_OBJECT,
  GET_OBJECT_LIST,
  GET_FRAME,
  GET_FRAMES,
  GET_COVERAGE,
  UPDATE_BODY_POSITION,
  EARTH,
  MOON,
  LMAP,
  SUN
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
  earth: {},
  moon: {},
  sun: {},
  lmap: {}
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
      switch(action.payload.name) {
        case EARTH:
          return {
            ...state,
            earth: action.payload
          }
        case MOON:
          return {
            ...state,
            moon: action.payload
          }
        case SUN:
          return {
            ...state,
            sun: action.payload
          }
        case LMAP:
          return {
            ...state,
            lmap: action.payload
          }
      }
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
    case GET_COVERAGE:
      // TODO detect which object coverage was for
      // and edit that object in the state
      return {
        ...state,
        objectCoverage: action.payload
      }
    case GET_FRAME:
      // TODO, determine where frame should go
      return {
        ...state,
        frameData: action.payload
      }
    case GET_FRAMES:
      // TODO, determine where frames should go
      return {
        ...state,
        objectFrames: action.payload
      }
    default:
      return {
        ...state,
        ...initialState
      }
  }
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