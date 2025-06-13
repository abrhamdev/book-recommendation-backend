import { saveNotification } from '../models/notificationModel.js';

export async function handleKafkaMessage(message) {
  try {
    const data = JSON.parse(message.value.toString());

    /* Save the notification to DB
    await saveNotification({
      type: 'BOOK_REPORT_ALERT',
      payload: data, // You can adjust depending on the schema
    });
     */
     

    console.log('Notification saved from Kafka message:', data);
  } catch (err) {
    console.error('Failed to process Kafka message:', err);
  }
}
