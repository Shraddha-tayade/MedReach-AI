function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Create your <span className="text-red-600">MedReach</span> account
          </h1>

          <p className="text-slate-500 mt-2">
            Register to access emergency medical resources
          </p>

        </div>


        {/* Form */}
        <form className="grid md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>

            <input
              type="text"
              placeholder="City / Location"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>


          {/* Role */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Register As
            </label>

            <select
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >

              <option value="">
                Select your role
              </option>

              <option value="patient">
                Patient / Family
              </option>

              <option value="donor">
                Blood Donor
              </option>

              <option value="hospital">
                Hospital
              </option>

              <option value="bloodbank">
                Blood Bank
              </option>

              <option value="ambulance">
                Ambulance / Driver
              </option>

            </select>

          </div>


          {/* Register Button */}
          <div className="md:col-span-2">

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Create Account
            </button>

          </div>

        </form>


        {/* Login */}
        <p className="text-center text-sm text-slate-600 mt-6">

          Already have an account?{" "}

          <a
            href="/login"
            className="text-red-600 font-semibold hover:text-red-700"
          >
            Login
          </a>

        </p>

      </div>

    </div>
  );
}

export default Register;