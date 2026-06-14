import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Lock, Bell, Palette, SlidersHorizontal, Shield, CloudUpload, Puzzle, Info,
  Pencil, Camera, Mail, Calendar, ChevronRight, Eye, EyeOff, Smartphone, Clock,
  Key, Globe, FileText, Trash2, Download, Cloud, CheckCircle2, Sun, Moon, Monitor,
  Check, AlertCircle, ExternalLink, BellRing, CalendarCheck, Lightbulb, Circle,
  AlarmClock, BedDouble, ListTodo, Flag, RefreshCw, LogIn, ChevronDown
} from "lucide-react";

const TABS = [
  { id: "profile",      label: "Profile",           icon: User },
  { id: "account",      label: "Account",           icon: Lock },
  { id: "notifications",label: "Notifications",     icon: Bell },
  { id: "appearance",   label: "Appearance",        icon: Palette },
  { id: "preferences",  label: "Task Preferences",  icon: SlidersHorizontal },
  { id: "privacy",      label: "Privacy & Security",icon: Shield },
  { id: "data",         label: "Data & Export",     icon: CloudUpload },
  { id: "integrations", label: "Integrations",      icon: Puzzle },
  { id: "about",        label: "About",             icon: Info },
];

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  profile:       { title: "Settings",           subtitle: "Manage your account, preferences and more." },
  account:       { title: "Account",            subtitle: "Manage your account settings and security." },
  notifications: { title: "Notifications",      subtitle: "Choose how and when you want to be notified." },
  appearance:    { title: "Appearance",         subtitle: "Customize how Taskify looks and feels for you." },
  preferences:   { title: "Task Preferences",   subtitle: "Customize default settings for your tasks." },
  privacy:       { title: "Privacy & Security", subtitle: "Manage your privacy settings and keep your account secure." },
  data:          { title: "Data & Export",      subtitle: "Manage your data and export it whenever you need." },
  integrations:  { title: "Integrations",       subtitle: "Connect Taskify with the tools you use every day." },
  about:         { title: "About",              subtitle: "Learn more about Taskify." },
};

function IconBox({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      {children}
    </div>
  );
}

