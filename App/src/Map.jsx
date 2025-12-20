
// React Hooks und externe Bibliotheken importieren
import { useEffect, useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import vegaEmbed from "vega-embed";

// Hilfsfunktion: Gibt die Personenanzahl je nach gewählter Gruppe zurück
function getPeopleByGroup(row, group) {
  const n = (x) => Number(x ?? 0);

  const total = n(row.pedestrians_count);
  const adults = n(row.adult_ltr_pedestrians_count) + n(row.adult_rtl_pedestrians_count);
  const children = n(row.child_ltr_pedestrians_count) + n(row.child_rtl_pedestrians_count);

  if (group === "adults") return adults;
  if (group === "children") return children;
  return total; // "all"
}

// Hilfsfunktion: Extrahiert die Temperatur aus dem Datensatz
function getTemp(row) {
  const t = Number(row.temperature ?? row.temp ?? row.air_temperature);
  return Number.isFinite(t) ? t : null;
}

// Diagramm erstellen
// Props: data = Datensätze, location = Standort, date = Datum, group = Personengruppe, weather = Wetterfilter
export const Map = ({ data = [], location, date, group = "all", weather }) => {
  // Referenz auf das Chart-DOM-Element
  const chartRef = useRef(null);
  // Fehlerstatus für das Chart
  const [error, setError] = useState(null);

  // chartData: Bereitet die Daten für das Diagramm auf (Personenzahl, Temperatur, Stunde, Wetter)
  const chartData = useMemo(() => {
    return (Array.isArray(data) ? data : [])
      .map((row) => {
        const temperature = getTemp(row);
        const people = getPeopleByGroup(row, group);
        return {
          temperature,
          people,
          hour: row.hour,
          weather_condition: row.weather_condition,
        };
      })
      .filter(
        (dataPoint) =>
          dataPoint.temperature !== null && Number.isFinite(dataPoint.people) && dataPoint.people >= 0
      );
  }, [data, group]);

  // Vega-Lite-Spezifikation für das Balkendiagramm
  const spec = useMemo(() => {
    // Beschriftung für die Personengruppe
    const groupLabel =
      group === "children"
        ? "Kinder"
        : group === "adults"
        ? "Erwachsene"
        : "Alle";

    return {
      data: { values: chartData },
      title: `${date ?? ""} · ${
        location ?? ""
      } ·  Gruppe: ${groupLabel} · Wetter: ${weather ?? ""}`,
      width: 750,
      height: 300,

      // Balken-Diagramm mit Tooltip und Transparenz
      mark: {
        type: "bar",
        tooltip: true,
        filled: true,
        opacity: 0.7,
        width: 26,
        position: "center",
      },

      background: "transparent",
      view: {
        fill: "#ffffff",
        stroke: null,
      },

      encoding: {
        // X-Achse: Stunde (ordinal)
        x: {
          field: "hour",
          type: "ordinal",
          title: "Stunde",
          axis: { labelAngle: 0 },
        },
        // Y-Achse: Personenzahl
        y: { field: "people", type: "quantitative", title: "Personen" },
        // Farbe nach Wetterbedingung
        color: { field: "weather_condition", type: "nominal", title: "Wetter" },
        // Tooltip mit Temperatur, Personen, Wetter
        tooltip: [
          { field: "temperature", type: "quantitative", title: "°C" },
          { field: "people", type: "quantitative", title: "Personen" },
          { field: "weather_condition", type: "nominal", title: "Wetter" },
        ],
      },
    };
  }, [chartData, location, date, group, weather]);

  // Effekt: Rendert das Diagramm mit vegaEmbed, wenn sich die Spec ändert
  useEffect(() => {
    if (!chartRef.current) return;
    vegaEmbed(chartRef.current, spec, { actions: false }).catch((e) =>
      setError(String(e))
    );
  }, [spec]);

  // Fehleranzeige, falls das Diagramm nicht gerendert werden kann
  if (error) return <div style={{ padding: 15 }}>Error: {error}</div>;
  // Hinweis, falls keine Daten vorhanden sind
  if (!chartData.length)
    return (
      <div style={{ padding: 20 }}>
        <Alert severity="info">
          Keine gültigen Temperatur/Personen-Daten gefunden.
        </Alert>
      </div>
    );

  // Render: Diagramm und Beschreibungstext
  return (
    <div>
      {/* Diagramm-Container */}
      <div style={{ padding: 20, paddingBottom: 0 }} ref={chartRef} />
      {/* Beschreibung unter dem Diagramm */}
      <div className="text" style={{ padding: 20, paddingTop: 0 }}>
        Fokusfrage: Wie beeinflussen unterschiedliche Wetterbedingungen die stündliche Passantenfrequenz an ausgewählten Standorten?
        <br />
        Die Grafik zeigt die Personenzahl pro Stunde und Wetterbedingung.
        <br />
        Über die Einstellungen auf der linken Seite kann nach Datum, Location,
        Personengruppe, Zone und Wetter gefiltert werden.
      </div>
    </div>
  );
};
