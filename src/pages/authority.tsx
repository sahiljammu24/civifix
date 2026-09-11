import React, { useState, useEffect, useMemo } from 'react';
import { fetchReports, updateReport, CivicReport } from '../supabase';

function DashboardTab({ reports }: { reports: CivicReport[] }) {
  const total = reports.length;
  const newToday = reports.filter(r => r.created_at && new Date(r.created_at).toDateString() === new Date().toDateString()).length;
  const inProgress = reports.filter(r => r.status === 'In Progress').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;
  const overdue = reports.filter(r => r.status === 'Reported' || r.status === 'Verified').length; // Mock overdue logic

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Municipal Operations Center</span>
            <span className="text-on-surface-variant">•</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">Live Feed Active</span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Department Overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors text-body-sm font-medium shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors text-body-sm font-medium shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Manual Ticket
          </button>
        </div>
      </div>

      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Complaints" icon="forum" value={total} trend="+4%" bg="bg-primary-fixed" text="text-on-primary-fixed" sub="Active municipal queue" />
        <StatCard title="New Today" icon="fiber_new" value={newToday} trend="+12%" bg="bg-primary-container" text="text-on-primary-container" sub="Requires triage" />
        <StatCard title="In Progress" icon="engineering" value={inProgress} bg="bg-secondary-fixed-dim" text="text-on-secondary-fixed" sub="Field units active" />
        <StatCard title="Resolved" icon="check_circle" value={resolved} trend="+8%" bg="bg-secondary" text="text-on-secondary" sub="This current week" />
        <StatCard title="Overdue" icon="warning" value={overdue} trend="-2" isError bg="bg-error-container" text="text-on-error-container" sub="SLA breach risk" />
      </div>

      <div className="px-8 mb-6">
        <h2 className="text-title-md font-bold mb-4">Recent Issues</h2>
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <IssueTable reports={reports.slice(0, 5)} onUpdate={() => {}} readonly />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, icon, value, trend, bg, text, sub, isError = false }: any) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${bg}/10 rounded-full group-hover:scale-110 transition-transform`}></div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-md font-label-md text-on-surface-variant">{title}</span>
        <div className={`w-8 h-8 rounded-xl ${bg} ${text} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-headline-lg font-headline-lg ${isError ? 'text-error' : 'text-on-surface'}`}>{value}</span>
        {trend && (
          <span className={`text-label-sm font-label-sm ${isError ? 'text-error' : 'text-secondary'} flex items-center`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend.startsWith('+') ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {trend}
          </span>
        )}
      </div>
      <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">{sub}</p>
    </div>
  );
}

function TriageTab({ reports, onUpdate }: { reports: CivicReport[], onUpdate: (id: string, updates: Partial<CivicReport>) => void }) {
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filtered = useMemo(() => {
    if (statusFilter === 'All') return reports;
    return reports.filter(r => r.status === statusFilter);
  }, [reports, statusFilter]);

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Issue Triage</h1>
      </div>
      
      <div className="px-8 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container px-4 py-2 rounded-xl text-body-sm text-on-surface focus:outline-none pr-10"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <span className="text-body-sm text-on-surface-variant">Showing {filtered.length} issues</span>
        </div>
      </div>

      <div className="px-8">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <IssueTable reports={filtered} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ reports }: { reports: CivicReport[] }) {
  // Simple mocked analytics
  return (
    <div className="px-8 pt-8 pb-16">
      <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold mb-4">Reports over time (Mocked)</h3>
          <div className="h-48 bg-surface-container rounded flex items-end justify-between p-4 gap-2">
            {[40, 25, 60, 45, 80, 50, 90].map((h, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t hover:bg-primary transition-colors" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold mb-4">Issues by Category</h3>
          <div className="space-y-4">
            {['Road Maintenance', 'Sanitation', 'Street Lighting', 'Water Supply'].map((cat, i) => {
              const count = reports.filter(r => r.category === cat || r.department === cat).length;
              return (
                <div key={i}>
                  <div className="flex justify-between text-body-sm mb-1">
                    <span>{cat}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.max(10, (count / Math.max(1, reports.length)) * 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldUnitsTab() {
  return (
    <div className="px-8 pt-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Field Units (Mocked)</h1>
        <button className="px-4 py-2 rounded-xl bg-primary text-on-primary text-body-sm font-medium shadow-sm">Add Unit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Alpha Team (Roads)', status: 'Active', task: '#CF1024' },
          { name: 'Beta Team (Sanitation)', status: 'Idle', task: 'None' },
          { name: 'Gamma Team (Water)', status: 'On Break', task: 'None' }
        ].map((unit, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col">
            <h3 className="font-bold text-title-md mb-2">{unit.name}</h3>
            <span className="text-body-sm text-on-surface-variant mb-4">Current Task: {unit.task}</span>
            <span className={`px-3 py-1 rounded-full text-[12px] font-bold self-start ${unit.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface'}`}>
              {unit.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="px-8 pt-8 pb-16">
      <h1 className="text-headline-lg font-headline-lg text-on-surface mb-6">Settings</h1>
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Notification Preferences</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary" />
              <span>Email alerts for critical issues</span>
            </label>
          </div>
          <div>
            <h3 className="font-bold mb-2">AI Auto-Triage Threshold</h3>
            <input type="range" className="w-full" min="0" max="100" defaultValue="85" />
            <div className="text-body-sm text-on-surface-variant mt-1">Issues above 85% confidence will be auto-assigned.</div>
          </div>
          <button className="px-6 py-2 rounded-xl bg-primary text-on-primary font-medium mt-4">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function IssueTable({ reports, onUpdate, readonly = false }: { reports: CivicReport[], onUpdate: (id: string, updates: Partial<CivicReport>) => void, readonly?: boolean }) {
  if (reports.length === 0) {
    return <div className="p-8 text-center text-on-surface-variant">No issues found.</div>;
  }

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'bg-error-container text-on-error-container';
      case 'High': return 'bg-error-container/50 text-error';
      case 'Medium': return 'bg-tertiary-fixed text-on-tertiary-fixed';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'In Progress': return 'bg-primary-fixed text-on-primary-fixed';
      case 'Resolved': return 'bg-secondary-fixed text-on-secondary-fixed';
      case 'Verified': return 'bg-tertiary-container/20 text-tertiary-container';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
          <th className="py-4 px-6 font-medium">ID</th>
          <th className="py-4 px-6 font-medium">Issue Description</th>
          <th className="py-4 px-6 font-medium">Location</th>
          <th className="py-4 px-6 font-medium">Priority</th>
          <th className="py-4 px-6 font-medium">Status</th>
          <th className="py-4 px-6 font-medium">Date</th>
          {!readonly && <th className="py-4 px-6 font-medium text-right">Action</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
        {reports.map(report => (
          <tr key={report.id || report.ticket_id} className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="py-4 px-6 font-medium text-primary">#{report.ticket_id}</td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                {report.image_url ? (
                  <div className="w-10 h-10 rounded-xl bg-surface-container bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${report.image_url}')` }}></div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-surface-container shrink-0 flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined">image</span></div>
                )}
                <div className="max-w-[250px]">
                  <p className="font-medium text-on-surface truncate">{report.category}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">{report.description}</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 text-on-surface-variant max-w-[200px] truncate">{report.location_address}</td>
            <td className="py-4 px-6">
              {readonly ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm ${getPriorityColor(report.priority)} font-medium`}>
                  {report.priority}
                </span>
              ) : (
                <select 
                  value={report.priority} 
                  onChange={(e) => onUpdate(report.id!, { priority: e.target.value as any })}
                  className={`bg-transparent outline-none cursor-pointer font-medium text-label-sm ${getPriorityColor(report.priority)} px-2 py-1 rounded-md`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              )}
            </td>
            <td className="py-4 px-6">
              {readonly ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm ${getStatusColor(report.status)} font-medium`}>
                  {report.status}
                </span>
              ) : (
                <select 
                  value={report.status} 
                  onChange={(e) => onUpdate(report.id!, { status: e.target.value as any })}
                  className={`bg-transparent outline-none cursor-pointer font-medium text-label-sm ${getStatusColor(report.status)} px-2 py-1 rounded-md`}
                >
                  <option value="Reported">Reported</option>
                  <option value="Verified">Verified</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              )}
            </td>
            <td className="py-4 px-6 text-on-surface-variant text-[12px]">
              {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
            </td>
            {!readonly && (
              <td className="py-4 px-6 text-right">
                <button className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Details">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AuthorityPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports().then(data => {
      setReports(data || []);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (id: string, updates: Partial<CivicReport>) => {
    try {
      const updated = await updateReport(id, updates);
      setReports(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e) {
      console.error('Failed to update report', e);
      alert('Failed to update report');
    }
  };

  const tabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'triage', icon: 'task', label: 'Issue Triage' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics' },
    { id: 'field-units', icon: 'engineering', label: 'Field Units' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col pt-6 pb-8">
        <div className="px-6 mb-8 flex items-center gap-3">
          <img alt="CivicFix Logo" className="h-8 w-auto object-contain" src="/logo.svg" onError={(e) => (e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGUa-E78kV18F2dK07EBsQukwuCLNCzktvNcJL7-RUCdoVEKoDSLf9pDn9IRF1REC0QrrGgOFalkAtn4mr1fg-jvRqjUlpVt2GK6LTd8VOU-eUgtBWEaEmZknT_yBNoK6yuZOTYmEC4JxfGwTOO0h20vdyBLd7f3RriMURb89TDgx77rLnXFLG_8BWJOMTlQ5Dpt4pDYXMluu_-BvVPe8YaG3Lt0Yc8g6XUqK0XDpYM0OkO32mhkMp1A")} />
          <span className="text-headline-sm font-headline-sm text-on-surface font-bold">Authority Portal</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-container text-on-primary-container font-medium' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-primary-container text-on-primary-container font-medium' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">settings</span>
            Settings
          </button>
        </div>
      </aside>

      <div className="pl-64 flex flex-col flex-1">
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8 border-b border-outline-variant/10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-xl text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search reports, IDs, or locations..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        <main className="relative pt-16 bg-surface min-h-screen flex-1 overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full pt-32">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab reports={reports} />}
              {activeTab === 'triage' && <TriageTab reports={reports} onUpdate={handleUpdate} />}
              {activeTab === 'analytics' && <AnalyticsTab reports={reports} />}
              {activeTab === 'field-units' && <FieldUnitsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
