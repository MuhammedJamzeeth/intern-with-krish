API Migration Guide: V1 → V2

Overview

This guide explains the migration from Travel Planner API v1 to v2.

What Changed?

V2 Additions (Backward Compatible)

V2 adds weather forecast data to trip search responses:

http://localhost:3000/v1/trips/search?from=CMB&to=BKK&date=2025-12-10
V1 Response:
```json
{
  "version": "v1",
  "flights": { ... },
  "hotels": { ... }
}

http://localhost:3000/v2/trips/search?from=CMB&to=BKK&date=2025-12-10
V2 Response:
```json
{
  "version": "v2",
  "flights": { ... },
  "hotels": { ... },
  "weather": {
    "destination": "BKK",
    "forecast": [
      {
        "date": "2025-12-10",
        "tempMin": 24,
        "tempMax": 33,
        "condition": "Sunny"
      }
    ]
  }
}
