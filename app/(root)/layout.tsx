import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import '../globals.css'
import Topbar from '@/components/shared/Topbar';
import BottomSidebar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import { GoogleTagManager } from '@next/third-parties/google';
// import { ThemeProvider } from '@/components/providers/theme-provider';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "SPORTON",
    template: "%s - SPORTON ",
  },
  keywords:[
    "player CV",
    "sports opportunities",
    "sports clubs",
    "player profiles",
    "showcase achievements",
    "connect with clubs",
    "sports talent",
    "sports recognition",
    "athlete portfolio",
    "sports scouting",
    "sports networking",
    "talent showcase",
    "sports recruitment",
    "athlete profiles",
    "sports career",
    "sports management",
    "talent discovery",
    "sports networking platform",
    "athletic achievements",
    "talent identification",
    "sports resume",
    "athlete connections",
    "sports community",
    "talent promotion",
    "sports talent search",
    "athlete recruitment",
    "sports showcase",
    "talent evaluation",
    "sports talent pool",
    "athlete opportunities",
    "sports networking site"
  ],
  description: 'SPORTON provides an opportunity for talented individuals who struggle to get into clubs and show their abilities. Highlight your skills and achievements on SPORTON and attract everyone\'s attention',
  icons:'/logo5.gif',
  openGraph: {
    type: 'website',
    url: 'https://sporton-brown.vercel.app/',
    title: 'SPORTON',
    description: 'SPORTON provides an opportunity for talented individuals who struggle to get into clubs and show their abilities. Highlight your skills and achievements on SPORTON and attract everyone\'s attention',
    images: [
      {
        url: 'https://sporton-brown.vercel.app/logo.png',
        alt: 'SPORTON LOGO',
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
      <body className={inter.className}>

      
      <Topbar/>
      <main className=' flex flex-row w-full'>

        <LeftSidebar/>
        <section className="main-container">
        <div className=" w-full max-w-4xl">
        {children}
        </div>
        </section>
        {/* @ts-ignore */}
        <RightSidebar/>
      </main>
      <BottomSidebar/>
      <GoogleTagManager gtmId="GTM-WB4S5V8V" />
        </body>
    </html>

          
   </ClerkProvider>
  )
}
