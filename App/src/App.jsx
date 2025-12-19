import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Map as JsonOut } from "./Map";
import Footer from "./Footer";

import "./App.css";

const API_BASE = "http://localhost:8000";

function buildPedUrl({ ort, datum, zone }) {
  const url = new URL(`${API_BASE}/api/v1/pedData`);
  url.searchParams.set("ort", ort);
  url.searchParams.set("datum", datum);
  url.searchParams.set("zone", zone);
  return url.toString();
}

function buildLocationsUrl(datum) {
  const url = new URL(`${API_BASE}/api/v1/Locations`);
  url.searchParams.set("datum", datum);
  return url.toString();
}

export default function App() {
  const [date, setDate] = useState(dayjs().subtract(1, "day"));
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [zone, setZone] = useState("all");
  const [group, setGroup] = useState("all"); // all | children | adults
  const [weather, setWeather] = useState("all"); // all | rain | ...

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const datum = useMemo(() => date.format("YYYY-MM-DD"), [date]);

  useEffect(() => {
    setError(null);
    fetch(buildLocationsUrl(datum))
      .then((r) => r.json())
      .then((payload) => {
        const list =
          Array.isArray(payload) && payload[0]?.locations
            ? payload[0].locations
            : [];
        setLocations(list);
        if (!location && list.length) setLocation(list[0]);
        if (location && list.length && !list.includes(location))
          setLocation(list[0]);
      })
      .catch((e) => {
        setLocations([]);
        setError(String(e));
      });
  }, [datum]);

  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);

    fetch(buildPedUrl({ ort: location, datum, zone }))
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setRows(arr);
      })
      .catch((e) => {
        setRows([]);
        setError(String(e));
      })
      .finally(() => setLoading(false));
  }, [location, datum, zone]);

  const filtered = useMemo(() => {
    let out = rows;

    {
      /* Filter robust gemacht */
    }
    if (weather !== "all") {
      const w = String(weather).trim();
      out = out.filter((r) => String(r.weather_condition ?? "").trim() === w);
    }

    if (group === "children") {
      out = out.map((r) => ({
        ...r,
        value:
          (r.child_ltr_pedestrians_count ?? 0) +
          (r.child_rtl_pedestrians_count ?? 0),
      }));
    } else if (group === "adults") {
      out = out.map((r) => ({
        ...r,
        value:
          (r.adult_ltr_pedestrians_count ?? 0) +
          (r.adult_rtl_pedestrians_count ?? 0),
      }));
    } else {
      out = out.map((r) => ({
        ...r,
        value: r.pedestrians_count,
      }));
    }

    return out;
  }, [rows, weather, group]);

  console.log("weather selected:", weather);
  console.log("unique weather_condition in rows:", [
    ...new Set(rows.map((r) => r.weather_condition)),
  ]);

  return (
    <div className="app">
      <Header />

      <div className="content">
        <div className="layout">
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
            <div className="boards_content">
              <h3 className="text">Backend JSON</h3>
              <p className="text">
                Endpoint: <span className="mono">/api/v1/pedData</span>
              </p>
              <p className="text">
                ort: <span className="mono">{location || "-"}</span> datum:{" "}
                <span className="mono">{datum}</span> zone:{" "}
                <span className="mono">{zone}</span>
                {"  "}
                wetter: <span className="mono">{weather}</span> gruppe:{" "}
                <span className="mono">{group}</span>
              </p>
              <p>Debugfilter</p>
              <p>Problem Wetter: Wenn nicht ≠ All, wird dar Filter gekillt</p>
              <p>Problem Datum: Jahr darf nicht 2025 sein?</p>
              <p className="text">
                rows: <span className="mono">{rows.length}</span> filtered:{" "}
                <span className="mono">{filtered.length}</span>
              </p>

              {loading && <p className="text">Laedt…</p>}
              {error && <p className="text errorText">{error}</p>}
              <JsonOut
                data={filtered}
                location={location}
                date={datum}
                zone={zone}
                group={group}
                weather={weather}
              />
            </div>

            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}
