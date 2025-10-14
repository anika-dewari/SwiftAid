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
  Phone,
  Hospital,
  Locate,
  Map
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Location {
  lat: number;
  lng: number;
}

interface Hospital {
  id: string;
  name: string;
  location: Location;
  type: string;
  distance: number;
  available: boolean;
  contact: string;
}

interface AmbulanceData {
  id: string;
  location: Location;
  status: "available" | "busy" | "en-route";
  driverName: string;
  contact: string;
  estimatedArrival?: string;
}

interface Emergency {
  id: string;
  location: Location;
  type: string;
  severity: "critical" | "urgent" | "normal";
  patientName: string;
  contact: string;
  reportedAt: string;
  assignedAmbulance?: string;
}

// Mock data for nearby hospitals (Delhi area)
const mockHospitals: Hospital[] = [
  {
    id: "HOSP001",
    name: "AIIMS New Delhi",
    location: { lat: 28.5672, lng: 77.2100 },
    type: "Government Hospital",
    distance: 2.5,
    available: true,
    contact: "+91-11-26588500"
  },
  {
    id: "HOSP002", 
    name: "Safdarjung Hospital",
    location: { lat: 28.5731, lng: 77.2064 },
    type: "Government Hospital",
    distance: 3.1,
    available: true,
    contact: "+91-11-26165060"
  },
  {
    id: "HOSP003",
    name: "Apollo Hospital",
    location: { lat: 28.5833, lng: 77.2167 },
    type: "Private Hospital",
    distance: 1.8,
    available: true,
    contact: "+91-11-26925858"
  },
  {
    id: "HOSP004",
    name: "Max Super Speciality Hospital",
    location: { lat: 28.5956, lng: 77.2085 },
    type: "Private Hospital", 
    distance: 4.2,
    available: false,
    contact: "+91-11-26515050"
  }
];

// Mock ambulance data
const mockAmbulances: AmbulanceData[] = [
  {
    id: "AMB001",
    location: { lat: 28.6139, lng: 77.2090 },
    status: "available",
    driverName: "Rajesh Kumar",
    contact: "+91-9876543210"
  },
  {
    id: "AMB002",
    location: { lat: 28.6500, lng: 77.2300 },
    status: "en-route",
    driverName: "Priya Sharma", 
    contact: "+91-9876543211",
    estimatedArrival: "8 mins"
  },
  {
    id: "AMB003",
    location: { lat: 28.5800, lng: 77.1900 },
    status: "busy",
    driverName: "Amit Singh",
    contact: "+91-9876543212"
  }
];

interface LeafletMapComponentProps {
  userLocation: Location;
  hospitals: Hospital[];
  ambulances: AmbulanceData[];
  emergencies: Emergency[];
  height: string;
}

