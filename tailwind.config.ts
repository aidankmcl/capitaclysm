import { SPACING } from "./src/constants";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}",
  ],
  theme: {
    extend: {
      spacing: SPACING,
      fontFamily: {
        kabel: ["'Kabel'", "sans-serif"],
      },
    },
  },
} satisfies Config; 