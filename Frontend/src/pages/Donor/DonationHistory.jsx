import { useNavigate } from "react-router-dom";

function DonationHistory() {
  const navigate = useNavigate();

  const donations = [
    {
      id: "DON-005",
      date: "20 Sep 2026",
      hospital: "City Care Hospital",
      bloodGroup: "O+",
      units: 1,
      status: "Completed",
    },
    {
      id: "DON-004",
      date: "15 Aug 2026",
      hospital: "ABC Hospital",
      bloodGroup: "O+",
      units: 1,
      status: "Completed",
    },
    {
      id: "DON-003",
      date: "10 Jul 2026",
      hospital: "LifeLine Hospital",
      bloodGroup: "O+",
      units: 1,
      status: "Completed",
    },
    {
      id: "DON-002",
      date: "05 May 2026",
      hospital: "City Care Hospital",
      bloodGroup: "O+",
      units: 1,
      status: "Completed",
    },
    {
      id: "DON-001",
      date: "12 Mar 2026",
      hospital: "Hope Hospital",
      bloodGroup: "O+",
      units: 1,
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* Back Button */}
      <button
        onClick={() => navigate("/Donor/dashboard")}
        className="mb-6 text-sm font-semibold text-red-600 hover:text-red-700"
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
         
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-800">
          Donation History 🩸
        </h1>

        <p className="mt-2 text-slate-600">
          View your previous blood donations and contribution history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Donations
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            5
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Units Donated
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            5
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Last Donation
          </p>

          <h2 className="mt-2 text-lg font-bold text-slate-800">
            20 Sep 2026
          </h2>
        </div>

      </div>

      {/* Donation Table */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Previous Donations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your completed blood donation records.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Donation ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Hospital
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Blood Group
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Units
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {donations.map((donation) => (
                <tr
                  key={donation.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {donation.id}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {donation.date}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {donation.hospital}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-red-50 px-3 py-1 font-bold text-red-600">
                      {donation.bloodGroup}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {donation.units}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      ✓ {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 p-4 md:hidden">

          {donations.map((donation) => (
            <div
              key={donation.id}
              className="rounded-xl border border-slate-100 p-5"
            >

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {donation.id}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  ✓ Completed
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Date
                  </span>

                  <span className="font-semibold text-slate-700">
                    {donation.date}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Hospital
                  </span>

                  <span className="text-right font-semibold text-slate-700">
                    {donation.hospital}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Blood Group
                  </span>

                  <span className="font-bold text-red-600">
                    {donation.bloodGroup}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Units
                  </span>

                  <span className="font-semibold text-slate-700">
                    {donation.units}
                  </span>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Impact Message */}
      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-slate-800">
          ❤️‍🩹 Your Impact
        </h2>

        <p className="mt-2 leading-6 text-slate-600">
          Every blood donation can help people during emergencies.
          Thank you for contributing to your community and being ready
          to help when someone needs it.
        </p>
      </div>

    </div>
  );
}

export default DonationHistory;
