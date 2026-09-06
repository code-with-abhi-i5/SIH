import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../services/api";
import { GisMapComponent } from "../components/visuals/GisMapComponent";

export function GisMapPage() {
  const [gisPoints, setGisPoints] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchGisData();
  }, []);

  const fetchGisData = async () => {
    setLoading(true);
    try {
      const [heatmapRes, hotspotsRes] = await Promise.all([
        api.analytics.getGisHeatmap().catch(() => ({ points: [] })),
        api.analytics.getHotspots().catch(() => ({ hotspots: [] })),
      ]);

      setGisPoints(heatmapRes.points || []);
      setHotspots(hotspotsRes.hotspots || []);
    } catch (err) {
      // Mock GIS data
      setGisPoints([
        {
          id: "66e0c7d8e9f0a1b234567890",
          title: "Fluoride Contamination and Borewell Failure in Angara",
          category: "Water & Sanitation",
          severity: "High",
          urgencyScore: 88,
          status: "Reported",
          lat: 23.385,
          lng: 85.452,
          district: "Ranchi",
        },
        {
          id: "66e0d8e9f0a1b2c345678901",
          title: "Transformer Burnout and 10-Day Power Blackout",
          category: "Clean Energy & Environment",
          severity: "High",
          urgencyScore: 82,
          status: "In-Progress",
          lat: 23.795,
          lng: 86.43,
          district: "Dhanbad",
        },
        {
          id: "66e0e9f0a1b2c3d456789022",
          title: "Collapsing Culvert on Arterial Haul Road",
          category: "Roads & Infrastructure",
          severity: "High",
          urgencyScore: 91,
          status: "Reported",
          lat: 23.669,
          lng: 86.151,
          district: "Bokaro",
        },
        {
          id: "66e0f1a2b3c4d5e678909988",
          title: "Primary Health Center Cold-Chain Refrigerator Failure",
          category: "Healthcare & Nutrition",
          severity: "High",
          urgencyScore: 94,
          status: "Reported",
          lat: 23.992,
          lng: 85.363,
          district: "Hazaribagh",
        },
        {
          id: "66e0f1a2b3c4d5e678907766",
          title: "Submergence of Tribal Paddy Bunds & Soil Salinity",
          category: "Agriculture & Rural Economy",
          severity: "Medium",
          urgencyScore: 68,
          status: "Reported",
          lat: 24.267,
          lng: 87.248,
          district: "Dumka",
        },
      ]);

      setHotspots([
        {
          district: "Ranchi",
          category: "Water & Sanitation",
          incidentCount: 5,
          severityLevel: "CRITICAL_HOTSPOT",
          averageUrgencyScore: 89,
          sampleComplaints: [
            "Broken Borewell and High Fluoride Water in Angara",
            "Contaminated well water in Hutup village",
            "Handpump failure near Angara Primary School",
          ],
          recommendedAction:
            "Dispatch immediate technical assessment team from BIT Mesra Civil Engineering Dept & alert District Magistrate (Ranchi).",
        },
        {
          district: "Dhanbad",
          category: "Clean Energy & Environment",
          incidentCount: 4,
          severityLevel: "HIGH_ALERT",
          averageUrgencyScore: 84,
          sampleComplaints: [
            "Transformer burnout in Pokharia, Tundi block",
            "Damaged power distribution line near Tundi Hospital",
          ],
          recommendedAction:
            "Dispatch rapid solar microgrid deployment team from IIT ISM Dhanbad.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPoints = gisPoints.filter((p) =>
    filterCategory === "All" ? true : p.category === filterCategory
  );

  return (
    <div className="min-h-screen bg-warm-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-navy-100 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 mb-2">
              <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              State Emergency GIS Monitoring
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Jharkhand GIS Heatmap & Crisis Hotspots
            </h1>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              Real-time spatial visualization of community reported issues, critical cluster hotspots, and AI dispatch recommendations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-navy-50 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
            {["All", "Water & Sanitation", "Roads & Infrastructure", "Clean Energy & Environment"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? "bg-navy-900 text-white shadow-sm"
                    : "text-navy-700 hover:text-navy-950"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Hotspot Alerts Banner */}
        {hotspots.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" /> Active District Crisis Alerts ({hotspots.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotspots.map((hs, idx) => (
                <div
                  key={idx}
                  className="bg-red-50/90 border-2 border-red-300 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                      <h4 className="font-extrabold text-red-950 text-base">
                        {hs.district} — {hs.category}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                      Avg Urgency: {hs.averageUrgencyScore}/100
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-red-900">
                    Cluster Incident Volume: {hs.incidentCount} verified complaints in 48 hours
                  </p>

                  <div className="bg-white/80 p-3 rounded-xl border border-red-200 text-xs space-y-1">
                    <p className="font-bold text-navy-900">Recommended Crisis Protocol:</p>
                    <p className="text-navy-700 leading-snug">{hs.recommendedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIS Map & Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Leaflet Map */}
          <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-navy-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-bold text-navy-800">
                Spatial Coordinates ({filteredPoints.length} Active Pins)
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-red-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> High (75-100)
                </span>
                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium (45-74)
                </span>
                <span className="flex items-center gap-1 text-[11px] text-green-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Low (&lt;45)
                </span>
              </div>
            </div>

            <GisMapComponent
              points={filteredPoints}
              hotspots={hotspots}
              height="540px"
              selectedPoint={selectedPoint}
              onSelectPoint={(pt) => setSelectedPoint(pt)}
            />
          </div>

          {/* Side List of Reported Points */}
          <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-navy-950 text-base mb-1">Incident Registry</h3>
              <p className="text-xs text-navy-500 mb-4">Click pin on map or list to inspect details</p>

              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                {filteredPoints.map((pt) => (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPoint(pt)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedPoint?.id === pt.id
                        ? "bg-amber-50 border-amber-400 shadow-sm"
                        : "bg-navy-50/40 border-navy-100 hover:border-navy-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-navy-500">
                        {pt.district}
                      </span>
                      <span className="font-bold text-red-600 text-[11px]">
                        🔥 {pt.urgencyScore || 80}/100
                      </span>
                    </div>
                    <h5 className="font-bold text-navy-900 line-clamp-1">{pt.title}</h5>
                    <p className="text-[11px] text-navy-500 mt-1">Status: {pt.status || "Reported"}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/report" className="w-full">
              <Button className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs">
                Report Issue at Specific GPS Point
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GisMapPage;
