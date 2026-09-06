import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Search,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Crosshair,
} from "lucide-react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Custom Google-style Pulse Marker
const customMarkerIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `
    <div style="
      position: relative;
      width: 40px;
      height: 40px;
      transform: translate(-50%, -100%);
    ">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="#ea4335" stroke="#ffffff" stroke-width="1.6" style="filter: drop-shadow(0 6px 8px rgba(0,0,0,0.38));">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.8" fill="#ffffff" stroke="none"/>
      </svg>
      <div style="
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        background: rgba(234, 67, 53, 0.45);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export function LocationPicker({
  initialLat = 23.3441, // Ranchi
  initialLng = 85.3096,
  onLocationChange,
  initialAddress = "",
  initialPincode = "",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [mapType, setMapType] = useState("google_hybrid"); // 'google_street' | 'google_hybrid' | 'osm'
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [selectedPincode, setSelectedPincode] = useState(initialPincode);

  // High-precision Reverse Geocoding with Google Maps API (with Nominatim fallback)
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      setIsGeocoding(true);
      setGeoError("");

      // 1. Try Google Geocoding API first
      if (GOOGLE_API_KEY) {
        try {
          const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
          const res = await fetch(googleUrl);
          const data = await res.json();

          if (data.status === "OK" && data.results && data.results.length > 0) {
            const firstResult = data.results[0];
            const formattedAddress = firstResult.formatted_address;

            // Extract pincode from address components
            let foundPincode = "";
            for (const comp of firstResult.address_components) {
              if (comp.types.includes("postal_code")) {
                foundPincode = comp.long_name;
                break;
              }
            }

            setSelectedAddress(formattedAddress);
            if (foundPincode) setSelectedPincode(foundPincode);

            if (onLocationChange) {
              onLocationChange({
                lat: parseFloat(lat.toFixed(6)),
                lng: parseFloat(lng.toFixed(6)),
                address: formattedAddress,
                pincode: foundPincode || selectedPincode,
              });
            }
            setIsGeocoding(false);
            return;
          }
        } catch (err) {
          console.warn("Google geocoding error, trying fallback:", err);
        }
      }

      // 2. Fallback to OpenStreetMap Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const res = await fetch(url, { headers: { "Accept-Language": "en,hi" } });
        const data = await res.json();

        if (data && data.address) {
          const addr = data.address;
          const road = addr.road || addr.suburb || addr.neighbourhood || addr.village || "";
          const city = addr.city || addr.town || addr.county || addr.state_district || "Jharkhand";
          const state = addr.state || "Jharkhand";
          const postcode = addr.postcode || "";

          const formattedAddress =
            data.display_name.split(",").slice(0, 4).join(",") || `${road}, ${city}, ${state}`;

          setSelectedAddress(formattedAddress);
          if (postcode) setSelectedPincode(postcode);

          if (onLocationChange) {
            onLocationChange({
              lat: parseFloat(lat.toFixed(6)),
              lng: parseFloat(lng.toFixed(6)),
              address: formattedAddress,
              pincode: postcode || selectedPincode,
            });
          }
        }
      } catch (err) {
        console.error("Fallback geocoding error:", err);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onLocationChange, selectedPincode]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Default: Google Hybrid Satellite View
      const initialLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          attribution: "&copy; Google Maps",
          maxZoom: 20,
        }
      ).addTo(map);

      tileLayerRef.current = initialLayer;

      // Add Draggable Marker
      const marker = L.marker([coords.lat, coords.lng], {
        icon: customMarkerIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Marker dragend
      marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      // Map click to place/move pin
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer dynamically (Google Satellite / Google Road / OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let newLayer;
    if (mapType === "google_hybrid") {
      // Google Satellite + High-res Street Overlay
      newLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "&copy; Google Maps Satellite",
        maxZoom: 20,
      });
    } else if (mapType === "google_street") {
      // Google Clean Road Map
      newLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        attribution: "&copy; Google Maps",
        maxZoom: 20,
      });
    } else {
      // OpenStreetMap
      newLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 19,
      });
    }

    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapType]);

  // Handle GPS "Locate Me" Button
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17, {
            duration: 1.5,
          });
        }

        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }

        reverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === 1) errorMsg = "Location permission denied.";
        else if (error.code === 2) errorMsg = "Location unavailable.";
        else if (error.code === 3) errorMsg = "Location request timed out.";
        setGeoError(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Search Address / Landmark using Google Geocoding API with Nominatim Fallback
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    setGeoError("");

    // 1. Try Google Geocoding
    if (GOOGLE_API_KEY) {
      try {
        const googleSearchUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          `${searchQuery}, Jharkhand, India`
        )}&key=${GOOGLE_API_KEY}`;
        const res = await fetch(googleSearchUrl);
        const data = await res.json();

        if (data.status === "OK" && data.results && data.results.length > 0) {
          const formatted = data.results.map((r) => ({
            display_name: r.formatted_address,
            lat: r.geometry.location.lat,
            lon: r.geometry.location.lng,
          }));
          setSearchResults(formatted);
          setIsSearching(false);
          return;
        }
      } catch (err) {
        console.warn("Google search failed, trying fallback:", err);
      }
    }

    // 2. Fallback Nominatim
    try {
      const query = encodeURIComponent(`${searchQuery}, Jharkhand, India`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=in`
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setGeoError("Search service temporarily unavailable.");
    } finally {
      setIsSearching(false);
    }
  };

  // Place selected from dropdown
  const handleSelectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    setCoords({ lat, lng });
    setShowResults(false);
    setSearchQuery(place.display_name.split(",")[0]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    reverseGeocode(lat, lng);
  };

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Search & Mode Bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        {/* Search Box */}
        <div className="relative flex-1">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search
              size={16}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search landmark, street, or city (e.g. Sakchi, Main Road, Hinoo)..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-20 py-2.5 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              {isSearching ? <Loader2 size={12} className="animate-spin" /> : "Search"}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPlace(item)}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-emerald-50 flex items-start gap-2 text-navy-800 transition-colors"
                >
                  <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">
                      {item.display_name.split(",")[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: Layer Switcher + GPS Button */}
        <div className="flex items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setMapType("google_hybrid")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                mapType === "google_hybrid"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType("google_street")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                mapType === "google_street"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers size={13} />
              Google Map
            </button>
          </div>

          {/* Detect Live GPS Location Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/25 flex items-center gap-1.5 active:scale-95 disabled:opacity-75 shrink-0"
          >
            {isLocating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Crosshair size={14} className="animate-pulse" />
            )}
            <span>{isLocating ? "Detecting GPS..." : "📍 Live GPS"}</span>
          </button>
        </div>
      </div>

      {/* Error Alert if Geo fails */}
      {geoError && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={15} className="text-amber-600 shrink-0" />
          <span>{geoError} (You can drag the pin on map or type address manually)</span>
        </div>
      )}

      {/* Map Display Viewport */}
      <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Instruction Overlay Pill */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md text-[11px] font-bold text-slate-700 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Tap or drag the red pin to exact problem spot
        </div>

        {/* Floating Live Coordinates HUD Badge */}
        <div className="absolute bottom-3 left-3 z-10 bg-navy-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg text-[10px] font-mono text-emerald-400 flex items-center gap-2">
          <Navigation size={12} className="text-emerald-400" />
          <span>
            {coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E
          </span>
          {isGeocoding && <Loader2 size={10} className="animate-spin text-white" />}
        </div>
      </div>

      {/* Detected Location Feedback Card */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs shadow-2xs">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5 shadow-2xs">
          <CheckCircle2 size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 text-[11px] uppercase tracking-wider flex items-center gap-1">
              Geo-Tagged Civic Location:
            </span>
            <span className="text-[10px] text-emerald-800 font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              PIN: {selectedPincode || "Auto-detected"}
            </span>
          </div>
          <p className="text-navy-900 font-semibold text-xs mt-1 truncate">
            {isGeocoding
              ? "Fetching high-precision address from Google Maps..."
              : selectedAddress || "Click on map or press 'Live GPS' to tag problem"}
          </p>
        </div>
      </div>
    </div>
  );
}
