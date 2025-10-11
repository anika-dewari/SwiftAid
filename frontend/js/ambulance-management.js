// Ambulance Management JavaScript
let ambulances = [];
let map;
let ambulanceMarkers = [];
let currentFilter = '';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeAmbulanceManagement();
});

function initializeAmbulanceManagement() {
    // Initialize map
    initializeMap();
    
    // Load ambulances data
    loadAmbulances();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Load drivers for dropdown
    loadDrivers();
}

function setupEventListeners() {
    // Add ambulance button
    document.getElementById('add-ambulance-btn').addEventListener('click', showAddAmbulanceModal);
    
    // Refresh button
    document.getElementById('refresh-data').addEventListener('click', refreshData);
    
    // Search and filter
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('status-filter').addEventListener('change', handleFilter);
    
    // Form submission
    document.getElementById('ambulance-form').addEventListener('submit', handleFormSubmission);
    
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
    map = L.map('ambulance-map').setView([28.7041, 77.1025], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Custom ambulance icon
    window.ambulanceIcon = L.divIcon({
        html: '<i class="fas fa-ambulance"></i>',
        iconSize: [30, 30],
        className: 'ambulance-marker'
    });
}

async function loadAmbulances() {
    showLoadingState();
    
    try {
        const response = await fetch('/api/ambulances');
        if (response.ok) {
            ambulances = await response.json();
            updateStatistics();
            renderAmbulanceGrid();
            updateMapMarkers();
        } else {
            throw new Error('Failed to load ambulances');
        }
    } catch (error) {
        console.error('Error loading ambulances:', error);
        showToast('Failed to load ambulances data', 'error');
        
        // Show sample data for demo
        ambulances = getSampleAmbulances();
        updateStatistics();
        renderAmbulanceGrid();
        updateMapMarkers();
    } finally {
        hideLoadingState();
    }
}

async function loadDrivers() {
    try {
        const response = await fetch('/api/drivers');
        if (response.ok) {
            const drivers = await response.json();
            populateDriverDropdown(drivers);
        }
    } catch (error) {
        console.error('Error loading drivers:', error);
        // Use sample drivers
        const sampleDrivers = [
            { id: 1, name: 'John Doe', licenseNumber: 'DL001' },
            { id: 2, name: 'Jane Smith', licenseNumber: 'DL002' },
            { id: 3, name: 'Mike Johnson', licenseNumber: 'DL003' }
        ];
        populateDriverDropdown(sampleDrivers);
    }
}

function populateDriverDropdown(drivers) {
    const select = document.getElementById('assigned-driver');
    select.innerHTML = '<option value="">Select Driver</option>';
    
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.id;
        option.textContent = `${driver.name} (${driver.licenseNumber})`;
        select.appendChild(option);
    });
}

function updateStatistics() {
    const stats = {
        available: ambulances.filter(a => a.status === 'available').length,
        busy: ambulances.filter(a => a.status === 'busy').length,
        maintenance: ambulances.filter(a => a.status === 'maintenance').length,
        total: ambulances.length
    };
    
    document.getElementById('available-count').textContent = stats.available;
    document.getElementById('busy-count').textContent = stats.busy;
    document.getElementById('maintenance-count').textContent = stats.maintenance;
    document.getElementById('total-count').textContent = stats.total;
}

