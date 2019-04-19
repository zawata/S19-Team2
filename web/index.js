import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';
import SceneSwitchButton from './components/SceneSwitchButton';
import './styles/styles.scss';
import SimulationControls from "./components/SimulationControls";
import { Provider } from 'react-redux';
import store from './store';

const App = () =>{
  return (
    <div>
      <Provider store={store}>
        <SpaceScene/>
        <SimulationControls/>
      </Provider>
    </div>
  )
};
render(<App />, document.getElementById("app"));
