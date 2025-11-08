import { useMemo, useState } from "react";
import { CalendarRange, Activity, Target, TrendingUp, Plus, Edit, Trash2, BarChart3, PieChart, LineChart } from "lucide-react";

interface Segment {
  id: number;
  name: string;
  metric: string;
  condition: string;
  performance: number;
  trend: "up" | "down" | "flat";
}

const trendStyles: Record<Segment["trend"], string> = {
  up: "text-green-600 bg-green-100",
  down: "text-red-600 bg-red-100",
  flat: "text-gray-600 bg-gray-200"
};

export default function AdvancedAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [segments, setSegments] = useState<Segment[]>([
    { id: 1, name: "High Value Customers", metric: "Lifetime Spend", condition: "> $5,000", performance: 18.6, trend: "up" },
    { id: 2, name: "Churn Risk", metric: "Last Order", condition: "> 90 days", performance: 6.2, trend: "down" },
    { id: 3, name: "New Vendors", metric: "Onboarded", condition: "Last 14 days", performance: 28.3, trend: "up" }
  ]);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    metric: "",
    condition: "",
    performance: "",
    trend: "up" as Segment["trend"]
  });

  const coreKPIs = useMemo(() => ([
    { label: "Conversion Rate", value: "4.82%", change: "+12.4%" },
    { label: "Average Order Value", value: "$138", change: "+6.8%" },
    { label: "Return Rate", value: "2.4%", change: "-1.2%" },
    { label: "Active Vendors", value: "312", change: "+4.3%" }
  ]), []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Segment = {
      id: editingSegment ? editingSegment.id : Date.now(),
      name: formData.name.trim(),
      metric: formData.metric.trim(),
      condition: formData.condition.trim(),
      performance: Number(formData.performance) || 0,
      trend: formData.trend
    };

    if (editingSegment) {
      setSegments((prev) => prev.map((segment) => segment.id === editingSegment.id ? payload : segment));
    } else {
      setSegments((prev) => [payload, ...prev]);
    }

    setShowModal(false);
    setEditingSegment(null);
    setFormData({ name: "", metric: "", condition: "", performance: "", trend: "up" });
  };

  const handleEdit = (segment: Segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      metric: segment.metric,
      condition: segment.condition,
      performance: segment.performance.toString(),
      trend: segment.trend
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && confirm("Delete this segment?")) {
      setSegments((prev) => prev.filter((segment) => segment.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Track platform-wide performance with custom segments and deep insights.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
          </select>
          <button
            onClick={() => {
              setEditingSegment(null);
              setFormData({ name: "", metric: "", condition: "", performance: "", trend: "up" });
              setShowModal(true);
            }}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Segment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {coreKPIs.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
            <p className={`text-sm font-medium ${kpi.change.startsWith("-") ? "text-red-600" : "text-green-600"}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue & Cohort Trends</h2>
              <p className="text-sm text-gray-500">Compare retention cohorts with ARR trends.</p>
            </div>
            <BarChart3 className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-xl h-60 grid place-items-center text-indigo-400 text-sm">
            Interactive chart placeholder
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Segments</h2>
              <p className="text-sm text-gray-500">Monitor and refine targeting rules.</p>
            </div>
            <PieChart className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="space-y-4">
            {segments.slice(0, 3).map((segment) => (
              <div key={segment.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{segment.name}</p>
                  <p className="text-xs text-gray-500">{segment.metric} • {segment.condition}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendStyles[segment.trend]}`}>
                  {segment.performance}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Custom Segments</h2>
            <p className="text-sm text-gray-500">Define rules to track high-impact audiences.</p>
          </div>
          <LineChart className="h-6 w-6 text-sky-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {segments.map((segment) => (
                <tr key={segment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{segment.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{segment.metric}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{segment.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trendStyles[segment.trend]}`}>
                      {segment.performance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(segment)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        title="Edit segment"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(segment.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        title="Delete segment"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {segments.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">No custom segments yet. Create one to start tracking.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSegment ? "Update Segment" : "Create Segment"}
                  </h2>
                  <p className="text-sm text-gray-500">Set performance thresholds and track trends.</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSegment(null);
                    setFormData({ name: "", metric: "", condition: "", performance: "", trend: "up" });
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <CalendarRange className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment Name</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Metric</label>
                    <input
                      value={formData.metric}
                      onChange={(event) => setFormData((prev) => ({ ...prev, metric: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Lifetime Spend, Sessions, ..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <input
                      value={formData.condition}
                      onChange={(event) => setFormData((prev) => ({ ...prev, condition: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="> $3,000"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance (%)</label>
                    <input
                      type="number"
                      value={formData.performance}
                      onChange={(event) => setFormData((prev) => ({ ...prev, performance: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trend Direction</label>
                    <select
                      value={formData.trend}
                      onChange={(event) => setFormData((prev) => ({ ...prev, trend: event.target.value as Segment["trend"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="up">Increasing</option>
                      <option value="down">Decreasing</option>
                      <option value="flat">Stable</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSegment(null);
                      setFormData({ name: "", metric: "", condition: "", performance: "", trend: "up" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  >
                    {editingSegment ? "Save Changes" : "Create Segment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
