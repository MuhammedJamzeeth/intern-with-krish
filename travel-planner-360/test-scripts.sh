#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "  Travel Planner 360 - API Tests"
echo "=========================================="

echo -e "\n1. Testing V1 Scatter-Gather"
curl -s "${BASE_URL}/v1/trips/search?from=CMB&to=BKK&date=2025-12-10" | jq '.'
