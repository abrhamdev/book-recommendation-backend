import app from './app.js';
import dotenv from 'dotenv';
import {BOOK_REPORT_ALERT_TOPIC} from "./kafka/topics.js";
import { consumeMessages } from "./kafka/consumer.js";
import { handleKafkaMessage } from './kafka/messageHandler.js';

dotenv.config();

const port = process.env.PORT;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
      await consumeMessages(BOOK_REPORT_ALERT_TOPIC, handleKafkaMessage);
      console.log(`Kafka consumer subscribed to topic: ${BOOK_REPORT_ALERT_TOPIC}`);
    } catch (err) {
      console.error('Error starting Kafka consumer:', err);
    }
});
