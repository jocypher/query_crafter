import { Router } from "express";
import { getAllPlansWithBasicDetails, getCommentWithUserInfo, getContentByLessonId, getLessonsByUserId, getLessonsWithAuthorDetails, getMediaWithContents, getSubscriptionByUserAndPlans, getUserWithProfile } from "../queries/level1";

const router = Router()


router.get("/user/profile", getUserWithProfile)

router.get("/lessons/author", getLessonsWithAuthorDetails)

router.get("/subPlans", getAllPlansWithBasicDetails)

router.get("/content/:id", getContentByLessonId)

router.get("/userInfo/comment", getCommentWithUserInfo)

router.get("/subscriptions", getSubscriptionByUserAndPlans)

router.get("/media/contents", getMediaWithContents)

router.get("/lessons/:id", getLessonsByUserId)


export default router