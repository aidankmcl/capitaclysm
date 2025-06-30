import { Link } from "react-router-dom";

import styles from "./Navbar.module.css";

export const Navbar = () => {
  return <div className={styles.navbar}>
    <Link to="/">Play</Link> --- <Link to="/test">Test</Link>
  </div>;
};
