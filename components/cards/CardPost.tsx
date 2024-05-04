'use client'
import { reactToPost } from "@/lib/actions/post.actions";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface parms {
  isAchievement?:string;
  id: string;
  Team: any[];
  image?: string;
  video?: string;
  userId: string|undefined;
  parentId: string | null;
  currentId: String | undefined;
  author: {
    _id: string;
    id: string;
    name: string;
    image: string;
    sport:string;
  };
  react:string[]|undefined;
  content: string;
  community?: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      _id: string;
      id: string;
      image: string;
      name: string;
    };
  }[];
  isComment?: boolean;
}

const CardPost = ({
  id,
  parentId,
  Team,
  isAchievement,
  currentId,userId,
  author,
  content,
  community,
  react,
  createdAt,
  comments,
  isComment,
  video,
  image
}: parms) => {
  let pathname= usePathname();
  let isFriend =
    Team?.filter(
      (friend) => friend.id === author.id
    ).length === 1;

  console.log(Team,isFriend,currentId)
  let commentsFilter=comments.filter(e=>e.author._id!==undefined)
  let isReplay = commentsFilter.filter(e=>e.author.id===currentId).length>=1;
  let commLen=isReplay?commentsFilter.length-1:commentsFilter.length;
  let isReact=react!== undefined && react.filter(e=>e===userId).length>=1;
  let handleHeart=async()=>{
    await reactToPost({postId:id,react:isReact,userId:userId,path:pathname})
  }
  return (
    <article
      className={` flex w-full flex-col rounded-xl ${
        isComment ? " px-0 xs:px-7" : "bg-dark-2 p-5"
      }`}>
      <div className=" flex items-start justify-between">
        <div className=" flex w-full flex-1 flex-row gap-4 ">
        <div className=" text-white hidden flex-col items-center lg:flex ">
            <Link href={"/profile/" + author.id} className="relative w-11 h-11">
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className=" text-white flex flex-col gap-4 w-full ">
            <div className="flex w-full flex-1 flex-row gap-4 ">
          <div className=" text-white flex flex-col items-center lg:hidden ">
            <Link href={"/profile/" + author.id} className="relative w-11 h-11">
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="-translate-y-3">
          <Image src={'/'+author.sport.split(' ')[0]+".svg"} alt={author.sport}  height={30} width={30} className="-translate-x-4"/>
            <Link
              href={"/profile/" + author.id}
              className=" cursor-pointer w-full flex gap-4 ">
              <h5>{author.name}</h5>
              {isFriend &&
              <Image
                src={
                   "/assets/members.svg" 
                }
                alt="add friend"
                className=""
                width={24}
                height={24}
              />}
              {isAchievement==="1"?
              <Image
                src={"/assets/achievement.svg"}
                alt={"achievement"}
                height={24}
                  width={24}
                className="object-contain"
              />:null}

            </Link>
                </div>
                </div>
            <p className=" text-small-regular text-light-2 ">{content}</p>
            {image &&
            <img
          src={image}
          alt="post image"
          className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"
        />}
        {video&&<video src={video} controls autoPlay  className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"/>}
            <div className={`${isComment && "mb-10"} flex flex-col gap-3`}>
              <div className="mt-5 flex flex-row items-center gap-6">
                <Image
                  src={isReact?"/assets/heart-filled.svg":"/assets/heart-gray.svg"}
                  alt="heart"
                  height={20}
                  width={20}
                  className=" hover:scale-125 cursor-pointer object-contain"
                  onClick={handleHeart}
                />
                <Link href={`/post/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heart"
                    height={20}
                    width={20}
                    className=" hover:scale-125 cursor-pointer object-contain"
                  />
                </Link>
                <Link href={`/new-post?p=${content}`}>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  height={20}
                  width={20}
                  className="hover:scale-125 cursor-pointer object-contain"
                  />
                  </Link>
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  height={20}
                  width={20}
                  className="hover:scale-125 cursor-pointer object-contain"
                />
              </div>
              {!isComment && commentsFilter.length > 0 && (
                <Link href={`/post/${id}`}>
                  {commLen>0?<p className="mt-1 text-subtle-medium text-gray-1">{isReplay && 'you and '}
                    {commLen} repl{commLen> 1 ? "ies" : "y"}
                  </p>:null}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && community?.name && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 items-center flex text-gray-50">
          <p className=" text-subtle-medium">
            {formatDateString(createdAt)}- {community.name} community
          </p>
          <Image
            src={community.image}
            alt={community.name}
            height={25}
            width={25}
            className=" ml-1 rounded-full object-fill"
          />
        </Link>
      )}
      {!isComment && commentsFilter.length > 0 && (
        <div className="ml-2 mt-3 flex items-center gap-2">
          {commentsFilter.map((comment, index, arr) => {
            let count = -1;
            if (index > 0) {
              if (
                comment?.author._id === arr[index - 1]?.author._id ||
                comment?.author.id === author.id
              ) {
                return null;
              } else {
                count += index+1;
              }
            }
            if (count >= 3) {
              return null;
            }
            return (
              <Image
                key={index}
                src={comment?.author.image}
                alt={`user_${index}`}
                width={24}
                height={24}
                className={`${
                  count !== 0 && index !== 0
                    ? "-ml-5"
                    : count === 0 && index !== 0
                    ? ""
                    : index !== 0
                    ? "-ml-5"
                    : ""
                } rounded-full object-cover `}
              />
            );
          })}
        </div>
      )}
    </article>
  );
};

export default CardPost;
