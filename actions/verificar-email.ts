"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
})

export async function verificarEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string

    // Validate email
    const validatedData = emailSchema.parse({ email })

    // Call our API route instead of webhook directly
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/verificar-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: validatedData.email }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("API response:", result)

      if (result.found === true) {
        // Pass the purchase link from response
        const purchaseLink = result.link || ""
        const queryParams = purchaseLink ? `?link=${encodeURIComponent(purchaseLink)}` : ""
        redirect(`/oferta${queryParams}`)
      } else {
        redirect("/nao-encontrado")
      }
    } else {
      console.error("API call failed:", response.status)
      redirect("/nao-encontrado")
    }
  } catch (error) {
    console.error("Error in verificarEmail:", error)
    redirect("/nao-encontrado")
  }
}
