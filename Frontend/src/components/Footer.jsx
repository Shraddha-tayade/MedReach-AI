
function Footer() {
  return (
    <footer
      id="about"
      className="bg-slate-950 text-white px-8 lg:px-20 py-12"
    >

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>

          <h2 className="text-2xl font-bold mb-4">
            Med<span className="text-red-500">Reach</span>
          </h2>

          <p className="text-slate-400 leading-relaxed max-w-sm">
            A smart emergency medical resource platform
            designed to help people find and coordinate
            critical medical assistance quickly.
          </p>

        </div>


        {/* Quick Links */}
        <div>

          <h3 className="font-semibold text-lg mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-slate-400">

            <a href="#home" className="hover:text-white transition">
              Home
            </a>

            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>

          </div>

        </div>


        {/* Emergency */}
        <div>

          <h3 className="font-semibold text-lg mb-4">
            Emergency Assistance
          </h3>

          <p className="text-slate-400 leading-relaxed">
            Need immediate medical assistance?
            Use MedReach to coordinate critical resources.
          </p>

        </div>

      </div>


      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
        © 2026 MedReach. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;