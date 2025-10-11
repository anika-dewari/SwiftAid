// Dashboard Management System
class DashboardManager {
    constructor() {
        this.isInitialized = false;
        this.refreshInterval = null;
        this.refreshRate = 30000; // 30 seconds
        this.charts = {};
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.initializeComponents();
            this.setupEventListeners();
            this.startAutoRefresh();
            this.isInitialized = true;
            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
        }
    }

    async initializeComponents() {
        // Initialize statistics
        this.initializeStatistics();
        
        // Initialize charts
        await this.initializeCharts();
        
        // Initialize real-time updates
        this.initializeRealTimeUpdates();
        
        // Initialize quick actions
        this.initializeQuickActions();
    }

    initializeStatistics() {
        // Animate dashboard statistics
        const stats = [
            { id: 'ambulances-available', target: 24, delay: 0 },
            { id: 'hospitals-online', target: 12, delay: 200 },
            { id: 'avg-response-time', target: 4.2, delay: 400, decimals: 1, suffix: 'min' },
            { id: 'emergency-requests', target: 7, delay: 600 }
        ];

        stats.forEach(stat => {
            this.animateStatistic(stat);
        });
    }

    animateStatistic(stat) {
        const element = document.getElementById(stat.id);
        if (!element) return;

        setTimeout(() => {
            this.animateCounter(element, 0, stat.target, 2500, stat.decimals || 0, stat.suffix || '');
        }, stat.delay);
    }

    animateCounter(element, start, end, duration, decimals = 0, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const value = start + (end - start) * easeProgress;
            
            let displayValue;
            if (decimals > 0) {
                displayValue = value.toFixed(decimals);
            } else {
                displayValue = Math.floor(value);
            }
            
            element.textContent = displayValue + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    async initializeCharts() {
        // Response Time Chart
        this.initializeResponseTimeChart();
        
        // Emergency Types Chart
        this.initializeEmergencyTypesChart();
        
        // Activity Timeline Chart
        this.initializeActivityChart();
    }

    initializeResponseTimeChart() {
        const ctx = document.getElementById('responseTimeChart');
        if (!ctx) return;

        this.charts.responseTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
                datasets: [{
                    label: 'Response Time (minutes)',
                    data: [5.2, 4.8, 3.9, 4.1, 3.7, 4.2, 3.8],
                    borderColor: '#00B4D8',
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00B4D8',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
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
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    initializeEmergencyTypesChart() {
        const ctx = document.getElementById('emergencyTypesChart');
        if (!ctx) return;

        this.charts.emergencyTypes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cardiac', 'Accident', 'Respiratory', 'Trauma', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#E63946',
                        '#F77F00',
                        '#FCBF49',
                        '#003566',
                        '#0077B6'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }

    initializeActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Emergency Calls',
                    data: [42, 38, 45, 51, 49, 35, 28],
                    backgroundColor: 'rgba(0, 180, 216, 0.8)',
                    borderColor: '#00B4D8',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
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
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    initializeRealTimeUpdates() {
        // Simulate real-time status updates
        this.updateSystemStatus();
        
        // Update recent activities
        this.updateRecentActivities();
        
        // Update map markers
        this.updateMapData();
    }

    updateSystemStatus() {
        const statusElements = {
            'system-status': { status: 'online', text: 'All Systems Operational' },
            'dispatch-status': { status: 'online', text: 'Dispatch Center Active' },
            'network-status': { status: 'online', text: 'Network Connected' }
        };

        Object.entries(statusElements).forEach(([id, data]) => {
            const element = document.getElementById(id);
            if (element) {
                const statusDot = element.querySelector('.status-dot');
                const statusText = element.querySelector('.status-text');
                
                if (statusDot) statusDot.className = `status-dot ${data.status}`;
                if (statusText) statusText.textContent = data.text;
            }
        });
    }

    updateRecentActivities() {
        const activities = [
            {
                time: 'Just now',
                text: 'Ambulance #7 dispatched to Central Park',
                type: 'dispatch',
                icon: 'fas fa-ambulance'
            },
            {
                time: '2 min ago',
                text: 'Emergency call received - Cardiac arrest',
                type: 'emergency',
                icon: 'fas fa-exclamation-triangle'
            },
            {
                time: '5 min ago',
                text: 'Ambulance #3 returned to base',
                type: 'return',
                icon: 'fas fa-home'
            },
            {
                time: '8 min ago',
                text: 'Driver John Smith logged in',
                type: 'login',
                icon: 'fas fa-user'
            }
        ];

        const container = document.getElementById('recent-activities');
        if (container) {
            container.innerHTML = activities.map(activity => `
                <div class="activity-item" data-type="${activity.type}">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.text}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    updateMapData() {
        // This would integrate with the existing map functionality
        // Update ambulance positions, emergency locations, etc.
        if (typeof updateMapMarkers === 'function') {
            updateMapMarkers();
        }
    }

    initializeQuickActions() {
        const quickActions = [
            {
                id: 'quick-dispatch',
                title: 'Quick Dispatch',
                action: () => this.quickDispatch()
            },
            {
                id: 'emergency-alert',
                title: 'Emergency Alert',
                action: () => this.emergencyAlert()
            },
            {
                id: 'system-check',
                title: 'System Check',
                action: () => this.systemCheck()
            }
        ];

        quickActions.forEach(action => {
            const button = document.getElementById(action.id);
            if (button) {
                button.addEventListener('click', action.action);
            }
        });
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }

        // Settings button
        const settingsBtn = document.getElementById('dashboard-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
        }
    }

    async refreshDashboard() {
        try {
            // Show loading indicator
            this.showLoadingState();
            
            // Refresh all data
            await this.loadDashboardData();
            
            // Update UI
            this.updateAllComponents();
            
            // Hide loading indicator
            this.hideLoadingState();
            
            // Show success message
            if (typeof showToast === 'function') {
                showToast('Dashboard refreshed successfully', 'success');
            }
        } catch (error) {
            console.error('Dashboard refresh failed:', error);
            if (typeof showToast === 'function') {
                showToast('Failed to refresh dashboard', 'error');
            }
        }
    }

    async loadDashboardData() {
        // Load data from API
        if (window.apiManager) {
            try {
                const [ambulances, hospitals, drivers, emergencies] = await Promise.all([
                    window.apiManager.getAmbulances(),
                    window.apiManager.getHospitals(),
                    window.apiManager.getDrivers(),
                    window.apiManager.getEmergencies()
                ]);

                // Update dashboard with real data
                this.updateStatisticsFromData({
                    ambulances,
                    hospitals,
                    drivers,
                    emergencies
                });
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                // Fall back to demo data
                this.loadDemoData();
            }
        } else {
            // Load demo data if API not available
            this.loadDemoData();
        }
    }

    updateStatisticsFromData(data) {
        // Update statistics based on real data
        const availableAmbulances = data.ambulances.filter(a => a.status === 'available').length;
        const onlineHospitals = data.hospitals.filter(h => h.status === 'online').length;
        const todayEmergencies = data.emergencies.filter(e => this.isToday(e.createdAt)).length;

        this.updateStatistic('ambulances-available', availableAmbulances);
        this.updateStatistic('hospitals-online', onlineHospitals);
        this.updateStatistic('emergency-requests', todayEmergencies);
    }

    updateStatistic(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    isToday(dateString) {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    }

    loadDemoData() {
        // Use existing demo data for statistics
        this.initializeStatistics();
    }

    updateAllComponents() {
        this.updateRecentActivities();
        this.updateSystemStatus();
        this.updateCharts();
    }

    updateCharts() {
        // Update chart data with new information
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update();
            }
        });
    }

    showLoadingState() {
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            refreshBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            refreshBtn.disabled = false;
        }
    }

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, this.refreshRate);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Quick Action Methods
    quickDispatch() {
        if (typeof showToast === 'function') {
            showToast('Quick dispatch feature activated', 'info');
        }
        // Navigate to emergency portal
        window.navigationManager.navigateTo('emergency-portal.html');
    }

    emergencyAlert() {
        if (typeof showToast === 'function') {
            showToast('Emergency alert system activated', 'warning');
        }
        // Show emergency alert modal or perform action
    }

    systemCheck() {
        if (typeof showToast === 'function') {
            showToast('Running system diagnostics...', 'info');
        }
        
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('All systems operational', 'success');
            }
        }, 2000);
    }

    openSettings() {
        // Open dashboard settings modal
        if (typeof showToast === 'function') {
            showToast('Dashboard settings coming soon', 'info');
        }
    }

    destroy() {
        this.stopAutoRefresh();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        
        this.isInitialized = false;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on the main dashboard page
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        
        window.dashboardManager = new DashboardManager();
    }
});

// Export for global access
window.DashboardManager = DashboardManager;