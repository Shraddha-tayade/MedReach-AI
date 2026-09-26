import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

import heroImage from "../assets/hero.png";

function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <Navbar />


      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="min-h-[85vh] px-8 lg:px-20 bg-slate-50 flex items-center"
      >

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            <p className="text-red-600 font-semibold tracking-wide mb-4">
              SMART EMERGENCY MEDICAL PLATFORM
            </p>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Emergency help,
              <br />
              <span className="text-red-600">
                when every second matters.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Find critical medical resources and coordinate
              emergency assistance quickly with MedReach.
              Connect with hospitals, blood banks, donors
              and ambulances from one platform.
            </p>


            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

  <Link
    to="/register"
    className="px-7 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
  >
    Request Emergency Help
  </Link>

  <a
    href="/#features"
    className="px-7 py-3.5 border border-slate-300 bg-white text-slate-700 font-semibold rounded-xl hover:border-red-300 hover:text-red-600 transition"
  >
    Explore Resources
  </a>

</div>


            {/* Small info */}
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">

              <span>✓ Verified Resources</span>

              <span>✓ Multiple Resources</span>

              <span>✓ Emergency Support</span>

            </div>

          </div>


          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">

            <div className="relative">

              <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50">
              </div>

              <img
                src={heroImage}
                alt="Medical emergency resource coordination"
                className="relative w-full max-w-lg object-contain"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="py-24 px-8 lg:px-20 bg-slate-50"
      >

        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-red-600 font-semibold mb-3">
              ONE PLATFORM
            </p>

            <h2 className="text-4xl font-bold text-slate-900 mb-5">
              Everything You Need During an Emergency
            </h2>

            <p className="text-slate-600 text-lg">
              Access multiple critical medical resources
              through a single emergency coordination platform.
            </p>

          </div>


          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
  icon="🩸"
  title="Find Blood"
  description="Find available blood resources and compatible donors nearby."
  link="/user/find-blood"
/>

<FeatureCard
  icon="🏥"
  title="Find Hospitals"
  description="Discover verified hospitals and check available medical resources."
  link="/user/find-hospital"
/>

<FeatureCard
  icon="🚑"
  title="Find Ambulance"
  description="Connect with available ambulances for emergency transportation."
  link="/user/find-ambulance"
/>

<FeatureCard
  icon="🚨"
  title="Emergency Coordination"
  description="Create one emergency request for multiple critical resources."
  link="/user/emergency"
/>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <HowItWorks />


      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default Landing;