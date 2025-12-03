import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import data from "./assets/4.5_week.geojson.json";

export const Map = () => {
  const earthquakes = data.features; // Wir benötigen nur den Feature-Array aus den Daten

  return (
    <MapContainer
      center={[47.5, 7.5]}
      zoom={10}
      style={{ height: "95vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {earthquakes.map((d, i) => (
        <Marker
          key={i}
          position={[d.geometry.coordinates[1], d.geometry.coordinates[0]]}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              {d.properties.title} <br />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