function renderAmbulanceGrid() {
    const grid = document.getElementById('ambulance-grid');
    const filteredAmbulances = getFilteredAmbulances();
    
    if (filteredAmbulances.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    grid.innerHTML = filteredAmbulances.map(ambulance => `
        <div class="ambulance-card" onclick="showAmbulanceDetails('${ambulance.id}')">
            <div class="ambulance-header">
                <div class="ambulance-info">
                    <h3>${ambulance.ambulanceId}</h3>
                    <p>${ambulance.licensePlate}</p>
                </div>
                <span class="status-badge ${ambulance.status}">${ambulance.status}</span>
            </div>
            <ul class="ambulance-details-list">
                <li>
                    <span class="label">Type:</span>
                    <span>${ambulance.type || 'N/A'}</span>
                </li>
                <li>
                    <span class="label">Driver:</span>
                    <span>${ambulance.assignedDriver || 'Unassigned'}</span>
                </li>
                <li>
                    <span class="label">Station:</span>
                    <span>${ambulance.station || 'N/A'}</span>
                </li>
                <li>
                    <span class="label">Last Updated:</span>
                    <span>${formatDateTime(ambulance.lastUpdated)}</span>
                </li>
            </ul>
            <div class="ambulance-actions">
                <button class="btn-edit" onclick="event.stopPropagation(); editAmbulance('${ambulance.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteAmbulance('${ambulance.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateMapMarkers() {
    // Clear existing markers
    ambulanceMarkers.forEach(marker => map.removeLayer(marker));
    ambulanceMarkers = [];
    
    const filteredAmbulances = getFilteredAmbulances();
    
    filteredAmbulances.forEach(ambulance => {
        if (ambulance.latitude && ambulance.longitude) {
            const marker = L.marker([ambulance.latitude, ambulance.longitude], {
                icon: ambulanceIcon
            }).addTo(map);
            
            // Add status-based styling
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.classList.add(`ambulance-${ambulance.status}`);
            }
            
            // Add popup
            marker.bindPopup(`
                <div class="ambulance-popup">
                    <h4>${ambulance.ambulanceId}</h4>
                    <p><strong>Status:</strong> ${ambulance.status}</p>
                    <p><strong>Type:</strong> ${ambulance.type || 'N/A'}</p>
                    <p><strong>Driver:</strong> ${ambulance.assignedDriver || 'Unassigned'}</p>
                </div>
            `);
            
            ambulanceMarkers.push(marker);
        }
    });
    
    // Fit map to markers if any exist
    if (ambulanceMarkers.length > 0) {
        const group = new L.featureGroup(ambulanceMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function getFilteredAmbulances() {
    return ambulances.filter(ambulance => {
        const matchesStatus = !currentFilter || ambulance.status === currentFilter;
        const matchesSearch = !currentSearch || 
            ambulance.ambulanceId.toLowerCase().includes(currentSearch.toLowerCase()) ||
            ambulance.licensePlate.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (ambulance.assignedDriver && ambulance.assignedDriver.toLowerCase().includes(currentSearch.toLowerCase()));
        
        return matchesStatus && matchesSearch;
    });
}

function handleSearch(e) {
    currentSearch = e.target.value;
    renderAmbulanceGrid();
    updateMapMarkers();
}

function handleFilter(e) {
    currentFilter = e.target.value;
    renderAmbulanceGrid();
    updateMapMarkers();
}

function handleMapLayerChange(e) {
    // Remove active class from all buttons
    document.querySelectorAll('.map-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    const layer = e.target.dataset.layer;
    
    if (layer === 'all') {
        currentFilter = '';
        document.getElementById('status-filter').value = '';
    } else {
        currentFilter = layer;
        document.getElementById('status-filter').value = layer;
    }
    
    renderAmbulanceGrid();
    updateMapMarkers();
}

function showAddAmbulanceModal() {
    document.getElementById('modal-title').textContent = 'Add New Ambulance';
    document.getElementById('ambulance-form').reset();
    document.getElementById('ambulance-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editAmbulance(id) {
    const ambulance = ambulances.find(a => a.id === id);
    if (!ambulance) return;
    
    document.getElementById('modal-title').textContent = 'Edit Ambulance';
    
    // Populate form fields
    document.getElementById('ambulance-id').value = ambulance.ambulanceId;
    document.getElementById('license-plate').value = ambulance.licensePlate;
    document.getElementById('ambulance-type').value = ambulance.type || '';
    document.getElementById('status').value = ambulance.status;
    document.getElementById('assigned-driver').value = ambulance.assignedDriverId || '';
    document.getElementById('station').value = ambulance.station || '';
    document.getElementById('latitude').value = ambulance.latitude || '';
    document.getElementById('longitude').value = ambulance.longitude || '';
    document.getElementById('equipment').value = ambulance.equipment || '';
    
    // Store ID for updating
    document.getElementById('ambulance-form').dataset.editId = id;
    
    document.getElementById('ambulance-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const editId = e.target.dataset.editId;
    
    const ambulanceData = {
        ambulanceId: formData.get('ambulanceId'),
        licensePlate: formData.get('licensePlate'),
        type: formData.get('type'),
        status: formData.get('status'),
        assignedDriverId: formData.get('assignedDriver') || null,
        station: formData.get('station'),
        latitude: parseFloat(formData.get('latitude')) || null,
        longitude: parseFloat(formData.get('longitude')) || null,
        equipment: formData.get('equipment'),
        lastUpdated: new Date().toISOString()
    };
    
    try {
        let response;
        if (editId) {
            response = await fetch(`/api/ambulances/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ambulanceData)
            });
        } else {
            response = await fetch('/api/ambulances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ambulanceData)
            });
        }
        
        if (response.ok) {
            showToast(editId ? 'Ambulance updated successfully!' : 'Ambulance added successfully!', 'success');
            closeAmbulanceModal();
            loadAmbulances();
        } else {
            throw new Error('Failed to save ambulance');
        }
    } catch (error) {
        console.error('Error saving ambulance:', error);
        showToast('Failed to save ambulance', 'error');
        
        // For demo purposes, update local data
        if (editId) {
            const index = ambulances.findIndex(a => a.id === editId);
            if (index !== -1) {
                ambulances[index] = { ...ambulances[index], ...ambulanceData };
            }
        } else {
            ambulanceData.id = Date.now().toString();
            ambulances.push(ambulanceData);
        }
        
        updateStatistics();
        renderAmbulanceGrid();
        updateMapMarkers();
        closeAmbulanceModal();
        showToast(editId ? 'Ambulance updated!' : 'Ambulance added!', 'success');
    }
}

