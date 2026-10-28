import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { FlaskConical, MapPin, Search, ArrowRight, Wheat, Leaf, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { analyzeSoil } from '../utils/soilAnalysis';

function SoilIntelligence() {
  const { harvests, properties } = useOutletContext();
  
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    cropInterest: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Get unique locations from harvests and properties for suggestions
  const harvestLocations = [...new Set(harvests.map(h => h.location).filter(Boolean))];
  const propertyLocations = [...new Set(properties.map(p => p.location).filter(Boolean))];
  const allLocations = [...new Set([...harvestLocations, ...propertyLocations])];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required (e.g., Nashik, Maharashtra)';
    }
    if (!formData.area || parseFloat(formData.area) < 0.1) {
      newErrors.area = 'Area must be at least 0.1 acres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const analysis = await analyzeSoil({
        location: formData.location,
        area: formData.area,
        cropInterest: formData.cropInterest || undefined,
      });
      setResult(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setFormData({ location: '', area: '', cropInterest: '' });
    setErrors({});
    setSubmitted(false);
    setResult(null);
    setError(null);
  }

  function getInputClass(name) {
    const hasError = errors[name] || (submitted && !formData[name] && ['location', 'area'].includes(name));
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${hasError ? 'border-red-500' : 'border-gray-300'}`;
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark flex items-center gap-2">
          <FlaskConical className="w-6 h-6" />
          Soil Intelligence
        </h1>
        <p className="mt-1 text-gray-600">Analyze soil conditions for your farm location and get crop recommendations.</p>
      </div>

      {/* Analysis Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-green-dark mb-4">Soil Analysis Request</h2>
          
          <div className="space-y-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Nashik, Maharashtra"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary ${getInputClass('location')}`}
                  list="location-suggestions"
                />
                <datalist id="location-suggestions">
                  {allLocations.slice(0, 10).map(loc => <option key={loc} value={loc} />)}
                  <option value="Nashik, Maharashtra" />
                  <option value="Pune, Maharashtra" />
                  <option value="Karnal, Haryana" />
                  <option value="Erode, Tamil Nadu" />
                  <option value="Punjab" />
                  <option value="Karnataka" />
                </datalist>
              </div>
              {(errors.location || (submitted && !formData.location)) && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.location || 'Location is required'}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">Enter village, district, or state. Suggestions from your harvests/properties shown.</p>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                placeholder="e.g., 5"
                className={getInputClass('area')}
              />
              {(errors.area || (submitted && !formData.area)) && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.area || 'Area is required'}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">Enter your farm area in acres (minimum 0.1).</p>
            </div>

            {/* Crop Interest (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop of Interest (Optional)</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="cropInterest"
                  value={formData.cropInterest}
                  onChange={handleChange}
                  placeholder="e.g., Cotton, Rice, Tomato..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 focus:border-green-primary"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Filter recommendations by a specific crop you're planning to grow.</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit button */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-primary text-white py-3 rounded-lg text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4" />
                  Predict Soil
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Result header with reset */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-green-dark flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-primary" />
                Analysis Complete
              </h2>
              <p className="text-sm text-gray-500 mt-1">Location: {result.location} • Area: {result.area} acres</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </button>
          </div>

          {/* Error if any */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Predicted Soil Type */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-green-primary/5 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-green-primary/10 rounded-xl flex items-center justify-center">
                  <FlaskConical className="w-7 h-7 text-green-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-dark">{result.predictedSoil.name}</h3>
                  <p className="text-sm text-gray-500">Predicted soil type for {result.location}</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-gray-600 mb-4">{result.predictedSoil.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Leaf className="w-3.5 h-3.5" />Common Regions</p>
                  <p className="font-medium text-green-dark">{result.predictedSoil.regions.join(', ')}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Wheat className="w-3.5 h-3.5" />Farm Area</p>
                  <p className="font-medium text-green-dark">{result.area} acres</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{result.disclaimer}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Area Insight */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-dark mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Area Assessment
            </h3>
            <p className="text-gray-600">{result.areaInsight}</p>
          </div>

          {/* Crop Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-green-primary/5 border-b border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-green-dark flex items-center gap-2">
                <Wheat className="w-5 h-5" />
                Crop Recommendations
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {result.cropInterest 
                  ? `Filtered for "${result.cropInterest}"` 
                  : 'Based on predicted soil type and regional suitability'}
              </p>
            </div>
            
            {result.cropRecommendations.length > 0 ? (
              <div className="p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Suitability</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {result.cropRecommendations.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-green-dark">{rec.crop}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-primary rounded-full transition-all duration-500" 
                                  style={{ width: `${rec.suitabilityScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-green-dark w-12">{rec.suitabilityScore}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rec.reason}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Link
                                to="/dashboard/my-harvests"
                                className="px-3 py-1.5 text-xs bg-green-primary text-white rounded hover:bg-green-dark transition-colors font-medium"
                              >
                                Add Harvest
                              </Link>
                              <Link
                                to="/dashboard/find-farmland"
                                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium"
                              >
                                Find Land
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Wheat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No specific crop recommendations for your interest.</p>
                <p className="text-sm text-gray-400 mt-1">Try removing the crop filter or selecting a different location.</p>
              </div>
            )}
          </div>

          {/* Navigation hints */}
          <div className="bg-cream rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-green-dark mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Next Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/dashboard/my-harvests"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-primary/50 transition-colors text-center"
              >
                <Wheat className="w-6 h-6 text-green-primary mx-auto mb-2" />
                <p className="font-medium text-green-dark">Add Harvest Listing</p>
                <p className="text-xs text-gray-500 mt-1">Create a listing for recommended crops</p>
              </Link>
              <Link
                to="/dashboard/find-farmland"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-primary/50 transition-colors text-center"
              >
                <MapPin className="w-6 h-6 text-green-primary mx-auto mb-2" />
                <p className="font-medium text-green-dark">Find Farmland</p>
                <p className="text-xs text-gray-500 mt-1">Search for land matching this soil type</p>
              </Link>
              <Link
                to="/dashboard/crop-requirements"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-primary/50 transition-colors text-center"
              >
                <FlaskConical className="w-6 h-6 text-green-primary mx-auto mb-2" />
                <p className="font-medium text-green-dark">Check Requirements</p>
                <p className="text-xs text-gray-500 mt-1">See retailer demand for these crops</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SoilIntelligence;