import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [icuInventory, setIcuInventory] = useState(null);
  const [oxygenInventory, setOxygenInventory] = useState(null);
  const [bloodRequests, setBloodRequests] = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("medreachUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setHospital(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid hospital session:", error);
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem("medreachToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const [
        emergencyResult,
        icuResult,
        oxygenResult,
        bloodResult,
      ] = await Promise.allSettled([
        fetch(
          `${API_BASE_URL}/api/hospital/emergency-bed-requests`,
          {
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/hospital/icu-inventory`,
          {
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/hospital/oxygen-inventory`,
          {
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/api/hospital/blood-requests`,
          {
            headers,
          }
        ),
      ]);

      /* =========================
         EMERGENCY REQUESTS
      ========================= */

      if (emergencyResult.status === "fulfilled") {
        const response = emergencyResult.value;
        const data = await response.json();

        if (response.ok) {
          const requests = Array.isArray(data)
            ? data
            : data.requests || [];

          setEmergencyRequests(requests);
        }
      }

      /* =========================
         ICU INVENTORY
      ========================= */

      if (icuResult.status === "fulfilled") {
        const response = icuResult.value;
        const data = await response.json();

        if (response.ok) {
          setIcuInventory(
            data.inventory ||
              data.data ||
              data
          );
        } else {
          // Temporary frontend fallback
          // until backend ICU inventory is fixed.
          setIcuInventory({
            total_beds: 10,
            available_beds: 8,
            reserved_beds: 0,
            occupied_beds: 2,
            status: "AVAILABLE",
          });
        }
      }

      /* =========================
         OXYGEN INVENTORY
      ========================= */

      if (oxygenResult.status === "fulfilled") {
        const response = oxygenResult.value;
        const data = await response.json();

        if (response.ok) {
          setOxygenInventory(
            data.inventory ||
              data.data ||
              data
          );
        }
      }

      /* =========================
         BLOOD REQUESTS
      ========================= */

      if (bloodResult.status === "fulfilled") {
        const response = bloodResult.value;
        const data = await response.json();

        if (response.ok) {
          const requests = Array.isArray(data)
            ? data
            : data.requests ||
              data.bloodRequests ||
              data.history ||
              [];

          setBloodRequests(requests);
        }
      }
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error
      );
    }
  };

  /* =========================
     DASHBOARD VALUES
  ========================= */

  const emergencyCount =
    emergencyRequests.length;

  const pendingEmergencyRequests =
    emergencyRequests.filter((request) => {
      const status = String(
        request.response_status ||
          request.item_status ||
          request.request_status ||
          ""
      ).toUpperCase();

      return (
        status === "PENDING" ||
        status === "" ||
        status === "ACTIVE"
      );
    }).length;

  const icuTotal = Number(
    icuInventory?.total_beds ?? 10
  );

  const icuAvailable = Number(
    icuInventory?.available_beds ?? 8
  );

  const oxygenTotal = Number(
    oxygenInventory?.total_beds ?? 5
  );

  const oxygenAvailable = Number(
    oxygenInventory?.available_beds ?? 4
  );

  const bloodRequestCount =
    bloodRequests.length;

  // Temporary ambulance values
  const ambulanceTotal = 3;
  const ambulanceAvailable = 2;

  const icuPercentage =
    icuTotal > 0
      ? Math.round(
          (icuAvailable / icuTotal) * 100
        )
      : 0;

  const oxygenPercentage =
    oxygenTotal > 0
      ? Math.round(
          (oxygenAvailable / oxygenTotal) * 100
        )
      : 0;

  const hospitalName =
    hospital?.hospital_name ||
    hospital?.hospitalName ||
    hospital?.name ||
    "City Care Hospital";

  const hospitalId =
    hospital?.hospital_id ||
    hospital?.id ||
    "—";

  const city =
    hospital?.city ||
    hospital?.location ||
    "Maharashtra";

  const logout = () => {
    sessionStorage.removeItem("medreachToken");
    sessionStorage.removeItem("medreachUser");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================
          TOP NAVIGATION
      ================================== */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-200">

              <span className="text-white text-xl font-black">
                M
              </span>

            </div>

            <div>

              <h1 className="text-xl font-black text-gray-900">
                Med<span className="text-red-600">
                  Reach
                </span>
              </h1>

              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Hospital Portal
              </p>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="flex items-center gap-3">

            <div className="hidden md:flex items-center gap-2 mr-3">

              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              <span className="text-xs text-gray-500">
                System Operational
              </span>

            </div>

            <button
              onClick={() =>
                navigate("/Hospital/profile")
              }
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:text-red-600 transition text-sm font-medium"
            >
              My Profile
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ==================================
            WELCOME CARD
        ================================== */}

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white p-7 mb-8 shadow-lg shadow-red-100">

          {/* Decorative circles */}

          <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-white/10"></div>

          <div className="absolute right-20 -bottom-24 w-48 h-48 rounded-full bg-white/5"></div>

          <div className="relative z-10">

            <p className="text-red-100 text-sm font-semibold uppercase tracking-widest">
              Welcome Back
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Welcome to {hospitalName}
            </h2>

            <p className="text-red-100 mt-3">
              Hospital ID: {hospitalId}
              <span className="mx-2">•</span>
              {city}
            </p>

            <div className="flex items-center gap-2 mt-5">

              <span className="w-2.5 h-2.5 rounded-full bg-green-300"></span>

              <span className="text-sm text-red-50">
                Connected to MedReach Emergency Network
              </span>

            </div>

          </div>

        </section>

        {/* ==================================
            OVERVIEW
        ================================== */}

        <section className="mb-8">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h3 className="text-xl font-bold text-gray-900">
                Hospital Overview
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Current emergency and resource status
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <OverviewCard
              title="Emergency Requests"
              value={String(
                emergencyCount
              ).padStart(2, "0")}
              description={
                pendingEmergencyRequests > 0
                  ? `${pendingEmergencyRequests} pending`
                  : "No pending requests"
              }
              icon="🚨"
              onClick={() =>
                navigate(
                  "/Hospital/emergency-requests"
                )
              }
            />

            <OverviewCard
              title="ICU Beds"
              value={`${icuAvailable}/${icuTotal}`}
              description="Beds available"
              icon="🏥"
              onClick={() =>
                navigate(
                  "/Hospital/bed-management"
                )
              }
            />

            <OverviewCard
              title="Oxygen Beds"
              value={`${oxygenAvailable}/${oxygenTotal}`}
              description="Beds available"
              icon="🫁"
              onClick={() =>
                navigate(
                  "/Hospital/bed-management"
                )
              }
            />

            <OverviewCard
              title="Ambulances"
              value={`${ambulanceAvailable}/${ambulanceTotal}`}
              description="Available fleet"
              icon="🚑"
              onClick={() =>
                navigate(
                  "/Hospital/ambulance"
                )
              }
            />

          </div>

        </section>

        {/* ==================================
            RESOURCE & EMERGENCY STATUS
        ================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* RESOURCE STATUS */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Resource Status
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Current bed availability
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/Hospital/bed-management"
                  )
                }
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Manage →
              </button>

            </div>

            <ResourceBar
              title="ICU Beds"
              available={icuAvailable}
              total={icuTotal}
              percentage={icuPercentage}
            />

            <div className="mt-7">

              <ResourceBar
                title="Oxygen Beds"
                available={oxygenAvailable}
                total={oxygenTotal}
                percentage={oxygenPercentage}
              />

            </div>

          </div>

          {/* EMERGENCY / NETWORK STATUS */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Emergency Status
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Current hospital activity
                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                ONLINE
              </span>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <StatusBox
                label="Emergency Requests"
                value={emergencyCount}
                color="red"
              />

              <StatusBox
                label="Pending"
                value={pendingEmergencyRequests}
                color="amber"
              />

              <StatusBox
                label="Blood Requests"
                value={bloodRequestCount}
                color="red"
              />

              <StatusBox
                label="Ambulances Available"
                value={ambulanceAvailable}
                color="green"
              />

            </div>

          </div>

        </section>

        {/* ==================================
            QUICK ACTIONS
        ================================== */}

        <section className="mb-8">

          <div className="mb-5">

            <h3 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage your hospital operations
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <ActionCard
              title="Emergency Requests"
              description="Review and respond to emergency cases"
              icon="🚨"
              onClick={() =>
                navigate(
                  "/Hospital/emergency-requests"
                )
              }
            />

            <ActionCard
              title="Bed Management"
              description="Manage ICU and oxygen bed inventory"
              icon="🛏️"
              onClick={() =>
                navigate(
                  "/Hospital/bed-management"
                )
              }
            />

            <ActionCard
              title="Blood Requests"
              description="Create and track blood requirements"
              icon="🩸"
              onClick={() =>
                navigate(
                  "/Hospital/blood-requests"
                )
              }
            />

            <ActionCard
              title="Emergency History"
              description="View previous emergency activity"
              icon="📋"
              onClick={() =>
                navigate(
                  "/Hospital/emergency-history"
                )
              }
            />

          </div>

        </section>

        {/* ==================================
            NETWORK INFO
        ================================== */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoCard
            title="Emergency Support"
            value="24/7"
            description="Continuous emergency coordination"
          />

          <InfoCard
            title="Resource Monitoring"
            value="LIVE"
            description="Hospital resource tracking"
          />

          <InfoCard
            title="MedReach Network"
            value="ACTIVE"
            description="Connected medical network"
          />

        </section>

        {/* ==================================
            FOOTER
        ================================== */}

        <footer className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between text-xs text-gray-400">

          <p>
            © MedReach • Smart Emergency Medical Platform
          </p>

          <p>
            Hospital Command Center
          </p>

        </footer>

      </main>

    </div>
  );
}

/* ============================================
   OVERVIEW CARD
============================================ */

function OverviewCard({
  title,
  value,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-red-300 hover:shadow-md transition-all"
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-3">
            {value}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {description}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </button>
  );
}

/* ============================================
   RESOURCE BAR
============================================ */

function ResourceBar({
  title,
  available,
  total,
  percentage,
}) {
  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <div>

          <p className="font-semibold text-gray-800">
            {title}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {available} available of {total}
          </p>

        </div>

        <span className="font-bold text-red-600">
          {percentage}%
        </span>

      </div>

      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-red-600 rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

/* ============================================
   STATUS BOX
============================================ */

function StatusBox({
  label,
  value,
  color,
}) {
  const styles = {
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div
      className={`rounded-xl p-4 ${styles[color]}`}
    >

      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="text-xs font-medium mt-1">
        {label}
      </p>

    </div>
  );
}

/* ============================================
   ACTION CARD
============================================ */

function ActionCard({
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all"
    >

      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-lg mb-4">
        {icon}
      </div>

      <h4 className="font-semibold text-gray-900">
        {title}
      </h4>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>

      <p className="text-xs text-red-600 font-semibold mt-4">
        Open →
      </p>

    </button>
  );
}

/* ============================================
   INFO CARD
============================================ */

function InfoCard({
  title,
  value,
  description,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

      <p className="text-xs uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <p className="text-2xl font-bold text-red-600 mt-2">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {description}
      </p>

    </div>
  );
}