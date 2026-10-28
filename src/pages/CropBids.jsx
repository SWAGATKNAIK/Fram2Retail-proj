import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Wheat, MapPin, Calendar, IndianRupee, Gavel, Flag } from 'lucide-react';
import { cropCategories } from '../data/harvests';

function CropBids() {
  const { requirements, bids, setBids, demoIdentities } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBidForm, setShowBidForm] = useState(false);
  const [biddingReq, setBiddingReq] = useState(null);
  const [formData, setFormData] = useState({
    proposedPrice: '',
    expectedQuantity: '',
    estimatedHarvestDate: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter open requirements
  const openRequirements = requirements.filter((r) => r.status === 'Open');
  const filteredRequirements = openRequirements.filter((req) => {
    const matchesSearch =
      req.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.retailer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get farmer's bids
  const myBids = bids.filter((b) => b.farmer === demoIdentities.farmer);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validateBidForm() {
    const newErrors = {};
    if (!formData.proposedPrice || Number(formData.proposedPrice) < 1) newErrors.proposedPrice = 'Proposed price must be at least 1';
    if (!formData.expectedQuantity || Number(formData.expectedQuantity) < 1) newErrors.expectedQuantity = 'Expected quantity must be at least 1';
    if (!formData.estimatedHarvestDate) newErrors.estimatedHarvestDate = 'Estimated harvest date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBidSubmit(e) {
    e.preventDefault();
    // Prevent duplicate submissions
    if (isSubmitting) return;
    // Clear stale errors on new attempt
    setErrors({});
    setSubmitted(true);
    if (!validateBidForm()) return;

    setIsSubmitting(true);

    const newBid = {
      id: Date.now(),
      requirementId: biddingReq.id,
      crop: biddingReq.crop,
      farmer: demoIdentities.farmer,
      proposedPrice: Number(formData.proposedPrice),
      expectedQuantity: Number(formData.expectedQuantity),
      unit: biddingReq.unit,
      estimatedHarvestDate: formData.estimatedHarvestDate,
      message: formData.message,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBids((prev) => [newBid, ...prev]);
    setIsSubmitting(false);
    resetBidForm();
  }

  function resetBidForm() {
    setFormData({
      proposedPrice: '',
      expectedQuantity: '',
      estimatedHarvestDate: '',
      message: '',
    });
    setErrors({});
    setSubmitted(false);
    setShowBidForm(false);
    setBiddingReq(null);
  }

  function startBid(req) {
    setBiddingReq(req);
    setShowBidForm(true);
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['proposedPrice', 'expectedQuantity', 'estimatedHarvestDate'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;
  }

  function getTextareaClass() {
    return `w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary resize-none`;
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">Crop Bids</h1>
        <p className="mt-1 text-gray-600">Browse retailer requirements and submit your bids.</p>
      </div>

      {/* Bid Form Modal */}
      {showBidForm && biddingReq && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-dark">Submit Bid for {biddingReq.crop}</h2>
                <button onClick={resetBidForm} className="text-gray-400 hover:text-gray-600"><Gavel className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Price per {biddingReq.unit} (₹) *</label>
                  <input type="number" name="proposedPrice" value={formData.proposedPrice} onChange={handleChange} required min="1" placeholder="e.g. 38" className={getInputClass('proposedPrice')} />
                  {errors.proposedPrice && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.proposedPrice}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Quantity ({biddingReq.unit}) *</label>
                  <input type="number" name="expectedQuantity" value={formData.expectedQuantity} onChange={handleChange} required min="1" placeholder="e.g. 3000" className={getInputClass('expectedQuantity')} />
                  {errors.expectedQuantity && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.expectedQuantity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Harvest Date *</label>
                  <input type="date" name="estimatedHarvestDate" value={formData.estimatedHarvestDate} onChange={handleChange} required className={getInputClass('estimatedHarvestDate')} />
                  {errors.estimatedHarvestDate && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.estimatedHarvestDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message to Retailer</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Brief note about your farming practices, certifications, etc." className={getTextareaClass('message')} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={resetBidForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="bg-green-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-dark">Submit Bid</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Bid Form */}
      {showBidForm && biddingReq && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 lg:block hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-green-dark">Submit Bid for {biddingReq.crop}</h2>
            <button onClick={resetBidForm} className="text-gray-400 hover:text-gray-600"><Gavel className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleBidSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Price per {biddingReq.unit} (₹) *</label>
              <input type="number" name="proposedPrice" value={formData.proposedPrice} onChange={handleChange} required min="1" placeholder="e.g. 38" className={getInputClass('proposedPrice')} />
              {errors.proposedPrice && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.proposedPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Quantity ({biddingReq.unit}) *</label>
              <input type="number" name="expectedQuantity" value={formData.expectedQuantity} onChange={handleChange} required min="1" placeholder="e.g. 3000" className={getInputClass('expectedQuantity')} />
              {errors.expectedQuantity && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.expectedQuantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Harvest Date *</label>
              <input type="date" name="estimatedHarvestDate" value={formData.estimatedHarvestDate} onChange={handleChange} required className={getInputClass('estimatedHarvestDate')} />
              {errors.estimatedHarvestDate && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.estimatedHarvestDate}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message to Retailer</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Brief note about your farming practices, certifications, etc." className={getTextareaClass('message')} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={resetBidForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="bg-green-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-dark">Submit Bid</button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by crop, location, or retailer..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary">
          <option value="All">All Categories</option>
          {cropCategories.filter((c) => c !== 'All').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Open Requirements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-green-dark mb-4">Open Requirements ({filteredRequirements.length})</h2>
        {filteredRequirements.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Wheat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No open requirements match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequirements.map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wheat className="w-7 h-7 text-green-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-green-dark text-lg">{req.crop}</h3>
                          <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full">{req.category}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">by {req.retailer}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1"><Wheat className="w-3.5 h-3.5" />{req.quantity} {req.unit} needed</span>
                          <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />Target: ₹{req.targetPrice}/{req.unit}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{req.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />By {req.requiredBy}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => startBid(req)} className="px-4 py-2 bg-green-primary text-white rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">Submit Bid</button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600"><strong>Quality Specs:</strong> {req.qualitySpecs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Bids */}
      <div>
        <h2 className="text-xl font-semibold text-green-dark mb-4">My Bids ({myBids.length})</h2>
        {myBids.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">You haven't submitted any bids yet.</p>
            <p className="text-sm text-gray-400">Browse open requirements above and submit your first bid.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proposed Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Harvest</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myBids.map((bid) => (
                    <tr key={bid.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-primary/10 rounded-lg flex items-center justify-center"><Wheat className="w-5 h-5 text-green-primary" /></div>
                          <div>
                            <p className="font-medium text-green-dark">{bid.crop}</p>
                            <p className="text-xs text-gray-500">Req: {bid.requirementId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className="text-sm text-gray-600">{bid.retailer || demoIdentities.retailer}</span></td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm font-medium text-green-dark"><IndianRupee className="w-4 h-4" />₹{bid.proposedPrice}/{bid.unit}</div></td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2 text-sm text-gray-600"><Wheat className="w-4 h-4" />{bid.expectedQuantity} {bid.unit}</div></td>
                      <td className="px-4 py-4 text-sm text-gray-600">{bid.estimatedHarvestDate}</td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bid.status === 'Accepted' ? 'bg-green-primary/10 text-green-primary' : bid.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>{bid.status}</span></td>
                      <td className="px-4 py-4 text-sm text-gray-600">{bid.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropBids;