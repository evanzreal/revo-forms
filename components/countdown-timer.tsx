"use client"

import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Data final: 15 de agosto de 2025 às 23:59:59 (horário de Brasília)
      const endDate = new Date("2025-08-15T23:59:59.999-03:00")
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setIsExpired(false)
        return { days, hours, minutes, seconds }
      } else {
        // Oferta expirada
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
    }

    // Calcular imediatamente ao carregar
    setTimeLeft(calculateTimeLeft())

    // Atualizar a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Cleanup do timer
    return () => clearInterval(timer)
  }, [])

  // Se a oferta expirou, mostrar mensagem
  if (isExpired) {
    return (
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-red-400 text-sm sm:text-base font-bold">OFERTA EXPIRADA</p>
        <p className="text-gray-400 text-xs mt-1">Esta promoção encerrou em 15/08/2025</p>
      </div>
    )
  }

  return (
    <div className="text-center mb-6 sm:mb-8">
      <p className="text-white text-xs sm:text-sm mb-2">A OFERTA VAI ACABAR&nbsp;EM:</p>
      <div className="flex justify-center items-center gap-2 sm:gap-3 text-cyan-400">
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums">
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">DIAS</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">HRS</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">MIN</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl md:text-2xl font-bold tabular-nums">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-white">SEGS</span>
        </div>
      </div>
    </div>
  )
}
