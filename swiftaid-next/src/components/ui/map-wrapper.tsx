"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapWrapperProps {
  ambulances: Array<{
    id: string;
    location: [number, number];
    status: string;
    driverName: string;
    contact: string;
    estimatedArrival?: string | null;
  }>;
  emergencies: Array<{
    id: string;
    location: [number, number];
    type: string;
    severity: string;
    patientName: string;
    contact: string;
    reportedAt: string;
    assignedAmbulance?: string | null;
  }>;
  height: string;
  mapCenter: [number, number];
}

export default function MapWrapper({ ambulances, emergencies, height, mapCenter }: MapWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  const createCustomIcon = (color: string, iconText: string) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg" style="background-color: ${color};">
          <div class="text-white text-xs font-bold">${iconText}</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "#10b981";
      case "en-route": return "#f59e0b";
      case "busy": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc2626";
      case "urgent": return "#ea580c";
      case "normal": return "#16a34a";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        key={`map-${mapCenter[0]}-${mapCenter[1]}`} // Force remount with key change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ambulance Markers */}
        {ambulances.map((ambulance) => (
          <Marker
            key={ambulance.id}
            position={ambulance.location}
            icon={createCustomIcon(getStatusColor(ambulance.status), "🚑")}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{ambulance.id}</h3>
                <p className="text-sm text-gray-600">Driver: {ambulance.driverName}</p>
                <p className="text-sm text-gray-600">Contact: {ambulance.contact}</p>
                <div className={`inline-block px-2 py-1 text-xs rounded text-white ${
                  ambulance.status === "available" ? "bg-green-500" : 
                  ambulance.status === "en-route" ? "bg-yellow-500" : "bg-red-500"
                }`}>
                  {ambulance.status}
                </div>
                {ambulance.estimatedArrival && (
                  <p className="text-sm font-medium text-orange-600 mt-1">
                    ETA: {ambulance.estimatedArrival}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Emergency Markers */}
        {emergencies.map((emergency) => (
          <Marker
            key={emergency.id}
            position={emergency.location}
            icon={createCustomIcon(getSeverityColor(emergency.severity), "🚨")}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{emergency.id}</h3>
                <p className="text-sm text-gray-600">Patient: {emergency.patientName}</p>
                <p className="text-sm text-gray-600">Type: {emergency.type}</p>
                <div className={`inline-block px-2 py-1 text-xs rounded text-white ${
                  emergency.severity === "critical" ? "bg-red-500" : 
                  emergency.severity === "urgent" ? "bg-orange-500" : "bg-green-500"
                }`}>
                  {emergency.severity}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Reported: {emergency.reportedAt}
                </p>
                {emergency.assignedAmbulance && (
                  <p className="text-sm font-medium text-green-600">
                    Assigned: {emergency.assignedAmbulance}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}