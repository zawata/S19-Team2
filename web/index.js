import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';
import SceneSwitchButton from './components/SceneSwitchButton';
import ShowTagButton from './components/ShowTagButton';
import './styles/styles.scss';
import SimulationControls from "./components/SimulationControls";
import { Provider } from 'react-redux';
import store from './store';

const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <SpaceScene/>
        <SceneSwitchButton/>
        <ShowTagButton/>
        <SimulationControls/>
      </Provider>
    </div>
  )
};
render(<App />, document.getElementById("app"));
