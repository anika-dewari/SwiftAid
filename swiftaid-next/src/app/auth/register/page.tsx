'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ambulance, Mail, Lock, User, Phone, AlertCircle, Car, FileText, Award, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validatePhone,
  validateLicenseNumber,
  validateVehicleType,
  validateVehicleNumber,
  validateVehicleModel,
  validateExperienceYears,
  getPasswordStrength,
  validateUserForm,
  validateDriverForm,
} from '@/lib/validation';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'driver'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [driverDetails, setDriverDetails] = useState({
    license_number: '',
    vehicle_type: '',
    vehicle_number: '',
    vehicle_model: '',
    experience_years: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate field on blur
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // Validate individual field
  const validateField = (field: string) => {
    let error: string | null = null;
    
    const allData = { ...formData, ...driverDetails };
    
    switch (field) {
      case 'email':
        error = validateEmail(allData.email);
        break;
      case 'password':
        error = validatePassword(allData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(allData.password, allData.confirmPassword);
        break;
      case 'full_name':
        error = validateFullName(allData.full_name);
        break;
      case 'phone':
        error = validatePhone(allData.phone);
        break;
      case 'license_number':
        if (role === 'driver') {
          error = validateLicenseNumber(allData.license_number);
        }
        break;
      case 'vehicle_type':
        if (role === 'driver') {
          error = validateVehicleType(allData.vehicle_type);
        }
        break;
      case 'vehicle_number':
        if (role === 'driver') {
          error = validateVehicleNumber(allData.vehicle_number);
        }
        break;
      case 'vehicle_model':
        if (role === 'driver') {
          error = validateVehicleModel(allData.vehicle_model);
        }
        break;
      case 'experience_years':
        if (role === 'driver') {
          error = validateExperienceYears(allData.experience_years);
        }
        break;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const allData = { ...formData, ...driverDetails };
    const validationErrors = role === 'driver' 
      ? validateDriverForm(allData as any)
      : validateUserForm(allData as any);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(validationErrors).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      setError('Please fix the errors above before submitting');
      return;
    }
    
    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSend } = formData;
      
      const payload: any = {
        ...dataToSend,
        role,
      };

      if (role === 'driver') {
        payload.driverDetails = {
          ...driverDetails,
          experience_years: parseInt(driverDetails.experience_years) || 0,
        };
      }

      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (role === 'driver') {
        router.push('/driver/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Real-time validation for touched fields
    if (touched[name]) {
      validateField(name);
    }
  };

  const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDriverDetails({
      ...driverDetails,
      [name]: value,
    });
    
    // Real-time validation for touched fields
    if (touched[name]) {
      validateField(name);
    }
  };

  // Get password strength
  const passwordStrength = getPasswordStrength(formData.password);
  
  // Check if field is valid
  const isFieldValid = (field: string) => {
    return touched[field] && !errors[field];
  };
  
  // Check if field has error
  const hasFieldError = (field: string) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          className="absolute top-1/2 left-1/2 w-[300%] h-[300%] pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
          }}
          src="https://www.youtube.com/embed/MwXuv4EHDUo?autoplay=1&mute=1&loop=1&playlist=MwXuv4EHDUo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080"
          title="Ambulance Background"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-orange-900/40 to-transparent"></div>
      </div>
      
      <Card className="w-full max-w-2xl relative z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-full">
              <Ambulance className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Join SwiftAid - Emergency Dispatch System</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={role} onValueChange={(v) => setRole(v as 'user' | 'driver')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Register as a user to request emergency services
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center justify-between">
                      <span>Full Name</span>
                      {isFieldValid('full_name') && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="full_name"
                        name="full_name"
                        placeholder="John Doe"
                        className={`pl-10 pr-10 ${
                          hasFieldError('full_name') ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${
                          isFieldValid('full_name') ? 'border-green-500 focus-visible:ring-green-500' : ''
                        }`}
                        value={formData.full_name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('full_name')}
                        required
                      />
                      {hasFieldError('full_name') && (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                      {isFieldValid('full_name') && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.full_name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.full_name}
                      </p>
                    )}
                    {!errors.full_name && !touched.full_name && (
                      <p className="text-xs text-gray-500">Enter your first and last name</p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center justify-between">
                      <span>Phone Number</span>
                      {isFieldValid('phone') && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1234567890"
                        className={`pl-10 pr-10 ${
                          hasFieldError('phone') ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${
                          isFieldValid('phone') ? 'border-green-500 focus-visible:ring-green-500' : ''
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        required
                      />
                      {hasFieldError('phone') && (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                      {isFieldValid('phone') && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                    {!errors.phone && !touched.phone && (
                      <p className="text-xs text-gray-500">Format: +1234567890 or (123) 456-7890</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center justify-between">
                      <span>Email</span>
                      {isFieldValid('email') && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 pr-10 ${
                          hasFieldError('email') ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${
                          isFieldValid('email') ? 'border-green-500 focus-visible:ring-green-500' : ''
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        required
                      />
                      {hasFieldError('email') && (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                      {isFieldValid('email') && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field with Strength Meter */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center justify-between">
                      <span>Password</span>
                      {isFieldValid('password') && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-20 ${
                          hasFieldError('password') ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${
                          isFieldValid('password') ? 'border-green-500 focus-visible:ring-green-500' : ''
                        }`}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-9 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      {hasFieldError('password') && (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                      {isFieldValid('password') && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Password Strength:</span>
                          <span className={`font-semibold ${
                            passwordStrength.strength === 'weak' ? 'text-red-500' :
                            passwordStrength.strength === 'medium' ? 'text-yellow-500' :
                            passwordStrength.strength === 'strong' ? 'text-blue-500' :
                            'text-green-500'
                          }`}>
                            {passwordStrength.strength === 'weak' ? 'Weak' :
                             passwordStrength.strength === 'medium' ? 'Medium' :
                             passwordStrength.strength === 'strong' ? 'Strong' :
                             'Very Strong'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword" className="flex items-center justify-between">
                      <span>Confirm Password</span>
                      {isFieldValid('confirmPassword') && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-20 ${
                          hasFieldError('confirmPassword') ? 'border-red-500 focus-visible:ring-red-500' : ''
                        } ${
                          isFieldValid('confirmPassword') ? 'border-green-500 focus-visible:ring-green-500' : ''
                        }`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur('confirmPassword')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-9 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      {hasFieldError('confirmPassword') && (
                        <XCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                      )}
                      {isFieldValid('confirmPassword') && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="driver" className="space-y-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Register as a driver to provide emergency services
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver_full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="driver_full_name"
                        name="full_name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver_phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="driver_phone"
                        name="phone"
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver_email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="driver_email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver_password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="driver_password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="license_number"
                        name="license_number"
                        placeholder="DL-1234567890"
                        className="pl-10"
                        value={driverDetails.license_number}
                        onChange={handleDriverChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="vehicle_type"
                        name="vehicle_type"
                        placeholder="Ambulance/Van"
                        className="pl-10"
                        value={driverDetails.vehicle_type}
                        onChange={handleDriverChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle_number">Vehicle Number</Label>
                    <Input
                      id="vehicle_number"
                      name="vehicle_number"
                      placeholder="ABC-1234"
                      value={driverDetails.vehicle_number}
                      onChange={handleDriverChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle_model">Vehicle Model</Label>
                    <Input
                      id="vehicle_model"
                      name="vehicle_model"
                      placeholder="Ford Transit 2022"
                      value={driverDetails.vehicle_model}
                      onChange={handleDriverChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="experience_years"
                        name="experience_years"
                        type="number"
                        placeholder="5"
                        className="pl-10"
                        value={driverDetails.experience_years}
                        onChange={handleDriverChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-red-500 hover:text-red-600 font-semibold">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
