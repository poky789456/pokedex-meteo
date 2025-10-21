import axios from 'axios';
import { MemoryCache } from '../config/redis';
import { OpenMeteoService } from '../services/OpenMeteoService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenMeteoService includes temperature_2m', () => {
  it('should return temperature_2m and cache it', async () => {
    const svc = new OpenMeteoService(new MemoryCache());
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        current: {
          weather_code: 0,
          precipitation: 0,
          temperature_2m: 35,
          time: '2025-10-21T12:00'
        }
      }
    });
    const w = await svc.getCurrentWeather(48.85, 2.35);
    expect(w.temperature_2m).toBe(35);

    // a second call should hit cache (no further axios)
    const w2 = await svc.getCurrentWeather(48.85, 2.35);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(w2.temperature_2m).toBe(35);
  });
});
