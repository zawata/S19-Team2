import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';
import SceneSwitchButton from './components/SceneSwitchButton';
import './styles/styles.scss';
import SimulationControls from "./components/SimulationControls";
import SpeedSliderContainer from "./components/SpeedSliderContainer";

const App = () =>{
  return (
    <div>
      <SpaceScene/>
      <SceneSwitchButton/>
      <SimulationControls/>
      <SpeedSliderContainer/>
    </div>
  )
};
render(<App />, document.getElementById("app"));
