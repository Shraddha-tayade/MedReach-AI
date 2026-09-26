import { Link } from "react-router-dom";

function FindAmbulance() {
  const ambulances = [
    {
      id: 1,
      name: "City Care Ambulance",
      type: "Basic Life Support",
      distance: "2.1 km",
      eta: "8 min",
      status: "Available",
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "LifeLine Emergency Services",
      type: "Advanced Life Support",
      distance: "3.4 km",
      eta: "12 min",
      status: "Available",
      phone: "+91 98765 12345",
    },
    {
      id: 3,
      name: "Hope Ambulance Services",
      type: "Patient Transport",
      distance: "5.2 km",
      eta: "18 min",
      status: "Available",
      phone: "+91 99887 66554",
    },
  ];

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
            AMBULANCE SERVICES
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find an Ambulance
          </h2>

          <p className="text-slate-600 mt-2">
            Find available ambulances for emergency transportation near you.
          </p>

        </div>


        {/* ================= SEARCH / FILTER ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">

          <div className="grid md:grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pickup Location
              </label>

              <input
                type="text"
                placeholder="Enter pickup location"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Emergency Type
              </label>

              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              >
                <option>Any Emergency</option>
                <option>Accident</option>
                <option>Medical Emergency</option>
                <option>Patient Transfer</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ambulance Type
              </label>

              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              >
                <option>Any Type</option>
                <option>Basic Life Support</option>
                <option>Advanced Life Support</option>
                <option>Patient Transport</option>
              </select>
            </div>

          </div>


          <button
            type="button"
            className="mt-5 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Search Ambulances
          </button>

        </div>


        {/* ================= RESULTS ================= */}
        <section>

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Available Ambulances
            </h3>

            <span className="text-sm text-slate-500">
              {ambulances.length} ambulances found
            </span>

          </div>


          <div className="grid lg:grid-cols-3 gap-6">

            {ambulances.map((ambulance) => (

              <div
                key={ambulance.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-red-200 transition"
              >

                {/* Icon + Status */}
                <div className="flex items-start justify-between mb-5">

                  <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-3xl">
                    🚑
                  </div>

                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                    {ambulance.status}
                  </span>

                </div>


                {/* Name */}
                <h4 className="text-lg font-bold text-slate-900">
                  {ambulance.name}
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  {ambulance.type}
                </p>


                {/* Details */}
                <div className="mt-5 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Distance
                    </span>

                    <span className="font-semibold text-slate-900">
                      {ambulance.distance}
                    </span>
                  </div>


                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Estimated Arrival
                    </span>

                    <span className="font-semibold text-green-600">
                      {ambulance.eta}
                    </span>
                  </div>

                </div>


                {/* Action */}
                <Link
                  to={`/user/ambulance-details?id=${ambulance.id}`}
                  className="block text-center mt-6 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  View Details
                </Link>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default FindAmbulance;