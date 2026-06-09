import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Clock } from "lucide-react";
import { useGetCalendarTasks, getGetCalendarTasksQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  const { data, isLoading } = useGetCalendarTasks(
    { year, month },
    { query: { queryKey: getGetCalendarTasksQueryKey({ year, month }) } }
  );

  const days = data?.days || [];
  const todayTasks = data?.todayTasks || [];
  const quote = data?.quote || "The key is not to prioritize what's on your schedule, but to schedule your priorities.";

  // Helper to find tasks for a specific day
  const getTasksForDay = (dayNum: number) => {
    const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayObj = days.find(d => d.date.startsWith(dayStr));
    return dayObj?.tasks || [];
  };

  return (
    <AppLayout title="Calendar" subtitle="Schedule and visualize your upcoming tasks.">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Select defaultValue="month">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-bold text-lg w-40 text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-7 border-b text-center bg-muted/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-sm font-medium text-muted-foreground border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r bg-muted/10"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                const dayTasks = getTasksForDay(day);
                
                return (
                  <div key={day} className={`min-h-[120px] p-2 border-b border-r last:border-r-0 hover:bg-muted/30 transition-colors ${isToday ? 'bg-primary/5' : ''}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                        {day}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {isLoading ? (
                         null
                      ) : (
                        dayTasks.slice(0, 3).map((task, idx) => (
                          <div key={task.id || idx} className={`text-xs px-1.5 py-1 rounded truncate ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {task.title}
                          </div>
                        ))
                      )}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] text-muted-foreground pl-1">+{dayTasks.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Fill remaining cells to complete the grid */}
              {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div key={`empty-end-${i}`} className="min-h-[100px] p-2 border-b border-r bg-muted/10"></div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)
              ) : todayTasks.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-4">No tasks today.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {todayTasks.map((task: any) => (
                     <div key={task.id} className={`flex items-start gap-3 border-l-2 pl-3 ${task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-amber-500' : 'border-green-500'}`}>
                       <div>
                         <p className="text-sm font-medium">{task.title}</p>
                         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {task.category || 'General'}</p>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Quote className="h-8 w-8 mx-auto text-primary/40 mb-4" />
              <p className="text-sm italic text-muted-foreground">"{quote}"</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
