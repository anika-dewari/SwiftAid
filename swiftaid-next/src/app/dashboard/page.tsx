"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeMap from "@/components/ui/real-time-map";
import EmergencyRequestHandler from "@/components/ui/emergency-request-handler";
import AmbulanceAvailability from "@/components/ui/ambulance-availability";
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
  Map,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const emergencyStats = [
    { 
      title: "Active Emergencies", 
      value: "3", 
      change: "+1 from last hour", 
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    { 
      title: "Available Ambulances", 
      value: "2/4", 
      change: "50% capacity", 
      icon: Ambulance,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    { 
      title: "Response Time", 
      value: "8.5min", 
      change: "-1.2min from avg", 
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    { 
      title: "Hospitals Online", 
      value: "15/15", 
      change: "100% network", 
      icon: Hospital,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
  ];

  const recentEmergencies = [
    { id: "EMG001", type: "Cardiac Emergency", location: "Connaught Place", status: "assigned", time: "2 min ago", severity: "critical", ambulanceId: "AMB002" },
    { id: "EMG002", type: "Traffic Accident", location: "India Gate", status: "pending", time: "5 min ago", severity: "urgent" },
    { id: "EMG003", type: "Breathing Problems", location: "Red Fort", status: "en-route", time: "12 min ago", severity: "urgent", ambulanceId: "AMB001" },
  ];

  const ambulanceStatus = [
    { id: "AMB001", driver: "Rajesh Kumar", status: "En Route", location: "Near Red Fort", lastUpdate: "1 min ago" },
    { id: "AMB002", driver: "Priya Sharma", status: "Assigned", location: "En route to CP", lastUpdate: "3 min ago" },
    { id: "AMB003", driver: "Amit Singh", status: "Maintenance", location: "Service Center", lastUpdate: "8 min ago" },
    { id: "AMB004", driver: "Sunita Devi", status: "Available", location: "South Delhi Station", lastUpdate: "2 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical": return "bg-red-500";
      case "urgent": return "bg-orange-500";
      case "normal": return "bg-green-500";
      case "assigned": return "bg-blue-500";
      case "pending": return "bg-red-500";
      case "en-route": return "bg-yellow-500";
      case "completed": return "bg-gray-500";
      case "available": return "bg-green-500";
      case "maintenance": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600";
      case "urgent": return "text-orange-600";
      case "normal": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {emergencyStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow duration-200">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Emergency Calls */}
        <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Emergency Calls
            </CardTitle>
            <CardDescription>Latest emergency requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmergencies.map((emergency) => (
                <div key={emergency.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{emergency.id}</span>
                        <Badge className={`${getStatusColor(emergency.status)} text-white`}>
                          {emergency.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {emergency.location}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="capitalize">{emergency.type}</span>
                        {emergency.ambulanceId && (
                          <span className="ml-2 text-blue-600">• {emergency.ambulanceId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-muted-foreground">{emergency.time}</span>
                    <span className={`text-sm font-medium ${getSeverityColor(emergency.severity)}`}>
                      {emergency.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Navigate to key dispatcher functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-3"
              onClick={() => setActiveTab("requests")}
            >
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-left">
                <div className="font-medium">Emergency Requests</div>
                <div className="text-sm text-muted-foreground">Manage incoming calls</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-3"
              onClick={() => setActiveTab("tracking")}
            >
              <Map className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">Real-Time Tracking</div>
                <div className="text-sm text-muted-foreground">Monitor ambulance locations</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-3"
              onClick={() => setActiveTab("fleet")}
            >
              <Ambulance className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Fleet Management</div>
                <div className="text-sm text-muted-foreground">Update ambulance status</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-3"
            >
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-muted-foreground">View performance metrics</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ambulance Status Overview */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-blue-500" />
            Ambulance Fleet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ambulanceStatus.map((ambulance) => (
              <div key={ambulance.id} className="p-3 rounded-lg border bg-white/30">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{ambulance.id}</span>
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(ambulance.status)}`} />
                </div>
                <p className="text-sm font-medium">{ambulance.driver}</p>
                <p className="text-xs text-muted-foreground">{ambulance.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-medium">{ambulance.status}</p>
                  <p className="text-xs text-muted-foreground">{ambulance.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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

      {/* Hero Section with Background Paths */}
      <BackgroundPaths 
        className="h-[60vh] flex items-center justify-center w-full flex-col px-4"
        svgOptions={{ duration: 8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            SwiftAid Intelligence, <br /> Emergency Systems.
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
            Real-time monitoring, predictive analytics, and intelligent dispatch 
            for next-generation emergency medical services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse">
              <Activity className="mr-2 h-5 w-5" />
              Live Operations
            </Button>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency Alert
            </Button>
          </div>
        </motion.div>
      </BackgroundPaths>

      <div className="container mx-auto p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Fleet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <EmergencyRequestHandler />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <RealTimeMap height="70vh" showSidebar={true} />
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <AmbulanceAvailability />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}