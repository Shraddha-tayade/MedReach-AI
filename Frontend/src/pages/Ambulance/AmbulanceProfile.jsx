import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultProfile = {
  ambulanceName: "MedReach Ambulance",
  vehicleNumber: "MH-27-AB-1023",
  registrationType: "Public",
  ambulanceType: "Basic Life Support",
  model: "Force Traveller",
  registrationNumber: "MH27 20230012345",
  location: "Amravati, Maharashtra",
  ownerName: "MedReach Ambulance Services",
  contact: "+91 98765 43210",
  email: "ambulance@medreach.com",
  driverName: "Mohammed Ahmed",
  driverContact: "+91 98765 43210",
};

function AmbulanceProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("medreachAmbulanceProfile");

    return savedProfile
      ? JSON.parse(savedProfile)
      : defaultProfile;
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    localStorage.setItem(
      "medreachAmbulanceProfile",
      JSON.stringify(profile)
    );

    // Keep the main ambulance data synchronized
    const existingAmbulance =
      JSON.parse(
        localStorage.getItem("medreachAmbulance")
      ) || {};

    const updatedAmbulance = {
      ...existingAmbulance,
      vehicleNumber: profile.vehicleNumber,
      registrationType: profile.registrationType,
      ambulanceType: profile.ambulanceType,
      model: profile.model,
      location: profile.location,
    };

    localStorage.setItem(
      "medreachAmbulance",
      JSON.stringify(updatedAmbulance)
    );

    setIsEditing(false);
    alert("Profile updated successfully.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MedReach</h1>
            <p className="text-sm text-red-100">Ambulance</p>
          </div>

          <button
            onClick={() => navigate("/Ambulance/dashboard")}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Ambulance Profile
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your ambulance registration and contact information.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-3xl">
              🚑
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {profile.ambulanceName}
              </h3>

              <p className="text-gray-500">
                {profile.vehicleNumber}
              </p>
            </div>

            <span className="ml-auto hidden sm:inline-flex px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
              ✓ Verified
            </span>
          </div>
        </div>

        {/* Ambulance Details */}
        <ProfileSection title="Ambulance Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProfileField
              label="Ambulance Name"
              value={profile.ambulanceName}
              field="ambulanceName"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Vehicle Number"
              value={profile.vehicleNumber}
              field="vehicleNumber"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Registration Type"
              value={profile.registrationType}
              field="registrationType"
              editing={isEditing}
              onChange={handleChange}
              type="select"
              options={["Public", "Private"]}
            />

            <ProfileField
              label="Ambulance Type"
              value={profile.ambulanceType}
              field="ambulanceType"
              editing={isEditing}
              onChange={handleChange}
              type="select"
              options={[
                "Basic Life Support",
                "Advanced Life Support",
                "Patient Transport",
              ]}
            />

            <ProfileField
              label="Vehicle Model"
              value={profile.model}
              field="model"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Registration Number"
              value={profile.registrationNumber}
              field="registrationNumber"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Location"
              value={profile.location}
              field="location"
              editing={isEditing}
              onChange={handleChange}
            />
          </div>
        </ProfileSection>

        {/* Owner Details */}
        <ProfileSection title="Owner / Contact Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProfileField
              label="Owner / Organization"
              value={profile.ownerName}
              field="ownerName"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Contact Number"
              value={profile.contact}
              field="contact"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Email Address"
              value={profile.email}
              field="email"
              editing={isEditing}
              onChange={handleChange}
              inputType="email"
            />
          </div>
        </ProfileSection>

        {/* Driver Details */}
        <ProfileSection title="Assigned Driver">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProfileField
              label="Driver Name"
              value={profile.driverName}
              field="driverName"
              editing={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Driver Contact"
              value={profile.driverContact}
              field="driverContact"
              editing={isEditing}
              onChange={handleChange}
            />
          </div>
        </ProfileSection>

        {/* Verification */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              ✓
            </div>

            <div>
              <h3 className="font-bold text-green-800">
                Ambulance Verified
              </h3>

              <p className="text-sm text-green-700 mt-1">
                Your ambulance registration has been verified by MedReach.
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate("/Ambulance/dashboard")}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Back to Dashboard
        </button>
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

function ProfileSection({ title, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-5">
        {title}
      </h3>

      {children}
    </section>
  );
}

function ProfileField({
  label,
  value,
  field,
  editing,
  onChange,
  type = "input",
  options = [],
  inputType = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </label>

      {editing ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        )
      ) : (
        <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-800 font-medium">
          {value}
        </div>
      )}
    </div>
  );
}

export default AmbulanceProfile;