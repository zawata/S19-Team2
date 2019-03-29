/** Actions types */
export const UPDATE_SIMULATION_TIME = 'UPDATE_SIMULATION_TIME';

export const updateSimulationTime = (newTime) => dispatch => {
  dispatch({type: UPDATE_SIMULATION_TIME, payload: newTime});
}