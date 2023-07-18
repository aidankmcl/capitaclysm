import { extendTheme } from '@mui/joy';

import './assets/fonts/fonts.css';

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
  }
});
