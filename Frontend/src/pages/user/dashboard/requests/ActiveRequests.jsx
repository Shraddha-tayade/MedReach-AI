import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

function ActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActiveRequests = useCallback(async () => {
    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      setError("Please login again to view your active requests.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/emergency-requests/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data;

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
            "Unable to load active requests."
        );
      }

const allRequests =
  Array.isArray(data?.requests)
    ? data.requests
    : Array.isArray(data?.data?.requests)
    ? data.data.requests
    : Array.isArray(data?.history)
    ? data.history
    : Array.isArray(data?.data)
    ? data.data
    : [];

// Show every request that is not completed or cancelled
const activeRequests = allRequests.filter((request) => {
  const statusValue =
    typeof request?.status === "string"
      ? request.status
      : request?.status?.status ||
        request?.status?.name ||
        request?.status?.value ||
        "";

  const status = String(statusValue).toUpperCase();

  return (
    status !== "COMPLETED" &&
    status !== "CANCELLED"
  );
});

setRequests(activeRequests);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load active requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveRequests();
  }, [fetchActiveRequests]);

  const getStatusStyle = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toUpperCase();

    if (
      normalizedStatus === "ACTIVE" ||
      normalizedStatus === "SEARCHING"
    ) {
      return "bg-blue-50 text-blue-600";
    }

    if (
      normalizedStatus === "PENDING"
    ) {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const getPriorityStyle = (priority) => {
    const normalizedPriority = String(
      priority || ""
    ).toUpperCase();

    if (normalizedPriority === "HIGH") {
      return "bg-red-50 text-red-600";
    }

    if (normalizedPriority === "MEDIUM") {
      return "bg-orange-50 text-orange-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const formatDate = (value) => {
    if (!value) {
      return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRequestType = (request) => {
    if (request?.type) {
      return request.type;
    }

    if (request?.requestType) {
      return request.requestType;
    }

    return "Emergency Medical Request";
  };

  const getResources = (request) => {
    if (Array.isArray(request?.items)) {
      if (request.items.length === 0) {
        return ["Medical resources requested"];
      }

      return request.items.map((item) => {
        const resourceType =
          item?.resourceType ||
          item?.resource_type ||
          "Medical Resource";

        const quantity =
          item?.quantity ??
          item?.units ??
          item?.unitsRequired;

        if (quantity !== undefined && quantity !== null) {
          return `${resourceType}: ${quantity}`;
        }

        return resourceType;
      });
    }

    if (typeof request?.resources === "string") {
      return [request.resources];
    }

    return ["Resource details unavailable"];
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

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
            className="text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            MY REQUESTS
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Active Emergency Requests
          </h2>

          <p className="text-slate-600 mt-2">
            Track the status of your current medical resource requests.
          </p>

        </div>


        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-5">

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchActiveRequests}
              className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Try Again →
            </button>

          </div>
        )}


        {/* ================= REQUEST COUNT ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Current Requests
            </h3>

            <span className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${requests.length} active requests`}
            </span>

          </div>


          {/* ================= LOADING ================= */}
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

              <p className="text-slate-600">
                Loading your active requests...
              </p>

            </div>
          )}


          {/* ================= EMPTY ================= */}
          {!loading &&
            !error &&
            requests.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                <div className="text-4xl mb-4">
                  📋
                </div>

                <h4 className="text-lg font-bold text-slate-900">
                  No Active Requests
                </h4>

                <p className="text-sm text-slate-500 mt-2">
                  You currently don't have any active medical resource
                  requests.
                </p>

                <Link
                  to="/user/emergency"
                  className="inline-flex mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  + Create Emergency Request
                </Link>

              </div>
            )}


          {/* ================= REQUESTS ================= */}
          {!loading && requests.length > 0 && (
            <div className="space-y-5">

              {requests.map((request, index) => {

                const requestId =
                  request?.id ??
                  request?.requestId ??
                  `Request-${index + 1}`;

                const status =
                  request?.status || "UNKNOWN";

                const priority =
                  request?.priority || "Normal";

                const resources =
                  getResources(request);

                return (
                  <div
                    key={requestId}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
                  >

                    {/* ================= TOP ================= */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h4 className="text-lg font-bold text-slate-900">
                            Request #{requestId}
                          </h4>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {getRequestType(request)} •{" "}
                          {formatDate(
                            request?.created_at ??
                              request?.createdAt ??
                              request?.created
                          )}
                        </p>

                      </div>


                      {/* Priority */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getPriorityStyle(
                          priority
                        )}`}
                      >
                        {priority} Priority
                      </span>

                    </div>


                    {/* ================= RESOURCES ================= */}
                    <div className="mt-6">

                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Requested Resources
                      </p>

                      <div className="flex flex-wrap gap-3">

                        {resources.map(
                          (resource, resourceIndex) => (

                            <span
                              key={resourceIndex}
                              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                            >
                              {resource}
                            </span>

                          )
                        )}

                      </div>

                    </div>


                    {/* ================= BOTTOM ================= */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <p className="text-sm text-slate-500">
                        Request is being processed by available medical
                        providers.
                      </p>

                      <Link
                        to={`/user/request-tracking?requestId=${requestId}`}
                        className="text-red-600 font-semibold text-sm hover:text-red-700 transition whitespace-nowrap"
                      >
                        View Tracking →
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>


        {/* ================= ACTIONS ================= */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <Link
            to="/user/request-history"
            className="inline-flex items-center justify-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
          >
            View Request History
          </Link>

          <Link
            to="/user/emergency"
            className="inline-flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            + Create Emergency Request
          </Link>

        </div>

      </main>

    </div>
  );
}

export default ActiveRequests;