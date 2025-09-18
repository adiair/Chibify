import { type NextRequest, NextResponse } from "next/server"

const HF_API_TOKEN = "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"
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const chibiPrompt = `${prompt}, chibi style, cute kawaii character, big eyes, small body proportions, 
    adorable, anime chibi art style, pastel colors, soft lighting, high quality digital art`

    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: chibiPrompt, // Use the chibified prompt instead of original
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 50,
          width: 512,
          height: 512,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API error:", errorText)
      return NextResponse.json({ error: "Failed to generate image" }, { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in generate-image API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
