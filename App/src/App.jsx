import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map } from "./Map";
//import { useState } from "react";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <div className="main">{<Map />}</div>
    </div>
  );
}

export default App;
