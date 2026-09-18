import { Link } from "react-router-dom";

function RequestTracking() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <Link to="/user/dashboard" className="flex items-center gap-2">
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


        {/* Request Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-slate-500">
                Request ID
              </p>

              <h3 className="text-xl font-bold text-slate-900 mt-1">
                MR-2026-001
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Searching Resources
            </div>

          </div>

        </div>


        {/* Request Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Emergency Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Emergency Type
            </p>

            <p className="text-lg font-semibold text-slate-900">
              Road Accident
            </p>
          </div>


          {/* Priority */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Priority
            </p>

            <span className="inline-flex bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
              Critical
            </span>
          </div>


          {/* Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-2">
              Location
            </p>

            <p className="text-lg font-semibold text-slate-900">
              Amravati
            </p>
          </div>

        </div>


        {/* Required Resources */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Required Resources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Blood */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="text-3xl mb-3">🩸</div>

              <h4 className="font-semibold text-slate-900">
                Blood
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                O− Blood
              </p>

              <p className="text-sm font-medium text-slate-700 mt-2">
                2 Units Required
              </p>
            </div>


            {/* ICU */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="text-3xl mb-3">🏥</div>

              <h4 className="font-semibold text-slate-900">
                ICU Bed
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Intensive Care Unit
              </p>

              <p className="text-sm font-medium text-slate-700 mt-2">
                1 Bed Required
              </p>
            </div>


            {/* Ambulance */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="text-3xl mb-3">🚑</div>

              <h4 className="font-semibold text-slate-900">
                Ambulance
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Emergency Transport
              </p>

              <p className="text-sm font-medium text-slate-700 mt-2">
                Required
              </p>
            </div>

          </div>

        </div>


        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <h3 className="text-xl font-bold text-slate-900 mb-7">
            Request Progress
          </h3>

          <div className="space-y-7">

            {/* Step 1 */}
            <div className="flex items-start gap-4">

              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shrink-0">
                ✓
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  Request Created
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Your emergency request has been successfully created.
                </p>
              </div>

            </div>


            {/* Step 2 */}
            <div className="flex items-start gap-4">

              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold shrink-0">
                ✓
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  Searching Hospitals
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Looking for nearby hospitals with available resources.
                </p>
              </div>

            </div>


            {/* Step 3 */}
            <div className="flex items-start gap-4">

              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                3
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  Finding Blood / Donor
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Searching for compatible blood and available donors.
                </p>

              </div>

            </div>


            {/* Step 4 */}
            <div className="flex items-start gap-4">

              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold shrink-0">
                4
              </div>

              <div>
                <h4 className="font-semibold text-slate-400">
                  Ambulance Assigned
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  Waiting for an available ambulance.
                </p>
              </div>

            </div>


            {/* Step 5 */}
            <div className="flex items-start gap-4">

              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold shrink-0">
                5
              </div>

              <div>
                <h4 className="font-semibold text-slate-400">
                  Request Fulfilled
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  All required resources have been arranged.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Matched Resources */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Matched Resources
            </h3>

            <span className="text-sm text-slate-500">
              3 results
            </span>

          </div>


          <div className="space-y-4">

            {/* Hospital */}
            <div className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                  🏥
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    City Care Hospital
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    ICU Available • 3.2 km away
                  </p>

                  <span className="inline-block mt-2 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                    Verified
                  </span>
                </div>

              </div>

              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                View Details
              </button>

            </div>


            {/* Blood Bank */}
            <div className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                  🩸
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    City Blood Bank
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    O− Available • 4.1 km away
                  </p>

                  <span className="inline-block mt-2 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                    Verified
                  </span>
                </div>

              </div>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Request Blood
              </button>

            </div>


            {/* Ambulance */}
            <div className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                  🚑
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    QuickAid Ambulance
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Available • 2.5 km away
                  </p>

                  <span className="inline-block mt-2 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                    Available
                  </span>
                </div>

              </div>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Assign Ambulance
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default RequestTracking;