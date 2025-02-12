"use client"
import { useState, useEffect } from 'react';
import { fetchAllUser, fetchUser } from "@/lib/actions/user.actions";
import { SugCard } from "../cards/sugCard";
import { useRouter } from 'next/navigation';
// import { pusherServer } from '@/lib/pusher';

interface Props {
  isChat?: boolean;
  Ids?: string;
  setChat?: any;
  isxl?: boolean;
  islg?: boolean;
}

const RightSidebar: React.FC<Props> = ({ isChat, Ids, isxl,islg,setChat }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [refrish, setrefrish] = useState<any>(null);
  let navigate =useRouter()
  useEffect(() => {
    let user=JSON.parse(`${localStorage.getItem('user')}`)
    if(!user||user?.login===false) navigate.replace("/sign-in")
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(`${await fetchUser(user.email)}`);
        const users = await fetchAllUser({
          userId:userInfo?._id,
          searchString: "",
          pageNum: 1,
          pageSize: 100,
        });
        userInfo?setUserInfo(userInfo):navigate.replace("/onboarding");
        setUsers(users);
        // pusherServer.trigger("user-online","online",userInfo?._id)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refrish]);

  return (
    <section className={`rightsidebar custom-scrollbar flex-row gap-0  ${isxl ? "w-full" : "max-xl:hidden"}  ${isChat ? ` p-0 ${!Ids && " px-1"} w-96` : "p-3 pt-28 w-72"}`}>
      <div className="flex flex-1 flex-col justify-start">
        {!isChat && <h1 className=" text-heading4-medium text-light-1 mb-6">Player</h1>}
        {users && users.users && userInfo &&
          <SugCard result2={JSON.stringify(users.users)} userInfo2={JSON.stringify(userInfo)} type={"users"} isChat={isChat} Ids={Ids ? Ids : ''} islg={islg} refrish={setrefrish} setChat={setChat} />}
      </div>
      <div className="w-[1px] bg-[#d16cca]"></div>
    </section>
  ); 
};

export default RightSidebar;

// import { fetchAllUser, fetchUser } from "@/lib/actions/user.actions";
// import { SugCard } from "../cards/sugCard";

// const RightSidebar = async ({isChat,Ids,isxl}:{isChat?:boolean,Ids?:string,isxl?:boolean}) => {
//   let user = await currentUser();
//   let userInfo = await fetchUser(user?.id);
//   let users = await fetchAllUser({
//     searchString: "",
//     pageNum: 1,
//     pageSize: 100,
//   });

//   return (
//     <section className={`rightsidebar custom-scrollbar ${isxl?"w-full":"max-xl:hidden"}  ${isChat?` p-0 ${!Ids&&" px-1"} w-96`:""}`}>
//       <div className="flex flex-1 flex-col justify-start">
//         {!isChat&&<h3 className=" text-heading4-medium text-light-1 mb-6">Suggested User</h3>}
//         {users&& users?.users&&userInfo&&<SugCard result2={JSON.stringify(users.users)}  userInfo2={JSON.stringify(userInfo)} type={"users"} isChat={isChat} Ids={Ids?Ids:''}/>}
//       </div>
//     </section>
//   );
// };

// export default RightSidebar;
