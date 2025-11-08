API Migration Guide: V1 → V2

Overview

This guide explains the migration from Travel Planner API v1 to v2.

When migrate?

I am measuring the V1 and V2 usage,for now user can use both version when user finds v2 response is better than V1 response (not included weather details)
V2 req will be increased, when V2 req increased upto 75% we will inform user to V1 is deprecated (informs user to use V1) and
after V2 usage hit 100% I will remove the V1 from code base

What Changed?

V2 adds weather forecast data to trip search responses:

http://localhost:3000/v1/trips/search?from=CMB&to=BKK&date=2025-12-10
V1 Response:

````json
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
````
