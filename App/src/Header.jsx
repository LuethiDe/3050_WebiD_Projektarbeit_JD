import React from "react";
import Box from "@mui/material/Box";

export const Header = () => (
  <div>
    <div className="preface">
      <div className="header">
        <h1
          id="title"
          style={{
            marginLeft: "35px",
          }}
        >
          Projektarbeit
        </h1>
        <div
          style={{
            flexGrow: "2",
          }}
        ></div>
      </div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          "& > :not(style)": {
            m: 1,
            flex: "1 1 440px",
            minWidth: 280,
          },
        }}
      >
        <Box className="boardsPreface boardsPrefaceHover" sx={{ p: 2 }}>
          <p className="text">Aufgabenstellung</p>
          <p className="text">
            Ziel der Projektarbeit ist die Entwicklung einer Web-Applikation,
            die mithilfe interaktiver Visualisierungen eine klar definierte
            Fokusfrage zu Passantenfrequenzen beantwortet. Zusätzlich soll die
            Anwendung eine explorative Analyse der Daten erlauben, um zeitliche,
            räumliche und thematische Vergleiche effizient durchführen zu
            können.
          </p>
        </Box>

        <Box className="boardsPreface boardsPrefaceHover" sx={{ p: 2 }}>
          <p className="text">Datensatz</p>
          <p className="text">
            Die Datengrundlage bildet ein Open-Data-Datensatz der Stadt Zürich
            mit stündlichen Fussgängerzählungen an der Bahnhofstrasse seit 2021.
            Er enthält Informationen zu Anzahl Passanten, Laufrichtung,
            Altersgruppen, Zonen sowie Wetter- und Temperaturdaten und wird im
            Backend vollständig verarbeitet und aggregiert bereitgestellt.
          </p>
        </Box>
      </Box>
    </div>
  </div>
);
