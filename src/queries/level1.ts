import AppDataSource from "../db/config/datasource";
import { Comment } from "../db/entities/Comment";
import { Content } from "../db/entities/Content";
import { Lesson } from "../db/entities/Lesson";
import { Media } from "../db/entities/Media";
import { Profile } from "../db/entities/Profile";
import { Subscription } from "../db/entities/Subscription";
import { Plan } from "../db/entities/SubscriptionPlan";
import { User } from "../db/entities/User";
import { Request, Response } from "express";
/**
Level 1–3 (Basic relational queries)
Fetch all users with their profile information (Level 1)
Retrieve all lessons with their author details (Level 1)
List all plans with basic details (Level 1)
Get all contents belonging to a specific lesson (Level 2)
Retrieve all comments with their user info (Level 2)
Fetch all subscriptions with user and plan details (Level 2)
Get all media attached to contents (Level 3)
Retrieve lessons created by a specific user (Level 3)
 
 * 
 */
const userRepo = AppDataSource.getRepository(User);
const profileRepo = AppDataSource.getRepository(Profile);
const lessonRepo = AppDataSource.getRepository(Lesson);
const plansRepo = AppDataSource.getRepository(Plan);
const contentRepo = AppDataSource.getRepository(Content);
const commentRepo = AppDataSource.getRepository(Comment);
const subscriptionRepo = AppDataSource.getRepository(Subscription);
const mediaRepo = AppDataSource.getRepository(Media);
export async function getUserWithProfile(req: Request, res: Response) {
  try {
    const users = await userRepo.find({
      relations: {
        profile: true,
      },
    });
    if (users.length == 0) {
      return res.status(401).json({
        success: false,
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    throw error;
  }
}

export async function getLessonsWithAuthorDetails(req: Request, res: Response) {
  try {
    const lessons = await lessonRepo.find({
      relations: {
        author: true,
      },
    });

    if (lessons.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No lessons found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    throw error;
  }
}

export async function getAllPlansWithBasicDetails(req: Request, res: Response) {
  try {
    const plans = await plansRepo.find({
      relations: {
        lessons: true,
        subscriptions: true,
      },
    });
    if (!plans || plans.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No plan found for this lesson",
      });
    }
    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    throw error;
  }
}

export async function getContentByLessonId(req: Request, res: Response) {
  try {
    const lesson_id = Number(req.params.id);

    const content = await contentRepo.find({
      where: {
        lesson: { id: lesson_id },
      },
      relations: {
        lesson: true,
      },
    });

    if (!content || content.length == 0) {
      return res.status(404).json({
        success: true,
        message: "No content found",
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    throw error;
  }
}

export async function getCommentWithUserInfo(req: Request, res: Response) {
  try {
    const comments = await commentRepo.find({
      relations: {
        user: true,
      },
    });

    if (!comments || comments.length == 0) {
      return res.status(404).json({
        success: true,
        message: "Couldn't find any comments",
      });
    }
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    throw error;
  }
}

export async function getSubscriptionByUserAndPlans(
  req: Request,
  res: Response,
) {
  try {
    const subscriptions = await subscriptionRepo.find({
      relations: {
        plan: true,
        user:true
      },
    });
    if (subscriptions.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No subscriptions",
      });
    }

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    throw error;
  }
}

/**
Get all media attached to contents (Level 3)
Retrieve lessons created by a specific user (Level 3)
 */

export async function getMediaWithContents(req: Request, res: Response) {
  try {
    const media = await mediaRepo.find({
      relations: {
        contents: true,
      },
    });

    if (!media || media.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No media with contents found",
      });
    }
    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Error occurred", error);
    throw error;
  }
}

export async function getLessonsByUserId(req: Request, res: Response) {
  try {
    const userId = req.params.id as string;

    const lessons = await lessonRepo.find({
      where: {
        author: {
          id: userId,
        },
      },
      relations: {
        author: true,
      },
    });

    if (!lessons || lessons.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Lessons found",
      });
    }
    return res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    throw error;
  }
}
