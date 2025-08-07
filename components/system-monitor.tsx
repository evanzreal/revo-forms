"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function SystemMonitor() {
  const [status, setStatus] = useState({
    api: "checking",
    webhook: "checking",
    pages: "checking",
  })
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setLogs((prev) => [...prev.slice(-20), logMessage]) // Keep last 20 logs
  }

  const checkAPI = async () => {
    try {
      const response = await fetch("/api/verificar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "monitor@test.com" }),
      })

      if (response.ok) {
        setStatus((prev) => ({ ...prev, api: "online" }))
        addLog("✅ API funcionando")
      } else {
        setStatus((prev) => ({ ...prev, api: "error" }))
        addLog("❌ API com erro")
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, api: "offline" }))
      addLog("🔥 API offline")
    }
  }

  const checkWebhook = async () => {
    try {
      const response = await fetch("https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
        },
        body: JSON.stringify({ email: "monitor@test.com" }),
      })

      if (response.ok) {
        setStatus((prev) => ({ ...prev, webhook: "online" }))
        addLog("✅ Webhook funcionando")
      } else {
        setStatus((prev) => ({ ...prev, webhook: "error" }))
        addLog("❌ Webhook com erro")
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, webhook: "offline" }))
      addLog("🔥 Webhook offline")
    }
  }

  const runHealthCheck = async () => {
    addLog("🔍 Iniciando verificação de saúde do sistema")
    await checkAPI()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await checkWebhook()
    setStatus((prev) => ({ ...prev, pages: "online" }))
    addLog("✅ Verificação concluída")
  }

  useEffect(() => {
    runHealthCheck()
    const interval = setInterval(runHealthCheck, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "error":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return "🟢"
      case "error":
        return "🟡"
      case "offline":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">📊 Monitor do Sistema</h3>
        <Button onClick={runHealthCheck} size="sm">
          🔄 Verificar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl ${getStatusColor(status.api)}`}>{getStatusIcon(status.api)}</div>
          <div className="text-sm text-white">API</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl ${getStatusColor(status.webhook)}`}>{getStatusIcon(status.webhook)}</div>
          <div className="text-sm text-white">Webhook</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl ${getStatusColor(status.pages)}`}>{getStatusIcon(status.pages)}</div>
          <div className="text-sm text-white">Páginas</div>
        </div>
      </div>

      <div className="bg-black p-2 rounded max-h-32 overflow-y-auto">
        <div className="text-xs text-gray-300 font-mono">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
