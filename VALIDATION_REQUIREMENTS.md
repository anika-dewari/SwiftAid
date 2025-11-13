# 🔒 Registration Form Validation Requirements

## Overview
Comprehensive validation rules for SwiftAid registration forms based on database schema constraints and security best practices.

---

## 📋 VALIDATION RULES NEEDED

### 1. **EMAIL VALIDATION** 📧

**Database Constraints:**
- `UNIQUE` - Must not already exist in database
- `NOT NULL` - Required field
- `VARCHAR(255)` - Max 255 characters

**Frontend Validation Rules:**
```javascript
✅ Format: Must be valid email format (user@domain.com)
✅ Length: Max 255 characters
✅ Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
✅ Uniqueness: Check if email already exists (backend)
❌ No spaces allowed
❌ No special characters except @ and .
```

**Error Messages:**
- "Please enter a valid email address"
- "Email must not exceed 255 characters"
- "This email is already registered"

---

### 2. **PASSWORD VALIDATION** 🔐

**Database Constraints:**
- `NOT NULL` - Required field
- `VARCHAR(255)` - Max 255 characters (for hash)

**Frontend Validation Rules:**
```javascript
✅ Minimum length: 8 characters (security best practice)
✅ Maximum length: 128 characters (before hashing)
✅ Must contain:
   - At least 1 uppercase letter (A-Z)
   - At least 1 lowercase letter (a-z)
   - At least 1 number (0-9)
   - At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
✅ Confirm password: Must match password field
❌ No common passwords (password123, 12345678)
❌ No spaces allowed
```

**Password Strength Indicator:**
- Weak: Only letters or only numbers
- Medium: Letters + numbers
- Strong: Letters + numbers + special characters
- Very Strong: All requirements + 12+ characters

**Error Messages:**
- "Password must be at least 8 characters long"
- "Password must contain uppercase, lowercase, number, and special character"
- "Passwords do not match"
- "Password is too weak. Try adding more characters or symbols"

---

### 3. **FULL NAME VALIDATION** 👤

**Database Constraints:**
- `NOT NULL` - Required field
- `VARCHAR(255)` - Max 255 characters

**Frontend Validation Rules:**
```javascript
✅ Minimum length: 2 characters
✅ Maximum length: 255 characters
✅ Pattern: /^[a-zA-Z\s'-]+$/
✅ Must contain at least first and last name (2 words)
❌ No numbers allowed
❌ No special characters except: space, hyphen (-), apostrophe (')
```

**Error Messages:**
- "Please enter your full name (first and last name)"
- "Name can only contain letters, spaces, hyphens, and apostrophes"
- "Name must be between 2 and 255 characters"

---

### 4. **PHONE NUMBER VALIDATION** 📱

**Database Constraints:**
- `VARCHAR(20)` - Max 20 characters
- Optional field (can be NULL)

**Frontend Validation Rules:**
```javascript
✅ Format options:
   - +1234567890 (international)
   - (123) 456-7890 (US format)
   - 123-456-7890 (US format)
   - 1234567890 (plain)
✅ Length: 10-15 digits (excluding formatting)
✅ Pattern: /^\+?[\d\s\-()]+$/
✅ Country code: Optional + prefix
❌ Letters not allowed
❌ Special chars except: +, -, (), space
```

**Error Messages:**
- "Please enter a valid phone number"
- "Phone number must be 10-15 digits"
- "Invalid phone format. Use: +1234567890 or (123) 456-7890"

---

### 5. **LICENSE NUMBER VALIDATION** (Driver Only) 🪪

**Database Constraints:**
- `UNIQUE` - Must not already exist
- `NOT NULL` - Required for drivers
- `VARCHAR(50)` - Max 50 characters

**Frontend Validation Rules:**
```javascript
✅ Length: 5-50 characters
✅ Format options (country-specific):
   US: 
   - Pattern: /^[A-Z]{1,2}\d{5,8}$/
   - Example: DL-1234567890, A1234567
   
   India:
   - Pattern: /^[A-Z]{2}\d{2}\s?\d{11}$/
   - Example: DL-1420110012345, MH0220110012345
   
   General:
   - Alphanumeric with optional hyphens/spaces
   - Pattern: /^[A-Z0-9\s\-]{5,50}$/
   
✅ Uniqueness: Check if license already registered (backend)
✅ Must be uppercase
❌ No special characters except: hyphen (-), space
```

**Error Messages:**
- "Please enter a valid license number"
- "License number must be 5-50 characters"
- "License format: DL-1234567890 or MH0220110012345"
- "This license number is already registered"
- "License number must contain only letters, numbers, and hyphens"

---

### 6. **VEHICLE TYPE VALIDATION** (Driver Only) 🚑

