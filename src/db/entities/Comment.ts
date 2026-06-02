import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Content } from "./Content";

@Entity("comments")
export class Comment{
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  comment: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Content, (content) => content.comments)
  @JoinColumn({ name: "content_id" })
  content: Content;

  @CreateDateColumn()
  createdAt: Date;
}
