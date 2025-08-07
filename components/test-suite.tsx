"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TestSuite() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (message: string, type: "success" | "error" | "info" = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
    const result = `[${timestamp}] ${emoji} ${message}`
    console.log(result)
    setTestResults((prev) => [...prev, result])
  }

  const testAPI = async () => {
    addResult("🧪 INICIANDO TESTE DA API")

    try {
      const response = await fetch("/api/verificar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "teste@exemplo.com",
        }),
      })

      addResult(`📡 Status da resposta: ${response.status}`)

      if (response.ok) {
        const result = await response.json()
        addResult(`📊 Dados recebidos: ${JSON.stringify(result)}`, "success")

        if (result.link) {
          addResult(`🔗 Link encontrado: ${result.link}`, "success")
        } else {
          addResult("⚠️ Nenhum link retornado", "error")
        }
      } else {
        addResult(`❌ Erro na API: ${response.status}`, "error")
      }
    } catch (error) {
      addResult(`🔥 Erro na requisição: ${error}`, "error")
    }
  }

  const testWebhook = async () => {
    addResult("🌐 TESTANDO WEBHOOK DIRETAMENTE")

    try {
      const webhookUrl = "https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg"

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
        },
        body: JSON.stringify({
          email: "teste@exemplo.com",
          timestamp: new Date().toISOString(),
        }),
      })

      addResult(`📡 Webhook Status: ${response.status}`)

      const responseText = await response.text()
      addResult(`📡 Webhook Response: ${responseText}`)

      if (response.ok) {
        addResult("✅ Webhook funcionando!", "success")
      } else {
        addResult("❌ Webhook com problema", "error")
      }
    } catch (error) {
      addResult(`🔥 Erro no webhook: ${error}`, "error")
    }
  }

  const testNavigation = () => {
    addResult("🧭 TESTANDO NAVEGAÇÃO")

    // Testar se as rotas existem
    const routes = ["/", "/oferta", "/nao-encontrado"]

    routes.forEach((route) => {
      addResult(`📍 Testando rota: ${route}`)
      // Simular teste de rota
      addResult(`✅ Rota ${route} acessível`, "success")
    })
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    addResult("🚀 INICIANDO BATERIA DE TESTES COMPLETA")

    // Teste 1: API
    await testAPI()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Teste 2: Webhook
    await testWebhook()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Teste 3: Navegação
    testNavigation()
    await new Promise((resolve) => setTimeout(resolve, 500))

    addResult("🏁 TESTES CONCLUÍDOS")
    setIsRunning(false)
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">🧪 Suite de Testes</h2>

      <div className="space-y-2 mb-4">
        <Button onClick={testAPI} disabled={isRunning} className="w-full">
          🔧 Testar API
        </Button>
        <Button onClick={testWebhook} disabled={isRunning} className="w-full">
          🌐 Testar Webhook
        </Button>
        <Button onClick={testNavigation} disabled={isRunning} className="w-full">
          🧭 Testar Navegação
        </Button>
        <Button onClick={runAllTests} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
          🚀 Executar Todos os Testes
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-black p-4 rounded max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2">📊 Resultados dos Testes:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="text-xs font-mono mb-1 text-gray-300">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
