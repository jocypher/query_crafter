// lesson.seed.ts

import  AppDataSource  from "../config/datasource";
import { Lesson } from "../entities/Lesson";
import { User } from "../entities/User";

export async function seedLessons() {
  const lessonRepo = AppDataSource.getRepository(Lesson);
  const userRepo = AppDataSource.getRepository(User);

  const users = await userRepo.find();

  for (let i = 1; i <= 100; i++) {
    const lesson = lessonRepo.create({
      title: `Lesson ${i}`,
      description: `Description for lesson ${i}`,
      author: users[i % users.length]!,
    });

    await lessonRepo.save(lesson);
  }
}
