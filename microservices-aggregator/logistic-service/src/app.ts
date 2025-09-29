import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

interface RateResponse {
  company: string;
  time: number;
  locations: string[];
}

const locations: string[] = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Trincomalee",
];

app.use(express.json());

app.get("/logistic", (req: Request, res: Response) => {
  const company = (req.query.company as string) || "Unknown";
  const time = Math.floor(Date.now() / 1000);

  const response: RateResponse = { company, time, locations };

  console.log(`Logistic Service - Request for ${company}:`, response);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Logistic Service is running on http://localhost:${PORT}`);
});
