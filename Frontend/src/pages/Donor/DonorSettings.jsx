import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Toggle({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-label={label}
      aria-pressed={enabled}
      className={`relative h-9 w-[70px] shrink-0 rounded-full transition-colors duration-200 ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow-sm transition-all duration-200 ${
          enabled ? "left-[38px]" : "left-1"
        }`}
      />
    </button>
  );
}

function SettingRow({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <Toggle
        enabled={enabled}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

function DonorSettings() {
  const navigate = useNavigate();

  const [emergencyNotifications, setEmergencyNotifications] =
    useState(true);
  const [donationReminders, setDonationReminders] = useState(true);
  const [hospitalUpdates, setHospitalUpdates] = useState(false);

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

      {/* Notification Preferences */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
            🔔
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Notification Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose which notifications you prefer.
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          <SettingRow
            title="Emergency Blood Requests"
            description="Receive notifications about urgent blood requests."
            enabled={emergencyNotifications}
            onChange={setEmergencyNotifications}
          />

          <SettingRow
            title="Donation Reminders"
            description="Receive reminders related to blood donation."
            enabled={donationReminders}
            onChange={setDonationReminders}
          />

          <SettingRow
            title="Hospital Updates"
            description="Receive updates about hospital requests."
            enabled={hospitalUpdates}
            onChange={setHospitalUpdates}
          />
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
            onClick={() => {
              document
                .getElementById("notification-preferences")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
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
          🔐 Privacy &amp; Safety
        </h2>

        <div className="mt-6 rounded-xl bg-green-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-800">
                📍 Live Location
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Your location is requested when you accept a blood
                request. Your current coordinates are captured to help
                coordinate assistance.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
              Location on Request
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