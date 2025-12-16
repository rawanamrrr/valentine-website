"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import CountdownTimer from "@/components/countdown-timer"
import VenueMap from "@/components/venue-map"
import Image from "next/image"
import HandwrittenMessage from "@/components/handwritten-message"
import { Variants } from "framer-motion"
import { useTranslation } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import PhotoUploadSection from "@/components/photo-upload-section"
import RSVPSection from "@/components/rsvp-section"

// Format date in Arabic or English
const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time in Arabic or English
const formatTime = (date: Date, locale: string) => {
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Professional animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const slideUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const scaleIn: Variants = {
  hidden: { scale: 0.98, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

// Professional flying entrance variants
const slideFromLeft: Variants = {
  hidden: { x: -120, opacity: 0, scale: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
}

const slideFromRight: Variants = {
  hidden: { x: 120, opacity: 0, scale: 0.9 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
}

// Dramatic fly-in from far left
const flyFromLeft: Variants = {
  hidden: { x: -200, opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 60,
      damping: 18
    }
  }
}

// Dramatic fly-in from far right
const flyFromRight: Variants = {
  hidden: { x: 200, opacity: 0, scale: 0.8, rotate: 5 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 60,
      damping: 18
    }
  }
}

// Floating entrance from left with bounce
const floatFromLeft: Variants = {
  hidden: { x: -150, y: -30, opacity: 0, scale: 0.7 },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
}

// Floating entrance from right with bounce
const floatFromRight: Variants = {
  hidden: { x: 150, y: -30, opacity: 0, scale: 0.7 },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1] as const,
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
}

const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 }
  }
}

interface ProAnimatedEngagementPageProps {
  onImageLoad?: () => void;
  introFinished?: boolean;
}

