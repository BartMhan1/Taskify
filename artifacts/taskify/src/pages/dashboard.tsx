import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Calendar as CalendarIcon, ListTodo } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetDashboard({
    query: { queryKey: getGetDashboardQueryKey() }
  });

  const stats = dashboard?.stats;
  const recentTasks = dashboard?.recentTasks || [];
  const upcomingDeadlines = dashboard?.upcomingDeadlines || [];
  const taskSummary = dashboard?.taskSummary;

  const chartData = taskSummary ? [
    { name: "Completed", value: taskSummary.completed, color: "#22c55e" },
    { name: "Pending", value: taskSummary.pending, color: "#facc15" },
    { name: "Overdue", value: taskSummary.overdue, color: "#a855f7" },
  ] : [];

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}! Here's what's happening with your tasks.`}
    >
      <div className="flex items-center justify-between mb-6">
         <div></div>
         <Link href="/tasks">
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add New Task</Button>
         </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.pending || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.completed || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.todayTasks || 0}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Left Col - Recent Tasks */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recentTasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No recent tasks found.</div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                        <div>
                          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                          {task.dueDate && <p className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Charts & Deadlines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {isLoading ? <Skeleton className="h-[200px] w-[200px] rounded-full" /> : (
                <div className="h-[200px] w-full">
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
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : upcomingDeadlines.length === 0 ? (
                 <div className="text-center text-muted-foreground py-4 text-sm">No upcoming deadlines.</div>
              ) : (
                <div className="space-y-4">
                  {upcomingDeadlines.map(task => (
                    <div key={task.id} className="flex gap-3 items-center border-l-4 border-amber-500 pl-3 py-1">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
