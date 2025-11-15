#!/bin/bash

# SwiftAid SMS Integration Test Script
# This script tests the complete SMS notification flow

echo "🚑 SwiftAid SMS Integration Test"
echo "================================="
echo ""

# Configuration
BASE_URL="http://localhost:5001/api"
USER_EMAIL="user@test.com"
USER_PASSWORD="password123"
DRIVER_EMAIL="driver@test.com"
DRIVER_PASSWORD="password123"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Login as User
echo -e "${BLUE}Step 1: Login as User${NC}"
USER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${USER_EMAIL}\", \"password\": \"${USER_PASSWORD}\"}")

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$USER_TOKEN" ]; then
  echo -e "${RED}❌ Failed to login as user${NC}"
  echo "Response: $USER_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ User logged in successfully${NC}"
echo ""

# Step 2: Login as Driver
echo -e "${BLUE}Step 2: Login as Driver${NC}"
DRIVER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${DRIVER_EMAIL}\", \"password\": \"${DRIVER_PASSWORD}\"}")

DRIVER_TOKEN=$(echo $DRIVER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$DRIVER_TOKEN" ]; then
  echo -e "${RED}❌ Failed to login as driver${NC}"
  echo "Response: $DRIVER_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Driver logged in successfully${NC}"
echo ""

# Step 3: Create Emergency Request
echo -e "${BLUE}Step 3: Create Emergency Request${NC}"
echo -e "${YELLOW}📱 Check: Driver should receive SMS notification${NC}"

EMERGENCY_RESPONSE=$(curl -s -X POST "${BASE_URL}/emergency-requests" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -d '{
    "patient_name": "Test Patient",
    "patient_phone": "+917454061975",
    "emergency_type": "medical",
    "severity": "high",
    "pickup_latitude": 28.7041,
    "pickup_longitude": 77.1025,
    "pickup_address": "Connaught Place, New Delhi",
    "destination_hospital_id": 1,
    "notes": "SMS Integration Test"
  }')

REQUEST_ID=$(echo $EMERGENCY_RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$REQUEST_ID" ]; then
  echo -e "${RED}❌ Failed to create emergency request${NC}"
  echo "Response: $EMERGENCY_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Emergency request created (ID: ${REQUEST_ID})${NC}"
echo ""
sleep 3

# Step 4: Get Pending Requests
echo -e "${BLUE}Step 4: Get Pending Requests${NC}"
PENDING=$(curl -s -X GET "${BASE_URL}/emergency-requests/pending" \
  -H "Authorization: Bearer ${DRIVER_TOKEN}")

echo -e "${GREEN}✅ Pending requests fetched${NC}"
echo ""
sleep 2

# Step 5: Accept Request
echo -e "${BLUE}Step 5: Driver Accepts Request${NC}"
echo -e "${YELLOW}📱 Check: User should receive 'Driver Assigned' SMS${NC}"

ACCEPT_RESPONSE=$(curl -s -X POST "${BASE_URL}/emergency-requests/${REQUEST_ID}/accept" \
  -H "Authorization: Bearer ${DRIVER_TOKEN}")

if echo "$ACCEPT_RESPONSE" | grep -q "Request accepted successfully"; then
  echo -e "${GREEN}✅ Request accepted${NC}"
else
  echo -e "${RED}❌ Failed to accept request${NC}"
  echo "Response: $ACCEPT_RESPONSE"
fi
echo ""
sleep 3

# Step 6: Update Status to En Route
echo -e "${BLUE}Step 6: Update Status to En Route${NC}"
echo -e "${YELLOW}📱 Check: User should receive 'Driver On The Way' SMS${NC}"

EN_ROUTE_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/emergency-requests/${REQUEST_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DRIVER_TOKEN}" \
  -d '{
    "status": "en_route",
    "eta": "5-7"
  }')

if echo "$EN_ROUTE_RESPONSE" | grep -q "en_route"; then
  echo -e "${GREEN}✅ Status updated to en_route${NC}"
else
  echo -e "${RED}❌ Failed to update status${NC}"
  echo "Response: $EN_ROUTE_RESPONSE"
fi
echo ""
sleep 3

# Step 7: Update Status to Arrived
echo -e "${BLUE}Step 7: Update Status to Arrived${NC}"
echo -e "${YELLOW}📱 Check: User should receive 'Driver Has Arrived' SMS${NC}"

ARRIVED_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/emergency-requests/${REQUEST_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DRIVER_TOKEN}" \
  -d '{
    "status": "arrived"
  }')

if echo "$ARRIVED_RESPONSE" | grep -q "arrived"; then
  echo -e "${GREEN}✅ Status updated to arrived${NC}"
else
  echo -e "${RED}❌ Failed to update status${NC}"
  echo "Response: $ARRIVED_RESPONSE"
fi
echo ""
sleep 3

# Step 8: Complete Trip
echo -e "${BLUE}Step 8: Complete Trip${NC}"
echo -e "${YELLOW}📱 Check: Both user AND driver should receive 'Trip Completed' SMS${NC}"

COMPLETED_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/emergency-requests/${REQUEST_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DRIVER_TOKEN}" \
  -d '{
    "status": "completed"
  }')

if echo "$COMPLETED_RESPONSE" | grep -q "completed"; then
  echo -e "${GREEN}✅ Trip completed${NC}"
else
  echo -e "${RED}❌ Failed to complete trip${NC}"
  echo "Response: $COMPLETED_RESPONSE"
fi
echo ""

# Summary
echo "================================="
echo -e "${GREEN}🎉 SMS Integration Test Complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Verification Checklist:${NC}"
echo "1. [ ] Driver received SMS when emergency created"
echo "2. [ ] User received SMS when driver accepted"
echo "3. [ ] User received SMS when driver en route"
echo "4. [ ] User received SMS when driver arrived"
echo "5. [ ] Both received SMS when trip completed"
echo ""
echo -e "${BLUE}💡 Tips:${NC}"
echo "- Check backend console for SMS delivery logs"
echo "- Check Twilio dashboard for message status"
echo "- Verify phone numbers are correct in database"
echo ""
echo -e "Request ID: ${YELLOW}${REQUEST_ID}${NC}"
echo -e "View logs: ${BLUE}Check your terminal running the backend${NC}"
