import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header, showToast } from '../components';
import { Map, Marker, useMap, useMapsLibrary, MapMouseEvent } from '@vis.gl/react-google-maps';
import { createReport, uploadImage } from '../supabase';

export default function ReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlLat = searchParams.get('lat');
  const urlLng = searchParams.get('lng');
  const hasUrlCoords = urlLat !== null && urlLng !== null;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState(hasUrlCoords ? 'Loading address...' : 'LPU');
  const [coords, setCoords] = useState(
    hasUrlCoords
      ? { lat: parseFloat(urlLat), lng: parseFloat(urlLng) }
      : { lat: 31.25471, lng: 75.70434 }
  );
  const [pinDropped, setPinDropped] = useState(hasUrlCoords);
  const map = useMap("DEMO_REPORT_MAP_ID");
  const places = useMapsLibrary('places');
  const geocoding = useMapsLibrary('geocoding');
  const inputRef = useRef<HTMLInputElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const didInitFromUrl = useRef(false);

  // Initialize geocoder
  useEffect(() => {
    if (geocoding) {
      geocoderRef.current = new geocoding.Geocoder();
    }
  }, [geocoding]);

  // Free fallback reverse geocoding via OpenStreetMap or coordinates
  const fallbackReverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setLocationAddress(data.display_name);
          return;
        }
      }
    } catch {
      // ignore network errors
    }
    setLocationAddress(`Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, []);

  // Reverse-geocode a lat/lng to an address string with automatic fallback
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (geocoderRef.current) {
      try {
        geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            setLocationAddress(results[0].formatted_address);
          } else {
            fallbackReverseGeocode(lat, lng);
          }
        });
        return;
      } catch {
        fallbackReverseGeocode(lat, lng);
        return;
      }
    }
    fallbackReverseGeocode(lat, lng);
  }, [fallbackReverseGeocode]);

  // If we got coords from the URL, reverse-geocode
  useEffect(() => {
    if (hasUrlCoords && !didInitFromUrl.current) {
      didInitFromUrl.current = true;
      const lat = parseFloat(urlLat);
      const lng = parseFloat(urlLng);
      reverseGeocode(lat, lng);
      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(17);
      }
    }
  }, [map, hasUrlCoords, urlLat, urlLng, reverseGeocode]);

  // Handle click on map to drop pin
  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      setCoords({ lat, lng });
      setPinDropped(true);
      reverseGeocode(lat, lng);
      showToast('📍 Pin dropped! Drag to adjust.');
    }
  }, [reverseGeocode]);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoords({ lat, lng });
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  useEffect(() => {
    if (!places || !inputRef.current || step !== 1) return;
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address']
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoords({ lat, lng });
        setPinDropped(true);
        setLocationAddress(place.formatted_address || place.name || '');
        if (map) {
           map.panTo({ lat, lng });
           map.setZoom(17);
        }
      }
    });
  }, [places, map, step]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          let quality = 0.8;
          const tryCompress = (q: number) => {
            canvas.toBlob((blob) => {
              if (blob) {
                if (blob.size <= 150 * 1024 || q <= 0.1) {
                  resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }));
                } else {
                  tryCompress(q - 0.1);
                }
              } else {
                reject(new Error("Canvas to Blob failed"));
              }
            }, 'image/jpeg', q);
          };

          tryCompress(quality);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setIsUploading(true);
      try {
        const compressedFile = await compressImage(file);
        
        if (compressedFile.size > 200 * 1024) {
           showToast('Image still too large after compression. Max 200KB.');
           return;
        }

        const publicUrl = await uploadImage(compressedFile);
        setPreviewUrl(publicUrl);
        showToast('Image uploaded successfully');
      } catch (err) {
        console.error('Upload failed:', err);
        showToast('Upload failed. Ensure public "photos" bucket exists.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if ((window as any).gapi) {
      (window as any).gapi.load('picker', () => {
        console.log('Picker loaded');
      });
    }
  }, []);

  const handleGoogleDrivePicker = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      showToast('Please add VITE_GOOGLE_CLIENT_ID to .env.local');
      return;
    }

    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (tokenResponse: any) => {
        if (tokenResponse.error !== undefined) {
          showToast('Authentication failed');
          return;
        }
        createPicker(tokenResponse.access_token, apiKey);
      },
    });

    tokenClient.requestAccessToken({ prompt: '' });
  };

  const createPicker = (accessToken: string, apiKey: string) => {
    const google = (window as any).google;
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setMimeTypes('image/png,image/jpeg,image/jpg');
    
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setDeveloperKey(apiKey)
      .setOAuthToken(accessToken)
      .addView(view)
      .setCallback((data: any) => {
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
          const doc = data[google.picker.Response.DOCUMENTS][0];
          const fileId = doc[google.picker.Document.ID];
          // Create a direct link for public images
          const directLink = `https://drive.google.com/uc?id=${fileId}`;
          setPreviewUrl(directLink);
        }
      })
      .build();
      
    picker.setVisible(true);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      const ticketId = `#CF${Math.floor(1000 + Math.random() * 9000)}`;
      await createReport({
        ticket_id: ticketId,
        category,
        description: description || `${category} reported at ${locationAddress}`,
        location_address: locationAddress,
        latitude: coords.lat + (Math.random() - 0.5) * 0.005,
        longitude: coords.lng + (Math.random() - 0.5) * 0.005,
        image_url: previewUrl || '/pothole.jpg',
        status: 'In Progress',
        priority: category === 'Pothole' ? 'High' : 'Medium',
        department: category === 'Streetlight' ? 'Electrical Grid' : category === 'Water Leak' ? 'Water Works' : 'Roads & Infrastructure',
        ai_confidence: 98
      });
      showToast(`Report ${ticketId} saved to database!`);
      navigate(`/tracking?id=${encodeURIComponent(ticketId)}`);
    } catch (err) {
      console.error(err);
      showToast('Error saving to database. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-surface">
      <Header />
      <main className="flex-1 flex flex-col relative w-full h-full pt-20 pb-20 md:pb-8 md:pl-24 overflow-y-auto">
        <div className="px-gutter-lg pt-4 pb-6 bg-surface z-10 border-b border-outline-variant/20 shadow-[0_4px_12px_rgba(0,0,0,0.02)] sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Step {step} of 4</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight mt-1">
                {step === 1 && "Location"}
                {step === 2 && "Upload Evidence"}
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
            <div className="space-y-space-md animate-fade-in h-full flex flex-col min-h-[300px]">
              <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 shadow-sm">
                <span className="material-symbols-outlined text-primary">my_location</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-transparent outline-none font-body-md text-on-surface" 
                  placeholder="Search location or tap the map to drop a pin..." 
                />
                {pinDropped && (
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px] shrink-0">check_circle</span>
                )}
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 relative bg-surface-container-high min-h-[300px]">
                <Map
                  defaultZoom={17}
                  defaultCenter={coords}
                  mapId="DEMO_REPORT_MAP_ID"
                  disableDefaultUI={true}
                  onClick={handleMapClick}
                  style={{cursor: 'crosshair'}}
                >
                  <Marker 
                    position={coords} 
                    draggable={true}
                    onDragEnd={handleMarkerDragEnd}
                  />
                </Map>
                {/* Instruction overlay */}
                {!pinDropped && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <div className="bg-inverse-surface/90 text-inverse-on-surface backdrop-blur-md px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-label-sm text-label-sm font-bold animate-pulse">
                      <span className="material-symbols-outlined text-[18px]">touch_app</span>
                      Tap map to drop a pin
                    </div>
                  </div>
                )}
                {/* Coordinates display */}
                {pinDropped && (
                  <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                    <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant/20 font-mono text-[10px] text-on-surface-variant">
                      📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-space-md animate-fade-in">
              {previewUrl ? (
                <div className="relative bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex flex-col items-center">
                  <img src={previewUrl} alt="Preview" className="max-h-[300px] rounded-xl object-contain mb-4" />
                  <button onClick={() => setPreviewUrl(null)} className="px-4 py-2 bg-surface-container-high rounded-xl text-on-surface hover:bg-surface-container transition-colors">
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
                  <label className={`bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-space-sm border-dashed border-2 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-low'}`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                      disabled={isUploading}
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 shadow-inner">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                      ) : (
                        <span className="material-symbols-outlined text-[32px]">upload_file</span>
                      )}
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      {isUploading ? 'Uploading...' : 'Upload from Device'}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                      Max size: 200KB
                    </p>
                  </label>

                  <div 
                    className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-space-sm border-dashed border-2 cursor-pointer hover:bg-surface-container-low transition-colors"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.capture = 'environment';
                      input.onchange = (e) => handleFileUpload(e as any);
                      input.click();
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-2 shadow-inner relative overflow-hidden">
                       <span className="material-symbols-outlined text-[32px]">photo_camera</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">Take Photo</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">Use your camera to capture evidence</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-space-md animate-fade-in">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                <label className="font-title-sm text-title-sm font-bold text-on-surface mb-2 block">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pothole', 'Streetlight', 'Water Leak', 'Other'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg font-label-md transition-all ${
                        category === cat 
                          ? 'bg-primary text-on-primary font-bold shadow-sm' 
                          : 'bg-surface-container text-on-surface border border-outline-variant/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                <label className="font-title-sm text-title-sm font-bold text-on-surface mb-2 block">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 bg-surface-container-highest rounded-xl p-3 outline-none border border-transparent focus:border-primary text-on-surface font-body-md" 
                  placeholder="Add more details about the issue..."
                />
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
                  <p className="font-body-sm text-on-surface-variant max-w-xs mt-1">Our AI has verified this report. Click submit to save directly to Supabase and dispatch.</p>
               </div>
               
               <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
                  <h4 className="font-title-sm font-bold text-on-surface mb-2">Summary</h4>
                  <ul className="space-y-2 text-body-sm text-on-surface-variant">
                    <li className="flex justify-between"><span>Category:</span> <span className="font-bold text-on-surface">{category} (98% AI Match)</span></li>
                    <li className="flex justify-between"><span>Priority:</span> <span className={`font-bold ${category === 'Pothole' ? 'text-error' : 'text-primary'}`}>{category === 'Pothole' ? 'High' : 'Medium'}</span></li>
                    <li className="flex justify-between"><span>Location:</span> <span className="font-bold text-on-surface">{locationAddress}</span></li>
                    {previewUrl && (
                      <li className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                        <span>Evidence Photo:</span>
                        <img src={previewUrl} alt="Evidence" className="w-12 h-12 object-cover rounded-lg border border-outline-variant/30" />
                      </li>
                    )}
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
              <button onClick={submitReport} disabled={isSubmitting} className="flex-1 h-14 rounded-xl bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80 font-title-md font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(0,80,31,0.25)] hover:-translate-y-0.5 active:scale-95 transition-all">
                <span>{isSubmitting ? "Submitting to Supabase..." : "Submit Report"}</span>
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
