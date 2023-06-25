
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { GameManager, Player } from './pages';
import { Layout } from './components/Layout';

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
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
