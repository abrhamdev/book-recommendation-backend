import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'community_and_review',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export default kafka;
