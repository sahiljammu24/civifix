import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, BottomNav } from '../components';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-20 pb-24 md:pb-8 md:pl-24 bg-surface min-h-screen">
        <div className="max-w-5xl mx-auto px-margin">
          <div className="py-space-md flex items-center justify-between">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Morning, Alex</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Here is your local neighborhood summary.</p>
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
              <p className="font-body-md text-on-primary/80">Help keep Ward 7 safe.</p>
            </Link>
            <Link to="/map" className="group relative overflow-hidden rounded-2xl bg-surface-container-low text-on-surface p-space-lg border border-outline-variant/20 hover:bg-surface-container transition-all hover:-translate-y-1">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <span className="material-symbols-outlined text-[36px] mb-4 text-primary">explore</span>
              <h2 className="font-headline-sm text-headline-sm mb-1">Ward Operations Map</h2>
              <p className="font-body-md text-on-surface-variant">View active repairs near you.</p>
            </Link>
          </div>

          <h2 className="font-title-lg text-title-lg text-on-surface mb-space-sm">Recent Activity</h2>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
            <Link to="/tracking" className="flex items-center gap-space-md p-space-md border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
              <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-title-md text-title-md text-on-surface truncate">Pothole on Main St</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Reported 2 days ago</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold uppercase tracking-wide">Assigned</span>
                <span className="text-primary font-label-sm text-[11px] mt-1 hover:underline">Track crew</span>
              </div>
            </Link>
            <div className="flex items-center gap-space-md p-space-md opacity-70">
              <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-title-md text-title-md text-on-surface truncate">Streetlight Outage</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Resolved last week</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
