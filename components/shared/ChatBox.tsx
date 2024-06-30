"use client";
import { createMessage } from "@/lib/actions/message.actions";
import { PostData } from "@/lib/actions/post.actions";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";
import { UserData, fetchUser } from "@/lib/actions/user.actions";
import { formatDistanceToNow,format } from "date-fns";
import { pusherClient } from "@/lib/pusher";
import { GetChat } from "@/lib/actions/room.actions";
import { currentUser } from '@clerk/nextjs/server';
import { SignOutButton, SignedIn } from "@clerk/nextjs";

interface User {
  _id: string;
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  sport: string;
  phone: string;
  posts: PostData[];
  communities: string[];
  onboarding: boolean;
  type: string;
  friends: Friend[];
}

interface Friend {
  _id: string;
  id: string;
  name: string;
  username: string;
  image: string;
}

interface Message {
  content: string;
  sender: {
    _id: string | undefined;
    id: string | undefined;
    name: string | undefined;
    image: string | undefined;
    sport: string | undefined;
  };
  timestamp: Date;
  recipient: {
      _id: string | undefined;
      id: string | undefined;
      name: string | undefined;
      image: string | undefined;
      sport: string | undefined;
  };
}

const ChatBox: React.FC<{ Ids?: string }> = ({ Ids }) => {
  let userId = Ids?.split("-")[0];
  let frindId = Ids?.split("-")[1];
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let path = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null | undefined>(null);
  const [chatJSon, setChat] = useState<string>();
  let chat = chatJSon && JSON.parse(chatJSon);
  useEffect(() => {
    const fetchData = async () => {
      const userInfo2 = await fetchUser()
      setUserInfo(userInfo2);
      if (!userInfo2?.onboarding) router.replace("/onboarding");
      if (frindId) {
        const chat = await GetChat({
          friendId: frindId,
          userId: userInfo2?._id,
          path: path,
        });
        chat 
        && setChat(JSON.stringify(chat)); 
        if(chat &&chat.chat&& chat.chat.messages ){ 
          let messages=chat?.chat?.messages
          setMessages((prevMessages) =>{ 
            let FullMessages = [...prevMessages,...messages]
            FullMessages.sort((a: any, b: any) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
            return FullMessages})
        }
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const subscribedChannel = pusherClient.subscribe("chat");
    chat &&
      chat?.chat &&
      chat?.chat?.name &&
      subscribedChannel.bind(chat.chat.name, (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, [chat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMessageSend = async () => {
    console.log(inputValue, chat?.chat?.name);
    if (inputValue.trim() === "") return;
    if (!userInfo) return;
    try {
      if (frindId && userInfo && chat) {
        await createMessage(
          JSON.stringify(userInfo),
          frindId,
          inputValue,
          chat?.chat?.name
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      return;
    }
    setInputValue("");
    inputRef.current?.focus();
  };
  if(userInfo && chat ){
  let result=chat.chat.users.filter((user:{_id:string}) => user._id !==userId)[0];
  return  (
    <div className=" bottom-0 p-4 pb-10 relative rounded-lg w-full h-full flex flex-col">
      <div className="  flex z-50 absolute top-0 left-0 right-0">
      <Link
          href={"/messaging"}
          className="px-2 py-2 bg-blue-500 text-white rounded-lg max-xl:block hidden">
          <Image src="/assets/Goback.svg" alt="Goback" height={20} width={20} />
        </Link>
        <div className="user-card_avatar bg-[#ffffff20] max-xl:p-0 p-1">
        <div className="relative   aspect-square h-[48px] w-[48px]  ">
                      <img
                        src={result?.image}
                        alt="post image"
                        className="absolute inset-0 w-full h-full rounded-full object-cover"
                      />
                    </div>
                {/* <Image src={result?.image} alt={result?.name} height={48} width={48} className=' cursor-pointer rounded-full object-contain'/> */}
            <div className=" flex-1 text-ellipsis">
                <h3 className=' text-base-semibold text-[#ffffff]'>{result?.name}</h3>
                {/* <p className=" text-small-semibold text-gray-1">@{result?.username}</p> */}
            </div>
            <div className="px-10">
          <SignedIn>
            <SignOutButton redirectUrl="/sign-in">
              <div className="flex gap-4 cursor-pointer">
                <Image src='/assets/logout.svg' alt='logout' width={24} height={24}/>
                <span className=' text-[#fff]  max-lg:hidden'>logout</span>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
     
    </div>
        
      </div>
      <div className="flex-1 pt-16 overflow-y-auto">
        {messages.map((message, index) => {
          const timestamp = format(message.timestamp,"HH:mm");
          const timestamp2 = formatDistanceToNow(message.timestamp);
          return (
            <div key={index} className={`mb-2 flex ${message.sender._id===userId?"":"flex-row-reverse"}`}>
              <div className={`flex relative w-fit min-w-[15rem] pb-3 pe-3 rounded-lg ${message.sender._id===userId?"bg-[#429df5] ":" bg-[#d16cca] text-[#ffffff] "}`}>

              <div className="">
              <div className="relative   aspect-square h-[40px] w-[40px]  mr-2 ">
                      <img
                        src={message.sender.image!}
                        alt={message.sender.name!}
                        className="absolute inset-0 w-full h-full rounded-full object-cover"
                      />
                    </div>
              {/* <Image
                src={message.sender.image!}
                alt={message.sender.name!}
                height={40}
                width={40}
                className="rounded-full mr-2"
                /> */}
                </div>
              <div className="flex flex-col">
                <span className="font-semibold">{message.sender.name}</span>
                <p className="text-sm py-3">{message.content}</p>
                <span className={`text-xs absolute bottom-0 right-1  ${message.sender._id===userId?"text-gray-500":" text-gray-300"}`}>{timestamp}</span>
              </div>
                </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="mb-16"/>
      </div>
      <div className=" flex fixed bottom-2 lg:left-80 left-2 right-0">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-2 border border-gray-300 rounded-lg mr-2"
        />
        <button
          onClick={handleMessageSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          <Image src="/assets/send.svg" alt="send" height={40} width={40} />
        </button>
      </div>
    </div>
  ) }else{

   return <Loader is />
  } 
  
};

export default ChatBox;