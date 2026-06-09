import { AppLayout } from "@/components/layout/AppLayout";
import { useGetStatistics, getGetStatisticsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Lightbulb } from "lucide-react";

export default function Statistics() {
  const { data, isLoading } = useGetStatistics({
    query: { queryKey: getGetStatisticsQueryKey() }
  });

  const stats = data?.stats;
  const dailyData = data?.dailyData || [];
  const priorityBreakdown = data?.priorityBreakdown;
  const productivityTrend = data?.productivityTrend || [];

  const priorityData = priorityBreakdown ? [
    { name: "High", value: priorityBreakdown.high, color: "#ef4444" },
    { name: "Medium", value: priorityBreakdown.medium, color: "#facc15" },
    { name: "Low", value: priorityBreakdown.low, color: "#22c55e" },
  ] : [];

  return (
    <AppLayout title="Statistics" subtitle="Deep dive into your productivity patterns.">
      <div className="flex justify-end mb-6">
        <Select defaultValue="month">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-5 mb-8">
        {[
          { label: "Total Tasks", value: stats?.totalTasks, change: stats?.totalTasksChange, suffix: "" },
          { label: "Pending", value: stats?.pendingTasks, change: stats?.pendingTasksChange, suffix: "" },
          { label: "Completed", value: stats?.completedTasks, change: stats?.completedTasksChange, suffix: "" },
          { label: "Today's Tasks", value: stats?.todayTasks, change: stats?.todayTasksChange, suffix: "" },
          { label: "Completion Rate", value: stats?.completionRate, change: stats?.completionRateChange, suffix: "%" },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-2" />
              ) : (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold">{item.value || 0}{item.suffix}</span>
                  {(item.change ?? 0) !== 0 && (
                    <span className={`flex items-center text-xs ${(item.change || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(item.change || 0) > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(item.change || 0)}%
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData.length ? dailyData : [
                    { date: 'Mon', completed: 4, pending: 2, overdue: 1 },
                    { date: 'Tue', completed: 3, pending: 4, overdue: 0 },
                    { date: 'Wed', completed: 6, pending: 3, overdue: 1 },
                    { date: 'Thu', completed: 5, pending: 5, overdue: 0 },
                    { date: 'Fri', completed: 8, pending: 2, overdue: 0 },
                    { date: 'Sat', completed: 2, pending: 1, overdue: 0 },
                    { date: 'Sun', completed: 1, pending: 1, overdue: 0 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" fillOpacity={1} fill="url(#colorCompleted)" />
                    <Area type="monotone" dataKey="pending" name="Pending" stroke="#facc15" fillOpacity={1} fill="url(#colorPending)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             {isLoading ? <Skeleton className="h-[250px] w-[250px] rounded-full" /> : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData.length ? priorityData : [
                        { name: "High", value: 10, color: "#ef4444" },
                        { name: "Medium", value: 25, color: "#facc15" },
                        { name: "Low", value: 15, color: "#22c55e" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(priorityData.length ? priorityData : [
                        { name: "High", value: 10, color: "#ef4444" },
                        { name: "Medium", value: 25, color: "#facc15" },
                        { name: "Low", value: 15, color: "#22c55e" },
                      ]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[250px] w-full" /> : (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrend.length ? productivityTrend : [
                    { date: 'Week 1', rate: 65 },
                    { date: 'Week 2', rate: 70 },
                    { date: 'Week 3', rate: 68 },
                    { date: 'Week 4', rate: 85 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" name="Productivity Rate %" stroke="#facc15" strokeWidth={3} dot={{ r: 4, fill: "#facc15" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Lightbulb className="h-5 w-5" /> Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your most productive days are <strong className="text-foreground">Tuesdays</strong> and <strong className="text-foreground">Fridays</strong>. 
              Try scheduling your most important, high-focus tasks on these days to maximize your output.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
