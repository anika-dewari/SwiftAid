import React, { useState } from 'react';
import { Truck, MapPin, Fuel, Wrench, User, Plus, Edit2, Trash2 } from 'lucide-react';
import { ambulances as initialAmbulances } from '../data/mockData';

const AmbulanceManagement = () => {
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driver: '',
    equipment: 'Basic Life Support',
    fuel: 100,
    status: 'available'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAmbulance) {
      // Update existing ambulance
      setAmbulances(prev => prev.map(amb => 
        amb.id === editingAmbulance.id 
          ? { ...amb, ...formData }
          : amb
      ));
    } else {
      // Add new ambulance
      const newAmbulance = {
        id: Date.now(),
        ...formData,
        location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
        lastMaintenance: new Date().toISOString().split('T')[0],
        mileage: 0
      };
      setAmbulances(prev => [...prev, newAmbulance]);
    }
    
    closeModal();
  };

  const openModal = (ambulance = null) => {
    if (ambulance) {
      setEditingAmbulance(ambulance);
      setFormData({
        vehicleNumber: ambulance.vehicleNumber,
        driver: ambulance.driver,
        equipment: ambulance.equipment,
        fuel: ambulance.fuel,
        status: ambulance.status
      });
    } else {
      setEditingAmbulance(null);
      setFormData({
        vehicleNumber: '',
        driver: '',
        equipment: 'Basic Life Support',
        fuel: 100,
        status: 'available'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAmbulance(null);
  };

  const deleteAmbulance = (id) => {
    if (window.confirm('Are you sure you want to delete this ambulance?')) {
      setAmbulances(prev => prev.filter(amb => amb.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'busy': return 'status-busy';
      case 'maintenance': return 'status-offline';
      default: return 'status-offline';
    }
  };

  const getFuelColor = (fuel) => {
    if (fuel >= 70) return 'text-green-600';
    if (fuel >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Statistics
  const stats = {
    total: ambulances.length,
    available: ambulances.filter(a => a.status === 'available').length,
    busy: ambulances.filter(a => a.status === 'busy').length,
    maintenance: ambulances.filter(a => a.status === 'maintenance').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            Ambulance Management
          </h1>
          <p className="text-slate-600 mt-1">Monitor and manage ambulance fleet</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Ambulance
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Total Fleet</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            <p className="text-sm text-slate-600">Available</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.busy}</p>
            <p className="text-sm text-slate-600">Busy</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.maintenance}</p>
            <p className="text-sm text-slate-600">Maintenance</p>
          </div>
        </div>
      </div>

      {/* Ambulance Grid */}
      <div className="grid grid-2 lg:grid-cols-3 gap-6">
        {ambulances.map((ambulance) => (
          <div key={ambulance.id} className="card border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{ambulance.vehicleNumber}</h3>
                <span className={`status-badge ${getStatusColor(ambulance.status)}`}>
                  {ambulance.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(ambulance)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteAmbulance(ambulance.id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{ambulance.driver}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{ambulance.location.address}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-slate-600" />
                  <span className={`text-sm font-medium ${getFuelColor(ambulance.fuel)}`}>
                    {ambulance.fuel}% Fuel
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Wrench className="w-3 h-3" />
                  <span className="text-xs">{ambulance.lastMaintenance}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Equipment:</span> {ambulance.equipment}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Mileage:</span> {ambulance.mileage?.toLocaleString() || '0'} miles
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {editingAmbulance ? 'Edit Ambulance' : 'Add New Ambulance'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., AMB006"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Driver</label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Driver name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Equipment Type</label>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="Basic Life Support">Basic Life Support</option>
                    <option value="Advanced Life Support">Advanced Life Support</option>
                    <option value="Critical Care">Critical Care</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Fuel Level (%)</label>
                  <input
                    type="number"
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingAmbulance ? 'Update' : 'Add'} Ambulance
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceManagement;