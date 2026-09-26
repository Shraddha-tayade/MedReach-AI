import { Link } from "react-router-dom";

function FindBlood() {
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

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-red-600 mb-2">
            Blood Resources
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find Blood
          </h2>

          <p className="text-slate-500 mt-2">
            Search for available blood near your location.
          </p>
        </div>


        {/* Search Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Search Blood Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Blood Group
              </label>

              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Select group
                </option>
                <option>O+</option>
                <option>O−</option>
                <option>A+</option>
                <option>A−</option>
                <option>B+</option>
                <option>B−</option>
                <option>AB+</option>
                <option>AB−</option>
              </select>
            </div>


            {/* Units */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Units Required
              </label>

              <input
                type="number"
                min="1"
                placeholder="Enter units"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
              />
            </div>


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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
                defaultValue="10"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>

          </div>


          {/* Search Button */}
          <div className="mt-5">
            <button
              type="button"
              className="w-full md:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Search Blood
            </button>
          </div>

        </div>


        {/* Results */}
        <div className="mb-5 flex items-center justify-between">

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Available Blood
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Showing nearby verified blood resources.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            3 results
          </span>

        </div>


        {/* Result 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🩸
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  City Blood Bank
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 2.4 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                    O−
                  </span>

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    6 Units Available
                  </span>

                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>
              </div>

            </div>


            <button
              type="button"
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Request Blood
            </button>

          </div>

        </div>


        {/* Result 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🩸
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Government Blood Centre
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 4.8 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                    O−
                  </span>

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    3 Units Available
                  </span>

                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>
              </div>

            </div>


            <button
              type="button"
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Request Blood
            </button>

          </div>

        </div>


        {/* Result 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                🩸
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  LifeLine Blood Bank
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Amravati • 7.1 km away
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                    O−
                  </span>

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    2 Units Available
                  </span>

                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Verified
                  </span>

                </div>
              </div>

            </div>


            <Link
                to="/user/blood-request"
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-center"
            >
                Request Blood
            </Link>

          </div>

        </div>


        {/* Information */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

          <h4 className="font-semibold text-red-900">
            Need blood urgently?
          </h4>

          <p className="text-sm text-red-800 mt-1">
            For critical emergencies, use the Emergency Request feature
            to request blood along with hospitals, ICU beds, oxygen,
            or ambulance assistance.
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

export default FindBlood;