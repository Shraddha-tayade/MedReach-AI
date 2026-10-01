import { useLocation, useNavigate } from "react-router-dom";

export default function DonorAccepted() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const request = routerLocation.state?.request;
  const donorLocation = routerLocation.state?.donorLocation;
  const locationSharingEnabled =
    routerLocation.state?.locationSharingEnabled === true;

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-800">
            No Request Information
          </h2>
          <p className="text-slate-500 mt-2">
            Please select a request from your donor dashboard.
          </p>
          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="mt-5 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-3 font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const requestId = request.id || request.requestId || "N/A";
  const bloodGroup = request.bloodGroup || "N/A";
  const units = request.units ?? request.unitsRequired ?? 1;
  const hospital =
    request.hospital || request.hospitalName || "Hospital details unavailable";
  const hospitalLocation =
    request.location || request.hospitalLocation || "Location unavailable";
  const distance = request.distance || "Not available";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="text-2xl font-extrabold text-red-600"
          >
            MedReach
          </button>
          <span className="text-sm font-medium text-slate-600">
            Donor Portal
          </span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-green-600 p-8 text-center text-white">
            <div className="mx-auto w-16 h-16 rounded-full bg-white text-green-600 flex items-center justify-center text-4xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold mt-4">
              Request Accepted Successfully!
            </h1>
            <p className="mt-2 text-green-100">
              Thank you for helping someone in need.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Accepted Request Details
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Request ID: {requestId}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {bloodGroup}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Units Required</p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {units} unit(s)
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Hospital</p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {hospital}
                </p>
                <p className="text-slate-600 mt-1">
                  📍 {hospitalLocation}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Hospital distance: {distance}
                </p>
              </div>
            </div>

            <div className="border border-green-200 bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-green-800">
                Donor Location Status
              </h3>

              {locationSharingEnabled && donorLocation ? (
                <>
                  <p className="text-sm text-green-700 mt-2">
                    Your current coordinates were received successfully.
                  </p>
                  <p className="text-sm text-slate-700 mt-3">
                    Latitude: {donorLocation.latitude}
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    Longitude: {donorLocation.longitude}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-600 mt-2">
                  Donor coordinates are not available for this request.
                </p>
              )}

              <p className="text-xs text-slate-500 mt-3">
                Note: These are the coordinates captured when you accepted
                the request. Continuous live tracking is not enabled.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/Donor/dashboard")}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => navigate("/Donor/donation-history")}
                className="flex-1 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3"
              >
                View Donation History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}