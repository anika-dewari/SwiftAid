// Driver Management JavaScript
let drivers = [];
let currentStatusFilter = '';
let currentShiftFilter = '';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeDriverManagement();
});

function initializeDriverManagement() {
    // Load drivers data
    loadDrivers();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Load ambulances for dropdown
    loadAmbulances();
}

function setupEventListeners() {
    // Add driver button
    document.getElementById('add-driver-btn').addEventListener('click', showAddDriverModal);
    
    // Refresh button
    document.getElementById('refresh-data').addEventListener('click', refreshData);
    
    // Search and filters
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('status-filter').addEventListener('change', handleStatusFilter);
    document.getElementById('shift-filter').addEventListener('change', handleShiftFilter);
    
    // Form submission
    document.getElementById('driver-form').addEventListener('submit', handleFormSubmission);
    
    // Modal close handlers
    document.addEventListener('click', handleModalClose);
    document.addEventListener('keydown', handleKeyPress);
}

async function loadDrivers() {
    showLoadingState();
    
    try {
        const response = await fetch('/api/drivers');
        if (response.ok) {
            drivers = await response.json();
            updateStatistics();
            renderDriverGrid();
        } else {
            throw new Error('Failed to load drivers');
        }
    } catch (error) {
        console.error('Error loading drivers:', error);
        showToast('Failed to load drivers data', 'error');
        
        // Show sample data for demo
        drivers = getSampleDrivers();
        updateStatistics();
        renderDriverGrid();
    } finally {
        hideLoadingState();
    }
}

async function loadAmbulances() {
    try {
        const response = await fetch('/api/ambulances');
        if (response.ok) {
            const ambulances = await response.json();
            populateAmbulanceDropdown(ambulances);
        }
    } catch (error) {
        console.error('Error loading ambulances:', error);
        // Use sample ambulances
        const sampleAmbulances = [
            { id: 1, ambulanceId: 'AMB001' },
            { id: 2, ambulanceId: 'AMB002' },
            { id: 3, ambulanceId: 'AMB003' }
        ];
        populateAmbulanceDropdown(sampleAmbulances);
    }
}

function populateAmbulanceDropdown(ambulances) {
    const select = document.getElementById('assigned-ambulance');
    select.innerHTML = '<option value="">Select Ambulance</option>';
    
    ambulances.forEach(ambulance => {
        const option = document.createElement('option');
        option.value = ambulance.id;
        option.textContent = ambulance.ambulanceId;
        select.appendChild(option);
    });
}

function updateStatistics() {
    const stats = {
        available: drivers.filter(d => d.status === 'available').length,
        onDuty: drivers.filter(d => d.status === 'on-duty').length,
        offDuty: drivers.filter(d => d.status === 'off-duty').length,
        total: drivers.length
    };
    
    document.getElementById('available-drivers').textContent = stats.available;
    document.getElementById('on-duty-drivers').textContent = stats.onDuty;
    document.getElementById('off-duty-drivers').textContent = stats.offDuty;
    document.getElementById('total-drivers').textContent = stats.total;
}

