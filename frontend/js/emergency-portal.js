// Emergency Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeEmergencyPortal();
});

function initializeEmergencyPortal() {
    // Get form elements
    const emergencyForm = document.getElementById('emergency-form');
    const getLocationBtn = document.getElementById('get-location');
    const clearFormBtn = document.getElementById('clear-form');
    const locationStatus = document.getElementById('location-status');

    // Form submission handler
    emergencyForm.addEventListener('submit', handleFormSubmission);

    // Get location handler
    getLocationBtn.addEventListener('click', getCurrentLocation);

    // Clear form handler
    clearFormBtn.addEventListener('click', clearForm);

    // Initialize form validation
    initializeFormValidation();
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(form);
    
    // Prepare emergency request data
    const emergencyData = {
        patientName: formData.get('patientName'),
        patientAge: parseInt(formData.get('patientAge')),
        patientGender: formData.get('patientGender'),
        patientPhone: formData.get('patientPhone'),
        emergencyType: formData.get('emergencyType'),
        severity: formData.get('severity'),
        symptoms: formData.get('symptoms'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        callerName: formData.get('callerName'),
        callerRelation: formData.get('callerRelation'),
        specialInstructions: formData.get('specialInstructions'),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    try {
        // Submit to backend API
        const response = await fetch('/api/emergency-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emergencyData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showSuccessPage(result);
            showToast('Emergency request submitted successfully!', 'success');
        } else {
            throw new Error('Failed to submit emergency request');
        }
    } catch (error) {
        console.error('Error submitting emergency request:', error);
        showToast('Failed to submit request. Please try again or call emergency services.', 'error');
        hideLoadingState(form);
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validate phone number
    const phoneField = form.querySelector('#patient-phone');
    const phonePattern = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (phoneField.value && !phonePattern.test(phoneField.value)) {
        phoneField.classList.add('error');
        isValid = false;
    }
    
    // Validate pincode
    const pincodeField = form.querySelector('#pincode');
    const pincodePattern = /^[0-9]{6}$/;
    if (pincodeField.value && !pincodePattern.test(pincodeField.value)) {
        pincodeField.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

function showLoadingState(form) {
    form.classList.add('form-loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner"></div>Submitting...';
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = originalText;
}

function hideLoadingState(form) {
    form.classList.remove('form-loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = submitBtn.dataset.originalText;
    submitBtn.disabled = false;
}

function showSuccessPage(result) {
    // Hide form section
    document.querySelector('.emergency-form-section').style.display = 'none';
    
    // Show status section
    const statusSection = document.getElementById('status-section');
    statusSection.style.display = 'block';
    
    // Update request details
    const requestDetails = document.getElementById('request-details');
    const trackingId = document.getElementById('tracking-id');
    
    // Generate request ID
    const requestId = `ER-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    trackingId.textContent = requestId;
    
    // Populate request details
    requestDetails.innerHTML = `
        <div class="detail-row">
            <strong>Patient:</strong> ${result.patientName || 'N/A'}
        </div>
        <div class="detail-row">
            <strong>Emergency Type:</strong> ${result.emergencyType || 'N/A'}
        </div>
        <div class="detail-row">
            <strong>Severity:</strong> ${result.severity || 'N/A'}
        </div>
        <div class="detail-row">
            <strong>Location:</strong> ${result.city || 'N/A'}
        </div>
        <div class="detail-row">
            <strong>Status:</strong> <span class="status-badge pending">Pending Assignment</span>
        </div>
    `;
    
    // Scroll to status section
    statusSection.scrollIntoView({ behavior: 'smooth' });
}

async function getCurrentLocation() {
    const locationBtn = document.getElementById('get-location');
    const locationStatus = document.getElementById('location-status');
    const addressField = document.getElementById('address');
    const cityField = document.getElementById('city');
    
    if (!navigator.geolocation) {
        locationStatus.textContent = 'Geolocation is not supported by this browser';
        locationStatus.className = 'location-status error';
        return;
    }
    
    locationStatus.textContent = 'Getting your location...';
    locationStatus.className = 'location-status';
    locationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                
                // Reverse geocoding to get address
                const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const result = data.results[0];
                        addressField.value = result.formatted || `${latitude}, ${longitude}`;
                        cityField.value = result.components.city || result.components.town || '';
                        
                        if (result.components.postcode) {
                            document.getElementById('pincode').value = result.components.postcode;
                        }
                        
                        locationStatus.textContent = 'Location updated successfully';
                        locationStatus.className = 'location-status success';
                    }
                } else {
                    // Fallback to coordinates
                    addressField.value = `Latitude: ${latitude}, Longitude: ${longitude}`;
                    locationStatus.textContent = 'Location coordinates added';
                    locationStatus.className = 'location-status success';
                }
            } catch (error) {
                console.error('Error getting address:', error);
                const { latitude, longitude } = position.coords;
                addressField.value = `Latitude: ${latitude}, Longitude: ${longitude}`;
                locationStatus.textContent = 'Location coordinates added';
                locationStatus.className = 'location-status success';
            }
            
            locationBtn.disabled = false;
        },
        (error) => {
            let errorMessage;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location services.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred.';
                    break;
            }
            
            locationStatus.textContent = errorMessage;
            locationStatus.className = 'location-status error';
            locationBtn.disabled = false;
        }
    );
}

function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.getElementById('emergency-form').reset();
        document.getElementById('location-status').textContent = '';
        document.getElementById('location-status').className = 'location-status';
        
        // Remove error classes
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        showToast('Form cleared successfully', 'info');
    }
}

function initializeFormValidation() {
    const form = document.getElementById('emergency-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const isRequired = field.hasAttribute('required');
    const value = field.value.trim();
    
    if (isRequired && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Specific validation rules
    if (field.type === 'tel' && value) {
        const phonePattern = /^[+]?[\d\s\-\(\)]{10,15}$/;
        if (!phonePattern.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    if (field.name === 'pincode' && value) {
        const pincodePattern = /^[0-9]{6}$/;
        if (!pincodePattern.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    if (field.name === 'patientAge' && value) {
        const age = parseInt(value);
        if (age < 0 || age > 150) {
            field.classList.add('error');
            return false;
        }
    }
    
    field.classList.remove('error');
    return true;
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
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
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

function copyRequestId() {
    const requestId = document.getElementById('tracking-id').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(requestId).then(() => {
            showToast('Request ID copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(requestId);
        });
    } else {
        fallbackCopyTextToClipboard(requestId);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Request ID copied to clipboard!', 'success');
        } else {
            showToast('Failed to copy request ID', 'error');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showToast('Failed to copy request ID', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});