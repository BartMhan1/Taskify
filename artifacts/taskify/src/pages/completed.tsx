import { AppLayout } from "@/components/layout/AppLayout";
import { useGetCompletedTasks, getGetCompletedTasksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, Flame, Award, Calendar, MoreHorizontal, Trophy, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Completed() {
  const { data, isLoading } = useGetCompletedTasks({
    query: { queryKey: getGetCompletedTasksQueryKey() }
  });

  const stats = data?.stats;
  const tasks = data?.tasks || [];
  const progress = data?.progress;
  const streakDays = data?.streakDays || [];
  const achievements = data?.achievements || [];

  const chartData = progress ? [
    { name: "Completed", value: progress.completed, color: "#22c55e" },
    { name: "Pending", value: progress.pending, color: "#facc15" },
  ] : [];

  return (
    <AppLayout title="Completed Tasks" subtitle="Review your past achievements.">
      <div className="flex justify-end mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-2" /> : <p className="text-2xl font-bold mt-2">{stats?.totalCompleted || 0}</p>}
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-2" /> : <p className="text-2xl font-bold mt-2">{stats?.completedToday || 0}</p>}
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-2" /> : <p className="text-2xl font-bold mt-2">{stats?.completionRate || 0}%</p>}
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Day Streak</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-2" /> : <p className="text-2xl font-bold mt-2">{stats?.dayStreak || 0}</p>}
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Flame className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Completion Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center relative">
            {isLoading ? <Skeleton className="h-[200px] w-[200px] rounded-full" /> : (
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round(((progress?.completed || 0) / (progress?.total || 1)) * 100)}%</span>
                  <span className="text-xs text-muted-foreground">This Month</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Day Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px] gap-6">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-10 w-10 text-orange-500" />
              <span className="text-4xl font-bold">{stats?.dayStreak || 0}</span>
              <span className="text-xl font-medium text-muted-foreground">Days</span>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              {isLoading ? (
                Array(7).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-8 rounded-full" />)
              ) : (
                (streakDays.length ? streakDays : [
                  { day: 'Mon', completed: true }, { day: 'Tue', completed: true }, 
                  { day: 'Wed', completed: false }, { day: 'Thu', completed: true },
                  { day: 'Fri', completed: true }, { day: 'Sat', completed: false }, { day: 'Sun', completed: false }
                ]).map((d: any, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${d.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {d.completed ? <CheckCircle2 className="h-4 w-4" /> : null}
                    </div>
                    <span className="text-xs text-muted-foreground">{d.day.charAt(0)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No completed tasks yet.</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <div className="col-span-6">Task</div>
                    <div className="col-span-3">Category</div>
                    <div className="col-span-3">Completed On</div>
                  </div>
                  {tasks.map((task: any) => (
                    <div key={task.id} className="grid grid-cols-12 items-center py-3 border-b last:border-0 hover:bg-muted/30">
                      <div className="col-span-6 flex items-center gap-3 pr-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="truncate text-sm font-medium">{task.title}</span>
                      </div>
                      <div className="col-span-3 text-sm text-muted-foreground">
                        {task.category || 'General'}
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 text-center">
                    <Button variant="outline" className="w-full sm:w-auto">Load More</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)
              ) : (
                (achievements.length ? achievements : [
                  { id: '1', title: 'Getting Started', description: 'Complete your first task', unlockedAt: '2023-01-01' },
                  { id: '2', title: 'Task Master', description: 'Complete 100 tasks', unlockedAt: '2023-05-01' },
                  { id: '3', title: 'Consistent', description: 'Maintain a 7-day streak', unlockedAt: null },
                ]).map((ach: any) => (
                  <div key={ach.id} className={`flex items-start gap-3 p-3 rounded-lg border ${ach.unlockedAt ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 grayscale opacity-60'}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${ach.unlockedAt ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-muted'}`}>
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{ach.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
