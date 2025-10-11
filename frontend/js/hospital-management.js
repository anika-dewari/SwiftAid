// Hospital Management JavaScript
let hospitals = [];
let map;
let hospitalMarkers = [];
let currentTypeFilter = '';
let currentCapacityFilter = '';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeHospitalManagement();
});

function initializeHospitalManagement() {
    // Initialize map
    initializeMap();
    
    // Load hospitals data
    loadHospitals();
    
    // Initialize event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Add hospital button
    document.getElementById('add-hospital-btn').addEventListener('click', showAddHospitalModal);
    
    // Refresh button
    document.getElementById('refresh-data').addEventListener('click', refreshData);
    
    // Search and filters
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('type-filter').addEventListener('change', handleTypeFilter);
    document.getElementById('capacity-filter').addEventListener('change', handleCapacityFilter);
    
    // Form submission
    document.getElementById('hospital-form').addEventListener('submit', handleFormSubmission);
    
    // Map layer buttons
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', handleMapLayerChange);
    });
    
    // Modal close handlers
    document.addEventListener('click', handleModalClose);
    document.addEventListener('keydown', handleKeyPress);
}

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('hospital-map').setView([28.7041, 77.1025], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Custom hospital icon
    window.hospitalIcon = L.divIcon({
        html: '<i class="fas fa-hospital"></i>',
        iconSize: [30, 30],
        className: 'hospital-marker'
    });
}

async function loadHospitals() {
    showLoadingState();
    
    try {
        const response = await fetch('/api/hospitals');
        if (response.ok) {
            hospitals = await response.json();
            updateStatistics();
            renderHospitalGrid();
            updateMapMarkers();
        } else {
            throw new Error('Failed to load hospitals');
        }
    } catch (error) {
        console.error('Error loading hospitals:', error);
        showToast('Failed to load hospitals data', 'error');
        
        // Show sample data for demo
        hospitals = getSampleHospitals();
        updateStatistics();
        renderHospitalGrid();
        updateMapMarkers();
    } finally {
        hideLoadingState();
    }
}

function updateStatistics() {
    let totalBeds = 0;
    let occupiedBeds = 0;
    let emergencyBeds = 0;
    
    hospitals.forEach(hospital => {
        totalBeds += hospital.totalBeds || 0;
        occupiedBeds += (hospital.totalBeds || 0) - (hospital.availableBeds || 0);
        emergencyBeds += hospital.emergencyBeds || 0;
    });
    
    const availableBeds = totalBeds - occupiedBeds;
    
    document.getElementById('available-beds').textContent = availableBeds;
    document.getElementById('occupied-beds').textContent = occupiedBeds;
    document.getElementById('emergency-capacity').textContent = emergencyBeds;
    document.getElementById('total-hospitals').textContent = hospitals.length;
}

