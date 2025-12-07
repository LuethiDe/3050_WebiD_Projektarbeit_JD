import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";

export const Map = () => {
  return (
    <div>
      <MapContainer
        center={[47.5348, 7.6419]}
        zoom={20}
        style={{ height: "50vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          //attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
      <div className="aside">
        <h3 className="text">Informationen</h3>
        <p className="text">Bla Bla Bla.</p>
      </div>
    </div>
  );
};
