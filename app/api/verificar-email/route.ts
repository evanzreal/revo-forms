import { type NextRequest, NextResponse } from "next/server"

// Rate limiting simples em memória
const rateLimitMap = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60000 // 1 minuto
  const maxRequests = 15 // Aumentei para 15 requests por minuto (para permitir retries)

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

    // Múltiplas tentativas para o webhook com timeouts maiores
    const maxRetries = 5 // Mais tentativas na API
    let lastError

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 segundos

        console.log(`🔄 API - Tentativa ${attempt + 1} para email: ${email}`)

        const webhookResponse = await fetch("https://hook.us2.make.com/eliye1ga4lft52hgp86w5g3neleyyidg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-make-apikey": "sk_live_a8eP2f5zT7kL9mQvR3dXw6jV0nSbUdFyMZxLgQvKhPtBrC1dW8EeSx9aGhTzRm0L",
            "User-Agent": "RafaAcademy-API-Production/1.0",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            timestamp: new Date().toISOString(),
            source: "api-backup",
            attempt: attempt + 1,
            total_attempts: maxRetries
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log(`📡 API - Tentativa ${attempt + 1} - Status: ${webhookResponse.status}`)

        if (webhookResponse.ok) {
          const responseText = await webhookResponse.text()
          console.log(`📄 API - Resposta: ${responseText}`)

          let link = ""

          try {
            const result = JSON.parse(responseText)
            console.log("📊 API - JSON parseado:", result)

            // BUSCAR O LINK EM DIFERENTES CAMPOS POSSÍVEIS
            link = result.link || result.url || result.checkout_url || result.payment_link || result.purchase_link || ""
          } catch (parseError) {
            console.log("⚠️ API - Parse error, tentando extrair link do texto")
            // Se não conseguir fazer parse, tentar extrair link do texto
            const linkMatch = responseText.match(/https?:\/\/[^\s]+/gi)
            if (linkMatch && linkMatch[0]) {
              link = linkMatch[0]
            }
          }

          // SE WEBHOOK RETORNOU 200 E TEM LINK = ENCONTRADO
          if (link && link.trim() !== "" && link.includes("http")) {
            console.log(`✅ API - Link encontrado: ${link}`)
            return NextResponse.json({
              found: true,
              link: link,
              attempt: attempt + 1,
            })
          } else {
            console.log("⚠️ API - Webhook OK mas sem link válido")
            return NextResponse.json({
              found: false,
              error: "Link não encontrado na resposta",
            })
          }
        } else if (webhookResponse.status === 404 || webhookResponse.status === 400) {
          console.log(`❌ API - Email não encontrado (${webhookResponse.status})`)
          return NextResponse.json({
            found: false,
            error: "Email não encontrado",
          })
        } else {
          lastError = `Webhook error: ${webhookResponse.status}`
          console.log(`⚠️ API - Tentativa ${attempt + 1} falhou: ${lastError}`)
          
          if (attempt < maxRetries - 1) {
            // Aguardar antes da próxima tentativa
            const waitTime = (attempt + 1) * 1500 // 1.5s, 3s, 4.5s...
            console.log(`⏳ API - Aguardando ${waitTime}ms...`)
            await new Promise((resolve) => setTimeout(resolve, waitTime))
          }
        }
      } catch (error) {
        lastError = error.message
        console.log(`🔥 API - Tentativa ${attempt + 1} erro: ${lastError}`)
        
        if (attempt < maxRetries - 1) {
          const waitTime = (attempt + 1) * 1500
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      }
    }

    console.log(`❌ API - Todas as ${maxRetries} tentativas falharam`)
    return NextResponse.json(
      {
        found: false,
        error: "Serviço temporariamente indisponível",
        details: lastError,
        total_attempts: maxRetries
      },
      { status: 503 },
    )
  } catch (error) {
    console.log("🔥 API - Erro crítico:", error)
    return NextResponse.json(
      {
        found: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
