
import pool from '../db.js';

// To Fetch all ambulances
export const getAmbulances = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ambulances ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
};

// Add a new ambulance
export const addAmbulance = async (req, res) => {
  try {
    const { vehicle_no, driver_name, latitude, longitude } = req.body;

    if (!vehicle_no || !driver_name || !latitude || !longitude) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const query = `
  INSERT INTO ambulances(vehicle_no, driver_name, latitude, longitude)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

const values = [vehicle_no, driver_name, latitude, longitude];

const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Ambulance added successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add ambulance' });
  }
};
