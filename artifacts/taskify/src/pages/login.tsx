import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

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

function ClipboardIllustration() {
  return (
    <div className="flex items-center justify-center py-4">
      <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Calendar - left floating */}
        <rect x="14" y="90" width="54" height="52" rx="6" fill="#818CF8" opacity="0.9"/>
        <rect x="14" y="90" width="54" height="14" rx="6" fill="#6366F1"/>
        <rect x="14" y="96" width="54" height="8" fill="#6366F1"/>
        <circle cx="26" cy="90" r="3" fill="white" opacity="0.8"/>
        <circle cx="56" cy="90" r="3" fill="white" opacity="0.8"/>
        {/* Calendar grid dots */}
        {[0,1,2,3,4,5].map(i => (
          <circle key={i} cx={22 + (i % 3) * 14} cy={115 + Math.floor(i / 3) * 12} r="2.5" fill="white" opacity="0.7"/>
        ))}
        <rect x="36" y="112" width="8" height="8" rx="2" fill="#FCD34D" opacity="0.9"/>

        {/* Main Clipboard */}
        <rect x="68" y="20" width="120" height="160" rx="10" fill="#1E293B" opacity="0.95"/>
        <rect x="72" y="30" width="112" height="145" rx="7" fill="#334155"/>
        {/* Clip at top */}
        <rect x="98" y="14" width="60" height="18" rx="9" fill="#475569"/>
        <rect x="106" y="18" width="44" height="10" rx="5" fill="#64748B"/>

        {/* Task items on clipboard */}
        {/* Task 1 - checked */}
        <rect x="80" y="48" width="100" height="20" rx="4" fill="#FCD34D" opacity="0.95"/>
        <rect x="86" y="53" width="10" height="10" rx="2" fill="#1E293B"/>
        <path d="M88 58L90.5 60.5L94 55.5" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="100" y="56" width="52" height="3" rx="1.5" fill="#92400E" opacity="0.6"/>
        <rect x="100" y="61" width="32" height="2" rx="1" fill="#92400E" opacity="0.4"/>

        {/* Task 2 - checked */}
        <rect x="80" y="74" width="100" height="20" rx="4" fill="#FCD34D" opacity="0.95"/>
        <rect x="86" y="79" width="10" height="10" rx="2" fill="#1E293B"/>
        <path d="M88 84L90.5 86.5L94 81.5" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="100" y="82" width="60" height="3" rx="1.5" fill="#92400E" opacity="0.6"/>
        <rect x="100" y="87" width="40" height="2" rx="1" fill="#92400E" opacity="0.4"/>

        {/* Task 3 - unchecked */}
        <rect x="80" y="100" width="100" height="20" rx="4" fill="white" opacity="0.15"/>
        <rect x="86" y="105" width="10" height="10" rx="2" fill="white" opacity="0.3"/>
        <rect x="100" y="108" width="55" height="3" rx="1.5" fill="white" opacity="0.5"/>
        <rect x="100" y="113" width="35" height="2" rx="1" fill="white" opacity="0.3"/>

        {/* Task 4 - unchecked (dashed/empty) */}
        <rect x="80" y="126" width="100" height="20" rx="4" fill="white" opacity="0.08"/>
        <rect x="86" y="131" width="10" height="10" rx="2" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none"/>
        <rect x="100" y="134" width="48" height="3" rx="1.5" fill="white" opacity="0.3"/>

        {/* Bell - top right floating */}
        <circle cx="212" cy="52" r="26" fill="#FCD34D" opacity="0.15"/>
        <path d="M212 30 C212 30 200 38 200 52 L200 62 L224 62 L224 52 C224 38 212 30 212 30Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M206 62 Q212 70 218 62" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
        <circle cx="212" cy="29" r="3" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5"/>
        <circle cx="220" cy="44" r="5" fill="#EF4444"/>
        <text x="218" y="47.5" fontSize="6" fill="white" fontWeight="bold">3</text>

        {/* Clock - bottom right floating */}
        <circle cx="208" cy="152" r="26" fill="#E0F2FE" opacity="0.9"/>
        <circle cx="208" cy="152" r="22" fill="white" stroke="#BAE6FD" strokeWidth="2"/>
        <path d="M208 136 L208 152 L218 158" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="208" cy="152" r="3" fill="#0EA5E9"/>
        {[0,1,2,3].map(i => (
          <line key={i}
            x1={208 + 18 * Math.cos((i * 90 - 90) * Math.PI / 180)}
            y1={152 + 18 * Math.sin((i * 90 - 90) * Math.PI / 180)}
            x2={208 + 20 * Math.cos((i * 90 - 90) * Math.PI / 180)}
            y2={152 + 20 * Math.sin((i * 90 - 90) * Math.PI / 180)}
            stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        ))}

        {/* Decorative dots */}
        <circle cx="60" cy="60" r="3" fill="#FCD34D" opacity="0.6"/>
        <circle cx="220" cy="100" r="4" fill="#818CF8" opacity="0.4"/>
        <circle cx="40" cy="170" r="3" fill="#34D399" opacity="0.5"/>
        <path d="M220 130 L226 124 L232 130 L226 136 Z" fill="#FCD34D" opacity="0.4"/>
        <path d="M45 45 L49 39 L53 45 L49 51 Z" fill="#818CF8" opacity="0.3"/>
      </svg>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      await login(values);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left Column */}
      <div className="hidden flex-col justify-between bg-white border-r border-gray-100 p-10 md:flex">
        <TaskifyLogo />

        <div className="flex flex-col items-start max-w-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 mb-6">
            <span className="text-amber-500">✦</span>
            Stay Organized. Stay Productive.
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            Welcome to <span className="text-primary">Taskify</span>
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-2">
            Your simple and smart task manager<br/>
            to help you plan, track, and achieve<br/>
            more every day.
          </p>
          <ClipboardIllustration />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6Z" stroke="#9CA3AF" strokeWidth="1" fill="none"/>
          </svg>
          Your tasks. Your time. Your way.
        </div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 md:hidden mb-6">
              <TaskifyLogo />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back!</h2>
            <p className="text-sm text-gray-400 mt-1">Login to your account to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your email" className="pl-10 bg-white border-gray-200 focus:border-primary" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <a href="#" className="text-xs font-medium text-primary hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white border-gray-200 focus:border-primary"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-50 px-3 text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
