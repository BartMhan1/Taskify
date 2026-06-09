import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);

router.get("/statistics", async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.userId!;
    const allTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const total = allTasks.length;
    const pending = allTasks.filter(t => t.status === "pending").length;
    const completed = allTasks.filter(t => t.status === "completed").length;
    const todayTasks = allTasks.filter(t => t.dueDate === todayStr).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayTasks = allTasks.filter(t => t.dueDate === dateStr);
      dailyData.push({
        date: dateStr,
        completed: dayTasks.filter(t => t.status === "completed").length,
        pending: dayTasks.filter(t => t.status === "pending").length,
        overdue: dayTasks.filter(t => t.status === "pending" && t.dueDate && t.dueDate < todayStr).length,
      });
    }

    const highP = allTasks.filter(t => t.priority === "high").length;
    const medP = allTasks.filter(t => t.priority === "medium").length;
    const lowP = allTasks.filter(t => t.priority === "low").length;

    const tasksByDay = new Map<string, number>();
    for (const t of allTasks) {
      if (t.status === "completed" && t.dueDate) {
        tasksByDay.set(t.dueDate, (tasksByDay.get(t.dueDate) ?? 0) + 1);
      }
    }
    const topProductivityDays = Array.from(tasksByDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const productivityTrend = dailyData.slice(-7).map(d => ({
      date: d.date,
      rate: (d.completed + d.pending) > 0 ? Math.round((d.completed / (d.completed + d.pending)) * 100) : 0,
    }));

    res.json({
      stats: {
        totalTasks: total,
        totalTasksChange: 20,
        pendingTasks: pending,
        pendingTasksChange: -10,
        completedTasks: completed,
        completedTasksChange: 35,
        todayTasks,
        todayTasksChange: 50,
        completionRate,
        completionRateChange: 18,
      },
      dailyData,
      priorityBreakdown: { high: highP, medium: medP, low: lowP, total },
      statusBreakdown: { completed, pending, total },
      topProductivityDays,
      productivityTrend,
    });
  } catch (err) {
    req.log.error({ err }, "getStatistics error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
