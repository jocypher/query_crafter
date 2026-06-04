import { Router } from "express";
import { getCommentsPerContent, getPlansWithHighSubscriptions, getTotalLessons } from "../queries/level3";

const router = Router();

router.get("/lessons/:id", getTotalLessons);

router.get("/:id/comments", getCommentsPerContent);

router.get("/plans", getPlansWithHighSubscriptions)


export default router