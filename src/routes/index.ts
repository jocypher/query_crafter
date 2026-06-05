import { Router } from "express";
import l1Router from "./level1Routes"
import l2Router from "./level2Routes"
import l3Router from "./level3Routes"
import l4Router from "./level4Routes"
const appRouter = Router()


appRouter.use("/api/v1/l1", l1Router)
appRouter.use("/api/v1/l2", l2Router)
appRouter.use("/api/v1/l3", l3Router)
appRouter.use("/api/v1/l4", l4Router)

export default appRouter