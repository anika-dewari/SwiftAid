import React, { useState } from 'react';
import { Users, Phone, Mail, Calendar, AlertTriangle, Plus, Edit2, Trash2, Award } from 'lucide-react';
import { drivers as initialDrivers } from '../data/mockData';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    certifications: [],
    status: 'active',
    shift: 'day',
    experience: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    ambulanceAssigned: ''
  });

  const availableCertifications = [
    'EMT-Basic', 'EMT-Intermediate', 'EMT-Paramedic', 'CPR', 
    'First Aid', 'ACLS', 'PALS', 'Critical Care Transport'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationChange = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDriver) {
      // Update existing driver
      setDrivers(prev => prev.map(driver => 
        driver.id === editingDriver.id 
          ? { 
              ...driver, 
              ...formData,
              emergencyContact: {
                name: formData.emergencyContactName,
                phone: formData.emergencyContactPhone,
                relation: formData.emergencyContactRelation
              }
            }
          : driver
      ));
    } else {
      // Add new driver
      const newDriver = {
        id: Date.now(),
        ...formData,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation
        }
      };
      setDrivers(prev => [...prev, newDriver]);
    }
    
    closeModal();
  };

  const openModal = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry,
        certifications: driver.certifications,
        status: driver.status,
        shift: driver.shift,
        experience: driver.experience,
        emergencyContactName: driver.emergencyContact.name,
        emergencyContactPhone: driver.emergencyContact.phone,
        emergencyContactRelation: driver.emergencyContact.relation,
        ambulanceAssigned: driver.ambulanceAssigned
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
        certifications: [],
        status: 'active',
        shift: 'day',
        experience: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        ambulanceAssigned: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const deleteDriver = (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(prev => prev.filter(driver => driver.id !== id));
    }
  };

  const isLicenseExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = (expiry - today) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30;
  };

  const getShiftColor = (shift) => {
    switch (shift) {
      case 'day': return 'bg-yellow-100 text-yellow-800';
      case 'evening': return 'bg-orange-100 text-orange-800';
      case 'night': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistics
  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'active').length,
    dayShift: drivers.filter(d => d.shift === 'day').length,
    nightShift: drivers.filter(d => d.shift === 'night').length,
    expiringSoon: drivers.filter(d => isLicenseExpiringSoon(d.licenseExpiry)).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            Driver Management
          </h1>
          <p className="text-slate-600 mt-1">Manage driver information and assignments</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.totalDrivers}</p>
            <p className="text-sm text-slate-600">Total Drivers</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.activeDrivers}</p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.dayShift}</p>
            <p className="text-sm text-slate-600">Day Shift</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.nightShift}</p>
            <p className="text-sm text-slate-600">Night Shift</p>
          </div>
        </div>
        <div className="card border border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.expiringSoon}</p>
            <p className="text-sm text-slate-600">License Expiring</p>
          </div>
        </div>
      </div>

      {/* Driver Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {drivers.map((driver) => (
          <div key={driver.id} className="card border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{driver.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`status-badge ${driver.status === 'active' ? 'status-available' : 'status-offline'}`}>
                      {driver.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getShiftColor(driver.shift)}`}>
                      {driver.shift}
                    </span>
                    {isLicenseExpiringSoon(driver.licenseExpiry) && (
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Expiring
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(driver)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteDriver(driver.id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{driver.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{driver.phone}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">License #</p>
                  <p className="font-medium text-slate-900">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500">Experience</p>
                  <p className="font-medium text-slate-900">{driver.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  License expires: 
                  <span className={`ml-1 font-medium ${isLicenseExpiringSoon(driver.licenseExpiry) ? 'text-red-600' : 'text-slate-900'}`}>
                    {new Date(driver.licenseExpiry).toLocaleDateString()}
                  </span>
                </span>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Certifications
                </p>
                <div className="flex flex-wrap gap-1">
                  {driver.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assignment */}
              {driver.ambulanceAssigned && (
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-sm">
                    <span className="text-slate-600">Assigned to: </span>
                    <span className="font-medium text-blue-900">{driver.ambulanceAssigned}</span>
                  </p>
                </div>
              )}

              {/* Emergency Contact */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-600 mb-1">Emergency Contact</p>
                <p className="text-sm text-slate-900">
                  {driver.emergencyContact.name} ({driver.emergencyContact.relation})
                </p>
                <p className="text-sm text-slate-600">{driver.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., 5 years"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* License & Work Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-3">License & Work Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">License Expiry</label>
                      <input
                        type="date"
                        name="licenseExpiry"
                        value={formData.licenseExpiry}
                        onChange={handleInputChange}
                        className="form-input"
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Shift</label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="day">Day</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                      </select>
                    </div>

                    <div className="form-group col-span-2">
                      <label className="form-label">Ambulance Assigned</label>
                      <input
                        type="text"
                        name="ambulanceAssigned"
                        value={formData.ambulanceAssigned}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g., AMB001"
                      />
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="form-label">Certifications</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    {availableCertifications.map((certification) => (
                      <label key={certification} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(certification)}
                          onChange={() => handleCertificationChange(certification)}
                          className="rounded"
                        />
                        {certification}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-3">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label className="form-label">Relationship</label>
                      <select
                        name="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingDriver ? 'Update' : 'Add'} Driver
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

export default DriverManagement;