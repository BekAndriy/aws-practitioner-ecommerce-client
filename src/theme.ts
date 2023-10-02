import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: `Jost, sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0c3a2d",
    },
    secondary: {
      main: "#f50057",
    },
  },
});
