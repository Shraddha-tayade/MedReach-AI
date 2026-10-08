import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultAmbulance = {
  vehicleNumber: "MH-27-AB-1023",
  registrationType: "Public",
  ambulanceType: "Basic Life Support",
  model: "Force Traveller",
  location: "Amravati",
  verification: "Verified",
};

const defaultRequests = [
  {
    id: "ER-1025",
    emergency: "Road Accident",
    pickup: "Camp Area, Amravati",
    destination: "District Hospital",
    distance: "6.1 km",
    time: "10:30 AM",
    status: "Pending",
  },
  {
    id: "ER-1024",
    emergency: "Medical Emergency",
    pickup: "Rajapeth, Amravati",
    destination: "City Hospital",
    distance: "4.2 km",
    time: "10:15 AM",
    status: "Pending",
  },
  {
    id: "ER-1023",
    emergency: "Patient Transfer",
    pickup: "Badnera Road",
    destination: "District Hospital",
    distance: "7.8 km",
    time: "09:45 AM",
    status: "Completed",
  },
];

const defaultTrip = {
  id: "ER-1020",
  emergency: "Accident",
  pickup: "Rajapeth, Amravati",
  destination: "District Hospital, Amravati",
  distance: "6.1 km",
  status: "On the Way",
  progress: 55,
};

