import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";

export const Map = ({ info, meme }) => {
  return (
    <div>
      <div className="boards">
        <h3 className="text">App Info</h3>
        <p className="text">Message: {info.message}</p>
        <p className="text">Version: {info.version}</p>
        <p className="text">Status: {info.status}</p>
      </div>
      {meme && (
        <div
          className="h1"
          style={{
            backgroundImage: "url(https://i.gifer.com/7Q9d.gif)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px",
            height: "300px",
            width: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></div>
      )}
    </div>
  );
};
