import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultRequests = [
  {
    id: "ER-1025",
    emergency: "Road Accident",
    pickup: "Badnera Road, Amravati",
    destination: "District Hospital, Amravati",
    distance: "5.2 km",
    requestedAt: "2 mins ago",
    status: "Pending",
  },
  {
    id: "ER-1024",
    emergency: "Medical Emergency",
    pickup: "Rajapeth, Amravati",
    destination: "City Hospital, Amravati",
    distance: "3.8 km",
    requestedAt: "8 mins ago",
    status: "Pending",
  },
  {
    id: "ER-1023",
    emergency: "Patient Transfer",
    pickup: "Camp Area, Amravati",
    destination: "Government Medical College",
    distance: "7.1 km",
    requestedAt: "20 mins ago",
    status: "Completed",
  },
  {
    id: "ER-1022",
    emergency: "Breathing Difficulty",
    pickup: "Shegaon Naka, Amravati",
    destination: "Orange City Hospital",
    distance: "4.6 km",
    requestedAt: "25 mins ago",
    status: "Pending",
  },
  {
    id: "ER-1021",
    emergency: "Urgent Patient Transfer",
    pickup: "Morshi Road, Amravati",
    destination: "District Hospital, Amravati",
    distance: "6.4 km",
    requestedAt: "35 mins ago",
    status: "Rejected",
  },
];

function EmergencyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem(
      "medreachEmergencyRequests"
    );

    return savedRequests
      ? JSON.parse(savedRequests)
      : defaultRequests;
  });

  const [currentTrip, setCurrentTrip] = useState(() => {
    const savedTrip = localStorage.getItem("medreachCurrentTrip");

    return savedTrip ? JSON.parse(savedTrip) : null;
  });

  // Save requests whenever they change
  useEffect(() => {
    localStorage.setItem(
      "medreachEmergencyRequests",
      JSON.stringify(requests)
    );
  }, [requests]);

  // Save current trip whenever it changes
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

  // Accept an emergency request
  const handleAccept = (request) => {
    if (currentTrip) {
      alert(
        "You already have an active emergency trip. Complete it before accepting another request."
      );
      return;
    }

    const newTrip = {
      ...request,
      status: "Accepted",
      progress: 0,
    };

    setCurrentTrip(newTrip);

    setRequests((previousRequests) =>
      previousRequests.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "Accepted",
            }
          : item
      )
    );
  };

  // Reject an emergency request
  const handleReject = (requestId) => {
    setRequests((previousRequests) =>
      previousRequests.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: "Rejected",
            }
          : item
      )
    );
  };

  // Update the current trip status
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

    // Complete the trip
    if (status === "Completed") {
      setRequests((previousRequests) =>
        previousRequests.map((item) =>
          item.id === currentTrip.id
            ? {
                ...item,
                status: "Completed",
              }
            : item
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
      previousRequests.map((item) =>
        item.id === currentTrip.id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Reached Pickup":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "On the Way":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "Reached Destination":
        return "bg-green-50 text-green-700 border-green-200";

      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MedReach</h1>
            <p className="text-sm text-red-100">Ambulance</p>
          </div>

          <button
            onClick={() => navigate("/Ambulance/dashboard")}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Emergency Requests
          </h2>

          <p className="text-gray-500 mt-1">
            View and manage incoming emergency requests.
          </p>
        </div>

        {/* Current Trip */}
        {currentTrip && (
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    Current Emergency
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                      currentTrip.status
                    )}`}
                  >
                    {currentTrip.status}
                  </span>
                </div>

                <p className="text-gray-500 mt-1">
                  Request ID: {currentTrip.id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Distance</p>
                <p className="text-lg font-bold text-gray-800">
                  {currentTrip.distance}
                </p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="font-semibold text-gray-800 mt-1">
                  {currentTrip.pickup}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-semibold text-gray-800 mt-1">
                  {currentTrip.destination}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
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
                ></div>
              </div>
            </div>

            {/* Status Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateTripStatus("Reached Pickup")}
                className="px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition"
              >
                Reached Pickup
              </button>

              <button
                onClick={() => updateTripStatus("On the Way")}
                className="px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition"
              >
                On the Way
              </button>

              <button
                onClick={() =>
                  updateTripStatus("Reached Destination")
                }
                className="px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 font-medium hover:bg-green-100 transition"
              >
                Reached Destination
              </button>

              <button
                onClick={() => updateTripStatus("Completed")}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                Complete Trip
              </button>
            </div>
          </div>
        )}

        {/* No Current Trip */}
        {!currentTrip && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 text-center">
            <div className="text-4xl mb-3">🚑</div>

            <h3 className="text-xl font-bold text-gray-800">
              No Active Emergency
            </h3>

            <p className="text-gray-500 mt-1">
              Your ambulance is currently available for new requests.
            </p>
          </div>
        )}

        {/* All Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">
              All Emergency Requests
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage incoming emergency requests.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Request Information */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-800">
                        {request.emergency}
                      </h4>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                      Request ID: {request.id} • {request.requestedAt}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">
                          Pickup
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {request.pickup}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Destination
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {request.destination}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      Distance:{" "}
                      <span className="font-medium text-gray-700">
                        {request.distance}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {request.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(request)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleReject(request.id)
                          }
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {request.status === "Accepted" &&
                      currentTrip?.id === request.id && (
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                          Active Trip
                        </span>
                      )}

                    {request.status === "Completed" && (
                      <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                        Completed
                      </span>
                    )}

                    {request.status === "Rejected" && (
                      <span className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-sm text-gray-500">
          MedReach • Emergency Medical Transport
        </div>
      </footer>
    </div>
  );
}

export default EmergencyRequests;