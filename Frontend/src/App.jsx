import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import EmergencyRequest from "./pages/user/EmergencyRequest";
import RequestTracking from "./pages/user/RequestTracking";
import FindBlood from "./pages/user/FindBlood";
import BloodRequest from "./pages/user/BloodRequest";
import FindHospital from "./pages/user/FindHospital";
import HospitalDetails from "./pages/user/HospitalDetails";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;