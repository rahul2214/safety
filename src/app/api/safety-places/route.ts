import { NextRequest, NextResponse } from 'next/server';

export interface SafetyPlaceItem {
  id: string;
  name: string;
  category: 'POLICE' | 'HOSPITAL' | 'SHELTER' | 'ORGANIZATION';
  address: string;
  phone?: string;
  hours: string;
  lat: number;
  lng: number;
  details: string;
  statusColor: string;
  iconLabel: string;
}

// In-memory cache with 1-hour TTL
interface CacheEntry {
  data: {
    locationName: string;
    city: string;
    state: string;
    places: SafetyPlaceItem[];
  };
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Curated pan-India verified emergency infrastructure fallback across major states & metros
const NATIONWIDE_HUBS: SafetyPlaceItem[] = [
  // National Cells
  {
    id: 'nat-erss-112',
    name: 'National Emergency Response Centre (ERSS 112)',
    category: 'POLICE',
    address: 'Pan-India Emergency Response Support System, Ministry of Home Affairs',
    phone: '112',
    hours: '24/7 Nationwide Rapid Response',
    lat: 28.6139,
    lng: 77.2090,
    details: 'Nationwide single emergency number across all Indian states and Union Territories for Police, Fire, and Ambulance.',
    statusColor: '#1d4ed8',
    iconLabel: '112',
  },
  {
    id: 'nat-women-helpline-1091',
    name: 'National Women In Distress Helpline (1091)',
    category: 'POLICE',
    address: 'National Women Safety Cell, Active Across All Indian States',
    phone: '1091',
    hours: '24/7 Dedicated Women Desk',
    lat: 28.6129,
    lng: 77.2295,
    details: 'Toll-free emergency helpline dedicated to women experiencing distress, harassment, or safety threats across India.',
    statusColor: '#1d4ed8',
    iconLabel: 'W',
  },
  {
    id: 'nat-sakhi-181',
    name: 'National Sakhi One-Stop Crisis Center (181)',
    category: 'ORGANIZATION',
    address: 'Ministry of Women and Child Development One Stop Centers, Pan-India',
    phone: '181',
    hours: '24/7 Emergency Support',
    lat: 28.6145,
    lng: 77.2105,
    details: 'Integrated medical, legal, and temporary shelter support for women affected by violence across all districts of India.',
    statusColor: '#7c3aed',
    iconLabel: 'O',
  },

  // Delhi NCR
  {
    id: 'del-police-cp',
    name: 'Connaught Place Police Station & Women Desk',
    category: 'POLICE',
    address: 'Parliament Street, Connaught Place, New Delhi',
    phone: '112',
    hours: 'Open 24/7',
    lat: 28.6295,
    lng: 77.2185,
    details: 'Delhi Police round-the-clock emergency station with dedicated female duty officers and rapid response vehicle.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'del-aiims-trauma',
    name: 'AIIMS Jai Prakash Narayan Apex Trauma Center',
    category: 'HOSPITAL',
    address: 'Raj Nagar, Safdarjung Enclave, New Delhi',
    phone: '108',
    hours: 'Open 24/7',
    lat: 28.5672,
    lng: 77.2100,
    details: 'Premier national level-1 24/7 trauma care and emergency medical center.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Mumbai / Maharashtra
  {
    id: 'mum-police-bandra',
    name: 'Bandra Police Station & Women Assistance Cell',
    category: 'POLICE',
    address: 'Hill Road, Bandra West, Mumbai, Maharashtra',
    phone: '112',
    hours: 'Open 24/7',
    lat: 19.0544,
    lng: 72.8322,
    details: 'Mumbai Police women safety desk and continuous patrol dispatch.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'mum-kem-hospital',
    name: 'KEM Hospital Emergency & Trauma Center',
    category: 'HOSPITAL',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra',
    phone: '108',
    hours: 'Open 24/7',
    lat: 19.0028,
    lng: 72.8427,
    details: 'Major round-the-clock government emergency trauma center and critical care unit.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Bengaluru / Karnataka
  {
    id: 'blr-police-cubbon',
    name: 'Cubbon Park Police Station & Women Safety Wing',
    category: 'POLICE',
    address: 'Kasturba Road, Bengaluru, Karnataka',
    phone: '112',
    hours: 'Open 24/7',
    lat: 12.9734,
    lng: 77.5936,
    details: 'Bengaluru City Police rapid response station with dedicated women safety staff.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'blr-victoria-hospital',
    name: 'Victoria Hospital Emergency Trauma Complex',
    category: 'HOSPITAL',
    address: 'Fort Road, Near City Market, Bengaluru, Karnataka',
    phone: '108',
    hours: 'Open 24/7',
    lat: 12.9625,
    lng: 77.5750,
    details: '24/7 emergency medical trauma care with forensic and crisis support.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Hyderabad / Telangana
  {
    id: 'hyd-she-teams',
    name: 'SHE Teams Headquarters & Rapid Cell',
    category: 'POLICE',
    address: 'Lakdikapul, Police Control Room Complex, Hyderabad, Telangana',
    phone: '1091',
    hours: '24/7 Rapid Response',
    lat: 17.4062,
    lng: 78.4682,
    details: 'Specialized Telangana Police unit dedicated to women safety with plainclothes patrols and rapid distress dispatch.',
    statusColor: '#1d4ed8',
    iconLabel: 'SHE',
  },
  {
    id: 'hyd-osmania-hospital',
    name: 'Osmania General Emergency & Trauma Center',
    category: 'HOSPITAL',
    address: 'Afzal Gunj, Koti, Hyderabad, Telangana',
    phone: '108',
    hours: 'Open 24/7',
    lat: 17.3784,
    lng: 78.4744,
    details: 'Level-1 24/7 government trauma care center with emergency surgical and counseling facilities.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Chennai / Tamil Nadu
  {
    id: 'chn-police-annasalai',
    name: 'Anna Salai All Women Police Station',
    category: 'POLICE',
    address: 'Mount Road, Anna Salai, Chennai, Tamil Nadu',
    phone: '112',
    hours: 'Open 24/7',
    lat: 13.0604,
    lng: 80.2642,
    details: 'Dedicated all-women police station providing 24/7 grievance redressal and immediate dispatch.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'chn-gh-trauma',
    name: 'Rajiv Gandhi Government General Hospital Trauma Ward',
    category: 'HOSPITAL',
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu',
    phone: '108',
    hours: 'Open 24/7',
    lat: 13.0827,
    lng: 80.2785,
    details: '24/7 emergency intensive care and government medical support.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Kolkata / West Bengal
  {
    id: 'kol-police-lalbazar',
    name: 'Kolkata Police Headquarters & Women Grievance Cell',
    category: 'POLICE',
    address: 'Lalbazar, BBD Bagh, Kolkata, West Bengal',
    phone: '112',
    hours: 'Open 24/7',
    lat: 22.5732,
    lng: 88.3533,
    details: 'Kolkata Police central command and specialized women distress cell.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'kol-sskm-hospital',
    name: 'SSKM Medical College & Trauma Care Center',
    category: 'HOSPITAL',
    address: 'Harish Mukherjee Road, Bhowanipore, Kolkata, West Bengal',
    phone: '108',
    hours: 'Open 24/7',
    lat: 22.5392,
    lng: 88.3431,
    details: 'Level-1 round-the-clock emergency trauma and critical care unit.',
    statusColor: '#059669',
    iconLabel: 'H',
  },

  // Pune / Maharashtra
  {
    id: 'pune-police-shivajinagar',
    name: 'Shivajinagar Police Station & Women Help Desk',
    category: 'POLICE',
    address: 'FC Road, Shivajinagar, Pune, Maharashtra',
    phone: '112',
    hours: 'Open 24/7',
    lat: 18.5308,
    lng: 73.8475,
    details: 'Pune City Police emergency post with dedicated female staff.',
    statusColor: '#2563eb',
    iconLabel: 'P',
  },
  {
    id: 'pune-sassoon-hospital',
    name: 'Sassoon General Hospital Emergency Wing',
    category: 'HOSPITAL',
    address: 'Near Pune Railway Station, Pune, Maharashtra',
    phone: '108',
    hours: 'Open 24/7',
    lat: 18.5284,
    lng: 73.8742,
    details: 'Government round-the-clock intensive trauma and crisis care.',
    statusColor: '#059669',
    iconLabel: 'H',
  },
];

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const q = searchParams.get('q');

  const lat = latStr ? parseFloat(latStr) : null;
  const lng = lngStr ? parseFloat(lngStr) : null;

  // Cache key based on rounded coordinates (~1km grid) or search query
  const cacheKey = lat && lng ? `${lat.toFixed(2)},${lng.toFixed(2)}` : q ? `q:${q.toLowerCase()}` : 'default';

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Safety-Cache': 'HIT',
      },
    });
  }

  let locationName = 'India';
  let city = '';
  let state = '';
  const discoveredPlaces: SafetyPlaceItem[] = [];

  const headers = {
    'User-Agent': 'SabhijudeApp/2.0 (Women Safety Platform India; contact: admin@veltria.in)',
    'Accept-Language': 'en-IN,en;q=0.9',
  };

  // 1. Reverse Geocode if coordinates are provided
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    try {
      const revUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
      const revRes = await fetch(revUrl, { headers, next: { revalidate: 3600 } });
      if (revRes.ok) {
        const revData = await revRes.json();
        const addr = revData.address || {};
        const locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.city_district ||
          addr.village ||
          addr.town ||
          '';
        city = addr.city || addr.town || addr.county || '';
        state = addr.state || '';
        const parts = [locality, city, state].filter(Boolean);
        if (parts.length > 0) {
          locationName = parts.join(', ');
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding failed, falling back:', e);
    }

    // 2. Query Nominatim for real nearby Police Stations and Hospitals
    // Bounding box: ~0.08 degrees around user (~8-9km radius)
    const delta = 0.08;
    const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;

    try {
      const [policeRes, hospitalRes] = await Promise.all([
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&amenity=police&viewbox=${viewbox}&bounded=1&limit=6&addressdetails=1`,
          { headers, next: { revalidate: 3600 } }
        ),
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&amenity=hospital&viewbox=${viewbox}&bounded=1&limit=6&addressdetails=1`,
          { headers, next: { revalidate: 3600 } }
        ),
      ]);

      if (policeRes.ok) {
        const policeData: any[] = await policeRes.json();
        policeData.forEach((item, idx) => {
          const itemLat = parseFloat(item.lat);
          const itemLng = parseFloat(item.lon);
          discoveredPlaces.push({
            id: `osm-police-${item.place_id || idx}`,
            name: item.name || 'Police Station & Safety Desk',
            category: 'POLICE',
            address: item.display_name,
            phone: '112',
            hours: 'Open 24/7',
            lat: itemLat,
            lng: itemLng,
            details: 'Local police station with 24/7 emergency response coverage and women safety assistance.',
            statusColor: '#2563eb',
            iconLabel: 'P',
          });
        });
      }

      if (hospitalRes.ok) {
        const hospitalData: any[] = await hospitalRes.json();
        hospitalData.forEach((item, idx) => {
          const itemLat = parseFloat(item.lat);
          const itemLng = parseFloat(item.lon);
          discoveredPlaces.push({
            id: `osm-hosp-${item.place_id || idx}`,
            name: item.name || 'Emergency Hospital & Trauma Care',
            category: 'HOSPITAL',
            address: item.display_name,
            phone: '108',
            hours: 'Open 24/7',
            lat: itemLat,
            lng: itemLng,
            details: 'Round-the-clock emergency medical facility, critical care triage, and crisis support.',
            statusColor: '#059669',
            iconLabel: 'H',
          });
        });
      }
    } catch (e) {
      console.warn('Nominatim safety places lookup failed:', e);
    }
  }

  // 3. Fallback / Augment with curated hubs sorted by proximity
  let finalPlaces = discoveredPlaces;

  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    // Sort curated hubs by distance from user and include the nearest ones if few discovered
    const sortedNationwide = [...NATIONWIDE_HUBS].sort((a, b) => {
      const distA = calculateDistanceKm(lat, lng, a.lat, a.lng);
      const distB = calculateDistanceKm(lat, lng, b.lat, b.lng);
      return distA - distB;
    });

    if (finalPlaces.length < 5) {
      finalPlaces = [...finalPlaces, ...sortedNationwide.slice(0, 8)];
    } else {
      // Always include top emergency national numbers
      finalPlaces = [
        ...finalPlaces,
        NATIONWIDE_HUBS[0], // ERSS 112
        NATIONWIDE_HUBS[1], // 1091 Women
        NATIONWIDE_HUBS[2], // 181 Sakhi
      ];
    }
  } else {
    finalPlaces = NATIONWIDE_HUBS;
  }

  const resultData = {
    locationName: locationName || 'India (Pan-India Safety Radar)',
    city: city || 'Local Area',
    state: state || 'India',
    places: finalPlaces,
  };

  cache.set(cacheKey, { data: resultData, timestamp: Date.now() });

  return NextResponse.json(resultData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Safety-Cache': 'MISS',
    },
  });
}
