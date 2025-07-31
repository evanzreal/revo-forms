import { type NextRequest, NextResponse } from "next/server"

// Rate limiting simples em memória
const rateLimitMap = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minuto
  const maxRequests = 10 // 10 requests por minuto

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  const record = rateLimitMap.get(ip)
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return false
  }

  if (record.count >= maxRequests) {
    return true
  }

  record.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 })
    }

    const body = await request.json()
    const email = body.email

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Múltiplas tentativas para o webhook
    const maxRetries = 3
    let lastError

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const webhookResponse = await fetch("https://hook.us2.make.com/la80crrjbydbis49hmcwcbijd2iw8jgg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
            "User-Agent": "RafaAcademy-API-Production/1.0",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            timestamp: new Date().toISOString(),
            source: "api-backup",
            attempt: attempt + 1,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (webhookResponse.ok) {
          const responseText = await webhookResponse.text()
          console.log("🎯 WEBHOOK OK! Response:", responseText)

          let result = {}
          let valor = ""

          try {
            result = JSON.parse(responseText)
            console.log("📊 Parsed result:", result)

            // PEGA O VALOR DA CHAVE "Oferta Especial" PRIMEIRO
            if (result["Oferta Especial"]) {
              valor = result["Oferta Especial"]
              console.log("💰 Valor encontrado em 'Oferta Especial':", valor)
            } else {
              // FALLBACK: BUSCA EM OUTROS CAMPOS
              valor =
                result.valor ||
                result.price ||
                result.amount ||
                result.oferta ||
                result.preco ||
                result.value ||
                result.offer ||
                result.discount ||
                ""
            }
          } catch (parseError) {
            console.log("⚠️ Parse error mas webhook OK = ENCONTRADO")
            // Parse error não importa se webhook retornou 200
          }

          // SE WEBHOOK RETORNOU 200 = SEMPRE ENCONTRADO
          return NextResponse.json({
            found: true,
            valor: valor || "Consulte o atendimento",
            attempt: attempt + 1,
          })
        } else if (webhookResponse.status === 404 || webhookResponse.status === 400) {
          return NextResponse.json({
            found: false,
            error: "Email não encontrado",
          })
        } else {
          lastError = `Webhook error: ${webhookResponse.status}`
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
          }
        }
      } catch (error) {
        lastError = error.message
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
        }
      }
    }

    return NextResponse.json(
      {
        found: false,
        error: "Serviço temporariamente indisponível",
        details: lastError,
      },
      { status: 503 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        found: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
