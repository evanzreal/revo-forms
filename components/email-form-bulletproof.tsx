"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailFormBulletproof() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (message: string) => {
    console.log(message)
    setDebugInfo((prev) => [...prev, message])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo([])

    if (!email || !email.includes("@")) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)
    addDebug("🚀 INICIANDO PROCESSO...")
    addDebug(`📧 Email: ${email}`)

    try {
      // TENTATIVA 1: Webhook direto
      addDebug("🌐 CHAMANDO WEBHOOK DIRETO...")

      const webhookUrl = "https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg"
      addDebug(`🔗 URL: ${webhookUrl}`)

      const webhookPayload = {
        email: email.trim().toLowerCase(),
        timestamp: new Date().toISOString(),
        source: "renovacao-form",
      }
      addDebug(`📦 Payload: ${JSON.stringify(webhookPayload)}`)

      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
          "User-Agent": "RafaAcademy-RenovacaoForm/1.0",
        },
        body: JSON.stringify(webhookPayload),
      })

      addDebug(`📡 Status: ${webhookResponse.status}`)
      addDebug(`📡 Status Text: ${webhookResponse.statusText}`)
      addDebug(`📡 Headers: ${JSON.stringify(Object.fromEntries(webhookResponse.headers.entries()))}`)

      const responseText = await webhookResponse.text()
      addDebug(`📄 Response Text: ${responseText}`)

      if (webhookResponse.ok) {
        addDebug("✅ WEBHOOK RESPONDEU OK!")

        let result
        try {
          result = JSON.parse(responseText)
          addDebug(`📊 JSON Parsed: ${JSON.stringify(result)}`)
        } catch (parseError) {
          addDebug(`⚠️ Não conseguiu fazer parse do JSON: ${parseError}`)
          addDebug("🔄 Tentando interpretar como texto...")

          // Se não conseguir fazer parse, tenta interpretar o texto
          if (
            responseText.toLowerCase().includes("found") ||
            responseText.toLowerCase().includes("success") ||
            responseText.toLowerCase().includes("true")
          ) {
            result = { found: true, link: "" }
          } else {
            result = { found: false }
          }
        }

        // VERIFICAÇÃO ULTRA ROBUSTA
        const isFound =
          result.found === true ||
          result.found === "true" ||
          result.status === "found" ||
          result.success === true ||
          result.success === "true" ||
          result.exists === true ||
          result.valid === true ||
          responseText.toLowerCase().includes("found") ||
          responseText.toLowerCase().includes("success")

        addDebug(`🔍 Email encontrado? ${isFound}`)

        // BUSCA POR LINKS EM TODOS OS CAMPOS POSSÍVEIS
        const possibleLinks = [
          result.link,
          result.url,
          result.checkout_url,
          result.payment_link,
          result.purchase_link,
          result.offer_link
        ].filter(Boolean)

        addDebug(`🔗 Links encontrados: ${JSON.stringify(possibleLinks)}`)

        const linkOferta = possibleLinks.find(
          (link) =>
            link && typeof link === "string" && link.includes("http")
        ) || ""

        addDebug(`🎯 Link final selecionado: ${linkOferta}`)

        if (isFound) {
          if (linkOferta) {
            addDebug("✅ SUCESSO! Redirecionando para oferta com link...")
            setTimeout(() => {
              window.location.href = `/oferta?link=${encodeURIComponent(linkOferta)}`
            }, 2000)
          } else {
            addDebug("⚠️ Email encontrado mas sem link válido")
            setTimeout(() => {
              window.location.href = "/nao-encontrado"
            }, 2000)
          }
        } else {
          addDebug("❌ Email não encontrado")
          setTimeout(() => {
            window.location.href = "/nao-encontrado"
          }, 2000)
        }
      } else {
        addDebug(`❌ WEBHOOK RETORNOU ERRO: ${webhookResponse.status}`)
        addDebug("🔄 Tentando API route como fallback...")

        // FALLBACK: Tentar via API route
        const apiResponse = await fetch("/api/verificar-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        })

        if (apiResponse.ok) {
          const apiResult = await apiResponse.json()
          addDebug(`📊 API Result: ${JSON.stringify(apiResult)}`)

          if (apiResult.found) {
            window.location.href = `/oferta?link=${encodeURIComponent(apiResult.link || "")}`
          } else {
            window.location.href = "/nao-encontrado"
          }
        } else {
          addDebug("❌ API route também falhou")
          window.location.href = "/nao-encontrado"
        }
      }
    } catch (error) {
      addDebug(`🔥 ERRO CRÍTICO: ${error}`)
      addDebug(`🔥 Stack: ${error instanceof Error ? error.stack : "N/A"}`)
      setError("Erro ao verificar email. Veja os detalhes abaixo.")
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

      {/* DEBUG INFO TEMPORÁRIO */}
      {debugInfo.length > 0 && (
        <div className="mt-4 p-4 bg-black/80 rounded-lg max-h-96 overflow-y-auto">
          <h3 className="text-white text-sm font-bold mb-2">🔍 Debug Info:</h3>
          {debugInfo.map((info, index) => (
            <div key={index} className="text-xs text-green-400 font-mono mb-1">
              {info}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
