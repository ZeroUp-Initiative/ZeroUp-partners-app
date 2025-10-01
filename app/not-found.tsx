import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist or has been moved.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
