import { PokemonRepository } from '../repositories/PokemonRepository';
import { OpenMeteoService } from './OpenMeteoService';
import { statusFromWeather } from '../utils/weatherStatus';

export class PokemonService {
  constructor(
    private repo = new PokemonRepository(),
    private weather: OpenMeteoService
  ) {}

  list() { return this.repo.findAll(); }
  get(uid: string) { return this.repo.findByUid(uid); }
  create(payload: any) { const p = this.repo.create(payload); return this.repo.save(p as any); }
  update(uid: string, patch: any) { return this.repo.updateByUid(uid, patch); }
  remove(uid: string) { return this.repo.deleteByUid(uid); }

  async statusByCity(uid: string, city: string, country?: string) {
    const pokemon = await this.repo.findByUid(uid);
    if (!pokemon) throw new Error('Pokemon not found');

    const geo = await this.weather.geocodeCity(city, country);
    if (!geo) throw new Error('City not found');

    const wx = await this.weather.getCurrentWeather(geo.latitude, geo.longitude, 'auto');
    console.log('Weather data:', JSON.stringify(wx, null, 2));
  console.log('Pokemon type:', pokemon.type);

    const statusDescription = statusFromWeather(pokemon.type, {
      weather_code: wx.weather_code,
      precipitation: wx.precipitation,
      temperature_2m: wx.temperature_2m
    });

    return {
      uid: pokemon.uid,
      name: pokemon.name,
      type: pokemon.type,
      city: geo.name,
      country: geo.country,
      weather: wx,
      status: statusDescription
    };
  }
}
