# SwiftAid - Data Validation Constraints & Rules

## 📋 Overview
This document outlines all data validation rules enforced in the SwiftAid system to ensure data integrity, security, and consistency.

---

## 🔐 User Authentication & Registration

### **Email Validation**
- **Format**: Must match RFC 5322 standard email format
- **Pattern**: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- **Length**: 5-255 characters
- **Uniqueness**: Must be unique across all users
- **Case**: Stored in lowercase
- **Examples**:
  - ✅ `user@example.com`
  - ✅ `john.doe+test@company.co.uk`
  - ❌ `invalid@email`
  - ❌ `@domain.com`
  - ❌ `user@.com`

### **Password Validation**
- **Minimum Length**: 6 characters (8+ recommended for production)
- **Maximum Length**: 128 characters
- **Strength Requirements** (Recommended):
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&*)
- **Storage**: Always hashed using bcrypt (salt rounds: 10)
- **Never** stored in plain text

### **Phone Number Validation**
- **Format**: International or national format
- **Pattern**: `^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$`
- **Length**: 10-20 characters (including country code)
- **Allowed Characters**: Numbers, +, -, spaces, parentheses
- **Examples**:
  - ✅ `+1-234-567-8900`
  - ✅ `9876543210`
  - ✅ `+91 74540 61975`
  - ✅ `(555) 123-4567`
  - ❌ `12345` (too short)
  - ❌ `abc-def-ghij` (letters not allowed)

