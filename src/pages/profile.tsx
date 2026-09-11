import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, BottomNav, showToast } from '../components';

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <>
      <Header title="Profile" showBrand={false} showBack={true} />
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-24 md:pb-8 md:ml-24 bg-surface">
        <div className="w-full max-w-2xl mx-auto flex flex-col stagger-enter px-margin gap-space-lg pt-space-sm">

          <section>
            <div className="relative rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl shadow-surface-container-highest/50 border border-outline-variant/20 overflow-hidden flex flex-col items-center text-center mt-8">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-primary to-tertiary-fixed opacity-10"></div>
              
              <div className="relative -mt-14 mb-4">
                <div className="w-28 h-28 rounded-full p-1.5 bg-surface-container-lowest shadow-sm border border-outline-variant/10 relative z-10">
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary)) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }}></div>
                  <img alt="Profile" className="w-full h-full rounded-full object-cover shadow-inner" src="/avatar.jpg" />
                  
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-md">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 relative z-10">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Maya Patel</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Central District, Ward 7</p>
              </div>
              
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm font-bold uppercase tracking-wider border border-tertiary/20 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <span>Top 5% Civic Score</span>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-space-md pt-space-md border-t border-outline-variant/10 relative z-10">
                <div className="flex flex-col items-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">14</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Reports</span>
                </div>
                <div className="flex flex-col items-center border-l border-r border-outline-variant/20">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">89<span className="text-sm">%</span></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Accuracy</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">4.8</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Impact</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-lg">
            <div className="flex flex-col gap-3">
              <h3 className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-widest pl-2">Account</h3>
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container border-b border-outline-variant/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">person</span></div>
                    <span className="font-title-md text-title-md text-on-surface font-medium">Personal Information</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container border-b border-outline-variant/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">verified_user</span></div>
                    <span className="font-title-md text-title-md text-on-surface font-medium">Identity Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-bold">Verified</span>
                    <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">settings</span></div>
                    <span className="font-title-md text-title-md text-on-surface font-medium">App Settings</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-widest pl-2">Civic Engagement</h3>
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container border-b border-outline-variant/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">history</span></div>
                    <span className="font-title-md text-title-md text-on-surface font-medium">My Report History</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors active:bg-surface-container group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[20px]">volunteer_activism</span></div>
                    <span className="font-title-md text-title-md text-on-surface font-medium">Community Contributions</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </button>
              </div>
            </div>
            
            <Link to="/login" className="w-full mt-2 h-14 rounded-xl bg-surface-container-lowest border-2 border-outline-variant/30 text-error font-title-md text-title-md hover:bg-error/10 hover:border-error/30 active:scale-95 transition-all font-bold flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </Link>
            
            <div className="text-center font-label-sm text-[11px] text-on-surface-variant/60 mt-4">
              CivicFix v2.1.0 (Build 9021)<br/>Developed by Department of Municipal Innovation
            </div>
          </section>

        </div>
      </main>
      <BottomNav />
    </>
  );
}
