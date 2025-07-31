import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import Image from "next/image"

export default function NaoEncontradoPage() {
  const whatsappLink =
    "https://wa.me/5541991411604?text=Oi!%20Estou%20com%20d%C3%BAvidas%20sobre%20a%20renova%C3%A7%C3%A3o%20das%20assinaturas%2C%20pode%20me%20ajudar%3F"

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
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center">
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
          IH, ESSE EMAIL NÃO ESTÁ NA NOSSA&nbsp;LISTA
        </h1>

        {/* Description */}
        <div className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
          <p className="leading-relaxed">
            Manda uma mensagem pra gente e vamos descobrir o que&nbsp;aconteceu,&nbsp;ok?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Button asChild className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm">
            <Link href={whatsappLink} target="_blank">
              Falar com&nbsp;atendimento
            </Link>
          </Button>
          <Button
            asChild
            className="w-full h-12 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm border border-slate-600"
          >
            <Link href="/">Testar outro&nbsp;email</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
