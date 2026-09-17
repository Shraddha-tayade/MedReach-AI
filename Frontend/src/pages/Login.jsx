function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Med<span className="text-red-600">Reach</span>
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back
          </p>

        </div>


        {/* Login Form */}
        <form className="space-y-5">

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


          {/* Password */}
          <div>

            <div className="flex justify-between items-center mb-2">

              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Forgot password?
              </button>

            </div>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Login
          </button>

        </form>


        {/* Register */}
        <p className="text-center text-sm text-slate-600 mt-6">

          Don't have an account?{" "}

          <a
            href="/register"
            className="text-red-600 font-semibold hover:text-red-700"
          >
            Register
          </a>

        </p>

      </div>

    </div>
  );
}

export default Login;