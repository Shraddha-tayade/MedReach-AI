import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get("role") || "patient";

  const [role, setRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleTypeMap = {
    patient: "USER",
    donor: "DONOR",
    hospital: "HOSPITAL",
    bloodbank: "BLOOD_BANK",
    ambulance: "AMBULANCE",
    admin: "ADMIN",
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const type = roleTypeMap[role];

      let requestBody;

      // ================= ADMIN =================
      if (role === "admin") {
        requestBody = {
          username: identifier,
          password: password,
        };
      }

      // ================= USER / DONOR =================
      else if (role === "patient" || role === "donor") {
        requestBody = {
          email: identifier,
          password: password,
        };
      }

      // ================= HOSPITAL / BLOOD BANK / AMBULANCE =================
      else {
        requestBody = {
          username: identifier,
          password: password,
        };
      }

      const response = await fetch(
        `http://localhost:5000/api/auth/login?type=${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Login failed."
        );
      }

      // ================= SAVE TOKEN =================

      if (data.token) {
        sessionStorage.setItem(
          "medreachToken",
          data.token
        );
      }

      // ================= ADMIN =================

      if (role === "admin") {
        // Admin response does not contain account data.
        // Store only the admin role.
        sessionStorage.setItem(
          "medreachUser",
          JSON.stringify({
            type: "ADMIN",
          })
        );

        navigate("/admin/dashboard");
        return;
      }

      // ================= OTHER ROLES =================

      if (data.account) {
        sessionStorage.setItem(
          "medreachUser",
          JSON.stringify(data.account)
        );
      }

      // ================= REDIRECT =================

      if (role === "patient") {
        navigate("/user/dashboard");
      } else if (role === "donor") {
        navigate("/Donor/dashboard");
      } else if (role === "hospital") {
        navigate("/Hospital/dashboard");
      } else {
        setError(
          "Login successful, but this role's dashboard is not connected yet."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* ================= LOGO ================= */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Med<span className="text-red-600">Reach</span>
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back
          </p>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}


        <form onSubmit={handleLogin} className="space-y-5">

          {/* ================= ROLE ================= */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Login As
            </label>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier("");
                setPassword("");
                setError("");
              }}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >

              <option value="patient">
                Patient / Family
              </option>

              <option value="donor">
                Donor
              </option>

              <option value="hospital">
                Hospital
              </option>

              <option value="bloodbank">
                Blood Bank
              </option>

              <option value="ambulance">
                Ambulance
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>


          {/* ================= EMAIL / USERNAME ================= */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              {role === "patient" || role === "donor"
                ? "Email Address"
                : "Username"}
            </label>

            <input
              type={
                role === "patient" || role === "donor"
                  ? "email"
                  : "text"
              }
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
              placeholder={
                role === "patient" || role === "donor"
                  ? "Enter your email"
                  : "Enter your username"
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

          </div>


          {/* ================= PASSWORD ================= */}

          <div>

            <div className="flex justify-between items-center mb-2">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Forgot password?
              </button>

            </div>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

          </div>


          {/* ================= LOGIN ================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* ================= REGISTER ================= */}

        {role !== "admin" && (
          <p className="text-center text-sm text-slate-600 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Register
            </Link>

          </p>
        )}


        {/* ================= BACK ================= */}

        <div className="text-center mt-5">

          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-red-600 transition"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;
