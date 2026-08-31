import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Sunrise, 
  Sunset, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudFog, 
  Droplets, 
  Wind, 
  Sprout, 
  RefreshCw, 
  Sparkles,
  Gauge,
  AlertTriangle,
  Clock,
  Zap,
  Waves,
  ShieldAlert,
  Thermometer,
  Bug
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DailyForecast {
  date: string;
  dayNameEn: string;
  dayNameAs: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  precipitationSum: number;
  uvIndexMax: number;
  sunriseTime: string;
  sunsetTime: string;
}

interface HourlyForecast {
  time: string;
  hourLabelEn: string;
  hourLabelAs: string;
  weatherCode: number;
  temp: number;
  rainProb: number;
  isDay: number;
}

interface CurrentWeatherState {
  temp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: number;
  uvIndex: number;
  sunriseTime: string;
  sunsetTime: string;
}

const getWeatherMeta = (code: number, isDay: number = 1) => {
  if (code === 0) {
    return isDay
      ? {
          labelEn: 'Bright Sunny Sky',
          labelAs: 'ফৰকাল উজ্জ্বল ৰ’দালী',
          subEn: 'Clear sunlight & strong visibility',
          subAs: 'পৰিষ্কাৰ উজ্জ্বল ৰ’দ আৰু উত্তম দৃশ্যমানতা',
          icon: Sun,
          color: 'text-amber-400',
          glow: 'shadow-amber-500/30 ring-amber-400/40 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
        }
      : {
          labelEn: 'Clear Night Sky',
          labelAs: 'ফৰকাল নিৰ্মল ৰাতি',
          subEn: 'Starlit sky with calm winds',
          subAs: 'শান্ত বতাহ আৰু নিৰ্মল আকাশ',
          icon: Sun,
          color: 'text-indigo-300',
          glow: 'shadow-indigo-500/20 ring-indigo-400/30 bg-gradient-to-br from-indigo-950/40 to-transparent',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
        };
  }

  switch (code) {
    case 1:
    case 2:
      return {
        labelEn: 'Golden Sunshine & Clouds',
        labelAs: 'মৃদু ৰ’দালী আৰু পাতল ডাৱৰ',
        subEn: 'Pleasant sun breaks through soft clouds',
        subAs: 'ডাৱৰৰ ফাঁকেৰে কোমল সূৰ্যৰ পোহৰ',
        icon: CloudSun,
        color: 'text-amber-400',
        glow: 'shadow-amber-500/20 ring-amber-400/30 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
      };
    case 3:
      return {
        labelEn: 'Overcast & Shaded',
        labelAs: 'ডাৱৰীয়া আৰু ছাঁযুক্ত বতৰ',
        subEn: 'Diffused indirect solar radiation',
        subAs: 'ডাঠ ডাৱৰে ঢাকি ৰখা সূৰ্যৰ ম্লান পোহৰ',
        icon: Cloud,
        color: 'text-slate-300',
        glow: 'shadow-slate-500/20 ring-slate-400/20 bg-gradient-to-br from-slate-800/40 to-transparent',
        badgeBg: 'bg-slate-700/50 text-slate-300 border-slate-600'
      };
    case 45:
    case 48:
      return {
        labelEn: 'Hazy Morning Fog',
        labelAs: 'কুঁৱলী আৰু কুঁৱলীযুক্ত ৰ’দ',
        subEn: 'Sunlight filtered through mist',
        subAs: 'কুঁৱলীৰ মাজেৰে প্ৰকাশিত মৃদু পোহৰ',
        icon: CloudFog,
        color: 'text-slate-300',
        glow: 'shadow-slate-500/20 ring-slate-400/20 bg-gradient-to-br from-slate-800/40 to-transparent',
        badgeBg: 'bg-slate-700/50 text-slate-300 border-slate-600'
      };
    case 51:
    case 53:
    case 55:
      return {
        labelEn: 'Sun & Soft Drizzle',
        labelAs: 'ৰ’দ-বৰষুণৰ ধেমালি',
        subEn: 'Scattered light showers with mild sun',
        subAs: 'মাজে মাজে পাতলীয়া বৰষুণৰ টোপাল',
        icon: CloudDrizzle,
        color: 'text-teal-300',
        glow: 'shadow-teal-500/20 ring-teal-400/20 bg-gradient-to-br from-teal-950/30 to-transparent',
        badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30'
      };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        labelEn: 'Monsoon Rain Showers',
        labelAs: 'ধাৰাসাৰ বাৰিষাৰ বৰষুণ',
        subEn: 'Heavy cloud cover, sun obscured',
        subAs: 'আকাশত ডাঠ ডাৱৰ আৰু ধাৰাসাৰ বৰষুণ',
        icon: CloudRain,
        color: 'text-blue-400',
        glow: 'shadow-blue-500/20 ring-blue-400/20 bg-gradient-to-br from-blue-950/40 to-transparent',
        badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      };
    case 95:
    case 96:
    case 99:
      return {
        labelEn: 'Thunder & Lightning Alert',
        labelAs: 'বজ্ৰপাত আৰু ধুমুহাৰ সতৰ্কতা',
        subEn: 'Violent squalls with dark stormy skies',
        subAs: 'গাঢ় কলা ডাৱৰ আৰু ধুমুহাৰ প্ৰকোপ',
        icon: CloudLightning,
        color: 'text-purple-400',
        glow: 'shadow-purple-500/20 ring-purple-400/20 bg-gradient-to-br from-purple-950/40 to-transparent',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
      };
    default:
      return {
        labelEn: 'Normal Atmospheric Day',
        labelAs: 'স্বাভাৱিক বতৰ',
        subEn: 'Standard daylight conditions',
        subAs: 'স্বাভাৱিক প্ৰাকৃতিক পৰিৱেশ',
        icon: CloudSun,
        color: 'text-emerald-300',
        glow: 'shadow-emerald-500/20 ring-emerald-400/20 bg-gradient-to-br from-emerald-950/30 to-transparent',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      };
  }
};

