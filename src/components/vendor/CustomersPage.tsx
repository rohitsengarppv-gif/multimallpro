import { useState, useEffect } from "react";
import { Search, Filter, Mail, Phone, MoreHorizontal, UserPlus, User, Loader2 } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  firstOrder: string;
}

interface CustomersPageProps {
  onNavigateToCustomerDetail?: (customerId: string) => void;
}

export default function CustomersPage({ onNavigateToCustomerDetail }: CustomersPageProps = {}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchVendorCustomers();
  }, []);

  const fetchVendorCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const vendorData = localStorage.getItem('vendorData');
      if (!vendorData) {
        setError('Vendor data not found');
        return;
      }

      const vendor = JSON.parse(vendorData);
      const vendorId = vendor._id;

      console.log('Fetching customers for vendor:', vendorId);

      // Fetch all orders for this vendor
      const response = await fetch(`/api/routes/orders?vendor=${vendorId}&limit=1000`);
      const data = await response.json();

      console.log('Orders response:', data);

      if (data.success) {
        // Extract unique customers from orders
        const customerMap = new Map<string, Customer>();

        data.data.orders.forEach((order: any) => {
          const customerId = order.customer?._id || order.customer;
          const customerName = order.customer?.name || order.shippingAddress?.fullName || 'Unknown';
          const customerEmail = order.customer?.email || 'N/A';
          const customerPhone = order.customer?.phone || order.shippingAddress?.phone;

          // Calculate vendor-specific order total
          const vendorOrderTotal = order.items
            .filter((item: any) => {
              const itemVendorId = item.vendor?._id || item.vendor;
              return itemVendorId && itemVendorId.toString() === vendorId.toString();
            })
            .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

          if (customerMap.has(customerId)) {
            const existing = customerMap.get(customerId)!;
            existing.orders += 1;
            existing.totalSpent += vendorOrderTotal;
            existing.lastOrder = new Date(order.createdAt) > new Date(existing.lastOrder)
              ? order.createdAt
              : existing.lastOrder;
          } else {
            customerMap.set(customerId, {
              _id: customerId,
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              orders: 1,
              totalSpent: vendorOrderTotal,
              lastOrder: order.createdAt,
              firstOrder: order.createdAt,
            });
          }
        });

        const customersArray = Array.from(customerMap.values());
        console.log(`Found ${customersArray.length} unique customers`);
        setCustomers(customersArray);
      } else {
        setError(data.message || 'Failed to fetch customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStatus = (customer: Customer) => {
    const daysSinceLastOrder = Math.floor(
      (new Date().getTime() - new Date(customer.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (customer.totalSpent >= 10000) return 'VIP';
    if (daysSinceLastOrder > 60) return 'Inactive';
    return 'Active';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && getCustomerStatus(customer) === statusFilter;
  });

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const customerStats = [
    { label: "Total Customers", value: filteredCustomers.length, color: "bg-blue-500" },
    { label: "Active", value: filteredCustomers.filter(c => getCustomerStatus(c) === "Active").length, color: "bg-green-500" },
    { label: "VIP", value: filteredCustomers.filter(c => getCustomerStatus(c) === "VIP").length, color: "bg-purple-500" },
    { label: "Inactive", value: filteredCustomers.filter(c => getCustomerStatus(c) === "Inactive").length, color: "bg-gray-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customers</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchVendorCustomers}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {customerStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={fetchVendorCustomers}
            className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Customers Display */}
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
            <p className="text-gray-500">No customers have ordered from your shop yet.</p>
          </div>
        ) : filteredCustomers.map((customer) => (
          <div key={customer._id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getCustomerStatus(customer))}`}>
                    {getCustomerStatus(customer)}
                  </span>
                </div>
                
                <div className="space-y-1 mb-3">
                  {customer.phone && <p className="text-xs text-gray-500">{customer.phone}</p>}
                  <p className="text-xs text-gray-500">Orders: {customer.orders}</p>
                  <p className="text-xs text-gray-500">Last order: {new Date(customer.lastOrder).toLocaleDateString('en-IN')}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-600">₹{customer.totalSpent.toFixed(2)}</span>
                  <button
                    onClick={() => onNavigateToCustomerDetail?.(customer._id)}
                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Last Order</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{customer.phone || 'N/A'}</div>
                      <div className="text-xs text-gray-500">First order: {new Date(customer.firstOrder).toLocaleDateString('en-IN')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">₹{customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.lastOrder).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getCustomerStatus(customer))}`}>
                      {getCustomerStatus(customer)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onNavigateToCustomerDetail?.(customer._id)}
                      className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-medium"
                    >
                      View Details
                    </button>
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
