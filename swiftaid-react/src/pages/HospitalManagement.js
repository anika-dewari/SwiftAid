import React, { useState } from 'react';
import { Building2, MapPin, Phone, Bed, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { hospitals as initialHospitals } from '../data/mockData';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    totalBeds: 0,
    availableBeds: 0,
    emergencyBeds: 0,
    specialties: [],
    status: 'online'
  });

  const availableSpecialties = [
    'Emergency', 'Trauma', 'Cardiology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'ICU', 'Surgery', 'General Medicine', 'Critical Care'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingHospital) {
      // Update existing hospital
      setHospitals(prev => prev.map(hospital => 
        hospital.id === editingHospital.id 
          ? { 
              ...hospital, 
              ...formData,
              totalBeds: parseInt(formData.totalBeds),
              availableBeds: parseInt(formData.availableBeds),
              emergencyBeds: parseInt(formData.emergencyBeds),
              location: { ...hospital.location, address: formData.address },
              rating: hospital.rating || 4.5
            }
          : hospital
      ));
    } else {
      // Add new hospital
      const newHospital = {
        id: Date.now(),
        ...formData,
        totalBeds: parseInt(formData.totalBeds),
        availableBeds: parseInt(formData.availableBeds),
        emergencyBeds: parseInt(formData.emergencyBeds),
        location: { 
          lat: 40.7128 + (Math.random() - 0.5) * 0.1, 
          lng: -74.0060 + (Math.random() - 0.5) * 0.1, 
          address: formData.address 
        },
        rating: 4.5
      };
      setHospitals(prev => [...prev, newHospital]);
    }
    
    closeModal();
  };

  const openModal = (hospital = null) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({
        name: hospital.name,
        phone: hospital.phone,
        address: hospital.location.address,
        totalBeds: hospital.totalBeds,
        availableBeds: hospital.availableBeds,
        emergencyBeds: hospital.emergencyBeds,
        specialties: hospital.specialties,
        status: hospital.status
      });
    } else {
      setEditingHospital(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        totalBeds: 0,
        availableBeds: 0,
        emergencyBeds: 0,
        specialties: [],
        status: 'online'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHospital(null);
  };

  const deleteHospital = (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(prev => prev.filter(hospital => hospital.id !== id));
    }
  };

  const getOccupancyRate = (hospital) => {
    return Math.round(((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100);
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Statistics
  const stats = {
    totalHospitals: hospitals.length,
    onlineHospitals: hospitals.filter(h => h.status === 'online').length,
    totalBeds: hospitals.reduce((sum, h) => sum + h.totalBeds, 0),
    availableBeds: hospitals.reduce((sum, h) => sum + h.availableBeds, 0),
    emergencyBeds: hospitals.reduce((sum, h) => sum + h.emergencyBeds, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            Hospital Management
          </h1>
          <p className="text-slate-600 mt-1">Monitor hospital capacity and availability</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Hospital
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.totalHospitals}</p>
            <p className="text-sm text-slate-600">Total Hospitals</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.onlineHospitals}</p>
            <p className="text-sm text-slate-600">Online</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalBeds}</p>
            <p className="text-sm text-slate-600">Total Beds</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.availableBeds}</p>
            <p className="text-sm text-slate-600">Available</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.emergencyBeds}</p>
            <p className="text-sm text-slate-600">Emergency</p>
          </div>
        </div>
      </div>

      {/* Hospital Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {hospitals.map((hospital) => {
          const occupancyRate = getOccupancyRate(hospital);
          return (
            <div key={hospital.id} className="card border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{hospital.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`status-badge ${hospital.status === 'online' ? 'status-online' : 'status-offline'}`}>
                      {hospital.status}
                    </span>
                    <span className="text-sm text-slate-500">★ {hospital.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(hospital)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHospital(hospital.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{hospital.location.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{hospital.phone}</span>
                </div>

                {/* Bed Capacity */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Bed Capacity</span>
                    <span className={`text-sm font-semibold ${getOccupancyColor(occupancyRate)}`}>
                      {occupancyRate}% occupied
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{hospital.totalBeds}</p>
                      <p className="text-xs text-slate-600">Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{hospital.availableBeds}</p>
                      <p className="text-xs text-slate-600">Available</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">{hospital.emergencyBeds}</p>
                      <p className="text-xs text-slate-600">Emergency</p>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-2 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        occupancyRate >= 90 ? 'bg-red-500' : 
                        occupancyRate >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Specialties
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Central Medical Center"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Hospital address"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="form-group">
                    <label className="form-label">Total Beds</label>
                    <input
                      type="number"
                      name="totalBeds"
                      value={formData.totalBeds}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available</label>
                    <input
                      type="number"
                      name="availableBeds"
                      value={formData.availableBeds}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                      max={formData.totalBeds}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency</label>
                    <input
                      type="number"
                      name="emergencyBeds"
                      value={formData.emergencyBeds}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                      max={formData.availableBeds}
                      required
                    />
                  </div>
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
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Specialties</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    {availableSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyChange(specialty)}
                          className="rounded"
                        />
                        {specialty}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingHospital ? 'Update' : 'Add'} Hospital
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

export default HospitalManagement;