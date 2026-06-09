import { Link } from "wouter";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

function TaskifyLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9L7 13L15 5" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight">Taskify</span>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[580px] mx-auto select-none">
      {/* Laptop frame */}
      <div className="relative">
        {/* Screen */}
        <div className="rounded-xl overflow-hidden border-[6px] border-gray-800 shadow-2xl bg-gray-50" style={{aspectRatio:"16/10"}}>
          <div className="flex h-full">
            {/* Mini sidebar */}
            <div className="w-[22%] bg-white border-r border-gray-100 flex flex-col p-2 gap-1">
              <div className="flex items-center gap-1 mb-2 px-1">
                <div className="w-4 h-4 rounded bg-yellow-400 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3 5.5L6.5 2" stroke="black" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span className="text-[7px] font-bold text-gray-800">Taskify</span>
              </div>
              {["Dashboard","My Tasks","Today","Completed","Calendar","Statistics","Settings"].map((item, i) => (
                <div key={item} className={`rounded px-2 py-1 text-[6px] font-medium ${i===0 ? "bg-yellow-400 text-gray-900" : "text-gray-500"}`}>{item}</div>
              ))}
            </div>
            {/* Mini main content */}
            <div className="flex-1 bg-gray-50 p-2 overflow-hidden">
              <div className="text-[8px] font-bold text-gray-800 mb-1">Dashboard</div>
              <div className="text-[5px] text-gray-400 mb-2">Welcome back, Aarav! Here's what's happening.</div>
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-1 mb-2">
                {[["24","Total Tasks","#EDE9FE"],["15","Pending","#FEF3C7"],["9","Completed","#DCFCE7"],["6","Today","#DBEAFE"]].map(([v,l,c])=>(
                  <div key={l} className="rounded p-1.5" style={{background:c}}>
                    <div className="text-[9px] font-bold text-gray-800">{v}</div>
                    <div className="text-[5px] text-gray-500">{l}</div>
                  </div>
                ))}
              </div>
              {/* Tasks list */}
              <div className="bg-white rounded p-1.5 mb-1">
                <div className="text-[6px] font-semibold text-gray-700 mb-1">My Tasks</div>
                {[["Design landing page","Pending","#FEF3C7"],["Complete project report","Pending","#FEF3C7"],["Buy groceries","Completed","#DCFCE7"],["Read a book","Completed","#DCFCE7"]].map(([t,s,c])=>(
                  <div key={t} className="flex items-center justify-between py-0.5 border-b border-gray-50 last:border-0">
                    <span className="text-[5px] text-gray-600">{t}</span>
                    <span className="text-[4px] rounded px-1 py-0.5 font-medium" style={{background:c, color: s==="Pending" ? "#92400E" : "#166534"}}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Laptop base */}
        <div className="h-3 bg-gray-700 rounded-b-xl mx-4" />
        <div className="h-1.5 bg-gray-600 rounded-b-xl mx-0" />
      </div>

      {/* Phone overlay */}
      <div className="absolute -right-8 top-6 w-[22%] rounded-xl overflow-hidden border-[3px] border-gray-800 shadow-xl bg-white" style={{aspectRatio:"9/19"}}>
        <div className="h-2 bg-gray-800 flex items-center justify-center">
          <div className="w-4 h-1 bg-gray-600 rounded-full"/>
        </div>
        <div className="p-1.5 bg-gray-50 h-full">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded bg-yellow-400 flex items-center justify-center">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 3L2.5 4.5L5 1.5" stroke="black" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <span className="text-[5px] font-bold text-gray-800">Taskify</span>
          </div>
          <div className="text-[5px] font-semibold text-gray-700 mb-1">My Tasks</div>
          {[["Design landing page","Pending"],["Complete project report","Pending"],["Buy groceries","Completed"],["Read a book","Completed"]].map(([t,s])=>(
            <div key={t} className="flex flex-col mb-1 bg-white rounded p-1">
              <span className="text-[4.5px] text-gray-700 font-medium leading-tight">{t}</span>
              <span className={`text-[4px] font-medium ${s==="Pending" ? "text-amber-600" : "text-green-600"}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <TaskifyLogo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-4 py-2 hidden sm:block transition-colors">
              Login
            </Link>
            <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <span className="text-amber-500">✦</span>
                  Organize. Prioritize. Get Things Done.
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-gray-900 leading-tight">
                  Manage your tasks.<br />
                  Boost your <span className="text-primary">productivity.</span>
                </h1>
                <p className="max-w-[520px] text-base text-gray-500 leading-relaxed">
                  Taskify helps you plan your day, stay organized,<br className="hidden md:block"/>
                  and never miss what matters.<br/>
                  Create, update, complete, and delete tasks<br className="hidden md:block"/>
                  — all in one simple platform.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-8 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                  Login
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {["#FBBF24","#34D399","#60A5FA","#A78BFA"].map((c, i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-white" style={{background:c}}/>
                  ))}
                </div>
                <p>Join 10,000+ users</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <DashboardMockup />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-3 mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">FEATURES</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Everything you need to stay on track
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Create Tasks",
                  desc: "Add tasks in seconds and keep everything in one place.",
                  bg: "#FEF3C7",
                  iconColor: "#F59E0B",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="2" width="14" height="18" rx="2" stroke="#F59E0B" strokeWidth="1.5"/>
                      <path d="M9 2V4C9 5.105 9.895 6 11 6H13C14.105 6 15 5.105 15 4V2" stroke="#F59E0B" strokeWidth="1.5"/>
                      <path d="M8 10H16M8 14H13" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )
                },
                {
                  title: "Update Easily",
                  desc: "Edit your tasks anytime to keep details up to date.",
                  bg: "#EDE9FE",
                  iconColor: "#7C3AED",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.448 4 3 4.448 3 5V20C3 20.552 3.448 21 4 21H19C19.552 21 20 20.552 20 20V13" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M18.5 2.5L21.5 5.5L12 15H9V12L18.5 2.5Z" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  )
                },
                {
                  title: "Mark as Complete",
                  desc: "Track progress and feel accomplished.",
                  bg: "#DCFCE7",
                  iconColor: "#16A34A",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="1.5"/>
                      <path d="M8 12L10.5 14.5L16 9" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                },
                {
                  title: "Delete Tasks",
                  desc: "Remove tasks you no longer need.",
                  bg: "#FEE2E2",
                  iconColor: "#DC2626",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H21M19 6L18 20C18 20.552 17.552 21 17 21H7C6.448 21 6 20.552 6 20L5 6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M9 6V4C9 3.448 9.448 3 10 3H14C14.552 3 15 3.448 15 4V6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 11V17M14 11V17" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )
                },
              ].map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{background: f.bg}}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="30" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="2"/>
                <circle cx="40" cy="40" r="18" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2"/>
                <circle cx="40" cy="40" r="7" fill="#F59E0B"/>
                <line x1="40" y1="4" x2="40" y2="14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="40" y1="66" x2="40" y2="76" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="4" y1="40" x2="14" y2="40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="66" y1="40" x2="76" y2="40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="64" y1="24" x2="52" y2="30" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M52 34 L62 20 L65 22 Z" fill="#F59E0B" opacity="0.7"/>
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Ready to take control of your tasks?
              </h2>
              <p className="text-gray-500 text-base">
                Join Taskify today and experience a smarter<br className="hidden md:block"/>
                way to get things done.
              </p>
            </div>
            <Link href="/register" className="flex-shrink-0 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 whitespace-nowrap">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <TaskifyLogo />
            <p className="text-sm text-gray-400 leading-relaxed">
              Your daily task manager<br/>for a better you.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <Github className="h-5 w-5 hover:text-gray-700 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-gray-700 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-gray-700 cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-gray-700 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-gray-700 transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-gray-700 transition-colors">About</a></li>
              <li><a href="#pricing" className="hover:text-gray-700 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Support</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gray-700 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-700 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t text-center text-sm text-gray-400">
          © 2024 Taskify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
