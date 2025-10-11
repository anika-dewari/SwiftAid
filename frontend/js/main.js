// Loading Screen Handler
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    // Add loading class to body
    body.classList.add('loading');
    
    // Simulate loading time and fade out
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        body.classList.remove('loading');
        body.classList.add('loaded');
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000); // 2 second loading time
});

// Initialize AOS (Animate On Scroll) with enhanced settings
AOS.init({
    duration: 1200,
    easing: 'ease-out-cubic',
    once: true,
    offset: 120,
    delay: 100
});

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        AMBULANCES: '/ambulances',
        HOSPITALS: '/hospitals',
        DRIVERS: '/drivers',
        EMERGENCIES: '/emergencies',
        DISPATCH: '/dispatch'
    },
    TIMEOUT: 10000
};

// Navigation System
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    }

    init() {
        this.setupNavigationListeners();
        this.updateActiveNavigation();
    }

    setupNavigationListeners() {
        // Navigation buttons from main dashboard
        const navButtons = {
            'emergency-portal-btn': 'emergency-portal.html',
            'ambulance-management-btn': 'ambulances.html',
            'hospital-management-btn': 'hospitals.html',
            'driver-management-btn': 'drivers.html'
        };

        Object.entries(navButtons).forEach(([buttonId, targetPage]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(targetPage);
                });
            }
        });

        // Back to dashboard buttons
        const backButtons = document.querySelectorAll('.back-to-dashboard, .btn-back');
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('index.html');
            });
        });

        // Logo clicks
        const logos = document.querySelectorAll('.logo, .navbar-brand');
        logos.forEach(logo => {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('index.html');
            });
        });
    }

    navigateTo(page) {
        // Add smooth transition
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = page;
        }, 200);
    }

    updateActiveNavigation() {
        const navItems = document.querySelectorAll('.nav-item, .sidebar-item');
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href && href.includes(this.currentPage)) {
                    item.classList.add('active');
                }
            }
        });
    }
}

