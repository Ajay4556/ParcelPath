import { Routes, Route } from "react-router";

import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import Dashboard from "./Pages/Dashboard";
import PostTrip from "./Pages/PostTrip";
import FindTrips from './Pages/FindTrips'
import TripDetail from './Pages/TripDetail'
import TripConfirmation from './Pages/TripConfirmation'
import Checkout from './Pages/Checkout'
import CustomerDashboard from "./Pages/CustomerDashboard";
import ProviderDashboard from "./Pages/ProviderDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/posttrip" element={<PostTrip />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/findtrip" element={<FindTrips />} />
      <Route path="/details/:id" element={<TripDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirmation" element={<TripConfirmation />} />
      <Route path="/provider-dashboard" element={<ProviderDashboard />} />

    </Routes>
  );
}
