import { useEffect, useMemo, useRef, useState } from "react";
import vegaEmbed from "vega-embed";

export const Map = ({ data = [], location, date, group, weather }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);

  const chartData = useMemo(() => {
    return (Array.isArray(data) ? data : [])
      .map((r) => ({
        temperature: Number(r.temperature ?? r.temp ?? r.air_temperature),
        pedestrians_count: Number(r.pedestrians_count),
        hour: r.hour,
        weather_condition: r.weather_condition,
      }))
      .filter(
        (d) =>
          Number.isFinite(d.temperature) && Number.isFinite(d.pedestrians_count)
      );
  }, [data]);

  const spec = useMemo(() => {
    return {
      data: { values: chartData },
      title: `${location} – ${date} – Gruppe: ${group} – Wetter: ${weather}`,
      width: 600,
      height: 400,
      mark: { type: "point", filled: true },
      encoding: {
        x: {
          field: "temperature",
          type: "quantitative",
          title: "Temperatur (°C)",
        },
        y: {
          field: "pedestrians_count",
          type: "quantitative",
          title: "Anz. Personen",
        },
        tooltip: [
          {
            field: "temperature",
            type: "quantitative",
            title: "Temperatur (°C)",
          },
          {
            field: "pedestrians_count",
            type: "quantitative",
            title: "Anz. Personen",
          },
          { field: "hour", type: "temporal", title: "Stunde" },
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

  if (error) return <div style={{ padding: 15 }}>Fehler: {error}</div>;
  if (!chartData.length)
    return <div style={{ padding: 15 }}>Keine Daten zum Anzeigen.</div>;

  return (
    <div style={{ padding: 10 }}>
      <div ref={chartRef}></div>
      <div>Datenpunkte: {data.length}</div>
      <div>
        {location} – {date} – Gruppe: {group} – Wetter: {weather}
      </div>

      <pre style={{ fontSize: 12, maxHeight: 250, overflow: "auto" }}>
        {JSON.stringify(data[0], null, 2)}
      </pre>
    </div>
  );
};

//Chart-filter: Wann sind am meinsten Kinder unterwegs?
