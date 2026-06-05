import { Router } from "express";
import {
  getContentsWithMostComments,
  getLessonsByTotalCommentsCount,
} from "../queries/level4";

const router = Router();

router.get("/contents-with-most-comments", getContentsWithMostComments);
router.get(
  "/lessons-with-total-comments/count",
  getLessonsByTotalCommentsCount,
);

export default router;
