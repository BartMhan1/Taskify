import { useRoute, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Bell, Paintbrush, Sliders, Shield, Database, Blocks, Info, CheckSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Paintbrush },
  { id: "preferences", label: "Task Preferences", icon: Sliders },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "data", label: "Data & Export", icon: Database },
  { id: "integrations", label: "Integrations", icon: Blocks },
  { id: "about", label: "About", icon: Info },
];

export default function Settings() {
  const [match, params] = useRoute("/settings/:tab");
  const currentTab = params?.tab || "profile";
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <AppLayout title="Settings" subtitle="Manage your account preferences and application settings.">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {TABS.map((tab) => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLocation(`/settings/${tab.id}`)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl">
          {currentTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatarUrl || ""} />
                    <AvatarFallback className="text-xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={user?.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input defaultValue={user?.email || ""} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input defaultValue={user?.jobTitle || ""} placeholder="e.g. Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input defaultValue={user?.timezone || "UTC"} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue={user?.phone || ""} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue={user?.language || "en"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea defaultValue={user?.bio || ""} placeholder="A short bio about yourself..." />
                </div>
                
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {currentTab === "account" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Manage your account status and subscription.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground mt-1">Free Plan</p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Member Since</Label>
                      <p className="font-medium mt-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs uppercase tracking-wider">Account Status</Label>
                      <p className="font-medium mt-1 text-green-600">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication (2FA)</p>
                      <p className="text-sm text-muted-foreground mt-1">Off</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-muted-foreground mt-1">Manage devices where you're logged in</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: "reminders", label: "Task Reminders", desc: "Get notified when a task is due soon." },
                    { id: "due", label: "Due Date Alerts", desc: "Receive alerts on the day tasks are due." },
                    { id: "daily", label: "Daily Summary", desc: "Receive a daily summary of your tasks." },
                    { id: "completed", label: "Completed Task Alerts", desc: "Get a notification when you complete a task." },
                    { id: "overdue", label: "Overdue Task Alerts", desc: "Get notified when a task becomes overdue." },
                    { id: "quiet", label: "Quiet Mode", desc: "Pause all non-critical notifications." },
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-base font-medium">{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                        {item.id === "quiet" && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-muted-foreground">From</span>
                            <Select defaultValue="22:00"><SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="22:00">10:00 PM</SelectItem></SelectContent></Select>
                            <span className="text-xs text-muted-foreground">To</span>
                            <Select defaultValue="07:00"><SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="07:00">07:00 AM</SelectItem></SelectContent></Select>
                          </div>
                        )}
                      </div>
                      <Switch defaultChecked={item.id !== "quiet"} />
                    </div>
                  ))}
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}
          
          {currentTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Taskify looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-base">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Light', 'Dark', 'System'].map(theme => (
                      <div key={theme} className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${theme === 'Light' ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'}`}>
                        <div className={`h-16 w-full rounded-md ${theme === 'Light' ? 'bg-white border' : theme === 'Dark' ? 'bg-slate-900 border border-slate-700' : 'bg-gradient-to-r from-white to-slate-900 border'}`}></div>
                        <span className="text-sm font-medium">{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Accent Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { color: "bg-amber-400", active: true },
                      { color: "bg-blue-500", active: false },
                      { color: "bg-green-500", active: false },
                      { color: "bg-purple-500", active: false },
                      { color: "bg-rose-500", active: false },
                      { color: "bg-orange-500", active: false },
                      { color: "bg-teal-500", active: false },
                      { color: "bg-slate-800", active: false },
                    ].map((item, i) => (
                      <div key={i} className={`h-10 w-10 rounded-full cursor-pointer flex items-center justify-center ${item.color} ${item.active ? 'ring-2 ring-offset-2 ring-primary' : 'hover:scale-110 transition-transform'}`}>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce padding and margins to fit more content on screen.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Task Preferences</CardTitle>
                <CardDescription>Configure how tasks behave by default.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Task View</Label>
                    <Select defaultValue="list">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="board">Board View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Due Date</Label>
                    <Select defaultValue="today">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Reminder</Label>
                    <Select defaultValue="10m">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="10m">10 min before</SelectItem>
                        <SelectItem value="1h">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Show Completed Tasks</Label>
                    <Select defaultValue="bottom">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hide">Hide entirely</SelectItem>
                        <SelectItem value="bottom">Move to bottom</SelectItem>
                        <SelectItem value="inline">Keep inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Auto Add Tasks to Today</Label>
                      <p className="text-sm text-muted-foreground">Automatically add overdue tasks to Today's view.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-base">Mark Completed On</Label>
                  <RadioGroup defaultValue="manual" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="font-normal">Manual completion only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="due" id="due" />
                      <Label htmlFor="due" className="font-normal">Automatically when due date passes</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {currentTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your privacy settings and security options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Keep Tasks Private</Label>
                      <p className="text-sm text-muted-foreground">Ensure tasks cannot be shared via public links.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Hide Completed Tasks</Label>
                      <p className="text-sm text-muted-foreground">Hide completed task titles for extra privacy.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-base">Lock App on Inactivity</Label>
                      <Select defaultValue="15m">
                        <SelectTrigger className="w-[180px] h-8 mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="5m">After 5 minutes</SelectItem>
                          <SelectItem value="15m">After 15 minutes</SelectItem>
                          <SelectItem value="1h">After 1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <h3 className="font-semibold text-lg">Security Actions</h3>
                  <div className="flex gap-4 flex-wrap">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Manage 2FA</Button>
                  </div>
                </div>
                
                <div className="pt-4 text-sm text-muted-foreground">
                  Read our full <a href="#" className="text-primary hover:underline">Privacy Policy</a> to learn how we protect your data.
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "data" && (
            <Card>
              <CardHeader>
                <CardTitle>Data & Export</CardTitle>
                <CardDescription>Download your data or clear your account information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mb-6">
                  Your data is securely stored on our servers. You have full rights to export your data at any time in machine-readable formats.
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-base">Export All Data</p>
                      <p className="text-sm text-muted-foreground mt-1">Download all your tasks, settings, and profile info as JSON/CSV.</p>
                    </div>
                    <Button variant="outline">Export Data</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-base">Create Backup</p>
                      <p className="text-sm text-muted-foreground mt-1">Last backup: Never</p>
                    </div>
                    <Button variant="outline">Create Backup</Button>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t space-y-4">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <p className="font-medium text-destructive">Clear All Data</p>
                      <p className="text-sm text-muted-foreground mt-1">Deletes all tasks and history. This action cannot be undone.</p>
                    </div>
                    <Button variant="destructive">Clear Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect Taskify with your favorite tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mb-6">
                  Connect third-party services to sync your tasks, calendar events, and productivity tools automatically.
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Google Calendar", status: "Connected", desc: "Sync your tasks with your Google Calendar." },
                    { name: "Apple Calendar", status: "Connected", desc: "Sync your tasks with Apple Calendar." },
                    { name: "Google Tasks", status: "Connected", desc: "Two-way sync with Google Tasks." },
                    { name: "Notion", status: "Not Connected", desc: "Import and export tasks to Notion databases." },
                    { name: "Todoist", status: "Not Connected", desc: "Import your existing Todoist tasks." },
                  ].map((integration, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center font-bold text-muted-foreground">
                          {integration.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-base flex items-center gap-2">
                            {integration.name}
                            {integration.status === "Connected" && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Connected</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{integration.desc}</p>
                        </div>
                      </div>
                      <Button variant={integration.status === "Connected" ? "outline" : "default"}>
                        {integration.status === "Connected" ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "about" && (
            <Card>
              <CardContent className="p-12 text-center flex flex-col items-center space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <CheckSquare className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Taskify</h2>
                  <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                    Version 1.0.0
                  </div>
                </div>
                
                <div className="max-w-md mx-auto p-6 bg-primary/5 border border-primary/10 rounded-xl mt-4">
                  <p className="text-primary font-medium">Made with heart to help you get things done.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm text-muted-foreground pt-8 w-full max-w-sm border-t mt-8">
                  <div className="space-y-2 text-right">
                    <p>Build Date:</p>
                    <p>Website:</p>
                    <p>Support:</p>
                  </div>
                  <div className="space-y-2 text-left font-medium text-foreground">
                    <p>{new Date().toLocaleDateString()}</p>
                    <p><a href="#" className="text-primary hover:underline">taskify.app</a></p>
                    <p><a href="#" className="text-primary hover:underline">support@taskify.app</a></p>
                  </div>
                </div>

                <div className="flex gap-4 pt-8 text-sm font-medium">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                  <span className="text-muted-foreground">•</span>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
