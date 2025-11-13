'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Car,
  MapPin,
  User,
  Phone,
  FileText,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Bell,
  Activity,
  Ambulance,
  TrendingUp,
  Navigation,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [status, setStatus] = useState('offline');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'driver') {
      // Redirect non-drivers to appropriate dashboard
      if (parsedUser.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/user/dashboard');
      }
      return;
    }

    setUser(parsedUser);
    fetchProfile(token);
    fetchStats(token);
    fetchNotifications(token);

    // Setup Socket.IO
    const newSocket = io('http://localhost:5001');
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-user-room', parsedUser.id);
    });

    newSocket.on('new-emergency-request', (data) => {
      setMessage(`New Emergency: ${data.emergencyType} - ${data.patientName}`);
      fetchNotifications(token);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  const fetchProfile = async (token: string) => {
    console.log('🔄 Fetching driver profile...');
    setIsLoadingProfile(true);
    try {
      const response = await fetch('http://localhost:5001/api/drivers/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📡 Profile API Response:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile data received:', data);
        setProfile(data.driver);
        setStatus(data.driver.status || 'offline');
      } else {
        const errorData = await response.json();
        console.log('⚠️ Profile API error:', errorData);
        
        // If token is invalid, clear localStorage and redirect to login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth/login');
          return;
        }
        
        // For any error, set a default empty profile to show setup UI
        console.log('📝 Setting default profile for new driver');
        setProfile({
          license_number: '',
          vehicle_type: '',
          vehicle_number: '',
          vehicle_model: '',
          experience_years: 0,
          status: 'offline',
          rating: '5.00',
          total_trips: 0
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      setError('Unable to connect to server. Please check if backend is running.');
      // Set default profile even on error
      setProfile({
        license_number: '',
        vehicle_type: '',
        vehicle_number: '',
        vehicle_model: '',
        experience_years: 0,
        status: 'offline',
        rating: '5.00',
        total_trips: 0
      });
    } finally {
      console.log('✅ Profile loading complete, setting isLoadingProfile to false');
      setIsLoadingProfile(false);
    }
  };

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/drivers/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { completed_trips: 0, active_trips: 0 });
      } else {
        // Set default stats if fetch fails
        setStats({ completed_trips: 0, active_trips: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ completed_trips: 0, active_trips: 0 });
    }
  };

  const fetchNotifications = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/notifications?unreadOnly=true', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/drivers/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(newStatus);
        setMessage(`Status updated to ${newStatus}`);
        setProfile(data.driver);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/drivers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.driver);
        setMessage('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Show loading screen only while fetching data
  if (isLoadingProfile || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Loading driver dashboard...
          </p>
        </div>
        {error && (
          <div className="max-w-md">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full">
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  console.log('🎨 Rendering dashboard with profile:', profile);
  console.log('📊 Stats:', stats);
  console.log('🚦 Status:', status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Welcome back, <span className="font-semibold text-blue-600">{user?.full_name || 'Driver'}</span>! 👋
            </p>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <ModeToggle />
            <Button 
              variant="outline" 
              onClick={() => setShowNotificationModal(true)}
              className="relative hover:scale-105 transition-transform shadow-md"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
                  {notifications.length}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 hover:scale-105 transition-all shadow-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {message && (
          <div>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 shadow-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Status Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-400 to-green-600 text-white overflow-hidden hover:shadow-2xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current Status
            </CardTitle>
            <CardDescription className="text-green-100">Update your availability status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Available
                      </span>
                    </SelectItem>
                    <SelectItem value="busy">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        Busy
                      </span>
                    </SelectItem>
                    <SelectItem value="offline">
                      <span className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Offline
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Badge
                  className={`text-lg px-6 py-3 shadow-lg cursor-pointer hover:scale-105 transition-transform ${
                    status === 'available' 
                      ? 'bg-white text-green-600' 
                      : status === 'busy' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {status === 'available' && <CheckCircle className="w-4 h-4" />}
                    {status === 'busy' && <Clock className="w-4 h-4" />}
                    {status === 'offline' && <XCircle className="w-4 h-4" />}
                    {status.toUpperCase()}
                  </span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="hover:scale-105 hover:-translate-y-1 transition-all">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.completed_trips || 0}</div>
                  <p className="text-blue-100 text-xs mt-1">Total deliveries</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="hover:scale-105 hover:-translate-y-1 transition-all">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-100 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Active Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.active_trips || 0}</div>
                  <p className="text-yellow-100 text-xs mt-1">In progress</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="hover:scale-105 hover:-translate-y-1 transition-all">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-400 to-green-600 text-white hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-100 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{profile.rating || '5.00'}</div>
                  <p className="text-green-100 text-xs mt-1">⭐ Average score</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="hover:scale-105 hover:-translate-y-1 transition-all">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{profile.total_trips || 0}</div>
                  <p className="text-purple-100 text-xs mt-1">All time</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <Card className="border-0 shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="w-6 h-6 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription className="mt-1">Manage your driver profile details</CardDescription>
            </div>
            <div>
              <Button 
                onClick={() => setEditMode(!editMode)} 
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-transform"
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="space-y-2"
                >
                  <Label htmlFor="license_number" className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    License Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="license_number"
                      className={`pl-4 ${editMode ? 'border-blue-300 focus:ring-2 focus:ring-blue-500' : ''}`}
                      value={profile.license_number || ''}
                      onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div 
                  className="space-y-2"
                >
                  <Label htmlFor="vehicle_type" className="text-sm font-semibold flex items-center gap-2">
                    <Ambulance className="w-4 h-4 text-green-600" />
                    Vehicle Type
                  </Label>
                  <div className="relative">
                    <Input
                      id="vehicle_type"
                      className={`pl-4 ${editMode ? 'border-green-300 focus:ring-2 focus:ring-green-500' : ''}`}
                      value={profile.vehicle_type || ''}
                      onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div 
                  className="space-y-2"
                >
                  <Label htmlFor="vehicle_number" className="text-sm font-semibold flex items-center gap-2">
                    <Car className="w-4 h-4 text-purple-600" />
                    Vehicle Number
                  </Label>
                  <Input
                    id="vehicle_number"
                    className={`pl-4 ${editMode ? 'border-purple-300 focus:ring-2 focus:ring-purple-500' : ''}`}
                    value={profile.vehicle_number || ''}
                    onChange={(e) => setProfile({ ...profile, vehicle_number: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                <div 
                  className="space-y-2"
                >
                  <Label htmlFor="vehicle_model" className="text-sm font-semibold flex items-center gap-2">
                    <Car className="w-4 h-4 text-yellow-600" />
                    Vehicle Model
                  </Label>
                  <Input
                    id="vehicle_model"
                    className={`pl-4 ${editMode ? 'border-yellow-300 focus:ring-2 focus:ring-yellow-500' : ''}`}
                    value={profile.vehicle_model || ''}
                    onChange={(e) => setProfile({ ...profile, vehicle_model: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                <div 
                  className="space-y-2"
                >
                  <Label htmlFor="experience_years" className="text-sm font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    Years of Experience
                  </Label>
                  <div className="relative">
                    <Input
                      id="experience_years"
                      type="number"
                      className={`pl-4 ${editMode ? 'border-orange-300 focus:ring-2 focus:ring-orange-500' : ''}`}
                      value={profile.experience_years || 0}
                      onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="transition-all">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Liquid Glass Notification Modal */}
      {showNotificationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowNotificationModal(false)}
        >
          {/* Backdrop with liquid glass blur effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.3))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          />
          
          {/* Modal Content */}
          <div 
            className="relative max-w-2xl w-full max-h-[80vh] overflow-hidden rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 duration-500"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    <p className="text-white/90 text-sm">
                      {notifications.length === 0 
                        ? 'No new notifications' 
                        : `${notifications.length} new notification${notifications.length > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowNotificationModal(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 rounded-full p-2 h-auto transition-all hover:rotate-90"
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
              
              {/* Animated wave effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-pulse" />
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[50vh] p-6 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                    <Bell className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">All caught up!</h3>
                  <p className="text-gray-600">You have no new notifications at the moment.</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="group relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Gradient accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-blue-500 to-purple-500" />
                    
                    {/* Notification Icon */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                          {notification.type === 'request' ? (
                            <Activity className="w-5 h-5 text-white" />
                          ) : notification.type === 'trip' ? (
                            <Navigation className="w-5 h-5 text-white" />
                          ) : (
                            <Bell className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {notification.title || 'New Notification'}
                        </h4>
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {notification.message || notification.description || 'You have a new notification'}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {notification.created_at 
                              ? new Date(notification.created_at).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })
                              : 'Just now'
                            }
                          </span>
                          {notification.priority && (
                            <Badge className={`
                              ${notification.priority === 'high' 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                : notification.priority === 'medium'
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              } text-white
                            `}>
                              {notification.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                      >
                        View
                      </Button>
                    </div>
                    
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200/50 bg-white/40 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
                  onClick={() => {
                    // Mark all as read logic here
                    setNotifications([]);
                  }}
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
