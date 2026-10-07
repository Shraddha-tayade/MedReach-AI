import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BloodBankRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    bloodBankName: "",
    licenceNumber: "",
    contact: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    operatingLicence: null,
    addressProof: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Contact validation
    if (!/^\d{10}$/.test(formData.contact)) {
      setError("Contact number must be 10 digits.");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Pincode must be 6 digits.");
      return;
    }

    // Document validation
    if (!formData.operatingLicence || !formData.addressProof) {
      setError("Please upload both required documents.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register?type=BLOOD_BANK",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            bloodBankName: formData.bloodBankName,
            licenceNumber: formData.licenceNumber,
            contact: formData.contact,
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,

            // Current backend stores these as text paths
            operatingLicence: `uploads/${formData.operatingLicence.name}`,
            addressProof: `uploads/${formData.addressProof.name}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Blood bank registration failed."
        );
      }

      setMessage(
        data.message ||
          "Blood bank registration submitted successfully."
      );

      // Redirect to login after successful registration
     setTimeout(() => {
  navigate("/login?role=bloodbank");
}, 2000);

    }
     catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationLayout
      title="Blood Bank Registration"
      subtitle="Register your blood bank to provide emergency blood resources."
    >
      {/* Success Message */}
      {message && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleRegister}
        className="grid md:grid-cols-2 gap-5"
      >
        {/* Username */}
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />

        {/* Blood Bank Name */}
        <Input
          label="Blood Bank Name"
          name="bloodBankName"
          value={formData.bloodBankName}
          onChange={handleChange}
          placeholder="Enter blood bank name"
        />

        {/* Licence Number */}
        <Input
          label="Licence Number"
          name="licenceNumber"
          value={formData.licenceNumber}
          onChange={handleChange}
          placeholder="Enter licence number"
        />

        {/* Contact */}
        <Input
          label="Contact Number"
          name="contact"
          type="tel"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Enter 10-digit contact number"
        />

        {/* Address */}
        <Input
          label="Address Line"
          name="addressLine"
          value={formData.addressLine}
          onChange={handleChange}
          placeholder="House no., Street, Area"
        />

        {/* City */}
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
        />

        {/* State */}
        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Enter state"
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter 6-digit pincode"
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />

        {/* Operating Licence */}
        <FileInput
          label="Operating Licence"
          name="operatingLicence"
          onChange={handleChange}
        />

        {/* Address Proof */}
        <FileInput
          label="Address Proof"
          name="addressProof"
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300"
          >
            {loading
              ? "Submitting Registration..."
              : "Register Blood Bank"}
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}


// ================= REGISTRATION LAYOUT =================

function RegistrationLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">

        <Link
          to="/register"
          className="text-sm text-red-600 hover:text-red-700"
        >
          ← Change Registration Type
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-4">

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {title}
            </h1>

            <p className="text-slate-500 mt-2">
              {subtitle}
            </p>
          </div>

          {children}

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 font-semibold"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}


// ================= INPUT COMPONENT =================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
      />
    </div>
  );
}


// ================= FILE INPUT COMPONENT =================

function FileInput({ label, name, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type="file"
        name={name}
        onChange={onChange}
        required
        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
      />
    </div>
  );
}


export default BloodBankRegister;