import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Home, Wheat, Droplet, Leaf, FileText, Tag, AlertCircle, Flag, Send, CheckCircle, MapPin as MapPinIcon } from 'lucide-react';

function PropertyDetails() {
  const { id } = useParams();
  const { properties, leaseApplications, setLeaseApplications } = useOutletContext();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    proposedRent: '',
    leaseDuration: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  const property = properties.find((p) => p.id === Number(id));

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Home className="w-12 h-12 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-green-dark mb-2">Property Not Found</h1>
        <p className="text-gray-500 mb-4">This listing may have been removed.</p>
        <Link to="/dashboard/find-farmland" className="text-sm text-green-primary hover:text-green-dark font-medium no-underline">
          ← Back to Find Farmland
        </Link>
      </div>
    );
  }

  // Check if farmer already has pending application for this property
  const existingApplication = leaseApplications.find(
    (a) => a.propertyId === property.id && a.farmer === 'You (Demo Farmer)' && a.status === 'Pending'
  );

  const totalRent = property.acreage * property.rentPerAcre;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApplyError('');
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.proposedRent || Number(formData.proposedRent) < 1) newErrors.proposedRent = 'Proposed rent must be at least 1';
    if (!formData.leaseDuration || Number(formData.leaseDuration) < 1) newErrors.leaseDuration = 'Lease duration must be at least 1 month';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Prevent duplicate submissions
    if (isSubmitting) return;
    // Clear stale errors on new attempt
    setErrors({});
    setApplyError('');
    setSubmitted(true);
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Check for existing pending application
    if (existingApplication) {
      setApplyError('You already have a pending application for this property.');
      setIsSubmitting(false);
      return;
    }

    // Check if property is still available
    if (property.status !== 'Available') {
      setApplyError('This property is no longer available for lease.');
      setIsSubmitting(false);
      return;
    }

    const newApplication = {
      id: property.id * 10000 + (leaseApplications.length + 1),
      propertyId: property.id,
      propertyTitle: property.title,
      farmer: 'You (Demo Farmer)',
      landowner: property.landowner,
      proposedRent: Number(formData.proposedRent),
      leaseDuration: Number(formData.leaseDuration),
      message: formData.message,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setLeaseApplications((prev) => [newApplication, ...prev]);
    setApplied(true);
    setShowApplyForm(false);
    setIsSubmitting(false);
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['proposedRent', 'leaseDuration'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${hasError ? 'border-red-500' : 'border-gray-300'}`;
  }

  return (
    <div>
      <Link to="/dashboard/find-farmland" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-primary mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Find Farmland
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — property info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-64 bg-green-primary/5 flex items-center justify-center relative overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-green-primary/30">
                  <Home className="w-16 h-16 mb-2" />
                  <span className="text-sm">No Image Available</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 text-sm rounded-full ${property.status === 'Available' ? 'bg-green-primary/10 text-green-primary' : property.status === 'Leased' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                  {property.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-green-dark">{property.title}</h1>
                <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full">{property.acreage} acres</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-dark">₹{property.rentPerAcre.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">per acre / {property.rentPeriod}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-cream rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Total Rent</p>
                <p className="font-semibold text-green-dark">₹{totalRent.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-cream rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FileText className="w-3.5 h-3.5" />Lease Type</p>
                <p className="font-semibold text-green-dark">{property.leaseType}</p>
              </div>
              <div className="bg-cream rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Leaf className="w-3.5 h-3.5" />Soil Type</p>
                <p className="font-semibold text-green-dark">{property.soilType}</p>
              </div>
              <div className="bg-cream rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Droplet className="w-3.5 h-3.5" />Water</p>
                <p className="font-semibold text-green-dark">{property.waterAvailability}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />Location</h3>
                <p className="text-sm text-gray-600">{property.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Tag className="w-4 h-4" />Rent Period</h3>
                <p className="text-sm text-gray-600">{property.rentPeriod.charAt(0).toUpperCase() + property.rentPeriod.slice(1)}ly</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Droplet className="w-4 h-4" />Irrigation</h3>
              <p className="text-sm text-gray-600">{property.irrigation}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Wheat className="w-4 h-4" />Permitted Crops</h3>
              <p className="text-sm text-gray-600">{property.permittedCrops}</p>
            </div>

            {property.description && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Owner vs Predicted info disclaimer */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>All details are provided by the landowner. Predicted or estimated information (like yield potential) is clearly marked. Verify details before applying.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — apply panel */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            {applied ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-dark mb-1">Application Submitted!</h3>
                <p className="text-sm text-gray-500 mb-4">Your lease application has been sent to the landowner.</p>
                <Link to="/dashboard/lease-applications" className="text-sm text-green-primary hover:text-green-dark font-medium no-underline">
                  View My Applications →
                </Link>
              </div>
            ) : existingApplication ? (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-yellow-700 mb-1">Application Pending</h3>
                <p className="text-sm text-gray-500 mb-4">You already have a pending application for this property.</p>
                <Link to="/dashboard/lease-applications" className="text-sm text-green-primary hover:text-green-dark font-medium no-underline">
                  View My Applications →
                </Link>
              </div>
            ) : property.status !== 'Available' ? (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-1">Not Available</h3>
                <p className="text-sm text-gray-500 mb-4">This property is no longer available for new lease applications.</p>
              </div>
            ) : (
              <>
                {!showApplyForm ? (
                  <button onClick={() => setShowApplyForm(true)} className="w-full bg-green-primary text-white py-3 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">
                    <Send className="w-4 h-4 inline mr-2" />
                    Apply for Lease
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-dark mb-4">Submit Lease Application</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Rent per Acre (₹) *</label>
                      <input type="number" name="proposedRent" value={formData.proposedRent} onChange={handleChange} required min="1" placeholder="e.g. 28000" className={getInputClass('proposedRent')} />
                      {errors.proposedRent && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.proposedRent}</p>}
                      <p className="mt-1 text-xs text-gray-500">Listed: ₹{property.rentPerAcre.toLocaleString('en-IN')}/acre</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration (months) *</label>
                      <input type="number" name="leaseDuration" value={formData.leaseDuration} onChange={handleChange} required min="1" max="120" placeholder="e.g. 12" className={getInputClass('leaseDuration')} />
                      {errors.leaseDuration && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.leaseDuration}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message to Landowner</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Introduce yourself, farming experience, intended crops, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary resize-none" />
                    </div>
                    
                    {applyError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {applyError}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setShowApplyForm(false); setFormData({ proposedRent: '', leaseDuration: '', message: '' }); setErrors({}); setSubmitted(false); setApplyError(''); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 bg-green-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">Submit Application</button>
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center">Demo only — no legally binding contract created.</p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;