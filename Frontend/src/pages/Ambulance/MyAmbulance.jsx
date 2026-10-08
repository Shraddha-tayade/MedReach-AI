import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultAmbulance = {
  vehicleNumber: "MH-27-AB-1023",
  registrationType: "Public",
  ambulanceType: "Basic Life Support",
  model: "Force Traveller",
  location: "Amravati, Maharashtra",
  verification: "Verified",
};

function MyAmbulance() {
  const navigate = useNavigate();

  const [ambulance] = useState(() => {
    const savedAmbulance = localStorage.getItem("medreachAmbulance");

    return savedAmbulance
      ? JSON.parse(savedAmbulance)
      : defaultAmbulance;
  });

  const driver = {
    name: "Mohammed Ahmed",
    license: "MH27 20230012345",
    contact: "+91 98765 43210",
  };

  const equipment = [
    {
      name: "First Aid Kit",
      icon: "🩹",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      name: "Oxygen Cylinder",
      icon: "🫁",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      name: "Stretcher",
      icon: "🛏️",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      name: "Wheelchair",
      icon: "♿",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      name: "BP Monitor",
      icon: "❤️",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      name: "Pulse Oximeter",
      icon: "🩺",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MedReach</h1>
            <p className="text-sm text-red-100">Ambulance</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/Ambulance/dashboard")}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/Ambulance/profile")}
              className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            My Ambulance
          </h2>

          <p className="text-gray-500 mt-1">
            View your registered ambulance information and service details.
          </p>
        </div>

        {/* Ambulance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-3xl">
                🚑
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {ambulance.vehicleNumber}
                </h3>

                <p className="text-gray-500 mt-1">
                  {ambulance.ambulanceType}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                ✓ {ambulance.verification}
              </span>

              <span className="px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-100 text-sm font-semibold">
                {ambulance.registrationType}
              </span>
            </div>
          </div>
        </div>

        {/* Ambulance Information */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ambulance Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <InfoCard
              title="Vehicle Number"
              value={ambulance.vehicleNumber}
            />

            <InfoCard
              title="Registration Type"
              value={ambulance.registrationType}
            />

            <InfoCard
              title="Ambulance Type"
              value={ambulance.ambulanceType}
            />

            <InfoCard
              title="Vehicle Model"
              value={ambulance.model}
            />
          </div>
        </section>

        {/* Location */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Current Location
          </h3>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xl">
                📍
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Registered Location
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  {ambulance.location}
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
              ● Location Active
            </span>
          </div>
        </section>

        {/* Driver Information */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Assigned Driver
          </h3>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InfoCard
                title="Driver Name"
                value={driver.name}
              />

              <InfoCard
                title="Driving License"
                value={driver.license}
              />

              <InfoCard
                title="Contact Number"
                value={driver.contact}
              />
            </div>
          </div>
        </section>

        {/* Equipment */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Available Equipment
          </h3>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div
                    className={`w-11 h-11 rounded-lg ${item.bg} ${item.text} flex items-center justify-center text-xl`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Available
                    </p>
                  </div>

                  <div className="ml-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Maintenance */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Maintenance
          </h3>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    🔧
                  </div>

                  <p className="text-sm text-gray-500">
                    Last Service
                  </p>
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  15 September 2026
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    📅
                  </div>

                  <p className="text-sm text-gray-500">
                    Next Service
                  </p>
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  15 December 2026
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    ✓
                  </div>

                  <p className="text-sm text-gray-500">
                    Maintenance Status
                  </p>
                </div>

                <span className="inline-flex px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                  Good Condition
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Service Statistics */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Service Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Completed Trips */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Completed Trips
                </p>

                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  🚑
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                24
              </p>
            </div>

            {/* Requests Received */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Requests Received
                </p>

                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  📋
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                31
              </p>
            </div>

            {/* Verification */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Verification
                </p>

                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  ✓
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/Ambulance/dashboard")}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-sm text-gray-500">
          MedReach • Emergency Medical Transport
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>

      <p className="text-base font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default MyAmbulance;