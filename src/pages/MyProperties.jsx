import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, MapPin, DollarSign, Home, Flag, Wheat, Droplet, Leaf, FileText, Upload, X } from 'lucide-react';

const leaseTypes = ['Fixed Rent', 'Crop Share (50-50)', 'Crop Share (60-40)', 'Flexible'];
const soilTypes = ['Black Cotton Soil', 'Alluvial Soil', 'Red Loam Soil', 'Laterite Soil', 'Sandy Loam', 'Clay Soil'];
const rentPeriods = ['year', 'season', 'month'];
const waterAvailabilities = ['Excellent', 'Good', 'Moderate', 'Limited'];

function MyProperties() {
  const { properties, setProperties, leaseApplications, leases } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    acreage: '',
    rentPerAcre: '',
    rentPeriod: 'year',
    leaseType: 'Fixed Rent',
    soilType: 'Black Cotton Soil',
    irrigation: '',
    waterAvailability: 'Good',
    permittedCrops: '',
    description: '',
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageError, setImageError] = useState('');

  // Handle image upload (multiple images)
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Please select only JPG, PNG, or WebP images');
        return;
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setImageError('Each image must be less than 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setImagePreviews((prev) => [...prev, dataUrl]);
        setFormData((prev) => ({ ...prev, images: [...prev.images, dataUrl] }));
        setImageError('');
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove image
  function removeImage(index) {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setImageError('');
  }

  // Check if property has active lease
  function hasActiveLease(propertyId) {
    return leases.some((l) => l.propertyId === propertyId && l.status === 'Active');
  }

  // Check if property has pending applications
  function hasPendingApplications(propertyId) {
    return leaseApplications.some((a) => a.propertyId === propertyId && a.status === 'Pending');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.acreage || Number(formData.acreage) < 0.1) newErrors.acreage = 'Acreage must be at least 0.1';
    if (!formData.rentPerAcre || Number(formData.rentPerAcre) < 1) newErrors.rentPerAcre = 'Rent per acre must be at least 1';
    if (!formData.leaseType) newErrors.leaseType = 'Lease type is required';
    if (!formData.soilType) newErrors.soilType = 'Soil type is required';
    if (!formData.irrigation.trim()) newErrors.irrigation = 'Irrigation details are required';
    if (!formData.waterAvailability) newErrors.waterAvailability = 'Water availability is required';
    if (!formData.permittedCrops.trim()) newErrors.permittedCrops = 'Permitted crops are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;

    if (editingId) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...formData, acreage: Number(formData.acreage), rentPerAcre: Number(formData.rentPerAcre) } : p
        )
      );
    } else {
      const newProp = {
        id: Date.now(),
        ...formData,
        acreage: Number(formData.acreage),
        rentPerAcre: Number(formData.rentPerAcre),
        images: [],
        landowner: 'You (Demo Landowner)',
        status: 'Available',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProperties((prev) => [newProp, ...prev]);
    }
    resetForm();
  }

  function resetForm() {
    setFormData({
      title: '',
      location: '',
      acreage: '',
      rentPerAcre: '',
      rentPeriod: 'year',
      leaseType: 'Fixed Rent',
      soilType: 'Black Cotton Soil',
      irrigation: '',
      waterAvailability: 'Good',
      permittedCrops: '',
      description: '',
      images: [],
    });
    setImagePreviews([]);
    setImageError('');
    setErrors({});
    setSubmitted(false);
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(prop) {
    setFormData({
      title: prop.title,
      location: prop.location,
      acreage: prop.acreage,
      rentPerAcre: prop.rentPerAcre,
      rentPeriod: prop.rentPeriod,
      leaseType: prop.leaseType,
      soilType: prop.soilType,
      irrigation: prop.irrigation,
      waterAvailability: prop.waterAvailability,
      permittedCrops: prop.permittedCrops,
      description: prop.description,
      images: prop.images || [],
    });
    setImagePreviews(prop.images || []);
    setEditingId(prop.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    if (hasActiveLease(id)) {
      alert('Cannot delete this property: it has an active lease. End the lease first.');
      return;
    }
    if (hasPendingApplications(id)) {
      alert('Cannot delete this property: it has pending lease applications. Process them first.');
      return;
    }
    if (window.confirm('Delete this property? This cannot be undone.')) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['title', 'location', 'acreage', 'rentPerAcre', 'leaseType', 'soilType', 'irrigation', 'waterAvailability', 'permittedCrops', 'description'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${hasError ? 'border-red-500' : 'border-gray-300'}`;
  }

  function getTextareaClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && name === 'description');
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary resize-none ${hasError ? 'border-red-500' : 'border-gray-300'}`;
  }

  function getSelectClass(name) {
    const hasError = errors[name];
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${hasError ? 'border-red-500' : 'border-gray-300'}`;
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-dark">My Properties</h1>
          <p className="mt-1 text-gray-600">Manage your farmland listings for farmers to discover.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-green-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Add/Edit Property Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-dark mb-4">{editingId ? 'Edit Property' : 'New Farmland Listing'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Fertile Farmland near Nashik" className={getInputClass('title')} />
              {errors.title && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Nashik, Maharashtra" className={getInputClass('location')} />
              {errors.location && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acreage (acres) *</label>
              <input type="number" name="acreage" value={formData.acreage} onChange={handleChange} required min="0.1" step="0.1" placeholder="e.g. 10" className={getInputClass('acreage')} />
              {errors.acreage && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.acreage}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent per Acre (₹) *</label>
              <input type="number" name="rentPerAcre" value={formData.rentPerAcre} onChange={handleChange} required min="1" placeholder="e.g. 25000" className={getInputClass('rentPerAcre')} />
              {errors.rentPerAcre && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.rentPerAcre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent Period</label>
              <select name="rentPeriod" value={formData.rentPeriod} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary">
                {rentPeriods.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lease Type *</label>
              <select name="leaseType" value={formData.leaseType} onChange={handleChange} required className={getSelectClass('leaseType')}>
                {leaseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.leaseType && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.leaseType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type *</label>
              <select name="soilType" value={formData.soilType} onChange={handleChange} required className={getSelectClass('soilType')}>
                {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.soilType && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.soilType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation *</label>
              <input type="text" name="irrigation" value={formData.irrigation} onChange={handleChange} required placeholder="e.g. Drip irrigation, borewell" className={getInputClass('irrigation')} />
              {errors.irrigation && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.irrigation}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Availability *</label>
              <select name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} required className={getSelectClass('waterAvailability')}>
                {waterAvailabilities.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.waterAvailability && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.waterAvailability}</p>}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Permitted Crops *</label>
              <input type="text" name="permittedCrops" value={formData.permittedCrops} onChange={handleChange} required placeholder="e.g. Grapes, Tomatoes, Onions, Pomegranate" className={getInputClass('permittedCrops')} />
              {errors.permittedCrops && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.permittedCrops}</p>}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe the property: soil quality, water sources, access, nearby markets, certifications, etc." className={getTextareaClass('description')} />
              {errors.description && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><Flag className="w-3.5 h-3.5" />{errors.description}</p>}
            </div>
            {/* Image Upload */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Images (Optional)</label>
              <div className="space-y-2">
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-28 h-28 bg-green-primary/5 rounded-lg overflow-hidden flex items-center justify-center border border-green-primary/20">
                        <img src={preview} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* File Input */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                      id="property-images"
                      multiple
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      {imagePreviews.length > 0 ? 'Add More Images' : 'Choose Images'}
                    </span>
                  </label>
                  {imagePreviews.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setImagePreviews([]); setFormData((prev) => ({ ...prev, images: [] })); setImageError(''); }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove All
                    </button>
                  )}
                </div>
                {imageError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    {imageError}
                  </p>
                )}
                <p className="text-xs text-gray-500">JPG, PNG, or WebP. Max 2MB each. Multiple files allowed.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-green-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">
              {editingId ? 'Update Property' : 'Create Listing'}
            </button>
          </div>
          </div>
        </form>
      )}

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No properties listed yet.</p>
          <p className="text-sm text-gray-400">Click "Add Property" to create your first farmland listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => {
            const activeLease = hasActiveLease(prop.id);
            const pendingApps = hasPendingApplications(prop.id);
            const totalRent = prop.acreage * prop.rentPerAcre;
            return (
              <div key={prop.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-40 bg-green-primary/5 flex items-center justify-center relative">
                  {prop.images && prop.images.length > 0 ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-green-primary/30">
                      <Home className="w-12 h-12 mb-1" />
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${prop.status === 'Available' ? 'bg-green-primary/10 text-green-primary' : 'bg-yellow-50 text-yellow-700'}`}>
                      {prop.status}
                    </span>
                    {activeLease && <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Leased</span>}
                    {pendingApps && <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full">Pending Apps</span>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-green-dark">{prop.title}</h3>
                    <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full">{prop.acreage} acres</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span>{prop.location}</span></div>
                    <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-gray-400" /><span>₹{prop.rentPerAcre.toLocaleString('en-IN')}/{prop.rentPeriod} · ₹{totalRent.toLocaleString('en-IN')} total</span></div>
                    <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-gray-400" /><span>{prop.leaseType}</span></div>
                    <div className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 text-gray-400" /><span>{prop.soilType}</span></div>
                    <div className="flex items-center gap-2"><Droplet className="w-3.5 h-3.5 text-gray-400" /><span>{prop.waterAvailability} water</span></div>
                    <div className="flex items-center gap-2"><Wheat className="w-3.5 h-3.5 text-gray-400" /><span className="truncate max-w-[200px]">{prop.permittedCrops}</span></div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => startEdit(prop)} className="flex-1 px-3 py-1.5 text-xs bg-green-primary/10 text-green-primary rounded hover:bg-green-primary/20 transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(prop.id)} disabled={activeLease || pendingApps} className="flex-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyProperties;