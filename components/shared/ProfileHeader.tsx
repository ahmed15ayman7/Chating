"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
interface props {
  accountId: string;
  userAuthId: string | undefined;
  name: string;
  sport: string;
  username: string;
  image: string;
  bio: string;
  userId?: string;
  friends?: {
    _id: string;
    id: string;
    name: string;
    username: string;
    image: string;
  }[];
  myId?: string;
  type?: "User" | "Community";
}
const ProfileHeader = ({
  accountId,
  sport,
  userAuthId,
  name,
  username,
  image,
  bio,
  userId,
  friends,
  type,
  myId,
}: props) => {

  let regLink = /https?:\/\/((www.)?\w+\d*.?\w*\/?)+/gi;
  let islink = bio.match(regLink);
  return (
    <div className="flex w-full  justify-between">
      <div className="flex flex-col justify-start">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            
          <div className="relative aspect-square  max-sm:w-16 max-sm:h-16 w-24 h-24  shadow-2xl">
                      <img
                        src={image}
                        alt={name}
                        className="absolute inset-0 w-full h-full rounded-full object-cover"
                      />
                    </div>
              {/* <img
                src={image}
                alt={name}
                // width={90}
                // height={90}
                className="rounded-full max-sm:w-16 max-sm:h-16 w-24 h-24 object-cover shadow-2xl"
              /> */}
              <div className="flex flex-col gap-3">
              <Image src={'/'+sport.split(' ')[0]+".svg"} alt={sport}  height={30} width={30} className="-translate-x-4"/>
                <div className="flex gap-[3px]">
                
                  <h3 className="text-white text-body-bold " style={{whiteSpace: 'nowrap',zIndex:'1000'}}>
                    
                    {name}</h3>
                    <Image
                src={"/golden.svg"}
                alt={'golden'}
                height={20}
                width={20}
                className=" max-sm:scale-150"
              />
                </div>
                <p className=" text-subtle-medium max-sm:text-[9px] text-gray-1">
                  {"@" + username}
                </p>
              </div>
            </div>
            <div className="flex items-end h-full">
              
            </div>
        
        </div>
        <p className="mt-6 max-w-lg text-subtle-medium grow text-gray-1">
          {bio.split(" ").map((e) =>
            islink?.includes(e) ? (
              <a
                className=" underline text-primary-500 visited:text-purple-500  block hover:text-purple-400"
                href={e}
                target="_blank"
                rel="noreferrer">
                {e.length > 10 ? `${e.slice(0, 19)}...` : e}{" "}
              </a>
            ) : (
              " " + e + " "
            )
          )}
        </p>
        <div className="mt-12"></div>
        <Link
          href="/boosting"
          className="text-primary-500 hover:opacity-75 flex">
          <Image
            src="/assets/boosting.svg"
            alt="boosting"
            className=""
            width={24}
            height={24}
          />
          Boosting Profile
        </Link>
      </div>
      <div className="flex flex-col w-1/2 justify-between items-end gap-8">
        {userId === userAuthId || myId?.includes("org") ? (
          <div className="">
            <Link
              href={`/profile/edit/${
                type === "Community" ? (myId ? myId : userId) : userId
              }`}
              className="flex gap-4 cursor-pointer">
              <span className=" text-white  max-lg:hidden">edit</span>
              <Image
                src="/assets/edit.svg"
                alt="edit"
                className=""
                width={24}
                height={24}
              />
            </Link>
          </div>
        ) : (
          <div></div>
        )}
        {type === "User" && userId === userAuthId ? (
          <div className="max-sm:flex hidden ">
                <div className="flex gap-4 cursor-pointer">
                  <Image
                    src="/assets/logout.svg"
                    alt="logout"
                    width={24}
                    height={24}
                  />
                </div>
          </div>
        ) : null}
        <div className="ml-2 mt-3 flex content-end   items-center gap-2">
          {friends?.length !== 0 && (
            <p
              className="rounded-full text-white justify-center cursor-pointer items-center  bg-primary-500 flex"
              style={{
                width: "30px",
                height: "30px",
                zIndex: "400",
                border: "1px solid #ffffff",
                opacity: ".6",
              }}>
              +{friends?.length}
            </p>
          )}
          {friends &&
            friends.map((friend, index) => {
              return (
                <Image
                  key={index}
                  src={friend.image}
                  alt={`user_${index}`}
                  width={30}
                  height={30}
                  style={{ zIndex: `${399 - index}` }}
                  className={`-ml-4 cursor-pointer rounded-full object-cover`}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
