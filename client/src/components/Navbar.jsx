import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { current_user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold">LATE NIGHT CHEMIST</Link>
      <div className="space-x-4">
        { current_user && current_user.id ? (
          <>
            <Link onClick={() => logout()}>Logout</Link>
            </>) : (
               <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>)
            }
      </div>
    </nav>
  );
}

export default Navbar;
