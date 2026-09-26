import { Link } from "react-router-dom";

function Profile() {
  const user = {
    name: "Shraddha",
    email: "shraddha@gmail.com",
    phone: "9876543345",
    city: "Amravati",
    role: "Patient / Family",
  };

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
                {user.name.charAt(0)}
              </div>

              <div>
                <h3 className="text-2xl font-bold">
                  {user.name}
                </h3>

                <p className="text-red-100 mt-1">
                  {user.role}
                </p>
              </div>

            </div>

          </div>


          {/* Personal Information */}
          <div className="p-8">

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Personal Information
            </h3>


            <div className="grid md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Full Name
                </p>

                <p className="text-slate-900 font-medium">
                  {user.name}
                </p>
              </div>


              {/* Email */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Email Address
                </p>

                <p className="text-slate-900 font-medium break-all">
                  {user.email}
                </p>
              </div>


              {/* Phone */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Phone Number
                </p>

                <p className="text-slate-900 font-medium">
                  {user.phone}
                </p>
              </div>


              {/* City */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  City
                </p>

                <p className="text-slate-900 font-medium">
                  {user.city}
                </p>
              </div>


              {/* Role */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Account Type
                </p>

                <p className="text-slate-900 font-medium">
                  {user.role}
                </p>
              </div>


              {/* Verification */}
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">
                  Account Status
                </p>

                <span className="inline-flex px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-semibold">
                  Pending Verification
                </span>
              </div>

            </div>


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
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-red-300 hover:text-red-600 transition"
                >
                  Change Password
                </button>

              </div>

            </div>

          </div>

        </div>


        {/* Prototype Note */}
        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">

          <p className="text-sm text-red-700 leading-relaxed">
            <span className="font-semibold">Prototype note:</span>{" "}
            Profile information is currently static. It will be connected
            to the authenticated user's backend data during API integration.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Profile;