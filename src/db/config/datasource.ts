import { DataSource } from "typeorm";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Profile } from "../entities/Profile";
import { Plan } from "../entities/SubscriptionPlan";
import { Lesson } from "../entities/Lesson";
import { Content } from "../entities/Content";
import { Media } from "../entities/Media";
import { Subscription } from "../entities/Subscription";
import { Comment } from "../entities/Comment";

const dataSource = new DataSource({
  host: "localhost",
  database: "query_craft",
  username: "crafter",
  password: "crafter",
  type: "postgres",
  ssl: false,
  logging: true,
  synchronize: true,
  entities: [
    Role, 
    User,
    Profile,
    Plan,
    Lesson,
    Media,
    Content,
    Comment,
    Subscription,
  ],
});



export default dataSource