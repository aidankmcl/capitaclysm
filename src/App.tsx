
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './game/store';
import { GameManager, Player, Test } from './pages';
import { Layout } from './components/Layout';
import './App.css';

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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
