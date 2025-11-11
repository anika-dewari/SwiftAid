// authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Register new user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, full_name, phone, driverDetails } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role, full_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, full_name, phone, created_at',
      [email, password_hash, role, full_name, phone]
    );

    const user = userResult.rows[0];

    // If role is driver, create driver profile
    if (role === 'driver' && driverDetails) {
      const {
        license_number,
        vehicle_type,
        vehicle_number,
        vehicle_model,
        experience_years,
        bio
      } = driverDetails;

      await pool.query(
        `INSERT INTO driver_profiles 
        (user_id, license_number, vehicle_type, vehicle_number, vehicle_model, experience_years, bio, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'offline')`,
        [user.id, license_number, vehicle_type, vehicle_number, vehicle_model || null, experience_years || 0, bio || null]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get driver profile if user is a driver
    let driverProfile = null;
    if (user.role === 'driver') {
      const driverResult = await pool.query(
        'SELECT * FROM driver_profiles WHERE user_id = $1',
        [user.id]
      );
      if (driverResult.rows.length > 0) {
        driverProfile = driverResult.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        driverProfile: driverProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userResult = await pool.query(
      'SELECT id, email, role, full_name, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get driver profile if user is a driver
    if (user.role === 'driver') {
      const driverResult = await pool.query(
        'SELECT * FROM driver_profiles WHERE user_id = $1',
        [userId]
      );
      if (driverResult.rows.length > 0) {
        user.driverProfile = driverResult.rows[0];
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { full_name, phone } = req.body;

    const result = await pool.query(
      'UPDATE users SET full_name = $1, phone = $2 WHERE id = $3 RETURNING id, email, role, full_name, phone',
      [full_name, phone, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify token (middleware can use this)
export const verifyToken = async (req, res) => {
  res.json({ valid: true, user: req.user });
};
