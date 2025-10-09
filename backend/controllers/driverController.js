import pool from '../db.js';

// Create driver
export const addDriver = async (req, res) => {
  try {
    const { name, phone, ambulance_id } = req.body;
    const query = `
      INSERT INTO drivers(name, phone, ambulance_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, phone, ambulance_id]);
    res.status(201).json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add driver' });
  }
};

// Get all drivers
export const getDrivers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

// Update driver
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, ambulance_id } = req.body;
    const query = `
      UPDATE drivers
      SET name=$1, phone=$2, ambulance_id=$3
      WHERE id=$4
      RETURNING *;
    `;
    const result = await pool.query(query, [name, phone, ambulance_id, id]);
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update driver' });
  }
};

// Delete driver
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM drivers WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};
