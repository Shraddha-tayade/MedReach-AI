import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Other role login APIs are not connected yet
      if (role !== "patient") {
        setError(
          "Login for this role will be connected after the backend API is provided."
        );
        setLoading(false);
        return;
      }

      // Patient login
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: identifier,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Login failed."
        );
      }

      // Save logged-in user information
      sessionStorage.setItem(
        "medreachToken",
        data.token
      );

      sessionStorage.setItem(
        "medreachUser",
        JSON.stringify(data.user)
      );

      // Go to patient dashboard
      navigate("/user/dashboard");

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

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Med<span className="text-red-600">Reach</span>
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back
          </p>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Login Role */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Login As
            </label>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIdentifier("");
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
            </select>

          </div>

          {/* Email / Username */}
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
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                role === "patient" || role === "donor"
                  ? "Enter your email"
                  : "Enter your username"
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

          </div>

          {/* Password */}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm text-slate-600 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-red-600 font-semibold hover:text-red-700"
          >
            Register
          </Link>

        </p>

        {/* Back to Home */}
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