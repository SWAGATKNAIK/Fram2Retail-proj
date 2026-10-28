import { useOutletContext } from 'react-router-dom';
import { Package, TrendingUp, Users, MapPin } from 'lucide-react';

const roleData = {
  farmer: {
    welcome: 'Farmer Dashboard',
    subtitle: 'Manage your harvests, track bookings, and grow your business.',
    stats: [
      { label: 'Active Harvests', value: '24', icon: Package, change: '+3 this week' },
      { label: 'Total Revenue', value: '\u20B918,400', icon: TrendingUp, change: '+12% this month' },
      { label: 'Retail Partners', value: '8', icon: Users, change: '2 new' },
      { label: 'Leased Plots', value: '3', icon: MapPin, change: 'All active' },
    ],
  },
  retailer: {
    welcome: 'Retailer Dashboard',
    subtitle: 'Browse harvests, manage bookings, and track your orders.',
    stats: [
      { label: 'Pending Orders', value: '12', icon: Package, change: '5 arriving today' },
      { label: 'Monthly Spend', value: '\u20B945,200', icon: TrendingUp, change: '-8% vs last month' },
      { label: 'Suppliers', value: '15', icon: Users, change: '3 new' },
      { label: 'Stores', value: '4', icon: MapPin, change: 'All stocked' },
    ],
  },
  landowner: {
    welcome: 'Landowner Dashboard',
    subtitle: 'Manage your properties, review lease applications, and track earnings.',
    stats: [
      { label: 'Listed Properties', value: '5', icon: Package, change: '2 available' },
      { label: 'Lease Income', value: '\u20B932,000', icon: TrendingUp, change: '+5% this quarter' },
      { label: 'Active Tenants', value: '3', icon: Users, change: 'All paid' },
      { label: 'Total Acres', value: '120', icon: MapPin, change: '45 leased' },
    ],
  },
};

function DashboardHome() {
  const { currentRole, displayName } = useOutletContext();
  const data = roleData[currentRole] || roleData.farmer;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-dark">
          {displayName ? `Welcome, ${displayName}` : data.welcome}
        </h1>
        <p className="mt-1 text-gray-600">{data.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className="w-9 h-9 bg-green-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-green-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-dark">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          This is the <span className="font-medium text-green-dark">{currentRole}</span> dashboard overview.
          Select a menu item to explore feature pages.
        </p>
      </div>
    </div>
  );
}

export default DashboardHome;
