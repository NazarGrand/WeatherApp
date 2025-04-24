import axios from "axios";
import { getWeatherData } from "../services/WeatherService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getWeatherData", () => {
  const city = "Kyiv";
  const mockResponse = {
    data: {
      name: "Kyiv",
      main: { temp: 20.3 },
      weather: [{ description: "clear sky", icon: "01d" }],
    },
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("fetches weather data and caches it", async () => {
    mockedAxios.get.mockResolvedValue(mockResponse);

    const data = await getWeatherData(city);

    expect(data.city).toBe("Kyiv");
    expect(data.temperature).toBe(20);
    expect(localStorage.getItem(`weather_kyiv`)).not.toBeNull();
  });

  it("returns cached data if it exists", async () => {
    const cached = {
      city: "Kyiv",
      temperature: 25,
      description: "sunny",
      icon: "icon_url",
      lastUpdated: "12:00",
      timestamp: Date.now(),
    };
    localStorage.setItem(`weather_kyiv`, JSON.stringify(cached));
    const data = await getWeatherData("Kyiv");
    expect(data.temperature).toBe(25);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("throws WeatherError on invalid API key (401)", async () => {
    mockedAxios.get.mockRejectedValue({ response: { status: 401 } });
    await expect(getWeatherData(city)).rejects.toThrow("Invalid API key.");
  });

  it("throws generic WeatherError on other error", async () => {
    mockedAxios.get.mockRejectedValue({
      response: { status: 404, data: { message: "city not found" } },
    });
    await expect(getWeatherData(city)).rejects.toThrow("city not found");
  });
});