function renderHospitalGrid() {
    const grid = document.getElementById('hospital-grid');
    const filteredHospitals = getFilteredHospitals();
    
    if (filteredHospitals.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    grid.innerHTML = filteredHospitals.map(hospital => {
        const occupancyRate = calculateOccupancyRate(hospital);
        const capacityClass = getCapacityClass(occupancyRate);
        
        return `
            <div class="hospital-card" onclick="showHospitalDetails('${hospital.id}')">
                <div class="hospital-header">
                    <div class="hospital-info">
                        <h3>${hospital.name}</h3>
                        <span class="hospital-type">${formatHospitalType(hospital.type)}</span>
                    </div>
                    <div class="capacity-indicator">
                        <span class="capacity-percent ${capacityClass}">${occupancyRate}%</span>
                        <div class="capacity-bar">
                            <div class="capacity-fill ${capacityClass}" style="width: ${occupancyRate}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="hospital-stats">
                    <div class="hospital-stat">
                        <span class="number">${hospital.totalBeds || 0}</span>
                        <span class="label">Total Beds</span>
                    </div>
                    <div class="hospital-stat">
                        <span class="number">${hospital.availableBeds || 0}</span>
                        <span class="label">Available</span>
                    </div>
                    <div class="hospital-stat">
                        <span class="number">${hospital.emergencyBeds || 0}</span>
                        <span class="label">Emergency</span>
                    </div>
                </div>
                
                <div class="hospital-contact">
                    <i class="fas fa-phone"></i>
                    <span>${hospital.phone || 'N/A'}</span>
                </div>
                
                <div class="hospital-specialties">
                    ${(hospital.specialties || []).slice(0, 3).map(specialty => 
                        `<span class="specialty-badge">${specialty}</span>`
                    ).join('')}
                    ${(hospital.specialties || []).length > 3 ? 
                        `<span class="specialty-badge">+${(hospital.specialties || []).length - 3} more</span>` : ''}
                </div>
                
                <div class="hospital-actions">
                    <button class="btn-edit" onclick="event.stopPropagation(); editHospital('${hospital.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteHospital('${hospital.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateMapMarkers() {
    // Clear existing markers
    hospitalMarkers.forEach(marker => map.removeLayer(marker));
    hospitalMarkers = [];
    
    const filteredHospitals = getFilteredHospitals();
    
    filteredHospitals.forEach(hospital => {
        if (hospital.latitude && hospital.longitude) {
            const occupancyRate = calculateOccupancyRate(hospital);
            const capacityClass = getCapacityClass(occupancyRate);
            
            const marker = L.marker([hospital.latitude, hospital.longitude], {
                icon: hospitalIcon
            }).addTo(map);
            
            // Add capacity-based styling
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.classList.add(`hospital-${capacityClass}`);
            }
            
            // Add popup
            marker.bindPopup(`
                <div class="hospital-popup">
                    <h4>${hospital.name}</h4>
                    <p><strong>Type:</strong> ${formatHospitalType(hospital.type)}</p>
                    <p><strong>Capacity:</strong> ${occupancyRate}% occupied</p>
                    <p><strong>Available Beds:</strong> ${hospital.availableBeds || 0}</p>
                    <p><strong>Emergency Beds:</strong> ${hospital.emergencyBeds || 0}</p>
                    <p><strong>Phone:</strong> ${hospital.phone || 'N/A'}</p>
                </div>
            `);
            
            hospitalMarkers.push(marker);
        }
    });
    
    // Fit map to markers if any exist
    if (hospitalMarkers.length > 0) {
        const group = new L.featureGroup(hospitalMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function getFilteredHospitals() {
    return hospitals.filter(hospital => {
        const matchesType = !currentTypeFilter || hospital.type === currentTypeFilter;
        const matchesCapacity = !currentCapacityFilter || checkCapacityFilter(hospital, currentCapacityFilter);
        const matchesSearch = !currentSearch || 
            hospital.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (hospital.city && hospital.city.toLowerCase().includes(currentSearch.toLowerCase())) ||
            (hospital.specialties && hospital.specialties.some(s => 
                s.toLowerCase().includes(currentSearch.toLowerCase())));
        
        return matchesType && matchesCapacity && matchesSearch;
    });
}

function checkCapacityFilter(hospital, filter) {
    const occupancyRate = calculateOccupancyRate(hospital);
    
    switch (filter) {
        case 'high':
            return occupancyRate >= 80;
        case 'medium':
            return occupancyRate >= 50 && occupancyRate < 80;
        case 'low':
            return occupancyRate < 50;
        default:
            return true;
    }
}

function calculateOccupancyRate(hospital) {
    if (!hospital.totalBeds || hospital.totalBeds === 0) return 0;
    const occupiedBeds = hospital.totalBeds - (hospital.availableBeds || 0);
    return Math.round((occupiedBeds / hospital.totalBeds) * 100);
}

function getCapacityClass(occupancyRate) {
    if (occupancyRate >= 80) return 'high';
    if (occupancyRate >= 50) return 'medium';
    return 'low';
}

function formatHospitalType(type) {
    const types = {
        'general': 'General Hospital',
        'specialty': 'Specialty Hospital',
        'emergency': 'Emergency Center',
        'trauma': 'Trauma Center'
    };
    return types[type] || type;
}

function handleSearch(e) {
    currentSearch = e.target.value;
    renderHospitalGrid();
    updateMapMarkers();
}

function handleTypeFilter(e) {
    currentTypeFilter = e.target.value;
    renderHospitalGrid();
    updateMapMarkers();
}

function handleCapacityFilter(e) {
    currentCapacityFilter = e.target.value;
    renderHospitalGrid();
    updateMapMarkers();
}

function handleMapLayerChange(e) {
    // Remove active class from all buttons
    document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    const layer = e.target.dataset.layer;
    
    if (layer === 'all') {
        currentCapacityFilter = '';
        document.getElementById('capacity-filter').value = '';
    } else if (layer === 'available') {
        currentCapacityFilter = 'low';
        document.getElementById('capacity-filter').value = 'low';
    } else if (layer === 'full') {
        currentCapacityFilter = 'high';
        document.getElementById('capacity-filter').value = 'high';
    }
    
    renderHospitalGrid();
    updateMapMarkers();
}

function showAddHospitalModal() {
    document.getElementById('modal-title').textContent = 'Add New Hospital';
    document.getElementById('hospital-form').reset();
    document.getElementById('hospital-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editHospital(id) {
    const hospital = hospitals.find(h => h.id === id);
    if (!hospital) return;
    
    document.getElementById('modal-title').textContent = 'Edit Hospital';
    
    // Populate form fields
    document.getElementById('hospital-name').value = hospital.name;
    document.getElementById('hospital-type').value = hospital.type || '';
    document.getElementById('phone').value = hospital.phone || '';
    document.getElementById('emergency-contact').value = hospital.emergencyContact || '';
    document.getElementById('address').value = hospital.address || '';
    document.getElementById('city').value = hospital.city || '';
    document.getElementById('pincode').value = hospital.pincode || '';
    document.getElementById('latitude').value = hospital.latitude || '';
    document.getElementById('longitude').value = hospital.longitude || '';
    document.getElementById('total-beds').value = hospital.totalBeds || '';
    document.getElementById('available-beds-input').value = hospital.availableBeds || '';
    document.getElementById('emergency-beds').value = hospital.emergencyBeds || '';
    document.getElementById('icu-beds').value = hospital.icuBeds || '';
    document.getElementById('equipment').value = hospital.equipment || '';
    
    // Handle specialties checkboxes
    const specialtyCheckboxes = document.querySelectorAll('input[name="specialties"]');
    specialtyCheckboxes.forEach(checkbox => {
        checkbox.checked = (hospital.specialties || []).includes(checkbox.value);
    });
    
    // Store ID for updating
    document.getElementById('hospital-form').dataset.editId = id;
    
    document.getElementById('hospital-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const editId = e.target.dataset.editId;
    
    // Get selected specialties
    const specialties = Array.from(document.querySelectorAll('input[name="specialties"]:checked'))
        .map(checkbox => checkbox.value);
    
    const hospitalData = {
        name: formData.get('name'),
        type: formData.get('type'),
        phone: formData.get('phone'),
        emergencyContact: formData.get('emergencyContact'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        latitude: parseFloat(formData.get('latitude')) || null,
        longitude: parseFloat(formData.get('longitude')) || null,
        totalBeds: parseInt(formData.get('totalBeds')) || 0,
        availableBeds: parseInt(formData.get('availableBeds')) || 0,
        emergencyBeds: parseInt(formData.get('emergencyBeds')) || 0,
        icuBeds: parseInt(formData.get('icuBeds')) || 0,
        equipment: formData.get('equipment'),
        specialties: specialties,
        lastUpdated: new Date().toISOString()
    };
    
    try {
        let response;
        if (editId) {
            response = await fetch(`/api/hospitals/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hospitalData)
            });
        } else {
            response = await fetch('/api/hospitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hospitalData)
            });
        }
        
        if (response.ok) {
            showToast(editId ? 'Hospital updated successfully!' : 'Hospital added successfully!', 'success');
            closeHospitalModal();
            loadHospitals();
        } else {
            throw new Error('Failed to save hospital');
        }
    } catch (error) {
        console.error('Error saving hospital:', error);
        showToast('Failed to save hospital', 'error');
        
        // For demo purposes, update local data
        if (editId) {
            const index = hospitals.findIndex(h => h.id === editId);
            if (index !== -1) {
                hospitals[index] = { ...hospitals[index], ...hospitalData };
            }
        } else {
            hospitalData.id = Date.now().toString();
            hospitals.push(hospitalData);
        }
        
        updateStatistics();
        renderHospitalGrid();
        updateMapMarkers();
        closeHospitalModal();
        showToast(editId ? 'Hospital updated!' : 'Hospital added!', 'success');
    }
}

