import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import tasksRouter from "./tasks";
import dashboardRouter from "./dashboard";
import statisticsRouter from "./statistics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(tasksRouter);
router.use(dashboardRouter);
router.use(statisticsRouter);

export default router;