**Database Constraints:**
- `NOT NULL` - Required for drivers
- `VARCHAR(50)` - Max 50 characters

**Frontend Validation Rules:**
```javascript
✅ Allowed values (dropdown):
   - "Ambulance" (Basic Life Support)
   - "Advanced Life Support Ambulance"
   - "Neonatal Ambulance"
   - "Air Ambulance"
   - "Medical Van"
   - "Emergency Response Vehicle"
   - "Other"
✅ Length: 3-50 characters
✅ Pattern: /^[a-zA-Z\s\-]+$/
❌ No numbers or special characters
```

**Error Messages:**
- "Please select a vehicle type"
- "Vehicle type must be 3-50 characters"

---

### 7. **VEHICLE NUMBER VALIDATION** (Driver Only) 🚗

**Database Constraints:**
- `NOT NULL` - Required for drivers
- `VARCHAR(50)` - Max 50 characters

**Frontend Validation Rules:**
```javascript
✅ Format options (country-specific):
   US: ABC-1234 or ABC1234
   India: MH-12-AB-1234 or DL-1C-1234
   General: Alphanumeric with hyphens
   
✅ Pattern: /^[A-Z0-9\s\-]{4,20}$/
✅ Length: 4-20 characters
✅ Must be uppercase
❌ No special characters except: hyphen (-), space
```

**Error Messages:**
- "Please enter a valid vehicle number"
- "Vehicle number format: ABC-1234 or MH-12-AB-1234"
- "Vehicle number must be 4-20 characters"
- "Vehicle number must be uppercase"

---

### 8. **VEHICLE MODEL VALIDATION** (Driver Only) 🏎️

**Database Constraints:**
- `VARCHAR(100)` - Max 100 characters
- Optional field

**Frontend Validation Rules:**
```javascript
✅ Length: 0-100 characters (optional)
✅ Pattern: /^[a-zA-Z0-9\s\-.,()]+$/
✅ Examples: "Ford Transit 2022", "Mercedes-Benz Sprinter"
```

**Error Messages:**
- "Vehicle model must be less than 100 characters"

---

### 9. **EXPERIENCE YEARS VALIDATION** (Driver Only) 📅

**Database Constraints:**
- `INTEGER` - Must be whole number
- Optional field

**Frontend Validation Rules:**
```javascript
✅ Type: Integer only
✅ Range: 0-50 years
✅ Min: 0 (new drivers)
✅ Max: 50 (reasonable maximum)
❌ No negative numbers
❌ No decimals
```

**Error Messages:**
- "Experience must be between 0 and 50 years"
- "Please enter a valid number"

---

### 10. **ROLE VALIDATION** 👥

**Database Constraints:**
- `NOT NULL` - Required field
- `CHECK (role IN ('user', 'admin', 'driver'))` - Must be one of three values

**Frontend Validation Rules:**
```javascript
✅ Allowed values:
   - "user" (default)
   - "driver"
   - "admin" (not shown in UI, backend only)
✅ Must be exactly one of these values
```

---

## 🔐 SECURITY RULES

### Password Security:
```javascript
1. Hash passwords with bcrypt (10 salt rounds)
2. Never store plain text passwords
3. Validate on both frontend and backend
4. Implement rate limiting for registration attempts
5. Use HTTPS for all auth requests
```

### Input Sanitization:
```javascript
1. Trim whitespace from all inputs
2. Remove SQL injection patterns
3. Escape HTML special characters
4. Validate data types strictly
5. Implement CSRF protection
```

### Backend Validation:
```javascript
1. ALWAYS validate on backend (don't trust frontend)
2. Check uniqueness constraints (email, license)
3. Verify referential integrity
4. Implement transaction rollback on errors
5. Log failed registration attempts
```

---

## 📊 VALIDATION IMPLEMENTATION ORDER

### Priority 1 (Critical - Required Fields):
1. ✅ Email validation (format + uniqueness)
2. ✅ Password validation (strength + confirmation)
3. ✅ Full name validation
4. ✅ License number validation (for drivers)

### Priority 2 (Important):
5. ✅ Phone number validation
6. ✅ Vehicle type validation (for drivers)
7. ✅ Vehicle number validation (for drivers)

### Priority 3 (Nice to Have):
8. ✅ Vehicle model validation
9. ✅ Experience years validation

---

## 🎨 UI/UX RECOMMENDATIONS

### Real-time Validation:
```javascript
✅ Show validation errors on blur (when user leaves field)
✅ Show success checkmark for valid fields
✅ Display password strength meter
✅ Inline error messages below each field
✅ Disable submit button until form is valid
```

### Visual Indicators:
```javascript
✅ Green checkmark ✓ for valid fields
✅ Red X ✗ for invalid fields
✅ Yellow warning ⚠ for weak passwords
✅ Blue info ℹ for format hints
```

