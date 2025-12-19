import { useEffect, useMemo, useRef, useState } from "react";
//import vegaEmbed from "vega-embed";

export const Map = ({ data = [], location, date, group, weather }) => {
  return (
    <div style={{ padding: 10 }}>
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