function AmbulanceDashboard() {
  const navigate = useNavigate();

  const [ambulance, setAmbulance] = useState(() => {
    const saved = localStorage.getItem("medreachAmbulance");
    return saved ? JSON.parse(saved) : defaultAmbulance;
  });

  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = localStorage.getItem("medreachCurrentTrip");
    return saved ? JSON.parse(saved) : defaultTrip;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("medreachEmergencyRequests");
    return saved ? JSON.parse(saved) : defaultRequests;
  });

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "medreachAmbulance",
      JSON.stringify(ambulance)
    );
  }, [ambulance]);

  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem(
        "medreachCurrentTrip",
        JSON.stringify(currentTrip)
      );
    } else {
      localStorage.removeItem("medreachCurrentTrip");
    }
  }, [currentTrip]);

  useEffect(() => {
    localStorage.setItem(
      "medreachEmergencyRequests",
      JSON.stringify(requests)
    );
  }, [requests]);

  /*
    Central ambulance status logic.

    If there is an active trip:
    ambulance = On Trip

    If there is no active trip:
    ambulance = Available
  */
  const ambulanceStatus = currentTrip ? "On Trip" : "Available";

  /*
    Update current emergency status.
    The same currentTrip is stored in localStorage,
    so EmergencyRequests.jsx can read the same status.
  */
  const updateTripStatus = (status) => {
    if (!currentTrip) return;

    let progress = currentTrip.progress;

    if (status === "Accepted") {
      progress = 0;
    }

    if (status === "Reached Pickup") {
      progress = 25;
    }

    if (status === "On the Way") {
      progress = 55;
    }

    if (status === "Reached Destination") {
      progress = 100;
    }

    if (status === "Completed") {
      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request.id === currentTrip.id
            ? { ...request, status: "Completed" }
            : request
        )
      );

      setCurrentTrip(null);
      return;
    }

    const updatedTrip = {
      ...currentTrip,
      status,
      progress,
    };

    setCurrentTrip(updatedTrip);

    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === currentTrip.id
          ? { ...request, status }
          : request
      )
    );
  };

  /*
    Centralized ambulance counts.

    These are temporary static values for frontend demonstration.
    Later they will come from the backend/database.
  */
  const connectedAmbulances = 12;
  const publicAmbulances = 8;
  const privateAmbulances = 4;

  const availableAmbulances =
    ambulanceStatus === "Available"
      ? connectedAmbulances
      : connectedAmbulances - 1;

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* HEADER */}
      <header className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              MedReach
            </h1>

            <p className="text-red-100 text-sm">
              Ambulance
            </p>
          </div>

          {/* PROFILE */}
          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 bg-red-700 px-4 py-2 rounded-lg"
            >
              <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center font-bold">
                A
              </div>

              <div className="text-left hidden sm:block">
                <p className="font-semibold">
                  Ambulance
                </p>

                <p className="text-xs text-red-100">
                  {ambulance.vehicleNumber}
                </p>
              </div>

              <span>⌄</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 text-gray-700">

                <button
                  onClick={() =>
                    navigate("/Ambulance/my-ambulance")
                  }
                  className="w-full text-left px-4 py-3 hover:bg-red-50"
                >
                  My Ambulance
                </button>

                <button
                  onClick={() =>
                    navigate("/Ambulance/profile")
                  }
                  className="w-full text-left px-4 py-3 hover:bg-red-50"
                >
                  Profile Settings
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full text-left px-4 py-3 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Ambulance Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Manage connected ambulances and monitor emergency services.
          </p>
        </div>

        {/* CONNECTED AMBULANCE */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-red-600 font-semibold mb-1">
                CONNECTED AMBULANCE
              </p>

              <h3 className="text-2xl font-bold text-gray-900">
                {ambulance.vehicleNumber}
              </h3>

              <p className="text-gray-600 mt-1">
                {ambulance.ambulanceType} • {ambulance.location}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-red-700 border border-red-100">
                {ambulance.registrationType}
              </span>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  ambulanceStatus === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {ambulanceStatus}
              </span>

            </div>

          </div>

        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Connected */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Connected Ambulances
                </p>

                <p className="text-3xl font-bold mt-2 text-gray-900">
                  {connectedAmbulances}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-blue-600 text-xl">
                🚑
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Ambulances connected to MedReach
            </p>

          </div>

          {/* Public */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-green-600 font-medium">
                  Public Ambulances
                </p>

                <p className="text-3xl font-bold mt-2 text-gray-900">
                  {publicAmbulances}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-green-600 text-xl">
                🏥
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Public emergency services
            </p>

          </div>

          {/* Private */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-orange-600 font-medium">
                  Private Ambulances
                </p>

                <p className="text-3xl font-bold mt-2 text-gray-900">
                  {privateAmbulances}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-orange-600 text-xl">
                🚑
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Private emergency services
            </p>

          </div>

          {/* Available */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Available Now
                </p>

                <p className="text-3xl font-bold mt-2 text-gray-900">
                  {availableAmbulances}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center text-purple-600 text-xl">
                ✓
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Ready for emergency requests
            </p>

          </div>

        </div>

        {/* CURRENT EMERGENCY */}
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 mb-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <div>
              <p className="text-sm font-semibold text-red-600">
                CURRENT EMERGENCY
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-1">
                {currentTrip
                  ? currentTrip.emergency
                  : "No Active Emergency"}
              </h3>
            </div>

            {currentTrip && (
              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                {currentTrip.status}
              </span>
            )}

          </div>

          {currentTrip ? (
            <>
              {/* Emergency Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Pickup
                  </p>

                  <p className="font-semibold mt-1">
                    {currentTrip.pickup}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Destination
                  </p>

                  <p className="font-semibold mt-1">
                    {currentTrip.destination}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Distance
                  </p>

                  <p className="font-semibold mt-1">
                    {currentTrip.distance}
                  </p>
                </div>

              </div>

              {/* LIVE TRIP PROGRESS */}
              <div>

                <div className="flex justify-between text-sm mb-2">

                  <span className="font-medium">
                    Trip Progress
                  </span>

                  <span className="font-semibold text-red-600">
                    {currentTrip.progress}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${currentTrip.progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* STATUS BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() =>
                    updateTripStatus("Reached Pickup")
                  }
                  className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Reached Pickup
                </button>

                <button
                  onClick={() =>
                    updateTripStatus("On the Way")
                  }
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  On the Way
                </button>

                <button
                  onClick={() =>
                    updateTripStatus("Reached Destination")
                  }
                  className="px-4 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50"
                >
                  Reached Destination
                </button>

                <button
                  onClick={() =>
                    updateTripStatus("Completed")
                  }
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Complete Trip
                </button>

              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5">

              <p className="font-semibold text-green-700">
                Ambulance is currently available.
              </p>

              <p className="text-sm text-green-600 mt-1">
                There is no active emergency trip.
              </p>

            </div>
          )}

        </div>

        {/* RECENT EMERGENCY REQUESTS */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h3 className="text-xl font-bold">
                Recent Emergency Requests
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Latest emergency requests received through MedReach.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/Ambulance/requests")
              }
              className="text-red-600 font-semibold hover:text-red-700"
            >
              View All →
            </button>

          </div>

          <div className="space-y-4">

            {requests.slice(0, 3).map((request) => (

              <div
                key={request.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-4"
              >

                <div>

                  <p className="font-semibold">
                    {request.emergency}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {request.pickup} → {request.destination}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {request.id} • {request.time}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    request.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : request.status === "Rejected"
                      ? "bg-gray-100 text-gray-600"
                      : request.status === "On the Way" ||
                        request.status === "Accepted"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {request.status}
                </span>

              </div>

            ))}

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 mt-10 py-6 text-center text-sm text-gray-500">
        MedReach • Emergency Medical Transport
      </footer>

    </div>
  );
}

export default AmbulanceDashboard;