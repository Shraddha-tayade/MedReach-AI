import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BloodBankEmergencyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET EMERGENCY BLOOD REQUESTS
  // =====================================================

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      const token = sessionStorage.getItem("medreachToken");

      if (!token) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/blood-bank/emergency-blood-requests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log("Emergency Blood Requests:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load emergency requests."
          );
        }

        setRequests(data.requests || []);
      } catch (err) {
        console.error("Emergency Request Error:", err);
        setError(
          err.message || "Something went wrong while loading requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyRequests();
  }, []);

  // =====================================================
  // ACCEPT / REJECT
  // =====================================================

  const respondToRequest = async (request, status) => {
    const token = sessionStorage.getItem("medreachToken");

    const requestId =
      request.request_id ||
      request.requestId ||
      request.emergency_request_id;

    const requestItemId =
      request.request_item_id ||
      request.requestItemId ||
      request.item_id ||
      request.itemId;

    if (!requestId || !requestItemId) {
      alert("Request ID or Request Item ID is missing.");
      return;
    }

    const responseMessage =
      status === "ACCEPTED"
        ? "Blood available"
        : "Blood not available";

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            response_message: responseMessage,
          }),
        }
      );

      const data = await response.json();

      console.log("Accept/Reject Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Unable to ${status.toLowerCase()} request.`
        );
      }

      alert(
        status === "ACCEPTED"
          ? "Emergency blood request accepted."
          : "Emergency blood request rejected."
      );

      // Refresh list
      window.location.reload();
    } catch (err) {
      console.error("Emergency Response Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // GET BLOOD BANK ID
  // =====================================================

  const getBloodBankId = (request) => {
    return (
      request.blood_bank_id ||
      request.bloodBankId ||
      request.provider_id ||
      request.providerId
    );
  };

  // =====================================================
  // CONFIRM BLOOD BANK
  // =====================================================

  const confirmBloodBank = async (request) => {
    const token = sessionStorage.getItem("medreachToken");

    const requestId =
      request.request_id ||
      request.requestId ||
      request.emergency_request_id;

    const requestItemId =
      request.request_item_id ||
      request.requestItemId ||
      request.item_id ||
      request.itemId;

    const bloodBankId = getBloodBankId(request);

    if (!requestId || !requestItemId || !bloodBankId) {
      alert(
        "Request ID, Request Item ID or Blood Bank ID is missing."
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/confirm/${bloodBankId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Confirm Blood Bank Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to confirm blood bank."
        );
      }

      alert("Blood bank confirmed and blood reserved.");

      window.location.reload();
    } catch (err) {
      console.error("Confirm Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ARRIVED
  // =====================================================

  const markArrived = async (request) => {
    const token = sessionStorage.getItem("medreachToken");

    const requestId =
      request.request_id ||
      request.requestId ||
      request.emergency_request_id;

    const requestItemId =
      request.request_item_id ||
      request.requestItemId ||
      request.item_id ||
      request.itemId;

    if (!requestId || !requestItemId) {
      alert("Request ID or Request Item ID is missing.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/arrived`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Arrived Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to mark patient as arrived."
        );
      }

      alert("Patient marked as arrived.");

      window.location.reload();
    } catch (err) {
      console.error("Arrived Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CANCEL RESERVATION
  // =====================================================

  const cancelReservation = async (request) => {
    const token = sessionStorage.getItem("medreachToken");

    const requestId =
      request.request_id ||
      request.requestId ||
      request.emergency_request_id;

    const requestItemId =
      request.request_item_id ||
      request.requestItemId ||
      request.item_id ||
      request.itemId;

    if (!requestId || !requestItemId) {
      alert("Request ID or Request Item ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this blood reservation?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Cancel Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to cancel reservation."
        );
      }

      alert("Blood reservation cancelled.");

      window.location.reload();
    } catch (err) {
      console.error("Cancel Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ISSUE BLOOD
  // =====================================================

  const issueBlood = async (request) => {
    const token = sessionStorage.getItem("medreachToken");

    const requestId =
      request.request_id ||
      request.requestId ||
      request.emergency_request_id;

    const requestItemId =
      request.request_item_id ||
      request.requestItemId ||
      request.item_id ||
      request.itemId;

    if (!requestId || !requestItemId) {
      alert("Request ID or Request Item ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to issue the reserved blood?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/blood-bank/emergency-blood-responses/${requestId}/${requestItemId}/issue`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Issue Blood Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to issue blood."
        );
      }

      alert("Blood issued successfully.");

      window.location.reload();
    } catch (err) {
      console.error("Issue Blood Error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (request) => {
    return (
      request.status ||
      request.response_status ||
      request.responseStatus ||
      request.emergency_status ||
      "PENDING"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🩸</div>
          <p className="text-gray-600">
            Loading emergency blood requests...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-red-700">
              🩸 Emergency Blood Requests
            </h1>

            <p className="text-gray-600 mt-1">
              Manage emergency blood requests received by your blood bank.
            </p>
          </div>

          <button
            onClick={() => navigate("/BloodBank/dashboard")}
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!error && requests.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <div className="text-5xl mb-4">🩸</div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Emergency Requests
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no emergency blood requests for your blood bank.
            </p>
          </div>
        )}

        {/* REQUEST LIST */}
        <div className="space-y-5">
          {requests.map((request, index) => {
            const status = String(getStatus(request)).toUpperCase();

            const bloodGroup =
              request.blood_group ||
              request.bloodGroup ||
              "N/A";

            const component =
              request.blood_component ||
              request.bloodComponent ||
              "N/A";

            const quantity =
              request.quantity ||
              request.units_required ||
              request.unitsRequired ||
              request.units_offered ||
              "N/A";

            const requester =
              request.user_name ||
              request.patient_name ||
              request.requester_name ||
              "Emergency Patient";

            const city =
              request.city ||
              request.location ||
              "Location not available";

            const description =
              request.description ||
              "Emergency blood requirement";

            return (
              <div
                key={
                  request.response_id ||
                  request.id ||
                  `${request.request_item_id || index}`
                }
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                {/* TOP */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                  <div>
                    <span className="text-sm text-gray-500">
                      Emergency Request
                    </span>

                    <h2 className="text-xl font-bold text-gray-800">
                      {bloodGroup} Blood Required
                    </h2>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                      status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : status === "ARRIVED"
                        ? "bg-blue-100 text-blue-700"
                        : status === "ISSUED"
                        ? "bg-purple-100 text-purple-700"
                        : status === "CANCELLED"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Blood Group
                    </p>
                    <p className="font-bold text-red-700 text-lg">
                      {bloodGroup}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Component
                    </p>
                    <p className="font-semibold text-gray-800">
                      {component}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Units Required
                    </p>
                    <p className="font-semibold text-gray-800">
                      {quantity}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                      Requester
                    </p>
                    <p className="font-semibold text-gray-800">
                      {requester}
                    </p>
                  </div>

                </div>

                {/* LOCATION / DESCRIPTION */}
                <div className="border-t pt-4 mb-5">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="font-medium text-gray-800">
                    📍 {city}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {description}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3">

                  {status === "PENDING" && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          respondToRequest(request, "ACCEPTED")
                        }
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        ✓ Accept
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          respondToRequest(request, "REJECTED")
                        }
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {status === "ACCEPTED" && (
                    <button
                      disabled={actionLoading}
                      onClick={() => confirmBloodBank(request)}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Confirm & Reserve Blood
                    </button>
                  )}

                  {status === "RESERVED" && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => markArrived(request)}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Patient Arrived
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => cancelReservation(request)}
                        className="bg-gray-700 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        Cancel Reservation
                      </button>
                    </>
                  )}

                  {status === "ARRIVED" && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => issueBlood(request)}
                        className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        Issue Blood
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => cancelReservation(request)}
                        className="bg-gray-700 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BloodBankEmergencyRequests;
