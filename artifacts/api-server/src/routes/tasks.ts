import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq, and, ilike, desc, asc, count, sql } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

function serializeTask(task: typeof tasksTable.$inferSelect) {
  return {
    id: task.id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    priority: task.priority,
    status: task.status,
    category: task.category,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

router.get("/tasks", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { status, priority, search, sortBy, page = "1", limit = "10" } = req.query as Record<string, string>;
    const userId = req.userId!;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = db.select().from(tasksTable).where(eq(tasksTable.userId, userId));

    const conditions = [eq(tasksTable.userId, userId)];
    if (status && status !== "all") conditions.push(eq(tasksTable.status, status));
    if (priority) conditions.push(eq(tasksTable.priority, priority));
    if (search) conditions.push(ilike(tasksTable.title, `%${search}%`));

    const orderCol = sortBy === "priority" ? tasksTable.priority
      : sortBy === "title" ? tasksTable.title
      : sortBy === "createdAt" ? tasksTable.createdAt
      : tasksTable.dueDate;

    const tasks = await db.select().from(tasksTable)
      .where(and(...conditions))
      .orderBy(desc(tasksTable.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [{ value: total }] = await db.select({ value: count() }).from(tasksTable).where(and(...conditions));

    res.json({
      tasks: tasks.map(serializeTask),
      total: Number(total),
      page: pageNum,
      totalPages: Math.ceil(Number(total) / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "getTasks error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/tasks", async (req: AuthRequest, res): Promise<void> => {
  try {
    const { title, description, dueDate, dueTime, priority, status, category } = req.body;
    if (!title || !priority || !status) {
      res.status(400).json({ success: false, message: "Title, priority and status are required" });
      return;
    }
    const [task] = await db.insert(tasksTable).values({
      userId: req.userId!,
      title,
      description: description || null,
      dueDate: dueDate || null,
      dueTime: dueTime ? String(dueTime) : null,
      priority,
      status,
      category: category || null,
    }).returning();
    res.status(201).json(serializeTask(task));
  } catch (err) {
    req.log.error({ err }, "createTask error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/tasks/today", async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.userId!;
    const today = new Date().toISOString().split("T")[0];

    const allTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId)).orderBy(desc(tasksTable.createdAt));
    const todayTasks = allTasks.filter(t => t.dueDate === today);
    const completedToday = allTasks.filter(t => t.status === "completed" && t.dueDate === today);
    const highPriority = todayTasks.filter(t => t.priority === "high" && t.status !== "completed");
    const dueToday = todayTasks.filter(t => t.status !== "completed");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const dueSoon = allTasks.filter(t => t.dueDate && t.dueDate > today && t.dueDate <= tomorrowStr && t.status !== "completed").slice(0, 3);

    res.json({
      tasks: todayTasks.map(serializeTask),
      stats: {
        totalToday: todayTasks.length,
        dueToday: dueToday.length,
        highPriority: highPriority.length,
        completed: completedToday.length,
      },
      dueSoon: dueSoon.map(serializeTask),
    });
  } catch (err) {
    req.log.error({ err }, "getTodayTasks error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/tasks/calendar", async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.userId!;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    const allTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
    const monthTasks = allTasks.filter(t => t.dueDate && t.dueDate >= startDate && t.dueDate <= endDate);

    const tasksByDate = new Map<string, typeof tasksTable.$inferSelect[]>();
    for (const task of monthTasks) {
      if (task.dueDate) {
        const arr = tasksByDate.get(task.dueDate) ?? [];
        arr.push(task);
        tasksByDate.set(task.dueDate, arr);
      }
    }

    const days = Array.from(tasksByDate.entries()).map(([date, tasks]) => ({
      date,
      tasks: tasks.map(serializeTask),
    }));

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = allTasks.filter(t => t.dueDate === today);
    const completed = allTasks.filter(t => t.status === "completed").length;
    const pending = allTasks.filter(t => t.status === "pending").length;
    const now = new Date().toISOString().split("T")[0];
    const overdue = allTasks.filter(t => t.status === "pending" && t.dueDate && t.dueDate < now).length;

    const quotes = [
      "The secret of getting ahead is getting started. – Mark Twain",
      "Focus on being productive instead of busy. – Tim Ferriss",
      "It always seems impossible until it's done. – Nelson Mandela",
    ];

    res.json({
      days,
      todayTasks: todayTasks.map(serializeTask),
      statusSummary: { total: allTasks.length, completed, pending, overdue },
      quote: quotes[Math.floor(Math.random() * quotes.length)],
    });
  } catch (err) {
    req.log.error({ err }, "getCalendarTasks error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/tasks/completed", async (req: AuthRequest, res): Promise<void> => {
  try {
    const userId = req.userId!;
    const period = (req.query.period as string) || "all";
    const allTasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId)).orderBy(desc(tasksTable.updatedAt));
    const completedTasks = allTasks.filter(t => t.status === "completed");
    const total = allTasks.length;

    const today = new Date().toISOString().split("T")[0];
    const completedToday = completedTasks.filter(t => t.dueDate === today).length;
    const completionRate = total > 0 ? Math.round((completedTasks.length / total) * 100) : 0;

    const streakDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
      day,
      completed: i < 5,
    }));

    const achievements = [
      { id: "task-master", title: "Task Master", description: "Complete 10 tasks", badge: "🏆", unlockedAt: completedTasks.length >= 10 ? completedTasks[0]?.completedAt?.toISOString() ?? null : null },
      { id: "consistent", title: "Consistent", description: "Maintain a 3-day streak", badge: "⭐", unlockedAt: new Date().toISOString() },
      { id: "getting-started", title: "Getting Started", description: "Complete your first task", badge: "🚀", unlockedAt: completedTasks.length > 0 ? completedTasks[completedTasks.length - 1]?.completedAt?.toISOString() ?? null : null },
    ];

    res.json({
      tasks: completedTasks.slice(0, 20).map(serializeTask),
      stats: {
        totalCompleted: completedTasks.length,
        completedToday,
        completionRate,
        dayStreak: 5,
      },
      progress: {
        completed: completedTasks.length,
        pending: allTasks.filter(t => t.status === "pending").length,
        total,
      },
      streakDays,
      achievements,
    });
  } catch (err) {
    req.log.error({ err }, "getCompletedTasks error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/tasks/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const [task] = await db.select().from(tasksTable).where(and(eq(tasksTable.id, id), eq(tasksTable.userId, req.userId!))).limit(1);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.json(serializeTask(task));
  } catch (err) {
    req.log.error({ err }, "getTask error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/tasks/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, dueDate, dueTime, priority, status, category } = req.body;
    const updates: Partial<typeof tasksTable.$inferInsert> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;
    if (dueTime !== undefined) updates.dueTime = dueTime ? String(dueTime) : null;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) {
      updates.status = status;
      if (status === "completed" && !updates.completedAt) updates.completedAt = new Date();
      else if (status === "pending") updates.completedAt = undefined;
    }
    if (category !== undefined) updates.category = category;

    const [task] = await db.update(tasksTable).set(updates).where(and(eq(tasksTable.id, id), eq(tasksTable.userId, req.userId!))).returning();
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.json(serializeTask(task));
  } catch (err) {
    req.log.error({ err }, "updateTask error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/tasks/:id", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    await db.delete(tasksTable).where(and(eq(tasksTable.id, id), eq(tasksTable.userId, req.userId!)));
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    req.log.error({ err }, "deleteTask error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.patch("/tasks/:id/complete", async (req: AuthRequest, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const [task] = await db.update(tasksTable)
      .set({ status: "completed", completedAt: new Date() })
      .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, req.userId!)))
      .returning();
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.json(serializeTask(task));
  } catch (err) {
    req.log.error({ err }, "completeTask error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
