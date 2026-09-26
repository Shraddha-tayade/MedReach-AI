import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

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