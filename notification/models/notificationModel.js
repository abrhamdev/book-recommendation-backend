/*import connection from '../config/mongodb.js'; 

export async function saveNotification({ type, payload }) {
  const sql = 'INSERT INTO notifications (type, payload) VALUES (?, ?)';
  const values = [type, JSON.stringify(payload)];

  try {
    await connection.execute(sql, values);
  } catch (err) {
    console.error('Failed to insert notification:', err);
  }
}
*/

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  userId: { type: Number, required: true },
  bookId: { type: String, required: true },
  reportCount: { type: Number, required: true },
  reportReason: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isSeen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;


export async function saveNotification(notificationData) {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
  } catch (err) {
    console.error('Failed to save notification to MongoDB:', err);
  }
}
