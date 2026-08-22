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
  Gauge
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
  uvIndexMax: number;
  sunriseTime: string;
  sunsetTime: string;
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
        labelAs: 'ডাৱৰীয়া আৰু ছাঁযুক্ত বতৰ',
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
        subAs: 'মাজে মাজে পাতলীয়া বৰষুণৰ টোপাল',
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
  if (uv <= 5) return { text: isAs ? 'মধ্যমীয়া ৰ’দ (সুচল)' : 'Moderate Sun (Pleasant)', color: 'text-amber-400' };
  if (uv <= 7) return { text: isAs ? 'প্ৰখৰ ৰ’দ (ছাঁ লওক)' : 'High Sun (Seek Shade)', color: 'text-orange-400' };
  return { text: isAs ? 'অতি তীব্ৰ ৰ’দ (সতৰ্কতা)' : 'Very Strong UV (Intense)', color: 'text-red-400' };
};

const DAY_NAMES_AS = ['দেও', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্ৰ', 'শনি'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeatherSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [current, setCurrent] = useState<CurrentWeatherState | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Charaideo Coordinates: 26.96° N, 95.00° E
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=26.96&longitude=95.00&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata';
      
      const res = await fetch(url);
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
            uvIndexMax: Math.round(data.daily.uv_index_max ? data.daily.uv_index_max[idx] : 5),
            sunriseTime: formatTime12h(data.daily.sunrise?.[idx]),
            sunsetTime: formatTime12h(data.daily.sunset?.[idx])
          };
        });

        setForecast(dailyItems);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const currentMeta = current ? getWeatherMeta(current.weatherCode, current.isDay) : getWeatherMeta(0, 1);
  const CurrentIcon = currentMeta.icon;
  const uvInfo = current ? getUvDescription(current.uvIndex, isAs) : { text: '--', color: 'text-amber-400' };

  const getAgriAdvisory = () => {
    if (!current || !forecast.length) return '';
    const hasRainUpcoming = forecast.slice(0, 3).some(d => d.rainProb > 50);
    
    if (hasRainUpcoming) {
      return isAs 
        ? '⚠️ আগন্তুক ২-৩ দিনত বৰষুণ আৰু ডাৱৰীয়া বতৰৰ সম্ভাৱনা। শস্য চপোৱা আৰু ৰ’দত ধান শুকুওৱাৰ কাম সাময়িকভাৱে স্থগিত ৰাখক।' 
        : '⚠️ Rain and cloud cover forecasted in next 48-72h. Postpone open-yard grain sun-drying and fertilizer spraying.';
    }
    if (current.uvIndex >= 7 || current.temp > 33) {
      return isAs 
        ? '☀️ প্ৰখৰ উজ্জ্বল ৰ’দালী আৰু উত্তাপ। শাক-পাচলিৰ পথাৰ আৰু পুলিবাৰীত পুৱা বা গধূলি সময়ত পৰ্যাপ্ত পানী যোগান ধৰক।' 
        : '☀️ Strong sun and high solar exposure. Irrigate vegetable beds and nurseries during early morning or evening.';
    }
    return isAs 
      ? '🌾 সোণালী ৰ’দ আৰু অনুকূল বতৰ। শস্যৰ যতন, শুকুওৱা আৰু নিয়মীয়া পথাৰৰ কাম-কাজৰ বাবে সৰ্বোত্তম সময়।' 
      : '🌾 Golden sunlight and favorable ambient conditions. Ideal for regular field activities, crop care, and sun drying.';
  };

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
                {isAs ? 'বতৰ আৰু সৌৰ স্থিতিৰ সম্পূৰ্ণ খতিয়ান' : 'Live Atmospheric & Solar Station'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isAs ? 'চৰাইদেউ কেন্দ্ৰ (চোলাধৰা, টেঙাপুখুৰী, সোণাৰি, শিমলুগুৰি)' : 'Charaideo Hub (Choladhara, Tengapukhuri, Sonari, Simaluguri)'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                <span className="text-[11px] text-slate-500 font-semibold block">{isAs ? 'বায়ুৰ আৰ্দ্ৰতা' : 'Humidity'}</span>
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

          {/* Agro-Solar Advisory Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50/50 to-emerald-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
            <span className="p-2 bg-amber-500 text-white rounded-xl shrink-0 shadow-sm">
              <Sprout className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                {isAs ? 'ৰ’দ আৰু বতৰৰ কৃষি পৰামৰ্শ (Agro-Solar Advisory):' : 'Agro-Solar & Crop Advisory:'}
              </h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                {getAgriAdvisory()}
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
