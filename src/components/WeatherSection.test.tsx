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
  minTemp?: number;
  // Per-day overrides for [today, tomorrow, day after]
  dailyRainProb?: number[];
  dailyRainMm?: number[];
  // Hourly rain chance by hour of day (default: rainProb)
  hourlyRain?: (hour: number) => number;
}

// Minimal Open-Meteo response with 3 identical forecast days
const makeResponse = ({
  isDay = 1, code = 0, uvNow = 3, uvMax = 8, temp = 25, rainProb = 10, rainMm = 0,
  minTemp, dailyRainProb, dailyRainMm, hourlyRain,
}: Options) => {
  const days = ['2026-10-03', '2026-10-04', '2026-10-05'];
  const hours = Array.from({ length: 48 }, (_, i) =>
    `2026-10-0${3 + Math.floor(i / 24)}T${String(i % 24).padStart(2, '0')}:00`
  );
  return {
    current: {
      time: '2026-10-03T10:00',
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
      precipitation_probability: hours.map((_, i) => (hourlyRain ? hourlyRain(i % 24) : rainProb)),
      is_day: hours.map(() => isDay),
    },
    daily: {
      time: days,
      weather_code: days.map(() => code),
      temperature_2m_max: days.map(() => temp + 3),
      temperature_2m_min: days.map(() => minTemp ?? temp - 3),
      precipitation_probability_max: days.map((_, i) => dailyRainProb?.[i] ?? rainProb),
      precipitation_sum: days.map((_, i) => dailyRainMm?.[i] ?? rainMm),
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
  await screen.findByText(/Synced:|আপডেট:/);
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
    expect(screen.getByText(/Light Rain Expected/)).toBeTruthy();
    expect(screen.getAllByText('Light Rain').length).toBeGreaterThan(0);
  });

  it('raises a flood alert when heavy rainfall is expected', async () => {
    await renderWith({ code: 65, rainProb: 80, rainMm: 50 });
    expect(screen.getByText(/Heavy Rain & Waterlogging Risk/)).toBeTruthy();
    expect(screen.getByText(/About 50mm of rain expected today/)).toBeTruthy();
  });

  it('says "tomorrow" and when the rain should start', async () => {
    await renderWith({
      dailyRainProb: [10, 94, 20],
      dailyRainMm: [0, 3.6, 0],
      hourlyRain: h => (h >= 15 ? 80 : 5),
    });
    expect(screen.getByText(/Tomorrow: 94% chance of light rain \(~3.6mm\)/)).toBeTruthy();
    expect(screen.getByText(/Rain likely from around 3 pm/i)).toBeTruthy();
  });

  it('grades moderate rain between light and heavy', async () => {
    await renderWith({ code: 63, rainProb: 85, rainMm: 20 });
    expect(screen.getByText(/Moderate Rain Expected/)).toBeTruthy();
    expect(screen.queryByText(/Heavy Rain & Waterlogging Risk/)).toBeNull();
  });

  it('warns about cold nights', async () => {
    await renderWith({ temp: 16, minTemp: 8 });
    expect(screen.getByText(/Cold Night Alert/)).toBeTruthy();
    expect(screen.getByText(/Low of 8°C expected today/)).toBeTruthy();
  });

  it('uses Assamese "কাইলৈ" and never repeats the category as the title', async () => {
    localStorage.setItem('portal_language', 'as');
    await renderWith({ dailyRainProb: [10, 94, 20], dailyRainMm: [0, 3.6, 0] });
    expect(screen.getByText(/কাইলৈ 94% পাতলীয়া বৰষুণৰ সম্ভাৱনা/)).toBeTruthy();
    const headings = Array.from(document.querySelectorAll('h4')).map(h => h.textContent ?? '');
    expect(headings).toContain('কৃষি পৰামৰ্শ — পাতলীয়া বৰষুণৰ সম্ভাৱনা');
    for (const h of headings) {
      const [category, title] = h.split(' — ');
      expect(title).not.toBe(category);
    }
  });

  it('names forecast days from the local calendar date', async () => {
    await renderWith({});
    // 2026-10-04 is a Sunday, 2026-10-05 a Monday
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
  });
});
