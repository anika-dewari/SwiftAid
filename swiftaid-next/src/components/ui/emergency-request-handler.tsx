"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Phone,
  MapPin,
  User,
  Heart,
  Clock,
  CheckCircle,
  Ambulance,
  Navigation,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyRequest {
  id: string;
  patientName: string;
  phone: string;
  location: string;
  emergencyType: string;
  severity: "critical" | "urgent" | "normal";
  description: string;
  reportedAt: string;
  status: "pending" | "assigned" | "en-route" | "completed";
  assignedAmbulance?: string;
  estimatedArrival?: string;
}

// Mock data for demonstration
const mockRequests: EmergencyRequest[] = [
  {
    id: "EMG001",
    patientName: "John Doe",
    phone: "+91-9876543220",
    location: "Connaught Place, New Delhi",
    emergencyType: "cardiac",
    severity: "critical",
    description: "Chest pain, difficulty breathing",
    reportedAt: "2 mins ago",
    status: "assigned",
    assignedAmbulance: "AMB002",
    estimatedArrival: "8 mins",
  },
  {
    id: "EMG002",
    patientName: "Jane Smith",
    phone: "+91-9876543221",
    location: "India Gate, New Delhi",
    emergencyType: "trauma",
    severity: "urgent",
    description: "Road accident, head injury",
    reportedAt: "5 mins ago",
    status: "pending",
  },
  {
    id: "EMG003",
    patientName: "Raj Patel",
    phone: "+91-9876543222",
    location: "Red Fort, New Delhi",
    emergencyType: "respiratory",
    severity: "urgent",
    description: "Severe asthma attack",
    reportedAt: "12 mins ago",
    status: "en-route",
    assignedAmbulance: "AMB001",
    estimatedArrival: "3 mins",
  },
];

const availableAmbulances = [
  { id: "AMB001", driverName: "Rajesh Kumar", currentLocation: "CP Area" },
  { id: "AMB002", driverName: "Priya Sharma", currentLocation: "ITO" },
  { id: "AMB003", driverName: "Amit Singh", currentLocation: "Karol Bagh" },
  { id: "AMB004", driverName: "Sunita Devi", currentLocation: "Lajpat Nagar" },
];

export default function EmergencyRequestHandler() {
  const [requests, setRequests] = useState<EmergencyRequest[]>(mockRequests);
  const [newRequest, setNewRequest] = useState<{
    patientName: string;
    phone: string;
    location: string;
    emergencyType: string;
    severity: "critical" | "urgent" | "normal";
    description: string;
  }>({
    patientName: "",
    phone: "",
    location: "",
    emergencyType: "",
    severity: "normal",
    description: "",
  });
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emergencyTypes = [
    { value: "cardiac", label: "Cardiac Emergency", icon: "❤️" },
    { value: "trauma", label: "Trauma/Injury", icon: "🩹" },
    { value: "respiratory", label: "Breathing Problems", icon: "🫁" },
    { value: "stroke", label: "Stroke", icon: "🧠" },
    { value: "overdose", label: "Drug Overdose", icon: "💊" },
    { value: "other", label: "Other Emergency", icon: "🚨" },
  ];

  const handleSubmitNewRequest = () => {
    if (!newRequest.patientName || !newRequest.phone || !newRequest.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const request: EmergencyRequest = {
      id: `EMG${String(requests.length + 1).padStart(3, '0')}`,
      ...newRequest,
      reportedAt: "Just now",
      status: "pending",
    };

    setRequests(prev => [request, ...prev]);
    setNewRequest({
      patientName: "",
      phone: "",
      location: "",
      emergencyType: "",
      severity: "normal",
      description: "",
    });
    setShowNewRequestForm(false);
    toast.success("Emergency request created successfully");
  };

  const assignAmbulance = (requestId: string, ambulanceId: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: "assigned" as const, 
            assignedAmbulance: ambulanceId,
            estimatedArrival: Math.floor(Math.random() * 15 + 5) + " mins"
          }
        : request
    ));
    toast.success("Ambulance assigned successfully");
  };

  const updateRequestStatus = (requestId: string, status: EmergencyRequest['status']) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status } : request
    ));
    toast.success(`Request status updated to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-red-500";
      case "assigned": return "bg-yellow-500";
      case "en-route": return "bg-blue-500";
      case "completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 text-white";
      case "urgent": return "bg-orange-500 text-white";
      case "normal": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredRequests = requests.filter(request =>
    request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Emergency Request Management</h2>
          <p className="text-muted-foreground">
            Manage incoming emergency requests and dispatch ambulances
          </p>
        </div>
        <Button onClick={() => setShowNewRequestForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Emergency Request
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, location, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="en-route">En Route</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* New Request Form Modal */}
      {showNewRequestForm && (
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
                <CardTitle>Create New Emergency Request</CardTitle>
                <CardDescription>
                  Enter emergency details to dispatch ambulance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={newRequest.patientName}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newRequest.phone}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newRequest.location}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter detailed address or landmark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyType">Emergency Type</Label>
                    <Select
                      value={newRequest.emergencyType}
                      onValueChange={(value: string) => setNewRequest(prev => ({ ...prev, emergencyType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              {type.icon} {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select
                      value={newRequest.severity}
                      onValueChange={(value: "critical" | "urgent" | "normal") => 
                        setNewRequest(prev => ({ ...prev, severity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical - Life threatening</SelectItem>
                        <SelectItem value="urgent">Urgent - Serious condition</SelectItem>
                        <SelectItem value="normal">Normal - Stable condition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequest.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the emergency situation..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmitNewRequest} className="flex-1">
                    Create Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewRequestForm(false)}
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

      {/* Emergency Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(request.severity)}>
                        {request.severity}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(request.status)} text-white`}>
                        {request.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {request.reportedAt}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{request.patientName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {request.phone}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <MapPin className="w-3 h-3" />
                      Location
                    </div>
                    <p className="text-sm text-muted-foreground">{request.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <AlertTriangle className="w-3 h-3" />
                      Emergency Type
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {request.emergencyType} emergency
                    </p>
                  </div>
                </div>

                {request.description && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Description:</strong> {request.description}
                    </p>
                  </div>
                )}

                {request.assignedAmbulance && (
                  <div className="flex items-center gap-4 p-3 bg-muted rounded-lg mb-4">
                    <Ambulance className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Assigned: {request.assignedAmbulance}</p>
                      {request.estimatedArrival && (
                        <p className="text-sm text-muted-foreground">
                          ETA: {request.estimatedArrival}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {request.status === "pending" && (
                    <Select onValueChange={(ambulanceId: string) => assignAmbulance(request.id, ambulanceId)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Assign ambulance" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAmbulances.map((ambulance) => (
                          <SelectItem key={ambulance.id} value={ambulance.id}>
                            {ambulance.id} - {ambulance.driverName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {request.status === "assigned" && (
                    <Button 
                      size="sm" 
                      onClick={() => updateRequestStatus(request.id, "en-route")}
                    >
                      Mark En Route
                    </Button>
                  )}
                  
                  {request.status === "en-route" && (
                    <Button 
                      size="sm" 
                      onClick={() => updateRequestStatus(request.id, "completed")}
                    >
                      Mark Completed
                    </Button>
                  )}
                  
                  {request.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Emergency Resolved</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No emergency requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "All emergency requests have been resolved"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}