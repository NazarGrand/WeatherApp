import axios from "axios";
import { WeatherData, CachedWeatherData } from "../common/interfaces/Weather";
import { constants } from "../env-constants";
import { WeatherError } from "../common/errors/WeatherError";

const API_KEY = constants.WEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const CACHE_DURATION = 5 * 60 * 1000;

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  const cachedData = getCachedWeatherData(city);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherData: WeatherData = {
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      lastUpdated: new Date().toLocaleTimeString(),
    };

    cacheWeatherData(city, weatherData);
    return weatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new WeatherError("Invalid API key.");
      }
      if (status && status >= 500) {
        throw new WeatherError(
          "Weather service is currently unavailable. Please try again later."
        );
      }
      throw new WeatherError(
        error.response?.data?.message || "Failed to fetch weather data"
      );
    }
    throw new WeatherError("Unexpected error occurred");
  }
};

const getCachedWeatherData = (city: string): WeatherData | null => {
  const cachedData = localStorage.getItem(`weather_${city.toLowerCase()}`);
  if (!cachedData) return null;

  const parsedData: CachedWeatherData = JSON.parse(cachedData);

  if (Date.now() - parsedData.timestamp > CACHE_DURATION) {
    localStorage.removeItem(`weather_${city.toLowerCase()}`);
    return null;
  }

  return parsedData;
};

const cacheWeatherData = (city: string, data: WeatherData): void => {
  const cachedData: CachedWeatherData = {
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(
    `weather_${city.toLowerCase()}`,
    JSON.stringify(cachedData)
  );
};
