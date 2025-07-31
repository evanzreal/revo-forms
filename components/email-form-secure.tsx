"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailFormSecure() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)

    try {
      console.log("🚀 ENVIANDO EMAIL VIA API SEGURA:", email)

      // Usar nossa API route segura
      const response = await fetch("/api/verificar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      })

      const result = await response.json()
      console.log("📡 RESPOSTA DA API:", result)

      if (response.status === 429) {
        setError("Muitas tentativas. Aguarde alguns minutos.")
        return
      }

      if (response.ok && result.found === true) {
        console.log("✅ EMAIL ENCONTRADO! Redirecionando para /oferta")
        const link = result.link || ""
        if (link) {
          router.push(`/oferta?link=${encodeURIComponent(link)}`)
        } else {
          router.push("/oferta")
        }
      } else {
        console.log("❌ EMAIL NÃO ENCONTRADO! Redirecionando para /nao-encontrado")
        router.push("/nao-encontrado")
      }
    } catch (error) {
      console.error("🔥 ERRO:", error)
      setError("Erro ao verificar email. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail com o qual você fez a compra"
        required
        disabled={isLoading}
        className="h-12 text-center bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
      />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? "Verificando..." : "Descobrir oferta"}
      </Button>
    </form>
  )
}
