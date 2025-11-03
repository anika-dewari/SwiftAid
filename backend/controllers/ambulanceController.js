import pool from '../db.js';

// ✅ Fetch all ambulances
export const getAmbulances = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ambulances ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
};

// ✅ Add new ambulance
export const addAmbulance = async (req, res) => {
  try {
    const { vehicle_no, driver_name, latitude, longitude } = req.body;

    if (!vehicle_no || !driver_name || !latitude || !longitude) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const query = `
      INSERT INTO ambulances (vehicle_no, driver_name, latitude, longitude)
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

// ✅ Update an ambulance
export const updateAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_name, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE ambulances
       SET driver_name = $1, latitude = $2, longitude = $3
       WHERE id = $4
       RETURNING *`,
      [driver_name, latitude, longitude, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating ambulance:', err);
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
};

// ✅ Delete an ambulance
export const deleteAmbulance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM ambulances WHERE id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.status(200).json({
      message: 'Ambulance deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
};
