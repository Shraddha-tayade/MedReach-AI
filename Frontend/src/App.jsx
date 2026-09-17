import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import EmergencyRequest from "./pages/user/EmergencyRequest";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={<Landing />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Patient */}
        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />

        <Route
          path="/user/emergency"
          element={<EmergencyRequest />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;