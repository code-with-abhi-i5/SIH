import { useEffect, useRef } from "react";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const JHARKHAND_CENTER = [23.6102, 85.2799]; // Central Jharkhand
const DEFAULT_ZOOM = 8;

export function GisMapComponent({
  points = [],
  hotspots = [],
  selectedPoint = null,
  onSelectPoint,
  height = "500px",
  center = JHARKHAND_CENTER,
  zoom = DEFAULT_ZOOM,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const hotspotsGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // CartoDB Positron elegant base map
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      hotspotsGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Hotspot Overlays
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing
    if (markersGroupRef.current) markersGroupRef.current.clearLayers();
    if (hotspotsGroupRef.current) hotspotsGroupRef.current.clearLayers();

    // Render Hotspots (Red Pulsing Circles)
    hotspots.forEach((hs) => {
      // Coordinates for Jharkhand districts
      const districtCoords = {
        Ranchi: [23.3441, 85.3096],
        Dhanbad: [23.7957, 86.4304],
        "East Singhbhum": [22.8046, 86.2029],
        Bokaro: [23.6693, 86.1511],
        Hazaribagh: [23.9925, 85.3637],
        Dumka: [24.2677, 87.248],
      };

      const coord = districtCoords[hs.district] || [23.4, 85.4];
      const circle = L.circle(coord, {
        color: "#dc2626",
        fillColor: "#ef4444",
        fillOpacity: 0.25,
        radius: 12000,
        weight: 2,
        dashArray: "4, 8",
      });

      circle.bindPopup(`
        <div class="p-2 font-sans">
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 mb-1.5">
            🚨 CRISIS HOTSPOT
          </div>
          <h4 class="font-bold text-sm text-navy-900">${hs.district} District</h4>
          <p class="text-xs text-navy-600 font-medium">Category: ${hs.category || "Water & Sanitation"}</p>
          <p class="text-xs text-red-600 font-semibold mt-1">Severity: ${hs.severityLevel || "CRITICAL"} (${hs.incidentCount || 5} incidents)</p>
          <div class="mt-2 text-[11px] text-navy-700 bg-amber-50 p-1.5 rounded border border-amber-200">
            <strong>Action:</strong> ${hs.recommendedAction || "Immediate dispatch required"}
          </div>
        </div>
      `);

      hotspotsGroupRef.current.addLayer(circle);
    });

    // Render Point Pins
    points.forEach((point) => {
      const lat = point.lat || (point.location && point.location.latitude);
      const lng = point.lng || (point.location && point.location.longitude);

      if (!lat || !lng) return;

      const urgency = point.urgencyScore || point.aiUrgencyScore || 50;
      let markerColor = "#22c55e"; // Green
      if (urgency >= 75 || point.severity === "High" || point.severity === "Critical") {
        markerColor = "#ef4444"; // Red
      } else if (urgency >= 45 || point.severity === "Medium") {
        markerColor = "#f59e0b"; // Saffron/Yellow
      }

      // Custom SVG Pin Icon
      const customIcon = L.divIcon({
        className: "custom-gis-pin",
        html: `
          <div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 10px;
              font-weight: 800;
              font-family: sans-serif;
            ">${urgency}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.bindPopup(`
        <div class="p-2.5 max-w-[240px] font-sans">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-navy-100 text-navy-800">
              ${point.category || "General"}
            </span>
            <span class="text-[11px] font-bold text-red-600">Urgency: ${urgency}/100</span>
          </div>
          <h4 class="font-bold text-xs text-navy-900 line-clamp-2 leading-snug">${point.title}</h4>
          <p class="text-[11px] text-navy-600 mt-1 flex items-center gap-1">
            📍 ${point.district || (point.location && point.location.district) || "Jharkhand"}
          </p>
          <div class="mt-2 pt-2 border-t border-navy-100 flex items-center justify-between text-[11px]">
            <span class="text-navy-500 font-medium">Status: <strong class="text-navy-800">${point.status || "Reported"}</strong></span>
          </div>
        </div>
      `);

      marker.on("click", () => {
        if (onSelectPoint) onSelectPoint(point);
      });

      markersGroupRef.current.addLayer(marker);
    });
  }, [points, hotspots, onSelectPoint]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%" }}
      className="rounded-xl overflow-hidden border border-navy-200/80 shadow-inner z-0 relative"
    />
  );
}

export default GisMapComponent;
