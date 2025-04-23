import { FunctionComponent, useState } from "react";
import { Alert, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { getWeatherData } from "../../services/WeatherService";
import { WeatherData } from "../../common/interfaces/Weather";
import { WeatherError } from "../../common/errors/WeatherError";
import WeatherForm from "../WeatherForm/WeatherForm";
import WeatherCard from "../WeatherCard/WeatherCard";

const Weather: FunctionComponent = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(city);
      setWeather(data);
    } catch (err: any) {
      setError(
        err && err.message ? err.message : "An unexpected error occurred"
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg" w={350} mx="auto" mt={50}>
      <WeatherForm
        city={city}
        setCity={setCity}
        loading={loading}
        onSubmit={handleSubmit}
      />

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          data-testid="error-message"
        >
          {error}
        </Alert>
      )}

      {weather && <WeatherCard weather={weather} />}
    </Stack>
  );
};

export default Weather;
