import { Link } from "react-router-dom";

function MedicalResources() {
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
            MEDICAL RESOURCES
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Find Critical Medical Resources
          </h2>

          <p className="text-slate-600 mt-2 max-w-2xl">
            Search for available ICU beds and oxygen resources
            during medical emergencies.
          </p>

        </div>


        {/* ================= RESOURCE OPTIONS ================= */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">

          {/* ICU */}
          <Link
            to="/user/find-icu"
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-red-200 transition"
          >

            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
              🫁
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Find ICU Beds
            </h3>

            <p className="text-slate-600 mt-3 leading-relaxed">
              Search nearby hospitals with available ICU beds
              and check their current availability.
            </p>

            <p className="text-red-600 font-semibold mt-6">
              Find ICU Beds →
            </p>

          </Link>


          {/* Oxygen */}
          <Link
            to="/user/find-oxygen"
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-red-200 transition"
          >

            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
              💨
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Find Oxygen
            </h3>

            <p className="text-slate-600 mt-3 leading-relaxed">
              Find hospitals and medical providers with
              available oxygen resources.
            </p>

            <p className="text-red-600 font-semibold mt-6">
              Find Oxygen →
            </p>

          </Link>

        </div>


        {/* ================= INFORMATION ================= */}
        <div className="mt-10 bg-red-50 border border-red-100 rounded-2xl p-6 max-w-4xl">

          <p className="text-sm text-red-700 leading-relaxed">
            <span className="font-semibold">
              Note:
            </span>{" "}
            Resource availability shown in the current prototype
            is simulated data. It will be connected to verified
            backend resource data in the final system.
          </p>

        </div>

      </main>

    </div>
  );
}

export default MedicalResources;