async function deleteHospital(id) {
    if (!confirm('Are you sure you want to delete this hospital?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/hospitals/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Hospital deleted successfully!', 'success');
            loadHospitals();
        } else {
            throw new Error('Failed to delete hospital');
        }
    } catch (error) {
        console.error('Error deleting hospital:', error);
        showToast('Failed to delete hospital', 'error');
        
        // For demo purposes, remove from local data
        hospitals = hospitals.filter(h => h.id !== id);
        updateStatistics();
        renderHospitalGrid();
        updateMapMarkers();
        showToast('Hospital deleted!', 'success');
    }
}

function showHospitalDetails(id) {
    const hospital = hospitals.find(h => h.id === id);
    if (!hospital) return;
    
    const detailsContainer = document.getElementById('hospital-details');
    const occupancyRate = calculateOccupancyRate(hospital);
    
    detailsContainer.innerHTML = `
        <div class="details-grid">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <ul class="detail-list">
                    <li><span class="label">Name:</span> <span>${hospital.name}</span></li>
                    <li><span class="label">Type:</span> <span>${formatHospitalType(hospital.type)}</span></li>
                    <li><span class="label">Phone:</span> <span>${hospital.phone || 'N/A'}</span></li>
                    <li><span class="label">Emergency Contact:</span> <span>${hospital.emergencyContact || 'N/A'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                <ul class="detail-list">
                    <li><span class="label">Address:</span> <span>${hospital.address || 'N/A'}</span></li>
                    <li><span class="label">City:</span> <span>${hospital.city || 'N/A'}</span></li>
                    <li><span class="label">Pin Code:</span> <span>${hospital.pincode || 'N/A'}</span></li>
                    <li><span class="label">Coordinates:</span> <span>${hospital.latitude && hospital.longitude ? 
                        `${hospital.latitude}, ${hospital.longitude}` : 'N/A'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-bed"></i> Capacity</h4>
                <ul class="detail-list">
                    <li><span class="label">Total Beds:</span> <span>${hospital.totalBeds || 0}</span></li>
                    <li><span class="label">Available Beds:</span> <span>${hospital.availableBeds || 0}</span></li>
                    <li><span class="label">Emergency Beds:</span> <span>${hospital.emergencyBeds || 0}</span></li>
                    <li><span class="label">ICU Beds:</span> <span>${hospital.icuBeds || 0}</span></li>
                    <li><span class="label">Occupancy Rate:</span> <span class="capacity-percent ${getCapacityClass(occupancyRate)}">${occupancyRate}%</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-stethoscope"></i> Specialties</h4>
                <div class="hospital-specialties">
                    ${(hospital.specialties || []).map(specialty => 
                        `<span class="specialty-badge">${specialty}</span>`
                    ).join('')}
                </div>
                ${(hospital.specialties || []).length === 0 ? '<p>No specialties listed</p>' : ''}
            </div>
            
            <div class="detail-section" style="grid-column: 1 / -1;">
                <h4><i class="fas fa-medical-kit"></i> Equipment & Facilities</h4>
                <p>${hospital.equipment || 'No equipment information available'}</p>
            </div>
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeHospitalModal() {
    document.getElementById('hospital-modal').classList.remove('active');
    document.getElementById('hospital-form').reset();
    document.getElementById('hospital-form').removeAttribute('data-edit-id');
    document.body.style.overflow = '';
}

function closeDetailsModal() {
    document.getElementById('details-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function refreshData() {
    loadHospitals();
    showToast('Data refreshed successfully!', 'success');
}

function showLoadingState() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('hospital-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('hospital-grid').style.display = 'grid';
}

function showEmptyState() {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('hospital-grid').style.display = 'none';
}

function hideEmptyState() {
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('hospital-grid').style.display = 'grid';
}

function handleModalClose(e) {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'hospital-modal') {
            closeHospitalModal();
        } else if (e.target.id === 'details-modal') {
            closeDetailsModal();
        }
    }
}

function handleKeyPress(e) {
    if (e.key === 'Escape') {
        closeHospitalModal();
        closeDetailsModal();
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Sample data for demo purposes
function getSampleHospitals() {
    return [
        {
            id: '1',
            name: 'All India Institute of Medical Sciences',
            type: 'general',
            phone: '+91-11-26588500',
            emergencyContact: '+91-11-26594040',
            address: 'Sri Aurobindo Marg, Ansari Nagar East, New Delhi',
            city: 'New Delhi',
            pincode: '110029',
            latitude: 28.5672,
            longitude: 77.2100,
            totalBeds: 2500,
            availableBeds: 250,
            emergencyBeds: 50,
            icuBeds: 100,
            specialties: ['cardiology', 'neurology', 'oncology', 'trauma', 'emergency'],
            equipment: 'MRI, CT Scan, Cardiac Cath Lab, ICU Ventilators, Emergency Medicine',
            lastUpdated: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Apollo Hospital',
            type: 'specialty',
            phone: '+91-11-26925858',
            emergencyContact: '+91-11-26925801',
            address: 'Sarita Vihar, Mathura Road, New Delhi',
            city: 'New Delhi',
            pincode: '110076',
            latitude: 28.5355,
            longitude: 77.2930,
            totalBeds: 700,
            availableBeds: 120,
            emergencyBeds: 25,
            icuBeds: 40,
            specialties: ['cardiology', 'orthopedics', 'oncology', 'neurology'],
            equipment: 'Advanced Cardiac Surgery, Robotic Surgery, Nuclear Medicine',
            lastUpdated: new Date(Date.now() - 300000).toISOString()
        },
        {
            id: '3',
            name: 'Max Super Speciality Hospital',
            type: 'trauma',
            phone: '+91-11-26515050',
            emergencyContact: '+91-11-26515000',
            address: '1, Press Enclave Road, Saket, New Delhi',
            city: 'New Delhi',
            pincode: '110017',
            latitude: 28.5244,
            longitude: 77.2066,
            totalBeds: 500,
            availableBeds: 50,
            emergencyBeds: 30,
            icuBeds: 35,
            specialties: ['trauma', 'emergency', 'orthopedics', 'neurology', 'cardiology'],
            equipment: 'Trauma Center, Emergency Medicine, Helicopter Landing Pad',
            lastUpdated: new Date(Date.now() - 600000).toISOString()
        },
        {
            id: '4',
            name: 'Fortis Hospital',
            type: 'general',
            phone: '+91-11-47135000',
            emergencyContact: '+91-11-47135001',
            address: 'B-22, Sector 62, Noida, Uttar Pradesh',
            city: 'Noida',
            pincode: '201301',
            latitude: 28.6271,
            longitude: 77.3716,
            totalBeds: 400,
            availableBeds: 80,
            emergencyBeds: 20,
            icuBeds: 25,
            specialties: ['cardiology', 'pediatrics', 'maternity', 'orthopedics'],
            equipment: 'Cardiac Surgery, Pediatric ICU, Maternity Ward, General Surgery',
            lastUpdated: new Date(Date.now() - 900000).toISOString()
        }
    ];
}