import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const initialForm = {
  blood_group: "O+",
  blood_component: "PRBC",
  quantity: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  search_radius_km: "20",
  description: "",
};

function BloodRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(initialForm);

  const token = sessionStorage.getItem("medreachToken");

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/hospital/blood-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch blood requests"
        );
      }

      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || "Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.blood_group ||
      !form.blood_component ||
      !form.quantity ||
      !form.address_line ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.search_radius_km
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        `${API_BASE}/api/hospital/blood-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            blood_group: form.blood_group,
            blood_component: form.blood_component,
            quantity: Number(form.quantity),

            location: {
              latitude: 18.5204,
              longitude: 73.8567,
            },

            address_line: form.address_line,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            search_radius_km: Number(form.search_radius_km),
            description: form.description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create blood request"
        );
      }

      setSuccess("Blood request created successfully.");

      setForm(initialForm);

      await fetchBloodRequests();
    } catch (err) {
      setError(err.message || "Failed to create blood request");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-600">
              MedReach
            </h1>
            <p className="text-sm text-gray-500">
              Hospital Portal
            </p>
          </div>

          <button
            onClick={() => navigate("/Hospital/dashboard")}
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Blood Requests
          </h2>

          <p className="text-gray-500 mt-1">
            Create and manage blood requests from your hospital.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Create Request */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Create Blood Request
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Enter the blood requirement and search location.
            </p>
          </div>

          <form
            onSubmit={handleCreateRequest}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>

              <select
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Component
              </label>

              <select
                name="blood_component"
                value={form.blood_component}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              >
                <option value="PRBC">PRBC</option>
                <option value="WHOLE_BLOOD">Whole Blood</option>
                <option value="PLASMA">Plasma</option>
                <option value="PLATELETS">Platelets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius (km)
              </label>

              <input
                type="number"
                name="search_radius_km"
                min="1"
                value={form.search_radius_km}
                onChange={handleChange}
                placeholder="e.g. 20"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line
              </label>

              <input
                type="text"
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
                placeholder="Enter hospital/request address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe the blood requirement..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-6 py-3 rounded-lg"
              >
                {creating
                  ? "Creating..."
                  : "Create Blood Request"}
              </button>
            </div>
          </form>
        </section>

        {/* My Blood Requests */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                My Blood Requests
              </h3>

              <p className="text-gray-500 mt-1">
                View and manage your submitted blood requests.
              </p>
            </div>

            <button
              onClick={fetchBloodRequests}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border p-8 text-center">
              Loading blood requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center">
              No blood requests found.
            </div>
          ) : (
            <div className="space-y-5">
              {requests.map((request) => {
                const requestId =
                  request.id || request.request_id;

                return (
                  <div
                    key={requestId}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-sm text-gray-500">
                          Request ID
                        </p>

                        <h4 className="text-xl font-bold text-gray-900">
                          #{requestId}
                        </h4>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : request.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status || "PENDING"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                      <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                          Blood Group
                        </p>

                        <p className="text-xl font-bold text-red-600 mt-1">
                          {request.blood_group || "-"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                          Component
                        </p>

                        <p className="font-semibold mt-1">
                          {request.blood_component || "-"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                          Quantity
                        </p>

                        <p className="font-semibold mt-1">
                          {request.quantity || "-"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500">
                          Search Radius
                        </p>

                        <p className="font-semibold mt-1">
                          {request.search_radius_km
                            ? `${request.search_radius_km} km`
                            : "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Request Location
                      </p>

                      <p className="text-sm text-gray-600">
                        {request.request_address ||
                          request.address_line ||
                          "Address not available"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {request.city || "-"},{" "}
                        {request.state || "-"} -{" "}
                        {request.pincode || "-"}
                      </p>
                    </div>

                    {request.description && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Description
                        </p>

                        <p className="text-sm text-gray-600">
                          {request.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/Hospital/blood-requests/${requestId}`
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        View Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BloodRequests;