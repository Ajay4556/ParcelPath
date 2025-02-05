import { Routes, Route } from "react-router";

import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import Dashboard from "./Pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<Registration />} />
    </Routes>
  );
}
