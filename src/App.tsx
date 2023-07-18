import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import '@flaticon/flaticon-uicons/css/all/all.css';

import { store } from '~/store';
import { GameManager, Player, Test } from '~/pages';
import { colors, spacing, Layout } from '~/components';

import './App.css';
import { capitaclysmTheme } from './theme';
import { PeerProvider } from './services/p2p';

const generateCSSVariables = (variables: Record<string, string | number>) => Object.entries(variables)
  .map(([colorName, value]) => `--${colorName}: ${value};`)
  .join('\n');

const variables = `:root {
  ${generateCSSVariables(colors)}
  ${generateCSSVariables(spacing)}
}`;

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout
  },
  {
    path: '/game',
    Component: GameManager
  },
  {
    path: '/player',
    Component: Player
  },
  {
    path: '/test',
    Component: Test
  },
]);

function App() {
  return (
    <CssVarsProvider theme={capitaclysmTheme}>
      <CssBaseline />

      <PeerProvider>
        <Provider store={store}>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet/dist/leaflet.css"
          />
          <style>
            {variables}
          </style>
          <RouterProvider router={router} />
        </Provider>
      </PeerProvider>
    </CssVarsProvider>
  );
}

export default App;
