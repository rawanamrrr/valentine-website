"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"engagement" | "invitation">("engagement");
  const [showStaticImage, setShowStaticImage] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simple autoplay attempt - let the browser handle it
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked - browser will handle it
      });
    };

    // Try when video can play
    if (video.readyState >= 3) {
      playVideo();
      return;
    }

    video.addEventListener("canplay", playVideo, { once: true });

    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, [phase]);

  const handleComplete = useCallback(() => {
    setShowStaticImage(true);
    // Wait for the image to fade in, then call onComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 1000); // Match this with the transition duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Handle auto-advancing through phases
  const handleSkip = useCallback(() => {
    if (phase === "engagement") {
      setPhase("invitation");
    } else if (!showStaticImage) {
      handleComplete();
    } else {
      onSkip();
    }
  }, [phase, showStaticImage, handleComplete, onSkip]);

  const handleVideoEnd = () => {
    if (phase === "engagement") {
      setPhase("invitation");
    } else {
      handleComplete();
    }
  };

  // Handle video playback and skip on click
  useEffect(() => {
    // Only attach global listeners while the invitation video is playing
    if (phase !== "invitation" || showStaticImage) return;

    const handleUserInteraction = () => {
      // Any interaction while the invitation-design video is playing should skip it
      handleSkip();
    };

    const events = ["click", "touchstart", "keydown", "wheel", "pointerdown", "scroll"] as const;

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
    };
  }, [phase, showStaticImage, handleSkip]);

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={(e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (phase === "engagement") {
          video?.pause();
          setPhase("invitation");
        } else if (!showStaticImage) {
          video?.pause();
          handleComplete();
        } else {
          onSkip();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        {!showStaticImage ? (
          <video 
            key={phase}
            ref={videoRef}
            className="h-auto max-h-full w-auto max-w-full object-contain"
            playsInline={true}
            muted={true}
            autoPlay={true}
            onEnded={handleVideoEnd}
            preload="auto"
            disablePictureInPicture
            loop={false}
          >
            <source src={phase === "engagement" ? "/engagement-video.mp4" : "/invitation-design.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className={`w-full h-full transition-opacity duration-1000 ${showStaticImage ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src="/invitation-design.png"
              alt="Invitation Design"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

    </div>
  );
}
