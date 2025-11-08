import { useMemo, useState } from "react";
import { LayoutDashboard, SlidersHorizontal, ListChecks, Calendar, AlertTriangle, BellRing, CheckSquare, Edit3, Plus, X, Trash2 } from "lucide-react";

interface TaskCard {
  id: number;
  title: string;
  dueDate: string;
  owner: string;
  status: "open" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

const statusBadge: Record<TaskCard["status"], string> = {
  open: "bg-amber-100 text-amber-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700"
};

const priorityDot: Record<TaskCard["priority"], string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500"
};

export default function CustomDashboardPage() {
  const [layout, setLayout] = useState("grid");
  const [tasks, setTasks] = useState<TaskCard[]>([
    { id: 1, title: "Review monthly KPI report", dueDate: "2024-11-10", owner: "Analytics", status: "in-progress", priority: "high" },
    { id: 2, title: "Approve 6 new vendors", dueDate: "2024-11-12", owner: "Vendor Ops", status: "open", priority: "medium" },
    { id: 3, title: "Update SLA for support team", dueDate: "2024-11-15", owner: "CX", status: "open", priority: "low" },
    { id: 4, title: "Finalize Q1 marketing plan", dueDate: "2024-12-01", owner: "Growth", status: "done", priority: "medium" }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCard | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    owner: "",
    status: "open" as TaskCard["status"],
    priority: "medium" as TaskCard["priority"]
  });

  const quickActions = useMemo(() => ([
    { title: "Schedule platform maintenance", icon: Calendar, description: "Block window and notify impacted vendors." },
    { title: "Audit discount campaigns", icon: ListChecks, description: "Ensure compliance for seasonal promotions." },
    { title: "Review fraud alerts", icon: AlertTriangle, description: "Resolve high-risk transactions promptly." }
  ]), []);

  const alerts = useMemo(() => ([
    { title: "Stockouts up 12% week-over-week", detail: "Focus categories: Electronics, Beauty" },
    { title: "Support backlog exceeds SLA", detail: "Assign additional agents for Tier 2" },
    { title: "Vendor onboarding queue > 24 hrs", detail: "Automate document verification" }
  ]), []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: TaskCard = {
      id: editingTask ? editingTask.id : Date.now(),
      title: formData.title.trim(),
      dueDate: formData.dueDate,
      owner: formData.owner.trim(),
      status: formData.status,
      priority: formData.priority
    };

    if (editingTask) {
      setTasks((prev) => prev.map((task) => task.id === editingTask.id ? payload : task));
    } else {
      setTasks((prev) => [payload, ...prev]);
    }

    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: "", dueDate: new Date().toISOString().split("T")[0], owner: "", status: "open", priority: "medium" });
  };

  const handleEdit = (task: TaskCard) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      dueDate: task.dueDate,
      owner: task.owner,
      status: task.status,
      priority: task.priority
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && confirm("Remove this task from the dashboard?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Configure workflows, monitor alerts, and drive org-wide priorities.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={layout}
            onChange={(event) => setLayout(event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="grid">Grid view</option>
            <option value="list">List view</option>
          </select>
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({ title: "", dueDate: new Date().toISOString().split("T")[0], owner: "", status: "open", priority: "medium" });
              setShowModal(true);
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Playbook</h2>
                <p className="text-sm text-gray-500">Use these quick actions to keep operations healthy.</p>
              </div>
              <LayoutDashboard className="h-5 w-5 text-purple-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <div key={action.title} className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-purple-500" />
                      <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Operational Tasks</h2>
                <p className="text-sm text-gray-500">Track ownership and due dates across teams.</p>
              </div>
              <CheckSquare className="h-5 w-5 text-emerald-500" />
            </div>
            <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}>
              {tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Due {task.dueDate}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <SlidersHorizontal className="h-3 w-3" />
                        {task.owner}
                      </p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-semibold ${statusBadge[task.status]}`}>
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        title="Edit task"
                      >
                        <Edit3 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        title="Remove task"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {tasks.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">No tasks configured. Add one to get started.</div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Alerts & Signals</h2>
                <p className="text-sm text-gray-500">Automated insights from monitoring stack.</p>
              </div>
              <BellRing className="h-5 w-5 text-rose-500" />
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.title} className="border border-gray-100 rounded-xl p-4 bg-rose-50/60">
                  <p className="text-sm font-semibold text-rose-600">{alert.title}</p>
                  <p className="text-xs text-rose-500 mt-1">{alert.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                <p className="text-sm text-gray-500">Jot down quick observations for the team.</p>
              </div>
              <Edit3 className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              className="w-full mt-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[120px]"
              placeholder="e.g. Launch an adoption program for new vendors next quarter."
            />
          </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTask ? "Update Task" : "Add Dashboard Task"}
                  </h2>
                  <p className="text-sm text-gray-500">Assign owners, due dates, and status.</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setFormData({ title: "", dueDate: new Date().toISOString().split("T")[0], owner: "", status: "open", priority: "medium" });
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                    <input
                      value={formData.owner}
                      onChange={(event) => setFormData((prev) => ({ ...prev, owner: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as TaskCard["status"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value as TaskCard["priority"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTask(null);
                      setFormData({ title: "", dueDate: new Date().toISOString().split("T")[0], owner: "", status: "open", priority: "medium" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    {editingTask ? "Save Changes" : "Add Task"}
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
