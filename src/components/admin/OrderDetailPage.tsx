"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, User, MapPin, CreditCard, Loader2, Truck, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

interface OrderDetailPageProps {
  orderId: string;
  onBack?: () => void;
}

export default function OrderDetailPage({ orderId, onBack }: OrderDetailPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/routes/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        showMessage('error', data.message || 'Failed to load order');
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      showMessage('error', 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/routes/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Order status updated successfully');
        fetchOrder();
      } else {
        showMessage('error', data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      showMessage('error', 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Order not found</p>
        <Link href="/admin/orders" className="text-purple-600 hover:underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onBack ? onBack() : router.push('/admin/orders')} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Order Details</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={order.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {item.product?.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product?.name || 'Product'}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.product?.name || 'Product'}</div>
                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    {item.vendor?.businessName && (
                      <div className="text-xs text-gray-500">Vendor: {item.vendor.businessName}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                    <div className="text-sm text-gray-500">₹{item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-700">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country || 'India'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-sm text-gray-900">{order.customer?.email || 'N/A'}</div>
              </div>
              {order.customer?.phone && (
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-sm text-gray-900">{order.customer.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm text-gray-900">₹{order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-sm text-gray-900">{new Date(order.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
