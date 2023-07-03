
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@flaticon/flaticon-uicons/css/all/all.css';

import { store } from '~/store';
import { GameManager, Player, Test } from '~/pages';
import { colors, spacing, Layout } from '~/components';

import './App.css';
import { StrictMode } from 'react';

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
    <StrictMode>
      <Provider store={store}>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
        />
        <style>
          {variables}
        </style>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  );
}

export default App;
