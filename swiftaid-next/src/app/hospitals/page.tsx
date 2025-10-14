"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GradientText } from "@/components/ui/gradient-text";
import { FloatingCard } from "@/components/ui/floating-card";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Hospital,
  Bed,
  Users,
  Heart,
  Activity,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Star,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

export default function HospitalManagement() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const hospitals = [
    {
      id: "HSP-001",
      name: "Central Medical Center",
      location: "123 Main Street, Downtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      phone: "(555) 123-4567",
      type: "General Hospital",
      rating: 4.8,
      totalBeds: 450,
      availableBeds: 67,
      departments: [
        { name: "Emergency", beds: 24, available: 8, specialty: "emergency" },
        { name: "ICU", beds: 50, available: 12, specialty: "critical" },
        { name: "Surgery", beds: 30, available: 5, specialty: "surgery" },
        { name: "Cardiology", beds: 40, available: 15, specialty: "cardiac" },
        { name: "Pediatrics", beds: 60, available: 18, specialty: "pediatric" },
        { name: "General", beds: 246, available: 9, specialty: "general" }
      ],
      status: "operational",
      distance: "2.3 km",
      avgWaitTime: "15 min",
      specialties: ["Trauma Center", "Cardiac Surgery", "Pediatric Care", "Emergency Medicine"]
    },
    {
      id: "HSP-002",
      name: "St. Mary's Hospital",
      location: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      phone: "(555) 234-5678",
      type: "Specialty Hospital",
      rating: 4.6,
      totalBeds: 280,
      availableBeds: 43,
      departments: [
        { name: "Emergency", beds: 18, available: 6, specialty: "emergency" },
        { name: "ICU", beds: 35, available: 8, specialty: "critical" },
        { name: "Surgery", beds: 25, available: 3, specialty: "surgery" },
        { name: "Maternity", beds: 50, available: 22, specialty: "maternity" },
        { name: "General", beds: 152, available: 4, specialty: "general" }
      ],
      status: "operational", 
      distance: "1.8 km",
      avgWaitTime: "12 min",
      specialties: ["Maternity Care", "Women's Health", "Family Medicine", "Rehabilitation"]
    },
    {
      id: "HSP-003",
      name: "City Emergency Hospital",
      location: "789 Pine Street, East Side",
      coordinates: { lat: 40.7282, lng: -74.0776 },
      phone: "(555) 345-6789",
      type: "Emergency Hospital",
      rating: 4.9,
      totalBeds: 350,
      availableBeds: 89,
      departments: [
        { name: "Emergency", beds: 40, available: 25, specialty: "emergency" },
        { name: "Trauma ICU", beds: 30, available: 18, specialty: "critical" },
        { name: "Surgery", beds: 45, available: 12, specialty: "surgery" },
        { name: "Burn Unit", beds: 20, available: 8, specialty: "burn" },
        { name: "General", beds: 215, available: 26, specialty: "general" }
      ],
      status: "operational",
      distance: "3.1 km", 
      avgWaitTime: "8 min",
      specialties: ["Level I Trauma", "Burn Center", "Emergency Surgery", "Critical Care"]
    },
    {
      id: "HSP-004",
      name: "Metropolitan Heart Institute",
      location: "321 Elm Drive, West End",
      coordinates: { lat: 40.7614, lng: -73.9776 },
      phone: "(555) 456-7890",
      type: "Cardiac Specialty",
      rating: 4.7,
      totalBeds: 200,
      availableBeds: 28,
      departments: [
        { name: "Cardiac ICU", beds: 25, available: 6, specialty: "cardiac" },
        { name: "Cardiac Surgery", beds: 20, available: 3, specialty: "surgery" },
        { name: "Catheterization Lab", beds: 15, available: 8, specialty: "cardiac" },
        { name: "Recovery", beds: 140, available: 11, specialty: "recovery" }
      ],
      status: "operational",
      distance: "4.2 km",
      avgWaitTime: "20 min",
      specialties: ["Cardiac Surgery", "Interventional Cardiology", "Heart Transplant", "Vascular Surgery"]
    }
  ];

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-500 bg-red-50 dark:bg-red-950/20";
    if (percentage >= 60) return "text-orange-500 bg-orange-50 dark:bg-orange-950/20";
    return "text-green-500 bg-green-50 dark:bg-green-950/20";
  };

  const getDepartmentIcon = (specialty: string) => {
    switch (specialty) {
      case "emergency": return AlertTriangle;
      case "critical": return Activity;
      case "cardiac": return Heart;
      case "surgery": return Stethoscope;
      case "pediatric": return Users;
      case "maternity": return Heart;
      case "burn": return AlertTriangle;
      default: return Bed;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 150 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Button className="hover-lift">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500 animate-float">
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <GradientText from="green-500" to="blue-500" className="text-2xl">
                Hospital Network
              </GradientText>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton className="animate-glow bg-green-500 hover:bg-green-600 text-white">
              <MapPin className="mr-2 h-4 w-4" />
              Network Map
            </AnimatedButton>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Network Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { 
              title: "Total Hospitals", 
              value: "12", 
              icon: Hospital, 
              color: "blue",
              detail: "All operational",
              change: "+1"
            },
            { 
              title: "Available Beds", 
              value: "227", 
              icon: Bed, 
              color: "green",
              detail: "1,280 total beds",
              change: "+15"
            },
            { 
              title: "Avg Wait Time", 
              value: "14min", 
              icon: Clock, 
              color: "orange",
              detail: "Across network",
              change: "-2min"
            },
            { 
              title: "Network Rating", 
              value: "4.7★", 
              icon: Star, 
              color: "purple",
              detail: "Patient satisfaction",
              change: "+0.1"
            }
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <FloatingCard delay={index * 0.1}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.detail}</p>
                      <p className={`text-xs mt-1 ${stat.change.startsWith('+') || stat.change.includes('-2min') || stat.change.includes('+0.1') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-950/20 animate-pulse`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                </CardContent>
              </FloatingCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Hospital Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {hospitals.map((hospital, index) => {
            const occupancyRate = ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100;
            return (
              <motion.div
                key={hospital.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover-lift glass ${
                  selectedHospital === hospital.id ? "ring-2 ring-green-500 border-green-500" : ""
                }`}>
                  {/* Status Indicator */}
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-bl-lg animate-pulse" />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2 mb-2">
                          <Hospital className="h-5 w-5 text-green-500" />
                          <span className="text-lg">{hospital.name}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{hospital.rating}</span>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                            {hospital.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                          hospital.status === "operational" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>
                          {hospital.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Location & Contact */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{hospital.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{hospital.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{hospital.distance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bed Capacity Overview */}
                    <div className="space-y-3 p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Bed className="h-4 w-4" />
                          <span>Bed Capacity</span>
                        </h4>
                        <div className={`px-2 py-1 text-xs font-medium rounded ${getCapacityColor(occupancyRate)}`}>
                          {occupancyRate.toFixed(0)}% occupied
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Available: <span className="font-bold text-green-600">{hospital.availableBeds}</span></span>
                        <span>Total: <span className="font-bold">{hospital.totalBeds}</span></span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${(hospital.availableBeds / hospital.totalBeds) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Departments Grid */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Departments</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {hospital.departments.slice(0, 4).map((dept, idx) => {
                          const DeptIcon = getDepartmentIcon(dept.specialty);
                          const availability = (dept.available / dept.beds) * 100;
                          
                          return (
                            <motion.div
                              key={dept.name}
                              className="p-3 border rounded-lg bg-white/20 dark:bg-gray-800/20 hover-lift"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <DeptIcon className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">{dept.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span className="text-green-600 font-medium">{dept.available}</span>
                                <span>/{dept.beds} available</span>
                              </div>
                              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full transition-all duration-300 ${
                                    availability > 50 ? "bg-green-500" : 
                                    availability > 20 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${availability}%` }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <p className="text-lg font-bold text-orange-500">{hospital.avgWaitTime}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-lg font-bold text-green-500">{hospital.specialties.length}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Specialties</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => setSelectedHospital(
                          selectedHospital === hospital.id ? null : hospital.id
                        )}
                        className="flex-1 hover-lift"
                      >
                        {selectedHospital === hospital.id ? "Hide Details" : "View Details"}
                      </Button>
                      <Button className="hover-lift">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <AnimatedButton className="bg-blue-500 hover:bg-blue-600 text-white">
                        <MapPin className="h-4 w-4" />
                      </AnimatedButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Hospital Detailed View */}
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mt-6"
          >
            <FloatingCard className="p-6">
              {(() => {
                const selected = hospitals.find(h => h.id === selectedHospital);
                if (!selected) return null;
                
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">
                        <GradientText from="green-500" to="blue-500">
                          {selected.name} - Detailed View
                        </GradientText>
                      </h2>
                      <Button 
                        onClick={() => setSelectedHospital(null)}
                        className="hover-lift"
                      >
                        ✕
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* All Departments */}
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Bed className="h-5 w-5 text-blue-500" />
                            <span>All Departments</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selected.departments.map((dept, idx) => {
                            const DeptIcon = getDepartmentIcon(dept.specialty);
                            const availability = (dept.available / dept.beds) * 100;
                            
                            return (
                              <motion.div
                                key={dept.name}
                                className="flex items-center justify-between p-3 border rounded-lg hover-lift"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <DeptIcon className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <p className="font-medium">{dept.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {dept.available}/{dept.beds} beds available
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`px-2 py-1 text-xs font-medium rounded ${
                                    availability > 50 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : 
                                    availability > 20 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" : 
                                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  }`}>
                                    {availability.toFixed(0)}%
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </CardContent>
                      </Card>
                      
                      {/* Specialties & Contact */}
                      <div className="space-y-4">
                        <Card className="glass">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Stethoscope className="h-5 w-5 text-green-500" />
                              <span>Specialties</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                              {selected.specialties.map((specialty, idx) => (
                                <motion.div
                                  key={specialty}
                                  className="p-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded text-center text-sm font-medium"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  {specialty}
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="glass">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Phone className="h-5 w-5 text-purple-500" />
                              <span>Quick Actions</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <AnimatedButton className="bg-green-500 hover:bg-green-600 text-white w-full">
                                Call Hospital
                              </AnimatedButton>
                              <AnimatedButton className="bg-blue-500 hover:bg-blue-600 text-white w-full">
                                Get Directions
                              </AnimatedButton>
                              <AnimatedButton className="bg-purple-500 hover:bg-purple-600 text-white w-full">
                                Book Bed
                              </AnimatedButton>
                              <AnimatedButton className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                                Send Patient
                              </AnimatedButton>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </FloatingCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}