import connection from '../config/mongodb.js'; 

export async function saveNotification({ type, payload }) {
  const sql = 'INSERT INTO notifications (type, payload) VALUES (?, ?)';
  const values = [type, JSON.stringify(payload)];

  try {
    await connection.execute(sql, values);
  } catch (err) {
    console.error('Failed to insert notification:', err);
  }
}
