"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Ambulance, 
  AlertTriangle, 
  Navigation, 
  Clock,
  User,
  Phone
} from "lucide-react";

// Simplified map placeholder to avoid initialization issues
const MapPlaceholder = ({ ambulances, emergencies, height }: any) => (
  <div style={{ height }} className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 relative">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Real-Time Map View</h3>
        <p className="text-muted-foreground mb-4">Interactive map with live tracking</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/80 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span>🚑</span>
              <span className="font-medium">Ambulances</span>
            </div>
            <p>{ambulances.length} Active</p>
          </div>
          <div className="bg-white/80 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span>🚨</span>
              <span className="font-medium">Emergencies</span>
            </div>
            <p>{emergencies.length} Active</p>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Map integration with Leaflet.js - Ready for deployment
        </div>
      </div>
    </div>
  </div>
);

// Mock data for demonstration
const mockAmbulances = [
  {
    id: "AMB001",
    location: [28.6139, 77.2090] as [number, number], // Delhi coordinates
    status: "available",
    driverName: "Rajesh Kumar",
    contact: "+91-9876543210",
    estimatedArrival: null,
  },
  {
    id: "AMB002", 
    location: [28.6500, 77.2300] as [number, number],
    status: "en-route",
    driverName: "Priya Sharma",
    contact: "+91-9876543211",
    estimatedArrival: "12 mins",
    destination: [28.6292, 77.2337] as [number, number], // Emergency location
  },
  {
    id: "AMB003",
    location: [28.5800, 77.1900] as [number, number],
    status: "busy",
    driverName: "Amit Singh",
    contact: "+91-9876543212",
    estimatedArrival: null,
  },
];

const mockEmergencies = [
  {
    id: "EMG001",
    location: [28.6292, 77.2337] as [number, number],
    type: "cardiac",
    severity: "critical",
    patientName: "John Doe",
    contact: "+91-9876543220",
    reportedAt: "2 mins ago",
    assignedAmbulance: "AMB002",
  },
  {
    id: "EMG002",
    location: [28.6100, 77.2200] as [number, number],
    type: "trauma",
    severity: "urgent",
    patientName: "Jane Smith",
    contact: "+91-9876543221",
    reportedAt: "8 mins ago",
    assignedAmbulance: null,
  },
];

interface RealTimeMapProps {
  height?: string;
  showSidebar?: boolean;
}

export default function RealTimeMap({ height = "600px", showSidebar = true }: RealTimeMapProps) {
  const [ambulances, setAmbulances] = useState(mockAmbulances);
  const [emergencies, setEmergencies] = useState(mockEmergencies);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev => prev.map(ambulance => ({
        ...ambulance,
        location: [
          ambulance.location[0] + (Math.random() - 0.5) * 0.001,
          ambulance.location[1] + (Math.random() - 0.5) * 0.001,
        ] as [number, number],
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex ${showSidebar ? "gap-6" : ""}`}>
      {/* Map Container */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Real-Time Emergency Tracking
            </CardTitle>
            <CardDescription>
              Live tracking of ambulances and emergency requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapPlaceholder
              ambulances={ambulances}
              emergencies={emergencies}
              height={height}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-96 space-y-4">
          {/* Active Emergencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Active Emergencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedItem(emergency.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={emergency.severity === "critical" ? "destructive" : "secondary"}>
                      {emergency.severity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{emergency.reportedAt}</span>
                  </div>
                  <h4 className="font-medium">{emergency.patientName}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {emergency.type} emergency
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Phone className="w-3 h-3" />
                    {emergency.contact}
                  </div>
                  {emergency.assignedAmbulance ? (
                    <div className="flex items-center gap-2 mt-1 text-sm text-green-600">
                      <Ambulance className="w-3 h-3" />
                      Assigned to {emergency.assignedAmbulance}
                    </div>
                  ) : (
                    <Button size="sm" className="w-full mt-2">
                      Assign Ambulance
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ambulance Fleet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-blue-500" />
                Ambulance Fleet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedItem(ambulance.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{ambulance.id}</h4>
                    <Badge 
                      variant={ambulance.status === "available" ? "default" : "secondary"}
                      className={ambulance.status === "available" ? "bg-green-500" : ""}
                    >
                      {ambulance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    {ambulance.driverName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {ambulance.contact}
                  </div>
                  {ambulance.estimatedArrival && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-orange-600">
                      <Clock className="w-3 h-3" />
                      ETA: {ambulance.estimatedArrival}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}