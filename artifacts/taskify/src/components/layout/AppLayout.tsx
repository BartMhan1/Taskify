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
  CheckSquare
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
  { name: "Settings", href: "/settings/profile", icon: Settings },
];

export function AppLayout({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isActive = (path: string) => {
    if (path.startsWith("/settings") && location.startsWith("/settings")) {
      return true;
    }
    return location === path;
  };

  const NavLinks = () => (
    <nav className="flex-1 space-y-1 p-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileNavOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
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
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Taskify</span>
        </div>

        <NavLinks />

        <div className="mt-auto border-t p-4">
          <div className="rounded-lg bg-primary/10 p-4 text-sm">
            <p className="font-semibold text-primary">Get More Done</p>
            <p className="mt-1 text-muted-foreground">Keep up the great work. You're on track!</p>
          </div>
          <button
            onClick={() => logout()}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold">Taskify</span>
                </div>
                <NavLinks />
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold">Hello, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
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
                <DropdownMenuItem onClick={() => setLocation("/settings/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/settings/account")}>
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {(title || subtitle) && (
            <div className="mb-8">
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
