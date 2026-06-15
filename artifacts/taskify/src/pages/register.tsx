import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
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

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." }),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function TaskifyLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent">
        <img src="/logo.png" alt="Taskify Logo" className="h-full w-full object-contain" />
      </div>
      <span className="text-xl font-bold tracking-tight">Taskify</span>
    </div>
  );
}

function AppMockupIllustration() {
  return (
    <div className="relative w-full flex items-end justify-center mt-4">
      {/* Green plant on left */}
      <svg className="absolute left-0 bottom-0 z-10" width="52" height="80" viewBox="0 0 52 80" fill="none">
        <rect x="20" y="60" width="12" height="20" rx="4" fill="#D97706" opacity="0.8"/>
        <ellipse cx="16" cy="46" rx="14" ry="10" fill="#22C55E" transform="rotate(-20 16 46)"/>
        <ellipse cx="36" cy="40" rx="14" ry="10" fill="#16A34A" transform="rotate(15 36 40)"/>
        <ellipse cx="26" cy="34" rx="12" ry="9" fill="#4ADE80" transform="rotate(-5 26 34)"/>
        <line x1="26" y1="60" x2="26" y2="38" stroke="#15803D" strokeWidth="2"/>
      </svg>

      {/* Browser window mockup */}
      <div className="relative mx-8 w-full max-w-[240px] rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"/>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
          <div className="flex-1 mx-2 bg-gray-600 rounded text-[6px] text-gray-300 px-2 py-0.5">taskify.app</div>
        </div>
        {/* App content */}
        <div className="bg-gray-50 p-3">
          <div className="text-[8px] font-bold text-gray-800 mb-2">My Tasks</div>
          {/* Task items */}
          {[
            { text: "Design landing page", done: true },
            { text: "Complete project report", done: true },
            { text: "Buy groceries", done: false },
            { text: "Read a book", done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? "bg-yellow-400" : "border border-gray-300"}`}>
                {task.done && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-[7px] ${task.done ? "line-through text-gray-400" : "text-gray-700"}`}>{task.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini calendar widget - right overlapping */}
      <div className="absolute right-0 bottom-4 z-10 bg-white rounded-xl border border-gray-200 shadow-lg p-2 w-[90px]">
        <div className="text-[6px] font-bold text-gray-700 mb-1 text-center">May 2024</div>
        <div className="grid grid-cols-7 gap-0.5">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="text-[5px] text-center text-gray-400 font-medium">{d}</div>
          ))}
          {[...Array(31)].map((_, i) => (
            <div key={i} className={`text-[5px] text-center rounded ${i + 1 === 15 ? "bg-yellow-400 text-black font-bold" : "text-gray-500"}`}>
              {i + 1}
            </div>
          ))}
        </div>
        {/* Yellow sticky note */}
        <div className="absolute -right-3 -top-3 w-8 h-8 bg-yellow-300 rounded shadow rotate-3 flex items-center justify-center">
          <div className="w-4 h-0.5 bg-yellow-600 rounded mb-0.5"/>
          <div className="w-3 h-0.5 bg-yellow-600 rounded"/>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const watchPassword = form.watch("password");
  const hasMinLength = (watchPassword?.length ?? 0) >= 8;
  const hasNumber = /[0-9]/.test(watchPassword || "");
  const hasUppercase = /[A-Z]/.test(watchPassword || "");

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setIsLoading(true);
      await register({ name: values.name, email: values.email, password: values.password });
      toast({ title: "Account created!", description: "Welcome to Taskify." });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const features = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="1" width="10" height="13" rx="2" stroke="#92400E" strokeWidth="1.2"/>
          <path d="M5 5H11M5 8H9" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round"/>
          <rect x="5" y="1" width="6" height="2.5" rx="1" fill="#FCD34D"/>
        </svg>
      ),
      bg: "bg-amber-100",
      title: "Plan your day",
      desc: "Organize tasks and manage your time better.",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="10" width="3" height="5" rx="1" fill="#7C3AED"/>
          <rect x="6.5" y="7" width="3" height="8" rx="1" fill="#A78BFA"/>
          <rect x="11" y="4" width="3" height="11" rx="1" fill="#6D28D9"/>
          <path d="M2 10 Q6 4 11 4" stroke="#7C3AED" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      bg: "bg-purple-100",
      title: "Track progress",
      desc: "Stay on top of your goals and deadlines.",
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6Z" fill="#22C55E" opacity="0.3" stroke="#16A34A" strokeWidth="1"/>
          <path d="M5.5 8L7 9.5L10.5 6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: "bg-green-100",
      title: "Secure & private",
      desc: "Your data is safe with us.",
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left Column */}
      <div className="hidden flex-col justify-between bg-white border-r border-gray-100 p-10 md:flex overflow-hidden">
        <TaskifyLogo />

        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 mb-5 w-fit">
            <span className="text-amber-500">✦</span>
            Get organized. Stay productive.
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight">
            Create your account<br/>
            and <span className="text-primary">get started</span>
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Join Taskify today and take control of your tasks.<br/>
            It's free and easy to get started.
          </p>

          <div className="space-y-3 mb-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${f.bg}`}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <AppMockupIllustration />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 md:hidden mb-6">
              <TaskifyLogo />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1">Sign up to continue to Taskify</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your full name" className="pl-10 bg-white border-gray-200" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Enter your email" className="pl-10 bg-white border-gray-200" {...field} />
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
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-white border-gray-200"
                          {...field}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 bg-white border-gray-200"
                          {...field}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5 text-xs">
                {[
                  { ok: hasMinLength, text: "At least 8 characters" },
                  { ok: hasNumber, text: "Includes a number" },
                  { ok: hasUppercase, text: "Includes an uppercase letter" },
                ].map(({ ok, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "border border-gray-300"}`}>
                      {ok && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <span className={ok ? "text-green-600 font-medium" : "text-gray-400"}>{text}</span>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full h-11 font-semibold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
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

          <button type="button" className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" disabled>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
