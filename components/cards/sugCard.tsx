"use client";
import { addFriend, UserData } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export let SugCard = ({
  result2,
  type,
  userInfo2,
  isChat,
  Ids,
  islg,
  refrish,
}: {
  result2: string;
  type: string;
  userInfo2: string;
  isChat?: boolean;
  Ids?: string;
  islg?: boolean;
  refrish?: any;
}) => {
  const userInfo: UserData = JSON.parse(userInfo2);
  const result: any[] = JSON.parse(result2);
  let navigate = useRouter();
  let pathname = usePathname();
  let handleAddMember = async (
    type: string,
    accountId: string,
    myId: string | undefined,
    isFriend: boolean
  ) => {
    await addFriend({
      friendId: accountId,
      userId: myId,
      path: pathname,
      isFriend: isFriend,
    });
    refrish(Math.random());
  };
  let handelloaded = (e: string) => {
    navigate.push(e);
  };
  return (
    <div className=" flex flex-col gap-6 w-full scroll-auto">
      {isChat && (
        <Link
          href="/"
          className=" flex items-center justify-between  g-3  no-underline text-body-bold text-white">
          <div className="flex items-center p-2 gap-9">
            <div className=" max-sm:w-16 max-sm:h-16 w-20  h-16 relative ">
              <Image src="/logo.jpg" alt="" fill className="" />
            </div>
            <p className="ms-2 text-[#d16cca] -translate-x-10">HR CHAT</p>
          </div>
        </Link>
      )}
      {result?.map((result, i) => {
        let isFriend: boolean =
          userInfo?.friends.filter((e) => e.id === result?.id).length === 1;
        let checked = isFriend;
        let route = `/profile/${result?.id}`;
        return (
          <Link
            href={"/messaging/" + userInfo._id + "-" + result?._id}
            className={`user-card ${
              Ids === userInfo._id + "-" + result?._id
                ? "bg-[#b3b3b380] rounded-s-full"
                : ""
            }`}
            key={result?._id}>
            <div
              className="user-card_avatar"
              onLoad={() => {
                i === 0 &&
                  islg &&
                  handelloaded(
                    "/messaging/" + userInfo._id + "-" + result?._id
                  );
              }}>
                <div className="relative   aspect-square h-10 w-10  ">
                      <img
                        src={result?.image}
                        alt="post image"
                        className="absolute inset-0 w-full h-full rounded-full object-cover"
                      />
                    </div>
              {/* <Image
                src={result?.image}
                alt={result?.name}
                height={48}
                width={48}
                className=" cursor-pointer rounded-full object-contain"
              /> */}
              <div className="flex-1 text-ellipsis  relative ">
                
                <div className=" cursor-pointer w-full flex gap-[3px]">
                  <h5 className=" text-base-semibold text-[#ffffff] z-20">
                    {result?.name?.length > 17
                      ? result?.name?.slice(0, 17) + "..."
                      : result?.name}
                  </h5>
                </div>

                <p className=" text-small-semibold text-[#ccc]">
                  @
                  {result?.username?.length > 11
                    ? result?.username?.slice(0, 11) + "..."
                    : result?.username}
                </p>
              </div>
            </div>
          </Link>
        ) 
      })}
    </div>
  );
};
