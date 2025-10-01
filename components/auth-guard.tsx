"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  organization?: string
}

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  return { user, logout }
}
