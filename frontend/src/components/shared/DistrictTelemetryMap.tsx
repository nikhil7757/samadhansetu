// Source: Google Maps Platform Code Assist
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Layers,
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface DistrictData {
  id: string;
  name: string;
  hindi: string;
  type: string;
  dockets: number;
  resolvedRate: string;
  avgSla: string;
  nodalOfficer: string;
  solverHub: string;
  primaryFocus: string;
  lat?: number;
  lng?: number;
}

// Complete geographic coordinates for Jharkhand districts
export const JHARKHAND_DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  ranchi: { lat: 23.3441, lng: 85.3096 },
  dhanbad: { lat: 23.7957, lng: 86.4304 },
  east_singhbhum: { lat: 22.8046, lng: 86.2029 },
  bokaro: { lat: 23.6693, lng: 86.1511 },
  deoghar: { lat: 24.4826, lng: 86.7001 },
  hazaribagh: { lat: 23.9925, lng: 85.3637 },
  giridih: { lat: 24.1868, lng: 86.3023 },
  ramgarh: { lat: 23.6334, lng: 85.5147 },
  palamu: { lat: 24.0416, lng: 84.0722 },
  west_singhbhum: { lat: 22.5539, lng: 85.8078 },
  dumka: { lat: 24.2698, lng: 87.2471 },
  garhwa: { lat: 24.1612, lng: 83.8055 },
  chatra: { lat: 24.2104, lng: 84.8706 },
  gumla: { lat: 23.0435, lng: 84.5414 },
  simdega: { lat: 22.6163, lng: 84.5098 },
  lohardaga: { lat: 23.4414, lng: 84.6811 },
  koderma: { lat: 24.4695, lng: 85.5947 },
  jamtara: { lat: 23.9622, lng: 86.8016 },
  godda: { lat: 24.8291, lng: 87.2144 },
  sahibganj: { lat: 25.2425, lng: 87.6438 },
  pakur: { lat: 24.6342, lng: 87.8493 },
  latehar: { lat: 23.7437, lng: 84.4988 },
  khunti: { lat: 23.0727, lng: 85.2796 },
  saraikela_kharsawan: { lat: 22.7006, lng: 85.9304 },
};

// Map camera controller component to smoothly pan when active district changes
function MapCameraController({ selectedDistrict }: { selectedDistrict: DistrictData }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedDistrict) return;
    const coords = JHARKHAND_DISTRICT_COORDS[selectedDistrict.id];
    if (coords) {
      map.panTo(coords);
      map.setZoom(9.5);
    }
  }, [map, selectedDistrict]);

  return null;
}

interface DistrictTelemetryMapProps {
  districts: DistrictData[];
  selectedDistrict: DistrictData;
  onSelectDistrict: (district: DistrictData) => void;
}

