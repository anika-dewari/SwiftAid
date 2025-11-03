import pool from '../db.js';

// ✅ Add a new hospital
export const addHospital = async (req, res) => {
  try {
    const { name, latitude, longitude, contact_info } = req.body;

    if (!name || !latitude || !longitude || !contact_info) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const result = await pool.query(
      `INSERT INTO hospitals (name, latitude, longitude, contact_info)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [name, latitude, longitude, contact_info]
    );

    res.status(201).json({
      message: 'Hospital added successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add hospital' });
  }
};

// ✅ Fetch all hospitals
export const getHospitals = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

// ✅ Update hospital details
export const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude, contact_info } = req.body;

    const query = `
      UPDATE hospitals
      SET name = $1,
          latitude = $2,
          longitude = $3,
          contact_info = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [name, latitude, longitude, contact_info, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json({
      message: 'Hospital updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update hospital' });
  }
};

// ✅ Delete a hospital
export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM hospitals WHERE id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json({
      message: 'Hospital deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete hospital' });
  }
};
