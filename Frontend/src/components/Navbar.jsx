import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 lg:px-16 py-5 bg-white border-b border-slate-100">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">

        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
          M
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Med<span className="text-red-600">Reach</span>
        </h2>

      </Link>


      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">

        <Link
          to="/"
          className="text-slate-600 hover:text-red-600 transition"
        >
          Home
        </Link>

        <a
          href="/#features"
          className="text-slate-600 hover:text-red-600 transition"
        >
          Features
        </a>

        <a
          href="/#how-it-works"
          className="text-slate-600 hover:text-red-600 transition"
        >
          How It Works
        </a>

        <a
          href="/#about"
          className="text-slate-600 hover:text-red-600 transition"
        >
          About
        </a>

      </div>


      {/* Authentication Buttons */}
      <div className="flex items-center gap-3">

        <Link
          to="/login"
          className="px-5 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-sm"
        >
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;