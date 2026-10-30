/**
 * Geolocation and emergency messaging service.
 */

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsUrl: string;
  timestamp: string;
}

export interface GeocodedAddress {
  displayName: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export async function getCurrentCoordinates(): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({
          latitude,
          longitude,
          accuracy,
          mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          timestamp: new Date().toISOString(),
        });
      },
      (err) => {
        // Fallback default coordinates or friendly message
        reject(new Error(err.message || 'Unable to retrieve location.'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Reverse geocode coordinates to an address anywhere in India using OpenStreetMap Nominatim
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeocodedAddress | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SabhijudeApp/2.0 (Women Safety Platform India; contact: admin@veltria.in)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    return {
      displayName: data.display_name || '',
      suburb: addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.village || addr.town || '',
      city: addr.city || addr.town || addr.county || '',
      state: addr.state || '',
      postcode: addr.postcode || '',
      country: addr.country || 'India',
    };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return null;
  }
}

/**
 * Extract coordinates from a location string formatted like "Lat: 17.4486, Lon: 78.3908"
 */
export function extractCoordsFromLocationString(text?: string): { lat: number; lng: number } | null {
  if (!text) return null;
  const match = text.match(/lat:\s*([0-9.-]+).*?lon(?:g)?:\s*([0-9.-]+)/i);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98) {
      return { lat, lng };
    }
  }
  return null;
}

/**
 * Forward geocode an Indian locality/city name via Nominatim
 */
export async function searchIndianLocation(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (!query || !query.trim()) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&countrycodes=in&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SabhijudeApp/2.0 (Women Safety Platform India; contact: admin@veltria.in)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      return {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
        displayName: first.display_name,
      };
    }
    return null;
  } catch (err) {
    console.warn('Geocoding search error:', err);
    return null;
  }
}

export function buildEmergencySosText(loc?: GeoLocationResult): string {
  const timestamp = new Date().toLocaleTimeString();
  let text = `🚨 *EMERGENCY SOS ALERT — SABHIJUDE* 🚨\n`;
  text += `I feel unsafe and need immediate help right now! Time: ${timestamp}\n\n`;

  if (loc) {
    text += `📍 *Live Location:* ${loc.mapsUrl}\n`;
    text += `Coordinates: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)} (±${Math.round(loc.accuracy)}m)\n\n`;
  } else {
    text += `📍 Location could not be determined automatically.\n\n`;
  }

  text += `Please call me immediately or dispatch local police (112 / 1091).`;
  return text;
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export function buildSmsLink(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `sms:${cleanNumber}?body=${encoded}`;
}
