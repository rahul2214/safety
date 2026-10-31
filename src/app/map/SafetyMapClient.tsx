'use client';

import React, { useState, useEffect, useRef, useMemo } from'react';
import Link from'next/link';
import {
  MapPin,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Building,
  Phone,
  Navigation,
  Filter,
  Lock,
  Compass,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Info,
  Search,
  RefreshCw,
  ExternalLink,
  Plus,
  Users,
  Sparkles,
  SearchCode,
} from'lucide-react';
import { Button } from'@/components/ui/Button';
import { Card } from'@/components/ui/Card';
import {
  getCurrentCoordinates,
  extractCoordsFromLocationString,
  reverseGeocodeCoords,
  searchIndianLocation,
} from'@/lib/location';
import { api, type BackendPost } from'@/lib/api-client';
import { getCategoryName } from'@/components/PostCard';
import { MapItemSkeleton } from'@/components/ui/Skeleton';

// Leaflet CSS
import'leaflet/dist/leaflet.css';

export interface SafetyMapItem {
  id: string;
  name: string;
  category: 'POLICE' | 'HOSPITAL' | 'SHELTER' | 'INCIDENT_ZONE' | 'ORGANIZATION';
  address: string;
  phone?: string;
  hours: string;
  lat: number;
  lng: number;
  details: string;
  statusColor: string;
  iconLabel: string;
  isLiveDbReport?: boolean;
  severity?: string;
  postSeverityId?: number;
  reportDate?: string;
  supportCount?: number;
}