async function deleteAmbulance(id) {
    if (!confirm('Are you sure you want to delete this ambulance?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/ambulances/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Ambulance deleted successfully!', 'success');
            loadAmbulances();
        } else {
            throw new Error('Failed to delete ambulance');
        }
    } catch (error) {
        console.error('Error deleting ambulance:', error);
        showToast('Failed to delete ambulance', 'error');
        
        // For demo purposes, remove from local data
        ambulances = ambulances.filter(a => a.id !== id);
        updateStatistics();
        renderAmbulanceGrid();
        updateMapMarkers();
        showToast('Ambulance deleted!', 'success');
    }
}

function showAmbulanceDetails(id) {
    const ambulance = ambulances.find(a => a.id === id);
    if (!ambulance) return;
    
    const detailsContainer = document.getElementById('ambulance-details');
    detailsContainer.innerHTML = `
        <div class="details-grid">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                <ul class="detail-list">
                    <li><span class="label">ID:</span> <span>${ambulance.ambulanceId}</span></li>
                    <li><span class="label">License Plate:</span> <span>${ambulance.licensePlate}</span></li>
                    <li><span class="label">Type:</span> <span>${ambulance.type || 'N/A'}</span></li>
                    <li><span class="label">Status:</span> <span class="status-badge ${ambulance.status}">${ambulance.status}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Assignment</h4>
                <ul class="detail-list">
                    <li><span class="label">Driver:</span> <span>${ambulance.assignedDriver || 'Unassigned'}</span></li>
                    <li><span class="label">Station:</span> <span>${ambulance.station || 'N/A'}</span></li>
                    <li><span class="label">Last Updated:</span> <span>${formatDateTime(ambulance.lastUpdated)}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                <ul class="detail-list">
                    <li><span class="label">Latitude:</span> <span>${ambulance.latitude || 'N/A'}</span></li>
                    <li><span class="label">Longitude:</span> <span>${ambulance.longitude || 'N/A'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-medical-kit"></i> Equipment</h4>
                <p>${ambulance.equipment || 'No equipment information available'}</p>
            </div>
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAmbulanceModal() {
    document.getElementById('ambulance-modal').classList.remove('active');
    document.getElementById('ambulance-form').reset();
    document.getElementById('ambulance-form').removeAttribute('data-edit-id');
    document.body.style.overflow = '';
}

function closeDetailsModal() {
    document.getElementById('details-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function refreshData() {
    loadAmbulances();
    showToast('Data refreshed successfully!', 'success');
}

function showLoadingState() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('ambulance-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('ambulance-grid').style.display = 'grid';
}

function showEmptyState() {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('ambulance-grid').style.display = 'none';
}

function hideEmptyState() {
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('ambulance-grid').style.display = 'grid';
}

function handleModalClose(e) {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'ambulance-modal') {
            closeAmbulanceModal();
        } else if (e.target.id === 'details-modal') {
            closeDetailsModal();
        }
    }
}

function handleKeyPress(e) {
    if (e.key === 'Escape') {
        closeAmbulanceModal();
        closeDetailsModal();
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
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
function getSampleAmbulances() {
    return [
        {
            id: '1',
            ambulanceId: 'AMB001',
            licensePlate: 'DL-01-AB-1234',
            type: 'advanced',
            status: 'available',
            assignedDriver: 'John Doe',
            assignedDriverId: '1',
            station: 'Central Station',
            latitude: 28.7041,
            longitude: 77.1025,
            equipment: 'Defibrillator, Ventilator, Cardiac Monitor',
            lastUpdated: new Date().toISOString()
        },
        {
            id: '2',
            ambulanceId: 'AMB002',
            licensePlate: 'DL-02-CD-5678',
            type: 'basic',
            status: 'busy',
            assignedDriver: 'Jane Smith',
            assignedDriverId: '2',
            station: 'North Station',
            latitude: 28.7341,
            longitude: 77.1225,
            equipment: 'First Aid Kit, Oxygen Tank, Stretcher',
            lastUpdated: new Date(Date.now() - 300000).toISOString()
        },
        {
            id: '3',
            ambulanceId: 'AMB003',
            licensePlate: 'DL-03-EF-9012',
            type: 'critical',
            status: 'maintenance',
            assignedDriver: null,
            assignedDriverId: null,
            station: 'South Station',
            latitude: 28.6741,
            longitude: 77.0825,
            equipment: 'ICU Equipment, Life Support Systems',
            lastUpdated: new Date(Date.now() - 600000).toISOString()
        }
    ];
}