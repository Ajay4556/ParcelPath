import { Routes, Route } from "react-router";

import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import Dashboard from "./Pages/Dashboard";
import PostTrip from "./Pages/PostTrip";
import CustomerDashboard from "./Pages/CustomerDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/posttrip" element={<PostTrip />} />
      <Route path="/customerdashboard" element={<CustomerDashboard />} />
    </Routes>
  );
}
