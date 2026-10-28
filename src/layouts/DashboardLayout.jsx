import { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { sampleHarvests } from '../data/harvests';
import { clearSession, VALID_ROLES } from '../utils/auth';

// Demo identity constants for consistent role-based filtering
const DEMO_IDENTITIES = {
  farmer: 'You (Demo Farmer)',
  retailer: 'You (Demo Retailer)',
  landowner: 'You (Demo Landowner)',
};

// Sample crop requirements data
const sampleRequirements = [
  {
    id: 1,
    crop: 'Tomatoes',
    category: 'Vegetables',
    quantity: 5000,
    unit: 'kg',
    qualitySpecs: 'Grade A, firm, uniform red color, no blemishes',
    targetPrice: 40,
    location: 'Pune, Maharashtra',
    requiredBy: '2026-12-15',
    retailer: 'FreshMart Retail',
    status: 'Open',
    createdAt: '2026-10-10',
  },
  {
    id: 2,
    crop: 'Basmati Rice',
    category: 'Grains',
    quantity: 10000,
    unit: 'kg',
    qualitySpecs: 'Aged minimum 1 year, 95% whole grains, moisture < 14%',
    targetPrice: 90,
    location: 'Karnal, Haryana',
    requiredBy: '2027-01-20',
    retailer: 'GrainCo Traders',
    status: 'Open',
    createdAt: '2026-10-12',
  },
];

// Sample farmland properties data
const sampleProperties = [
  {
    id: 1,
    title: 'Fertile Farmland near Nashik',
    location: 'Nashik, Maharashtra',
    acreage: 10,
    rentPerAcre: 25000,
    rentPeriod: 'year',
    leaseType: 'Fixed Rent',
    soilType: 'Black Cotton Soil',
    irrigation: 'Drip irrigation available, borewell',
    waterAvailability: 'Good',
    permittedCrops: 'Grapes, Tomatoes, Onions, Pomegranate',
    description: 'Well-maintained farmland with excellent road access. Ideal for horticulture crops. Soil tested recently.',
    images: ['https://images.unsplash.com/photo-1626228666783-5e3251db91b6?w=800&h=600&fit=crop'],
    landowner: 'You (Demo Landowner)',
    status: 'Available',
    createdAt: '2026-10-05',
  },
  {
    id: 2,
    title: 'Riverside Agricultural Land',
    location: 'Karnal, Haryana',
    acreage: 25,
    rentPerAcre: 30000,
    rentPeriod: 'year',
    leaseType: 'Crop Share (50-50)',
    soilType: 'Alluvial Soil',
    irrigation: 'Canal irrigation, tube well',
    waterAvailability: 'Excellent',
    permittedCrops: 'Rice, Wheat, Sugarcane, Vegetables',
    description: 'Prime agricultural land near canal. High water table. Suitable for multiple cropping seasons.',
    images: ['https://images.unsplash.com/photo-1574518371418-2c157c9dc5b3?w=800&h=600&fit=crop'],
    landowner: 'You (Demo Landowner)',
    status: 'Available',
    createdAt: '2026-10-08',
  },
  {
    id: 3,
    title: 'Organic Certified Farm Plot',
    location: 'Erode, Tamil Nadu',
    acreage: 5,
    rentPerAcre: 35000,
    rentPeriod: 'year',
    leaseType: 'Fixed Rent',
    soilType: 'Red Loam Soil',
    irrigation: 'Drip + sprinkler, farm pond',
    waterAvailability: 'Moderate',
    permittedCrops: 'Turmeric, Banana, Coconut, Vegetables',
    description: 'Organic certified land. Perfect for high-value spices and fruits. Certification valid till 2027.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
    landowner: 'You (Demo Landowner)',
    status: 'Available',
    createdAt: '2026-10-12',
  },
];

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const storedRole = sessionStorage.getItem('demoRole');
  const storedName = sessionStorage.getItem('demoName') || '';
  const [currentRole, setCurrentRole] = useState(storedRole || 'farmer');
  const [harvests, setHarvests] = useState(sampleHarvests);
  const [bookings, setBookings] = useState([]);
  const [requirements, setRequirements] = useState(sampleRequirements);
  const [bids, setBids] = useState([]);
  const [orders, setOrders] = useState([]);
  const [properties, setProperties] = useState(sampleProperties);
  const [leaseApplications, setLeaseApplications] = useState([]);
  const [leases, setLeases] = useState([]);
  const navigate = useNavigate();

  // Validate stored role - redirect to login if invalid or missing
  if (!storedRole || !VALID_ROLES.includes(storedRole)) {
    return <Navigate to="/login" replace />;
  }

  // When the role changes, persist it, navigate back to the dashboard home
  // so the user doesn't stay on a page that belongs to another role
  function handleRoleChange(newRole) {
    if (!VALID_ROLES.includes(newRole)) {
      return;
    }
    sessionStorage.setItem('demoRole', newRole);
    setCurrentRole(newRole);
    navigate('/dashboard');
  }

  function handleSignOut() {
    clearSession();
    setCurrentRole('farmer');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar - fixed on all screen sizes */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRole={currentRole}
      />

      {/* Main content area - offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onSignOut={handleSignOut}
          displayName={storedName}
        />

        {/* Page content — renders the matched child route */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet context={{ currentRole, displayName: storedName, demoIdentities: DEMO_IDENTITIES, harvests, setHarvests, bookings, setBookings, requirements, setRequirements, bids, setBids, orders, setOrders, properties, setProperties, leaseApplications, setLeaseApplications, leases, setLeases }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
