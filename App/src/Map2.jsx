import { useEffect, useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import vegaEmbed from "vega-embed";

function getPeopleByGroup(r, group) {
  const n = (x) => Number(x ?? 0);

  const total = n(r.pedestrians_count);

  const adults =
    n(r.adult_ltr_pedestrians_count) + n(r.adult_rtl_pedestrians_count);

  const children =
    n(r.child_ltr_pedestrians_count) + n(r.child_rtl_pedestrians_count);

  if (group === "adults") return adults;
  if (group === "children") return children;
  return total; // "all"
}

function getTemp(r) {
  const t = Number(r.temperature ?? r.temp ?? r.air_temperature);
  return Number.isFinite(t) ? t : null;
}

export const Map = ({ data = [], location, date, group = "all", weather }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);

  const chartData = useMemo(() => {
    return (Array.isArray(data) ? data : [])
      .map((r) => {
        const temperature = getTemp(r);
        const people = getPeopleByGroup(r, group);

        return {
          temperature,
          people,
          hour: r.hour,
          weather_condition: r.weather_condition,
        };
      })
      .filter(
        (d) =>
          d.temperature !== null && Number.isFinite(d.people) && d.people >= 0
      );
  }, [data, group]);

  const spec = useMemo(() => {
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
        x: {
          field: "hour",
          type: "ordinal",
          title: "Stunde",
          axis: { labelAngle: 0 },
        },
        y: { field: "people", type: "quantitative", title: "Personen" },
        color: { field: "weather_condition", type: "nominal", title: "Wetter" },
        tooltip: [
          { field: "temperature", type: "quantitative", title: "°C" },
          { field: "people", type: "quantitative", title: "Personen" },
          { field: "weather_condition", type: "nominal", title: "Wetter" },
        ],
      },
    };
  }, [chartData, location, date, group, weather]);

  useEffect(() => {
    if (!chartRef.current) return;

    vegaEmbed(chartRef.current, spec, { actions: false }).catch((e) =>
      setError(String(e))
    );
  }, [spec]);

  if (error) return <div style={{ padding: 15 }}>Error: {error}</div>;
  if (!chartData.length)
    return (
      <div style={{ padding: 20 }}>
        <Alert severity="info">
          Keine gültigen Temperatur/Personen-Daten gefunden.
        </Alert>
      </div>
    );

  return (
    <div>
      <div style={{ padding: 20 }} ref={chartRef} />
    </div>
  );
};
