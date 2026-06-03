import { Request, Response } from "express";
import AppDataSource from "../db/config/datasource";
import { Lesson } from "../db/entities/Lesson";
import { LessonStatus } from "../core/enum/lessonStatus";
import { User } from "../db/entities/User";
import { Content } from "../db/entities/Content";
import { SubscriptionStatus } from "../core/enum/subscriptionStatus";
import { Plan } from "../db/entities/SubscriptionPlan";
import { Comment } from "../db/entities/Comment";
/**
Level 4–5 (Filtering + simple joins)
Fetch published lessons only (Level 4)
Get users who belong to a specific role (Level 4)
Retrieve lessons that have at least one content (Level 4)
Get contents created under a specific lesson (Level 4)
Fetch subscriptions that are currently active (Level 4)
Retrieve plans ordered by price (Level 5)
Get comments made by a specific user (Level 5)
Fetch lessons created within the last 7 days (Level 5)
 */

const lessonsRepo = AppDataSource.getRepository(Lesson);
const userRepo = AppDataSource.getRepository(User);
const contentRepo = AppDataSource.getRepository(Content);
const plansRepo = AppDataSource.getRepository(Plan);
const commentRepo = AppDataSource.getRepository(Comment);

export async function getPublishedLessons(req: Request, res: Response) {
  try {
    const query = req.query.query as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const publishedLessons = await lessonsRepo
      .createQueryBuilder("lesson")
      .where("lesson.status= :status", { status: query })
      .take(limit)
      .skip(skip)
      .getMany();

    if (publishedLessons.length == 0 || !publishedLessons) {
      return res.status(404).json({
        success: false,
        message: "No Published lessons found",
      });
    }

    return res.status(200).json({
      success: true,
      data: publishedLessons,
    });
  } catch (error) {
    console.error("An error occurred here", error);
    throw error;
  }
}

export async function getUsersWithRole(req: Request, res: Response) {
  try {
    const userWithRole = await userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .getMany();

    if (!userWithRole || userWithRole.length == 0) {
      return res.status(404).json({
        success: false,
        message: "User has no role",
      });
    }
    return res.status(200).json({
      success: true,
      data: userWithRole,
    });
  } catch (error) {
    console.error("An error occurred", error);
    throw error;
  }
}

export async function getLessonsWithMaxContent(req: Request, res: Response) {
  try {
    const lessonsWithLeastContent = await lessonsRepo
      .createQueryBuilder("lessons")
      .leftJoin("lessons.contents", "contents")
      .groupBy("lessons.id")
      .having(`COUNT(contents.id) > :minSize`, { minSize: 4 })
      .getMany();

    if (!lessonsWithLeastContent || lessonsWithLeastContent.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No lessons found with least content ",
      });
    }

    return res.status(200).json({
      success: true,
      data: lessonsWithLeastContent,
    });
  } catch (error) {
    console.error("An error occurred at", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getContentByLessonId(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "lesson id must be provided",
      });
    }
    const content = await contentRepo
      .createQueryBuilder("content")
      .leftJoinAndSelect("content.lesson", "lesson")
      .where("lesson.id= :id", { id: id })
      .getMany();

    if (!content || content.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No content with lesson by id",
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred,${error}`,
    });
  }
}

export async function getActiveLessons(req: Request, res: Response) {
  try {
    // const qb = lessonsRepo
    //   .createQueryBuilder("lessons")
    //   .select("lessons.id", "lessonId")
    //   .addSelect("lessons.author", "author")
    //   .addSelect("lessons.title", "title")
    //   .addSelect("lessons.description", "description")
    //   .leftJoin("lessons.plans", "plans")
    //   .leftJoin("plans.subscriptions", "subscriptions")
    //   .where("subscriptions.status= :status", {
    //     status: SubscriptionStatus.TRAILING,
    //   });
    const qb1 = lessonsRepo
      .createQueryBuilder("lessons")
      .leftJoin(
        "plan_lessons",
        "pl_lessons",
        "pl_lessons.lesson_id = lessons.id",
      )
      .leftJoin("plans", "plans", "plans.id = pl_lessons.plan_id")
      .leftJoin("plans.subscriptions", "subscriptions")
      .where("subscriptions.status = :status", {
        status: SubscriptionStatus.ACTIVE,
      });

    const activeLessons = await qb1.getMany();

    console.log("Active lessons", activeLessons);

    if (!activeLessons || activeLessons.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No active lessons found",
      });
    }
    return res.status(200).json({
      success: true,
      data: activeLessons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server occurred on, ${error}`,
    });
  }
}

export async function getPlansOrderByPrice(req: Request, res: Response) {
  try {
    const qb = plansRepo
      .createQueryBuilder("plans")
      .select("plans.id", "id")
      .addSelect("plans.name", "name")
      .addSelect("plans.amount", "amount")
      .addSelect("plans.interval", "interval")
      .orderBy("plans.amount", "ASC")
      .orderBy("plans.id", "ASC");

    const plans = await qb.getRawMany();

    if (!plans) {
      return res.status(404).json({
        success: false,
        message: "No plans found",
      });
    }

    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred, ${error}`,
    });
  }
}

export async function getCommentByUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const qb = commentRepo
      .createQueryBuilder("comments")
      .leftJoin("comments.user", "user")
      .where("user.id= :id", { id: userId });

    const [commentsByUser, total] = await qb.getManyAndCount();

    if (!commentsByUser || total == 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found",
      });
    }

    return res.status(200).json({
      success: true,
      data: commentsByUser,
      total: total,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred, ${error}`,
    });
  }
}

export async function getRecentLessonsByAuthor(req: Request, res: Response) {
  try {
    const subQuery = lessonsRepo
      .createQueryBuilder("lessons")
      .select("lessons.author", "author")
      .addSelect("MAX(lessons.createdAt)", "max_date")
      .groupBy("lessons.author");

    const query = lessonsRepo
      .createQueryBuilder("lessons")
      .select("lessons.id", "id")
      .addSelect("lessons.title", "title")
      .addSelect("lessons.author", "author")
      .addSelect("lessons.createdAt", "createdAt")
      .innerJoin(
        "(" + subQuery.getQuery() + ")",
        "recent",
        "recent.author = lessons.author AND recent.max_date = lessons.createdAt",
      )
      .setParameters(subQuery.getParameters());

    const recentLessons = await query.getRawMany();

    if (!recentLessons || recentLessons.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No recent lessons found",
      });
    }
    return res.status(200).json({
      success: true,
      data: recentLessons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server occurred, ${error}`,
    });
  }
}

export async function getRecentLessons(req: Request, res: Response) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const qb = lessonsRepo
      .createQueryBuilder("lessons")
      .select([
        "lessons.id",
        "lessons.title",
        "lessons.author",
        "lessons.createdAt",
      ])
      .where("lessons.createdAt >= :cutOffDate", { cutOffDate: sevenDaysAgo })
      .orderBy("lessons.createdAt", "ASC")

    const recentLessons = await qb.getMany();

    if (!recentLessons || recentLessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recent lessons found",
      });
    }

    return res.status(200).json({
      success: true,
      message: recentLessons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred, ${error}`,
    });
  }
}
