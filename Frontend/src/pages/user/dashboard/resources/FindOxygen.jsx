import { Link } from "react-router-dom";

function FindOxygen() {
  const providers = [
    {
      id: 1,
      name: "City Care Hospital",
      location: "Amravati",
      availability: "High",
      distance: "2.4 km",
      type: "Hospital Oxygen Supply",
    },
    {
      id: 2,
      name: "LifeLine Medical Center",
      location: "Amravati",
      availability: "Available",
      distance: "4.0 km",
      type: "Medical Oxygen",
    },
    {
      id: 3,
      name: "Hope Oxygen Services",
      location: "Amravati",
      availability: "Limited",
      distance: "5.6 km",
      type: "Oxygen Cylinders",
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
            to="/user/resources"
            className="text-sm font-semibold text-slate-600 hover:text-red-600 transition"
          >
            ← Back to Resources
          </Link>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            OXYGEN AVAILABILITY
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find Oxygen Resources
          </h2>

          <p className="text-slate-600 mt-2">
            Find nearby hospitals and verified providers with oxygen availability.
          </p>

        </div>


        {/* ================= FILTERS ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">

          <div className="grid md:grid-cols-2 gap-5">

            {/* Location */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                placeholder="Enter city or location"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />

            </div>


            {/* Resource Type */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Resource Type
              </label>

              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              >

                <option>
                  Any Oxygen Resource
                </option>

                <option>
                  Medical Oxygen
                </option>

                <option>
                  Oxygen Cylinders
                </option>

                <option>
                  Hospital Oxygen Supply
                </option>

              </select>

            </div>

          </div>


          <button
            type="button"
            className="mt-5 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Search Oxygen
          </button>

        </div>


        {/* ================= RESULTS ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Available Oxygen Resources
            </h3>

            <span className="text-sm text-slate-500">
              {providers.length} providers found
            </span>

          </div>


          <div className="grid lg:grid-cols-3 gap-6">

            {providers.map((provider) => (

              <div
                key={provider.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-red-200 transition"
              >

                {/* Card Top */}
                <div className="flex items-start justify-between mb-5">

                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                    💨
                  </div>


                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      provider.availability === "Limited"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {provider.availability}
                  </span>

                </div>


                {/* Provider */}
                <h4 className="text-lg font-bold text-slate-900">
                  {provider.name}
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  {provider.type}
                </p>


                {/* Details */}
                <div className="mt-5 space-y-3">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="font-semibold text-slate-900">
                      {provider.location}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Distance
                    </span>

                    <span className="font-semibold text-slate-900">
                      {provider.distance}
                    </span>

                  </div>

                </div>


                {/* Action */}
                <button
                  type="button"
                  className="w-full mt-6 border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
                >
                  View Provider
                </button>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default FindOxygen;