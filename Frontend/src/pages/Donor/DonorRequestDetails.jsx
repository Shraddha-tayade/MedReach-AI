import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DonorRequestDetails() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const request = routerLocation.state?.request;

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If someone opens this page directly without selecting a request
  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-800">
            No Request Selected
          </h2>
          <p className="text-slate-500 mt-2">
            Please select a blood request from your dashboard.
          </p>
          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="mt-5 rounded-lg bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const requestId = request.id || request.requestId || "N/A";
  const bloodGroup = request.bloodGroup || "N/A";
  const units = request.units ?? request.unitsRequired ?? 1;
  const hospital =
    request.hospital || request.hospitalName || "Hospital details unavailable";
  const hospitalLocation =
    request.location || request.hospitalLocation || "Location unavailable";
  const distance = request.distance || "Not available";
  const priority = request.priority || "Normal";
  const requestTime = request.requestTime || request.time || "Recently";

  const handleAcceptRequest = () => {
    setError("");
    setShowLocationModal(true);
  };

  const handleEnableLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const donorLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLoading(false);
        setShowLocationModal(false);

        navigate("/Donor/accepted", {
          state: {
            request,
            donorLocation,
            locationSharingEnabled: true,
          },
        });
      },
      (locationError) => {
        setLoading(false);

        if (locationError.code === 1) {
          setError(
            "Location permission was denied. Allow location access in your browser to continue."
          );
        } else if (locationError.code === 2) {
          setError("Your current location could not be detected. Please try again.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="text-2xl font-extrabold text-red-600"
          >

             <p className="text-xl font-semibold text-red-600">
              MedReach -Smart Emergency Medical Resource Platform
            </p>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/Donor/dashboard")}
          className="text-red-600 font-semibold hover:text-red-700 mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-red-600 p-6 text-white">
            <p className="text-sm text-red-100">Emergency Blood Request</p>
            <h1 className="text-2xl font-bold mt-1">Request Details</h1>
            <p className="mt-2 text-red-100">
              Request ID: {requestId}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Required Blood Group</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {bloodGroup}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  priority.toLowerCase() === "high" ||
                  priority.toLowerCase() === "urgent" ||
                  priority.toLowerCase() === "critical"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Units Required</p>
                <p className="font-bold text-slate-800 text-lg mt-1">
                  {units} unit(s)
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Distance</p>
                <p className="font-bold text-slate-800 text-lg mt-1">
                  {distance}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Hospital</p>
                <p className="font-bold text-slate-800 text-lg mt-1">
                  {hospital}
                </p>
                <p className="text-slate-600 mt-1">
                  📍 {hospitalLocation}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Request Time</p>
                <p className="font-semibold text-slate-800 mt-1">
                  {requestTime}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900">
                Location Permission
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                It will ask your permission to access your current
                location before you continue.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-3 text-sm"
              >
                {error}
              </div>
            )}

            <button
              onClick={handleAcceptRequest}
              className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-4 transition"
            >
              Accept Request
            </button>
          </div>
        </div>
      </main>

      {/* Location permission modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
              📍
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center mt-4">
              Enable Your Location
            </h2>

            <p className="text-slate-600 text-center mt-2">
              Allow location access to continue with this blood request.
            </p>

            {error && (
              <p role="alert" className="text-red-600 text-sm mt-3 text-center">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              onClick={handleEnableLocation}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-lg py-3"
            >
              {loading ? "Getting Location..." : "Enable Location"}
            </button>

            <button
              disabled={loading}
              onClick={() => {
                setShowLocationModal(false);
                setError("");
              }}
              className="w-full mt-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg py-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}