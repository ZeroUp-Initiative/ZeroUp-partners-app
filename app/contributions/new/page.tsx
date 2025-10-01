"use client"

import type React from "react"

import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Upload, LogOut, DollarSign, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

function NewContributionContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    proofFile: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, proofFile: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (!formData.amount || !formData.date || !formData.description) {
        setError("Please fill in all required fields")
        return
      }

      if (!formData.proofFile) {
        setError("Please upload proof of payment")
        return
      }

      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount")
        return
      }

      // Simulate API call - replace with actual submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("Contribution logged successfully! It will be reviewed within 2-3 business days.")

      // Reset form
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        proofFile: null,
      })

      // Redirect after success
      setTimeout(() => {
        router.push("/contributions")
      }, 2000)
    } catch (err) {
      setError("Failed to log contribution. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/contributions" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <span className="text-primary-foreground font-bold text-lg">Z</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Log New Contribution</h1>
                  <p className="text-sm text-muted-foreground">Record your monthly contribution</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.organization || "Individual Partner"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Back Button */}
          <Link href="/contributions" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contributions
          </Link>

          {/* Form Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Log New Contribution</CardTitle>
              <CardDescription>
                Record your monthly contribution with proof of payment. All submissions are reviewed within 2-3 business
                days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-secondary text-secondary">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Contribution Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="500.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Contribution Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Monthly contribution - January 2024"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                {/* Proof of Payment */}
                <div className="space-y-2">
                  <Label htmlFor="proof">Proof of Payment *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="proof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="proof" className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm font-medium">
                            {formData.proofFile ? formData.proofFile.name : "Click to upload proof of payment"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a clear image or PDF of your payment receipt, bank statement, or transaction confirmation.
                  </p>
                </div>

                {/* Guidelines */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Submission Guidelines
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Ensure proof of payment is clear and readable</li>
                        <li>• Include transaction date, amount, and recipient details</li>
                        <li>• Contributions are reviewed within 2-3 business days</li>
                        <li>• You'll receive email notification once reviewed</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Contribution"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/contributions">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function NewContributionPage() {
  return (
    <AuthGuard>
      <NewContributionContent />
    </AuthGuard>
  )
}
