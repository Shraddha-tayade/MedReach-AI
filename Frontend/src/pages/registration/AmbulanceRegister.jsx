import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AmbulanceRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    ambulanceNumber: "",
    ambulanceType: "",
    ambulanceCategory: "",
    hospitalId: "",
    contact: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    rcDocument: null,
    fitnessCertificate: null,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    // Contact validation
    if (!/^\d{10}$/.test(formData.contact)) {
      setError("Please enter a valid 10-digit contact number.");
      return;
    }

    // Private ambulance must have an associated hospital
    if (
      formData.ambulanceCategory === "PRIVATE" &&
      !formData.hospitalId.trim()
    ) {
      setError("Please enter the associated hospital.");
      return;
    }

    // Frontend-only for now
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      setMessage(
        "Ambulance registration form submitted successfully. Backend connection will be added later."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">

        {/* Back to Role Selection */}
        <div className="mb-6">
          <Link
            to="/register"
            className="text-sm text-slate-500 hover:text-red-600 transition"
          >
            ← Back to Role Selection
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">

          {/* Heading */}
          <div className="text-center mb-8">

            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                M
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Med<span className="text-red-600">Reach</span>
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Ambulance Registration
            </h2>

            <p className="text-slate-500 mt-2">
              Register an ambulance to provide emergency transportation
              services through MedReach.
            </p>

          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-8">

            {/* ================= ACCOUNT DETAILS ================= */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Account Details
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Confirm Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

              </div>
            </div>

            {/* ================= AMBULANCE DETAILS ================= */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Ambulance Details
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Ambulance Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ambulance Number
                  </label>

                  <input
                    type="text"
                    name="ambulanceNumber"
                    value={formData.ambulanceNumber}
                    onChange={handleChange}
                    placeholder="e.g. MH12AB1234"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Ambulance Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ambulance Type
                  </label>

                  <select
                    name="ambulanceType"
                    value={formData.ambulanceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">
                      Select ambulance type
                    </option>

                    <option value="BLS">
                      BLS (Basic Life Support)
                    </option>

                    <option value="ALS">
                      ALS (Advanced Life Support)
                    </option>
                  </select>
                </div>

                {/* Ambulance Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ambulance Category
                  </label>

                  <select
                    name="ambulanceCategory"
                    value={formData.ambulanceCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">
                      Select ambulance category
                    </option>

                    <option value="PUBLIC">
                      Public / Government
                    </option>

                    <option value="PRIVATE">
                      Private
                    </option>
                  </select>
                </div>

                {/* Associated Hospital - Only for Private */}
                {formData.ambulanceCategory === "PRIVATE" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Associated Hospital
                    </label>

                    <input
                      type="text"
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleChange}
                      placeholder="Enter associated hospital"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />

                    <p className="text-xs text-slate-400 mt-2">
                      Required for private ambulances.
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter 10-digit contact number"
                    maxLength="10"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

              </div>
            </div>

            {/* ================= ADDRESS DETAILS ================= */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Address Details
              </h3>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Address Line */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line
                  </label>

                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

              </div>
            </div>

            {/* ================= VERIFICATION DOCUMENTS ================= */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Verification Documents
              </h3>

              <p className="text-sm text-slate-500 mb-4">
                Upload the required documents for ambulance verification.
              </p>

              <div className="grid md:grid-cols-2 gap-5">

                {/* RC Document */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    RC Document
                  </label>

                  <input
                    type="file"
                    name="rcDocument"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-sm"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Upload a clear copy of the vehicle Registration Certificate
                    (RC). Accepted formats: PDF, JPG, JPEG, PNG.
                  </p>
                </div>

                {/* Fitness Certificate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fitness Certificate
                  </label>

                  <input
                    type="file"
                    name="fitnessCertificate"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-sm"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Upload a valid ambulance fitness certificate. Accepted
                    formats: PDF, JPG, JPEG, PNG.
                  </p>
                </div>

              </div>
            </div>

            {/* ================= SUBMIT ================= */}
            <div className="pt-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Ambulance Account..."
                  : "Create Ambulance Account"}
              </button>

            </div>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}

            <Link
              to="/login"
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default AmbulanceRegister;