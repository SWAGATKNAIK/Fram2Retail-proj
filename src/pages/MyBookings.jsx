import { useOutletContext } from 'react-router-dom';
import { IndianRupee, Wheat, User, Package } from 'lucide-react';

function MyBookings() {
  const { harvests, bookings, demoIdentities } = useOutletContext();

  // Get bookings for harvests owned by the current farmer (demo farmer)
  const myHarvestIds = harvests
    .filter((h) => h.farmer === demoIdentities.farmer)
    .map((h) => h.id);

  const myBookings = bookings.filter((b) => myHarvestIds.includes(b.harvestId));

  if (myBookings.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-dark">My Bookings</h1>
          <p className="mt-1 text-gray-600">View reservations made on your harvest listings.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bookings yet.</p>
          <p className="text-sm text-gray-400">When retailers book your harvests, they will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">My Bookings</h1>
        <p className="mt-1 text-gray-600">View reservations made on your harvest listings.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myBookings.map((booking) => (
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
                      <span className="text-sm text-gray-600">{booking.retailer || demoIdentities.retailer}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;