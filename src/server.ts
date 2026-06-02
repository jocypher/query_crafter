import express from "express";
import AppDataSource from "./db/config/datasource";
import { seedDatabase } from "./db/seeds/seed";
const app = express();

const PORT = 4000;

AppDataSource.initialize()
  .then(async () => {
    
    // try {
    //   await seedDatabase(AppDataSource);
    // } catch (err) {
    //   console.error("Seeding failed:", err); // 👈 this will reveal hidden errors
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