const LeafletMapComponent = ({ userLocation, hospitals, ambulances, emergencies, height }: LeafletMapComponentProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ height }} className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Map...</p>
        </div>
      </div>
    );
  }

  // Create custom icons
  const createCustomIcon = (color: string, emoji: string) => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      
      // Fix Leaflet default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${emoji}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    }
    return null;
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
          icon={createCustomIcon('#3B82F6', '📍')}
        >
          <Popup>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Your Location</h3>
              <p style={{ margin: '0', color: '#666' }}>Current position</p>
            </div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.location.lat, hospital.location.lng]}
            icon={createCustomIcon(hospital.available ? '#10B981' : '#EF4444', '🏥')}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{hospital.name}</h3>
                <p style={{ margin: '4px 0', color: '#666' }}>{hospital.type}</p>
                <p style={{ margin: '4px 0', color: '#666' }}>Distance: {hospital.distance} km</p>
                <p style={{ margin: '4px 0', color: '#666' }}>Contact: {hospital.contact}</p>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  color: 'white', 
                  background: hospital.available ? '#10B981' : '#EF4444' 
                }}>
                  {hospital.available ? 'Available' : 'Full'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ambulance Markers */}
        {ambulances.map((ambulance) => {
          const statusColor = ambulance.status === "available" ? "#10B981" : 
                            ambulance.status === "en-route" ? "#F59E0B" : "#EF4444";
          
          return (
            <Marker
              key={ambulance.id}
              position={[ambulance.location.lat, ambulance.location.lng]}
              icon={createCustomIcon(statusColor, '🚑')}
            >
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{ambulance.id}</h3>
                  <p style={{ margin: '4px 0', color: '#666' }}>Driver: {ambulance.driverName}</p>
                  <p style={{ margin: '4px 0', color: '#666' }}>Contact: {ambulance.contact}</p>
                  {ambulance.estimatedArrival && (
                    <p style={{ margin: '4px 0', color: '#F59E0B' }}>ETA: {ambulance.estimatedArrival}</p>
                  )}
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    color: 'white', 
                    background: statusColor 
                  }}>
                    {ambulance.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

interface RealTimeMapProps {
  height?: string;
  showSidebar?: boolean;
}

export default function RealTimeMap({ height = "600px", showSidebar = true }: RealTimeMapProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [ambulances, setAmbulances] = useState<AmbulanceData[]>(mockAmbulances);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setLocationPermission("denied");
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      setLocationPermission("granted");
      toast.success("Location access granted! Showing nearby hospitals and ambulances.");

      // Calculate distances to hospitals based on user location
      const updatedHospitals = hospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(location, hospital.location)
      })).sort((a, b) => a.distance - b.distance);

      setHospitals(updatedHospitals);

    } catch (error: any) {
      console.error("Geolocation error:", error);
      
      if (error.code === 1) {
        toast.error("Location access denied. Please enable location services.");
        setLocationPermission("denied");
      } else if (error.code === 2) {
        toast.error("Location unavailable. Using default location.");
        // Use Delhi as default location
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
        setLocationPermission("granted");
      } else {
        toast.error("Location request timed out. Using default location.");
        setUserLocation({ lat: 28.6139, lng: 77.2090 });
        setLocationPermission("granted");
      }
    }
    
    setIsLoading(false);
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (pos1: Location, pos2: Location): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  };

  // Simulate real-time updates
  useEffect(() => {
    if (locationPermission === "granted") {
      const interval = setInterval(() => {
        setAmbulances(prev => prev.map(ambulance => ({
          ...ambulance,
          location: {
            lat: ambulance.location.lat + (Math.random() - 0.5) * 0.002,
            lng: ambulance.location.lng + (Math.random() - 0.5) * 0.002,
          }
        })));
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [locationPermission]);

  if (locationPermission === "pending") {
    return (
      <div className={`flex ${showSidebar ? "gap-6" : ""}`}>
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Real-Time Emergency Tracking
              </CardTitle>
              <CardDescription>
                Live tracking of ambulances, hospitals, and emergency requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height }} className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Locate className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Location Access Required</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    To show nearby hospitals and ambulances, we need access to your location. 
                    This helps us provide accurate emergency services in your area.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={requestLocationPermission}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4" />
                          Allow Location Access
                        </>
                      )}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Your location data is only used for emergency services and is not stored.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (locationPermission === "denied") {
    return (
      <div className={`flex ${showSidebar ? "gap-6" : ""}`}>
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Real-Time Emergency Tracking
              </CardTitle>
              <CardDescription>
                Live tracking of ambulances, hospitals, and emergency requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height }} className="rounded-lg overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Location Access Denied</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Location access is required to show nearby hospitals and ambulances. 
                    Please enable location services in your browser settings and refresh the page.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={requestLocationPermission}
                      variant="outline"
                      className="gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${showSidebar ? "gap-6" : ""}`}>
      {/* Map Container */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Live Emergency Map
            </CardTitle>
            <CardDescription>
              Real-time tracking with nearby hospitals and ambulances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLocation && (
              <LeafletMapComponent
                userLocation={userLocation}
                hospitals={hospitals}
                ambulances={ambulances}
                emergencies={emergencies}
                height={height}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-96 space-y-4">
          {/* Nearby Hospitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="w-5 h-5 text-green-500" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hospitals.slice(0, 4).map((hospital) => (
                <div
                  key={hospital.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{hospital.name}</h4>
                    <Badge 
                      variant={hospital.available ? "default" : "destructive"}
                      className={hospital.available ? "bg-green-500" : ""}
                    >
                      {hospital.available ? "Available" : "Full"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {hospital.distance} km away
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {hospital.contact}
                    </div>
                    <div>{hospital.type}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Ambulances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-blue-500" />
                Active Ambulances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{ambulance.id}</h4>
                    <Badge 
                      variant={ambulance.status === "available" ? "default" : "secondary"}
                      className={
                        ambulance.status === "available" ? "bg-green-500" : 
                        ambulance.status === "en-route" ? "bg-yellow-500" : "bg-red-500"
                      }
                    >
                      {ambulance.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {ambulance.driverName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {ambulance.contact}
                    </div>
                    {ambulance.estimatedArrival && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="w-3 h-3" />
                        ETA: {ambulance.estimatedArrival}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}