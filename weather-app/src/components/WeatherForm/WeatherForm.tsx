import { FunctionComponent } from "react";
import { TextInput, Button, Stack, Center } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface WeatherFormProps {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const WeatherForm: FunctionComponent<WeatherFormProps> = ({
  city,
  setCity,
  loading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap="md">
        <TextInput
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ flex: 1 }}
          data-testid="city-input"
        />
        <Center>
          <Button
            w="60%"
            type="submit"
            loading={loading}
            leftSection={<IconSearch size={20} />}
            data-testid="search-button"
          >
            Search
          </Button>
        </Center>
      </Stack>
    </form>
  );
};

export default WeatherForm;
