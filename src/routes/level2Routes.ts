import { Router } from "express";
import {
  getActiveLessons,
  getContentByLessonId,
  getLessonsWithMaxContent,
  getPlansOrderByPrice,
  getPublishedLessons,
  getUsersWithRole,
} from "../queries/level2";

const router = Router();

router.get("/published-lessons", getPublishedLessons);

router.get("/user-role", getUsersWithRole);

router.get("/lessons/max-content", getLessonsWithMaxContent);

router.get("/content/:id", getContentByLessonId);

router.get("/lessons/active", getActiveLessons);

router.get("/plans", getPlansOrderByPrice)

export default router;
