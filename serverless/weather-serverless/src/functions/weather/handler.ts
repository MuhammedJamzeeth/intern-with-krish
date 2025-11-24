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
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error fetching weather data", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
      }),
    };
  }
};

export const main = middyfy(weather);
