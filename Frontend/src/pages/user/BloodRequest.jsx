import { Link } from "react-router-dom";

function BloodRequest() {
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
            to="/user/find-blood"
            className="text-sm font-medium text-slate-600 hover:text-red-600"
          >
            ← Back to Find Blood
          </Link>

        </div>
      </header>


      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-red-600 mb-2">
            Blood Request
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Request Blood
          </h2>

          <p className="text-slate-500 mt-2">
            Send a blood request to the selected verified blood bank.
          </p>
        </div>


        {/* Selected Blood Bank */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-3xl">
              🩸
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                City Blood Bank
              </h3>

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

        </div>


        {/* Request Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <h3 className="text-xl font-bold text-slate-900 mb-6">
            Request Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Blood Group
              </label>

              <input
                type="text"
                value="O−"
                readOnly
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
              />
            </div>


            {/* Units */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Units Required
              </label>

              <input
                type="number"
                min="1"
                defaultValue="2"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
              />
            </div>


            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Patient Name
              </label>

              <input
                type="text"
                placeholder="Enter patient name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
              />
            </div>


            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Number
              </label>

              <input
                type="tel"
                placeholder="Enter contact number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
              />
            </div>

          </div>


          {/* Hospital */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hospital / Treatment Location
            </label>

            <input
              type="text"
              placeholder="Enter hospital name or treatment location"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
            />

          </div>


          {/* Urgency */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Urgency
            </label>

            <select
              defaultValue="Urgent"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 bg-white"
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Critical</option>
            </select>

          </div>


          {/* Additional Information */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Information
            </label>

            <textarea
              rows="4"
              placeholder="Add any additional information..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 resize-none"
            ></textarea>

          </div>


          {/* Submit */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Send Blood Request
            </button>

            <Link
              to="/user/find-blood"
              className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition text-center"
            >
              Cancel
            </Link>

          </div>

        </div>


        {/* Information */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

          <h4 className="font-semibold text-red-900">
            Important
          </h4>

          <p className="text-sm text-red-800 mt-1">
            This is currently a prototype request. Blood availability
            and request confirmation will be connected to the backend
            in a later stage.
          </p>

        </div>

      </main>

    </div>
  );
}

export default BloodRequest;