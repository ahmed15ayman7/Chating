"use server";
import { connectDB } from "@/mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Post from "../models/post.models";
import User from "../models/user.models";
import { PostData } from "./post.actions";
import bcrypt from 'bcrypt';
import { signUpSchema,loginSchema } from '@/lib/validations/authSchemas';
import Message from "../models/messages.models";
import Room from "../models/room.model";

export async function Regester(data: any) {
        try {
            connectDB();
      const { email, password } = signUpSchema.parse(data);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return "Email already in use" ;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return "true"
    } catch (error:any) {
      return  `${error.errors}` ;
    }
  
}
export async function LoginF(data: any) {
  try {
    const { email, password } = loginSchema.parse(data);
    const user = await User.findOne({ email: email});
    if (!user) {
      console.log( "Invalid email or password" )
      return "Invalid email or password" 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid  password")
      return "Invalid password"
    }

    console.log( "Login successful")
    return "Login successful" 
  } catch (error:any) {
    console.log(error);
    return  `${error}` ;
  }
  
}

interface props {
  userId: string | undefined;
  email: string | undefined;
  username: string;
  name: string;
  bio: string;
  image: string;
  phone: string;
  path: string;
}
export interface UserData {
  _id: string;
  id: string;
  username: string;
  email:string;
  name: string;
  bio: string;
  image: string;
  phone: string;
  onboarding: boolean;
}
export interface Result {
  _id: string|undefined;
  email: string|undefined;
  name: string|undefined;
  image: string|undefined;
  id: string|undefined;
  type: string|undefined;
  phone: string|undefined;
  posts: PostData[]|undefined;
}
export async function updateUser({
  userId,
  email,
  username,
  name,
  bio,
  image,
  path,
  phone,
}: props): Promise<void> {
  connectDB();
  try {
    await User.findOneAndUpdate(
       {email:email},
      {
        username: username,
        bio: bio,
        name: name,
        image: image,
        onboarding: true,
        phone: phone,
      },
      { upsert: true }
    );
    console.log("Successfully updated user");
    if (path.includes("/profile/edit")) {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(`failed to update user: ${error.message}`);
  }
}
export async function fetchUser(email: string | undefined) {
  try {
    connectDB();
    let userInfo: UserData | null = await User.findOne({ email: email })

    if (!userInfo) {
      console.log("user not found");
      console.log("found user with id ");
    }
    
    return JSON.stringify( userInfo);
  } catch (error: any) {
    console.log(`not found user: ${error.message}`);
  }
}
export async function fetchAllUser({
  searchString = "",
  pageNum = 1,
  pageSize = 20,
  sortBy = "desc",
  userId
}: {
  searchString: string;
  userId: string;
  pageNum: number;
  pageSize: number;
  sortBy?: SortOrder;
}) {
  try {
    connectDB();
    let skipAmount = (pageNum - 1) * pageSize;
    let regex = new RegExp(searchString, "i");
    let query: FilterQuery<typeof User> = { _id: { $ne:userId  } };
    if (searchString.trim() !== "") {
      query.$or = [
        { name: { $regex: regex } },
        { username: { $regex: regex } },
        { sport: { $regex: regex } },
      ];
    }
    let users = await User.find(query )
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .exec();
    const totalUsers = await User.countDocuments(query);
    let isNext = +totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    console.log(`not found user: ${error.message}`);
  }
}
export async function fetchUserPosts(userId: string) {
  connectDB();
  try {
    let posts: Result | null = await User.findOne({ id: userId })
      .populate({
        path: "posts",
        model: Post,
        populate: [
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "id name image",
            },
          },
        ],
      })
      .lean();
    return posts;
  } catch (error: any) {
    console.log(`not found user: ${error.message}`);
  }
}
interface ActivityData {
    createdAt: Date;
    text:string;
    author:{
      _id:string, name:string, image:string, sport:string,
    },parentId:string,type:string
  }
  
  interface ReactData {
    createdAt: Date;
    user:{
      _id:string, name:string, image:string, sport:string
    },
    _id:string,
    type:string,parentId:string
  }
export async function getActivity (userId:string) {
    connectDB();
    try {
        let userPosts= await Post.find({author:userId}).populate({
            path: 'react.user',
            model: User,
            select: '_id name image sport'
          }).lean();
        let childPostIds= userPosts.reduce((acc :any , post : any) =>acc.concat(post.children),[])
        let reacts:ReactData[]= userPosts.reduce((acc :any , post : any) =>acc.concat(post.react.map((e:{user:any,_id:string,createdAt:any})=>{return{...e,type:"react",parentId:post._id}})),[])
        let replies :ActivityData[] = await Post.find({_id:{$in:childPostIds},author:{$ne:userId}})
        .populate({
            path:'author',
            model:User,
            select:'_id name image sport'
        }).lean();
        return {activity:replies,reacts};
    }catch(e:any){
        console.log(`not found user: ${e.message}`);

    }
}
interface AddFriendParams {
  userId?: string;
  friendId: string;
  path: string;
  isFriend: boolean;
  isChat?: boolean;
}
interface ChatROOM {
  _id: string;
  name: string,
  users: any[],
  messages: any[]
}
export async function addFriend({
  friendId,
  userId,
  path,
  isFriend,
  isChat
}: AddFriendParams) {
  connectDB();
  try {
    if (!userId || !friendId) {
      console.log("userId أو friendId غير موجود");
      return;
    }

       const updateOperation = isFriend
      ? { $pull: { friends: friendId } }
      : { $push: { friends: friendId } };
      const updateFriendQ = isFriend ? { $pull: { friends: userId } } : { $push: { friends: userId } }

      const ChatRoom:ChatROOM|null = await Room.findOneAndUpdate(
        { name: { $in: [`${userId}-${friendId}`, `${friendId}-${userId}`] } },
        { $setOnInsert: { name: `${userId}-${friendId}`, users: [userId, friendId] } },
        { upsert: true, new: true }
      ).populate({path:'users',model:User,select:'_id id name image sport'}).populate({path:"messages",model:Message,populate:[{path:"sender",model:User,select:"_id id name image sport"},{path:"recipient",model:User,select:"_id id name image sport"}]}).lean();
      let user=await User.findById(userId);
      let isChatAdded=user?user?.rooms?user.rooms.includes(ChatRoom?._id):false:false;
      if(ChatRoom){
        let quary=!isChatAdded?
          { $push: { rooms: ChatRoom._id } ,
          ...updateOperation}:
          updateOperation
          let quary2=!isChatAdded?{
             $push: { rooms: ChatRoom._id } ,
            ...updateFriendQ}:
            updateFriendQ
            await User.findByIdAndUpdate(userId, quary);
            await User.findByIdAndUpdate(
            friendId,
            quary2
          );
          if (isChat) {
            return ChatRoom;
          }
      }
      

    console.log("نجاح في إضافة/إزالة الصديق");
    revalidatePath(path); // Assuming you have a function to revalidate the path
  } catch (error: any) {
    console.log(`فشل في إضافة/إزالة الصديق: ${error.message}`);
  }
}

