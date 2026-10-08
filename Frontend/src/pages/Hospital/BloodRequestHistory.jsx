import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function BloodRequestHistory() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("medreachToken");

      const response = await fetch(
        `${API_BASE}/api/hospital/blood-requests/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Blood Request History:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch blood request history"
        );
      }

      // Backend returns "history", not "requests"
      setRequests(data.history || []);
    } catch (err) {
      console.error("Blood request history error:", err);
      setError(
        err.message || "Failed to load blood request history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/Hospital/dashboard")}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              ← Back
            </button>

            <div className="h-7 w-px bg-gray-300"></div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MedReach
              </h1>

              <p className="text-xs text-gray-500">
                Hospital Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/Hospital/profile")}
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            My Profile
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Title */}
        <div className="mb-8">
          <p className="text-red-600 font-semibold text-sm uppercase tracking-wide">
            Hospital Blood Services
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            Blood Request History
          </h2>

          <p className="text-gray-600 mt-2">
            View all previous blood requests submitted by your hospital.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>

            <p className="text-gray-600 mt-4">
              Loading blood request history...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-semibold">
              {error}
            </p>

            <button
              onClick={fetchHistory}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && requests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">

            <div className="text-5xl mb-4">
              🩸
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No Blood Request History
            </h3>

            <p className="text-gray-600 mt-2">
              Your hospital has not submitted any blood requests yet.
            </p>

            <button
              onClick={() => navigate("/Hospital/blood-requests")}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Create Blood Request
            </button>

          </div>
        )}

        {/* History Cards */}
        {!loading && !error && requests.length > 0 && (
          <div className="space-y-5">

            {requests.map((request) => {

              // Backend uses request_id
              const requestId = request.request_id;

              return (
                <div
                  key={requestId}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6"
                >

                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Request ID
                      </p>

                      <h3 className="text-xl font-bold text-gray-900">
                        #{requestId}
                      </h3>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusStyle(
                        request.request_status
                      )}`}
                    >
                      {request.request_status || "UNKNOWN"}
                    </span>

                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

                    {/* Blood Group */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Blood Group
                      </p>

                      <p className="font-bold text-red-600 text-lg">
                        {request.blood_group || "N/A"}
                      </p>
                    </div>

                    {/* Component */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Component
                      </p>

                      <p className="font-semibold text-gray-900">
                        {request.blood_component || "N/A"}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Quantity
                      </p>

                      <p className="font-semibold text-gray-900">
                        {request.quantity || 0} units
                      </p>
                    </div>

                    {/* Radius */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Search Radius
                      </p>

                      <p className="font-semibold text-gray-900">
                        {request.search_radius_km
                          ? `${request.search_radius_km} km`
                          : "Not available"}
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <p className="text-sm text-gray-500 mb-1">
                      Request Location
                    </p>

                    <p className="font-semibold text-gray-900">
                      {request.request_address ||
                        request.address_line ||
                        "Address not available"}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {[
                        request.city,
                        request.state,
                        request.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location not available"}
                    </p>

                  </div>

                  {/* Description */}
                  <div className="mt-5">

                    <p className="text-sm text-gray-500">
                      Description
                    </p>

                    <p className="text-gray-800 mt-1">
                      {request.description || "No description provided"}
                    </p>

                  </div>

                  {/* Blood Bank Responses */}
                  {request.responses &&
                    request.responses.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-gray-100">

                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Blood Bank Responses
                        </p>

                        <div className="space-y-3">

                          {request.responses.map((response) => (
                            <div
                              key={response.response_id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >

                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {response.blood_bank_name ||
                                      "Blood Bank"}
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    {response.blood_bank_address ||
                                      "Address not available"}
                                  </p>
                                </div>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusStyle(
                                    response.response_status
                                  )}`}
                                >
                                  {response.response_status ||
                                    "UNKNOWN"}
                                </span>

                              </div>

                              {response.response_message && (
                                <p className="text-sm text-gray-700 mt-3">
                                  {response.response_message}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-5 mt-3 text-sm">

                                <div>
                                  <span className="text-gray-500">
                                    Available:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {response.available_quantity ?? 0}
                                  </span>
                                </div>

                                {response.distance_km !== null &&
                                  response.distance_km !== undefined && (
                                    <div>
                                      <span className="text-gray-500">
                                        Distance:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {response.distance_km} km
                                      </span>
                                    </div>
                                  )}

                                {response.reservation_status &&
                                  response.reservation_status !==
                                    "NONE" && (
                                    <div>
                                      <span className="text-gray-500">
                                        Reservation:
                                      </span>{" "}
                                      <span className="font-semibold">
                                        {response.reservation_status}
                                      </span>
                                    </div>
                                  )}

                              </div>

                            </div>
                          ))}

                        </div>

                      </div>
                    )}

                  {/* Bottom */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Created
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(request.request_created_at)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/Hospital/blood-requests/${requestId}`
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      View Details
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center">
          <p className="text-sm text-gray-500">
            MedReach • Smart Emergency Medical Resource Platform
          </p>
        </div>
      </footer>

    </div>
  );
}