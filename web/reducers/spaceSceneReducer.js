import {
  UPDATE_SIMULATION_TIME,
  UPDATE_ANIMATION_SPEED,
  UPDATE_CAMERA,
  UPDATE_TRAIL_TYPE,
  TOGGLE_LABELS
} from '../actions/spaceSceneActions';

const initialState = {
  simulationTime: new Date(),
  animationSpeed: 1,
  trailType: 'partial',
  camera: 'solar',
  showLabels: false
}

const spaceSceneReducer = (state = {}, action) => {
  switch(action.type) {
    case UPDATE_SIMULATION_TIME:
      return {
        ...state,
        simulationTime: action.payload
      }
    case UPDATE_ANIMATION_SPEED:
      return {
        ...state,
        animationSpeed: action.payload
      }
    case UPDATE_CAMERA:
      return {
        ...state,
        camera: action.payload
      }
    case UPDATE_TRAIL_TYPE:
      return {
        ...state,
        trailType: action.payload
      }
    case TOGGLE_LABELS:
      return {
        ...state,
        showLabels: action.payload
      }
    default:
      return {
        ...state,
        ...initialState
      }
  }
}

export const selectSimulationTime = (state) => {
  return state.simulationTime;
}

export const selectAnimationSpeed = (state) => {
  return state.animationSpeed;
}

export const selectCurrentCamera = (state) => {
  return state.camera;
}

export const selectCurrentTrailType = (state) => {
  return state.trailType;
}

export const selectShowLabels = (state) => {
  return state.showLabels;
}

export default spaceSceneReducer