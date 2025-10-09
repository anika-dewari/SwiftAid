import pool from '../db.js';

export const addHospital = async (req, res) => {
  try {
    const { name, latitude, longitude, contact_info } = req.body;
    const result = await pool.query(
      `INSERT INTO hospitals(name, latitude, longitude, contact_info) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, latitude, longitude, contact_info]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add hospital' });
  }
};

export const getHospitals = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};
