import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

function FindICU() {
  const [bedsRequired, setBedsRequired] = useState("");
  const [radius, setRadius] = useState("");

  const [location, setLocation] = useState("");
  const [locationMode, setLocationMode] = useState("manual");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [results, setResults] = useState([]);

  const [sendingProviderId, setSendingProviderId] = useState(null);
  const [sentProviderIds, setSentProviderIds] = useState([]);
  const [providerError, setProviderError] = useState("");

  // --------------------------------------------------
  // GET LAST EMERGENCY REQUEST
  // --------------------------------------------------

  const getLastRequest = () => {
    try {
      const stored = sessionStorage.getItem(
        "medreachLastEmergencyRequest"
      );

      if (!stored) return null;

      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  // --------------------------------------------------
  // GET ICU ITEM ID
  // --------------------------------------------------

  const getICUItemId = () => {
    const request = getLastRequest();

    if (!request?.items || !Array.isArray(request.items)) {
      return null;
    }

    const icuItem = request.items.find((item) => {
      const resourceType =
        item?.resourceType ||
        item?.resource_type ||
        item?.type ||
        item?.resource?.resourceType ||
        item?.resource?.resource_type ||
        item?.resource?.type;

      return (
        String(resourceType || "").toUpperCase() === "ICU"
      );
    });

    return (
      icuItem?.id ||
      icuItem?.itemId ||
      icuItem?.item_id ||
      null
    );
  };

  // --------------------------------------------------
  // GET HOSPITAL ID
  // --------------------------------------------------

  const getProviderId = (item) => {
    return (
      item?.hospital_id ||
      item?.hospitalId ||
      item?.provider_id ||
      item?.providerId ||
      item?.hospital?.id ||
      item?.id ||
      null
    );
  };

  // --------------------------------------------------
  // CURRENT LOCATION
  // --------------------------------------------------

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

  // --------------------------------------------------
  // MANUAL LOCATION
  // --------------------------------------------------

  const handleManualLocation = (e) => {
    setLocation(e.target.value);
    setLocationMode("manual");

    setLatitude(null);
    setLongitude(null);

    setLocationError("");
  };

  // --------------------------------------------------
  // GET COORDINATES
  // --------------------------------------------------

  const getCoordinatesFromLocation = async () => {
    if (!location.trim()) {
      throw new Error("Please enter your location.");
    }

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2` +
      `&q=${encodeURIComponent(location)}` +
      `&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Unable to find coordinates for the entered location."
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(
        "Location not found. Please enter a more specific location."
      );
    }

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    };
  };

  // --------------------------------------------------
  // SEARCH ICU
  // --------------------------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();

    setSearched(false);
    setSearchError("");
    setProviderError("");
    setResults([]);

    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      setSearchError(
        "You are not logged in. Please login again."
      );
      return;
    }

    setSearchLoading(true);

    try {
      let searchLatitude = latitude;
      let searchLongitude = longitude;

      if (locationMode === "manual") {
        const coordinates =
          await getCoordinatesFromLocation();

        searchLatitude = coordinates.latitude;
        searchLongitude = coordinates.longitude;

        setLatitude(searchLatitude);
        setLongitude(searchLongitude);
      }

      if (
        searchLatitude === null ||
        searchLongitude === null ||
        Number.isNaN(searchLatitude) ||
        Number.isNaN(searchLongitude)
      ) {
        throw new Error(
          "Please select your current location or enter a valid location."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/resources/icu/search`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            latitude: searchLatitude,
            longitude: searchLongitude,
            radius: Number(radius),
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response. Please check whether the backend API is running."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to search ICU availability."
        );
      }

      const icuResults =
        data?.results ||
        data?.hospitals ||
        data?.data ||
        [];

      setResults(
        Array.isArray(icuResults)
          ? icuResults
          : []
      );

      setSearched(true);
    } catch (error) {
      setSearchError(
        error?.message ||
          "Unable to search ICU availability. Please try again."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // --------------------------------------------------
  // SEND REQUEST TO HOSPITAL
  // --------------------------------------------------

  const sendProviderRequest = async (hospital) => {
    setProviderError("");

    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      setProviderError(
        "You are not logged in. Please login again."
      );
      return;
    }

    const itemId = getICUItemId();

    if (!itemId) {
      setProviderError(
        "No ICU emergency-request item was found. Create an ICU emergency request first."
      );
      return;
    }

    const providerId = getProviderId(hospital);

    if (!providerId) {
      setProviderError(
        "Unable to identify this hospital."
      );
      return;
    }

    setSendingProviderId(providerId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/emergency-requests/items/${itemId}/providers`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            providers: [
              {
                providerType: "HOSPITAL",
                providerId: Number(providerId),
              },
            ],
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to send request to the hospital."
        );
      }

      setSentProviderIds((previous) => {
        const id = String(providerId);

        if (previous.includes(id)) {
          return previous;
        }

        return [...previous, id];
      });
    } catch (error) {
      setProviderError(
        error?.message ||
          "Unable to send provider request."
      );
    } finally {
      setSendingProviderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

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

      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">

          <p className="text-red-600 font-semibold text-sm mb-2">
            ICU AVAILABILITY
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find ICU Beds
          </h2>

          <p className="text-slate-600 mt-2">
            Find hospitals with available ICU beds near you.
          </p>

        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">

          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Search ICU Availability
          </h3>

          <form onSubmit={handleSearch}>

            {/* LOCATION */}

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
                <div className="flex-1 h-px bg-slate-200" />

                <span className="text-xs text-slate-400">
                  or
                </span>

                <div className="flex-1 h-px bg-slate-200" />
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
                    {locationMode === "current"
                      ? "✓"
                      : "📍"}
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
                        ? `${latitude?.toFixed(
                            5
                          )}, ${longitude?.toFixed(5)}`
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

            {/* INPUTS */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ICU Beds Required
                </label>

                <input
                  type="number"
                  min="1"
                  value={bedsRequired}
                  onChange={(e) =>
                    setBedsRequired(e.target.value)
                  }
                  placeholder="Number of beds"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Radius
                </label>

                <select
                  value={radius}
                  onChange={(e) =>
                    setRadius(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >

                  <option value="">
                    Select radius
                  </option>

                  <option value="5">
                    Within 5 km
                  </option>

                  <option value="10">
                    Within 10 km
                  </option>

                  <option value="25">
                    Within 25 km
                  </option>

                  <option value="50">
                    Within 50 km
                  </option>

                </select>

              </div>

            </div>

            <button
              type="submit"
              disabled={searchLoading}
              className="w-full mt-6 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-60"
            >
              {searchLoading
                ? "Searching..."
                : "Search ICU Beds"}
            </button>

          </form>

          {/* ERRORS */}

          {searchError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {searchError}
            </div>
          )}

          {providerError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {providerError}
            </div>
          )}

          {/* RESULTS */}

          {searched && !searchError && (

            <div className="mt-8">

              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Available ICU Facilities
              </h3>

              {results.length === 0 ? (

                <div className="p-5 bg-slate-50 rounded-xl text-sm text-slate-600">
                  No ICU beds found within the selected
                  radius.
                </div>

              ) : (

                <div className="space-y-4">

                  {results.map((item, index) => {

                    const providerId =
                      getProviderId(item);

                    const alreadySent =
                      sentProviderIds.includes(
                        String(providerId)
                      );

                    return (

                      <div
                        key={
                          item.hospital_id ||
                          item.hospitalId ||
                          item.id ||
                          index
                        }
                        className="border border-slate-200 rounded-xl p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h4 className="font-bold text-slate-900">
                              {item.hospital_name ||
                                item.hospitalName ||
                                item.name ||
                                item.hospital?.name ||
                                "Hospital"}
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.address ||
                                item.address_line ||
                                item.hospital?.address ||
                                "Hospital location available"}
                            </p>

                          </div>

                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                            ICU Available
                          </span>

                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">

                          <div>

                            <p className="text-xs text-slate-400">
                              Available Beds
                            </p>

                            <p className="font-semibold text-slate-800">
                              {item.available_beds ??
                                item.availableBeds ??
                                "—"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-slate-400">
                              Distance
                            </p>

                            <p className="font-semibold text-slate-800">

                              {item.distance_km ??
                                item.distanceKm ??
                                "—"}

                              {item.distance_km != null ||
                              item.distanceKm != null
                                ? " km"
                                : ""}

                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          disabled={
                            sendingProviderId ===
                              providerId ||
                            alreadySent
                          }
                          onClick={() =>
                            sendProviderRequest(item)
                          }
                          className={`w-full mt-5 py-3 rounded-xl font-semibold transition ${
                            alreadySent
                              ? "bg-green-100 text-green-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          } disabled:opacity-70`}
                        >

                          {sendingProviderId ===
                          providerId
                            ? "Sending Request..."
                            : alreadySent
                            ? "✓ Request Sent"
                            : "Send Request to Hospital"}

                        </button>

                      </div>

                    );
                  })}

                </div>

              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default FindICU;