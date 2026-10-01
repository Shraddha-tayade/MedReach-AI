import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorNotifications() {
  const navigate = useNavigate();

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  const notifications = [
    {
      id: 1,
      title: "Emergency Blood Request",
      message: "An O- blood request is available near you.",
      time: "10 minutes ago",
      type: "Emergency",
    },
    {
      id: 2,
      title: "Donation Request Accepted",
      message: "Your donation request has been accepted by the hospital.",
      time: "1 hour ago",
      type: "Request Update",
    },
    {
      id: 3,
      title: "Donation Reminder",
      message: "You may be eligible for your next blood donation soon.",
      time: "Yesterday",
      type: "Reminder",
    },
    {
      id: 4,
      title: "Hospital Update",
      message: "City Care Hospital has updated the emergency request.",
      time: "2 days ago",
      type: "Hospital",
    },
  ];

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
          Notifications 🔔
        </h1>

        <p className="mt-2 text-slate-600">
          Stay updated about emergency requests and donation activities.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <h2 className="text-xl font-bold text-slate-800">
          Notification Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose how you want to receive important donor updates.
        </p>

        <div className="mt-6 space-y-4">

          {/* Email */}
          <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ✉️
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Email Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Receive emergency requests and donation updates by email.
                </p>
              </div>

            </div>

            <button
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`relative h-7 w-14 rounded-full transition ${
                emailEnabled ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  emailEnabled ? "left-8" : "left-1"
                }`}
              ></span>
            </button>

          </div>

          {/* WhatsApp */}
          <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                💬
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  WhatsApp Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Receive urgent blood request alerts through WhatsApp.
                </p>
              </div>

            </div>

            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`relative h-7 w-14 rounded-full transition ${
                whatsappEnabled ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  whatsappEnabled ? "left-8" : "left-1"
                }`}
              ></span>
            </button>

          </div>

        </div>
      </div>

      {/* Notification List */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recent Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest donor-related updates.
            </p>
          </div>

          <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
            4 New
          </span>

        </div>

        <div className="mt-6 space-y-4">

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-5"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
                    {notification.type === "Emergency"
                      ? "🚨"
                      : notification.type === "Reminder"
                      ? "🩸"
                      : notification.type === "Hospital"
                      ? "🏥"
                      : "✅"}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      {notification.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs font-medium text-slate-400">
                      {notification.time}
                    </p>
                  </div>

                </div>

                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {notification.type}
                </span>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alerts */}
      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              🚨 Emergency Alerts
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Important emergency blood requests will be sent through your
              selected notification channels.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {emailEnabled && (
              <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                ✉️ Email
              </span>
            )}

            {whatsappEnabled && (
              <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                💬 WhatsApp
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default DonorNotifications;