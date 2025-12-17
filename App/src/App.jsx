import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map } from "./Map";
import { useState, useEffect } from "react";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [info, setInfo] = useState(null);
  const [meme, setMeme] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/v1.0/pedData")
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Backend-Daten:", data);
        setInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
      });
  }, []);

  if (!info) return <div>Computer says no...</div>;

  return (
    <div className="app">
      <Header meme={meme} setMeme={setMeme} />
      {/* <Sidebar />*/}
      <div className="content">
        {<Map setInfo={setInfo} info={info} meme={meme} setMeme={setMeme} />}
      </div>
    </div>
  );
}

export default App;
