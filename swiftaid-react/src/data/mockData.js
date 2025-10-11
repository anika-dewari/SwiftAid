// Mock data for the SwiftAid application

export const ambulances = [
  {
    id: 1,
    vehicleNumber: 'AMB001',
    status: 'available',
    location: { lat: 40.7589, lng: -73.9851, address: '5th Avenue, NYC' },
    driver: 'John Smith',
    equipment: 'Advanced Life Support',
    fuel: 85,
    lastMaintenance: '2024-10-01',
    mileage: 45620
  },
  {
    id: 2,
    vehicleNumber: 'AMB002',
    status: 'busy',
    location: { lat: 40.7505, lng: -73.9934, address: 'Times Square, NYC' },
    driver: 'Sarah Johnson',
    equipment: 'Basic Life Support',
    fuel: 70,
    lastMaintenance: '2024-09-28',
    mileage: 38950
  },
  {
    id: 3,
    vehicleNumber: 'AMB003',
    status: 'available',
    location: { lat: 40.7282, lng: -74.0776, address: 'Battery Park, NYC' },
    driver: 'Mike Wilson',
    equipment: 'Advanced Life Support',
    fuel: 92,
    lastMaintenance: '2024-10-05',
    mileage: 32100
  },
  {
    id: 4,
    vehicleNumber: 'AMB004',
    status: 'maintenance',
    location: { lat: 40.6892, lng: -74.0445, address: 'Brooklyn Heights, NYC' },
    driver: 'Emily Davis',
    equipment: 'Critical Care',
    fuel: 45,
    lastMaintenance: '2024-09-15',
    mileage: 52300
  },
  {
    id: 5,
    vehicleNumber: 'AMB005',
    status: 'available',
    location: { lat: 40.7831, lng: -73.9712, address: 'Central Park, NYC' },
    driver: 'David Brown',
    equipment: 'Basic Life Support',
    fuel: 88,
    lastMaintenance: '2024-10-03',
    mileage: 29800
  }
];

export const hospitals = [
  {
    id: 1,
    name: 'Central Medical Center',
    location: { lat: 40.7614, lng: -73.9776, address: '1234 Medical Ave, NYC' },
    phone: '(555) 123-4567',
    totalBeds: 350,
    availableBeds: 45,
    emergencyBeds: 12,
    specialties: ['Emergency', 'Trauma', 'Cardiology', 'Neurology'],
    rating: 4.8,
    status: 'online'
  },
  {
    id: 2,
    name: 'Metropolitan Hospital',
    location: { lat: 40.7505, lng: -73.9934, address: '5678 Health St, NYC' },
    phone: '(555) 234-5678',
    totalBeds: 280,
    availableBeds: 28,
    emergencyBeds: 8,
    specialties: ['Cardiology', 'Orthopedics', 'General Medicine'],
    rating: 4.6,
    status: 'online'
  },
  {
    id: 3,
    name: 'City General Hospital',
    location: { lat: 40.7282, lng: -74.0776, address: '9012 Care Blvd, NYC' },
    phone: '(555) 345-6789',
    totalBeds: 420,
    availableBeds: 62,
    emergencyBeds: 15,
    specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'ICU'],
    rating: 4.7,
    status: 'online'
  },
  {
    id: 4,
    name: 'Downtown Medical',
    location: { lat: 40.6892, lng: -74.0445, address: '3456 Wellness Way, NYC' },
    phone: '(555) 456-7890',
    totalBeds: 200,
    availableBeds: 18,
    emergencyBeds: 6,
    specialties: ['Pediatrics', 'Emergency', 'Family Medicine'],
    rating: 4.9,
    status: 'online'
  },
  {
    id: 5,
    name: 'Regional Medical Center',
    location: { lat: 40.7831, lng: -73.9712, address: '7890 Recovery Rd, NYC' },
    phone: '(555) 567-8901',
    totalBeds: 380,
    availableBeds: 55,
    emergencyBeds: 20,
    specialties: ['Trauma', 'Emergency', 'Surgery', 'Critical Care'],
    rating: 4.5,
    status: 'online'
  }
];

