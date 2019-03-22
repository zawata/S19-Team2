import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';
import SceneSwitchButton from './components/SceneSwitchButton';
import './styles/styles.css';

const App = () =>{
  return (
    <div>
      <SpaceScene/>
      <SceneSwitchButton/>
    </div>
  )
};
render(<App />, document.getElementById("app"));