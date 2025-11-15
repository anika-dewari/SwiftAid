#!/bin/bash

# SwiftAid Validation Testing Script
# This script tests all validation rules to ensure they are enforced correctly

echo "🔒 SwiftAid Validation Testing"
echo "================================"
echo ""

API_URL="http://localhost:5001/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test validation
test_validation() {
    local test_name=$1
    local endpoint=$2
    local data=$3
    local should_fail=$4
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo "Test $TOTAL_TESTS: $test_name"
    
    response=$(curl -s -X POST "$API_URL$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Check if response contains error
    if echo "$response" | grep -q "VALIDATION_ERROR"; then
        if [ "$should_fail" = "true" ]; then
            echo -e "${GREEN}✓ PASS${NC} - Validation correctly rejected invalid data"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo -e "${RED}✗ FAIL${NC} - Valid data was incorrectly rejected"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        # Show error details
        echo "$response" | jq '.error.details[].message' 2>/dev/null | sed 's/^/  → /'
    else
        if [ "$should_fail" = "false" ]; then
            echo -e "${GREEN}✓ PASS${NC} - Validation correctly accepted valid data"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo -e "${RED}✗ FAIL${NC} - Invalid data was incorrectly accepted"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    fi
    echo ""
}

echo "📧 Testing Email Validation"
echo "----------------------------"

test_validation \
    "Invalid email - missing @" \
    "/auth/register" \
    '{
        "email": "invalidemail",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "true"

test_validation \
    "Invalid email - missing domain" \
    "/auth/register" \
    '{
        "email": "user@",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "true"

test_validation \
    "Valid email" \
    "/auth/register" \
    '{
        "email": "testuser'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "false"

echo "🔐 Testing Password Validation"
echo "-------------------------------"

test_validation \
    "Password too short (3 chars)" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "true"

test_validation \
    "Valid password (6+ chars)" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "false"

echo "👤 Testing Full Name Validation"
echo "--------------------------------"

test_validation \
    "Name too short (1 char)" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "A",
        "role": "user"
    }' \
    "true"

test_validation \
    "Name with numbers (invalid)" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John123",
        "role": "user"
    }' \
    "true"

test_validation \
    "Valid full name" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user"
    }' \
    "false"

echo "📱 Testing Phone Validation"
echo "----------------------------"

test_validation \
    "Phone too short (5 digits)" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user",
        "phone": "12345"
    }' \
    "true"

test_validation \
    "Valid phone number" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user",
        "phone": "+1-234-567-8900"
    }' \
    "false"

echo "🪪 Testing Driver License Validation"
echo "-------------------------------------"

test_validation \
    "License - lowercase (invalid)" \
    "/auth/register" \
    '{
        "email": "driver'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "Driver Name",
        "role": "driver",
        "driverDetails": {
            "license_number": "dl-12345678",
            "vehicle_type": "ambulance",
            "vehicle_number": "ABC-1234"
        }
    }' \
    "true"

test_validation \
    "License - too short" \
    "/auth/register" \
    '{
        "email": "driver'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "Driver Name",
        "role": "driver",
        "driverDetails": {
            "license_number": "DL-12",
            "vehicle_type": "ambulance",
            "vehicle_number": "ABC-1234"
        }
    }' \
    "true"

test_validation \
    "Valid driver license" \
    "/auth/register" \
    '{
        "email": "driver'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "Driver Name",
        "role": "driver",
        "driverDetails": {
            "license_number": "DL-'$(date +%s)'",
            "vehicle_type": "ambulance",
            "vehicle_number": "VH'$(date +%s)'"
        }
    }' \
    "false"

echo "🚗 Testing Vehicle Number Validation"
echo "--------------------------------------"

test_validation \
    "Vehicle - lowercase (invalid)" \
    "/auth/register" \
    '{
        "email": "driver'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "Driver Name",
        "role": "driver",
        "driverDetails": {
            "license_number": "DL-'$(date +%s)'",
            "vehicle_type": "ambulance",
            "vehicle_number": "abc-1234"
        }
    }' \
    "true"

test_validation \
    "Vehicle - too short" \
    "/auth/register" \
    '{
        "email": "driver'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "Driver Name",
        "role": "driver",
        "driverDetails": {
            "license_number": "DL-'$(date +%s)'",
            "vehicle_type": "ambulance",
            "vehicle_number": "12"
        }
    }' \
    "true"

echo "🎯 Testing Role Validation"
echo "---------------------------"

test_validation \
    "Invalid role" \
    "/auth/register" \
    '{
        "email": "user'$(date +%s)'@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "superuser"
    }' \
    "true"

echo ""
echo "================================"
echo "📊 Test Results Summary"
echo "================================"
echo -e "Total Tests:  $TOTAL_TESTS"
echo -e "${GREEN}Passed:       $PASSED_TESTS${NC}"
echo -e "${RED}Failed:       $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All validation tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some validation tests failed!${NC}"
    exit 1
fi
