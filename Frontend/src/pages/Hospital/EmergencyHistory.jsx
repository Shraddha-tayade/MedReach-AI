import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function EmergencyHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmergencyHistory();
  }, []);

  const fetchEmergencyHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("medreachToken");

      const response = await fetch(
        `${API_BASE}/api/hospital/emergency-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Emergency History:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch emergency history"
        );
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error("Emergency history error:", err);

      setError(
        err.message || "Failed to load emergency history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "ARRIVED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACTIVE":
        return "bg-orange-100 text-orange-700";

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
            Emergency Services
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            Emergency History
          </h2>

          <p className="text-gray-600 mt-2">
            View previous emergency resource requests and their response status.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">

            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>

            <p className="text-gray-600 mt-4">
              Loading emergency history...
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
              onClick={fetchEmergencyHistory}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty */}
        {!loading && !error && history.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">

            <div className="text-5xl mb-4">
              🚑
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No Emergency History
            </h3>

            <p className="text-gray-600 mt-2">
              Your hospital has not submitted any emergency requests yet.
            </p>

            <button
              onClick={() => navigate("/Hospital/emergency-requests")}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              View Emergency Requests
            </button>

          </div>
        )}

        {/* History */}
        {!loading && !error && history.length > 0 && (
          <div className="space-y-5">

            {history.map((item) => {

              const requestId = item.request_id;
              const resourceType = item.resource_type || "Resource";
              const status = item.response_status || "UNKNOWN";

              return (
                <div
                  key={item.response_id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-6"
                >

                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Emergency Request
                      </p>

                      <h3 className="text-xl font-bold text-gray-900">
                        #{requestId}
                      </h3>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                        {resourceType}
                      </span>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </div>

                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">

                    <div>
                      <p className="text-sm text-gray-500">
                        Resource
                      </p>

                      <p className="font-bold text-red-600 text-lg">
                        {resourceType}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Quantity
                      </p>

                      <p className="font-semibold text-gray-900">
                        {item.quantity || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Request Status
                      </p>

                      <p
                        className={`font-semibold ${
                          item.request_status === "ACTIVE"
                            ? "text-orange-600"
                            : "text-gray-900"
                        }`}
                      >
                        {item.request_status || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Request Date
                      </p>

                      <p className="font-semibold text-gray-900">
                        {formatDate(item.request_created_at)}
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-6 pt-5 border-t border-gray-100">

                    <p className="text-sm text-gray-500 mb-1">
                      Emergency Location
                    </p>

                    <p className="font-semibold text-gray-900">
                      {item.address_line ||
                        "Address not available"}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {[
                        item.city,
                        item.state,
                        item.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        "Location not available"}
                    </p>

                  </div>

                  {/* User Information */}
                  <div className="mt-5 pt-5 border-t border-gray-100">

                    <p className="text-sm text-gray-500 mb-2">
                      Requester Information
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.user_name || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600">
                          User
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.user_phone || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600">
                          Contact Number
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Response */}
                  <div className="mt-5 bg-gray-50 rounded-lg p-4">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <div>

                        <p className="text-sm text-gray-500">
                          Response
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                          {item.response_message ||
                            "No response message"}
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusStyle(
                          item.response_status
                        )}`}
                      >
                        {item.response_status || "UNKNOWN"}
                      </span>

                    </div>

                  </div>

                  {/* Timeline */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                      <p className="text-xs text-gray-500">
                        Responded
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {formatDate(item.responded_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Arrived
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {formatDate(item.arrived_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Completed
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {formatDate(item.completed_at)}
                      </p>
                    </div>

                  </div>

                  {/* Bottom */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Response Updated
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(item.response_updated_at)}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/Hospital/emergency-requests"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      View Emergency Requests
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