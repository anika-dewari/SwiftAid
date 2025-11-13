// Validation utility functions for SwiftAid registration forms

/**
 * Email validation
 * - Valid email format
 * - Max 255 characters
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  if (email.length > 255) {
    return 'Email must not exceed 255 characters';
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address (example@domain.com)';
  }
  
  return null;
};

/**
 * Password validation
 * - Min 8 characters
 * - Must contain: uppercase, lowercase, number, special character
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (password.length > 128) {
    return 'Password must not exceed 128 characters';
  }
  
  if (password.includes(' ')) {
    return 'Password cannot contain spaces';
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!hasLowercase) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!hasNumber) {
    return 'Password must contain at least one number';
  }
  
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character (!@#$%^&*...)';
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password123', '12345678', 'qwerty123', 'abc12345'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return 'This password is too common. Please choose a stronger password';
  }
  
  return null;
};

/**
 * Password strength calculator
 * Returns: weak, medium, strong, very-strong
 */
export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  percentage: number;
  color: string;
} => {
  if (!password) {
    return { strength: 'weak', percentage: 0, color: 'bg-gray-300' };
  }
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 20;
  
  // Bonus for mixing characters
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (varietyCount >= 3) score += 10;
  if (varietyCount === 4) score += 10;
  
  // Determine strength level
  if (score < 40) {
    return { strength: 'weak', percentage: score, color: 'bg-red-500' };
  } else if (score < 60) {
    return { strength: 'medium', percentage: score, color: 'bg-yellow-500' };
  } else if (score < 80) {
    return { strength: 'strong', percentage: score, color: 'bg-blue-500' };
  } else {
    return { strength: 'very-strong', percentage: score, color: 'bg-green-500' };
  }
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Full name validation
 * - 2-255 characters
 * - Letters, spaces, hyphens, apostrophes only
 * - Must have at least 2 words
 */
export const validateFullName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'Full name is required';
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (trimmedName.length > 255) {
    return 'Name must not exceed 255 characters';
  }
  
  const namePattern = /^[a-zA-Z\s'\-]+$/;
  if (!namePattern.test(trimmedName)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    return 'Please enter your full name (first and last name)';
  }
  
  return null;
};

/**
 * Phone number validation
 * - 10-15 digits
 * - Various formats supported
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return null; // Phone is optional
  }
  
  // Remove formatting characters
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  
  // Check if it starts with + (international format)
  const hasPlus = phone.startsWith('+');
  const cleanDigits = digitsOnly.replace('+', '');
  
  if (!/^\d+$/.test(cleanDigits)) {
    return 'Phone number can only contain digits, spaces, hyphens, and parentheses';
  }
  
  if (cleanDigits.length < 10 || cleanDigits.length > 15) {
    return 'Phone number must be 10-15 digits';
  }
  
  return null;
};

/**
 * License number validation (for drivers)
 * - 5-50 characters
 * - Alphanumeric with hyphens and spaces
 * - Must be uppercase
 */
export const validateLicenseNumber = (license: string): string | null => {
  if (!license || license.trim() === '') {
    return 'License number is required for drivers';
  }
  
  const trimmedLicense = license.trim();
  
  if (trimmedLicense.length < 5) {
    return 'License number must be at least 5 characters';
  }
  
  if (trimmedLicense.length > 50) {
    return 'License number must not exceed 50 characters';
  }
  
  const licensePattern = /^[A-Z0-9\s\-]+$/;
  if (!licensePattern.test(trimmedLicense)) {
    return 'License number can only contain uppercase letters, numbers, spaces, and hyphens';
  }
  
  // Check if it's uppercase
  if (trimmedLicense !== trimmedLicense.toUpperCase()) {
    return 'License number must be in uppercase';
  }
  
  // Check common formats
  const usFormat = /^[A-Z]{1,2}\d{5,8}$/;
  const indiaFormat = /^[A-Z]{2}\d{2}\s?\d{11}$/;
  const generalFormat = /^[A-Z0-9\s\-]{5,50}$/;
  
  if (!usFormat.test(trimmedLicense.replace(/[\s\-]/g, '')) && 
      !indiaFormat.test(trimmedLicense) && 
      !generalFormat.test(trimmedLicense)) {
    return 'Please enter a valid license number (e.g., DL-1234567890 or MH0220110012345)';
  }
  
  return null;
};

/**
 * Vehicle type validation (for drivers)
 * - 3-50 characters
 * - Letters, spaces, hyphens only
 */
export const validateVehicleType = (vehicleType: string): string | null => {
  if (!vehicleType || vehicleType.trim() === '') {
    return 'Vehicle type is required for drivers';
  }
  
  const trimmedType = vehicleType.trim();
  
  if (trimmedType.length < 3) {
    return 'Vehicle type must be at least 3 characters';
  }
  
  if (trimmedType.length > 50) {
    return 'Vehicle type must not exceed 50 characters';
  }
  
  const typePattern = /^[a-zA-Z\s\-]+$/;
  if (!typePattern.test(trimmedType)) {
    return 'Vehicle type can only contain letters, spaces, and hyphens';
  }
  
  return null;
};

/**
 * Vehicle number validation (for drivers)
 * - 4-20 characters
 * - Alphanumeric with hyphens and spaces
 * - Must be uppercase
 */
export const validateVehicleNumber = (vehicleNumber: string): string | null => {
  if (!vehicleNumber || vehicleNumber.trim() === '') {
    return 'Vehicle number is required for drivers';
  }
  
  const trimmedNumber = vehicleNumber.trim();
  
  if (trimmedNumber.length < 4) {
    return 'Vehicle number must be at least 4 characters';
  }
  
  if (trimmedNumber.length > 20) {
    return 'Vehicle number must not exceed 20 characters';
  }
  
  const numberPattern = /^[A-Z0-9\s\-]+$/;
  if (!numberPattern.test(trimmedNumber)) {
    return 'Vehicle number can only contain uppercase letters, numbers, spaces, and hyphens';
  }
  
  // Check if it's uppercase
  if (trimmedNumber !== trimmedNumber.toUpperCase()) {
    return 'Vehicle number must be in uppercase';
  }
  
  return null;
};

/**
 * Vehicle model validation (for drivers)
 * - Optional
 * - Max 100 characters
 */
export const validateVehicleModel = (vehicleModel: string): string | null => {
  if (!vehicleModel || vehicleModel.trim() === '') {
    return null; // Optional field
  }
  
  const trimmedModel = vehicleModel.trim();
  
  if (trimmedModel.length > 100) {
    return 'Vehicle model must not exceed 100 characters';
  }
  
  const modelPattern = /^[a-zA-Z0-9\s\-.,()]+$/;
  if (!modelPattern.test(trimmedModel)) {
    return 'Vehicle model contains invalid characters';
  }
  
  return null;
};

/**
 * Experience years validation (for drivers)
 * - 0-50 range
 * - Integer only
 */
export const validateExperienceYears = (years: string): string | null => {
  if (!years || years.trim() === '') {
    return null; // Optional field
  }
  
  const yearsNum = parseInt(years);
  
  if (isNaN(yearsNum)) {
    return 'Experience must be a valid number';
  }
  
  if (yearsNum < 0) {
    return 'Experience cannot be negative';
  }
  
  if (yearsNum > 50) {
    return 'Experience cannot exceed 50 years';
  }
  
  // Check if it's an integer
  if (years.includes('.')) {
    return 'Experience must be a whole number';
  }
  
  return null;
};

/**
 * Validate all user fields at once
 */
export const validateUserForm = (formData: {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
}) => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  const nameError = validateFullName(formData.full_name);
  if (nameError) errors.full_name = nameError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  return errors;
};

/**
 * Validate all driver fields at once
 */
export const validateDriverForm = (formData: {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
  license_number: string;
  vehicle_type: string;
  vehicle_number: string;
  vehicle_model: string;
  experience_years: string;
}) => {
  const errors: Record<string, string> = {};
  
  // User fields
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  const nameError = validateFullName(formData.full_name);
  if (nameError) errors.full_name = nameError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  // Driver-specific fields
  const licenseError = validateLicenseNumber(formData.license_number);
  if (licenseError) errors.license_number = licenseError;
  
  const vehicleTypeError = validateVehicleType(formData.vehicle_type);
  if (vehicleTypeError) errors.vehicle_type = vehicleTypeError;
  
  const vehicleNumberError = validateVehicleNumber(formData.vehicle_number);
  if (vehicleNumberError) errors.vehicle_number = vehicleNumberError;
  
  const vehicleModelError = validateVehicleModel(formData.vehicle_model);
  if (vehicleModelError) errors.vehicle_model = vehicleModelError;
  
  const experienceError = validateExperienceYears(formData.experience_years);
  if (experienceError) errors.experience_years = experienceError;
  
  return errors;
};
