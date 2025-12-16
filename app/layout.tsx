import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { RomanticAudio } from "@/components/romantic-audio"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/language-toggle"
import { Footer } from "@/components/footer"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://yazeed-heba.netlify.app"),
  title: "Yazeed & Heba - Engagement Celebration",
  description: "Join us in celebrating Yazeed & Heba's engagement",
  generator: "Digitiva",
  openGraph: {
    url: "https://yazeed-heba.netlify.app/",
    type: "website",
    title: "Yazeed & Heba - Engagement Celebration",
    description: "Join us in celebrating Yazeed & Heba's engagement",
    images: [
      {
        url: "https://yazeed-heba.netlify.app/invitation-design.png?v=3",
        width: 768,
        height: 1365,
        alt: "Yazeed & Heba Engagement Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yazeed & Heba - Engagement Celebration",
    description: "Join us in celebrating Yazeed & Heba's engagement",
    images: ["https://yazeed-heba.netlify.app/invitation-design.png?v=3"],
  },
  icons: {
    icon: "/invitation-design.png?v=3",
    apple: "/invitation-design.png?v=3",
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
        <meta property="og:url" content="https://yazeed-heba.netlify.app/" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Yazeed & Heba - Engagement Celebration" />
        <meta property="og:description" content="Join us in celebrating Yazeed & Heba's engagement" />
        <meta
          property="og:image"
          content="https://yazeed-heba.netlify.app/invitation-design.png?v=3"
        />

        <meta property="og:image:width" content="768" />
        <meta property="og:image:height" content="1365" />
        <meta property="og:image:alt" content="Yazeed & Heba Engagement Invitation" />
        {/* Removed invalid fb:app_id since it's not needed for basic sharing */}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yazeed & Heba - Engagement Celebration" />
        <meta name="twitter:description" content="Join us in celebrating Yazeed & Heba's engagement" />
        <meta name="twitter:image" content="https://yazeed-heba.netlify.app/invitation-design.png?v=3" />

        {/* Preload PNG with high priority to eliminate lag on Netlify */}
        <link
          rel="preload"
          href="/invitation-design.png?v=3"
          as="image"
          type="image/png"
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
            <LanguageToggle />
            {children}
            <RomanticAudio />
            <Footer />
          </Suspense>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}