import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'notification_microservice',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export default kafka;
