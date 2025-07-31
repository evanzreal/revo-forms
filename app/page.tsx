import { CountdownTimer } from "@/components/countdown-timer"
import { EmailFormProduction } from "@/components/email-form-production"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      {/* Background Images - Responsivo */}
      <div className="absolute inset-0 z-0">
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-desktop.png')",
          }}
        />
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-mobile.png')",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto text-center">
        <CountdownTimer />

        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <Image
              src="/images/logo-rafa-academy.png"
              alt="RAFA ACADEMY"
              width={100}
              height={50}
              className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          DESCUBRA SUA <span className="text-cyan-400">OFERTA&nbsp;DE</span>
          <br />
          RENOVAÇÃO DA ASSINATURA
        </h1>

        {/* Description */}
        <div className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
          <p className="mb-3">
            Digite seu email abaixo para obter sua{" "}
            <span className="text-cyan-400 font-semibold">oferta&nbsp;exclusiva</span> de renovação de&nbsp;assinatura.
          </p>
          <p className="text-sm sm:text-base">
            O valor da sua oferta é baseado em quanto tempo você assina a&nbsp;Academy! Quanto mais tempo você mantém a
            sua assinatura, mais vantagens você&nbsp;tem!
          </p>
        </div>

        <EmailFormProduction />
      </div>
    </div>
  )
}
