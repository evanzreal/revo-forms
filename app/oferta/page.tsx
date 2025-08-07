"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { Check } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"

export default function OfertaPage() {
  const searchParams = useSearchParams()
  const [linkOferta, setLinkOferta] = useState("")

  const whatsappLink =
    "https://wa.me/5541991411604?text=Oi!%20Estou%20com%20d%C3%BAvidas%20sobre%20a%20renova%C3%A7%C3%A3o%20das%20assinaturas%2C%20pode%20me%20ajudar%3F"

  const benefits = useMemo(
    () => [
      "01 cupom para concorrer a uma mentoria com o Rafa, com 4&nbsp;encontros",
      "Quem renovar no dia 07/08/2025, tem chance de participar de um encontro presencial com o Rafa, em São&nbsp;Paulo",
      "STL de artes do Rafa, para impressão&nbsp;3D",
      "Wallpapers, protetores de tela e arquivos para impressão de&nbsp;prints",
      "Quem renovar para o segundo ou terceiro ano, vai ganhar destaque através de insígnias no&nbsp;Discord",
      "Acesso aos conteúdos liberados no Academy nos próximos 12 meses + novidades da&nbsp;comunidade",
    ],
    [],
  )

  useEffect(() => {
    const linkFromParams = searchParams.get("link")

    if (linkFromParams && linkFromParams !== "null" && linkFromParams !== "undefined") {
      setLinkOferta(decodeURIComponent(linkFromParams))
    } else {
      window.location.href = "/nao-encontrado"
    }
  }, [searchParams])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6">
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
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
        <CountdownTimer />

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
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
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 text-center leading-tight">
          DETALHES DA <span className="text-cyan-400">SUA&nbsp;OFERTA</span>
        </h1>

        {/* Benefits Cards - Mais compactos */}
        <div className="space-y-3 mb-6 sm:mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-3 flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <p className="text-slate-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: benefit }} />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors"
          >
            <Link href={linkOferta || whatsappLink} target="_blank">
              {linkOferta ? "Comprar agora com desconto especial" : "Falar com atendimento"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
