import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, BottomNav, showToast } from '../components';

export default function TrackingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100dvh] flex flex-col bg-surface">
      <Header />
      <main className="flex-1 flex flex-col relative w-full h-full pt-20 pb-20 overflow-y-auto">
        <section className="w-full px-gutter-lg pt-space-lg pb-space-md border-b border-outline-variant/20 shadow-sm bg-surface sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">#CF1024</span>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 border border-secondary/20 text-on-secondary-container shadow-sm backdrop-blur-md">
                    <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span></span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">In Progress</span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Live civic response tracker</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Share" className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-low hover:border-outline-variant/60 text-on-surface-variant flex items-center justify-center transition-all active:scale-95 shadow-sm group" type="button">
                <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">share</span>
              </button>
            </div>
          </div>
          
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-3 relative overflow-hidden mt-4">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[22px]">timer</span>
                <span className="font-title-md text-title-md text-on-surface font-bold">Target SLA: 8 Hours</span>
              </div>
              <span className="font-label-sm text-[10px] sm:text-label-sm text-tertiary-fixed-dim bg-tertiary-container/20 border border-tertiary-fixed-dim/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">On Track (72%)</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden shadow-inner relative z-10">
              <div className="bg-gradient-to-r from-primary via-primary to-tertiary-fixed h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,55,176,0.6)]" style={{ width: '72%' }}></div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm relative z-10">
              <span className="font-medium">Elapsed: 4h 13m</span>
              <span className="text-on-surface font-bold">Est. Finish: Today, 6:00 PM</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-gutter-lg pt-4">
          <div className="md:col-span-1 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 p-space-sm flex flex-col gap-space-sm">
            <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-inner group">
              <img alt="Pothole" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="/pothole.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-on-surface/40 pointer-events-none"></div>
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error/90 text-on-error font-label-sm text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md">High Priority 🔴</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-1 mt-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-primary">domain</span><span className="font-label-sm text-[10px] uppercase tracking-widest font-bold">Department</span></div>
              <span className="font-title-sm text-title-sm text-on-surface font-bold">Road Maintenance</span>
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 p-space-md flex flex-col gap-space-sm relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-error shadow-[0_0_8px_rgba(186,26,26,0.8)]"></span></span>
                <span className="font-title-md text-title-md text-on-surface font-bold tracking-tight">Live Crew Dispatch</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">GPS Active</span>
            </div>
            
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center shadow-inner border border-outline-variant/10 relative z-10">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant/50">progress_activity</span>
            </div>

            <div className="flex items-start justify-between gap-space-sm p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/10 relative z-10">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0 shadow-inner"><span className="material-symbols-outlined text-[22px]">engineering</span></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Assigned Lead</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-bold truncate">Officer Raj Kumar</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate">Truck #KA-03-9912</span>
                </div>
              </div>
              <a className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm hover:bg-surface-container-low" href="tel:+1800555019"><span className="material-symbols-outlined text-[20px]">call</span></a>
            </div>
          </div>
        </section>

        <section className="p-gutter-lg pt-0">
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Audit Trail & Timeline</h3>
            </div>
            
            <div className="relative flex flex-col ml-4 relative z-10">
              <div className="absolute left-[15px] top-4 bottom-8 w-1 rounded-full bg-surface-container-highest"></div>
              
              <div className="relative flex items-start gap-space-lg pb-space-lg">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-surface-container-lowest ring-2 ring-tertiary/20"><span className="material-symbols-outlined text-[16px] font-bold">done</span></div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between"><span className="font-title-md text-title-md text-on-surface font-bold">Report Submitted</span><span className="font-label-sm text-label-sm text-on-surface-variant font-mono">10:32 AM</span></div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Citizen report logged with AI image evidence via mobile app.</p>
                </div>
              </div>
              
              <div className="relative flex items-start gap-space-lg pb-space-lg group">
                <div className="absolute left-[15px] top-8 -bottom-4 w-1 rounded-full bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(0,55,176,0.6)] border-2 border-surface-container-lowest">
                  <span className="material-symbols-outlined text-[16px] font-bold animate-spin" style={{ animationDuration: '3s' }}>autorenew</span>
                </div>
                <div className="flex-1 flex flex-col p-space-md rounded-2xl bg-primary/5 border border-primary/20 shadow-sm transition-all group-hover:bg-primary/10">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-2">
                      Repair In Progress
                      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,55,176,0.8)] animate-pulse"></span>
                    </span>
                    <span className="font-label-sm text-[11px] text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded-full">2:45 PM (Live)</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">Crew on site: Excavation, leveling, and hot-mix resurfacing actively underway.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <BottomNav active="tracking" />
    </div>
  );
}
