"use server";
import { connectDB } from "@/mongoose";
import Room from "../models/room.model";
import { revalidatePath } from "next/cache";
import { addFriend } from "./user.actions";
import User from '../models/user.models';
import Message from "../models/messages.models";
interface AddFriendParams {
    userId?: string;
    friendId: string;
    path: string;
  }
  interface ChatROOM {
    _id: string;
    name: string,
    users: any[],
    messages: any[]
  }
export async function GetChat({
    friendId,
    userId,
    path,
  }: AddFriendParams) {
    connectDB();
    try {
      if (!userId || !friendId) {
        console.log("userId أو friendId غير موجود");
        return;
      }
        const ChatRoom:ChatROOM|null = await Room.findOne(
          { name: `${userId}-${friendId}` },
        ).populate({path:'users',model:User,select:'_id id name image sport'}).populate({path:"messages",model:Message,populate:[{path:"sender",model:User,select:"_id id name image sport"},{path:"recipient",model:User,select:"_id id name image sport"}]}).lean();
        if (ChatRoom) {
            // revalidatePath(path);
            return {chat: ChatRoom, ids: `${userId}-${friendId}`}
        }else{
            const ChatRoom2:ChatROOM|null = await Room.findOne(
                { name:`${friendId}-${userId}` },
            ).populate({path:'users',model:User,select:'_id id name image sport'}).populate({path:"messages",model:Message,populate:[{path:"sender",model:User,select:"_id id name image sport"},{path:"recipient",model:User,select:"_id id name image sport"}]}).lean();
            if (ChatRoom2) {
                // revalidatePath(path);
                return {chat: ChatRoom2, ids: `${friendId}-${userId}`}
            }else{
                let createChat:ChatROOM|undefined = await addFriend({friendId: friendId, userId: userId,path: path,isFriend:true,isChat:true});
                revalidatePath(path);
                return {chat: createChat, ids: `${userId}-${friendId}`}
            }
        }
    } catch (error: any) {
      console.log(`فشل في إضافة/إزالة الصديق: ${error.message}`);
    }
  }
  