"use client"

import { motion, Variants } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { Camera, Ban, ShieldAlert } from "lucide-react"

// Professional animation variants matching the main page
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

const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 }
  }
}

export default function PhotoUploadSection() {
  const { language } = useLanguage()

  return (
    <motion.section 
      className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fastStaggerContainer}
    >
      {/* Animated Decorative Elements */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        initial={{ x: 300, opacity: 0, scale: 0.5 }}
        whileInView={{ x: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        initial={{ x: -300, opacity: 0, scale: 0.5 }}
        whileInView={{ x: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          variants={fastStaggerContainer}
        >
          <motion.div className="flex items-center justify-center gap-4 mb-8" variants={flyFromLeft}>
            <motion.div 
              className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
            <motion.div 
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            >
              <ShieldAlert className="w-6 h-6 text-accent" />
            </motion.div>
            <motion.div 
              className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </motion.div>
          <motion.h2 
            className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4 tracking-wide" 
            variants={flyFromRight}
          >
            {language === 'ar' ? 'تنبيهات للحضور' : 'Guest Guidelines'}
          </motion.h2>
          <motion.p 
            className="font-luxury text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto italic" 
            variants={scaleIn}
          >
            {language === 'ar'
              ? 'نرجو الالتزام بالتعليمات التالية أثناء حضوركم للحفل:'
              : 'Please kindly follow these guidelines during the event:'}
          </motion.p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          variants={scaleIn}
        >
          <motion.div 
            className="relative bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md border-2 border-accent/20 rounded-3xl p-10 md:p-14 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated Decorative corner elements */}
            <motion.div 
              className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-accent/30 rounded-tl-3xl"
              initial={{ x: -50, y: -50, opacity: 0 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-accent/30 rounded-br-3xl"
              initial={{ x: 50, y: 50, opacity: 0 }}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            
            <div className="relative z-10">
              {/* QR Code Section */}
              <motion.div 
                className="flex flex-col items-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Ban className="w-20 h-20 text-red-500 mb-6" />
                <p className="font-luxury text-lg md:text-xl text-foreground text-center mb-4 font-medium">
                  {language === 'ar' ? 'التعليمات المسموح بها أثناء الحفل' : 'Event rules and restrictions'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/60 border border-accent/10 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <p className="font-luxury text-base md:text-lg text-foreground">
                      {language === 'ar' ? 'ممنوع التصوير' : 'No photography'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/60 border border-accent/10 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <p className="font-luxury text-base md:text-lg text-foreground">
                      {language === 'ar' ? 'ممنوع الأطفال' : 'No children'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/60 border border-accent/10 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <p className="font-luxury text-base md:text-lg text-foreground">
                      {language === 'ar' ? 'الدعوة للنساء فقط' : 'Invitation for women only'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/60 border border-accent/10 shadow-sm">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <p className="font-luxury text-base md:text-lg text-foreground">
                      {language === 'ar' ? 'ممنوع الرجال' : 'Men are not allowed'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
