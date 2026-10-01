import { useState } from "react";
import { Link } from "react-router-dom";

function DonorRegister() {
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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Backend donor registration will be connected later.
    alert("Donor registration form completed. Backend integration pending.");
  };

  return (
    <RegistrationLayout
      title="Blood Donor Registration"
      subtitle="Register as a donor and help patients during emergencies."
    >
      {error && <ErrorMessage message={error} />}

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-5"
      >
       
       <Input
  label="Full Name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
/>

<Input
  label="Phone Number"
  name="phone"
  type="tel"
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter phone number"
/>

<Input
  label="Email Address"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
/>

<Input
  label="Date of Birth"
  name="dateOfBirth"
  type="date"
  value={formData.dateOfBirth}
  onChange={handleChange}
/>

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

<Input
  label="Address Line"
  name="addressLine"
  value={formData.addressLine}
  onChange={handleChange}
  placeholder="House no., Street, Area"
/>

<Input
  label="City"
  name="city"
  value={formData.city}
  onChange={handleChange}
  placeholder="Enter your city"
/>

<Input
  label="State"
  name="state"
  value={formData.state}
  onChange={handleChange}
  placeholder="Enter your state"
/>

<Input
  label="Pincode"
  name="pincode"
  value={formData.pincode}
  onChange={handleChange}
  placeholder="Enter pincode"
/>

<Input
  label="Password"
  name="password"
  type="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Create password"
/>

<Input
  label="Confirm Password"
  name="confirmPassword"
  type="password"
  value={formData.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm password"
/>

       
        <SubmitButton text="Create Donor Account" />
      </form>
    </RegistrationLayout>
  );
}

export default DonorRegister;

function RegistrationLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <Link to="/register" className="text-sm text-red-600">
          ← Change Registration Type
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mt-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {title}
            </h1>
            <p className="text-slate-500 mt-2">{subtitle}</p>
          </div>

          {children}

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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

function Select({ label, name, value, onChange, options }) {
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
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SubmitButton({ text }) {
  return (
    <div className="md:col-span-2">
      <button
        type="submit"
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
      >
        {text}
      </button>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
      {message}
    </div>
  );
}