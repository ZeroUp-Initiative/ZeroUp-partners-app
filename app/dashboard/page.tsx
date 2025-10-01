"use client"

import { AuthGuard, useAuth } from "@/components/auth-guard"
import { NotificationBell } from "@/components/notification-bell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  TrendingUp,
  DollarSign,
  Target,
  Award,
  LogOut,
  Plus,
  Users,
  BarChart3,
  Brain,
  BookOpen,
  Coins,
} from "lucide-react"
import Link from "next/link"

function DashboardContent() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZeroUp Initiative</h1>
                <p className="text-sm text-muted-foreground">Partner Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/contributions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contributions
                </Link>
                <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
                <Link href="/dreamers-coin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dreamers Coin
                </Link>
                <Link href="/bridge-ai" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bridge AI
                </Link>
                <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </nav>
              <NotificationBell />
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
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-balance">Welcome back, {user?.name?.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">
              Track your contributions and see the impact you're making through the ZeroUp Initiative.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,450</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">$425 of $500 goal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94</div>
                <p className="text-xs text-muted-foreground">Top 10% of partners</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">3 new this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/contributions/new">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Log Contribution</CardTitle>
                      <CardDescription>Record your monthly contribution</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/analytics">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">View Analytics</CardTitle>
                      <CardDescription>See your impact dashboard</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/community">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Community</CardTitle>
                      <CardDescription>Connect with other partners</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/dreamers-coin">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Dreamers Coin</CardTitle>
                      <CardDescription>Your rewards wallet</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/bridge-ai">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bridge AI</CardTitle>
                      <CardDescription>AI-powered initiatives</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" asChild>
              <Link href="/resources">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Resources</CardTitle>
                      <CardDescription>Reports and guides</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest contributions and achievements</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contributions">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Monthly contribution logged</p>
                    <p className="text-sm text-muted-foreground">$500 • 2 days ago</p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Earned "Consistent Contributor" badge</p>
                    <p className="text-sm text-muted-foreground">5 days ago</p>
                  </div>
                  <Badge variant="outline">Achievement</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Reached 85% of monthly goal</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                  <Badge variant="outline">Milestone</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
