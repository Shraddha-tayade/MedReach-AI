import { Link } from "react-router-dom";

function FindHospital() {
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


      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-red-600 mb-2">
            Hospital Resources
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find Hospital
          </h2>

          <p className="text-slate-500 mt-2">
            Find nearby verified hospitals and check available medical resources.
          </p>

        </div>


        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Search Hospitals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Location */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                placeholder="Enter city or area"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
              />

            </div>


            {/* Radius */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Radius
              </label>

              <select
                defaultValue="10"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>

            </div>


            {/* ICU */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                ICU Availability
              </label>

              <select
                defaultValue="any"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
              >
                <option value="any">Any</option>
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>

            </div>


            {/* Oxygen */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Oxygen Availability
              </label>

              <select
                defaultValue="any"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
              >
                <option value="any">Any</option>
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>

            </div>

          </div>


          {/* Search Button */}
          <div className="mt-5">

            <button
              type="button"
              className="w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Search Hospitals
            </button>

          </div>

        </div>


        {/* Results Heading */}
        <div className="flex items-center justify-between mb-5">

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Nearby Hospitals
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Showing verified hospitals near your selected location.
            </p>

          </div>

          <span className="text-sm text-slate-500">
            3 results
          </span>

        </div>


        {/* Hospital 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🏥
              </div>

              <div>

                <h4 className="text-lg font-semibold text-slate-900">
                  City Care Hospital
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 3.2 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    ICU Available
                  </span>

                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Oxygen Available
                  </span>

                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>

              </div>

            </div>


            <Link
              to="/user/hospital-details"
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-center"
            >
              View Details
            </Link>

          </div>

        </div>


        {/* Hospital 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🏥
              </div>

              <div>

                <h4 className="text-lg font-semibold text-slate-900">
                  Lifeline Multispeciality Hospital
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 5.6 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    ICU Available
                  </span>

                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                    Limited Oxygen
                  </span>

                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>

              </div>

            </div>


            <Link
              to="/user/hospital-details"
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-center"
            >
              View Details
            </Link>

          </div>

        </div>


        {/* Hospital 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🏥
              </div>

              <div>

                <h4 className="text-lg font-semibold text-slate-900">
                  Government General Hospital
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 8.4 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    ICU Available
                  </span>

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    Oxygen Available
                  </span>

                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>

              </div>

            </div>


            <Link
              to="/user/hospital-details"
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-center"
            >
              View Details
            </Link>

          </div>

        </div>


        {/* Emergency Information */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

          <h4 className="font-semibold text-red-900">
            Need immediate emergency assistance?
          </h4>

          <p className="text-sm text-red-800 mt-1">
            Use the Emergency Request feature to request a hospital,
            blood, ICU, oxygen, and ambulance assistance together.
          </p>

          <Link
            to="/user/emergency"
            className="inline-block mt-4 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Create Emergency Request →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default FindHospital;