import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import PlaceholderPage from './pages/PlaceholderPage';
import MyHarvests from './pages/MyHarvests';
import BrowseHarvests from './pages/BrowseHarvests';
import HarvestDetails from './pages/HarvestDetails';
import MyBookings from './pages/MyBookings';
import RetailerBookings from './pages/RetailerBookings';
import CropRequirements from './pages/CropRequirements';
import CropBids from './pages/CropBids';
import ManageBids from './pages/ManageBids';
import Orders from './pages/Orders';
import MyProperties from './pages/MyProperties';
import FindFarmland from './pages/FindFarmland';
import PropertyDetails from './pages/PropertyDetails';
import LeaseApplications from './pages/LeaseApplications';
import LeaseManagement from './pages/LeaseManagement';
import SoilIntelligence from './pages/SoilIntelligence';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default dashboard view */}
          <Route index element={<DashboardHome />} />
          {/* Harvest Marketplace pages */}
          <Route path="my-harvests" element={<MyHarvests />} />
          <Route path="browse-harvests" element={<BrowseHarvests />} />
          <Route path="harvest/:id" element={<HarvestDetails />} />
          {/* Booking pages */}
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="retailer-bookings" element={<RetailerBookings />} />
          {/* Grow-to-Order pages */}
          <Route path="crop-requirements" element={<CropRequirements />} />
          <Route path="crop-bids" element={<CropBids />} />
          <Route path="manage-bids/:id" element={<ManageBids />} />
          <Route path="orders" element={<Orders />} />
          {/* Farmland Marketplace pages */}
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="find-farmland" element={<FindFarmland />} />
          <Route path="property/:id" element={<PropertyDetails />} />
          <Route path="lease-applications" element={<LeaseApplications />} />
          <Route path="lease-management" element={<LeaseManagement />} />
          {/* Soil Intelligence page */}
          <Route path="soil-intelligence" element={<SoilIntelligence />} />
          {/* All other feature pages use placeholder */}
          <Route path=":page" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
