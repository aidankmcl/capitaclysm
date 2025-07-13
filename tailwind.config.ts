import { SPACING } from "./src/constants";
import type { Config } from "tailwindcss";
import { addIconSelectors } from "@iconify/tailwind";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,html}",
  ],
  plugins: [
    addIconSelectors(['lucide', 'heroicons', 'tabler']),
  ],
  theme: {
    extend: {
      spacing: {
        ...SPACING,
        'phone': 'var(--phone-padding)',
        'status': 'var(--status-bar-height)',
        'nav': 'var(--nav-bar-height)',
        'app-icon': 'var(--app-icon-size)',
      },
      width: {
        'phone': 'var(--phone-width)',
      },
      height: {
        'phone': 'var(--phone-height)',
      },
      borderRadius: {
        'phone': 'var(--phone-radius)',
        'app-icon': 'var(--app-icon-radius)',
      },
      fontFamily: {
        kabel: ["'Kabel'", "sans-serif"],
      },
      animation: {
        'app-launch': 'appLaunch var(--animation-medium) ease-out',
        'app-close': 'appClose var(--animation-medium) ease-in',
        'icon-bounce': 'iconBounce var(--animation-fast) ease-out',
      },
      colors: {
        'phone-bg': 'var(--color-phone-bg)',
        'phone-text': 'var(--color-phone-text)',
        'status-bar': 'var(--color-status-bar)',
        'app-uber': 'var(--color-app-uber)',
        'app-contacts': 'var(--color-app-contacts)',
        'app-realestate': 'var(--color-app-realestate)',
        'app-trading': 'var(--color-app-trading)',
        'app-settings': 'var(--color-app-settings)',
      },
    },
  },
} satisfies Config; 