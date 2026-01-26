import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { Footer } from "@/components/footer"

import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
<<<<<<< HEAD
  metadataBase: new URL("https://yazeed-heba.digitivaa.com"),
  title: "Yazeed & Heba - Engagement Celebration",
  description: "Join us in celebrating Yazeed & Heba's engagement",
  generator: "Digitiva",
  openGraph: {
    url: "https://yazeed-heba.digitivaa.com/",
    type: "website",
    title: "Yazeed & Heba - Engagement Celebration",
    description: "Join us in celebrating Yazeed & Heba's engagement",
    images: [
      {
        url: "https://yazeed-heba.digitivaa.com/invitation-design.jpg",
        width: 768,
        height: 1365,
        alt: "Yazeed & Heba Engagement Invitation",
=======
  metadataBase: new URL("https://valentinegiftapp.netlify.app/"),
  title: "your valenitne gift",
  description: "open for your valintine gift baby, love you",
  generator: "Digitiva",
  openGraph: {
    url: "https://valentinegiftapp.netlify.app/",
    type: "website",
    title: "your valenitne gift",
    description: "open for your valintine gift baby, love you",
    images: [
      {
        url: "https://valentinegiftapp.netlify.app/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Valentine Gift Preview",
>>>>>>> 878b254097c64b234078e455c9e6c7485d826620
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
<<<<<<< HEAD
    title: "Yazeed & Heba - Engagement Celebration",
    description: "Join us in celebrating Yazeed & Heba's engagement",
    images: ["https://yazeed-heba.digitivaa.com/invitation-design.jpg"],
  },
  icons: {
    icon: "/invitation-design.jpg",
    apple: "/invitation-design.jpg",
=======
    title: "your valenitne gift",
    description: "open for your valintine gift baby, love you",
    images: ["https://valentinegiftapp.netlify.app/preview.jpg"],
  },
  icons: {
    icon: "/preview.jpg",
    apple: "/preview.jpg",
>>>>>>> 878b254097c64b234078e455c9e6c7485d826620
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Open Graph tags for Facebook & WhatsApp previews */}
<<<<<<< HEAD
        <meta property="og:url" content="https://yazeed-heba.digitivaa.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Yazeed & Heba - Engagement Celebration" />
        <meta property="og:description" content="Join us in celebrating Yazeed & Heba's engagement" />
        <meta
          property="og:image"
          content="https://yazeed-heba.digitivaa.com/invitation-design.jpg"
        />

        <meta property="og:image:width" content="768" />
        <meta property="og:image:height" content="1365" />
        <meta property="og:image:alt" content="Yazeed & Heba Engagement Invitation" />
=======
        <meta property="og:url" content="https://valentinegiftapp.netlify.app/" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="your valenitne gift" />
        <meta property="og:description" content="open for your valintine gift baby, love you" />
        <meta
          property="og:image"
          content="https://valentinegiftapp.netlify.app/preview.jpg"
        />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Valentine Gift Preview" />
>>>>>>> 878b254097c64b234078e455c9e6c7485d826620
        {/* Removed invalid fb:app_id since it's not needed for basic sharing */}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
<<<<<<< HEAD
        <meta name="twitter:title" content="Yazeed & Heba - Engagement Celebration" />
        <meta name="twitter:description" content="Join us in celebrating Yazeed & Heba's engagement" />
        <meta name="twitter:image" content="https://yazeed-heba.digitivaa.com/invitation-design.jpg" />
=======
        <meta name="twitter:title" content="your valenitne gift" />
        <meta name="twitter:description" content="open for your valintine gift baby, love you" />
        <meta name="twitter:image" content="https://valentinegiftapp.netlify.app/preview.jpg" />
>>>>>>> 878b254097c64b234078e455c9e6c7485d826620

        {/* Preload PNG with high priority to eliminate lag on Netlify */}
        <link
          rel="preload"
<<<<<<< HEAD
          href="/invitation-design.jpg"
=======
          href="/preview.jpg"
>>>>>>> 878b254097c64b234078e455c9e6c7485d826620
          as="image"
          type="image/jpeg"
        />
        {/* Preload video and poster for faster intro */}
        <link
          rel="preload"
          href="/engagement-video.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preload"
          href="/invitation-design.mp4"
          as="video"
          type="video/mp4"
        />

        {/* Preconnect to domains for faster loading */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        {/* Preload Google Fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          as="style"
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}>
        <LanguageProvider>
          <Suspense fallback={null}>
            {children}
            <Footer />
          </Suspense>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}