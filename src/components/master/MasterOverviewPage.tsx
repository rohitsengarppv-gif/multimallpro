import { useMemo } from "react";
import { Shield, Users, Store, Activity, Globe2, Layers, AlarmClock, Link2 } from "lucide-react";

export default function MasterOverviewPage() {
  const stats = useMemo(() => ([
    { label: "Total Users", value: "482,109", change: "+3.2%", icon: Users, accent: "bg-blue-100 text-blue-600" },
    { label: "Verified Vendors", value: "5,427", change: "+6.4%", icon: Store, accent: "bg-purple-100 text-purple-600" },
    { label: "Platform Uptime", value: "99.982%", change: "SLO met", icon: Activity, accent: "bg-emerald-100 text-emerald-600" },
    { label: "Security Events", value: "12", change: "-35%", icon: Shield, accent: "bg-rose-100 text-rose-600" }
  ]), []);

  const initiatives = useMemo(() => ([
    { title: "Global Marketplace Expansion", owner: "Operations", status: "On Track", highlight: "bg-blue-50" },
    { title: "AI Fraud Monitoring", owner: "Security", status: "At Risk", highlight: "bg-rose-50" },
    { title: "Vendor Success Playbooks", owner: "Growth", status: "On Track", highlight: "bg-purple-50" }
  ]), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">Master Control</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1">Master Admin Overview</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Govern platform-wide operations, security, and compliance. Monitor live signals and trigger actions across all admin hubs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">New Directive</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Generate Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-3">
              <div className={`inline-flex p-3 rounded-xl ${stat.accent}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div className={`text-xs font-medium ${stat.change.startsWith("-") ? "text-rose-500" : "text-emerald-600"}`}>
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Strategic Initiatives</h2>
              <p className="text-sm text-gray-500">Cross-team efforts driven by master admin office.</p>
            </div>
            <Layers className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            {initiatives.map((initiative) => (
              <div key={initiative.title} className={`p-4 border border-gray-200 rounded-xl ${initiative.highlight}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{initiative.title}</p>
                    <p className="text-xs text-gray-500">Owner: {initiative.owner}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                    {initiative.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Global Signals</h2>
              <p className="text-sm text-gray-500">Platform telemetry from all regions.</p>
            </div>
            <Globe2 className="h-5 w-5 text-sky-500" />
          </div>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <AlarmClock className="h-5 w-5 text-sky-500" />
              <span>Latency spiked 18% in APAC zone. Auto-scaling deployed mitigations.</span>
            </li>
            <li className="flex items-start gap-3">
              <Link2 className="h-5 w-5 text-emerald-500" />
              <span>Payment partners synced. Settlement backlog cleared.</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-rose-500" />
              <span>Zero critical CVEs outstanding. Quarterly audit passed.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