function SettingRow({ icon, title, description, right, className = "" }: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  right: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-4 px-0 border-b last:border-b-0 ${className}`}>
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">{right}</div>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-4 py-3 mt-4">
      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-blue-700">{children}</p>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
          <p className="text-sm text-gray-500 mt-0.5">Update your profile information and how others see you.</p>
        </div>
        <Button variant="outline" className="text-sm h-9 gap-2 flex-shrink-0">
          <Pencil className="h-3.5 w-3.5" /> Edit Profile
        </Button>
      </div>

      <div className="px-6 py-5 flex items-center gap-5 border-b border-gray-100">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback className="text-2xl bg-amber-100 text-amber-800">{user?.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm">
            <Camera className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
          {user?.jobTitle && <p className="text-sm text-gray-500">{user.jobTitle}</p>}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-600">{user?.email}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-gray-600">Joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input defaultValue={user?.name || ""} placeholder="Your Name" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input defaultValue={user?.email || ""} placeholder="Email Address" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Job Title</Label>
            <Input defaultValue={user?.jobTitle || ""} placeholder="Job Title" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Timezone</Label>
            <Select defaultValue={user?.timezone || "utc"}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-kolkata">(GMT+05:30) Asia/Kolkata</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="america-new_york">(GMT-05:00) Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
            <Input defaultValue={user?.phone || ""} placeholder="Phone Number" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Language</Label>
            <Select defaultValue={user?.language || "en"}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Bio</Label>
          <Textarea
            defaultValue={user?.bio || ""}
            placeholder="Tell us about yourself..."
            className="resize-none h-24"
          />
        </div>

        <Button className="mt-5 bg-amber-400 hover:bg-amber-500 text-black font-semibold h-10 px-6">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* ─── ACCOUNT TAB ─── */
function AccountTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Account Information</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Email Address</Label>
              <div className="relative">
                <Input defaultValue={user?.email || ""} className="h-10 pr-10" readOnly />
                <Mail className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input type="password" defaultValue="********" className="h-10 pr-10" readOnly />
                  <Lock className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                </div>
                <Button variant="outline" className="h-10 px-4 text-sm flex-shrink-0">Change Password</Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Account Type</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Free Plan</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">You're using the free plan. Upgrade for more features.</p>
              </div>
            </div>
            <Button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold flex-shrink-0">Upgrade Plan</Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <span className="inline-flex items-center mt-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Security</h2>
          <p className="text-sm text-gray-500 mt-0.5">Keep your account secure.</p>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          <SettingRow
            icon={<IconBox bg="bg-blue-100"><Shield className="h-5 w-5 text-blue-600" /></IconBox>}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
            right={<><span className="text-sm text-gray-500">Off</span><Button variant="outline" className="h-9 text-sm">Enable</Button></>}
          />
          <SettingRow
            icon={<IconBox bg="bg-blue-100"><Smartphone className="h-5 w-5 text-blue-600" /></IconBox>}
            title="Active Sessions"
            description="Manage your active sessions across devices."
            right={<><span className="text-sm font-medium text-green-600">3 Active</span><ChevronRight className="h-4 w-4 text-gray-400" /></>}
          />
          <SettingRow
            icon={<IconBox bg="bg-amber-100"><Clock className="h-5 w-5 text-amber-600" /></IconBox>}
            title="Login Activity"
            description="View your recent login activity."
            right={<ChevronRight className="h-4 w-4 text-gray-400" />}
          />
          <SettingRow
            icon={<IconBox bg="bg-red-100"><Trash2 className="h-5 w-5 text-red-600" /></IconBox>}
            title="Delete Account"
            description="Permanently delete your account and all data."
            right={<Button variant="destructive" className="h-9 text-sm">Delete Account</Button>}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── NOTIFICATIONS TAB ─── */
function NotificationsTab() {
  const [quietMode, setQuietMode] = useState(true);

  const notifications = [
    { id: "reminders", label: "Task Reminders",       desc: "Get reminded about tasks before their due time.",   icon: <BellRing className="h-5 w-5 text-green-600" />,  bg: "bg-green-100",  defaultOn: true },
    { id: "due",       label: "Due Date Alerts",       desc: "Receive alerts for tasks due today or tomorrow.",   icon: <CalendarCheck className="h-5 w-5 text-blue-600" />, bg: "bg-blue-100", defaultOn: true },
    { id: "daily",     label: "Daily Summary",         desc: "Get a summary of your tasks every day.",            icon: <Lightbulb className="h-5 w-5 text-amber-600" />,  bg: "bg-amber-100",  defaultOn: true },
    { id: "completed", label: "Completed Task Alerts", desc: "Get notified when you complete a task.",            icon: <CheckCircle2 className="h-5 w-5 text-green-600" />, bg: "bg-green-100", defaultOn: true },
    { id: "overdue",   label: "Overdue Task Alerts",   desc: "Get notified about tasks that are overdue.",        icon: <AlarmClock className="h-5 w-5 text-red-600" />,  bg: "bg-red-100",    defaultOn: true },
    { id: "quiet",     label: "Quiet Mode",            desc: "Pause all non-urgent notifications during quiet hours.", icon: <BedDouble className="h-5 w-5 text-gray-600" />, bg: "bg-gray-100", defaultOn: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage the notifications you want to receive in Taskify.</p>
      </div>
      <div className="px-6 divide-y divide-gray-100">
        {notifications.map((item) => (
          <div key={item.id}>
            <SettingRow
              icon={<IconBox bg={item.bg}>{item.icon}</IconBox>}
              title={item.label}
              description={item.desc}
              right={
                <Switch
                  defaultChecked={item.defaultOn}
                  onCheckedChange={item.id === "quiet" ? setQuietMode : undefined}
                  className="data-[state=checked]:bg-amber-400"
                />
              }
            />
            {item.id === "quiet" && quietMode && (
              <div className="pb-4 pl-14 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">From</span>
                  <Select defaultValue="22:00">
                    <SelectTrigger className="h-9 w-32 text-sm">
                      <Moon className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="22:00">10:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                      <SelectItem value="23:00">11:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">To</span>
                  <Select defaultValue="07:00">
                    <SelectTrigger className="h-9 w-32 text-sm">
                      <Sun className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07:00">07:00 AM</SelectItem>
                      <SelectItem value="06:00">06:00 AM</SelectItem>
                      <SelectItem value="08:00">08:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Timezone</span>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger className="h-9 w-48 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">(GMT+05:30) Asia/Kolkata</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="px-6 pb-5">
        <InfoBanner>During quiet hours, only important alerts like overdue tasks will be sent.</InfoBanner>
      </div>
    </div>
  );
}

/* ─── APPEARANCE TAB ─── */
function AppearanceTab() {
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [selectedColor, setSelectedColor] = useState(0);
  const [fontSz, setFontSz] = useState([50]);

  const themes = [
    { id: "Light",  icon: <Sun className="h-10 w-10 text-amber-500" />,  desc: "Light theme for a bright and clear experience." },
    { id: "Dark",   icon: <Moon className="h-10 w-10 text-gray-600" />,  desc: "Dark theme for low light environments." },
    { id: "System", icon: <Monitor className="h-10 w-10 text-gray-500" />, desc: "Automatically switch based on your system settings." },
  ];

  const colors = [
    { bg: "bg-amber-400",  ring: "ring-amber-400" },
    { bg: "bg-purple-500", ring: "ring-purple-500" },
    { bg: "bg-blue-500",   ring: "ring-blue-500" },
    { bg: "bg-green-500",  ring: "ring-green-500" },
    { bg: "bg-rose-500",   ring: "ring-rose-500" },
    { bg: "bg-pink-500",   ring: "ring-pink-500" },
    { bg: "bg-teal-500",   ring: "ring-teal-500" },
    { bg: "bg-orange-400", ring: "ring-orange-400" },
  ];

  const fontLabel = fontSz[0] < 33 ? "Small" : fontSz[0] < 66 ? "Medium" : "Large";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Theme</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose your preferred mode.</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${selectedTheme === t.id ? "border-amber-400" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className={`absolute top-3 right-3 h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedTheme === t.id ? "border-amber-400 bg-amber-400" : "border-gray-300"}`}>
                {selectedTheme === t.id && <Circle className="h-2 w-2 text-white fill-white" />}
              </div>
              <div className="mb-3">{t.icon}</div>
              <p className="font-semibold text-sm text-gray-900">{t.id}</p>
              <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Accent Color</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose a color that represents you.</p>
        <div className="flex gap-3 mt-4">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(i)}
              className={`h-9 w-9 rounded-full ${c.bg} flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === i ? `ring-2 ring-offset-2 ${c.ring}` : ""}`}
            >
              {selectedColor === i && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Font Size</h2>
            <p className="text-sm text-gray-500 mt-0.5">Adjust the font size for better readability.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preview</p>
            <p className="text-sm text-gray-900 mt-0.5">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs font-medium text-gray-500">A</span>
          <Slider
            value={fontSz}
            onValueChange={setFontSz}
            min={0}
            max={100}
            step={1}
            className="flex-1 [&_[role=slider]]:bg-amber-400 [&_.relative]:bg-amber-400"
          />
          <span className="text-lg font-medium text-gray-500">A</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">{fontLabel}</p>
      </div>

      <div className="px-6 divide-y divide-gray-100">
        <SettingRow
          icon={<></>}
          title="Compact Mode"
          description="Show more content in less space."
          right={<Switch className="data-[state=checked]:bg-amber-400" />}
        />
        <SettingRow
          icon={<></>}
          title="Reduce Motion"
          description="Reduce animations and transitions across the app."
          right={<Switch className="data-[state=checked]:bg-amber-400" />}
        />
      </div>
    </div>
  );
}

/* ─── TASK PREFERENCES TAB ─── */
function PreferencesTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {[
          {
            label: "Default Task View",
            desc: "Choose the default view when you open My Tasks.",
            control: (
              <Select defaultValue="list">
                <SelectTrigger className="w-44 h-9">
                  <ListTodo className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="board">Board View</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
          {
            label: "Default Due Date",
            desc: "Set a default due date when creating a new task.",
            control: (
              <Select defaultValue="none">
                <SelectTrigger className="w-44 h-9">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Due Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
          {
            label: "Default Priority",
            desc: "Set a default priority level for new tasks.",
            control: (
              <Select defaultValue="medium">
                <SelectTrigger className="w-44 h-9">
                  <Flag className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
          {
            label: "Default Reminder",
            desc: "Set a default reminder for tasks.",
            control: (
              <Select defaultValue="none">
                <SelectTrigger className="w-44 h-9">
                  <Bell className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Reminder</SelectItem>
                  <SelectItem value="10m">10 min before</SelectItem>
                  <SelectItem value="1h">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            ),
          },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            {item.control}
          </div>
        ))}

        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Auto Add Tasks to Today</p>
            <p className="text-sm text-gray-500 mt-0.5">Automatically add tasks with today's date to your Today list.</p>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-amber-400" />
        </div>

        <div className="px-6 py-4">
          <p className="text-sm font-medium text-gray-900">Mark Completed On</p>
          <p className="text-sm text-gray-500 mt-0.5">Choose when a task should be marked as completed.</p>
          <RadioGroup defaultValue="manual" className="mt-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="manual" id="manual" className="text-amber-500 border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400" />
              <Label htmlFor="manual" className="text-sm font-normal text-gray-700 cursor-pointer">When I manually mark it as completed</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="due" id="due" className="text-amber-500 border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:border-amber-400" />
              <Label htmlFor="due" className="text-sm font-normal text-gray-700 cursor-pointer">When the due date passes</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Show Completed Tasks</p>
            <p className="text-sm text-gray-500 mt-0.5">Choose how you want to see completed tasks.</p>
          </div>
          <Select defaultValue="hide">
            <SelectTrigger className="w-48 h-9">
              <EyeOff className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hide">Hide from all views</SelectItem>
              <SelectItem value="bottom">Move to bottom</SelectItem>
              <SelectItem value="inline">Keep inline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-6 pb-5">
        <InfoBanner>These preferences will be applied to all your tasks.</InfoBanner>
      </div>
    </div>
  );
}

/* ─── PRIVACY & SECURITY TAB ─── */
function PrivacyTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 pt-5 pb-1">
        <h3 className="text-base font-semibold text-gray-900">Privacy</h3>
      </div>
      <div className="px-6 divide-y divide-gray-100">
        <SettingRow
          icon={<IconBox bg="bg-gray-100"><EyeOff className="h-5 w-5 text-gray-600" /></IconBox>}
          title="Hide Completed Tasks"
          description="Completed tasks will be hidden from your main views."
          right={<Switch defaultChecked className="data-[state=checked]:bg-amber-400" />}
        />
        <SettingRow
          icon={<IconBox bg="bg-blue-100"><Lock className="h-5 w-5 text-blue-600" /></IconBox>}
          title="Keep Tasks Private"
          description="Tasks are only visible to you and not accessible by anyone else."
          right={<Switch defaultChecked className="data-[state=checked]:bg-amber-400" />}
        />
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <IconBox bg="bg-purple-100"><Lock className="h-5 w-5 text-purple-600" /></IconBox>
            <div>
              <p className="text-sm font-medium text-gray-900">Lock App on Inactivity</p>
              <p className="text-sm text-gray-500 mt-0.5">Require authentication after a period of inactivity.</p>
            </div>
          </div>
          <Select defaultValue="15m">
            <SelectTrigger className="w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-6 pt-4 pb-1 border-t border-gray-100 mt-1">
        <h3 className="text-base font-semibold text-gray-900">Security</h3>
      </div>
      <div className="px-6 divide-y divide-gray-100">
        <SettingRow
          icon={<IconBox bg="bg-amber-100"><Lock className="h-5 w-5 text-amber-600" /></IconBox>}
          title="Change Password"
          description="Update your account password regularly."
          right={<Button variant="outline" className="h-9 text-sm">Change Password</Button>}
        />
        <SettingRow
          icon={<IconBox bg="bg-blue-100"><Smartphone className="h-5 w-5 text-blue-600" /></IconBox>}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account."
          right={<><span className="text-sm text-gray-500">Off</span><Button variant="outline" className="h-9 text-sm">Enable</Button></>}
        />
        <SettingRow
          icon={<IconBox bg="bg-green-100"><Key className="h-5 w-5 text-green-600" /></IconBox>}
          title="Active Sessions"
          description="Manage devices where you're currently signed in."
          right={<><span className="text-sm font-medium text-green-600">2 Active</span><ChevronRight className="h-4 w-4 text-gray-400" /></>}
        />
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Privacy Policy</p>
          <p className="text-sm text-gray-500 mt-0.5">Read our privacy policy to understand how we handle your data.</p>
        </div>
        <Button variant="outline" className="h-9 text-sm gap-2">View Policy <ExternalLink className="h-3.5 w-3.5" /></Button>
      </div>

      <div className="px-6 pb-5">
        <InfoBanner>Your data is never sold to third parties. We respect your privacy.</InfoBanner>
      </div>
    </div>
  );
}

/* ─── DATA & EXPORT TAB ─── */
function DataTab() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Export Data</h2>
          <p className="text-sm text-gray-500 mt-0.5">Download a copy of your data. You can export all your tasks and settings.</p>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          <SettingRow
            icon={<IconBox bg="bg-purple-100"><FileText className="h-5 w-5 text-purple-600" /></IconBox>}
            title="Export All Data"
            description="Includes all tasks, categories, priorities, reminders and settings."
            right={<Button variant="outline" className="h-9 text-sm gap-2"><Download className="h-3.5 w-3.5" /> Export Data</Button>}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Backup</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create a backup of your data to keep it safe and secure.</p>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          <SettingRow
            icon={<IconBox bg="bg-green-100"><Cloud className="h-5 w-5 text-green-600" /></IconBox>}
            title="Create Backup"
            description="Your data will be backed up and stored securely."
            right={<Button variant="outline" className="h-9 text-sm gap-2"><RefreshCw className="h-3.5 w-3.5" /> Create Backup</Button>}
          />
          <SettingRow
            icon={<IconBox bg="bg-blue-100"><Clock className="h-5 w-5 text-blue-600" /></IconBox>}
            title="Last Backup"
            description="May 12, 2024 at 10:45 PM"
            right={<span className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Up to date</span>}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Clear Data</h2>
          <p className="text-sm text-gray-500 mt-0.5">Permanently delete your data. This action cannot be undone.</p>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          <SettingRow
            icon={<IconBox bg="bg-red-100"><Trash2 className="h-5 w-5 text-red-600" /></IconBox>}
            title="Clear All Data"
            description="This will delete all your tasks, categories and settings."
            right={<Button variant="destructive" className="h-9 text-sm">Clear Data</Button>}
          />
        </div>
        <div className="px-6 pb-5">
          <InfoBanner>Your data is stored locally and is never shared with third parties.</InfoBanner>
        </div>
      </div>
    </div>
  );
}

/* ─── INTEGRATIONS TAB ─── */
function IntegrationsTab() {
  const integrations = [
    {
      name: "Google Calendar",
      desc: "Sync your tasks and due dates with Google Calendar.",
      connected: true,
      icon: (
        <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-blue-600">31</span>
        </div>
      ),
    },
    {
      name: "Apple Calendar",
      desc: "Sync your tasks and due dates with Apple Calendar.",
      connected: true,
      icon: (
        <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">22</span>
        </div>
      ),
    },
    {
      name: "Google Tasks",
      desc: "Import tasks from Google Tasks into Taskify.",
      connected: true,
      icon: (
        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Check className="h-5 w-5 text-white" strokeWidth={3} />
        </div>
      ),
    },
    {
      name: "Notion",
      desc: "Export your tasks and lists to Notion.",
      connected: false,
      icon: (
        <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center">
          <span className="text-white text-sm font-bold italic">N</span>
        </div>
      ),
    },
    {
      name: "Todoist",
      desc: "Import tasks from Todoist into Taskify.",
      connected: false,
      icon: (
        <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Connected Integrations</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your connected accounts and services.</p>
      </div>
      <div className="px-6 divide-y divide-gray-100">
        {integrations.map((item) => (
          <div key={item.name} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              {item.connected ? (
                <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                  <Circle className="h-3.5 w-3.5" /> Not Connected
                </span>
              )}
              <Button variant="outline" className="h-9 text-sm">
                {item.connected ? "Manage" : "Connect"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-6 mb-5 mt-2 rounded-xl bg-blue-50 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900">About Integrations</p>
          <p className="text-sm text-gray-500 mt-0.5">Your data is always secure. We never post or edit anything without your permission.</p>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
            Learn more <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT TAB ─── */
function AboutTab() {
  const rows = [
    { icon: <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar className="h-4 w-4 text-blue-600" /></div>, label: "Build", value: "May 12, 2024", chevron: true },
    { icon: <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center"><Globe className="h-4 w-4 text-blue-600" /></div>, label: "Version", value: "1.0.0", chevron: true },
    { icon: <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center"><Globe className="h-4 w-4 text-green-600" /></div>, label: "Website", value: "www.taskify.app", link: true, external: true },
    { icon: <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center"><Mail className="h-4 w-4 text-amber-600" /></div>, label: "Support", value: "support@taskify.app", link: true, external: true },
    { icon: <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center"><FileText className="h-4 w-4 text-gray-600" /></div>, label: "Terms of Service", value: "Read our terms and conditions.", external: true },
    { icon: <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center"><Shield className="h-4 w-4 text-red-600" /></div>, label: "Privacy Policy", value: "Learn how we protect your data.", external: true },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-amber-400 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-white fill-none stroke-white stroke-2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Taskify</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">v1.0.0</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Taskify is a simple and powerful task management app that helps you stay organized, focused, and productive every day.
          </p>
        </div>
      </div>

      <div className="px-6 divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              {row.icon}
              <div>
                <p className="text-sm font-medium text-gray-900">{row.label}</p>
                {row.link ? (
                  <a href="#" className="text-sm text-blue-500 hover:underline">{row.value}</a>
                ) : (
                  <p className="text-sm text-gray-500">{row.value}</p>
                )}
              </div>
            </div>
            {row.chevron && <ChevronRight className="h-4 w-4 text-gray-400" />}
            {row.external && !row.chevron && <ExternalLink className="h-4 w-4 text-gray-400" />}
          </div>
        ))}
      </div>

      <div className="mx-6 mb-5 mt-3 rounded-xl bg-purple-50 px-5 py-4 flex items-center gap-3">
        <span className="text-xl">💜</span>
        <div>
          <p className="text-sm font-medium text-gray-900">Made with <span className="text-red-500">❤️</span> to help you get things done.</p>
          <p className="text-sm text-gray-500">Thank you for choosing Taskify!</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN SETTINGS PAGE ─── */
export default function Settings() {
  const [match, params] = useRoute("/settings/:tab");
  const currentTab = params?.tab || "profile";
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const page = PAGE_TITLES[currentTab] || PAGE_TITLES.profile;

  return (
    <AppLayout title={page.title} subtitle={page.subtitle}>
      <div className="flex gap-6 items-start">
        {/* Settings Nav Sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="flex flex-col gap-0.5">
            {TABS.map((tab) => {
              const active = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLocation(`/settings/${tab.id}`)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full ${
                    active
                      ? "bg-amber-50 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-amber-600" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {currentTab === "profile"       && <ProfileTab user={user} />}
          {currentTab === "account"       && <AccountTab user={user} />}
          {currentTab === "notifications" && <NotificationsTab />}
          {currentTab === "appearance"    && <AppearanceTab />}
          {currentTab === "preferences"   && <PreferencesTab />}
          {currentTab === "privacy"       && <PrivacyTab />}
          {currentTab === "data"          && <DataTab />}
          {currentTab === "integrations"  && <IntegrationsTab />}
          {currentTab === "about"         && <AboutTab />}
        </div>
      </div>
    </AppLayout>
  );
}