export default function ProAnimatedEngagementPage({ onImageLoad, introFinished }: ProAnimatedEngagementPageProps) {
  const t = useTranslation()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [gifHasPlayed, setGifHasPlayed] = useState(false)
  const [gifPreloaded, setGifPreloaded] = useState(false)
  const gifRef = useRef<HTMLImageElement>(null)
  const gifTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { scrollYProgress } = useScroll()
  const pathY1 = useTransform(scrollYProgress, [0, 0.5], [0, 20])
  const pathY2 = useTransform(scrollYProgress, [0, 0.5], [0, 40])

  const eventDate = new Date("2026-02-14T19:00:00");
  const formattedDate = formatDate(eventDate, language);
  const formattedTime = formatTime(eventDate, language);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const staticImg = new window.Image();
      staticImg.src = "/invitation-design.png";
      staticImg.onload = () => {
        console.log('✅ Image preloaded and cached');
        setGifPreloaded(true);
      };
      staticImg.onerror = () => {
        console.log('⚠️ Image preload failed');
      };
    }

    // Cleanup timer on unmount
    return () => {
      if (gifTimerRef.current) {
        clearTimeout(gifTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (introFinished) {
      console.log('🎬 Intro finished, showing image');
      setGifHasPlayed(true);
    }
  }, [introFinished]);

  const handleImageLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  const handleGifError = () => {
    console.log('❌ Image error');
    setGifHasPlayed(true);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 overflow-x-hidden pt-0">
      {/* Hero Section */}
      <motion.section 
        className="relative w-full overflow-hidden pt-0 -mt-4"
        initial="hidden"
        animate="visible"
        variants={fastStaggerContainer}
      >
        <motion.div 
          className="relative w-full z-10 pt-0"
          variants={scaleIn}
        >
          <div className={`relative w-full pt-0 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full pt-0">
              <Image
                key="static-image"
                src="/invitation-design.png"
                alt="Yazeed & Heba Engagement Invitation"
                width={768}
                height={1365}
                className="w-full h-auto object-contain"
                priority
                loading="eager"
                quality={100}
                onLoad={handleImageLoad}
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            
            {/* Minimal loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">{t('loading')}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="mt-6 w-full max-w-2xl mx-auto text-center px-4">
        </div>
        
        {/* Scroll Down Indicator - Flying from left */}
        <motion.button
          onClick={() => {
            const countdownSection = document.querySelector('section[class*="py-12"]');
            countdownSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute bottom-20 left-8 flex flex-col items-center gap-2 z-20 cursor-pointer group"
          initial="hidden"
          animate="visible"
          variants={flyFromLeft}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-accent/30 group-hover:border-accent/50 transition-colors">
            <span className="text-sm md:text-base text-foreground font-medium tracking-wide">
              {language === 'ar' ? 'مرر للأسفل' : 'Scroll Down'}
            </span>
          </div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="bg-accent/90 p-2 rounded-full shadow-lg group-hover:bg-accent transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.button>
        
        {/* Animated floating background elements */}
        <motion.div 
          className="absolute -left-20 top-1/4 w-64 h-64 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          style={{ y: pathY1 }}
        />
        <motion.div 
          className="absolute -right-20 bottom-1/4 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.7 }}
          style={{ y: pathY2 }}
        />
      </motion.section>

      {/* Countdown Section - Unique frame with diagonal cuts */}
      <section 
        className="relative py-12 px-4 md:py-16 overflow-hidden"
        style={{
          clipPath: 'polygon(0 5%, 100% 0%, 100% 95%, 0% 100%)',
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex flex-col items-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6 tracking-wide">
              {t('ourSpecialDay')}
            </h2>
            <p className="font-luxury text-3xl md:text-3xl lg:text-4xl font-bold max-w-3xl italic bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-primary/60">
              {t('countingMoments')}
            </p>
          </div>

          <div>
            <CountdownTimer targetDate={new Date("2026-02-14T19:00:00")} />
          </div>
        </div>
      </section>

      {/* Venue & RSVP Section - Asymmetric frame */}
      <motion.section 
        className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fastStaggerContainer}
        style={{
          clipPath: 'polygon(0 0%, 100% 5%, 100% 100%, 0% 95%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-16 mb-20"
            variants={staggerContainer}
          >
            {/* Join Us At heading */}
            <motion.div variants={fadeIn}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <motion.div
                  className="h-px w-16 bg-accent/40"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </motion.div>
                <motion.div
                  className="h-px w-16 bg-accent/40"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>

              <motion.h2
                className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground mb-6"
                variants={slideUp}
              >
                {t('joinUsAt')}
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                variants={slideUp}
              >
                {t('location')}
              </motion.p>
            </motion.div>

            {/* Venue details card */}
            <motion.div
              className="max-w-4xl mx-auto"
              variants={scaleIn}
            >
              <div className="bg-card/80 backdrop-blur-sm border border-accent/20 rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(120,113,108,0.08)_1px,_transparent_0)] bg-[length:20px_20px]" />

                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-serif text-accent">
                    {t('location')}
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 border-t border-accent/10">
                    <div className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xl font-medium text-foreground">{t('date')}</span>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-accent/20" />

                    <div className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-xl font-medium text-foreground">{t('time')}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <VenueMap embedded />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Seamless Middle Section with Invitation */}
      <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-background via-background/80 to-accent/10 overflow-hidden hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-5"></div>
        </div>
        
        <motion.div 
          className="relative w-full max-w-5xl mx-auto px-4 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative w-full max-w-4xl mx-auto">

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-10 w-28 h-28 bg-accent/5 rounded-full mix-blend-multiply blur-xl"></div>
            <div className="absolute -bottom-10 -right-12 w-40 h-40 bg-accent/10 rounded-full mix-blend-multiply blur-xl"></div>
            
            {/* Main image container */}
            <div className="relative group w-full rounded-[32px] border border-accent/15 bg-card/80 backdrop-blur-md shadow-xl shadow-accent/10 overflow-hidden">

              {/* Main image softly blended with background */}
              <div className="relative transition-transform duration-500 group-hover:scale-[1.01]">
                <Image
                  src="/middle-invitation.png"
                  alt="Wedding Invitation"
                  width={1400}
                  height={700}
                  className="w-full h-auto object-cover"
                  priority
                />
                
                {/* Subtle gradient overlay to blend with page background */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/40"></div>
              </div>
            </div>
            
            {/* Decorative elements that match website's style */}
            <div className="absolute -bottom-10 -right-10 w-16 h-16 opacity-20">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-accent">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          {/* Connecting decorative element to next section */}
          <div className="h-16 md:h-24 w-px bg-gradient-to-b from-accent/20 to-transparent mt-12"></div>
        </motion.div>
      </section>

      {/* Message Section */}
      <HandwrittenMessage />

      {/* RSVP Section */}
      <RSVPSection />

      {/* Photo Upload Section */}
      <PhotoUploadSection />
      
      {/* Footer */}
      <motion.footer 
        className="relative py-24 text-center bg-gradient-to-t from-accent/10 to-transparent"
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="relative w-full mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full rounded-[32px] border border-accent/15 bg-card/80 backdrop-blur-md shadow-xl shadow-accent/10 overflow-hidden">
              <Image
                src="/middle-invitation.png"
                alt="Wedding Invitation"
                width={1400}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/40"></div>
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-accent" />
            <motion.span 
              className="text-3xl text-accent drop-shadow-lg"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              ♥
            </motion.span>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-accent to-accent" />
          </div>
          <div className="flex items-center justify-center gap-3 opacity-60">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}