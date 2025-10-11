import React, { useState } from 'react';
import { AlertTriangle, MapPin, Phone, User, Calendar } from 'lucide-react';

const EmergencyPortal = () => {
  const [formData, setFormData] = useState({
    emergencyType: '',
    priority: 'medium',
    location: '',
    description: '',
    reporterName: '',
    reporterPhone: '',
    patientAge: '',
    patientGender: '',
    consciousness: '',
    breathing: '',
    injuries: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emergencyTypes = [
    'Cardiac Emergency',
    'Respiratory Emergency', 
    'Traffic Accident',
    'Fall/Trauma',
    'Fire/Burn',
    'Poisoning',
    'Stroke',
    'Other Medical Emergency'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        emergencyType: '',
        priority: 'medium',
        location: '',
        description: '',
        reporterName: '',
        reporterPhone: '',
        patientAge: '',
        patientGender: '',
        consciousness: '',
        breathing: '',
        injuries: ''
      });
    }, 5000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
        }));
      });
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card border border-green-200 bg-green-50">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Emergency Submitted Successfully</h2>
            <p className="text-green-700 mb-4">Emergency ID: EM-{Date.now().toString().slice(-6)}</p>
            <p className="text-green-600">Dispatching nearest available ambulance...</p>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Estimated Response Time: 6-8 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          Emergency Portal
        </h1>
        <p className="text-slate-600">Submit emergency requests for immediate dispatch</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emergency Information */}
          <div className="card border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Emergency Information
            </h2>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Emergency Type *</label>
                <select 
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select emergency type</option>
                  {emergencyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level *</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="low">Low - Non-urgent</option>
                  <option value="medium">Medium - Urgent</option>
                  <option value="high">High - Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter address or coordinates"
                    className="form-input flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn btn-secondary flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    GPS
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the emergency situation in detail..."
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="card border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Reporter Information
            </h2>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="reporterPhone"
                  value={formData.reporterPhone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="form-input"
                  required
                />
              </div>

              {/* Patient Information */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Patient Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      placeholder="Age"
                      className="form-input"
                      min="0"
                      max="120"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Consciousness Level</label>
                  <select 
                    name="consciousness"
                    value={formData.consciousness}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select consciousness level</option>
                    <option value="alert">Alert and responsive</option>
                    <option value="verbal">Responds to verbal stimuli</option>
                    <option value="pain">Responds to pain only</option>
                    <option value="unconscious">Unconscious</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Breathing Status</label>
                  <select 
                    name="breathing"
                    value={formData.breathing}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select breathing status</option>
                    <option value="normal">Normal breathing</option>
                    <option value="difficulty">Difficulty breathing</option>
                    <option value="shallow">Shallow breathing</option>
                    <option value="none">Not breathing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Visible Injuries</label>
                  <textarea
                    name="injuries"
                    value={formData.injuries}
                    onChange={handleInputChange}
                    placeholder="Describe any visible injuries..."
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-danger px-8 py-4 text-lg font-semibold min-w-[200px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Submit Emergency
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmergencyPortal;