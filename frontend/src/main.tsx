import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import colors from "./styles/colors.ts";
import "./index.css"

const theme = createTheme({
  typography: {
    fontFamily: 'Times New Roman, serif',
  },
  palette: {
    text: {
      primary: colors.secondary,
    },
    background: {
      default: colors.primary,
      paper: colors.secondarybg,
    },
    primary: {
      main: colors.primary,
    },
    divider: colors.border,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
