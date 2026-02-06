import {CityWeather, HourlyItem, DailyItem} from './types';

export type CityResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

export const DEFAULT_CITIES: CityResult[] = [
  {name: 'Kraków', latitude: 50.0647, longitude: 19.945, country: 'Poland'},
  {name: 'Warszawa', latitude: 52.2297, longitude: 21.0122, country: 'Poland'},
  {name: 'Wrocław', latitude: 51.1079, longitude: 17.0385, country: 'Poland'},
  {name: 'Gdańsk', latitude: 54.352, longitude: 18.6466, country: 'Poland'},
  {name: 'Poznań', latitude: 52.4064, longitude: 16.9252, country: 'Poland'},
];

type OpenMeteoCurrentResponse = {
  temperature_2m: number;
  weather_code: number;
  is_day: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  surface_pressure: number;
  uv_index: number;
  time: string;
};

type OpenMeteoHourlyResponse = {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  visibility: number[];
};

type OpenMeteoDailyResponse = {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
};

type OpenMeteoForecastResponse = {
  current: OpenMeteoCurrentResponse;
  hourly: OpenMeteoHourlyResponse;
  daily: OpenMeteoDailyResponse;
};

type OpenMeteoGeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

const WMO_MAP: Record<number, {condition: string; icon: string}> = {
  0: {condition: 'Clear Sky', icon: '01'},
  1: {condition: 'Mainly Clear', icon: '02'},
  2: {condition: 'Partly Cloudy', icon: '02'},
  3: {condition: 'Overcast', icon: '04'},
  45: {condition: 'Fog', icon: '50'},
  48: {condition: 'Depositing Rime Fog', icon: '50'},
  51: {condition: 'Light Drizzle', icon: '09'},
  53: {condition: 'Moderate Drizzle', icon: '09'},
  55: {condition: 'Dense Drizzle', icon: '09'},
  56: {condition: 'Freezing Drizzle', icon: '09'},
  57: {condition: 'Heavy Freezing Drizzle', icon: '09'},
  61: {condition: 'Slight Rain', icon: '10'},
  63: {condition: 'Moderate Rain', icon: '10'},
  65: {condition: 'Heavy Rain', icon: '10'},
  66: {condition: 'Freezing Rain', icon: '10'},
  67: {condition: 'Heavy Freezing Rain', icon: '10'},
  71: {condition: 'Slight Snow', icon: '13'},
  73: {condition: 'Moderate Snow', icon: '13'},
  75: {condition: 'Heavy Snow', icon: '13'},
  77: {condition: 'Snow Grains', icon: '13'},
  80: {condition: 'Slight Showers', icon: '09'},
  81: {condition: 'Moderate Showers', icon: '09'},
  82: {condition: 'Violent Showers', icon: '09'},
  85: {condition: 'Slight Snow Showers', icon: '13'},
  86: {condition: 'Heavy Snow Showers', icon: '13'},
  95: {condition: 'Thunderstorm', icon: '11'},
  96: {condition: 'Thunderstorm with Hail', icon: '11'},
  99: {condition: 'Thunderstorm with Heavy Hail', icon: '11'},
};

const wmoLookup = (code: number, isDay: boolean) => {
  const entry = WMO_MAP[code] ?? {condition: 'Unknown', icon: '01'};
  return {
    condition: entry.condition,
    icon: `${entry.icon}${isDay ? 'd' : 'n'}`,
  };
};

const formatHour = (iso: string): string => {
  const h = parseInt(iso.slice(11, 13), 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12} ${ampm}`;
};

const formatDay = (iso: string): string => {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

const formatTime = (iso: string): string => {
  const h = parseInt(iso.slice(11, 13), 10);
  const m = iso.slice(14, 16);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
};

const getUvLabel = (uv: number): string => {
  if (uv <= 2) {
    return 'Low';
  }
  if (uv <= 5) {
    return 'Moderate';
  }
  if (uv <= 7) {
    return 'High';
  }
  if (uv <= 10) {
    return 'Very High';
  }
  return 'Extreme';
};

const WIND_DIRS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

const getWindDirection = (degrees: number): string =>
  WIND_DIRS[Math.round(degrees / 22.5) % 16];

export async function searchCities(query: string): Promise<CityResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query,
  )}&count=5&language=en`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`City search failed: ${res.status}`);
  }
  const json: OpenMeteoGeocodingResponse = await res.json();
  if (!json.results) {
    return [];
  }
  return json.results.map(r => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
  }));
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  cityName: string,
  signal?: AbortSignal,
): Promise<CityWeather> {
  const params = [
    `latitude=${latitude}`,
    `longitude=${longitude}`,
    'current=temperature_2m,weather_code,is_day,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index',
    'hourly=temperature_2m,weather_code,visibility',
    'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
    'timezone=auto',
    'forecast_days=7',
  ].join('&');

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }
  const json: OpenMeteoForecastResponse = await res.json();

  const {current, hourly: hourlyData, daily: dailyData} = json;

  const isCurrentDay = current.is_day === 1;
  const currentWmo = wmoLookup(current.weather_code, isCurrentDay);
  const uvIndex = Math.round(current.uv_index);

  const currentHour = current.time.slice(0, 13);
  const nowHourIndex = hourlyData.time.findIndex(t =>
    t.startsWith(currentHour),
  );
  const safeNowIndex = nowHourIndex >= 0 ? nowHourIndex : 0;

  const sunriseHour = parseInt(dailyData.sunrise[0].slice(11, 13), 10);
  const sunsetHour = parseInt(dailyData.sunset[0].slice(11, 13), 10);

  const hourly: HourlyItem[] = Array.from({length: 10}, (_, i) => {
    const idx = safeNowIndex + i;
    if (idx >= hourlyData.time.length) {
      return null;
    }
    const hour = parseInt(hourlyData.time[idx].slice(11, 13), 10);
    const isDay = hour >= sunriseHour && hour < sunsetHour;
    return {
      id: `h${i}`,
      time: i === 0 ? 'Now' : formatHour(hourlyData.time[idx]),
      temp: Math.round(hourlyData.temperature_2m[idx]),
      icon: wmoLookup(hourlyData.weather_code[idx], isDay).icon,
    };
  }).filter(Boolean) as HourlyItem[];

  const daily: DailyItem[] = dailyData.time.map((day, i) => ({
    id: `d${i}`,
    day: i === 0 ? 'Today' : formatDay(day),
    high: Math.round(dailyData.temperature_2m_max[i]),
    low: Math.round(dailyData.temperature_2m_min[i]),
    icon: wmoLookup(dailyData.weather_code[i], true).icon,
  }));

  const visibilityKm = Math.round(
    (hourlyData.visibility[safeNowIndex] ?? 20000) / 1000,
  );

  return {
    city: cityName,
    temp: Math.round(current.temperature_2m),
    condition: currentWmo.condition,
    icon: currentWmo.icon,
    high: Math.round(dailyData.temperature_2m_max[0]),
    low: Math.round(dailyData.temperature_2m_min[0]),
    hourly,
    daily,
    uvIndex,
    uvLabel: getUvLabel(uvIndex),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    wind: `${Math.round(current.wind_speed_10m)} km/h ${getWindDirection(
      current.wind_direction_10m,
    )}`,
    visibility: `${visibilityKm} km`,
    pressure: `${Math.round(current.surface_pressure)} hPa`,
    sunrise: formatTime(dailyData.sunrise[0]),
    sunset: formatTime(dailyData.sunset[0]),
  };
}
