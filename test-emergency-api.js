// Test emergency request API
const testData = {
  patient_name: "John Test",
  patient_phone: "+91-9999999999",
  emergency_type: "cardiac",
  severity: "critical",
  pickup_latitude: 28.6139,
  pickup_longitude: 77.2090,
  pickup_address: "Test Location, Delhi",
  notes: "Test emergency request\nAllergies: None\nMedications: None",
  send_sms: false // Disabled for testing
};

async function testEmergencyRequest() {
  try {
    console.log("Testing Emergency Request API...");
    console.log("Sending data:", JSON.stringify(testData, null, 2));

    const response = await fetch("http://localhost:5000/api/emergency-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    console.log("\n📨 Response Status:", response.status);

    const data = await response.json();
    console.log("\n📊 Response Data:");
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✅ SUCCESS: Emergency request created");
    } else {
      console.log("\n❌ ERROR: Failed to create emergency request");
    }
  } catch (error) {
    console.error("\n❌ Request failed:", error.message);
    console.error("Error:", error);
  }
}

testEmergencyRequest();
