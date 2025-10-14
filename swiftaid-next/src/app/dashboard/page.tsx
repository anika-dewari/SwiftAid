"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Ambulance,
  Hospital,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const emergencyStats = [
    { 
      title: "Active Emergencies", 
      value: "7", 
      change: "+2 from last hour", 
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    { 
      title: "Available Ambulances", 
      value: "18/24", 
      change: "75% capacity", 
      icon: Ambulance,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    { 
      title: "Response Time", 
      value: "4.2min", 
      change: "-0.8min from avg", 
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    { 
      title: "Hospitals Online", 
      value: "12/12", 
      change: "100% network", 
      icon: Hospital,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
  ];

  const recentEmergencies = [
    { id: "EMG-001", type: "Cardiac Arrest", location: "Downtown Plaza", status: "Dispatched", time: "2 min ago", severity: "Critical" },
    { id: "EMG-002", type: "Traffic Accident", location: "Highway 101", status: "En Route", time: "5 min ago", severity: "Urgent" },
    { id: "EMG-003", type: "Chest Pain", location: "Residential Area", status: "Completed", time: "12 min ago", severity: "Normal" },
    { id: "EMG-004", type: "Fall Injury", location: "Shopping Mall", status: "Assigned", time: "15 min ago", severity: "Urgent" },
  ];

  const ambulanceStatus = [
    { id: "AMB-001", driver: "John Smith", status: "Available", location: "Station A", lastUpdate: "1 min ago" },
    { id: "AMB-002", driver: "Sarah Johnson", status: "En Route", location: "Main St & 5th", lastUpdate: "3 min ago" },
    { id: "AMB-003", driver: "Mike Wilson", status: "At Hospital", location: "Central Medical", lastUpdate: "8 min ago" },
    { id: "AMB-004", driver: "Lisa Brown", status: "Available", location: "Station B", lastUpdate: "2 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical": return "bg-red-500";
      case "urgent": return "bg-orange-500";
      case "normal": return "bg-green-500";
      case "dispatched": return "bg-blue-500";
      case "en route": return "bg-yellow-500";
      case "completed": return "bg-gray-500";
      case "assigned": return "bg-purple-500";
      case "available": return "bg-green-500";
      case "at hospital": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                <Ambulance className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SwiftAid</span>
            </Link>
            <span className="text-2xl font-semibold">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button asChild className="hover-lift">
              <Link href="/about">About Us</Link>
            </Button>
            <Button variant="emergency" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Emergency
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {emergencyStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Emergencies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Recent Emergencies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEmergencies.map((emergency) => (
                  <div key={emergency.id} className="flex items-center justify-between p-3 rounded-lg border bg-white/30">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{emergency.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(emergency.severity)}`}>
                          {emergency.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{emergency.type}</p>
                      <p className="text-xs text-muted-foreground">{emergency.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs px-2 py-1 rounded-full ${getStatusColor(emergency.status)} text-white`}>
                        {emergency.status}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{emergency.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Emergencies
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambulance Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Ambulance className="h-5 w-5 text-blue-500" />
                  <span>Ambulance Fleet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ambulanceStatus.map((ambulance) => (
                  <div key={ambulance.id} className="flex items-center justify-between p-3 rounded-lg border bg-white/30">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{ambulance.id}</span>
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(ambulance.status)}`} />
                      </div>
                      <p className="text-sm font-medium">{ambulance.driver}</p>
                      <p className="text-xs text-muted-foreground">{ambulance.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{ambulance.status}</p>
                      <p className="text-xs text-muted-foreground">{ambulance.lastUpdate}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Manage Fleet
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">View Map</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Manage Drivers</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Hospital className="h-5 w-5" />
                  <span className="text-sm">Hospital Network</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col space-y-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}