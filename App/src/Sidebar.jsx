import React, { useEffect } from "react";

// Material-UI Komponenten, die in der Sidebar verwendet werden
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

// DatePicker (MUI X) mit Day.js Adapter
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/de"; // Deutsche Locale für Datumsformat
dayjs.locale("de"); // Day.js auf Deutsch setzen damit der DatePicker DD.MM.YYYY nutzt

// React-Leaflet (interaktive Mini-Karte) und das zugehörige CSS
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";



// Wetteroptionen für das Auswahlfeld
const WEATHER_OPTIONS = [
  "all",
  "clear-day",
  "partly-cloudy-day",
  "cloudy",
  "rain",
  "snow",
  "fog",
  "wind",
];

/**
 * Sidebar Komponente mit Steuerungselementen für die App.
 * Komponenten:
 * - date, setDate: dayjs date state und setter
 * - locations: Liste der Locationnamen vom Backend
 * - location, setLocation: momentan ausgewählte location and setter
 * - zone, setZone, group, setGroup, weather, setWeather: andere Einstellungsmöglichkeiten
 */
export const Sidebar = ({
  date,
  setDate,
  locations,
  location,
  setLocation,
  zone,
  setZone,
  group,
  setGroup,
  weather,
  setWeather,
}) => {
  // Wenn eine spezifische Personengruppe ausgewählt ist, wird die Zonen-Auswahl deaktiviert
  const zoneDisabled = group !== "all";

  // Polygon um die Messgebiete in der Mini-Map darzustellen
  const geoLocations = [
    {
      id: 329,
      name: "Bahnhofstrasse (Mitte)",
      polygon: [
        [47.370233, 8.538947],
        [47.370273, 8.539215],
        [47.371039, 8.538936],
        [47.371879, 8.53863],
        [47.372373, 8.538453],
        [47.37315, 8.538405],
        [47.373735, 8.538383],
        [47.373848, 8.538405],
        [47.373811, 8.538099],
        [47.373753, 8.538099],
        [47.373045, 8.538115],
        [47.372395, 8.538147],
        [47.372108, 8.538244],
        [47.371148, 8.538587],
        [47.371018, 8.538614],
        [47.370785, 8.53871],
        [47.370633, 8.538796],
        [47.370233, 8.538947],
      ],
    },
    {
      id: 330,
      name: "Bahnhofstrasse (Süd)",
      polygon: [
        [47.367523, 8.539939],
        [47.367581, 8.540229],
        [47.368162, 8.540014],
        [47.369139, 8.539649],
        [47.369568, 8.539526],
        [47.369543, 8.539215],
        [47.369154, 8.539322],
        [47.368376, 8.539617],
        [47.367523, 8.539939],
      ],
    },
    {
      id: 331,
      name: "Bahnhofstrasse (Nord)",
      polygon: [
        [47.374015, 8.538222],
        [47.374015, 8.538598],
        [47.374211, 8.538694],
        [47.374429, 8.538823],
        [47.374654, 8.538845],
        [47.375744, 8.539445],
        [47.376427, 8.539767],
        [47.376812, 8.540025],
        [47.376921, 8.539681],
        [47.375897, 8.539177],
        [47.375272, 8.538845],
        [47.374582, 8.538501],
        [47.374015, 8.538222],
      ],
    },
    {
      id: 670,
      name: "Lintheschergasse",
      polygon: [
        [47.374798, 8.537881],
        [47.374701, 8.537808],
        [47.374691, 8.537996],
        [47.375339, 8.53833],
        [47.375953, 8.538654],
        [47.375985, 8.538498],
        [47.375873, 8.538444],
        [47.375833, 8.538455],
        [47.375561, 8.538304],
        [47.374849, 8.537923],
        [47.374798, 8.537881],
      ],
    },
  ];

  // Auswahlliste erstellen mit bevorzugter Reihenfolge
  const geoNames = geoLocations.map((g) => g.name);
  const preferredOrder = [
    "Bahnhofstrasse (Nord)",
    "Bahnhofstrasse (Mitte)",
    "Bahnhofstrasse (Süd)",
    "Lintheschergasse",
  ];
  // Namen der Messgebiete für die Select-Liste extrahieren
  const geoNamesSorted = preferredOrder.filter((n) => geoNames.includes(n));
  // Gewünschte Reihenfolge: Nord, Mitte, Süd, Lintheschergasse
  // Zusammenführen: zuerst die vorgegebenen Geo-Namen, danach andere Backend-Locations
  const otherLocations = (locations || []).filter((l) => !geoNamesSorted.includes(l));
  const allLocationOptions = [...geoNamesSorted, ...otherLocations];

  // Berechnet alle bounding boxen für alle polygon für initiale kartenansicht
  const combinedBounds = (() => {
    let minLat = Infinity,
      minLon = Infinity,
      maxLat = -Infinity,
      maxLon = -Infinity;
    geoLocations.forEach((g) => {
      g.polygon.forEach(([lat, lon]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
      });
    });
    return [[minLat, minLon], [maxLat, maxLon]];
  })();

  // MapUpdater benutzt Leaflet map instanz via usemap and passt die Ansicht an die übergebenen Bounds an.
  function MapUpdater({ bounds }) {
    const map = useMap();
    useEffect(() => {
      if (bounds) map.fitBounds(bounds, { padding: [8, 8] });
    }, [map, bounds]);
    return null;
  }

  // --- UI rendern ---
  return (
    <aside className="aside">
      <Typography className="text" sx={{ fontWeight: 700, mb: 1 }}>
        Einstellungen
      </Typography>

      {/* Datumsauswahl: Wert ist day.js objekt vom Eltern 'app' zustand. */}
      <Box sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <DatePicker
            label="Datum"
            value={date}
            onChange={(v) => v && setDate(v)}
            inputFormat="DD.MM.YYYY"
            mask="__.__.____"
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </LocalizationProvider>
      </Box>

      {/* Location Auswahl: Auswahl updatet Eltern Location*/}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Location</InputLabel>
          <Select label="Location" value={location || ""} onChange={(e) => setLocation(e.target.value)}>
            {allLocationOptions.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Mini-map Leaflet. */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <div style={{ marginTop: 8 }}>
          <div style={{ width: "100%", height: 220, borderRadius: 8, overflow: "hidden", border: "1px solid #ccc" }}>
            <MapContainer
              center={[(combinedBounds[0][0] + combinedBounds[1][0]) / 2, (combinedBounds[0][1] + combinedBounds[1][1]) / 2]}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={false}
              keyboard={false}
              attributionControl={false}
            >
              {/* Minimale Basemap (Esri Canvas / Light Gray). */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />

              {/* Zeichnet jedes Polygon, das selektierte Polygon wird rot gehighlighted. */}
              {geoLocations.map((g) => {
                const isSelected = g.name === location;
                return (
                  <Polygon
                    key={g.id}
                    positions={g.polygon}
                    // Polygonclick setzt momentane Location im Parent
                    eventHandlers={{ click: () => setLocation(g.name) }}
                    pathOptions={
                      isSelected
                        ? { color: "#c62828", weight: 2, fillColor: "#ff0000", fillOpacity: 0.25 }
                        : { color: "#666", weight: 1, fillColor: "#999", fillOpacity: 0.12 }
                    }
                  >
                    {/* Tooltip werden angezeigt beim Hovern (Sticky folgt Maus). */}
                    <Tooltip direction="center" sticky>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{g.name}</span>
                    </Tooltip>
                  </Polygon>
                );
              })}
              <MapUpdater bounds={combinedBounds} />
            </MapContainer>
          </div>
        </div>
      </Box>

      {/* Person group selector */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Personengruppe</InputLabel>
          <Select label="Personengruppe" value={group} onChange={(e) => setGroup(e.target.value)}>
            <MenuItem value="all">Alle</MenuItem>
            <MenuItem value="children">Kinder</MenuItem>
            <MenuItem value="adults">Erwachsene</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" disabled={zoneDisabled}>
          <InputLabel>Zone</InputLabel>
          <Select label="Zone" value={zone} onChange={(e) => setZone(e.target.value)}>
            <MenuItem value="all">Alle</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </Select>
        </FormControl>
        <Typography className="text" sx={{ fontSize: 12, mt: 0.5 }}>
          Zone nur bei Alle.
        </Typography>
      </Box>

      <Box sx={{ mb: 1 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Wetter</InputLabel>
          <Select label="Wetter" value={weather} onChange={(e) => setWeather(e.target.value)}>
            {WEATHER_OPTIONS.map((w) => (
              <MenuItem key={w} value={w}>
                {w}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </aside>
  );
};