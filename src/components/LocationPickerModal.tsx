import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Check,
  X,
  Navigation,
  LocateFixed,
  Loader2,
  Sparkles,
  Radio,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface LocationItem {
  city: string;
  locality: string;
  distanceKm?: number;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  currentLocality: string;
  onSelectLocation: (city: string, locality: string, coords?: { lat: number; lng: number }) => void;
}

// Curated list of popular Indian cities & localities
const POPULAR_LOCATIONS: LocationItem[] = [
  { city: 'Patna', locality: 'Muhammadpur', distanceKm: 0.8 },
  { city: 'Patna', locality: 'Bailey Road', distanceKm: 2.1 },
  { city: 'Patna', locality: 'Kankarbagh', distanceKm: 3.4 },
  { city: 'Patna', locality: 'Boring Road', distanceKm: 4.2 },
  { city: 'Patna', locality: 'Patliputra Colony', distanceKm: 4.8 },
  { city: 'Patna', locality: 'Fraser Road / Dak Bungalow', distanceKm: 5.1 },
  { city: 'Patna', locality: 'Rajendra Nagar', distanceKm: 5.5 },
  { city: 'Patna', locality: 'Danapur', distanceKm: 8.0 },
  { city: 'Muzaffarpur', locality: 'Club Road / Mithanpura', distanceKm: 72 },
  { city: 'Gaya', locality: 'Civil Lines / AP Colony', distanceKm: 98 },
  { city: 'Delhi NCR', locality: 'Connaught Place', distanceKm: 850 },
  { city: 'Delhi NCR', locality: 'Noida Sector 62', distanceKm: 840 },
  { city: 'Delhi NCR', locality: 'Gurugram Cyber City', distanceKm: 865 },
  { city: 'Bengaluru', locality: 'Koramangala', distanceKm: 1620 },
  { city: 'Bengaluru', locality: 'HSR Layout', distanceKm: 1625 },
  { city: 'Bengaluru', locality: 'Whitefield', distanceKm: 1615 },
  { city: 'Mumbai', locality: 'Andheri East', distanceKm: 1450 },
  { city: 'Mumbai', locality: 'Bandra Kurla Complex (BKC)', distanceKm: 1460 },
  { city: 'Pune', locality: 'Hinjewadi IT Park', distanceKm: 1490 },
  { city: 'Pune', locality: 'Viman Nagar / Kharadi', distanceKm: 1485 },
  { city: 'Hyderabad', locality: 'Hitech City / Madhapur', distanceKm: 1140 },
  { city: 'Lucknow', locality: 'Hazratganj / Gomti Nagar', distanceKm: 440 },
  { city: 'Kolkata', locality: 'Salt Lake / Sector V', distanceKm: 490 },
];

const QUICK_CITIES = ['All', 'Patna', 'Muzaffarpur', 'Gaya', 'Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Lucknow'];