export const drivers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@swiftaid.com',
    phone: '(555) 111-2222',
    licenseNumber: 'CDL123456',
    licenseExpiry: '2025-12-15',
    certifications: ['EMT-Basic', 'CPR', 'First Aid'],
    status: 'active',
    shift: 'day',
    experience: '5 years',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 111-3333',
      relation: 'Spouse'
    },
    ambulanceAssigned: 'AMB001'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@swiftaid.com',
    phone: '(555) 222-3333',
    licenseNumber: 'CDL234567',
    licenseExpiry: '2026-03-20',
    certifications: ['EMT-Intermediate', 'CPR', 'ACLS'],
    status: 'active',
    shift: 'night',
    experience: '8 years',
    emergencyContact: {
      name: 'Robert Johnson',
      phone: '(555) 222-4444',
      relation: 'Father'
    },
    ambulanceAssigned: 'AMB002'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@swiftaid.com',
    phone: '(555) 333-4444',
    licenseNumber: 'CDL345678',
    licenseExpiry: '2025-08-10',
    certifications: ['EMT-Paramedic', 'CPR', 'ACLS', 'PALS'],
    status: 'active',
    shift: 'day',
    experience: '12 years',
    emergencyContact: {
      name: 'Lisa Wilson',
      phone: '(555) 333-5555',
      relation: 'Spouse'
    },
    ambulanceAssigned: 'AMB003'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@swiftaid.com',
    phone: '(555) 444-5555',
    licenseNumber: 'CDL456789',
    licenseExpiry: '2026-11-30',
    certifications: ['EMT-Paramedic', 'CPR', 'ACLS', 'Critical Care Transport'],
    status: 'active',
    shift: 'evening',
    experience: '10 years',
    emergencyContact: {
      name: 'Mark Davis',
      phone: '(555) 444-6666',
      relation: 'Brother'
    },
    ambulanceAssigned: 'AMB004'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@swiftaid.com',
    phone: '(555) 555-6666',
    licenseNumber: 'CDL567890',
    licenseExpiry: '2025-05-25',
    certifications: ['EMT-Basic', 'CPR', 'First Aid'],
    status: 'active',
    shift: 'day',
    experience: '3 years',
    emergencyContact: {
      name: 'Maria Brown',
      phone: '(555) 555-7777',
      relation: 'Mother'
    },
    ambulanceAssigned: 'AMB005'
  }
];

export const emergencies = [
  {
    id: 1,
    type: 'cardiac',
    priority: 'high',
    location: { lat: 40.7489, lng: -73.9857, address: '123 Emergency St, NYC' },
    reporter: 'Bystander',
    description: 'Male, 55 years old, chest pain and difficulty breathing',
    timestamp: new Date('2024-10-11T14:30:00'),
    status: 'dispatched',
    ambulanceAssigned: 'AMB002'
  },
  {
    id: 2,
    type: 'accident',
    priority: 'medium',
    location: { lat: 40.7308, lng: -74.0062, address: '456 Traffic Ave, NYC' },
    reporter: 'Police',
    description: 'Vehicle collision, 2 cars involved, minor injuries reported',
    timestamp: new Date('2024-10-11T14:15:00'),
    status: 'pending',
    ambulanceAssigned: null
  },
  {
    id: 3,
    type: 'respiratory',
    priority: 'high',
    location: { lat: 40.7723, lng: -73.9632, address: '789 Urgent Rd, NYC' },
    reporter: 'Family Member',
    description: 'Elderly female, severe asthma attack, unable to breathe',
    timestamp: new Date('2024-10-11T14:45:00'),
    status: 'en-route',
    ambulanceAssigned: 'AMB001'
  }
];

export const dashboardStats = {
  totalAmbulances: ambulances.length,
  availableAmbulances: ambulances.filter(amb => amb.status === 'available').length,
  activeEmergencies: emergencies.filter(em => em.status !== 'resolved').length,
  hospitalsOnline: hospitals.filter(h => h.status === 'online').length,
  averageResponseTime: '4.2 min',
  totalBeds: hospitals.reduce((sum, h) => sum + h.totalBeds, 0),
  availableBeds: hospitals.reduce((sum, h) => sum + h.availableBeds, 0)
};