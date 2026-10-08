import { useState } from "react";
import { Link } from "react-router-dom";

function EmergencyRequest() {
  // =========================================================
  // RESOURCES
  // =========================================================

  const [resources, setResources] = useState({
    blood: false,
    icu: false,
    oxygen: false,
    ambulance: false,
  });

  // =========================================================
  // BASIC INFORMATION
  // =========================================================

  const [emergencyType, setEmergencyType] = useState("");
  const [priority, setPriority] = useState("");

  // =========================================================
  // LOCATION
  // =========================================================

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

  // =========================================================
  // RESOURCE DETAILS
  // =========================================================

  const [bloodGroup, setBloodGroup] = useState("A+");
  const [bloodUnits, setBloodUnits] = useState("");

  const [icuBeds, setIcuBeds] = useState("");

  const [oxygenRequirement, setOxygenRequirement] = useState("");

  const [ambulancePickup, setAmbulancePickup] = useState("");
  const [ambulanceDestination, setAmbulanceDestination] =
    useState("");

  // =========================================================
  // ADDITIONAL INFORMATION
  // =========================================================

  const [additionalInfo, setAdditionalInfo] = useState("");

  // =========================================================
  // SUBMISSION
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [requestId, setRequestId] = useState(null);
  const [createdItems, setCreatedItems] = useState([]);
  const [submitError, setSubmitError] = useState("");

  // =========================================================
  // RESOURCE TOGGLE
  // =========================================================

  const toggleResource = (resource) => {
    setResources((prev) => ({
      ...prev,
      [resource]: !prev[resource],
    }));
  };

  // =========================================================
  // LOCATION
  // =========================================================

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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              "Unable to identify your address."
            );
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

          setRequestAddress(readableAddress);
          setManualLocation(readableAddress);
          setCity(detectedCity);
          setState(detectedState);
          setPincode(detectedPincode);

          setLocationMode("current");
          setLocationLoading(false);

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
          console.error(
            "Reverse geocoding error:",
            error
          );

          setLocationLoading(false);
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
  // MANUAL LOCATION
  // =========================================================

  const handleManualLocation = (e) => {
    const value = e.target.value;

    setManualLocation(value);
    setRequestAddress(value);

    // Keep GPS coordinates if already detected.
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
      details.push(
        `Emergency Type: ${emergencyType}`
      );
    }

    if (priority) {
      details.push(`Priority: ${priority}`);
    }

    if (resources.blood) {
      details.push(
        `Blood Required: ${bloodGroup}, ${bloodUnits} unit(s)`
      );
    }

    if (resources.icu) {
      details.push(
        `ICU Beds Required: ${icuBeds}`
      );
    }

    if (resources.oxygen) {
      details.push(
        `Oxygen Requirement: ${
          oxygenRequirement || "Not specified"
        }`
      );
    }

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
  // GET ITEM ID
  // =========================================================

  const getItemId = (item) => {
    return (
      item?.id ||
      item?.itemId ||
      item?.emergencyRequestItemId ||
      item?.emergency_request_item_id ||
      null
    );
  };

  // =========================================================
  // FETCH CREATED REQUEST ITEMS
  // =========================================================
  /*
    The create API should return the created request and
    its emergency_request_item IDs.

    If the create response does not contain complete items,
    we fetch the request once using requestId.

    IMPORTANT:
    requestId != itemId

    requestId  -> emergency_requests.id
    itemId     -> emergency_request_items.id
  */

  const getCreatedRequestItems = async (
    createdRequestId,
    token,
    fallbackItems
  ) => {
    let items = Array.isArray(fallbackItems)
      ? fallbackItems
      : [];

    const hasAllItemIds =
      items.length > 0 &&
      items.every((item) => Boolean(getItemId(item)));

    if (hasAllItemIds) {
      return items;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/emergency-requests/${createdRequestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return items;
      }

      const fetchedItems =
        data?.request?.items ||
        data?.request?.resources ||
        data?.items ||
        data?.resources ||
        [];

      if (Array.isArray(fetchedItems)) {
        return fetchedItems;
      }

      return items;
    } catch (error) {
      console.error(
        "Unable to fetch created request items:",
        error
      );

      return items;
    }
  };

  // =========================================================
  // SUBMIT EMERGENCY REQUEST
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setLoading(true);

    try {
      // =====================================================
      // TOKEN
      // =====================================================

      const token =
        sessionStorage.getItem("medreachToken");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      // =====================================================
      // RESOURCE VALIDATION
      // =====================================================

      const selectedResourceCount =
        Object.values(resources).filter(Boolean).length;

      if (selectedResourceCount === 0) {
        throw new Error(
          "Please select at least one medical resource."
        );
      }

      // =====================================================
      // LOCATION VALIDATION
      // =====================================================

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

      // =====================================================
      // BLOOD VALIDATION
      // =====================================================

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

      // =====================================================
      // ICU VALIDATION
      // =====================================================

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

      // =====================================================
      // OXYGEN VALIDATION
      // =====================================================

      if (resources.oxygen) {
        if (!oxygenRequirement.trim()) {
          throw new Error(
            "Please enter the oxygen requirement."
          );
        }
      }

      // =====================================================
      // AMBULANCE VALIDATION
      // =====================================================

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

      // =====================================================
      // BUILD ITEMS
      // =====================================================

      const items = buildItems();

      if (items.length === 0) {
        throw new Error(
          "No emergency resources were selected."
        );
      }

      // =====================================================
      // DESCRIPTION
      // =====================================================

      const description = buildDescription();

      // =====================================================
      // BACKEND PAYLOAD
      // =====================================================
      /*
        IMPORTANT:
        Your current working backend expects `resources`.

        Do NOT change this back to `items`.
      */

      const payload = {
        requestAddress: requestAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),

        latitude: coordinates.latitude,
        longitude: coordinates.longitude,

        description: description,

        resources: items,
      };

      console.log(
        "MedReach Emergency Request Payload:",
        payload
      );

      // =====================================================
      // CREATE EMERGENCY REQUEST
      // =====================================================

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

      // =====================================================
      // API ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Unable to create emergency request."
        );
      }

      // =====================================================
      // REQUEST ID
      // =====================================================

      const createdRequestId =
        data?.request?.id ||
        data?.requestId ||
        data?.id;

      if (!createdRequestId) {
        throw new Error(
          "Emergency request was sent, but the backend did not return a request ID."
        );
      }

      // =====================================================
      // CREATED ITEMS
      // =====================================================

      const responseItems =
        data?.request?.items ||
        data?.request?.resources ||
        data?.items ||
        data?.resources ||
        [];

      const finalItems =
        await getCreatedRequestItems(
          createdRequestId,
          token,
          responseItems.length > 0
            ? responseItems
            : items
        );

      // =====================================================
      // SAVE REQUEST DATA
      // =====================================================
      /*
        This is important for the next screens.

        Find Blood / Find ICU / Find Oxygen will use
        these item IDs to call:

        POST /emergency-requests/items/:itemId/providers
      */

      const emergencyRequestData = {
        requestId: createdRequestId,

        items: finalItems,

        latitude: coordinates.latitude,
        longitude: coordinates.longitude,

        requestAddress: requestAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),

        emergencyType,
        priority,
      };

      sessionStorage.setItem(
        "medreachLastEmergencyRequest",
        JSON.stringify(emergencyRequestData)
      );

      console.log(
        "Saved emergency request for resource-specific provider flow:",
        emergencyRequestData
      );

      // =====================================================
      // SAVE LOCAL STATE
      // =====================================================

      setRequestId(createdRequestId);
      setCreatedItems(finalItems);
      setSubmitted(true);
    } catch (error) {
      console.error(
        "Emergency request error:",
        error
      );

      setSubmitError(
        error?.message ||
          "Unable to create emergency request."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESOURCE DISPLAY HELPERS
  // =========================================================

  const getResourceLabel = (resourceType) => {
    switch (
      String(resourceType || "").toUpperCase()
    ) {
      case "BLOOD":
        return "Blood";

      case "ICU":
        return "ICU Bed";

      case "OXYGEN":
        return "Oxygen";

      case "AMBULANCE":
        return "Ambulance";

      default:
        return "Medical Resource";
    }
  };

  const getResourceIcon = (resourceType) => {
    switch (
      String(resourceType || "").toUpperCase()
    ) {
      case "BLOOD":
        return "🩸";

      case "ICU":
        return "🏥";

      case "OXYGEN":
        return "🫁";

      case "AMBULANCE":
        return "🚑";

      default:
        return "⚕️";
    }
  };

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 md:p-10">

          {/* SUCCESS ICON */}

          <div className="text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ✓
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Emergency Request Created
            </h1>

            <p className="text-slate-600 mt-3">
              Your emergency request has been created
              successfully.
            </p>

          </div>

          {/* REQUEST ID */}

          <div className="bg-slate-50 rounded-xl p-5 mt-8 text-center">

            <p className="text-sm text-slate-500">
              Emergency Request ID
            </p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              #{requestId}
            </p>

          </div>

          {/* RESOURCE ITEMS */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Required Resources
            </h2>

            <div className="space-y-4">

              {createdItems.length > 0 ? (
                createdItems.map((item, index) => {

                  const resourceType =
                    item?.resourceType ||
                    item?.resource_type ||
                    "";

                  const itemId =
                    getItemId(item);

                  return (
                    <div
                      key={
                        itemId ||
                        `${resourceType}-${index}`
                      }
                      className="border border-slate-200 rounded-xl p-5"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-red-50 rounded-full flex items-center justify-center text-xl">
                            {getResourceIcon(
                              resourceType
                            )}
                          </div>

                          <div>

                            <h3 className="font-bold text-slate-900">
                              {getResourceLabel(
                                resourceType
                              )}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">

                              {resourceType ===
                                "BLOOD" &&
                                `${item?.bloodGroup || bloodGroup} • ${item?.quantity || bloodUnits} unit(s)`}

                              {resourceType ===
                                "ICU" &&
                                `${item?.quantity || icuBeds} bed(s)`}

                              {resourceType ===
                                "OXYGEN" &&
                                "Oxygen support required"}

                              {resourceType ===
                                "AMBULANCE" &&
                                "Emergency transportation"}

                            </p>

                          </div>

                        </div>

                        <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold whitespace-nowrap">
                          PENDING
                        </span>

                      </div>

                      {itemId && (
                        <p className="text-xs text-slate-400 mt-4">
                          Resource Item ID: #{itemId}
                        </p>
                      )}

                    </div>
                  );
                })
              ) : (
                <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">

                  <p className="text-sm text-yellow-800">
                    The emergency request was created,
                    but the resource item details could
                    not be loaded yet.
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* NEXT STEP */}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

            <p className="font-semibold text-blue-900">
              What happens next?
            </p>

            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
              Each required resource will be handled
              separately. Blood, ICU, Oxygen and
              Ambulance resources can be searched and
              sent to suitable providers using their
              individual resource item.
            </p>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

            <Link
              to={`/user/request-tracking?requestId=${requestId}`}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-center"
            >
              View Request Tracking
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

      {/* =====================================================
          HEADER
      ===================================================== */}

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
              Med
              <span className="text-red-600">
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

      {/* =====================================================
          MAIN
      ===================================================== */}

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
            MedReach will create separate resource
            items for your emergency request.
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
                    setEmergencyType(
                      e.target.value
                    )
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
                    setPriority(
                      e.target.value
                    )
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

              {/* LOCATION */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Location
                </label>

                <div className="border border-slate-300 rounded-xl p-5 bg-white">

                  {/* CURRENT LOCATION */}

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

                  {/* DETECTED LOCATION */}

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

                        <div className="grid md:grid-cols-3 gap-4">

                          {/* CITY */}

                          <div>

                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              City
                            </label>

                            <input
                              type="text"
                              value={city}
                              onChange={(e) =>
                                setCity(
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                            />

                          </div>

                          {/* STATE */}

                          <div>

                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              State
                            </label>

                            <input
                              type="text"
                              value={state}
                              onChange={(e) =>
                                setState(
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                            />

                          </div>

                          {/* PINCODE */}

                          <div>

                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Pincode
                            </label>

                            <input
                              type="text"
                              value={pincode}
                              onChange={(e) =>
                                setPincode(
                                  e.target.value
                                )
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
                    onChange={
                      handleManualLocation
                    }
                    placeholder="Enter emergency address manually if needed..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />

                  {/* MANUAL ADDRESS DETAILS */}

                  {locationMode === "manual" && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">

                      {/* CITY */}

                      <div>

                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          City
                        </label>

                        <input
                          type="text"
                          value={city}
                          onChange={(e) =>
                            setCity(
                              e.target.value
                            )
                          }
                          placeholder="City"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>

                      {/* STATE */}

                      <div>

                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          State
                        </label>

                        <input
                          type="text"
                          value={state}
                          onChange={(e) =>
                            setState(
                              e.target.value
                            )
                          }
                          placeholder="State"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>

                      {/* PINCODE */}

                      <div>

                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Pincode
                        </label>

                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) =>
                            setPincode(
                              e.target.value
                            )
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
                      Request compatible blood from
                      nearby verified donors or blood
                      banks.
                    </p>

                    {resources.blood && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        {/* BLOOD GROUP */}

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

                        {/* BLOOD UNITS */}

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
                      Find hospitals with available
                      ICU beds.
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
                            setIcuBeds(
                              e.target.value
                            )
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
                      Request oxygen support from
                      available medical facilities.
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
                      Request an available ambulance
                      for emergency transportation.
                    </p>

                    {resources.ambulance && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        {/* PICKUP */}

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

                        {/* DESTINATION */}

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
                setAdditionalInfo(
                  e.target.value
                )
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
              Your request will create individual
              resource items that can be handled
              separately.
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