function renderDriverGrid() {
    const grid = document.getElementById('driver-grid');
    const filteredDrivers = getFilteredDrivers();
    
    if (filteredDrivers.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    grid.innerHTML = filteredDrivers.map(driver => {
        const fullName = `${driver.firstName} ${driver.lastName}`;
        const initials = `${driver.firstName[0]}${driver.lastName[0]}`;
        const licenseStatus = getLicenseStatus(driver.licenseExpiry);
        const experience = driver.experience ? `${driver.experience}y` : 'N/A';
        
        return `
            <div class="driver-card" onclick="showDriverDetails('${driver.id}')">
                <div class="driver-header">
                    <div style="display: flex; align-items: center;">
                        <div class="driver-avatar">${initials}</div>
                        <div class="driver-info">
                            <h3>${fullName}</h3>
                            <span class="employee-id">${driver.employeeId}</span>
                        </div>
                    </div>
                    <span class="status-badge ${driver.status}">${driver.status.replace('-', ' ')}</span>
                </div>
                
                <div class="driver-details-grid">
                    <div class="driver-detail">
                        <i class="fas fa-phone"></i>
                        <span>${driver.phone || 'N/A'}</span>
                    </div>
                    <div class="driver-detail">
                        <i class="fas fa-id-card"></i>
                        <span>${driver.licenseNumber}</span>
                    </div>
                    <div class="driver-detail">
                        <i class="fas fa-clock"></i>
                        <span>${formatShift(driver.shift)}</span>
                    </div>
                    <div class="driver-detail">
                        <i class="fas fa-ambulance"></i>
                        <span>${driver.assignedAmbulance || 'Unassigned'}</span>
                    </div>
                </div>
                
                <div class="driver-stats">
                    <div class="driver-stat">
                        <span class="number">${experience}</span>
                        <span class="label">Experience</span>
                    </div>
                    <div class="driver-stat">
                        <span class="number">${calculateAge(driver.dateOfBirth) || 'N/A'}</span>
                        <span class="label">Age</span>
                    </div>
                    <div class="driver-stat">
                        <span class="number">${calculateServiceYears(driver.joinDate) || 'N/A'}</span>
                        <span class="label">Service</span>
                    </div>
                </div>
                
                <div class="license-info">
                    <div class="license-status">
                        <span class="label">License Status:</span>
                        <span class="license-expiry ${licenseStatus.class}">${licenseStatus.text}</span>
                    </div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary);">
                        Expires: ${formatDate(driver.licenseExpiry)}
                    </div>
                </div>
                
                <div class="driver-actions">
                    <button class="btn-edit" onclick="event.stopPropagation(); editDriver('${driver.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteDriver('${driver.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getFilteredDrivers() {
    return drivers.filter(driver => {
        const matchesStatus = !currentStatusFilter || driver.status === currentStatusFilter;
        const matchesShift = !currentShiftFilter || driver.shift === currentShiftFilter;
        const matchesSearch = !currentSearch || 
            `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(currentSearch.toLowerCase()) ||
            driver.employeeId.toLowerCase().includes(currentSearch.toLowerCase()) ||
            driver.licenseNumber.toLowerCase().includes(currentSearch.toLowerCase());
        
        return matchesStatus && matchesShift && matchesSearch;
    });
}

function getLicenseStatus(expiryDate) {
    if (!expiryDate) return { text: 'Unknown', class: '' };
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
        return { text: 'Expired', class: 'expired' };
    } else if (daysUntilExpiry <= 30) {
        return { text: 'Expiring Soon', class: 'warning' };
    } else {
        return { text: 'Valid', class: '' };
    }
}

