import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "./Media";
import { Lesson } from "./Lesson";
import { Comment } from "./Comment";

@Entity("contents")
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  details: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.contents)
  @JoinColumn({ name: "lesson_id" })
  lesson: Lesson;

  @ManyToMany(() => Media, (media) => media.contents)
  @JoinTable({
    name: "content_media",
  })
  medias: Media[];

  @OneToMany(() => Comment, (comment) => comment.content)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}