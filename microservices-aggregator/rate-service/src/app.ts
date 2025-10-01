import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

interface RateResponse {
  company: string;
  time: number;
  value: number;
}

app.use(express.json());

app.get("/rate", (req: Request, res: Response) => {
  const company = (req.query.company as string) || "Unknown";
  const time = Math.floor(Date.now() / 1000);
  const value = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;

  const response: RateResponse = { company, time, value };

  setTimeout(() => {
    res.json(response);
    console.log(`Rate Service - Response for ${company}:`, response);
  }, 5001);
});

app.listen(PORT, () => {
  console.log(`Rate Service is running on http://localhost:${PORT}`);
});