// Major Indian cities coordinates for GPS fallback reverse calculation
const KNOWN_CITY_COORDS = [
  { city: 'Patna', locality: 'Muhammadpur', lat: 25.5941, lng: 85.1376 },
  { city: 'Muzaffarpur', locality: 'Mithanpura', lat: 26.1209, lng: 85.3647 },
  { city: 'Gaya', locality: 'Civil Lines', lat: 24.7914, lng: 85.0002 },
  { city: 'Delhi NCR', locality: 'Connaught Place', lat: 28.6139, lng: 77.2090 },
  { city: 'Bengaluru', locality: 'Koramangala', lat: 12.9716, lng: 77.5946 },
  { city: 'Mumbai', locality: 'Andheri East', lat: 19.0760, lng: 72.8777 },
  { city: 'Pune', locality: 'Hinjewadi', lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', locality: 'Hitech City', lat: 17.3850, lng: 78.4867 },
  { city: 'Lucknow', locality: 'Gomti Nagar', lat: 26.8467, lng: 80.9462 },
  { city: 'Kolkata', locality: 'Salt Lake', lat: 22.5726, lng: 88.3639 },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  currentLocality,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState<boolean>(() => {
    return localStorage.getItem('jobs_india_live_gps') === 'true';
  });
  const watchIdRef = useRef<number | null>(null);

  // Clear watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Find nearest known city from latitude and longitude
  const findNearestCity = (lat: number, lng: number) => {
    let minDistance = Infinity;
    let closest = KNOWN_CITY_COORDS[0];

    for (const item of KNOWN_CITY_COORDS) {
      // Euclidean approximation
      const d = Math.sqrt(Math.pow(item.lat - lat, 2) + Math.pow(item.lng - lng, 2));
      if (d < minDistance) {
        minDistance = d;
        closest = item;
      }
    }
    return closest;
  };

  // Reverse geocode using Nominatim with timeout and fallback
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const detectedCity =
          addr.city ||
          addr.state_district ||
          addr.town ||
          addr.county ||
          addr.state ||
          'Patna';
        const detectedLocality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.road ||
          addr.village ||
          'Current Locality';

        return { city: detectedCity, locality: detectedLocality };
      }
    } catch {
      // Fallback to geometric distance
    }

    const nearest = findNearestCity(lat, lng);
    return { city: nearest.city, locality: nearest.locality };
  };

  // Handle Detect Current Location via Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      setTimeout(() => setLocationStatus(null), 3500);
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting live GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationStatus('Resolving area & city name...');

        try {
          const resolved = await reverseGeocode(lat, lng);
          onSelectLocation(resolved.city, resolved.locality, { lat, lng });
          setLocationStatus(`Live updated: ${resolved.city} (${resolved.locality})`);
          setTimeout(() => {
            setIsLocating(false);
            onClose();
          }, 900);
        } catch {
          // If all geocoding fails, fallback gracefully to current or closest city
          const nearest = findNearestCity(lat, lng);
          onSelectLocation(nearest.city, nearest.locality, { lat, lng });
          setLocationStatus(`Live updated: ${nearest.city} (${nearest.locality})`);
          setTimeout(() => {
            setIsLocating(false);
            onClose();
          }, 900);
        }
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve location';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Location access denied. Please enable GPS permissions.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Location request timed out. Using default city.';
        }
        setLocationStatus(errorMsg);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Toggle Live Auto-Update GPS
  const handleToggleLiveTracking = () => {
    const nextVal = !isLiveTracking;
    setIsLiveTracking(nextVal);
    localStorage.setItem('jobs_india_live_gps', nextVal ? 'true' : 'false');

    if (nextVal) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await reverseGeocode(latitude, longitude);
            onSelectLocation(res.city, res.locality, { lat: latitude, lng: longitude });
          },
          undefined,
          { enableHighAccuracy: false, maximumAge: 60000 }
        );
      }
      setLocationStatus('Live GPS tracking enabled: updating automatically as you move');
      setTimeout(() => setLocationStatus(null), 3000);
    } else {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setLocationStatus('Live GPS tracking paused');
      setTimeout(() => setLocationStatus(null), 2500);
    }
  };

  // Filtered locations
  const filteredLocations = POPULAR_LOCATIONS.filter((item) => {
    const matchesFilter =
      selectedCityFilter === 'All' || item.city.toLowerCase() === selectedCityFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const matchesSearch =
      item.city.toLowerCase().includes(query) || item.locality.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  // Handle custom location entered by user
  const handleAddCustomLocation = () => {
    if (!searchQuery.trim()) return;
    const parts = searchQuery.split(',').map((s) => s.trim());
    const customCity = parts[0] || 'Patna';
    const customLocality = parts[1] || parts[0] || 'Nearby Area';
    onSelectLocation(customCity, customLocality);
    onClose();
  };

  return (
    <div
      id="location-picker-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="location-picker-sheet"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[#1E2544] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2A48C8]" />
              <span>Select Your Location</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live updates jobs, distances, and recruiter matching near you
            </p>
          </div>
          <button
            id="close-location-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pt-3.5 pr-0.5">
          {/* 1. USE CURRENT LOCATION (LIVE UPDATE / GPS) CARD */}
          <section
            id="gps-live-location-section"
            className="bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] rounded-2xl p-3.5 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <button
                id="btn-use-current-location"
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-3 text-left group flex-1"
              >
                <div className="w-10 h-10 rounded-full bg-[#2A48C8] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  {isLocating ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <LocateFixed className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-[#1E2544] group-hover:text-[#2A48C8] transition-colors">
                      Use Current Location
                    </span>
                    <span className="bg-[#10B981] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    {isLocating
                      ? 'Detecting GPS position...'
                      : 'Tap to fetch device GPS coordinates & update instantly'}
                  </p>
                </div>
              </button>
            </div>

            {/* Status / feedback line */}
            {locationStatus && (
              <div className="text-xs bg-white/90 border border-blue-200 text-[#1E2544] px-3 py-1.5 rounded-xl font-medium flex items-center gap-2 animate-in fade-in">
                <Radio className="w-3.5 h-3.5 text-[#2A48C8] animate-pulse flex-shrink-0" />
                <span className="truncate">{locationStatus}</span>
              </div>
            )}

            {/* Live GPS Auto-Tracking Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-indigo-200/60">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2A48C8]" />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">
                    Continuous Live Tracking
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Keep jobs synced as you travel
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="toggle-live-tracking-btn"
                onClick={handleToggleLiveTracking}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                  isLiveTracking ? 'bg-[#2A48C8]' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isLiveTracking}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isLiveTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* 2. SEARCH BOX */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="location-search-input"
              type="text"
              placeholder="Search city, town, or area (e.g. Patna, Bailey Road, Delhi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#2A48C8] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. CITY FILTER CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_CITIES.map((city) => {
              const isSelected = selectedCityFilter === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCityFilter(city)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#2A48C8] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* 4. CURRENT ACTIVE LOCATION DISPLAY */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Selected:
              </span>
              <span className="text-xs font-bold text-[#1E2544]">
                {currentCity} • {currentLocality}
              </span>
            </div>
            <span className="text-[11px] text-[#10B981] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-ping" />
              Active
            </span>
          </div>

          {/* 5. POPULAR & MATCHING LOCALITIES LIST */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Available Areas & Localities ({filteredLocations.length})
              </span>
            </div>

            {filteredLocations.length > 0 ? (
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {filteredLocations.map((loc) => {
                  const isSelected =
                    currentCity.toLowerCase() === loc.city.toLowerCase() &&
                    currentLocality.toLowerCase() === loc.locality.toLowerCase();
                  return (
                    <button
                      key={`${loc.city}-${loc.locality}`}
                      type="button"
                      onClick={() => {
                        onSelectLocation(loc.city, loc.locality);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-[#EEF2FF] border border-[#2A48C8] text-[#2A48C8] font-bold shadow-xs'
                          : 'hover:bg-gray-50 text-gray-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#2A48C8] text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1E2544] leading-tight">
                            {loc.locality}
                          </p>
                          <p className="text-xs text-gray-500">
                            {loc.city}
                            {loc.distanceKm !== undefined && (
                              <span className="ml-1 text-gray-400 font-normal">
                                • {loc.distanceKm < 1 ? '<1' : loc.distanceKm} km away
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#2A48C8] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500">
                  No predefined locality matching &quot;{searchQuery}&quot;
                </p>
                <button
                  type="button"
                  id="add-custom-location-btn"
                  onClick={handleAddCustomLocation}
                  className="px-4 py-2 bg-[#2A48C8] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Set &quot;{searchQuery}&quot; as My Location
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
