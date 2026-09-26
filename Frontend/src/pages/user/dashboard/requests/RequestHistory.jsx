import { Link } from "react-router-dom";

function RequestHistory() {
  const requests = [
    {
      id: "MR-0987",
      type: "Blood Request",
      date: "24 Sep 2026, 11:20 AM",
      resources: "B+ Blood — 1 Unit",
      status: "Completed",
      statusStyle: "bg-green-50 text-green-600",
    },
    {
      id: "MR-0975",
      type: "Emergency Medical Request",
      date: "22 Sep 2026, 4:45 PM",
      resources: "Ambulance + Hospital",
      status: "Completed",
      statusStyle: "bg-green-50 text-green-600",
    },
    {
      id: "MR-0962",
      type: "Blood Request",
      date: "19 Sep 2026, 9:15 AM",
      resources: "O− Blood — 2 Units",
      status: "Cancelled",
      statusStyle: "bg-slate-100 text-slate-600",
    },
    {
      id: "MR-0951",
      type: "ICU Request",
      date: "15 Sep 2026, 2:30 PM",
      resources: "ICU Bed — 1",
      status: "Completed",
      statusStyle: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">
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
            className="text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            REQUEST HISTORY
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Previous Requests
          </h2>

          <p className="text-slate-600 mt-2 max-w-2xl">
            View your previously submitted medical resource and emergency
            requests.
          </p>

        </div>


        {/* ================= SUMMARY ================= */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              4
            </p>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              3
            </p>
          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="text-3xl font-bold text-slate-600 mt-2">
              1
            </p>
          </div>

        </div>


        {/* ================= REQUEST LIST ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Previous Requests
            </h3>

            <span className="text-sm text-slate-500">
              {requests.length} requests
            </span>

          </div>


          <div className="space-y-4">

            {requests.map((request) => (

              <div
                key={request.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* Request Info */}
                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      📋
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="font-bold text-slate-900">
                          Request #{request.id}
                        </h4>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${request.statusStyle}`}
                        >
                          {request.status}
                        </span>

                      </div>

                      <p className="text-sm text-slate-600 mt-1">
                        {request.type}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {request.date}
                      </p>

                    </div>

                  </div>


                  {/* Resource */}
                  <div className="lg:text-right">

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Requested Resources
                    </p>

                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {request.resources}
                    </p>

                  </div>

                </div>


                {/* Bottom */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <p className="text-xs text-slate-400">
                    Request details are currently shown as prototype data.
                  </p>

                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
                  >
                    View Details →
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================= ACTIONS ================= */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            to="/user/active-requests"
            className="inline-flex justify-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
          >
            View Active Requests
          </Link>

          <Link
            to="/user/emergency"
            className="inline-flex justify-center bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            + Create Emergency Request
          </Link>

        </div>


        {/* Prototype Note */}
        <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-5">

          <p className="text-sm text-red-700 leading-relaxed">
            <span className="font-semibold">Prototype note:</span>{" "}
            Request history is currently simulated. In the final system,
            completed and cancelled requests will be retrieved from the
            backend database for the logged-in user.
          </p>

        </div>

      </main>

    </div>
  );
}

export default RequestHistory;