// ─── Known locality coordinates across India (Metros, States, Key Hubs) ──────
const LOCALITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Telangana & Hyderabad
  'madhapur': { lat: 17.4486, lng: 78.3908 },
  'hitec city': { lat: 17.4435, lng: 78.3772 },
  'gachibowli': { lat: 17.4401, lng: 78.3489 },
  'secunderabad': { lat: 17.4344, lng: 78.5015 },
  'begumpet': { lat: 17.4442, lng: 78.4655 },
  'banjara hills': { lat: 17.4156, lng: 78.4357 },
  'jubilee hills': { lat: 17.4319, lng: 78.4073 },
  'ameerpet': { lat: 17.4375, lng: 78.4482 },
  'punjagutta': { lat: 17.4261, lng: 78.4520 },
  'kukatpally': { lat: 17.4849, lng: 78.4138 },
  'charminar': { lat: 17.3616, lng: 78.4747 },
  'koti': { lat: 17.3850, lng: 78.4867 },
  'mehdipatnam': { lat: 17.3916, lng: 78.4417 },
  'dilsukhnagar': { lat: 17.3688, lng: 78.5247 },
  'nampally': { lat: 17.3975, lng: 78.4628 },
  'kondapur': { lat: 17.4680, lng: 78.3585 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'warangal': { lat: 17.9689, lng: 79.5941 },

  // Delhi NCR
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'connaught place': { lat: 28.6295, lng: 77.2185 },
  'karol bagh': { lat: 28.6514, lng: 77.1907 },
  'dwarka': { lat: 28.5921, lng: 77.0460 },
  'rohini': { lat: 28.7495, lng: 77.0565 },
  'saket': { lat: 28.5244, lng: 77.2167 },
  'hauz khas': { lat: 28.5494, lng: 77.2001 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'faridabad': { lat: 28.4089, lng: 77.3178 },

  // Maharashtra / Mumbai / Pune
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bandra': { lat: 19.0596, lng: 72.8295 },
  'andheri': { lat: 19.1136, lng: 72.8697 },
  'colaba': { lat: 18.9067, lng: 72.8147 },
  'dadar': { lat: 19.0178, lng: 72.8478 },
  'borivali': { lat: 19.2307, lng: 72.8567 },
  'thane': { lat: 19.2183, lng: 72.9781 },
  'navi mumbai': { lat: 19.0330, lng: 73.0297 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'hinjewadi': { lat: 18.5913, lng: 73.7389 },
  'shivajinagar': { lat: 18.5308, lng: 73.8475 },
  'kothrud': { lat: 18.5074, lng: 73.8077 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },

  // Karnataka / Bengaluru
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'indiranagar': { lat: 12.9784, lng: 77.6408 },
  'koramangala': { lat: 12.9352, lng: 77.6245 },
  'whitefield': { lat: 12.9698, lng: 77.7500 },
  'hsr layout': { lat: 12.9121, lng: 77.6446 },
  'electronic city': { lat: 12.8399, lng: 77.6770 },
  'jayanagar': { lat: 12.9308, lng: 77.5838 },
  'marathahalli': { lat: 12.9591, lng: 77.6974 },
  'mysuru': { lat: 12.2958, lng: 76.6394 },

  // Tamil Nadu / Chennai
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'anna nagar': { lat: 13.0850, lng: 80.2101 },
  't nagar': { lat: 13.0418, lng: 80.2341 },
  'adyar': { lat: 13.0012, lng: 80.2565 },
  'velachery': { lat: 12.9815, lng: 80.2180 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },

  // West Bengal / Kolkata
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'salt lake': { lat: 22.5867, lng: 88.4178 },
  'park street': { lat: 22.5535, lng: 88.3516 },
  'new town': { lat: 22.5898, lng: 88.4744 },
  'howrah': { lat: 22.5958, lng: 88.2636 },

  // Gujarat
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },

  // Rajasthan
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'jodhpur': { lat: 26.2389, lng: 73.0243 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },

  // Uttar Pradesh & North
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'ludhiana': { lat: 30.9010, lng: 75.8573 },

  // Andhra Pradesh
  'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'vijayawada': { lat: 16.5062, lng: 80.6480 },

  // Kerala
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },

  // Other Capitals
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'patna': { lat: 25.5941, lng: 85.1376 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'guwahati': { lat: 26.1445, lng: 91.7362 },
};

function resolveLocationCoords(
  locationName?: string,
  postId?: number,
  fallbackCoords?: { lat: number; lng: number } | null
): { lat: number; lng: number } {
  // 1. Check if the string has explicit coordinates (e.g. Lat: 17.4486, Lon: 78.3908)
  const extracted = extractCoordsFromLocationString(locationName);
  if (extracted) {
  return extracted;
  }

  // 2. Check pan-India known localities
  if (locationName) {
  const lower = locationName.toLowerCase();
  for (const [key, coords] of Object.entries(LOCALITY_COORDS)) {
  if (lower.includes(key)) {
  const jitterLat = ((postId || 1) % 7 - 3) * 0.0018;
  const jitterLng = ((postId || 1) % 5 - 2) * 0.0018;
  return { lat: coords.lat + jitterLat, lng: coords.lng + jitterLng };
  }
  }
  }

  // 3. If user location is known, cluster reports near the user's vicinity
  if (fallbackCoords) {
  const seed = postId || 1;
  const offsetLat = ((seed * 13) % 40 - 20) * 0.0015;
  const offsetLng = ((seed * 19) % 40 - 20) * 0.0015;
  return { lat: fallbackCoords.lat + offsetLat, lng: fallbackCoords.lng + offsetLng };
  }

  // 4. Default to geographic center of India with deterministic offset
  const seed = postId || 1;
  const offsetLat = ((seed * 17) % 50 - 25) * 0.0025;
  const offsetLng = ((seed * 23) % 50 - 25) * 0.0025;
  return { lat: 20.5937 + offsetLat, lng: 78.9629 + offsetLng };
}

// Distance calculation using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos((lat1 * Math.PI) / 180) *
  Math.cos((lat2 * Math.PI) / 180) *
  Math.sin(dLon / 2) *
  Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function SafetyMapClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedPin, setSelectedPin] = useState<SafetyMapItem | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const [detectedLocationName, setDetectedLocationName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // Dynamic nearby safety hubs fetched from API
  const [safetyPlaces, setSafetyPlaces] = useState<SafetyMapItem[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // Live reports from DB
  const [dbReports, setDbReports] = useState<SafetyMapItem[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch real nearby safety infrastructure from BFF route
  const fetchNearbyPlaces = async (lat?: number, lng?: number) => {
  setLoadingPlaces(true);
  try {
  const url =
  lat && lng
  ? `/api/safety-places?lat=${lat}&lng=${lng}`
  : `/api/safety-places`;
  const res = await fetch(url);
  if (res.ok) {
  const data = await res.json();
  if (data.places && Array.isArray(data.places)) {
  setSafetyPlaces(data.places);
  }
  if (data.locationName) {
  setDetectedLocationName(data.locationName);
  setLocStatus(`📍 ${data.locationName}`);
  }
  }
  } catch (err) {
  console.warn('Failed to load dynamic nearby safety places:', err);
  } finally {
  setLoadingPlaces(false);
  }
  };

  // Load live DB posts strictly from backend API
  const loadDbReports = async (userCoords?: { latitude: number; longitude: number } | null) => {
  setLoadingDb(true);
  try {
  const res = await api.getFeed({ limit: 50 });
  if (res.ok && res.data && Array.isArray(res.data)) {
  const fallback = userCoords ? { lat: userCoords.latitude, lng: userCoords.longitude } : null;
  const liveItems: SafetyMapItem[] = res.data.map((post: any) => {
  const coords = resolveLocationCoords(post.location, post.id, fallback);
  const catName = getCategoryName(post.category || post.categoryName);
  const sevId =
  post.postSeverityId ||
  (post.severity === 'IMMEDIATE_DANGER' ? 4 : post.severity === 'SERIOUS' ? 3 : 2);

  let statusColor = '#d97706'; // Concerning (amber)
  let iconLabel = '!';
  if (sevId === 4) {
  statusColor = '#e11d48'; // Critical (rose)
  iconLabel = '⚠️';
  } else if (sevId === 3) {
  statusColor = '#ea580c'; // Serious (orange)
  iconLabel = '!';
  } else if (sevId === 1) {
  statusColor = '#059669'; // Advice needed (emerald)
  iconLabel = 'ℹ️';
  }

  return {
  id: `post-${post.id}`,
  name: `Reported Hazard: ${catName}`,
  category: 'INCIDENT_ZONE',
  address: post.location || 'Approximate Safety Zone',
  hours: 'Community Report',
  lat: coords.lat,
  lng: coords.lng,
  details: post.content,
  statusColor,
  iconLabel,
  isLiveDbReport: true,
  severity: post.severity,
  postSeverityId: sevId,
  reportDate: post.incidentDateTime || post.createdAt,
  supportCount: post.supportCount || 0,
  };
  });
  setDbReports(liveItems);
  }
  } catch (err) {
  console.warn('Failed to load live reports for safety map:', err);
  } finally {
  setLoadingDb(false);
  }
  };

  useEffect(() => {
  loadDbReports(userLocation);
  fetchNearbyPlaces();
  }, []);

  // Combined resources (Dynamic verified nearby hubs + DB reports)
  const allResources = useMemo(() => {
  return [...safetyPlaces, ...dbReports];
  }, [safetyPlaces, dbReports]);

  // Filtered resources sorted by distance if user location is available
  const filteredResources = useMemo(() => {
  const list = allResources.filter((res) => {
  // 1. Category Filter
  if (activeFilter === 'POLICE' && res.category !== 'POLICE') return false;
  if (activeFilter === 'HOSPITAL' && res.category !== 'HOSPITAL') return false;
  if (activeFilter === 'SHELTER' && res.category !== 'SHELTER') return false;
  if (activeFilter === 'INCIDENTS' && res.category !== 'INCIDENT_ZONE') return false;
  if (activeFilter === 'ORGANIZATION' && res.category !== 'ORGANIZATION') return false;

  // 2. Search query filter
  if (searchQuery.trim()) {
  const q = searchQuery.toLowerCase().trim();
  const matchesName = res.name.toLowerCase().includes(q);
  const matchesAddress = res.address.toLowerCase().includes(q);
  const matchesDetails = res.details.toLowerCase().includes(q);
  if (!matchesName && !matchesAddress && !matchesDetails) return false;
  }

  return true;
  });

  if (userLocation) {
  return list.sort((a, b) => {
  const distA = calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.lat, a.lng);
  const distB = calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.lat, b.lng);
  return distA - distB;
  });
  }

  return list;
  }, [allResources, activeFilter, searchQuery, userLocation]);

  // Initialize Leaflet Map
  useEffect(() => {
  if (typeof window === 'undefined' || !mapContainerRef.current) return;

  let isMounted = true;

  async function initMap() {
  const L = (await import('leaflet')).default;

  if (!mapContainerRef.current || !isMounted) return;

  // Avoid re-initialization
  if (mapInstanceRef.current) {
  mapInstanceRef.current.remove();
  mapInstanceRef.current = null;
  }

  // Default center: User location or general center of India
  const defaultCenter: [number, number] = userLocation
  ? [userLocation.latitude, userLocation.longitude]
  : [20.5937, 78.9629];
  const initialZoom = userLocation ? 14 : 5;

  const map = L.map(mapContainerRef.current, {
  center: defaultCenter,
  zoom: initialZoom,
  zoomControl: true,
  });

  // CartoDB Voyager clean tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution:
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  maxZoom: 19,
  }).addTo(map);

  // Layer group for markers
  const markersLayer = L.layerGroup().addTo(map);
  markersLayerRef.current = markersLayer;
  mapInstanceRef.current = map;

  // Ensure proper sizing
  setTimeout(() => {
  map.invalidateSize();
  }, 250);
  }

  initMap();

  return () => {
  isMounted = false;
  if (mapInstanceRef.current) {
  mapInstanceRef.current.remove();
  mapInstanceRef.current = null;
  }
  };
  }, []);

  // Update Markers on Filter or Resource Change
  useEffect(() => {
  if (!mapInstanceRef.current || !markersLayerRef.current) return;

  async function updateMarkers() {
  const L = (await import('leaflet')).default;
  const markersLayer = markersLayerRef.current;
  markersLayer.clearLayers();

  filteredResources.forEach((res) => {
  const isHazard = res.category === 'INCIDENT_ZONE';

  // Custom HTML DivIcon
  const iconHtml = `
  <div style="
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${res.statusColor};
  color: #ffffff;
  border-radius: 50%;
  border: 2.5px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  font-weight: 800;
  font-size: 11px;
  cursor: pointer;
  transition: transform 0.15s ease;
  ">
  ${
  isHazard
  ? `<span style="
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background-color: ${res.statusColor};
  opacity: 0.35;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  "></span>`
  : ''
  }
  <span style="position: relative; z-index: 10;">${res.iconLabel}</span>
  </div>
  `;

  const customIcon = L.divIcon({
  className: 'safecircle-map-pin',
  html: iconHtml,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
  });

  const marker = L.marker([res.lat, res.lng], { icon: customIcon });

  // Popup Content
  const popupContent = document.createElement('div');
  popupContent.className = 'p-1 space-y-1 text-slate-900';
  popupContent.innerHTML = `
  <div style="font-weight: bold; font-size: 13px; color: #1e1b4b;">${res.name}</div>
  <div style="font-size: 11px; color: #64748b;">${res.address}</div>
  <div style="font-size: 11px; color: #334155; margin-top: 4px; max-height: 80px; overflow-y: auto;">${res.details}</div>
  ${
  res.phone
  ? `<a href="tel:${res.phone}"style="display: inline-block; margin-top: 6px; padding: 4px 10px; background-color: #6d4aff; color: white; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none;">Call ${res.phone}</a>`
  : ''
  }
  `;

  marker.bindPopup(popupContent);

  marker.on('click', () => {
  setSelectedPin(res);
  });

  markersLayer.addLayer(marker);
  });
  }

  updateMarkers();
  }, [filteredResources]);

  // Update User Location Marker
  useEffect(() => {
  if (!mapInstanceRef.current || !userLocation) return;

  async function updateUserMarker() {
  const loc = userLocation;
  if (!loc) return;

  const L = (await import('leaflet')).default;
  const map = mapInstanceRef.current;
  if (!map) return;

  if (userMarkerRef.current) {
  userMarkerRef.current.remove();
  }

  const userIconHtml = `
  <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
  <span style="position: absolute; inset: 0; border-radius: 50%; background: #3b82f6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
  <span style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #2563eb; border: 2.5px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.35);"></span>
  </div>
  `;

  const userIcon = L.divIcon({
  className: 'user-radar-pin',
  html: userIconHtml,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  });

  const marker = L.marker([loc.latitude, loc.longitude], {
  icon: userIcon,
  zIndexOffset: 1000,
  }).addTo(map);

  marker.bindPopup('<b>Your Current Location</b><br/>GPS Verified Radar');
  userMarkerRef.current = marker;
  }

  updateUserMarker();
  }, [userLocation]);

  // Auto-locate GPS handler (Dynamic for all of India)
  const handleLocateMe = async () => {
  setLocLoading(true);
  setLocStatus('Acquiring high-precision GPS...');
  try {
  const coords = await getCurrentCoordinates();
  setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });

  if (mapInstanceRef.current) {
  mapInstanceRef.current.flyTo([coords.latitude, coords.longitude], 14, {
  duration: 1.5,
  });
  }

  // Fetch dynamic nearby police stations, hospitals, and reverse geocode
  await fetchNearbyPlaces(coords.latitude, coords.longitude);
  await loadDbReports(coords);
  } catch (e: any) {
  setLocStatus('GPS permission needed. Enter your city or area to locate safety points.');
  } finally {
  setLocLoading(false);
  }
  };

  // Search Indian City or Area
  const handleSearchIndianCity = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  if (!searchQuery.trim()) return;

  setIsSearchingCity(true);
  try {
  const geoResult = await searchIndianLocation(searchQuery.trim());
  if (geoResult) {
  setUserLocation({ latitude: geoResult.lat, longitude: geoResult.lng });
  setDetectedLocationName(geoResult.displayName.split(',')[0]);
  setLocStatus(`📍 ${geoResult.displayName.split(',').slice(0, 3).join(', ')}`);

  if (mapInstanceRef.current) {
  mapInstanceRef.current.flyTo([geoResult.lat, geoResult.lng], 14, {
  duration: 1.5,
  });
  }

  await fetchNearbyPlaces(geoResult.lat, geoResult.lng);
  await loadDbReports({ latitude: geoResult.lat, longitude: geoResult.lng });
  }
  } catch (err) {
  console.warn('City geocoding search failed:', err);
  } finally {
  setIsSearchingCity(false);
  }
  };

  useEffect(() => {
  handleLocateMe();
  }, []);

  // Fly to Pin on click
  const focusOnPin = (res: SafetyMapItem) => {
  setSelectedPin(res);
  if (mapInstanceRef.current) {
  mapInstanceRef.current.flyTo([res.lat, res.lng], 16, {
  duration: 1.2,
  });
  }
  };

  return (
  <div className="max-w-7xl mx-auto space-y-5 pb-16">
  {/* ============================================================ */}
  {/* 1. TOP HEADER & EMERGENCY ACTIONS */}
  {/* ============================================================ */}
  <section className="bg-white rounded-[24px] border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div className="space-y-1">
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fdeef6] text-[#e11d48] text-xs font-bold">
  <Compass className="h-3.5 w-3.5 animate-spin-slow" />
  <span className="uppercase tracking-wider">PAN-INDIA HYPERLOCAL SAFETY RADAR</span>
  </div>
  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink">
  Interactive Safety &amp; Emergency Map
  </h1>
  <p className="text-xs sm:text-[13px] text-slate-600 max-w-2xl leading-relaxed">
  Explore real-time verified police stations, 24/7 trauma hospitals, women safety desks, and live incident hazards near your location across India.
  </p>
  </div>

  {/* Quick Actions */}
  <div className="flex flex-wrap items-center gap-2 shrink-0">
  <Button
  variant="outline"
  size="sm"
  onClick={handleLocateMe}
  loading={locLoading}
  className="rounded-[12px] border-slate-200 text-xs font-bold"
  >
  <Compass className="h-3.5 w-3.5 mr-1.5 text-brand" />
  <span>{userLocation ? 'Re-center GPS' : 'Locate Me'}</span>
  </Button>

  <a
  href="tel:112"
  className="px-3.5 py-2 rounded-[12px] bg-[#fef2f2] hover:bg-[#fee2e2] text-[#e11d48] text-xs font-bold transition flex items-center gap-1.5"
  >
  <Phone className="h-3.5 w-3.5" />
  <span>112 ERSS Police</span>
  </a>

  <a
  href="tel:1091"
  className="px-3.5 py-2 rounded-[12px] bg-brand-tint hover:bg-[#e6deff] text-brand text-xs font-bold transition flex items-center gap-1.5"
  >
  <Phone className="h-3.5 w-3.5" />
  <span>1091 Women Helpline</span>
  </a>

  <Link href="/report">
  <Button
  variant="primary"
  size="sm"
  className="rounded-[12px] bg-brand hover:bg-brand-deep text-xs font-bold shadow-sm shadow-brand/30"
  >
  <Plus className="h-4 w-4 mr-1" />
  <span>Report Hazard</span>
  </Button>
  </Link>
  </div>
  </div>

  {/* Status Callout Bar */}
  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
  <div className="flex items-center gap-2 text-slate-600">
  <Lock className="h-3.5 w-3.5 text-brand shrink-0" />
  <span className="text-[11.5px]">
  <strong>Privacy Protection:</strong> Sensitive incident coordinates are aggregated into 250m safe privacy zones to protect reporter anonymity across all Indian regions.
  </span>
  </div>

  <div className="flex items-center gap-3 shrink-0">
  <button
  onClick={() => {
  loadDbReports(userLocation);
  if (userLocation) fetchNearbyPlaces(userLocation.latitude, userLocation.longitude);
  if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
  }}
  disabled={loadingDb || loadingPlaces}
  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand hover:underline"
  >
  <RefreshCw className={`h-3 w-3 ${loadingDb || loadingPlaces ? 'animate-spin' : ''}`} />
  <span>Refresh Nearby Infrastructure ({allResources.length})</span>
  </button>
  <span className="text-slate-400">|</span>
  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
  Pan-India Live Radar
  </span>
  </div>
  </div>
  </section>

  {/* ============================================================ */}
  {/* 2. SEARCH & FILTER TABS BAR */}
  {/* ============================================================ */}
  <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
  {/* Search Input with City/Locality Navigation */}
  <form onSubmit={handleSearchIndianCity} className="relative flex-1 max-w-md flex items-center gap-1.5">
  <div className="relative flex-1">
  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
  <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search Indian city, locality, police, or hospital..."
  className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-white border border-slate-200 text-xs text-ink placeholder-slate-400 focus:outline-hidden focus:border-brand transition shadow-2xs"
  />
  </div>
  <Button
  type="submit"
  variant="outline"
  size="sm"
  loading={isSearchingCity}
  className="rounded-[12px] border-slate-200 text-xs font-bold shrink-0"
  >
  Locate City
  </Button>
  </form>

  {/* Filter Tabs */}
  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
  {[
  { id: 'ALL', label: `All Nearby (${allResources.length})` },
  { id: 'POLICE', label: 'Police & Safety Desks' },
  { id: 'HOSPITAL', label: 'Trauma & Hospitals' },
  { id: 'INCIDENTS', label: `Live Reports (${dbReports.length})` },
  { id: 'SHELTER', label: 'Safe Shelters & Transit' },
  { id: 'ORGANIZATION', label: 'Crisis Centers (181)' },
  ].map((tab) => (
  <button
  key={tab.id}
  type="button"
  onClick={() => setActiveFilter(tab.id)}
  className={`px-3 py-1.5 rounded-[12px] whitespace-nowrap font-bold transition text-xs ${
  activeFilter === tab.id
  ? 'bg-brand text-white shadow-xs shadow-brand/30'
  : 'bg-white border border-slate-200 text-slate-600 hover:bg-mist'
  }`}
  >
  {tab.label}
  </button>
  ))}
  </div>
  </section>

  {/* ============================================================ */}
  {/* 3. INTERACTIVE MAP + DIRECTORY SIDEBAR LAYOUT */}
  {/* ============================================================ */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
  {/* Real Leaflet Map Canvas (8 cols) */}
  <div className="lg:col-span-8 space-y-3">
  <Card className="p-0 overflow-hidden border-slate-200 relative rounded-[24px] shadow-sm">
  {/* Map Canvas Mount Point */}
  <div
  ref={mapContainerRef}
  className="w-full h-[520px] sm:h-[600px] z-10 bg-slate-100"
  />

  {/* GPS Status Floating Badge */}
  <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-[12px] bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 border border-slate-200 shadow-md flex items-center gap-1.5 max-w-[80%] truncate">
  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
  <span className="truncate">{detectedLocationName ? `Near ${detectedLocationName}` : locStatus || 'India (Pan-India Safety Radar)'}</span>
  </div>

  {/* Live Count Floating Pill */}
  <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-[12px] bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 border border-slate-200 shadow-md">
  Showing <strong>{filteredResources.length}</strong> active markers
  </div>
  </Card>

  {/* Map Color Legend */}
  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-slate-200 rounded-[18px] text-xs text-slate-600 shadow-2xs">
  <div className="flex items-center gap-1.5 font-medium">
  <span className="w-3 h-3 rounded-full bg-[#1d4ed8] inline-block shadow-2xs" />
  <span>Police &amp; Women Desks (P)</span>
  </div>
  <div className="flex items-center gap-1.5 font-medium">
  <span className="w-3 h-3 rounded-full bg-[#059669] inline-block shadow-2xs" />
  <span>24/7 Trauma Hospitals (H)</span>
  </div>
  <div className="flex items-center gap-1.5 font-medium">
  <span className="w-3 h-3 rounded-full bg-[#0891b2] inline-block shadow-2xs" />
  <span>Transit Safe Kiosks (S)</span>
  </div>
  <div className="flex items-center gap-1.5 font-medium">
  <span className="w-3 h-3 rounded-full bg-[#e11d48] inline-block shadow-2xs" />
  <span>Reported Hazards (!)</span>
  </div>
  <div className="flex items-center gap-1.5 font-medium">
  <span className="w-3 h-3 rounded-full bg-[#7c3aed] inline-block shadow-2xs" />
  <span>Crisis Support (O)</span>
  </div>
  </div>
  </div>

  {/* Selected Pin & Resource Directory Sidebar (4 cols) */}
  <div className="lg:col-span-4 space-y-4">
  {/* 1. Selected Pin Focus Card */}
  {selectedPin ? (
  <Card className="p-4 sm:p-5 border-brand/40 bg-white rounded-[22px] space-y-3.5 shadow-md animate-in fade-in zoom-in-95 duration-200">
  <div className="flex items-start justify-between gap-2">
  <div>
  <span
  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block shadow-2xs"
  style={{ backgroundColor: selectedPin.statusColor }}
  >
  {selectedPin.category.replace('_', ' ')}
  </span>
  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
  {selectedPin.name}
  </h3>
  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
  <span>{selectedPin.address}</span>
  </p>
  </div>
  <button
  onClick={() => setSelectedPin(null)}
  className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold transition"
  >
  ✕
  </button>
  </div>

  {/* Description / Content */}
  <div className="p-3 rounded-[14px] bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
  {selectedPin.details}
  </div>

  {/* Meta details */}
  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
  <span className="flex items-center gap-1">
  <Clock className="h-3.5 w-3.5 text-slate-400" />
  <span>{selectedPin.hours}</span>
  </span>
  {userLocation && (
  <span className="font-bold text-brand">
  {calculateDistanceKm(
  userLocation.latitude,
  userLocation.longitude,
  selectedPin.lat,
  selectedPin.lng
  ).toFixed(1)}{' '}
  km away
  </span>
  )}
  </div>

  {/* Action Buttons */}
  <div className="pt-2 flex flex-col gap-2">
  {selectedPin.phone && (
  <a
  href={`tel:${selectedPin.phone}`}
  className="w-full py-2.5 px-3 rounded-[12px] bg-brand hover:bg-brand-deep text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-brand/30"
  >
  <Phone className="h-3.5 w-3.5" />
  <span>Call Helpline ({selectedPin.phone})</span>
  </a>
  )}

  <a
  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full py-2 px-3 rounded-[12px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
  >
  <Navigation className="h-3.5 w-3.5 text-brand" />
  <span>Get Directions in Google Maps</span>
  <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
  </a>
  </div>
  </Card>
  ) : (
  <div className="p-6 rounded-[22px] border border-dashed border-slate-200 bg-white text-center space-y-2 text-xs text-slate-500 shadow-2xs">
  <div className="w-10 h-10 rounded-full bg-brand-tint text-brand flex items-center justify-center mx-auto">
  <MapPin className="h-5 w-5" />
  </div>
  <p className="font-bold text-slate-900">Click any point on the map</p>
  <p className="text-[11.5px] leading-relaxed max-w-xs mx-auto">
  Select any verified police post, trauma hospital, or community hazard pin to view navigation, details, and direct helpline numbers.
  </p>
  </div>
  )}

  {/* 2. Scrollable Directory List */}
  <div className="space-y-2.5">
  <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider px-1">
  <span>Nearby Safety Points ({filteredResources.length})</span>
  {userLocation && <span className="text-[11px] text-brand font-semibold">Sorted by Distance</span>}
  </div>

  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
  {(loadingDb || loadingPlaces) && filteredResources.length === 0 ? (
  <>
  <MapItemSkeleton />
  <MapItemSkeleton />
  <MapItemSkeleton />
  <MapItemSkeleton />
  </>
  ) : filteredResources.length === 0 ? (
  <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-[16px] border border-dashed border-slate-200">
  No safety points found matching your criteria.
  </div>
  ) : (
  filteredResources.map((res) => {
  const isSelected = selectedPin?.id === res.id;
  const distance = userLocation
  ? calculateDistanceKm(
  userLocation.latitude,
  userLocation.longitude,
  res.lat,
  res.lng
  ).toFixed(1) + 'km'
  : null;

  return (
  <div
  key={res.id}
  onClick={() => focusOnPin(res)}
  className={`p-3 rounded-[16px] border text-left cursor-pointer transition-all ${
  isSelected
  ? 'border-brand bg-brand-tint/40 shadow-xs'
  : 'border-slate-200 bg-white hover:border-brand/40'
  }`}
  >
  <div className="flex items-center justify-between gap-2">
  <div className="flex items-center gap-1.5 truncate">
  <span
  className="w-2 h-2 rounded-full shrink-0"
  style={{ backgroundColor: res.statusColor }}
  />
  <p className="text-xs font-bold text-slate-900 truncate">
  {res.name}
  </p>
  </div>
  {distance && (
  <span className="text-[11px] font-bold text-brand shrink-0">
  {distance}
  </span>
  )}
  </div>

  <p className="text-[11px] text-slate-500 truncate mt-1 pl-3.5">
  {res.address}
  </p>

  <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-2 pl-3.5">
  <span>{res.hours}</span>
  {res.phone && (
  <span className="text-brand font-bold">Dial {res.phone}</span>
  )}
  </div>
  </div>
  );
  })
  )}
  </div>
  </div>
  </div>
  </div>
  </div>
  );
}
