import { Link } from "react-router-dom";

function Notifications() {
  const notifications = [
    {
      id: 1,
      icon: "🚑",
      title: "Ambulance Request Update",
      message:
        "An ambulance has been assigned to your emergency request.",
      time: "5 minutes ago",
      type: "Emergency",
      unread: true,
    },
    {
      id: 2,
      icon: "🩸",
      title: "Blood Request Update",
      message:
        "A compatible donor has been found for your blood request.",
      time: "15 minutes ago",
      type: "Blood",
      unread: true,
    },
    {
      id: 3,
      icon: "🏥",
      title: "Hospital Resource Update",
      message:
        "ICU availability has been confirmed at a nearby hospital.",
      time: "1 hour ago",
      type: "Hospital",
      unread: false,
    },
    {
      id: 4,
      icon: "✅",
      title: "Request Created",
      message:
        "Your emergency request MR-1001 has been successfully created.",
      time: "2 hours ago",
      type: "Request",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/user/dashboard"
            className="flex items-center gap-2"
          >
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
      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            UPDATES
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Notifications
          </h2>

          <p className="text-slate-600 mt-2">
            Stay updated about your emergency requests and medical resources.
          </p>

        </div>


        {/* ================= NOTIFICATION HEADER ================= */}
        <div className="flex items-center justify-between mb-5">

          <h3 className="text-xl font-bold text-slate-900">
            Recent Notifications
          </h3>

          <span className="text-sm text-slate-500">
            {notifications.filter((notification) => notification.unread).length} unread
          </span>

        </div>


        {/* ================= NOTIFICATIONS ================= */}
        <div className="space-y-4">

          {notifications.map((notification) => (

            <div
              key={notification.id}
              className={`bg-white border rounded-2xl p-5 transition hover:shadow-md ${
                notification.unread
                  ? "border-red-100"
                  : "border-slate-200"
              }`}
            >

              <div className="flex gap-4">

                {/* Icon */}
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {notification.icon}
                </div>


                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                    <div className="flex items-center gap-2">

                      <h4 className="font-bold text-slate-900">
                        {notification.title}
                      </h4>

                      {notification.unread && (
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      )}

                    </div>

                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {notification.time}
                    </span>

                  </div>


                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {notification.message}
                  </p>


                  <div className="mt-3">

                    <span className="inline-flex px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                      {notification.type}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* ================= PROTOTYPE NOTE ================= */}
        <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-5">

          <p className="text-sm text-red-700 leading-relaxed">
            <span className="font-semibold">Prototype note:</span>{" "}
            Notifications are currently simulated. In the final system,
            notifications will be generated from emergency requests,
            resource updates, and backend status changes.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Notifications;