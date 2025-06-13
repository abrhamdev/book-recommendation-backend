import kafka from './config.js';

const producer = kafka.producer();

export async function produceMessage(topic, messages) {
  await producer.connect();
  await producer.send({
    topic,
    messages: Array.isArray(messages) ? messages : [messages],
  });
  await producer.disconnect();
}
