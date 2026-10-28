import { useOutletContext } from 'react-router-dom';
import { Wheat, MapPin, Calendar, IndianRupee, User, Package, CheckCircle } from 'lucide-react';

function Orders() {
  const { currentRole, orders, setOrders, demoIdentities } = useOutletContext();

  // Filter orders relevant to current role
  let myOrders = orders;
  if (currentRole === 'farmer') {
    myOrders = orders.filter((o) => o.farmer === demoIdentities.farmer);
  } else if (currentRole === 'retailer') {
    myOrders = orders.filter((o) => o.retailer === demoIdentities.retailer);
  }

  const stages = ['Farmer Selected', 'Growing', 'Ready for Harvest', 'Delivered'];

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

  function getStageColor(status) {
    switch (status) {
      case 'Farmer Selected': return 'bg-blue-500';
      case 'Growing': return 'bg-green-primary';
      case 'Ready for Harvest': return 'bg-yellow-500';
      case 'Delivered': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  }

  if (myOrders.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-dark">Orders</h1>
          <p className="mt-1 text-gray-600">{currentRole === 'farmer' ? 'Track your accepted bids and order progress.' : 'Track your procurement orders and delivery progress.'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <p className="text-sm text-gray-400">
            {currentRole === 'farmer'
              ? 'When a retailer accepts your bid, an order will be created here.'
              : 'When you accept a farmer\'s bid, an order will be created here.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-dark">Orders</h1>
        <p className="mt-1 text-gray-600">
          {currentRole === 'farmer'
            ? 'Track your accepted bids and order progress from farm to delivery.'
            : 'Track your procurement orders and delivery progress.'}
        </p>
      </div>

      <div className="space-y-6">
        {myOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-green-primary/5 border-b border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-primary/10 rounded-xl flex items-center justify-center">
                      <Wheat className="w-6 h-6 text-green-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-dark">{order.crop}</h2>
                      <p className="text-sm text-gray-500">Order #{order.id} • {order.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStageColor(order.status)} text-white`}>
                      {order.status}
                    </span>
                    <span className="text-gray-500">Created: {order.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Progress Tracker */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Progress</h3>
                <div className="flex items-center">
                  {stages.map((stage, idx) => (
                    <div key={stage} className="flex flex-col items-center relative flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium ${stages.indexOf(order.status) >= idx ? getStageColor(order.status) + ' text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {stages.indexOf(order.status) >= idx ? <CheckCircle className="w-5 h-5" /> : <span>{idx + 1}</span>}
                      </div>
                      <p className={`mt-2 text-xs text-center ${order.status === stage ? 'font-semibold' : ''}`} style={{ color: order.status === stage ? getStageColor(order.status) : '#6b7280' }}>{stage}</p>
                      {idx < 3 && <div className={`absolute top-4 left-[calc(50%+5px)] w-full h-0.5 ${stages.indexOf(order.status) > idx ? getStageColor(order.status) : 'bg-gray-200'}`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><Wheat className="w-4 h-4" />{order.quantity} {order.unit}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">Agreed Price</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><IndianRupee className="w-4 h-4" />₹{order.agreedPrice}/{order.unit}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">Est. Harvest</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><Calendar className="w-4 h-4" />{order.estimatedHarvestDate}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><IndianRupee className="w-4 h-4" />₹{(order.agreedPrice * order.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">{currentRole === 'farmer' ? 'Retailer' : 'Farmer'}</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><User className="w-4 h-4" />{currentRole === 'farmer' ? order.retailer : order.farmer}</p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-green-dark flex items-center gap-1"><MapPin className="w-4 h-4" />{order.location}</p>
                </div>
              </div>

              {/* Quality Specs */}
              <div className="bg-cream rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">Quality Specifications</p>
                <p className="text-sm text-gray-700">{order.qualitySpecs}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {order.status !== 'Delivered' && (
                  <button onClick={() => advanceOrder(order.id)} className="flex-1 sm:flex-none px-6 py-3 bg-green-primary text-white rounded-lg text-sm font-medium hover:bg-green-dark transition-colors">
                    Advance to Next Stage
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <span className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-500 rounded-lg text-center text-sm font-medium">Order Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;