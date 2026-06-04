import { Request, Response } from "express";
import AppDataSource from "../db/config/datasource";
import { Lesson } from "../db/entities/Lesson";
import { Content } from "../db/entities/Content";
import { Plan } from "../db/entities/SubscriptionPlan";
/*
Count total lessons per user (Level 6)
Count comments per content (Level 6)
Find plans with the highest number of subscriptions (Level 6)
Get lessons with more than 3 contents (Level 6)
Retrieve users who have created more than 5 lessons (Level 6)
*/

const lessonsRepo = AppDataSource.getRepository(Lesson);
const contentRepo = AppDataSource.getRepository(Content);
const planRepo = AppDataSource.getRepository(Plan);
export async function getTotalLessons(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const [lessons, count] = await lessonsRepo
      .createQueryBuilder("lessons")
      .select([
        "lessons.id",
        "lessons.title",
        "lessons.description",
        "lessons.status",
        "lessons.author",
        "lessons.createdAt",
      ])
      .leftJoin("lessons.author", "author")
      .where("lessons.id = :id", { id: userId })
      .getManyAndCount();

    if (!lessons || count == 0) {
      return res.status(400).json({
        success: false,
        message: "No lessons found",
      });
    }

    return res.status(200).json({
      success: true,
      total: count,
      noOfLessons: lessons.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server occurred, ${error}`,
    });
  }
}

export async function getCommentsPerContent(req: Request, res: Response) {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    const contentId = Number(req.params.id);
    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Bad Request check the request parameters",
      });
    }
    const qb = contentRepo
      .createQueryBuilder("content")
      .leftJoin("content.comments", "comments")
      .where("content.id = :id", { id: contentId })
      .take(limit)
      .skip(skip)
      ;
    const commentsByContent = await qb.getMany();

    if (!commentsByContent || commentsByContent.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found under this content",
      });
    }
    return res.status(200).json({
      success: true,
      data: commentsByContent,
      total:{
        page,
        skip,
        limit
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred, ${error}`,
    });
  }
}

export async function getPlansWithHighSubscriptions(
  req: Request,
  res: Response,
) {
  try {
    // first approach 
    // high database round trips = high latency 
    const maxSubCount = await planRepo.createQueryBuilder("plan")
    .leftJoin("plan.subscriptions", "subscriptions")
    .addSelect("COUNT(subscriptions.id)", "count")
    .groupBy("plan.id")
    .orderBy("count", "DESC")
    .limit(1)
    .getRawOne()

    const maxCount = maxSubCount?.count ?? 0
    const maxPlans = await planRepo.createQueryBuilder("plan")
    .leftJoin("plan.subscriptions", "subscriptions")
    .addSelect("COUNT(subscriptions.id)", "subCount")
    .groupBy("plan.id")
    .having("COUNT(subscriptions.id)= :count", {count:maxCount})
    .getRawMany()

    if(!maxPlans){
        return res.status(404).json({
            success:false,
            message:"No maximum plans"
        })
    }

    // second approach
    // better and faster
    const qb = planRepo
    .createQueryBuilder("plan")
    .leftJoin("plan.subscriptions", "subscriptions")
    .addSelect("COUNT(subscriptions.id)", "sub_count")
    .groupBy("plan.id")
    .addSelect("RANK() OVER (ORDER BY(COUNT(subscriptions.id) DESC)", "rank")
    .having("rank = 1")

    const maxPlan = await qb.getRawMany()

    return res.status(200).json({
        success:true,
        data1: maxPlans,
        data2: maxPlan
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error occurred, ${error}`,
    });
  }
}
