import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, BottomNav, showToast } from '../components';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function ReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitReport = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Report submitted successfully!');
      navigate('/tracking');
    }, 2000);
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-surface">
      <Header />
      <main className="flex-1 flex flex-col relative w-full h-full pt-20 pb-20 overflow-y-auto">
        <div className="px-gutter-lg pt-4 pb-6 bg-surface z-10 border-b border-outline-variant/20 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Step {step} of 4</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mt-1">
                {step === 1 && "Upload Evidence"}
                {step === 2 && "Location"}
                {step === 3 && "Details"}
                {step === 4 && "AI Check & Submit"}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>AI Ready
            </span>
          </div>
          
          <div className="relative pt-2 mt-4">
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden absolute top-1/2 -translate-y-1/2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative p-gutter-lg pb-8">
          {step === 1 && (
            <div className="space-y-space-md animate-fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-space-sm border-dashed border-2 cursor-pointer hover:bg-surface-container-low transition-colors min-h-[300px]" onClick={nextStep}>
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-[36px]">add_a_photo</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Tap to capture or upload</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">Clear photos help our AI instantly categorize the issue and assign the right municipal crew.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-space-md animate-fade-in h-full flex flex-col min-h-[300px]">
              <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm">
                <span className="material-symbols-outlined text-primary">my_location</span>
                <input type="text" className="w-full bg-transparent outline-none font-body-md text-on-surface" placeholder="Current Location (Auto-detected)" readOnly />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 relative bg-surface-container-high min-h-[300px]">
                <Map
                  defaultZoom={17}
                  defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
                  mapId="DEMO_REPORT_MAP_ID"
                  disableDefaultUI={true}
                >
                  <AdvancedMarker position={{ lat: 40.7128, lng: -74.0060 }}>
                    <Pin background={'#BA1A1A'} borderColor={'#fff'} glyphColor={'#fff'} />
                  </AdvancedMarker>
                </Map>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-space-md animate-fade-in">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                <label className="font-title-sm text-title-sm font-bold text-on-surface mb-2 block">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 rounded-lg bg-primary-container text-on-primary-container border border-primary/20 font-label-md">Pothole</button>
                  <button className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md border border-outline-variant/20">Streetlight</button>
                  <button className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md border border-outline-variant/20">Water Leak</button>
                  <button className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md border border-outline-variant/20">Other</button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                <label className="font-title-sm text-title-sm font-bold text-on-surface mb-2 block">Description</label>
                <textarea className="w-full h-32 bg-surface-container-highest rounded-xl p-3 outline-none border border-transparent focus:border-primary text-on-surface font-body-md" placeholder="Add more details..."></textarea>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-space-md animate-fade-in">
               <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[32px]">fact_check</span>
                  </div>
                  <h3 className="font-title-md font-bold text-on-surface">Review & Submit</h3>
                  <p className="font-body-sm text-on-surface-variant max-w-xs mt-1">Our AI has verified this report. Click submit to dispatch it to the municipal grid.</p>
               </div>
               
               <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                  <h4 className="font-title-sm font-bold text-on-surface mb-2">Summary</h4>
                  <ul className="space-y-2 text-body-sm text-on-surface-variant">
                    <li className="flex justify-between"><span>Category:</span> <span className="font-bold text-on-surface">Pothole (99% AI Match)</span></li>
                    <li className="flex justify-between"><span>Priority:</span> <span className="font-bold text-error">High</span></li>
                    <li className="flex justify-between"><span>Location:</span> <span className="font-bold text-on-surface">Main St.</span></li>
                  </ul>
               </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-24 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 p-4 pb-safe z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            {step > 1 && (
              <button onClick={prevStep} className="h-12 px-6 rounded-xl bg-surface-container-low text-on-surface-variant font-title-sm font-bold hover:bg-surface-container transition-colors border border-outline-variant/20 active:scale-95 shadow-sm">
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button onClick={nextStep} className="flex-1 h-14 rounded-xl bg-primary text-on-primary font-title-md font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(0,55,176,0.25)] hover:bg-on-primary-fixed-variant hover:-translate-y-0.5 active:scale-95 transition-all">
                <span>Next Step</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            ) : (
              <button onClick={submitReport} disabled={isSubmitting} className="flex-1 h-14 rounded-xl bg-tertiary text-on-tertiary font-title-md font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(0,80,31,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all">
                <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
