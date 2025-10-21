import axios from 'axios';
import { ICache } from '../config/redis';

export interface CityLookup {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  weather_code: number;
  precipitation: number;
  temperature_2m?: number;
  time?: string;
}

export class OpenMeteoService {
  constructor(private cache: ICache) {}

  private cityKey(city: string, country?: string) {
    return `city:${city.toLowerCase()}:${(country||'').toLowerCase()}`;
  }

  private weatherKey(lat: number, lon: number) {
    return `weather:${lat.toFixed(3)}:${lon.toFixed(3)}`;
  }

  async geocodeCity(city: string, country?: string, language = 'fr'): Promise<CityLookup | null> {
    const cacheKey = this.cityKey(city, country);
    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', city);
    url.searchParams.set('count', '1');
    if (country) url.searchParams.set('countryCode', country);
    url.searchParams.set('language', language);
    url.searchParams.set('format', 'json');

    const { data } = await axios.get(url.toString());
    if (!data || !data.results || !data.results.length) return null;

    const r = data.results[0];
    const result: CityLookup = {
      name: r.name,
      country: r.country_code,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone
    };

    await this.cache.set(cacheKey, JSON.stringify(result), 24 * 3600);
    return result;
  }

  async getCurrentWeather(lat: number, lon: number, timezone: string | 'auto' = 'auto'): Promise<CurrentWeather> {
    const key = this.weatherKey(lat, lon);
    const cached = await this.cache.get(key);
    if (cached) return JSON.parse(cached);

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('current', 'weather_code,precipitation,temperature_2m');
    url.searchParams.set('timezone', timezone);

    const { data } = await axios.get(url.toString());
    const c = data?.current || {};
    const result: CurrentWeather = {
      weather_code: typeof c.weather_code === 'number' ? c.weather_code : 0,
      precipitation: typeof c.precipitation === 'number' ? c.precipitation : 0,
      temperature_2m: c.temperature_2m,
      time: c.time
    };

    // Cache pour 10 minutes (600 secondes) au lieu d'utiliser le TTL par défaut
    await this.cache.set(key, JSON.stringify(result), 600);
    return result;
  }
}