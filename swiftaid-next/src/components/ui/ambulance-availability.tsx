"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ambulance,
  User,
  Phone,
  MapPin,
  Clock,
  Fuel,
  Settings,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface AmbulanceData {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  status: "available" | "busy" | "maintenance" | "offline";
  currentLocation: string;
  fuelLevel: number;
  lastMaintenance: string;
  mileage: number;
  equipmentStatus: "good" | "needs-check" | "critical";
  assignedEmergency?: string;
  estimatedReturn?: string;
}

// Mock data for demonstration
const mockAmbulances: AmbulanceData[] = [
  {
    id: "AMB001",
    vehicleNumber: "DL-1CA-2023",
    driverName: "Rajesh Kumar",
    driverContact: "+91-9876543210",
    status: "available",
    currentLocation: "Central Delhi Station",
    fuelLevel: 85,
    lastMaintenance: "2024-01-15",
    mileage: 45230,
    equipmentStatus: "good",
  },
  {
    id: "AMB002",
    vehicleNumber: "DL-2CB-2024",
    driverName: "Priya Sharma",
    driverContact: "+91-9876543211",
    status: "busy",
    currentLocation: "En route to AIIMS",
    fuelLevel: 72,
    lastMaintenance: "2024-01-12",
    mileage: 38450,
    equipmentStatus: "good",
    assignedEmergency: "EMG001",
    estimatedReturn: "45 mins",
  },
  {
    id: "AMB003",
    vehicleNumber: "DL-3CC-2023",
    driverName: "Amit Singh",
    driverContact: "+91-9876543212",
    status: "maintenance",
    currentLocation: "Service Center",
    fuelLevel: 30,
    lastMaintenance: "2024-01-18",
    mileage: 52180,
    equipmentStatus: "needs-check",
  },
  {
    id: "AMB004",
    vehicleNumber: "DL-4CD-2024",
    driverName: "Sunita Devi",
    driverContact: "+91-9876543213",
    status: "available",
    currentLocation: "South Delhi Station",
    fuelLevel: 92,
    lastMaintenance: "2024-01-10",
    mileage: 29340,
    equipmentStatus: "good",
  },
];