### Error Display:
```javascript
✅ Show specific error messages (not generic)
✅ Highlight invalid field with red border
✅ Display error icon next to field
✅ Show all errors at once (not one at a time)
✅ Scroll to first error on submit
```

---

## 📝 ERROR MESSAGE EXAMPLES

### Email:
```
❌ "Invalid email format"
✅ "Please enter a valid email address (example@domain.com)"

❌ "Email exists"
✅ "This email is already registered. Please login or use a different email"
```

### Password:
```
❌ "Invalid password"
✅ "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"

❌ "Passwords don't match"
✅ "Confirm password must match the password above"
```

### License Number:
```
❌ "Invalid license"
✅ "Please enter a valid license number in format: DL-1234567890"

❌ "License exists"
✅ "This license number is already registered. Please contact support if this is an error"
```

---

## 🔍 BACKEND VALIDATION (SQL Rules)

### Database-Level Checks:
```sql
-- Uniqueness checks
SELECT COUNT(*) FROM users WHERE email = $1;
SELECT COUNT(*) FROM driver_profiles WHERE license_number = $1;

-- Length checks
LENGTH(email) <= 255
LENGTH(password_hash) <= 255
LENGTH(full_name) <= 255
LENGTH(phone) <= 20
LENGTH(license_number) <= 50
LENGTH(vehicle_type) <= 50
LENGTH(vehicle_number) <= 50
LENGTH(vehicle_model) <= 100

-- Role validation
role IN ('user', 'admin', 'driver')

-- Status validation (for drivers)
status IN ('available', 'busy', 'offline')

-- NOT NULL checks
email IS NOT NULL
password_hash IS NOT NULL
role IS NOT NULL
full_name IS NOT NULL
-- For drivers:
license_number IS NOT NULL (if role='driver')
vehicle_type IS NOT NULL (if role='driver')
vehicle_number IS NOT NULL (if role='driver')
```

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Validation Functions
```typescript
// validation.ts
export const validateEmail = (email: string) => { ... }
export const validatePassword = (password: string) => { ... }
export const validateLicense = (license: string) => { ... }
// ... etc
```

### Step 2: Add Real-time Validation
```typescript
// In form component
const [errors, setErrors] = useState({});

const handleBlur = (field: string, value: string) => {
  const error = validateField(field, value);
  setErrors({ ...errors, [field]: error });
};
```

### Step 3: Update Submit Handler
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate all fields
  const validationErrors = validateAllFields(formData);
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return; // Don't submit
  }
  
  // Continue with API call...
};
```

### Step 4: Add Backend Validation
```javascript
// In registration controller
const validateRegistration = (data) => {
  const errors = [];
  
  // Check email format
  if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Check password strength
  if (!isStrongPassword(data.password)) {
    errors.push('Password too weak');
  }
  
  // Check license (for drivers)
  if (data.role === 'driver' && !isValidLicense(data.license_number)) {
    errors.push('Invalid license number');
  }
  
  return errors;
};
```

---

## 📚 SUMMARY OF REQUIRED VALIDATIONS

| Field | Required | Unique | Min Length | Max Length | Pattern | Type |
|-------|----------|--------|------------|------------|---------|------|
| Email | ✅ Yes | ✅ Yes | 5 | 255 | Email format | String |
| Password | ✅ Yes | ❌ No | 8 | 128 | Strong password | String |
| Full Name | ✅ Yes | ❌ No | 2 | 255 | Letters only | String |
| Phone | ❌ No | ❌ No | 10 | 20 | Phone format | String |
| License # | ✅ Driver | ✅ Yes | 5 | 50 | License format | String |
| Vehicle Type | ✅ Driver | ❌ No | 3 | 50 | Letters only | String |
| Vehicle # | ✅ Driver | ❌ No | 4 | 20 | Alphanumeric | String |
| Vehicle Model | ❌ No | ❌ No | 0 | 100 | Alphanumeric | String |
| Experience | ❌ No | ❌ No | 0 | 50 | Integer | Number |

---

## 🎯 NEXT ACTIONS

1. **Review this document** and confirm validation rules
2. **Create validation utility file** with all validation functions
3. **Update registration form** with real-time validation
4. **Add visual indicators** (checkmarks, error icons)
5. **Implement backend validation** in registration controller
6. **Test all scenarios** (valid, invalid, edge cases)
7. **Add error logging** for debugging

---

**Would you like me to implement these validations now?**

I can create:
1. ✅ Validation utility functions
2. ✅ Updated registration form with real-time validation
3. ✅ Backend validation middleware
4. ✅ Visual error indicators
5. ✅ Password strength meter
6. ✅ Format helpers and examples

Let me know which parts you'd like me to implement first!