// API Utilities
class APIManager {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: this.timeout,
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            this.handleAPIError(error);
            throw error;
        }
    }

    handleAPIError(error) {
        // Show user-friendly error message
        if (typeof showToast === 'function') {
            showToast('Connection error. Please check your network connection.', 'error');
        }
    }

    // Ambulance API methods
    async getAmbulances() {
        return this.request(API_CONFIG.ENDPOINTS.AMBULANCES);
    }

    async createAmbulance(data) {
        return this.request(API_CONFIG.ENDPOINTS.AMBULANCES, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateAmbulance(id, data) {
        return this.request(`${API_CONFIG.ENDPOINTS.AMBULANCES}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteAmbulance(id) {
        return this.request(`${API_CONFIG.ENDPOINTS.AMBULANCES}/${id}`, {
            method: 'DELETE'
        });
    }

    // Hospital API methods
    async getHospitals() {
        return this.request(API_CONFIG.ENDPOINTS.HOSPITALS);
    }

    async createHospital(data) {
        return this.request(API_CONFIG.ENDPOINTS.HOSPITALS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateHospital(id, data) {
        return this.request(`${API_CONFIG.ENDPOINTS.HOSPITALS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteHospital(id) {
        return this.request(`${API_CONFIG.ENDPOINTS.HOSPITALS}/${id}`, {
            method: 'DELETE'
        });
    }

    // Driver API methods
    async getDrivers() {
        return this.request(API_CONFIG.ENDPOINTS.DRIVERS);
    }

    async createDriver(data) {
        return this.request(API_CONFIG.ENDPOINTS.DRIVERS, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateDriver(id, data) {
        return this.request(`${API_CONFIG.ENDPOINTS.DRIVERS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteDriver(id) {
        return this.request(`${API_CONFIG.ENDPOINTS.DRIVERS}/${id}`, {
            method: 'DELETE'
        });
    }

    // Emergency API methods
    async createEmergency(data) {
        return this.request(API_CONFIG.ENDPOINTS.EMERGENCIES, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getEmergencies() {
        return this.request(API_CONFIG.ENDPOINTS.EMERGENCIES);
    }

    async dispatchEmergency(emergencyId, ambulanceId) {
        return this.request(API_CONFIG.ENDPOINTS.DISPATCH, {
            method: 'POST',
            body: JSON.stringify({ emergencyId, ambulanceId })
        });
    }
}

// Global instances
window.navigationManager = new NavigationManager();
window.apiManager = new APIManager();

// Global Variables
let map;
let ambulanceMarkers = [];
let hospitalMarkers = [];
let emergencyMarkers = [];
let responseChart;
let volumeChart;

// Enhanced Navbar Scroll Effect with parallax
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const parallaxSpeed = scrollY * 0.5;
        hero.style.transform = `translateY(${parallaxSpeed}px)`;
    }
});

// Enhanced Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Add body scroll lock when mobile menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced Smooth Scrolling with easing and page navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Statistics Counter Animation with easing
function animateCounter(element, start, end, duration, decimals = 0) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const value = start + (end - start) * easeProgress;
        
        if (decimals > 0) {
            element.textContent = value.toFixed(decimals);
        } else {
            element.textContent = Math.floor(value);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize Statistics Animation with staggered timing
function initializeStats() {
    const stats = [
        { id: 'ambulances-available', value: 24, delay: 0 },
        { id: 'hospitals-online', value: 12, delay: 200 },
        { id: 'avg-response-time', value: 4.2, delay: 400, decimals: 1 },
        { id: 'emergency-requests', value: 7, delay: 600 }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            setTimeout(() => {
                animateCounter(element, 0, stat.value, 2500, stat.decimals || 0);
            }, stat.delay);
        }
    });
}

// Enhanced Map Initialization with custom styling
function initializeMap() {
    // Initialize map with custom styling
    map = L.map('emergency-map', {
        zoomControl: false,
        attributionControl: false
    }).setView([40.7128, -74.0060], 11);

    // Add custom zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Custom tile layer with darker theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Sample data with enhanced properties
    const ambulanceLocations = [
        { lat: 40.7589, lng: -73.9851, id: 'AMB001', status: 'available', driver: 'John Smith', equipment: 'Advanced Life Support' },
        { lat: 40.7505, lng: -73.9934, id: 'AMB002', status: 'en-route', driver: 'Sarah Johnson', equipment: 'Basic Life Support' },
        { lat: 40.7282, lng: -74.0776, id: 'AMB003', status: 'available', driver: 'Mike Wilson', equipment: 'Advanced Life Support' },
        { lat: 40.6892, lng: -74.0445, id: 'AMB004', status: 'busy', driver: 'Emily Davis', equipment: 'Critical Care' },
        { lat: 40.7831, lng: -73.9712, id: 'AMB005', status: 'available', driver: 'David Brown', equipment: 'Basic Life Support' }
    ];

    const hospitalLocations = [
        { lat: 40.7614, lng: -73.9776, name: 'Central Medical Center', beds: 12, specialty: 'Emergency & Trauma', rating: 4.8 },
        { lat: 40.7505, lng: -73.9934, name: 'Metropolitan Hospital', beds: 8, specialty: 'Cardiology', rating: 4.6 },
        { lat: 40.7282, lng: -74.0776, name: 'City General Hospital', beds: 15, specialty: 'General Medicine', rating: 4.7 },
        { lat: 40.6892, lng: -74.0445, name: 'Downtown Medical', beds: 6, specialty: 'Pediatrics', rating: 4.9 }
    ];

    const emergencyLocations = [
        { lat: 40.7489, lng: -73.9857, type: 'cardiac', priority: 'high', time: '3 min ago', reporter: 'Bystander' },
        { lat: 40.7308, lng: -74.0062, type: 'accident', priority: 'medium', time: '7 min ago', reporter: 'Police' },
        { lat: 40.7723, lng: -73.9632, type: 'respiratory', priority: 'high', time: '1 min ago', reporter: 'Family Member' }
    ];

    // Create enhanced custom icons
    const createCustomIcon = (className, iconClass, color) => {
        return L.divIcon({
            className: `custom-marker ${className}`,
            html: `<div class="marker-inner" style="background: ${color}"><i class="${iconClass}"></i></div>`,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });
    };

    const ambulanceIcon = createCustomIcon('ambulance-marker', 'fas fa-ambulance', '#00B4D8');
    const hospitalIcon = createCustomIcon('hospital-marker', 'fas fa-hospital', '#1E3A8A');
    const emergencyIcon = createCustomIcon('emergency-marker', 'fas fa-exclamation-circle', '#E63946');

    // Add enhanced ambulance markers
    ambulanceLocations.forEach((ambulance, index) => {
        const marker = L.marker([ambulance.lat, ambulance.lng], { icon: ambulanceIcon })
            .bindPopup(`
                <div class="enhanced-popup ambulance-popup">
                    <div class="popup-header">
                        <h4><i class="fas fa-ambulance"></i> ${ambulance.id}</h4>
                        <span class="status-badge ${ambulance.status}">${ambulance.status}</span>
                    </div>
                    <div class="popup-content">
                        <p><strong>Driver:</strong> ${ambulance.driver}</p>
                        <p><strong>Equipment:</strong> ${ambulance.equipment}</p>
                        <p><strong>Last Update:</strong> Just now</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn">Track</button>
                        <button class="popup-btn">Contact</button>
                    </div>
                </div>
            `);
        
        ambulanceMarkers.push(marker);
        marker.addTo(map);
        
        // Add breathing animation to available ambulances
        if (ambulance.status === 'available') {
            setTimeout(() => {
                marker.getElement().classList.add('breathing');
            }, index * 200);
        }
    });

    // Add enhanced hospital markers
    hospitalLocations.forEach((hospital, index) => {
        const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon })
            .bindPopup(`
                <div class="enhanced-popup hospital-popup">
                    <div class="popup-header">
                        <h4><i class="fas fa-hospital"></i> ${hospital.name}</h4>
                        <div class="rating">
                            ${'★'.repeat(Math.floor(hospital.rating))} ${hospital.rating}
                        </div>
                    </div>
                    <div class="popup-content">
                        <p><strong>Available Beds:</strong> <span class="beds-count">${hospital.beds}</span></p>
                        <p><strong>Specialty:</strong> ${hospital.specialty}</p>
                        <p><strong>Status:</strong> <span class="status-active">Accepting Patients</span></p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn">Reserve Bed</button>
                        <button class="popup-btn">Call</button>
                    </div>
                </div>
            `);
        
        hospitalMarkers.push(marker);
        marker.addTo(map);
    });

    // Add enhanced emergency markers
    emergencyLocations.forEach((emergency, index) => {
        const marker = L.marker([emergency.lat, emergency.lng], { icon: emergencyIcon })
            .bindPopup(`
                <div class="enhanced-popup emergency-popup">
                    <div class="popup-header">
                        <h4><i class="fas fa-exclamation-triangle"></i> Emergency Call</h4>
                        <span class="priority-badge ${emergency.priority}">${emergency.priority} priority</span>
                    </div>
                    <div class="popup-content">
                        <p><strong>Type:</strong> ${emergency.type}</p>
                        <p><strong>Reporter:</strong> ${emergency.reporter}</p>
                        <p><strong>Time:</strong> ${emergency.time}</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn emergency">Dispatch</button>
                        <button class="popup-btn">Details</button>
                    </div>
                </div>
            `);
        
        emergencyMarkers.push(marker);
        marker.addTo(map);
        
        // Add pulsing animation to high priority emergencies
        if (emergency.priority === 'high') {
            setTimeout(() => {
                marker.getElement().classList.add('pulsing');
            }, index * 150);
        }
    });

    // Add enhanced CSS for map markers and popups
    addMapStyles();
}

// Map Filter Controls
function initializeMapControls() {
    const mapButtons = document.querySelectorAll('.map-btn');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            mapButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterMapMarkers(filter);
        });
    });
}

function filterMapMarkers(filter) {
    // Hide all markers first
    ambulanceMarkers.forEach(marker => map.removeLayer(marker));
    hospitalMarkers.forEach(marker => map.removeLayer(marker));
    emergencyMarkers.forEach(marker => map.removeLayer(marker));
    
    // Show markers based on filter
    switch(filter) {
        case 'ambulances':
            ambulanceMarkers.forEach(marker => map.addLayer(marker));
            break;
        case 'hospitals':
            hospitalMarkers.forEach(marker => map.addLayer(marker));
            break;
        case 'emergencies':
            emergencyMarkers.forEach(marker => map.addLayer(marker));
            break;
        case 'all':
        default:
            ambulanceMarkers.forEach(marker => map.addLayer(marker));
            hospitalMarkers.forEach(marker => map.addLayer(marker));
            emergencyMarkers.forEach(marker => map.addLayer(marker));
            break;
    }
}

// Initialize Charts
function initializeCharts() {
    // Response Time Chart
    const responseCtx = document.getElementById('responseChart').getContext('2d');
    responseChart = new Chart(responseCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            datasets: [{
                label: 'Response Time (minutes)',
                data: [5.2, 4.8, 3.9, 4.5, 4.2, 4.7, 5.1],
                borderColor: '#1E3A8A',
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1E3A8A',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 8,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748B'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748B'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Emergency Volume Chart
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    volumeChart = new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Emergency Requests',
                data: [45, 52, 38, 67, 89, 95, 78],
                backgroundColor: [
                    '#00B4D8',
                    '#1E3A8A',
                    '#00B4D8',
                    '#1E3A8A',
                    '#E63946',
                    '#E63946',
                    '#00B4D8'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#64748B'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748B'
                    }
                }
            }
        }
    });
}

// Real-time Data Updates with enhanced animations
function updateRealtimeData() {
    setInterval(() => {
        // Generate realistic random values
        const newAmbulances = Math.floor(Math.random() * 5) + 22; // 22-26
        const newHospitals = Math.floor(Math.random() * 3) + 11; // 11-13
        const newResponseTime = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
        const newEmergencies = Math.floor(Math.random() * 8) + 3; // 3-10

        // Update with smooth animations
        updateStatWithAnimation('ambulances-available', newAmbulances);
        updateStatWithAnimation('hospitals-online', newHospitals);
        updateStatWithAnimation('avg-response-time', newResponseTime);
        updateStatWithAnimation('emergency-requests', newEmergencies);

        // Update chart data with smooth transitions
        if (responseChart) {
            updateChartData(responseChart, parseFloat(newResponseTime));
        }
        
        if (volumeChart) {
            // Simulate daily volume changes
            const newVolumeData = volumeChart.data.datasets[0].data.map(value => 
                Math.max(20, Math.min(100, value + (Math.random() - 0.5) * 10))
            );
            volumeChart.data.datasets[0].data = newVolumeData;
            volumeChart.update('active');
        }
    }, 8000); // Update every 8 seconds
}

function updateStatWithAnimation(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        const currentValue = parseFloat(element.textContent) || 0;
        animateCounter(element, currentValue, parseFloat(newValue), 1500, elementId.includes('time') ? 1 : 0);
        
        // Add glow effect during update
        element.parentElement.parentElement.style.boxShadow = '0 0 30px rgba(0, 180, 216, 0.3)';
        setTimeout(() => {
            element.parentElement.parentElement.style.boxShadow = '';
        }, 1500);
    }
}

function updateChartData(chart, newValue) {
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(newValue);
    chart.update('active');
}

// Enhanced Contact Form Handler
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageTextarea = contactForm.querySelector('textarea');
            const submitBtn = contactForm.querySelector('.btn');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageTextarea.value.trim();
            
            // Enhanced validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Animate form submission
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';
            
            // Add loading animation to form
            contactForm.classList.add('loading');
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success animation
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981, #34D399)';
                submitBtn.style.transform = 'scale(1.05)';
                
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Clear form with animation
                [nameInput, emailInput, messageTextarea].forEach(input => {
                    input.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        input.value = '';
                        input.style.transform = 'scale(1)';
                    }, 300);
                });
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                contactForm.classList.remove('loading');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(20px);
                z-index: 10000;
                transform: translateX(450px);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: 'Poppins', sans-serif;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: rgba(16, 185, 129, 0.9);
                border-left: 4px solid #10B981;
                color: white;
            }
            
            .notification-error {
                background: rgba(239, 68, 68, 0.9);
                border-left: 4px solid #EF4444;
                color: white;
            }
            
            .notification-info {
                background: rgba(59, 130, 246, 0.9);
                border-left: 4px solid #3B82F6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i {
                font-size: 18px;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 12px;
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    });
}

// Intersection Observer for enhanced scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for different sections
                if (entry.target.classList.contains('stat-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                }
                
                if (entry.target.classList.contains('feature-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.stat-card, .feature-card, .chart-container').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Add performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load charts when visible
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !responseChart && !volumeChart) {
                initializeCharts();
                chartObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const analyticsSection = document.getElementById('analytics');
    if (analyticsSection) {
        chartObserver.observe(analyticsSection);
    }
    
    // Optimize map rendering
    if (map) {
        map.on('zoomstart', () => {
            document.querySelectorAll('.custom-marker').forEach(marker => {
                marker.style.transition = 'none';
            });
        });
        
        map.on('zoomend', () => {
            document.querySelectorAll('.custom-marker').forEach(marker => {
                marker.style.transition = 'all 0.3s ease';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Initialize all components
    setTimeout(() => {
        initializeStats();
        initializeMap();
        initializeMapControls();
        initializeContactForm();
        initializeScrollAnimations();
        initializePerformanceOptimizations();
        
        // Start real-time updates
        updateRealtimeData();
        
        // Remove loading class
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 500);
});

// Handle window resize for responsive behavior
window.addEventListener('resize', debounce(() => {
    if (responseChart) responseChart.resize();
    if (volumeChart) volumeChart.resize();
    if (map) map.invalidateSize();
}, 250));

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Close any open popups
        document.querySelectorAll('.leaflet-popup-close-button').forEach(btn => btn.click());
    }
});

// Add focus management for accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1E3A8A;
        color: white;
        padding: 8px;
        z-index: 10000;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.id = 'main-content';
        heroSection.setAttribute('tabindex', '-1');
    }
});

// Emergency simulation for demo purposes
function simulateEmergencyCall() {
    const emergencyTypes = ['cardiac', 'accident', 'respiratory', 'trauma', 'stroke'];
    const priorities = ['high', 'medium', 'low'];
    const locations = [
        { lat: 40.7589, lng: -73.9851 },
        { lat: 40.7505, lng: -73.9934 },
        { lat: 40.7282, lng: -74.0776 },
        { lat: 40.6892, lng: -74.0445 },
        { lat: 40.7831, lng: -73.9712 }
    ];
    
    setInterval(() => {
        const randomType = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        // Show notification for new emergency
        if (randomPriority === 'high') {
            showNotification(`HIGH PRIORITY: ${randomType} emergency reported`, 'error');
        }
        
        console.log(`New ${randomPriority} priority ${randomType} emergency at [${randomLocation.lat}, ${randomLocation.lng}]`);
    }, 45000); // Every 45 seconds
}

// Start emergency simulation
simulateEmergencyCall();

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide back to top button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', debounce(toggleBackToTop, 100));
    backToTopBtn.addEventListener('click', scrollToTop);
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = new Map();
        this.defaultDuration = 5000;
    }

    show(message, type = 'info', title = '', duration = this.defaultDuration) {
        const toast = this.createToast(message, type, title);
        this.container.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove after duration
        const timeoutId = setTimeout(() => {
            this.hide(toast);
        }, duration);

        // Store timeout ID for manual removal
        this.toasts.set(toast, timeoutId);

        return toast;
    }

    createToast(message, type, title) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${iconMap[type] || iconMap.info}"></i>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add click handlers
        toast.addEventListener('click', () => this.hide(toast));
        toast.querySelector('.toast-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide(toast);
        });

        return toast;
    }

    hide(toast) {
        if (this.toasts.has(toast)) {
            clearTimeout(this.toasts.get(toast));
            this.toasts.delete(toast);
        }

        toast.classList.add('hide');
        toast.classList.remove('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    success(message, title = 'Success') {
        return this.show(message, 'success', title);
    }

    error(message, title = 'Error') {
        return this.show(message, 'error', title);
    }

    warning(message, title = 'Warning') {
        return this.show(message, 'warning', title);
    }

    info(message, title = '') {
        return this.show(message, 'info', title);
    }
}

// Initialize toast manager
const toast = new ToastManager();

// Example usage - show welcome message
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        toast.success('Emergency Dispatch System is ready!', 'System Online');
    }, 2500);
});

// Emergency Simulation System
function initializeEmergencySimulation() {
    const simulateBtn = document.getElementById('simulate-emergency');
    const resetBtn = document.getElementById('reset-simulation');
    const statusEl = document.getElementById('simulation-status');
    const statusDot = statusEl.querySelector('.status-dot');
    const statusText = statusEl.querySelector('.status-text');
    
    if (!simulateBtn || !resetBtn || !statusEl) return;

    let simulationRunning = false;

    function updateStatus(status, text) {
        statusDot.className = `status-dot ${status}`;
        statusText.textContent = text;
    }

    function simulateEmergency() {
        if (simulationRunning) return;
        
        simulationRunning = true;
        simulateBtn.disabled = true;
        
        // Step 1: Emergency Detected
        updateStatus('emergency', 'Emergency Detected');
        toast.error('Emergency call received: Cardiac arrest reported at Downtown Plaza', 'Emergency Alert');
        
        setTimeout(() => {
            // Step 2: Dispatching
            updateStatus('processing', 'Dispatching Ambulance');
            toast.warning('Analyzing optimal ambulance deployment...', 'Processing');
            
            // Simulate real-time updates to the stats
            updateStatNumbers();
            
            setTimeout(() => {
                // Step 3: En Route
                updateStatus('processing', 'Ambulance En Route');
                toast.info('Ambulance #7 dispatched - ETA: 4 minutes', 'Unit Dispatched');
                
                setTimeout(() => {
                    // Step 4: Hospital Selection
                    updateStatus('processing', 'Selecting Hospital');
                    toast.info('Optimal hospital selected: Central Medical Center', 'Hospital Assigned');
                    
                    setTimeout(() => {
                        // Step 5: Completed
                        updateStatus('online', 'System Ready');
                        toast.success('Patient successfully transported to hospital', 'Emergency Resolved');
                        
                        simulationRunning = false;
                        simulateBtn.disabled = false;
                    }, 2000);
                }, 3000);
            }, 2500);
        }, 2000);
    }

    function resetSimulation() {
        if (simulationRunning) return;
        
        updateStatus('online', 'System Ready');
        toast.info('System has been reset to initial state', 'System Reset');
        
        // Reset stats to original values
        document.getElementById('ambulances-available').textContent = '24';
        document.getElementById('hospitals-online').textContent = '12';
        document.getElementById('avg-response').textContent = '3.8min';
        document.getElementById('emergencies-today').textContent = '47';
    }

    function updateStatNumbers() {
        // Simulate real-time stat changes during emergency
        const ambulancesEl = document.getElementById('ambulances-available');
        const emergenciesEl = document.getElementById('emergencies-today');
        
        if (ambulancesEl) {
            const current = parseInt(ambulancesEl.textContent);
            ambulancesEl.textContent = current - 1;
        }
        
        if (emergenciesEl) {
            const current = parseInt(emergenciesEl.textContent);
            emergenciesEl.textContent = current + 1;
        }
    }

    // Event listeners
    simulateBtn.addEventListener('click', simulateEmergency);
    resetBtn.addEventListener('click', resetSimulation);
}

// Initialize emergency simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEmergencySimulation);

// Initialize back to top
initializeBackToTop();
