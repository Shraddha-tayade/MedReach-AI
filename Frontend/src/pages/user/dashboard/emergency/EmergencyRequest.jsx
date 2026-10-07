import { useState } from "react";
import { Link } from "react-router-dom";

function EmergencyRequest() {
  // ================= RESOURCES =================

  const [resources, setResources] = useState({
    blood: false,
    icu: false,
    oxygen: false,
    ambulance: false,
  });

  // ================= BASIC INFORMATION =================

  const [emergencyType, setEmergencyType] = useState("");
  const [priority, setPriority] = useState("");

  // ================= LOCATION =================

  const [manualLocation, setManualLocation] = useState("");
  const [requestAddress, setRequestAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [locationMode, setLocationMode] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  // ================= RESOURCE DETAILS =================

  const [bloodGroup, setBloodGroup] = useState("A+");
  const [bloodUnits, setBloodUnits] = useState("");

  const [icuBeds, setIcuBeds] = useState("");

  const [oxygenRequirement, setOxygenRequirement] = useState("");

  const [ambulancePickup, setAmbulancePickup] = useState("");
  const [ambulanceDestination, setAmbulanceDestination] =
    useState("");

  // ================= ADDITIONAL INFORMATION =================

  const [additionalInfo, setAdditionalInfo] = useState("");

  // ================= API / SUBMISSION =================

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [requestId, setRequestId] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // ================= RESOURCE TOGGLE =================

  const toggleResource = (resource) => {
    setResources((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  // =========================================================
  // LOCATION
  // =========================================================

  /*
    Current location flow:

    Browser GPS
       ↓
    latitude + longitude
       ↓
    Reverse geocoding using OpenStreetMap Nominatim
       ↓
    address + city + state + pincode
       ↓
    Backend emergency request
  */

  const useCurrentLocation = () => {
    setLocationError("");
    setSubmitError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Location detection is not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);
    setLocationMode("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setCoordinates({
          latitude,
          longitude,
        });

        try {
          /*
            Reverse geocoding:
            Converts latitude/longitude into a readable address.
          */

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Unable to identify your address.");
          }

          const data = await response.json();

          const address = data.address || {};

          const readableAddress =
            data.display_name ||
            "Current Location";

          const detectedCity =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "";

          const detectedState =
            address.state || "";

          const detectedPincode =
            address.postcode || "";

          /*
            Backend requires:
            requestAddress
            city
            state
            pincode
            latitude
            longitude
          */

          setRequestAddress(readableAddress);
          setManualLocation(readableAddress);
          setCity(detectedCity);
          setState(detectedState);
          setPincode(detectedPincode);

          setLocationMode("current");
          setLocationLoading(false);

          /*
            If some required address information could not
            be detected, show a useful message instead of
            silently sending bad data to backend.
          */

          if (
            !detectedCity ||
            !detectedState ||
            !detectedPincode
          ) {
            setLocationError(
              "Your location was detected, but some address details could not be identified. Please enter the missing details manually."
            );
          }
        } catch (error) {
          setLocationLoading(false);

          /*
            We still keep the GPS coordinates because they
            were successfully detected.
          */

          setLocationMode("current");

          setLocationError(
            "Your GPS location was detected, but the address could not be identified. Please enter the address, city, state and pincode manually."
          );
        }
      },

      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Unable to detect your location. Please try again."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location detection timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to detect your location. Please try again."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =========================================================
  // MANUAL LOCATION FALLBACK
  // =========================================================

  const handleManualLocation = (e) => {
    const value = e.target.value;

    setManualLocation(value);
    setRequestAddress(value);

    /*
      IMPORTANT:
      Do NOT clear coordinates here.

      User may first click:
      "Use My Current Location"

      and then edit the address.

      The GPS coordinates should remain available.
    */

    setLocationMode("manual");
    setLocationError("");
    setSubmitError("");
  };

  // =========================================================
  // BUILD ITEMS
  // =========================================================

  const buildItems = () => {
    const items = [];

    // ---------------- BLOOD ----------------

    if (resources.blood) {
      items.push({
        resourceType: "BLOOD",
        bloodGroup: bloodGroup,
        bloodComponent: "WHOLE_BLOOD",
        quantity: Number(bloodUnits),
      });
    }

    // ---------------- ICU ----------------

    if (resources.icu) {
      items.push({
        resourceType: "ICU",
        quantity: Number(icuBeds),
      });
    }

    // ---------------- OXYGEN ----------------

    if (resources.oxygen) {
      items.push({
        resourceType: "OXYGEN",
        quantity: 1,
      });
    }

    // ---------------- AMBULANCE ----------------

    if (resources.ambulance) {
      items.push({
        resourceType: "AMBULANCE",
        quantity: 1,
      });
    }

    return items;
  };

  // =========================================================
  // BUILD DESCRIPTION
  // =========================================================

  const buildDescription = () => {
    const details = [];

    if (emergencyType) {
      details.push(`Emergency Type: ${emergencyType}`);
    }

    if (priority) {
      details.push(`Priority: ${priority}`);
    }

    // Blood
    if (resources.blood) {
      details.push(
        `Blood Required: ${bloodGroup}, ${bloodUnits} unit(s)`
      );
    }

    // ICU
    if (resources.icu) {
      details.push(
        `ICU Beds Required: ${icuBeds}`
      );
    }

    // Oxygen
    if (resources.oxygen) {
      details.push(
        `Oxygen Requirement: ${oxygenRequirement || "Not specified"}`
      );
    }

    // Ambulance
    if (resources.ambulance) {
      details.push(
        `Ambulance Pickup: ${
          ambulancePickup || "Not specified"
        }`
      );

      details.push(
        `Ambulance Destination: ${
          ambulanceDestination || "Not specified"
        }`
      );
    }

    if (additionalInfo.trim()) {
      details.push(
        `Additional Information: ${additionalInfo.trim()}`
      );
    }

    return details.join(" | ");
  };

  // =========================================================
  // SUBMIT EMERGENCY REQUEST
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setLoading(true);

    try {
      // ---------------- TOKEN ----------------

      const token = sessionStorage.getItem("medreachToken");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      // ---------------- RESOURCE VALIDATION ----------------

      const selectedResourceCount =
        Object.values(resources).filter(Boolean).length;

      if (selectedResourceCount === 0) {
        throw new Error(
          "Please select at least one medical resource."
        );
      }

      // ---------------- LOCATION VALIDATION ----------------

      if (
        coordinates.latitude === null ||
        coordinates.longitude === null
      ) {
        throw new Error(
          "Please use your current location before sending the emergency request."
        );
      }

      if (!requestAddress.trim()) {
        throw new Error(
          "Emergency address could not be identified. Please use your current location again or enter the address manually."
        );
      }

      if (!city.trim()) {
        throw new Error(
          "City could not be identified. Please enter the city."
        );
      }

      if (!state.trim()) {
        throw new Error(
          "State could not be identified. Please enter the state."
        );
      }

      if (!pincode.trim()) {
        throw new Error(
          "Pincode could not be identified. Please enter the pincode."
        );
      }

      // ---------------- BLOOD VALIDATION ----------------

      if (resources.blood) {
        if (!bloodGroup) {
          throw new Error(
            "Please select a blood group."
          );
        }

        if (
          !bloodUnits ||
          Number(bloodUnits) < 1
        ) {
          throw new Error(
            "Please enter the number of blood units required."
          );
        }
      }

      // ---------------- ICU VALIDATION ----------------

      if (resources.icu) {
        if (
          !icuBeds ||
          Number(icuBeds) < 1
        ) {
          throw new Error(
            "Please enter the number of ICU beds required."
          );
        }
      }

      // ---------------- OXYGEN VALIDATION ----------------

      if (resources.oxygen) {
        if (!oxygenRequirement.trim()) {
          throw new Error(
            "Please enter the oxygen requirement."
          );
        }
      }

      // ---------------- AMBULANCE VALIDATION ----------------

      if (resources.ambulance) {
        if (!ambulancePickup.trim()) {
          throw new Error(
            "Please enter the ambulance pickup location."
          );
        }

        if (!ambulanceDestination.trim()) {
          throw new Error(
            "Please enter the ambulance destination."
          );
        }
      }

      // ---------------- BUILD ITEMS ----------------

      const items = buildItems();

      if (items.length === 0) {
        throw new Error(
          "No emergency resources were selected."
        );
      }

      // ---------------- DESCRIPTION ----------------

      const description = buildDescription();

      // ---------------- BACKEND PAYLOAD ----------------

      const payload = {
        requestAddress: requestAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),

        latitude: coordinates.latitude,
        longitude: coordinates.longitude,

        description: description,

        items: items,
      };

      console.log(
        "MedReach Emergency Request Payload:",
        payload
      );

      // ---------------- API CALL ----------------

      const response = await fetch(
        "http://localhost:5000/api/emergency-requests",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "MedReach Emergency Request Response:",
        data
      );

      // ---------------- API ERROR ----------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to create emergency request."
        );
      }

      // ---------------- REQUEST ID ----------------

      const createdRequestId =
        data?.request?.id ||
        data?.requestId ||
        data?.id;

      if (!createdRequestId) {
        throw new Error(
          "Emergency request was sent, but the backend did not return a request ID."
        );
      }

      // ---------------- RESPONSE ITEMS ----------------

      const createdItems =
        data?.request?.items ||
        data?.items ||
        items;

      // ---------------- SAVE REQUEST ----------------

      sessionStorage.setItem(
        "medreachLastEmergencyRequest",
        JSON.stringify({
          requestId: createdRequestId,
          items: createdItems,
        })
      );

      // ---------------- SHOW SUCCESS ----------------

      setRequestId(createdRequestId);
      setSubmitted(true);
    } catch (error) {
      console.error(
        "Emergency request error:",
        error
      );

      setSubmitError(
        error.message ||
          "Unable to create emergency request."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Emergency Request Created
          </h1>

          <p className="text-slate-600 mt-3">
            MedReach is now processing your emergency
            resource request.
          </p>

          {/* REQUEST ID */}

          <div className="bg-slate-50 rounded-xl p-5 mt-8">
            <p className="text-sm text-slate-500">
              Request ID
            </p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              #{requestId}
            </p>
          </div>

          {/* STATUS */}

          <div className="text-left mt-8 space-y-4">

            <div className="flex items-center gap-4">

              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                ✓
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Request Created
                </p>

                <p className="text-sm text-slate-500">
                  Your emergency request has been
                  received.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                🔄
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Searching Resources
                </p>

                <p className="text-sm text-slate-500">
                  MedReach can now search for the
                  required resources.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 opacity-50">

              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                3
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Resources Confirmed
                </p>

                <p className="text-sm text-slate-500">
                  Waiting for provider confirmation.
                </p>
              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

            <Link
              to={`/user/request-tracking?requestId=${requestId}`}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-center"
            >
              Track Request
            </Link>

            <Link
              to="/user/dashboard"
              className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition text-center"
            >
              Back to Dashboard
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // REQUEST FORM
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link
            to="/user/dashboard"
            className="flex items-center gap-2"
          >

            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Med<span className="text-red-600">
                Reach
              </span>
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

      {/* ================= MAIN ================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">

          <p className="text-red-600 font-semibold text-sm mb-2">
            EMERGENCY ASSISTANCE
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Create Emergency Request
          </h2>

          <p className="text-slate-600 mt-2">
            Select all medical resources you need.
            MedReach will coordinate them through
            one emergency request.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =================================================
              EMERGENCY INFORMATION
          ================================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Emergency Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              {/* EMERGENCY TYPE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Type
                </label>

                <select
                  value={emergencyType}
                  onChange={(e) =>
                    setEmergencyType(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500"
                >

                  <option value="">
                    Select emergency type
                  </option>

                  <option value="Road Accident">
                    Road Accident
                  </option>

                  <option value="Medical Emergency">
                    Medical Emergency
                  </option>

                  <option value="Critical Patient">
                    Critical Patient
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* PRIORITY */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500"
                >

                  <option value="">
                    Select priority
                  </option>

                  <option value="Normal">
                    Normal
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Location
                </label>

                <div className="border border-slate-300 rounded-xl p-5 bg-white">

                  {/* CURRENT LOCATION PRIMARY OPTION */}

                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locationLoading}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition text-left ${
                      locationMode === "current"
                        ? "border-green-300 bg-green-50"
                        : "border-red-200 bg-red-50 hover:border-red-400"
                    }`}
                  >

                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                        locationMode === "current"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {locationLoading
                        ? "⏳"
                        : locationMode === "current"
                        ? "✓"
                        : "📍"}
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-slate-900">

                        {locationLoading
                          ? "Detecting your location..."
                          : locationMode === "current"
                          ? "Current Location Detected"
                          : "Use My Current Location"}

                      </p>

                      <p className="text-sm text-slate-500 mt-1">

                        {locationLoading
                          ? "Please allow location access in your browser."
                          : locationMode === "current"
                          ? "Your location and address details have been detected."
                          : "Use your phone/laptop location automatically."}

                      </p>

                    </div>

                  </button>

                  {/* LOCATION ERROR */}

                  {locationError && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">

                      <p className="text-sm text-yellow-800">
                        {locationError}
                      </p>

                    </div>
                  )}

                  {/* DETECTED LOCATION DETAILS */}

                  {locationMode === "current" &&
                    coordinates.latitude !== null &&
                    coordinates.longitude !== null && (
                      <div className="mt-5 space-y-4">

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">

                          <p className="text-sm font-semibold text-green-800">
                            ✓ Location detected successfully
                          </p>

                          <p className="text-sm text-green-700 mt-1">
                            {requestAddress}
                          </p>

                        </div>

                        {/* AUTO DETECTED FIELDS */}

                        <div className="grid md:grid-cols-3 gap-4">

                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              City
                            </label>

                            <input
                              type="text"
                              value={city}
                              onChange={(e) =>
                                setCity(e.target.value)
                              }
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              State
                            </label>

                            <input
                              type="text"
                              value={state}
                              onChange={(e) =>
                                setState(e.target.value)
                              }
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Pincode
                            </label>

                            <input
                              type="text"
                              value={pincode}
                              onChange={(e) =>
                                setPincode(e.target.value)
                              }
                              maxLength="6"
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                            />
                          </div>

                        </div>

                      </div>
                    )}

                  {/* MANUAL FALLBACK */}

                  <div className="flex items-center gap-3 my-5">

                    <div className="flex-1 h-px bg-slate-200" />

                    <span className="text-xs font-medium text-slate-400">
                      OR ENTER MANUALLY
                    </span>

                    <div className="flex-1 h-px bg-slate-200" />

                  </div>

                  <input
                    type="text"
                    value={manualLocation}
                    onChange={handleManualLocation}
                    placeholder="Enter emergency address manually if needed..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />

                  {/* MANUAL ADDRESS DETAILS */}

                  {locationMode === "manual" && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          City
                        </label>

                        <input
                          type="text"
                          value={city}
                          onChange={(e) =>
                            setCity(e.target.value)
                          }
                          placeholder="City"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          State
                        </label>

                        <input
                          type="text"
                          value={state}
                          onChange={(e) =>
                            setState(e.target.value)
                          }
                          placeholder="State"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Pincode
                        </label>

                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(e.target.value)
                          }
                          placeholder="Pincode"
                          maxLength="6"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              REQUIRED MEDICAL RESOURCES
          ================================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900">
              Required Medical Resources
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Select one or multiple resources required
              for this emergency.
            </p>

            <div className="space-y-4">

              {/* =================================================
                  BLOOD
              ================================================= */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.blood
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <div className="flex items-start gap-4">

                  <input
                    type="checkbox"
                    checked={resources.blood}
                    onChange={() =>
                      toggleResource("blood")
                    }
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🩸
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Blood
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Request compatible blood from nearby
                      verified donors or blood banks.
                    </p>

                    {resources.blood && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Blood Group
                          </label>

                          <select
                            value={bloodGroup}
                            onChange={(e) =>
                              setBloodGroup(
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white"
                          >

                            <option value="A+">
                              A+
                            </option>

                            <option value="A-">
                              A-
                            </option>

                            <option value="B+">
                              B+
                            </option>

                            <option value="B-">
                              B-
                            </option>

                            <option value="AB+">
                              AB+
                            </option>

                            <option value="AB-">
                              AB-
                            </option>

                            <option value="O+">
                              O+
                            </option>

                            <option value="O-">
                              O-
                            </option>

                          </select>

                        </div>

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Units Required
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={bloodUnits}
                            onChange={(e) =>
                              setBloodUnits(
                                e.target.value
                              )
                            }
                            placeholder="Number of units"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  ICU
              ================================================= */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.icu
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <div className="flex items-start gap-4">

                  <input
                    type="checkbox"
                    checked={resources.icu}
                    onChange={() =>
                      toggleResource("icu")
                    }
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🏥
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        ICU Bed
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Find hospitals with available ICU beds.
                    </p>

                    {resources.icu && (
                      <div className="mt-5">

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          ICU Beds Required
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={icuBeds}
                          onChange={(e) =>
                            setIcuBeds(e.target.value)
                          }
                          placeholder="Number of beds"
                          className="w-full sm:w-1/2 px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  OXYGEN
              ================================================= */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.oxygen
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <div className="flex items-start gap-4">

                  <input
                    type="checkbox"
                    checked={resources.oxygen}
                    onChange={() =>
                      toggleResource("oxygen")
                    }
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🫁
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Oxygen
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Request oxygen support from available
                      medical facilities.
                    </p>

                    {resources.oxygen && (
                      <div className="mt-5">

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Oxygen Requirement
                        </label>

                        <input
                          type="text"
                          value={oxygenRequirement}
                          onChange={(e) =>
                            setOxygenRequirement(
                              e.target.value
                            )
                          }
                          placeholder="Example: Oxygen support required"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  AMBULANCE
              ================================================= */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.ambulance
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <div className="flex items-start gap-4">

                  <input
                    type="checkbox"
                    checked={resources.ambulance}
                    onChange={() =>
                      toggleResource("ambulance")
                    }
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🚑
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Ambulance
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Request an available ambulance for
                      emergency transportation.
                    </p>

                    {resources.ambulance && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pickup Location
                          </label>

                          <input
                            type="text"
                            value={ambulancePickup}
                            onChange={(e) =>
                              setAmbulancePickup(
                                e.target.value
                              )
                            }
                            placeholder="Pickup location"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Destination
                          </label>

                          <input
                            type="text"
                            value={ambulanceDestination}
                            onChange={(e) =>
                              setAmbulanceDestination(
                                e.target.value
                              )
                            }
                            placeholder="Hospital / destination"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              ADDITIONAL INFORMATION
          ================================================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900 mb-5">
              Additional Information
            </h3>

            <textarea
              rows="5"
              value={additionalInfo}
              onChange={(e) =>
                setAdditionalInfo(e.target.value)
              }
              placeholder="Describe the emergency or provide any additional information..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 resize-none"
            />

          </section>

          {/* =================================================
              API ERROR
          ================================================= */}

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">

              <p className="font-semibold text-red-800">
                Unable to create request
              </p>

              <p className="text-sm text-red-700 mt-1">
                {submitError}
              </p>

            </div>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-sm text-slate-500">
              Your request will be shared with relevant
              verified medical resources.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:bg-red-300 disabled:cursor-not-allowed"
            >

              {loading
                ? "Creating Emergency Request..."
                : "🚨 Send Emergency Request"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EmergencyRequest;