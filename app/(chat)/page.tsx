"use client";
import ChatBox from "@/components/shared/ChatBox";
import RightSidebar from "@/components/shared/RightSidebar";
import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";
const ChatPage = () => {
  const [size, setSize] = useState<number>();
  const [openChat, setChat] = useState<string>("");
  useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener("resize", () => {
      setSize(window.innerWidth);
    });
  }, [size]);
  return (
    <div className="">
      {/* sm and md */}
      {size && size < 1280 && (
        <div className="flex relative justify-center items-center overflow-hidden h-[100vh] ">
          <RightSidebar isChat isxl islg={false} />
        </div>
      )}
      {/* lg */}
      {size && size >= 1280 && (
        <div className="flex relative justify-center items-center overflow-hidden h-[100vh] ">
          <RightSidebar isChat islg={true}  setChat={setChat} Ids={openChat} />
          <ChatBox Ids={openChat}/>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
