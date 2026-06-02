import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Plan } from "./SubscriptionPlan"
import { Content } from "./Content"
import { User } from "./User";
import { LessonStatus } from "../../core/enum/lessonStatus";


@Entity("lessons")
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({
    type: "enum",
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  status: LessonStatus;

  @ManyToOne(() => User, (user) => user.lessons)
  @JoinColumn({ name: "author_id" })
  author: User;

  @OneToMany(() => Content, (content) => content.lesson)
  contents: Content[];

  @ManyToMany(() => Plan, (plan) => plan.lessons)
  plans: Plan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}