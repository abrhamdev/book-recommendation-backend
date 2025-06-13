export function serialize(data) {
  return Buffer.from(JSON.stringify(data));
}

export function deserialize(buffer) {
  return JSON.parse(buffer.toString());
}
