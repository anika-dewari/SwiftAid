"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Ambulance,
  MapPin,
  Phone,
  User,
  Heart,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function EmergencyPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    emergencyType: "",
    severity: "",
    location: "",
    description: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
  });

  const emergencyTypes = [
    { value: "cardiac", label: "Cardiac Emergency", icon: Heart, color: "text-red-500" },
    { value: "trauma", label: "Trauma/Injury", icon: AlertTriangle, color: "text-orange-500" },
    { value: "respiratory", label: "Breathing Problems", icon: AlertTriangle, color: "text-blue-500" },
    { value: "stroke", label: "Stroke", icon: AlertTriangle, color: "text-purple-500" },
    { value: "other", label: "Other Emergency", icon: AlertTriangle, color: "text-gray-500" },
  ];

  const severityLevels = [
    { value: "critical", label: "Critical", description: "Life-threatening", color: "bg-red-500 hover:bg-red-600" },
    { value: "urgent", label: "Urgent", description: "Serious condition", color: "bg-orange-500 hover:bg-orange-600" },
    { value: "normal", label: "Normal", description: "Stable condition", color: "bg-green-500 hover:bg-green-600" },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep(4);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-red-600">Emergency Portal</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium">Emergency Hotline</p>
              <p className="text-lg font-bold text-red-600">911</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Tech Hero */}
      <BackgroundPaths 
        className="h-[50vh] flex items-center justify-center w-full flex-col px-4 mb-8"
        svgOptions={{ duration: 6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 text-2xl md:text-4xl lg:text-6xl font-sans py-2 md:py-6 relative z-20 font-bold tracking-tight">
            Critical Response, <br /> Advanced Systems.
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-300 text-center mb-6">
            Every second counts. Our intelligent dispatch system connects you 
            to the nearest available emergency resources in real-time.
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">LIVE TRACKING</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">AI DISPATCH</span>
            </div>
          </div>
        </motion.div>
      </BackgroundPaths>

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? "bg-red-500 text-white"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Patient Information"}
              {currentStep === 2 && "Emergency Details"}
              {currentStep === 3 && "Medical Information"}
              {currentStep === 4 && "Emergency Submitted"}
            </p>
          </div>
        </motion.div>

        {/* Step 1: Patient Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>
                  Please provide basic information about the patient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Current Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter current address or location"
                    required
                  />
                  <Button variant="outline" size="sm" className="mt-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact name and phone"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.patientName || !formData.phone || !formData.location}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Emergency Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Emergency Details</span>
                </CardTitle>
                <CardDescription>
                  Describe the emergency situation and severity level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Emergency Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {emergencyTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={formData.emergencyType === type.value ? "default" : "outline"}
                        className="h-16 justify-start space-x-3"
                        onClick={() => handleInputChange("emergencyType", type.value)}
                      >
                        <type.icon className={`h-5 w-5 ${type.color}`} />
                        <span>{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Severity Level *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {severityLevels.map((level) => (
                      <Button
                        key={level.value}
                        variant={formData.severity === level.value ? "default" : "outline"}
                        className={`h-20 flex-col space-y-1 ${
                          formData.severity === level.value ? level.color : ""
                        }`}
                        onClick={() => handleInputChange("severity", level.value)}
                      >
                        <span className="font-medium">{level.label}</span>
                        <span className="text-xs opacity-75">{level.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full h-20 px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the emergency situation in detail..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.emergencyType || !formData.severity}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Medical Information */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Medical Information</span>
                </CardTitle>
                <CardDescription>
                  Medical history information for emergency responders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Input
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="List any known allergies (medications, food, etc.)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Input
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    placeholder="List current medications and dosages"
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">Ready to Submit</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        By submitting this form, emergency services will be immediately dispatched to your location.
                        Make sure all information is accurate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Dispatching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Ambulance className="h-4 w-4" />
                        <span>Submit Emergency</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
                  Emergency Submitted Successfully
                </h2>
                
                <div className="bg-white/50 rounded-lg p-4 mb-6">
                  <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                    Emergency ID: EMG-{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimated arrival time: 4-6 minutes
                  </p>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Emergency services have been dispatched to your location. 
                  An ambulance is on the way. Please stay on the line if contacted.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/dashboard">
                      View Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Return Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}