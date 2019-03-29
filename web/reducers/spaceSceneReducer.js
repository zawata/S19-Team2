import { UPDATE_SIMULATION_TIME } from '../actions/spaceSceneActions';

const initialState = {
  simulationStartTime: new Date()
}

const spaceSceneReducer = (state = {}, action) => {
  switch(action.type) {
    case UPDATE_SIMULATION_TIME:
      return {
        ...state,
        simulationStartTime: action.payload
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

export default spaceSceneReducer