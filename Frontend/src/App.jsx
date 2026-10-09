import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Donor pages
import DonorAccepted from "./pages/Donor/DonorAccepted";
import DonorDashboard from "./pages/Donor/DonorDashboard";
import DonorRequestDetails from "./pages/Donor/DonorRequestDetails";
import DonationHistory from "./pages/Donor/DonationHistory";
import DonorProfile from "./pages/Donor/DonorProfile";
import DonorNotifications from "./pages/Donor/DonorNotifications";
import DonorSettings from "./pages/Donor/DonorSettings";

// BloodBank pages
import BloodBankDashboard from "./pages/BloodBank/BloodBankDashboard";
import BloodBankHospitalRequests from "./pages/BloodBank/BloodBankHospitalRequests";
import BloodBankEmergencyRequests from "./pages/BloodBank/BloodBankEmergencyRequests";
import BloodBankInventory from "./pages/BloodBank/BloodBankInventory";
import BloodBankHistory from "./pages/BloodBank/BloodBankHistory";

// Ambulance pages
import AmbulanceDashboard from "./pages/Ambulance/AmbulanceDashboard";
import MyAmbulance from "./pages/Ambulance/MyAmbulance";
import EmergencyRequests from "./pages/Ambulance/EmergencyRequests";
import AmbulanceProfile from "./pages/Ambulance/AmbulanceProfile";

// Hospital pages
import HospitalDashboard from "./pages/Hospital/HospitalDashboard";
import HospitalEmergencyRequests from "./pages/Hospital/EmergencyRequests";
import BedManagement from "./pages/Hospital/BedManagement";
import BloodRequests from "./pages/Hospital/BloodRequests";
import BloodRequestDetails from "./pages/Hospital/BloodRequestDetails";
import BloodRequestHistory from "./pages/Hospital/BloodRequestHistory";
import EmergencyHistory from "./pages/Hospital/EmergencyHistory";
import HospitalProfile from "./pages/Hospital/HospitalProfile";

// Registration pages
import PatientRegister from "./pages/registration/PatientRegister";
import DonorRegister from "./pages/registration/DonorRegister";
import HospitalRegister from "./pages/registration/HospitalRegister";
import BloodBankRegister from "./pages/registration/BloodBankRegister";
import AmbulanceRegister from "./pages/registration/AmbulanceRegister";

// User pages
import UserDashboard from "./pages/user/dashboard/UserDashboard";
import EmergencyRequest from "./pages/user/dashboard/emergency/EmergencyRequest";
import RequestTracking from "./pages/user/dashboard/emergency/RequestTracking";
import FindBlood from "./pages/user/dashboard/blood/FindBlood";
import BloodRequest from "./pages/user/dashboard/blood/BloodRequest";
import FindHospital from "./pages/user/dashboard/hospital/FindHospital";
import HospitalDetails from "./pages/user/dashboard/hospital/HospitalDetails";
import FindAmbulance from "./pages/user/dashboard/ambulance/FindAmbulance";
import AmbulanceDetails from "./pages/user/dashboard/ambulance/AmbulanceDetails";
import MedicalResources from "./pages/user/dashboard/resources/MedicalResources";
import FindICU from "./pages/user/dashboard/resources/FindICU";
import FindOxygen from "./pages/user/dashboard/resources/FindOxygen";
import ActiveRequests from "./pages/user/dashboard/requests/ActiveRequests";
import RequestHistory from "./pages/user/dashboard/requests/RequestHistory";
import Profile from "./pages/user/dashboard/profile/Profile";
import Notifications from "./pages/user/dashboard/notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor routes */}
        <Route path="/Donor/dashboard" element={<DonorDashboard />} />
        <Route
          path="/Donor/request-details"
          element={<DonorRequestDetails />}
        />
        <Route path="/Donor/accepted" element={<DonorAccepted />} />
        <Route path="/Donor/accepted/" element={<DonorAccepted />} />
        <Route path="/Donor/donation-history" element={<DonationHistory />} />
        <Route path="/Donor/profile" element={<DonorProfile />} />
        <Route path="/Donor/notifications" element={<DonorNotifications />} />
        <Route path="/Donor/settings" element={<DonorSettings />} />

        {/* BloodBank routes */}
        <Route path="/BloodBank/dashboard" element={<BloodBankDashboard />} />
        <Route
          path="/BloodBank/hospital-requests"
          element={<BloodBankHospitalRequests />}
        />
        <Route
          path="/BloodBank/emergency-requests"
          element={<BloodBankEmergencyRequests />}
        />
        <Route path="/BloodBank/inventory" element={<BloodBankInventory />} />
        <Route path="/BloodBank/history" element={<BloodBankHistory />} />

        {/* Ambulance routes */}
        <Route path="/Ambulance/dashboard" element={<AmbulanceDashboard />} />
        <Route path="/Ambulance/my-ambulance" element={<MyAmbulance />} />
        <Route path="/Ambulance/requests" element={<EmergencyRequests />} />
        <Route path="/Ambulance/profile" element={<AmbulanceProfile />} />

        {/* Hospital routes */}
        <Route path="/Hospital/dashboard" element={<HospitalDashboard />} />
        <Route
          path="/Hospital/emergency-requests"
          element={<HospitalEmergencyRequests />}
        />
        <Route path="/Hospital/bed-management" element={<BedManagement />} />
        <Route path="/Hospital/blood-requests" element={<BloodRequests />} />
        <Route
          path="/Hospital/blood-requests/:requestId"
          element={<BloodRequestDetails />}
        />
        <Route
          path="/Hospital/blood-request-history"
          element={<BloodRequestHistory />}
        />
        <Route
          path="/Hospital/emergency-history"
          element={<EmergencyHistory />}
        />
        <Route path="/Hospital/profile" element={<HospitalProfile />} />

        {/* Registration routes */}
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/donor" element={<DonorRegister />} />
        <Route path="/register/hospital" element={<HospitalRegister />} />
        <Route path="/register/bloodbank" element={<BloodBankRegister />} />
        <Route path="/register/ambulance" element={<AmbulanceRegister />} />

        {/* User routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/emergency" element={<EmergencyRequest />} />
        <Route path="/user/request-tracking" element={<RequestTracking />} />
        <Route path="/user/find-blood" element={<FindBlood />} />
        <Route path="/user/blood-request" element={<BloodRequest />} />
        <Route path="/user/find-hospital" element={<FindHospital />} />
        <Route path="/user/hospital-details" element={<HospitalDetails />} />
        <Route path="/user/find-ambulance" element={<FindAmbulance />} />
        <Route path="/user/ambulance-details" element={<AmbulanceDetails />} />
        <Route path="/user/resources" element={<MedicalResources />} />
        <Route path="/user/find-icu" element={<FindICU />} />
        <Route path="/user/find-oxygen" element={<FindOxygen />} />
        <Route path="/user/active-requests" element={<ActiveRequests />} />
        <Route path="/user/request-history" element={<RequestHistory />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;