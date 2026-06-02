// user.seed.ts

import  AppDataSource  from "../config/datasource";
import { User } from "../entities/User";
import { Profile } from "../entities/Profile";
import { Role } from "../entities/Role";

export async function seedUsers() {
  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(Profile);
  const roleRepo = AppDataSource.getRepository(Role);

  const roles = await roleRepo.find();

  for (let i = 1; i <= 20; i++) {
    const user:Partial<User> = userRepo.create({
      email: `user${i}@gmail.com`,
      password: "password123",
      role: roles[i % roles.length]!
    });

    await userRepo.save(user);

    const profile = profileRepo.create({
      username: `user${i}`,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      user,
    });

    await profileRepo.save(profile);
  }
}
