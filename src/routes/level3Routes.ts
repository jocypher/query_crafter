import { Router } from "express";
import { getCommentsPerContent, getLessonWithThreeOrMoreContents, getPlansWithHighSubscriptions, getTotalLessons, getUsersWithMinimumLessons } from "../queries/level3";

const router = Router();



router.get("/:id/comments", getCommentsPerContent);

router.get("/plans", getPlansWithHighSubscriptions)

router.get("/lessons/with-minimum-contents", getLessonWithThreeOrMoreContents)

router.get("/users/with-minimum-lessons", getUsersWithMinimumLessons)

router.get("/lessons/:id", getTotalLessons);

export default router