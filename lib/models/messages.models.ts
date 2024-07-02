import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String},
  fileUrl: { type: String},
  sender: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  recipient: { type:mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

const Message = mongoose.models?.Message || mongoose.model('Message', messageSchema);

export default Message;
