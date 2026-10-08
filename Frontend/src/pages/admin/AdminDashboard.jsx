import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("medreachToken");
    sessionStorage.removeItem("medreachUser");
    sessionStorage.removeItem("medreachLastEmergencyRequest");

    navigate("/login");
  };

  // ================= STATIC UI DATA =================
  const stats = [
    {
      title: "Total Users",
      value: "248",
      change: "+12 this month",
      icon: "👥",
      bg: "bg-blue-50",
    },
    {
      title: "Hospitals",
      value: "24",
      change: "18 verified",
      icon: "🏥",
      bg: "bg-red-50",
    },
    {
      title: "Blood Banks",
      value: "12",
      change: "10 verified",
      icon: "🩸",
      bg: "bg-pink-50",
    },
    {
      title: "Emergency Requests",
      value: "37",
      change: "8 active",
      icon: "🚨",
      bg: "bg-orange-50",
    },
  ];

  const users = [
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      role: "Patient",
      status: "Active",
    },
    {
      id: 2,
      name: "Sneha Patil",
      email: "sneha@gmail.com",
      role: "Donor",
      status: "Active",
    },
    {
      id: 3,
      name: "Rahul Deshmukh",
      email: "rahul@gmail.com",
      role: "Patient",
      status: "Active",
    },
    {
      id: 4,
      name: "Priya Kulkarni",
      email: "priya@gmail.com",
      role: "Donor",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Rohan Joshi",
      email: "rohan@gmail.com",
      role: "Patient",
      status: "Active",
    },
  ];

  const hospitals = [
    {
      id: 1,
      name: "City Care Hospital",
      city: "Pune",
      contact: "9876543210",
      status: "Verified",
    },
    {
      id: 2,
      name: "Lifeline Multispeciality",
      city: "Mumbai",
      contact: "9876543211",
      status: "Verified",
    },
    {
      id: 3,
      name: "Shree Hospital",
      city: "Nagpur",
      contact: "9876543212",
      status: "Pending",
    },
    {
      id: 4,
      name: "MedLife Hospital",
      city: "Amravati",
      contact: "9876543213",
      status: "Verified",
    },
  ];

  const bloodBanks = [
    {
      id: 1,
      name: "Red Cross Blood Bank",
      city: "Pune",
      contact: "9876500001",
      status: "Verified",
    },
    {
      id: 2,
      name: "Life Blood Centre",
      city: "Mumbai",
      contact: "9876500002",
      status: "Verified",
    },
    {
      id: 3,
      name: "City Blood Bank",
      city: "Nagpur",
      contact: "9876500003",
      status: "Pending",
    },
  ];

  const donors = [
    {
      id: 1,
      name: "Sneha Patil",
      bloodGroup: "O+",
      city: "Pune",
      lastDonation: "12 Aug 2026",
      status: "Available",
    },
    {
      id: 2,
      name: "Karan Shah",
      bloodGroup: "B+",
      city: "Mumbai",
      lastDonation: "02 Jul 2026",
      status: "Available",
    },
    {
      id: 3,
      name: "Anjali More",
      bloodGroup: "A+",
      city: "Nagpur",
      lastDonation: "18 Jun 2026",
      status: "Unavailable",
    },
    {
      id: 4,
      name: "Ritesh Pawar",
      bloodGroup: "AB+",
      city: "Pune",
      lastDonation: "28 Aug 2026",
      status: "Available",
    },
  ];

  const ambulances = [
    {
      id: "AMB-001",
      provider: "City Ambulance Services",
      city: "Pune",
      driver: "Vikas Patil",
      status: "Available",
    },
    {
      id: "AMB-002",
      provider: "Rapid Response",
      city: "Mumbai",
      driver: "Amit Shah",
      status: "On Duty",
    },
    {
      id: "AMB-003",
      provider: "Emergency Care",
      city: "Nagpur",
      driver: "Rahul More",
      status: "Available",
    },
  ];

  const emergencyRequests = [
    {
      id: "#REQ-1024",
      patient: "Aarav Sharma",
      resource: "Blood",
      urgency: "Critical",
      status: "Active",
      time: "10 min ago",
    },
    {
      id: "#REQ-1023",
      patient: "Rahul Deshmukh",
      resource: "ICU",
      urgency: "High",
      status: "Active",
      time: "25 min ago",
    },
    {
      id: "#REQ-1022",
      patient: "Meera Joshi",
      resource: "Oxygen",
      urgency: "High",
      status: "Completed",
      time: "1 hr ago",
    },
    {
      id: "#REQ-1021",
      patient: "Karan Shah",
      resource: "Ambulance",
      urgency: "Critical",
      status: "Active",
      time: "2 hrs ago",
    },
  ];

  // ================= SIDEBAR =================

  const menuItems = [
    { name: "Overview", icon: "📊" },
    { name: "Users", icon: "👥" },
    { name: "Hospitals", icon: "🏥" },
    { name: "Blood Banks", icon: "🩸" },
    { name: "Donors", icon: "❤️" },
    { name: "Ambulances", icon: "🚑" },
    { name: "Emergency Requests", icon: "🚨" },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBloodBanks = bloodBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= STATUS BADGE =================

  const StatusBadge = ({ status }) => {
    let style = "bg-slate-100 text-slate-600";

    if (
      status === "Active" ||
      status === "Verified" ||
      status === "Available"
    ) {
      style = "bg-green-50 text-green-700";
    }

    if (status === "Pending" || status === "On Duty") {
      style = "bg-yellow-50 text-yellow-700";
    }

    if (
      status === "Inactive" ||
      status === "Unavailable" ||
      status === "Completed"
    ) {
      style = "bg-slate-100 text-slate-600";
    }

    if (status === "Critical") {
      style = "bg-red-50 text-red-700";
    }

    if (status === "High") {
      style = "bg-orange-50 text-orange-700";
    }

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${style}`}
      >
        {status}
      </span>
    );
  };

  // ================= OVERVIEW =================

  const Overview = () => (
    <div>

      <div className="mb-8">
        <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">
          Admin Panel
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Dashboard Overview
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor MedReach platform activity and resources.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {stat.change}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>

            </div>
          </div>
        ))}

      </div>


      {/* Recent Requests */}

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl">

        <div className="p-6 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Emergency Requests
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest requests received on the platform.
            </p>
          </div>

          <button
            onClick={() => setActiveSection("Emergency Requests")}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            View all →
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 bg-slate-50">

                <th className="px-6 py-4">Request</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Urgency</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>

            <tbody>

              {emergencyRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {request.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {request.patient}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {request.resource}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={request.urgency} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Quick overview */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="font-bold text-slate-900">
            Platform Summary
          </h3>

          <div className="space-y-4 mt-5">

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Active users
              </span>
              <span className="font-semibold text-slate-900">
                218
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Registered donors
              </span>
              <span className="font-semibold text-slate-900">
                96
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Available ambulances
              </span>
              <span className="font-semibold text-slate-900">
                14
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Pending verifications
              </span>
              <span className="font-semibold text-orange-600">
                7
              </span>
            </div>

          </div>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="font-bold text-slate-900">
            System Status
          </h3>

          <div className="space-y-4 mt-5">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Authentication
              </span>

              <StatusBadge status="Active" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Emergency Requests
              </span>

              <StatusBadge status="Active" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Resource Search
              </span>

              <StatusBadge status="Active" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Admin APIs
              </span>

              <StatusBadge status="Pending" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );


  // ================= USERS =================

  const UsersSection = () => (
    <div>

      <SectionHeader
        title="User Management"
        description="View registered users and their account status."
      />

      <SearchBar />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= HOSPITALS =================

  const HospitalsSection = () => (
    <div>

      <SectionHeader
        title="Hospital Management"
        description="Monitor registered hospitals and verification status."
      />

      <SearchBar />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Hospital</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Verification</th>

              </tr>
            </thead>

            <tbody>

              {filteredHospitals.map((hospital) => (
                <tr
                  key={hospital.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {hospital.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {hospital.city}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {hospital.contact}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={hospital.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= BLOOD BANKS =================

  const BloodBanksSection = () => (
    <div>

      <SectionHeader
        title="Blood Bank Management"
        description="Monitor registered blood banks and verification status."
      />

      <SearchBar />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Blood Bank</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>

            <tbody>

              {filteredBloodBanks.map((bank) => (
                <tr
                  key={bank.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {bank.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {bank.city}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {bank.contact}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={bank.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= DONORS =================

  const DonorsSection = () => (
    <div>

      <SectionHeader
        title="Donor Management"
        description="View registered blood donors and availability."
      />

      <SearchBar />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Last Donation</th>
                <th className="px-6 py-4">Availability</th>

              </tr>
            </thead>

            <tbody>

              {filteredDonors.map((donor) => (
                <tr
                  key={donor.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {donor.name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600">
                      {donor.bloodGroup}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {donor.city}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {donor.lastDonation}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={donor.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= AMBULANCES =================

  const AmbulancesSection = () => (
    <div>

      <SectionHeader
        title="Ambulance Management"
        description="Monitor registered ambulance services."
      />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>

            <tbody>

              {ambulances.map((ambulance) => (
                <tr
                  key={ambulance.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {ambulance.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {ambulance.provider}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {ambulance.city}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {ambulance.driver}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={ambulance.status} />
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= EMERGENCY REQUESTS =================

  const EmergencyRequestsSection = () => (
    <div>

      <SectionHeader
        title="Emergency Requests"
        description="Monitor emergency medical resource requests."
      />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">

                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Urgency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>

              </tr>
            </thead>

            <tbody>

              {emergencyRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {request.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {request.patient}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {request.resource}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={request.urgency} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {request.time}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );


  // ================= COMMON COMPONENTS =================

  const SectionHeader = ({ title, description }) => (
    <div className="mb-7">

      <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">
        Admin Panel
      </p>

      <h1 className="text-3xl font-bold text-slate-900 mt-1">
        {title}
      </h1>

      <p className="text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );


  const SearchBar = () => (
    <div className="mb-5">

      <div className="relative max-w-md">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />

      </div>

    </div>
  );


  // ================= CONTENT SWITCH =================

  const renderContent = () => {

    switch (activeSection) {

      case "Users":
        return <UsersSection />;

      case "Hospitals":
        return <HospitalsSection />;

      case "Blood Banks":
        return <BloodBanksSection />;

      case "Donors":
        return <DonorsSection />;

      case "Ambulances":
        return <AmbulancesSection />;

      case "Emergency Requests":
        return <EmergencyRequestsSection />;

      default:
        return <Overview />;

    }

  };


  return (
    <div className="min-h-screen bg-slate-50 flex">


      {/* ================= MOBILE OVERLAY ================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}

        <div className="h-20 px-6 flex items-center border-b border-slate-200">

          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>

          <h1 className="text-xl font-bold text-slate-900 ml-2">
            Med<span className="text-red-600">Reach</span>
          </h1>

        </div>


        {/* Admin profile */}

        <div className="px-5 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>

            <div>

              <p className="font-semibold text-slate-900 text-sm">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                System Admin
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 py-5 overflow-y-auto">

          <p className="px-3 text-xs font-semibold uppercase text-slate-400 mb-3">
            Management
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => (

              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setActiveSection(item.name);
                  setSearchTerm("");
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  text-sm font-medium transition
                  ${
                    activeSection === item.name
                      ? "bg-red-50 text-red-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </button>

            ))}

          </div>

        </nav>


        {/* Logout */}

        <div className="p-4 border-t border-slate-200">

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >

            <span className="text-lg">
              🚪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 min-w-0">


        {/* Topbar */}

        <header className="h-20 bg-white border-b border-slate-200 px-5 sm:px-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center"
          >
            ☰
          </button>


          <div className="hidden lg:block">

            <p className="text-sm text-slate-500">
              Welcome back,
            </p>

            <p className="font-semibold text-slate-900">
              Administrator
            </p>

          </div>


          <div className="ml-auto flex items-center gap-4">

            <div className="hidden sm:block text-right">

              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </header>


        {/* Page content */}

        <main className="p-5 sm:p-8">

          {renderContent()}

        </main>


        {/* Footer */}

        <footer className="px-8 py-6 border-t border-slate-200 text-center">

          <p className="text-xs text-slate-400">
            MedReach Admin Panel • Smart Emergency Medical Resource Platform
          </p>

        </footer>

      </div>

    </div>
  );
}

export default AdminDashboard;