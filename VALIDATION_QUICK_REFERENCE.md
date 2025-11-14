# 🔒 SwiftAid Data Validation - Quick Reference Card

## 📋 Validation Rules at a Glance

---

### **📧 EMAIL**
```
✅ user@example.com
✅ john.doe+tag@company.co.uk
❌ invalid@email
❌ @domain.com
❌ user@.com

Pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
Length: 5-255 characters
Unique: Yes
Case: Lowercase
```

---

### **📱 PHONE**
```
✅ +1-234-567-8900
✅ 9876543210
✅ (555) 123-4567
✅ +91 74540 61975
❌ 12345 (too short)
❌ abc-def-ghij (no letters)

Pattern: ^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$
Length: 10-20 characters
```

---

### **🪪 LICENSE NUMBER**
```
✅ DL-12345678
✅ CA1234567
✅ TX-87654321
❌ 123 (too short)
❌ dl-1234 (must be uppercase)
❌ INVALID#123 (no special chars)

Pattern: ^[A-Z]{2}[-]?[0-9]{4,8}$
Length: 4-50 characters
Case: UPPERCASE only
Unique: Yes
```

---

### **🚗 VEHICLE NUMBER**
```
✅ ABC-1234
✅ MH12AB1234
✅ TX 1234
✅ CA-123456
❌ 12 (too short)
❌ abc123 (must be uppercase)
❌ ABC@1234 (invalid character)

Pattern: ^[A-Z0-9]{2,4}[-\s]?[A-Z0-9]{3,6}$
Length: 4-50 characters
Case: UPPERCASE only
Unique: Yes (per driver)
```

---

### **🔐 PASSWORD**
```
Minimum Length: 6 characters
Maximum Length: 128 characters

Recommended (Production):
  ✓ At least 1 UPPERCASE letter
  ✓ At least 1 lowercase letter
  ✓ At least 1 number (0-9)
  ✓ At least 1 special character (!@#$%^&*)
  
Storage: Bcrypt hashed (10 rounds)
Never stored in plain text!
```

---

### **📍 COORDINATES**
```
Latitude:
  Range: -90.0 to 90.0
  Format: DECIMAL(10, 8)
  Example: 37.7749295
  
Longitude:
  Range: -180.0 to 180.0
  Format: DECIMAL(11, 8)
  Example: -122.4194155

Precision: 8 decimal places
Required: Yes (for location operations)
```

---

### **👤 FULL NAME**
```
✅ John Doe
✅ Mary-Jane O'Connor
✅ Dr. Smith Jr.
❌ 123User (no numbers)
❌ User@123 (invalid chars)

Pattern: ^[a-zA-Z\s\.\'\-]{2,255}$
Length: 2-255 characters
Allowed: Letters, spaces, dots, hyphens, apostrophes
```

---

## 🎯 ENUM VALUES

### **User Roles**
```
'user'      → Regular users
'admin'     → System administrators
'driver'    → Ambulance drivers
```

### **Driver Status**
```
'available' → Ready for dispatch
'busy'      → Currently on assignment
'offline'   → Not available
```

### **Ambulance Status**
```
'available'   → Ready for use
'busy'        → In service
'maintenance' → Under repair
'offline'     → Not operational
```

### **Emergency Types**
```
'cardiac-arrest'        'accident'
'stroke'                'respiratory-distress'
'trauma'                'burns'
'poisoning'             'obstetric'
'pediatric'             'other'
```

### **Severity Levels**
```
'low'      → Non-urgent
'medium'   → Moderate urgency
'high'     → Urgent
'critical' → Life-threatening
```

### **Request Status**
```
'pending'     → Awaiting assignment
'accepted'    → Driver assigned
'in_progress' → En route/treating
'completed'   → Finished
'cancelled'   → Cancelled
```

### **Vehicle Types**
```
'ambulance'          → Basic life support
'advanced-ambulance' → Advanced life support
'air-ambulance'      → Helicopter/plane
'icu-ambulance'      → Intensive care unit
'neonatal-ambulance' → Infant transport
```

---

## 📊 NUMERIC RANGES

```
Experience Years:    0 - 50
Rating:             0.00 - 5.00 (2 decimals)
Available Beds:     0 - 10,000
Equipment Items:    Max 30 per ambulance
Specialties:        Max 20 per hospital
```

---

## 🚨 COMMON VALIDATION ERRORS

