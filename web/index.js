import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';

const App = () =>{
  return (
    <div>
      <SpaceScene/>
    </div>
  )
};
render(<App />, document.getElementById("app"));