import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Database";
import { PORT } from "./config";

const Startserver = async () => {
  const app =express()
  await dbConnection()
  await App(app);
  app.listen(PORT, () => {
    console.log(
      `Server is started on http://localhost:${PORT}`
    );
  })
}

Startserver();