import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Weather from "../components/Weather/Weather";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theming/theme";
import "@mantine/core/styles.css";
import { WeatherError } from "../common/errors/WeatherError";
import * as WeatherService from "../services/WeatherService";
import { WeatherData } from "../common/interfaces/Weather";

jest.mock("../services/WeatherService");

describe("Weather component", () => {
  const mockWeatherData: WeatherData = {
    city: "Lviv",
    temperature: 18,
    description: "cloudy",
    icon: "https://icon.url",
    lastUpdated: "14:00",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays error message when invalid city entered", async () => {
    (WeatherService.getWeatherData as jest.Mock).mockRejectedValue(
      new WeatherError("city not found")
    );

    render(
      <MantineProvider theme={theme}>
        <Weather />
      </MantineProvider>
    );

    fireEvent.change(screen.getByTestId("city-input"), {
      target: { value: "InvalidCity" },
    });
    fireEvent.click(screen.getByTestId("search-button"));

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("city not found")).toBeInTheDocument();
    });
  });

  it("displays weather data correctly", async () => {
    (WeatherService.getWeatherData as jest.Mock).mockResolvedValue(
      mockWeatherData
    );

    render(
      <MantineProvider theme={theme}>
        <Weather />
      </MantineProvider>
    );

    fireEvent.change(screen.getByTestId("city-input"), {
      target: { value: "Lviv" },
    });
    fireEvent.click(screen.getByTestId("search-button"));

    await waitFor(() => {
      expect(screen.getByTestId("weather-card")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("temperature")).toHaveTextContent("18°C");
    });

    await waitFor(() => {
      expect(screen.getByTestId("description")).toHaveTextContent("cloudy");
    });
  });
});
