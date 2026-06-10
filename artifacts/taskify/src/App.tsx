import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Today from "@/pages/today";
import Completed from "@/pages/completed";
import Calendar from "@/pages/calendar";
import Statistics from "@/pages/statistics";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: { component: any, [key: string]: any }) {
  const { user, token, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (!token) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}

// Public Route Component (redirects to dashboard if logged in)
function PublicRoute({ component: Component, ...rest }: { component: any, [key: string]: any }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  if (token) {
    return <Redirect to="/dashboard" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login"><PublicRoute component={Login} /></Route>
      <Route path="/register"><PublicRoute component={Register} /></Route>
      
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/tasks"><ProtectedRoute component={Tasks} /></Route>
      <Route path="/today"><ProtectedRoute component={Today} /></Route>
      <Route path="/completed"><ProtectedRoute component={Completed} /></Route>
      <Route path="/calendar"><ProtectedRoute component={Calendar} /></Route>
      <Route path="/statistics"><ProtectedRoute component={Statistics} /></Route>
      <Route path="/settings"><Redirect to="/settings/profile" /></Route>
      <Route path="/settings/:tab*"><ProtectedRoute component={Settings} /></Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
