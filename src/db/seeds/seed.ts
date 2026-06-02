import { DataSource } from "typeorm";
import {faker} from "@faker-js/faker";

import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Profile } from "../entities/Profile";
import { Plan } from "../entities/SubscriptionPlan";
import { Lesson } from "../entities/Lesson";
import { Content } from "../entities/Content";
import { Media } from "../entities/Media";
import { Comment } from "../entities/Comment";
import { Subscription } from "../entities/Subscription";

import { LessonStatus } from "../../core/enum/lessonStatus";
import { SubscriptionStatus } from "../../core/enum/subscriptionStatus";
import { MediaType } from "../../core/enum/mediaType";

export async function seedDatabase(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const profileRepo = dataSource.getRepository(Profile);
  const planRepo = dataSource.getRepository(Plan);
  const lessonRepo = dataSource.getRepository(Lesson);
  const mediaRepo = dataSource.getRepository(Media);
  const contentRepo = dataSource.getRepository(Content);
  const commentRepo = dataSource.getRepository(Comment);
  const subscriptionRepo = dataSource.getRepository(Subscription);

  console.log("Seeding database...");

  /* -------------------- 1. ROLES -------------------- */
  const roles = [
    "ADMIN",
    "TEACHER",
    "STUDENT",
    "EDITOR",
    "MODERATOR",
    "AUTHOR",
    "SUPPORT",
    "MANAGER",
    "ANALYST",
    "GUEST",
  ];

 const roleEntities: Role[] = [];

 for (const roleType of roles) {
   const role = await roleRepo.save(roleRepo.create({ roleType }));

   roleEntities.push(role);
 }

  /* -------------------- 2. USERS -------------------- */
  const users: User[] = [];

  for (let i = 0; i < 10; i++) {
    const user = await userRepo.save(
      userRepo.create({
        email: faker.internet.email(),
        password: "password123",
        role: faker.helpers.arrayElement(roleEntities),
      }),
    );

    users.push(user);
  }

  /* -------------------- 3. PROFILES -------------------- */
  for (const user of users) {
    await profileRepo.save(
      profileRepo.create({
        username: faker.internet.username(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        user,
      }),
    );
  }

  /* -------------------- 4. PLANS -------------------- */
  const plans: Plan[] = [];

  for (let i = 0; i < 10; i++) {
    const plan = await planRepo.save(
      planRepo.create({
        name: `Plan ${i + 1}`,
        amount: faker.number.int({ min: 10, max: 100 }),
        interval: faker.helpers.arrayElement(["MONTHLY", "YEARLY"]),
      }),
    );

    plans.push(plan);
  }

  /* -------------------- 5. LESSONS -------------------- */
  const lessons: Lesson[] = [];

  for (let i = 0; i < 20; i++) {
    const lesson = await lessonRepo.save(
      lessonRepo.create({
        title: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement([
          LessonStatus.DRAFT,
          LessonStatus.PUBLISHED,
          LessonStatus.ARCHIVED,
        ]),
        author: faker.helpers.arrayElement(users),
      }),
    );

    lessons.push(lesson);
  }

  /* Attach Plans ↔ Lessons (Many-to-Many) */
  for (const lesson of lessons) {
    lesson.plans = faker.helpers.arrayElements(plans, 2);
    await lessonRepo.save(lesson);
  }

  /* -------------------- 6. MEDIA -------------------- */
  const medias: Media[] = [];

  for (let i = 0; i < 30; i++) {
    const media = await mediaRepo.save(
      mediaRepo.create({
        mediaType: faker.helpers.arrayElement([
          MediaType.IMAGE,
          MediaType.VIDEO,
          MediaType.AUDIO,
          MediaType.PDF,
        ]),
        url: faker.image.url(),
      }),
    );

    medias.push(media);
  }

  /* -------------------- 7. CONTENT -------------------- */
  const contents: Content[] = [];

  for (let i = 0; i < 50; i++) {
    const content = await contentRepo.save(
      contentRepo.create({
        details: faker.lorem.paragraphs(2),
        lesson: faker.helpers.arrayElement(lessons),
        medias: faker.helpers.arrayElements(medias, 2),
      }),
    );

    contents.push(content);
  }

  /* -------------------- 8. COMMENTS -------------------- */
  for (let i = 0; i < 100; i++) {
    await commentRepo.save(
      commentRepo.create({
        comment: faker.lorem.sentence(),
        user: faker.helpers.arrayElement(users),
        content: faker.helpers.arrayElement(contents),
      }),
    );
  }

  /* -------------------- 9. SUBSCRIPTIONS -------------------- */
  for (let i = 0; i < 20; i++) {
    const startDate = faker.date.past();

    await subscriptionRepo.save(
      subscriptionRepo.create({
        user: faker.helpers.arrayElement(users),
        plan: faker.helpers.arrayElement(plans),
        startDate,
        endDate: faker.date.future({ refDate: startDate }),
        status: faker.helpers.arrayElement([
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.TRAILING,
          SubscriptionStatus.CANCELLED,
          SubscriptionStatus.UNPAID,
        ]),
      }),
    );
  }

  console.log("Seeding completed successfully.");
}
