import { useState } from "react";
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, Send } from "lucide-react";

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const invoices = [
    {
      id: "INV-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      amount: 299.99,
      status: "paid",
      dueDate: "2024-11-15",
      issueDate: "2024-11-01",
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 299.99 }
      ]
    },
    {
      id: "INV-002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      amount: 156.50,
      status: "pending",
      dueDate: "2024-11-20",
      issueDate: "2024-11-05",
      items: [
        { name: "Phone Case", quantity: 2, price: 78.25 }
      ]
    },
    {
      id: "INV-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      amount: 89.99,
      status: "overdue",
      dueDate: "2024-10-30",
      issueDate: "2024-10-15",
      items: [
        { name: "Bluetooth Speaker", quantity: 1, price: 89.99 }
      ]
    },
    {
      id: "INV-004",
      customerName: "Alice Brown",
      customerEmail: "alice@example.com",
      amount: 234.99,
      status: "draft",
      dueDate: "2024-11-25",
      issueDate: "2024-11-10",
      items: [
        { name: "Smart Watch", quantity: 1, price: 234.99 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track your customer invoices</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">${overdueAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Mobile Cards */}
        <div className="block md:hidden">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{invoice.id}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-900 font-medium">{invoice.customerName}</p>
                <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 text-sm flex items-center justify-center gap-1">
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Invoice</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-sm text-gray-500">Issued: {invoice.issueDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Send">
                        <Send className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
