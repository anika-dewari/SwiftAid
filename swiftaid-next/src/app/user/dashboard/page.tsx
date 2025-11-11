'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Car,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Ambulance,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchDrivers(token);

    // Setup Socket.IO for real-time updates
    const newSocket = io('http://localhost:5001');
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-user-room', parsedUser.id);
    });

    newSocket.on('driver-status-changed', (data: any) => {
      console.log('Driver status changed:', data);
      fetchDrivers(token);
    });

    newSocket.on('request-accepted', (data: any) => {
      setMessage(`Your request has been accepted by a driver!`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  const fetchDrivers = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/drivers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers || []);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'busy':
        return <Clock className="w-4 h-4" />;
      case 'offline':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleRequestEmergency = () => {
    router.push('/emergency');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const busyDrivers = drivers.filter((d) => d.status === 'busy');
  const offlineDrivers = drivers.filter((d) => d.status === 'offline');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.full_name}!</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRequestEmergency} className="bg-red-500 hover:bg-red-600">
              <Ambulance className="w-4 h-4 mr-2" />
              Request Emergency
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{availableDrivers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Busy Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{busyDrivers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{drivers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Available Drivers</CardTitle>
            <CardDescription>Drivers ready to respond to emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            {availableDrivers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No drivers available at the moment</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDrivers.map((driver) => (
                  <Card key={driver.id} className="border-2 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{driver.full_name}</CardTitle>
                        <Badge className={`${getStatusColor(driver.status)} text-white`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(driver.status)}
                            {driver.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span>{driver.vehicle_type} - {driver.vehicle_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{driver.rating || '5.00'} ({driver.total_trips || 0} trips)</span>
                      </div>
                      {driver.experience_years && (
                        <div className="text-sm text-gray-600">
                          {driver.experience_years} years experience
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>All Drivers</CardTitle>
            <CardDescription>Complete list of registered drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(driver.status)}`} />
                    <div>
                      <div className="font-semibold">{driver.full_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {driver.vehicle_type} - {driver.vehicle_number}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{driver.rating || '5.00'}</span>
                      </div>
                    </div>
                    <Badge variant={driver.status === 'available' ? 'default' : 'secondary'}>
                      {driver.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
