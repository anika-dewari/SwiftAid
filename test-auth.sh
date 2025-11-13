#!/bin/bash

echo "=== Testing Driver Authentication ===" 
echo ""

# Login
echo "1. Logging in..."
RESPONSE=$(curl -s http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testdriver123@test.com","password":"test123"}')

echo "Response:"
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Extract token
TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "2. Token extracted successfully"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test profile endpoint
echo "3. Testing /api/drivers/profile..."
PROFILE_RESPONSE=$(curl -s http://localhost:5001/api/drivers/profile \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$PROFILE_RESPONSE"
echo ""

echo "=== Test Complete ==="
