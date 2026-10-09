import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [available, setAvailable] = useState(true);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1400&q=80",
      title: "Your Blood Can Save a Life ❤️‍🩹",
      text: "One donation can make a meaningful difference to someone in an emergency.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80",
      title: "Be There When Someone Needs You",
      text: "Stay available and respond to nearby emergency blood requests.",
    },
    {
      image:
        "https://images.openai.com/static-rsc-4/FuH1zADLL0gsVSruJkQcCQ1ZMTRJONkTNdIHlz4WsZrCe6AbQyv0T4a1eLLd0zP0NAbZ3vp6a5d49D03WyyryGKgOX20pSBNa8XxmEjJu-GlirS4ggzMB6MeG05CMn9DO1JoNBEAdFolLt-pfMwC4ZgRpuoCm7Q3HElZHcc2z6g?purpose=inline",
      title: "Together, We Can Save Lives ❤️‍🩹",
      text: "Thank you for being a responsible and reliable blood donor.",
    },
  ];

  // Sample requests for frontend testing
  const requests = [
    {
      id: "REQ-001",
      bloodGroup: "O-",
      units: 2,
      hospital: "City Care Hospital",
      location: "Aurangabad",
      distance: "3.2 km",
      priority: "HIGH",
      time: "10 min ago",
    },
    {
      id: "REQ-002",
      bloodGroup: "O+",
      units: 1,
      hospital: "ABC Hospital",
      location: "Aurangabad",
      distance: "5.1 km",
      priority: "URGENT",
      time: "25 min ago",
    },
    {
      id: "REQ-003",
      bloodGroup: "O+",
      units: 2,
      hospital: "City Hospital",
      location: "Aurangabad",
      distance: "6.4 km",
      priority: "HIGH",
      time: "35 min ago",
    },
    {
      id: "REQ-004",
      bloodGroup: "O-",
      units: 1,
      hospital: "Government Hospital",
      location: "Aurangabad",
      distance: "7.2 km",
      priority: "URGENT",
      time: "45 min ago",
    },
    {
      id: "REQ-005",
      bloodGroup: "O+",
      units: 3,
      hospital: "LifeCare Hospital",
      location: "Aurangabad",
      distance: "8.5 km",
      priority: "HIGH",
      time: "1 hour ago",
    },
    {
      id: "REQ-006",
      bloodGroup: "O-",
      units: 2,
      hospital: "Sahyadri Hospital",
      location: "Aurangabad",
      distance: "9.1 km",
      priority: "URGENT",
      time: "1 hour ago",
    },
    {
      id: "REQ-007",
      bloodGroup: "O+",
      units: 1,
      hospital: "Sunrise Hospital",
      location: "Aurangabad",
      distance: "10.2 km",
      priority: "HIGH",
      time: "1 hour ago",
    },
    {
      id: "REQ-008",
      bloodGroup: "O-",
      units: 2,
      hospital: "Hope Medical Centre",
      location: "Aurangabad",
      distance: "11.4 km",
      priority: "URGENT",
      time: "2 hours ago",
    },
  ];

  // Reliability data for frontend testing
  const reliabilityStats = {
    completedDonations: 5,
    unsuccessfulAcceptedRequests: 1,
    requestsAccepted: 2,
  };

  // Reliability Score Calculation
  const evaluatedRequests =
    reliabilityStats.completedDonations +
    reliabilityStats.unsuccessfulAcceptedRequests;

  const reliabilityScore =
    evaluatedRequests === 0
      ? 0
      : Math.round(
          (reliabilityStats.completedDonations / evaluatedRequests) * 100
        );

  // Automatic image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Scroll to emergency requests
  const scrollToRequests = () => {
    document.getElementById("requests")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Open selected request
  const handleViewRequest = (request) => {
    navigate("/Donor/request-details", {
      state: { request },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          {/* Logo */}
          <div className="shrink-0">
            <p className="text-xl font-semibold text-red-600">
              MedReach - Smart Emergency Medical Resource Platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-3">
            {/* Donation History */}
            <button
              onClick={() => navigate("/Donor/donation-history")}
              title="Donation History"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="text-xl">🩸</span>
              <span className="hidden md:inline">
                Donation History
              </span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate("/Donor/notifications")}
              title="Notifications"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="text-xl">🔔</span>
              <span className="hidden md:inline">
                Notifications
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigate("/Donor/settings")}
              title="Settings"
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
            >
              <span className="text-xl">⚙️</span>
              <span className="hidden md:inline">
                Settings
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/Donor/profile")}
              title="Open Profile"
              aria-label="Open profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl transition hover:bg-red-200"
            >
              👤
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* WELCOME */}
        <div className="mb-6">
          <h2 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Welcome, Donor
          </h2>

          <p className="mt-2 text-slate-600">
            Thank you for being available to help someone in need.
          </p>
        </div>

        {/* IMAGE SLIDER */}
        <div className="relative mb-8 h-[360px] overflow-hidden rounded-3xl shadow-lg sm:h-[450px] lg:h-[500px]">
          <img
            src={slides[currentSlide].image}
            alt="Blood donation awareness"
            className="h-full w-full object-cover transition-all duration-700"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <div className="max-w-xl text-white">
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Save Lives
              </span>

              <h2 className="mt-4 text-2xl font-bold sm:text-4xl">
                {slides[currentSlide].title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-100 sm:text-base">
                {slides[currentSlide].text}
              </p>

              <button
                onClick={scrollToRequests}
                className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                View Emergency Requests
              </button>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Blood Group */}
          <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                🩸
              </div>

              <span className="text-xs font-semibold text-green-600">
                Active
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Blood Group
            </p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              O+
            </p>
          </div>

          {/* Donations Completed */}
          <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              ❤️‍🩹
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Donations Completed
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">
              {reliabilityStats.completedDonations}
            </p>
          </div>

          {/* Total Requests */}
          <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📋
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Total Requests
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">
              {requests.length}
            </p>
          </div>

          {/* Reliability Score */}
          <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
              ⭐
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Reliability Score
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-800">
              {reliabilityScore}%
            </p>
          </div>
        </div>

        {/* AVAILABILITY AND DONATION INFORMATION */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Availability */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Donation Availability
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Let hospitals know if you are available.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAvailable(!available)}
                aria-pressed={available}
                aria-label="Toggle donation availability"
                className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                  available ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    available ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div
              className={`mt-6 rounded-xl p-4 ${
                available ? "bg-green-50" : "bg-slate-100"
              }`}
            >
              <p
                className={`font-bold ${
                  available ? "text-green-700" : "text-slate-600"
                }`}
              >
                {available
                  ? "● Available to Donate"
                  : "● Currently Unavailable"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {available
                  ? "You can receive nearby emergency blood requests."
                  : "You will not receive new donation requests."}
              </p>
            </div>
          </div>

          {/* Donation Information */}
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Donation Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep track of your donation eligibility.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Last Donation
                </p>

                <p className="mt-2 text-xl font-bold text-slate-800">
                  20 Sep 2026
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Thank you for helping save a life.
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-5">
                <p className="text-sm text-slate-500">
                  Next Eligible Donation
                </p>

                <p className="mt-2 text-xl font-bold text-red-600">
                  20 Dec 2026
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Confirm eligibility with qualified medical staff.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY BLOOD REQUESTS */}
        <div
          id="requests"
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Nearby Requests
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Emergency Blood Requests 🚨
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Help nearby patients who urgently need your blood group.
            </p>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {requests.length} 
            </p>
          </div>

          {/* Scrollable area */}
          <div className="mt-6 max-h-[470px] space-y-4 overflow-y-auto overscroll-contain pr-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-red-200 hover:bg-red-50/30"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                      🩸
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-800">
                          {request.bloodGroup} Blood Required
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            request.priority === "URGENT"
                              ? "bg-red-600 text-white"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {request.priority}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.units}{" "}
                        {request.units > 1 ? "units" : "unit"} •{" "}
                        {request.hospital}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>📍 {request.distance}</span>
                        <span>🕒 {request.time}</span>
                        <span>🏥 {request.location}</span>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Request ID: {request.id}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewRequest(request)}
                    className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    View Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELIABILITY AND IMPACT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Reliability */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Reliability Score ⭐
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your contribution and response history.
                </p>
              </div>

              <p className="text-3xl font-bold text-green-600">
                {reliabilityScore}%
              </p>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${reliabilityScore}%` }}
              />
            </div>

            {/* Rating Stars */}
            <div className="mt-5 flex gap-1 text-xl text-yellow-500">
              ★ ★ ★ ★ ★
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Donations Completed */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-800">
                  {reliabilityStats.completedDonations}
                </p>

                <p className="text-sm text-slate-500">
                  Donations Completed
                </p>
              </div>

              {/* Requests Accepted */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-800">
                  {reliabilityStats.requestsAccepted}
                </p>

                <p className="text-sm text-slate-500">
                  Requests Accepted
                </p>
              </div>
            </div>

            {/* Score Explanation */}
            <div className="mt-4 rounded-xl bg-green-50 p-4">
              <p className="text-sm text-green-800">
                <span className="font-bold">
                  Score Calculation:
                </span>{" "}
                {reliabilityStats.completedDonations} completed
                donations out of{" "}
                {evaluatedRequests} evaluated requests.
              </p>
            </div>
          </div>

          {/* Impact */}
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              Your Impact
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              Every Donation Matters ❤️‍🩹
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your completed donations can help people during
              critical moments. Keep making a difference by staying
              available.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                🩸
              </div>

              <div>
                <p className="text-2xl font-bold text-red-600">
                  {reliabilityStats.completedDonations} Donations
                </p>

                <p className="text-sm text-slate-500">
                  Lives potentially supported
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MESSAGE */}
        <div className="mt-8 rounded-2xl bg-slate-800 p-6 text-center text-white">
          <p className="text-2xl">❤️‍🩹</p>

          <h2 className="mt-2 text-xl font-bold">
            Thank You for Being a Donor
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Your willingness to donate blood can bring hope to
            someone during their most difficult moment.
          </p>
        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;