### **Email Errors**
```
❌ "Invalid email format"
   → Check for @ symbol and domain extension
   → Example: user@example.com

❌ "User already exists with this email"
   → Email must be unique
   → Try a different email address
```

### **Password Errors**
```
❌ "Password must be 6-128 characters"
   → Password is too short or too long
   → Use 8+ characters for better security

❌ "Password must contain uppercase, lowercase, number, and special character"
   → Example: SecurePass123!
```

### **Phone Errors**
```
❌ "Invalid phone number format"
   → Use digits with optional +, -, (), spaces
   → Examples: +1-234-567-8900, 9876543210

❌ "Phone must be 10-20 characters"
   → Too short or too long
```

### **License Errors**
```
❌ "License number format: XX-12345678"
   → Must start with 2 uppercase letters
   → Followed by 4-8 digits
   → Examples: DL-12345678, CA1234567
```

### **Vehicle Number Errors**
```
❌ "Vehicle number format: ABC-1234"
   → 2-4 alphanumeric characters
   → Optional separator (- or space)
   → 3-6 alphanumeric characters
   → Examples: MH12AB1234, TX-1234
```

### **Coordinate Errors**
```
❌ "Latitude must be between -90 and 90"
   → Check latitude value
   → Example: 37.7749295

❌ "Longitude must be between -180 and 180"
   → Check longitude value
   → Example: -122.4194155
```

---

## 🔄 STATUS TRANSITIONS

### **Emergency Request Flow**
```
pending ──→ accepted ──→ in_progress ──→ completed
   │            │              │
   └────────────┴──────────────┴─────────→ cancelled
   
✅ Valid transitions:
   pending → accepted
   pending → cancelled
   accepted → in_progress
   accepted → cancelled
   in_progress → completed
   in_progress → cancelled
   
❌ Invalid transitions:
   completed → anything (terminal state)
   cancelled → anything (terminal state)
```

---

## 🛡️ SECURITY FEATURES

### **Input Sanitization**
```
✅ Whitespace trimming
✅ HTML/Script tag removal
✅ XSS prevention
✅ SQL injection protection
✅ Case normalization
```

### **Password Security**
```
✅ Bcrypt hashing (10 rounds)
✅ Never stored in plain text
✅ Minimum length enforcement
✅ Optional strength requirements
```

### **Data Integrity**
```
✅ Unique constraints
✅ Foreign key relationships
✅ Enum validations
✅ Range validations
✅ Format validations
```

---

## 📝 VALIDATION ERROR RESPONSE FORMAT

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "user@invalid"
      },
      {
        "field": "vehicle_number",
        "message": "Vehicle number format: ABC-1234",
        "value": "abc"
      }
    ]
  }
}
```

---

## ✅ TESTING EXAMPLES

### **Valid User Registration**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "role": "user",
  "phone": "+1-234-567-8900"
}
```

### **Valid Driver Registration**
```json
{
  "email": "driver@example.com",
  "password": "SecurePass123!",
  "full_name": "Driver Name",
  "role": "driver",
  "phone": "+1-234-567-8900",
  "driverDetails": {
    "license_number": "DL-12345678",
    "vehicle_type": "ambulance",
    "vehicle_number": "ABC-1234",
    "vehicle_model": "Ford Transit 2024",
    "experience_years": 5
  }
}
```

### **Valid Emergency Request**
```json
{
  "patient_name": "Jane Smith",
  "patient_phone": "+1-555-123-4567",
  "emergency_type": "cardiac-arrest",
  "severity": "critical",
  "pickup_latitude": 37.7749295,
  "pickup_longitude": -122.4194155,
  "pickup_address": "123 Main St, San Francisco, CA",
  "notes": "Patient experiencing chest pain"
}
```

---

## 🎯 QUICK TIPS

1. **Emails** must be unique and lowercase
2. **Passwords** should be 8+ characters with mixed case, numbers, special chars
3. **Phone numbers** must have 10-20 digits
4. **License numbers** need 2 uppercase letters + 4-8 digits
5. **Vehicle numbers** must be uppercase alphanumeric
6. **Coordinates** must be within valid ranges
7. **Enums** are case-sensitive (use lowercase with hyphens)
8. **All text fields** are automatically trimmed
9. **Special characters** are only allowed where specified
10. **Unique fields** (email, license, vehicle) cannot be duplicated

---

**Print this card and keep it handy for reference!** 📋

**Last Updated**: November 14, 2025  
**Version**: 1.0
