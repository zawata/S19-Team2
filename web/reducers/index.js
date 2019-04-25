import {combineReducers} from 'redux';
import spaceSceneReducer, * as fromSpaceScene from './spaceSceneReducer';

export default combineReducers({
  app: spaceSceneReducer
});

export const selectSimulationTime = (state) => fromSpaceScene.selectSimulationTime(state.app);
export const selectAnimationSpeed = (state) => fromSpaceScene.selectAnimationSpeed(state.app);
export const selectCurrentTrailType = (state) => fromSpaceScene.selectCurrentTrailType(state.app);
export const selectCurrentCamera = (state) => fromSpaceScene.selectCurrentCamera(state.app);
export const selectShowLabels = (state) => fromSpaceScene.selectShowLabels(state.app);
