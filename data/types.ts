export type HourlyItem = {
  id: string;
  time: string;
  temp: number;
  icon: string;
};

export type DailyItem = {
  id: string;
  day: string;
  high: number;
  low: number;
  icon: string;
};

export type CityWeather = {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  hourly: HourlyItem[];
  daily: DailyItem[];
  uvIndex: number;
  uvLabel: string;
  feelsLike: number;
  humidity: number;
  wind: string;
  visibility: string;
  pressure: string;
  sunrise: string;
  sunset: string;
};
