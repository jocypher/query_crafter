import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lesson } from "./Lesson";
import { Subscription } from "./Subscription";

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "double precision",
  })
  amount: number;

  @Column()
  interval: string;

  @ManyToMany(() => Lesson, (lesson) => lesson.plans)
  @JoinTable({
    name: "plan_lessons",
    joinColumn: {
      name: "plan_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "lesson_id",
      referencedColumnName: "id",
    },
  })
  lessons: Lesson[];

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}