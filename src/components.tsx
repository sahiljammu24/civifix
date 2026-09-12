import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { fetchReports } from './supabase';
import { generateAlerts, Alert } from './pages/alerts';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showBrand?: boolean;
}

export function Header({ title = '', showBack = false, showBrand = true }: HeaderProps) {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [headerAlerts, setHeaderAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (user) {
      fetchReports(user.id).then(reports => {
        const generated = generateAlerts(reports || []);
        setHeaderAlerts(generated.slice(0, 3));
        setUnreadCount(generated.filter(a => !a.isRead).length);
      });
    }
  }, [user, showNotifications]);

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
  const initial = profile?.full_name?.charAt(0).toUpperCase() || emailName.charAt(0).toUpperCase();
  const displayAvatar = localAvatar || profile?.avatar_url;

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
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
            )}
          </button>
          
          {showNotifications && (
            <div ref={popupRef} className="absolute top-14 right-0 w-80 md:w-96 bg-surface-container-lowest/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden z-[100] transform origin-top-right transition-all">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/10 bg-surface/50">
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Notifications</h3>
                <Link to="/notifications" className="text-primary font-label-sm text-label-sm hover:underline" onClick={() => setShowNotifications(false)}>View all</Link>
              </div>
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar flex flex-col">
                {headerAlerts.length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant font-body-sm">
                    No new notifications.
                  </div>
                ) : (
                  headerAlerts.map(alert => (
                    <Link key={alert.id} to={`/tracking?id=${encodeURIComponent(alert.ticketId)}`} className="p-4 border-b border-outline-variant/5 flex gap-3 hover:bg-surface-container-low transition-colors group" onClick={() => setShowNotifications(false)}>
                      <div className={`w-10 h-10 rounded-full ${alert.iconBg} ${alert.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-[20px]">{alert.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-title-sm text-title-sm text-on-surface truncate ${!alert.isRead ? 'font-bold' : ''}`}>{alert.title}</span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mt-0.5">{alert.body}</span>
                        <span className={`font-label-sm text-[10px] mt-1 ${!alert.isRead ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{alert.time}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <Link to="/notifications" className="p-3 bg-surface-container text-center block" onClick={() => setShowNotifications(false)}>
                <span className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider font-bold cursor-pointer">View all alerts</span>
              </Link>
            </div>
          )}

          <Link className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary to-tertiary shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden border-2 border-surface-container-lowest" to="/profile">
            {displayAvatar ? (
              <img alt="Profile" className="w-full h-full rounded-full object-cover" src={displayAvatar} />
            ) : (
              <div className="w-full h-full rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                {initial}
              </div>
            )}
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
    { path: 'report', icon: 'add_a_photo', label: 'Report', isFab: true },
    { path: 'tracking', icon: 'assignment', label: 'Tracking', isFab: false },
    { path: 'notifications', icon: 'notifications', label: 'Alerts', isFab: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-0 md:left-0 md:h-screen md:w-[96px] md:border-r md:border-outline-variant/20 z-50 md:bg-surface-container-lowest bg-surface-container-lowest/95 backdrop-blur-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:shadow-none pb-safe">
      <div className="relative flex items-center md:flex-col justify-around md:justify-center md:gap-3 h-16 md:h-full px-2 md:px-0">
        
        {items.map(item => {
          if (item.isFab) {
            return (
              <div key={item.path} className="relative flex items-center justify-center -top-5 md:top-0 md:mb-6 z-10 px-2 shrink-0">
                <Link title={item.label} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center shadow-md shadow-primary/30 active:scale-95 transition-all hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-1 border border-white/10" to={`/${item.path}`}>
                  <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                </Link>
              </div>
            );
          }
          
          const isActive = activePath === item.path;
          return (
            <Link key={item.path} title={item.label} aria-current={isActive ? "page" : undefined} className={`group flex flex-col items-center justify-center min-w-[60px] md:w-full py-1 md:py-2 transition-all`} to={`/${item.path}`}>
              <div className={`relative flex items-center justify-center w-14 md:w-[64px] h-8 md:h-[36px] rounded-full transition-colors ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant group-hover:bg-surface-container-high group-hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>{item.icon}</span>
              </div>
              <span className={`font-label-sm mt-1 text-[11px] md:text-[12px] font-medium transition-colors ${isActive ? 'text-on-surface font-semibold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{item.label}</span>
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
