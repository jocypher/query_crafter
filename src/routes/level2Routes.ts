import { Router } from "express";
import {
  getActiveLessons,
  getCommentByUser,
  getContentByLessonId,
  getLessonsWithMaxContent,
  getPlansOrderByPrice,
  getPublishedLessons,
  getRecentLessons,
  getRecentLessonsByAuthor,
  getUsersWithRole,
} from "../queries/level2";

const router = Router();

router.get("/published-lessons", getPublishedLessons);

router.get("/user-role", getUsersWithRole);

router.get("/lessons/max-content", getLessonsWithMaxContent);

router.get("/content/:id", getContentByLessonId);

router.get("/lessons/active", getActiveLessons);

router.get("/plans", getPlansOrderByPrice)

router.get("/comments/:id", getCommentByUser)

router.get("/author/lessons/recent", getRecentLessonsByAuthor)

router.get("/lessons/recent",getRecentLessons)

export default router;
