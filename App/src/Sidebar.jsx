import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const WEATHER_OPTIONS = [
  "all",
  "clear-day",
  "partly-cloudy-day",
  "cloudy",
  "rain",
  "snow",
  "fog",
  "wind",
];

export const Sidebar = ({
  date,
  setDate,
  locations,
  location,
  setLocation,
  zone,
  setZone,
  group,
  setGroup,
  weather,
  setWeather,
}) => {
  const zoneDisabled = group !== "all";

  return (
    <aside className="aside">
      <Typography className="text" sx={{ fontWeight: 700, mb: 1 }}>
        Einstellungen
      </Typography>

      <Box sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Datum"
            value={date}
            onChange={(v) => v && setDate(v)}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            value={location || ""}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Personengruppe</InputLabel>
          <Select label="Personengruppe" value={group} onChange={(e) => setGroup(e.target.value)}>
            <MenuItem value="all">Alle</MenuItem>
            <MenuItem value="children">Kinder</MenuItem>
            <MenuItem value="adults">Erwachsene</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" disabled={zoneDisabled}>
          <InputLabel>Zone</InputLabel>
          <Select label="Zone" value={zone} onChange={(e) => setZone(e.target.value)}>
            <MenuItem value="all">Alle</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </Select>
        </FormControl>
        <Typography className="text" sx={{ fontSize: 12, mt: 0.5 }}>
          Zone nur bei Alle.
        </Typography>
      </Box>

      <Box sx={{ mb: 1 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Wetter</InputLabel>
          <Select label="Wetter" value={weather} onChange={(e) => setWeather(e.target.value)}>
            {WEATHER_OPTIONS.map((w) => (
              <MenuItem key={w} value={w}>
                {w}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </aside>
  );
};