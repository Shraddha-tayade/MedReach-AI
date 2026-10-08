import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function BloodRequestDetails() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("medreachToken");

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/hospital/blood-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch request details"
        );
      }

      setRequest(data.request || data);
    } catch (err) {
      setError(
        err.message || "Failed to load request details"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-600">
              MedReach
            </h1>

            <p className="text-sm text-gray-500">
              Hospital Portal
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/Hospital/blood-requests")
            }
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            ← Back to Blood Requests
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Blood Request Details
          </h2>

          <p className="text-gray-500 mt-1">
            Detailed information about your blood request.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-gray-500">
              Loading request details...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            {error}
          </div>
        ) : request ? (
          <>
            {/* Request Overview */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Request ID
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900">
                    #{request.id || request.request_id}
                  </h3>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                    request.status
                  )}`}
                >
                  {request.status || "PENDING"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">
                <div className="bg-red-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Blood Group
                  </p>

                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {request.blood_group || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Blood Component
                  </p>

                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {request.blood_component || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Quantity
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {request.quantity || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                Request Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {request.request_address ||
                      request.address_line ||
                      "Address not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {request.city || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    State
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {request.state || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Pincode
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {request.pincode || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Search Radius
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {request.search_radius_km
                      ? `${request.search_radius_km} km`
                      : "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h3>

              <p className="text-gray-600">
                {request.description ||
                  "No description provided."}
              </p>
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                Request Timeline
              </h3>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-600 mt-1.5" />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Request Created
                    </p>

                    <p className="text-sm text-gray-500">
                      {request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleString()
                        : "Date not available"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      request.status === "ACCEPTED"
                        ? "bg-green-600"
                        : request.status === "REJECTED"
                        ? "bg-red-600"
                        : "bg-gray-300"
                    }`}
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Current Status
                    </p>

                    <p className="text-sm text-gray-500">
                      {request.status || "PENDING"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  navigate("/Hospital/blood-requests")
                }
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
              >
                ← Back to Requests
              </button>

              <button
                onClick={() =>
                  navigate("/Hospital/blood-request-history")
                }
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
              >
                View Request History
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border p-8 text-center">
            Request not found.
          </div>
        )}
      </main>
    </div>
  );
}

export default BloodRequestDetails;