export function DistrictTelemetryMap({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: DistrictTelemetryMapProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('hi') ? 'hi' : 'en';

  // API Key management: Supports Vite env var, manual input, or session store
  const envApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(() => {
    if (envApiKey) return envApiKey;
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('gmp_api_key') || '';
    }
    return '';
  });

  const [inputKey, setInputKey] = useState('');
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState<DistrictData | null>(null);

  // Sync active marker with selected district
  useEffect(() => {
    setActiveMarker(selectedDistrict);
  }, [selectedDistrict]);

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setApiKey(inputKey.trim());
    try {
      localStorage.setItem('gmp_api_key', inputKey.trim());
    } catch (_) {}
    setIsKeyDrawerOpen(false);
  };

  const handleClearKey = () => {
    setApiKey('');
    try {
      localStorage.removeItem('gmp_api_key');
    } catch (_) {}
  };

  const centerJharkhand = useMemo(() => ({ lat: 23.6102, lng: 85.2799 }), []);

  return (
    <div className="space-y-4">
      {/* Top Map Control Bar & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xs text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-foreground flex items-center gap-1.5 font-mono">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>{t('map.liveLayerTitle', 'Google Maps Sovereign Jharkhand Command Grid')}</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono font-semibold">
            v=weekly • AdvancedMarkers
          </span>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('map.activeKey', 'Live Maps API Active')}</span>
              <button
                type="button"
                onClick={handleClearKey}
                className="text-[10px] text-muted-foreground hover:text-foreground underline ml-1 cursor-pointer"
              >
                ({t('map.changeKey', 'Change')})
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsKeyDrawerOpen(!isKeyDrawerOpen)}
              className="h-7 text-[11px] font-bold gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
            >
              <Key className="h-3 w-3" />
              <span>{t('map.configureKey', 'Enter Maps Demo / Cloud Key')}</span>
            </Button>
          )}

          <a
            href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('map.freeDemoKey', 'Free Demo Key')}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Optional In-Page Key Entry Drawer for Zero-Config Prototyping */}
      {isKeyDrawerOpen && (
        <form
          onSubmit={handleSaveCustomKey}
          className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3 animate-fade-in text-xs"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground block">
                {t('map.keyDrawerTitle', 'Quickstart: Connect Google Maps API Key')}
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {t(
                  'map.keyDrawerDesc',
                  'Paste your Google Maps Platform API key or Maps Demo Key to view satellite, terrain, and high-precision district boundaries.'
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsKeyDrawerOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="h-8 text-xs font-mono bg-background"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 text-xs font-bold bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer shrink-0"
            >
              {t('map.applyKey', 'Activate Map')}
            </Button>
          </div>
        </form>
      )}

      {/* Map Container: Explicit CSS height ensures NO CF2 height collapse */}
      <div className="relative w-full h-[460px] sm:h-[500px] rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
        {apiKey ? (
          <APIProvider
            apiKey={apiKey}
            language={currentLang}
            region="IN"
          >
            <Map
              defaultCenter={centerJharkhand}
              defaultZoom={7.5}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
              fullscreenControl={true}
              zoomControl={true}
            >
              <MapCameraController selectedDistrict={selectedDistrict} />

              {/* Render Advanced Markers for each District */}
              {districts.map((d) => {
                const coords = JHARKHAND_DISTRICT_COORDS[d.id];
                if (!coords) return null;
                const isSelected = selectedDistrict.id === d.id;

                return (
                  <AdvancedMarker
                    key={d.id}
                    position={coords}
                    title={`${d.name} (${d.hindi})`}
                    onClick={() => {
                      onSelectDistrict(d);
                      setActiveMarker(d);
                    }}
                  >
                    <Pin
                      background={isSelected ? '#0f766e' : '#1e293b'}
                      borderColor={isSelected ? '#34d399' : '#94a3b8'}
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* Active District InfoWindow */}
              {activeMarker && JHARKHAND_DISTRICT_COORDS[activeMarker.id] && (
                <InfoWindow
                  position={JHARKHAND_DISTRICT_COORDS[activeMarker.id]}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="p-1 max-w-xs space-y-2 text-xs font-sans text-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <div>
                        <h4 className="font-black text-sm text-slate-950 flex items-center gap-1">
                          <span>{activeMarker.name}</span>
                          <span className="text-xs font-medium text-slate-500 font-hindi">({activeMarker.hindi})</span>
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold block">
                          {activeMarker.type}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black">
                        {activeMarker.resolvedRate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Live Dockets</span>
                        <span className="font-black text-slate-900">{activeMarker.dockets}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Avg Turnaround</span>
                        <span className="font-black text-slate-900">{activeMarker.avgSla}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-700 leading-tight">
                      <strong className="text-slate-900">Nodal Officer:</strong> {activeMarker.nodalOfficer}
                    </div>

                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 leading-tight">
                      <strong className="text-emerald-950">Solver Hub:</strong> {activeMarker.solverHub}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* High-Fidelity Tactical Command Map Fallback when API key is not yet set */
          <div className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-br from-emerald-950/20 via-background to-teal-950/20">
            <div className="absolute inset-0 hero-grid-pattern opacity-30 pointer-events-none" />

            {/* Tactical Grid Overlay & District Dots */}
            <div className="relative w-full flex-1 flex items-center justify-center">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full max-h-[380px] drop-shadow-md select-none"
              >
                <defs>
                  <linearGradient id="jharkhandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Stylized State Geographic Contour */}
                <path
                  d="M 120 180 Q 220 80 400 90 T 680 160 Q 740 260 690 380 T 460 450 Q 280 440 180 380 Z"
                  fill="url(#jharkhandGrad)"
                  stroke="#0f766e"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-[pulse_4s_ease-in-out_infinite]"
                />

                {/* District Pin Nodes */}
                {districts.map((d, i) => {
                  const isSelected = selectedDistrict.id === d.id;
                  // Normalized positioning for Jharkhand polygon
                  const coords = JHARKHAND_DISTRICT_COORDS[d.id] || { lat: 23.6, lng: 85.3 };
                  // Transform Lat/Lng to SVG viewport
                  const cx = 150 + ((coords.lng - 83.5) / 4.8) * 500;
                  const cy = 420 - ((coords.lat - 22.0) / 3.4) * 350;

                  return (
                    <g
                      key={d.id}
                      onClick={() => onSelectDistrict(d)}
                      className="cursor-pointer group transition-all"
                    >
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="18"
                          fill="#10b981"
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 9 : 6}
                        fill={isSelected ? '#10b981' : '#0f766e'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125 shadow-md"
                      />
                      <text
                        x={cx}
                        y={cy - 12}
                        textAnchor="middle"
                        className={cn(
                          'text-[10px] font-mono font-bold tracking-tight select-none transition-all',
                          isSelected
                            ? 'fill-emerald-600 dark:fill-emerald-400 font-extrabold text-[12px]'
                            : 'fill-muted-foreground group-hover:fill-foreground'
                        )}
                      >
                        {d.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Prompt to activate full satellite/street Google Map */}
            <div className="relative z-10 w-full max-w-lg p-3 rounded-xl bg-card/90 backdrop-blur-md border border-border flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">
                    {selectedDistrict.name} District Command Locked
                  </span>
                  <span className="text-[10.5px] text-muted-foreground">
                    {selectedDistrict.dockets} live dockets • {selectedDistrict.resolvedRate} resolved
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsKeyDrawerOpen(true)}
                className="h-8 text-[11px] font-bold text-primary border-primary/40 hover:bg-primary/10 gap-1.5 cursor-pointer shrink-0"
              >
                <Key className="h-3 w-3" />
                <span>{t('map.loadLiveTiles', 'Load Live Google Map')}</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* District Dossier Summary Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{t('map.legendSelected', 'Selected Pin: Nodal Command')}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-700 dark:bg-slate-400" />
            <span>{t('map.legendActive', 'Active District Node')}</span>
          </span>
        </div>
        <span>{t('map.clickPrompt', 'Click any pin or district card above to inspect')}</span>
      </div>
    </div>
  );
}
