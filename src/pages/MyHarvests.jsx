import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, X, Wheat, MapPin, Calendar, IndianRupee, AlertCircle, Package, Trash2, Upload } from 'lucide-react';
import { cropCategories, generateId } from '../data/harvests';

function MyHarvests() {
  const { harvests, setHarvests, bookings } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    crop: '',
    category: 'Vegetables',
    quantity: '',
    pricePerKg: '',
    location: '',
    harvestDate: '',
    description: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Handle form field changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  // Handle image upload
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, image: '' }));
      setImagePreview('');
      setImageError('');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Please select a JPG, PNG, or WebP image');
      setFormData((prev) => ({ ...prev, image: '' }));
      setImagePreview('');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setImageError('Image must be less than 2MB');
      setFormData((prev) => ({ ...prev, image: '' }));
      setImagePreview('');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setImagePreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      setImageError('');
    };
    reader.readAsDataURL(file);
  }

  // Remove image
  function removeImage() {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview('');
    setImageError('');
  }

  // Validate form
  function validateForm() {
    const newErrors = {};
    if (!formData.crop.trim()) newErrors.crop = 'Crop name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.quantity || Number(formData.quantity) < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.pricePerKg || Number(formData.pricePerKg) < 1) newErrors.pricePerKg = 'Price must be at least 1';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Add a new harvest listing
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;

    const newHarvest = {
      id: generateId(),
      crop: formData.crop,
      category: formData.category,
      image: formData.image, // Store base64 data URL or empty string
      quantity: Number(formData.quantity),
      unit: 'kg',
      pricePerKg: Number(formData.pricePerKg),
      location: formData.location,
      harvestDate: formData.harvestDate,
      farmer: 'You (Demo Farmer)',
      description: formData.description,
    };
    setHarvests((prev) => [newHarvest, ...prev]);
    setFormData({
      crop: '',
      category: 'Vegetables',
      quantity: '',
      pricePerKg: '',
      location: '',
      harvestDate: '',
      description: '',
      image: '',
    });
    setImagePreview('');
    setImageError('');
    setErrors({});
    setSubmitted(false);
    setShowForm(false);
  }

  // Check if harvest has active bookings (not cancelled)
  function hasActiveBookings(harvestId) {
    return bookings.some((b) => b.harvestId === harvestId && b.status !== 'Cancelled');
  }

  // Handle delete with confirmation
  function handleDeleteClick(harvestId) {
    if (hasActiveBookings(harvestId)) {
      alert('Cannot delete this harvest: it has active bookings. Cancel the bookings first.');
      return;
    }
    setDeleteConfirmId(harvestId);
  }

  function confirmDelete(harvestId) {
    setHarvests((prev) => prev.filter((h) => h.id !== harvestId));
    setDeleteConfirmId(null);
  }

  function cancelDelete() {
    setDeleteConfirmId(null);
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['crop', 'quantity', 'pricePerKg', 'location', 'harvestDate'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${
      hasError
        ? 'border-red-500'
        : 'border-gray-300'
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
          <h1 className="text-2xl font-bold text-green-dark">My Harvests</h1>
          <p className="mt-1 text-gray-600">Manage your crop listings for retailers to browse.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-green-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Harvest'}
        </button>
      </div>

      {/* Add Harvest Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-green-dark mb-4">New Harvest Listing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {errors.crop && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.crop}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={getSelectClass('category')}
              >
                {cropCategories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 500"
                className={getInputClass('quantity')}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.quantity}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (₹) *</label>
              <input
                type="number"
                name="pricePerKg"
                value={formData.pricePerKg}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 35"
                className={getInputClass('pricePerKg')}
              />
              {errors.pricePerKg && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.pricePerKg}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Nashik, Maharashtra"
                className={getInputClass('location')}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.location}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Harvest Date *</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className={getInputClass('harvestDate')}
              />
              {errors.harvestDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.harvestDate}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your produce quality, growing methods, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary resize-none"
              />
            </div>
            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Image (Optional)</label>
              <div className="space-y-2">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-40 h-40 bg-green-primary/5 rounded-lg overflow-hidden flex items-center justify-center border border-green-primary/20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
                      id="harvest-image"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      {imagePreview ? 'Replace Image' : 'Choose Image'}
                    </span>
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {imageError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {imageError}
                  </p>
                )}
                <p className="text-xs text-gray-500">JPG, PNG, or WebP. Max 2MB.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-green-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors"
            >
              Create Listing
            </button>
          </div>
        </form>
      )}

      {/* Harvest listings grid */}
      {harvests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Wheat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No harvest listings yet. Click &quot;Add Harvest&quot; to create your first listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{harvests.map((harvest) => {
              // Calculate bookings for this harvest
              const harvestBookings = bookings.filter((b) => b.harvestId === harvest.id);
              const totalBookedQty = harvestBookings.reduce((sum, b) => sum + b.quantity, 0);
              const hasBookings = harvestBookings.length > 0;
              const hasActiveBookings = bookings.some((b) => b.harvestId === harvest.id && b.status !== 'Cancelled');
              const showDeleteConfirm = deleteConfirmId === harvest.id;

              return (
                <div key={harvest.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Crop image or placeholder */}
                  <div className="h-40 bg-green-primary/5 flex items-center justify-center overflow-hidden relative">
                    {harvest.image ? (
                      <img
                        src={harvest.image}
                        alt={harvest.crop}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wheat className="w-10 h-10 text-green-primary/30" />
                    )}
                    {hasBookings && (
                      <div className="absolute top-2 right-2 bg-green-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {harvestBookings.length} booking{harvestBookings.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {/* Delete button */}
                    <div className="absolute top-2 left-2">
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg">
                          <span className="text-xs text-gray-700 px-2">Delete?</span>
                          <button
                            onClick={() => confirmDelete(harvest.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(harvest.id)}
                          disabled={hasActiveBookings}
                          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={hasActiveBookings ? 'Cannot delete: active bookings exist' : 'Delete harvest'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-green-dark">{harvest.crop}</h3>
                      <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full">
                        {harvest.category}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                        <span>₹{harvest.pricePerKg}/{harvest.unit} · {harvest.quantity} {harvest.unit} available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{harvest.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Harvest: {harvest.harvestDate}</span>
                      </div>
                      {hasBookings && (
                        <div className="flex items-center gap-2 text-sm text-green-dark bg-green-primary/5 px-2 py-1 rounded-lg">
                          <Package className="w-3.5 h-3.5" />
                          <span>{totalBookedQty} {harvest.unit} reserved across {harvestBookings.length} booking{harvestBookings.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
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

export default MyHarvests;
