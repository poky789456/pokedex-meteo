import { MemoryCache } from '../config/redis';
import { OpenMeteoService } from '../services/OpenMeteoService';
import { PokemonService } from '../services/PokemonService';
import { PokemonRepository } from '../repositories/PokemonRepository';

jest.mock('../repositories/PokemonRepository');

describe('PokemonService', () => {
  const RepoMock = PokemonRepository as unknown as jest.Mock;
  let repoInst: any;
  let svc: PokemonService;

  beforeEach(() => {
    repoInst = {
      findByUid: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      updateByUid: jest.fn(),
      deleteByUid: jest.fn()
    };
    RepoMock.mockImplementation(() => repoInst);
    const weather = new OpenMeteoService(new MemoryCache());
    jest.spyOn(weather, 'geocodeCity').mockResolvedValue({ name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' });
    jest.spyOn(weather, 'getCurrentWeather').mockResolvedValue({ weather_code: 61, precipitation: 2, temperature_2m: 14.2, time: 'now' });
    svc = new PokemonService(undefined as any, weather);
  });

  it('statusByCity builds a status payload', async () => {
    repoInst.findByUid.mockResolvedValue({ uid: 'pk-1', name: 'Salamèche', type: 'fire' });
    const res = await svc.statusByCity('pk-1', 'Paris', 'FR');
    expect(res.uid).toBe('pk-1');
    expect(res.city).toBe('Paris');
    expect(res.status).toMatch(/désavantage|avantage|normal/i);
  });

  it('statusByCity throws if pokemon missing', async () => {
    repoInst.findByUid.mockResolvedValue(null);
    await expect(svc.statusByCity('nope', 'Paris')).rejects.toThrow(/not found/i);
  });
});
