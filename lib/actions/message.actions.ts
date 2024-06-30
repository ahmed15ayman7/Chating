"use server"
import User from '../models/user.models';
import Message from '../models/messages.models';
import { pusherServer } from '../pusher';
import Room from "../models/room.model";
import { connectDB } from '@/mongoose';
interface Message {
  content: string;
  sender: {
    _id:string|undefined,
    id:string|undefined,
    name:string|undefined,
    image:string|undefined,
    sport:string|undefined,
  };
  timestamp: Date;
  recipient: string;
}
export const createMessage = async (
  senderId: string,
  recipientId: string,
  content: string,
  RoomName: string|undefined,
): Promise<void> => {
  let sender=JSON.parse(senderId);

  const message: Message = {
    content: content,
    sender:{
      _id:sender._id,
      id:sender.id,
      name:sender.name,
      image:sender.image,
      sport:sender.sport,
    } ,
    timestamp: new Date(),
    recipient: recipientId,
  };
  console.log("---------------------------------------------------------------------------------------------------")
  RoomName&& pusherServer.trigger("chat",RoomName,message)
  console.log("---------------------------------------------------------------------------------------------------")
  connectDB();
  try {
    const newMessage0 = new Message({
      content:content,
      sender: sender._id,
      recipient: recipientId,
    });
    let newMessage = await newMessage0.save();
    console.log("---------------------------------------------------------------------------------------------------")
    RoomName&&await Room.findOneAndUpdate( { name: RoomName },{
      $push: { messages: newMessage._id },
    });
  } catch (error) {
    console.error('Error creating message and adding to user:', error);
    throw error;
  }
};
