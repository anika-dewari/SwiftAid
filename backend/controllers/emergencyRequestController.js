import pool from '../db.js';

// ✅ Add a new emergency request
export const addEmergencyRequest = async (req, res) => {
  try {
    const { patient_name, severity, latitude, longitude } = req.body;

    if (!patient_name || !severity || !latitude || !longitude) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const result = await pool.query(
      `INSERT INTO emergency_requests (patient_name, severity, latitude, longitude)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [patient_name, severity, latitude, longitude]
    );

    res.status(201).json({
      message: 'Emergency request added successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add emergency request' });
  }
};

// ✅ Fetch all emergency requests
export const getEmergencyRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emergency_requests ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch emergency requests' });
  }
};

// ✅ Update an emergency request
export const updateEmergencyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, severity, latitude, longitude } = req.body;

    const query = `
      UPDATE emergency_requests
      SET patient_name = $1,
          severity = $2,
          latitude = $3,
          longitude = $4
      WHERE id = $5
      RETURNING *;
    `;

    const values = [patient_name, severity, latitude, longitude, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Emergency request not found' });
    }

    res.status(200).json({
      message: 'Emergency request updated successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update emergency request' });
  }
};

// ✅ Delete an emergency request
export const deleteEmergencyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM emergency_requests WHERE id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Emergency request not found' });
    }

    res.status(200).json({
      message: 'Emergency request deleted successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete emergency request' });
  }
};
