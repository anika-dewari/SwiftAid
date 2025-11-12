#!/bin/bash

# Test driver dashboard API

echo "==================================="
echo "Testing Driver Dashboard API"
echo "==================================="
echo ""

# First, login as a driver to get a token
echo "1. Logging in as driver..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver2@test.com",
    "password": "test123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Login failed."
  exit 1
fi

echo "✅ Got token: ${TOKEN:0:20}..."
echo ""

# Test driver profile endpoint
echo "2. Fetching driver profile..."
PROFILE_RESPONSE=$(curl -s http://localhost:5001/api/drivers/profile \
  -H "Authorization: Bearer $TOKEN")

echo "Profile Response:"
echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# Test driver stats
echo "3. Fetching driver stats..."
STATS_RESPONSE=$(curl -s http://localhost:5001/api/drivers/stats \
  -H "Authorization: Bearer $TOKEN")

echo "Stats Response:"
echo "$STATS_RESPONSE" | jq '.'
echo ""

echo "==================================="
echo "Test Complete!"
echo "==================================="
