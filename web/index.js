import React from "react";
import { render } from "react-dom";
import SpaceScene from './components/SpaceScene';

const App = () =>{
  return (
    <div>
      <h1>Hello Parcel</h1>
      <SpaceScene/>
    </div>
  )
};
render(<App />, document.getElementById("app"));