import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IndianRupee, Wheat, User, Package } from 'lucide-react';

function RetailerBookings() {
  const { setHarvests, bookings, setBookings, demoIdentities } = useOutletContext();
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  if (bookings.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-dark">My Bookings</h1>
          <p className="mt-1 text-gray-600">Track your confirmed harvest bookings.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bookings yet.</p>
          <p className="text-sm text-gray-400">Book harvests from <a href="/dashboard/browse-harvests" className="text-green-primary hover:underline">Browse Harvests</a> to see them here.</p>
        </div>
      </div>
    );
  }

  // Handle booking cancellation
  function handleCancelClick(bookingId) {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    
    // Prevent cancellation of already cancelled bookings
    if (booking.status === 'Cancelled') {
      alert('This booking is already cancelled.');
      return;
    }
    setCancelConfirmId(bookingId);
  }

  function confirmCancel(bookingId) {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status === 'Cancelled') {
      setCancelConfirmId(null);
      return;
    }

    // Restore stock to the harvest
    setHarvests((prev) =>
      prev.map((h) =>
        h.id === booking.harvestId ? { ...h, quantity: h.quantity + booking.quantity } : h
      )
    );

    // Mark booking as cancelled
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' } : b
      )
    );

    setCancelConfirmId(null);
  }

  function cancelCancel() {
    setCancelConfirmId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">My Bookings</h1>
        <p className="mt-1 text-gray-600">Track your confirmed harvest bookings.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Farmer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harvest Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className={`hover:bg-gray-50 ${booking.status === 'Cancelled' ? 'bg-gray-50' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-primary/10 rounded-lg flex items-center justify-center">
                        <Wheat className="w-5 h-5 text-green-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-green-dark">{booking.crop}</p>
                        <p className="text-xs text-gray-500">{booking.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{booking.farmer || demoIdentities.farmer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wheat className="w-4 h-4 text-gray-400" />
                      <span>{booking.quantity} {booking.unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-dark">
                      <IndianRupee className="w-4 h-4" />
                      <span>{booking.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'Cancelled'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-green-primary/10 text-green-primary'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{booking.bookedAt}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{booking.harvestDate}</td>
                  <td className="px-4 py-4">
                    {booking.status === 'Cancelled' ? (
                      <span className="text-sm text-gray-400">Cancelled</span>
                    ) : cancelConfirmId === booking.id ? (
                      <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-lg p-1.5">
                        <span className="text-xs text-yellow-800 px-2">Confirm?</span>
                        <button
                          onClick={() => confirmCancel(booking.id)}
                          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelCancel}
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancelClick(booking.id)}
                        className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 hover:text-red-700 transition-colors font-medium"
                      >
                        Cancel Booking
                      </button>
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

export default RetailerBookings;