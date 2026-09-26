import { Link } from "react-router-dom";

function AmbulanceDetails() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/user/dashboard" className="flex items-center gap-2">

            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Med<span className="text-red-600">Reach</span>
            </h1>

          </Link>


          <Link
            to="/user/find-ambulance"
            className="text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            ← Back to Ambulances
          </Link>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-red-600 font-semibold mb-2">
            AMBULANCE DETAILS
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            City Care Ambulance
          </h2>

          <p className="text-slate-600 mt-2">
            Basic Life Support Ambulance
          </p>

        </div>


        {/* ================= DETAILS CARD ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row gap-8">

            {/* Icon */}
            <div className="w-28 h-28 bg-orange-50 rounded-2xl flex items-center justify-center text-6xl shrink-0">
              🚑
            </div>


            {/* Information */}
            <div className="flex-1">

              <div className="flex items-center gap-3 mb-4">

                <h3 className="text-2xl font-bold text-slate-900">
                  City Care Ambulance
                </h3>

                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                  Available
                </span>

              </div>


              <p className="text-slate-600 leading-relaxed">
                This ambulance is currently available for emergency
                transportation and patient transfer.
              </p>


              {/* Information Grid */}
              <div className="grid sm:grid-cols-2 gap-5 mt-7">

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Ambulance Type
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    Basic Life Support
                  </p>
                </div>


                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Distance
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    2.1 km
                  </p>
                </div>


                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Estimated Arrival
                  </p>

                  <p className="font-semibold text-green-600 mt-1">
                    8 minutes
                  </p>
                </div>


                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Contact
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    +91 98765 43210
                  </p>
                </div>

              </div>


              {/* ================= ACTIONS ================= */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">

                <button
                  type="button"
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  Request Ambulance
                </button>

                <button
                  type="button"
                  className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
                >
                  Call Ambulance
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* ================= NOTE ================= */}
        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">

          <p className="text-sm text-red-700">
            <span className="font-semibold">
              Note:
            </span>{" "}
            Ambulance availability, distance and estimated arrival time
            will be connected to real-time backend data in the final system.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AmbulanceDetails;