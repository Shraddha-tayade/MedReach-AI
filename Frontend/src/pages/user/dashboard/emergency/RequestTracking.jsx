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
  // Get request ID 
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
  // Auth headers 
  // --------------------------------------------------------- 
  const getHeaders = () => { 
    const token = sessionStorage.getItem("medreachToken"); 
 
    return { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`, 
    }; 
  }; 
 
  // --------------------------------------------------------- 
  // Generic JSON request helper 
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
 
        // Backend may return required resources as "items" or "resources". 
        const normalizedItems = 
          Array.isArray(requestData?.items) 
            ? requestData.items 
            : Array.isArray(requestData?.resources) 
            ? requestData.resources 
            : []; 
 
        setRequest({ 
          ...requestData, 
          items: normalizedItems, 
        }); 
 
        // Use request status if the details API already provides it. 
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
 
      // Backend can return status as a string or as an object. 
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
  // Auto refresh status + responses 
  // --------------------------------------------------------- 
  useEffect(() => { 
    if (!requestId) return; 
 
    const interval = setInterval(() => { 
      loadStatus(); 
      loadResponses(); 
    }, 5000); 
 
    return () => clearInterval(interval); 
  }, [requestId, loadStatus, loadResponses]); 
 
  // --------------------------------------------------------- 
  // Helpers 
  // --------------------------------------------------------- 
  const getStatusLabel = () => { 
    switch (status) { 
      case "ACTIVE": 
        return "Searching Resources"; 
 
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
 
  const getStatusClasses = () => { 
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
 
  const items = Array.isArray(request?.items) 
    ? request.items 
    : Array.isArray(request?.resources) 
    ? request.resources 
    : []; 
 
  // --------------------------------------------------------- 
  // Resource icon 
  // --------------------------------------------------------- 
  const getResourceIcon = (resourceType) => { 
    switch (resourceType) { 
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
    switch (item?.resourceType) { 
      case "BLOOD": 
        return "Blood"; 
 
      case "ICU": 
        return "ICU Bed"; 
 
      case "OXYGEN": 
        return "Oxygen"; 
 
      case "AMBULANCE": 
        return "Ambulance"; 
 
      default: 
        return item?.resourceType || "Medical Resource"; 
    } 
  }; 
 
  // --------------------------------------------------------- 
  // Resource description 
  // --------------------------------------------------------- 
  const getResourceDescription = (item) => { 
    if (item?.resourceType === "BLOOD") { 
      const group = item?.bloodGroup || "Blood"; 
      const component = 
        item?.bloodComponent || "WHOLE_BLOOD"; 
 
      return `${group} • ${component}`; 
    } 
 
    if (item?.resourceType === "ICU") { 
      return "Intensive Care Unit"; 
    } 
 
    if (item?.resourceType === "OXYGEN") { 
      return "Oxygen support"; 
    } 
 
    if (item?.resourceType === "AMBULANCE") { 
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
      if (item?.resourceType === "BLOOD") { 
        return `${quantity} Unit${quantity > 1 ? "s" : ""} Required`; 
      } 
 
      if (item?.resourceType === "ICU") { 
        return `${quantity} Bed${quantity > 1 ? "s" : ""} Required`; 
      } 
 
      return `${quantity} Required`; 
    } 
 
    if (item?.resourceType === "AMBULANCE") { 
      return "Required"; 
    } 
 
    return "Required"; 
  }; 
 
  // --------------------------------------------------------- 
  // Request location 
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
  // Response provider name 
  // Backend response structure wasn't specified, 
  // so use available fields safely. 
  // --------------------------------------------------------- 
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
    return ( 
      response?.status || 
      response?.responseStatus || 
      response?.response_status || 
      "AVAILABLE" 
    ); 
  }; 
 
  // --------------------------------------------------------- 
  // Progress state 
  // --------------------------------------------------------- 
  const progressSteps = [ 
    { 
      title: "Request Created", 
      description: 
        "Your emergency request has been successfully created.", 
    }, 
    { 
      title: "Searching Hospitals", 
      description: 
        "Looking for nearby hospitals with available resources.", 
    }, 
    { 
      title: "Finding Blood / Donor", 
      description: 
        "Searching for compatible blood and available donors.", 
    }, 
    { 
      title: "Ambulance Assigned", 
      description: 
        "Waiting for an available ambulance.", 
    }, 
    { 
      title: "Request Fulfilled", 
      description: 
        "All required resources have been arranged.", 
    }, 
  ]; 
 
  const getProgressState = (index) => { 
    if (status === "COMPLETED") { 
      return "completed"; 
    } 
 
    if (status === "CANCELLED" || status === "EXPIRED") { 
      return index === 0 ? "completed" : "pending"; 
    } 
 
    if (status === "ACTIVE") { 
      if (index === 0 || index === 1) { 
        return "completed"; 
      } 
 
      if (index === 2) { 
        return "active"; 
      } 
 
      return "pending"; 
    } 
 
    return index === 0 ? "completed" : "pending"; 
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
            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div> 
 
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
            <div className="text-5xl mb-4">⚠️</div> 
 
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
 
 
      {/* Main Content */} 
      <main className="max-w-6xl mx-auto px-6 py-8"> 
 
        {/* Page Heading */} 
        <div className="mb-8"> 
          <p className="text-sm font-medium text-red-600 mb-2"> 
            Emergency Request 
          </p> 
 
          <h2 className="text-3xl font-bold text-slate-900"> 
            Request Tracking 
          </h2> 
 
          <p className="text-slate-500 mt-2"> 
            Track the status of your emergency medical resource request. 
          </p> 
        </div> 
 
 
        {/* Refresh button */} 
        <div className="flex justify-end mb-4"> 
          <button 
            onClick={() => loadAllData(false)} 
            disabled={refreshing} 
            className="px-4 py-2 border border-slate-300 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60" 
          > 
            {refreshing ? "Refreshing..." : "↻ Refresh"} 
          </button> 
        </div> 
 
 
        {/* Request Status Card */} 
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"> 
 
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> 
 
            <div> 
              <p className="text-sm text-slate-500"> 
                Request ID 
              </p> 
 
              <h3 className="text-xl font-bold text-slate-900 mt-1"> 
                {request?.id || requestId} 
              </h3> 
            </div> 
 
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusClasses()}`} 
            > 
              <span 
                className={`w-2 h-2 rounded-full ${ 
                  status === "COMPLETED" 
                    ? "bg-green-600" 
                    : status === "ACTIVE" 
                    ? "bg-red-600" 
                    : "bg-slate-400" 
                }`} 
              ></span> 
 
              {getStatusLabel()} 
            </div> 
 
          </div> 
 
        </div> 
 
 
        {/* Request Information */} 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> 
 
          {/* Status */} 
          <div className="bg-white rounded-2xl border border-slate-200 p-6"> 
            <p className="text-sm text-slate-500 mb-2"> 
              Request Status 
            </p> 
 
            <p className="text-lg font-semibold text-slate-900"> 
              {status || "Unknown"} 
            </p> 
          </div> 
 
 
          {/* Request ID */} 
          <div className="bg-white rounded-2xl border border-slate-200 p-6"> 
            <p className="text-sm text-slate-500 mb-2"> 
              Request ID 
            </p> 
 
            <p className="text-lg font-semibold text-slate-900 break-all"> 
              {request?.id || requestId} 
            </p> 
          </div> 
 
 
          {/* Location */} 
          <div className="bg-white rounded-2xl border border-slate-200 p-6"> 
            <p className="text-sm text-slate-500 mb-2"> 
              Location 
            </p> 
 
            <p className="text-lg font-semibold text-slate-900 break-all"> 
              {locationText} 
            </p> 
          </div> 
 
        </div> 
 
 
        {/* Required Resources */} 
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"> 
 
          <h3 className="text-xl font-bold text-slate-900 mb-5"> 
            Required Resources 
          </h3> 
 
          {items.length === 0 ? ( 
            <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center"> 
              <p className="text-slate-500"> 
                No resource items were returned for this request. 
              </p> 
            </div> 
          ) : ( 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
 
              {items.map((item, index) => ( 
                <div 
                  key={item?.id || index} 
                  className="border border-slate-200 rounded-xl p-5" 
                > 
                  <div className="text-3xl mb-3"> 
                    {getResourceIcon(item?.resourceType)} 
                  </div> 
 
                  <h4 className="font-semibold text-slate-900"> 
                    {getResourceTitle(item)} 
                  </h4> 
 
                  <p className="text-sm text-slate-500 mt-1"> 
                    {getResourceDescription(item)} 
                  </p> 
 
                  <p className="text-sm font-medium text-slate-700 mt-2"> 
                    {getResourceQuantity(item)} 
                  </p> 
 
                  {item?.status && ( 
                    <span className="inline-block mt-3 text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded"> 
                      {String(item.status).toUpperCase()} 
                    </span> 
                  )} 
                </div> 
              ))} 
 
            </div> 
          )} 
 
        </div> 
 
 
        {/* Progress Tracker */} 
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"> 
 
          <h3 className="text-xl font-bold text-slate-900 mb-7"> 
            Request Progress 
          </h3> 
 
          <div className="space-y-7"> 
 
            {progressSteps.map((step, index) => { 
              const state = getProgressState(index); 
 
              return ( 
                <div 
                  key={step.title} 
                  className="flex items-start gap-4" 
                > 
 
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${ 
                      state === "completed" 
                        ? "bg-green-100 text-green-700" 
                        : state === "active" 
                        ? "bg-red-100 text-red-600" 
                        : "bg-slate-100 text-slate-400" 
                    }`} 
                  > 
                    {state === "completed" 
                      ? "✓" 
                      : index + 1} 
                  </div> 
 
                  <div> 
                    <h4 
                      className={`font-semibold ${ 
                        state === "pending" 
                          ? "text-slate-400" 
                          : "text-slate-900" 
                      }`} 
                    > 
                      {step.title} 
                    </h4> 
 
                    <p 
                      className={`text-sm mt-1 ${ 
                        state === "pending" 
                          ? "text-slate-400" 
                          : "text-slate-500" 
                      }`} 
                    > 
                      {step.description} 
                    </p> 
                  </div> 
 
                </div> 
              ); 
            })} 
 
          </div> 
 
        </div> 
 
 
        {/* Matched Resources / Provider Responses */} 
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"> 
 
          <div className="flex items-center justify-between mb-5"> 
 
            <h3 className="text-xl font-bold text-slate-900"> 
              Matched Resources 
            </h3> 
 
            <span className="text-sm text-slate-500"> 
              {responses.length} result 
              {responses.length !== 1 ? "s" : ""} 
            </span> 
 
          </div> 
 
 
          {responses.length === 0 ? ( 
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center"> 
 
              <div className="text-4xl mb-3"> 
                🔎 
              </div> 
 
              <h4 className="font-semibold text-slate-900"> 
                No provider responses yet 
              </h4> 
 
              <p className="text-sm text-slate-500 mt-2"> 
                We are still waiting for hospitals, blood banks, 
                donors or ambulances to respond to your request. 
              </p> 
 
            </div> 
          ) : ( 
            <div className="space-y-4"> 
 
              {responses.map((response, index) => ( 
                <div 
                  key={ 
                    response?.id || 
                    response?.responseId || 
                    index 
                  } 
                  className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4" 
                > 
 
                  <div className="flex items-start gap-4"> 
 
                    <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-xl"> 
                      🏥 
                    </div> 
 
                    <div> 
 
                      <h4 className="font-semibold text-slate-900"> 
                        {getProviderName(response)} 
                      </h4> 
 
                      <p className="text-sm text-slate-500 mt-1"> 
                        {getProviderType(response)} 
                      </p> 
 
                      <span className="inline-block mt-2 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded"> 
                        {getResponseStatus(response)} 
                      </span> 
 
                    </div> 
 
                  </div> 
 
                </div> 
              ))} 
 
            </div> 
          )} 
 
        </div> 
 
 
        {/* Auto refresh note */} 
        <div className="mt-5 text-center"> 
          <p className="text-xs text-slate-400"> 
            Request status and provider responses refresh automatically. 
          </p> 
        </div> 
 
      </main> 
    </div> 
  ); 
} 
 
export default RequestTracking; 