import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  clubId: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('ChatMessage', chatMessageSchema);
