import { Link } from 'react-router-dom';

export const Navbar = () => {
  return <div>
    <Link to="/">Home</Link> -- <Link to="/game">Create</Link> -- <Link to="/player">Join</Link>
  </div>;
};
