import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const BedManagement = () => {
  const navigate = useNavigate();

  const [icu, setIcu] = useState(null);
  const [oxygen, setOxygen] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    total_beds: "",
    available_beds: "",
    reserved_beds: "",
    occupied_beds: "",
  });

  const token = sessionStorage.getItem("medreachToken");

  // =========================
  // FETCH INVENTORY
  // =========================
  const fetchInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [icuResponse, oxygenResponse] =
        await Promise.all([
          fetch(`${API_BASE}/api/hospital/icu-inventory`, {
            headers,
          }),

          fetch(`${API_BASE}/api/hospital/oxygen-inventory`, {
            headers,
          }),
        ]);

      const icuData = await icuResponse.json();
      const oxygenData = await oxygenResponse.json();

      // ICU
      if (icuResponse.ok && icuData.inventory) {
        setIcu(icuData.inventory);
      } else {
        setIcu(null);
      }

      // Oxygen
      if (oxygenResponse.ok && oxygenData.inventory) {
        setOxygen(oxygenData.inventory);
      } else {
        setOxygen(null);
      }

      if (!icuResponse.ok && !oxygenResponse.ok) {
        setError("Unable to load bed information.");
      }
    } catch (err) {
      console.error("Inventory fetch error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // =========================
  // START EDITING
  // =========================
  const startEdit = (type, inventory) => {
    setEditing(type);

    setForm({
      total_beds: inventory?.total_beds ?? "",
      available_beds: inventory?.available_beds ?? "",
      reserved_beds: inventory?.reserved_beds ?? "",
      occupied_beds: inventory?.occupied_beds ?? "",
    });
  };

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE INVENTORY
  // =========================
  const updateInventory = async () => {
    if (!editing) return;

    const total = Number(form.total_beds);
    const available = Number(form.available_beds);
    const reserved = Number(form.reserved_beds);
    const occupied = Number(form.occupied_beds);

    if (
      total < 0 ||
      available < 0 ||
      reserved < 0 ||
      occupied < 0
    ) {
      alert("Bed values cannot be negative.");
      return;
    }

    if (
      total !==
      available + reserved + occupied
    ) {
      alert(
        "Total beds must equal available + reserved + occupied."
      );
      return;
    }

    try {
      const endpoint =
        editing === "icu"
          ? "/api/hospital/icu-inventory"
          : "/api/hospital/oxygen-inventory";

      const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            total_beds: total,
            available_beds: available,
            reserved_beds: reserved,
            occupied_beds: occupied,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update inventory."
        );
      }

      alert("Inventory updated successfully.");

      setEditing(null);

      setForm({
        total_beds: "",
        available_beds: "",
        reserved_beds: "",
        occupied_beds: "",
      });

      fetchInventory();
    } catch (err) {
      console.error("Inventory update error:", err);
      alert(err.message);
    }
  };

  // =========================
  // CREATE INVENTORY
  // =========================
  const createInventory = async (type) => {
    const total = Number(form.total_beds);
    const available = Number(form.available_beds);
    const reserved = Number(form.reserved_beds);
    const occupied = Number(form.occupied_beds);

    if (
      form.total_beds === "" ||
      form.available_beds === "" ||
      form.reserved_beds === "" ||
      form.occupied_beds === ""
    ) {
      alert("All bed counts are required.");
      return;
    }

    if (
      total < 0 ||
      available < 0 ||
      reserved < 0 ||
      occupied < 0
    ) {
      alert("Bed values cannot be negative.");
      return;
    }

    if (
      total !==
      available + reserved + occupied
    ) {
      alert(
        "Total beds must equal available + reserved + occupied."
      );
      return;
    }

    try {
      const endpoint =
        type === "icu"
          ? "/api/hospital/icu-inventory"
          : "/api/hospital/oxygen-inventory";

      const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            total_beds: total,
            available_beds: available,
            reserved_beds: reserved,
            occupied_beds: occupied,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create inventory."
        );
      }

      alert("Inventory created successfully.");

      setEditing(null);

      setForm({
        total_beds: "",
        available_beds: "",
        reserved_beds: "",
        occupied_beds: "",
      });

      fetchInventory();
    } catch (err) {
      console.error("Inventory creation error:", err);
      alert(err.message);
    }
  };

  // =========================
  // INVENTORY CARD
  // =========================
  const InventoryCard = ({
    title,
    type,
    inventory,
  }) => {
    const isEditing = editing === type;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* CARD HEADER */}
        <div className="bg-red-600 px-6 py-5 text-white">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                {title}
              </h2>

              <p className="text-red-100 text-sm mt-1">
                Bed availability
              </p>
            </div>

            {inventory && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  inventory.status === "AVAILABLE"
                    ? "bg-white text-red-600"
                    : "bg-red-900 text-white"
                }`}
              >
                {inventory.status}
              </span>
            )}

          </div>

        </div>


        {/* EXISTING INVENTORY */}
        {inventory && !isEditing ? (

          <div className="p-6">

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Total Beds
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {inventory.total_beds}
                </p>
              </div>


              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Available
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {inventory.available_beds}
                </p>
              </div>


              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Reserved
                </p>

                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {inventory.reserved_beds}
                </p>
              </div>


              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Occupied
                </p>

                <p className="text-2xl font-bold text-red-600 mt-1">
                  {inventory.occupied_beds}
                </p>
              </div>

            </div>


            <button
              onClick={() =>
                startEdit(type, inventory)
              }
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Update Inventory
            </button>

          </div>

        ) : (

          /* CREATE / EDIT FORM */
          <div className="p-6">

            {!inventory && (
              <div className="mb-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  No bed inventory has been configured yet.
                </p>
              </div>
            )}


            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Beds
                </label>

                <input
                  type="number"
                  min="0"
                  name="total_beds"
                  value={form.total_beds}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available
                </label>

                <input
                  type="number"
                  min="0"
                  name="available_beds"
                  value={form.available_beds}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reserved
                </label>

                <input
                  type="number"
                  min="0"
                  name="reserved_beds"
                  value={form.reserved_beds}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupied
                </label>

                <input
                  type="number"
                  min="0"
                  name="occupied_beds"
                  value={form.occupied_beds}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

            </div>


            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  inventory
                    ? updateInventory()
                    : createInventory(type)
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
              >
                {inventory
                  ? "Save Changes"
                  : "Create Inventory"}
              </button>


              <button
                onClick={() => {
                  setEditing(null);

                  setForm({
                    total_beds: "",
                    available_beds: "",
                    reserved_beds: "",
                    occupied_beds: "",
                  });
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </div>
    );
  };


  // =========================
  // PAGE
  // =========================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                M
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MedReach
              </h1>

              <p className="text-xs text-gray-500">
                Hospital Portal
              </p>
            </div>

          </div>


          <button
            onClick={() =>
              navigate("/Hospital/dashboard")
            }
            className="px-4 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium transition"
          >
            ← Dashboard
          </button>

        </div>

      </nav>


      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-7 mb-8 text-white shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-red-100 text-sm font-semibold tracking-wide mb-2">
                HOSPITAL RESOURCE MANAGEMENT
              </p>

              <h2 className="text-3xl font-bold">
                Bed Management
              </h2>

              <p className="text-red-100 mt-2 max-w-2xl">
                Monitor and manage ICU and oxygen bed
                availability to support emergency medical
                coordination.
              </p>

            </div>


            <div className="bg-white/15 rounded-xl px-5 py-4 border border-white/20 min-w-[180px]">

              <p className="text-red-100 text-xs font-medium">
                RESOURCE CENTER
              </p>

              <p className="text-lg font-semibold mt-1">
                Bed Inventory
              </p>

              <p className="text-red-100 text-xs mt-1">
                Hospital resources
              </p>

            </div>

          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">

            <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading bed inventory...
            </p>

          </div>

        ) : (

          <>

            {/* SECTION HEADER */}
            <div className="mb-5">

              <h3 className="text-xl font-bold text-gray-900">
                Bed Inventory
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View and update your hospital's current bed availability.
              </p>

            </div>


            {/* INVENTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <InventoryCard
                title="ICU Beds"
                type="icu"
                inventory={icu}
              />

              <InventoryCard
                title="Oxygen Beds"
                type="oxygen"
                inventory={oxygen}
              />

            </div>


            {/* BOTTOM INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  <span className="text-red-600 font-bold text-sm">
                    ICU
                  </span>
                </div>

                <h4 className="font-semibold text-gray-900">
                  ICU Management
                </h4>

                <p className="text-sm text-gray-500 mt-2">
                  Keep ICU bed availability updated for
                  emergency patient coordination.
                </p>

              </div>


              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  <span className="text-red-600 font-bold text-sm">
                    O₂
                  </span>
                </div>

                <h4 className="font-semibold text-gray-900">
                  Oxygen Beds
                </h4>

                <p className="text-sm text-gray-500 mt-2">
                  Monitor oxygen-supported bed availability
                  for emergency care.
                </p>

              </div>


              <div className="bg-white border border-gray-200 rounded-xl p-5">

                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-sm">
                    ✓
                  </span>
                </div>

                <h4 className="font-semibold text-gray-900">
                  Emergency Ready
                </h4>

                <p className="text-sm text-gray-500 mt-2">
                  Updated resources help MedReach coordinate
                  emergency medical support faster.
                </p>

              </div>

            </div>

          </>

        )}

      </main>


      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white mt-10">

        <div className="max-w-7xl mx-auto px-6 py-5 text-center">

          <p className="text-sm text-gray-500">
            MedReach — Smart Emergency Medical Platform
          </p>

        </div>

      </footer>

    </div>
  );
};

export default BedManagement;