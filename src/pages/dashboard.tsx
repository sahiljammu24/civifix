import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, BottomNav } from '../components';
import { fetchReports, CivicReport } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!user) return;
        const data = await fetchReports(user.id);
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load reports on dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) load();
  }, [user]);

  useEffect(() => {
    const loadAvatar = () => {
      if (user) {
        const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
        if (savedAvatar) {
          setLocalAvatar(savedAvatar);
        }
      }
    };
    
    loadAvatar();
    window.addEventListener('avatarChanged', loadAvatar);
    return () => window.removeEventListener('avatarChanged', loadAvatar);
  }, [user]);

  const emailName = user?.email?.split('@')[0] || 'Citizen';
  const displayFirstName = profile?.full_name?.split(' ')[0] || emailName;
  const initial = profile?.full_name?.charAt(0).toUpperCase() || emailName.charAt(0).toUpperCase();
  const displayAvatar = localAvatar || profile?.avatar_url;
  
  // Calculate stats for the top summary cards
  const activeCount = reports.filter(r => r.status !== 'Resolved').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-32 md:pb-8 md:pl-24 bg-surface min-h-screen">
        <div className="max-w-5xl mx-auto px-margin space-y-space-lg">
          
          {/* Welcome Header */}
          <div className="flex items-center justify-between page-enter">
            <div className="space-y-1">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight font-bold">
                Hello, {displayFirstName} 👋
              </h1>
              <p className="font-body-md text-on-surface-variant">
                Your neighborhood civic dashboard.
              </p>
            </div>
            <Link to="/profile" className="hidden sm:flex items-center gap-2 px-1.5 py-1.5 pr-4 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors shadow-sm active:scale-95 border border-outline-variant/10">
              {displayAvatar ? (
                <img src={displayAvatar} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[14px] shadow-sm">{initial}</span>
              )}
              <span className="font-title-sm text-on-surface truncate max-w-[120px]">{profile?.full_name || 'My Profile'}</span>
            </Link>
          </div>
          
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm stagger-enter">
            <Link to="/report" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary p-space-md shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_a_photo</span>
                </div>
                <span className="material-symbols-outlined text-on-primary/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
              </div>
              <div className="relative z-10 mt-4">
                <h2 className="font-title-md font-bold mb-0.5">Report New Issue</h2>
                <p className="font-body-sm text-on-primary/80 leading-tight">AI-assisted hazard logging</p>
              </div>
            </Link>

            <Link to="/map" className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest text-on-surface p-space-md shadow-sm border border-outline-variant/20 hover:bg-surface-container-low transition-all active:scale-[0.98] flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <div className="relative z-10 mt-4">
                <h2 className="font-title-md font-bold mb-0.5">Ward Operations Map</h2>
                <p className="font-body-sm text-on-surface-variant leading-tight">Live citywide hazard tracker</p>
              </div>
            </Link>
          </div>

          {/* Quick Stats (Premium Touch) */}
          <div className="grid grid-cols-2 gap-space-sm stagger-enter">
            <div className="bg-surface-container-lowest rounded-2xl p-space-sm flex items-center gap-3 border border-outline-variant/10 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
              </div>
              <div>
                <div className="font-headline-sm font-bold text-on-surface leading-none">{loading ? '-' : activeCount}</div>
                <div className="font-label-sm text-on-surface-variant mt-0.5">Active Tickets</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-space-sm flex items-center gap-3 border border-outline-variant/10 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-tertiary-fixed-dim/30 text-tertiary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div>
                <div className="font-headline-sm font-bold text-on-surface leading-none">{loading ? '-' : resolvedCount}</div>
                <div className="font-label-sm text-on-surface-variant mt-0.5">Resolved by City</div>
              </div>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="space-y-space-sm pt-2 stagger-enter">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-title-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                My Recent Reports
              </h2>
              {!loading && reports.length > 0 && (
                <span className="font-label-sm text-primary bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-semibold shadow-sm inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  {reports.length} Total
                </span>
              )}
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              {loading ? (
                <div className="p-10 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
                  <span className="font-body-md font-medium">Syncing with Municipal DB...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low text-secondary flex items-center justify-center mb-1">
                    <span className="material-symbols-outlined text-[32px]">assignment</span>
                  </div>
                  <h3 className="font-title-md font-bold text-on-surface">No reports filed yet</h3>
                  <p className="font-body-sm text-on-surface-variant max-w-[250px]">
                    Help improve your neighborhood. Tap "Report New Issue" to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {reports.map((item) => (
                    <Link 
                      key={item.id || item.ticket_id} 
                      to={`/tracking?id=${encodeURIComponent(item.ticket_id)}`} 
                      className="flex items-center gap-3 p-space-sm hover:bg-surface-container transition-colors group active:bg-surface-container-high"
                    >
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                        item.status === 'Resolved' ? 'bg-tertiary-container text-on-tertiary-container' : 
                        item.status === 'In Progress' ? 'bg-secondary-container text-on-secondary-container' : 
                        item.status === 'Verified' ? 'bg-primary-container text-on-primary-container' :
                        'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {item.category.toLowerCase().includes('light') ? 'lightbulb' : 
                           item.category.toLowerCase().includes('water') ? 'water_drop' : 
                           item.category.toLowerCase().includes('garbage') ? 'delete_sweep' :
                           'warning'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <span className="font-title-sm text-on-surface truncate font-semibold">{item.category}</span>
                          <span className="font-label-sm text-on-surface-variant shrink-0 ml-2">
                            {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="font-body-sm text-on-surface-variant truncate">
                          {item.location_address || 'Location unknown'}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'Resolved' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 
                            item.status === 'In Progress' ? 'bg-secondary-fixed text-on-secondary-fixed' : 
                            item.status === 'Verified' ? 'bg-primary-fixed text-on-primary-fixed' :
                            'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {item.status}
                          </span>
                          <span className="font-label-sm text-[10px] text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20 font-mono">
                            {item.ticket_id}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-on-surface-variant group-hover:bg-surface-container-highest group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
