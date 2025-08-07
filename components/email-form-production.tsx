"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailFormProduction() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  const extractLink = (responseText: string): string => {
    // Tentar JSON parse
    try {
      const result = JSON.parse(responseText)

      // Buscar em chaves específicas de link
      const possibleKeys = [
        "link",
        "url", 
        "checkout_url",
        "payment_link",
        "purchase_link",
        "offer_link"
      ]

      for (const key of possibleKeys) {
        if (result[key] && result[key].toString().trim() !== "") {
          return result[key].toString()
        }
      }

      // Se não encontrou nas chaves, pega o primeiro valor que pareça um link
      const allValues = Object.values(result).filter(
        (v) =>
          v &&
          v !== null &&
          v !== undefined &&
          v.toString().includes("http")
      )

      if (allValues.length > 0) {
        return allValues[0].toString()
      }
    } catch (parseError) {
      // Se não conseguir fazer parse, tenta extrair link do texto
      const linkMatch = responseText.match(/https?:\/\/[^\s]+/gi)
      if (linkMatch && linkMatch[0]) {
        return linkMatch[0]
      }
    }

    return ""
  }

  const callWebhook = async (emailToCheck: string, attempt: number = 1): Promise<{ success: boolean; link?: string; error?: string }> => {
    try {
      console.log(`🚀 Tentativa ${attempt} - Chamando webhook para: ${emailToCheck}`)

      // Timeout mais longo para dar tempo ao webhook responder
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos

      const response = await fetch("https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
          "User-Agent": "RafaAcademy-Production/1.0",
          Accept: "application/json",
          // Headers adicionais para melhor compatibilidade
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        body: JSON.stringify({
          email: emailToCheck,
          timestamp: new Date().toISOString(),
          attempt: attempt,
          retry: attempt > 1
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`📡 Tentativa ${attempt} - Status: ${response.status}`)

      if (response.ok) {
        const responseText = await response.text()
        console.log(`📄 Tentativa ${attempt} - Resposta: ${responseText}`)
        
        const link = extractLink(responseText)

        if (link && link.includes("http")) {
          console.log(`✅ Tentativa ${attempt} - Link encontrado: ${link}`)
          return { success: true, link }
        } else {
          console.log(`❌ Tentativa ${attempt} - Nenhum link válido encontrado`)
          return { success: false, error: "Nenhum link encontrado na resposta" }
        }
      } else {
        console.log(`❌ Tentativa ${attempt} - Erro HTTP: ${response.status}`)
        return { success: false, error: `Erro HTTP: ${response.status}` }
      }
    } catch (error) {
      console.log(`🔥 Tentativa ${attempt} - Erro: ${error}`)
      
      if (error.name === 'AbortError') {
        return { success: false, error: "Timeout - webhook demorou para responder" }
      }
      
      return { success: false, error: `Erro de rede: ${error.message}` }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)
    setRetryCount(0)

    const emailToCheck = email.trim().toLowerCase()
    const maxRetries = 3
    let lastError = ""

    // SISTEMA DE RETRY ROBUSTO
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setRetryCount(attempt)
      
      // Mostrar progresso para o usuário
      if (attempt > 1) {
        setError(`Tentativa ${attempt} de ${maxRetries}... Aguarde.`)
      }

      const result = await callWebhook(emailToCheck, attempt)

      if (result.success && result.link) {
        console.log(`🎯 SUCESSO na tentativa ${attempt}!`)
        window.location.href = `/oferta?link=${encodeURIComponent(result.link)}`
        return
      } else {
        lastError = result.error || "Erro desconhecido"
        console.log(`⚠️ Tentativa ${attempt} falhou: ${lastError}`)

        // Se não é a última tentativa, aguardar antes de tentar novamente
        if (attempt < maxRetries) {
          const waitTime = attempt * 2000 // 2s, 4s, 6s...
          console.log(`⏳ Aguardando ${waitTime}ms antes da próxima tentativa...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    console.log(`❌ TODAS AS ${maxRetries} TENTATIVAS FALHARAM`)
    console.log(`🔥 Último erro: ${lastError}`)

    // FALLBACK: Tentar via API route como última tentativa
    console.log("🔄 Tentando via API route como fallback...")
    
    try {
      const apiResponse = await fetch("/api/verificar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToCheck }),
      })

      if (apiResponse.ok) {
        const apiResult = await apiResponse.json()
        console.log("📊 API route resultado:", apiResult)

        if (apiResult.found && apiResult.link) {
          console.log("✅ API route encontrou o link!")
          window.location.href = `/oferta?link=${encodeURIComponent(apiResult.link)}`
          return
        }
      }
    } catch (apiError) {
      console.log("🔥 API route também falhou:", apiError)
    }

    // Se tudo falhou, ir para não encontrado
    console.log("❌ Redirecionando para /nao-encontrado")
    window.location.href = "/nao-encontrado"

    setIsLoading(false)
  }

  const getButtonText = () => {
    if (!isLoading) return "Descobrir oferta"
    
    if (retryCount === 0) return "Verificando..."
    
    return `Tentativa ${retryCount}/3...`
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
        {error && (
          <p className={`text-sm text-center ${error.includes("Tentativa") ? "text-yellow-400" : "text-red-400"}`}>
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {getButtonText()}
        </Button>
      </form>
    </div>
  )
}