const formatTime12h = (isoString?: string) => {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getUvDescription = (uv: number, isAs: boolean) => {
  if (uv <= 2) return { text: isAs ? 'কোমল ৰ’দ (নিৰাপদ)' : 'Mild Sun (Safe)', color: 'text-emerald-400' };
  if (uv <= 5) return { text: isAs ? 'মধ্যমীয়া ৰ’দ (সুচল)' : 'Moderate Sun (Pleasant)', color: 'text-amber-400' };
  if (uv <= 7) return { text: isAs ? 'প্ৰখৰ ৰ’দ (ছাঁ লওক)' : 'High Sun (Seek Shade)', color: 'text-orange-400' };
  return { text: isAs ? 'অতি তীব্ৰ ৰ’দ (সতৰ্কতা)' : 'Very Strong UV (Intense)', color: 'text-red-400' };
};

interface Advisory {
  id: string;
  category: 'agriculture' | 'safety' | 'health';
  severity: 'info' | 'warning' | 'danger';
  icon: React.ElementType;
  titleEn: string;
  titleAs: string;
  textEn: string;
  textAs: string;
}

const ADVISORY_SEVERITY_STYLES: Record<Advisory['severity'], { wrap: string; iconBg: string; titleColor: string }> = {
  danger: {
    wrap: 'bg-gradient-to-r from-red-50 via-rose-50/50 to-red-50 border-red-300/80',
    iconBg: 'bg-red-500',
    titleColor: 'text-red-950'
  },
  warning: {
    wrap: 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-amber-300/80',
    iconBg: 'bg-amber-500',
    titleColor: 'text-amber-950'
  },
  info: {
    wrap: 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-300/80',
    iconBg: 'bg-emerald-500',
    titleColor: 'text-emerald-950'
  }
};

const ADVISORY_CATEGORY_LABEL: Record<Advisory['category'], { en: string; as: string }> = {
  agriculture: { en: 'Agro-Solar Advisory', as: 'কৃষি পৰামৰ্শ' },
  safety: { en: 'Safety Advisory', as: 'সুৰক্ষা পৰামৰ্শ' },
  health: { en: 'Health Advisory', as: 'স্বাস্থ্য পৰামৰ্শ' }
};

const DAY_NAMES_AS = ['দেও', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্ৰ', 'শনি'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Auto-refresh every 15 minutes so the section never goes stale on a long-open tab
const AUTO_REFRESH_MS = 15 * 60 * 1000;

export const WeatherSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [current, setCurrent] = useState<CurrentWeatherState | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Charaideo Coordinates: 26.96° N, 95.00° E
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=26.96&longitude=95.00&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata';

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Weather service returned ${res.status}`);
      }
      const data = await res.json();

      if (data.current && data.daily) {
        setCurrent({
          temp: Math.round(data.current.temperature_2m),
          apparentTemp: Math.round(data.current.apparent_temperature),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day,
          uvIndex: Math.round(data.current.uv_index || data.daily.uv_index_max[0] || 0),
          sunriseTime: formatTime12h(data.daily.sunrise?.[0]),
          sunsetTime: formatTime12h(data.daily.sunset?.[0])
        });

        const dailyItems: DailyForecast[] = data.daily.time.slice(0, 7).map((timeStr: string, idx: number) => {
          const d = new Date(timeStr);
          const dayIdx = d.getDay();
          return {
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            dayNameEn: idx === 0 ? 'Today' : DAY_NAMES_EN[dayIdx],
            dayNameAs: idx === 0 ? 'আজি' : DAY_NAMES_AS[dayIdx],
            weatherCode: data.daily.weather_code[idx],
            maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
            minTemp: Math.round(data.daily.temperature_2m_min[idx]),
            rainProb: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[idx] : 0,
            precipitationSum: data.daily.precipitation_sum ? Math.round(data.daily.precipitation_sum[idx] * 10) / 10 : 0,
            uvIndexMax: Math.round(data.daily.uv_index_max ? data.daily.uv_index_max[idx] : 5),
            sunriseTime: formatTime12h(data.daily.sunrise?.[idx]),
            sunsetTime: formatTime12h(data.daily.sunset?.[idx])
          };
        });

        setForecast(dailyItems);

        if (data.hourly && data.hourly.time) {
          // data.current.time is already in Asia/Kolkata (matches hourly.time),
          // so use it to find "now" instead of the browser's local UTC clock.
          const nowHourPrefix = (data.current.time as string).slice(0, 13);
          let startIdx = data.hourly.time.findIndex((t: string) => t.startsWith(nowHourPrefix));
          if (startIdx === -1) startIdx = 0;

          const next24: HourlyForecast[] = data.hourly.time
            .slice(startIdx, startIdx + 24)
            .map((timeStr: string, i: number) => {
              const idx = startIdx + i;
              const d = new Date(timeStr);
              return {
                time: timeStr,
                hourLabelEn: i === 0 ? 'Now' : d.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }),
                hourLabelAs: i === 0 ? 'এতিয়া' : d.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }),
                weatherCode: data.hourly.weather_code[idx],
                temp: Math.round(data.hourly.temperature_2m[idx]),
                rainProb: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[idx] : 0,
                isDay: data.hourly.is_day[idx]
              };
            });

          setHourly(next24);
        }

        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('Incomplete weather data received');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load weather data';
      console.error('Weather error:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();

    // Keep data fresh automatically for visitors who leave the tab open
    const interval = setInterval(fetchWeatherData, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const currentMeta = current ? getWeatherMeta(current.weatherCode, current.isDay) : getWeatherMeta(0, 1);
  const CurrentIcon = currentMeta.icon;
  const uvInfo = current ? getUvDescription(current.uvIndex, isAs) : { text: '--', color: 'text-amber-400' };

  const getAdvisories = (): Advisory[] => {
    if (!current || !forecast.length) return [];

    const advisories: Advisory[] = [];
    const next3Days = forecast.slice(0, 3);

    const stormyDays = next3Days.filter(d => [95, 96, 99].includes(d.weatherCode));
    const stormyNow = [95, 96, 99].includes(current.weatherCode);

    const rainyDays = next3Days.filter(d => d.rainProb > 50);
    const heavyRainDays = next3Days.filter(d => d.rainProb > 75);
    // Pick the single worst day to quote specific numbers from
    const peakRainDay = next3Days.reduce((max, d) => (d.rainProb > max.rainProb ? d : max), next3Days[0]);

    const isHot = current.uvIndex >= 7 || current.temp > 33;
    const isFoggy = [45, 48].includes(current.weatherCode);
    const isHumidRainy = current.humidity > 75 && rainyDays.length > 0;
    const isWindy = current.windSpeed > 30;

    const dayList = (days: DailyForecast[]) =>
      days.map(d => (isAs ? d.dayNameAs : d.dayNameEn)).join(', ');

    // Thunderstorm safety — highest priority, names the actual day(s) and current reading
    if (stormyNow || stormyDays.length > 0) {
      const whenEn = stormyNow
        ? 'right now'
        : `expected on ${dayList(stormyDays)}`;
      const whenAs = stormyNow
        ? 'এতিয়াই'
        : `${dayList(stormyDays)}ত সম্ভাৱনা আছে`;
      advisories.push({
        id: 'thunder',
        category: 'safety',
        severity: 'danger',
        icon: Zap,
        titleEn: 'Lightning & Thunderstorm Alert',
        titleAs: 'বজ্ৰপাত আৰু ধুমুহাৰ সতৰ্কতা',
        textEn: `Thunderstorm activity ${whenEn} (current reading: ${current.temp}°C, wind ${current.windSpeed} km/h). Avoid open fields, tall trees, and water bodies. Unplug electrical appliances and stay indoors until it passes.`,
        textAs: `ধুমুহা/বজ্ৰপাতৰ সম্ভাৱনা ${whenAs} (বৰ্তমান: ${current.temp}°সে, বতাহ ${current.windSpeed} km/h)। মুকলি পথাৰ, ওখ গছ আৰু পানীৰ কাষৰ পৰা আঁতৰি থাকক। বৈদ্যুতিক সঁজুলি বিচ্ছিন্ন কৰি ঘৰৰ ভিতৰত থাকক।`
      });
    }

    // Flood / heavy rain vs regular rain (agriculture) — quotes exact % and mm for the peak day
    if (heavyRainDays.length > 0) {
      advisories.push({
        id: 'flood',
        category: 'safety',
        severity: 'danger',
        icon: Waves,
        titleEn: 'Heavy Rain & Waterlogging Risk',
        titleAs: 'অতি বৰষুণ আৰু পানী জমাৰ আশংকা',
        textEn: `${peakRainDay.dayNameEn} shows a ${peakRainDay.rainProb}% chance of rain with an estimated ${peakRainDay.precipitationSum}mm rainfall. Low-lying areas may flood — keep documents safe, avoid crossing flooded roads, and monitor local water levels.`,
        textAs: `${peakRainDay.dayNameAs}ত ${peakRainDay.rainProb}% বৰষুণৰ সম্ভাৱনা আৰু আনুমানিক ${peakRainDay.precipitationSum}মিমি বৰষুণ হ'ব পাৰে। নিম্ন অঞ্চলত পানী জমা হ'ব পাৰে — কাগজ-পত্ৰ সাৱধানে ৰাখক আৰু পানী জমা হোৱা পথেৰে যাতায়াত নকৰিব।`
      });
    } else if (rainyDays.length > 0) {
      advisories.push({
        id: 'rain-agri',
        category: 'agriculture',
        severity: 'warning',
        icon: Sprout,
        titleEn: 'Agro-Solar Advisory',
        titleAs: 'কৃষি পৰামৰ্শ',
        textEn: `${peakRainDay.rainProb}% rain probability on ${peakRainDay.dayNameEn} (~${peakRainDay.precipitationSum}mm). Postpone open-yard grain sun-drying and fertilizer spraying until skies clear.`,
        textAs: `${peakRainDay.dayNameAs}ত ${peakRainDay.rainProb}% বৰষুণৰ সম্ভাৱনা (~${peakRainDay.precipitationSum}মিমি)। আকাশ পৰিষ্কাৰ নোহোৱালৈকে শস্য চপোৱা আৰু ৰ'দত ধান শুকুওৱাৰ কাম স্থগিত ৰাখক।`
      });
    }

    // Heat: agriculture + health — quotes actual live temp and UV index
    if (isHot) {
      advisories.push({
        id: 'heat-agri',
        category: 'agriculture',
        severity: 'warning',
        icon: Sprout,
        titleEn: 'Agro-Solar Advisory',
        titleAs: 'কৃষি পৰামৰ্শ',
        textEn: `Current temperature ${current.temp}°C with UV index ${current.uvIndex}. Irrigate vegetable beds and nurseries during early morning or evening to avoid midday heat stress.`,
        textAs: `বৰ্তমান উত্তাপ ${current.temp}°সে আৰু UV সূচক ${current.uvIndex}। দুপৰীয়াৰ উত্তাপ এৰাবলৈ পুৱা বা গধূলি সময়ত শাক-পাচলিৰ পথাৰ আৰু পুলিবাৰীত পানী যোগান ধৰক।`
      });
      advisories.push({
        id: 'heat-health',
        category: 'health',
        severity: 'warning',
        icon: Thermometer,
        titleEn: 'Heat & Sun Safety',
        titleAs: "গৰম আৰু ৰ'দৰ পৰা সুৰক্ষা",
        textEn: `With UV index at ${current.uvIndex} and ${current.temp}°C, stay hydrated and avoid direct sun between 12-3 PM. Watch for signs of heat exhaustion in children and the elderly.`,
        textAs: `UV সূচক ${current.uvIndex} আৰু উত্তাপ ${current.temp}°সে হোৱাত, পৰ্যাপ্ত পানী পান কৰক আৰু দুপৰীয়া ১২-৩ বজাৰ ভিতৰত পোনপটীয়া ৰ'দৰ পৰা আঁতৰি থাকক। শিশু আৰু বৃদ্ধসকলৰ প্ৰতি বিশেষভাৱে দৃষ্টি ৰাখক।`
      });
    }

    // Fog safety — references live conditions
    if (isFoggy) {
      advisories.push({
        id: 'fog',
        category: 'safety',
        severity: 'info',
        icon: ShieldAlert,
        titleEn: 'Low Visibility Advisory',
        titleAs: 'কম দৃশ্যমানতাৰ সতৰ্কবাণী',
        textEn: `Fog currently reported in the area (${current.temp}°C, humidity ${current.humidity}%). Drive slowly with headlights on and maintain a safe distance.`,
        textAs: `বৰ্তমান অঞ্চলত কুঁৱলী আছে (${current.temp}°সে, আৰ্দ্ৰতা ${current.humidity}%)। গাড়ী লাহে চলাওক, হেডলাইট জ্বলাই ৰাখক আৰু নিৰাপদ দূৰত্ব বজাই ৰাখক।`
      });
    }

    // Humid + rainy: mosquito-borne illness caution — quotes live humidity %
    if (isHumidRainy) {
      advisories.push({
        id: 'mosquito',
        category: 'health',
        severity: 'info',
        icon: Bug,
        titleEn: 'Mosquito-Borne Illness Caution',
        titleAs: 'মহৰ পৰা হোৱা ৰোগৰ সতৰ্কতা',
        textEn: `Humidity at ${current.humidity}% with rain expected on ${peakRainDay.dayNameEn} increases mosquito breeding risk. Remove standing water near homes and use nets to help prevent dengue/malaria.`,
        textAs: `আৰ্দ্ৰতা ${current.humidity}% আৰু ${peakRainDay.dayNameAs}ত বৰষুণৰ সম্ভাৱনাৰ বাবে মহৰ প্ৰজনন বাঢ়িব পাৰে। ঘৰৰ কাষত জমা পানী আঁতৰাওক আৰু মহৰ পৰা ৰক্ষা পাবলৈ জাল ব্যৱহাৰ কৰক।`
      });
    }

    // Strong wind — quotes exact live wind speed
    if (isWindy) {
      advisories.push({
        id: 'wind',
        category: 'safety',
        severity: 'warning',
        icon: Wind,
        titleEn: 'Strong Wind Advisory',
        titleAs: 'প্ৰবল বতাহৰ সতৰ্কতা',
        textEn: `Wind speed currently at ${current.windSpeed} km/h. Secure loose roofing, tarpaulins, and outdoor items. Exercise caution with boats and fishing near open water.`,
        textAs: `বৰ্তমান বতাহৰ গতি ${current.windSpeed} km/h। ঘৰৰ চাল, তিৰপল আৰু বাহিৰৰ বস্তুবোৰ সুৰক্ষিত কৰক। নাও চলোৱা আৰু মাছ ধৰাত সাৱধান হওক।`
      });
    }

    // Fallback: good weather, nothing urgent to flag — still quotes live numbers
    if (advisories.length === 0) {
      advisories.push({
        id: 'good',
        category: 'agriculture',
        severity: 'info',
        icon: Sprout,
        titleEn: 'Agro-Solar Advisory',
        titleAs: 'কৃষি পৰামৰ্শ',
        textEn: `Favorable conditions: ${current.temp}°C, ${current.humidity}% humidity, UV ${current.uvIndex}. Ideal for regular field activities, crop care, and sun drying.`,
        textAs: `অনুকূল বতৰ: ${current.temp}°সে, আৰ্দ্ৰতা ${current.humidity}%, UV ${current.uvIndex}। শস্যৰ যতন, শুকুওৱা আৰু নিয়মীয়া পথাৰৰ কাম-কাজৰ বাবে সৰ্বোত্তম সময়।`
      });
    }

    // Prioritize danger > warning > info, show at most 3 so the section stays scannable
    const severityOrder: Record<Advisory['severity'], number> = { danger: 0, warning: 1, info: 2 };
    advisories.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    return advisories.slice(0, 3);
  };

  // ── Error state: shown when the fetch fails and we have no data at all ──
  if (error && !current) {
    return (
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
          <span className="p-3 bg-red-50 text-red-500 rounded-2xl ring-1 ring-red-200">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <h3 className="text-base font-bold text-slate-800">
            {isAs ? 'বতৰৰ তথ্য লোড কৰিব নোৱাৰি' : 'Unable to load weather data'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {isAs
              ? 'ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰি পুনৰ চেষ্টা কৰক। বতৰ সেৱা সাময়িকভাৱে উপলব্ধ নহ’ব পাৰে।'
              : 'Please check your connection and try again. The weather service may be temporarily unavailable.'}
          </p>
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {isAs ? 'পুনৰ চেষ্টা কৰক' : 'Try Again'}
          </button>
        </div>
      </section>
    );
  }

  // ── First-load skeleton: shown only before any data has ever arrived ──
  if (loading && !current) {
    return (
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-5 mb-6">
          <span className="w-9 h-9 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-64 bg-slate-100 rounded-3xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-slate-100 rounded-2xl" />
              <div className="h-16 bg-slate-100 rounded-2xl" />
              <div className="h-16 bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-28 bg-slate-100 rounded-2xl" />
            <div className="h-16 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-xl ring-1 ring-amber-400/30">
              <Sun className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                {isAs ? 'বতৰ আৰু সৌৰ স্থিতিৰ সম্পূৰ্ণ খতিয়ান' : 'Live Atmospheric & Solar Station'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isAs ? 'চৰাইদেউ কেন্দ্ৰ (চোলাধৰা, টেঙাপুখুৰী, সোণাৰি, শিমলুগুৰি)' : 'Charaideo Hub (Choladhara, Tengapukhuri, Sonari, Simaluguri)'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {error && current && (
            <span className="text-[11px] bg-red-50 text-red-600 font-semibold px-2.5 py-1 rounded-full border border-red-200" title={error}>
              {isAs ? 'শেহতীয়া আপডেট বিফল' : 'Last refresh failed'}
            </span>
          )}
          {lastUpdated && (
            <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full border border-slate-200">
              {isAs ? `আপডেট: ${lastUpdated}` : `Synced: ${lastUpdated}`}
            </span>
          )}
          <button 
            onClick={fetchWeatherData} 
            disabled={loading}
            title="Refresh live metrics"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Atmospheric & Solar Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Sun Card (5 Columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl ring-1 ring-white/10 flex flex-col justify-between">
          
          {/* Ambient Sun Corona Glow Effect */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Status Badge */}
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${currentMeta.badgeBg}`}>
                <Sparkles className="w-3 h-3" />
                <span>{isAs ? currentMeta.labelAs : currentMeta.labelEn}</span>
              </span>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                {isAs ? currentMeta.subAs : currentMeta.subEn}
              </p>
            </div>

            {/* Glowing Hero Sun Visual */}
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative p-3 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl border border-amber-300/30 backdrop-blur-md">
                <CurrentIcon className={`w-12 h-12 ${currentMeta.color} transition-transform duration-700 hover:rotate-45`} />
              </div>
            </div>
          </div>

          {/* Main Temperature & Feels-Like Center */}
          <div className="my-6 relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-md">
                {current ? `${current.temp}°` : '--°'}
              </span>
              <span className="text-2xl font-bold text-amber-300">C</span>
            </div>
            
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-300 font-medium">
              <span>{isAs ? `অনুভৱী উত্তাপ:` : `Feels like:`} <strong className="text-white font-bold">{current?.apparentTemp ?? '--'}°C</strong></span>
              <span>•</span>
              <span className={uvInfo.color}>{uvInfo.text}</span>
            </div>
          </div>

          {/* Sunrise, Sunset & UV Solar Tracker Ribbon */}
          <div className="pt-4 border-t border-white/10 relative z-10 grid grid-cols-3 gap-2 text-center">
            
            {/* Sunrise */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/5">
              <Sunrise className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">{isAs ? 'সূৰ্যোদয় (Sunrise)' : 'Sunrise'}</span>
              <span className="text-xs font-bold text-amber-200">{current?.sunriseTime ?? '--:--'}</span>
            </div>

            {/* Sunset */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/5">
              <Sunset className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">{isAs ? 'সূৰ্যাস্ত (Sunset)' : 'Sunset'}</span>
              <span className="text-xs font-bold text-orange-200">{current?.sunsetTime ?? '--:--'}</span>
            </div>

            {/* Solar Radiation / UV Index */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/5">
              <Gauge className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">{isAs ? 'ৰ’দৰ মাত্ৰা (UV)' : 'UV Index'}</span>
              <span className="text-xs font-bold text-emerald-300">{current ? `UV ${current.uvIndex}` : '--'}</span>
            </div>

          </div>

        </div>

        {/* Right Column: 7-Day Solar Forecast & Metrics (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Quick Atmospheric Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">{isAs ? 'বায়ুৰ আৰ্দ্ৰতা' : 'Humidity'}</span>
                <span className="text-base font-extrabold text-slate-800">{current ? `${current.humidity}%` : '--'}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-xl">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">{isAs ? 'বতাহৰ গতি' : 'Wind Speed'}</span>
                <span className="text-base font-extrabold text-slate-800">{current ? `${current.windSpeed} km/h` : '--'}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">{isAs ? 'ৰ’দৰ স্থিতি' : 'Daylight Status'}</span>
                <span className="text-base font-extrabold text-slate-800">{current?.isDay ? (isAs ? 'দিনৰ পোহৰ' : 'Daylight') : (isAs ? 'ৰাতিৰ আকাশ' : 'Night')}</span>
              </div>
            </div>
          </div>

          {/* Next 24 Hours: Hourly Forecast Strip */}
          {hourly.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isAs ? 'আগন্তুক ২৪ ঘণ্টাৰ পূৰ্বাভাস' : 'Next 24 Hours'}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{isAs ? 'সোঁফালে সৰণ কৰক' : 'Scroll for more →'}</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                {hourly.map((hour, idx) => {
                  const meta = getWeatherMeta(hour.weatherCode, hour.isDay);
                  const HourIcon = meta.icon;
                  return (
                    <div
                      key={idx}
                      className={`shrink-0 w-[68px] p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                        idx === 0
                          ? 'bg-gradient-to-b from-emerald-50/80 to-amber-50/50 border-emerald-300 ring-2 ring-emerald-400/20'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-amber-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-700">
                        {isAs ? hour.hourLabelAs : hour.hourLabelEn}
                      </span>
                      <div className="my-2">
                        <HourIcon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">{hour.temp}°</span>
                      <div className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-blue-700">
                        <Droplets className="w-2.5 h-2.5 text-blue-500" />
                        <span>{hour.rainProb}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7-Day Extended Solar & Temperature Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAs ? 'আগন্তুক ৭ দিনৰ ৰ’দ আৰু তাপমাত্ৰা' : '7-Day Solar & Temperature Outlook'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{isAs ? 'সৰ্বোচ্চ / সৰ্বনিম্ন' : 'High / Low Temp'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {forecast.map((day, idx) => {
                const meta = getWeatherMeta(day.weatherCode, 1);
                const DayIcon = meta.icon;
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all hover:shadow-md ${
                      idx === 0 
                        ? 'bg-gradient-to-b from-amber-50/80 to-emerald-50/50 border-amber-300 ring-2 ring-amber-400/20' 
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-amber-200'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {isAs ? day.dayNameAs : day.dayNameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{day.date}</span>
                    
                    <div className="my-2.5 relative">
                      <DayIcon className={`w-7 h-7 ${meta.color} drop-shadow-sm`} />
                    </div>

                    <div className="text-xs font-extrabold text-slate-900">
                      {day.maxTemp}° <span className="text-slate-400 font-normal text-[11px]">/ {day.minTemp}°</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-0.5 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                      <Droplets className="w-2.5 h-2.5 text-blue-500" />
                      <span>{day.rainProb}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Advisory Cards: Agriculture, Safety, Health — generated from live conditions */}
          <div className="space-y-2.5">
            {getAdvisories().map((advisory) => {
              const styles = ADVISORY_SEVERITY_STYLES[advisory.severity];
              const AdvisoryIcon = advisory.icon;
              const categoryLabel = ADVISORY_CATEGORY_LABEL[advisory.category];
              return (
                <div
                  key={advisory.id}
                  className={`p-4 border rounded-2xl flex items-start gap-3 shadow-xs ${styles.wrap}`}
                >
                  <span className={`p-2 text-white rounded-xl shrink-0 shadow-sm ${styles.iconBg}`}>
                    <AdvisoryIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wide ${styles.titleColor}`}>
                      {isAs ? categoryLabel.as : categoryLabel.en}
                      <span className="font-medium normal-case text-slate-500"> — {isAs ? advisory.titleAs : advisory.titleEn}</span>
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                      {isAs ? advisory.textAs : advisory.textEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
};
