import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

interface RateResponse {
  company: string;
  time: number;
  value: number;
}

interface AllocationResponse {
  company: string;
  time: number;
  value: number;
}

interface LogisticResponse {
  company: string;
  time: number;
  location: string[];
}

interface AggregatedResponse {
  company: string;
  time: number;
  value: number | string;
  allocation: number | string;
  location: string[];
  duration: string;
}

app.use(express.json());

const fetchData = async (url: string): Promise<any> => {
  // to cancel the ongoing asunc operation if it takes too long
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`Request timeout for ${url}`);
      } else {
        console.error(`Error fetching ${url}:`, error.message);
      }
    }
    return null;
  } finally {
    // when operation completes before timeout, clear the timeout for cleanup
    clearTimeout(timeout);
  }
};

app.get("/aggregate", async (req: Request, res: Response) => {
  const company = (req.query.company as string) || "Unknown";
  const startTime = Date.now();

  console.log(`\n=== Aggregation Request for ${company} ===`);

  const [rateData, allocationData, logisticData] = await Promise.all([
    fetchData(
      `http://rate-service:3000/rate?company=${company}`
    ) as Promise<RateResponse | null>,
    fetchData(
      `http://allocation-service:3000/allocation?company=${company}`
    ) as Promise<AllocationResponse | null>,
    fetchData(
      `http://logistic-service:3000/logistic?company=${company}`
    ) as Promise<LogisticResponse | null>,
  ]);

  const endTime = Date.now();

  const duration = endTime - startTime;

  const aggregatedResponse: AggregatedResponse = {
    company,
    time: Math.floor(Date.now() / 1000), // Current epoch time
    value: rateData ? rateData.value : "no response",
    allocation: allocationData ? allocationData.value : "no response",
    location: logisticData ? logisticData.location : ["no response"],
    duration: `${duration}ms`,
  };

  res.json(aggregatedResponse);
});

app.listen(PORT, () => {
  console.log(`Aggregation Service is running on http://localhost:${PORT}`);
});
