import { useEffect, useMemo, useRef, useState } from "react";
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
    const rows = Array.isArray(data) ? data : [];
    const n = (x) => Number(x ?? 0);

    return rows
      .flatMap((r) => {
        const hour = Number(r.hour ?? r.hour_of_day ?? r.hour);
        const adults = n(r.adult_ltr_pedestrians_count) + n(r.adult_rtl_pedestrians_count);
        const children = n(r.child_ltr_pedestrians_count) + n(r.child_rtl_pedestrians_count);

        const out = [];
        if (group === "all" || group === "adults") {
          out.push({ hour, group: "Erwachsene", people: adults, weather_condition: r.weather_condition });
        }
        if (group === "all" || group === "children") {
          out.push({ hour, group: "Kinder", people: children, weather_condition: r.weather_condition });
        }

        return out;
      })
      .filter((d) => Number.isFinite(d.hour) && Number.isFinite(d.people) && d.people >= 0);
  }, [data, group]);

  // If there are no valid person records, generate placeholder zero-values
  // so the chart still renders with fixed axes/bins for all 24 hours.
  const displayData = useMemo(() => {
    if (chartData.length) return chartData;

    const out = [];
    for (let h = 0; h < 24; h++) {
      if (group === "all" || group === "adults") out.push({ hour: h, group: "Erwachsene", people: 0 });
      if (group === "all" || group === "children") out.push({ hour: h, group: "Kinder", people: 0 });
    }
    return out;
  }, [chartData, group]);

  const spec = useMemo(() => {
    const groupLabel =
      group === "children"
        ? "Kinder"
        : group === "adults"
        ? "Erwachsene"
        : "Alle";

    return {
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      autosize: { type: "pad", contains: "padding" },
      data: { values: displayData },
      title: `${location ?? ""} · ${date ?? ""} · Gruppe: ${groupLabel} · Wetter: ${weather ?? ""}`,
      width: 700,
      height: 380,

      mark: { type: "bar", tooltip: true },

      encoding: {
        x: {
          field: "hour",
          type: "quantitative",
          bin: { step: 1, extent: [0, 24] },
          title: "Uhrzeit",
          axis: { labelAngle: 0, format: "d", values: Array.from({ length: 24 }, (_, i) => i) },
        },
        y: {
          aggregate: "sum",
          field: "people",
          type: "quantitative",
          title: "Personen",
        },
        color: {
          field: "group",
          type: "nominal",
          title: "Gruppe",
          scale: { domain: ["Kinder", "Erwachsene"], range: ["#FFA500", "#1f77b4"] },
        },
        tooltip: [
          { field: "hour", type: "quantitative", title: "Stunde" },
          { field: "group", type: "nominal", title: "Gruppe" },
          { aggregate: "sum", field: "people", type: "quantitative", title: "Personen" },
        ],
      },
    };
  }, [displayData, location, date, group, weather]);

  useEffect(() => {
    if (!chartRef.current) return;

    vegaEmbed(chartRef.current, spec, { actions: false }).catch((e) =>
      setError(String(e))
    );
  }, [spec]);

  if (error) return <div style={{ padding: 15 }}>Error: {error}</div>;
  return <div style={{ padding: 15 }} ref={chartRef} />;
};
