import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  CheckCircle,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Menu,
  CheckSquare,
  ChevronDown,
  Sun,
  Trophy,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: ListTodo },
  { name: "Today", href: "/today", icon: Calendar },
  { name: "Completed", href: "/completed", icon: CheckCircle },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Statistics", href: "/statistics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

function SidebarCard({ location }: { location: string }) {
  if (location.startsWith("/today")) {
    return (
      <div className="mx-3 mb-3 rounded-xl bg-amber-50 border border-amber-100 p-4 overflow-hidden relative">
        <div className="flex justify-center mb-2">
          <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
            <ellipse cx="40" cy="54" rx="30" ry="6" fill="#FDE68A" opacity="0.5"/>
            <path d="M10 50 Q40 10 70 50" fill="#86EFAC" stroke="#22C55E" strokeWidth="1"/>
            <path d="M20 50 Q40 20 60 50" fill="#BBF7D0" stroke="#22C55E" strokeWidth="0.5"/>
            <circle cx="40" cy="22" r="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
            <path d="M34 22 Q40 14 46 22" fill="#FDE68A"/>
            <circle cx="37" cy="22" r="1.5" fill="#92400E"/>
            <circle cx="43" cy="22" r="1.5" fill="#92400E"/>
            <path d="M37 25 Q40 27 43 25" stroke="#92400E" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M31 18 L29 14 M49 18 L51 14 M40 12 L40 8" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15 45 Q18 40 22 43" stroke="#4ADE80" strokeWidth="1.5" fill="none"/>
            <path d="M58 45 Q62 40 65 43" stroke="#4ADE80" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-800 text-center leading-tight">Plan your day, achieve your goals.</p>
        <p className="text-xs text-gray-500 text-center mt-1">Small steps today, big results tomorrow.</p>
        <button className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          View Tips <span className="text-gray-400">›</span>
        </button>
      </div>
    );
  }
  if (location.startsWith("/completed")) {
    return (
      <div className="mx-3 mb-3 rounded-xl bg-amber-50 border border-amber-100 p-4 overflow-hidden relative">
        <div className="flex justify-center mb-2">
          <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
            <ellipse cx="40" cy="56" rx="22" ry="5" fill="#FDE68A" opacity="0.6"/>
            <path d="M22 40 L40 10 L58 40 L52 42 L40 18 L28 42 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
            <path d="M22 40 L26 48 L40 44 L54 48 L58 40 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
            <path d="M28 48 Q40 56 52 48" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
            <circle cx="40" cy="8" r="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
            <path d="M37 8 L39 10 L44 5" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="30" r="3" fill="#A78BFA" opacity="0.8"/>
            <circle cx="56" cy="32" r="2" fill="#FCA5A5" opacity="0.8"/>
            <path d="M30 22 L32 18 L34 22 L30 22 Z" fill="#FDE68A" opacity="0.9"/>
            <path d="M46 24 L48 20 L50 24 L46 24 Z" fill="#FDE68A" opacity="0.9"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-800 text-center leading-tight">Keep it up! 🎉</p>
        <p className="text-xs text-gray-500 text-center mt-1">You're building great habits and getting things done.</p>
        <button className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          View Statistics <span className="text-gray-400">›</span>
        </button>
      </div>
    );
  }
  if (location.startsWith("/statistics")) {
    return (
      <div className="mx-3 mb-3 rounded-xl bg-purple-50 border border-purple-100 p-4 overflow-hidden relative">
        <div className="flex justify-center mb-2">
          <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
            <rect x="8" y="44" width="12" height="14" rx="2" fill="#C4B5FD"/>
            <rect x="24" y="34" width="12" height="24" rx="2" fill="#A78BFA"/>
            <rect x="40" y="24" width="12" height="34" rx="2" fill="#7C3AED"/>
            <rect x="56" y="16" width="12" height="42" rx="2" fill="#6D28D9"/>
            <path d="M8 44 Q20 30 32 34 Q44 16 68 16" stroke="#7C3AED" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="8" cy="44" r="3" fill="#C4B5FD" stroke="white" strokeWidth="1.5"/>
            <circle cx="32" cy="34" r="3" fill="#A78BFA" stroke="white" strokeWidth="1.5"/>
            <circle cx="56" cy="22" r="3" fill="#7C3AED" stroke="white" strokeWidth="1.5"/>
            <circle cx="68" cy="16" r="3" fill="#6D28D9" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-800 text-center leading-tight">Track your progress</p>
        <p className="text-xs text-gray-500 text-center mt-1">Review your productivity and achieve your goals.</p>
        <button className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          View Guide <span className="text-gray-400">›</span>
        </button>
      </div>
    );
  }
  if (location.startsWith("/settings")) {
    return (
      <div className="mx-3 mb-3 rounded-xl bg-amber-50 border border-amber-100 p-4 overflow-hidden relative">
        <div className="flex justify-center mb-2">
          <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
            <rect x="16" y="8" width="36" height="46" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <rect x="20" y="14" width="28" height="4" rx="2" fill="#FCD34D"/>
            <rect x="20" y="22" width="20" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="20" y="28" width="24" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="20" y="34" width="16" height="3" rx="1.5" fill="#E5E7EB"/>
            <rect x="20" y="40" width="22" height="3" rx="1.5" fill="#E5E7EB"/>
            <circle cx="16" cy="12" r="5" fill="#FCD34D" stroke="white" strokeWidth="1.5"/>
            <path d="M13.5 12 L15.5 14 L19 10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="52" cy="46" r="10" fill="#374151" stroke="#1F2937" strokeWidth="1"/>
            <path d="M52 42 L52 50 M48 46 L56 46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="52" cy="46" r="3" fill="#FCD34D"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-800 text-center leading-tight">Get the most out of Taskify</p>
        <p className="text-xs text-gray-500 text-center mt-1">Explore tips and best practices to stay productive.</p>
        <button className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          View Guide <span className="text-gray-400">›</span>
        </button>
      </div>
    );
  }
  return null;
}

export function AppLayout({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/settings" && location.startsWith("/settings")) return true;
    return location === href;
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <nav className="flex-1 space-y-1 p-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <item.icon className={`h-4 w-4 ${active ? "text-primary-foreground" : ""}`} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Taskify</span>
        </div>

        <NavLinks />

        <div className="mt-auto">
          <SidebarCard location={location} />
          <div className="border-t px-4 py-3">
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                    <CheckSquare className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">Taskify</span>
                </div>
                <NavLinks onClose={() => setIsMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell with badge */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>

            {/* Avatar + Name dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pr-1 hover:bg-muted/50 transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
                    <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    Hello, {user?.name?.split(' ')[0] || 'User'} 👋
                  </span>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/settings")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
