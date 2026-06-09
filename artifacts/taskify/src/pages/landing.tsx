import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, LayoutDashboard, Calendar, Bell, Shield, Github, Twitter, Linkedin } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Taskify</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
              Login
            </Link>
            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                  Organize. Prioritize. Get Things Done.
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                  Manage your tasks.<br />Boost your productivity.
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
                  Taskify helps you organize your daily tasks, set priorities, and track your progress in one beautifully designed, easy-to-use platform.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  Log in to your account
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted"></div>
                  ))}
                </div>
                <p>Join 10,000+ users</p>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[600px] items-center justify-center lg:max-w-none">
              <div className="relative w-full aspect-video rounded-xl border bg-muted/30 shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                <div className="text-center text-muted-foreground font-medium p-8 relative z-10">
                  <LayoutDashboard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  App Mockup Placeholder
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/40 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Everything you need to stay on track</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                Simple tools designed for maximum productivity without the clutter.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Create Tasks", desc: "Quickly add new tasks with essential details like due dates and priorities.", icon: CheckSquare },
                { title: "Update Easily", desc: "Modify task status and details with just a few clicks as things change.", icon: LayoutDashboard },
                { title: "Mark as Complete", desc: "Experience the satisfaction of checking off tasks as you finish them.", icon: Calendar },
                { title: "Delete Tasks", desc: "Keep your workspace clean by removing tasks you no longer need.", icon: Shield },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 lg:px-6 text-center">
          <div className="mx-auto max-w-[800px] space-y-8 rounded-2xl bg-primary/5 border border-primary/20 p-8 md:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Ready to take control of your tasks?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Join thousands of people who use Taskify to get things done, organize their life, and achieve their goals.
            </p>
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded border bg-primary text-primary-foreground">
                <CheckSquare className="h-4 w-4" />
              </div>
              <span className="font-bold">Taskify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The modern task manager for people who want to stay organized and productive.
            </p>
            <div className="flex space-x-4 text-muted-foreground">
              <Twitter className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Github className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Taskify Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
