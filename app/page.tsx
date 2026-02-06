"use client"

import React, { useState, useEffect, useRef } from "react"

type ScratchCardProps = {
  brushRadius?: number
  onClick?: () => void
}

function ScratchCard({ brushRadius = 30, onClick }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasScratched, setHasScratched] = useState(false)
  const totalAreaRef = useRef(0)
  const clearedAreaRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      totalAreaRef.current = rect.width * rect.height
      clearedAreaRef.current = 0

      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = "source-over"
      ctx.fillStyle = "#d4d4d8"
      ctx.fillRect(0, 0, rect.width, rect.height)
    }

    resize()

    const handleResize = () => {
      resize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const scratchAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2)
    ctx.fill()

    const circleArea = Math.PI * brushRadius * brushRadius
    clearedAreaRef.current += circleArea
  }

  const getPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const handlePointerDown = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault()
    setIsDrawing(true)
    setHasScratched(true)

    if ("touches" in event) {
      const touch = event.touches[0]
      if (!touch) return
      const pos = getPosition(touch.clientX, touch.clientY)
      if (pos) scratchAtPoint(pos.x, pos.y)
    } else {
      const pos = getPosition(event.clientX, event.clientY)
      if (pos) scratchAtPoint(pos.x, pos.y)
    }
  }

  const handlePointerMove = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return
    event.preventDefault()

    if ("touches" in event) {
      const touch = event.touches[0]
      if (!touch) return
      const pos = getPosition(touch.clientX, touch.clientY)
      if (pos) scratchAtPoint(pos.x, pos.y)
    } else {
      const pos = getPosition(event.clientX, event.clientY)
      if (pos) scratchAtPoint(pos.x, pos.y)
    }
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const handleClick = () => {
    if (!onClick || !hasScratched) return

    const total = totalAreaRef.current
    if (total <= 0) {
      onClick()
      return
    }

    const progress = Math.min(clearedAreaRef.current / total, 1)
    if (progress >= 1) {
      onClick()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={endDrawing}
        onClick={handleClick}
      />
    </div>
  )
}

