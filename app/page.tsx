import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Target, Award, Globe, Heart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZeroUp Initiative</h1>
                <p className="text-sm text-muted-foreground">Partners Hub</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#impact" className="text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </Link>
              <Link href="#partners" className="text-muted-foreground hover:text-foreground transition-colors">
                Partners
              </Link>
              <Button asChild>
                <Link href="/login">Partner Login</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Globe className="w-4 h-4 mr-2" />
                  ZeroUp Initiative
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Empowering partners to drive <span className="text-primary">meaningful change</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Join our community of dedicated partners tracking contributions, celebrating milestones, and creating
                  lasting impact through the Partners Hub.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link href="/signup">
                    Become a Partner
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                  <Link href="#impact">View Impact</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-primary">2,500+</CardTitle>
                    <CardDescription>Active Partners</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-secondary/5 border-secondary/20 mt-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-secondary">$1.2M</CardTitle>
                    <CardDescription>Total Contributions</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-accent/5 border-accent/20 -mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-accent">150+</CardTitle>
                    <CardDescription>Projects Funded</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-destructive/5 border-destructive/20 mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-destructive">95%</CardTitle>
                    <CardDescription>Impact Rate</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-balance">
              Built for partners who care about <span className="text-primary">real impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Track your contributions, celebrate milestones, and see the direct impact of your partnership with
              transparent analytics and reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Contribution Tracking</CardTitle>
                <CardDescription>
                  Log monthly contributions with proof of payment and track your partnership journey over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Impact Analytics</CardTitle>
                <CardDescription>
                  View detailed dashboards showing how your contributions drive real change and measurable outcomes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Recognition System</CardTitle>
                <CardDescription>
                  Earn badges and milestones as you reach contribution goals and celebrate achievements with the
                  community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-balance">Ready to make a difference?</h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Join thousands of partners already making an impact through the ZeroUp Initiative.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/signup">
                  Start Your Partnership
                  <Heart className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 bg-transparent">
                <Link href="/login">Existing Partner Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">Z</span>
                </div>
                <span className="font-bold">ZeroUp Initiative</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering partners to create meaningful change through the Partners Hub.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
                <Link href="/contributions" className="block text-muted-foreground hover:text-foreground">
                  Contributions
                </Link>
                <Link href="/analytics" className="block text-muted-foreground hover:text-foreground">
                  Analytics
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <Link href="/partners" className="block text-muted-foreground hover:text-foreground">
                  Partners
                </Link>
                <Link href="/leaderboard" className="block text-muted-foreground hover:text-foreground">
                  Leaderboard
                </Link>
                <Link href="/bridge-ai" className="block text-muted-foreground hover:text-foreground">
                  Bridge AI
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="block text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
                <Link href="/resources" className="block text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ZeroUp Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
