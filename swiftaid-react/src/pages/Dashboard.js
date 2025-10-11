import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Building2, 
  Users, 
  AlertTriangle, 
  Activity,
  MapPin,
  Clock,
  Bed
} from 'lucide-react';
import { dashboardStats, ambulances, emergencies, hospitals } from '../data/mockData';

const Dashboard = () => {
  const stats = [
    {
      title: 'Available Ambulances',
      value: dashboardStats.availableAmbulances,
      total: dashboardStats.totalAmbulances,
      icon: Truck,
      color: 'blue'
    },
    {
      title: 'Active Emergencies',
      value: dashboardStats.activeEmergencies,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Hospitals Online',
      value: dashboardStats.hospitalsOnline,
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Available Beds',
      value: dashboardStats.availableBeds,
      total: dashboardStats.totalBeds,
      icon: Bed,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Emergency Portal',
      description: 'Submit new emergency request',
      href: '/emergency',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Manage Ambulances',
      description: 'Fleet tracking and dispatch',
      href: '/ambulances',
      icon: Truck,
      color: 'blue'
    },
    {
      title: 'Hospital Network',
      description: 'Monitor bed availability',
      href: '/hospitals',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Driver Management',
      description: 'Staff assignments and schedules',
      href: '/drivers',
      icon: Users,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Dispatch Dashboard</h1>
        <p className="text-slate-600">Real-time overview of emergency response operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                    {stat.total && <span className="text-sm text-slate-500">/{stat.total}</span>}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="card border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getColorClasses(action.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Emergencies */}
        <div className="card border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Recent Emergencies
          </h3>
          <div className="space-y-3">
            {emergencies.slice(0, 3).map((emergency) => (
              <div key={emergency.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  emergency.priority === 'high' ? 'bg-red-500' : 
                  emergency.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 capitalize">{emergency.type} Emergency</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {emergency.location.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {emergency.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  emergency.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                  emergency.status === 'en-route' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {emergency.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/emergency" className="btn btn-secondary mt-4 w-full">
            View All Emergencies
          </Link>
        </div>

        {/* Active Ambulances */}
        <div className="card border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Active Ambulances
          </h3>
          <div className="space-y-3">
            {ambulances.filter(amb => amb.status === 'available' || amb.status === 'busy').slice(0, 3).map((ambulance) => (
              <div key={ambulance.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{ambulance.vehicleNumber}</p>
                  <p className="text-sm text-slate-600">{ambulance.driver}</p>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${
                    ambulance.status === 'available' ? 'status-available' :
                    ambulance.status === 'busy' ? 'status-busy' : 'status-offline'
                  }`}>
                    {ambulance.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{ambulance.equipment}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/ambulances" className="btn btn-secondary mt-4 w-full">
            View All Ambulances
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;