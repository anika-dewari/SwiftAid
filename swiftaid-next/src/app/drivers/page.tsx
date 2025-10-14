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
  User,
  Shield,
  Clock,
  Award,
  Phone,
  MapPin,
  Activity,
  Calendar,
  Star,
  ArrowLeft,
  UserCheck,
  Briefcase,
  Users,
  CheckCircle,
  AlertTriangle,
  Heart,
  Car,
} from "lucide-react";
import Link from "next/link";

export default function DriverManagement() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const drivers = [
    {
      id: "DRV-001",
      name: "Michael Rodriguez",
      avatar: "/api/placeholder/64/64",
      phone: "(555) 123-4567",
      email: "michael.r@swiftaid.com",
      status: "available",
      location: "Downtown Station",
      yearsExperience: 8,
      rating: 4.9,
      totalTrips: 1247,
      currentShift: {
        start: "06:00",
        end: "14:00",
        remaining: "2h 30m"
      },
      certifications: [
        { name: "Emergency Medical Technician", level: "EMT-B", expiry: "2025-03-15", status: "valid" },
        { name: "CPR Certification", level: "BLS", expiry: "2024-11-20", status: "valid" },
        { name: "Defensive Driving", level: "Advanced", expiry: "2024-08-10", status: "expiring" },
        { name: "Hazmat Transport", level: "Class 1", expiry: "2025-01-30", status: "valid" }
      ],
      vehicle: {
        id: "AMB-003",
        type: "Mercedes Sprinter",
        plate: "EMR-789"
      },
      weeklyStats: {
        hoursWorked: 38,
        tripsCompleted: 24,
        avgResponseTime: "4.2 min",
        patientSatisfaction: 4.8
      },
      recentTrips: [
        { time: "10:45 AM", type: "Emergency", location: "Central Park", status: "completed" },
        { time: "09:30 AM", type: "Transfer", location: "City Hospital", status: "completed" },
        { time: "08:15 AM", type: "Emergency", location: "Main Street", status: "completed" }
      ]
    },
    {
      id: "DRV-002", 
      name: "Sarah Johnson",
      avatar: "/api/placeholder/64/64",
      phone: "(555) 234-5678",
      email: "sarah.j@swiftaid.com",
      status: "on-duty",
      location: "En Route - Oak Ave",
      yearsExperience: 12,
      rating: 4.8,
      totalTrips: 2103,
      currentShift: {
        start: "14:00",
        end: "22:00",
        remaining: "5h 45m"
      },
      certifications: [
        { name: "Paramedic License", level: "EMT-P", expiry: "2025-06-12", status: "valid" },
        { name: "Advanced Cardiac Life Support", level: "ACLS", expiry: "2024-12-08", status: "valid" },
        { name: "Pediatric Advanced Life Support", level: "PALS", expiry: "2025-02-18", status: "valid" },
        { name: "Commercial Driver License", level: "CDL-B", expiry: "2026-04-20", status: "valid" }
      ],
      vehicle: {
        id: "AMB-001",
        type: "Ford F-450",
        plate: "EMR-123"
      },
      weeklyStats: {
        hoursWorked: 42,
        tripsCompleted: 31,
        avgResponseTime: "3.8 min",
        patientSatisfaction: 4.9
      },
      recentTrips: [
        { time: "11:20 AM", type: "Emergency", location: "Oak Avenue", status: "in-progress" },
        { time: "10:05 AM", type: "Emergency", location: "Hospital District", status: "completed" },
        { time: "08:45 AM", type: "Transfer", location: "Rehab Center", status: "completed" }
      ]
    },
    {
      id: "DRV-003",
      name: "David Chen",
      avatar: "/api/placeholder/64/64", 
      phone: "(555) 345-6789",
      email: "david.c@swiftaid.com",
      status: "off-duty",
      location: "Base Station",
      yearsExperience: 5,
      rating: 4.7,
      totalTrips: 892,
      currentShift: {
        start: "22:00",
        end: "06:00",
        remaining: "Off Shift"
      },
      certifications: [
        { name: "Emergency Medical Technician", level: "EMT-I", expiry: "2024-10-25", status: "expiring" },
        { name: "CPR Certification", level: "BLS", expiry: "2025-01-14", status: "valid" },
        { name: "Defensive Driving", level: "Basic", expiry: "2024-09-05", status: "expiring" },
        { name: "First Aid", level: "Standard", expiry: "2025-05-30", status: "valid" }
      ],
      vehicle: {
        id: "AMB-005",
        type: "Chevrolet Express",
        plate: "EMR-456"
      },
      weeklyStats: {
        hoursWorked: 35,
        tripsCompleted: 19,
        avgResponseTime: "5.1 min",
        patientSatisfaction: 4.6
      },
      recentTrips: [
        { time: "05:30 AM", type: "Transfer", location: "Elder Care", status: "completed" },
        { time: "04:15 AM", type: "Emergency", location: "Industrial Zone", status: "completed" },
        { time: "02:45 AM", type: "Emergency", location: "Residential", status: "completed" }
      ]
    },
    {
      id: "DRV-004",
      name: "Emily Watson",
      avatar: "/api/placeholder/64/64",
      phone: "(555) 456-7890", 
      email: "emily.w@swiftaid.com",
      status: "break",
      location: "Central Station",
      yearsExperience: 15,
      rating: 4.9,
      totalTrips: 3256,
      currentShift: {
        start: "06:00",
        end: "14:00", 
        remaining: "1h 15m"
      },
      certifications: [
        { name: "Critical Care Paramedic", level: "CCP", expiry: "2025-08-20", status: "valid" },
        { name: "Flight Paramedic", level: "FP-C", expiry: "2025-04-10", status: "valid" },
        { name: "Tactical Emergency Medical Support", level: "TEMS", expiry: "2024-12-30", status: "valid" },
        { name: "Instructor Certification", level: "EMS-I", expiry: "2026-01-15", status: "valid" }
      ],
      vehicle: {
        id: "AMB-002",
        type: "Mercedes Sprinter",
        plate: "EMR-234"
      },
      weeklyStats: {
        hoursWorked: 40,
        tripsCompleted: 28,
        avgResponseTime: "3.5 min",
        patientSatisfaction: 4.9
      },
      recentTrips: [
        { time: "10:00 AM", type: "Critical", location: "Highway 101", status: "completed" },
        { time: "08:30 AM", type: "Emergency", location: "School District", status: "completed" },
        { time: "07:20 AM", type: "Transfer", location: "Metro Hospital", status: "completed" }
      ]
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Drivers", count: drivers.length },
    { value: "available", label: "Available", count: drivers.filter(d => d.status === "available").length },
    { value: "on-duty", label: "On Duty", count: drivers.filter(d => d.status === "on-duty").length },
    { value: "off-duty", label: "Off Duty", count: drivers.filter(d => d.status === "off-duty").length },
    { value: "break", label: "On Break", count: drivers.filter(d => d.status === "break").length }
  ];

  const filteredDrivers = statusFilter === "all" 
    ? drivers 
    : drivers.filter(driver => driver.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
      case "on-duty": return "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300";
      case "off-duty": return "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
      case "break": return "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300";
      default: return "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getCertificationStatus = (status: string) => {
    switch (status) {
      case "valid": return "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
      case "expiring": return "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300";
      case "expired": return "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
      default: return "text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 animate-float">
                <Users className="h-5 w-5 text-white" />
              </div>
              <GradientText from="purple-500" to="pink-500" className="text-2xl">
                Driver Management
              </GradientText>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton className="animate-glow bg-purple-500 hover:bg-purple-600 text-white">
              <UserCheck className="mr-2 h-4 w-4" />
              Add Driver
            </AnimatedButton>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Fleet Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { 
              title: "Total Drivers", 
              value: "24", 
              icon: Users, 
              color: "purple",
              detail: "Active personnel",
              change: "+2"
            },
            { 
              title: "On Duty", 
              value: "18", 
              icon: Activity, 
              color: "blue",
              detail: "Currently working",
              change: "+3"
            },
            { 
              title: "Avg Response", 
              value: "4.1min", 
              icon: Clock, 
              color: "green",
              detail: "Network average",
              change: "-0.3min"
            },
            { 
              title: "Avg Rating", 
              value: "4.8★", 
              icon: Star, 
              color: "orange",
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
                      <p className={`text-xs mt-1 ${stat.change.startsWith('+') || stat.change.includes('-') ? 'text-green-500' : 'text-red-500'}`}>
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

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`hover-lift transition-all duration-300 ${
                statusFilter === option.value
                  ? "bg-purple-500 text-white shadow-lg"
                  : "bg-white/50 dark:bg-gray-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              }`}
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </motion.div>

        {/* Driver Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredDrivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover-lift glass ${
                selectedDriver === driver.id ? "ring-2 ring-purple-500 border-purple-500" : ""
              }`}>
                {/* Status Indicator */}
                <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg animate-pulse ${
                  driver.status === "available" ? "bg-green-500" :
                  driver.status === "on-duty" ? "bg-blue-500" :
                  driver.status === "break" ? "bg-orange-500" : "bg-gray-500"
                }`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg animate-float">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          driver.status === "available" ? "bg-green-500" :
                          driver.status === "on-duty" ? "bg-blue-500" :
                          driver.status === "break" ? "bg-orange-500" : "bg-gray-500"
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{driver.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{driver.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{driver.rating}</span>
                          <span className="text-xs text-muted-foreground">({driver.totalTrips} trips)</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                      {driver.status.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Current Info */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{driver.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span>{driver.vehicle.id}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{driver.currentShift.remaining}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{driver.yearsExperience}y exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-lg font-bold text-blue-600">{driver.weeklyStats.hoursWorked}h</p>
                      <p className="text-xs text-muted-foreground">Hours Worked</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-lg font-bold text-green-600">{driver.weeklyStats.tripsCompleted}</p>
                      <p className="text-xs text-muted-foreground">Trips This Week</p>
                    </div>
                  </div>

                  {/* Certifications Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Certifications</span>
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {driver.certifications.slice(0, 3).map((cert, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-1 text-xs rounded ${getCertificationStatus(cert.status)}`}
                        >
                          {cert.level}
                        </div>
                      ))}
                      {driver.certifications.length > 3 && (
                        <div className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                          +{driver.certifications.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recent Trips</h4>
                    <div className="space-y-1">
                      {driver.recentTrips.slice(0, 2).map((trip, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white/20 dark:bg-gray-800/20 rounded">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              trip.status === "completed" ? "bg-green-500" :
                              trip.status === "in-progress" ? "bg-blue-500 animate-pulse" :
                              "bg-gray-400"
                            }`} />
                            <span>{trip.time}</span>
                            <span className="text-muted-foreground">{trip.type}</span>
                          </div>
                          <span className="text-muted-foreground">{trip.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => setSelectedDriver(
                        selectedDriver === driver.id ? null : driver.id
                      )}
                      className="flex-1 hover-lift"
                    >
                      {selectedDriver === driver.id ? "Hide Details" : "View Details"}
                    </Button>
                    <Button className="hover-lift">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <AnimatedButton className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Activity className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Driver Detailed View */}
        {selectedDriver && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mt-6"
          >
            <FloatingCard className="p-6">
              {(() => {
                const selected = drivers.find(d => d.id === selectedDriver);
                if (!selected) return null;
                
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">
                        <GradientText from="purple-500" to="pink-500">
                          {selected.name} - Detailed Profile
                        </GradientText>
                      </h2>
                      <Button 
                        onClick={() => setSelectedDriver(null)}
                        className="hover-lift"
                      >
                        ✕
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Personal Info & Stats */}
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-purple-500" />
                            <span>Personal Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Phone:</span>
                              <span className="text-sm font-medium">{selected.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Experience:</span>
                              <span className="text-sm font-medium">{selected.yearsExperience} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Total Trips:</span>
                              <span className="text-sm font-medium">{selected.totalTrips.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Avg Response:</span>
                              <span className="text-sm font-medium">{selected.weeklyStats.avgResponseTime}</span>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">This Week</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <p className="font-bold text-blue-600">{selected.weeklyStats.hoursWorked}</p>
                                <p className="text-xs text-muted-foreground">Hours</p>
                              </div>
                              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <p className="font-bold text-green-600">{selected.weeklyStats.tripsCompleted}</p>
                                <p className="text-xs text-muted-foreground">Trips</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Certifications */}
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-green-500" />
                            <span>Certifications</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selected.certifications.map((cert, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center justify-between p-3 border rounded-lg hover-lift"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div>
                                <p className="font-medium text-sm">{cert.name}</p>
                                <p className="text-xs text-muted-foreground">{cert.level}</p>
                                <p className="text-xs text-muted-foreground">Expires: {cert.expiry}</p>
                              </div>
                              <div className={`px-2 py-1 text-xs font-medium rounded ${getCertificationStatus(cert.status)}`}>
                                {cert.status === "valid" && <CheckCircle className="h-3 w-3 inline mr-1" />}
                                {cert.status === "expiring" && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                                {cert.status.toUpperCase()}
                              </div>
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                      
                      {/* Recent Activity */}
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-orange-500" />
                            <span>Recent Activity</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selected.recentTrips.map((trip, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center justify-between p-3 border rounded-lg hover-lift"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  trip.status === "completed" ? "bg-green-500" :
                                  trip.status === "in-progress" ? "bg-blue-500 animate-pulse" :
                                  "bg-gray-400"
                                }`} />
                                <div>
                                  <p className="text-sm font-medium">{trip.time}</p>
                                  <p className="text-xs text-muted-foreground">{trip.type}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{trip.location}</p>
                                <p className={`text-xs ${
                                  trip.status === "completed" ? "text-green-600" :
                                  trip.status === "in-progress" ? "text-blue-600" :
                                  "text-gray-600"
                                }`}>
                                  {trip.status.replace('-', ' ')}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                          
                          <div className="pt-2">
                            <AnimatedButton className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                              View Full History
                            </AnimatedButton>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Quick Actions */}
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <AnimatedButton className="bg-green-500 hover:bg-green-600 text-white w-full">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Driver
                          </AnimatedButton>
                          <AnimatedButton className="bg-blue-500 hover:bg-blue-600 text-white w-full">
                            <MapPin className="mr-2 h-4 w-4" />
                            Track Location
                          </AnimatedButton>
                          <AnimatedButton className="bg-purple-500 hover:bg-purple-600 text-white w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </AnimatedButton>
                          <AnimatedButton className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                            <Shield className="mr-2 h-4 w-4" />
                            Update Certs
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
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