import { 
  UPDATE_SIMULATION_TIME,
  UPDATE_ANIMATION_SPEED
} from '../actions/spaceSceneActions';

const initialState = {
  simulationStartTime: new Date(),
  animationSpeed: 1
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

export default spaceSceneReducer