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
  Ambulance,
  MapPin,
  Users,
  Activity,
  Clock,
  Fuel,
  Settings,
  Phone,
  Navigation,
  Heart,
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function AmbulanceManagement() {
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const ambulances = [
    {
      id: "AMB-001",
      vehicle: "Mercedes Sprinter",
      driver: "John Smith",
      status: "available",
      location: "Station A",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      fuel: 85,
      equipment: ["Defibrillator", "Oxygen", "Stretcher", "Medical Kit"],
      lastUpdate: "2 min ago",
      responseTime: "4.2 min",
      totalCalls: 142
    },
    {
      id: "AMB-002", 
      vehicle: "Ford Transit",
      driver: "Sarah Johnson",
      status: "en-route",
      location: "Main St & 5th Ave",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      fuel: 62,
      equipment: ["Defibrillator", "Oxygen", "Stretcher", "IV Kit"],
      lastUpdate: "1 min ago",
      responseTime: "3.8 min",
      totalCalls: 89
    },
    {
      id: "AMB-003",
      vehicle: "Chevrolet Express",
      driver: "Mike Wilson",
      status: "at-hospital",
      location: "Central Medical Center",
      coordinates: { lat: 40.7831, lng: -73.9712 },
      fuel: 78,
      equipment: ["Defibrillator", "Oxygen", "Stretcher", "Cardiac Monitor"],
      lastUpdate: "5 min ago",
      responseTime: "5.1 min",
      totalCalls: 203
    },
    {
      id: "AMB-004",
      vehicle: "Mercedes Sprinter",
      driver: "Lisa Brown",
      status: "maintenance",
      location: "Repair Shop",
      coordinates: { lat: 40.7282, lng: -74.0776 },
      fuel: 95,
      equipment: ["Basic Kit Only"],
      lastUpdate: "30 min ago",
      responseTime: "N/A",
      totalCalls: 156
    },
    {
      id: "AMB-005",
      vehicle: "Ford Transit",
      driver: "David Lee",
      status: "available",
      location: "Station B", 
      coordinates: { lat: 40.7505, lng: -73.9934 },
      fuel: 91,
      equipment: ["Defibrillator", "Oxygen", "Stretcher", "Trauma Kit"],
      lastUpdate: "1 min ago",
      responseTime: "3.9 min",
      totalCalls: 98
    },
    {
      id: "AMB-006",
      vehicle: "Chevrolet Express",
      driver: "Emma Davis",
      status: "busy",
      location: "Emergency Scene",
      coordinates: { lat: 40.7614, lng: -73.9776 },
      fuel: 44,
      equipment: ["Defibrillator", "Oxygen", "Stretcher", "Advanced Kit"],
      lastUpdate: "3 min ago",
      responseTime: "4.7 min", 
      totalCalls: 167
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "en-route": return "bg-blue-500";
      case "at-hospital": return "bg-yellow-500";
      case "busy": return "bg-orange-500";
      case "maintenance": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return Activity;
      case "en-route": return Navigation;
      case "at-hospital": return Heart;
      case "busy": return Clock;
      case "maintenance": return Settings;
      default: return Ambulance;
    }
  };

  const filteredAmbulances = filterStatus === "all" 
    ? ambulances 
    : ambulances.filter(amb => amb.status === filterStatus);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 animate-float">
                <Ambulance className="h-5 w-5 text-white" />
              </div>
              <GradientText from="blue-500" to="indigo-500" className="text-2xl">
                Fleet Management
              </GradientText>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton className="animate-glow bg-blue-500 hover:bg-blue-600 text-white">
              <MapPin className="mr-2 h-4 w-4" />
              Live Map
            </AnimatedButton>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { title: "Total Fleet", value: "24", icon: Ambulance, color: "blue", change: "+2" },
            { title: "Available", value: "18", icon: Activity, color: "green", change: "+1" },
            { title: "In Service", value: "4", icon: Clock, color: "orange", change: "-1" },
            { title: "Avg Response", value: "4.2min", icon: Navigation, color: "purple", change: "-0.3min" }
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <FloatingCard delay={index * 0.1}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') && stat.title === 'Avg Response' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last hour
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by status:</span>
          </div>
          {["all", "available", "en-route", "at-hospital", "busy", "maintenance"].map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`capitalize hover-lift ${
                filterStatus === status 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-white/50 hover:bg-white/70 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
              }`}
            >
              {status.replace("-", " ")}
            </Button>
          ))}
        </motion.div>

        {/* Ambulance Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAmbulances.map((ambulance, index) => {
            const StatusIcon = getStatusIcon(ambulance.status);
            return (
              <motion.div
                key={ambulance.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`relative overflow-hidden border-2 transition-all duration-300 hover-lift glass ${
                  selectedAmbulance === ambulance.id ? "ring-2 ring-blue-500 border-blue-500" : ""
                }`}>
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 w-3 h-3 ${getStatusColor(ambulance.status)} rounded-bl-lg animate-pulse`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Ambulance className="h-5 w-5 text-blue-500" />
                        <span>{ambulance.id}</span>
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${getStatusColor(ambulance.status)}`}>
                        <StatusIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{ambulance.vehicle}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Driver Info */}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{ambulance.driver}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ambulance.location}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(ambulance.status)}`}>
                        {ambulance.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{ambulance.lastUpdate}</span>
                    </div>

                    {/* Fuel Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Fuel className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Fuel</span>
                        </div>
                        <span className="text-sm font-medium">{ambulance.fuel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            ambulance.fuel > 60 ? "bg-green-500" : 
                            ambulance.fuel > 30 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${ambulance.fuel}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-500">{ambulance.responseTime}</p>
                        <p className="text-xs text-muted-foreground">Avg Response</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-500">{ambulance.totalCalls}</p>
                        <p className="text-xs text-muted-foreground">Total Calls</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => setSelectedAmbulance(
                          selectedAmbulance === ambulance.id ? null : ambulance.id
                        )}
                        className="flex-1 hover-lift"
                      >
                        {selectedAmbulance === ambulance.id ? "Deselect" : "Select"}
                      </Button>
                      <Button className="hover-lift">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Ambulance Details */}
        {selectedAmbulance && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 z-50"
          >
            <FloatingCard className="p-6 bg-white/95 dark:bg-gray-900/95">
              {(() => {
                const selected = ambulances.find(amb => amb.id === selectedAmbulance);
                if (!selected) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">
                        <GradientText>{selected.id} - {selected.vehicle}</GradientText>
                      </h3>
                      <Button 
                        onClick={() => setSelectedAmbulance(null)}
                        className="hover-lift"
                      >
                        ✕
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Equipment</h4>
                        <div className="flex flex-wrap gap-1">
                          {selected.equipment.map((item, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-sm text-muted-foreground">{selected.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {selected.coordinates.lat.toFixed(4)}, {selected.coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <AnimatedButton className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                          Track Live
                        </AnimatedButton>
                        <AnimatedButton className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                          Dispatch
                        </AnimatedButton>
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