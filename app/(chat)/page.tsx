

"use client"
import ChatBox from '@/components/shared/ChatBox';
import RightSidebar from '@/components/shared/RightSidebar';
import { useEffect, useState } from 'react';
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "SPORTEN | Messaging",
// };
export const dynamic = 'force-dynamic'
const ChatPage = () => {
  const [size, setSize] = useState<number>()
useEffect(() => {
    setSize(window.innerWidth)
    window.addEventListener('resize',()=>{setSize(window.innerWidth)})
}, [size])
  return (
    <div className="">
      {/* sm and md */}
    { size&&size<1280&& <div className="flex relative justify-center items-center overflow-hidden h-[100vh] ">
    <RightSidebar isChat isxl islg={false} />
      </div>}
      {/* lg */}
     { size&&size>=1280&& <div className="flex relative justify-center items-center overflow-hidden h-[100vh] ">
    <RightSidebar isChat islg={true} />
    <ChatBox/>
      </div>}
  </div>
  );
};

export default ChatPage;
