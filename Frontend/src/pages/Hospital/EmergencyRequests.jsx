import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

function EmergencyRequests() {
  const navigate = useNavigate();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const getToken = () => {
    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return token;
  };

  const getHospitalId = () => {
    try {
      const account = JSON.parse(
        sessionStorage.getItem("medreachUser") || "null"
      );

      return (
        account?.id ||
        account?.account_id ||
        account?.user_id ||
        account?.hospital_id ||
        null
      );
    } catch {
      return null;
    }
  };

  /* =========================
     GET EMERGENCY REQUESTS
  ========================= */

  const fetchEmergencyRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_BASE}/hospital/emergency-bed-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to fetch emergency requests."
        );
      }

      console.log("Hospital Emergency Requests:", data);

      setRequests(
        Array.isArray(data)
          ? data
          : Array.isArray(data.requests)
          ? data.requests
          : []
      );
    } catch (error) {
      console.error("Emergency Requests API Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  /* =========================
     VIEW REQUEST
  ========================= */

  const handleView = (request) => {
    setSelectedRequest(request);
    setActionMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     COMMON RESPONSE API
  ========================= */

  const updateRequestStatus = async (newStatus) => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      setError("");
      setActionMessage("");

      const token = getToken();

      const requestId = selectedRequest.request_id;
      const requestItemId = selectedRequest.request_item_id;

      const response = await fetch(
        `${API_BASE}/hospital/emergency-bed-responses/${requestId}/${requestItemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(`Hospital Request ${newStatus} Response:`, data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Failed to ${newStatus.toLowerCase()} request.`
        );
      }

      setActionMessage(
        `Request successfully marked as ${newStatus}.`
      );

      await fetchEmergencyRequests();

      setSelectedRequest((previous) =>
        previous
          ? {
              ...previous,
              item_status: newStatus,
              response_status: newStatus,
            }
          : previous
      );
    } catch (error) {
      console.error(`Request ${newStatus} Error:`, error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     ACCEPT
  ========================= */

  const handleAccept = async () => {
    await updateRequestStatus("ACCEPTED");
  };

  /* =========================
     REJECT / CANCEL
  ========================= */

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      setError("");
      setActionMessage("");

      const token = getToken();

      const requestId = selectedRequest.request_id;
      const requestItemId = selectedRequest.request_item_id;

      const response = await fetch(
        `${API_BASE}/hospital/emergency-bed-responses/${requestId}/${requestItemId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Hospital Request Cancel Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to reject/cancel request."
        );
      }

      setActionMessage("Emergency request rejected successfully.");

      await fetchEmergencyRequests();

      setSelectedRequest((previous) =>
        previous
          ? {
              ...previous,
              item_status: "CANCELLED",
              response_status: "CANCELLED",
            }
          : previous
      );
    } catch (error) {
      console.error("Reject Request Error:", error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     CONFIRM
  ========================= */

  const handleConfirm = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      setError("");
      setActionMessage("");

      const token = getToken();
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        throw new Error(
          "Hospital ID not found in login session. Please login again."
        );
      }

      const requestId = selectedRequest.request_id;
      const requestItemId = selectedRequest.request_item_id;

      const response = await fetch(
        `${API_BASE}/hospital/emergency-bed-responses/${requestId}/${requestItemId}/confirm/${hospitalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Hospital Request Confirm Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to confirm request."
        );
      }

      setActionMessage("Emergency request confirmed successfully.");

      await fetchEmergencyRequests();
    } catch (error) {
      console.error("Confirm Request Error:", error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     ARRIVED
  ========================= */

  const handleArrived = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      setError("");
      setActionMessage("");

      const token = getToken();

      const requestId = selectedRequest.request_id;
      const requestItemId = selectedRequest.request_item_id;

      const response = await fetch(
        `${API_BASE}/hospital/emergency-bed-responses/${requestId}/${requestItemId}/arrived`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Hospital Request Arrived Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to mark request as arrived."
        );
      }

      setActionMessage("Request marked as arrived successfully.");

      await fetchEmergencyRequests();
    } catch (error) {
      console.error("Arrived Request Error:", error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const getDisplayStatus = (request) => {
    return (
      request.response_status ||
      request.item_status ||
      request.request_status ||
      "PENDING"
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700";

      case "ARRIVED":
        return "bg-blue-50 text-blue-700";

      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getResourceTitle = (resourceType) => {
    switch (resourceType) {
      case "ICU":
        return "ICU Bed";

      case "OXYGEN":
        return "Oxygen";

      case "BLOOD":
        return "Blood";

      case "AMBULANCE":
        return "Ambulance";

      default:
        return resourceType || "Medical Assistance";
    }
  };

  const getRequirementText = (request) => {
    const resource = getResourceTitle(request.resource_type);

    if (request.blood_group) {
      return `${resource} • ${request.blood_group}`;
    }

    return `${resource} • Quantity ${request.quantity || 1}`;
  };

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const selectedStatus = selectedRequest
    ? getDisplayStatus(selectedRequest)
    : "PENDING";

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-sm">
              M
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                MedReach
              </h1>

              <p className="text-xs text-slate-500">
                Hospital Emergency Portal
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/Hospital/dashboard")}
              className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:block"
            >
              ← Dashboard
            </button>

            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-red-50 hover:text-red-600">
              🔔
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 font-bold text-red-600">
              CC
            </div>

          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <span>Hospital Portal</span>
            <span>›</span>
            <span className="font-medium text-red-600">
              Emergency Requests
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Emergency Requests
                </h2>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-100">
                  LIVE
                </span>

              </div>

              <p className="mt-2 max-w-2xl text-slate-500">
                Monitor incoming emergency requests, review patient needs,
                and coordinate medical resources.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <div>
                <p className="text-xs text-emerald-600">
                  Hospital Status
                </p>

                <p className="text-sm font-bold text-emerald-700">
                  Operational
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Total Requests"
            value={requests.length}
            subtitle="Currently received"
            icon="📋"
          />

          <SummaryCard
            title="Critical"
            value={requests.filter(
              (request) =>
                request.resource_type === "ICU"
            ).length}
            subtitle="ICU requests"
            icon="🚨"
            danger
          />

          <SummaryCard
            title="Pending"
            value={requests.filter(
              (request) =>
                getDisplayStatus(request) === "PENDING"
            ).length}
            subtitle="Awaiting response"
            icon="⏳"
            warning
          />

          <SummaryCard
            title="Accepted"
            value={requests.filter(
              (request) =>
                ["ACCEPTED", "CONFIRMED", "ARRIVED"].includes(
                  getDisplayStatus(request)
                )
            ).length}
            subtitle="Currently handled"
            icon="✓"
            success
          />

        </div>

        {/* ERROR / SUCCESS */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            API Error: {error}
          </div>
        )}

        {actionMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {actionMessage}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            Loading emergency requests...
          </div>
        )}

        {/* SELECTED REQUEST */}
        {selectedRequest && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* REQUEST HEADER */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-red-50 via-white to-white px-6 py-6">

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-100">
                      ER-{selectedRequest.request_id}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                        selectedStatus
                      )}`}
                    >
                      {selectedStatus}
                    </span>

                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    Emergency Request
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Created{" "}
                    {formatDateTime(selectedRequest.created_at)}
                  </p>

                </div>

                <div
                  className={`rounded-xl px-5 py-3 text-center ${getStatusStyle(
                    selectedStatus
                  )}`}
                >

                  <p className="text-xs font-medium">
                    Current Status
                  </p>

                  <p className="mt-1 font-bold">
                    {selectedStatus}
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              {/* TRACKING */}
              <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/40 p-6">

                <div className="mb-6">

                  <h4 className="font-bold text-slate-900">
                    Request Tracking
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Track the progress of this emergency request.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

                  <TrackingStep
                    number="1"
                    title="Request Received"
                    active
                  />

                  <TrackingStep
                    number="2"
                    title="Hospital Reviewing"
                    active={
                      selectedStatus === "PENDING" ||
                      selectedStatus === "ACCEPTED" ||
                      selectedStatus === "CONFIRMED" ||
                      selectedStatus === "ARRIVED"
                    }
                  />

                  <TrackingStep
                    number="3"
                    title="Request Accepted"
                    active={[
                      "ACCEPTED",
                      "CONFIRMED",
                      "ARRIVED",
                    ].includes(selectedStatus)}
                  />

                  <TrackingStep
                    number="4"
                    title="Request Arrived"
                    active={selectedStatus === "ARRIVED"}
                  />

                </div>

              </div>

              {/* REQUEST INFORMATION */}
              <div className="mb-8">

                <div className="mb-4">

                  <h4 className="font-bold text-slate-900">
                    Request Information
                  </h4>

                  <p className="text-sm text-slate-500">
                    Information received from the emergency request API.
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <InfoCard
                    title="Request ID"
                    value={`ER-${selectedRequest.request_id}`}
                  />

                  <InfoCard
                    title="Resource"
                    value={getResourceTitle(
                      selectedRequest.resource_type
                    )}
                  />

                  <InfoCard
                    title="Quantity"
                    value={selectedRequest.quantity || 1}
                  />

                  <InfoCard
                    title="Blood Group"
                    value={
                      selectedRequest.blood_group || "Not specified"
                    }
                  />

                  <InfoCard
                    title="City"
                    value={selectedRequest.city || "Not specified"}
                  />

                  <InfoCard
                    title="Address"
                    value={
                      selectedRequest.address_line ||
                      "Not specified"
                    }
                  />

                  <InfoCard
                    title="State"
                    value={
                      selectedRequest.state || "Not specified"
                    }
                  />

                  <InfoCard
                    title="Pincode"
                    value={
                      selectedRequest.pincode || "Not specified"
                    }
                  />

                  <InfoCard
                    title="Description"
                    value={
                      selectedRequest.description ||
                      "No description provided"
                    }
                  />

                </div>

              </div>

              {/* REQUIRED RESOURCE */}
              <div className="mb-8">

                <div className="mb-4">

                  <h4 className="font-bold text-slate-900">
                    Required Resource
                  </h4>

                  <p className="text-sm text-slate-500">
                    Resource requested through MedReach.
                  </p>

                </div>

                <div className="grid gap-4 md:grid-cols-3">

                  <ResourceBox
                    icon={
                      selectedRequest.resource_type === "ICU"
                        ? "🛏️"
                        : selectedRequest.resource_type === "OXYGEN"
                        ? "🫁"
                        : selectedRequest.resource_type === "BLOOD"
                        ? "🩸"
                        : "🚑"
                    }
                    title={getResourceTitle(
                      selectedRequest.resource_type
                    )}
                    value={`${
                      selectedRequest.quantity || 1
                    } required`}
                  />

                  {selectedRequest.blood_group && (
                    <ResourceBox
                      icon="🩸"
                      title="Blood Group"
                      value={selectedRequest.blood_group}
                    />
                  )}

                  <ResourceBox
                    icon="📍"
                    title="Location"
                    value={
                      selectedRequest.city ||
                      "Location unavailable"
                    }
                  />

                </div>

              </div>

              {/* PENDING ACTIONS */}
              {selectedStatus === "PENDING" && (
                <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="flex-1 rounded-xl bg-red-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Processing..."
                      : "✓ Accept Emergency Request"}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="rounded-xl border border-red-200 bg-red-50 px-6 py-3.5 font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject / Cancel
                  </button>

                </div>
              )}

              {/* CONFIRM */}
              {selectedStatus === "ACCEPTED" && (
                <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">

                  <h4 className="text-lg font-bold text-slate-900">
                    Request Accepted
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Confirm the request after your hospital has confirmed
                    the resource allocation.
                  </p>

                  <button
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className="mt-5 w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Confirming..."
                      : "✓ Confirm Request"}
                  </button>

                </div>
              )}

              {/* ARRIVED */}
              {selectedStatus === "CONFIRMED" && (
                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-6">

                  <h4 className="text-lg font-bold text-slate-900">
                    Request Confirmed
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    Mark the request as arrived when the requested resource
                    has reached the required location.
                  </p>

                  <button
                    onClick={handleArrived}
                    disabled={actionLoading}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Updating..."
                      : "✓ Mark as Arrived"}
                  </button>

                </div>
              )}

              {/* COMPLETED / ARRIVED */}
              {selectedStatus === "ARRIVED" && (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
                      ✓
                    </div>

                    <div>

                      <h4 className="text-lg font-bold text-emerald-800">
                        Resource Arrived
                      </h4>

                      <p className="mt-1 text-sm text-emerald-700">
                        This emergency resource has been marked as arrived.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* CANCELLED */}
              {["CANCELLED", "REJECTED"].includes(selectedStatus) && (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

                  <h4 className="text-lg font-bold text-red-800">
                    Request Cancelled
                  </h4>

                  <p className="mt-1 text-sm text-red-700">
                    This emergency request is no longer active.
                  </p>

                </div>
              )}

              {/* CLOSE */}
              <div className="mt-6 border-t border-slate-200 pt-5">

                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionMessage("");
                    setError("");
                  }}
                  className="text-sm font-semibold text-slate-500 transition hover:text-red-600"
                >
                  ← Close Request Details
                </button>

              </div>

            </div>

          </section>
        )}

        {/* REQUEST TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center">

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                Incoming Emergency Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review and respond to requests from patients.
              </p>

            </div>

            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {requests.length} request items
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                <tr>

                  <th className="px-6 py-4">
                    Request
                  </th>

                  <th className="px-6 py-4">
                    Resource
                  </th>

                  <th className="px-6 py-4">
                    Requirement
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {requests.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <p className="font-semibold text-slate-700">
                        No emergency requests found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        There are currently no emergency requests for this
                        hospital.
                      </p>
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => {

                    const requestStatus =
                      getDisplayStatus(request);

                    return (
                      <tr
                        key={request.request_item_id}
                        className="transition hover:bg-red-50/30"
                      >

                        {/* REQUEST */}
                        <td className="px-6 py-5">

                          <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">
                            ER-{request.request_id}
                          </span>

                          <p className="mt-2 text-xs text-slate-400">
                            Item #{request.request_item_id}
                          </p>

                        </td>

                        {/* RESOURCE */}
                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {getResourceTitle(
                              request.resource_type
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Quantity: {request.quantity || 1}
                          </p>

                        </td>

                        {/* REQUIREMENT */}
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {getRequirementText(request)}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                              requestStatus
                            )}`}
                          >
                            {requestStatus}
                          </span>

                        </td>

                        {/* LOCATION */}
                        <td className="px-6 py-5 text-sm text-slate-500">

                          <p className="font-medium text-slate-700">
                            {request.city || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {request.address_line ||
                              "Address unavailable"}
                          </p>

                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5">

                          <button
                            onClick={() => handleView(request)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                          >
                            View Request
                          </button>

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  danger,
  warning,
  success,
}) {
  let iconStyle = "bg-red-50 text-red-600";

  if (danger) {
    iconStyle = "bg-red-100 text-red-700";
  }

  if (warning) {
    iconStyle = "bg-amber-50 text-amber-600";
  }

  if (success) {
    iconStyle = "bg-emerald-50 text-emerald-600";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconStyle}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-3 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-red-200">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* =========================
   RESOURCE BOX
========================= */

function ResourceBox({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-red-200 hover:bg-red-50/30">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
          {icon}
        </div>

        <div>

          <p className="font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================
   TRACKING
========================= */

function TrackingStep({
  number,
  title,
  active,
}) {
  return (
    <div className="flex flex-col items-center text-center">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition ${
          active
            ? "bg-red-600 text-white shadow-md shadow-red-200"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {active ? "✓" : number}
      </div>

      <p
        className={`mt-3 text-xs font-semibold ${
          active
            ? "text-slate-800"
            : "text-slate-400"
        }`}
      >
        {title}
      </p>

    </div>
  );
}

export default EmergencyRequests;