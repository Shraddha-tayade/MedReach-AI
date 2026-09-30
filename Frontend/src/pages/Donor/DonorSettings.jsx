import { useNavigate } from "react-router-dom";

function DonorSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <button
        onClick={() => navigate("/Donor/dashboard")}
        className="mb-6 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8">
      

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Settings ⚙️
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your donor preferences and account settings.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          🔔 Notification Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage the notifications you receive as a donor.
        </p>

        <div className="mt-6 space-y-4">

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
            <div>
              <h3 className="font-bold text-slate-800">
                Emergency Requests
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Get alerts for nearby emergency blood requests.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
            <div>
              <h3 className="font-bold text-slate-800">
                Donation Reminders
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Receive reminders about your next eligible donation.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5">
            <div>
              <h3 className="font-bold text-slate-800">
                Hospital Updates
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Receive updates about accepted donation requests.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Enabled
            </span>
          </div>

        </div>
      </div>

      {/* Account Settings */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          👤 Account Settings
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <button
            onClick={() => navigate("/Donor/profile")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:bg-slate-50"
          >
            <div className="text-2xl">👤</div>
            <h3 className="mt-3 font-bold text-slate-800">
              Edit Profile
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Update your personal information.
            </p>
          </button>

          <button
            onClick={() => navigate("/Donor/donation-history")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:bg-slate-50"
          >
            <div className="text-2xl">🩸</div>
            <h3 className="mt-3 font-bold text-slate-800">
              Donation History
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              View your previous donations.
            </p>
          </button>

          <button
            onClick={() => navigate("/Donor/notifications")}
            className="rounded-xl border border-slate-200 p-5 text-left transition hover:bg-slate-50"
          >
            <div className="text-2xl">🔔</div>
            <h3 className="mt-3 font-bold text-slate-800">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage your notification preferences.
            </p>
          </button>

        </div>
      </div>

      {/* Privacy and Safety */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          🔐 Privacy & Safety
        </h2>

        <div className="mt-6 rounded-xl bg-green-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="font-bold text-slate-800">
                📍 Live Location
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Your live location is always enabled to find nearby emergency
                blood requests.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
              Always Enabled
            </span>

          </div>
        </div>
      </div>

      {/* Account */}
      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-slate-800">
          Account
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Sign out from your MedReach donor account.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default DonorSettings;