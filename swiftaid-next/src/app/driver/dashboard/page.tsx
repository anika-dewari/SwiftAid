'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState('offline');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'driver') {
      router.push('/dashboard');
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
    try {
      const response = await fetch('http://localhost:5001/api/drivers/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.driver);
        setStatus(data.driver.status);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.full_name}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/driver/requests')}>
              <Bell className="w-4 h-4 mr-2" />
              Notifications ({notifications.length})
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

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Update your availability status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
                  <SelectTrigger>
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
              <Badge
                variant={status === 'available' ? 'default' : status === 'busy' ? 'secondary' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.completed_trips || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.active_trips || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profile.rating || '5.00'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profile.total_trips || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your driver profile details</CardDescription>
            </div>
            <Button onClick={() => setEditMode(!editMode)} variant="outline">
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="license_number"
                      className="pl-10"
                      value={profile.license_number || ''}
                      onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="vehicle_type"
                      className="pl-10"
                      value={profile.vehicle_type || ''}
                      onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_number">Vehicle Number</Label>
                  <Input
                    id="vehicle_number"
                    value={profile.vehicle_number || ''}
                    onChange={(e) => setProfile({ ...profile, vehicle_number: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_model">Vehicle Model</Label>
                  <Input
                    id="vehicle_model"
                    value={profile.vehicle_model || ''}
                    onChange={(e) => setProfile({ ...profile, vehicle_model: e.target.value })}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="experience_years"
                      type="number"
                      className="pl-10"
                      value={profile.experience_years || 0}
                      onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) })}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              {editMode && (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
