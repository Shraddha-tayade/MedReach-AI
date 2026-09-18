import { Link } from "react-router-dom";

function HospitalDetails() {
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
            to="/user/find-hospital"
            className="text-sm font-medium text-slate-600 hover:text-red-600"
          >
            ← Back to Hospitals
          </Link>

        </div>
      </header>


      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Hospital Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-4xl">
              🏥
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-3xl font-bold text-slate-900">
                  City Care Hospital
                </h2>

                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  Verified
                </span>

              </div>

              <p className="text-slate-500 mt-2">
                Amravati • 3.2 km away
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Multispeciality Emergency Care Hospital
              </p>

            </div>

          </div>

        </div>


        {/* Available Resources */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Available Resources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ICU */}
            <div className="border border-slate-200 rounded-xl p-5">

              <div className="text-3xl mb-3">
                🛏️
              </div>

              <h4 className="font-semibold text-slate-900">
                ICU Beds
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Available beds
              </p>

              <p className="text-2xl font-bold text-green-600 mt-3">
                4
              </p>

            </div>


            {/* Oxygen */}
            <div className="border border-slate-200 rounded-xl p-5">

              <div className="text-3xl mb-3">
                🫁
              </div>

              <h4 className="font-semibold text-slate-900">
                Oxygen Support
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Oxygen facility
              </p>

              <p className="text-lg font-bold text-green-600 mt-3">
                Available
              </p>

            </div>


            {/* Ambulance */}
            <div className="border border-slate-200 rounded-xl p-5">

              <div className="text-3xl mb-3">
                🚑
              </div>

              <h4 className="font-semibold text-slate-900">
                Ambulance
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Emergency transport
              </p>

              <p className="text-lg font-bold text-green-600 mt-3">
                Available
              </p>

            </div>

          </div>

        </div>


        {/* Hospital Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Address */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Hospital Information
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-slate-500">
                  Address
                </p>

                <p className="font-medium text-slate-800 mt-1">
                  Main Road, Amravati, Maharashtra
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Emergency Department
                </p>

                <p className="font-medium text-green-600 mt-1">
                  Open 24 × 7
                </p>
              </div>

            </div>

          </div>


          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Contact
            </h3>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-slate-500">
                  Emergency Contact
                </p>

                <p className="font-medium text-slate-800 mt-1">
                  +91 XXXXX XXXXX
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Available Services
                </p>

                <p className="font-medium text-slate-800 mt-1">
                  Emergency • ICU • Oxygen • Ambulance
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Need assistance from this hospital?
          </h3>

          <p className="text-sm text-slate-500 mb-5">
            You can create an emergency request for multiple resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              to="/user/emergency"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-center"
            >
              Create Emergency Request
            </Link>

            <Link
              to="/user/find-hospital"
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition text-center"
            >
              Back to Search
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default HospitalDetails;