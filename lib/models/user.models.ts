import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type:'string'},
    name: {type:'string'},
    phone: {type:'string' },
    email: {type:'string', required: true},
    password:{type:'string', required: true},
    image: {type:'string'},
    bio:{type:'string'},
    onboarding: {type: 'boolean', default: false},
    messages: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    updatedAt: {
        type: Date,
        default: Date.now,
      },
 });
 const User = mongoose.models?.User || mongoose.model('User', userSchema);
 export default User;