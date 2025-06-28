import { saveNotification } from '../models/notificationModel.js';

export async function handleKafkaMessage(message) {
  try {
    const data = JSON.parse(message.value.toString());

    const enrichedNotification = {
          type: 'BOOK_REPORT_ALERT',
          userId: data.userId,
          bookId: data.bookId,
          reportCount: data.reportCount,
          reportReason: data.reportReason,
          message: `This book has been reported ${data.reportCount} time(s). Reason: ${data.reportReason}`,
        };
     
     await saveNotification(enrichedNotification);

    console.log('Notification saved from Kafka message:', data);
  } catch (err) {
    console.error('Failed to process Kafka message:', err);
  }
}
