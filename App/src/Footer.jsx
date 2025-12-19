import React from "react";

export default function Footer() {
  return (
    <footer style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1200 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 16px",
          textAlign: "center",
          background: "rgba(255,255,255,0.9)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          © 2025 — Entwickelt von {" "}
          <a href="https://github.com/jashano" target="_blank" rel="noopener noreferrer">
            Jan Hänisch
          </a>
          {" "}und{" "}
          <a href="https://github.com/LuethiDe" target="_blank" rel="noopener noreferrer">
            Denis Lüthi
          </a>
          {" "}— Modul 3050 WID — Daten: {" "}
          <a
            href="https://data.stadt-zuerich.ch/dataset/hystreet_fussgaengerfrequenzen"
            target="_blank"
          >
            Stadt Zürich
          </a>
        </div>
      </div>
    </footer>
  );
}
