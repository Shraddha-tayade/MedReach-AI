import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HospitalProfile() {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("medreachUser");

    if (storedUser) {
      try {
        setHospital(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to read hospital data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("medreachToken");
    sessionStorage.removeItem("medreachUser");

    navigate("/login");
  };

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>

          <p className="text-gray-600 mt-4">
            Loading hospital profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/Hospital/dashboard")}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              ← Back
            </button>

            <div className="h-7 w-px bg-gray-300"></div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MedReach
              </h1>

              <p className="text-xs text-gray-500">
                Hospital Portal
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Page Heading */}
        <div className="mb-8">

          <p className="text-red-600 font-semibold text-sm uppercase tracking-wide">
            Hospital Account
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            Hospital Profile
          </h2>

          <p className="text-gray-600 mt-2">
            View your registered hospital information.
          </p>

        </div>

        {/* Profile Header */}
        <div className="bg-red-600 rounded-2xl p-8 text-white shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            <div className="w-20 h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-3xl font-bold">
              {(
                hospital.hospital_name ||
                hospital.name ||
                "H"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h3 className="text-2xl font-bold">
                {hospital.hospital_name ||
                  hospital.name ||
                  "Hospital"}
              </h3>

              <p className="text-red-100 mt-1">
                Hospital Account
              </p>

              <p className="text-red-100 text-sm mt-2">
                ID:{" "}
                {hospital.hospital_id ||
                  hospital.id ||
                  "N/A"}
              </p>

            </div>

          </div>

        </div>

        {/* Personal / Account Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 p-6">

          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <ProfileField
              label="Hospital Name"
              value={
                hospital.hospital_name ||
                hospital.name
              }
            />

            <ProfileField
              label="Hospital ID"
              value={
                hospital.hospital_id ||
                hospital.id
              }
            />

            <ProfileField
              label="Email"
              value={
                hospital.email ||
                hospital.email_address
              }
            />

            <ProfileField
              label="Phone"
              value={
                hospital.phone ||
                hospital.phone_number ||
                hospital.contact_number
              }
            />

            <ProfileField
              label="Role"
              value={
                hospital.role ||
                "Hospital"
              }
              capitalize
            />

            <ProfileField
              label="Account Status"
              value={
                hospital.status ||
                "Active"
              }
              status
            />

          </div>

        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 p-6">

          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Hospital Location
          </h3>

          <div className="space-y-5">

            <ProfileField
              label="Address"
              value={
                hospital.address ||
                hospital.address_line ||
                hospital.location
              }
              full
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <ProfileField
                label="City"
                value={hospital.city}
              />

              <ProfileField
                label="State"
                value={hospital.state}
              />

              <ProfileField
                label="Pincode"
                value={
                  hospital.pincode ||
                  hospital.postal_code
                }
              />

            </div>

          </div>

        </div>

        {/* Network Status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 p-6">

          <h3 className="text-xl font-bold text-gray-900 mb-5">
            MedReach Network
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <StatusCard
              title="Emergency Network"
              status="Connected"
            />

            <StatusCard
              title="Resource Monitoring"
              status="Active"
            />

            <StatusCard
              title="Hospital Portal"
              status="Operational"
            />

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">

          <button
            onClick={() => navigate("/Hospital/dashboard")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">

        <div className="max-w-7xl mx-auto px-6 py-5 text-center">

          <p className="text-sm text-gray-500">
            MedReach • Smart Emergency Medical Resource Platform
          </p>

        </div>

      </footer>

    </div>
  );
}

/* Profile Field */
function ProfileField({
  label,
  value,
  full = false,
  capitalize = false,
  status = false,
}) {
  return (
    <div className={full ? "w-full" : ""}>

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p
        className={`font-semibold ${
          status
            ? "text-green-600"
            : "text-gray-900"
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value || "Not available"}
      </p>

    </div>
  );
}

/* Status Card */
function StatusCard({ title, status }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <div className="flex items-center gap-2 mt-2">

        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

        <span className="font-semibold text-green-600">
          {status}
        </span>

      </div>

    </div>
  );
}