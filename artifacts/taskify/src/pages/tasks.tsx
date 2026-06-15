import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetTasks, getGetTasksQueryKey, 
  useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Edit2, Trash2, CheckCircle2, Circle, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TaskInputPriority, TaskInputStatus } from "@workspace/api-zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "completed"]),
});

import { useEffect } from "react";

export default function Tasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");
  const [notifiedTasks, setNotifiedTasks] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetTasks({ 
    status: filter !== "all" ? (filter as any) : undefined 
  });

  const tasks = data?.tasks || [];

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return;
      const now = new Date().getTime();
      
      tasks.forEach((task: any) => {
        if (task.status !== 'completed' && task.dueTime && !notifiedTasks.has(task.id)) {
          const due = new Date(task.dueTime).getTime();
          if (now >= due && now - due <= 60000) {
            new Notification('Task Reminder: ' + task.title, {
              body: task.description || 'It is time to do this task!',
              icon: '/vite.svg'
            });
            setNotifiedTasks(prev => new Set(prev).add(task.id));
          }
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [tasks, notifiedTasks]);

  const completeTaskMutation = useCompleteTask();
  const deleteTaskMutation = useDeleteTask();
  const createTaskMutation = useCreateTask();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    },
  });

  const [dueTimeStr, setDueTimeStr] = useState("");

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      const taskData: any = { ...values };
      if (dueTimeStr) {
        const [hours, minutes] = dueTimeStr.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        taskData.dueTime = d.toISOString();
      }
      
      await createTaskMutation.mutateAsync({ data: taskData as any });
      queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
      toast({ title: "Task created successfully" });
      form.reset();
      setDueTimeStr("");
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to create task" });
    }
  };

  const handleComplete = async (id: number, currentStatus: string) => {
    if (currentStatus === "completed") return; 
    
    try {
      await completeTaskMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
      toast({ title: "Task completed!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error updating task" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTaskMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
      toast({ title: "Task deleted" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error deleting task" });
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout 
      title="My Tasks" 
      subtitle="Manage, organize and track all your tasks in one place."
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Task List */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-lg border">
            <Tabs value={filter} onValueChange={(v: any) => setFilter(v)} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Search tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select defaultValue="dueDate">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No tasks found.</div>
            ) : (
              <div className="divide-y">
                {filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button onClick={() => handleComplete(task.id, task.status)} className="flex-shrink-0">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${task.status === "completed" ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" /> 
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                            <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                      <span className={`hidden sm:inline-block px-2 py-1 text-xs rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {task.status}
                      </span>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Add Task Form */}
        <div className="w-full md:w-80 flex-shrink-0">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Task description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Due Time (Reminder)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" value={dueTimeStr} onChange={e => setDueTimeStr(e.target.value)} />
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={createTaskMutation.isPending}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </form>
              </Form>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Tip: Break down large tasks into smaller, manageable pieces.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
