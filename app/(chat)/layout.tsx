import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import '../globals.css'
import { GoogleTagManager } from '@next/third-parties/google';
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: {
    default: "CHATY | A real-time chat application",
    template: "%s - CHATY ",
  },

  description: 'CHATY is a seamless instant messaging platform designed for real-time communication. Connect with friends, family, and colleagues through text, voice, and video chat. Enjoy features like group chats, media sharing, and end-to-end encryption to ensure your conversations are secure and private. Available on all major platforms, ChatApp keeps you connected anytime, anywhere.',
  openGraph: {
    type: 'website',
    url: 'https://www.sporton.website/',
    title: 'CHATY',
    description: 'CHATY is a seamless instant messaging platform designed for real-time communication. Connect with friends, family, and colleagues through text, voice, and video chat. Enjoy features like group chats, media sharing, and end-to-end encryption to ensure your conversations are secure and private. Available on all major platforms, ChatApp keeps you connected anytime, anywhere.',
    images: [
      {
        url: '/logo.jpg',
        alt: 'CHATY LOGO',
      },
    ],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en"  >
      <body className={inter.className+" bg-[#201325]"}>
      <main className=' flex flex-row w-full '>
        <section className="main-container p-0" >
        <div className=" w-full ">
        {children}
        </div>
        </section>
      </main>
      <GoogleTagManager gtmId="GTM-WB4S5V8V" />
        </body>
    </html>
   </ClerkProvider>
  )
}
