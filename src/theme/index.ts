import { extendTheme } from "@mui/joy";

import "../assets/fonts/fonts.css";

const sharedHeaderStyles = { fontWeight: "bold" };

export const capitaclysmTheme = extendTheme({
  fontFamily: {
    body: "Kabel",
    display: "Kabel",
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase"
        }
      }
    }
  },
  typography: {
    h1: { fontSize: "3rem", ...sharedHeaderStyles },
    h2: { fontSize: "2rem", ...sharedHeaderStyles },
    h3: { fontSize: "1.5rem", ...sharedHeaderStyles },
    h4: { fontSize: "1.25rem", ...sharedHeaderStyles }, // Don't go lower than 1.25
    "body-lg": { fontSize: "1.25rem" },
    "body-md": { fontSize: "1rem" },
    "body-sm": { fontSize: "0.9rem" },
    "body-xs": { fontSize: "0.8rem" },
  }
}); 