"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailFormSimple() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      })

      if (response.ok) {
        const responseText = await response.text()
        console.log("✅ WEBHOOK OK! Response:", responseText)

        let link = ""

        try {
          const result = JSON.parse(responseText)

          // BUSCAR O LINK EM DIFERENTES CAMPOS
          link = result.link || result.url || result.checkout_url || result.payment_link || result.purchase_link || ""
        } catch {
          // Se não conseguir fazer parse, tentar extrair link do texto
          const linkMatch = responseText.match(/https?:\/\/[^\s]+/gi)
          if (linkMatch && linkMatch[0]) {
            link = linkMatch[0]
          }
        }

        // WEBHOOK OK = SEMPRE ENCONTRADO SE TEM LINK
        if (link && link.includes("http")) {
          window.location.href = `/oferta?link=${encodeURIComponent(link)}`
        } else {
          window.location.href = "/nao-encontrado"
        }
      } else {
        console.log("❌ Webhook erro:", response.status)
        window.location.href = "/nao-encontrado"
      }
    } catch (error) {
      // Se deu erro na requisição
      window.location.href = "/nao-encontrado"
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </div>
  )
}
