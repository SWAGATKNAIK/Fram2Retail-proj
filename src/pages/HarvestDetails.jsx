import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  IndianRupee,
  Wheat,
  User,
  CheckCircle,
  Minus,
  Plus,
} from 'lucide-react';

function HarvestDetails() {
  const { id } = useParams();
  const { harvests, setHarvests, setBookings, demoIdentities } = useOutletContext();
  const [quantity, setQuantity] = useState(10);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  // Find the harvest by ID
  const harvest = harvests.find((h) => h.id === Number(id));

  if (!harvest) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Wheat className="w-12 h-12 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-green-dark mb-2">Harvest Not Found</h1>
        <p className="text-gray-500 mb-4">This listing may have been removed.</p>
        <Link
          to="/dashboard/browse-harvests"
          className="text-sm text-green-primary hover:text-green-dark font-medium no-underline"
        >
          ← Back to Browse
        </Link>
      </div>
    );
  }

  // Calculate the token amount (simulated — just price × quantity)
  const tokenAmount = quantity * harvest.pricePerKg;

  // Clamp quantity between 1 and available
  function adjustQuantity(delta) {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > harvest.quantity) return harvest.quantity;
      return next;
    });
  }

  // Simulate booking
  function handleBooking() {
    setBooking(true);
    const bookingEntry = {
      id: Date.now(),
      harvestId: harvest.id,
      crop: harvest.crop,
      farmer: harvest.farmer,
      retailer: demoIdentities.retailer,
      quantity: quantity,
      unit: harvest.unit,
      pricePerKg: harvest.pricePerKg,
      totalAmount: tokenAmount,
      location: harvest.location,
      harvestDate: harvest.harvestDate,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().split('T')[0],
    };
    setBookings((prev) => [bookingEntry, ...prev]);
    
    // Decrease the available quantity in the harvest
    setHarvests((prev) =>
      prev.map((h) =>
        h.id === harvest.id ? { ...h, quantity: h.quantity - quantity } : h
      )
    );
    
    setBooked(true);
    setBooking(false);
  }

  return (
    <div>
      {/* Back link */}
      <Link
        to="/dashboard/browse-harvests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-primary mb-6 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse Harvests
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — harvest info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-56 sm:h-72 bg-green-primary/5 flex items-center justify-center overflow-hidden">
              {harvest.image ? (
                <img
                  src={harvest.image}
                  alt={harvest.crop}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Wheat className="w-16 h-16 text-green-primary/30" />
              )}
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-green-dark">{harvest.crop}</h1>
                <span className="text-xs bg-green-primary/10 text-green-primary px-2 py-0.5 rounded-full">
                  {harvest.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-dark">₹{harvest.pricePerKg}</p>
                <p className="text-xs text-gray-500">per {harvest.unit}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>{harvest.farmer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{harvest.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Harvest: {harvest.harvestDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wheat className="w-4 h-4 text-gray-400" />
                <span>{harvest.quantity} {harvest.unit} available</span>
              </div>
            </div>

            {harvest.description && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{harvest.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column — booking panel */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            {booked ? (
              // Success state
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-dark mb-1">Booking Confirmed!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {quantity} {harvest.unit} of {harvest.crop} for ₹{tokenAmount.toLocaleString('en-IN')}
                </p>
                <Link
                  to="/dashboard/retailer-bookings"
                  className="text-sm text-green-primary hover:text-green-dark font-medium no-underline"
                >
                  View My Bookings →
                </Link>
              </div>
            ) : (
              // Booking form
              <>
                <h3 className="text-lg font-semibold text-green-dark mb-4">Book This Harvest</h3>

                {/* Quantity selector */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity ({harvest.unit})
                </label>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => adjustQuantity(-10)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= harvest.quantity) setQuantity(val);
                    }}
                    min={1}
                    max={harvest.quantity}
                    className="w-20 text-center py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity(10)}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Token amount summary */}
                <div className="bg-cream rounded-lg p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price per {harvest.unit}</span>
                    <span>₹{harvest.pricePerKg}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Quantity</span>
                    <span>{quantity} {harvest.unit}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-green-dark">
                    <span>Token Amount</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {tokenAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${booking ? 'bg-gray-400 text-gray-200' : 'bg-green-primary text-white hover:bg-green-dark'}`}
                >
                  {booking ? 'Processing...' : 'Confirm Booking'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Demo only — no real payment is processed.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HarvestDetails;
