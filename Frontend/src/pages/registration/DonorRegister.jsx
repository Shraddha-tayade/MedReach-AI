import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function DonorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    bloodGroup: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Pincode must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register?type=DONOR",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            bloodGroup: formData.bloodGroup,
            dateOfBirth: formData.dateOfBirth,
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Donor registration failed."
        );
      }

      setMessage(
        data.message ||
          "Donor registration successful."
      );

      // Redirect to Login with Donor already selected
      setTimeout(() => {
        navigate("/login?role=donor");
      }, 1500);

    } catch (err) {
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
      title="Blood Donor Registration"
      subtitle="Register as a donor and help patients during emergencies."
    >
      {/* Success Message */}
      {message && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-5"
      >

        {/* Full Name */}
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
        />

        {/* Email */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        {/* Blood Group */}
        <Select
          label="Blood Group"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          options={[
            "A+",
            "A-",
            "B+",
            "B-",
            "AB+",
            "AB-",
            "O+",
            "O-",
          ]}
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
          placeholder="Enter your city"
        />

        {/* State */}
        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Enter your state"
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

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating Account..."
              : "Create Donor Account"}
          </button>
        </div>

      </form>
    </RegistrationLayout>
  );
}

export default DonorRegister;


// ================= REGISTRATION LAYOUT =================

function RegistrationLayout({
  title,
  subtitle,
  children,
}) {
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
              className="text-red-600 font-semibold hover:text-red-700"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}


// ================= INPUT =================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
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


// ================= SELECT =================

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white outline-none focus:border-red-500"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}


// ================= ERROR MESSAGE =================

function ErrorMessage({ message }) {
  return (
    <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      {message}
    </div>
  );
}