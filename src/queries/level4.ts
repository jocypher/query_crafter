import AppDataSource from "../db/config/datasource";
/*
Find the most commented contents (Level 7)
Get lessons ordered by total comment count (Level 7)
Retrieve users ranked by total comments made (Level 7)
Fetch plans with active vs expired subscription breakdown (Level 7)
Find lessons with both media and comments attached (Level 7)
*/
import { Request, Response } from "express";
import { Content } from "../db/entities/Content";
import { Lesson } from "../db/entities/Lesson";

const contentRepo = AppDataSource.getRepository(Content);
const lessonsRepo = AppDataSource.getRepository(Lesson);

export async function getContentsWithMostComments(req: Request, res: Response) {
  try {
    const qb = contentRepo
      .createQueryBuilder("contents")
      .leftJoin("contents.comments", "comments")
      .addSelect("COUNT(comments.id)", "comments_count")
      .groupBy("contents.id");

    const maxCommentCount = await qb
      .orderBy("comments_count", "DESC")
      .limit(1)
      .getRawOne();

    const max = maxCommentCount ?? 0;

    const contentsWithMostComments = await qb
      .having("COUNT(comments.id) = :count", { count: max })
      .getRawMany();

    if (!contentsWithMostComments) {
      return res
        .status(404)
        .json({ success: false, message: "Contents don't have comments " });
    }

    return res.status(200).json({
      success: true,
      data: contentsWithMostComments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error occurred on the server ${error}`,
    });
  }
}

export async function getLessonsByTotalCommentsCount(req: Request, res: Response) {
  try {
    const qb = lessonsRepo
      .createQueryBuilder("lessons")
      .leftJoin("lessons.contents", "contents")
      .leftJoin("contents.comments", "comments")
      .addSelect("COUNT(comments.id)", "comment_count")
      .groupBy("lessons.id")
      .orderBy("comment_count", "DESC");

    const getLessonsByTotalCommentsCount = await qb.getRawMany();

    if (!getLessonsByTotalCommentsCount) {
      return res.status(404).json({
        success: false,
        message: `No comments was found on the lesson`,
      });
    }
    return res.status(200).json({
      success: true,
      data: getLessonsByTotalCommentsCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server occurred ${error}`,
    });
  }
}
