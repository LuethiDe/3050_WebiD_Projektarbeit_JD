import Typography from "@mui/material/Typography";

export const Header = () => (
  <div className="header">
    <header sx={{ width: "200%", maxWidth: 700 }}>
      <div className="header-sub">
        <Typography variant="h4" sx={{ color: "black", fontWeight: "bold" }}>
          Projekttitel
        </Typography>
      </div>
    </header>
  </div>
);
