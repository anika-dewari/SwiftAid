import pool from '../db.js';

export const addEmergencyRequest = async (req, res) => {
  try {
    const { patient_name, severity, latitude, longitude } = req.body;
    const result = await pool.query(
      `INSERT INTO emergency_requests(patient_name, severity, latitude, longitude)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [patient_name, severity, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add emergency request' });
  }
};

export const getEmergencyRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emergency_requests');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch emergency requests' });
  }
};
