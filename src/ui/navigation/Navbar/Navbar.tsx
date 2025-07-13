import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="bg-darkGreen/90 px-5 py-2.5 text-mint rounded-t-lg border border-lightGreen">
      <Link to="/" className="text-mint hover:text-lightGreen transition-colors font-semibold">
        Play
      </Link>
      <span className="mx-3 text-green">---</span>
      <Link to="/test" className="text-mint hover:text-lightGreen transition-colors font-semibold">
        Test
      </Link>
    </div>
  );
};
