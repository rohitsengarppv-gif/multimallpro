import { useState, useEffect } from "react";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, User, MapPin, Phone, Mail, CreditCard, Download, Loader2 } from "lucide-react";

interface OrderDetailPageProps {
  orderId: string;
  onBack?: () => void;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({ orderId, onBack }: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // Get vendor data from localStorage
    const storedVendorData = localStorage.getItem('vendorData');
    if (storedVendorData) {
      setVendorData(JSON.parse(storedVendorData));
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching order details for:', orderId);
      const response = await fetch(`/api/routes/orders/${orderId}`);
      const data = await response.json();
      
      console.log('Order details response:', data);
      
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Failed to load order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/routes/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
        setShowStatusModal(false);
        setNewStatus('');
        setTrackingNumber('');
        alert('Order status updated successfully!');
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download invoice');
        return;
      }

      const invoiceHTML = generateInvoiceHTML(order!, vendorData);
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Wait for content to load
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const generateInvoiceHTML = (order: OrderData, vendor: any) => {
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: #f5f5f5;
      color: #333;
    }
    .invoice-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #f97316;
    }
    .logo-section {
      flex: 1;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #f97316;
      margin-bottom: 5px;
    }
    .company-details {
      font-size: 12px;
      color: #666;
      line-height: 1.6;
    }
    .invoice-title {
      text-align: right;
      flex: 1;
    }
    .invoice-title h1 {
      font-size: 36px;
      color: #333;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 14px;
      color: #666;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .info-box {
      flex: 1;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-right: 20px;
    }
    .info-box:last-child {
      margin-right: 0;
    }
    .info-box h3 {
      font-size: 14px;
      color: #f97316;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-box p {
      font-size: 13px;
      line-height: 1.6;
      color: #555;
    }
    .info-box strong {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    thead {
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      color: white;
    }
    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 15px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    tbody tr:hover {
      background: #f9f9f9;
    }
    .text-right {
      text-align: right;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
    .summary-box {
      width: 350px;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    .summary-row.total {
      border-top: 2px solid #f97316;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #f97316;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #eee;
      text-align: center;
    }
    .footer p {
      font-size: 13px;
      color: #666;
      margin: 5px 0;
    }
    .thank-you {
      font-size: 18px;
      color: #f97316;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      background: #dcfce7;
      color: #166534;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <div class="company-name">${vendor?.businessName || 'MultiMall Pro'}</div>
        <div class="company-details">
          ${vendor?.businessAddress || ''}<br>
          ${vendor?.city || ''}, ${vendor?.state || ''} ${vendor?.zipCode || ''}<br>
          Email: ${vendor?.email || 'support@multimallpro.com'}<br>
          Phone: ${vendor?.phone || '+91 1234567890'}
        </div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <div class="invoice-number">
          <strong>${order.orderNumber}</strong><br>
          Date: ${invoiceDate}<br>
          <span class="status-badge">${order.status.toUpperCase()}</span>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <div class="info-box">
        <h3>Bill To</h3>
        <p>
          <strong>${order.shippingAddress.fullName}</strong><br>
          ${order.shippingAddress.addressLine1}<br>
          ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}<br>
          Phone: ${order.shippingAddress.phone}
        </p>
      </div>
      <div class="info-box">
        <h3>Payment Details</h3>
        <p>
          <strong>Method:</strong> ${order.paymentMethod}<br>
          <strong>Status:</strong> ${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}<br>
          ${order.trackingNumber ? `<strong>Tracking:</strong> ${order.trackingNumber}<br>` : ''}
          <strong>Customer:</strong> ${order.customer.name}<br>
          <strong>Email:</strong> ${order.customer.email}
        </p>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="text-right">Price</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(item => `
        <tr>
          <td><strong>${item.productName}</strong></td>
          <td class="text-right">₹${item.price.toFixed(2)}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right"><strong>₹${item.total.toFixed(2)}</strong></td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₹${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Tax:</span>
          <span>₹${order.tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>₹${order.shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>TOTAL:</span>
          <span>₹${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="thank-you">Thank You For Your Business!</p>
      <p>This is a computer-generated invoice and does not require a signature.</p>
      <p>For any queries, please contact us at ${vendor?.email || 'support@multimallpro.com'}</p>
      <p style="margin-top: 20px; font-size: 11px; color: #999;">
        © ${new Date().getFullYear()} ${vendor?.businessName || 'MultiMall Pro'}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Order</h3>
        <p className="text-gray-500 mb-4">{error || 'Order not found'}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "processing": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "refunded": return "bg-orange-100 text-orange-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTimeline = () => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status.toLowerCase());
    
    return statuses.map((status, index) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      completed: index < currentIndex,
      current: index === currentIndex,
      date: index <= currentIndex ? new Date(order.updatedAt).toLocaleDateString('en-IN') : ''
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Update Status
          </button>
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Invoice
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setTrackingNumber('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || !newStatus}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {getStatusTimeline().map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500' : item.current ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : item.current ? (
                      <Clock className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className={`font-medium ${item.completed || item.current ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.status}
                      </h4>
                      {item.date && (
                        <span className={`text-sm ${item.completed || item.current ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
            
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {order.items.map((item) => (
                <div key={item.productName} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img 
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0" 
                    src={item.productImage} 
                    alt={item.productName} 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h4>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.productName}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={item.productImage} 
                            alt={item.productName} 
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:items-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.customer.email}</span>
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.shippingAddress.phone}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex items-center gap-3 mt-4">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-500">Tracking: {order.trackingNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
                  <p className={`text-xs mt-1 ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 
                    order.paymentStatus === 'pending' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
