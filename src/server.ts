import express from "express";
import AppDataSource from "./db/config/datasource";
import { seedDatabase } from "./db/seeds/seed";
import morgan from "morgan"
import { Request, Response } from "express";
import helmet from "helmet";
import appRouter from "./routes";
const app = express();

const PORT = 4000;


app.use(morgan("dev"))
app.use(helmet())
app.use(appRouter);

app.get("/", (req:Request, res:Response)=>{
  res.json("Yes working")
})
AppDataSource.initialize()
  .then(async () => {
    
    // try {
    //   await seedDatabase(AppDataSource);
    // } catch (err) {
    //   console.error("Seeding failed:", err); errors
    //   await AppDataSource.destroy();
    //   process.exit(1);
    // }

    // await AppDataSource.destroy();

    console.log("Database initialized");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    

  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
