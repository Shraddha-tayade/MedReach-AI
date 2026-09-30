import { useState } from "react";
import { Link } from "react-router-dom";

function FindHospital() {
  const [hospitalType, setHospitalType] = useState("");
  const [radius, setRadius] = useState("");

  const [location, setLocation] = useState("");
  const [locationMode, setLocationMode] = useState("manual");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [searched, setSearched] = useState(false);

  const useCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Location detection is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationMode("current");
        setLocation("");
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setLocationError(
          "Unable to access your location. Please allow location permission or enter your location manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualLocation = (e) => {
    setLocation(e.target.value);
    setLocationMode("manual");

    setLatitude(null);
    setLongitude(null);
    setLocationError("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setSearched(true);

    // Later backend can receive:
    // latitude, longitude, location, hospitalType, radius
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            to="/user/dashboard"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Med<span className="text-red-600">Reach</span>
            </h1>
          </Link>

          <Link
            to="/user/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-red-600"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Title */}
        <div className="mb-8">
          <p className="text-red-600 font-semibold text-sm mb-2">
            HOSPITAL SEARCH
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find Hospitals
          </h2>

          <p className="text-slate-600 mt-2">
            Find nearby hospitals and available medical facilities.
          </p>
        </div>

        {/* Search Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">

          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Search Hospitals
          </h3>

          <form onSubmit={handleSearch}>

            {/* Location */}
            <div className="mb-7">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={handleManualLocation}
                placeholder="Enter full location"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />

              <p className="text-xs text-slate-400 mt-2">
                Example: Pune, Maharashtra
              </p>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={locationLoading}
                className={`w-full border rounded-xl p-4 text-left transition ${
                  locationMode === "current"
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:border-red-400 hover:bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      locationMode === "current"
                        ? "bg-green-100"
                        : "bg-red-50"
                    }`}
                  >
                    {locationMode === "current" ? "✓" : "📍"}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {locationLoading
                        ? "Detecting your location..."
                        : locationMode === "current"
                        ? "Current Location Detected"
                        : "Use My Current Location"}
                    </p>

                    <p className="text-sm text-slate-500 mt-0.5">
                      {locationMode === "current"
                        ? "Browser location selected"
                        : "Let your browser detect your location"}
                    </p>
                  </div>

                </div>
              </button>

              {locationError && (
                <p className="text-sm text-red-600 mt-2">
                  {locationError}
                </p>
              )}

            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hospital Type
                </label>

                <select
                  value={hospitalType}
                  onChange={(e) => setHospitalType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="">
                    Select hospital type
                  </option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>Multi-Specialty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Radius
                </label>

                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="">
                    Select radius
                  </option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
            >
              Search Hospitals
            </button>

          </form>

          {searched && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-600">
              Hospital search submitted. Nearby hospitals will appear here.
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default FindHospital;