import { statusFromWeather } from '../utils/weatherStatus';

describe('statusFromWeather extended conditions', () => {
  it('fire type gains advantage when hot (>= 30°C) and no rain', () => {
    const result = statusFromWeather('fire', { weather_code: 0, precipitation: 0, temperature_2m: 30 });
    expect(result).toMatch(/avantage pour le type feu/i);
  });

  it('water type suffers when hot and no rain', () => {
    const result = statusFromWeather('water', { weather_code: 0, precipitation: 0, temperature_2m: 32 });
    expect(result).toMatch(/souffrir/i);
  });

  it('grass type benefits from sunshine (warm) when 25-30°C', () => {
    const result = statusFromWeather('grass', { weather_code: 0, precipitation: 0, temperature_2m: 26 });
    expect(result).toMatch(/temp[s]? chaud/i);
  });

  it('ice type is disadvantaged when hot (>=30°C)', () => {
    const result = statusFromWeather('ice', { weather_code: 0, precipitation: 0, temperature_2m: 30 });
    expect(result).toMatch(/désavantage/i);
  });

  it('ice type is advantaged when very cold (<0°C)', () => {
    const result = statusFromWeather('ice', { weather_code: 0, precipitation: 0, temperature_2m: -5 });
    expect(result).toMatch(/avantage pour le type glace/i);
  });

  it('default type returns neutral when warm but no special rules', () => {
    const result = statusFromWeather('rock', { weather_code: 0, precipitation: 0, temperature_2m: 28 });
    expect(result).toMatch(/impact météo neutre/i);
  });
});
