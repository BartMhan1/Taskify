import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetTodayTasks, getGetTodayTasksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Flame, Calendar as CalendarIcon, MoreVertical } from "lucide-react";

export default function Today() {
  const [date, setDate] = useState(new Date());
  
  const { data, isLoading } = useGetTodayTasks({
    query: { queryKey: getGetTodayTasksQueryKey() }
  });

  const stats = data?.stats;
  const tasks = data?.tasks || [];
  const dueSoon = data?.dueSoon || [];

  return (
    <AppLayout title="Today" subtitle="Focus on what matters today.">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 bg-card border rounded-md p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-medium text-sm w-32 text-center">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalToday || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.dueToday || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.highPriority || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.completed || 0}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Tasks</CardTitle>
              <Button variant="link" className="text-primary">+ Add Task</Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No tasks for today.</div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full border border-gray-300" />
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {task.category && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{task.category}</span>}
                            <span className="text-xs text-amber-600 flex items-center gap-1"><Clock className="h-3 w-3" /> Due Soon</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {task.priority}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div>
             <h3 className="text-lg font-bold mb-4">Due Soon</h3>
             <div className="grid sm:grid-cols-3 gap-4">
                {isLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)
                ) : dueSoon.length === 0 ? (
                  <p className="text-muted-foreground text-sm col-span-3">Nothing due soon.</p>
                ) : (
                  dueSoon.slice(0, 3).map((task: any) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <p className="font-medium text-sm line-clamp-1">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Today</p>
                      </CardContent>
                    </Card>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map((time, i) => (
                  <div key={time} className="flex gap-4">
                    <span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-1">{time}</span>
                    <div className="flex-1 min-h-[60px] border-l-2 border-muted relative">
                      {i === 1 && (
                        <div className="absolute left-[-2px] top-2 bottom-2 w-[calc(100%+2px)] bg-primary/10 border-l-2 border-primary p-2 rounded-r">
                          <p className="text-xs font-medium">Team Meeting</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Flame className="h-4 w-4" /> Tip of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Tackle your most difficult task first thing in the morning when your energy is highest.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
