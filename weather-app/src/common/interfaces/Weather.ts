export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  lastUpdated: string;
}

export interface CachedWeatherData extends WeatherData {
  timestamp: number;
}
