import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function BloodBankHospitalRequests() {
  const navigate = useNavigate();

  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================
  const getToken = () => {
    return (
      sessionStorage.getItem("medreachToken") ||
      localStorage.getItem("token")
    );
  };

  // =====================================================
  // HANDLE UNAUTHORIZED
  // =====================================================
  const handleUnauthorized = () => {
    sessionStorage.removeItem("medreachToken");
    localStorage.removeItem("token");
    alert("Session expired. Please login again.");
    navigate("/login");
  };

  // =====================================================
  // GET JSON RESPONSE SAFELY
  // =====================================================
  const getResponseData = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    console.log("API Status:", response.status);
    console.log("API URL:", response.url);
    console.log("API Response:", text);

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from server.");
      }
    }

    if (text.includes("<!DOCTYPE") || text.includes("<html")) {
      throw new Error(
        `Server returned HTML instead of JSON. Check backend route: ${response.url}`
      );
    }

    throw new Error(
      text || `Request failed with status ${response.status}`
    );
  };

  // =====================================================
  // GET ALL REQUESTS
  // =====================================================
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const [hospitalResponse, emergencyResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/blood-bank/hospital-requests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE_URL}/api/blood-bank/emergency-blood-requests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (
        hospitalResponse.status === 401 ||
        emergencyResponse.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      const hospitalData = await getResponseData(hospitalResponse);
      const emergencyData = await getResponseData(emergencyResponse);

      console.log("Hospital Requests API Response:", hospitalData);
      console.log("Emergency Requests API Response:", emergencyData);

      if (!hospitalResponse.ok) {
        throw new Error(
          hospitalData.message || "Failed to fetch hospital requests."
        );
      }

      if (!emergencyResponse.ok) {
        throw new Error(
          emergencyData.message || "Failed to fetch emergency requests."
        );
      }

      setHospitalRequests(
        hospitalData.requests ||
          hospitalData.hospital_requests ||
          []
      );

      setEmergencyRequests(
        emergencyData.requests ||
          emergencyData.emergency_requests ||
          []
      );
    } catch (err) {
      console.error("Blood Request Error:", err);
      setError(err.message || "Unable to load blood requests.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD REQUESTS
  // =====================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // GET EMERGENCY REQUEST IDS
  // =====================================================
  const getEmergencyIds = (request) => {
    return {
      requestId:
        request.request_id ??
        request.requestId ??
        request.emergency_request_id ??
        request.emergencyRequestId,

      requestItemId:
        request.request_item_id ??
        request.requestItemId ??
        request.item_id ??
        request.itemId ??
        request.emergency_request_item_id ??
        request.emergencyRequestItemId,

      bloodBankId:
        request.blood_bank_id ??
        request.bloodBankId ??
        request.provider_id ??
        request.providerId,
    };
  };

  // =====================================================
  // EMERGENCY ACCEPT / REJECT
  // =====================================================
  const respondToEmergencyRequest = async (request, status) => {
    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      const { requestId, requestItemId } = getEmergencyIds(request);

      if (!requestId || !requestItemId) {
        throw new Error(
          "Emergency request ID or request item ID is missing."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            response_message:
              status === "ACCEPTED"
                ? "Blood available"
                : "Blood not available",
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${status.toLowerCase()} emergency request.`
        );
      }

      alert(
        status === "ACCEPTED"
          ? "Blood request accepted successfully."
          : "Blood request rejected successfully."
      );

      await fetchRequests();
    } catch (err) {
      console.error("Emergency Response Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CONFIRM EMERGENCY HOSPITAL / BLOOD BANK SELECTION
  // =====================================================
  const confirmEmergencyRequest = async (request) => {
    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      const {
        requestId,
        requestItemId,
        bloodBankId,
      } = getEmergencyIds(request);

      if (!requestId || !requestItemId || !bloodBankId) {
        throw new Error(
          "Request ID, request item ID or blood bank ID is missing."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/confirm/${bloodBankId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to confirm blood request."
        );
      }

      alert("Blood request confirmed successfully.");
      await fetchRequests();
    } catch (err) {
      console.error("Confirm Request Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // MARK PATIENT ARRIVED
  // =====================================================
  const markArrived = async (request) => {
    try {
      setActionLoading(true);
      setError("");

      const token = getToken();
      const { requestId, requestItemId } = getEmergencyIds(request);

      if (!requestId || !requestItemId) {
        throw new Error("Request ID or request item ID is missing.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/arrived`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to mark patient as arrived."
        );
      }

      alert("Patient marked as arrived.");
      await fetchRequests();
    } catch (err) {
      console.error("Arrived Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CANCEL EMERGENCY RESERVATION
  // =====================================================
  const cancelEmergencyRequest = async (request) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this blood reservation?"
    );

    if (!confirmCancel) return;

    try {
      setActionLoading(true);
      setError("");

      const token = getToken();
      const { requestId, requestItemId } = getEmergencyIds(request);

      if (!requestId || !requestItemId) {
        throw new Error("Request ID or request item ID is missing.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel blood reservation."
        );
      }

      alert("Blood reservation cancelled successfully.");
      await fetchRequests();
    } catch (err) {
      console.error("Cancel Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ISSUE BLOOD
  // =====================================================
  const issueBlood = async (request) => {
    const confirmIssue = window.confirm(
      "Are you sure you want to issue the blood for this request?"
    );

    if (!confirmIssue) return;

    try {
      setActionLoading(true);
      setError("");

      const token = getToken();
      const { requestId, requestItemId } = getEmergencyIds(request);

      if (!requestId || !requestItemId) {
        throw new Error("Request ID or request item ID is missing.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/issue`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to issue blood.");
      }

      alert("Blood issued successfully. Inventory has been updated.");
      await fetchRequests();
    } catch (err) {
      console.error("Issue Blood Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // HOSPITAL REQUEST ACCEPT / REJECT
  // =====================================================
  const respondToHospitalRequest = async (request, status) => {
    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      const requestId =
        request.request_id ??
        request.requestId ??
        request.id;

      if (!requestId) {
        throw new Error("Hospital request ID is missing.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/blood-bank/hospital-requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            response_status: status,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await getResponseData(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${status.toLowerCase()} hospital request.`
        );
      }

      alert(
        status === "ACCEPTED"
          ? "Hospital blood request accepted successfully."
          : "Hospital blood request rejected successfully."
      );

      await fetchRequests();
    } catch (err) {
      console.error("Hospital Request Error:", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // GET STATUS
  // =====================================================
  const getStatus = (request) => {
    return (
      request.status ||
      request.request_status ||
      request.response_status ||
      "PENDING"
    ).toUpperCase();
  };

  // =====================================================
  // GET BLOOD GROUP
  // =====================================================
  const getBloodGroup = (request) => {
    return request.blood_group || request.bloodGroup || "N/A";
  };

  // =====================================================
  // GET UNITS
  // =====================================================
  const getUnits = (request) => {
    return (
      request.units_required ??
      request.unitsRequired ??
      request.quantity ??
      request.units ??
      0
    );
  };

  // =====================================================
  // GET HOSPITAL NAME
  // =====================================================
  const getHospitalName = (request) => {
    return (
      request.hospital_name ||
      request.hospitalName ||
      request.hospital?.name ||
      request.facility_name ||
      "Hospital"
    );
  };

  // =====================================================
  // EMERGENCY REQUEST CARD
  // =====================================================
  const renderEmergencyRequest = (request, index) => {
    const status = getStatus(request);

    const { requestId, requestItemId } = getEmergencyIds(request);

    return (
      <div
        key={`${requestId || "emergency"}-${requestItemId || index}`}
        className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-red-600">
                  🩸 {getBloodGroup(request)}
                </span>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  EMERGENCY
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Blood required: <strong>{getUnits(request)} units</strong>
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Request ID: {requestId || "N/A"}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                status === "PENDING"
                  ? "bg-amber-100 text-amber-700"
                  : status === "ACCEPTED"
                  ? "bg-blue-100 text-blue-700"
                  : status === "RESERVED"
                  ? "bg-purple-100 text-purple-700"
                  : status === "ARRIVED"
                  ? "bg-green-100 text-green-700"
                  : status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : status === "ISSUED" || status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Hospital</p>
              <p className="mt-1 font-semibold text-slate-700">
                {getHospitalName(request)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Blood Component</p>
              <p className="mt-1 font-semibold text-slate-700">
                {request.blood_component || request.bloodComponent || "Blood"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Priority</p>
              <p className="mt-1 font-semibold text-red-600">
                {request.priority || request.emergency_priority || "Emergency"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">
            {status === "PENDING" && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => respondToEmergencyRequest(request, "ACCEPTED")}
                  className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Accept
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => respondToEmergencyRequest(request, "REJECTED")}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {status === "ACCEPTED" && (
              <button
                disabled={actionLoading}
                onClick={() => confirmEmergencyRequest(request)}
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            )}

            {status === "RESERVED" && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => markArrived(request)}
                  className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark Arrived
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => cancelEmergencyRequest(request)}
                  className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}

            {status === "ARRIVED" && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => issueBlood(request)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Issue Blood
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => cancelEmergencyRequest(request)}
                  className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // HOSPITAL REQUEST CARD
  // =====================================================
  const renderHospitalRequest = (request, index) => {
    const status = getStatus(request);

    const requestId =
      request.request_id ??
      request.requestId ??
      request.id;

    return (
      <div
        key={`hospital-${requestId || index}`}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-red-600">
                  🩸 {getBloodGroup(request)}
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  HOSPITAL
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Blood required: <strong>{getUnits(request)} units</strong>
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Request ID: {requestId || "N/A"}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                status === "PENDING"
                  ? "bg-amber-100 text-amber-700"
                  : status === "ACCEPTED"
                  ? "bg-green-100 text-green-700"
                  : status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Hospital</p>
              <p className="mt-1 font-semibold text-slate-700">
                {getHospitalName(request)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Blood Component</p>
              <p className="mt-1 font-semibold text-slate-700">
                {request.blood_component || request.bloodComponent || "Blood"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Priority</p>
              <p className="mt-1 font-semibold text-red-600">
                {request.priority || request.emergency_priority || "Normal"}
              </p>
            </div>
          </div>

          {status === "PENDING" && (
            <div className="flex flex-wrap gap-3">
              <button
                disabled={actionLoading}
                onClick={() => respondToHospitalRequest(request, "ACCEPTED")}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Accept
              </button>

              <button
                disabled={actionLoading}
                onClick={() => respondToHospitalRequest(request, "REJECTED")}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl">🩸</div>
          <p className="mt-3 font-semibold text-slate-700">
            Loading Blood Requests...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Blood Bank
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-800">
              Blood Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage hospital and emergency blood requests.
            </p>
          </div>

          <button
            onClick={() => navigate("/BloodBank/dashboard")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Emergency Requests</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {emergencyRequests.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Hospital Requests</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {hospitalRequests.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Requests</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">
              {emergencyRequests.length + hospitalRequests.length}
            </p>
          </div>
        </div>

        {/* EMERGENCY REQUESTS */}
        <section className="mb-10">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Emergency
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Emergency Blood Requests 🚨
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Respond quickly to urgent blood requirements.
            </p>
          </div>

          {emergencyRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="text-4xl">🩸</div>

              <h3 className="mt-3 font-semibold text-slate-700">
                No Emergency Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are currently no emergency blood requests.
              </p>
            </div>
          ) : (
            <div className="max-h-[700px] space-y-5 overflow-y-auto pr-2">
              {emergencyRequests.map(renderEmergencyRequest)}
            </div>
          )}
        </section>

        {/* HOSPITAL REQUESTS */}
        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Hospital
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Hospital Blood Requests 🏥
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage blood requests received from hospitals.
            </p>
          </div>

          {hospitalRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="text-4xl">🏥</div>

              <h3 className="mt-3 font-semibold text-slate-700">
                No Hospital Requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are currently no hospital blood requests.
              </p>
            </div>
          ) : (
            <div className="max-h-[700px] space-y-5 overflow-y-auto pr-2">
              {hospitalRequests.map(renderHospitalRequest)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BloodBankHospitalRequests;
