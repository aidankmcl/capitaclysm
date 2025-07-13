import { extendTheme } from "@mui/joy";

import "../assets/fonts/fonts.css";

const sharedHeaderStyles = { fontWeight: "bold" };

export const capitaclysmTheme = extendTheme({
  fontFamily: {
    body: "Kabel",
    display: "Kabel",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#F5FBD9",
          100: "#EBF7B3",
          200: "#E1F28D",
          300: "#D7ED67",
          400: "#CBE559", // App PRIMARY
          500: "#A8C147",
          600: "#7A8E32",
          700: "#5B6B26",
          800: "#3D471A",
          900: "#1F240D",
        },
        neutral: {
          50: "#F0F7F0",
          100: "#E1EFE1",
          200: "#C3DFC3",
          300: "#A5CFA5",
          400: "#8BAC0F", // App TERTIARY
          500: "#306230", // App GREEN
          600: "#2A542A",
          700: "#1E3C1E",
          800: "#0F380F", // App SECONDARY
          900: "#0A1C0A",
        },
      }
    }
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