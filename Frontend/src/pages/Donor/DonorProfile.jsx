
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonorProfile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Donor",
    bloodGroup: "O+",
    phone: "9876543210",
    email: "donor@example.com",
    location: "Aurangabad, Maharashtra",
    lastDonation: "20 Sep 2026",
    nextDonation: "20 Dec 2026",
    totalDonations: 5,
    totalRequests: 7,
  });

  // Sample reliability data for frontend testing
  const reliabilityStats = {
    completedDonations: 5,
    unsuccessfulAcceptedRequests: 1,
    requestsAccepted: 2,
  };

  // Calculate Reliability Score
  const evaluatedRequests =
    reliabilityStats.completedDonations +
    reliabilityStats.unsuccessfulAcceptedRequests;

  const reliabilityScore =
    evaluatedRequests === 0
      ? 0
      : Math.round(
          (reliabilityStats.completedDonations / evaluatedRequests) * 100
        );

  // Update profile information
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile changes
  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/Donor/dashboard")}
        className="mb-6 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        ← Back to Dashboard
      </button>

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          My Profile 👤
        </h1>

        <p className="mt-2 text-slate-600">
          View and update your donor information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              🩸
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {profile.name}
              </h2>

              <p className="mt-1 text-slate-500">
                Registered Blood Donor
              </p>

              <div className="mt-2">
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                  Blood Group: {profile.bloodGroup}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            {editing ? "Cancel Editing" : "✏️ Update Profile"}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your registered donor information.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Full Name
            </label>

            {editing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            ) : (
              <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                {profile.name}
              </div>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Blood Group
            </label>

            <div className="mt-2 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600">
              🩸 {profile.bloodGroup}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Phone Number
            </label>

            {editing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            ) : (
              <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                📞 {profile.phone}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Email Address
            </label>

            {editing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            ) : (
              <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                ✉️ {profile.email}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Location
            </label>

            {editing ? (
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />
            ) : (
              <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                📍 {profile.location}
              </div>
            )}
          </div>
        </div>

        {editing && (
          <button
            onClick={handleSave}
            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            ✓ Save Changes
          </button>
        )}
      </div>

      {/* Donation Information */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          🩸 Donation Information
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Last Donation
            </p>

            <p className="mt-2 font-bold text-slate-800">
              📅 {profile.lastDonation}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-sm text-slate-500">
              Next Eligible Donation
            </p>

            <p className="mt-2 font-bold text-green-700">
              📅 {profile.nextDonation}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-5">
            <p className="text-sm text-slate-500">
              Total Donations
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {profile.totalDonations}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {profile.totalRequests}
            </p>
          </div>
        </div>
      </div>

      {/* Reliability Score - Green Design */}
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        {/* Heading and Percentage */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Reliability Score ⭐
            </h2>

            <p className="mt-2 text-slate-500">
              Your contribution and response history.
            </p>
          </div>

          <span className="text-3xl font-bold text-green-600">
            {reliabilityScore}%
          </span>
        </div>

        {/* Green Progress Bar */}
        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${reliabilityScore}%` }}
          />
        </div>

        {/* Star Rating */}
        <div className="mt-7 text-2xl tracking-widest text-yellow-500">
          ★★★★★
        </div>

        {/* Statistics Cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-3xl font-bold text-slate-800">
              {reliabilityStats.completedDonations}
            </p>

            <p className="mt-1 text-slate-500">
              Donations Completed
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-3xl font-bold text-slate-800">
              {reliabilityStats.requestsAccepted}
            </p>

            <p className="mt-1 text-slate-500">
              Requests Accepted
            </p>
          </div>
        </div>

        {/* Score Calculation Box */}
        <div className="mt-5 rounded-2xl bg-green-50 p-5 text-green-800">
          <p>
            <span className="font-bold">
              Score Calculation:
            </span>{" "}
            {reliabilityStats.completedDonations} completed donations out of{" "}
            {evaluatedRequests} evaluated requests.
          </p>
        </div>

      </div>
    </div>
  );
}

export default DonorProfile;