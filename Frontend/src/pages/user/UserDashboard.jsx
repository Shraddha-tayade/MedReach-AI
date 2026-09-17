import { Link } from "react-router-dom";
function UserDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">

            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Med<span className="text-red-600">Reach</span>
            </h1>

          </div>


          {/* User */}
          <div className="flex items-center gap-4">

            <div className="text-right hidden sm:block">

              <p className="text-sm font-semibold text-slate-900">
                Welcome
              </p>

              <p className="text-xs text-slate-500">
                Patient / User
              </p>

            </div>

            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
              U
            </div>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Welcome */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            PATIENT DASHBOARD
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            How can we help you today?
          </h2>

          <p className="text-slate-600 mt-2">
            Find medical resources or create an emergency request.
          </p>

        </div>


        {/* ================= EMERGENCY BUTTON ================= */}
        <div className="bg-red-600 rounded-2xl p-8 text-white mb-10">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <h3 className="text-2xl font-bold mb-2">
                Need Emergency Assistance?
              </h3>

              <p className="text-red-100">
                Request multiple medical resources from one place.
              </p>

            </div>

            <Link
  to="/user/emergency"
  className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition whitespace-nowrap"
>
  Create Emergency Request
</Link>

          </div>

        </div>


        {/* ================= RESOURCE CARDS ================= */}
        <section>

          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Find Medical Resources
          </h3>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Blood */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🩸
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                Find Blood
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Search for available blood groups near you.
              </p>

              <button className="mt-5 text-red-600 font-semibold text-sm">
                Search Blood →
              </button>

            </div>


            {/* Hospital */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🏥
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                Find Hospital
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Find nearby verified hospitals and available resources.
              </p>

              <button className="mt-5 text-red-600 font-semibold text-sm">
                Find Hospitals →
              </button>

            </div>


            {/* ICU / Oxygen */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🫁
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                ICU & Oxygen
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Check available ICU beds and oxygen resources.
              </p>

              <button className="mt-5 text-red-600 font-semibold text-sm">
                Find Resources →
              </button>

            </div>


            {/* Ambulance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                🚑
              </div>

              <h4 className="text-lg font-semibold text-slate-900">
                Find Ambulance
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                Find available ambulances for emergency transportation.
              </p>

              <button className="mt-5 text-red-600 font-semibold text-sm">
                Find Ambulance →
              </button>

            </div>

          </div>

        </section>


        {/* ================= ACTIVE REQUESTS ================= */}
        <section className="mt-12">

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-xl font-bold text-slate-900">
              Active Requests
            </h3>

            <button className="text-red-600 text-sm font-semibold">
              View All
            </button>

          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

            <div className="text-4xl mb-3">
              📋
            </div>

            <h4 className="font-semibold text-slate-900">
              No Active Requests
            </h4>

            <p className="text-sm text-slate-500 mt-2">
              Your emergency requests will appear here.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UserDashboard;