import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft, Wheat, IndianRupee, User, CheckCircle, Gavel } from 'lucide-react';

function ManageBids() {
  const { id } = useParams();
  const { requirements, setRequirements, bids, setBids, orders, setOrders } = useOutletContext();

  const [processing, setProcessing] = useState(false);

  const requirement = requirements.find((r) => r.id === Number(id));

  if (!requirement) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Wheat className="w-12 h-12 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-green-dark mb-2">Requirement Not Found</h1>
        <p className="text-gray-500 mb-4">This requirement may have been removed.</p>
        <Link to="/dashboard/crop-requirements" className="text-sm text-green-primary hover:text-green-dark font-medium no-underline">
          ← Back to Requirements
        </Link>
      </div>
    );
  }

  const requirementBids = bids.filter((b) => b.requirementId === requirement.id);
  const acceptedBid = requirementBids.find((b) => b.status === 'Accepted');

  const stages = ['Farmer Selected', 'Growing', 'Ready for Harvest', 'Delivered'];

  function handleActionClick(type, bidId) {
    if (processing) return;

    const bid = requirementBids.find((b) => b.id === bidId);

    // Guard: cannot accept/reject an already-finalized bid
    if (type === 'accept' && bid?.status === 'Accepted') return;
    if (type === 'reject' && bid?.status !== 'Pending') return;

    // Guard: only one bid can be accepted per requirement
    if (type === 'accept' && acceptedBid && acceptedBid.id !== bidId) {
      alert('A bid has already been accepted for this requirement. Only one bid can be accepted.');
      return;
    }

    setProcessing(true);

    if (type === 'accept') {
      // Accept the bid and reject all other pending bids
      setBids((prev) =>
        prev.map((b) =>
          b.id === bidId ? { ...b, status: 'Accepted' } : b.status === 'Pending' ? { ...b, status: 'Rejected' } : b
        )
      );
      // Update requirement status
      setRequirements((prev) =>
        prev.map((r) => (r.id === requirement.id ? { ...r, status: 'Awarded' } : r))
      );
      // Create order
      const acceptedBidObj = requirementBids.find((b) => b.id === bidId);
      const newOrder = {
        id: requirement.id * 10000 + bidId,
        requirementId: requirement.id,
        bidId: bidId,
        crop: requirement.crop,
        category: requirement.category,
        farmer: acceptedBidObj?.farmer || 'Unknown Farmer',
        retailer: requirement.retailer,
        agreedPrice: acceptedBidObj?.proposedPrice || 0,
        quantity: acceptedBidObj?.expectedQuantity || 0,
        unit: requirement.unit,
        estimatedHarvestDate: acceptedBidObj?.estimatedHarvestDate || '',
        qualitySpecs: requirement.qualitySpecs,
        location: requirement.location,
        status: 'Farmer Selected',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setOrders((prev) => [newOrder, ...prev]);
    } else if (type === 'reject') {
      // Reject the bid
      setBids((prev) =>
        prev.map((b) => (b.id === bidId ? { ...b, status: 'Rejected' } : b))
      );
    }

    setProcessing(false);
  }

  // Advance order status
  function advanceOrder(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: stages[currentIndex + 1], updatedAt: new Date().toISOString().split('T')[0] } : o
        )
      );
    }
  }

  const order = orders.find((o) => o.requirementId === requirement.id);

  return (
    <div>
      <Link to="/dashboard/crop-requirements" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-primary mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Requirements
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">Manage Bids: {requirement.crop}</h1>
        <p className="mt-1 text-gray-600">Review and manage farmer bids for this requirement.</p>
      </div>

      {/* Requirement Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div><p className="text-sm text-gray-500">Quantity Needed</p><p className="font-semibold text-green-dark">{requirement.quantity} {requirement.unit}</p></div>
          <div><p className="text-sm text-gray-500">Target Price</p><p className="font-semibold text-green-dark">₹{requirement.targetPrice}/{requirement.unit}</p></div>
          <div><p className="text-sm text-gray-500">Location</p><p className="font-semibold text-green-dark">{requirement.location}</p></div>
          <div><p className="text-sm text-gray-500">Required By</p><p className="font-semibold text-green-dark">{requirement.requiredBy}</p></div>
        </div>
        <div className="bg-cream rounded-lg p-4">
          <p className="text-sm text-gray-700"><strong>Quality Specs:</strong> {requirement.qualitySpecs}</p>
        </div>
      </div>

      {/* Order Progress */}
      {order && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-dark mb-4">Order Progress</h2>
          <div className="flex items-center justify-between">
            {['Farmer Selected', 'Growing', 'Ready for Harvest', 'Delivered'].map((stage, idx) => (
              <div key={stage} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${order.status === stage || stages.indexOf(order.status) > idx ? 'bg-green-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {stages.indexOf(order.status) >= idx ? <CheckCircle className="w-5 h-5" /> : <span>{idx + 1}</span>}
                </div>
                <p className={`mt-2 text-xs text-center ${order.status === stage ? 'font-semibold text-green-dark' : 'text-gray-500'}`}>{stage}</p>
                {idx < 3 && <div className={`absolute top-4 left-[calc(50%+5px)] w-[calc(100%-10px)] h-0.5 ${stages.indexOf(order.status) > idx ? 'bg-green-primary' : 'bg-gray-200'} lg:w-[calc(100%-10px)]`} />}
              </div>
            ))}
          </div>
          {order.status !== 'Delivered' && (
            <div className="mt-4 text-center">
              <button onClick={() => advanceOrder(order.id)} className="px-6 py-2 bg-green-primary text-white rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">
                Advance to Next Stage
              </button>
              <p className="mt-2 text-xs text-gray-500">Demo: Click to simulate order progression</p>
            </div>
          )}
        </div>
      )}

      {/* Bids List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {requirementBids.length === 0 ? (
          <div className="p-12 text-center">
            <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bids received yet.</p>
            <p className="text-sm text-gray-400">Farmers will submit bids that appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proposed Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Harvest</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requirementBids.map((bid) => (
                  <tr key={bid.id} className={`hover:bg-gray-50 ${bid.status === 'Accepted' ? 'bg-green-primary/5' : bid.status === 'Rejected' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-primary/10 rounded-lg flex items-center justify-center"><User className="w-5 h-5 text-green-primary" /></div>
                        <div>
                          <p className="font-medium text-green-dark">{bid.farmer}</p>
                          <p className="text-xs text-gray-500">Bid: {bid.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm font-medium text-green-dark"><IndianRupee className="w-4 h-4" />₹{bid.proposedPrice}/{bid.unit}</div></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm text-gray-600"><Wheat className="w-4 h-4" />{bid.expectedQuantity} {bid.unit}</div></td>
                    <td className="px-4 py-4 text-sm text-gray-600">{bid.estimatedHarvestDate}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate">{bid.message || '<em class="text-gray-400">No message</em>'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bid.status === 'Accepted' ? 'bg-green-primary/10 text-green-primary' : bid.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>{bid.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      {bid.status === 'Accepted' ? (
                        <span className="text-sm text-green-primary font-medium">Accepted</span>
                      ) : bid.status === 'Rejected' ? (
                        <span className="text-sm text-red-600 font-medium">Rejected</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleActionClick('accept', bid.id)}
                            disabled={processing}
                            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${processing ? 'bg-gray-400 text-gray-200' : 'bg-green-primary text-white hover:bg-green-dark'}`}
                          >
                            {processing ? 'Processing...' : 'Accept'}
                          </button>
                          <button
                            onClick={() => handleActionClick('reject', bid.id)}
                            disabled={processing}
                            className={`px-3 py-1.5 text-xs rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${processing ? 'bg-gray-400 text-gray-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                          >
                            {processing ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageBids;