"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailFormProduction() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const extractValue = (responseText: string): string => {
    // Tentar JSON parse
    try {
      const result = JSON.parse(responseText)

      // Buscar em chaves específicas
      const possibleKeys = [
        "Oferta Especial",
        "oferta especial",
        "valor",
        "price",
        "amount",
        "oferta",
        "preco",
        "value",
      ]

      for (const key of possibleKeys) {
        if (result[key] && result[key].toString().trim() !== "") {
          return result[key].toString()
        }
      }

      // Se não encontrou nas chaves, pega o primeiro valor válido
      const allValues = Object.values(result).filter(
        (v) =>
          v &&
          v !== null &&
          v !== undefined &&
          v.toString().trim() !== "" &&
          v.toString().toLowerCase() !== "null" &&
          v.toString().toLowerCase() !== "undefined",
      )

      if (allValues.length > 0) {
        return allValues[0].toString()
      }
    } catch (parseError) {
      // Se não conseguir fazer parse, tenta extrair valor do texto
      const valorMatch = responseText.match(/R\$\s?[\d.,]+/gi)
      if (valorMatch && valorMatch[0]) {
        return valorMatch[0]
      }
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://hook.us2.make.com/la80crrjbydbis49hmcwcbijd2iw8jgg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
          "User-Agent": "RafaAcademy-Production/1.0",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const responseText = await response.text()
        const valor = extractValue(responseText)

        // SÓ VAI PARA OFERTA SE REALMENTE ENCONTROU UM VALOR VÁLIDO
        if (valor && valor.trim() !== "" && valor.toLowerCase() !== "null") {
          window.location.href = `/oferta?valor=${encodeURIComponent(valor)}`
        } else {
          // SE NÃO ENCONTROU VALOR VÁLIDO = NÃO ENCONTRADO
          window.location.href = "/nao-encontrado"
        }
      } else {
        // QUALQUER STATUS DIFERENTE DE 200 = NÃO ENCONTRADO
        window.location.href = "/nao-encontrado"
      }
    } catch (error) {
      // ERRO NA REQUISIÇÃO = NÃO ENCONTRADO
      window.location.href = "/nao-encontrado"
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email com o qual você fez a compra"
          required
          disabled={isLoading}
          className="h-12 text-center bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400 text-sm"
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {isLoading ? "Verificando..." : "Descobrir oferta"}
        </Button>
      </form>
    </div>
  )
}
