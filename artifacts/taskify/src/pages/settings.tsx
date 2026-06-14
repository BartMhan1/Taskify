import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";
import {
  User, Lock, Palette, Camera, Mail, Calendar, Circle, Sun, Moon, Monitor, Check
} from "lucide-react";

const TABS = [
  { id: "profile",      label: "Profile",           icon: User },
  { id: "account",      label: "Account",           icon: Lock },
  { id: "appearance",   label: "Appearance",        icon: Palette },
];

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  profile:       { title: "Settings",           subtitle: "Manage your account, preferences and more." },
  account:       { title: "Account",            subtitle: "Manage your account settings and security." },
  appearance:    { title: "Appearance",         subtitle: "Customize how Taskify looks and feels for you." },
};

function ProfileTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    jobTitle: user?.jobTitle || "",
    timezone: user?.timezone || "utc",
    phone: user?.phone || "",
    language: user?.language || "en",
    bio: user?.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to update profile");
      
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile updated successfully!" });
    } catch (err) {
      toast({ title: "Error updating profile", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
          <p className="text-sm text-gray-500 mt-0.5">Update your profile information and how others see you.</p>
        </div>
      </div>

      <div className="px-6 py-5 flex items-center gap-5 border-b border-gray-100 dark:border-zinc-800">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback className="text-2xl bg-amber-100 text-amber-800">{user?.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{user?.name}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Full Name</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
              className="h-10" 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Job Title</Label>
            <Input 
              value={formData.jobTitle} 
              onChange={e => setFormData(p => ({ ...p, jobTitle: e.target.value }))} 
              className="h-10" 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Timezone</Label>
            <Select value={formData.timezone} onValueChange={v => setFormData(p => ({ ...p, timezone: v }))}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-kolkata">(GMT+05:30) Asia/Kolkata</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="america-new_york">(GMT-05:00) Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Phone Number</Label>
            <Input 
              value={formData.phone} 
              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} 
              className="h-10" 
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label className="text-sm font-medium">Bio</Label>
          <Textarea
            value={formData.bio}
            onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
            className="resize-none h-24"
          />
        </div>

        <Button disabled={isLoading} type="submit" className="mt-5 bg-amber-400 hover:bg-amber-500 text-black font-semibold h-10 px-6">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function AccountTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Account Information</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Input defaultValue={user?.email || ""} className="h-10 pr-10" readOnly disabled />
                <Mail className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light",  icon: <Sun className="h-10 w-10 text-amber-500" />,  desc: "Light theme for a bright and clear experience." },
    { id: "dark",   icon: <Moon className="h-10 w-10 text-gray-600" />,  desc: "Dark theme for low light environments." },
    { id: "system", icon: <Monitor className="h-10 w-10 text-gray-500" />, desc: "Automatically switch based on your system settings." },
  ] as const;

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Theme</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose your preferred mode.</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${theme === t.id ? "border-amber-400 bg-amber-50/30 dark:bg-amber-950/20" : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"}`}
            >
              <div className={`absolute top-3 right-3 h-4 w-4 rounded-full border-2 flex items-center justify-center ${theme === t.id ? "border-amber-400 bg-amber-400" : "border-gray-300 dark:border-zinc-700"}`}>
                {theme === t.id && <Circle className="h-2 w-2 text-white fill-white" />}
              </div>
              <div className="mb-3">{t.icon}</div>
              <p className="font-semibold text-sm capitalize text-gray-900 dark:text-gray-100">{t.id}</p>
              <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [match, params] = useRoute("/settings/:tab");
  const currentTab = params?.tab || "profile";
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const page = PAGE_TITLES[currentTab] || PAGE_TITLES.profile;

  return (
    <AppLayout title={page.title} subtitle={page.subtitle}>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-44 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const active = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLocation(`/settings/${tab.id}`)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left whitespace-nowrap ${
                    active
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-amber-600 dark:text-amber-500" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 min-w-0 w-full">
          {currentTab === "profile"    && <ProfileTab user={user} />}
          {currentTab === "account"    && <AccountTab user={user} />}
          {currentTab === "appearance" && <AppearanceTab />}
        </div>
      </div>
    </AppLayout>
  );
}
