import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";



import DonorDashboard from "./pages/Donor/DonorDashboard";
import DonorRequestDetails from "./pages/Donor/DonorRequestDetails";
import DonorAccepted from "./pages/Donor/DonorAccepted";
import DonationHistory from "./pages/Donor/DonationHistory";
import DonorProfile from "./pages/Donor/DonorProfile";
import DonorNotifications from "./pages/Donor/DonorNotifications";
import DonorSettings from "./pages/Donor/DonorSettings";

import PatientRegister from "./pages/registration/PatientRegister";
import DonorRegister from "./pages/registration/DonorRegister";
import HospitalRegister from "./pages/registration/HospitalRegister";
import BloodBankRegister from "./pages/registration/BloodBankRegister";
import AmbulanceRegister from "./pages/registration/AmbulanceRegister";

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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/Donor/dashboard" element={<DonorDashboard />} />
        <Route path="/Donor/request-details" element={<DonorRequestDetails />} />
        <Route path="/Donor/accepted" element={<DonorAccepted />} />
        <Route path="/Donor/donation-history" element={<DonationHistory />} />
        <Route path="/Donor/profile" element={<DonorProfile />} />
        <Route path="/Donor/notifications" element={<DonorNotifications />} />
        <Route path="/Donor/settings" element={<DonorSettings />} />

        <Route
          path="/register/patient"
          element={<PatientRegister />}
        />
        <Route
          path="/register/donor"
          element={<DonorRegister />}
        />
        <Route
          path="/register/hospital"
          element={<HospitalRegister />}
        />
        <Route
          path="/register/bloodbank"
          element={<BloodBankRegister />}
        />
        <Route
          path="/register/ambulance"
          element={<AmbulanceRegister />}
        />

        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/emergency" element={<EmergencyRequest />} />
        <Route path="/user/request-tracking" element={<RequestTracking />}/>
        
        <Route path="/user/find-blood" element={<FindBlood />}/>
        <Route path="/user/blood-request" element={<BloodRequest />}/>
        
        <Route path="/user/find-hospital" element={<FindHospital />}/>
        <Route path="/user/hospital-details" element={<HospitalDetails />}/>
        
        <Route path="/user/find-ambulance" element={<FindAmbulance />} />
        <Route path="/user/ambulance-details" element={<AmbulanceDetails />} />

        <Route path="/user/resources" element={<MedicalResources />} />
         <Route path="/user/find-icu" element={<FindICU />} />
         <Route path="/user/find-oxygen" element={<FindOxygen />} />

         <Route path="/user/active-requests" element={<ActiveRequests />}/>
         <Route
          path="/user/request-history"
          element={<RequestHistory />}
        />

        <Route path="/user/profile" element={<Profile />} />

        <Route path="/user/notifications"element={<Notifications />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;