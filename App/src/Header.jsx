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
          "& > :not(style)": {
            m: 1,
            width: 440,
            height: 285,
          },
        }}
      >
        <Box className="boardsPreface boardsPrefaceHover" sx={{ p: 2 }}>
          Aufgabenstellung
        </Box>
        <Box className="boardsPreface boardsPrefaceHover" sx={{ p: 2 }}>
          Ergebnis
        </Box>
        <Box className="boardsPreface boardsPrefaceHover" sx={{ p: 2 }}>
          Datensatz
        </Box>
      </Box>
    </div>
  </div>
);
