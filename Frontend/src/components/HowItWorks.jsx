function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-8 lg:px-20 bg-white"
    >

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-16">

        <p className="text-red-600 font-semibold mb-3">
          SIMPLE & FAST
        </p>

        <h2 className="text-4xl font-bold text-slate-900 mb-5">
          How MedReach Works
        </h2>

        <p className="text-slate-600 text-lg">
          During an emergency, every second matters.
          MedReach simplifies the process of finding and coordinating
          critical medical resources.
        </p>

      </div>


      {/* Steps */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Step 1 */}
        <div className="text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
            1
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Create a Request
          </h3>

          <p className="text-slate-600">
            Select the medical resources you need,
            such as blood, ICU beds, oxygen or an ambulance.
          </p>

        </div>


        {/* Step 2 */}
        <div className="text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
            2
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Find Resources
          </h3>

          <p className="text-slate-600">
            MedReach searches for nearby verified hospitals,
            blood banks, donors and ambulances.
          </p>

        </div>


        {/* Step 3 */}
        <div className="text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
            3
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            Get Assistance
          </h3>

          <p className="text-slate-600">
            Coordinate with the available resources
            and track your emergency request.
          </p>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;