export default function AmbulanceAvailability() {
  const [ambulances, setAmbulances] = useState<AmbulanceData[]>(mockAmbulances);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<string | null>(null);
  const [newAmbulance, setNewAmbulance] = useState<Partial<AmbulanceData>>({
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    status: "offline",
    currentLocation: "",
    fuelLevel: 100,
    equipmentStatus: "good",
  });

  const statusColors = {
    available: "bg-green-500 text-white",
    busy: "bg-yellow-500 text-white",
    maintenance: "bg-red-500 text-white",
    offline: "bg-gray-500 text-white",
  };

  const equipmentColors = {
    good: "text-green-600",
    "needs-check": "text-yellow-600",
    critical: "text-red-600",
  };

  const updateAmbulanceStatus = (id: string, status: AmbulanceData['status']) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === id 
        ? { 
            ...ambulance, 
            status,
            assignedEmergency: status === "available" ? undefined : ambulance.assignedEmergency,
            estimatedReturn: status === "available" ? undefined : ambulance.estimatedReturn,
          }
        : ambulance
    ));
    toast.success(`Ambulance ${id} status updated to ${status}`);
  };

  const updateLocation = (id: string, location: string) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === id ? { ...ambulance, currentLocation: location } : ambulance
    ));
    toast.success("Location updated successfully");
  };

  const updateFuelLevel = (id: string, fuelLevel: number) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === id ? { ...ambulance, fuelLevel } : ambulance
    ));
    toast.success("Fuel level updated");
  };

  const addNewAmbulance = () => {
    if (!newAmbulance.vehicleNumber || !newAmbulance.driverName || !newAmbulance.driverContact) {
      toast.error("Please fill in all required fields");
      return;
    }

    const ambulance: AmbulanceData = {
      id: `AMB${String(ambulances.length + 1).padStart(3, '0')}`,
      vehicleNumber: newAmbulance.vehicleNumber!,
      driverName: newAmbulance.driverName!,
      driverContact: newAmbulance.driverContact!,
      status: newAmbulance.status as AmbulanceData['status'] || "offline",
      currentLocation: newAmbulance.currentLocation || "Station",
      fuelLevel: newAmbulance.fuelLevel || 100,
      lastMaintenance: new Date().toISOString().split('T')[0],
      mileage: 0,
      equipmentStatus: newAmbulance.equipmentStatus as AmbulanceData['equipmentStatus'] || "good",
    };

    setAmbulances(prev => [...prev, ambulance]);
    setNewAmbulance({
      vehicleNumber: "",
      driverName: "",
      driverContact: "",
      status: "offline",
      currentLocation: "",
      fuelLevel: 100,
      equipmentStatus: "good",
    });
    setShowAddForm(false);
    toast.success("New ambulance added successfully");
  };

  const removeAmbulance = (id: string) => {
    setAmbulances(prev => prev.filter(ambulance => ambulance.id !== id));
    toast.success("Ambulance removed from system");
  };

  // Simulate real-time updates for fuel and location
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev => prev.map(ambulance => ({
        ...ambulance,
        fuelLevel: ambulance.status === "busy" 
          ? Math.max(0, ambulance.fuelLevel - Math.random() * 2)
          : ambulance.fuelLevel,
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const availableCount = ambulances.filter(a => a.status === "available").length;
  const busyCount = ambulances.filter(a => a.status === "busy").length;
  const maintenanceCount = ambulances.filter(a => a.status === "maintenance").length;
  const offlineCount = ambulances.filter(a => a.status === "offline").length;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ambulance Fleet Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage ambulance availability and status
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Ambulance
        </Button>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Duty</p>
                <p className="text-2xl font-bold text-yellow-600">{busyCount}</p>
              </div>
              <Ambulance className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-red-600">{maintenanceCount}</p>
              </div>
              <Settings className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-gray-600">{offlineCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Ambulance Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Ambulance</CardTitle>
                <CardDescription>
                  Register a new ambulance to the fleet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input
                      id="vehicleNumber"
                      value={newAmbulance.vehicleNumber || ""}
                      onChange={(e) => setNewAmbulance(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      placeholder="DL-1CA-2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverName">Driver Name *</Label>
                    <Input
                      id="driverName"
                      value={newAmbulance.driverName || ""}
                      onChange={(e) => setNewAmbulance(prev => ({ ...prev, driverName: e.target.value }))}
                      placeholder="Enter driver name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="driverContact">Driver Contact *</Label>
                    <Input
                      id="driverContact"
                      value={newAmbulance.driverContact || ""}
                      onChange={(e) => setNewAmbulance(prev => ({ ...prev, driverContact: e.target.value }))}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentLocation">Current Location</Label>
                    <Input
                      id="currentLocation"
                      value={newAmbulance.currentLocation || ""}
                      onChange={(e) => setNewAmbulance(prev => ({ ...prev, currentLocation: e.target.value }))}
                      placeholder="Station or area"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Initial Status</Label>
                    <Select
                      value={newAmbulance.status}
                      onValueChange={(value: AmbulanceData['status']) => 
                        setNewAmbulance(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
                    <Input
                      id="fuelLevel"
                      type="number"
                      min="0"
                      max="100"
                      value={newAmbulance.fuelLevel || 100}
                      onChange={(e) => setNewAmbulance(prev => ({ 
                        ...prev, 
                        fuelLevel: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipmentStatus">Equipment Status</Label>
                    <Select
                      value={newAmbulance.equipmentStatus}
                      onValueChange={(value: AmbulanceData['equipmentStatus']) => 
                        setNewAmbulance(prev => ({ ...prev, equipmentStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="needs-check">Needs Check</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={addNewAmbulance} className="flex-1">
                    Add Ambulance
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Ambulance Fleet List */}
      <div className="grid gap-4">
        {ambulances.map((ambulance) => (
          <motion.div
            key={ambulance.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Ambulance className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold">{ambulance.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ambulance.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[ambulance.status]}>
                      {ambulance.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => removeAmbulance(ambulance.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <User className="w-3 h-3" />
                      Driver
                    </div>
                    <p className="text-sm text-muted-foreground">{ambulance.driverName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {ambulance.driverContact}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </div>
                    <Input
                      value={ambulance.currentLocation}
                      onChange={(e) => updateLocation(ambulance.id, e.target.value)}
                      className="text-sm h-8"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Fuel className="w-3 h-3" />
                      Fuel Level
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(ambulance.fuelLevel)}
                        onChange={(e) => updateFuelLevel(ambulance.id, parseInt(e.target.value))}
                        className="text-sm h-8 w-20"
                      />
                      <span className="text-sm">%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            ambulance.fuelLevel > 50 ? "bg-green-500" :
                            ambulance.fuelLevel > 25 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${ambulance.fuelLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Settings className="w-3 h-3" />
                      Equipment
                    </div>
                    <Badge 
                      variant="outline" 
                      className={equipmentColors[ambulance.equipmentStatus]}
                    >
                      {ambulance.equipmentStatus}
                    </Badge>
                  </div>
                </div>

                {ambulance.assignedEmergency && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">
                        Assigned to {ambulance.assignedEmergency}
                      </span>
                      {ambulance.estimatedReturn && (
                        <span className="text-muted-foreground">
                          • ETA: {ambulance.estimatedReturn}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Select
                    value={ambulance.status}
                    onValueChange={(value: AmbulanceData['status']) => 
                      updateAmbulanceStatus(ambulance.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Set Available</SelectItem>
                      <SelectItem value="busy">Set Busy</SelectItem>
                      <SelectItem value="maintenance">Send to Maintenance</SelectItem>
                      <SelectItem value="offline">Set Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button size="sm" variant="outline">
                    <Phone className="w-3 h-3 mr-1" />
                    Call Driver
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                    <Clock className="w-3 h-3" />
                    Last maintenance: {ambulance.lastMaintenance}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}