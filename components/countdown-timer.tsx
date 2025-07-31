"use client"

import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 6,
    minutes: 10,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center mb-6 sm:mb-8">
      <p className="text-white text-xs sm:text-sm mb-2">A OFERTA VAI ACABAR&nbsp;EM:</p>
      <div className="flex justify-center items-center gap-2 sm:gap-3 text-cyan-400">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold">{timeLeft.days.toString().padStart(2, "0")}</span>
          <span className="text-xs text-white">DIAS</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="text-xs text-white">HRS</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">MIN</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">SEGS</span>
        </div>
      </div>
    </div>
  )
}
