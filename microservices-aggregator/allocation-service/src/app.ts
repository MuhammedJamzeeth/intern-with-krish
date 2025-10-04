import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;

interface AllocationResponse {
  // company: string;
  // time: number;
  value: number;
}

app.use(express.json());

app.get("/allocation", (req: Request, res: Response) => {
  const company = (req.query.company as string) || "Unknown";
  const time = Math.floor(Date.now() / 1000);
  const value = Math.floor(Math.random() * (100 - 10 + 1)) + 10;

  const response: AllocationResponse = { value };

  console.log(
    `Allocation Service - Request for ${company}: at ${time}`,
    response
  );
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Allocation Service is running on http://localhost:${PORT}`);
});
