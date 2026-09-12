import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showBrand?: boolean;
}

export function Header({ title = '', showBack = false, showBrand = true }: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current && !popupRef.current.contains(event.target as Node) &&
        btnRef.current && !btnRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full md:w-[calc(100%-6rem)] md:ml-24 z-50 bg-surface/80 backdrop-blur-2xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] border-b border-outline-variant/20 pt-safe transition-all">
      <div className="h-20 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          {showBack && (
            <button aria-label="Go back" className="w-11 h-11 -ml-space-xs flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors active:scale-95" onClick={() => navigate(-1)}>
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}
          {showBrand && (
            <div className="flex items-center gap-space-xs group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-on-primary text-[24px]">location_city</span>
              </div>
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight group-hover:text-primary transition-colors">CivicFix</span>
            </div>
          )}
          {title && !showBrand && (
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate">{title}</h1>
          )}
        </div>
        <div className="flex items-center gap-space-sm relative">
          <button ref={btnRef} onClick={() => setShowNotifications(!showNotifications)} className="relative w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-colors" type="button">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
          </button>
          
          {showNotifications && (
            <div ref={popupRef} className="absolute top-14 right-0 w-80 md:w-96 bg-surface-container-lowest/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden z-[100] transform origin-top-right transition-all">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/10 bg-surface/50">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Notifications</h3>
                <button className="text-primary font-label-sm text-label-sm hover:underline" type="button" onClick={() => setShowNotifications(false)}>Mark all as read</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar flex flex-col">
                <Link to="/tracking" className="p-4 border-b border-outline-variant/5 flex gap-3 hover:bg-surface-container-low transition-colors group" onClick={() => setShowNotifications(false)}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">local_shipping</span></div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-sm text-title-sm text-on-surface font-bold truncate">Crew Dispatched!</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">Crew dispatched to #CF1024 (Pothole at Main Rd). ETA: 30 mins.</span>
                    <span className="font-label-sm text-[10px] text-primary mt-1 font-bold">2 mins ago</span>
                  </div>
                </Link>
                <Link to="/tracking" className="p-4 border-b border-outline-variant/5 flex gap-3 hover:bg-surface-container-low transition-colors group opacity-75" onClick={() => setShowNotifications(false)}>
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">verified</span></div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-sm text-title-sm text-on-surface font-bold truncate">Issue Resolved</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">Streetlight repair at Park Ave (#CF1019) is complete.</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant mt-1">Yesterday, 5:30 PM</span>
                  </div>
                </Link>
              </div>
              <Link to="/notifications" className="p-3 bg-surface-container text-center block" onClick={() => setShowNotifications(false)}>
                <span className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider font-bold cursor-pointer">View all alerts</span>
              </Link>
            </div>
          )}

          <Link className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary to-tertiary shadow-sm hover:scale-105 transition-transform" to="/profile">
            <img alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-surface-container-lowest" src="/avatar.jpg" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export interface BottomNavProps {
  active?: string;
}

export function BottomNav({ active }: BottomNavProps = {}) {
  const location = useLocation();
  const activePath = active || location.pathname.replace('/', '') || 'dashboard';

  const items = [
    { path: 'dashboard', icon: 'grid_view', label: 'Home', isFab: false },
    { path: 'map', icon: 'location_on', label: 'Nearby', isFab: false },
    { path: 'report', icon: 'add', label: '', isFab: true },
    { path: 'tracking', icon: 'assignment', label: 'Tracking', isFab: false },
    { path: 'notifications', icon: 'notifications', label: 'Alerts', isFab: false },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-0 md:left-0 md:h-screen md:w-24 md:border-r md:border-outline-variant/20 z-50 md:bg-surface-container-lowest bg-surface-container-lowest/80 backdrop-blur-2xl rounded-2xl shadow-xl md:shadow-none md:rounded-none">
      <div className="relative flex items-center md:flex-col justify-around md:justify-start md:pt-8 md:gap-8 h-16 md:h-full px-2 md:px-0">
        {items.map(item => {
          if (item.isFab) {
            return (
              <div key={item.path} className="relative flex items-center justify-center -top-6 md:top-0 md:mb-6 z-10">
                <Link className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:shadow-primary-container/50 md:hover:scale-105" to={`/${item.path}`}>
                  <span className="material-symbols-outlined text-[32px] font-bold">{item.icon}</span>
                </Link>
              </div>
            );
          }
          
          const active = activePath === item.path;
          return (
            <Link key={item.path} aria-current={active ? "page" : undefined} className={`flex flex-col items-center justify-center min-w-[56px] md:w-full h-14 md:h-20 transition-all ${active?'text-primary scale-110':'text-on-surface-variant hover:text-on-surface md:hover:bg-surface-container-low'}`} to={`/${item.path}`}>
              <div className="relative flex flex-col items-center justify-center">
                <span className={`material-symbols-outlined md:text-[28px] ${active ? 'font-bold' : ''}`} style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}>{item.icon}</span>
                <span className="font-label-sm text-label-sm mt-1 md:text-[11px] md:mt-1.5 opacity-100">{item.label}</span>
                {active && <div className="absolute -bottom-1.5 md:-bottom-2 w-1.5 h-1.5 rounded-full bg-primary shadow-sm hidden md:block"></div>}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

let toastTimeout: number | null = null;
export function showToast(message: string) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    document.body.appendChild(toast);
  }
  toast.className = 'fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[100] px-space-md py-space-sm rounded-xl bg-inverse-surface/95 backdrop-blur-md text-inverse-on-surface font-title-sm text-title-sm shadow-2xl flex items-center gap-space-sm toast-in border border-outline-variant/20';
  toast.innerHTML = `<span class="material-symbols-outlined text-[20px] text-tertiary-fixed">check_circle</span><span>${message}</span>`;
  if (toastTimeout) window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast!.className = toast!.className.replace('toast-in', 'toast-out');
    window.setTimeout(() => { toast!.remove(); }, 300);
  }, 3500);
}
