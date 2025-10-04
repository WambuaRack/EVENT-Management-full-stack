import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">EventApp</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="uppercase">{user.role}</span>
            <button
              className="bg-red-500 px-3 py-1 rounded"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
