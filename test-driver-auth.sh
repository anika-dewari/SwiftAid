#!/bin/bash

echo "=== Testing Driver Authentication Flow ==="
echo ""

# Step 1: Login as driver
echo "1. Logging in as driver..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver2@test.com","password":"test123"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo "Token extracted: ${TOKEN:0:50}..."
echo ""

# Step 2: Decode token to see payload
echo "2. Decoding JWT token payload..."
echo "$TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq '.'
echo ""

# Step 3: Test driver profile endpoint
echo "3. Fetching driver profile..."
PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/drivers/profile)
echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# Step 4: Test driver stats endpoint
echo "4. Fetching driver stats..."
STATS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/drivers/stats)
echo "$STATS_RESPONSE" | jq '.'
echo ""

echo "=== Test Complete ==="
