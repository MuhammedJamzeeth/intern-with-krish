import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import axios from "axios";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const weather = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const city = event.queryStringParameters?.city;

    if (!city) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing query parameter",
          message: "Please provide city name in query parameter",
        }),
      };
    }

    if (!OPENWEATHER_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "OpenWeather API key not configured",
          message: "Please set key",
        }),
      };
    }

    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        weather: response.data.weather,
        main: response.data.main,
        wind: response.data.wind,
        name: response.data.name,
        temperature_celsius: response.data.main.temp - 273.15,
        humidity: response.data.main.humidity,
        timestamp: new Date(response.data.dt * 1000).toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error fetching weather data", error);

    if (error.response) {
      if (error.response.status === 404) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: "City not found",
            message: `Could not find the weather data for city ${event.queryStringParameters?.city}`,
          }),
        };
      }

      return {
        statusCode: error.response.status,
        body: JSON.stringify({
          error: "OpenWeather API error",
          message: error.response.message || "Unknown error",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
      }),
    };
  }
};

export const main = middyfy(weather);
