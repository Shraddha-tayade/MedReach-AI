import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      setError("Please login again to view your request history.");
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
            "Unable to load request history."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to load request history."
        );
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load request history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const completedCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          String(request?.status || "").toUpperCase() === "COMPLETED"
      ).length,
    [requests]
  );

  const cancelledCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          String(request?.status || "").toUpperCase() === "CANCELLED"
      ).length,
    [requests]
  );

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus === "COMPLETED") {
      return "bg-green-50 text-green-600";
    }

    if (normalizedStatus === "CANCELLED") {
      return "bg-slate-100 text-slate-600";
    }

    if (
      normalizedStatus === "ACTIVE" ||
      normalizedStatus === "SEARCHING"
    ) {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-slate-100 text-slate-600";
  };

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

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
    if (request?.type) return request.type;
    if (request?.requestType) return request.requestType;

    return "Emergency Medical Request";
  };

  const getResources = (request) => {
    if (typeof request?.resources === "string") {
      return request.resources;
    }

    if (Array.isArray(request?.items)) {
      if (request.items.length === 0) {
        return "No resource details available";
      }

      return request.items
        .map((item) => {
          const resourceType =
            item?.resourceType ||
            item?.resource_type ||
            "Medical Resource";

          const quantity =
            item?.quantity ??
            item?.units ??
            item?.unitsRequired;

          return quantity
            ? `${resourceType} — ${quantity}`
            : resourceType;
        })
        .join(", ");
    }

    return "Resource details unavailable";
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
            REQUEST HISTORY
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Previous Requests
          </h2>

          <p className="text-slate-600 mt-2 max-w-2xl">
            View your previously submitted medical resource and emergency
            requests.
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
              onClick={fetchHistory}
              className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Try Again →
            </button>
          </div>
        )}


        {/* ================= SUMMARY ================= */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? "—" : requests.length}
            </p>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "—" : completedCount}
            </p>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="text-3xl font-bold text-slate-600 mt-2">
              {loading ? "—" : cancelledCount}
            </p>
          </div>

        </div>


        {/* ================= REQUEST LIST ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Previous Requests
            </h3>

            <span className="text-sm text-slate-500">
              {loading ? "Loading..." : `${requests.length} requests`}
            </span>

          </div>


          {/* Loading */}
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-600">
                Loading your request history...
              </p>
            </div>
          )}


          {/* Empty */}
          {!loading && !error && requests.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

              <div className="text-4xl mb-4">
                📋
              </div>

              <h4 className="text-lg font-bold text-slate-900">
                No Previous Requests
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Your completed or cancelled emergency requests will appear
                here.
              </p>

              <Link
                to="/user/emergency"
                className="inline-flex mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                + Create Emergency Request
              </Link>

            </div>
          )}


          {/* Requests */}
          {!loading && requests.length > 0 && (
            <div className="space-y-4">

              {requests.map((request, index) => {

                const requestId =
                  request?.id ??
                  request?.requestId ??
                  `Request ${index + 1}`;

                const status =
                  request?.status || "UNKNOWN";

                return (
                  <div
                    key={requestId}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Request Info */}
                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          📋
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h4 className="font-bold text-slate-900">
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

                          <p className="text-sm text-slate-600 mt-1">
                            {getRequestType(request)}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {formatDate(
                              request?.created_at ??
                                request?.createdAt ??
                                request?.created
                            )}
                          </p>

                        </div>

                      </div>


                      {/* Resource */}
                      <div className="lg:text-right">

                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Requested Resources
                        </p>

                        <p className="text-sm font-semibold text-slate-900 mt-1">
                          {getResources(request)}
                        </p>

                      </div>

                    </div>


                    {/* Bottom */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <p className="text-xs text-slate-400">
                        Request details retrieved from the MedReach backend.
                      </p>

                      <Link
                        to={`/user/request-tracking?requestId=${requestId}`}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        View Details →
                      </Link>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>


        {/* ================= ACTIONS ================= */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            to="/user/active-requests"
            className="inline-flex justify-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
          >
            View Active Requests
          </Link>

          <Link
            to="/user/emergency"
            className="inline-flex justify-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            + Create Emergency Request
          </Link>

        </div>

      </main>

    </div>
  );
}

export default RequestHistory;