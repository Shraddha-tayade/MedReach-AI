import { useNavigate } from "react-router-dom";

function DonorAccepted() {
  const navigate = useNavigate();

  const request = {
    id: "REQ-001",
    bloodGroup: "O-",
    units: 2,
    hospital: "City Care Hospital",
    location: "Aurangabad",
    distance: "3.2 km",
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

      {/* Success Message */}
      <div className="mx-auto max-w-4xl">

        <div className="rounded-2xl bg-green-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✅
          </div>

          <h1 className="mt-5 text-3xl font-bold text-green-700">
            Request Accepted!
          </h1>

          <p className="mt-3 text-slate-600">
            Thank you for helping someone in an emergency. ❤️‍🩹
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your donation can make a difference.
          </p>
        </div>

        {/* Request Information */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            🩸 Accepted Request
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Request ID
              </p>
              <p className="mt-2 font-bold text-slate-800">
                {request.id}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-5">
              <p className="text-sm text-slate-500">
                Blood Group
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {request.bloodGroup}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Units Required
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-800">
                {request.units}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Distance
              </p>
              <p className="mt-2 font-bold text-slate-800">
                📍 {request.distance}
              </p>
            </div>

          </div>
        </div>

        {/* Hospital Details */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-2xl">
              🏥
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {request.hospital}
              </h2>

              <p className="mt-1 text-slate-500">
                📍 {request.location}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-5">
            <p className="font-semibold text-blue-800">
              📞 Hospital Emergency Desk
            </p>

            <p className="mt-2 text-sm text-blue-700">
              Please contact the hospital emergency desk for further
              donation instructions.
            </p>
          </div>

        </div>

        {/* Donation Status */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            📋 Donation Status
          </h2>

          <div className="mt-6 space-y-5">

            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                ✓
              </div>

              <div>
                <h3 className="font-bold text-green-700">
                  Request Accepted
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  You have accepted this emergency blood request.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-white">
                2
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Donation Pending
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Waiting for the donation to be completed.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                3
              </div>

              <div>
                <h3 className="font-bold text-slate-500">
                  Donation Completed
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  This will be updated after the hospital confirms the donation.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-bold text-slate-800">
            ⚠️ Important
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Please follow the hospital's instructions and carry a valid
            identification document when you visit for donation.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/Donor/dashboard")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View My Requests
          </button>

        </div>

      </div>
    </div>
  );
}

export default DonorAccepted;
