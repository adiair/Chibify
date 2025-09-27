"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate a chibi")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate chibi")
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setGeneratedImage(imageUrl)

      toast({
        title: "Chibi Generated!",
        description: "Your adorable chibi is ready.",
      })
    } catch (err) {
      setError("Failed to generate chibi. Please try again.")
      console.error("Error generating chibi:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = `chibi-generated-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    })
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{
        // soft yellows + readable foreground
        ["--background" as any]: "#FFF8E1", // light muted yellow
        ["--card" as any]: "#FFFBEB", // slightly deeper yellow for surfaces
        ["--muted" as any]: "#FEF3C7", // muted blocks
        ["--foreground" as any]: "#1F2937", // slate-800 for contrast
        ["--muted-foreground" as any]: "#4B5563", // slate-600
        ["--primary" as any]: "#F59E0B", // amber-500 accents
        ["--primary-foreground" as any]: "#1F2937", // dark text on amber
      }}
    >
      {/* Site header with navbar (no gradients, muted surface) */}
      <header className="bg-card shadow-sm">
        <div className="container mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">Chibify</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Home
            </a>
            <a href="#create" className="text-muted-foreground hover:text-foreground">
              Create
            </a>
            <a href="#tips" className="text-muted-foreground hover:text-foreground">
              Tips
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              About
            </Button>
            <Button size="sm">Try Chibify</Button>
          </div>
        </div>
      </header>

      {/* Wrap page content in main */}
      <main id="create" className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Chibify</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty">
            Transform anything into adorable chibi characters with AI magic! ✨
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Create Your Chibi
              </CardTitle>
              <CardDescription>Describe anything and we'll automatically make it chibi-style!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">What do you want to chibify?</Label>
                <Textarea
                  id="prompt"
                  placeholder="A fierce dragon, a majestic castle, a cool motorcycle, a beautiful princess..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={generateImage} disabled={isGenerating || !prompt.trim()} className="flex-1">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Chibify
                    </>
                  )}
                </Button>

                {prompt && (
                  <Button variant="outline" size="icon" onClick={copyPrompt}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Your Chibi Creation</CardTitle>
              <CardDescription>Your adorable chibi version will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Chibifying your creation...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="AI Generated"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button onClick={downloadImage} variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Enter anything and we'll make it chibi-cute!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 shadow-md border-0">
          <CardTitle className="text-lg ml-4">🎉 Chibi Creation Tips</CardTitle>
          <CardContent>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>• Describe any object, person, or scene - we'll automatically make it chibi!</p>
              <p>• Try animals, vehicles, buildings, characters, or fantasy creatures</p>
              <p>• Be specific about details you want to see (colors, accessories, expressions)</p>
              <p>• Examples: "angry cat", "rainbow unicorn", "steampunk robot", "magical forest"</p>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section anchor */}
        <div id="tips" />
      </main>

      {/* Add footer with muted surface */}
      <footer className="bg-card">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mx-auto h-px w-24 bg-foreground/20 rounded-full" aria-hidden="true" />
        </div>
      </footer>
    </div>
  )
}
