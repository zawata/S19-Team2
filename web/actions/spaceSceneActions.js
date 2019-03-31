/** Actions types */
export const UPDATE_SIMULATION_TIME = 'UPDATE_SIMULATION_TIME';
export const UPDATE_ANIMATION_SPEED = 'UPDATE_ANIMATION_SPEED';

export const updateSimulationTime = (newTime) => dispatch => {
  dispatch({type: UPDATE_SIMULATION_TIME, payload: newTime});
}

export const updateAnimationSpeed = (newSpeed) => dispatch => {
  dispatch({type: UPDATE_ANIMATION_SPEED, payload: newSpeed});
}