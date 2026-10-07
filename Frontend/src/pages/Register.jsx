import { Link } from "react-router-dom";

function Register() {
  const roles = [
    {
      id: "patient",
      title: "Patient / Family",
      description: "Find hospitals, blood, ambulances and other emergency resources.",
      icon: "👤",
      path: "/register/patient",
    },
    {
      id: "donor",
      title: "Blood Donor",
      description: "Register as a donor and help patients during emergencies.",
      icon: "🩸",
      path: "/register/donor",
    },
    {
      id: "hospital",
      title: "Hospital",
      description: "Manage hospital resources and respond to emergency requests.",
      icon: "🏥",
      path: "/register/hospital",
    },
    {
      id: "bloodbank",
      title: "Blood Bank",
      description: "Manage blood inventory and emergency blood requests.",
      icon: "🧪",
      path: "/register/bloodbank",
    },
    {
      id: "ambulance",
      title: "Ambulance / Driver",
      description: "Respond to emergency transportation requests.",
      icon: "🚑",
      path: "/register/ambulance",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex justify-center items-center gap-2 mb-8"
        >
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            M
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Med<span className="text-red-600">Reach</span>
          </h1>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Create your MedReach account
            </h2>

            <p className="text-slate-500 mt-3">
              How would you like to use MedReach?
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((role) => (
              <Link
                key={role.id}
                to={role.path}
                className="group border border-slate-200 rounded-2xl p-6 hover:border-red-500 hover:shadow-md transition bg-white"
              >
                <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:bg-red-100 transition">
                  {role.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition">
                  {role.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  {role.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-red-600">
                  Continue →
                </div>
              </Link>
            ))}
          </div>

          {/* Login */}
          <p className="text-center text-sm text-slate-600 mt-10">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Back */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-red-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;