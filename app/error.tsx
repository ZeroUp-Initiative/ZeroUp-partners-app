"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle>Application Error</CardTitle>
          <CardDescription>
            We encountered an unexpected error. This has been logged and our team will investigate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
