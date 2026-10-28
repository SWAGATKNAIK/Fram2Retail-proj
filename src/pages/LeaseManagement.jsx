import { useOutletContext } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, User, Home, Clock, FileText, Trash2 } from 'lucide-react';

function LeaseManagement() {
  const { currentRole, leases, setLeases, properties, setProperties, demoIdentities } = useOutletContext();

  // Determine the current user's landowner identity
  const currentLandownerIdentity = demoIdentities.landowner;

  // Filter leases based on role
  let myLeases = leases;
  if (currentRole === 'farmer') {
    myLeases = leases.filter((l) => l.farmer === 'You (Demo Farmer)');
  } else if (currentRole === 'landowner') {
    myLeases = leases.filter((l) => l.landowner === currentLandownerIdentity);
  }

  // End lease early
  function endLease(leaseId) {
    if (!window.confirm('End this lease early? This will make the property available again.')) return;

    const lease = leases.find((l) => l.id === leaseId);
    if (!lease) return;

    // Mark lease as Ended
    setLeases((prev) =>
      prev.map((l) => (l.id === leaseId ? { ...l, status: 'Ended' } : l))
    );

    // Make the property available again
    setProperties((prev) =>
      prev.map((p) => (p.id === lease.propertyId ? { ...p, status: 'Available' } : p))
    );
  }

  if (myLeases.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-dark">Lease Management</h1>
          <p className="mt-1 text-gray-600">
            {currentRole === 'farmer'
              ? 'View and manage your active and past leases.'
              : 'View and manage leases for your properties.'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No leases yet.</p>
          <p className="text-sm text-gray-400">
            {currentRole === 'farmer'
              ? 'When a landowner approves your application, a lease will be created here.'
              : 'When you approve a farmer\'s application, a lease will be created here.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">Lease Management</h1>
        <p className="mt-1 text-gray-600">
          {currentRole === 'farmer'
            ? 'View and manage your active and past leases.'
            : 'View and manage leases for your properties.'}
        </p>
      </div>

      <div className="space-y-6">
        {myLeases.map((lease) => {
          const property = properties.find((p) => p.id === lease.propertyId);
          const isActive = lease.status === 'Active';
          const daysRemaining = isActive 
            ? Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))
            : 0;
          
          return (
            <div key={lease.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-green-primary/5 border-b border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-green-primary/10 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-green-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-green-dark">{lease.propertyTitle}</h2>
                        <p className="text-sm text-gray-500">Lease ID: {lease.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${lease.status === 'Active' ? 'bg-green-primary text-white' : lease.status === 'Ended' ? 'bg-gray-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {lease.status}
                      </span>
                      {isActive && daysRemaining > 0 && (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {daysRemaining} days remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Agreed Rent</p>
                      <p className="font-semibold text-green-dark">₹{lease.agreedRent.toLocaleString('en-IN')}/acre</p>
                    </div>
                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Duration</p>
                      <p className="font-semibold text-green-dark">{lease.leaseDuration} months</p>
                    </div>
                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Start Date</p>
                      <p className="font-semibold text-green-dark">{lease.startDate}</p>
                    </div>
                    <div className="bg-cream rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />End Date</p>
                      <p className="font-semibold text-green-dark">{lease.endDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><User className="w-4 h-4" />{currentRole === 'farmer' ? 'Landowner' : 'Farmer'}</h3>
                      <p className="font-semibold text-green-dark">{currentRole === 'farmer' ? lease.landowner : lease.farmer}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" />Property Location</h3>
                      <p className="font-semibold text-green-dark">{property?.location || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {isActive && currentRole === 'landowner' && (
                      <button onClick={() => endLease(lease.id)} className="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        End Lease Early
                      </button>
                    )}
                    {!isActive && (
                      <span className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center text-sm font-medium">
                        Lease Ended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaseManagement;