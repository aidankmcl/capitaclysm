import { extendTheme } from '@mui/joy';

import './assets/fonts/fonts.css';

const sharedHeaderStyles = { fontWeight: 'bold' };

export const capitaclysmTheme = extendTheme({
  fontFamily: {
    body: 'Kabel',
    display: 'Kabel',
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase'
        }
      }
    }
  },
  typography: {
    h1: { fontSize: '3em', ...sharedHeaderStyles },
    h2: { fontSize: '2em', ...sharedHeaderStyles },
    h3: { fontSize: '1.5em', ...sharedHeaderStyles },
    h4: { fontSize: '1.25em', ...sharedHeaderStyles }, // Don't go lower than 1.25
    h5: { fontSize: '1.25em', ...sharedHeaderStyles },
    h6: { fontSize: '1.25em', ...sharedHeaderStyles },
    body1: { fontSize: '1.5em' },
    body2: { fontSize: '1.25em' },
    body3: { fontSize: '1em' },
    body4: { fontSize: '0.75em' },
  }
});
