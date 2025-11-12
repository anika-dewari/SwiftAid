'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ModeToggle } from '@/components/mode-toggle';
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
  AlertTriangle,
  Shield,
  Activity,
  User,
  Navigation,
  Zap,
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Ambulance className="w-12 h-12 text-red-500" />
          </motion.div>
          <p className="text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const busyDrivers = drivers.filter((d) => d.status === 'busy');
  const offlineDrivers = drivers.filter((d) => d.status === 'offline');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Ambulance className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SwiftAid</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <AnimatedButton 
              animation="glow" 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleRequestEmergency}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency
            </AnimatedButton>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Find available ambulance drivers near you
          </p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Available Drivers</p>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{availableDrivers.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">On Duty</p>
                    <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{busyDrivers.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Activity className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Fleet</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{drivers.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Ambulance className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Available Drivers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-green-500" />
                <CardTitle className="text-2xl font-bold">Available Drivers</CardTitle>
              </div>
              <CardDescription className="text-base">
                Drivers ready to respond to emergencies immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableDrivers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Ambulance className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    No drivers available at the moment
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please check back shortly or request emergency services
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableDrivers.map((driver, index) => (
                    <motion.div
                      key={driver.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                                {driver.full_name?.charAt(0)}
                              </div>
                              <CardTitle className="text-lg">{driver.full_name}</CardTitle>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Available
                              </span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold">{driver.vehicle_type}</p>
                              <p className="text-xs text-muted-foreground">{driver.vehicle_number}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium">{driver.phone}</span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold">{driver.rating || '5.0'}</span>
                              <span className="text-xs text-muted-foreground">({driver.total_trips || 0} trips)</span>
                            </div>
                            {driver.experience_years && (
                              <div className="flex items-center gap-1 text-xs">
                                <Shield className="w-3 h-3 text-blue-500" />
                                <span className="font-semibold">{driver.experience_years}y exp</span>
                              </div>
                            )}
                          </div>
                          
                          <AnimatedButton 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            onClick={handleRequestEmergency}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Request Driver
                          </AnimatedButton>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Drivers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-2xl font-bold">All Drivers</CardTitle>
              </div>
              <CardDescription className="text-base">
                Complete list of registered ambulance drivers in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-950 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                          driver.status === 'available' ? 'from-green-400 to-emerald-600' :
                          driver.status === 'busy' ? 'from-yellow-400 to-orange-600' :
                          'from-gray-400 to-gray-600'
                        } flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {driver.full_name?.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(driver.status)}`} />
                      </div>
                      <div>
                        <div className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {driver.full_name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Car className="w-3 h-3" />
                          <span>{driver.vehicle_type}</span>
                          <span className="text-xs">•</span>
                          <span>{driver.vehicle_number}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold">{driver.rating || '5.00'}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {driver.total_trips || 0} trips
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          driver.status === 'available' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : driver.status === 'busy'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-gray-500 hover:bg-gray-600'
                        } text-white border-0 px-4 py-1`}
                      >
                        {driver.status}
                      </Badge>
                    </div>
                  </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
