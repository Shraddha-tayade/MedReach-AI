import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  // Get logged-in user details
  const storedUser = sessionStorage.getItem("medreachUser");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read user data:", error);
  }

  const userName = user?.name || "Patient";
  const userInitial = userName.charAt(0).toUpperCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    sessionStorage.removeItem("medreachToken");
    sessionStorage.removeItem("medreachUser");
    sessionStorage.removeItem("medreachLastEmergencyRequest");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">

            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Med<span className="text-red-600">Reach</span>
            </h1>

          </div>


          {/* ================= USER MENU ================= */}
          <div
            ref={menuRef}
            className="relative flex items-center gap-4"
          >

            <div className="text-right hidden sm:block">

              <p className="text-sm font-semibold text-slate-900">
                Welcome, {userName}
              </p>

              <p className="text-xs text-slate-500">
                Patient
              </p>

            </div>


            {/* Avatar Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold hover:bg-red-200 transition focus:outline-none"
              aria-label="Open profile menu"
            >
              {userInitial}
            </button>


            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-14 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">

                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">

                  <p className="font-semibold text-slate-900 truncate">
                    {userName}
                  </p>

                  <p className="text-xs text-slate-500">
                    Patient / Family
                  </p>

                </div>


                {/* Edit Profile */}
                <Link
                  to="/user/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <span>👤</span>
                  <span className="font-medium">
                    Edit Profile
                  </span>
                </Link>


                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition text-left border-t border-slate-100"
                >
                  <span>🚪</span>
                  <span className="font-medium">
                    Logout
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Welcome */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            PATIENT DASHBOARD
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            How can we help you today?
          </h2>

          <p className="text-slate-600 mt-2">
            Find medical resources or create an emergency request.
          </p>

        </div>


        {/* ================= EMERGENCY BUTTON ================= */}
        <div className="bg-red-600 rounded-2xl p-8 text-white mb-10">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <h3 className="text-2xl font-bold mb-2">
                Need Emergency Assistance?
              </h3>

              <p className="text-red-100">
                Request multiple medical resources from one place.
              </p>

            </div>

            <Link
              to="/user/emergency"
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition whitespace-nowrap"
            >
              Create Emergency Request
            </Link>

          </div>

        </div>


        {/* ================= RESOURCE CARDS ================= */}
        <section>

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Find Medical Resources
          </h3>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Blood */}
            <Link
              to="/user/find-blood"
              className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-red-200 transition"
            >

              <div className="text-3xl mb-4">
                🩸
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Find Blood
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Search for available blood near your location.
              </p>

              <p className="text-sm text-red-600 font-semibold mt-4">
                Find Blood →
              </p>

            </Link>


            {/* Hospital */}
            <Link
              to="/user/find-hospital"
              className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-red-200 transition"
            >

              <div className="text-3xl mb-4">
                🏥
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Find Hospital
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Find nearby hospitals and available medical resources.
              </p>

              <p className="text-sm text-red-600 font-semibold mt-4">
                Find Hospital →
              </p>

            </Link>


            {/* ICU / Oxygen */}
            <Link
              to="/user/resources"
              className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-red-200 transition"
            >

              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🫁
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                ICU & Oxygen
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Check available ICU beds and oxygen resources.
              </p>

              <p className="mt-5 text-red-600 font-semibold text-sm">
                Find Resources →
              </p>

            </Link>


            {/* Ambulance */}
            <Link
              to="/user/find-ambulance"
              className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-red-200 transition"
            >

              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🚑
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                Find Ambulance
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Find available ambulances for emergency transportation.
              </p>

              <p className="mt-5 text-red-600 font-semibold text-sm">
                Find Ambulance →
              </p>

            </Link>

          </div>

        </section>


        {/* ================= ACTIVE REQUESTS ================= */}
        <section className="mt-12">

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Active Requests
            </h3>

            <Link
              to="/user/active-requests"
              className="text-red-600 text-sm font-semibold hover:text-red-700 transition"
            >
              View All
            </Link>

          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

            <div className="text-4xl mb-3">
              📋
            </div>

            <h4 className="font-semibold text-slate-900">
              No Active Requests
            </h4>

            <p className="text-sm text-slate-500 mt-2">
              Your emergency requests will appear here.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UserDashboard;