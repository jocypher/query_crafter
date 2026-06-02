// role.seed.ts

import AppDataSource  from "../config/datasource";
import { Role } from "../entities/Role";

export async function seedRoles() {
  const roleRepo = AppDataSource.getRepository(Role);

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

  for (const roleType of roles) {
    const role = roleRepo.create({ roleType });
    await roleRepo.save(role);
  }
}
