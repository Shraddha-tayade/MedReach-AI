import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorNotifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Urgent Blood Request",
            message: "An O- blood request has been received near your area.",
            time: "10 minutes ago",
            type: "Emergency",
            unread: true,
        },
        {
            id: 2,
            title: "Request Accepted",
            message: "Your demo donation request was accepted successfully.",
            time: "1 hour ago",
            type: "Success",
            unread: true,
        },
        {
            id: 3,
            title: "Donation Reminder",
            message: "Thank you for being a registered blood donor.",
            time: "Yesterday",
            type: "Reminder",
            unread: false,
        },
        {
            id: 4,
            title: "Hospital Update",
            message: "City Care Hospital has updated its emergency request.",
            time: "2 days ago",
            type: "Update",
            unread: false,
        },
    ]);

    const markAllRead = () => {
        setNotifications((items) =>
            items.map((item) => ({ ...item, unread: false }))
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const colors = {
        Emergency: "bg-red-100 text-red-700",
        Success: "bg-green-100 text-green-700",
        Reminder: "bg-blue-100 text-blue-700",
        Update: "bg-orange-100 text-orange-700",
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                <button
                    onClick={() => navigate("/Donor/dashboard")}
                    className="mb-6 rounded-lg border bg-white px-4 py-2 hover:bg-gray-100"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Notifications
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Stay updated with emergency requests and reminders.
                        </p>
                    </div>

                    <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                        {notifications.filter((item) => item.unread).length} Unread
                    </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={markAllRead}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Mark All as Read
                    </button>

                    <button
                        onClick={clearNotifications}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    {notifications.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                            <p className="text-lg font-semibold text-gray-700">
                                No notifications
                            </p>
                            <p className="mt-2 text-gray-500">
                                You are all caught up.
                            </p>
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-xl border bg-white p-5 shadow-sm ${
                                    item.unread
                                        ? "border-red-200"
                                        : "border-gray-100"
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl">
                                        {item.type === "Emergency"
                                            ? "🩸"
                                            : item.type === "Success"
                                            ? "✓"
                                            : item.type === "Reminder"
                                            ? "🔔"
                                            : "🏥"}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-bold text-gray-800">
                                                {item.title}
                                            </h2>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    colors[item.type]
                                                }`}
                                            >
                                                {item.type}
                                            </span>

                                            {item.unread && (
                                                <span className="h-2 w-2 rounded-full bg-red-600" />
                                            )}
                                        </div>

                                        <p className="mt-2 text-sm text-gray-600">
                                            {item.message}
                                        </p>
                                        <p className="mt-3 text-xs text-gray-400">
                                            {item.time}
                                        </p>
                                    </div>

                                    {item.unread && (
                                        <button
                                            onClick={() =>
                                                setNotifications((items) =>
                                                    items.map((notification) =>
                                                        notification.id === item.id
                                                            ? {
                                                                  ...notification,
                                                                  unread: false,
                                                              }
                                                            : notification
                                                    )
                                                )
                                            }
                                            className="shrink-0 text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

               
            </div>
        </div>
    );
}

export default DonorNotifications;