import pool from '../db.js';

const nearestEntityQuery = (table, lat, lon) => `
  SELECT id, ${table==='ambulances'?'vehicle_no, driver_name,':'name,'}
  (6371 * acos(
    cos(radians(${lat})) * cos(radians(latitude)) *
    cos(radians(longitude) - radians(${lon})) +
    sin(radians(${lat})) * sin(radians(latitude))
  )) AS distance_km
  FROM ${table} ${table==='ambulances'?"WHERE status='AVAILABLE'":""}
  ORDER BY distance_km LIMIT 1;
`;

export const createFullDispatch = async (req, res) => {
  const client = await pool.connect();
  try {
    const { patient_name, severity, latitude, longitude } = req.body;
    await client.query('BEGIN');

    // nearest ambulance
    const ambRes = await client.query(nearestEntityQuery('ambulances', latitude, longitude));
    if(!ambRes.rows.length){ await client.query('ROLLBACK'); return res.status(404).json({error:'No ambulance available'});}
    const ambulance = ambRes.rows[0];

    // nearest hospital
    const hospRes = await client.query(nearestEntityQuery('hospitals', latitude, longitude));
    const hospital = hospRes.rows[0];

    // insert emergency request
    const reqRes = await client.query(
      `INSERT INTO emergency_requests(patient_name,severity,latitude,longitude,status)
       VALUES($1,$2,$3,$4,'DISPATCHED') RETURNING *`,
      [patient_name, severity, latitude, longitude]
    );
    const emergencyRequest = reqRes.rows[0];

    // create dispatch
    const dispatchRes = await client.query(
      `INSERT INTO dispatch_records(ambulance_id, request_id) VALUES($1,$2) RETURNING *`,
      [ambulance.id, emergencyRequest.id]
    );

    // update ambulance status
    await client.query('UPDATE ambulances SET status=$1 WHERE id=$2',['BUSY',ambulance.id]);

    await client.query('COMMIT');
    res.status(201).json({ambulance,hospital,emergencyRequest,dispatch:dispatchRes.rows[0]});
  } catch(err){
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({error:'Failed to create dispatch'});
  } finally {
    client.release();
  }
};
