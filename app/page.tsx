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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Chibify
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform anything into adorable chibi characters with a sprinkle of AI magic ✨  
            From fierce dragons to cute robots, make it irresistibly chibi!
          </p>
          <div className="mt-6">
            <Button size="lg" className="rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:opacity-90 transition-all">
              Start Chibifying
            </Button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Input Section */}
          <Card className="rounded-2xl shadow-xl backdrop-blur bg-background/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-primary" />
                Create Your Chibi
              </CardTitle>
              <CardDescription>
                Describe anything and we'll turn it into chibi-style art!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="prompt" className="text-sm font-medium">What do you want to chibify?</Label>
              <Textarea
                id="prompt"
                placeholder="A fierce dragon, a majestic castle, a cool motorcycle..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl border-muted focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <div className="flex gap-2">
                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:opacity-90 transition-all"
                >
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
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyPrompt}
                    className="rounded-xl hover:bg-muted transition-all"
                  >
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
          <Card className="rounded-2xl shadow-xl backdrop-blur bg-background/80">
            <CardHeader>
              <CardTitle>Your Chibi Creation</CardTitle>
              <CardDescription>Your adorable chibi version will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden relative">
                {isGenerating ? (
                  <div className="text-center animate-pulse">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground">Chibifying your creation...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="AI Generated"
                      className="w-full h-full object-cover rounded-xl animate-fadeIn"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center">
                      <Button onClick={downloadImage} variant="secondary" className="rounded-xl">
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

        {/* Features / Tips */}
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold mb-8">🎉 Chibi Creation Tips</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, text: "Describe any object, person, or scene - we'll make it chibi!" },
              { icon: Palette, text: "Add details like colors, accessories, or expressions" },
              { icon: Wand2, text: "Try animals, vehicles, buildings, or fantasy creatures" },
              { icon: Stars, text: 'Examples: "angry cat", "rainbow unicorn", "steampunk robot"' },
            ].map((tip, i) => (
              <Card key={i} className="rounded-xl shadow-md hover:shadow-lg transition-all text-center p-6">
                <tip.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          Built with ❤️ by Aditya • <a href="https://github.com/yourgithub" className="underline hover:text-primary">GitHub</a> • <a href="https://linkedin.com/in/yourlinkedin" className="underline hover:text-primary">LinkedIn</a>
        </footer>
      </div>
    </div>
  )
}