export default function Home() {
  const [digits, setDigits] = useState<string[]>(Array(7).fill("0"))
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [noPosition, setNoPosition] = useState({ top: 65, left: 50 })
  const [invitationNoPosition, setInvitationNoPosition] = useState({
    top: 65,
    left: 50,
  })
  const [giftVideoFinished, setGiftVideoFinished] = useState(false)

  const [bootstrapped, setBootstrapped] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const imagesSecondRef = useRef<HTMLDivElement | null>(null)

  const imageSources = [
    "/lock.jpg",
    "/gift.gif",
    "/message.jpg",
    "/songs.jpg",
    "/images1.jpg",
    "/images2.jpg",
    "/invitation.jpg",
    "/invitation-message.jpg",
  ]

  useEffect(() => {
    imageSources.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const targetTime = new Date(2026, 1, 14, 18, 0, 0).getTime()

    const updateCountdown = () => {
      const now = Date.now()
      const diff = targetTime - now

      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          finished: true,
        })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        finished: false,
      })
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    try {
      const storedState = sessionStorage.getItem("valentineState")

      if (storedState) {
        const parsed = JSON.parse(storedState) as any

        if (typeof parsed.isUnlocked === "boolean") {
          setIsUnlocked(parsed.isUnlocked)
        } else {
          const stored = sessionStorage.getItem("valentineUnlocked")
          if (stored === "1") {
            setIsUnlocked(true)
          }
        }

        if (typeof parsed.showGift === "boolean") {
          setShowGift(parsed.showGift)
        }

        if (typeof parsed.selectedImage === "string" && parsed.selectedImage) {
          setSelectedImage(parsed.selectedImage)
        }
      } else {
        const stored = sessionStorage.getItem("valentineUnlocked")
        if (stored === "1") {
          setIsUnlocked(true)
        }
      }
    } catch {
      // ignore
    } finally {
      setBootstrapped(true)
    }
  }, [])

  useEffect(() => {
    try {
      const state = {
        isUnlocked,
        showGift,
        selectedImage,
      }
      sessionStorage.setItem("valentineState", JSON.stringify(state))
    } catch {}
  }, [isUnlocked, showGift, selectedImage])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("valentineUnlocked")
      if (stored === "1") {
        setIsUnlocked(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!selectedImage || !selectedImage.endsWith(".mp4")) return

    const video = videoRef.current
    if (!video) return

    const playPromise = video.play()
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // ignore autoplay errors
      })
    }
  }, [selectedImage])

  const handleDigitChange = (index: number, direction: "up" | "down") => {
    if (isUnlocked) return

    setDigits((prev) => {
      const next = [...prev]
      const current = parseInt(next[index] ?? "0", 10)
      const newDigit =
        direction === "up" ? (current + 1) % 10 : (current + 9) % 10
      next[index] = String(newDigit)
      const enteredCode = next.join("")
      if (enteredCode === "2162024") {
        setIsUnlocked(true)
        try {
          sessionStorage.setItem("valentineUnlocked", "1")
        } catch {}
      }

      return next
    })
  }

  const moveNoButton = () => {
    if (!isUnlocked || showGift) return

    const top = 40 + Math.random() * 40
    const left = 20 + Math.random() * 60
    setNoPosition({ top, left })
  }

  const moveInvitationNoButton = () => {
    if (selectedImage !== "/invitation.jpg") return

    const top = 20 + Math.random() * 60
    const left = 10 + Math.random() * 80
    setInvitationNoPosition({ top, left })
  }

  const handleScrollToImages2 = () => {
    if (!imagesSecondRef.current) return
    imagesSecondRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleYesClick = () => {
    if (!isUnlocked) return
    setGiftVideoFinished(false)
    setShowGift(true)
  }

  const handleVideoEnded = () => {
    if (selectedImage === "/images.mp4") {
      setSelectedImage("/images-video.mp4")
    }
  }

  const handleVideoPause = () => {
    if (!selectedImage || !selectedImage.endsWith(".mp4")) return

    const video = videoRef.current
    if (!video) return

    const playPromise = video.play()
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // ignore autoplay errors when forcing resume
      })
    }
  }

  if (!bootstrapped) {
    return <main className="min-h-screen w-full bg-[#fff9f9]" />
  }

  return (
    <main className="min-h-screen w-full bg-[#fff9f9] relative overflow-hidden">
      {/* Main Content */}
      {!isUnlocked ? (
        <div className="relative w-full h-screen">
          <img
            src="/lock.jpg"
            alt="Lock"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 transform translate-y-10 sm:translate-y-20">
            <div className="flex gap-2 bg-white/80 px-3 py-2 rounded-3xl shadow-xl max-w-xs">
              {digits.map((value, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-0.5 bg-white rounded-xl px-1.5 py-1.5 shadow-md"
                >
                  <button
                    type="button"
                    className="text-[10px] text-gray-700 leading-none"
                    onClick={() => handleDigitChange(idx, "up")}
                  >
                    ▲
                  </button>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 min-w-[1rem] text-center">
                    {value}
                  </div>
                  <button
                    type="button"
                    className="text-[10px] text-gray-700 leading-none"
                    onClick={() => handleDigitChange(idx, "down")}
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !showGift ? (
          <div className="relative w-full h-screen">
            <video
              src="/question.mp4"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            />
            <button
              type="button"
              onClick={() => {
                setIsUnlocked(false)
                setShowGift(false)
                setDigits(Array(7).fill("0"))
                setNoPosition({ top: 65, left: 50 })
                try {
                  sessionStorage.removeItem("valentineUnlocked")
                  sessionStorage.removeItem("valentineState")
                } catch {}
              }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#9b1412] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-md z-30"
            >
              <span className="text-base leading-none">↩</span>
              <span>GO BACK</span>
            </button>

            <div className="absolute inset-0 flex flex-col items-center justify-end pb-32">
              <div className="flex gap-6 justify-center">
                <button
                  type="button"
                  onClick={handleYesClick}
                  className="px-14 py-6 rounded-full bg-[#9b1412] hover:bg-[#7a0f0e] text-white text-2xl font-bold shadow-lg transition-colors"
                >
                  Yes
                </button>
                <div className="w-[160px] h-[72px] flex items-center justify-center">
                  <button
                    type="button"
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    onClick={moveNoButton}
                    className="px-14 py-6 rounded-full bg-gray-200 text-gray-800 text-2xl font-bold shadow-md transition-transform"
                    style={{
                      position:
                        noPosition.top === 65 && noPosition.left === 50
                          ? "static"
                          : "absolute",
                      top:
                        noPosition.top === 65 && noPosition.left === 50
                          ? "auto"
                          : `${noPosition.top}%`,
                      left:
                        noPosition.top === 65 && noPosition.left === 50
                          ? "auto"
                          : `${noPosition.left}%`,
                      transform:
                        noPosition.top === 65 && noPosition.left === 50
                          ? "none"
                          : "translate(-50%, -50%)",
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-screen">
            {/* Static image background for before/after video */}
            <img
              src="/gift.gif"
              alt="Gift"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Play gift.mp4 once on top, then hide when finished to reveal static image */}
            {/* gift.mp4 removed; only static image is shown */}

            <button
              type="button"
              onClick={() => {
                setShowGift(false)
                setSelectedImage(null)
                setInvitationNoPosition({ top: 65, left: 50 })
              }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#9b1412] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-md"
            >
              <span className="text-base leading-none">↩</span>
              <span>GO BACK</span>
            </button>

            <div className="absolute inset-0 z-10 pointer-events-none">
              <button
                type="button"
                aria-label="Open images"
                className="absolute pointer-events-auto top-[32%] left-[14%] w-[30%] h-[18%]"
                onClick={() => setSelectedImage("images-gallery")}
              />
              <button
                type="button"
                aria-label="Open message"
                className="absolute pointer-events-auto top-[32%] right-[14%] w-[30%] h-[18%]"
                onClick={() => setSelectedImage("/message.jpg")}
              />
              <button
                aria-label="Open songs"
                className="absolute pointer-events-auto top-[54%] left-[14%] w-[30%] h-[18%]"
                onClick={() => setSelectedImage("/songs.jpg")}
              />
              <button
                type="button"
                aria-label="Open invitation"
                className="absolute pointer-events-auto top-[54%] right-[14%] w-[30%] h-[18%]"
                onClick={() => {
                  setInvitationNoPosition({ top: 65, left: 50 })
                  setSelectedImage("/invitation.jpg")
                }}
              />
            </div>

            {selectedImage && (
              <div
                className={`absolute inset-0 z-20 bg-black/90 ${
                  selectedImage === "images-gallery"
                    ? "overflow-y-auto"
                    : "flex items-center justify-center"
                }`}
              >
                {selectedImage === "images-gallery" ? (
                  <div className="w-full">
                    <div className="relative w-full">
                      <img
                        src="/images1.jpg"
                        alt="Images part 1"
                        className="w-full block"
                      />
                      <button
                        type="button"
                        onClick={handleScrollToImages2}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 px-4 py-2 text-[#9b1412] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase z-30 animate-bounce"
                      >
                        <span>SCROLL DOWN</span>
                        <span className="text-base leading-none">↓</span>
                      </button>
                    </div>
                    <div ref={imagesSecondRef} className="relative w-full">
                      <img
                        src="/images2.jpg"
                        alt="Images part 2"
                        className="w-full block"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null)
                          setInvitationNoPosition({ top: 65, left: 50 })
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#9b1412] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-md z-30"
                      >
                        <span className="text-base leading-none">↩</span>
                        <span>GO BACK</span>
                      </button>
                    </div>
                  </div>
                ) : selectedImage.endsWith(".mp4") ? (
                  <video
                    key={selectedImage}
                    ref={videoRef}
                    src={selectedImage}
                    className="w-full h-full object-cover pointer-events-none"
                    autoPlay
                    muted={selectedImage !== "/images.mp4"}
                    playsInline
                    loop={selectedImage === "/images-video.mp4"}
                    onEnded={handleVideoEnded}
                    onPause={handleVideoPause}
                    controls={false}
                  />
                ) : selectedImage === "/songs.jpg" ? (
                  <div className="relative w-full h-full">
                    <img
                      src="/songs.jpg"
                      alt="Gift detail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0">
                      <div className="absolute top-[15%] left-[36%] w-[42%] h-[24%]">
                        <ScratchCard
                          brushRadius={32}
                          onClick={() => {
                            window.location.href =
                              "https://youtu.be/amy2fttDCb8?si=fghZ_wrVJmfYP7uR"
                          }}
                        />
                      </div>
                      <div className="absolute top-[40%] left-[1%] w-[43%] h-[24%]">
                        <ScratchCard
                          brushRadius={32}
                          onClick={() => {
                            window.location.href =
                              "https://youtu.be/xVmfxKb_kVY?si=OhTupkocRzVK7dRV"
                          }}
                        />
                      </div>
                      <div className="absolute top-[40%] right-[1%] w-[43%] h-[24%]">
                        <ScratchCard
                          brushRadius={32}
                          onClick={() => {
                            window.location.href =
                              "https://youtu.be/f8GGT9Np0cU?si=6D0PVqFJqU2tvkfF"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedImage}
                    alt="Gift detail"
                    className="w-full h-full object-cover"
                  />
                )}
                {selectedImage === "/invitation.jpg" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
                    <div className="flex gap-6 justify-center">
                      <button
                        type="button"
                        onClick={() => setSelectedImage("/invitation-message.jpg")}
                        className="px-14 py-4 rounded-full bg-[#9b1412] hover:bg-[#7a0f0e] text-white text-xl font-bold shadow-lg transition-colors"
                      >
                        Yes
                      </button>
                      <div className="w-[160px] h-[64px] flex items-center justify-center">
                        <div
                          onMouseEnter={moveInvitationNoButton}
                          onTouchStart={moveInvitationNoButton}
                          className="px-14 py-4 rounded-full bg-gray-200 text-gray-800 text-xl font-bold shadow-md"
                          style={{
                            position:
                              invitationNoPosition.top === 65 &&
                              invitationNoPosition.left === 50
                                ? "static"
                                : "absolute",
                            top:
                              invitationNoPosition.top === 65 &&
                              invitationNoPosition.left === 50
                                ? "auto"
                                : `${invitationNoPosition.top}%`,
                            left:
                              invitationNoPosition.top === 65 &&
                              invitationNoPosition.left === 50
                                ? "auto"
                                : `${invitationNoPosition.left}%`,
                            transform:
                              invitationNoPosition.top === 65 &&
                              invitationNoPosition.left === 50
                                ? "none"
                                : "translate(-50%, -50%)",
                          }}
                        >
                          No
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedImage === "/invitation-message.jpg" && (
                  <div className="absolute bottom-16 left-[43%] -translate-x-1/2 flex flex-col items-center gap-3 px-4">
                    {countdown.finished ? (
                      <div className="px-4 py-2 rounded-full bg-[#9b1412] text-white text-sm sm:text-base shadow-lg">
                        It's time! See you at our special day.
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-19 sm:gap-6">
                        {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label) => {
                          const value =
                            label === "DAYS"
                              ? countdown.days
                              : label === "HOURS"
                                ? countdown.hours
                                : label === "MINUTES"
                                  ? countdown.minutes
                                  : countdown.seconds

                          const display =
                            label === "DAYS"
                              ? String(value)
                              : String(value).padStart(2, "0")

                          return (
                            <div
                              key={label}
                              className="flex flex-col items-center justify-center rounded-2xl bg-white/95 px-3 py-2 sm:px-4 sm:py-3 shadow-lg min-w-[64px] sm:min-w-[80px]"
                            >
                              <div className="text-xl sm:text-3xl font-bold text-[#9b1412]">
                                {display}
                              </div>
                              <div className="mt-1 text-[10px] sm:text-xs tracking-[0.2em] text-gray-700">
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {selectedImage !== "images-gallery" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null)
                      setInvitationNoPosition({ top: 65, left: 50 })
                    }}
                    className={`absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[#9b1412] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-md z-30 ${
                      selectedImage === "/invitation-message.jpg" ? "bottom-3" : "bottom-6"
                    }`}
                  >
                    <span className="text-base leading-none">↩</span>
                    <span>GO BACK</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )
      )}
    </main>
  )
}