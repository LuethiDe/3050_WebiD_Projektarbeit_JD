// React Hooks und dayjs für Datumsfunktionen importieren
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

// Komponenten und Styles importieren
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map as JsonToChart1 } from "./Map";
import Footer from "./Footer";

import "./App.css";

// Basis-URL für das Backend-API
const API_BASE = "http://localhost:8000";

// Hilfsfunktion: Baut die URL für die Fussgänger-Datenabfrage
function buildPedUrl({ ort, datum, zone }) {
  const url = new URL(`${API_BASE}/api/v1/pedData`);
  url.searchParams.set("ort", ort);
  url.searchParams.set("datum", datum);
  url.searchParams.set("zone", zone);
  return url.toString();
}

// Hilfsfunktion: Baut die URL für die Standorte-Abfrage
function buildLocationsUrl(datum) {
  const url = new URL(`${API_BASE}/api/v1/Locations`);
  url.searchParams.set("datum", datum);
  return url.toString();
}

// Hauptkomponente der App
export default function App() {
  // Zustand für das gewählte Datum
  const [date, setDate] = useState(dayjs("2021-09-29"));
  // Liste aller verfügbaren Standorte
  const [locations, setLocations] = useState([]);
  // Aktuell ausgewählter Standort
  const [location, setLocation] = useState("");
  // Aktuell ausgewählte Zone
  const [zone, setZone] = useState("all");
  // Aktuell ausgewählte Personengruppe
  const [group, setGroup] = useState("all"); // all | children | adults
  // Aktuell ausgewähltes Wetter
  const [weather, setWeather] = useState("all"); // all | rain | ...
  // Zeilen mit Rohdaten für das Diagramm
  const [rows, setRows] = useState([]);
  // Ladeanzeige
  const [loading, setLoading] = useState(false);
  // Fehlerstatus
  const [error, setError] = useState(null);
  // Datum als String im Format YYYY-MM-DD
  const datum = useMemo(() => date.format("YYYY-MM-DD"), [date]);

  // Effekt: Standorte für das gewählte Datum laden
  useEffect(() => {
    setError(null);
    fetch(buildLocationsUrl(datum))
      .then((response) => response.json())
      .then((payload) => {
        const list =
          Array.isArray(payload) && payload[0]?.locations
            ? payload[0].locations
            : [];
        setLocations(list);
        // Standardmässig ersten Standort auswählen, falls keiner gewählt ist
        if (!location && list.length) setLocation(list[0]);
        // Falls aktueller Standort nicht mehr in der Liste ist, auf ersten wechseln
        if (location && list.length && !list.includes(location))
          setLocation(list[0]);
      })
      .catch((errorObj) => {
        setLocations([]);
        setError(String(errorObj));
      });
  }, [datum]);

  // Effekt: Fussgänger-Daten für den gewählten Standort, das Datum und die Zone laden
  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);

    fetch(buildPedUrl({ ort: location, datum, zone }))
      .then((response) => response.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setRows(arr);
      })
      .catch((errorObj) => {
        setRows([]);
        setError(String(errorObj));
      })
      .finally(() => setLoading(false));
  }, [location, datum, zone]);

  // Filtert und bereitet die Daten für das Diagramm je nach Filtereinstellungen auf
  const filtered = useMemo(() => {
    let out = rows;

    // Nach Wetter filtern
    if (weather !== "all") {
      const w = String(weather).trim();
      out = out.filter(
        (row) => String(row.weather_condition ?? "").trim() === w
      );
    }

    // Nach Personengruppe aggregieren
    if (group === "children") {
      out = out.map((row) => ({
        ...row,
        value:
          (row.child_ltr_pedestrians_count ?? 0) +
          (row.child_rtl_pedestrians_count ?? 0),
      }));
    } else if (group === "adults") {
      out = out.map((row) => ({
        ...row,
        value:
          (row.adult_ltr_pedestrians_count ?? 0) +
          (row.adult_rtl_pedestrians_count ?? 0),
      }));
    } else {
      out = out.map((row) => ({
        ...row,
        value: row.pedestrians_count,
      }));
    }

    return out;
  }, [rows, weather, group]);

  // Debug-Ausgaben für Wetterauswahl und verfügbare Wetterbedingungen
  console.log("weather selected:", weather);
  console.log("unique weather_condition in rows:", [
    ...new Set(rows.map((row) => row.weather_condition)),
  ]);

  // Render: Aufbau der App mit Header, Sidebar, Diagrammen und Footer
  return (
    <div className="app">
      <Header />

      <div className="content">
        <div className="layout">
          {/* Seitenleiste mit allen Filtermöglichkeiten */}
          <Sidebar
            date={date}
            setDate={setDate}
            locations={locations}
            location={location}
            setLocation={setLocation}
            zone={zone}
            setZone={setZone}
            group={group}
            setGroup={setGroup}
            weather={weather}
            setWeather={setWeather}
          />

          <main className="main">
            {/* Erstes Diagramm */}
            <div className="boards_content">
              {loading && <p className="text">Laedt…</p>}
              {error && <p className="text errorText">{error}</p>}
              <JsonToChart1
                data={filtered}
                location={location}
                date={datum}
                zone={zone}
                group={group}
                weather={weather}
              />
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}
