import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Content } from "./Content"
import { MediaType } from "../../core/enum/mediaType";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: MediaType,
  })
  mediaType: MediaType;

  @Column()
  url: string;

  @ManyToMany(() => Content, (content) => content.medias)
  contents: Content[];

  @CreateDateColumn()
  createdAt: Date;
}