### **Full Name Validation**
- **Length**: 2-255 characters
- **Pattern**: `^[a-zA-Z\s\.\'-]+$`
- **Allowed**: Letters, spaces, hyphens, apostrophes, periods
- **Examples**:
  - ✅ `John Doe`
  - ✅ `Mary-Jane O'Connor`
  - ✅ `Dr. Smith Jr.`
  - ❌ `123User` (no numbers)
  - ❌ `User@123` (no special chars except . ' -)

### **Role Validation**
- **Allowed Values**: `'user'`, `'admin'`, `'driver'`
- **Case Sensitive**: Yes (lowercase only)
- **Required**: Yes
- **Default**: None (must be explicitly set)

---

## 🚑 Driver Profile Validation

### **License Number Validation**
- **Format**: Alphanumeric with optional hyphens
- **Pattern**: `^[A-Z]{2}[-]?[0-9]{4,8}$`
- **Length**: 4-50 characters
- **Uniqueness**: Must be unique across all drivers
- **Case**: Uppercase
- **Examples**:
  - ✅ `DL-12345678`
  - ✅ `CA1234567`
  - ✅ `TX-87654321`
  - ❌ `123` (too short)
  - ❌ `dl-1234` (lowercase not allowed)
  - ❌ `INVALID#123` (special chars not allowed)

### **Vehicle Number Validation**
- **Format**: Standard vehicle registration format
- **Pattern**: `^[A-Z0-9]{2,4}[-\s]?[A-Z0-9]{3,6}$`
- **Length**: 4-50 characters
- **Case**: Uppercase
- **Uniqueness**: Must be unique per driver profile
- **Examples**:
  - ✅ `ABC-1234`
  - ✅ `MH12AB1234`
  - ✅ `TX 1234`
  - ✅ `CA-123456`
  - ❌ `12` (too short)
  - ❌ `abc123` (lowercase)
  - ❌ `ABC@1234` (invalid character)

### **Vehicle Type Validation**
- **Allowed Values**: 
  - `'ambulance'` (basic life support)
  - `'advanced-ambulance'` (advanced life support)
  - `'air-ambulance'` (helicopter/plane)
  - `'icu-ambulance'` (intensive care unit)
  - `'neonatal-ambulance'` (infant transport)
- **Case**: Lowercase with hyphens
- **Required**: Yes

### **Vehicle Model Validation**
- **Length**: 3-100 characters
- **Pattern**: `^[a-zA-Z0-9\s\-\.]+$`
- **Optional**: Yes
- **Examples**:
  - ✅ `Ford Transit 2024`
  - ✅ `Mercedes-Benz Sprinter`
  - ✅ `Toyota Hiace 2.8L`
  - ❌ `Model@123` (invalid character)

### **Experience Years Validation**
- **Type**: Integer
- **Minimum**: 0
- **Maximum**: 50
- **Required**: No (defaults to 0)
- **Business Rule**: Cannot be negative

### **Driver Status Validation**
- **Allowed Values**: `'available'`, `'busy'`, `'offline'`
- **Case Sensitive**: Yes (lowercase only)
- **Default**: `'offline'`
- **Required**: Yes

### **Rating Validation**
- **Type**: Decimal
- **Minimum**: 0.00
- **Maximum**: 5.00
- **Precision**: 2 decimal places
- **Default**: 5.00
- **Business Rule**: Can only be updated by system after trip completion

---

## 🚨 Emergency Request Validation

### **Patient Name Validation**
- **Length**: 2-255 characters
- **Pattern**: `^[a-zA-Z\s\.\'-]+$`
- **Required**: Yes
- **Same rules as Full Name**

### **Patient Phone Validation**
- **Same rules as User Phone Number**
- **Required**: Yes

### **Emergency Type Validation**
- **Allowed Values**:
  - `'cardiac-arrest'`
  - `'accident'`
  - `'stroke'`
  - `'respiratory-distress'`
  - `'trauma'`
  - `'burns'`
  - `'poisoning'`
  - `'obstetric'`
  - `'pediatric'`
  - `'other'`
- **Required**: Yes
- **Case**: Lowercase with hyphens

### **Severity Level Validation**
- **Allowed Values**: `'low'`, `'medium'`, `'high'`, `'critical'`
- **Case Sensitive**: Yes (lowercase only)
- **Required**: Yes
- **Default**: `'medium'`
- **Priority Mapping**:
  - `critical`: Response time < 4 minutes
  - `high`: Response time < 8 minutes
  - `medium`: Response time < 15 minutes
  - `low`: Response time < 30 minutes

### **Request Status Validation**
- **Allowed Values**: `'pending'`, `'accepted'`, `'in_progress'`, `'completed'`, `'cancelled'`
- **Case Sensitive**: Yes (lowercase with underscores)
- **Default**: `'pending'`
- **State Transitions** (enforced):
  - `pending` → `accepted` or `cancelled`
  - `accepted` → `in_progress` or `cancelled`
  - `in_progress` → `completed` or `cancelled`
  - `completed` → (terminal state)
  - `cancelled` → (terminal state)

---

## 🏥 Hospital Validation

### **Hospital Name Validation**
- **Length**: 3-255 characters
- **Pattern**: `^[a-zA-Z0-9\s\.\-&,']+$`
- **Required**: Yes
- **Examples**:
  - ✅ `City General Hospital`
  - ✅ `St. Mary's Medical Center`
  - ✅ `Johns Hopkins Hospital & Clinic`
  - ❌ `H` (too short)

### **Address Validation**
- **Length**: 10-500 characters
- **Required**: Yes
- **Pattern**: Must contain street, city information

### **Available Beds Validation**
- **Type**: Integer
- **Minimum**: 0
- **Maximum**: 10000
- **Default**: 0
- **Business Rule**: Cannot be negative

### **Phone Number Validation**
- **Same rules as User Phone Number**
- **Required**: Yes

### **Specialties Validation**
- **Type**: Array of strings
- **Allowed Values**:
  - `'emergency'`
  - `'cardiology'`
  - `'neurology'`
  - `'orthopedics'`
  - `'pediatrics'`
  - `'obstetrics'`
  - `'trauma'`
  - `'burn-unit'`
  - `'icu'`
- **Maximum**: 20 specialties per hospital

---

## 📍 Geolocation Validation

### **Latitude Validation**
- **Type**: Decimal
- **Minimum**: -90.0
- **Maximum**: 90.0
- **Precision**: 8 decimal places
- **Required**: Yes for location-based operations
- **Format**: DECIMAL(10, 8)
- **Examples**:
  - ✅ `37.7749295`
  - ✅ `-122.4194155`
  - ❌ `91.5` (out of range)
  - ❌ `abc` (not a number)

### **Longitude Validation**
- **Type**: Decimal
- **Minimum**: -180.0
- **Maximum**: 180.0
- **Precision**: 8 decimal places
- **Required**: Yes for location-based operations
- **Format**: DECIMAL(11, 8)

### **Address Validation**
- **Length**: 10-500 characters
- **Required**: No (can be auto-generated from coordinates)
- **Pattern**: Should contain street, city, postal code

---

## 🚗 Ambulance Fleet Validation

### **Vehicle Number** (same as Driver Vehicle Number)
- **Uniqueness**: Must be unique across ambulances table
- **Cross-reference**: Can match driver_profiles.vehicle_number if assigned

### **Equipment Validation**
- **Type**: Array of strings
- **Allowed Values**:
  - `'defibrillator'`
  - `'oxygen-tank'`
  - `'ventilator'`
  - `'stretcher'`
  - `'monitor'`
  - `'ecg-machine'`
  - `'suction-device'`
  - `'spine-board'`
  - `'first-aid-kit'`
  - `'iv-supplies'`
- **Maximum**: 30 items per ambulance

### **Ambulance Status Validation**
- **Allowed Values**: `'available'`, `'busy'`, `'maintenance'`, `'offline'`
- **Default**: `'available'`
- **Required**: Yes

---

## 📊 Additional Business Rules

### **1. Time Constraints**
- All timestamps use UTC timezone
- `created_at`: Auto-generated, cannot be modified
- `updated_at`: Auto-updated on record change
- `completed_at`: Only set when status = 'completed'

### **2. Reference Integrity**
- Driver cannot be deleted if assigned to active emergency
- Hospital cannot be deleted if set as destination in active emergency
- User cascades delete to their emergency requests and notifications

### **3. Data Sanitization**
- All text inputs: Trim whitespace
- HTML/Script tags: Stripped from all inputs
- SQL Injection: Prevented via parameterized queries
- XSS Prevention: All outputs escaped

### **4. Rate Limiting**
- Registration: 5 attempts per hour per IP
- Login: 10 attempts per hour per IP
- Emergency Request: 10 per day per user
- SMS Notifications: 100 per day per driver

### **5. File Upload Constraints**
- Profile Images:
  - Max size: 5MB
  - Allowed formats: JPG, PNG, WEBP
  - Dimensions: 100x100 to 1000x1000 pixels
  - Stored as URL (max 500 chars)

---

## 🛡️ Security Validation

### **JWT Token Validation**
- **Expiry**: 7 days
- **Algorithm**: HS256
- **Required Claims**: userId, email, role
- **Signature**: Verified on every protected route

### **Password Reset Token**
- **Length**: 32 characters (random)
- **Expiry**: 1 hour
- **Single Use**: Token invalidated after use

### **Session Management**
- Concurrent sessions: Allowed (multi-device)
- Token refresh: Not implemented (re-login required)
- Token revocation: Logout invalidates client-side token

---

## 📝 Implementation Checklist

### **✅ Currently Implemented**
- [x] Email format validation (express-validator)
- [x] Password minimum length (6 chars)
- [x] Role enum validation (database constraint)
- [x] Status enum validation (database constraints)
- [x] Unique email constraint
- [x] Unique license number constraint
- [x] Unique vehicle number constraint
- [x] Latitude/Longitude data types
- [x] Bcrypt password hashing

### **⚠️ Partially Implemented**
- [ ] Phone number format validation (needs regex)
- [ ] Vehicle number format validation (needs regex)
- [ ] License number format validation (needs regex)
- [ ] Password strength requirements
- [ ] Input sanitization (partial)

### **❌ Not Yet Implemented**
- [ ] Rate limiting on endpoints
- [ ] File upload validation
- [ ] Cross-site scripting (XSS) prevention headers
- [ ] Content Security Policy (CSP)
- [ ] Request size limits
- [ ] Advanced SQL injection prevention
- [ ] Status transition validation
- [ ] Geolocation boundary checks
- [ ] Business hours validation
- [ ] Concurrent request prevention

---

## 🔄 Next Steps

1. **Create Validation Middleware**: Implement all regex patterns
2. **Add Input Sanitizer**: Strip HTML, validate types
3. **Implement Rate Limiting**: Use express-rate-limit
4. **Add Schema Validator**: Use Joi or Yup for complex validation
5. **Database Triggers**: Add more constraints at DB level
6. **API Documentation**: Document all validation rules in OpenAPI/Swagger
7. **Error Messages**: Standardize validation error responses
8. **Testing**: Unit tests for each validation rule

---

## 📞 Error Response Format

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
        "message": "Vehicle number must be in format XX-1234",
        "value": "abc"
      }
    ]
  }
}
```

---

**Last Updated**: November 14, 2025  
**Version**: 1.0  
**Status**: Documentation Complete - Implementation In Progress
