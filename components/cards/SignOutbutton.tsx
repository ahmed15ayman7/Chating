"use client";
import React from "react";
import Image from "next/image";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
export const SignOutbutton = () => {
  return (
    <div>
      <SignedIn>
        <SignOutButton redirectUrl="/sign-in">
          <div className="flex gap-4 cursor-pointer">
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            <span className=" text-[#ffffff]  max-lg:hidden">logout</span>
          </div>
        </SignOutButton>
      </SignedIn>
    </div>
  );
};
