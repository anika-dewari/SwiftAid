// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    verify: `${API_BASE_URL}/api/auth/verify`,
  },
  drivers: {
    profile: `${API_BASE_URL}/api/drivers/profile`,
    status: `${API_BASE_URL}/api/drivers/status`,
    stats: `${API_BASE_URL}/api/drivers/stats`,
    all: `${API_BASE_URL}/api/drivers`,
    available: `${API_BASE_URL}/api/drivers/available`,
  },
  emergencyRequests: {
    create: `${API_BASE_URL}/api/emergency-requests`,
    all: `${API_BASE_URL}/api/emergency-requests`,
    pending: `${API_BASE_URL}/api/emergency-requests/pending`,
  },
  notifications: {
    all: `${API_BASE_URL}/api/notifications`,
    unreadCount: `${API_BASE_URL}/api/notifications/unread-count`,
  },
};
