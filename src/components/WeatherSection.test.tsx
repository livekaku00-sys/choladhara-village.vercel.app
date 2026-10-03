// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { WeatherSection } from './WeatherSection';

interface Options {
  isDay?: number;
  code?: number;
  uvNow?: number;
  uvMax?: number;
  temp?: number;
  rainProb?: number;
  rainMm?: number;
}

// Minimal Open-Meteo response with 3 identical forecast days
const makeResponse = ({ isDay = 1, code = 0, uvNow = 3, uvMax = 8, temp = 25, rainProb = 10, rainMm = 0 }: Options) => {
  const days = ['2026-10-03', '2026-10-04', '2026-10-05'];
  const hours = Array.from({ length: 24 }, (_, h) => `2026-10-03T${String(h).padStart(2, '0')}:00`);
  return {
    current: {
      time: '2026-10-03T22:00',
      temperature_2m: temp,
      relative_humidity_2m: 60,
      apparent_temperature: temp,
      is_day: isDay,
      precipitation: 0,
      weather_code: code,
      wind_speed_10m: 5,
      uv_index: uvNow,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map(() => temp),
      weather_code: hours.map(() => code),
      precipitation_probability: hours.map(() => rainProb),
      is_day: hours.map(() => isDay),
    },
    daily: {
      time: days,
      weather_code: days.map(() => code),
      temperature_2m_max: days.map(() => temp + 3),
      temperature_2m_min: days.map(() => temp - 3),
      precipitation_probability_max: days.map(() => rainProb),
      precipitation_sum: days.map(() => rainMm),
      sunrise: days.map(d => `${d}T05:20`),
      sunset: days.map(d => `${d}T17:05`),
      uv_index_max: days.map(() => uvMax),
    },
  };
};

const renderWith = async (opts: Options) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => makeResponse(opts) }));
  render(
    <LanguageProvider>
      <WeatherSection />
    </LanguageProvider>
  );
  await screen.findByText(/Synced:/);
};

describe('WeatherSection', () => {
  beforeEach(() => localStorage.setItem('portal_language', 'en'));
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('shows UV 0 and no heat advice at night', async () => {
    await renderWith({ isDay: 0, code: 0, uvNow: 0, uvMax: 8, temp: 24 });
    expect(screen.getByText('UV 0')).toBeTruthy();
    expect(screen.queryByText(/Heat & Sun Safety/)).toBeNull();
    expect(screen.getAllByText('Clear Night Sky').length).toBeGreaterThan(0);
  });

  it('labels partly cloudy nights as night', async () => {
    await renderWith({ isDay: 0, code: 2, uvNow: 0 });
    expect(screen.getAllByText('Partly Cloudy Night').length).toBeGreaterThan(0);
    expect(screen.queryByText('Golden Sunshine & Clouds')).toBeNull();
  });

  it('does not raise a flood alert for a high chance of light rain', async () => {
    await renderWith({ code: 61, rainProb: 90, rainMm: 2 });
    expect(screen.queryByText(/Heavy Rain & Waterlogging Risk/)).toBeNull();
    expect(screen.getAllByText(/Postpone open-yard grain sun-drying/).length).toBe(1);
    expect(screen.getAllByText('Light Rain').length).toBeGreaterThan(0);
  });

  it('raises a flood alert when heavy rainfall is expected', async () => {
    await renderWith({ code: 65, rainProb: 80, rainMm: 50 });
    expect(screen.getByText(/Heavy Rain & Waterlogging Risk/)).toBeTruthy();
    expect(screen.getByText(/estimated 50mm rainfall/)).toBeTruthy();
  });

  it('names forecast days from the local calendar date', async () => {
    await renderWith({});
    // 2026-10-04 is a Sunday, 2026-10-05 a Monday
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
  });
});
