import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);

router.get("/dashboard", async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.userId!;
    const allTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
    const today = new Date().toISOString().split("T")[0];

    const total = allTasks.length;
    const pending = allTasks.filter(t => t.status === "pending").length;
    const completed = allTasks.filter(t => t.status === "completed").length;
    const todayTasks = allTasks.filter(t => t.dueDate === today).length;

    const now = today;
    const overdue = allTasks.filter(t => t.status === "pending" && t.dueDate && t.dueDate < now);

    const recentTasks = [...allTasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const upcomingDeadlines = [...allTasks]
      .filter(t => t.dueDate && t.dueDate >= today && t.status !== "completed")
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
      .slice(0, 3);

    const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
    const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const overduePercent = total > 0 ? Math.round((overdue.length / total) * 100) : 0;

    const serialize = (t: typeof tasksTable.$inferSelect) => ({
      id: t.id,
      userId: t.userId,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
      status: t.status,
      category: t.category,
      completedAt: t.completedAt ? t.completedAt.toISOString() : null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    });

    res.json({
      stats: { totalTasks: total, pending, completed, todayTasks },
      recentTasks: recentTasks.map(serialize),
      upcomingDeadlines: upcomingDeadlines.map(serialize),
      taskSummary: {
        pending,
        pendingPercent,
        completed,
        completedPercent,
        overdue: overdue.length,
        overduePercent,
        total,
      },
    });
  } catch (err) {
    req.log.error({ err }, "getDashboard error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
