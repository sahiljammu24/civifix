import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, BottomNav } from '../components';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  
  const mockIssues = [
    { id: '#CF1024', type: 'Hazardous Pothole', location: { lat: 40.7128, lng: -74.0060 }, priority: 'High', distance: '0.2 miles away', image: '/pothole.jpg' },
    { id: '#CF1025', type: 'Broken Streetlight', location: { lat: 40.7138, lng: -74.0050 }, priority: 'Medium', distance: '0.4 miles away', image: '/pothole.jpg' },
  ];
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative w-full h-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-surface-container">
          <Map
            defaultZoom={15}
            defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
          >
            {mockIssues.map((issue) => (
              <AdvancedMarker
                key={issue.id}
                position={issue.location}
                onClick={() => setSelectedIssue(issue)}
              >
                <Pin background={issue.priority === 'High' ? '#BA1A1A' : '#0037B0'} borderColor={'#fff'} glyphColor={'#fff'} />
              </AdvancedMarker>
            ))}
          </Map>
        </div>

        <div className="absolute top-24 left-4 right-4 md:left-28 md:right-auto z-10 flex flex-col gap-2 pointer-events-none">
          <div className="pointer-events-auto bg-surface-container-lowest/90 backdrop-blur-md rounded-xl shadow-md border border-outline-variant/20 p-2 flex items-center gap-2 w-full md:w-80">
            <span className="material-symbols-outlined text-on-surface-variant pl-2">search</span>
            <input type="text" placeholder="Search neighborhood..." className="bg-transparent border-none outline-none font-body-md text-body-md text-on-surface w-full placeholder:text-on-surface-variant/70" />
          </div>
          <div className="pointer-events-auto flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button className="shrink-0 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-sm">All Issues</button>
            <button className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm font-bold shadow-sm border border-outline-variant/20">Potholes</button>
            <button className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm font-bold shadow-sm border border-outline-variant/20">Streetlights</button>
            <button className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm font-bold shadow-sm border border-outline-variant/20">Water</button>
          </div>
        </div>
        
        <div className={`absolute bottom-24 left-4 right-4 md:left-28 md:w-80 md:bottom-8 z-10 bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-xl border border-outline-variant/20 p-space-sm flex gap-3 transition-transform pointer-events-auto ${selectedIssue ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'}`}>
          {selectedIssue && (
            <>
              <div className="w-20 h-20 shrink-0 rounded-xl bg-surface-container overflow-hidden shadow-inner relative">
                <img src={selectedIssue.image} className="w-full h-full object-cover" alt="Issue thumbnail" />
                {selectedIssue.priority === 'High' && <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.8)] animate-pulse"></div>}
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold uppercase tracking-wider text-primary">{selectedIssue.id}</span>
                  <span className={`font-label-sm text-[10px] px-1.5 py-0.5 rounded font-bold ${selectedIssue.priority === 'High' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>{selectedIssue.priority}</span>
                </div>
                <h4 className="font-title-sm text-title-sm text-on-surface font-bold truncate mt-0.5">{selectedIssue.type}</h4>
                <span className="font-body-sm text-[11px] text-on-surface-variant truncate flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-[14px]">distance</span>{selectedIssue.distance}</span>
              </div>
              <button onClick={() => setSelectedIssue(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-container-high shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </>
          )}
        </div>
        
        <button className="absolute bottom-24 right-4 md:bottom-8 md:right-8 z-10 w-12 h-12 rounded-full bg-surface-container-lowest text-primary shadow-lg border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-low transition-colors active:scale-95 pointer-events-auto" type="button" aria-label="Recenter map">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </main>
      <BottomNav active="map" />
    </div>
  );
}
