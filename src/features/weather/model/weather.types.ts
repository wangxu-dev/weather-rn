export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type City = Coordinates & {
  id: string;
  name: string;
  timezone: string;
};

export type HourlyForecastItem = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type DailyForecastItem = {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
};

export type WeatherSnapshot = {
  city: City;
  current: {
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    windSpeed: number;
  };
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
};
