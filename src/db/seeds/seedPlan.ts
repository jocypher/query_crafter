// plan.seed.ts

import AppDataSource from "../config/datasource";
import { Plan } from "../entities/SubscriptionPlan";

export async function seedPlans() {
  const planRepo = AppDataSource.getRepository(Plan);

  for (let i = 1; i <= 30; i++) {
    const plan = planRepo.create({
      name: `Plan ${i}`,
      amount: i * 10,
      interval: i % 2 ? "MONTHLY" : "YEARLY",
    });

    await planRepo.save(plan);
  }
}
