// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Auth Debug:', {
      hasToken: !!token,
      jwtSecret: JWT_SECRET ? 'Loaded' : 'Missing'
    });

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log('❌ JWT Verification Error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      console.log('✅ JWT Verified:', { userId: user.userId, role: user.role });
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Check if user has required role
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🔑 Role Check:', {
      userRole: req.user?.role,
      allowedRoles,
      hasUser: !!req.user
    });

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Role Authorization Failed:', {
        userRole: req.user.role,
        required: allowedRoles
      });
      return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
    }

    console.log('✅ Role Authorization Passed');
    next();
  };
};

// Optional authentication (for routes that work with or without auth)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }
    next();
  } catch (error) {
    next();
  }
};
