import { useLocation, useNavigate } from "react-router-dom";

function DonorRequestDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const request = location.state?.request;

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => navigate("/Donor/dashboard")}
          className="mb-6 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-slate-800">
            Request Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            Please go back to the dashboard and select an emergency request.
          </p>
        </div>
      </div>
    );
  }

  const handleAccept = () => {
    navigate("/Donor/accepted", {
      state: { request },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* Back Button */}
      <button
        onClick={() => navigate("/Donor/dashboard")}
        className="mb-6 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        ← Back to Dashboard
      </button>

      {/* Heading */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Emergency Blood Request
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Request Details 🚨
        </h1>

        <p className="mt-2 text-slate-600">
          Review the emergency request before accepting it.
        </p>
      </div>

      {/* Request Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm text-slate-500">
            Request ID
          </p>

          <p className="mt-1 font-bold text-slate-800">
            {request.id}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
            request.priority === "URGENT"
              ? "bg-red-600 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {request.priority} PRIORITY
        </span>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Main Details */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

          <h2 className="text-xl font-bold text-slate-800">
            🩸 Blood Requirement
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-red-50 p-5">
              <p className="text-sm text-slate-500">
                Required Blood Group
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {request.bloodGroup}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Units Required
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {request.units}
              </p>
            </div>

          </div>

          {/* Emergency Information */}
          <h2 className="mt-8 text-xl font-bold text-slate-800">
            🚨 Emergency Information
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
              <span className="text-slate-500">
                Emergency Type
              </span>

              <span className="font-semibold text-slate-800">
                Accident Emergency
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
              <span className="text-slate-500">
                Request Time
              </span>

              <span className="font-semibold text-slate-800">
                {request.time}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
              <span className="text-slate-500">
                Priority
              </span>

              <span className="font-semibold text-red-600">
                {request.priority}
              </span>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="text-slate-500">
                Contact
              </span>

              <span className="font-semibold text-slate-800">
                Hospital Emergency Desk
              </span>
            </div>

          </div>

        </div>

        {/* Hospital Details */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
            🏥
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            {request.hospital}
          </h2>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-sm text-slate-500">
                📍 Location
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {request.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                🚗 Distance
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {request.distance}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-sm font-semibold text-green-700">
                📍 Nearby Emergency Request
              </p>

              <p className="mt-1 text-sm text-green-600">
                This request is within your nearby service area.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Before Accepting */}
      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

        <h3 className="font-bold text-slate-800">
          ⚠️ Before Accepting
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Please make sure that you are available and eligible to donate
          before accepting this emergency request.
        </p>

      </div>

      {/* Accept Section */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-slate-800">
          Ready to Help?
        </h2>

        <p className="mt-2 text-slate-600">
          By accepting this request, you are confirming that you can
          respond to this emergency blood requirement.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={handleAccept}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            ❤️‍🩹 Accept Donation Request
          </button>

          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default DonorRequestDetails;