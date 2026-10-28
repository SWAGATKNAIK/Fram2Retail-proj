import { useOutletContext } from 'react-router-dom';
import { DollarSign, Calendar, User, Home, FileText } from 'lucide-react';

function LeaseApplications() {
  const { currentRole, leaseApplications, setLeaseApplications, properties, leases, setLeases, setProperties, demoIdentities } = useOutletContext();

  // Determine the current user's landowner identity
  // For demo: 'You (Demo Landowner)' when in landowner role
  // For registered users: use demoName from sessionStorage (passed via context)
  const currentLandownerIdentity = demoIdentities.landowner;

  // Filter applications based on role
  let myApplications = leaseApplications;
  if (currentRole === 'farmer') {
    myApplications = leaseApplications.filter((a) => a.farmer === 'You (Demo Farmer)');
  } else if (currentRole === 'landowner') {
    // Match applications where the landowner field matches the current user's identity
    myApplications = leaseApplications.filter((a) => a.landowner === currentLandownerIdentity);
  }

  // Handle approve/reject
  function handleApprove(appId) {
    const app = leaseApplications.find((a) => a.id === appId);
    if (!app) return;

    // Check if property already has active lease
    const existingLease = leases.find((l) => l.propertyId === app.propertyId && l.status === 'Active');
    if (existingLease) {
      alert('Cannot approve: This property already has an active lease.');
      return;
    }

    // Check for other pending applications for same property
    const otherPending = leaseApplications.filter(
      (a) => a.propertyId === app.propertyId && a.id !== appId && a.status === 'Pending'
    );

    // Compute dates once
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + app.leaseDuration * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Approve this application
    setLeaseApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'Approved', approvedAt: startDate }
          : otherPending.some((oa) => oa.id === a.id)
          ? { ...a, status: 'Rejected', rejectedAt: startDate, rejectedReason: 'Another application was approved for this property' }
          : a
      )
    );

    // Update property status to Leased
    setProperties((prev) =>
      prev.map((p) => (p.id === app.propertyId ? { ...p, status: 'Leased' } : p))
    );

    // Create lease record
    const property = properties.find((p) => p.id === app.propertyId);
    if (property) {
      // Use deterministic ID based on application ID
      const newLease = {
        id: app.id * 10000 + 1,
        applicationId: app.id,
        propertyId: app.propertyId,
        propertyTitle: app.propertyTitle,
        farmer: app.farmer,
        landowner: app.landowner,
        agreedRent: app.proposedRent,
        leaseDuration: app.leaseDuration,
        startDate,
        endDate,
        status: 'Active',
        createdAt: startDate,
      };
      setLeases((prev) => [newLease, ...prev]);
    }
  }

  function handleReject(appId) {
    const reason = window.prompt('Enter reason for rejection (optional):');
    setLeaseApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: 'Rejected', rejectedAt: new Date().toISOString().split('T')[0], rejectedReason: reason || 'Not specified' } : a
      )
    );
  }

  if (myApplications.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-dark">Lease Applications</h1>
          <p className="mt-1 text-gray-600">
            {currentRole === 'farmer'
              ? 'Track your lease applications to landowners.'
              : 'Review and manage lease applications for your properties.'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No applications yet.</p>
          <p className="text-sm text-gray-400">
            {currentRole === 'farmer'
              ? 'Apply for farmland from <a href="/dashboard/find-farmland" className="text-green-primary hover:underline">Find Farmland</a> to see applications here.'
              : 'When farmers apply for your properties, their applications will appear here.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">Lease Applications</h1>
        <p className="mt-1 text-gray-600">
          {currentRole === 'farmer'
            ? 'Track your lease applications to landowners.'
            : 'Review and manage lease applications for your properties.'}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {currentRole === 'farmer' ? 'Landowner' : 'Farmer'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proposed Rent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myApplications.map((app) => (
                <tr key={app.id} className={`hover:bg-gray-50 ${app.status === 'Approved' ? 'bg-green-primary/5' : app.status === 'Rejected' ? 'bg-red-50' : app.status === 'Pending' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-green-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-green-dark">{app.propertyTitle}</p>
                        <p className="text-xs text-gray-500">App ID: {app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{currentRole === 'farmer' ? app.landowner : app.farmer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-dark">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{app.proposedRent.toLocaleString('en-IN')}/acre</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{app.leaseDuration} months</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-primary/10 text-green-primary' :
                      app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{app.appliedAt}</td>
                  <td className="px-4 py-4">
                    {app.status === 'Pending' && currentRole === 'landowner' ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(app.id)} className="px-3 py-1.5 text-xs bg-green-primary text-white rounded hover:bg-green-dark transition-colors font-medium">Approve</button>
                        <button onClick={() => handleReject(app.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium">Reject</button>
                      </div>
                    ) : app.status === 'Rejected' ? (
                      <div className="text-sm text-red-600">
                        <span className="font-medium">Rejected</span>
                        {app.rejectedReason && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={app.rejectedReason}>
                            Reason: {app.rejectedReason}
                          </div>
                        )}
                      </div>
                    ) : app.status === 'Approved' ? (
                      <span className="text-sm text-green-primary font-medium">Approved</span>
                    ) : (
                      <span className="text-sm text-yellow-700 font-medium">Pending Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaseApplications;