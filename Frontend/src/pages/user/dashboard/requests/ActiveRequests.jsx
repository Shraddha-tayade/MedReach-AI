import { Link } from "react-router-dom";

function ActiveRequests() {
  const requests = [
    {
      id: "MR-1001",
      type: "Emergency Medical Request",
      date: "Today, 10:30 AM",
      resources: [
        "Blood: O− (2 Units)",
        "ICU Bed: 1",
        "Ambulance",
      ],
      priority: "High",
      status: "Searching",
    },
    {
      id: "MR-1002",
      type: "Blood Request",
      date: "Today, 12:15 PM",
      resources: [
        "Blood: B+ (1 Unit)",
      ],
      priority: "Medium",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
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


          {/* Back */}
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
            MY REQUESTS
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Active Emergency Requests
          </h2>

          <p className="text-slate-600 mt-2">
            Track the status of your current medical resource requests.
          </p>

        </div>


        {/* ================= REQUESTS ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Current Requests
            </h3>

            <span className="text-sm text-slate-500">
              {requests.length} active requests
            </span>

          </div>


          <div className="space-y-5">

            {requests.map((request) => (

              <div
                key={request.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
              >

                {/* ================= TOP ================= */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h4 className="text-lg font-bold text-slate-900">
                        Request #{request.id}
                      </h4>

                      {/* Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === "Searching"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {request.type} • {request.date}
                    </p>

                  </div>


                  {/* Priority */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                      request.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {request.priority} Priority
                  </span>

                </div>


                {/* ================= RESOURCES ================= */}
                <div className="mt-6">

                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Requested Resources
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {request.resources.map((resource, index) => (

                      <span
                        key={index}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                      >
                        {resource}
                      </span>

                    ))}

                  </div>

                </div>


                {/* ================= BOTTOM ================= */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <p className="text-sm text-slate-500">
                    Request is being processed by available medical providers.
                  </p>


                  <Link
                    to="/user/request-tracking"
                    className="text-red-600 font-semibold text-sm hover:text-red-700 transition whitespace-nowrap"
                  >
                    View Tracking →
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================= CREATE NEW ================= */}
        <div className="mt-10">

          <Link
  to="/user/request-history"
  className="inline-flex items-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
>
  View Request History
</Link>

        </div>

      </main>

    </div>
  );
}

export default ActiveRequests;