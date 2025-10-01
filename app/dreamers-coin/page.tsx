"use client"

import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Coins,
  Trophy,
  Medal,
  Award,
  LogOut,
  Crown,
  Star,
  Gift,
  Zap,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Target,
} from "lucide-react"
import Link from "next/link"

function DreamersCoinContent() {
  const { user, logout } = useAuth()

  // Calculate coins based on rank (higher rank = more coins)
  const calculateCoinsFromRank = (rank: number) => {
    if (rank === 1) return 1000
    if (rank === 2) return 800
    if (rank === 3) return 600
    if (rank <= 5) return 400
    if (rank <= 10) return 200
    return 100
  }

  // Mock leaderboard data with coins
  const leaderboard = [
    {
      rank: 1,
      name: "Sarah Johnson",
      organization: "Tech for Good",
      totalContributions: 8500,
      coins: 1000,
      avatar: "SJ",
    },
    {
      rank: 2,
      name: "Michael Chen",
      organization: "Global Impact Corp",
      totalContributions: 7200,
      coins: 800,
      avatar: "MC",
    },
    {
      rank: 3,
      name: "Emily Rodriguez",
      organization: "Change Makers Inc",
      totalContributions: 6800,
      coins: 600,
      avatar: "ER",
    },
    {
      rank: 4,
      name: user?.name || "You",
      organization: user?.organization || "Individual Partner",
      totalContributions: 3350,
      coins: 400,
      avatar: user?.name?.charAt(0)?.toUpperCase() || "U",
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "David Kim",
      organization: "Innovation Hub",
      totalContributions: 3100,
      coins: 400,
      avatar: "DK",
    },
  ]

  const userCoins = leaderboard.find((p) => p.isCurrentUser)?.coins || 400
  const userRank = leaderboard.find((p) => p.isCurrentUser)?.rank || 4

  // Available perks for redemption
  const availablePerks = [
    {
      id: 1,
      name: "Impact Champion Badge",
      description: "Exclusive badge for your profile",
      cost: 500,
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      category: "Badge",
      available: userCoins >= 500,
    },
    {
      id: 2,
      name: "Priority Support",
      description: "Get priority customer support for 30 days",
      cost: 300,
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      category: "Service",
      available: userCoins >= 300,
    },
    {
      id: 3,
      name: "Monthly Spotlight",
      description: "Featured in next month's newsletter",
      cost: 800,
      icon: <Star className="w-6 h-6 text-purple-500" />,
      category: "Recognition",
      available: userCoins >= 800,
    },
    {
      id: 4,
      name: "Exclusive Webinar Access",
      description: "Access to VIP-only educational webinars",
      cost: 200,
      icon: <Target className="w-6 h-6 text-green-500" />,
      category: "Education",
      available: userCoins >= 200,
    },
    {
      id: 5,
      name: "Custom Profile Theme",
      description: "Personalize your profile with custom colors",
      cost: 150,
      icon: <Gift className="w-6 h-6 text-pink-500" />,
      category: "Customization",
      available: userCoins >= 150,
    },
    {
      id: 6,
      name: "Leadership Circle Invite",
      description: "Join exclusive leadership discussions",
      cost: 1200,
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      category: "Access",
      available: userCoins >= 1200,
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const coinHistory = [
    { date: "2024-01-15", amount: +400, reason: "Monthly ranking #4", type: "earned" },
    { date: "2024-01-10", amount: -200, reason: "Redeemed: Exclusive Webinar Access", type: "spent" },
    { date: "2024-01-05", amount: +100, reason: "Consistency bonus", type: "earned" },
    { date: "2023-12-30", amount: +400, reason: "Monthly ranking #4", type: "earned" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <span className="text-primary-foreground font-bold text-lg">Z</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dreamers Coin</h1>
                <p className="text-sm text-muted-foreground">Your rewards wallet</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
                <Link href="/contributions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contributions
                </Link>
              </nav>
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
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-balance">Dreamers Coin Wallet</h2>
            <p className="text-muted-foreground">
              Earn coins based on your leaderboard ranking and redeem them for exclusive perks and recognition.
            </p>
          </div>

          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Your Wallet
                    </CardTitle>
                    <CardDescription>Current balance and rank</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getRankIcon(userRank)}
                      <span>Rank #{userRank}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{userCoins.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Dreamers Coins</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next rank bonus</span>
                      <span className="font-medium">+200 coins</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">Improve your ranking to earn more coins next month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+400</div>
                <p className="text-xs text-muted-foreground">Coins earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">200</div>
                <p className="text-xs text-muted-foreground">On perks & badges</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="leaderboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leaderboard">Coin Leaderboard</TabsTrigger>
              <TabsTrigger value="redeem">Redeem Perks</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coin Leaderboard</CardTitle>
                  <CardDescription>Partners ranked by coins earned this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((partner) => (
                      <div
                        key={partner.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          partner.isCurrentUser
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 hover:bg-muted/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getRankIcon(partner.rank)}
                          <Avatar className="w-10 h-10">
                            <AvatarFallback
                              className={partner.isCurrentUser ? "bg-primary text-primary-foreground" : ""}
                            >
                              {partner.avatar}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{partner.name}</p>
                            {partner.isCurrentUser && <Badge variant="secondary">You</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{partner.organization}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            <p className="font-bold text-lg">{partner.coins}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ${partner.totalContributions.toLocaleString()} contributed
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="redeem" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePerks.map((perk) => (
                  <Card key={perk.id} className={`transition-all ${perk.available ? "hover:shadow-md" : "opacity-60"}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {perk.icon}
                          <div>
                            <CardTitle className="text-lg">{perk.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {perk.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{perk.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="font-bold">{perk.cost}</span>
                          </div>
                          <Button
                            size="sm"
                            disabled={!perk.available}
                            variant={perk.available ? "default" : "secondary"}
                          >
                            {perk.available ? "Redeem" : "Insufficient Coins"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent coin earnings and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coinHistory.map((transaction, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "earned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "earned" ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : (
                            <ShoppingBag className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{transaction.reason}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <div
                          className={`text-right font-bold ${
                            transaction.type === "earned" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earned" ? "+" : ""}
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default function DreamersCoinPage() {
  return (
    <AuthGuard>
      <DreamersCoinContent />
    </AuthGuard>
  )
}
