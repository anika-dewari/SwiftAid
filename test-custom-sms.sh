#!/bin/bash

# Quick SMS Test Script
# This simulates what the frontend sends when you submit the emergency form

echo "🧪 Testing Custom SMS Format..."
echo "================================"
echo ""
echo "Sending emergency request with full patient details..."
echo ""

curl -X POST http://localhost:5001/api/emergency-requests \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "Test Patient (Your Name)",
    "patient_phone": "+917454061975",
    "emergency_type": "Cardiac Emergency",
    "severity": "critical",
    "pickup_latitude": 28.6139,
    "pickup_longitude": 77.2090,
    "pickup_address": "Connaught Place, Central Delhi",
    "notes": "Severe chest pain, sweating profusely\nAllergies: Penicillin, Sulfa drugs\nMedications: Aspirin, Metformin",
    "send_sms": true
  }' -s | jq

echo ""
echo "✅ Check your phone (+917454061975) for SMS!"
echo ""
echo "Expected SMS format:"
echo "===================="
echo ""
echo "🚨 URGENT: NEW EMERGENCY REQUEST"
echo ""
echo "👤 Patient: Test Patient (Your Name)"
echo "📞 Contact: +917454061975"
echo "📍 Location: Connaught Place, Central Delhi"
echo "🚑 Type: Cardiac Emergency"
echo "⚠️ Severity: CRITICAL"
echo ""
echo "💊 Medical Info:"
echo "Allergies: Penicillin, Sulfa drugs"
echo "Medications: Aspirin, Metformin"
echo ""
echo "📝 Details: Severe chest pain, sweating profusely"
echo ""
echo "✅ Please open SwiftAid Driver App to ACCEPT this emergency"
echo ""
echo "- SwiftAid Emergency Response"
echo ""
echo "===================="
