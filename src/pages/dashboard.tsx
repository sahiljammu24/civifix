import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, BottomNav } from '../components';
import { fetchReports, CivicReport } from '../supabase';

export default function DashboardPage() {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchReports();
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load reports on dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Header />
      <main className="w-full pt-20 pb-24 md:pb-8 md:pl-24 bg-surface min-h-screen">
        <div className="max-w-5xl mx-auto px-margin">
          <div className="py-space-md flex items-center justify-between">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Morning, Alex</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Here is your local neighborhood summary connected to Supabase.</p>
            </div>
            <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[14px]">A</span>
              <span className="font-title-sm text-title-sm text-on-surface">Alex M.</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-xl">
            <Link to="/report" className="group relative overflow-hidden rounded-2xl bg-primary text-on-primary p-space-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <span className="material-symbols-outlined text-[36px] mb-4">add_a_photo</span>
              <h2 className="font-headline-sm text-headline-sm mb-1">Report New Issue</h2>
              <p className="font-body-md text-on-primary/80">Help keep Ward 7 safe. Saves to Supabase.</p>
            </Link>
            <Link to="/map" className="group relative overflow-hidden rounded-2xl bg-surface-container-low text-on-surface p-space-lg border border-outline-variant/20 hover:bg-surface-container transition-all hover:-translate-y-1">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <span className="material-symbols-outlined text-[36px] mb-4 text-primary">explore</span>
              <h2 className="font-headline-sm text-headline-sm mb-1">Ward Operations Map</h2>
              <p className="font-body-md text-on-surface-variant">View live pinned reports from DB.</p>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-space-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface">Recent Reports (Live Database)</h2>
            <span className="inline-flex items-center gap-1 text-label-sm font-semibold text-tertiary-fixed-dim bg-tertiary-container/20 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
              {reports.length} Active
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/10">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                <span>Connecting to Supabase...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                No reports found in database. Click "Report New Issue" above to submit one!
              </div>
            ) : (
              reports.map((item) => (
                <Link 
                  key={item.id || item.ticket_id} 
                  to={`/tracking?id=${encodeURIComponent(item.ticket_id)}`} 
                  className="flex items-center gap-space-md p-space-md hover:bg-surface-container-low transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.priority === 'High' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                    <span className="material-symbols-outlined">
                      {item.category === 'Streetlight' ? 'lightbulb' : item.category === 'Water Leak' ? 'water_drop' : 'warning'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-on-surface truncate font-bold">{item.category}</span>
                      <span className="font-mono text-xs text-primary font-bold">{item.ticket_id}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {item.location_address || 'Main St.'} • {item.department}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`px-2.5 py-1 rounded-md font-label-sm text-[10px] font-bold uppercase tracking-wide ${item.status === 'Resolved' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                      {item.status}
                    </span>
                    <span className="text-primary font-label-sm text-[11px] mt-1 group-hover:underline flex items-center gap-0.5">
                      Track <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
