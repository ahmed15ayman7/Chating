"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";


import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface props {
  userData: {
    _id: string | undefined;
    email: string | undefined;
    username: string | null | undefined;
    name: string;
    bio: string;
    image: string | undefined;
    phone: string|undefined;
  };
}

const AccountProfile = ({ userData }: props) => {
  let pathname = usePathname();
  let router = useRouter();
  let { startUpload } = useUploadThing("mediaPost");
  const [files, setFiles] = useState<File[]>([]);
  let form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: userData?.image || "",
      name: userData?.name || "",
      username: userData?.username ||'',
      bio: userData?.bio || "",
      phone: userData.phone ||"",
    },
  });
  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {
    e.preventDefault();
    let readfile = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      readfile.onload = async (e) => {
        const imageDataUrl = e.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      readfile.readAsDataURL(file);
    }
  }
  
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    try {
      console.log("Submit update user ");
      const blob = values.profile_photo;
      const hasImage = isBase64Image(blob);
      if (hasImage) {
        const imageRes = await startUpload(files);
        if (imageRes && imageRes[0].fileUrl) {
          values.profile_photo = imageRes[0].fileUrl;
        }
      }
         await updateUser({
          email:userData.email,
            userId: userData._id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            phone: values.phone,
            path: pathname,
          })
      if (pathname.includes("/profile/edit")) {
        console.log("Submit update user ");
        router.back();
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.log("faild to update user:", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className=" ">
              <div className=" flex items-center gap-4">

            
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <div className="relative aspect-square h-24 w-24  ">
                  <img
                   src={field.value}
                    alt="post image"
                    className="absolute inset-0 w-full h-full rounded-full object-cover"
                  />
                </div>
                ) : (
                  <Image
                    className="rounded-full max-h-[24px] max-w-[24px]"
                    src="/assets/profile.svg"
                    alt="profile_photo"
                    width={24}
                    height={24}
                  />
                )}
              </FormLabel>
              <FormControl className=" flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImageChange(e, field.onChange)}
                />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className=' text-white'>Name</FormLabel> */}
              <FormControl>
                <Input
                  placeholder={`Enter your name`}
                  className=" account-form_input"
                  name={field.name} disabled={field.disabled}  value={field.value}
                  onChange={e=>{
                    field.onChange(e);
                    
                  }}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className=' text-white'>Username</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  name={field.name} disabled={field.disabled}  value={field.value}
                  onChange={e=>{
                    field.onChange(e);
                  }}
                  className="account-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className=' text-white'>Name</FormLabel> */}
              <FormControl>
              <PhoneInput
            
                  className={`account-form_input px-2 bg-gray-100 w-full outline-none border rounded-lg h-10 relative transition-all `}
                  name={field.name} disabled={field.disabled}  value={field.value}
                  onChange={e=>{
                    field.onChange(e);
                  }}       />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className=' text-white'>bio</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="Enter your bio"
                  rows={3}
                  {...field}
                  className="account-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className=" bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
