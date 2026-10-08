import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

function RequestTracking() {
  const [searchParams] = useSearchParams();

  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Get Request ID
  // ---------------------------------------------------------
  const getRequestId = () => {
    const urlRequestId = searchParams.get("requestId");

    if (urlRequestId) {
      return urlRequestId;
    }

    try {
      const savedRequest = sessionStorage.getItem(
        "medreachLastEmergencyRequest"
      );

      if (savedRequest) {
        const parsed = JSON.parse(savedRequest);

        return (
          parsed?.requestId ||
          parsed?.request?.id ||
          parsed?.id ||
          ""
        );
      }
    } catch (err) {
      console.error("Unable to read saved request:", err);
    }

    return "";
  };

  const requestId = getRequestId();

  // ---------------------------------------------------------
  // Auth Headers
  // ---------------------------------------------------------
  const getHeaders = () => {
    const token = sessionStorage.getItem("medreachToken");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ---------------------------------------------------------
  // Generic GET helper
  // ---------------------------------------------------------
  const fetchJson = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const rawResponse = await response.text();

    let data;

    try {
      data = rawResponse ? JSON.parse(rawResponse) : {};
    } catch (err) {
      throw new Error(
        `Server returned a non-JSON response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}.`
      );
    }

    return data;
  };

  // ---------------------------------------------------------
  // Normalize resource type
  // ---------------------------------------------------------
  const normalizeResourceType = (item) => {
    return String(
      item?.resourceType ||
        item?.resource_type ||
        item?.type ||
        ""
    ).toUpperCase();
  };

  // ---------------------------------------------------------
  // Normalize request items
  // ---------------------------------------------------------
  const normalizeItems = (requestData) => {
    if (Array.isArray(requestData?.items)) {
      return requestData.items;
    }

    if (Array.isArray(requestData?.resources)) {
      return requestData.resources;
    }

    return [];
  };

  // ---------------------------------------------------------
  // Load complete request
  // ---------------------------------------------------------
  const loadRequest = useCallback(async () => {
    if (!requestId) {
      setError(
        "No emergency request ID was found. Please create an emergency request first."
      );
      setLoading(false);
      return;
    }

    try {
      const data = await fetchJson(
        `${API_BASE_URL}/emergency-requests/${requestId}`
      );

      if (data?.request) {
        const requestData = data.request;

        const normalizedItems = normalizeItems(requestData);

        setRequest({
          ...requestData,
          items: normalizedItems,
        });

        if (typeof requestData?.status === "string") {
          setStatus(requestData.status.toUpperCase());
        }
      } else {
        setRequest(null);
      }
    } catch (err) {
      console.error("Request details error:", err);
      setError(err.message || "Unable to load request details.");
    }
  }, [requestId]);

  // ---------------------------------------------------------
  // Load request status
  // ---------------------------------------------------------
  const loadStatus = useCallback(async () => {
    if (!requestId) return;

    try {
      const data = await fetchJson(
        `${API_BASE_URL}/emergency-requests/${requestId}/status`
      );

      const rawStatus =
        typeof data?.status === "string"
          ? data.status
          : data?.status?.status ||
            data?.status?.requestStatus ||
            data?.status?.request_status ||
            data?.request?.status ||
            "";

      if (rawStatus) {
        setStatus(String(rawStatus).toUpperCase());
      }
    } catch (err) {
      console.error("Request status error:", err);
    }
  }, [requestId]);

  // ---------------------------------------------------------
  // Load provider responses
  // ---------------------------------------------------------
  const loadResponses = useCallback(async () => {
    if (!requestId) return;

    try {
      const data = await fetchJson(
        `${API_BASE_URL}/emergency-requests/${requestId}/responses`
      );

      if (Array.isArray(data?.responses)) {
        setResponses(data.responses);
      } else if (Array.isArray(data)) {
        setResponses(data);
      } else {
        setResponses([]);
      }
    } catch (err) {
      console.error("Request responses error:", err);
    }
  }, [requestId]);

  // ---------------------------------------------------------
  // Load everything
  // ---------------------------------------------------------
  const loadAllData = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      try {
        await Promise.all([
          loadRequest(),
          loadStatus(),
          loadResponses(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loadRequest, loadStatus, loadResponses]
  );

  // ---------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------
  useEffect(() => {
    loadAllData(true);
  }, [loadAllData]);

  // ---------------------------------------------------------
  // Auto refresh
  // ---------------------------------------------------------
  useEffect(() => {
    if (!requestId) return;

    const interval = setInterval(() => {
      loadStatus();
      loadResponses();
      loadRequest();
    }, 5000);

    return () => clearInterval(interval);
  }, [requestId, loadStatus, loadResponses, loadRequest]);

  // ---------------------------------------------------------
  // Request status label
  // ---------------------------------------------------------
  const getOverallStatusLabel = () => {
    switch (status) {
      case "ACTIVE":
        return "Request Active";

      case "COMPLETED":
        return "Request Fulfilled";

      case "CANCELLED":
        return "Request Cancelled";

      case "EXPIRED":
        return "Request Expired";

      default:
        return status || "Loading...";
    }
  };

  // ---------------------------------------------------------
  // Overall status classes
  // ---------------------------------------------------------
  const getOverallStatusClasses = () => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-50 text-red-700";

      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
      case "EXPIRED":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ---------------------------------------------------------
  // Items
  // ---------------------------------------------------------
  const items = Array.isArray(request?.items)
    ? request.items
    : Array.isArray(request?.resources)
    ? request.resources
    : [];

  // ---------------------------------------------------------
  // Resource icon
  // ---------------------------------------------------------
  const getResourceIcon = (resourceType) => {
    switch (normalizeResourceType({ resourceType })) {
      case "BLOOD":
        return "🩸";

      case "ICU":
        return "🏥";

      case "OXYGEN":
        return "🫁";

      case "AMBULANCE":
        return "🚑";

      default:
        return "🏥";
    }
  };

  // ---------------------------------------------------------
  // Resource title
  // ---------------------------------------------------------
  const getResourceTitle = (item) => {
    switch (normalizeResourceType(item)) {
      case "BLOOD":
        return "Blood";

      case "ICU":
        return "ICU Bed";

      case "OXYGEN":
        return "Oxygen";

      case "AMBULANCE":
        return "Ambulance";

      default:
        return item?.resourceType ||
          item?.resource_type ||
          "Medical Resource";
    }
  };

  // ---------------------------------------------------------
  // Resource description
  // ---------------------------------------------------------
  const getResourceDescription = (item) => {
    const resourceType = normalizeResourceType(item);

    if (resourceType === "BLOOD") {
      const group =
        item?.bloodGroup ||
        item?.blood_group ||
        "Blood";

      const component =
        item?.bloodComponent ||
        item?.blood_component ||
        "WHOLE_BLOOD";

      return `${group} • ${component}`;
    }

    if (resourceType === "ICU") {
      return "Intensive Care Unit";
    }

    if (resourceType === "OXYGEN") {
      return "Oxygen support";
    }

    if (resourceType === "AMBULANCE") {
      return "Emergency Transport";
    }

    return "Emergency medical resource";
  };

  // ---------------------------------------------------------
  // Resource quantity
  // ---------------------------------------------------------
  const getResourceQuantity = (item) => {
    const quantity = Number(item?.quantity);

    if (!Number.isNaN(quantity) && quantity > 0) {
      const resourceType = normalizeResourceType(item);

      if (resourceType === "BLOOD") {
        return `${quantity} Unit${
          quantity > 1 ? "s" : ""
        } Required`;
      }

      if (resourceType === "ICU") {
        return `${quantity} Bed${
          quantity > 1 ? "s" : ""
        } Required`;
      }

      return `${quantity} Required`;
    }

    return "Required";
  };

  // ---------------------------------------------------------
  // Location
  // ---------------------------------------------------------
  const locationText = useMemo(() => {
    if (!request?.location) {
      return "Location unavailable";
    }

    const latitude = request.location.latitude;
    const longitude = request.location.longitude;

    if (
      latitude !== undefined &&
      longitude !== undefined
    ) {
      return `${latitude}, ${longitude}`;
    }

    return "Location available";
  }, [request]);

  // ---------------------------------------------------------
  // Response helpers
  // ---------------------------------------------------------
  const getResponseItemId = (response) => {
    return (
      response?.itemId ||
      response?.item_id ||
      response?.emergencyRequestItemId ||
      response?.emergency_request_item_id ||
      response?.requestItemId ||
      response?.request_item_id ||
      response?.item?.id ||
      response?.emergencyRequestItem?.id ||
      null
    );
  };

  const getResponseResourceType = (response) => {
    return String(
      response?.resourceType ||
        response?.resource_type ||
        response?.item?.resourceType ||
        response?.item?.resource_type ||
        response?.resource?.resourceType ||
        response?.resource?.resource_type ||
        ""
    ).toUpperCase();
  };

  const getProviderName = (response) => {
    return (
      response?.providerName ||
      response?.provider_name ||
      response?.name ||
      response?.provider?.name ||
      response?.provider?.hospital_name ||
      response?.provider?.blood_bank_name ||
      response?.provider?.ambulance_number ||
      "Medical Provider"
    );
  };

  const getProviderType = (response) => {
    return (
      response?.providerType ||
      response?.provider_type ||
      response?.provider?.type ||
      "Provider"
    );
  };

  const getResponseStatus = (response) => {
    return String(
      response?.status ||
        response?.responseStatus ||
        response?.response_status ||
        "PENDING"
    ).toUpperCase();
  };

  // ---------------------------------------------------------
  // Find responses for individual resource
  // ---------------------------------------------------------
  const getResponsesForItem = (item) => {
    const itemId =
      item?.id ||
      item?.itemId ||
      item?.item_id ||
      null;

    const resourceType = normalizeResourceType(item);

    return responses.filter((response) => {
      const responseItemId = getResponseItemId(response);
      const responseResourceType =
        getResponseResourceType(response);

      // Best match: item ID
      if (itemId && responseItemId) {
        return String(itemId) === String(responseItemId);
      }

      // Fallback: resource type
      if (
        resourceType &&
        responseResourceType
      ) {
        return resourceType === responseResourceType;
      }

      return false;
    });
  };

  // ---------------------------------------------------------
  // Resource tracking status
  // ---------------------------------------------------------
  const getResourceStatus = (item) => {
    const itemStatus = String(
      item?.status ||
        item?.itemStatus ||
        item?.item_status ||
        ""
    ).toUpperCase();

    const itemResponses = getResponsesForItem(item);

    // If provider response exists, use the latest response status.
    if (itemResponses.length > 0) {
      const latestResponse =
        itemResponses[itemResponses.length - 1];

      const responseStatus =
        getResponseStatus(latestResponse);

      if (
        responseStatus === "ACCEPTED" ||
        responseStatus === "CONFIRMED" ||
        responseStatus === "COMPLETED"
      ) {
        return responseStatus;
      }

      if (
        responseStatus === "REJECTED" ||
        responseStatus === "DECLINED"
      ) {
        return "REJECTED";
      }

      return responseStatus;
    }

    if (itemStatus) {
      return itemStatus;
    }

    return "PENDING";
  };

  // ---------------------------------------------------------
  // Resource status text
  // ---------------------------------------------------------
  const getResourceStatusText = (item) => {
    const resourceStatus = getResourceStatus(item);

    switch (resourceStatus) {
      case "ACCEPTED":
        return "Provider Accepted";

      case "CONFIRMED":
        return "Provider Confirmed";

      case "COMPLETED":
        return "Completed";

      case "REJECTED":
      case "DECLINED":
        return "Provider Declined";

      case "SEARCHING":
        return "Searching Providers";

      case "MATCHED":
        return "Provider Found";

      case "PENDING":
        return "Pending";

      default:
        return resourceStatus.replaceAll("_", " ");
    }
  };

  // ---------------------------------------------------------
  // Resource status styles
  // ---------------------------------------------------------
  const getResourceStatusClasses = (item) => {
    const resourceStatus = getResourceStatus(item);

    switch (resourceStatus) {
      case "ACCEPTED":
      case "CONFIRMED":
      case "COMPLETED":
      case "MATCHED":
        return "bg-green-50 text-green-700 border-green-200";

      case "REJECTED":
      case "DECLINED":
        return "bg-red-50 text-red-700 border-red-200";

      case "SEARCHING":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  // ---------------------------------------------------------
  // Resource progress text
  // ---------------------------------------------------------
  const getResourceProgress = (item) => {
    const resourceStatus = getResourceStatus(item);
    const itemResponses = getResponsesForItem(item);

    if (
      resourceStatus === "COMPLETED"
    ) {
      return "This resource requirement has been completed.";
    }

    if (
      resourceStatus === "CONFIRMED"
    ) {
      return "Provider has been confirmed for this resource.";
    }

    if (
      resourceStatus === "ACCEPTED"
    ) {
      return "A provider has accepted this requirement.";
    }

    if (
      resourceStatus === "REJECTED" ||
      resourceStatus === "DECLINED"
    ) {
      return "The provider declined this requirement. Searching may continue.";
    }

    if (itemResponses.length > 0) {
      return `${itemResponses.length} provider response${
        itemResponses.length > 1 ? "s" : ""
      } received.`;
    }

    return "Searching for suitable providers...";
  };

  // ---------------------------------------------------------
  // Resource card
  // ---------------------------------------------------------
  const renderResourceCard = (item, index) => {
    const itemResponses = getResponsesForItem(item);
    const resourceStatus = getResourceStatus(item);

    return (
      <div
        key={item?.id || `${normalizeResourceType(item)}-${index}`}
        className="border border-slate-200 rounded-2xl overflow-hidden"
      >
        {/* Resource Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl shrink-0">
                {getResourceIcon(normalizeResourceType(item))}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {getResourceTitle(item)}
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  {getResourceDescription(item)}
                </p>

                <p className="text-sm font-medium text-slate-700 mt-2">
                  {getResourceQuantity(item)}
                </p>
              </div>
            </div>

            {/* Resource Status */}
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit ${getResourceStatusClasses(
                item
              )}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  resourceStatus === "COMPLETED" ||
                  resourceStatus === "CONFIRMED" ||
                  resourceStatus === "ACCEPTED" ||
                  resourceStatus === "MATCHED"
                    ? "bg-green-500"
                    : resourceStatus === "REJECTED" ||
                      resourceStatus === "DECLINED"
                    ? "bg-red-500"
                    : resourceStatus === "SEARCHING"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />

              {getResourceStatusText(item)}
            </span>
          </div>
        </div>

        {/* Resource Progress */}
        <div className="p-5 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                resourceStatus === "COMPLETED" ||
                resourceStatus === "CONFIRMED" ||
                resourceStatus === "ACCEPTED"
                  ? "bg-green-100 text-green-700"
                  : resourceStatus === "REJECTED" ||
                    resourceStatus === "DECLINED"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {resourceStatus === "COMPLETED" ||
              resourceStatus === "CONFIRMED" ||
              resourceStatus === "ACCEPTED"
                ? "✓"
                : "…"}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {resourceStatus === "COMPLETED"
                  ? "Resource Completed"
                  : resourceStatus === "ACCEPTED" ||
                    resourceStatus === "CONFIRMED"
                  ? "Provider Response Received"
                  : "Resource Search in Progress"}
              </p>

              <p className="text-sm text-slate-500">
                {getResourceProgress(item)}
              </p>
            </div>
          </div>

          {/* Provider Responses for THIS resource */}
          {itemResponses.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Provider Responses
              </p>

              <div className="space-y-3">
                {itemResponses.map((response, responseIndex) => (
                  <div
                    key={
                      response?.id ||
                      response?.responseId ||
                      responseIndex
                    }
                    className="bg-white border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                          {getResourceIcon(
                            getResponseResourceType(response) ||
                              normalizeResourceType(item)
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {getProviderName(response)}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {getProviderType(response)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          ["ACCEPTED", "CONFIRMED", "COMPLETED"].includes(
                            getResponseStatus(response)
                          )
                            ? "bg-green-50 text-green-700"
                            : ["REJECTED", "DECLINED"].includes(
                                getResponseStatus(response)
                              )
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {getResponseStatus(response)}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No responses */}
          {itemResponses.length === 0 && (
            <div className="mt-4 bg-white border border-dashed border-slate-300 rounded-xl p-4">
              <p className="text-sm text-slate-500">
                No provider response yet. Searching for suitable providers...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------
  // Loading screen
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
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
              className="text-sm font-medium text-slate-600 hover:text-red-600"
            >
              ← Back to Dashboard
            </Link>

          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              Loading Request
            </h2>

            <p className="text-slate-500 mt-2">
              Fetching your emergency request details...
            </p>

          </div>
        </main>

      </div>
    );
  }

  // ---------------------------------------------------------
  // Error screen
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">

        <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
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
              className="text-sm font-medium text-slate-600 hover:text-red-600"
            >
              ← Back to Dashboard
            </Link>

          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center">

            <div className="text-5xl mb-4">
              ⚠️
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Unable to Load Request
            </h2>

            <p className="text-slate-500 mt-3">
              {error}
            </p>

            <button
              onClick={() => loadAllData(true)}
              className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
            >
              Try Again
            </button>

            <div className="mt-5">
              <Link
                to="/user/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-red-600"
              >
                ← Back to Dashboard
              </Link>
            </div>

          </div>
        </main>

      </div>
    );
  }

  // ---------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
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
            className="text-sm font-medium text-slate-600 hover:text-red-600"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-red-600 mb-2">
            Emergency Request
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Request Tracking
          </h2>

          <p className="text-slate-500 mt-2">
            Track each required medical resource separately.
          </p>
        </div>

        {/* Refresh */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => loadAllData(false)}
            disabled={refreshing}
            className="px-4 py-2 border border-slate-300 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* Overall Request Status */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-slate-500">
                Emergency Request
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Request #{request?.id || requestId}
              </h3>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${getOverallStatusClasses()}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "COMPLETED"
                    ? "bg-green-600"
                    : status === "ACTIVE"
                    ? "bg-red-600"
                    : "bg-slate-400"
                }`}
              />

              {getOverallStatusLabel()}
            </div>

          </div>

        </div>

        {/* Request Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Overall Status
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {status || "Unknown"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Request ID
            </p>

            <p className="text-lg font-semibold text-slate-900 break-all">
              {request?.id || requestId}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Location
            </p>

            <p className="text-lg font-semibold text-slate-900 break-all">
              {locationText}
            </p>
          </div>

        </div>

        {/* =====================================================
            RESOURCE-WISE TRACKING
        ====================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Resource Tracking
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Each resource is tracked independently.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {items.length} Resource
              {items.length !== 1 ? "s" : ""}
            </span>

          </div>

          {items.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">

              <div className="text-4xl mb-3">
                🔎
              </div>

              <p className="text-slate-500">
                No resource items were returned for this request.
              </p>

            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item, index) =>
                renderResourceCard(item, index)
              )}
            </div>
          )}

        </div>

        {/* Overall completion message */}
        {status === "COMPLETED" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                ✓
              </div>

              <div>
                <h3 className="font-bold text-green-800">
                  Emergency Request Fulfilled
                </h3>

                <p className="text-sm text-green-700 mt-1">
                  All required resources for this emergency request
                  have been completed.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Auto refresh */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-400">
            Resource statuses and provider responses refresh automatically.
          </p>
        </div>

      </main>
    </div>
  );
}

export default RequestTracking;