function formatShift(shift) {
    const shifts = {
        'day': 'Day Shift',
        'night': 'Night Shift',
        'rotating': 'Rotating'
    };
    return shifts[shift] || shift;
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function calculateServiceYears(joinDate) {
    if (!joinDate) return null;
    const today = new Date();
    const join = new Date(joinDate);
    const years = Math.floor((today - join) / (1000 * 60 * 60 * 24 * 365));
    return `${years}y`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function handleSearch(e) {
    currentSearch = e.target.value;
    renderDriverGrid();
}

function handleStatusFilter(e) {
    currentStatusFilter = e.target.value;
    renderDriverGrid();
}

function handleShiftFilter(e) {
    currentShiftFilter = e.target.value;
    renderDriverGrid();
}

function showAddDriverModal() {
    document.getElementById('modal-title').textContent = 'Add New Driver';
    document.getElementById('driver-form').reset();
    document.getElementById('driver-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editDriver(id) {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;
    
    document.getElementById('modal-title').textContent = 'Edit Driver';
    
    // Populate form fields
    document.getElementById('first-name').value = driver.firstName;
    document.getElementById('last-name').value = driver.lastName;
    document.getElementById('employee-id').value = driver.employeeId;
    document.getElementById('date-of-birth').value = driver.dateOfBirth || '';
    document.getElementById('phone').value = driver.phone || '';
    document.getElementById('email').value = driver.email || '';
    document.getElementById('address').value = driver.address || '';
    document.getElementById('license-number').value = driver.licenseNumber;
    document.getElementById('license-expiry').value = driver.licenseExpiry || '';
    document.getElementById('license-type').value = driver.licenseType || '';
    document.getElementById('medical-certificate').value = driver.medicalCertificate || '';
    document.getElementById('join-date').value = driver.joinDate || '';
    document.getElementById('shift').value = driver.shift || '';
    document.getElementById('status').value = driver.status;
    document.getElementById('assigned-ambulance').value = driver.assignedAmbulanceId || '';
    document.getElementById('experience').value = driver.experience || '';
    document.getElementById('emergency-contact-name').value = driver.emergencyContactName || '';
    document.getElementById('emergency-contact-relation').value = driver.emergencyContactRelation || '';
    document.getElementById('emergency-contact-phone').value = driver.emergencyContactPhone || '';
    
    // Store ID for updating
    document.getElementById('driver-form').dataset.editId = id;
    
    document.getElementById('driver-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const editId = e.target.dataset.editId;
    
    const driverData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        employeeId: formData.get('employeeId'),
        dateOfBirth: formData.get('dateOfBirth') || null,
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        licenseNumber: formData.get('licenseNumber'),
        licenseExpiry: formData.get('licenseExpiry') || null,
        licenseType: formData.get('licenseType'),
        medicalCertificate: formData.get('medicalCertificate') || null,
        joinDate: formData.get('joinDate') || null,
        shift: formData.get('shift'),
        status: formData.get('status'),
        assignedAmbulanceId: formData.get('assignedAmbulance') || null,
        experience: parseFloat(formData.get('experience')) || null,
        emergencyContactName: formData.get('emergencyContactName'),
        emergencyContactRelation: formData.get('emergencyContactRelation'),
        emergencyContactPhone: formData.get('emergencyContactPhone'),
        lastUpdated: new Date().toISOString()
    };
    
    try {
        let response;
        if (editId) {
            response = await fetch(`/api/drivers/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driverData)
            });
        } else {
            response = await fetch('/api/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driverData)
            });
        }
        
        if (response.ok) {
            showToast(editId ? 'Driver updated successfully!' : 'Driver added successfully!', 'success');
            closeDriverModal();
            loadDrivers();
        } else {
            throw new Error('Failed to save driver');
        }
    } catch (error) {
        console.error('Error saving driver:', error);
        showToast('Failed to save driver', 'error');
        
        // For demo purposes, update local data
        if (editId) {
            const index = drivers.findIndex(d => d.id === editId);
            if (index !== -1) {
                drivers[index] = { ...drivers[index], ...driverData };
            }
        } else {
            driverData.id = Date.now().toString();
            drivers.push(driverData);
        }
        
        updateStatistics();
        renderDriverGrid();
        closeDriverModal();
        showToast(editId ? 'Driver updated!' : 'Driver added!', 'success');
    }
}

async function deleteDriver(id) {
    if (!confirm('Are you sure you want to delete this driver?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/drivers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Driver deleted successfully!', 'success');
            loadDrivers();
        } else {
            throw new Error('Failed to delete driver');
        }
    } catch (error) {
        console.error('Error deleting driver:', error);
        showToast('Failed to delete driver', 'error');
        
        // For demo purposes, remove from local data
        drivers = drivers.filter(d => d.id !== id);
        updateStatistics();
        renderDriverGrid();
        showToast('Driver deleted!', 'success');
    }
}

function showDriverDetails(id) {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;
    
    const detailsContainer = document.getElementById('driver-details');
    const fullName = `${driver.firstName} ${driver.lastName}`;
    const licenseStatus = getLicenseStatus(driver.licenseExpiry);
    
    detailsContainer.innerHTML = `
        <div class="details-grid">
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Personal Information</h4>
                <ul class="detail-list">
                    <li><span class="label">Full Name:</span> <span>${fullName}</span></li>
                    <li><span class="label">Employee ID:</span> <span>${driver.employeeId}</span></li>
                    <li><span class="label">Date of Birth:</span> <span>${formatDate(driver.dateOfBirth)}</span></li>
                    <li><span class="label">Age:</span> <span>${calculateAge(driver.dateOfBirth) || 'N/A'}</span></li>
                    <li><span class="label">Phone:</span> <span>${driver.phone || 'N/A'}</span></li>
                    <li><span class="label">Email:</span> <span>${driver.email || 'N/A'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-id-card"></i> License & Certification</h4>
                <ul class="detail-list">
                    <li><span class="label">License Number:</span> <span>${driver.licenseNumber}</span></li>
                    <li><span class="label">License Type:</span> <span>${driver.licenseType || 'N/A'}</span></li>
                    <li><span class="label">Expiry Date:</span> <span class="license-expiry ${licenseStatus.class}">${formatDate(driver.licenseExpiry)}</span></li>
                    <li><span class="label">Status:</span> <span class="license-expiry ${licenseStatus.class}">${licenseStatus.text}</span></li>
                    <li><span class="label">Medical Certificate:</span> <span>${formatDate(driver.medicalCertificate)}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-briefcase"></i> Employment Details</h4>
                <ul class="detail-list">
                    <li><span class="label">Join Date:</span> <span>${formatDate(driver.joinDate)}</span></li>
                    <li><span class="label">Service Years:</span> <span>${calculateServiceYears(driver.joinDate) || 'N/A'}</span></li>
                    <li><span class="label">Shift:</span> <span>${formatShift(driver.shift)}</span></li>
                    <li><span class="label">Status:</span> <span class="status-badge ${driver.status}">${driver.status.replace('-', ' ')}</span></li>
                    <li><span class="label">Experience:</span> <span>${driver.experience ? `${driver.experience} years` : 'N/A'}</span></li>
                    <li><span class="label">Assigned Ambulance:</span> <span>${driver.assignedAmbulance || 'Unassigned'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-phone"></i> Emergency Contact</h4>
                <ul class="detail-list">
                    <li><span class="label">Contact Name:</span> <span>${driver.emergencyContactName || 'N/A'}</span></li>
                    <li><span class="label">Relation:</span> <span>${driver.emergencyContactRelation || 'N/A'}</span></li>
                    <li><span class="label">Phone:</span> <span>${driver.emergencyContactPhone || 'N/A'}</span></li>
                </ul>
            </div>
            
            <div class="detail-section" style="grid-column: 1 / -1;">
                <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
                <p>${driver.address || 'No address provided'}</p>
            </div>
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDriverModal() {
    document.getElementById('driver-modal').classList.remove('active');
    document.getElementById('driver-form').reset();
    document.getElementById('driver-form').removeAttribute('data-edit-id');
    document.body.style.overflow = '';
}

function closeDetailsModal() {
    document.getElementById('details-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function refreshData() {
    loadDrivers();
    showToast('Data refreshed successfully!', 'success');
}

function showLoadingState() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('driver-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('driver-grid').style.display = 'grid';
}

function showEmptyState() {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('driver-grid').style.display = 'none';
}

function hideEmptyState() {
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('driver-grid').style.display = 'grid';
}

function handleModalClose(e) {
    if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'driver-modal') {
            closeDriverModal();
        } else if (e.target.id === 'details-modal') {
            closeDetailsModal();
        }
    }
}

function handleKeyPress(e) {
    if (e.key === 'Escape') {
        closeDriverModal();
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
function getSampleDrivers() {
    return [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            employeeId: 'EMP001',
            dateOfBirth: '1985-06-15',
            phone: '+91-9876543210',
            email: 'john.doe@swiftaid.com',
            address: '123 Main Street, New Delhi',
            licenseNumber: 'DL1420110012345',
            licenseExpiry: '2025-06-15',
            licenseType: 'commercial',
            medicalCertificate: '2024-12-31',
            joinDate: '2020-03-15',
            shift: 'day',
            status: 'available',
            assignedAmbulance: 'AMB001',
            assignedAmbulanceId: '1',
            experience: 8,
            emergencyContactName: 'Jane Doe',
            emergencyContactRelation: 'Spouse',
            emergencyContactPhone: '+91-9876543211',
            lastUpdated: new Date().toISOString()
        },
        {
            id: '2',
            firstName: 'Michael',
            lastName: 'Smith',
            employeeId: 'EMP002',
            dateOfBirth: '1990-03-22',
            phone: '+91-9876543220',
            email: 'michael.smith@swiftaid.com',
            address: '456 Park Avenue, Delhi',
            licenseNumber: 'DL1420110023456',
            licenseExpiry: '2024-11-30',
            licenseType: 'emergency',
            medicalCertificate: '2024-08-15',
            joinDate: '2021-08-10',
            shift: 'night',
            status: 'on-duty',
            assignedAmbulance: 'AMB002',
            assignedAmbulanceId: '2',
            experience: 5,
            emergencyContactName: 'Robert Smith',
            emergencyContactRelation: 'Father',
            emergencyContactPhone: '+91-9876543221',
            lastUpdated: new Date(Date.now() - 300000).toISOString()
        },
        {
            id: '3',
            firstName: 'Sarah',
            lastName: 'Johnson',
            employeeId: 'EMP003',
            dateOfBirth: '1988-11-08',
            phone: '+91-9876543230',
            email: 'sarah.johnson@swiftaid.com',
            address: '789 Central Road, Gurgaon',
            licenseNumber: 'DL1420110034567',
            licenseExpiry: '2026-02-28',
            licenseType: 'heavy',
            medicalCertificate: '2025-01-15',
            joinDate: '2019-01-20',
            shift: 'rotating',
            status: 'off-duty',
            assignedAmbulance: null,
            assignedAmbulanceId: null,
            experience: 6,
            emergencyContactName: 'David Johnson',
            emergencyContactRelation: 'Husband',
            emergencyContactPhone: '+91-9876543231',
            lastUpdated: new Date(Date.now() - 600000).toISOString()
        }
    ];
}