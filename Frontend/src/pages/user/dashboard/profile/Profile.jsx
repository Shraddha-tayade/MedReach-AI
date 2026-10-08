import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  // ================= LOAD USER =================
  useEffect(() => {
    const storedUser = sessionStorage.getItem("medreachUser");

    try {
      const parsedUser = storedUser
        ? JSON.parse(storedUser)
        : null;

      if (parsedUser) {
        setUser(parsedUser);

        setFormData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          city: parsedUser.city || "",
        });
      }
    } catch (error) {
      console.error("Unable to read user data:", error);
    }
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE PROFILE =================
  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
    };

    sessionStorage.setItem(
      "medreachUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditing(false);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    sessionStorage.removeItem("medreachToken");
    sessionStorage.removeItem("medreachUser");
    sessionStorage.removeItem("medreachLastEmergencyRequest");

    navigate("/login");
  };

  const userName = user?.name || "Patient";
  const userRole = user?.role || "Patient / Family";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

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


          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-5xl mx-auto px-8 py-10">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-red-600 font-semibold mb-2">
            MY ACCOUNT
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Profile
          </h2>

          <p className="text-slate-600 mt-2">
            View and manage your personal information.
          </p>

        </div>


        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* Profile Header */}
          <div className="bg-red-600 px-8 py-8 text-white">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="w-20 h-20 bg-white text-red-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {userInitial}
              </div>

              <div>

                <h3 className="text-2xl font-bold">
                  {userName}
                </h3>

                <p className="text-red-100 mt-1">
                  {userRole}
                </p>

              </div>

            </div>

          </div>


          {/* Personal Information */}
          <div className="p-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-slate-900">
                Personal Information
              </h3>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Edit Profile
                </button>
              )}

            </div>


            {editing ? (

              /* ================= EDIT MODE ================= */
              <div className="grid md:grid-cols-2 gap-6">

                {/* Name */}
                <div>

                  <label className="text-sm font-semibold text-slate-500">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="text-sm font-semibold text-slate-500">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />

                </div>


                {/* Phone */}
                <div>

                  <label className="text-sm font-semibold text-slate-500">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />

                </div>


                {/* City */}
                <div>

                  <label className="text-sm font-semibold text-slate-500">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />

                </div>


                {/* Buttons */}
                <div className="md:col-span-2 flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);

                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        city: user?.city || "",
                      });
                    }}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              /* ================= VIEW MODE ================= */
              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    Full Name
                  </p>

                  <p className="text-slate-900 font-medium">
                    {user?.name || "Not available"}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    Email Address
                  </p>

                  <p className="text-slate-900 font-medium break-all">
                    {user?.email || "Not available"}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    Phone Number
                  </p>

                  <p className="text-slate-900 font-medium">
                    {user?.phone || "Not available"}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    City
                  </p>

                  <p className="text-slate-900 font-medium">
                    {user?.city || "Not available"}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    Account Type
                  </p>

                  <p className="text-slate-900 font-medium">
                    {userRole}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    Account Status
                  </p>

                  <span className="inline-flex px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-semibold">
                    Pending Verification
                  </span>
                </div>

              </div>

            )}


            {/* Divider */}
            <div className="border-t border-slate-200 my-8"></div>


            {/* Account Actions */}
            <div>

              <h3 className="text-xl font-bold text-slate-900 mb-5">
                Account Settings
              </h3>

              <div className="flex flex-col sm:flex-row gap-4">

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
                >
                  Logout
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;