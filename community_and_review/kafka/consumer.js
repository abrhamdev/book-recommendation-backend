import kafka from './config.js';

const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'community-group' });

export async function consumeMessages(topic, messageHandler) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        await messageHandler(message);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });
}
