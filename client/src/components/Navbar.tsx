import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-5 text-white">

      {/* LOGO */}

      <Link
        to="/"
        className="text-2xl font-bold"
      >
        Skill
        <span className="text-yellow-400">
          Swap
        </span>{" "}
        
      </Link>


      {/* NAVIGATION */}

      <div className="flex items-center gap-4">

        {currentUser ? (
          <>
            <Link
              to="/dashboard"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              to="/discover"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Discover
            </Link>

            <Link
              to="/requests"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Requests
            </Link>

            <Link
              to="/profile"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Profile
            </Link>


            {/* USER NAME */}

            <span className="hidden text-sm text-slate-400 md:block">
              👋 {currentUser.name}
            </span>


            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 transition hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 transition hover:bg-blue-500"
            >
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;