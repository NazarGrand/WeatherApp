import { FunctionComponent } from "react";
import { Card, Stack, Text, Image } from "@mantine/core";
import { WeatherData } from "../../common/interfaces/Weather";

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: FunctionComponent<WeatherCardProps> = ({ weather }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack align="center" gap="xs">
        <Text size="xl" w={500}>
          {weather.city}
        </Text>
        <Image
          src={weather.icon}
          alt={weather.description}
          width={100}
          height={100}
        />
        <Text size="lg">{weather.temperature}°C</Text>
        <Text size="md" style={{ textTransform: "capitalize" }}>
          {weather.description}
        </Text>
        <Text size="sm" color="dimmed">
          Last updated: {weather.lastUpdated}
        </Text>
      </Stack>
    </Card>
  );
};

export default WeatherCard;
