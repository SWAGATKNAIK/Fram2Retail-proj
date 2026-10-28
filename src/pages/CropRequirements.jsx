import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, Search, Wheat, MapPin, Calendar, IndianRupee, Flag } from 'lucide-react';
import { cropCategories } from '../data/harvests';

function CropRequirements() {
  const { requirements, setRequirements, demoIdentities } = useOutletContext();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    crop: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'kg',
    qualitySpecs: '',
    targetPrice: '',
    location: '',
    requiredBy: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter requirements
  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.retailer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || req.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.crop.trim()) newErrors.crop = 'Crop name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.quantity || Number(formData.quantity) < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.qualitySpecs.trim()) newErrors.qualitySpecs = 'Quality specifications are required';
    if (!formData.targetPrice || Number(formData.targetPrice) < 1) newErrors.targetPrice = 'Target price must be at least 1';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.requiredBy) newErrors.requiredBy = 'Required delivery date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Prevent duplicate submissions
    if (isSubmitting) return;
    // Clear stale errors on new attempt
    setErrors({});
    setSubmitted(true);
    if (!validateForm()) return;

    setIsSubmitting(true);

    if (editingId) {
      // Update existing requirement
      setRequirements((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...formData, quantity: Number(formData.quantity), targetPrice: Number(formData.targetPrice) } : r
        )
      );
    } else {
      // Create new requirement
      const newReq = {
        id: Date.now(),
        ...formData,
        quantity: Number(formData.quantity),
        targetPrice: Number(formData.targetPrice),
        retailer: demoIdentities.retailer,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRequirements((prev) => [newReq, ...prev]);
    }

    setIsSubmitting(false);
    resetForm();
  }

  function resetForm() {
    setFormData({
      crop: '',
      category: 'Vegetables',
      quantity: '',
      unit: 'kg',
      qualitySpecs: '',
      targetPrice: '',
      location: '',
      requiredBy: '',
    });
    setErrors({});
    setSubmitted(false);
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(req) {
    setFormData({
      crop: req.crop,
      category: req.category,
      quantity: req.quantity,
      unit: req.unit,
      qualitySpecs: req.qualitySpecs,
      targetPrice: req.targetPrice,
      location: req.location,
      requiredBy: req.requiredBy,
    });
    setEditingId(req.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this requirement? This cannot be undone.')) {
      setRequirements((prev) => prev.filter((r) => r.id !== id));
    }
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['crop', 'quantity', 'qualitySpecs', 'targetPrice', 'location', 'requiredBy'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;
  }

  function getTextareaClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && name === 'qualitySpecs');
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary resize-none ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;
  }

  function getSelectClass(name) {
    const hasError = errors[name];
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-dark">Crop Requirements</h1>
          <p className="mt-1 text-gray-600">Create and manage your crop procurement requirements.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-green-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Requirement
        </button>
      </div>

      {/* Add/Edit Requirement Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-dark mb-4">{editingId ? 'Edit Requirement' : 'New Crop Requirement'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                required
                placeholder="e.g. Tomatoes"
                className={getInputClass('crop')}
              />
              {errors.crop && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.crop}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className={getSelectClass('category')}>
                {cropCategories.filter((c) => c !== 'All').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 5000"
                className={getInputClass('quantity')}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary">
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="quintal">quintal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Price per Unit (₹) *</label>
              <input
                type="number"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 40"
                className={getInputClass('targetPrice')}
              />
              {errors.targetPrice && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.targetPrice}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Pune, Maharashtra"
                className={getInputClass('location')}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required By *</label>
              <input
                type="date"
                name="requiredBy"
                value={formData.requiredBy}
                onChange={handleChange}
                required
                className={getInputClass('requiredBy')}
              />
              {errors.requiredBy && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.requiredBy}</p>}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Specifications *</label>
              <textarea
                name="qualitySpecs"
                value={formData.qualitySpecs}
                onChange={handleChange}
                required
                rows={3}
                placeholder="e.g. Grade A, firm, uniform red color, no blemishes, size 50-60mm"
                className={getTextareaClass('qualitySpecs')}
              />
              {errors.qualitySpecs && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.qualitySpecs}</p>}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-green-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">
              {editingId ? 'Update Requirement' : 'Create Requirement'}
            </button>
          </div>
        </form>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, location, or retailer..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
          />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary">
          <option value="All">All Categories</option>
          {cropCategories.filter((c) => c !== 'All').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">Showing {filteredRequirements.length} of {requirements.length} requirements</p>

      {/* Requirements List */}
      {filteredRequirements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No requirements found.</p>
          <p className="text-sm text-gray-400">Create your first crop requirement to get started.</p>
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
                        <span className={`text-xs px-2 py-0.5 rounded-full ${req.status === 'Open' ? 'bg-green-primary/10 text-green-primary' : req.status === 'Awarded' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">by {req.retailer}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Wheat className="w-3.5 h-3.5" />{req.quantity} {req.unit}</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />₹{req.targetPrice}/{req.unit}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{req.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />By {req.requiredBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button onClick={() => startEdit(req)} className="px-3 py-1.5 text-sm bg-green-primary/10 text-green-primary rounded hover:bg-green-primary/20 transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(req.id)} className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium">Delete</button>
                    <button onClick={() => navigate(`/dashboard/manage-bids/${req.id}`)} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium">Manage Bids</button>
                  </div>
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
  );
}

export default CropRequirements;