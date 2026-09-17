import { useState } from "react";
import { Link } from "react-router-dom";

function EmergencyRequest() {
  const [resources, setResources] = useState({
    blood: false,
    icu: false,
    oxygen: false,
    ambulance: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const toggleResource = (resource) => {
    setResources({
      ...resources,
      [resource]: !resources[resource],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // ================= SUCCESS SCREEN =================

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Emergency Request Created
          </h1>

          <p className="text-slate-600 mt-3">
            MedReach is now searching for the medical resources you requested.
          </p>

          {/* Request ID */}
          <div className="bg-slate-50 rounded-xl p-5 mt-8">

            <p className="text-sm text-slate-500">
              Request ID
            </p>

            <p className="text-xl font-bold text-red-600 mt-1">
              MR-2026-001
            </p>

          </div>

          {/* Status */}
          <div className="text-left mt-8 space-y-4">

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                ✓
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Request Created
                </p>

                <p className="text-sm text-slate-500">
                  Your emergency request has been received.
                </p>
              </div>
            </div>


            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                🔄
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Searching Resources
                </p>

                <p className="text-sm text-slate-500">
                  Finding nearby hospitals, donors and ambulances.
                </p>
              </div>
            </div>


            <div className="flex items-center gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                3
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Resources Confirmed
                </p>

                <p className="text-sm text-slate-500">
                  Waiting for available resources.
                </p>
              </div>
            </div>

          </div>


          <Link
            to="/user/dashboard"
            className="inline-block mt-8 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>
    );
  }


  // ================= REQUEST FORM =================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">

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


      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-red-600 font-semibold text-sm mb-2">
            EMERGENCY ASSISTANCE
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Create Emergency Request
          </h2>

          <p className="text-slate-600 mt-2">
            Select the medical resources you need. MedReach will help coordinate them from one request.
          </p>

        </div>


        <form onSubmit={handleSubmit} className="space-y-8">


          {/* ================= BASIC INFORMATION ================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Emergency Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Emergency Type */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Type
                </label>

                <select
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500"
                >

                  <option value="">
                    Select emergency type
                  </option>

                  <option>
                    Road Accident
                  </option>

                  <option>
                    Medical Emergency
                  </option>

                  <option>
                    Critical Patient
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>


              {/* Priority */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>

                <select
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500"
                >

                  <option value="">
                    Select priority
                  </option>

                  <option>
                    Normal
                  </option>

                  <option>
                    High
                  </option>

                  <option>
                    Critical
                  </option>

                </select>

              </div>


              {/* Location */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Location
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter your current location"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500"
                />

              </div>

            </div>

          </section>


          {/* ================= RESOURCES ================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900">
              Required Medical Resources
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Select all resources required for this emergency.
            </p>


            <div className="space-y-4">


              {/* BLOOD */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.blood
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <label className="flex items-start gap-4 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={resources.blood}
                    onChange={() => toggleResource("blood")}
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🩸
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Blood
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Request compatible blood from nearby verified providers.
                    </p>


                    {resources.blood && (

                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Blood Group
                          </label>

                          <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white">

                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                            <option>O+</option>
                            <option>O-</option>

                          </select>

                        </div>


                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Units Required
                          </label>

                          <input
                            type="number"
                            min="1"
                            placeholder="Number of units"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>

                      </div>

                    )}

                  </div>

                </label>

              </div>


              {/* ICU */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.icu
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <label className="flex items-start gap-4 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={resources.icu}
                    onChange={() => toggleResource("icu")}
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🏥
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        ICU Bed
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Find hospitals with available ICU beds.
                    </p>


                    {resources.icu && (

                      <div className="mt-5">

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          ICU Beds Required
                        </label>

                        <input
                          type="number"
                          min="1"
                          placeholder="Number of beds"
                          className="w-full sm:w-1/2 px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>

                    )}

                  </div>

                </label>

              </div>


              {/* OXYGEN */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.oxygen
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <label className="flex items-start gap-4 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={resources.oxygen}
                    onChange={() => toggleResource("oxygen")}
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🫁
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Oxygen
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Find facilities with available oxygen support.
                    </p>


                    {resources.oxygen && (

                      <div className="mt-5">

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Oxygen Requirement
                        </label>

                        <input
                          type="text"
                          placeholder="Example: 2 oxygen cylinders"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                        />

                      </div>

                    )}

                  </div>

                </label>

              </div>


              {/* AMBULANCE */}

              <div
                className={`border rounded-xl p-5 transition ${
                  resources.ambulance
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200"
                }`}
              >

                <label className="flex items-start gap-4 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={resources.ambulance}
                    onChange={() => toggleResource("ambulance")}
                    className="mt-1 w-5 h-5 accent-red-600"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <span className="text-2xl">
                        🚑
                      </span>

                      <h4 className="font-semibold text-slate-900">
                        Ambulance
                      </h4>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Request an available ambulance for emergency transportation.
                    </p>


                    {resources.ambulance && (

                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pickup Location
                          </label>

                          <input
                            type="text"
                            placeholder="Pickup location"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>


                        <div>

                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Destination
                          </label>

                          <input
                            type="text"
                            placeholder="Hospital / destination"
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg"
                          />

                        </div>

                      </div>

                    )}

                  </div>

                </label>

              </div>

            </div>

          </section>


          {/* ================= ADDITIONAL INFORMATION ================= */}

          <section className="bg-white rounded-2xl border border-slate-200 p-7">

            <h3 className="text-xl font-bold text-slate-900 mb-5">
              Additional Information
            </h3>

            <textarea
              rows="5"
              placeholder="Describe the emergency or provide any additional information..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 resize-none"
            />

          </section>


          {/* ================= SUBMIT ================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-sm text-slate-500">
              Your request will be shared with relevant verified resources.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              🚨 Send Emergency Request
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EmergencyRequest;